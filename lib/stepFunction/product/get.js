import { NestedStack } from "aws-cdk-lib";
import {
  Chain,
  JsonPath,
  Pass,
  StateMachine,
  StateMachineType,
} from "aws-cdk-lib/aws-stepfunctions";
import {
  CallAwsService,
  DynamoAttributeValue,
  DynamoGetItem,
} from "aws-cdk-lib/aws-stepfunctions-tasks";

class GetProduct extends NestedStack {
  constructor(scope, id, props) {
    super(scope, id, props);

    const getProductState = new DynamoGetItem(this, "ddbGetProduct", {
      table: props.ddb,
      key: {
        PK: DynamoAttributeValue.fromString(
          JsonPath.format("d#{}", JsonPath.stringAt("$.path.id"))
        ),
        SK: DynamoAttributeValue.fromString(
          JsonPath.format("d#{}", JsonPath.stringAt("$.path.id"))
        ),
      },
      resultSelector: {
        id: JsonPath.arrayGetItem(
          JsonPath.stringSplit(JsonPath.stringAt("$.Item.PK.S"), "#"),
          1
        ),
        name: JsonPath.stringAt("$.Item.name.S"),
        status: JsonPath.stringAt("$.Item.status.S"),
      },
      resultPath: "$",
    });

    const definition = Chain.start(getProductState);

    return new StateMachine(this, "getProductMachine", {
      definition,
      stateMachineType: StateMachineType.EXPRESS,
    });
  }
}

export default GetProduct;
