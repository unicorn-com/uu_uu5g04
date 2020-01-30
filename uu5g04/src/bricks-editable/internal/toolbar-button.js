import * as UU5 from "uu5g04";

import ns from "../bricks-editable-ns.js";
import Css from "./css.js";

const classNames = {
  main: () =>
    ns.css("toolbar-button") +
    " " +
    Css.css(`
    &.uu5-bricks-button {
      border: 1px solid transparent;
      width: 32px;
      height: 32px;

      &.active,
      &:active,
      &.active:hover,
      &:active:hover,
      &.active:focus,
      &:active:focus,
      &:hover {
        border-color: transparent;
      }
    }

    &:not(.active):not(:hover):not(:active):focus {
      background: transparent;
      border-color: #BDBDBD;
    }
  `)
};

const getProps = props => {
  let propsToPass = { ...props };

  propsToPass.className += (propsToPass.className ? " " : "") + classNames.main();

  if (!propsToPass.content && propsToPass.icon) {
    propsToPass.content = <UU5.Bricks.Icon icon={propsToPass.icon} />;
  }
  delete propsToPass.icon;

  if (propsToPass.onApply) {
    delete propsToPass.onApply;
    propsToPass.onClick = props.onApply;
  }

  return propsToPass;
};

export const ToolbarButton = UU5.Common.Reference.forward((props, ref) => {
  return <UU5.Bricks.Button {...getProps(props)} ref={ref} />;
});

ToolbarButton.displayName = ns.name("ToolbarButton");
ToolbarButton.tagName = ns.name("ToolbarButton");
ToolbarButton.propTypes = {
  icon: UU5.PropTypes.string,
  content: UU5.PropTypes.any, //TODO: specify
  colorSchema: UU5.PropTypes.string,
  bgStyle: UU5.PropTypes.oneOf(["filled", "outline", "transparent", "underline", "link"]),
  baseline: UU5.PropTypes.bool,
  onApply: UU5.PropTypes.func,
  pressed: UU5.PropTypes.bool
};
ToolbarButton.defaultProps = {
  icon: undefined,
  content: undefined,
  colorSchema: undefined,
  bgStyle: undefined,
  baseline: true,
  onApply: undefined,
  pressed: false
};
ToolbarButton.isStateless = true;

export default ToolbarButton;
