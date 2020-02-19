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

import ns from "../forms-ns.js";
import * as UU5 from "uu5g04";

import "./input-mixin.less";
import "../col.less";

import Label from "./../internal/label.js";
import InputWrapper from "./../internal/input-wrapper.js";
import Css from "../internal/css.js";

export const INITIAL_FEEDBACK = "initial";
export const SUCCESS_FEEDBACK = "success";
export const WARNING_FEEDBACK = "warning";
export const ERROR_FEEDBACK = "error";
export const LOADING_FEEDBACK = "loading";

export const InputMixin = {
  //@@viewOn:mixins
  //@@viewOff:mixins

  //@@viewOn:statics
  statics: {
    "UU5.Forms.InputMixin": {
      classNames: {
        main: ns.css("input"),
        formItem: ns.css("input-form-item"),
        input: ns.css("input-"),
        readOnly: ns.css("input-read-only"),
        hasIcon: ns.css("input-icon"),
        inline: ns.css("input-inline"),
        labelWidth: ns.css("input-label-width"),
        withAutoWidth: ns.css("input-auto-width"),
        preventWrap: ns.css("input-prevent-wrap")
      },
      defaults: {
        columnRegexp: /^([a-z]+)(?:-)?(\d+)$/,
        labelColWidth: { xs: 12, s: 5 },
        inputColWidth: { xs: 12, s: 7 }
      }
    }
  },
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {
    label: UU5.PropTypes.any,
    message: UU5.PropTypes.any,

    feedback: UU5.PropTypes.oneOf([INITIAL_FEEDBACK, SUCCESS_FEEDBACK, WARNING_FEEDBACK, ERROR_FEEDBACK, LOADING_FEEDBACK]),

    readOnly: UU5.PropTypes.bool,

    size: UU5.PropTypes.oneOf(["s", "m", "l", "xl"]),

    onChange: UU5.PropTypes.func,
    onValidate: UU5.PropTypes.func,
    onChangeFeedback: UU5.PropTypes.func,

    labelColWidth: UU5.PropTypes.oneOfType([
      UU5.PropTypes.shape({
        xs: UU5.PropTypes.number,
        s: UU5.PropTypes.number,
        m: UU5.PropTypes.number,
        l: UU5.PropTypes.number,
        xl: UU5.PropTypes.number
      }),
      UU5.PropTypes.string
    ]),
    inputColWidth: UU5.PropTypes.oneOfType([
      UU5.PropTypes.shape({
        xs: UU5.PropTypes.number,
        s: UU5.PropTypes.number,
        m: UU5.PropTypes.number,
        l: UU5.PropTypes.number,
        xl: UU5.PropTypes.number
      }),
      UU5.PropTypes.string
    ]),
    inputWidth: UU5.PropTypes.string,
    labelWidth: UU5.PropTypes.string,

    inputAttrs: UU5.PropTypes.object,

    spacing: UU5.PropTypes.number,

    tooltipIcon: UU5.PropTypes.string,
    labelAlignment: UU5.PropTypes.string
  },
  //@@viewOff:propTypes

  //@@viewOn:getDefaultProps
  getDefaultProps: function() {
    return {
      label: null,
      message: null,
      feedback: INITIAL_FEEDBACK,
      readOnly: false,
      size: "m",
      onChange: null,
      onValidate: null,
      labelColWidth: InputMixin.statics["UU5.Forms.InputMixin"].defaults.labelColWidth,
      inputColWidth: InputMixin.statics["UU5.Forms.InputMixin"].defaults.inputColWidth,
      inputWidth: null,
      labelWidth: null,
      inputAttrs: null,
      spacing: null,
      tooltipIcon: "mdi-information-outline",
      labelAlignment: undefined
    };
  },
  //@@viewOff:getDefaultProps

  //@@viewOn:reactLifeCycle
  getInitialState: function() {
    return {
      message: this.props.message,
      feedback: this.props.feedback,
      value: typeof this.getInitialValue_ === "function" ? this.getInitialValue_(this.props.value) : this.props.value,
      readOnly: this.props.readOnly
    };
  },

  componentDidMount: function() {
    var parentForm = this._getForm();
    parentForm && parentForm.registerFormInput(this.getId(), this);
  },

  componentWillReceiveProps: function(nextProps) {
    if (nextProps.id && nextProps.id !== this.props.id) {
      var parentForm = this._getForm();
      if (parentForm) {
        parentForm.unregisterFormInput(this.props.id);
        parentForm.registerFormInput(nextProps.id, this);
      }
    }
    if (nextProps.controlled) {
      //TODO: jine komponenty jak text zkontrolovat willRecievePros (byude se modifikovat jen value), vsude musi byt nextProps.controled
      this.setFeedback(nextProps.feedback, nextProps.message, nextProps.value, () =>
        this.setState({ readOnly: nextProps.readOnly })
      );
    }
  },

  componentWillUnmount: function() {
    var parentForm = this._getForm();
    parentForm && parentForm.unregisterFormInput(this.getId());
  },
  //@@viewOff:reactLifeCycle

  //@@viewOn:interface
  isInput() {
    return true;
  },

  getValue(...params) {
    let value;
    if (typeof this.getValue_ === "function") {
      value = this.getValue_(...params);
    } else {
      value = this.getValueDefault();
    }
    return value;
  },

  getValueDefault() {
    return this.state.value;
  },

  setValue(value, ...args /* (opts = null,)? setStateCallback */) {
    // setStateCallback always last
    // opts can contain flag "shouldValidateRequired" for skipping validation of "required"
    // (used from FormMixin's setValues) - we can't send that flag to setValue_ due to
    // backward compatibility (they expect only 2 arguments so if they called setValueDefault, we wouldn't
    // get the flag) => remember it in internal field and we'll read the field inside _checkRequired (which
    // is defined elsewhere) via shouldValidateRequired() method
    let setStateCallback = typeof args[args.length - 1] === "function" ? args.pop() : undefined;
    let opts = args.shift() || {};
    let origShouldValidateRequired = this._shouldValidateRequired;
    this._shouldValidateRequired = opts.shouldValidateRequired;

    if (typeof this.setValue_ === "function") {
      this.setValue_(value, setStateCallback);
    } else {
      this.setValueDefault(value, setStateCallback);
    }

    this._shouldValidateRequired = origShouldValidateRequired;
    return this;
  },

  setValueDefault(value, setStateCallback) {
    this.setState({ value: value === undefined ? null : value }, setStateCallback);
    return this;
  },

  getMessage() {
    let message;
    if (typeof this.getMessage_ === "function") {
      message = this.getMessage_();
    } else {
      message = this.getMessageDefault();
    }
    return message;
  },

  getMessageDefault() {
    return this.state.message;
  },

  setMessage(message, setStateCallback) {
    if (typeof this.setMessage_ === "function") {
      this.setMessage_(message, setStateCallback);
    } else {
      this.setMessageDefault(message, setStateCallback);
    }
    return this;
  },

  setMessageDefault(message, setStateCallback) {
    this.setState({ message: message }, setStateCallback);
    return this;
  },

  getFeedback() {
    let feedback;
    if (typeof this.getFeedback_ === "function") {
      feedback = this.getFeedback_();
    } else {
      feedback = this.getFeedbackDefault();
    }
    return feedback;
  },

  getFeedbackDefault() {
    return this.state.feedback;
  },

  setFeedback(feedback, message, value, setStateCallback) {
    if (value === undefined) {
      value = this.state.value;
    } else if (value === null) {
      value = "";
    }

    if (message === undefined) {
      message = null;
    }

    if (typeof this.setFeedback_ === "function") {
      this.setFeedback_(feedback, message, value, setStateCallback);
    } else {
      this.setFeedbackDefault(feedback, message, value, setStateCallback);
    }

    return this;
  },

  setFeedbackDefault(feedback, message, value, setStateCallback) {
    this.setState(
      {
        feedback: feedback,
        message: message,
        value: value
      },
      setStateCallback
    );
    return this;
  },

  setInitial(message, value, setStateCallback) {
    if (message === undefined) {
      message = null;
    }

    if (typeof this.setInitial_ === "function") {
      this.setInitial_(message, value, setStateCallback);
    } else {
      this.setInitialDefault(message, value, setStateCallback);
    }
    return this;
  },

  setInitialDefault(message, value, setStateCallback) {
    if (message === undefined) {
      message = null;
    }

    this._setFeedback(INITIAL_FEEDBACK, message, value, setStateCallback);
    return this;
  },

  isInitial() {
    return this.getFeedback() === INITIAL_FEEDBACK;
  },

  setLoading(message, value, setStateCallback) {
    if (typeof this.setLoading_ === "function") {
      this.setLoading_(message, value, setStateCallback);
    } else {
      this.setLoadingDefault(message, value, setStateCallback);
    }
    return this;
  },

  setLoadingDefault(message, value, setStateCallback) {
    this._setFeedback(LOADING_FEEDBACK, message, value, setStateCallback);

    return this;
  },

  isLoading() {
    return this.getFeedback() === LOADING_FEEDBACK;
  },

  setSuccess(message, value, setStateCallback) {
    if (typeof this.setSuccess_ === "function") {
      this.setSuccess_(message, value, setStateCallback);
    } else {
      this.setSuccessDefault(message, value, setStateCallback);
    }
    return this;
  },

  setSuccessDefault(message, value, setStateCallback) {
    this._setFeedback(SUCCESS_FEEDBACK, message, value, setStateCallback);
    return this;
  },

  isSuccess() {
    return this.getFeedback() === SUCCESS_FEEDBACK;
  },

  setWarning(message, value, setStateCallback) {
    if (typeof this.setWarning_ === "function") {
      this.setWarning_(message, value, setStateCallback);
    } else {
      this.setWarningDefault(message, value, setStateCallback);
    }
    return this;
  },

  setWarningDefault(message, value, setStateCallback) {
    this._setFeedback(WARNING_FEEDBACK, message, value, setStateCallback);
    return this;
  },

  isWarning() {
    return this.getFeedback() === WARNING_FEEDBACK;
  },

  setError(message, value, setStateCallback) {
    if (typeof this.setError_ === "function") {
      this.setError_(message, value, setStateCallback);
    } else {
      this.setErrorDefault(message, value, setStateCallback);
    }
    return this;
  },

  setErrorDefault(message, value, setStateCallback) {
    this._setFeedback(ERROR_FEEDBACK, message, value, setStateCallback);
    return this;
  },

  isError() {
    return this.getFeedback() === ERROR_FEEDBACK;
  },

  reset(setStateCallback) {
    if (typeof this.reset_ === "function") {
      this.reset_(setStateCallback);
    } else {
      this.resetDefault(setStateCallback);
    }
    return this;
  },

  resetDefault(setStateCallback) {
    this.setState(
      {
        message: this.props.message,
        feedback: this.props.feedback,
        value: this.props.value,
        readOnly: this.props.readOnly
      },
      setStateCallback
    );
    return this;
  },

  //TODO getResetValues

  getChangeFeedback(opt) {
    let result;

    if (typeof this.getChangeFeedback_ === "function") {
      result = this.getChangeFeedback_(opt);
    } else {
      result = this.getChangeFeedbackDefault(opt);
    }

    return result;
  },

  getChangeFeedbackDefault(opt) {
    return {
      feedback: opt.feedback || INITIAL_FEEDBACK,
      message: opt.message || null,
      value: opt.value === undefined ? this.state.value : opt.value
    };
  },

  setChangeFeedback(opt, setStateCallback) {
    if (typeof this.setChangeFeedback_ === "function") {
      this.setChangeFeedback_(opt, setStateCallback);
    } else {
      this.setChangeFeedbackDefault(opt, setStateCallback);
    }

    return this;
  },

  setChangeFeedbackDefault(opt, setStateCallback) {
    let result = this.getChangeFeedback(opt);

    this.setState(
      {
        feedback: result.feedback,
        message: result.message,
        value: result.value
      },
      setStateCallback
    );
  },

  isReadOnly() {
    return this.state.readOnly;
  },

  setEditableValue(value, setStateCallback) {
    if (typeof this.setEditableValue_ === "function") {
      this.setEditableValue_(value, setStateCallback);
    } else {
      this.setEditableValueDefault(value, setStateCallback);
    }
    return this;
  },

  setEditableValueDefault(value, setStateCallback) {
    this.setState({ readOnly: !value }, setStateCallback);
    return this;
  },

  readOnly(setStateCallback) {
    if (typeof this.readOnly_ === "function") {
      this.readOnly_(setStateCallback);
    } else {
      this.readOnlyDefault(setStateCallback);
    }
    return this;
  },

  readOnlyDefault(setStateCallback) {
    this.setEditableValue(false, setStateCallback);
    return this;
  },

  editable(setStateCallback) {
    if (typeof this.editable_ === "function") {
      this.editable_(setStateCallback);
    } else {
      this.editableDefault(setStateCallback);
    }
    return this;
  },

  editableDefault(setStateCallback) {
    this.setEditableValue(true, setStateCallback);
    return this;
  },

  getLabel(inputId) {
    let result = null;
    if (this.props.label !== null) {
      result = <Label {...this._getLabelProps(inputId)} />;
    }
    return result;
  },

  getInputWrapper(children, buttons, opts) {
    return <InputWrapper {...this._getInputWrapperProps(children, buttons, opts)} />;
  },

  focus() {
    if (typeof this.focus_ === "function") {
      this.focus_();
    } else {
      UU5.Common.DOM.findNode(this).focus();
    }

    return this;
  },

  isComputedDisabled() {
    return this.isDisabled() || this.isLoading();
  },

  shouldValidateRequired() {
    return this._shouldValidateRequired !== false;
  },
  //@@viewOff:interface

  //@@viewOn:overriding
  //@@viewOff:overriding

  //@@viewOn:private
  _getForm: function() {
    var form = null;
    var parent = this.getParent && this.getParent();
    while (parent) {
      if (typeof parent.isInput === "function" && parent.isInput()) {
        break;
      } else if (typeof parent.isForm === "function" && parent.isForm()) {
        form = parent;
        break;
      } else {
        parent = parent.getParent && parent.getParent();
      }
    }
    return form;
  },

  _setFeedback: function(feedback, message, value, setStateCallback) {
    let opt = {
      feedback: feedback,
      message: message,
      value: value,
      callback: setStateCallback,
      component: this
    };
    if (typeof this.props.onChangeFeedback === "function") {
      this.props.onChangeFeedback(opt);
    } else {
      this.onChangeFeedbackDefault(opt);
    }
    return this;
  },

  onChangeFeedbackDefault(opt) {
    if (typeof this.onChangeFeedbackDefault_ === "function") {
      this.onChangeFeedbackDefault_(opt);
    } else {
      this.setFeedback(opt.feedback, opt.message, opt.value, opt.callback);
    }

    return this;
  },

  _getInputAttrs(ommitMainAttrs = false) {
    let mainAttrs;
    if (ommitMainAttrs) {
      mainAttrs = { className: "" };
    } else {
      mainAttrs = this.getMainAttrs();
      mainAttrs.className += " ";
    }

    if (this.props.label) {
      delete mainAttrs.title;
    }

    mainAttrs.className += this.getClassName("main", "UU5.Forms.InputMixin");
    mainAttrs.className += " " + this.getClassName("input", "UU5.Forms.InputMixin") + this.props.size;
    mainAttrs.className += " " + this.getClassName("input", "UU5.Forms.InputMixin") + this.state.feedback;
    if (this.isReadOnly()) {
      mainAttrs.className += " " + this.getClassName("readOnly", "UU5.Forms.InputMixin");
    }

    if (this.state.feedback != INITIAL_FEEDBACK || this.props.required) {
      mainAttrs.className += " " + this.getClassName("hasIcon", "UU5.Forms.InputMixin");
    }

    if (this.isLoading() && !this.isDisabled()) {
      mainAttrs.className += " " + this.getClassName("disabled", "UU5.Common.ElementaryMixin");
    }

    if (this.props.nestingLevel === "inline" || this.props.inputWidth) {
      mainAttrs.className += " " + this.getClassName("inline", "UU5.Forms.InputMixin");

      if (this.props.nestingLevel === "inline" || this.props.inputWidth === "auto") {
        mainAttrs.className += " " + this.getClassName("withAutoWidth", "UU5.Forms.InputMixin");
      }
    }

    if (this.props.labelWidth) {
      mainAttrs.className += " " + this.getClassName("labelWidth", "UU5.Forms.InputMixin");
    }

    if (typeof this.props.spacing === "number") {
      mainAttrs.className +=
        " " +
        UU5.Common.Css.css`
        &.uu5-forms-input.uu5-forms-input {
          margin-top: ${this.props.spacing + "px"};

          ${
            this.props.spacing <= 8
              ? `& .uu5-forms-checkbox {
            margin-bottom: 0px;
            margin-top: 0px;
          }

          &.uu5-forms-checkbox .uu5-forms-label {
            padding-top: 0px;
          }

          & .uu5-forms-message {
            margin-top: 0px;
            padding-top: 0px;
          }

          & .uu5-forms-label {
            padding-bottom: 0px;
          }`
              : null
          }
        }
      `;
    }

    const totalCols = this._getTotalCols();
    if (typeof totalCols == "number" && totalCols <= 12) {
      mainAttrs.className += " " + this.getClassName("preventWrap", "UU5.Forms.InputMixin");
    }

    return mainAttrs;
  },

  _getLabelProps(inputId) {
    let className;

    if (this.props.labelAlignment) {
      let alignments = {};
      ["xs", "s", "m", "l", "xl"].forEach((screenSize, index, list) => {
        let alignmentRegExp = new RegExp(`\\W?\\b${screenSize}-\\w+`);
        let labelAlignment = this.props.labelAlignment.match(alignmentRegExp);
        labelAlignment = labelAlignment && labelAlignment[0];

        if (!labelAlignment) {
          alignments[screenSize] = list[index - 1] ? alignments[list[index - 1]] : 12;
        } else {
          alignments[screenSize] = labelAlignment.match(/(?:-)(\w+)/)[1];
          labelAlignment.replace(labelAlignment, "");
        }
      });

      const isXs = "screen and (max-width: 480px)";
      const isS = "screen and (min-width: 481px) and (max-width: 768px)";
      const isM = "screen and (min-width: 769px) and (max-width: 992px)";
      const isL = "screen and (min-width: 993px) and (max-width: 1360px)";
      const isXl = "screen and (min-width: 1361px)";

      className =
        (className ? className + " " : "") +
        Css.css(`
        &.uu5-forms-label {
          @media ${isXs} {
            text-align: ${alignments.xs}
          }

          @media ${isS} {
            text-align: ${alignments.s}
          }

          @media ${isM} {
            text-align: ${alignments.m}
          }

          @media ${isL} {
            text-align: ${alignments.l}
          }

          @media ${isXl} {
            text-align: ${alignments.xl}
          }
        }
      `);
    }

    if (this.props.labelPosition === "right") {
      className = (className ? className + " " : "") + ns.css("input-label-right");
    }

    let colWidth = null;
    let labelColWidth = this.props.labelColWidth || this.getDefault("labelColWidth", "UU5.Forms.InputMixin");

    if (!this.props.inputWidth && !this.props.labelWidth) {
      colWidth = UU5.Common.Tools.buildColWidthClassName(labelColWidth);
    }

    return {
      required: this.props.required,
      for: inputId,
      content: this.props.label,
      colWidth,
      className,
      tooltip: this.props.tooltip,
      tooltipIcon: this.props.tooltipIcon,
      colorSchema: this.props.colorSchema,
      width: this.props.labelWidth
    };
  },

  _getInputWidth(opt) {
    let width;

    if (typeof this.getInputWidth_ === "function") {
      width = this.getInputWidth_(opt);
    } else {
      width = this._getInputWidthDefault(opt);
    }

    return width;
  },

  _getInputWidthDefault(opt) {
    let width;

    if (this.props.inputWidth) {
      width = this.props.inputWidth;
    } else if (this.props.nestingLevel === "inline") {
      width = "auto";
    } else {
      width = null;
    }

    return width;
  },

  _getTotalCols() {
    let labelColWidth = this.props.labelColWidth || this.getDefault("labelColWidth", "UU5.Forms.InputMixin");
    let inputColWidth = this.props.inputColWidth || this.getDefault("inputColWidth", "UU5.Forms.InputMixin");
    if (!this.hasMixin("UU5.Common.ScreenSizeMixin") || !labelColWidth || !inputColWidth) {
      return null;
    }

    const currentScreenSize = this.getScreenSize();

    if (!currentScreenSize) {
      return null;
    }

    let cols = { label: {}, input: {} };
    let colWidths = { label: labelColWidth, input: inputColWidth };
    ["xs", "s", "m", "l", "xl"].forEach((screenSize, index, list) => {
      let colRegExp = new RegExp(`\\b${screenSize}-?\\d{1,2}`);

      ["label", "input"].forEach(type => {
        let colWidth;
        if (typeof colWidths[type] === "object") {
          colWidth = colWidths[type];
          if (colWidth[screenSize]) {
            cols[type][screenSize] = colWidth[screenSize];
          } else {
            cols[type][screenSize] = list[index - 1] ? cols[type][list[index - 1]] : 12;
          }
        } else {
          colWidth = colWidths[type].match(colRegExp);
          colWidth = colWidth && colWidth[0];

          if (!colWidth) {
            cols[type][screenSize] = list[index - 1] ? cols[type][list[index - 1]] : 12;
          } else {
            cols[type][screenSize] = parseInt(colWidth.match(/\d+/)[0]);
          }
        }
      });
    });

    return cols.label[currentScreenSize] + cols.input[currentScreenSize];
  },

  _getInputWrapperProps(children, buttons, opts) {
    let props;

    if (typeof this.getInputWrapperProps_ === "function") {
      props = this.getInputWrapperProps_(children, buttons, opts);
    } else {
      props = this._getInputWrapperPropsDefault(children, buttons, opts);
    }

    return props;
  },

  _getInputWrapperPropsDefault(children, buttons, opts) {
    let label = this.props.label;
    let hasLabel = label !== null;

    if (this.getTagName() === "UU5.Forms.DateRangePicker" || this.getTagName() === "UU5.Forms.DateTimeRangePicker") {
      if (!this._isSorXs() && this.props.innerLabel) {
        label = null;
      } else if (this._isSorXs() && (this.props.labelFrom || this.props.labelTo)) {
        hasLabel = true;
      }
    }

    let colWidth = null;
    let inputColWidth = this.props.inputColWidth || this.getDefault("inputColWidth", "UU5.Forms.InputMixin");

    if (!this.props.inputWidth && !this.props.labelWidth) {
      colWidth = UU5.Common.Tools.buildColWidthClassName(hasLabel ? inputColWidth : "xs12");
    }

    let feedback = this.getFeedback();
    let message = this.getMessage();

    if (Array.isArray(buttons)) {
      buttons.forEach(button => {
        if (!button.bgStyle) {
          button.bgStyle = this.props.bgStyle;
        }

        if (!button.borderRadius) {
          button.borderRadius = this.props.borderRadius;
        }

        if (!button.elevation) {
          button.elevation = this.props.elevation;
        }
      });
    }

    return {
      colWidth: colWidth,
      feedback: feedback,
      message: message,
      required: this.props.required,
      buttons: buttons,
      children: children,
      slider: this.getTagName() === "UU5.Forms.Slider",
      datetimepicker: this.getTagName() === "UU5.Forms.DateTimePicker",
      daterangepicker: this.getTagName() === "UU5.Forms.DateRangePicker",
      readonly: this.state.readOnly,
      disabled: this.isDisabled()
    };
  },

  _hasValueChanged(prevValue, nextValue) {
    let result = false;

    if (typeof prevValue !== typeof nextValue) {
      result = true;
    } else {
      // both values are same type so we only need check one
      if ((typeof nextValue === "string" || typeof nextValue === "number") && prevValue !== nextValue) {
        result = true;
      } else if (typeof nextValue === "object" && nextValue instanceof Date) {
        if (UU5.Common.Tools.compareDates(prevValue, nextValue, "equals")) {
          result = true;
        }
      } else if (Array.isArray(nextValue) || (typeof nextValue === "object" && nextValue !== null)) {
        if (!UU5.Common.Tools.deepEqual(prevValue, nextValue)) {
          result = true;
        }
      }
    }

    return result;
  },

  _findScrollElement(element) {
    let result = null;

    while (element && element.tagName) {
      if (element.classList.contains("uu5-bricks-modal-body") || element === document.documentElement) {
        result = element;
        element = null;
      } else {
        element = element.parentNode;
      }
    }

    return result;
  }
  //@@viewOff:private

  //@@viewOn:render
  //@@viewOff:render
};

InputMixin.INITIAL_FEEDBACK = INITIAL_FEEDBACK;
InputMixin.SUCCESS_FEEDBACK = SUCCESS_FEEDBACK;
InputMixin.WARNING_FEEDBACK = WARNING_FEEDBACK;
InputMixin.ERROR_FEEDBACK = ERROR_FEEDBACK;
InputMixin.LOADING_FEEDBACK = LOADING_FEEDBACK;

export default InputMixin;
