import {
  LambdaIntegration,
  StepFunctionsIntegration,
} from "aws-cdk-lib/aws-apigateway";

const createResource = (parent, path, methods) => {
  const resource = parent.addResource(path);

  resource.addCorsPreflight({
    allowOrigins: ["*"],
    allowMethods: [methods],
  });

  return resource;
};

const createSafeStepMethod = (resource, method, stateMachine) =>
  resource.addMethod(
    method,
    StepFunctionsIntegration.startExecution(stateMachine, {
      ...getStepFunctionDefaultProperties(),
    }),
    { ...getApiMethodDefaultProperties() }
  );

const createSafeLambdaMethod = (resource, method, lambda) =>
  resource.addMethod(
    method,
    new LambdaIntegration(lambda, {
      ...getStepFunctionDefaultProperties(),
    }),
    { ...getApiMethodDefaultProperties() }
  );

const getStepFunctionDefaultProperties = () => ({
  integrationResponses: [
    {
      statusCode: "200",
      responseParameters: {
        "method.response.header.Access-Control-Allow-Origin": "'*'",
      },
    },
  ],
});

const getApiMethodDefaultProperties = () => ({
  methodResponses: [
    {
      statusCode: "200",
      responseParameters: {
        "method.response.header.Access-Control-Allow-Origin": true,
      },
    },
  ],
});

export {
  createResource,
  createSafeStepMethod,
  createSafeLambdaMethod,
  getStepFunctionDefaultProperties,
  getApiMethodDefaultProperties,
};
