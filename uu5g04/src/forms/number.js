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

//@@viewOn:revision
// coded: Martin Mach, 30.11.2020
// reviewed: -
//@@viewOff:revision

//@@viewOn:imports
import * as UU5 from "uu5g04";
import "uu5g04-bricks";
import { Utils } from "uu5g05";
import ns from "./forms-ns.js";
import TextInput from "./internal/text-input.js";
import TextInputMixin from "./mixins/text-input-mixin.js";
import ItemList from "./internal/item-list.js";
import Context from "./form-context.js";
import withUserPreferences from "../common/user-preferences";

import "./number.less";
//@@viewOff:imports

function isSameNumber(a, b) {
  return (
    (a === b && a) || // check if both values are same, except 0 (0 === -0) and NaN (NaN !== NaN)
    (Number.isNaN(a) && Number.isNaN(b)) || // check if both values are NaN
    (a === 0 && b === 0 && 1 / a === 1 / b) // check if both values are same zero (positive or negative)
  );
}

// NOTE Copied from uu5g05-forms (number-input.js), keep in sync.
function transformPastedTextToNumberString(text, groupingSeparator, decimalSeparator) {
  let numberString;
  let ambiguous = false;
  let numbersAndSepsOnly = text.match(/-?\d+[.,\s0-9]*|-?[.,]\d+[.,\s0-9]*/)?.[0]?.trim() || ""; // use only first number
  let negativePrefix = numbersAndSepsOnly[0] === "-" ? "-" : "";
  if (negativePrefix) numbersAndSepsOnly = numbersAndSepsOnly.slice(1).trim();
  numbersAndSepsOnly = numbersAndSepsOnly.replace(/[.,\s]+$/, ""); // ignore separators at the end

  // numbersAndSepsOnly now contains e.g. "1,2" or "1.456.3" or ".,23452...23" or "1 234.567"
  let dotCount = numbersAndSepsOnly.split(".").length - 1;
  let commaCount = numbersAndSepsOnly.split(",").length - 1;
  let isWellFormedWithSpaceAsThousandSeparator =
    dotCount + commaCount <= 1 && // at most 1 occurrence of , or .
    numbersAndSepsOnly.includes(" ") && // has space
    !numbersAndSepsOnly.split(/[.,]/)[1]?.includes(" "); // there is no space after , or .
  if ((dotCount > 0 && commaCount > 0) || isWellFormedWithSpaceAsThousandSeparator) {
    // both types of separators => use last of separators as decimal point
    let parts = numbersAndSepsOnly.replace(/\s+/g, "").split(/[.,]/);
    let decimalPart = parts.length > 1 ? parts.pop() : "";
    numberString = parts.join("") + (decimalPart && !decimalPart.match(/^0+$/) ? "." + decimalPart : ""); // strip .00 from the end to make it clearer for user
  } else if (dotCount > 0 || commaCount > 0) {
    // single type of separator
    let separatorCount = dotCount || commaCount;
    let separatorChar = dotCount > 0 ? "." : ",";
    let isGrouppedByTriples = numbersAndSepsOnly
      .split(separatorChar)
      .slice(1)
      .every((it) => it.length === 3);
    if (isGrouppedByTriples) {
      // e.g. "2,134,567,890" or "1,234"
      if (separatorCount > 1 || groupingSeparator === separatorChar) {
        // 1,234,567 or (1,234 && we use ',' for thousands) => 1234567 or 1234; dtto for "."
        numberString = numbersAndSepsOnly.replace(/\s+/g, "").replaceAll(separatorChar, "");
        ambiguous = separatorCount === 1;
      } else {
        // 1,234 && we don't use "," for thousands => use 1.234 and warn
        numberString = numbersAndSepsOnly.replace(/\s+/g, "").replace(separatorChar, ".").replace(/\.0*$/, "");
        ambiguous = true;
      }
    } else {
      // e.g. "2134,56,789" or "1,23" => use last of separators as decimal point
      let parts = numbersAndSepsOnly.replace(/\s+/g, "").split(separatorChar);
      let decimalPart = parts.pop();
      numberString = parts.join("") + (decimalPart && !decimalPart.match(/^0+$/) ? "." + decimalPart : ""); // strip .00 from the end to make it clearer for user
    }
  } else {
    // no separators present => use as-is
    numberString = numbersAndSepsOnly.replace(/\s+/g, "");
  }

  let fullNumberString =
    numberString && !Number.isNaN(Number(numberString)) ? negativePrefix + numberString : undefined;
  return {
    numberString: fullNumberString,
    ambiguous,
  };
}

