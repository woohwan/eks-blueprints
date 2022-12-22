import * as blueprints from "@aws-quickstart/eks-blueprints";
import { ServiceAccount } from "aws-cdk-lib/aws-eks";
import { ManagedPolicy } from "aws-cdk-lib/aws-iam";
import { Construct } from "constructs";

export interface MyFluentBitAddOnProps
  extends blueprints.addons.HelmAddOnUserProps {
  /**
   * Cloudwatch region where logs are forwarded
   */
  cloudWatchRegion: string;
}

export const defaultProps: blueprints.addons.HelmAddOnProps &
  MyFluentBitAddOnProps = {
  chart: "aws-for-fluent-bit",
  cloudWatchRegion: "ap-northeast-2",
  name: "my-fluentbit-addon",
  namespace: "kube-system",
  release: "blueprints-addon-extension-fluent-bit",
  version: "0.1.21",
  repository: "https://aws.github.io/eks-charts",
  values: {},
};

export class MyFluentBitAddOn extends blueprints.addons.HelmAddOn {
  readonly options: MyFluentBitAddOnProps;

  constructor(props: MyFluentBitAddOnProps) {
    super({ ...defaultProps, ...props });
    this.options = this.props as MyFluentBitAddOnProps;
  }

  deploy(clusterInfo: blueprints.ClusterInfo): Promise<Construct> {
    const ns = blueprints.utils.createNamespace(
      this.props.namespace!,
      clusterInfo.cluster,
      true
    );

    const serviceAccountName = "aws-for-fluent-bit-sa";
    const sa = clusterInfo.cluster.addServiceAccount("aws-for-fluent-bit-sa", {
      name: serviceAccountName,
      namespace: this.props.namespace,
    });

    sa.node.addDependency(ns); // signal provisioning to wait for namespace creation to complete
    // before the service account creation is attempted (otherwise can fire in parallel)

    // Cloud Map Full Access policy.
    const cloudWatchAgentPolicy = ManagedPolicy.fromAwsManagedPolicyName(
      "CloudWatchAgentServerPolicy"
    );
    sa.role.addManagedPolicy(cloudWatchAgentPolicy);

    const values: blueprints.Values = {
      serviceAccount: {
        create: false,
        name: serviceAccountName,
      },
      cloudWatch: {
        region: this.options.cloudWatchRegion,
      },
    };

    const chart = this.addHelmChart(clusterInfo, values);
    chart.node.addDependency(sa);

    return Promise.resolve(chart); // returning this promise will enable other add-ons to declare dependency on this addon.
  }
}
