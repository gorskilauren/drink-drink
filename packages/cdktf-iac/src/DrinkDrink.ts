import { S3Backend, TerraformStack } from "cdktf";
import { Construct } from "constructs";
import { AwsProvider } from "@cdktf/provider-aws/lib/provider";
import { createLambda } from "./utils/create-lambda";

export class DrinkDrink extends TerraformStack {
  public readonly provider: AwsProvider;
  constructor(scope: Construct, id: string) {
    super(scope, id);

    this.provider = new AwsProvider(this, `${id}-aws-provider`, {
      profile: process.env.AWS_ACCOUNT_ID,
      region: "us-west-2",
    });
    new S3Backend(this, {
      bucket: `${process.env.BACKEND_S3_BUCKET}`,
      key: id,
      region: "us-west-2",
      encrypt: true,
      profile: process.env.AWS_ACCOUNT_ID,
    });

    createLambda(this, id);
  }
}
