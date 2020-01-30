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

import InputMixin from "./mixins/input-mixin.js";
import TextInput from "./internal/text-input.js";

import Context from "./form-context.js";

import "./slider.less";
//@@viewOff:imports

export const Slider = Context.withContext(
  UU5.Common.VisualComponent.create({
    displayName: "Slider", // for backward compatibility (test snapshots)
    //@@viewOn:mixins
    mixins: [
      UU5.Common.BaseMixin,
      UU5.Common.PureRenderMixin,
      UU5.Common.ElementaryMixin,
      UU5.Common.ContentMixin,
      UU5.Common.ColorSchemaMixin,
      InputMixin
    ],
    //@@viewOff:mixins

    //@@viewOn:statics
    statics: {
      tagName: ns.name("Slider"),
      classNames: {
        main: ns.css("slider"),
        inputGroup: ns.css("slider-input-group"),
        slider: ns.css("slider-slider"),
        number: ns.css("slider-number"),
        sliderReadOnly: ns.css("slider-slider-read-only")
      },
      defaults: {
        nanMessage: "Please insert a number"
      }
    },
    //@@viewOff:statics

    //@@viewOn:propTypes
    propTypes: {
      // TODO
      //position: UU5.PropTypes.oneOf(['horizontal', 'vertical']),
      min: UU5.PropTypes.number,
      max: UU5.PropTypes.number,
      step: UU5.PropTypes.number,
      value: UU5.PropTypes.number,
      onChange: UU5.PropTypes.func,
      onChanged: UU5.PropTypes.func
    },
    //@@viewOff:propTypes

    //@@viewOn:getDefaultProps
    getDefaultProps() {
      return {
        min: 0,
        max: 10,
        step: 1,
        value: 0,
        onChanged: null
      };
    },
    //@@viewOff:getDefaultProps

    //@@viewOn:reactLifeCycle
    getInitialState() {
      let step = this._getUsedStep(this.props.step);
      return {
        step
      };
    },
    componentWillMount() {
      let value = this._getValueInInterval(this.props.value);
      if (this.props.onValidate && typeof this.props.onValidate === "function") {
        this._validateOnChange({ value: value, event: null, component: this });
      } else {
        this.setFeedback(this.props.feedback, this.props.message, value);
      }
      return this;
    },

    componentWillUnmount() {
      this._removeEvent();
    },

    componentWillReceiveProps(nextProps) {
      if (nextProps.controlled) {
        let value = typeof nextProps.value === "number" ? nextProps.value : nextProps.min;

        if (this.props.onValidate && typeof this.props.onValidate === "function") {
          this._validateOnChange({ value, event: null, component: this }, true);
        } else {
          this.setFeedback(nextProps.feedback, nextProps.message, value);
        }
      }
      this.setState({ step: this._getUsedStep(nextProps.step) });

      return this;
    },
    //@@viewOff:reactLifeCycle

    //@@viewOn:interface
    onChangeDefault(opt, setStateCallback) {
      let _callCallback = typeof setStateCallback === "function";

      if (typeof this.props.onValidate === "function") {
        _callCallback = false;
        this._validateOnChange(opt, false, setStateCallback);
      } else {
        let result = this._checkNumberResultChange(opt);
        if (result.feedback && result.feedback === "warning") {
          _callCallback = false;
          this.setFeedback(result.feedback, result.message, result.value, setStateCallback);
        } else {
          _callCallback = false;
          this.setInitial(null, opt.value, () => {
            let onChanged = this._getOnChanged(opt.value, opt.event);
            if (typeof onChanged === "function") {
              onChanged();
            }

            if (typeof setStateCallback === "function") {
              setStateCallback();
            }
          });
        }
      }

      if (_callCallback) {
        setStateCallback();
      }

      return this;
    },
    //@@viewOff:interface

    //@@viewOn:overriding
    setValue_(value, setStateCallback) {
      if (typeof this.props.onValidate === "function") {
        this._validateOnChange({ value: value }, false, setStateCallback);
      } else {
        this.setInitial(null, value, setStateCallback);
      }

      return this;
    },

    getInputWidth_() {
      return this.props.inputWidth === "auto" ? null : this.props.inputWidth;
    },
    //@@viewOff:overriding

    //@@viewOn:private
    _getUsedStep(propsStep) {
      let step = propsStep;
      if (step <= 0) {
        this.showWarning("Invalid step. Step was set as default: 1");
        step = 1;
      }
      return step;
    },
    _mountSlider(slider) {
      this._slider = slider;
    },
    _updateByStep(e, increase) {
      let value = Number(((this.getValue() || 0) + (increase ? this.state.step : -this.state.step)).toFixed(10));
      let opt = { value: value, event: e, component: this };

      if (typeof this.props.onChange === "function") {
        this.props.onChange(opt);
      } else {
        this.onChangeDefault(opt);
      }
      return this;
    },

    _onFocus() {
      this.setState({ inputFocused: true });

      UU5.Environment.EventListener.addWindowEvent("keydown", this.getId(), e => {
        let current = this.getValue();
        if (typeof current === "number") {
          let newValue;
          switch (e.which) {
            case 39:
            case 38: // top
              e.preventDefault();
              newValue = current + this.state.step;
              if (newValue <= this.props.max && newValue >= this.props.min) {
                this._updateByStep(e, true);
              }
              break;
            case 37:
            case 40: // bottom
              e.preventDefault();
              newValue = current - this.state.step;
              if (newValue >= this.props.min && newValue <= this.props.max) {
                this._updateByStep(e, false);
              }
              break;
            default:
              break;
          }
        }
      });
    },

    _onBlur() {
      let newState = { inputFocused: false, value: this._getValueInInterval(this.state.value) };
      if (this.state.value === "" && this.props.max >= 0 && this.props.min <= 0) {
        newState.value = 0;
      }
      this._removeEvent();
      this.setState(newState);
    },

    _removeEvent() {
      UU5.Environment.EventListener.removeWindowEvent("keydown", this.getId());
      return this;
    },

    // _onChange(e) {
    //   if (!this.isComputedDisabled()) {
    //     var value = !this.getValue();
    //     var newState = this._validateValue(value);
    //
    //     if (newState) {
    //       this.setState(newState);
    //     } else {
    //       if (this.props.onChange) {
    //         this.props.onChange({ value: value, input: this, event: e });
    //       } else {
    //         this.setState({ value: value });
    //       }
    //     }
    //   }
    //   return this;
    // },

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
              context: { event: e, func: this.props.onValidate, result: result }
            });
          }
        }
      }

      if (_callCallback) {
        setStateCallback();
      }

      return this;
    },

    _getMainAttrs() {
      return this.getInputMainAttrs();
    },

    _getInputGroupAttrs() {
      return {
        className: this.getClassName().inputGroup
      };
    },

    _getValueInInterval(value) {
      if (typeof value == "string" && value !== "" && !value.match(/[.,]$/)) {
        value = parseFloat(value);
      }
      if (isNaN(value)) {
        value = null;
      }
      if (this.state.step > 1) {
        value = Math.round((value - this.props.min) / this.state.step) * this.state.step + this.props.min;
      }
      return value > this.props.max
        ? this.props.max
        : value < this.props.min
        ? this.props.min
        : value === "" || value == null
        ? 0
        : value;
    },

    _getSliderProps() {
      // TODO min max default position
      let value =
        this.state.value || this.state.value === 0
          ? this.state.value
          : this._getValueInInterval(this._slider ? this._slider.getValue() : this.props.value);
      if (typeof value !== "number") value = parseInt(value);

      let content = this.getContent() || (this.props.children && UU5.Common.Children.toArray(this.props.children));
      let className = this.getClassName("slider");
      this.isReadOnly() && (className += " " + this.getClassName("sliderReadOnly"));

      switch (!this.isComputedDisabled() && this.state.feedback) {
        case "success":
          className += " color-schema-" + UU5.Environment.getColorSchema("success");
          break;
        case "warning":
          className += " color-schema-" + UU5.Environment.getColorSchema("warning");
          break;
        case "error":
          className += " color-schema-" + UU5.Environment.getColorSchema("danger");
          break;
      }

      return {
        name: this.getName(),
        className: className,
        colorSchema: this.props.colorSchema,
        min: this.props.min,
        max: this.props.max,
        step: this.state.step,
        value: value,
        content: content,
        onChange: this._onChange,
        onChanged: this.props.onChanged,
        disabled: this.isComputedDisabled() || this.isReadOnly(),
        size: this.props.size,
        style: { width: this._getInputWidth() }
      };
    },

    _getNumberProps() {
      let value = this.state.value || this.state.value === 0 ? this.state.value : "";
      if (!this.state.inputFocused) {
        value = this._getValueInInterval(value);
      }

      return {
        className: this.getClassName().number,
        min: this.props.min,
        max: this.props.max,
        value: value.toString(),
        onChange: event => {
          this._onChange({ component: this, value: event.target.value, event: event });
        },
        onBlur: opt => {
          if (this.state.value < this.props.min) {
            opt.component.setValue(this.props.min);
          } else if (this.state.value > this.props.max) {
            opt.component.setValue(this.props.max);
          }
        },
        disabled: this.isComputedDisabled(),
        onChangeFeedback: this._onChangeNumberFeedback
      };
    },

    _getOnChanged(value, e) {
      let onChanged;
      if (typeof this.props.onChanged === "function") {
        onChanged = () => {
          this.props.onChanged({ value: value, component: this, event: e });
        };
      }

      return onChanged;
    },

    _onChange(opt) {
      if (!this.isComputedDisabled()) {
        if (typeof this.props.onChange == "function") {
          opt.component = this;
          this.props.onChange(opt);
        } else {
          this.onChangeDefault(opt);
        }
      }
      return this;
    },

    _checkNumberResultChange(opt) {
      if (opt.value) {
        opt.value = opt.value.toString();
        let isComma = opt.value.indexOf(",") > 0;

        opt.value = opt.value.trim().replace(new RegExp(this.props.thousandSeparator, "g"), "");
        opt.value = opt.value.replace(",", ".");
        let isNan = isNaN(opt.value);

        if (isNan && !opt.value.match(/^[.,-]$/)) {
          opt.value = this.state.value;
          opt.feedback = "warning";
          opt.message = this.getDefault().nanMessage;
        } else {
          isComma && (opt.value = opt.value.replace(".", ","));
          if (opt.value !== "-" && !opt.value.match(/[.,]$/)) {
            opt.value = parseFloat(opt.value);
          }
        }
      }
      return opt;
    },

    _onChangeNumberFeedback(opt) {
      this.setValue(opt.value ? +opt.value : null, opt.callback);
      //this.setFeedback(opt.feedback, opt.message, opt.value ? +opt.value : null, opt.callback);
      return this;
    },

    // _getFeedbackIcon(){
    //   let icon = this.props.required ? this.props.successIcon : null;
    //   switch (this.getFeedback()) {
    //     case 'success':
    //       icon = this.props.successIcon;
    //       break;
    //     case 'warning':
    //       icon = this.props.warningIcon;
    //       break;
    //     case 'error':
    //       icon = this.props.errorIcon;
    //       break;
    //   }
    //   return icon;
    // },

    //@@viewOff:private

    //@@viewOn:render
    render() {
      let inputId = this.getId() + "-input";
      let inputAttrs = this.props.inputAttrs || {};

      inputAttrs.className === "" ? delete inputAttrs.className : null;
      return (
        <div {...this._getInputAttrs()}>
          {this.getLabel(inputId)}
          {this.getInputWrapper([
            <UU5.Bricks.Slider ref_={this._mountSlider} {...this._getSliderProps()} />,
            <TextInput
              {...this._getNumberProps()}
              id={inputId}
              name={this.props.name || inputId}
              placeholder={this.props.placeholder}
              type="text"
              mainAttrs={inputAttrs}
              disabled={this.isComputedDisabled()}
              readonly={this.isReadOnly()}
              loading={this.isLoading()}
              feedback={this.getFeedback()}
              onFocus={!this.isReadOnly() && !this.isDisabled() ? () => this._onFocus() : null}
              onBlur={() => this._onBlur()}
              colorSchema={this.props.colorSchema}
              size={this.props.size}
            />
          ])}
        </div>
      );
    }
    //@@viewOff:render
  })
);

export default Slider;
