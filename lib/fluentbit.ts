import * as blueprints from "@aws-quickstart/eks-blueprints";
import * as iam from "aws-cdk-lib/aws-iam";

const domainWritePolicy = new iam.PolicyStatement({
  actions: ["es:ESHttp*"],
  resources: ["arn:aws:es:ap-northeast-2:532805286864:domain/search-test"],
  effect: iam.Effect.ALLOW,
});

const FluentBit = new blueprints.addons.AwsForFluentBitAddOn({
  version: "0.1.21",
  namespace: "logging",
  iamPolicies: [domainWritePolicy],
  values: {
    elasticSearch: {
      enabled: true,
      awsRegion: "ap-northeast-2",
      host: "https://search-search-test-ksnv2bglbhymqg5pe6zwierdxa.ap-northeast-2.es.amazonaws.com",
    },
  },
});

export default FluentBit;
