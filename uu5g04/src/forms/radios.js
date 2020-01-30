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

import "./radios.less";
//@@viewOff:imports

export const Radios = Context.withContext(
  UU5.Common.VisualComponent.create({
    displayName: "Radios", // for backward compatibility (test snapshots)
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
      tagName: ns.name("Radios"),
      classNames: {
        main: ns.css("radios"),
        inline: ns.css("inputs-inline"),
        loading: ns.css("input-loading-icon"),
        inner: props =>
          ns.css("input-inner") +
          " " +
          Css.css(`
          border-radius: ${UU5.Common.Tools.fillUnit(props.selectionBorderRadius)};
        `),
        selectionBackground: ns.css("radios-selection-background"),
        column: ns.css("radios-column")
      },
      defaults: {
        columnRegexp: /^((?:offset-)?[a-z]+)(?:-)?(\d+)$/
      },
      lsi: () => UU5.Environment.Lsi.Forms.message
    },
    //@@viewOff:statics

    //@@viewOn:propTypes
    propTypes: {
      bgStyleChecked: UU5.PropTypes.oneOf(["filled", "outline"]),
      selectionBackground: UU5.PropTypes.bool,
      selectionBorderRadius: UU5.PropTypes.oneOfType([UU5.PropTypes.string, UU5.PropTypes.number])
    },
    //@@viewOff:propTypes

    //@@viewOn:getDefaultProps
    getDefaultProps() {
      return {
        bgStyleChecked: "outline",
        selectionBackground: true,
        selectionBorderRadius: "2px"
      };
    },
    //@@viewOff:getDefaultProps

    //@@viewOn:reactLifeCycle
    componentWillMount() {
      this._itemsRefs = [];
      this._currentFocus = 0;
      let value = this._getInitialValue();
      if (this.props.onValidate && typeof this.props.onValidate === "function") {
        this._validateOnChange({ value, event: null, component: this });
      } else {
        this.setState({ value });
      }

      return this;
    },

    componentWillReceiveProps(nextProps) {
      let value = this._getInitialValue(nextProps);
      if (nextProps.controlled) {
        if (nextProps.value !== undefined) {
          if (this.props.onValidate && typeof this.props.onValidate === "function") {
            this._validateOnChange({ value, event: null, component: this }, true);
          } else {
            this.setState({ value });
          }
        }
      }
      return this;
    },

    //@@viewOff:reactLifeCycle

    //@@viewOn:interface
    onChangeDefault(opt, setStateCallback) {
      this._setValue(opt, setStateCallback);
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
      let _callCallback = typeof setStateCallback === "function";

      if (this._checkRequired({ value: value, event: null, component: this })) {
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
    _getInitialValue: function(props) {
      props = props || this.props;
      var value = null;

      if (props.value) {
        props.value.forEach((radio, i) => {
          radio.value && (value = radio.name || i.toString());
        });
      }

      return value;
    },

    _validateOnChange(opt, checkValue, setStateCallback) {
      let _callCallback = typeof setStateCallback === "function";

      if (!checkValue || this._hasValueChanged(this.state.value, opt.value)) {
        let result = typeof this.props.onValidate === "function" ? this.props.onValidate(opt) : null;
        if (result) {
          if (typeof result === "object") {
            let selectedIndex =
              result.value &&
              result.value.findIndex(item => {
                return item.value === true;
              });
            if (result.feedback) {
              _callCallback = false;
              this.setFeedback(
                result.feedback,
                result.message,
                selectedIndex ? this.props.value[selectedIndex].name : null,
                setStateCallback
              );
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

    _onChange(opt, setStateCallback) {
      if (!this.isComputedDisabled() && !this.isReadOnly() && !this.isLoading() && opt.value) {
        if (typeof this.props.onChange === "function") {
          var result = this._checkRequired(opt.value); // return null || object (error)

          let radioName = this._getRadioName(opt);
          if (result && typeof result === "object" && result.feedback === "error") {
            //this.setError(result.message, opt.value);
          } else if (typeof this.props.onValidate === "function") {
            result = this.props.onValidate({ value: radioName, event: opt.event, component: opt.component });
          } else {
            result = this.props.onChange({ value: radioName, event: opt.event, component: opt.component });
          }

          if (result && typeof result === "object") {
            this.setFeedback(result.feedback, result.message, radioName, setStateCallback);
          } else {
            this._setValue(opt, setStateCallback);
          }
        } else {
          this.onChangeDefault(opt, setStateCallback);
        }
      }

      return this;
    },

    _setValue(opt, setStateCallback) {
      opt.value = this._getRadioName(opt);
      let result = this._checkRequired(opt.value);
      if (result && typeof result === "object" && result.feedback === "error") {
        this.setError(result.message, opt.value, setStateCallback);
      } else if (typeof this.props.onValidate === "function") {
        result = this.props.onValidate(opt);
        if (typeof result === "object") {
          if (result.feedback) {
            this.setFeedback(result.feedback, result.message, result.value, setStateCallback);
          } else {
            this.setState({ value: opt.value });
          }
        } else {
          this._currentFocus = this._getIndexByName(opt.value);
          this.setInitial("", opt.value, setStateCallback);
        }
      } else {
        this._currentFocus = this._getIndexByName(opt.value);
        this.setInitial("", opt.value, setStateCallback);
      }
      return this;
    },

    _getRadioName(opt) {
      return opt.component.getName();
    },

    _getIndexByName(name) {
      let index = this._itemsRefs.findIndex(item => {
        return item.getName() === name;
      });
      return index;
    },

    _getSelectedIndex() {
      let index = this._itemsRefs.findIndex(item => {
        return !!item.getValue();
      });
      return index;
    },

    _checkRequired(value) {
      let result = true;
      if (this.props.required) {
        if (value) {
          if (typeof this.props.onChange !== "function") {
            result = { feedback: "initial", message: "", value: value };
          }
        } else {
          result = {
            feedback: "error",
            message: this.props.requiredMessage || this.getLsiComponent("requiredMessageChoice"),
            value: value
          };
        }
      }
      return result;
    },

    _addEvent() {
      let items = this._itemsRefs;
      this._currentFocus = this._getSelectedIndex();

      let handleKeyDown = e => {
        if (e.which === 38 || e.which === 40) {
          e.preventDefault();
        }
      };

      let handleKeyUp = e => {
        if (e.which === 38 || e.which === 40) {
          let move = e => {
            if (e.which === 38) {
              this._currentFocus = this._currentFocus - 1 < 0 ? items.length - 1 : this._currentFocus - 1;
            } else {
              this._currentFocus = this._currentFocus + 1 >= items.length ? 0 : this._currentFocus + 1;
            }
          };

          let loopIndex = this._currentFocus;
          move(e);
          while (items[this._currentFocus].isDisabled() && loopIndex !== this._currentFocus) {
            move(e);
          }

          // eslint-disable-next-line react/no-find-dom-node
          if (items[this._currentFocus].findDOMNode()) {
            let opt = { component: items[this._currentFocus], event: e, value: true };
            this._onChange(opt, () => {
              items[this._currentFocus].focus();
            });
          } else {
            // this is in case refs to some of the checkboxes stop being valid (e.g. get unmounted)
            handleKeyUp(e);
          }
        }

        return this;
      };
      UU5.Environment.EventListener.addWindowEvent("keydown", this.getId(), handleKeyDown);
      UU5.Environment.EventListener.addWindowEvent("keyup", this.getId(), handleKeyUp);
    },

    _removeEvent() {
      UU5.Environment.EventListener.removeWindowEvent("keydown", this.getId());
      UU5.Environment.EventListener.removeWindowEvent("keyup", this.getId());
    },

    _onFocus() {
      this._addEvent();
    },

    _onBlur() {
      this._removeEvent();
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

    _getCheckbox(key, box, selectedIndex) {
      let tabIndex;
      let checkboxProps = UU5.Common.Tools.merge({}, box);
      let disabled = this.isComputedDisabled() ? true : !!box.disabled;
      if (selectedIndex === key) {
        tabIndex = null;
      } else {
        tabIndex = "-1";
      }

      return (
        <Checkbox
          size={this.props.size}
          key={key}
          value={this.getValue() === checkboxProps.name}
          label={box.label}
          onChange={this._onChange}
          onIcon={box.onIcon || this.props.onIcon || null}
          offIcon={box.offIcon || this.props.offIcon || null}
          name={box.name}
          _radio
          labelPosition={this.props.labelPosition}
          disabled={disabled}
          readOnly={this.isReadOnly()}
          feedback={this.isLoading() && key === 0 ? "loading" : "initial"}
          inputAttrs={{
            onFocus: this._onFocus,
            onBlur: this._onBlur,
            tabIndex: tabIndex
          }}
          ref_={checkbox => {
            this._itemsRefs.push(checkbox);
          }}
          inputWidth={this._getInputWidth()}
          nestingLevel={this.props.nestingLevel}
          className={this.getClassName("inner")}
          bgStyleChecked={this.props.bgStyleChecked}
        />
      );
    },

    _getColumns(amount, selectedIndex) {
      let columns = [];
      this.props.value.map((box, key) => {
        let targetColumn = Math.floor(key / (this.props.value.length / amount));
        if (columns[targetColumn] === undefined) {
          columns[targetColumn] = [];
        }
        columns[targetColumn].push(this._getCheckbox(key, box, selectedIndex));
      });

      return columns;
    },

    _getCheckboxes() {
      let selectedIndex = this.props.value.findIndex(item => {
        return item.name === this.getValue() && !item.disabled;
      });

      if (selectedIndex === -1) {
        selectedIndex = this.props.value.findIndex(item => {
          return !item.disabled;
        });
      }

      let result = [];
      if (this.props.colWidth !== null && !this.props.inline) {
        let columns;
        let numberOfColumns = this._getNumberOfColumns();
        columns = this._getColumns(numberOfColumns, selectedIndex);
        columns.forEach(column => {
          result.push(
            <UU5.Bricks.Column colWidth={this.props.colWidth} className={this.getClassName("column")}>
              {column}
            </UU5.Bricks.Column>
          );
        });
      } else {
        result = this.props.value.map((box, key) => {
          return this._getCheckbox(key, box, selectedIndex);
        });
      }

      return result;
    },

    _getMainAttrs() {
      let attrs = this._getInputAttrs();

      if (this.props.inline) {
        attrs.className += " " + this.getClassName().inline;
      }

      if (this.props.bgStyleChecked) {
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
          {this.getInputWrapper(this.props.value ? this._getCheckboxes() : null)}
        </div>
      );
    }
    //@@viewOn:render
  })
);

export default Radios;
