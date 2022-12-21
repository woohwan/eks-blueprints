import * as cdk from "aws-cdk-lib";
import { SecretValue } from "aws-cdk-lib";
import { IVpc } from "aws-cdk-lib/aws-ec2";
import * as iam from "aws-cdk-lib/aws-iam";
import {
  Domain,
  EngineVersion,
  DomainProps,
} from "aws-cdk-lib/aws-opensearchservice";
import { Construct } from "constructs";

export class SearchStack extends cdk.Stack {
  constructor(scope: Construct, id: string) {
    super(scope, id);

    const domainProps: DomainProps = {
      version: EngineVersion.OPENSEARCH_1_3,
      domainName: "search-test",
      nodeToNodeEncryption: true,
      encryptionAtRest: {
        enabled: true,
      },
      // Delete Domain when ckd destroy
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      accessPolicies: [
        new iam.PolicyStatement({
          principals: [new iam.AnyPrincipal()],
          actions: ["es:*"],
          resources: ["*"],
          effect: iam.Effect.ALLOW,
          // conditions: {
          //   IPAddress: {
          //     "aws:SourceIp": ["121.140.122.206/32"],
          //   },
          // },
        }),
      ],
      useUnsignedBasicAuth: true,
      fineGrainedAccessControl: {
        masterUserName: "whpark",
        masterUserPassword: SecretValue.unsafePlainText("Open*0906*"),
      },
    };

    const devDomain = new Domain(this, "Domain", domainProps);

    new cdk.CfnOutput(this, "DomainEndPoint", {
      value: devDomain.domainEndpoint,
      exportName: "search-test-domain-endpoint",
    });
    new cdk.CfnOutput(this, "DomainArn", {
      value: devDomain.domainArn,
      exportName: "search-test-domain-arn",
    });
  }
}
