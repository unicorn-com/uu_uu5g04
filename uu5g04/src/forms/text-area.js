/**
 * Copyright (C) 2021 Unicorn a.s.
 *
 * This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public
 * License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later
 * version.
 *
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied
 * warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License at
 * <https://gnu.org/licenses/> for more details.
 *
 * You may obtain additional information at <https://unicorn.com> or contact Unicorn a.s. at address: V Kapslovne 2767/2,
 * Praha 3, Czech Republic or at the email: info@unicorn.com.
 */

//@@viewOn:imports
import * as UU5 from "uu5g04";
import "uu5g04-bricks";
import ns from "./forms-ns.js";

import TextInput from "./internal/text-input.js";
import TextInputMixin from "./mixins/text-input-mixin.js";
import Context from "./form-context.js";

import "./text-area.less";
//@@viewOff:imports

export const TextArea = Context.withContext(
  UU5.Common.VisualComponent.create({
    displayName: "TextArea", // for backward compatibility (test snapshots)
    //@@viewOn:mixins
    mixins: [UU5.Common.BaseMixin, UU5.Common.PureRenderMixin, UU5.Common.ElementaryMixin, TextInputMixin],
    //@@viewOff:mixins

    //@@viewOn:statics
    statics: {
      tagName: ns.name("TextArea"),
      classNames: {
        main: ns.css("text-area"),
      },
      errors: {
        validateError: "Validated result is not object.",
      },
      lsi: () => UU5.Environment.Lsi.Forms.message,
    },
    //@@viewOff:statics

    //@@viewOn:propTypes
    propTypes: {
      value: UU5.PropTypes.string,
      rows: UU5.PropTypes.number,
      autoResize: UU5.PropTypes.bool,
      maxRows: UU5.PropTypes.number,
    },
    //@@viewOff:propTypes

    //@@viewOn:getDefaultProps
    getDefaultProps: function () {
      return {
        value: "",
        rows: 3,
        autoResize: false,
        maxRows: null,
      };
    },
    //@@viewOff:getDefaultProps

    //@@viewOn:reactLifeCycle
    UNSAFE_componentWillMount() {
      if (this.props.onValidate && typeof this.props.onValidate === "function") {
        this._validateOnChange({ value: this.state.value, event: null, component: this });
      } else {
        // this.setInitial(null, this.state.value)
      }

      return this;
    },

    UNSAFE_componentWillReceiveProps(nextProps) {
      if (this.props.controlled) {
        if (
          this.props.onValidate &&
          typeof this.props.onValidate === "function" &&
          (!nextProps.onChange || (this._isFocused && nextProps.validateOnChange))
        ) {
          this._validateOnChange({ value: nextProps.value, event: null, component: this }, true);
        } else {
          this.setFeedback(nextProps.feedback, nextProps.message, nextProps.value);
        }
      }
      return this;
    },

    //@@viewOff:reactLifeCycle

    //@@viewOn:interface
    //@@viewOff:interface

    //@@viewOn:overriding
    // TODO: tohle je ještě otázka - je potřeba nastavit hodnotu z jiné komponenty (musí být validace) a z onChange (neměla by být validace)
    setValue_(value, setStateCallback) {
      let _callCallback = typeof setStateCallback === "function";

      if (this._checkRequired({ value: value })) {
        if (typeof this.props.onValidate === "function") {
          _callCallback = false;
          this._validateOnChange({ value: value, event: null, component: this }, false, setStateCallback);
        } else {
          _callCallback = false;
          this.setInitial(null, value, setStateCallback);
        }
      }

      if (_callCallback) {
        setStateCallback();
      }

      return this;
    },
    //@@viewOff:overriding

    //@@viewOn:private
    _validateOnChange(opt, checkValue, setStateCallback) {
      let _callCallback = typeof setStateCallback === "function";

      if (!checkValue || this._hasValueChanged(this.state.value, opt.value)) {
        let result = typeof this.props.onValidate === "function" ? this.props.onValidate(opt) : null;
        if (result) {
          if (typeof result === "object") {
            if (result.feedback) {
              _callCallback = false;
              this.setFeedback(result.feedback, result.message, result.value, setStateCallback);
            } else {
              _callCallback = false;
              this.setState({ value: opt.value }, setStateCallback);
            }
          } else {
            this.showError("validateError", null, {
              context: { event: e, func: this.props.onValidate, result: result },
            });
          }
        }
      }

      if (_callCallback) {
        setStateCallback();
      }

      return this;
    },

    _onFocus(e) {
      let opt = { value: e.target.value, event: e, component: this };
      this._isFocused = true;

      if (typeof this.props.onFocus === "function") {
        this.props.onFocus(opt);
      } else {
        this.onFocusDefault(opt);
      }
    },

    _onBlur(e) {
      let opt = { value: e.target.value, event: e, component: this };
      this._isFocused = false;

      if (typeof this.props.onBlur === "function") {
        this.props.onBlur(opt);
      } else {
        this.onBlurDefault(opt);
      }
    },
    //@@viewOff:private

    //@@viewOn:render
    render: function () {
      let inputId = this.getId() + "-input";
      let inputAttrs = this.props.inputAttrs || {};

      inputAttrs.className === "" ? delete inputAttrs.className : null;
      return (
        <div {...this._getInputAttrs()}>
          {this.getLabel(inputId)}
          {this.getInputWrapper([
            <TextInput
              id={inputId}
              name={this.props.name || inputId}
              value={this.state.value}
              placeholder={this.props.placeholder}
              type={"textarea"}
              onChange={this.onChange}
              onBlur={this.onBlur}
              onFocus={this.onFocus}
              onKeyDown={this.onKeyDown}
              mainAttrs={inputAttrs}
              disabled={this.isComputedDisabled()}
              readonly={this.isReadOnly()}
              loading={this.isLoading()}
              rows={this.props.rows}
              autoResize={this.props.autoResize}
              maxRows={this.props.maxRows}
              ref_={(item) => (this._textInput = item)}
              feedback={this.getFeedback()}
              borderRadius={this.props.borderRadius}
              elevation={this.props.elevation}
              bgStyle={this.props.bgStyle}
              inputWidth={this._getInputWidth()}
              colorSchema={this.props.colorSchema}
              size={this.props.size}
              key="input"
            />,
          ])}
        </div>
      );
    },
    //@@viewOff:render
  })
);

export default TextArea;
