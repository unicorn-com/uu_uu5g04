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
import ClassNames from "../core/common/class-names.js";

import InputMixin from "./mixins/input-mixin.js";
import Loading from "./internal/loading.js";

import Context from "./form-context.js";

import "./checkbox.less";
//@@viewOff:imports

export const Checkbox = Context.withContext(
  UU5.Common.VisualComponent.create({
    displayName: "Checkbox", // for backward compatibility (test snapshots)
    //@@viewOn:mixins
    mixins: [
      UU5.Common.BaseMixin,
      UU5.Common.PureRenderMixin,
      UU5.Common.ElementaryMixin,
      UU5.Common.ColorSchemaMixin,
      InputMixin
    ],
    //@@viewOff:mixins

    //@@viewOn:statics
    statics: {
      tagName: ns.name("Checkbox"),
      classNames: {
        main: ns.css("checkbox"),
        button: ns.css("checkbox-button"),
        right: ns.css("input-label-right"),
        rightWrapper: ns.css("right-wrapper"),
        radio: ns.css("input-radio"),
        checked: ns.css("checkbox-checked"),
        dot: ns.css("checkbox-dot"),
        loading: ns.css("input-loading-icon"),
        typeSwitch: ns.css("checkbox-type-switch")
      },
      defaults: {
        onIcon: "mdi-check"
      }
    },
    //@@viewOff:statics

    //@@viewOn:propTypes
    propTypes: {
      value: UU5.PropTypes.bool,
      onIcon: UU5.PropTypes.string,
      offIcon: UU5.PropTypes.string,
      labelPosition: UU5.PropTypes.oneOf(["left", "right"]),
      _radio: UU5.PropTypes.bool,
      type: UU5.PropTypes.number,
      bgStyleChecked: UU5.PropTypes.oneOf(["filled", "outline"])
    },
    //@@viewOff:propTypes

    //@@viewOn:getDefaultProps
    getDefaultProps() {
      return {
        value: false,
        onIcon: "",
        offIcon: "",
        labelPosition: "left",
        _radio: false,
        type: 1,
        bgStyleChecked: "outline"
      };
    },
    //@@viewOff:getDefaultProps

    //@@viewOn:reactLifeCycle
    componentWillMount() {
      if (this.props.onValidate && typeof this.props.onValidate === "function") {
        this._validateOnChange({ value: this.state.value, event: null, component: this });
      }
    },

    componentWillReceiveProps(nextProps) {
      if (nextProps.controlled) {
        if (this.props.onValidate && typeof this.props.onValidate === "function") {
          this._validateOnChange({ value: nextProps.value, event: null, component: this }, true);
        } else {
          this.setState({ value: nextProps.value });
        }
      }
    },

    //@@viewOff:reactLifeCycle

    //@@viewOn:interface
    onChangeDefault(opt, setStateCallback) {
      if (this.props.onValidate && typeof this.props.onValidate === "function") {
        this._validateOnChange({ value: opt.value, event: opt.event, component: this }, false, setStateCallback);
      } else {
        let result = this.getChangeFeedback(opt);
        this.setState(
          {
            feedback: result.feedback,
            message: result.message,
            value: result.value
          },
          setStateCallback
        );
      }
      return this;
    },
    //@@viewOff:interface

    //@@viewOn:overriding
    focus_() {
      this._focusElement.focus();
      return this;
    },

    getInputWidth_() {
      return this.props.inputWidth === "auto" ? null : this.props.inputWidth;
    },
    //@@viewOff:overriding

    //@@viewOn:private
    _validateOnChange(opt, checkValue, setStateCallback) {
      let _callCallback = typeof setStateCallback === "function";

      if (!checkValue || this._hasValueChanged(this.state.value, opt.value)) {
        let result =
          this.props.onValidate && typeof this.props.onValidate === "function" ? this.props.onValidate(opt) : null;
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
              context: { event: opt.event, func: this.props.onValidate, result: result }
            });
          }
        }
      }

      if (_callCallback) {
        setStateCallback();
      }

      return this;
    },

    _onChange(e) {
      let opt = { value: !this.state.value, event: e, component: this };
      if (!this.isComputedDisabled() && !this.isReadOnly() && !this.isLoading()) {
        if (typeof this.props.onChange === "function") {
          this.props.onChange(opt);
        } else {
          this.onChangeDefault(opt);
        }
      }

      return this;
    },

    _onSwitchChange(opt) {
      if (opt && opt.value === undefined) {
        opt.value = opt.switchedOn;
      }

      if (!this.isDisabled() && !this.isReadOnly()) {
        if (typeof this.props.onChange === "function") {
          opt.component = this;
          this.props.onChange(opt);
        } else {
          this.onChangeDefault(opt);
        }
      }

      return this;
    },

    _getEventPath(e) {
      let path = [];
      let node = e.target;
      while (node != document.body && node != document.documentElement && node) {
        path.push(node);
        node = node.parentNode;
      }
      return path;
    },

    _getMainAttrs() {
      let mainAttrs = this._getInputAttrs();
      mainAttrs.className += this.state.value ? " " + this.getClassName().checked : "";
      if (this.props._radio) {
        mainAttrs.className += " " + this.getClassName().radio;
      }

      if (this.props.labelPosition === "right") {
        mainAttrs.className += " " + this.getClassName().right;
      }

      if (this.props.type === 2) {
        mainAttrs.className += " " + this.getClassName().typeSwitch;
      }

      if (this.props.bgStyleChecked && this.props.type !== 2) {
        mainAttrs.className += " " + ClassNames[this.props.bgStyleChecked];
      }

      let handleClick = e => {
        let matches = this._getEventPath(e).some(item => {
          let functionType = item.matches ? "matches" : "msMatchesSelector";
          if (item[functionType]) {
            return item[functionType]("button.uu5-forms-checkbox-button, .uu5-forms-label");
          } else {
            return false;
          }
        });
        if (matches) {
          this._onChange(e);
        }
      };

      if (!mainAttrs.onClick) {
        mainAttrs.onClick = e => {
          handleClick(e);
        };
      }

      return mainAttrs;
    },

    _getIcon() {
      let icon;

      if (this.props._radio && this.state.value && !this.props.onIcon) {
        icon = <span className={this.getClassName("dot")} />;
      } else {
        icon = (
          <UU5.Bricks.Icon
            icon={this.state.value ? this.props.onIcon || this.getDefault("onIcon") : this.props.offIcon}
          />
        );
      }

      return icon;
    },

    _getWrapperAttrs() {
      let attrs = {};

      attrs.className = this.getClassName("rightWrapper");

      if (this.props.inputWidth) {
        attrs.style = { width: this.getInputWidth_() };
      }

      return attrs;
    },
    //@@viewOff:private
    //@@viewOn:render
    render() {
      let inputId = this.getId() + "-input";
      let label = this.getLabel(inputId);
      let result;

      if (this.props.type === 2) {
        result = (
          <UU5.Bricks.Switch
            className={this.getClassName().button}
            colorSchema={this.props.colorSchema}
            disabled={this.isComputedDisabled()}
            content={this._getIcon()}
            switchedOn={this.state.value}
            onChange={this._onSwitchChange}
            size={this.props.size}
            onIcon={this.props.onIcon}
            offIcon={this.props.offIcon}
            loading={this.isLoading()}
            ref_={switchComponent => (this._focusElement = switchComponent)}
            mainAttrs={UU5.Common.Tools.merge(
              {
                disabled: this.isReadOnly() || this.isComputedDisabled()
              },
              this.props.inputAttrs
            )}
          />
        );
      } else if (this.isLoading()) {
        result = <Loading className={this.getClassName("loading")} id={this.getId()} />;
      } else {
        result = (
          <UU5.Bricks.Button
            className={this.getClassName().button}
            colorSchema="custom"
            disabled={this.isComputedDisabled()}
            mainAttrs={UU5.Common.Tools.merge(
              {
                disabled: this.isReadOnly() || this.isComputedDisabled()
              },
              this.props.inputAttrs
            )}
            content={this._getIcon()}
            ref_={button => (this._focusElement = button)}
            bgStyle={this.props.bgStyleChecked}
          />
        );
      }

      return (
        <div {...this._getMainAttrs()}>
          {this.props.labelPosition === "left" && label}
          {this.getInputWrapper(
            <UU5.Bricks.Div {...this._getWrapperAttrs()}>
              {result}
              {this.props.labelPosition === "right" && label}
            </UU5.Bricks.Div>
          )}
        </div>
      );
    }
    //@@viewOff:render
  })
);

export default Checkbox;
