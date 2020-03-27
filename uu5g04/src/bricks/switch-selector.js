/**
 * Copyright (C) 2019 Unicorn a.s.
 *
 * This program is free software; you can use it under the terms of the UAF Open License v01 or
 * any later version. The text of the license is available in the file LICENSE or at www.unicorn.com.
 *
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even
 * the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See LICENSE for more details.
 *
 * You may contact Unicorn a.s. at address: V Kapslovne 2767/2, Praha 3, Czech Republic or
 * at the email: info@unicorn.com.
 */

//@@viewOn:imports
import * as UU5 from "uu5g04";
import ns from "./bricks-ns.js";
import SwitchSelectorItem from "./switch-selector-item.js";
//@@viewOff:imports

const DEFAULT_COLOR = "blue";
const DEFAULT_PADDING = 4;

const grey = UU5.Environment.colors.grey;
const greyShades = {
  c50: grey.c300,
  c100: grey.c400,
  c500: grey.c400
};

function getWhiteColors(bgStyle) {
  const colors = {};

  switch (bgStyle) {
    case "transparent":
      colors.backgroundColorFocus = "rgba(255,255,255,.4)";
      colors.borderColor = "transparent";
      break;
    case "filled":
      colors.backgroundColor = "#fff";
      colors.borderColor = "transparent";
      colors.backgroundColorFocus = "rgba(255,255,255,.6)";
      break;
    default:
      colors.borderColorFocus = "#fff";
      break;
  }
  return colors;
}

function getBlackColors(bgStyle) {
  const colors = {};

  switch (bgStyle) {
    case "transparent":
      colors.backgroundColorFocus = grey.c400;
      colors.borderColor = "transparent";
      break;
    case "filled":
      colors.backgroundColor = "#000";
      colors.borderColor = "transparent";
      colors.backgroundColorFocus = "rgba(0,0,0,.6)";
      break;
    default:
      colors.borderColorFocus = "#000";
  }
  return colors;
}

function getColors(colorSchema, bgStyle = "outline") {
  let styles = {
    borderColor: UU5.Environment.colors.grey.c400
  };
  const colorSchemaMap =
    UU5.Environment.colorSchemaMap[colorSchema === "default" ? DEFAULT_COLOR : colorSchema || DEFAULT_COLOR];
  const color = colorSchemaMap.color.replace(/-rich$/, "");
  const shades = color === "grey" ? greyShades : UU5.Environment.colors[color];

  switch (colorSchema) {
    case "white":
      styles = { ...styles, ...getWhiteColors(bgStyle) };
      break;
    case "black":
      styles = { ...styles, ...getBlackColors(bgStyle) };
      break;
    default:
      switch (bgStyle) {
        case "transparent":
          styles.backgroundColorFocus = shades.c100;
          styles.borderColor = "transparent";
          break;
        case "filled":
          styles.backgroundColor = shades.c50;
          styles.borderColor = "transparent";
          styles.backgroundColorFocus = shades.c100;
          break;
        default:
          colorSchema && colorSchema !== "default" && (styles.borderColor = shades.c500);
          styles.borderColorFocus = shades.c500;
          break;
      }
  }

  return styles;
}

function getClassName({
  width,
  borderWidth,
  borderWidthFocus,
  colorSchema,
  bgStyle,
  borderRadius,
  className,
  disabled,
  readOnly,
  elevation
}) {
  const classNames = [
    UU5.Common.Css.css`
    display: inline-flex;
    outline: none;
    border-style: solid;
  `,
    ns.css("switch-selector")
  ];

  (disabled || readOnly) &&
    classNames.push(UU5.Common.Css.css`
    &[disabled], &[readonly] {
      position: relative;
      cursor: default !important;
    }

    &[disabled] {
      opacity: .4;
    }

    &[disabled]::before, &[readOnly]::before {
      position: absolute;
      content: "";
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
    }
  `);

  const padding = DEFAULT_PADDING - borderWidth;
  borderWidthFocus = borderWidthFocus == null ? borderWidth + 1 : borderWidthFocus;
  const paddingFocus = DEFAULT_PADDING - borderWidthFocus;

  let styles = { padding };

  if (bgStyle === "underline") {
    styles.borderWidth = `0 0 ${borderWidth}px`;
    styles.borderWidthFocus = `0 0 ${borderWidthFocus}px`;
    styles.paddingFocus = `${padding}px ${padding}px ${paddingFocus}px ${padding}px`;
  } else {
    styles.borderWidth = borderWidth + "px";
    styles.borderWidthFocus = borderWidthFocus + "px";
    styles.paddingFocus = paddingFocus + "px";
  }

  if (colorSchema !== "custom") {
    styles = { ...styles, ...getColors(disabled || readOnly ? "grey" : colorSchema, bgStyle) };
  }

  classNames.push(UU5.Common.Css.css`
    width: ${UU5.Common.Tools.fillUnit(width)};
    padding: ${styles.padding}px;
    box-shadow: ${UU5.Common.Tools.ELEVATIONS[elevation + ""]};
    background-color: ${styles.backgroundColor};
    border-width: ${styles.borderWidth};
    border-color: ${styles.borderColor};
    border-radius: ${UU5.Common.Tools.fillUnit(borderRadius)};

    ${
      disabled || readOnly
        ? ""
        : `
    &:focus, &:active {
      padding: ${styles.paddingFocus};
      ${styles.backgroundColorFocus ? "background-color: " + styles.backgroundColorFocus : ""};
      border-width: ${styles.borderWidthFocus};
      border-color: ${styles.borderColorFocus};
    }
    `
    }
  `);

  if (className) classNames.push(className);

  return classNames.join(" ");
}

