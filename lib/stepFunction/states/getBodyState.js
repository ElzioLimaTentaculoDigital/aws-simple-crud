import { Pass } from "aws-cdk-lib/aws-stepfunctions"

const getBodyState = (scope) => {
    return new Pass(scope, "GetBodyState", {
        inputPath: "$.body",
        outputPath: "$"
    })
}

export default getBodyState;