import { NestedStack } from "aws-cdk-lib";
import { Fail, StateMachine, StateMachineType } from "aws-cdk-lib/aws-stepfunctions"

class NotImplementedStack extends NestedStack {
    constructor(scope, id, props) {
        super(scope, id, props);

        const notImplementedFail = new Fail(scope, "NotImplementedFail", {
            error: "Not Implemented"
        });

        return new StateMachine(scope, "NotImplementedStateMachine", {
            definition: notImplementedFail,
            stateMachineType: StateMachineType.EXPRESS,
        });
    }
}

export default NotImplementedStack;