import * as UU5 from "uu5g04";
import "uu5g04-bricks";

import ns from "../bricks-editable-ns.js";
import Css from "./css.js";

const classNames = {
  main: () =>
    ns.css("toolbar-dropdown") +
    " " +
    Css.css(`
    &:hover {
      background: #EEEEEE;
    }

    cursor: pointer;
    background: transparent;
    width: auto;

    .uu5-bricks-button {
      width: 100%;
    }

    + .uu5-bricks-popover {
      a {
        padding: 5px 32px 6px 8px;
      }
    }
  `)
};

const getItems = props => {
  return Array.isArray(props.items)
    ? props.items.map((item, index) => {
      return (
        <UU5.Bricks.Dropdown.Item
          // eslint-disable-next-line react/jsx-no-bind
          onClick={() => props.onClick(item.value)}
          label={item.content || item.value}
          key={index}
        />
      );
    })
    : null;
};

function getProps(props, language) {
  let propsToPass = { ...props };

  if (language && propsToPass.tooltip) {
    propsToPass.tooltip = UU5.Common.Tools.getLsiValueByLanguage(propsToPass.tooltip, language);
  }

  propsToPass.className += (propsToPass.className ? " " : "") + classNames.main();
  delete propsToPass.items;
  delete propsToPass.onClick;

  return propsToPass;
}

export const ToolbarDropdown = UU5.Common.Reference.forward((props, ref) => {
  if (props.tooltip && typeof props.tooltip === "object") {
    return (
      <UU5.Bricks.Lsi>
        {({ language }) => (
          <UU5.Bricks.Dropdown {...getProps(props, language)} ref={ref}>
            {getItems(props)}
          </UU5.Bricks.Dropdown>
        )}
      </UU5.Bricks.Lsi>
    );
  } else {
    return (
      <UU5.Bricks.Dropdown {...getProps(props)} ref={ref}>
        {getItems(props)}
      </UU5.Bricks.Dropdown>
    );
  }
});

ToolbarDropdown.displayName = ns.name("ToolbarDropdown");
ToolbarDropdown.tagName = ns.name("ToolbarDropdown");
ToolbarDropdown.propTypes = {
  value: UU5.PropTypes.string,
  items: UU5.PropTypes.arrayOf(
    UU5.PropTypes.oneOfType([
      UU5.PropTypes.shape({
        type: UU5.PropTypes.oneOfType([UU5.PropTypes.oneOf(["button", "dropdown"]), UU5.PropTypes.func]),
        props: UU5.PropTypes.object
      }),
      UU5.PropTypes.element
    ])
  ),
  colorSchema: UU5.PropTypes.string,
  bgStyle: UU5.PropTypes.oneOf(["filled", "outline", "transparent", "underline"]),
  onClick: UU5.PropTypes.func,
  tooltip: UU5.PropTypes.oneOfType([UU5.PropTypes.object, UU5.PropTypes.string])
};
ToolbarDropdown.defaultProps = {
  items: undefined,
  colorSchema: undefined,
  bgStyle: undefined,
  onClick: undefined
};
ToolbarDropdown.isStateless = true;

export default ToolbarDropdown;
