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

import * as UU5 from "uu5g04";
import "uu5g04-bricks";
import { FormContext } from "../form-context.js";
import "./form-mixin.less";
import Css from "../internal/css.js";

export const FormMixin = {
  //@@viewOn:mixins
  //@@viewOff:mixins

  //@@viewOn:statics
  statics: {
    "UU5.Forms.FormMixin": {
      classNames: {
        form: props =>
          "uu5-common-form" +
          " " +
          Css.css(`
          padding: ${UU5.Common.Tools.fillUnit(props.padding)};
        `)
      },
      warnings: {
        formInForm: "Form control %s should not be placed in other form control %s.",
        nonRegistered: "Form control with ID %s cannot be unregistered. Component with the ID is not registered.",
        noName: "Form control has not any name. It will be used its ID %s."
      },
      errors: {
        duplicateId: "Duplicate id '%s' of a form control."
      },
      lsi: () => UU5.Environment.Lsi.Forms.formMixin
    }
  },
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {
    values: UU5.PropTypes.object,
    progressIndicator: UU5.PropTypes.any, // loading
    onInit: UU5.PropTypes.func,
    onSave: UU5.PropTypes.func,
    onSaveDone: UU5.PropTypes.func,
    onSaveFail: UU5.PropTypes.func,
    onSaveByKey: UU5.PropTypes.func,
    onValidate: UU5.PropTypes.func,
    onReset: UU5.PropTypes.func,
    onCancel: UU5.PropTypes.func,
    saveOnEnter: UU5.PropTypes.bool,
    usePageAlertBus: UU5.PropTypes.bool,
    spacing: UU5.PropTypes.number,
    readOnly: UU5.PropTypes.bool,
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
    labelAlignment: UU5.PropTypes.string,
    padding: UU5.PropTypes.oneOfType([UU5.PropTypes.string, UU5.PropTypes.number])
  },
  //@@viewOff:propTypes

  //@@viewOn:getDefaultProps
  getDefaultProps: function() {
    return {
      values: null,
      progressIndicator: null,
      onInit: null,
      onSave: null,
      onSaveDone: null,
      onSaveFail: null,
      onSaveByKey: null,
      onValidate: null,
      onReset: null,
      onCancel: null,
      saveOnEnter: true,
      usePageAlertBus: false,
      spacing: null,
      readOnly: false,
      labelColWidth: undefined,
      inputColWidth: undefined,
      labelAlignment: undefined,
      padding: "0 16px"
    };
  },
  //@@viewOff:getDefaultProps

  //@@viewOn:reactLifeCycle
  getInitialState() {
    return {
      readOnly: this.props.readOnly,
      values: this.props.values,
      formContextValue: {
        readOnly: this.props.readOnly,
        values: this.props.values,
        labelColWidth: this.props.labelColWidth,
        inputColWidth: this.props.inputColWidth,
        labelAlignment: this.props.labelAlignment
      }
    };
  },

  componentWillMount() {
    this.formInputs = {};
    this.formControls = {};
    this.pendingComponents = {};

    var parentForm = this.getParentByType("isForm");
    if (parentForm) {
      this.showWarning("formInForm", [this.getTagName(), parentForm.getTagName()], {
        mixinName: "UU5.Forms.FormMixin"
      });
    }
  },

  componentDidMount() {
    this.state.values && this.setValues(this.state.values);
    typeof this.props.onInit === "function" && this.props.onInit({ component: this });
  },

  componentWillReceiveProps(nextProps) {
    if (nextProps.controlled) {
      this.setState({
        values: nextProps.values,
        readOnly: nextProps.readOnly,
        formContextValue: {
          readOnly: nextProps.readOnly,
          values: nextProps.values,
          labelColWidth: nextProps.labelColWidth,
          inputColWidth: nextProps.inputColWidth,
          labelAlignment: nextProps.labelAlignment
        }
      });
    }

    this._willReceiveProps = true;
    this.pendingComponents = {};
  },

  componentDidUpdate() {
    this.pendingComponents = {};
    if (this._willReceiveProps) {
      this._willReceiveProps = false;
      if (this.props.controlled) {
        this.state.values && this.setValues(this.state.values);
      }
      typeof this.props.onInit === "function" && this.props.onInit({ component: this });
    }
  },
  //@@viewOff:reactLifeCycle

  //@@viewOn:interface
  setValues(values) {
    Object.keys(values).forEach(key => (values[key] === undefined ? delete values[key] : ""));
    let formContextValue = { ...this.state.formContextValue, ...{ values } };
    this.setState({ values, formContextValue }, () => {
      this.eachFormInput(input => {
        if (!input.props._hasFormContext || !this._hasFormContext) {
          let value = values[input.getName() || input.getId()];
          value !== undefined && input.setValue(value, { shouldValidateRequired: false });
        }
      });
    });
  },

  eachFormInput(func) {
    for (var id in this.formInputs) {
      var result = func(this.formInputs[id]);
      if (result === false) {
        break;
      }
    }
    return this.formInputs;
  },

  hasFormControls() {
    return Object.getOwnPropertyNames(this.formControls).length !== 0;
  },

  eachFormControls(func) {
    for (let id in this.formControls) {
      let result = func(this.formControls[id]);
      if (result === false) {
        break;
      }
    }

    return this.formInputs;
  },

  isValid() {
    let result = true;

    if (typeof this.isValid_ === "function") {
      result = this.isValid_();
    } else if (typeof this.props.onValidate === "function") {
      result = this.props.onValidate({ component: this });
    } else {
      result = this.isValidDefault();
    }

    return result;
  },

  isValidDefault() {
    let result = true;

    this.eachFormInput(formInput => {
      let newResult = typeof formInput.isValid !== "function" || formInput.isValid();

      if (result) {
        result = newResult;
      }
    });

    return result;
  },

  // for our parent type checking
  isForm() {
    return true;
  },

  registerFormInput(id, formInput) {
    var registeredControl = this.formInputs[id];
    if (registeredControl) {
      this.showError("duplicateId", id, {
        mixinName: "UU5.Forms.FormMixin",
        context: {
          registeredFormInput: {
            tagName: registeredControl.getTagName(),
            props: registeredControl.props,
            component: registeredControl
          },
          newFormInput: {
            tagName: formInput.getTagName(),
            props: formInput.props,
            component: formInput
          }
        }
      });
    } else {
      this.formInputs[id] = formInput;
    }
  },

  unregisterFormInput(id) {
    if (!this.formInputs[id]) {
      this.showWarning("nonRegistered", id, {
        mixinName: "UU5.Forms.FormMixin"
      });
    } else {
      delete this.formInputs[id];
    }
  },

  registerFormControls(id, formControl) {
    var registeredControl = this.formControls[id];
    if (registeredControl) {
      this.showError("duplicateId", id, {
        mixinName: "UU5.Forms.FormMixin",
        context: {
          registeredFormControl: {
            tagName: registeredControl.getTagName(),
            props: registeredControl.props,
            component: registeredControl
          },
          newFormControl: {
            tagName: formControl.getTagName(),
            props: formControl.props,
            component: formControl
          }
        }
      });
    } else {
      this.formControls[id] = formControl;
    }
  },

  unregisterFormControls(id) {
    if (!this.formControls[id]) {
      this.showWarning("nonRegistered", id, {
        mixinName: "UU5.Forms.FormMixin"
      });
    } else {
      delete this.formControls[id];
    }
  },

  getValues() {
    var values = {};
    this._eachFormInputWithName(function(name, input) {
      values[name] = input.getValue();
    });
    return values;
  },

  getInputs() {
    var inputs = {};
    this._eachFormInputWithName(function(name, input) {
      inputs[name] = input;
    });
    return inputs;
  },

  getInputByName(name) {
    var result = null;

    this._eachFormInputWithName((k, input) => {
      var compare = k === name;
      compare && (result = input);
      return !compare;
    });

    return result;
  },

  getFormChildren(fce) {
    this._hasFormContext = true;
    let result = typeof fce === "function" && fce();
    let children = [];
    if (result) {
      result = Array.isArray(result) ? result : [result];

      result.forEach((child, i) => {
        if (child) {
          if (Array.isArray(child)) {
            child.forEach((child2, j) => {
              if (typeof child2 === "object") {
                let newProps = UU5.Common.Tools.merge({}, child2.props);
                newProps.key = newProps.key || i + "-" + j;
                newProps.parent = newProps.parent || this;
                children.push(UU5.Common.Element.clone(child2, newProps));
              } else {
                children.push(child2);
              }
            });
          } else if (typeof child === "object") {
            let newProps = UU5.Common.Tools.merge({}, child.props);
            newProps.key = newProps.key || i;
            newProps.parent = newProps.parent || this;
            children.push(UU5.Common.Element.clone(child, newProps));
          } else {
            children.push(child);
          }
        } else {
          children.push(child);
        }
      });
    }

    let attrs = this._getMainAttrs();
    attrs.className = UU5.Common.Tools.joinClassNames(
      attrs.className,
      this.getClassName("form", "UU5.Forms.FormMixin")
    );

    // <button type="submit"> is required so that "submit" event is launched by browser on Enter key
    return (
      <form {...attrs}>
        <UU5.Bricks.AlertBus
          ref_={alertBus => (this._alertBus = alertBus)}
          closeTimer={null}
          location={this.props.usePageAlertBus ? "page" : "local"}
        />
        <FormContext.Provider value={this.state.formContextValue}>{children}</FormContext.Provider>
        <button type="submit" style={{ display: "none" }} />
      </form>
    );
  },

  getAlertBus() {
    return this._alertBus;
  },

  save(values) {
    values = values || this.getValues();
    if (typeof this.save_ === "function") {
      this.save_(values);
    } else {
      this.saveDefault(values);
    }

    return this;
  },

  saveDefault(values) {
    values = values || this.getValues();

    if (this.isValid()) {
      if (typeof this.props.onSave === "function") {
        if (typeof this.props.onSaveDone === "function") {
          this.setPending(() => this.props.onSave({ component: this, values: values }));
        } else {
          this.props.onSave({ component: this, values: values });
        }
      }
    } else {
      this.validate();
    }

    return this;
  },

  saveDone(dtoOut) {
    if (typeof this.saveDone_ === "function") {
      this.saveDone_(dtoOut);
    } else {
      this.saveDoneDefault(dtoOut);
    }

    return this;
  },

  saveDoneDefault(dtoOut) {
    if (typeof this.props.onSaveDone === "function") {
      this.setReady(() =>
        this.props.onSaveDone({
          component: this,
          dtoOut: dtoOut
        })
      );
    }
    return this;
  },

  saveFail(dtoOut) {
    if (typeof this.saveFail_ === "function") {
      this.saveFail_(dtoOut);
    } else {
      this.saveFailDefault(dtoOut);
    }
    return this;
  },

  saveFailDefault(dtoOut) {
    if (typeof this.props.onSaveFail === "function") {
      this.setReady(() =>
        this.props.onSaveFail({
          component: this,
          dtoOut: dtoOut
        })
      );
    }
    return this;
  },

  validate() {
    let result = false;
    result = this.isValid();
    let alertBus = this.getAlertBus();
    alertBus &&
      alertBus.setAlert(
        result
          ? {
              colorSchema: "success",
              closeTimer: 1000,
              content: this.getLsiComponent("validContent", "UU5.Forms.FormMixin")
            }
          : {
              colorSchema: "danger",
              closeTimer: 5000,
              content: this.getLsiComponent("invalidContent", "UU5.Forms.FormMixin")
            }
      );
    return this;
  },

  setPending(setStateCallback) {
    let inputs = this.getInputs();
    this.pendingComponents = {};
    Object.keys(inputs).forEach(key => {
      let component = inputs[key];
      if (!component.isDisabled()) {
        this.pendingComponents[component.getId()] = component;
        component.disable();
      }
    });

    let alertBus = this.getAlertBus();
    alertBus.addAlertToPosition(0, {
      id: this.getId() + "-pending",
      closeTimer: null,
      closeDisabled: true,
      content: this.props.progressIndicator || <UU5.Bricks.Loading />
    });
    if (this.hasFormControls()) {
      this.eachFormControls(formControls => formControls.disable(setStateCallback));
    } else {
      setStateCallback();
    }

    return this;
  },

  setReady(setStateCallback) {
    let inputs = this.getInputs();
    Object.keys(inputs).forEach(key => {
      let component = inputs[key];
      if (this.pendingComponents[component.getId()]) {
        delete this.pendingComponents[component.getId()];
        component.enable();
      }
    });

    let alertBus = this.getAlertBus();
    alertBus.removeAlert(this.getId() + "-pending");
    if (this.hasFormControls()) {
      this.eachFormControls(formControls => formControls.enable(setStateCallback));
    } else {
      setStateCallback();
    }

    return this;
  },

  reset(setStateCallback) {
    if (typeof this.reset_ === "function") {
      this.reset_(setStateCallback);
    } else if (typeof this.props.onReset === "function") {
      this.props.onReset({ component: this });
    } else {
      this.resetDefault(setStateCallback);
    }
    return this;
  },

  resetDefault(setStateCallback) {
    let counter = 0;
    for (let id in this.formInputs) {
      typeof this.formInputs[id].reset === "function" && counter++;
    }

    let newSetStateCallback = UU5.Common.Tools.buildCounterCallback(setStateCallback, counter);

    for (let id in this.formInputs) {
      typeof this.formInputs[id].reset === "function" && this.formInputs[id].reset(newSetStateCallback);
    }

    return this;
  },

  cancel() {
    if (typeof this.cancel_ === "function") {
      this.cancel_();
    } else if (typeof this.props.onCancel === "function") {
      this.props.onCancel({ component: this });
    }
    return this;
  },

  getSaveFormEvents(func) {
    const CTRL_KEY = 17,
      S_KEY = 83;
    let down = false;

    return {
      onKeyDown: e => {
        let key = e.which || e.keyCode;
        let isMetaKey = UU5.Common.Tools.isMac() ? e.metaKey : null;
        let isCtrlPressed = e.ctrlKey || isMetaKey ? true : key === CTRL_KEY;

        if (!UU5.Common.Tools.isIE()) {
          down = e.nativeEvent.repeat;
        }

        if (isCtrlPressed && key === S_KEY) {
          if (typeof func === "function") {
            e.preventDefault();
            e.stopPropagation();

            if (!down) {
              down = true;
              func({ component: this, event: e });
            }
          }
        }
      },
      onKeyUp: e => {
        let key = e.which || e.keyCode;
        let isMetaKey = UU5.Common.Tools.isMac() ? e.metaKey : null;
        let isCtrlPressed = e.ctrlKey || isMetaKey ? true : key === CTRL_KEY;

        if (isCtrlPressed && key === S_KEY) {
          down = false;
        }
      }
    };
  },

  readOnly() {
    let formContextValue = { ...this.state.formContextValue, ...{ readOnly: true } };
    this.setState({ readOnly: true, formContextValue });

    return this;
  },

  editable() {
    let formContextValue = { ...this.state.formContextValue, ...{ readOnly: false } };
    this.setState({ readOnly: false, formContextValue });

    return this;
  },

  isReadOnly() {
    return this.state.readOnly;
  },
  //@@viewOff:interface

  //@@viewOn:overriding
  //@@viewOff:overriding

  //@@viewOn:private
  _eachFormInputWithName(func) {
    var form = this;
    this.eachFormInput(input => {
      var name = input.getName();
      if (!name) {
        form.showWarning("noName", input.getId(), {
          mixinName: "UU5.Forms.FormMixin",
          context: {
            input: {
              tagName: input.getTagName(),
              props: input.props,
              component: input
            }
          }
        });
        name = input.getId();
      }
      func(name, input);
    });
    return this;
  },

  _getMainAttrs() {
    let mainAttrs = this.getMainAttrs();

    mainAttrs.onSubmit = e => {
      e.preventDefault();

      if (this.props.saveOnEnter) {
        if (this.isValid()) {
          this.save();
        } else {
          this.validate();
        }
      }
    };

    if (typeof this.props.onSaveByKey === "function") {
      let saveEvents = this.getSaveFormEvents(this.props.onSaveByKey);
      Object.keys(saveEvents).forEach(key => {
        let fce = mainAttrs[key];
        mainAttrs[key] = e => {
          typeof fce === "function" && fce(e);
          saveEvents[key](e);
        };
      });
    }

    if (typeof this.props.spacing === "number") {
      mainAttrs.className +=
        " " +
        UU5.Common.Css.css`
        .uu5-forms-input:not(.uu5-forms-input-inner) {
          margin-top: ${this.props.spacing + "px"};

          ${
            this.props.spacing <= 8
              ? `& .uu5-forms-checkbox {
            margin-bottom: 0px;
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

    return mainAttrs;
  }
  //@@viewOff:private

  //@@viewOn:render
  //@@viewOff:render
};

export default FormMixin;
