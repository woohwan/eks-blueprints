// lib/eks-blueprints-stack.ts
import "source-map-support/register";
import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as blueprints from "@aws-quickstart/eks-blueprints";
import FluentBit from "./fluentbit";
import { DeploymentMode } from "@aws-quickstart/eks-blueprints";

export default class ClusterConstruct extends Construct {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id);

    const account = props?.env?.account!;
    const region = props?.env?.region!;
    const addOns: Array<blueprints.ClusterAddOn> = [
      FluentBit,
      new blueprints.addons.CertManagerAddOn({
        installCRDs: true,
        createNamespace: true,
      }),
      new blueprints.addons.AdotCollectorAddOn(),
      new blueprints.addons.MetricsServerAddOn(),
      new blueprints.addons.PrometheusNodeExporterAddOn({
        version: "4.8.1",
      }),
      new blueprints.addons.KubeStateMetricsAddOn(),
      new blueprints.addons.AmpAddOn({
        prometheusRemoteWriteURL:
          "https://aps-workspaces.ap-northeast-1.amazonaws.com/workspaces/ws-5f64c7a9-ef1d-41d0-9229-f7adbd8fff6c/api/v1/remote_write",
        deploymentMode: DeploymentMode.DEPLOYMENT,
        namespace: "default",
        name: "adot-collector-amp",
      }),
    ];

    const blueprint = blueprints.EksBlueprint.builder()
      .account(account)
      .region(region)
      .addOns(...addOns)
      .teams()
      .build(scope, id + "-stack");
  }
}
