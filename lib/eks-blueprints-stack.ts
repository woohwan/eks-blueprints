// lib/eks-blueprints-stack.ts
import "source-map-support/register";
import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as blueprints from "@aws-quickstart/eks-blueprints";
import { MyFluentBitAddOn } from "./fluentbit";

export default class ClusterConstruct extends Construct {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id);

    const account = props?.env?.account!;
    const region = props?.env?.region!;

    const blueprint = blueprints.EksBlueprint.builder()
      .account(account)
      .region(region)
      .addOns(new blueprints.addons.SSMAgentAddOn()) // needed for AWS internal accounts only
      .addOns(new blueprints.SecretsStoreAddOn()) // requires to support CSI Secrets
      .addOns(
        new MyFluentBitAddOn({
          cloudWatchRegion: "ap-norteast-2",
          //licenseKeySecret: 'my-addon-license', // if you set it, make sure there is a secret named my-addon-license-key in the target region
          namespace: "logging",
        })
      )
      .teams()
      .build(scope, id + "-stack");
  }
}
