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
import ns from "../forms-ns.js";
import Css from "./css.js";

import ColorPreview from "./color-preview.js";
import Color from "./color.js";

import FormMixin from "../mixins/form-mixin.js";
//@@viewOff:imports

export const ColorPaletteForm = UU5.Common.VisualComponent.create({
  displayName: "ColorPaletteForm", // for backward compatibility (test snapshots)
  //@@viewOn:mixins
  mixins: [UU5.Common.BaseMixin, FormMixin],
  //@@viewOff:mixins

  //@@viewOn:statics
  statics: {
    tagName: ns.name("ColorPaletteForm"),
    classNames: {
      main: ns.css("color-palette-form"),
      colorPreviewFormItem: ns.css("color-preview-form-item"),
      simplePaletteCustomColorForm: Css.css(`
        margin: 8px 16px 16px;
        border-top: 1px solid #BDBDBD;
        padding-top: 16px;
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        width: 328px;

        .uu5-forms-input,
        .uu5-forms-color-preview-form-item {
          width: 33%;
          box-sizing: border-box;
          padding: 0 8px 16px;
        }
        .uu5-forms-input:first-child {
          padding-left: 0;
        }
        .uu5-forms-color-preview-form-item {
          padding-right: 0;

          > label {
            display: block;
            font-size: 16px;
            color: rgba(0, 0, 0, 0.54);
            padding: 8px 16px 8px 0;
          }
        }

        .uu5-forms-input-l input[type="text"].uu5-forms-input-form-item {
          height: 40px;
        }

        .uu5-bricks-button.uu5-bricks-button-l {
          width: auto;
          height: 24px;
        }
      `),
      fullPaletteCustomColorForm: Css.css(`
        margin: 8px;
        border-top: 1px solid #BDBDBD;
        padding: 24px 0 16px;

        .uu5-forms-color-preview-form-item {
          display: inline-flex;
          align-items: baseline;

          > label {
            color: rgba(0, 0, 0, .54);
            font-size: 12px;
          }

          > .uu5-forms-color-preview {
            display: flex;
          }
        }

        .uu5-bricks-button.uu5-bricks-button-s {
          width: auto;
          height: 24px;
          position: absolute;
          right: 24px;
        }

        .uu5-forms-color-preview-form-item > label,
        .uu5-forms-input-s .uu5-forms-label {
          padding: 2px 8px 2px 24px;
        }

        .uu5-forms-input-s input[type="text"].uu5-forms-input-form-item {
          height: 24px;
        }
      `),
      opacityInput: () =>
        Css.css(`
        &.uu5-forms-input-s {
          input {
            padding-right: 20px !important;
          }

          .uu5-forms-input-wrapper::after {
            line-height: 24px;
            right: 6px;
          }
        }

        &.uu5-forms-input-l {
          input {
            padding-right: 30px !important;
          }

          .uu5-forms-input-wrapper::after {
            line-height: 40px;
            right: 10px;
          }
        }

        .uu5-forms-input-wrapper {
          position: relative;

          input { text-align: right; }

          &::after {
            content: "%";
            position: absolute;
            display: block;
            bottom: 0;
            color: rgba(0, 0, 0, .54);
            pointer-events: none;
          }
        }

      `),
      hexaInput: () =>
        Css.css(`
        &.uu5-forms-input-s {
          input {
            padding-left: 16px !important;
          }

          .uu5-forms-input-wrapper::after {
            line-height: 24px;
            left: 8px;
          }
        }

        &.uu5-forms-input-l {
          input {
            padding-left: 20px !important;
          }

          .uu5-forms-input-wrapper::after {
            line-height: 40px;
            left: 8px;
          }
        }

        .uu5-forms-input-wrapper {
          position: relative;

          &::after {
            content: "#";
            position: absolute;
            display: block;
            bottom: 0;
            color: rgba(0, 0, 0, .54);
            pointer-events: none;
          }
        }

      `),
      controls: Css.css(`
        padding: 2px 8px 8px 8px;
        display: flex;
        justify-content: flex-end;

        .uu5-bricks-button {
          &.uu5-bricks-button-s {
            width: auto;
            height: 24px;
          }

          &.uu5-bricks-button-l {
            width: auto;
            height: 24px;
          }
        }
      `)
    },
    lsi: () => ({ ...UU5.Environment.Lsi.Forms.colorPicker, ...UU5.Environment.Lsi.Forms.message })
  },
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {
    enableCustomColor: UU5.PropTypes.bool,
    value: UU5.PropTypes.string
  },
  //@@viewOff:propTypes

  //@@viewOn:getDefaultProps
  getDefaultProps() {
    return { enableCustomColor: false, value: undefined };
  },
  //@@viewOff:getDefaultProps

  //@@viewOn:reactLifeCycle
  getInitialState() {
    return { value: Color.getValid(this.props.value) || undefined };
  },

  componentWillReceiveProps(nextProps) {
    if (Color.getValid(nextProps.value)) {
      if (nextProps.value !== Color.getValidString(this.state.value)) {
        this.setState({ value: Color.getValidObject(nextProps.value) });
      }
    } else {
      this.setState({ value: undefined });
    }
  },
  //@@viewOff:reactLifeCycle

  //@@viewOn:interface
  getColor() {
    return Color.getValidString(this.state.value, { upperCase: true, shorten: false });
  },
  //@@viewOff:interface

  //@@viewOn:overriding
  //@@viewOff:overriding

  //@@viewOn:private
  _renderCustomColorInputs(simplePalette) {
    let stringColor = "";
    let objectColor;
    if (this.state.value) {
      if (typeof this.state.value === "object") {
        objectColor = this.state.value;
      } else if (typeof this.state.value === "string") {
        objectColor = Color.getValidObject(this.state.value);
      }

      if (objectColor) {
        stringColor = Color.getValidString(
          {
            r: objectColor.r,
            g: objectColor.g,
            b: objectColor.b,
            opacity: 100
          },
          { upperCase: true, shorten: false }
        ).replace("#", "");
      }
    }

    return (
      <div className={this.getClassName(simplePalette ? "simplePaletteCustomColorForm" : "fullPaletteCustomColorForm")}>
        <UU5.Forms.Text
          label="HEX"
          size={simplePalette ? "l" : "s"}
          inputWidth={simplePalette ? "96px" : "72px"}
          value={stringColor}
          onChange={this._handleColorInputChange}
          onBlur={this._handleColorInputBlur}
          className={this.getClassName("hexaInput")}
        />
        <UU5.Forms.Text
          label="Opacity"
          size={simplePalette ? "l" : "s"}
          inputWidth={simplePalette ? "96px" : "72px"}
          value={objectColor && objectColor.opacity != null ? objectColor.opacity + "" : ""}
          onChange={this._handleOpacityChange}
          onBlur={this._handleOpacityBlur}
          disabled={!this.state.value}
          className={this.getClassName("opacityInput")}
        />
        <div className={this.getClassName("colorPreviewFormItem")}>
          <label>{this.getLsiComponent("preview")}</label>
          <ColorPreview
            color={this.state.value ? Color.getValidString(this.state.value) : null}
            size={simplePalette ? "l" : "s"}
          />
        </div>
        <UU5.Bricks.Button
          bgStyle="transparent"
          colorSchema="red"
          size={simplePalette ? "l" : "s"}
          onClick={this._restore}
        >
          {this.getLsiComponent("clearButton")}
        </UU5.Bricks.Button>
      </div>
    );
  },

  _renderControls(simplePalette) {
    return (
      <div className={this.getClassName("controls")}>
        <UU5.Bricks.Button
          bgStyle="transparent"
          colorSchema="red"
          size={simplePalette ? "l" : "s"}
          onClick={this._restoreWithClose}
        >
          {this.getLsiComponent("clearButton")}
        </UU5.Bricks.Button>
      </div>
    );
  },

  _getPaletteProps() {
    return {
      simplePalette: this.props.simplePalette,
      onChange: this._colorPaletteChange,
      color: Color.getValidString(this.state.value),
      onColorSchemaChange: this._colorSchemaPaletteChange
    };
  },

  _colorSchemaPaletteChange(opt) {
    let value = Color.getValidObject(opt.value);
    this.setState({ value });
  },

  _colorPaletteChange(opt) {
    let value = Color.getValidObject(opt.value);
    this.setState({ value });
    if (!this.props.enableCustomColor && typeof this.props.onChange === "function") {
      this.props.onChange({ value: opt.value, component: this });
    }
  },

  _handleColorInputChange(opt) {
    let value = opt.value;
    if (value && value[0] === "#") {
      opt.value = value.substring(1);
    } else {
      value = "#" + value;
    }
    if (!value || value.match(/^#[0-9A-Fa-f]{0,6}$/)) {
      opt.component.onChangeDefault(opt);
      if (value.length === 7) {
        let color = Color.getValidObject(value);
        this.setState(state => ({
          value: { ...color, opacity: state.value && !isNaN(state.value.opacity) ? state.value.opacity : 100 }
        }));
      }
    }
  },

  _handleColorInputBlur(opt) {
    opt.value = `#${opt.value}`;
    if (!Color.getValid(opt.value)) {
      // if color is invalid, then return to teh input last valid value saved in the state
      opt.component.setValue(
        this.state.value
          ? Color.getValidString({ ...this.state.value, opacity: 100 }, { upperCase: true, shorten: false })
          : ""
      );
    } else if (opt.value.length === 4) {
      // this valid value is not save in state => update state
      let color = Color.getValidObject(opt.value);
      this.setState(state => ({
        value: { ...color, opacity: state.value && !isNaN(state.value.opacity) ? state.value.opacity : 100 }
      }));
    }
  },

  _handleOpacityChange(opt) {
    let opacity = parseInt(opt.value);
    if (isNaN(opacity)) {
      // left empty string as an value in input but dont save it to state
      if (!opt.value) {
        opt.component.onChangeDefault(opt);
      }
      // left last valid value in state
      return;
    }
    // validate opacity to be between 0 and 100
    opacity = Math.min(100, Math.max(opacity, 0));
    this.setState(state => {
      let value = typeof state.value === "object" ? state.value : Color.getValidObject(state.value);
      return { value: { ...value, opacity } };
    });
  },

  _handleOpacityBlur(opt) {
    if (isNaN(opt.value)) {
      opt.component.setValue(this.state.value ? this.state.value.opacity : 100);
    }
  },

  _restore() {
    this.setState({ value: null });
  },

  _restoreWithClose() {
    this._colorPaletteChange({ values: null });
  },
  //@@viewOff:private

  //@@viewOn:render
  render: function() {
    const paletteProps = this._getPaletteProps();
    return (
      <UU5.Bricks.Div {...this.getMainPropsToPass()}>
        <UU5.Bricks.ScreenSize>
          <UU5.Bricks.ScreenSize.Item screenSize={["xs", "s"]} key="resize-item">
            <UU5.Bricks.ColorPalette {...paletteProps} simplePalette={true} />
            {this.props.enableCustomColor ? this._renderCustomColorInputs(true) : this._renderControls(true)}
          </UU5.Bricks.ScreenSize.Item>
          <UU5.Bricks.ScreenSize.Item screenSize="*" key="resize-item">
            <UU5.Bricks.ColorPalette {...paletteProps} />
            {this.props.enableCustomColor
              ? this._renderCustomColorInputs(paletteProps.simplePalette)
              : this._renderControls(paletteProps.simplePalette)}
          </UU5.Bricks.ScreenSize.Item>
        </UU5.Bricks.ScreenSize>
      </UU5.Bricks.Div>
    );
  }
  //@@viewOff:render
});

export default ColorPaletteForm;
