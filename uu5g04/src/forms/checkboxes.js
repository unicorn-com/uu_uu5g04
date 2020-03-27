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
import ClassNames from "../core/common/class-names.js";
import Css from "./internal/css.js";

import InputMixin from "./mixins/input-mixin.js";
import GroupMixin from "./mixins/group-mixin.js";
import Checkbox from "./checkbox.js";

import Context from "./form-context.js";

import "./checkboxes.less";
//@@viewOff:imports

export const Checkboxes = Context.withContext(
  UU5.Common.VisualComponent.create({
    displayName: "Checkboxes", // for backward compatibility (test snapshots)
    //@@viewOn:mixins
    mixins: [
      UU5.Common.BaseMixin,
      UU5.Common.PureRenderMixin,
      UU5.Common.ElementaryMixin,
      UU5.Common.ColorSchemaMixin,
      UU5.Common.ScreenSizeMixin,
      InputMixin,
      GroupMixin
    ],
    //@@viewOff:mixins

    //@@viewOn:statics
    statics: {
      tagName: ns.name("Checkboxes"),
      classNames: {
        main: ns.css("checkboxes"),
        inline: ns.css("inputs-inline"),
        inner: props =>
          ns.css("input-inner") +
          " " +
          Css.css(`
          border-radius: ${UU5.Common.Tools.fillUnit(props.selectionBorderRadius)};
        `),
        selectionBackground: ns.css("checkboxes-selection-background"),
        column: ns.css("checkboxes-column")
      },
      defaults: {
        onIcon: "mdi-check",
        columnRegexp: /^((?:offset-)?[a-z]+)(?:-)?(\d+)$/
      },
      lsi: () => UU5.Environment.Lsi.Forms.message
    },
    //@@viewOff:statics

    //@@viewOn:propTypes
    propTypes: {
      type: UU5.PropTypes.number,
      bgStyleChecked: UU5.PropTypes.oneOf(["filled", "outline"]),
      selectionBackground: UU5.PropTypes.bool,
      selectionBorderRadius: UU5.PropTypes.oneOfType([UU5.PropTypes.string, UU5.PropTypes.number])
    },
    //@@viewOff:propTypes

    //@@viewOn:getDefaultProps
    getDefaultProps() {
      return {
        type: 1,
        bgStyleChecked: "outline",
        selectionBackground: true,
        selectionBorderRadius: "2px"
      };
    },
    //@@viewOff:getDefaultProps

    //@@viewOn:reactLifeCycle
    componentWillMount() {
      let value = this._getInitialValue();

      if (this.props.onValidate && typeof this.props.onValidate === "function") {
        this._validateOnChange({ value: value, event: null, component: this });
      } else {
        this.setState({ value: value });
      }

      return this;
    },

    componentWillReceiveProps(nextProps) {
      if (this.props.controlled) {
        if (nextProps.value !== undefined) {
          let newValue = this.state.value;
          nextProps.value.forEach(function(value) {
            newValue[value.name] = value.value;
          });

          if (this.props.onValidate && typeof this.props.onValidate === "function") {
            this._validateOnChange({ value: newValue, event: null, component: this }, true);
          } else {
            this.setState({ value: newValue });
          }
        }
      }
    },

    //@@viewOff:reactLifeCycle

    //@@viewOn:interface
    onChangeDefault(opt, setStateCallback) {
      let result = this._checkRequired(opt);

      if (result && typeof result === "object" && result.feedback === "error") {
        this.setError(result.message, result.value, setStateCallback);
      } else if (typeof this.props.onValidate === "function") {
        result.value = this._getValue(result.value);
        result = this.props.onValidate(result);
        if (result) {
          result.value = this._getValue(result.value);
          this.setFeedback(result.feedback, result.message, result.value, setStateCallback);
        } else {
          this.setInitial("", this._getValue(opt.value), setStateCallback);
        }
      } else {
        this.setInitial("", result.value, setStateCallback);
      }

      return this;
    },
    //@@viewOff:interface

    //@@viewOn:overriding
    reset_(setStateCallback) {
      let value = this._getInitialValue();
      this.setState(
        {
          message: this.props.message,
          feedback: this.props.feedback,
          value: value,
          readOnly: this.props.readOnly
        },
        setStateCallback
      );
    },

    getValue_() {
      return this._getValue();
    },

    setValue_(value, setStateCallback) {
      if (this._checkRequired({ value, event: null, component: this })) {
        if (typeof this.props.onValidate === "function") {
          this._validateOnChange({ value, event: null, component: this }, false, setStateCallback);
        } else {
          this.setInitial(null, value, setStateCallback);
        }
      }

      return this;
    },

    isValid_(setStateCallback) {
      let result = true;

      if (this.props.required) {
        let value = this.getValue();

        result = false;
        if (value) {
          for (let k in value) {
            result = value[k];
            if (result) break;
          }
        }

        if (!result) {
          this.setError(this.props.requiredMessage || this.getLsiComponent("requiredMessage"));
        }
      }

      return result;
    },

    onChangeFeedbackDefault_(opt) {
      opt.value = this._getValue(opt.value);
      this.setFeedback(opt.feedback, opt.message, opt.value, opt.callback);

      return this;
    },
    //@@viewOff:overriding

    //@@viewOn:private
    _getInitialValue(props) {
      props = props || this.props;
      let value = {};

      if (props.value) {
        props.value.forEach(function(checkbox, i) {
          value[checkbox.name || i.toString()] = checkbox.value || false;
        });
      }

      return value;
    },

    _onChange(opt) {
      opt.value = !opt.value;
      opt.value = this._getNewState(opt);

      if (!this.isComputedDisabled() && !this.isReadOnly()) {
        if (typeof this.props.onChange === "function") {
          let result = this._checkRequired(opt, true);

          result.value = this._getValue(result.value);
          result.component = this;

          if (result && typeof result === "object" && result.feedback === "error") {
            this.setError(result.message, result.value);
          } else if (typeof this.props.onValidate === "function") {
            result = this.props.onValidate(result);
          } else {
            result = this.props.onChange(result);
          }

          if (result && typeof result === "object") {
            let changeFeedbackOpt = {
              feedback: result.feedback,
              message: result.message,
              value: result.value,
              callback: result.setStateCallback,
              component: this
            };

            if (typeof this.props.onChangeFeedback === "function") {
              this.props.onChangeFeedback(changeFeedbackOpt);
            } else {
              this.onChangeFeedbackDefault(changeFeedbackOpt);
            }
          }
        } else {
          this.onChangeDefault(opt);
        }
      }

      return this;
    },

    _validateOnChange(opt, checkValue, setStateCallback) {
      let _callCallback = typeof setStateCallback === "function";
      opt.value && (opt.value = this._getValue(opt.value));

      if (!checkValue || this._hasValueChanged(this.state.value, opt.value)) {
        let result = typeof this.props.onValidate === "function" ? this.props.onValidate(opt) : null;

        if (result) {
          if (typeof result === "object") {
            if (result.feedback) {
              result.value = this._getValue(result.value);
              _callCallback = false;
              this.setFeedback(result.feedback, result.message, result.value, setStateCallback);
            } else {
              //TODO: verify opt.value - must be object
              _callCallback = false;
              this.setState({ value: opt.value }, setStateCallback);
            }
          } else {
            this.showError("validateError", null, {
              context: { event: e, func: this.props.onValidate, result: result }
            });
          }
        } else {
          _callCallback = false;
          this.setState({ value: opt.value }, setStateCallback);
        }
      }

      if (_callCallback) {
        setStateCallback();
      }

      return this;
    },

    _getValue(value) {
      let newValue = {};
      if (this.props.value) {
        value = value || this.state.value;
        value &&
          Object.keys(value).forEach(key => {
            for (let i = 0; i < this.props.value.length; i++) {
              let item = UU5.Common.Tools.merge({}, this.props.value[i]);
              if (item.name === key) {
                newValue[key] = value[key];
              }
            }
          });
      } else {
        newValue = null;
      }
      return newValue;
    },

    _checkRequired(opt) {
      if (this.props.required) {
        if (this._isSelected(opt.value)) {
          if (typeof this.props.onChange !== "function") {
            opt = { feedback: "initial", message: "", value: opt.value };
          }
        } else if (this.shouldValidateRequired()) {
          opt = {
            feedback: "error",
            message: this.props.requiredMessage || this.getLsiComponent("requiredMessageGroup"),
            value: opt.value
          };
        }
      }

      return opt;
    },

    _getNewState(opt) {
      let newState = {};

      this.props.value &&
        this.props.value.forEach((item, i) => {
          let name = item.name || i.toString();
          let value = this.state.value[name] || false;
          if (name === opt.component.getName()) {
            value = !opt.value;
          }
          newState[name] = value;
        });

      return newState;
    },

    _isSelected(newState) {
      let value = newState ? UU5.Common.Tools.merge({}, this.state.value, newState) : this.state.value;

      return (
        Object.keys(value)
          .map(name => {
            return value[name];
          })
          .indexOf(true) > -1
      );
    },

    _getNumberOfColumns() {
      let currentScreenSize = this.getScreenSize();
      let newBsColWidth = this.props.colWidth;
      if (typeof newBsColWidth === "string") {
        let colWidthArray = newBsColWidth.split(" ");
        newBsColWidth = {};
        colWidthArray.forEach(colWidth => {
          let match = colWidth.match(this.getDefault().columnRegexp);
          newBsColWidth[match[1]] = parseInt(match[2]);
        });
      }
      return newBsColWidth && newBsColWidth[currentScreenSize] !== undefined
        ? Math.round(12 / newBsColWidth[currentScreenSize])
        : null;
    },

    _getColumns(amount) {
      let columns = [];
      this.props.value.map((box, key) => {
        let checkboxProps = UU5.Common.Tools.merge({}, box);
        let disabled = this.isComputedDisabled() ? true : !!box.disabled;
        let targetColumn = Math.floor(key / (this.props.value.length / amount));
        if (columns[targetColumn] === undefined) {
          columns[targetColumn] = [];
        }
        columns[targetColumn].push(
          <Checkbox
            key={key}
            value={this.state.value && this.state.value[checkboxProps.name]}
            label={box.label}
            onChange={this._onChange}
            name={box.name}
            size={this.props.size}
            labelPosition={this.props.labelPosition}
            disabled={disabled}
            readOnly={this.isReadOnly()}
            onIcon={box.onIcon || this.props.onIcon || this.getDefault().onIcon}
            offIcon={box.offIcon || this.props.offIcon}
            type={this.props.type}
            feedback={this.isLoading() && key === 0 ? "loading" : "initial"}
            inputWidth={this._getInputWidth()}
            colorSchema={this.props.colorSchema}
            className={this.getClassName("inner")}
            bgStyleChecked={this.props.bgStyleChecked}
          />
        );
      });

      return columns;
    },

    _getCheckboxes() {
      let result = [];
      let numberOfColumns = this._getNumberOfColumns();
      if (this.props.colWidth !== null && !this.props.inline && numberOfColumns) {
        let columns;
        columns = this._getColumns(numberOfColumns);
        columns.forEach(column => {
          result.push(
            <UU5.Bricks.Column colWidth={this.props.colWidth} className={this.getClassName("column")}>
              {column}
            </UU5.Bricks.Column>
          );
        });
      } else {
        result = this.props.value.map((box, key) => {
          let checkboxProps = UU5.Common.Tools.merge({}, box);
          let disabled = this.isComputedDisabled() ? true : !!box.disabled;

          return (
            <Checkbox
              key={key}
              value={this.state.value && this.state.value[checkboxProps.name]}
              label={box.label}
              onChange={this._onChange}
              name={box.name}
              size={this.props.size}
              labelPosition={this.props.labelPosition}
              disabled={disabled}
              readOnly={this.isReadOnly()}
              onIcon={box.onIcon || this.props.onIcon || this.getDefault().onIcon}
              offIcon={box.offIcon || this.props.offIcon}
              type={this.props.type}
              feedback={this.isLoading() && key === 0 ? "loading" : "initial"}
              inputWidth={this._getInputWidth()}
              colorSchema={this.props.colorSchema}
              className={this.getClassName("inner")}
              bgStyleChecked={this.props.bgStyleChecked}
            />
          );
        });
      }

      return result;
    },

    _getMainAttrs() {
      let attrs = this._getInputAttrs();

      if (this.props.inline) {
        attrs.className += " " + this.getClassName().inline;
      }

      if (this.props.bgStyleChecked && this.props.type !== 2) {
        attrs.className += " " + ClassNames[this.props.bgStyleChecked];
      }

      if (this.props.selectionBackground) {
        attrs.className += " " + this.getClassName("selectionBackground");
      }

      return attrs;
    },
    //@@viewOff:private

    //@@viewOn:render
    render() {
      let inputId = this.getId() + "-input";
      return (
        <div {...this._getMainAttrs()}>
          {this.getLabel(inputId)}
          {this.getInputWrapper(this.props.value ? [this._getCheckboxes()] : null)}
        </div>
      );
    }
    //@@viewOn:render
  })
);

export default Checkboxes;
