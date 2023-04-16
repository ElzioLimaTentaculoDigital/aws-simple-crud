import { NestedStack } from "aws-cdk-lib";
import {
  StepFunctionsRestApi,
} from "aws-cdk-lib/aws-apigateway";
import ProductApiStack from "./modules/productApiStack.js";

class ApiRootStack extends NestedStack {
  constructor(scope, id, props) {
    super(scope, id, props);

    const { stepFunction } = props;

    const api = new StepFunctionsRestApi(this, "ProjectLZRestAPI", {
      stateMachine: stepFunction.definitions.notImplemented,
    });
    api.root.addCorsPreflight({
      allowOrigins: ["*"],
    });

    new ProductApiStack(this, "ProductAPIStack", {
      stepFunction,
      api,
    });
  }
}

export default ApiRootStack;