export const SwitchSelector = UU5.Common.VisualComponent.create({
  displayName: "SwitchSelector", // for backward compatibility (test snapshots)
  //@@viewOn:mixins
  mixins: [UU5.Common.BaseMixin, UU5.Common.ElementaryMixin],
  //@@viewOff:mixins

  //@@viewOn:statics
  statics: {
    tagName: ns.name("SwitchSelector")
  },
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {
    items: UU5.PropTypes.arrayOf(
      UU5.PropTypes.shape({
        value: UU5.PropTypes.oneOfType([UU5.PropTypes.string, UU5.PropTypes.number, UU5.PropTypes.bool]).isRequired,
        content: UU5.PropTypes.any,
        colorSchema: UU5.PropTypes.string,
        bgStyle: UU5.PropTypes.string,
        borderRadius: UU5.PropTypes.oneOfType([UU5.PropTypes.number, UU5.PropTypes.string])
      })
    ).isRequired,
    value: UU5.PropTypes.oneOfType([UU5.PropTypes.string, UU5.PropTypes.number, UU5.PropTypes.bool]),
    onChange: UU5.PropTypes.func,

    size: UU5.PropTypes.oneOf(["s", "m", "l", "xl"]),
    width: UU5.PropTypes.oneOfType([UU5.PropTypes.number, UU5.PropTypes.string]),
    readOnly: UU5.PropTypes.bool,
    colorSchema: UU5.PropTypes.oneOf(UU5.Environment.colorSchema),
    bgStyle: UU5.PropTypes.oneOf(["filled", "outline", "transparent", "underline"]),
    elevation: UU5.PropTypes.oneOf(["-1", "0", "1", "2", "3", "4", "5", -1, 0, 1, 2, 3, 4, 5]),
    borderRadius: UU5.PropTypes.oneOfType([UU5.PropTypes.number, UU5.PropTypes.string]),
    borderWidth: UU5.PropTypes.number,
    borderWidthFocus: UU5.PropTypes.number
  },
  //@@viewOff:propTypes

  //@@viewOn:getDefaultProps
  getDefaultProps() {
    return {
      items: [{ value: "1" }, { value: "2" }, { value: "3" }],
      value: undefined,
      onChange: undefined,

      size: "m",
      width: undefined,
      readOnly: false,
      colorSchema: undefined,
      bgStyle: "outline",
      elevation: undefined,
      borderRadius: 2,
      borderWidth: 1,
      borderWidthFocus: undefined
    };
  },
  //@@viewOff:getDefaultProps

  //@@viewOn:reactLifeCycle
  //@@viewOff:reactLifeCycle

  //@@viewOn:interface
  //@@viewOff:interface

  //@@viewOn:overriding
  //@@viewOff:overriding

  //@@viewOn:private
  _getValue() {
    let items = this.props.items || this.getDefault("items");
    return this.props.value || typeof this.props.value === "boolean" ? this.props.value : (items[0] || {}).value;
  },

  _onChange(value) {
    const opt = { component: this, value };

    if (typeof this.props.onChange === "function") {
      this.props.onChange(opt);
    }
  },

  _onFocusWrapper(e) {
    !this.props.disabled && !this.props.readOnly && window.addEventListener("keydown", this._onKeyDown);
  },

  _onBlurWrapper(e) {
    !this.props.disabled && !this.props.readOnly && window.removeEventListener("keydown", this._onKeyDown);
  },

  _onKeyDown(e) {
    const value = this._getValue();
    const currentIndex = this.props.items.findIndex(item => item.value === value);
    let newIndex;

    if (e.which === 39) {
      // right
      newIndex = currentIndex + 1;
      if (newIndex > this.props.items.length - 1) {
        newIndex = 0;
      }
    } else if (e.which === 37) {
      // left
      newIndex = currentIndex - 1;
      if (newIndex < 0) {
        newIndex = this.props.items.length - 1;
      }
    } else {
      return;
    }

    let index = value ? newIndex : 0;
    this._onChange(this.props.items[index].value);
  },

  _onItemMouseDown() {
    this._root.focus();
  },

  _getButtons() {
    const value = this._getValue();

    return this.props.items.map(item => {
      const colorSchema = item.colorSchema || this.props.colorSchema;
      return (
        <SwitchSelectorItem
          key={item.value}
          active={value === item.value}
          size={this.props.size}
          dark={this.props.bgStyle === "filled"}
          onMouseDown={this._onItemMouseDown}
          // arrow fn necessary to pass item.value
          // eslint-disable-next-line react/jsx-no-bind
          onClick={() => this._onChange(item.value)}
          colorSchema={(this.props.disabled || this.props.readOnly) && colorSchema !== "white" ? "grey" : colorSchema}
          bgStyle={item.bgStyle}
          borderRadius={item.borderRadius == null ? this.props.borderRadius : item.borderRadius}
          content={item.content || item.value}
        />
      );
    });
  },

  _getMainAttrs() {
    let attrs = this.getMainAttrs();
    attrs.className = getClassName({ ...this.props, className: attrs.className });
    attrs.tabIndex = this.isDisabled() ? -1 : 0;
    this.props.disabled && (attrs.disabled = true);
    this.props.readOnly && (attrs.readOnly = true);
    attrs.onFocus = this._onFocusWrapper;
    attrs.onBlur = this._onBlurWrapper;
    attrs.ref = root => (this._root = root);

    return attrs;
  },
  //@@viewOff:private

  //@@viewOn:render
  render() {
    return <div {...this._getMainAttrs()}>{this._getButtons()}</div>;
  }
  //@@viewOff:render
});
export default SwitchSelector;
