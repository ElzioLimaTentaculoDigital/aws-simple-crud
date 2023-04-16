import { NestedStack } from "aws-cdk-lib";
import {
  StepFunctionsIntegration,
} from "aws-cdk-lib/aws-apigateway";
import { 
  getApiMethodDefaultProperties, 
  getStepFunctionDefaultProperties 
} from "../../utils/apiGateway";

class ProductApiStack extends NestedStack {
  constructor(scope, id, props) {
    super(scope, id, props);
    const { api, stepFunction } = props;

    const productResource = api.root.addResource("product");
    const productIdResource = productResource.addResource("{id}");

    productResource.addCorsPreflight({
      allowOrigins: ["*"],
      allowMethods: ["GET, POST, OPTIONS"],
    });
    productIdResource.addCorsPreflight({
      allowOrigins: ["*"],
      allowMethods: ["DELETE, GET, PUT, OPTIONS"],
    });

    productResource.addMethod(
      "POST",
      StepFunctionsIntegration.startExecution(
        stepFunction.definitions.product.create,
        { ...getStepFunctionDefaultProperties() }
      ),
      { ...getApiMethodDefaultProperties() }
    );

    productResource.addMethod(
      "GET",
      StepFunctionsIntegration.startExecution(
        stepFunction.definitions.product.list,
        { ...getStepFunctionDefaultProperties() }
      ),
      { ...getApiMethodDefaultProperties() }
    );
    
    productIdResource.addMethod(
      "GET",
      StepFunctionsIntegration.startExecution(
        stepFunction.definitions.product.get,
        { ...getStepFunctionDefaultProperties() }
      ),
      { ...getApiMethodDefaultProperties() }
    );
    
    productIdResource.addMethod(
      "PUT",
      StepFunctionsIntegration.startExecution(
        stepFunction.definitions.product.update,
        { ...getStepFunctionDefaultProperties() }
      ),
      { ...getApiMethodDefaultProperties() }
    );
    
    productIdResource.addMethod(
      "DELETE",
      StepFunctionsIntegration.startExecution(
        stepFunction.definitions.product.delete,
        { ...getStepFunctionDefaultProperties() }
      ),
      { ...getApiMethodDefaultProperties() }
    );
  }
}

export default ProductApiStack;
