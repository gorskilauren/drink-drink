import { DataAwsSubnet } from "@cdktf/provider-aws/lib/data-aws-subnet";
import { SecurityGroup } from "@cdktf/provider-aws/lib/security-group";
import { IamRole } from "@cdktf/provider-aws/lib/iam-role";
import { IamRolePolicyAttachment } from "@cdktf/provider-aws/lib/iam-role-policy-attachment";
import { LambdaFunction } from "@cdktf/provider-aws/lib/lambda-function";
import { DrinkDrink } from "../DrinkDrink";
import { LambdaFunctionUrl } from "@cdktf/provider-aws/lib/lambda-function-url";

export const createLambda = (stack: DrinkDrink, id: string) => {
  const drinkdrinkFunction = new LambdaFunction(stack, `${id}-lambda`, {
    provider: stack.provider,
    functionName: id,
    vpcConfig: {
      ipv6AllowedForDualStack: false,
      securityGroupIds: [createSecurityGroup(stack, id).id],
      subnetIds: [getPrivateSubnet(stack, id).id],
    },
    role: createLambdaRole(stack, id).arn,
    filename: `${__dirname}/../../../lambda/dist.zip`,
    runtime: "nodejs18.x",
    handler: "dist/lambda.handler",
    timeout: 60,
  });

  new LambdaFunctionUrl(stack, `${id}-lambda-url`, {
    authorizationType: "NONE",
    functionName: drinkdrinkFunction.functionName,
  });
};

const getPrivateSubnet = (stack: DrinkDrink, id: string) =>
  new DataAwsSubnet(stack, `${id}-private-subnet`, {
    vpcId: process.env.VPC_ID,
    tags: { Name: `${process.env.PRIVATE_S3_TAG}` },
  });

const createLambdaRole = (stack: DrinkDrink, id: string) => {
  const lambdaRolePolicy = {
    Version: "2012-10-17",
    Statement: [
      {
        Action: "sts:AssumeRole",
        Principal: {
          Service: "lambda.amazonaws.com",
        },
        Effect: "Allow",
        Sid: "",
      },
    ],
  };

  const iamRole = new IamRole(stack, `${id}-lambda-exec`, {
    name: `${id}-lambda-exec-role`,
    assumeRolePolicy: JSON.stringify(lambdaRolePolicy),
  });

  new IamRolePolicyAttachment(stack, `${id}-lambda-managed-policy`, {
    policyArn: "arn:aws:iam::aws:policy/AdministratorAccess",
    role: iamRole.name,
  });

  return iamRole;
};

const createSecurityGroup = (stack: DrinkDrink, id: string) => {
  return new SecurityGroup(stack, `${id}-sg`, {
    vpcId: process.env.VPC_ID,
    ingress: [
      {
        cidrBlocks: [`${process.env.LOCAL_IP}`],
        toPort: 443,
        fromPort: 443,
        protocol: "TCP",
      },
      {
        cidrBlocks: [`${process.env.LOCAL_IP}`],
        toPort: 80,
        fromPort: 80,
        protocol: "TCP",
      },
    ],
    egress: [
      {
        toPort: 0,
        fromPort: 0,
        protocol: "-1",
        cidrBlocks: ["0.0.0.0/0"],
      },
    ],
  });
};
