import { NestedStack } from "aws-cdk-lib";
import DefinitionsRootStack from "./definitionsRootStack.js";
import StatesRootStack from "./statesRootStack.js";

class StepFunctionRootStack extends NestedStack {
    constructor(scope, id, props) {
        super(scope,id, props);
        const { ddb } = props;

        const states = new StatesRootStack(this, "StatesRootStack")
        const definitions = new DefinitionsRootStack(this, "DefinitionsRootStack", { ddb, states })

        return {
            states,
            definitions
        }
    }
}

export default StepFunctionRootStack;