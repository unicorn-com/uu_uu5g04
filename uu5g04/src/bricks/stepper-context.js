import UU5 from "uu5g04";

export const Context = UU5.Common.Context.create();

export const withStepperContext = Component => {
  if (!UU5.Common.Context.isSupported()) return Component;
  let forwardRef = UU5.Common.Reference.forward((props, ref) => {
    return <Context.Consumer>{context => <Component {...context} {...props} ref={ref} />}</Context.Consumer>;
  });

  forwardRef.isUu5PureComponent = true;
  forwardRef.displayName = `forwardRef(${Component.displayName || Component.name || "Component"})`;
  forwardRef.tagName = Component.tagName;

  return forwardRef;
};

export default Context;
