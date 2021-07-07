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
import InputMixin, {
  // INITIAL_FEEDBACK,
  ERROR_FEEDBACK,
  WARNING_FEEDBACK,
  SUCCESS_FEEDBACK,
  // LOADING_FEEDBACK
} from "./mixins/input-mixin.js";
import Context from "./form-context.js";
import SelectOption from "./select-option.js";
import SelectBody from "./internal/switch-selector-select-body.js";
import Css from "./internal/css.js";
//@@viewOff:imports

const selectExcludedProps = ["items", "children", "content", "ref_"];

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
        main: (props, state) => {
          let classes = [ns.css("switch-selector")];

          if (state.displaySelect) {
            // fake select styles
            classes.push(ns.css("select"));
          }

          return classes.join(" ");
        },
        hiddenWrapper:
          ns.css("hidden-wrapper ") +
          Css.css`
            position: absolute;
            left: 0;
            right: 0;
            visibility: hidden;
            overflow: hidden;
          `,
        buttonWrapper: Css.css`
            min-width: ${UU5.Common.Tools.isIE() ? "calc(100% - 3px)" : "100%"};
          `,
      },
    },
    //@@viewOff:statics

    //@@viewOn:propTypes
    propTypes: {
      items: UU5.Bricks.SwitchSelector.propTypes.items,
      size: UU5.Bricks.SwitchSelector.propTypes.size,
      elevation: UU5.Bricks.SwitchSelector.propTypes.elevation,
      borderRadius: UU5.Bricks.SwitchSelector.propTypes.borderRadius,
      onValidate: UU5.PropTypes.func,
      onChange: UU5.PropTypes.func,
      colorSchema: UU5.Common.ColorSchemaMixin.propTypes.colorSchema,
      message: InputMixin.propTypes.message,
      feedback: InputMixin.propTypes.feedback,
      readOnly: InputMixin.propTypes.readOnly,
      inputAttrs: InputMixin.propTypes.inputAttrs,
      inputWidth: InputMixin.propTypes.inputWidth,
      popoverLocation: SelectBody.propTypes.popoverLocation,
    },
    //@@viewOff:propTypes

    //@@viewOn:getDefaultProps
    getDefaultProps() {
      return {
        popoverLocation: SelectBody.defaultProps.popoverLocation,
      };
    },
    //@@viewOff:getDefaultProps

    //@@viewOn:reactLifeCycle
    getInitialState() {
      this._lastWidth = undefined;
      return { displaySelect: false };
    },

    UNSAFE_componentWillMount() {
      let value = this._getInitialValue();
      if (typeof this.props.onValidate === "function") {
        this._validateOnChange({ value, component: this });
      } else {
        this.setState({ value });
      }
    },

    componentDidMount() {
      this.setState(() => ({ displaySelect: this._isOverflowing() }));
    },

    UNSAFE_componentWillReceiveProps(nextProps) {
      if (nextProps.controlled) {
        let value;
        if (nextProps.value !== null && nextProps.value !== undefined) {
          value = nextProps.value;
        } else if (this.state.value !== null && this.state.value !== undefined) {
          value = this.state.value;
        } else {
          value = nextProps.items[0].value;
        }
        if (typeof this.props.onValidate === "function") {
          this._validateOnChange({ value, component: this }, true);
        } else {
          this.setFeedback(nextProps.feedback, nextProps.message, value);
        }
      }
    },

    componentDidUpdate(prevProps) {
      if (prevProps.size !== this.props.size) {
        this.setState(() => ({ displaySelect: this._isOverflowing() }));
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
          readOnly: this.props.readOnly,
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
    _registerSwitch(ref) {
      this._switchRef = ref;
    },

    _onResize({ width }) {
      if (this._lastWidth !== width) {
        this.setState(() => ({ displaySelect: this._isOverflowing() }));
      }
      this._lastWidth = width;
    },

    _isOverflowing() {
      const switchNode = UU5.Common.DOM.findNode(this._switchRef);
      const switchWrapper = switchNode?.parentElement; // input wrapper is always the parent
      // Condition because of jest tests due to parentElement attr not existing there
      if (switchWrapper) {
        const inputWrapperWidth = switchWrapper.getBoundingClientRect().width;
        const buttonWrapperWidth = !UU5.Common.Tools.isIE()
          ? switchNode.getBoundingClientRect().width
          : switchNode.scrollWidth + 3;
        return buttonWrapperWidth > inputWrapperWidth;
      } else return false;
    },

    _getSelectItems() {
      return this.props.items.map((item, index) => <SelectOption key={index} {...item} />);
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
              this.setState({ value: opt.value }, setStateCallback);
            }
          } else {
            this.showError("validateError", null, {
              context: {
                event: null,
                func: this.props.onValidate,
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

    _getInitialValue(props = this.props) {
      return props.value || typeof props.value === "number" || typeof props.value === "boolean"
        ? props.value
        : (props.items && props.items.length && props.items[0].value) || undefined;
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

    _getSelectProps() {
      let inputId = this.getId() + "-input";
      let props = {
        ...this.props,
        id: inputId,
        name: this.props.name || inputId,
        value: [this.state.value],
        mainAttrs: this.props.inputAttrs,
        disabled: this.isComputedDisabled(),
        readonly: this.isReadOnly(),
        loading: this.isLoading(),
        feedback: this.getFeedback(),
        elevation: this.props.elevation,
        bgStyle: this.props.bgStyle,
        inputWidth: this._getInputWidth(),
        colorSchema: this.props.colorSchema,
        onRemove: !this.isReadOnly() && !this.isComputedDisabled() ? (opt) => this.removeValue(opt) : null,
        onChange: this._onChange,
        popoverLocation: this.props.popoverLocation,
      };

      selectExcludedProps.forEach((propName) => {
        delete props[propName];
      });

      if (typeof props.borderRadius === "number") {
        props.borderRadius = UU5.Common.Tools.fillUnit(props.borderRadius);
      }

      return props;
    },

    _getSwitchProps(isHidden) {
      let result = {
        items: this.props.items,
        value: this.state.value,
        size: this.props.size,
        colorSchema: this._getColorSchema(),
        bgStyle: this.props.bgStyle,
        borderRadius: this.props.borderRadius,
        elevation: this.props.elevation,
        readOnly: this.isDisabled() || this.isReadOnly(),
        disabled: this.isComputedDisabled(),
        width: this.props.inputWidth,
        className: this.getClassName("buttonWrapper"),
      };

      if (this.state.feedback === ERROR_FEEDBACK) {
        result.borderWidth = 2;
        result.borderWidthFeedback = 2;
      }

      // if switch selector is hidden, we dont want to set input props to it
      if (!isHidden) {
        result.mainAttrs = this.props.inputAttrs;
        result.onChange = this._onChange;
      }

      return result;
    },

    _getMainAttrs() {
      let attrs = this._getInputAttrs();

      if (this.props.colorSchema) {
        attrs.className += " color-schema-" + UU5.Environment.getColorSchema(this.props.colorSchema);
      }

      return attrs;
    },

    _getWrapper(content) {
      if (this.props.inputWidth) {
        return content;
      } else {
        return (
          <UU5.Bricks.Resize height={undefined} onResize={this._onResize}>
            {content}
          </UU5.Bricks.Resize>
        );
      }
    },
    //@@viewOff:private

    //@@viewOn:render
    render() {
      let body;

      if (this.state.displaySelect) {
        const selectProps = this._getSelectProps();
        const switchProps = this._getSwitchProps(true);

        body = (
          <>
            <div className={this.getClassName("hiddenWrapper")}>
              <UU5.Bricks.SwitchSelector {...switchProps} ref_={this._registerSwitch} />
            </div>
            <SelectBody {...selectProps} onChange={this._onChange}>
              {this._getSelectItems()}
            </SelectBody>
          </>
        );
      } else {
        body = <UU5.Bricks.SwitchSelector {...this._getSwitchProps()} ref_={this._registerSwitch} />;
      }

      return this._getWrapper(
        <div {...this._getMainAttrs()}>
          {this.getLabel(this.getId() + "-input")}
          {this.getInputWrapper(body)}
        </div>
      );
    },
    //@@viewOff:render
  })
);

export default SwitchSelector;
