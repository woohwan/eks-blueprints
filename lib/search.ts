import * as cdk from "aws-cdk-lib";
import { SecretValue } from "aws-cdk-lib";
import { Domain, EngineVersion } from "aws-cdk-lib/aws-opensearchservice";
import { Construct } from "constructs";

export class SearchStack extends cdk.Stack {
  constructor(scope: Construct, id: string) {
    super(scope, id);
    const devDomain = new Domain(this, "Domain", {
      version: EngineVersion.OPENSEARCH_1_3,
      domainName: "search-test",
      nodeToNodeEncryption: true,
      encryptionAtRest: {
        enabled: true,
      },
      useUnsignedBasicAuth: true,
      fineGrainedAccessControl: {
        masterUserName: "whpark",
        masterUserPassword: SecretValue.unsafePlainText("Open*0906*"),
      },
    });
  }
}
