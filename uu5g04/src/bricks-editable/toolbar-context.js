import React from "react";
import UU5 from "uu5g04";

export const ToolbarContext = UU5.Common.Context.create();

export const withContext = Component => {
  // disable context for jest tests - enzyme doesn't support React 16.3 Context API
  if (!React.createContext || process.env.NODE_ENV === "test") return Component;
  let forwardRef = React.forwardRef((props, ref) => {
    return (
      <ToolbarContext.Consumer>
        {({ open, close }) => {
          return <Component {...props} ref={ref} open={open} close={close} />;
        }}
      </ToolbarContext.Consumer>
    );
  });

  forwardRef.isUu5PureComponent = true;
  forwardRef.displayName = `forwardRef(${Component.displayName || Component.name || "Component"})`;
  forwardRef.tagName = Component.tagName;

  return forwardRef;
};

export default ToolbarContext;
