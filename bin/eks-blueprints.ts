// bin/my-eks-blueprints.ts
import * as cdk from "aws-cdk-lib";
import ClusterConstruct from "../lib/eks-blueprints-stack";
import FluentBit from "../lib/fluentbit";
import { SearchStack } from "../lib/search";

const app = new cdk.App();
const account = process.env.CDK_DEFAULT_ACCOUNT!;
const region = process.env.CDK_DEFAULT_REGION;
const env = { account, region };

new ClusterConstruct(app, "cluster", { env });
new SearchStack(app, "opensearch");
