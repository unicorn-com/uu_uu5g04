import { createVisualComponent } from "uu5g05";

function g04CreateVisualComponent(component, isRef) {
  return createVisualComponent(component, isRef, {
    skipColorSchemaCheck: true,
    skipNestingLevelDeprecationCheck: true,
  });
}

export { g04CreateVisualComponent as createVisualComponent };
export default g04CreateVisualComponent;
