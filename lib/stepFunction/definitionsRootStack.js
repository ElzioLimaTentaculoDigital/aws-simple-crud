import { NestedStack } from "aws-cdk-lib";
import NotImplementedStack from "./utils/notImplementedStack.js";
import CreateProduct from "./product/create.js";
import ListProduct from "./product/list.js";
import GetProduct from "./product/get.js";
import UpdateProduct from "./product/update.js";
import DeleteProduct from "./product/delete.js";

class DefinitionsRootStack extends NestedStack {
  constructor(scope, id, props) {
    super(scope, id, props);
    const { states, ddb } = props;

    return {
      notImplemented: new NotImplementedStack(this, "NotImplementedErrorStack"),
      product: {
        create: new CreateProduct(this, "CreateProduct", { ddb }),
        list: new ListProduct(this, "ListProduct", { ddb }),
        get: new GetProduct(this, "GetProduct", { ddb }),
        update: new UpdateProduct(this, "UpdateProduct", { ddb }),
        delete: new DeleteProduct(this, "DeleteProduct", { ddb }),
      }
    };
  }
}

export default DefinitionsRootStack;
