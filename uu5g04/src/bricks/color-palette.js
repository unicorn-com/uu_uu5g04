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
import Css from "./internal/css.js";
//@@viewOff:imports

// styles
const colorButton = () =>
  Css.css(`
    border: 1px inset rgba(0,0,0,0.2);
    border-radius: 2px;
    cursor: pointer;
    display: inline-block;
    vertical-align: bottom;
    position: relative;
  `);

const selectedColorButton = () =>
  Css.css(`
    position: relative;
    &::before {
      content: "";
      position: absolute;
      pointer-events: none;
      background: #FFFFFF;
      border: 1px solid rgba(0, 0, 0, 0.2);
      border-radius: 2px;
      box-sizing: border-box;
    }
  `);

// const SHADES = [50, 100, 500, 600, 700, 800, 900];
const SHADES = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900];

const ADVANCED_SHADES = [500, ...SHADES.filter(item => item !== 500)];

const COLORS = [
  "indigo",
  "blue",
  "light-blue",
  "cyan",
  "teal",
  "green",
  "light-green",
  "lime",
  "yellow",
  "amber",
  "orange",
  "deep-orange",
  "red",
  "pink",
  "purple",
  "deep-purple",
  "brown",
  "grey",
  "blue-grey"
];

const SIMPLE_COLORS = [...COLORS, "black", "white"];
const ADVANCED_COLORS = ["white", ...COLORS];

const ADVANCED_WHITE = {
  c50: "#F5F5F5", // grey, c100
  c100: "#EEEEEE", // grey, c200
  c200: "#E0E0E0", // grey, c300
  c300: "#BDBDBD", // grey, c400
  c400: "#9E9E9E", // grey, c500
  c500: "#FFFFFF", // white
  c600: "#757575", // grey, c600
  c700: "#616161", // grey, c700
  c800: "#424242", // grey, c800
  c900: "#000000" // black
};

