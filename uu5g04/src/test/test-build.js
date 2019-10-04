import UU5 from "uu5g04";
import * as Test from "./test.js";

export * from "./test.js";
export default Test;

// merge into UU5
// NOTE "uu5g04" must ensure that the key already exists there, otherwise following usage wouldn't work:
//   import * as UU5 from "uu5g04";
//   import "uu5g04-test";
//   console.log(UU5.Test.TextArea);
for (var k in Test) UU5.Test[k] = Test[k];
