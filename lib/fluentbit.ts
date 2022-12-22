import * as blueprints from "@aws-quickstart/eks-blueprints";
import { AwsForFluentBitAddOnProps } from "@aws-quickstart/eks-blueprints";
import * as iam from "aws-cdk-lib/aws-iam";

const domainWritePolicy = new iam.PolicyStatement({
  actions: ["es:ESHttp*"],
  resources: ["arn:aws:es:ap-northeast-2:532805286864:domain/search-test"],
  effect: iam.Effect.ALLOW,
});

const props: AwsForFluentBitAddOnProps = {
  //  must use the latest stable version
  version: "0.1.21",
  namespace: "logging",
  iamPolicies: [domainWritePolicy],
  values: {
    cloudWatch: {
      enabled: false,
      region: "ap-northeast-2",
      logGroupName: "/aws/eks/fluentbit-cloudwatch/logs",
    },
    firehose: {
      enabled: false,
    },
    kinesis: {
      enabled: false,
    },
    elasticsearch: {
      enabled: true,
      awsRegion: "ap-northeast-2",
      host: "search-search-test-ksnv2bglbhymqg5pe6zwierdxa.ap-northeast-2.es.amazonaws.com",
    },
  },
};

const FluentBit = new blueprints.addons.AwsForFluentBitAddOn(props);

export default FluentBit;
