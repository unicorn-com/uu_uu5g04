import React from "react";
import PropTypes from "prop-types";
import * as UU5 from "uu5g04";

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
            onClick={() => props.onApply(item.value)}
            label={item.content}
            key={index}
          />
        );
      })
    : null;
};

const getProps = props => {
  let propsToPass = { ...props };

  propsToPass.className += (propsToPass.className ? " " : "") + classNames.main();
  delete propsToPass.items;
  delete propsToPass.onApply;

  return propsToPass;
};

export const ToolbarDropdown = React.forwardRef((props, ref) => {
  return (
    <UU5.Bricks.Dropdown {...getProps(props)} ref={ref}>
      {getItems(props)}
    </UU5.Bricks.Dropdown>
  );
});

ToolbarDropdown.displayName = ns.name("ToolbarDropdown");
ToolbarDropdown.tagName = ns.name("ToolbarDropdown");
ToolbarDropdown.propTypes = {
  value: PropTypes.string,
  items: PropTypes.arrayOf(
    PropTypes.oneOfType([
      PropTypes.shape({
        type: PropTypes.oneOfType([PropTypes.oneOf(["button", "dropdown"]), PropTypes.func]),
        props: PropTypes.object
      }),
      PropTypes.element
    ])
  ),
  colorSchema: PropTypes.string,
  bgStyle: PropTypes.oneOf(["filled", "outline", "transparent", "underline"]),
  onApply: PropTypes.func
};
ToolbarDropdown.defaultProps = {
  value: undefined,
  items: undefined,
  colorSchema: undefined,
  bgStyle: undefined,
  onApply: undefined
};
ToolbarDropdown.isStateless = true;

export default ToolbarDropdown;
