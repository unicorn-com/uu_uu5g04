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
import Form from "./form.js";
import Controls from "./controls.js";
import Select from "./select.js";

import "./props-form.less";
//@@viewOff:imports

const DEFAULT_VALUES = {
  text: "",
  textarea: "",
  bool: false,
  number: null,
  date: "",
  time: "",
  datetime: "",
  uu5string: "",
  uu5json: null,
  select: null
};
const DEFAULT_TYPE = "text";

export const PropsForm = UU5.Common.VisualComponent.create({
  displayName: "PropsForm", // for backward compatibility (test snapshots)

  //@@viewOn:mixins
  mixins: [UU5.Common.BaseMixin, UU5.Common.PureRenderMixin, UU5.Common.ElementaryMixin, UU5.Common.SectionMixin],
  //@@viewOff:mixins

  //@@viewOn:statics
  statics: {
    tagName: ns.name("PropsForm"),
    classNames: {
      main: ns.css("propsform"),
      additionalPropsPanel: ns.css("additional-props-panel")
    },
    limits: {
      radiosMax: 5
    },
    lsi: {
      panelHeader: {
        cs: "Doplňující vlastnosti",
        en: "Additional properties"
      }
    }
  },
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {
    props: UU5.PropTypes.arrayOf(
      UU5.PropTypes.shape({
        name: UU5.PropTypes.string.isRequired,
        placeholder: UU5.PropTypes.string,
        type: UU5.PropTypes.oneOfType([
          UU5.PropTypes.array,
          UU5.PropTypes.oneOf([
            "text",
            "textarea",
            "bool",
            "number",
            "date",
            "time",
            "datetime",
            "uu5string",
            "uu5json",
            "texticon"
          ]),
          UU5.PropTypes.node
        ]),
        value: UU5.PropTypes.any,
        defaultValue: UU5.PropTypes.any,
        props: UU5.PropTypes.object,
        required: UU5.PropTypes.bool
      })
    ).isRequired,
    onSave: UU5.PropTypes.func.isRequired,
    onCancel: UU5.PropTypes.func,
    labelColWidth: UU5.PropTypes.string,
    inputColWidth: UU5.PropTypes.string,
    tagName: UU5.PropTypes.string,
    uu5string: UU5.PropTypes.bool
  },
  //@@viewOff:propTypes

  //@@viewOn:getDefaultProps
  getDefaultProps() {
    return {
      props: [],
      onSave: null,
      onCancel: null,
      labelColWidth: undefined,
      inputColWidth: undefined,
      tagName: null,
      uu5string: false
    };
  },
  //@@viewOff:getDefaultProps

  //@@viewOn:reactLifeCycle
  //@@viewOff:reactLifeCycle

  //@@viewOn:interface
  //@@viewOff:interface

  //@@viewOn:overriding
  //@@viewOff:overriding

  //@@viewOn:private
  _getDefaultPropValue(prop) {
    let defaultValue;
    // take default value set by component in props
    if (prop.defaultValue !== undefined) {
      defaultValue = prop.defaultValue;
    } else {
      // take value by set property type
      let type = this._getType(prop.type);
      defaultValue = DEFAULT_VALUES[type] === undefined ? DEFAULT_VALUES[DEFAULT_TYPE] : DEFAULT_VALUES[type];
    }

    return defaultValue;
  },

  _getType(type) {
    if (Array.isArray(type)) {
      type = type.length > this.getLimit("radiosMax") ? "select" : "radios";
    }
    return type;
  },

  _onChangeHandler(prop) {
    let onChange;
    if (prop.props && prop.props.onChange) {
      onChange = prop.props.onChange;
      delete prop.props.onChange;
    }

    return opt => {
      let onChangeCallback;
      typeof onChange === "function" && (onChangeCallback = () => onChange(opt));

      // TODO repaired in Number
      if (prop.type === "number") {
        if (opt.value === "") {
          opt.value = DEFAULT_VALUES.number;
        } else if (opt.value !== undefined) {
          opt.value = +opt.value.replace((prop.props && prop.props.decimalSeparator) || ",", ".");
        }
      }

      if (prop.type === "datetime" && prop.props && prop.props.timeZone != null) {
        // This is probably the best to use instead of the setValue ifc in all cases, but its only used here
        // because of unpredictable changes to the functionality
        opt.component.onChangeDefault(opt, onChangeCallback);
      } else {
        opt.component.setValue(opt.value, onChangeCallback);
      }

      this._setProp(prop, opt.value);
    };
  },

  _getComponent(prop) {
    let result = { props: {} };

    switch (this._getType(prop.type)) {
      case "textarea":
        result.Component = "UU5.Forms.TextArea";
        break;
      case "texticon":
        result.Component = "UU5.Forms.TextIcon";
        break;
      case "bool":
        result.Component = "UU5.Forms.Checkbox";
        result.props.onChange = this._onChangeHandler(prop);
        result.props.type = 2;
        break;
      case "number":
        result.Component = "UU5.Forms.Number";
        result.props.onChange = this._onChangeHandler(prop);
        break;
      case "date":
        result.Component = "UU5.Forms.DatePicker";
        result.props.onChange = this._onChangeHandler(prop);
        break;
      case "time":
        result.Component = "UU5.Forms.TimePicker";
        result.props.onChange = this._onChangeHandler(prop);
        break;
      case "datetime":
        result.Component = "UU5.Forms.DateTimePicker";
        result.props.onChange = this._onChangeHandler(prop);
        break;
      case "uu5string":
        result.Component = "UU5.CodeKit.Uu5StringEditor";
        result.props.rows = 5;
        break;
      case "uu5json":
        result.Component = "UU5.CodeKit.JsonEditor";
        result.props.rows = 5;
        break;
      case "select":
        result.Component = "UU5.Forms.Select";
        result.props.onChange = this._onChangeHandler(prop);
        result.children = prop.type.map(typeValue => {
          return <Select.Option value={typeValue} key={typeValue} />;
        });

        break;
      case "radios":
        result.Component = "UU5.Forms.Radios";
        result.props.onChange = this._onChangeHandler(prop);
        result.props.value = prop.type.map(typeValue => {
          return {
            label: typeValue,
            name: typeValue,
            value: typeValue === prop.value
          };
        });
        break;
      case "custom":
        result.Component = prop.name;
        break;
      default:
        result.Component = "UU5.Forms.Text";
    }

    if (!result.props.onChange) {
      let onBlur;
      if (prop.props && prop.props.onBlur) {
        onBlur = prop.props.onBlur;
        delete prop.props.onBlur;
      }

      result.props.onBlur = opt => {
        if (typeof onBlur === "function") onBlur(opt);
        else if (opt && opt.component && typeof opt.component.onBlurDefault === "function")
          opt.component.onBlurDefault(opt);

        if (this._result) {
          let value = opt.value;

          switch (prop.type) {
            case "uu5string":
              value = this._toUU5String(value);
              break;
            case "uu5json":
              try {
                value = UU5.Common.UU5Json.parse(value);
              } catch (e) {
                value = undefined;
              }
              break;
            // TODO:
            // case "date":
            //   value = UU5.Common.Tools.formatDate(opt.value, "Y-mm-dd");
          }

          // TODO repaired in Number
          if (prop.type === "number") {
            if (opt.value === "") {
              opt.value = DEFAULT_VALUES.number;
            } else if (opt.value !== undefined) {
              opt.value = +opt.value.replace((prop.props && prop.props.decimalSeparator) || ",", ".");
            }
          }

          this._setProp(prop, value);
        }
      };
    }

    return result;
  },

  _getNewValue(prop, value) {
    let defaultValue = this._getDefaultPropValue(prop);
    // remove <uu5string /> tag from default value used for input - uu5strig tag is added automatically
    if (prop.type === "uu5string") {
      // need to normalize value - add same uu5string tag before value as it is send to CodePreview component
      defaultValue = this._toUU5String(defaultValue.replace(UU5.Common.REGEXP.uu5string, ""));
    }

    if (value === defaultValue) {
      value = undefined;
    }

    return value;
  },

  _setProp(prop, value) {
    this._result && this._result.setProp(prop.name, this._getNewValue(prop, value));
  },

  _toUU5String(value) {
    if (value === null) value = DEFAULT_VALUES["uu5string"];
    // normalize representation of uu5string tag - at first remove it from string and then add it back in same format
    value = value.replace(UU5.Common.REGEXP.uu5string, "");
    return `<uu5string/>${value}`;
  },
  //@@viewOff:private

  //@@viewOn:render
  render() {
    let tagProps = {};
    let displayedChildren = [];
    let collapsedChildren = [];

    this.props.props.forEach(prop => {
      let { Component, children, props = {} } = this._getComponent(prop);

      let value = prop.value;
      if (value === undefined) {
        // process default value for property - get defaultValue
        value = this._getDefaultPropValue(prop);

        // remove <uu5string /> tag from default value used for input - uu5string tag is added automatically
        if (prop.type === "uu5string") {
          value = value.replace(UU5.Common.REGEXP.uu5string, "");
        }
      }

      tagProps[prop.name] = this._getNewValue(prop, prop.value);

      let result = UU5.Common.Tools.findComponent(
        Component,
        UU5.Common.Tools.merge(
          {},
          {
            name: prop.name,
            label: prop.label === undefined ? prop.name : prop.label,
            value: value,
            placeholder: prop.placeholder,
            required: prop.required,
            key: prop.name,
            labelColWidth: this.props.labelColWidth,
            inputColWidth: this.props.inputColWidth,
            controlled: false
          },
          props,
          prop.props
        ),
        children
      );

      if (prop.visible === false) {
        collapsedChildren.push(result);
      } else {
        displayedChildren.push(result);
      }
    });

    return (
      <Form {...this.getMainPropsToPass()} onSave={this.props.onSave} onCancel={this.props.onCancel}>
        {displayedChildren}
        {!!collapsedChildren.length && (
          <UU5.Bricks.Panel
            bgStyleHeader="underline"
            iconAlign="after"
            iconCollapsed={"mdi-menu-down"}
            iconExpanded={"mdi-menu-up"}
            header={this.getLsiComponent("panelHeader")}
            className={this.getClassName("additionalPropsPanel")}
          >
            {collapsedChildren}
          </UU5.Bricks.Panel>
        )}
        {this.props.tagName && (
          <UU5.Bricks.CodePreview
            tagName={this.props.tagName}
            props={tagProps}
            uu5string={this.props.uu5string}
            ref_={ref => (this._result = ref)}
          />
        )}
        <Controls />
      </Form>
    );
  }
  //@@viewOff:render
});

export default PropsForm;