export const ColorPalette = UU5.Common.VisualComponent.create({
  displayName: "ColorPalette", // for backward compatibility (test snapshots)
  //@@viewOn:mixins
  mixins: [UU5.Common.BaseMixin],
  //@@viewOff:mixins

  //@@viewOn:statics
  statics: {
    tagName: ns.name("ColorPalette"),
    classNames: {
      main: ns.css("color-palette"),
      simpleColorMain: () =>
        Css.css(`
          padding: 8px 12px 16px 12px;
          box-sizing: border-box;
          width: 360px;

          .uu5-bricks-header {
            font-size: 16px;
            color: rgba(0, 0, 0, 0.54);
            margin-top: 8px;
            margin-bottom: 4px;
          }
          .uu5-bricks-section:first-child {
            margin-top: 0;
          }

          .${colorButton()} {
            width: 40px;
            height: 40px;
            margin: 4px;
          }

          .${selectedColorButton()}::before {
            width: 20px;
            height: 20px;
            top: 9px;
            left: 9px;
          }
        `),
      advancedColorMain: () =>
        Css.css(`
          padding: 6px;
          box-sizing: border-box;
          width: 544px;

          .${colorButton()} {
            width: 24px;
            height: 24px;
            margin: 2px;
          }

          .${selectedColorButton()}::before {
            width: 12px;
            height: 12px;
            top: 5px;
            left: 5px;
          }
        `),
      colorButton: colorButton,
      selectedColorButton: selectedColorButton
    },
    lsi: () => UU5.Environment.Lsi.Bricks.colorPalette
  },
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {
    simplePalette: UU5.PropTypes.bool,
    onChange: UU5.PropTypes.func,
    onColorSchemaChange: UU5.PropTypes.func,
    color: UU5.PropTypes.string
  },
  //@@viewOff:propTypes

  //@@viewOn:getDefaultProps
  getDefaultProps() {
    return { simplePalette: false, onChange: null, color: null, onColorSchemaChange: null };
  },
  //@@viewOff:getDefaultProps

  //@@viewOn:reactLifeCycle
  getInitialState() {
    return this._getColorState(this.props.color);
  },

  componentWillReceiveProps(nextProps) {
    this.setState(this._getColorState(nextProps.color));
  },
  //@@viewOff:reactLifeCycle

  //@@viewOn:interface
  getColor() {
    return this.state.color;
  },
  //@@viewOff:interface

  //@@viewOn:overriding
  //@@viewOff:overriding

  //@@viewOn:private
  _getColorState(color, modifiedFormat) {
    if (!color) return { colorSchema: null, color: null };

    color = color.toUpperCase();

    for (let i = 0; i < COLORS.length; i++) {
      for (let j = 0; j < SHADES.length; j++) {
        let colorSchema = COLORS[i];
        let shade = SHADES[j];
        let colorCode = this._getColorCode(colorSchema, shade);
        if (colorCode.toUpperCase() === color) {
          return { color: colorCode, colorSchema };
        }
      }
    }

    // special handling for black and white colorSchema
    if (color === "#FFF" || color === "#FFFFFF") {
      return { color, colorSchema: "white" };
    }
    if (color === "#000" || color === "#000000") {
      return { color, colorSchema: "black" };
    }

    if (!modifiedFormat && color[0] === "#") {
      if (color.length === 4) {
        // try to find larger name of the color -> #ABC = #AABBCC
        return this._getColorState(`#${color[1]}${color[1]}${color[2]}${color[2]}${color[3]}${color[3]}`, true);
      } else if (color.length === 7 && color[1] === color[2] && color[3] === color[4] && color[5] === color[6]) {
        return this._getColorState(`#${color[1]}${color[3]}${color[5]}`, true);
      }
    }

    return { colorSchema: null, color };
  },
  _onColorSchemaClick(color, colorSchema) {
    this.setState({ colorSchema, color }, () => {
      if (!this._hasColorShades(colorSchema) && typeof this.props.onChange === "function") {
        this.props.onChange({ value: color, component: this });
      } else if (typeof this.props.onColorSchemaChange === "function") {
        this.props.onColorSchemaChange({ value: color, component: this });
      }
    });
  },

  _onColorClick(color, colorSchema = this.state.colorSchema) {
    this.setState(
      { color, colorSchema },
      () => typeof this.props.onChange === "function" && this.props.onChange({ value: color, component: this })
    );
  },

  _getColorCode(color, shade) {
    let colorCode;
    shade = `c${shade}`;
    // black and white are special colors
    if (color === "white") {
      colorCode = ADVANCED_WHITE[shade];
    } else if (color === "black") {
      colorCode = "#000000";
    } else {
      colorCode = UU5.Environment.colors[color][shade];
    }

    return colorCode;
  },

  _styleColorButton(colorCode, colorSchema) {
    let result = Css.css(`background-color: ${colorCode}`);

    if (colorSchema) {
      if (colorSchema === this.state.colorSchema) {
        result += ` ${this.getClassName("selectedColorButton")}`;
      }
    } else if (colorCode === this.state.color) {
      result += ` ${this.getClassName("selectedColorButton")}`;
    }

    return result;
  },

  _hasColorShades(color) {
    return color !== "white" && color !== "black";
  },

  _renderSimplePalette(colors = SIMPLE_COLORS, shades = SHADES) {
    return (
      <UU5.Bricks.Div className={this.getClassName("simpleColorMain")} key="simple-color-palette">
        <UU5.Bricks.Section header={this.getLsiComponent("baseColor")} level={4}>
          {colors.map(colorSchema => {
            const colorCode = this._getColorCode(colorSchema, 500);
            return (
              <div
                // eslint-disable-next-line react/jsx-no-bind
                onClick={() => this._onColorSchemaClick(colorCode, colorSchema)}
                key={`color_${colorSchema}`}
                className={`${this.getClassName("colorButton")} ${this._styleColorButton(
                  colorCode.toUpperCase(),
                  colorSchema
                )}`}
              />
            );
          })}
        </UU5.Bricks.Section>
        <UU5.Bricks.Section header={this.getLsiComponent("shade")} level={4}>
          {this.state.colorSchema
            ? this._hasColorShades(this.state.colorSchema)
              ? shades.map(shade => {
                  let colorCode = this._getColorCode(this.state.colorSchema, shade);
                  return (
                    <div
                      // eslint-disable-next-line react/jsx-no-bind
                      onClick={() => this._onColorClick(colorCode)}
                      key={`color_${shade}`}
                      className={`${this.getClassName("colorButton")} ${this._styleColorButton(
                        colorCode.toUpperCase()
                      )}`}
                    />
                  );
                })
              : this.getLsiComponent("noShades")
            : this.getLsiComponent("selectSchema")}
        </UU5.Bricks.Section>
      </UU5.Bricks.Div>
    );
  },

  _renderAdvancedPalette(colors = ADVANCED_COLORS, shades = ADVANCED_SHADES) {
    return (
      <div className={this.getClassName("advancedColorMain")} key="advanced-color-palette">
        {shades.map(shade => {
          return colors
            .filter(colorSchema => colorSchema !== "grey")
            .map(colorSchema => {
              const colorCode = this._getColorCode(colorSchema, shade);
              return (
                <div
                  // eslint-disable-next-line react/jsx-no-bind
                  onClick={() => this._onColorClick(colorCode, colorSchema)}
                  key={`color_${colorSchema}_${shade}`}
                  className={`${this.getClassName("colorButton")} ${this._styleColorButton(colorCode.toUpperCase())}`}
                />
              );
            });
        })}
      </div>
    );
  },
  //@@viewOff:private

  //@@viewOn:render
  render: function() {
    return (
      <UU5.Bricks.Div {...this.getMainPropsToPass()}>
        {this.props.simplePalette ? this._renderSimplePalette() : this._renderAdvancedPalette()}
      </UU5.Bricks.Div>
    );
  }
  //@@viewOff:render
});

export default ColorPalette;
