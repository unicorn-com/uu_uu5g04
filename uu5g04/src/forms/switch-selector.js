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
import "uu5g04-bricks";
import ns from "./forms-ns.js";
import InputMixin, {
  INITIAL_FEEDBACK,
  ERROR_FEEDBACK,
  WARNING_FEEDBACK,
  SUCCESS_FEEDBACK,
  LOADING_FEEDBACK
} from "./mixins/input-mixin.js";
import Context from "./form-context.js";
//@@viewOff:imports

export const SwitchSelector = Context.withContext(
  UU5.Common.VisualComponent.create({
    displayName: "SwitchSelector", // for backward compatibility (test snapshots)
    //@@viewOn:mixins
    mixins: [UU5.Common.BaseMixin, UU5.Common.ElementaryMixin, InputMixin],
    //@@viewOff:mixins

    //@@viewOn:statics
    statics: {
      tagName: ns.name("SwitchSelector"),
      classNames: {
        main: ns.css("switch-selector")
      }
    },
    //@@viewOff:statics

    //@@viewOn:propTypes
    propTypes: {
      items: UU5.PropTypes.arrayOf(
        UU5.PropTypes.shape({
          value: UU5.PropTypes.string.isRequired,
          content: UU5.PropTypes.any,
          colorSchema: UU5.PropTypes.string,
          bgStyle: UU5.PropTypes.string,
          borderRadius: UU5.PropTypes.oneOfType([UU5.PropTypes.number, UU5.PropTypes.string])
        })
      ).isRequired,
      value: UU5.PropTypes.string,
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

        colorSchema: undefined,
        bgStyle: "outline",
        elevation: undefined,
        borderRadius: 2
      };
    },
    //@@viewOff:getDefaultProps

    //@@viewOn:reactLifeCycle
    componentWillMount() {
      let value = this._getInitialValue();
      if (typeof this.props.onValidate === "function") {
        this._validateOnChange({ value, component: this });
      } else {
        this.setState({ value });
      }
    },

    componentWillReceiveProps(nextProps) {
      if (nextProps.controlled) {
        let value = nextProps.value;

        if (!value && typeof value !== "boolean") {
          value = this.state.value;

          if (!value && typeof value !== "boolean") {
            value = nextProps.items[0].value;
          }
        }

        if (typeof this.props.onValidate === "function") {
          this._validateOnChange({ value, component: this }, true);
        } else {
          this.setFeedback(nextProps.feedback, nextProps.message, value);
        }
      }
    },
    //@@viewOff:reactLifeCycle

    //@@viewOn:interface
    onChangeDefault(opt, setStateCallback) {
      this.setValue(opt.value, setStateCallback);
      return this;
    },
    //@@viewOff:interface

    //@@viewOn:overriding
    reset_(setStateCallback) {
      this.setState(
        {
          message: this.props.message,
          feedback: this.props.feedback,
          value: this._getInitialValue(),
          readOnly: this.props.readOnly
        },
        setStateCallback
      );
      return this;
    },

    setValue_(value, setStateCallback) {
      if (typeof this.props.onValidate === "function") {
        this._validateOnChange({ value, component: this });
      } else {
        this.setInitial(null, value, setStateCallback);
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
              context: {
                event: null,
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

    _getInitialValue: function(props = this.props) {
      return props.value || typeof props.value === "boolean" ? props.value : props.items[0].value;
    },

    _onChange(opt) {
      if (typeof this.props.onChange === "function") {
        this.props.onChange({ ...opt, component: this });
      } else {
        this.onChangeDefault(opt);
      }
    },

    _getColorSchema() {
      let colorSchema = this.props.colorSchema;

      switch (this.state.feedback) {
        case ERROR_FEEDBACK:
          colorSchema = "danger";
          break;
        case WARNING_FEEDBACK:
          colorSchema = "warning";
          break;
        case SUCCESS_FEEDBACK:
          colorSchema = "success";
          break;
      }

      return colorSchema;
    },

    _getSwitchProps() {
      return {
        mainAttrs: this.props.inputAttrs,
        items: this.props.items,
        value: this.state.value,
        onChange: this._onChange,
        size: this.props.size,
        colorSchema: this._getColorSchema(),
        bgStyle: this.props.bgStyle,
        borderRadius: this.props.borderRadius,
        ...(this.state.feedback === ERROR_FEEDBACK ? { borderWidth: 2, borderWidthFeedback: 2 } : {}),
        elevation: this.props.elevation,
        readOnly: this.isDisabled() || this.isReadOnly(),
        disabled: this.isComputedDisabled(),
        width: this.props.inputWidth
      };
    },
    //@@viewOff:private

    //@@viewOn:render
    render() {
      let inputId = this.getId() + "-input";

      return (
        <div {...this._getInputAttrs()}>
          {this.getLabel(inputId)}
          {this.getInputWrapper(<UU5.Bricks.SwitchSelector {...this._getSwitchProps()} />)}
        </div>
      );
    }
    //@@viewOff:render
  })
);

export default SwitchSelector;
