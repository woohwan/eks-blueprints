import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";

export default class FluentBit extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id);

    const domain = props?.stackName;
  }
}
