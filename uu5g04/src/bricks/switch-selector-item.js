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
//@@viewOff:imports

const DEFAULT_COLOR = "blue";

const grey = UU5.Environment.colors.grey;
const greyShades = {
  c50: grey.c300,
  c100: grey.c400,
  c300: grey.c500,
  c500: grey.c600,
  c700: grey.c800,
  c900: grey.c900,
  inverse: grey.inverse
};

function getBlackColors(active, dark) {
  return {
    backgroundColor: active ? (dark ? "#fff" : "#000") : "transparent",
    color: active ? (dark ? "#000" : "#fff") : dark ? "#fff" : "#000",
    backgroundColorHover: active
      ? dark
        ? "rgba(255,255,255,.6)"
        : "rgba(0,0,0,.6)"
      : dark
      ? "rgba(255,255,255,.4)"
      : "rgba(0,0,0,.2)",
    colorHover: active ? (dark ? "rgba(0,0,0,.87)" : "#fff") : dark ? "#fff" : "rgba(0,0,0,.87)",
    backgroundColorActive: dark ? "rgba(0,0,0,.4)" : "rgba(255,255,255,.6)",
    colorActive: active ? (dark ? "rgba(0,0,0,.87)" : "#fff") : dark ? "#fff" : "rgba(0,0,0,.87)"
  };
}

function getWhiteColors(active, dark) {
  return {
    backgroundColor: active ? (dark ? "#000" : "#fff") : "transparent",
    color: active ? (dark ? "#fff" : "#000") : dark ? "#000" : "#fff",
    backgroundColorHover: active
      ? dark
        ? "rgba(0,0,0,.6)"
        : "rgba(255,255,255,.8)"
      : dark
      ? "rgba(0,0,0,.2)"
      : "rgba(255,255,255,.2)",
    colorHover: active ? (dark ? "#fff" : "rgba(0,0,0,.87)") : dark ? "rgba(0,0,0,.87)" : "#fff",
    backgroundColorActive: dark ? "rgba(0,0,0,.4)" : "rgba(255,255,255,.6)",
    colorActive: active ? (dark ? "#fff" : "rgba(0,0,0,.87)") : dark ? "rgba(0,0,0,.87)" : "#fff"
  };
}

function getClassName({ active, dark, colorSchema, bgStyle, size, borderRadius, className }) {
  let padding;
  let fontSize;
  if (size === "s") {
    padding = "1px 4px";
    fontSize = 12;
  } else if (size === "m") {
    padding = "4px 8px";
    fontSize = 14;
  } else if (size === "l") {
    padding = "7px 8px";
    fontSize = 16;
  } else if (size === "xl") {
    padding = "10px 9px";
    fontSize = 18;
  }

  const css = [
    UU5.Common.Css.css`
      cursor: pointer;
      outline: none;
      border: 1px;
      /* because of stretch of item in wider parent*/
      flex: auto;
      white-space: nowrap;

      & + & {
        margin-left: 4px;
      }
    `,
    UU5.Common.Css.css`
      font-size: ${fontSize}px;
      border-radius: ${UU5.Common.Tools.fillUnit(borderRadius)};
      padding: ${padding};
    `
  ];

  if (colorSchema !== "custom") {
    const colorSchemaMap =
      UU5.Environment.colorSchemaMap[colorSchema === "default" ? DEFAULT_COLOR : colorSchema || DEFAULT_COLOR];
    const isRich = /-rich$/.test(colorSchema);
    const color = colorSchemaMap.color.replace(/-rich$/, "");
    const shades = color === "grey" ? greyShades : UU5.Environment.colors[color];

    let colors;
    switch (colorSchema) {
      case "white":
        colors = getWhiteColors(active, dark);
        break;
      case "black":
        colors = getBlackColors(active, dark);
        break;
      default:
        let darkText = UU5.Environment.colors.common.darkText;
        switch (bgStyle) {
          // TODO: outline, underline, transparent?

          // filled
          default:
            colors = {
              backgroundColor: active ? (isRich ? shades.c500 : dark ? shades.c100 : shades.c50) : "transparent",
              color: active ? (isRich ? shades.inverse : shades.c900) : undefined,
              backgroundColorHover: active
                ? isRich
                  ? shades.c700
                  : dark
                  ? shades.c300
                  : shades.c100
                : dark
                ? shades.c100
                : shades.c50,
              colorHover: active ? (isRich ? shades.inverse : darkText) : undefined,
              backgroundColorActive: isRich ? shades.c900 : shades.c500,
              colorActive: isRich ? shades.inverse : darkText
            };
        }
    }

    css.push(UU5.Common.Css.css`
      background-color: ${colors.backgroundColor};
      color: ${colors.color};
      border-color: transparent;

      &:hover {
        background-color: ${colors.backgroundColorHover};
        color: ${colors.colorHover};
      }

      &:active {
        background-color: ${colors.backgroundColorActive};
        color: ${colors.colorActive};
      }
    `);
  }

  if (className) css.push(className);

  return css.join(" ");
}

const SwitchSelectorItem = UU5.Common.VisualComponent.create({
  displayName: "SwitchSelectorItem", // for backward compatibility (test snapshots)
  //@@viewOn:mixins
  mixins: [UU5.Common.BaseMixin, UU5.Common.ContentMixin],
  //@@viewOff:mixins

  //@@viewOn:statics
  statics: {
    tagName: ns.name("MultiSwitch.Item")
  },
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {
    onClick: UU5.PropTypes.func,
    onMouseDown: UU5.PropTypes.func,
    active: UU5.PropTypes.bool,
    dark: UU5.PropTypes.bool,
    colorSchema: UU5.PropTypes.oneOf(UU5.Environment.colorSchema),
    bgStyle: UU5.PropTypes.oneOf(["filled", "outline", "transparent", "underline"]),
    size: UU5.PropTypes.oneOf(["s", "m", "l", "xl"]),
    borderRadius: UU5.PropTypes.oneOfType([UU5.PropTypes.number, UU5.PropTypes.string]),
    tabIndex: UU5.PropTypes.number
  },
  //@@viewOff:propTypes

  //@@viewOn:getDefaultProps
  getDefaultProps() {
    return {
      onClick: undefined,
      onMouseDown: undefined,
      active: false,
      dark: false,
      colorSchema: DEFAULT_COLOR,
      bgStyle: "filled",
      size: "m",
      borderRadius: 1,
      tabIndex: -1
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
  //@@viewOff:private

  //@@viewOn:render
  render() {
    return (
      <button
        type="button"
        className={getClassName(this.props)}
        tabIndex={this.props.tabIndex}
        onClick={this.props.onClick}
        onMouseDown={this.props.onMouseDown}
        onMouseUp={this.props.onMouseDown}
      >
        {this.getChildren()}
      </button>
    );
  }
  //@@viewOn:render
});
export default SwitchSelectorItem;
