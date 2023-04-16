import { NestedStack, RemovalPolicy } from "aws-cdk-lib";
import {
  AttributeType,
  ProjectionType,
  BillingMode,
  Table,
} from "aws-cdk-lib/aws-dynamodb";
import {
  AwsCustomResource,
  AwsCustomResourcePolicy,
  PhysicalResourceId,
} from "aws-cdk-lib/custom-resources";

class DDBStack extends NestedStack {
  constructor(scope, id, props) {
    super(scope, id, props);

    const ddb = new Table(this, "ProjectLZ2", {
      partitionKey: {
        name: "PK",
        type: AttributeType.STRING,
      },
      sortKey: {
        name: "SK",
        type: AttributeType.STRING,
      },
      billingMode: BillingMode.PAY_PER_REQUEST,
      removalPolicy: RemovalPolicy.DESTROY,
    });

    ddb.addGlobalSecondaryIndex({
      indexName: "GSI1",
      partitionKey: { name: "GSI1-PK", type: AttributeType.STRING },
      sortKey: { name: "GSI1-SK", type: AttributeType.STRING },
      billingMode: BillingMode.PAY_PER_REQUEST,
      projectionType: ProjectionType.ALL,
    });

    ddb.addGlobalSecondaryIndex({
      indexName: "GSI2",
      partitionKey: { name: "GSI2-PK", type: AttributeType.STRING },
      sortKey: { name: "GSI2-SK", type: AttributeType.STRING },
      billingMode: BillingMode.PAY_PER_REQUEST,
      projectionType: ProjectionType.ALL,
    });

    new AwsCustomResource(this, "SeedRoleDeveloper", {
      onCreate: {
        service: "DynamoDB",
        action: "putItem",
        parameters: {
          TableName: ddb.tableName,
          Item: {
            PK: { S: "r#1" },
            SK: { S: "r#1" },
            slug: { S: "developer" },
            name: { S: "Desenvolvedor" },
            entity: { S: "clientRole" },
            description: { S: "Descrição do Desenvolvedor" },
          },
        },
        physicalResourceId: "initRoleSeed",
      },
      policy: AwsCustomResourcePolicy.fromSdkCalls({
        resources: AwsCustomResourcePolicy.ANY_RESOURCE,
      }),
    });

    new AwsCustomResource(this, "SeedRoleInvestor", {
      onCreate: {
        service: "DynamoDB",
        action: "putItem",
        parameters: {
          TableName: ddb.tableName,
          Item: {
            PK: { S: "r#2" },
            SK: { S: "r#2" },
            slug: { S: "investor" },
            name: { S: "Investidor" },
            entity: { S: "clientRole" },
            description: { S: "Descrição do investidor" },
          },
        },
        physicalResourceId: "initRoleSeed",
      },
      policy: AwsCustomResourcePolicy.fromSdkCalls({
        resources: AwsCustomResourcePolicy.ANY_RESOURCE,
      }),
    });

    return ddb;
  }
}

export default DDBStack;
