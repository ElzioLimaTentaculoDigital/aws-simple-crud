import { Stack, RemovalPolicy } from "aws-cdk-lib";
import { Bucket } from "aws-cdk-lib/aws-s3";
import ApiRootStack from "./apiGateway/apiRootStack.js";
import DDBStack from "./dynamoDB/ddbStack.js";
import StepFunctionRootStack from "./stepFunction/stepFunctionRootStack.js";

class RootStack extends Stack {
  constructor(scope, id, props) {
    super(scope, id, props);

    const ddb = new DDBStack(this, "DDBStack");
    const stepFunction = new StepFunctionRootStack(
      this,
      "StepFunctionRootStack",
      { ddb }
    );
    const api = new ApiRootStack(this, "APIRootStack", {
      stepFunction,
      ddb
    });
  }
}

export default RootStack;
