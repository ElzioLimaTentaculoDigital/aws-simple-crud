import { JsonPath, Pass } from "aws-cdk-lib/aws-stepfunctions"

const getUUIDState = (scope) => {
    return new Pass(scope, "GetUUIDState", {
        parameters: { uuid: JsonPath.uuid() },
        resultPath: "$.id"
    })
}

export default getUUIDState;