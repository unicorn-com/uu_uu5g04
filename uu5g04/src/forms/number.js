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
import React from "react";
import createReactClass from "create-react-class";
import PropTypes from "prop-types";
import * as UU5 from "uu5g04";
import "uu5g04-bricks";
import ns from "./forms-ns.js";
import TextInput from "./internal/text-input.js";

import TextInputMixin from "./mixins/text-input-mixin.js";

import ItemList from "./internal/item-list.js";

import Context from "./form-context.js";

import "./number.less";
//@@viewOff:imports

export const Number = Context.withContext(
  createReactClass({
    //@@viewOn:mixins
    mixins: [
      UU5.Common.BaseMixin,
      UU5.Common.PureRenderMixin,
      UU5.Common.ElementaryMixin,
      UU5.Common.ScreenSizeMixin,
      TextInputMixin
    ],
    //@@viewOff:mixins

    //@@viewOn:statics
    statics: {
      tagName: ns.name("Number"),
      classNames: {
        main: ns.css("number"),
        hiddenButtons: ns.css("number-hidden-buttons")
      },
      defaults: {
        regexpNumberParts: /\B(?=(\d{3})+(?!\d))/g,
        inputColWidth: "xs12 s4 m4 l3 xl3"
      },
      lsi: () => UU5.Common.Tools.merge({}, UU5.Environment.Lsi.Forms.number, UU5.Environment.Lsi.Forms.message)
    },
    //@@viewOff:statics

    //@@viewOn:propTypes
    propTypes: {
      value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
      step: PropTypes.number,
      min: PropTypes.number,
      max: PropTypes.number,
      decimals: PropTypes.number,
      decimalSeparator: PropTypes.string,
      thousandSeparator: PropTypes.string,
      rounded: PropTypes.bool,
      nanMessage: PropTypes.any,
      lowerMessage: PropTypes.any,
      upperMessage: PropTypes.any,
      buttonHidden: PropTypes.bool,
      suffix: PropTypes.string,
      prefix: PropTypes.string,
      hideSuffixOnFocus: PropTypes.bool,
      hidePrefixOnFocus: PropTypes.bool,
      decimalsView: PropTypes.number,
      decimalsViewRounded: PropTypes.oneOf(["round", "floor", "ceil"]),
      valueType: PropTypes.oneOf(["number", "string"])
    },
    //@@viewOff:propTypes

    //@@viewOn:getDefaultProps
    getDefaultProps() {
      return {
        value: null,
        step: 1,
        min: null,
        max: null,
        decimals: null,
        decimalSeparator: ",",
        thousandSeparator: "",
        rounded: false,
        nanMessage: null,
        lowerMessage: null,
        upperMessage: null,
        buttonHidden: false,
        decimalsView: undefined,
        decimalsViewRounded: "floor",
        suffix: undefined,
        prefix: undefined,
        hideSuffixOnFocus: false,
        hidePrefixOnFocus: false,
        valueType: "string"
      };
    },
    //@@viewOff:getDefaultProps

    //@@viewOn:reactLifeCycle
    componentWillMount() {
      this._isNaN = false;
      let value = this.state.value;

      if (typeof value === "number") {
        // to string
        value = value + "";
      }


      const multiplicator = Math.pow(10, this.props.decimals);
      value =
        this.props.rounded && this.props.decimals
          ? Math.round(value * multiplicator) / multiplicator
          : value;

      let result = this._setNumberResult({ value });

      if (this.props.onValidate && typeof this.props.onValidate === "function") {
        if (result) {
          if (typeof result === "object") {
            if (result.feedback) {
              this.setFeedback(result.feedback, result.message, result.value);
            } else {
              this._validateOnChange({ value, event: null, component: this });
            }
          }
        }
      } else {
        this.setState({ value });
      }
      return this;
    },

    componentWillReceiveProps(nextProps) {
      if (this.props.controlled) {
        let result = this._setNumberResult({ value: nextProps.value });

        if (this.props.onValidate && typeof this.props.onValidate === "function") {
          this._validateOnChange({ value: result.value, event: null, component: this }, true);
        } else if (result) {
          if (typeof result === "object") {
            if (result.feedback) {
              this.setFeedback(result.feedback, result.message, result.value);
            } else {
              this.setFeedback(nextProps.feedback, nextProps.message, nextProps.value);
            }
          }
        }
      }
      return this;
    },

    componentDidUpdate() {
      if (this._updateRange) {
        this._setCaretPosition(this._updateRange);
        delete this._updateRange;
      }
    },

    //@@viewOff:reactLifeCycle

    //@@viewOn:interface
    //@@viewOff:interface

    //@@viewOn:overriding
    // TODO: tohle je ještě otázka - je potřeba nastavit hodnotu z jiné komponenty (musí být validace) a z onChange (neměla by být validace)
    setValue_(value, setStateCallback) {
      if (this._checkRequired({ value })) {
        if (typeof this.props.onValidate === "function") {
          this._validateOnChange({ value: value, event: null, component: this });
        } else {
          this.setInitial(null, value, setStateCallback);
        }
      }

      return this;
    },

    onChangeDefault_(opt, setStateCallback) {
      let type = opt._data.type;
      if (type == "increase") {
        this._onIncreaseDefault(opt, setStateCallback);
      } else if (type == "decrease") {
        this._onDecreaseDefault(opt, setStateCallback);
      } else if (type == "input") {
        this._onChangeInputDefault(opt, setStateCallback);
      }

      return this;
    },

    onBlurDefault_(opt) {
      let blurResult;

      if (this._isNaN && !this.props.onValidate) {
        blurResult = { feedback: "initial", message: null, value: this.state.value };
      } else {
        opt = this._getOutputResult(opt);
        blurResult = this.getBlurFeedback(opt);
      }

      this._isNaN = false;

      let setNumberResult = this._setNumberResult(blurResult);
      let hasRequiredValue = this._checkRequired({ value: setNumberResult.value });
      if (hasRequiredValue && !this.props.validateOnChange) {
        setNumberResult.required = this.props.required;
        if (setNumberResult.feedback && setNumberResult.feedback) {
          this.setFeedback(setNumberResult.feedback, setNumberResult.message, setNumberResult.value);
        }
      } else if (!this.props.validateOnChange) {
        this.setError(this.props.requiredMessage || this.getLsiComponent("requiredMessage"), setNumberResult.value);
      } else {
        this.setFeedback(setNumberResult.feedback, setNumberResult.message, setNumberResult.value);
      }

      return this;
    },

    onFocusDefault_(opt) {
      let value = this._removePrefixandSuffix(this.state.value);
      let result = this.getFocusFeedback(opt);
      if (result) {
        this.setFeedback(result.feedback, result.message, result.value);
      } else {
        this.setFeedback(this.state.feedback, this.state.message, this.state.value === null ? this.state.value : value);
      }

      return this;
    },

    getValue_() {
      let value = this._getOutputResult({ value: this.state.value }).value;

      return value;
    },
    //@@viewOff:overriding

    //@@viewOn:private
    _getOutputResult(result) {
      if (result.value !== undefined) {
        if (typeof result._data === "object") {
          result._data.value = result.value;
        } else {
          result._data = { value: result.value };
        }

        if (this.props.valueType === "number") {
          let resultValue = parseFloat(this._parseNumberFromString(result.value));
          result.value = resultValue || typeof resultValue === "number" ? resultValue : null;
        }
      }

      return result;
    },

    _regexpQuote(text) {
      return text.replace(/[.?*+^$[\]\\(){}|]/g, "\\$&");
    },

    _doGetCaretPosition() {
      let iCaretPos = 0;

      if (this._textInput) {
        // Initialize
        let inputNode = this._textInput.findDOMNode();
        // IE Support
        if (document.selection) {
          // Set focus on the element
          inputNode.focus();
          // To get cursor position, get empty selection range
          let oSel = document.selection.createRange();
          // Move selection start to 0 position
          oSel.moveStart("character", -inputNode.value.length);
          // The caret position is selection length
          iCaretPos = oSel.text.length;
        }
        // Firefox support
        else if (inputNode.selectionStart || inputNode.selectionStart == "0") iCaretPos = inputNode.selectionStart;
        // Return results
      }

      return iCaretPos;
    },

    _setCaretPosition(caretPosStart, caretPosEnd = caretPosStart) {
      let elem = this._textInput.findDOMNode().querySelector("input");
      if (elem != null) {
        if (elem.createTextRange) {
          let range = elem.createTextRange();
          range.move("character", caretPosStart);
          range.select();
        } else {
          if (elem.selectionStart >= 0) {
            elem.focus();
            elem.setSelectionRange(caretPosStart, caretPosEnd);
          } else elem.focus();
        }
      }
    },

    _onMouseUp(e) {
      if (this.props.prefix || this.props.suffix) {
        e.persist();
        let cursorPosition = this._doGetCaretPosition();
        let maxPosition = this.props.suffix ? e.target.value.length - this.props.suffix.length : e.target.value.length;
        let minPosition = this.props.prefix ? this.props.prefix.length : 0;
        if (this._isFocused) {
          if (!this.props.hideSuffixOnFocus && cursorPosition === e.target.value.length) {
            this._setCaretPosition(maxPosition);
          } else if (!this.props.hidePrefixOnFocus && cursorPosition === 0) {
            this._setCaretPosition(minPosition);
          }
        }
        if (this.props.prefix && this._isFocused && !this.props.hidePrefixOnFocus) {
          if (cursorPosition < minPosition) {
            setTimeout(() => {
              this._setCaretPosition(minPosition);
            }, 0);
          }
        }
        if (this.props.suffix && this._isFocused && !this.props.hideSuffixOnFocus) {
          if (cursorPosition >= maxPosition) {
            setTimeout(() => {
              this._setCaretPosition(maxPosition);
            }, 0);
          }
        }
      }
    },

    _onKeyDown(e) {
      if (this.props.prefix || this.props.suffix) {
        e.persist();
        if (!e.shiftKey) {
          let cursorPosition = this._doGetCaretPosition();
          let maxPosition = this.props.suffix
            ? e.target.value.length - this.props.suffix.length
            : e.target.value.length;
          let minPosition = this.props.prefix ? this.props.prefix.length : 0;
          // 36 - Home, 40 - ArrowDown, 37 - ArrowLeft
          if (
            (!this.props.hidePrefixOnFocus && this._isFocused && e.keyCode === 36) ||
            e.keyCode === 38 ||
            (e.metaKey && e.keyCode === 37)
          ) {
            e.preventDefault();
            this._setCaretPosition(minPosition);
            return;
          }
          // 35 - End, 38 - ArrowUp, 39 - ArrowRight
          if (
            (!this.props.hideSuffixOnFocus && this._isFocused && e.keyCode === 35) ||
            e.keyCode === 40 ||
            (e.metaKey && e.keyCode === 39)
          ) {
            e.preventDefault();
            this._setCaretPosition(maxPosition);
            return;
          }
          if (!this.props.hidePrefixOnFocus && this._isFocused && this.props.prefix) {
            // 37 - ArrowLeft, 8 - Backspace
            if (e.keyCode === 37 || e.keyCode === 8) {
              if (cursorPosition <= minPosition) {
                e.preventDefault();
                setTimeout(() => {
                  this._setCaretPosition(minPosition);
                }, 0);
              }
            }
            if (!this.props.hideSuffixOnFocus && this._isFocused && this.props.suffix) {
              // 39 - Arrowright, 40 - ArrowDown, 32 - space, 46 - Delete
              if (e.keyCode === 39 || e.keyCode === 32 || e.keyCode === 46) {
                if (cursorPosition >= maxPosition) {
                  e.preventDefault();
                  setTimeout(() => {
                    this._setCaretPosition(maxPosition);
                  }, 0);
                }
              }
            }
          }
        }
      }
    },

    _parseNumberFromString(
      value = this.state.value,
      decimalSeparator = this.props.decimalSeparator,
      thousandSeparator = this.props.thousandSeparator
    ) {
      let parsedNumber = UU5.Common.Tools.normalizeNumberSeparators(value, { thousandSeparator, decimalSeparator });
      parsedNumber = parsedNumber || parsedNumber === 0 ? parsedNumber.toString() : parsedNumber;
      return this._removePrefixandSuffix(parsedNumber);
    },

    _formatOutput(value, maxDecimals, showThousandSeparator) {
      let numberValue;

      numberValue = typeof value === "string" ? this._parseNumberFromString(value) : value;

      let minDecimals;
      if (numberValue) {
        let decimals = numberValue.toString().split(".");
        if (decimals[1] && decimals[1].length >= maxDecimals) {
          minDecimals = maxDecimals;
        }
      }

      return UU5.Common.Tools.formatNumber(numberValue, {
        minDecimals,
        maxDecimals,
        roundType: this.props.decimalsViewRounded,
        thousandSeparator: showThousandSeparator ? this.props.thousandSeparator : "",
        decimalSeparator: this.props.decimalSeparator
      });
    },

    _removePrefixandSuffix(value) {
      if (typeof value === "string") {
        value = this.props.prefix ? value.replace(this.props.prefix, "") : value;
        value = this.props.suffix ? value.replace(this.props.suffix, "") : value;
      }

      return value;
    },

    _suffix() {
      let suffix;
      suffix = "";
      if (this.props.suffix) {
        suffix = this.props.suffix;
        if (this.props.hideSuffixOnFocus && this._isFocused) {
          suffix = "";
        }
      }
      return suffix;
    },

    _prefix() {
      let prefix;
      prefix = "";
      if (this.props.prefix) {
        prefix = this.props.prefix;
        if (this.props.hidePrefixOnFocus && this._isFocused) {
          prefix = "";
        }
      }
      return prefix;
    },

    _correctCursorFireFoxAndIe(e) {
      e.preventDefault();
      //correct position of cursor when focusing input in FireFox and IE
      let isFireFox = window.navigator.userAgent.match("Firefox");
      let isIE = UU5.Common.Tools.isIE();
      if (isFireFox || isIE) {
        let cursorPosition = this._doGetCaretPosition();
        if (!this.props.suffix && !this.props.prefix) {
          setTimeout(() => {
            this._setCaretPosition(cursorPosition);
          }, 0);
        } else if (this.props.suffix || this.props.prefix) {
          let minPosition = this.props.prefix ? this.props.prefix.length : 0;
          let maxPosition = this.props.suffix
            ? e.target.value.length - this.props.suffix.length
            : e.target.value.length;
          if ((isFireFox || isIE) && cursorPosition > minPosition && cursorPosition < maxPosition) {
            setTimeout(() => {
              this._setCaretPosition(cursorPosition);
            }, 0);
          }
        }
      }
    },

    _correctCursorPosition(e) {
      e.preventDefault();
      // correct cursor position onChange when is before prefix or after suffix
      if (this.props.prefix || this.props.suffix) {
        let cursorPosition = this._doGetCaretPosition();
        let suffixRegExp = new RegExp("\\" + this.props.suffix, "g");
        let hasSuffix = !!e.target.value.match(suffixRegExp);
        let minPosition = this.props.prefix ? this.props.prefix.length : 0;
        let maxPosition = this.props.suffix
          ? e.target.value.length - (hasSuffix ? this.props.suffix.length : 0)
          : e.target.value.length;
        if (this._isFocused && !this.props.hidePrefixOnFocus) {
          if (cursorPosition < minPosition) {
            setTimeout(() => {
              this._setCaretPosition(minPosition);
            }, 0);
          }
        }
        if (this._isFocused && !this.props.hideSuffixOnFocus) {
          if (cursorPosition > maxPosition || (this.props.suffix && !hasSuffix)) {
            setTimeout(() => {
              this._setCaretPosition(maxPosition);
            }, 0);
          }
        }
      }
    },

    _checkNumberResultChange(opt) {
      if (opt.value) {
        opt.value = opt.value.toString();
        let isComma = opt.value.indexOf(",") > 0;
        opt.value = this._parseNumberFromString(opt.value, this.props.decimalSeparator, this.props.thousandSeparator);
        let isNan = isNaN(opt.value);
        if (isNan && opt.value != "-") {
          this._updateRange = this._doGetCaretPosition() - 1;
          opt.value = this.state.value;
          opt.feedback = "warning";
          opt.message = this.props.nanMessage || this.getLsiValue("nanMessage");
          this._isNaN = true;
        } else {
          this._isNaN = false;
        }
        isComma && (opt.value = opt.value.replace(".", ","));
      }
      return opt;
    },

    _checkNumberResult(opt) {
      opt = { ...opt };

      if (opt.value || opt.value === 0) {
        opt = this._checkNumberResultChange(opt);
        let isComma = opt.value && opt.value.indexOf(",") > 0;
        opt.value = this._parseNumberFromString(opt.value);
        let number = parseFloat(opt.value);

        if ((this.props.min || this.props.min === 0) && number < this.props.min) {
          opt.feedback = "error";
          opt.message = this.props.lowerMessage || this.getLsiValue("lowerMessage", undefined, this.props.min);
        }

        if ((this.props.max || this.props.max === 0) && number > this.props.max) {
          opt.feedback = "error";
          opt.message = this.props.upperMessage || this.getLsiComponent("upperMessage", undefined, this.props.max);
        }

        isComma && (opt.value = opt.value.replace(".", ","));
      }

      return opt;
    },

    _setNumberResult(opt) {
      opt = { ...opt };
      let result = this._checkNumberResult(opt);
      if (opt.value || opt.value === 0) {
        let number = this._parseNumberFromString(opt.value);

        if (this.props.rounded && this.props.decimals && number) {
          let exp = this.props.decimals ? -1 * this.props.decimals : 0;
          number = UU5.Common.Tools.round10(parseFloat(number), exp).toString();
        }

        let numberParts = number.split(".");

        if (this.props.thousandSeparator) {
          numberParts[0] = numberParts[0].replace(this.getDefault().regexpNumberParts, this.props.thousandSeparator);
        }
        if (numberParts.length > 1) {
          if (this.props.decimals && this.props.decimals < numberParts[1].length) {
            numberParts[1] = numberParts[1].slice(0, this.props.decimals - numberParts[1].length);
          }
          result.value = numberParts[0] + this.props.decimalSeparator + numberParts[1];
        } else {
          result.value = numberParts[0];
        }
      }

      result = this._getOutputResult(result);

      return result;
    },

    _onChange(e) {
      this._correctCursorPosition(e);
      let opt = { value: e.target.value, event: e, component: this, _data: { type: "input" } };
      this.props.prefix || this.props.suffix ? (opt.value = this._removePrefixandSuffix(opt.value)) : null;
      let checkNumberResult = this._checkNumberResultChange(opt);
      if (checkNumberResult.feedback && checkNumberResult.feedback === "warning") {
        this.setFeedback(checkNumberResult.feedback, checkNumberResult.message, checkNumberResult.value);
      } else {
        opt = this._getOutputResult(opt);
        if (!this.isComputedDisabled() && !this.isReadOnly()) {
          if (typeof this.props.onChange === "function") {
            this.props.onChange(opt);
          } else {
            this.onChangeDefault(opt);
          }
        }
      }
      return this;
    },

    _onChangeInputDefault(opt, setStateCallback) {
      let _callCallback = typeof setStateCallback === "function";

      if (this.props.validateOnChange) {
        _callCallback = false;
        this._validateOnChange(opt, false, setStateCallback);
      } else {
        if (this._checkRequired({ value: opt.value })) {
          opt = { ...opt };
          opt.value = opt._data.value !== undefined ? opt._data.value : opt.value;
          opt.required = this.props.required;
          let result = this.getChangeFeedback(opt);
          _callCallback = false;
          this.setFeedback(result.feedback, result.message, result.value, setStateCallback);
        }
      }

      if (_callCallback) {
        setStateCallback();
      }
    },

    _onDecreaseDefault(opt, setStateCallback) {
      let feedback = opt._data.feedback;
      opt = { ...opt };
      opt.value = opt._data.value;

      if (feedback === "error") {
        this.setValue_(opt.value, () => {
          this._decreaseEnd();
          if (typeof setStateCallback === "function") {
            setStateCallback();
          }
        });
      } else {
        this.setValue_(opt.value, setStateCallback);
      }

      return this;
    },

    _onIncreaseDefault(opt, setStateCallback) {
      let feedback = opt._data.feedback;
      opt = { ...opt };
      opt.value = opt._data.value;

      if (feedback === "error") {
        this.setValue_(opt.value, () => {
          this._increaseEnd();
          if (typeof setStateCallback === "function") {
            setStateCallback();
          }
        });
      } else {
        this.setValue_(opt.value, setStateCallback);
      }

      return this;
    },

    _onBlur(e) {
      this._isFocused = false;
      let opt = { value: e.target.value, event: e, component: this };
      opt.value = opt.value ? this._parseNumberFromString(opt.value) : opt.value;
      opt = this._getOutputResult(opt);

      if (typeof this.props.onBlur === "function") {
        this.props.onBlur(opt);
      } else {
        this.onBlurDefault(opt);
      }

      return this;
    },

    _onFocus(e) {
      this._isFocused = true;
      this._correctCursorFireFoxAndIe(e);
      let opt = { value: e.target.value, event: e, component: this };
      opt = this._getOutputResult(opt);

      if (typeof this.props.onFocus === "function") {
        this.props.onFocus(opt);
      } else {
        this.onFocusDefault(opt);
      }

      return this;
    },

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
              opt = { ...opt };
              opt.value = opt._data && opt._data.value !== undefined ? opt._data.value : opt.value;
              this.setState({ value: opt.value }, setStateCallback);
            }
          } else {
            this.showError("validateError", null, {
              context: {
                event: e,
                func: this.props.onValidate,
                result: result
              }
            });
          }
        }
      }

      if (_callCallback) {
        setStateCallback();
      }

      return this;
    },

    /*_getFeedbackIcon(){
      let icon = this.props.required ? this.props.successIcon : null;
      switch (this.getFeedback()) {
        case 'success':
          icon = this.props.successIcon;
          break;
        case 'warning':
          icon = this.props.warningIcon;
          break;
        case 'error':
          icon = this.props.errorIcon;
          break;
      }
      return icon;
    },*/

    _decrease(e) {
      //TODO: optimize
      let value = this.state.value || this.state.value === 0 ? this.state.value : this.props.min + 1;
      let number = this._formatOutput(value).replace(this.props.decimalSeparator, ".");
      let decimal = this._formatOutput(value).split(this.props.decimalSeparator);
      let valueDecimals = decimal[1] ? decimal[1].length : 0;
      let stepDecimals = this.props.step.toString().split(".")[1] ? this.props.step.toString().split(".")[1].length : 0;
      if (valueDecimals > 0 || stepDecimals > 0) {
        let pow = Math.pow(10, valueDecimals > stepDecimals ? valueDecimals : stepDecimals);
        number = (number * pow - this.props.step * pow) / pow;
      } else {
        number = parseInt(number) - this.props.step;
      }

      let result = this._setNumberResult({ value: number.toString() });
      let opt = {
        value: result.value,
        event: e,
        component: this,
        _data: { type: "decrease", feedback: result.feedback }
      };
      opt = this._getOutputResult(opt);

      if (typeof this.props.onChange === "function") {
        this.props.onChange(opt);
      } else {
        this.onChangeDefault(opt);
      }
      return this;
    },

    _increase(e) {
      //TODO: optimize
      let value = this.state.value || this.state.value === 0 ? this.state.value : this.props.min - 1;
      let number = this._formatOutput(value).replace(this.props.decimalSeparator, ".");
      let decimal = this._formatOutput(value).split(this.props.decimalSeparator);
      let valueDecimals = decimal[1] ? decimal[1].length : 0;
      let stepDecimals = this.props.step.toString().split(".")[1] ? this.props.step.toString().split(".")[1].length : 0;
      if (valueDecimals > 0 || stepDecimals > 0) {
        let pow = Math.pow(10, valueDecimals > stepDecimals ? valueDecimals : stepDecimals);
        number = (number * pow + this.props.step * pow) / pow;
      } else {
        number = parseInt(number) + this.props.step;
      }
      let result = this._setNumberResult({ value: number.toString() });
      let opt = {
        value: result.value,
        event: e,
        component: this,
        _data: { type: "increase", feedback: result.feedback }
      };
      opt = this._getOutputResult(opt);

      if (typeof this.props.onChange === "function") {
        this.props.onChange(opt);
      } else {
        this.onChangeDefault(opt);
      }
      return this;
    },

    _isDisabled(type) {
      let result = false;

      if (this.state.value || this.state.value === 0) {
        let value = this.state.value || 0;
        let number = parseFloat(value.toString().replace(this.props.decimalSeparator, "."));
        if (type === "min" && typeof this.props.min === "number") {
          if (number <= this.props.min) {
            result = true;
          }
        } else if (type === "max" && typeof this.props.max === "number") {
          if (number >= this.props.max) {
            result = true;
          }
        }
      }
      return result;
    },

    _increaseStart(e) {
      this._increaseTimeout = setTimeout(() => {
        this._increaseTimer = UU5.Environment.TimeManager.setInterval(() => this._increase(e), 100);
      }, 300);
    },

    _increaseEnd() {
      this._increaseTimeout && clearTimeout(this._increaseTimeout);
      this._increaseTimer && UU5.Environment.TimeManager.clearInterval(this._increaseTimer);
    },

    _decreaseStart(e) {
      this._decreaseTimeout = setTimeout(() => {
        this._decreaseTimer = UU5.Environment.TimeManager.setInterval(() => this._decrease(e), 100);
      }, 300);
    },

    _decreaseEnd() {
      this._decreaseTimeout && clearTimeout(this._decreaseTimeout);
      this._decreaseTimer && UU5.Environment.TimeManager.clearInterval(this._decreaseTimer);
    },
    //@@viewOff:private

    //@@viewOn:render
    render() {
      let inputId = this.getId() + "-input";
      let buttons =
        !this.isReadOnly() && !this.props.buttonHidden
          ? [
              {
                icon: "mdi-minus",
                disabled: this.isComputedDisabled() || this._isDisabled("min"),
                onClick: (component, e) => this._decrease(e),
                size: this.props.size,
                colorSchema: this.props.colorSchema,
                mainAttrs: {
                  onMouseDown: this._decreaseStart,
                  onMouseUp: this._decreaseEnd,
                  onMouseOut: this._decreaseEnd
                }
              },
              {
                icon: "mdi-plus",
                disabled: this.isComputedDisabled() || this._isDisabled("max"),
                onClick: (component, e) => this._increase(e),
                size: this.props.size,
                colorSchema: this.props.colorSchema,
                mainAttrs: {
                  onMouseDown: this._increaseStart,
                  onMouseUp: this._increaseEnd,
                  onMouseOut: this._increaseEnd
                }
              }
            ]
          : null;

      let inputAttrs = this.props.inputAttrs || {};
      inputAttrs.className === "" ? delete inputAttrs.className : null;
      inputAttrs.onMouseUp = this._onMouseUp;
      inputAttrs.onKeyDown = this._onKeyDown;
      let value;

      if (this.state.value || this.state.value === 0) {
        value = this._prefix();
        if (this._isFocused) {
          value += this.state.value;
        } else {
          value += this._formatOutput(this.state.value, this.props.decimalsView, true);
        }
        value += this._suffix();
      } else {
        value = "";
      }

      let attrs = this._getInputAttrs();
      if (this.props.buttonHidden) {
        attrs.className += " " + this.getClassName("hiddenButtons");
      }

      return (
        <div {...attrs}>
          {this.getLabel(inputId)}
          {this.getInputWrapper(
            [
              <TextInput
                id={inputId}
                name={this.props.name || inputId}
                value={value}
                placeholder={this.props.placeholder}
                type="text"
                onChange={this._onChange}
                onBlur={this._onBlur}
                onFocus={this._onFocus}
                onKeyDown={this.onKeyDown}
                mainAttrs={inputAttrs}
                disabled={this.isComputedDisabled()}
                readonly={this.isReadOnly()}
                loading={this.isLoading()}
                ref_={item => (this._textInput = item)}
                feedback={this.getFeedback()}
                borderRadius={this.props.borderRadius}
                elevation={this.props.elevation}
                bgStyle={this.props.bgStyle}
                inputWidth={this._getInputWidth()}
                colorSchema={this.props.colorSchema}
                size={this.props.size}
              />,

              <ItemList {...this._getItemListProps()}>{this._getChildren()}</ItemList>,
              <UU5.Bricks.Backdrop {...this._getBackdropProps()} />
            ],
            buttons
          )}
        </div>
      );
    }
    //@@viewOn:render
  })
);

export default Number;
