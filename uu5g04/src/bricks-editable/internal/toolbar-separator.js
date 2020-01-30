import UU5 from "uu5g04";
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

export const ToolbarSeparator = UU5.Common.Reference.forward((props, ref) => {
  return <span {...getProps(props)} ref={ref} />;
});

ToolbarSeparator.displayName = ns.name("ToolbarSeparator");
ToolbarSeparator.tagName = ns.name("ToolbarSeparator");
ToolbarSeparator.isStateless = true;

export default ToolbarSeparator;
