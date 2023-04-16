import { NestedStack } from "aws-cdk-lib";
import {
  Chain,
  JsonPath,
  StateMachine,
  StateMachineType,
} from "aws-cdk-lib/aws-stepfunctions";
import {
  DynamoAttributeValue,
  DynamoUpdateItem,
} from "aws-cdk-lib/aws-stepfunctions-tasks";

class UpdateProduct extends NestedStack {
  constructor(scope, id, props) {
    super(scope, id, props);

    const updateProductState = new DynamoUpdateItem(
      this,
      "ddbUpdateProductState",
      {
        table: props.ddb,
        key: {
          PK: DynamoAttributeValue.fromString(
            JsonPath.format("d#{}", JsonPath.stringAt("$.path.id"))
          ),
          SK: DynamoAttributeValue.fromString(
            JsonPath.format("d#{}", JsonPath.stringAt("$.path.id"))
          ),
        },
        updateExpression: "set #Name = :name, #Status = :status",
        expressionAttributeNames: {
          "#Name": "name",
          "#Status": "status",
        },
        expressionAttributeValues: {
          ":name": DynamoAttributeValue.fromString(
            JsonPath.stringAt("$.body.name")
          ),
          ":status": DynamoAttributeValue.fromString(
            JsonPath.stringAt("$.body.status")
          ),
        },
        resultPath: "$"
      }
    );

    const definition = Chain.start(updateProductState);

    return new StateMachine(this, "updateProductMachine", {
      definition,
      stateMachineType: StateMachineType.EXPRESS,
    });
  }
}

export default UpdateProduct;
