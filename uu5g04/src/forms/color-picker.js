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
import ns from "./forms-ns.js";

import InputMixin from "./mixins/input-mixin.js";
import ColorPaletteForm from "./internal/color-palette-form.js";
import ColorPreview from "./internal/color-preview.js";
import Color from "./internal/color.js";
import Loading from "./internal/loading.js";
import Css from "./internal/css.js";

import Context from "./form-context.js";
//@@viewOff:imports

export const ColorPicker = Context.withContext(
  UU5.Common.VisualComponent.create({
    displayName: "ColorPicker", // for backward compatibility (test snapshots)
    //@@viewOn:mixins
    mixins: [
      UU5.Common.BaseMixin,
      UU5.Common.PureRenderMixin,
      UU5.Common.ScreenSizeMixin,
      UU5.Common.ElementaryMixin,
      UU5.Common.ColorSchemaMixin,
      InputMixin
    ],
    //@@viewOff:mixins

    //@@viewOn:statics
    statics: {
      tagName: ns.name("ColorPicker"),
      classNames: {
        main: ns.css("color-picker"),
        loading: () =>
          Css.css(`
          position: absolute;
          top: 0;
          right: 0;
          bottom: 0;
          left: 0;
          margin: auto;
          width: 24px;
          height: 24px;
        `),
        pickerButton: () =>
          Css.css(`
          padding: 4px;
          color: black;
          text-align: left;

          &&.uu5-bricks-button {
            width: 56px;
          }

          &.uu5-bricks-button {
            &.uu5-bricks-button-outline {
              padding: 3px 4px;
            }
          }

          .uu5-forms-color-picker.uu5-forms-input-xl &.uu5-bricks-button {
            width: 64px;
          }
        `),
        buttonError: ns.css("button-error")
      },
      lsi: () => ({ ...UU5.Environment.Lsi.Forms.colorPicker, ...UU5.Environment.Lsi.Forms.message })
    },
    //@@viewOff:statics

    //@@viewOn:propTypes
    propTypes: {
      value: UU5.PropTypes.string,
      enableCustomColor: UU5.PropTypes.bool,
      simplePalette: UU5.PropTypes.bool,
      required: UU5.PropTypes.bool,
      requiredMessage: UU5.PropTypes.any,
      borderRadius: UU5.PropTypes.string,
      bgStyle: UU5.PropTypes.oneOf(["filled", "outline", "transparent", "underline"]),
      elevation: UU5.PropTypes.oneOf(["-1", "0", "1", "2", "3", "4", "5", -1, 0, 1, 2, 3, 4, 5]),
      openToContent: UU5.PropTypes.oneOfType([UU5.PropTypes.bool, UU5.PropTypes.string])
    },
    //@@viewOff:propTypes

    //@@viewOn:getDefaultProps
    getDefaultProps() {
      return {
        value: null,
        enableCustomColor: false,
        simplePalette: false,
        borderRadius: null,
        bgStyle: null,
        elevation: null,
        openToContent: "xs",
        required: false,
        requiredMessage: undefined
      };
    },
    //@@viewOff:getDefaultProps

    //@@viewOn:reactLifeCycle
    getInitialState() {
      return {
        open: false
      };
    },

    componentWillReceiveProps(nextProps) {
      // run custom validation
      if (nextProps.controlled && typeof nextProps.onValidate === "function") {
        if (this.state.value !== nextProps.value) {
          let validationResult = nextProps.onValidate({ value: nextProps.value, event: null, component: this });
          if (validationResult) {
            this.setFeedback(validationResult.feedback, validationResult.message, validationResult.value);
          }
        }
      }
    },
    //@@viewOff:reactLifeCycle

    //@@viewOn:interface
    open(setStateCallback) {
      // stop openeing disabled component
      if (this.isComputedDisabled() || this.isReadOnly()) return;

      this.setState(state => (state.open ? null : { open: true }), setStateCallback);

      if (this._shouldOpenToContent()) {
        UU5.Common.Tools.scrollToTarget(
          this.getId() + "-button",
          false,
          UU5.Environment._fixedOffset + 20,
          this._findScrollElement(this._root)
        );
      }

      return this;
    },

    close(setStateCallback) {
      this.setState(state => (state.open ? { open: false } : null), setStateCallback);
      return this;
    },

    toggle(setStateCallback) {
      // stop toggling disabled component
      if (this.isComputedDisabled() || this.isReadOnly()) return;

      // togle open state
      this.setState(state => {
        // state open will be changed in future but now is false
        if (!state.open && this._shouldOpenToContent()) {
          UU5.Common.Tools.scrollToTarget(
            this.getId() + "-button",
            false,
            UU5.Environment._fixedOffset + 20,
            this._findScrollElement(this._root)
          );
        }
        return { open: !state.open };
      }, setStateCallback);
      return this;
    },

    isOpen() {
      return this.state.open;
    },

    onChangeDefault(opt, setStateCallback) {
      this.setValue(opt.value, () =>
        this.isOpen()
          ? this.close(setStateCallback)
          : typeof setStateCallback === "function"
          ? setStateCallback()
          : null
      );
    },
    //@@viewOff:interface

    //@@viewOn:overriding
    setValue_(value, setStateCallback) {
      let result;
      if (typeof this.props.onValidate === "function") {
        const validationResult = this.props.onValidate({ value, event: null, component: this });
        result = this.setFeedback(
          validationResult.feedback,
          validationResult.message,
          validationResult.value,
          setStateCallback
        );
      } else {
        result = this.setValueDefault(this._getValidColor(value, "setValue", true), setStateCallback);
      }

      return result;
    },

    getInitialValue_(value) {
      return this._getValidColor(value, "getInitialState");
    },

    setFeedback_(feedback, message, value, setStateCallback) {
      return this.setFeedbackDefault(
        feedback,
        message,
        this._getValidColor(value, "setFeedback", true),
        setStateCallback
      );
    },

    disable_(setStateCallback) {
      this.close();
      this.disableDefault(setStateCallback);
    },

    setDisabledValue_(value, setStateCallback) {
      this.close();
      this.setDisabledValueDefault(value, setStateCallback);
    },
    //@@viewOff:overriding

    //@@viewOn:private
    _registerRoot(ref) {
      this._root = ref;
    },

    _shouldOpenToContent() {
      let result = false;

      if (typeof this.props.openToContent === "string") {
        let screenSize = this.getScreenSize();
        this.props.openToContent
          .trim()
          .split(" ")
          .some(size => {
            if (screenSize == size) {
              result = true;
              return true;
            } else {
              return false;
            }
          });
      } else if (typeof this.props.openToContent === "boolean") {
        result = this.props.openToContent;
      }

      return result;
    },

    _getValidColor(value, method) {
      if (!value) return "";
      let newValue = Color.getValid(value);
      if (!newValue) {
        // invlaid value
        UU5.Common.Tools.error(`ColorPicker gets invalid value ${value}`, {
          function: method,
          component: "UU5.Forms.ColorPicker",
          id: this.getId()
        });
        newValue = "";
      }
      return newValue;
    },

    _checkRequired(value = this.getValue()) {
      let result = true;
      if (!value && this.props.required && this.shouldValidateRequired()) {
        result = false;
      }

      return result;
    },

    _open() {
      this.open();
    },

    _close(setStateCallback) {
      this.setState({ open: false }, () => {
        if (!this._checkRequired(this.state.value)) {
          this.setError(
            this.props.requiredMessage || this.getLsiComponent("requiredMessageChoice"),
            this.state.value,
            setStateCallback
          );
        } else {
          this.setInitial(null, this.state.value, setStateCallback);
        }
      });
    },

    _getButton() {
      let className = this.getClassName("pickerButton");
      if (!this.state.disabled && !this.state.readonly && this.state.feedback && this.state.feedback !== "initial") {
        switch (this.state.feedback) {
          case "success":
            className += " color-schema-" + UU5.Environment.getColorSchema("success");
            break;
          case "warning":
            className += " color-schema-" + UU5.Environment.getColorSchema("warning");
            break;
          case "error":
            className += " color-schema-" + UU5.Environment.getColorSchema("danger");
            className += " " + this.getClassName("buttonError");
            break;
        }
      } else if (this.props.colorSchema) {
        className += " color-schema-" + UU5.Environment.getColorSchema(this.props.colorSchema);
      }

      let props = {
        onClick: !this.isComputedDisabled() && !this.isReadOnly() ? this._open : null,
        key: "input-button",
        pressed: this.state.open,
        className,
        ref_: this._registerButton,
        id: this.getId() + "-button",
        disabled: this.isComputedDisabled() || this.isReadOnly(),
        bgStyle: this.props.bgStyle || "filled",
        borderRadius: this.props.borderRadius,
        elevation: this.props.elevation,
        mainAttrs: this.props.inputAttrs
      };

      return (
        <UU5.Bricks.Button {...props}>
          {this.isLoading() ? (
            <Loading className={this.getClassName("loading") + " " + ns.css("input-loading-icon")} id={this.getId()} />
          ) : (
            UU5.Common.Tools.wrapIfExists(
              UU5.Common.Fragment,
              <ColorPreview
                color={this.getValue() || null}
                size="s"
                width={24}
                borderRadius={this.props.borderRadius}
              />,
              <UU5.Bricks.Icon icon="mdi-menu-down" />,
              <span className="uu5-common-hidden" /> /* Disable special styles for icon:last-child from UU5  */
            )
          )}
        </UU5.Bricks.Button>
      );
    },

    _getMainAttrs() {
      let mainAttrs = this._getInputAttrs();
      mainAttrs.id = this.getId();
      mainAttrs.ref = this._registerRoot;

      if (this.isOpen()) {
        mainAttrs.className += " " + this.getClassName("open");
      }

      return mainAttrs;
    },

    _registerButton(button) {
      this._button = button;
    },

    _registerPopover(popover) {
      this._popover = popover;
      popover.open({
        aroundElement: this._button,
        onBeforeClose: () => this._changeColor({ value: this._colorForm.getColor() }, false),
        onClose: this._close,
        preventPositioning: this._shouldOpenToContent()
      });
    },

    _registerColorForm(colorForm) {
      this._colorForm = colorForm;
    },

    _changeColor(opt, doClose = true) {
      this.setState({ value: opt.value });
      if (doClose) this._close();
      if (typeof this.props.onChange === "function") {
        this.props.onChange({ value: opt.value, component: this });
      }
    },
    //@@viewOff:private

    //@@viewOn:render
    render() {
      let popoverClassName;
      if (this._shouldOpenToContent()) {
        popoverClassName = Css.css(`
          position: relative;
          width: 362px;
      `);
      }

      return (
        <div {...this._getMainAttrs()}>
          {this.getLabel(this.getId() + "-label")}
          {this.getInputWrapper([
            this._getButton(),
            this.state.open && (
              <UU5.Bricks.Popover ref_={this._registerPopover} shown forceRender className={popoverClassName}>
                <ColorPaletteForm
                  ref_={this._registerColorForm}
                  enableCustomColor={this.props.enableCustomColor}
                  simplePalette={this.props.simplePalette}
                  value={this.getValue()}
                  onChange={this._changeColor}
                />
              </UU5.Bricks.Popover>
            )
          ])}
        </div>
      );
    }
    //@@viewOff:render
  })
);

export default ColorPicker;
