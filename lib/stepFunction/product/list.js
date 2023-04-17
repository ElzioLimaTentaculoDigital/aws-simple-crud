import { NestedStack } from "aws-cdk-lib";
import {
  Chain,
  JsonPath,
  Map,
  Pass,
  StateMachine,
  StateMachineType,
} from "aws-cdk-lib/aws-stepfunctions";
import { CallAwsService } from "aws-cdk-lib/aws-stepfunctions-tasks";

class ListProduct extends NestedStack {
  constructor(scope, id, props) {
    super(scope, id, props);

    const listProductState = new CallAwsService(this, "listProduct", {
      service: "dynamodb",
      action: "query",
      parameters: {
        TableName: props.ddb.tableName,
        IndexName: "GSI1",
        KeyConditionExpression: "#GSI1PK = :pk AND begins_with(#GSI1SK, :sk)",
        ExpressionAttributeValues: {
          ":pk": {
            S: "product",
          },
          ":sk": {
            S: "p#",
          },
        },
        ExpressionAttributeNames: {
          "#GSI1PK": "GSI1-PK",
          "#GSI1SK": "GSI1-SK",
          "#Name": "name",
          "#Status": "status",
        },
        ProjectionExpression: "PK, #Name, #Status",
      },
      resultPath: "$",
      iamResources: [props.ddb.tableArn, `${props.ddb.tableArn}/index/*`],
    });

    const formatterMap = new Map(this, "productFormatterMap", {
      maxConcurrency: 5,
      itemsPath: JsonPath.stringAt("$.Items"),
    });

    const formatState = new Pass(this, "productFormat", {
      parameters: {
        id: JsonPath.arrayGetItem(
          JsonPath.stringSplit(JsonPath.stringAt("$.PK.S"), "#"),
          1
        ),
        name: JsonPath.stringAt("$.name.S"),
        status: JsonPath.stringAt("$.status.S"),
      },
      resultPath: "$",
    });

    const definition = Chain.start(listProductState).next(
      formatterMap.iterator(formatState)
    );

    return new StateMachine(this, "listProductMachine", {
      definition,
      stateMachineType: StateMachineType.EXPRESS,
    });
  }
}

export default ListProduct;
