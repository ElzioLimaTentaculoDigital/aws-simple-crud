import { NestedStack } from "aws-cdk-lib";
import getBodyState from "./states/getBodyState.js";
import getUUIDState from "./states/getUUIDState.js";

class StatesRootStack extends NestedStack{
    constructor(scope, id, props) {
        super(scope, id, props)
        return {
            getBodyState: getBodyState(scope),
            getUUIDState: getUUIDState(scope)
        }
    }
}

export default StatesRootStack;