let NumberComponent = Context.withContext(
  UU5.Common.VisualComponent.create({
    displayName: "Number", // for backward compatibility (test snapshots)
    //@@viewOn:mixins
    mixins: [
      UU5.Common.BaseMixin,
      UU5.Common.PureRenderMixin,
      UU5.Common.ElementaryMixin,
      UU5.Common.ScreenSizeMixin,
      TextInputMixin,
    ],
    //@@viewOff:mixins

    //@@viewOn:statics
    statics: {
      tagName: ns.name("Number"),
      classNames: {
        main: ns.css("number"),
        hiddenButtons: ns.css("number-hidden-buttons"),
      },
      defaults: {
        regexpNumberParts: /\B(?=(\d{3})+(?!\d))/g,
        regexpExponent: /e\+\d+$/,
        inputColWidth: "xs12 s4 m4 l3 xl3",
      },
      lsi: () => UU5.Common.Tools.merge({}, UU5.Environment.Lsi.Forms.number, UU5.Environment.Lsi.Forms.message),
    },
    //@@viewOff:statics

    //@@viewOn:propTypes
    propTypes: {
      value: UU5.PropTypes.oneOfType([UU5.PropTypes.number, UU5.PropTypes.string]),
      step: UU5.PropTypes.number,
      min: UU5.PropTypes.number,
      max: UU5.PropTypes.number,
      decimals: UU5.PropTypes.number,
      decimalSeparator: UU5.PropTypes.string,
      thousandSeparator: UU5.PropTypes.string,
      rounded: UU5.PropTypes.bool,
      nanMessage: UU5.PropTypes.any,
      lowerMessage: UU5.PropTypes.any,
      upperMessage: UU5.PropTypes.any,
      buttonHidden: UU5.PropTypes.bool,
      suffix: UU5.PropTypes.string,
      prefix: UU5.PropTypes.string,
      hideSuffixOnFocus: UU5.PropTypes.bool,
      hidePrefixOnFocus: UU5.PropTypes.bool,
      decimalsView: UU5.PropTypes.number,
      decimalsViewRounded: UU5.PropTypes.oneOf(["round", "floor", "ceil"]),
      valueType: UU5.PropTypes.oneOf(["number", "string"]),
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
        valueType: "string",
      };
    },
    //@@viewOff:getDefaultProps

    //@@viewOn:reactLifeCycle
    getInitialState() {
      this._currentProps = {};
      this._localizedValueStack = [];
      this._setCurrentProps(this.props);
      return {};
    },

    UNSAFE_componentWillMount() {
      // !!! Value in state must always be "localized", i.e. it's what user sees and will be editing, and it uses separators from props.
      let value = this.state.value; // value in state is wrong (non-localized) because it was copied there from props.value in mixin and props.value
      let { feedback, message, value: localizedValue } = this._getLocalizedValueWithFeedback(value, false);
      if (typeof this._currentProps.onValidate === "function") {
        if (feedback) {
          this._localizedSetFeedback(feedback, message, localizedValue);
        } else {
          let valueTypedValue = this._getValueTypedValue(localizedValue);
          this._validateOnChange({
            value: valueTypedValue,
            event: null,
            component: this,
            _data: { value: localizedValue },
          });
        }
      } else {
        this.setState({ value: localizedValue });
      }
      return this;
    },

    UNSAFE_componentWillReceiveProps(nextProps) {
      if (nextProps.controlled) {
        let result;
        // if input is focused and current value is for example "-" and new value is NaN we can be sure that
        // nextProps value was returned by onChange callback and set into props by updating state of the parent component
        // that means that value wasn't change and we can use formated value from input as a new value
        // otherwise is impossible to update value in prop in onChange callback
        let currentLocalizedValue = this.state.value;
        if (this._isFocused) {
          let rootNode = UU5.Common.DOM.findNode(this._textInput);
          let inputNode = rootNode && rootNode.querySelector("input");
          if (inputNode) currentLocalizedValue = this._removePrefixAndSuffix(inputNode.value);
        }
        let currentNumber = this._parseNumberFromLocalizedString(currentLocalizedValue);

        // if new value from prop is logically same number as the one in our state then use
        // current state instead of formatting the props.value
        this._setCurrentProps(nextProps);
        result = this._getLocalizedValueWithFeedback(nextProps.value, false);
        let nextNumber = this._parseNumberFromLocalizedString(result.value);
        if (
          isSameNumber(nextNumber, currentNumber) &&
          this.props.thousandSeparator === nextProps.thousandSeparator &&
          this.props.decimalSeparator === nextProps.decimalSeparator
        ) {
          result.value = currentLocalizedValue;
        }

        // see comment in _getValueTypedValue
        if (nextProps.value == null && currentLocalizedValue === "-") {
          result.value = currentLocalizedValue;
        }

        if (result.value === currentLocalizedValue) {
          this.setState({ value: currentLocalizedValue });
        } else if (
          nextProps.onValidate &&
          typeof nextProps.onValidate === "function" &&
          (!nextProps.onChange || (this._isFocused && nextProps.validateOnChange))
        ) {
          let valueTypedValue = this._getValueTypedValue(result.value);
          this._validateOnChange(
            { value: valueTypedValue, event: null, component: this, _data: { value: result.value } },
            true
          );
        } else {
          if (result.feedback) {
            this._updateFeedback(result.feedback, result.message, result.value);
          } else {
            this._updateFeedback(nextProps.feedback, nextProps.message, result.value);
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
    setFeedback_(feedback, message, value, setStateCallback) {
      // NOTE This component requires state.value to be "localizedValue", but API methods require sending of value-typed value
      // so we pretty much assume that developer doesn't change the value that we're sending to onChangeFeedback(), ... methods
      // and take "localizedValue" that we wanted to use when we were triggerring that onChangeFeedback(), ... method
      // (and only if this setFeedback() got called explicitly outside of our component then convert it to localized value directly).
      let localizedValue =
        this._localizedValueStack.length > 0
          ? this._localizedValueStack[this._localizedValueStack.length - 1]
          : this._getLocalizedValueWithFeedback(value).value;
      return this.setFeedbackDefault(feedback, message, localizedValue, setStateCallback);
    },

    // TODO: tohle je ještě otázka - je potřeba nastavit hodnotu z jiné komponenty (musí být validace) a z onChange (neměla by být validace)
    setValue_(valueInUnknownFormat, setStateCallback) {
      let validationResult = this._getLocalizedValueWithFeedback(valueInUnknownFormat, false);
      let { feedback, value: localizedValue } = validationResult;
      if (this._checkRequiredValue({ value: localizedValue })) {
        if ((feedback === "initial" || feedback === undefined) && typeof this._currentProps.onValidate === "function") {
          let valueTypedValue = this._getValueTypedValue(localizedValue);
          this._validateOnChange(
            { value: valueTypedValue, event: null, component: this, _data: { value: localizedValue } },
            false,
            false,
            setStateCallback
          );
        } else {
          this._localizedSetInitial(null, localizedValue, setStateCallback);
        }
      }

      return this;
    },

    onChangeDefault_(opt, setStateCallback) {
      let type = opt._data.type;
      if (type == "increase" || type == "decrease") {
        this._onIncreaseDecreaseDefault(opt, type, setStateCallback);
      } else if (type == "input") {
        this._onChangeInputDefault(opt, setStateCallback);
      }

      return this;
    },

    onBlurDefault_(opt) {
      // NOTE opt.value is value-typed.
      // set feedback runs all validations but in exception of onChange validation input isn"t marked as focused
      this._updateFeedback(this.state.feedback, null, this.state.value, () => {
        let localizedResult;
        if (Number.isNaN(this._parseNumberFromLocalizedString(this.state.value)) && !this._currentProps.onValidate) {
          localizedResult = { feedback: "initial", message: null, value: this.state.value };
        } else {
          let result = this._getLocalizedValueWithFeedback(opt.value, true);
          if (!result.feedback || result.feedback === "initial") {
            localizedResult = this.getBlurFeedback(opt);
          } else {
            localizedResult = {};
          }
          Object.assign(localizedResult, this._getLocalizedValueWithFeedback(opt.value, true));
        }

        let hasRequiredValue = this._checkRequiredValue({ value: localizedResult.value });
        if (hasRequiredValue && !this.props.validateOnChange) {
          this._updateFeedback(localizedResult.feedback, localizedResult.message, localizedResult.value);
        } else if (!hasRequiredValue && !this.props.validateOnChange) {
          this._localizedSetError(
            this._currentProps.requiredMessage || this.getLsiComponent("requiredMessage"),
            localizedResult.value
          );
        } else {
          this._updateFeedback(localizedResult.feedback, localizedResult.message, localizedResult.value);
        }
      });

      return this;
    },

    onFocusDefault_(opt) {
      let result = this.getFocusFeedback();
      if (result) {
        this._updateFeedback(result.feedback, result.message, opt._data.value);
      } else {
        this._updateFeedback(this.state.feedback, this.state.message, opt._data.value);
      }

      return this;
    },

    getValue_() {
      return this._getValueTypedValue(this.state.value);
    },

    isValid_() {
      return this._checkRequiredValue({ value: this.state.value });
    },
    //@@viewOff:overriding

    //@@viewOn:private
    // Used to hold current values of props/state which is used for formatting.
    // These values are used on various places and its value has to be always
    // updated (e.g. in functions called from willReceiveProps)
    _setCurrentProps(props) {
      let formattingKeys = [
        "decimals",
        "decimalSeparator",
        "decimalsView",
        "decimalsViewRounded",
        "lowerMessage",
        "max",
        "min",
        "nanMessage",
        "onValidate",
        "prefix",
        "required",
        "requiredMessage",
        "rounded",
        "suffix",
        "thousandSeparator",
        "upperMessage",
        "valueType",
      ];

      for (let i = 0; i < formattingKeys.length; i++) {
        let key = formattingKeys[i];
        let value = props[key];
        if (key === "country" && !value) value = UU5.Common.Tools.getLanguage();
        this._currentProps[key] = value;
      }
    },

    _registerInput(input) {
      this._textInput = input;
    },

    _updateFeedback(feedback, message, localizedValue, setStateCallback) {
      if (this.getFeedback() === feedback) {
        // update feedback/value but doesn't call props.onChangeFeedback
        this._localizedSetFeedback(feedback, message, localizedValue, setStateCallback);
      } else {
        // update feedback/value and call props.onChangeFeedback
        this._localized_setFeedback(feedback, message, localizedValue, setStateCallback);
      }
    },
    _localizedSetFeedback(feedback, message, localizedValue, setStateCallback) {
      this._localizedValueStack.push(localizedValue);
      try {
        return this.setFeedback(feedback, message, this._getValueTypedValue(localizedValue), setStateCallback);
      } finally {
        this._localizedValueStack.pop();
      }
    },
    _localized_setFeedback(feedback, message, localizedValue, setStateCallback) {
      this._localizedValueStack.push(localizedValue);
      try {
        return this._setFeedback(feedback, message, this._getValueTypedValue(localizedValue), setStateCallback);
      } finally {
        this._localizedValueStack.pop();
      }
    },
    _localizedSetError(message, localizedValue, setStateCallback) {
      this._localizedValueStack.push(localizedValue);
      try {
        return this.setError(message, this._getValueTypedValue(localizedValue), setStateCallback);
      } finally {
        this._localizedValueStack.pop();
      }
    },
    _localizedSetInitial(message, localizedValue, setStateCallback) {
      this._localizedValueStack.push(localizedValue);
      try {
        return this.setInitial(message, this._getValueTypedValue(localizedValue), setStateCallback);
      } finally {
        this._localizedValueStack.pop();
      }
    },

    _getValueTypedValue(localizedValue) {
      let number = this._parseNumberFromLocalizedString(localizedValue);
      let result;
      if (this._currentProps.valueType === "number") {
        result = Number.isNaN(number) ? null : number;
        // :-( g04 Number API doesn't distinguish between undefined (empty value) & null (unparsable value) so there is no way to propagate
        // upwards that the value is unparsable.
        // On the other hand, the only unparsable value that can be actually entered is "-" so we'll handle it specially in willReceiveProps.
        if (result === undefined) result = null;
      } else {
        result = Number.isNaN(number) ? null : number === undefined ? "" : number + "";
      }
      return result;
    },

    _doGetCaretPosition(e) {
      // check if input is still focused
      if (!this._isFocused) {
        return;
      }
      // check selection start
      if (e && !Number.isNaN(e.target.selectionStart)) {
        return e.target.selectionStart;
      }

      // Initialize
      var iCaretPos = 0;
      let inputNode = UU5.Common.DOM.findNode(this._textInput);
      // IE Support
      if (document.selection) {
        // Set focus on the element
        inputNode.focus();
        // To get cursor position, get empty selection range
        var oSel = document.selection.createRange();
        // Move selection start to 0 position
        oSel.moveStart("character", -inputNode.value.length);
        // The caret position is selection length
        iCaretPos = oSel.text.length;
      }
      // Firefox support
      else if (inputNode.selectionStart || inputNode.selectionStart == "0") iCaretPos = inputNode.selectionStart;
      // Return results
      return iCaretPos;
    },

    _setCaretPosition(caretPosStart, caretPosEnd = caretPosStart) {
      let elem = UU5.Common.DOM.findNode(this._textInput).querySelector("input");
      if (elem != null) {
        if (elem.createTextRange) {
          let range = elem.createTextRange();
          range.move("character", caretPosStart);
          range.select();
        } else {
          if (elem.selectionStart >= 0) {
            elem.focus();
            elem.setSelectionRange(caretPosStart, caretPosEnd);
          } else {
            elem.focus();
          }
        }
      }
    },

    _onMouseUp(e) {
      if (this._currentProps.prefix || this._currentProps.suffix) {
        e.persist();
        let cursorPosition = this._doGetCaretPosition(e);
        let maxPosition = this._currentProps.suffix
          ? e.target.value.length - this._currentProps.suffix.length
          : e.target.value.length;
        let minPosition = this._currentProps.prefix ? this._currentProps.prefix.length : 0;
        if (this._isFocused) {
          if (!this.props.hideSuffixOnFocus && cursorPosition === e.target.value.length) {
            this._setCaretPosition(maxPosition);
          } else if (!this.props.hidePrefixOnFocus && cursorPosition === 0) {
            this._setCaretPosition(minPosition);
          }
        }
        if (this._currentProps.prefix && this._isFocused && !this.props.hidePrefixOnFocus) {
          if (cursorPosition < minPosition) {
            setTimeout(() => {
              this._setCaretPosition(minPosition);
            }, 0);
          }
        }
        if (this._currentProps.suffix && this._isFocused && !this.props.hideSuffixOnFocus) {
          if (cursorPosition >= maxPosition) {
            setTimeout(() => {
              this._setCaretPosition(maxPosition);
            }, 0);
          }
        }
      }
    },

    _onKeyDown(e) {
      if (this._currentProps.prefix || this._currentProps.suffix) {
        e.persist();
        if (!e.shiftKey) {
          let cursorPosition = this._doGetCaretPosition(e);
          let maxPosition = this._currentProps.suffix
            ? e.target.value.length - this._currentProps.suffix.length
            : e.target.value.length;
          let minPosition = this._currentProps.prefix ? this._currentProps.prefix.length : 0;
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
          if (!this.props.hidePrefixOnFocus && this._isFocused && this._currentProps.prefix) {
            // 37 - ArrowLeft, 8 - Backspace
            if (e.keyCode === 37 || e.keyCode === 8) {
              if (cursorPosition <= minPosition) {
                e.preventDefault();
                setTimeout(() => {
                  this._setCaretPosition(minPosition);
                }, 0);
              }
            }
            if (!this.props.hideSuffixOnFocus && this._isFocused && this._currentProps.suffix) {
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

    _parseNumberFromLocalizedString(localizedValue, applyDecimals = true) {
      let engNumberString =
        UU5.Common.Tools.normalizeNumberSeparators(localizedValue, {
          thousandSeparator: this._currentProps.thousandSeparator,
          decimalSeparator: this._currentProps.decimalSeparator,
        }) || "";
      engNumberString = engNumberString.replace(/\s+/g, ""); // remove any remaining spaces
      let number = engNumberString ? Number(engNumberString) : undefined;
      if (number === 0 && 1 / number === -Infinity) number = 0;
      if (number === Infinity || number === -Infinity) number = NaN;
      if (applyDecimals) number = this._applyDecimals(number);
      return number; // number | NaN | undefined
    },

    _formatToUnfocusedValue(localizedValue, maxDecimals, showThousandSeparator) {
      let numberValue = this._parseNumberFromLocalizedString(localizedValue);

      let minDecimals;
      if (numberValue) {
        let decimals = (numberValue + "").split(".");
        if (decimals[1] && decimals[1].length >= maxDecimals) {
          minDecimals = maxDecimals;
        }
      }

      return UU5.Common.Tools.formatNumber(numberValue, {
        minDecimals,
        maxDecimals,
        roundType: this._currentProps.decimalsViewRounded,
        thousandSeparator: showThousandSeparator ? this._currentProps.thousandSeparator : "",
        decimalSeparator: this._currentProps.decimalSeparator,
      });
    },

    _removePrefixAndSuffix(value) {
      if (typeof value === "string") {
        value = this._currentProps.prefix ? value.replace(this._currentProps.prefix, "") : value;
        value = this._currentProps.suffix ? value.replace(this._currentProps.suffix, "") : value;
      }

      return value;
    },

    _suffix() {
      let suffix;
      suffix = "";
      if (this._currentProps.suffix) {
        suffix = this._currentProps.suffix;
        if (this.props.hideSuffixOnFocus && this._isFocused) {
          suffix = "";
        }
      }
      return suffix;
    },

    _prefix() {
      let prefix;
      prefix = "";
      if (this._currentProps.prefix) {
        prefix = this._currentProps.prefix;
        if (this.props.hidePrefixOnFocus && this._isFocused) {
          prefix = "";
        }
      }
      return prefix;
    },

    _hasSuffix(value) {
      return !!value.endsWith(this._currentProps.suffix);
    },

    _hasPrefix(value) {
      let prefixRegExp = new RegExp(`^\\${this._currentProps.suffix}`, "g");
      return !!value.match(prefixRegExp);
    },

    _correctCursorFireFoxAndIe(e) {
      e.preventDefault();
      //correct position of cursor when focusing input in FireFox and IE
      let isFireFox = window.navigator.userAgent.match("Firefox");
      let isIE = UU5.Common.Tools.isIE();
      if (isFireFox || isIE) {
        let cursorPosition = this._doGetCaretPosition(e);
        if (!this._currentProps.suffix && !this._currentProps.prefix) {
          setTimeout(() => {
            this._setCaretPosition(cursorPosition);
          }, 0);
        } else if (this._currentProps.suffix || this._currentProps.prefix) {
          let minPosition = this._currentProps.prefix ? this._currentProps.prefix.length : 0;
          let maxPosition = this._currentProps.suffix
            ? e.target.value.length - this._currentProps.suffix.length
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
      if (this._currentProps.prefix || this._currentProps.suffix) {
        let cursorPosition = this._doGetCaretPosition(e);
        let hasSuffix = this._hasSuffix(e.target.value);
        let minPosition = this._currentProps.prefix ? this._currentProps.prefix.length : 0;
        let maxPosition = this._currentProps.suffix
          ? e.target.value.length - (hasSuffix ? this._currentProps.suffix.length : 0)
          : e.target.value.length;
        if (this._isFocused && !this.props.hidePrefixOnFocus) {
          if (cursorPosition < minPosition) {
            setTimeout(() => {
              this._setCaretPosition(minPosition);
            }, 0);
          }
        }
        if (this._isFocused && !this.props.hideSuffixOnFocus) {
          if (cursorPosition > maxPosition || (this._currentProps.suffix && !hasSuffix)) {
            setTimeout(() => {
              this._setCaretPosition(maxPosition);
            }, 0);
          }
        }
      }
    },

    _checkNaNAndGetFeedback(localizedValue) {
      let result;
      if (localizedValue) {
        let number = this._parseNumberFromLocalizedString(localizedValue);
        if (Number.isNaN(number)) {
          if (localizedValue !== "-") {
            this._updateRange = this._doGetCaretPosition() - 1;
            result = {};
            result.feedback = "warning";
            result.message =
              localizedValue.startsWith("-") && this._currentProps.min != null && this._currentProps.min >= 0
                ? this._currentProps.lowerMessage ||
                  this.getLsiComponent("lowerMessage", null, [this._currentProps.min])
                : this._currentProps.nanMessage || this.getLsiComponent("nanMessage");
          }
        }
      }
      return result;
    },

    _checkNaNMinMaxAndGetFeedback(localizedValue) {
      let result;

      if (localizedValue) {
        result = this._checkNaNAndGetFeedback(localizedValue);
        if (!result) {
          // NOTE There are some values that are NaN but have no feedback, e.g. "-".
          let number = this._parseNumberFromLocalizedString(localizedValue);
          if (!Number.isNaN(number)) {
            if (this._currentProps.min != null && number != null && number < this._currentProps.min) {
              result = {};
              result.feedback = "error";
              result.message =
                this._currentProps.lowerMessage || this.getLsiComponent("lowerMessage", null, [this._currentProps.min]);
            }

            if (this._currentProps.max != null && number != null && number > this._currentProps.max) {
              result = {};
              result.feedback = "error";
              result.message =
                this._currentProps.upperMessage || this.getLsiComponent("upperMessage", null, [this._currentProps.max]);
            }
          }
        }
      }

      return result;
    },

    _formatNumberToLocalizedStringEditable(number) {
      if (Number.isNaN(number) || number == null || typeof number !== "number") return "";
      return UU5.Common.Tools.formatNumber(number, {
        thousandSeparator: "",
        decimalSeparator: this._currentProps.decimalSeparator,
      });
    },

    _applyDecimals(number) {
      let result = number;
      if (this._currentProps.decimals != null && number !== undefined && !Number.isNaN(number)) {
        let exp = this._currentProps.decimals ? -1 * this._currentProps.decimals : 0;
        result = UU5.Common.Tools.round10(number, exp);
      }
      return result;
    },

    _getLocalizedValueWithFeedback(valueInUnknownFormat, isSurelyValueTyped) {
      // NOTE valueInUnknownFormat is from props, or it is from "our" code (and then it is known to be value-typed,
      // ie. either typeof number or English PC string).
      let localizedValue;
      let number;
      if (typeof valueInUnknownFormat === "number") {
        number = this._applyDecimals(valueInUnknownFormat);
        localizedValue = this._formatNumberToLocalizedStringEditable(number);
      } else if (
        valueInUnknownFormat &&
        (isSurelyValueTyped || /^[-+]?\d+(\.\d+)?(e[-+]?\d+)?$/.test(valueInUnknownFormat))
      ) {
        // assume API string (computer English PC number) - "12345.5"
        number = this._applyDecimals(Number(valueInUnknownFormat));
        localizedValue = this._formatNumberToLocalizedStringEditable(number);
      } else if (valueInUnknownFormat === "NaN") {
        // for backward compatibility (no idea whether this value was really being used in production; it was in our tests)
        number = Number.NaN;
        localizedValue = "";
      } else if (valueInUnknownFormat) {
        // NOTE If we came here, it means props.value contained localized value (which is bad, but it was supported...).
        // localized string - "12,345.5" or "12.345,5" or "12 345,5" or ...
        number = this._parseNumberFromLocalizedString(valueInUnknownFormat, true);
        localizedValue =
          this._formatNumberToLocalizedStringEditable(number) ||
          (valueInUnknownFormat == null ? "" : valueInUnknownFormat + "");
      } else {
        number = undefined;
        localizedValue = "";
      }

      let feedbackObj = this._checkNaNMinMaxAndGetFeedback(localizedValue);
      let result = { ...feedbackObj, value: localizedValue };
      return result;
    },

    _onChange(e) {
      this._correctCursorPosition(e);
      let newLocalizedValue = this._removePrefixAndSuffix(e.target.value || "");

      // don't allow entering spaces (e.g. when pasting / typing)
      if (/\s/.test(newLocalizedValue)) {
        newLocalizedValue = newLocalizedValue.replace(/\s+/g, "");
        e.target.value = newLocalizedValue;
      }

      let separatorCount = newLocalizedValue.split(/[.,]/).length;

      if (separatorCount >= 3) {
        let parsedValue = this._parseNumberFromLocalizedString(newLocalizedValue);
        if (typeof parsedValue === "number" && !Number.isNaN(parsedValue)) {
          newLocalizedValue = this._formatNumberToLocalizedStringEditable(parsedValue);
        }
      }

      // Always interpret ., as decimal separator
      newLocalizedValue = newLocalizedValue.replace(/[.,]/g, () => this._currentProps.decimalSeparator);

      let nanFeedbackObject = this._checkNaNAndGetFeedback(newLocalizedValue);
      if (nanFeedbackObject) {
        // newLocalizedValue is invalid; if user had valid value before (or "-") then forbid changing
        // into invalid
        let currentNumber = this._parseNumberFromLocalizedString(this.state.value);
        if (this.state.value === "-" || !Number.isNaN(currentNumber)) {
          newLocalizedValue = this.state.value;
        }
        this._updateFeedback(nanFeedbackObject.feedback, nanFeedbackObject.message, newLocalizedValue);
      } else {
        let currentNumber = this._parseNumberFromLocalizedString(this.state.value);
        let newNumber = this._parseNumberFromLocalizedString(newLocalizedValue);

        if (isSameNumber(currentNumber, newNumber)) {
          // the parsed value did not change (the result of parsing string into number is same)
          // but the input value might be different (e.g. user added space or thousand separator), i.e. simply store it in state
          this.setState({ value: newLocalizedValue });
        } else {
          if (!this.isComputedDisabled() && !this.isReadOnly()) {
            let valueTypedValue = this._getValueTypedValue(newLocalizedValue);
            let opt = {
              value: valueTypedValue,
              event: e,
              component: this,
              _data: { type: "input", value: newLocalizedValue },
            };
            if (typeof this.props.onChange === "function") {
              this.props.onChange(opt);
            } else {
              this.onChangeDefault(opt);
            }
          }
        }
      }
      return this;
    },

    _onChangeInputDefault(opt, setStateCallback) {
      let _callCallback = typeof setStateCallback === "function";

      if (this.props.validateOnChange) {
        _callCallback = false;
        this._validateOnChange(opt, false, false, setStateCallback);
      } else {
        let localizedValue = opt._data.value;
        if (this._checkRequiredValue({ value: localizedValue })) {
          let { feedback, message } = this.getChangeFeedback(opt);
          _callCallback = false;
          this._updateFeedback(feedback, message, localizedValue, setStateCallback);
        }
      }

      if (_callCallback) {
        setStateCallback();
      }
    },

    _onIncreaseDecreaseDefault(opt, type, setStateCallback) {
      // we need to run all validations, similarly how it is in onBlurDefault_ (but we can be sure
      // that value is parsable, otherwise increase/decrease change wouldn't have triggerred)

      // NOTE Cannot call this.getBlurFeedback(opt) followed by _updateFeedback(...) right away
      // because feedback would get overwritten, probably due to parent re-render.
      //   => call it in callback
      let localizedValue = opt._data.value;
      this._updateFeedback(this.state.feedback, null, localizedValue, () => {
        let { feedback, message } = this.getBlurFeedback(opt);
        this._updateFeedback(feedback, message, this.state.value, setStateCallback);
      });
    },

    _onBlur(e) {
      this._isFocused = false;
      let localizedValue = this._removePrefixAndSuffix(e.target.value);
      let opt = {
        value: this._getValueTypedValue(localizedValue),
        event: e,
        component: this,
        _data: { value: localizedValue },
      };
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
      // NOTE Not using e.target.value because while input is not focused, it might be displaying incomplete
      // value (due to props.decimalsView).
      let localizedValue = this.state.value;
      let number = this._parseNumberFromLocalizedString(localizedValue);
      let editableLocalizedValue;
      if (number !== undefined && !Number.isNaN(number)) {
        editableLocalizedValue = this._formatNumberToLocalizedStringEditable(number);
      } else {
        editableLocalizedValue = localizedValue;
      }

      let opt = {
        value: this._getValueTypedValue(localizedValue),
        event: e,
        component: this,
        _data: { value: editableLocalizedValue },
      };
      if (typeof this.props.onFocus === "function") {
        this.props.onFocus(opt);
      } else {
        this.onFocusDefault(opt);
      }

      return this;
    },

    _validateOnChange(opt, checkValue, callOnChangeFeedback, setStateCallback) {
      // NOTE opt.value is value-typed; needs to have opt._data.value present.
      let _callCallback = typeof setStateCallback === "function";

      if (!checkValue || this._hasValueChanged(this._getValueTypedValue(this.state.value), opt.value)) {
        let result = typeof this._currentProps.onValidate === "function" ? this._currentProps.onValidate(opt) : null;
        if (result) {
          if (typeof result === "object") {
            if (result.feedback) {
              _callCallback = false;
              this[callOnChangeFeedback ? "_updateFeedback" : "_localizedSetFeedback"](
                result.feedback,
                result.message,
                opt._data?.value ?? opt.value,
                setStateCallback
              );
            } else {
              _callCallback = false;
              this.setState({ value: opt._data?.value ?? opt.value }, setStateCallback);
            }
          } else {
            this.showError("validateError", null, {
              context: {
                func: this._currentProps.onValidate,
                result: result,
              },
            });
          }
        }
      }

      if (_callCallback) {
        setStateCallback();
      }

      return this;
    },

    _decrease(e) {
      this._increaseDecrease(e, "decrease");
    },

    _increase(e) {
      this._increaseDecrease(e, "increase");
    },

    _increaseDecrease(e, type) {
      let number = this._parseNumberFromLocalizedString(this.state.value);
      let initialValue = (type === "decrease" ? this._currentProps.max : this._currentProps.min) ?? 0;
      let direction = type === "decrease" ? -1 : 1;
      let newNumber = number === undefined ? initialValue : number + direction * (this.props.step ?? 1);
      if (!Number.isNaN(newNumber)) {
        newNumber = Math.max(
          Math.min(newNumber, this._currentProps.max ?? newNumber),
          this._currentProps.min ?? newNumber
        );
        if (newNumber !== number) {
          let newLocalizedValue = this._formatNumberToLocalizedStringEditable(newNumber);
          let newTypedValue = this._getValueTypedValue(newLocalizedValue);
          let opt = { value: newTypedValue, event: e, component: this, _data: { type, value: newLocalizedValue } };
          if (typeof this.props.onChange === "function") {
            this.props.onChange(opt);
          } else {
            this.onChangeDefault(opt);
          }
        }
      }
    },

    _isDisabled(type) {
      let result = false;

      if (this.state.value) {
        let number = this._parseNumberFromLocalizedString(this.state.value);
        if (type === "min" && typeof this._currentProps.min === "number") {
          if (Number.isNaN(number) || number <= this._currentProps.min) {
            result = true;
          }
        } else if (type === "max" && typeof this._currentProps.max === "number") {
          if (Number.isNaN(number) || number >= this._currentProps.max) {
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

    _checkRequiredValue({ value }) {
      let number = this._parseNumberFromLocalizedString(value);
      if (this._currentProps.required && (number === undefined || Number.isNaN(number))) {
        this._localizedSetError(this._currentProps.requiredMessage || this.getLsiComponent("requiredMessage"), value);
        return false;
      }
      return true;
    },

    _handlePaste(e) {
      let json = Utils.Clipboard.read(e, "json");
      let numberString;
      let ambiguous = false;
      if (json != null && typeof json === "number") {
        numberString = JSON.stringify(json);
      } else {
        let text = Utils.Clipboard.read(e);
        ({ numberString, ambiguous } = transformPastedTextToNumberString(
          text,
          this.props.thousandSeparator,
          this.props.decimalSeparator
        ));
      }
      delete this._ambiguous;
      if (numberString) {
        e.preventDefault();
        let number = Number(numberString);
        let newLocalizedValue = this._formatNumberToLocalizedStringEditable(number);
        let valueTypedValue = this._getValueTypedValue(newLocalizedValue);
        let opt = {
          value: valueTypedValue,
          event: e,
          component: this,
          _data: { type: "input", value: newLocalizedValue },
        };
        if (ambiguous) {
          opt.feedback = "warning";
          opt.message = this.getLsiComponent("ambiguousValuePastedMessage");
        }
        if (typeof this.props.onChange === "function") {
          this.props.onChange(opt);
        } else {
          this.onChangeDefault(opt);
        }
      }
    },

    _handleCopy(e) {
      // if copy&pasting among number inputs then copy the value also as a number type so that
      // during paste we know exactly the number and don't have to guess which separator is decimal, etc.
      let value = this._parseNumberFromLocalizedString(this.state.value);
      if (value != null && !isNaN(value)) {
        e.preventDefault();
        e.clipboardData.setData("text/plain", value + "");
        e.clipboardData.setData("application/json", JSON.stringify(value));
      }
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
                  onMouseOut: this._decreaseEnd,
                },
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
                  onMouseOut: this._increaseEnd,
                },
              },
            ]
          : null;

      let inputAttrs = { ...this.props.inputAttrs };
      inputAttrs.className === "" ? delete inputAttrs.className : null;
      inputAttrs.onMouseUp = this._onMouseUp;
      inputAttrs.onKeyDown = this._onKeyDown;
      inputAttrs.onPaste = (e) => {
        if (typeof this.props.inputAttrs?.onPaste === "function") this.props.inputAttrs?.onPaste(e);
        if (!e.defaultPrevented) this._handlePaste(e);
      };
      inputAttrs.onCopy = (e) => {
        if (typeof this.props.inputAttrs?.onCopy === "function") this.props.inputAttrs?.onCopy(e);
        if (!e.defaultPrevented) this._handleCopy(e);
      };
      let value;

      if (this.state.value) {
        value = this._prefix();
        if (this._isFocused || Number.isNaN(this._parseNumberFromLocalizedString(this.state.value))) {
          if (this._isFocused) {
            let inputValue = this.state.value.replaceAll(this.props.thousandSeparator, "");
            if ([".", ","].indexOf(this.props.decimalSeparator) === -1) {
              inputValue = inputValue.replaceAll(this.props.decimalSeparator, ".");
            }
            value += inputValue;
          } else {
            value += this.state.value;
          }
        } else {
          value += this._formatToUnfocusedValue(this.state.value, this.props.decimalsView, true);
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
                key={inputId}
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
                ref_={this._registerInput}
                feedback={this.getFeedback()}
                borderRadius={this.props.borderRadius}
                elevation={this.props.elevation}
                bgStyle={this.props.bgStyle}
                inputWidth={this._getInputWidth()}
                colorSchema={this.props.colorSchema}
                size={this.props.size}
              />,

              <ItemList key="item-list" {...this._getItemListProps()}>
                {this._getChildren()}
              </ItemList>,
              <UU5.Bricks.Backdrop key="backdrop" {...this._getBackdropProps()} />,
            ],
            buttons
          )}
        </div>
      );
    },
    //@@viewOff:render
  })
);

NumberComponent = withUserPreferences(NumberComponent, {
  thousandSeparator: "numberGroupingSeparator",
  decimalSeparator: "numberDecimalSeparator",
});

export { NumberComponent as Number };
export default NumberComponent;
