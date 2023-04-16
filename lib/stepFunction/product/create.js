import { NestedStack } from "aws-cdk-lib";
import {
  Chain,
  JsonPath,
  StateMachine,
  StateMachineType,
} from "aws-cdk-lib/aws-stepfunctions";
import { DynamoAttributeValue, DynamoPutItem } from "aws-cdk-lib/aws-stepfunctions-tasks";
import getUUIDState from "../states/getUUIDState.js";

class CreateProduct extends NestedStack {
  constructor(scope, id, props) {
    super(scope, id, props);

    const putProductState = new DynamoPutItem(
      this,
      "ddbCreateProductState",
      {
        table: props.ddb,
        item: {
          PK: DynamoAttributeValue.fromString(
            JsonPath.format("d#{}", JsonPath.stringAt("$.id.uuid"))
          ),
          SK: DynamoAttributeValue.fromString(
            JsonPath.format("d#{}", JsonPath.stringAt("$.id.uuid"))
          ),
          entity: DynamoAttributeValue.fromString("product"),
          name: DynamoAttributeValue.fromString(
            JsonPath.stringAt("$.body.name")
          ),
          status: DynamoAttributeValue.fromString("active"),
          createdAt: DynamoAttributeValue.fromString(Date.now().toString()),
          "GSI1-PK": DynamoAttributeValue.fromString("product"),
          "GSI1-SK": DynamoAttributeValue.fromString(
            JsonPath.format("d#{}", JsonPath.stringAt("$.id.uuid"))
          ),
        },
        resultPath: JsonPath.DISCARD,
      }
    );

    const definition = Chain.start(getUUIDState(this)).next(
      putProductState
    );

    return new StateMachine(this, "createProductMachine", {
      definition,
      stateMachineType: StateMachineType.EXPRESS,
    });
  }
}

export default CreateProduct;
