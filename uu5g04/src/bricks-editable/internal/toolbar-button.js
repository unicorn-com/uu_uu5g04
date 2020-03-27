import * as UU5 from "uu5g04";
import "uu5g04-bricks";

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

function getProps(props, language) {
  let propsToPass = { ...props };

  if (language && propsToPass.tooltip) {
    propsToPass.tooltip = UU5.Common.Tools.getLsiValueByLanguage(propsToPass.tooltip, language);
  }

  propsToPass.className += (propsToPass.className ? " " : "") + classNames.main();

  if (!propsToPass.content && propsToPass.icon) {
    propsToPass.content = <UU5.Bricks.Icon icon={propsToPass.icon} />;
  }
  delete propsToPass.icon;

  return propsToPass;
}

export const ToolbarButton = UU5.Common.Reference.forward((props, ref) => {
  if (props.tooltip && typeof props.tooltip === "object") {
    return (
      <UU5.Bricks.Lsi>
        {({ language }) => (
          <UU5.Bricks.Button {...getProps(props, language)} ref={ref} />
        )}
      </UU5.Bricks.Lsi>
    );
  } else {
    return (
      <UU5.Bricks.Button {...getProps(props)} ref={ref} />
    );
  }
});

ToolbarButton.displayName = ns.name("ToolbarButton");
ToolbarButton.tagName = ns.name("ToolbarButton");
ToolbarButton.propTypes = {
  icon: UU5.PropTypes.string,
  content: UU5.PropTypes.any, //TODO: specify
  colorSchema: UU5.PropTypes.string,
  bgStyle: UU5.PropTypes.oneOf(["filled", "outline", "transparent", "underline", "link"]),
  baseline: UU5.PropTypes.bool,
  onClick: UU5.PropTypes.func,
  pressed: UU5.PropTypes.bool,
  tooltip: UU5.PropTypes.oneOfType([UU5.PropTypes.object, UU5.PropTypes.string])
};
ToolbarButton.defaultProps = {
  icon: undefined,
  content: undefined,
  colorSchema: undefined,
  bgStyle: undefined,
  baseline: true,
  onClick: undefined,
  pressed: false,
  tooltip: undefined
};
ToolbarButton.isStateless = true;

export default ToolbarButton;
