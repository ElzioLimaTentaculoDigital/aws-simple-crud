import { NestedStack } from "aws-cdk-lib";
import {
  Chain,
  JsonPath,
  StateMachine,
  StateMachineType,
} from "aws-cdk-lib/aws-stepfunctions";
import {
  DynamoAttributeValue,
  DynamoDeleteItem,
  DynamoUpdateItem,
} from "aws-cdk-lib/aws-stepfunctions-tasks";

class DeleteProduct extends NestedStack {
  constructor(scope, id, props) {
    super(scope, id, props);

    const deleteProductState = new DynamoDeleteItem(
      this,
      "ddbDeleteProductState",
      {
        table: props.ddb,
        key: {
          PK: DynamoAttributeValue.fromString(
            JsonPath.format("p#{}", JsonPath.stringAt("$.path.id"))
          ),
          SK: DynamoAttributeValue.fromString(
            JsonPath.format("p#{}", JsonPath.stringAt("$.path.id"))
          ),
        },
        resultPath: JsonPath.DISCARD
      }
    );

    const definition = Chain.start(deleteProductState);

    return new StateMachine(this, "DeleteProductMachine", {
      definition,
      stateMachineType: StateMachineType.EXPRESS,
    });
  }
}

export default DeleteProduct;
