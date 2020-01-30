import React from "react";
import ns from "../bricks-editable-ns.js";
import Css from "./css.js";

const classNames = {
  main: () =>
    ns.css("toolbar-separator") +
    " " +
    Css.css(`
    padding-right: 1px;
    background-color: #BDBDBD;
  `)
};

const getProps = props => {
  let propsToPass = { ...props };

  propsToPass.className += (propsToPass.className ? " " : "") + classNames.main();

  return propsToPass;
};

export const ToolbarSeparator = React.forwardRef((props, ref) => {
  return <span {...getProps(props)} ref={ref} />;
});

ToolbarSeparator.displayName = ns.name("ToolbarSeparator");
ToolbarSeparator.tagName = ns.name("ToolbarSeparator");
ToolbarSeparator.isStateless = true;

export default ToolbarSeparator;
