import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as iam from "aws-cdk-lib/aws-iam";
import * as blueprints from "@aws-quickstart/eks-blueprints";

const DomainEndpoint = cdk.Fn.importValue("search-test-domain-endpoint");
const DomainArn = cdk.Fn.importValue("search-test-domain-arn");

const domainWritePolicy = new iam.PolicyStatement({
  actions: [
    "es:ESHttpDelete",
    "es:ESHttpPost",
    "es:ESHttpPut",
    "es:ESHttpPatch",
  ],
  resources: [DomainArn.toString()],
});

const awsFluentBit = new blueprints.addons.AwsForFluentBitAddOn({
  iamPolicies: [domainWritePolicy],
  values: {
    elasticSearch: {
      enabled: true,
      awsRegion: "ap-northeast-2",
      host: DomainEndpoint.toString(),
    },
  },
});

export default awsFluentBit;
