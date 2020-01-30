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
import "uu5g04-bricks";
import FormMixin from "./mixins/form-mixin.js";

import "./form.less";
//@@viewOff:imports

export const Form = UU5.Common.VisualComponent.create({
  displayName: "Form", // for backward compatibility (test snapshots)

  //@@viewOn:mixins
  mixins: [
    UU5.Common.BaseMixin,
    UU5.Common.PureRenderMixin,
    UU5.Common.ElementaryMixin,
    UU5.Common.SectionMixin,
    FormMixin
  ],
  //@@viewOff:mixins

  //@@viewOn:statics
  statics: {
    tagName: ns.name("Form"),
    classNames: {
      main: ns.css("form")
    }
  },
  //@@viewOff:statics

  //@@viewOn:propTypes
  //@@viewOff:propTypes

  //@@viewOn:getDefaultProps
  //@@viewOff:getDefaultProps

  //@@viewOn:reactLifeCycle
  componentDidMount() {
    this.props.disabled && this.disable();
  },

  componentDidUpdate(prevProps, prevState) {
    if (this.props.controlled && this.props.disabled !== prevState.disabled) {
      this.props.disabled ? this.disable() : this.enable();
    }
  },
  //@@viewOff:reactLifeCycle

  //@@viewOn:interface
  //@@viewOff:interface

  //@@viewOn:overriding
  disable_(setStateCallback) {
    let inputs = this.getInputs();
    Object.keys(inputs).forEach(key => {
      inputs[key].disable();
    });
    this.eachFormControls(formControls => formControls.disable(setStateCallback));
    return this;
  },

  enable_(setStateCallback) {
    let inputs = this.getInputs();
    Object.keys(inputs).forEach(key => {
      inputs[key].enable();
    });
    this.eachFormControls(formControls => formControls.enable(setStateCallback));
    return this;
  },
  //@@viewOff:overriding

  //@@viewOn:private
  //@@viewOff:private

  //@@viewOn:render
  render() {
    return this.getFormChildren(() => {
      return [this.getHeaderChild(), this.getChildren(), this.getFooterChild()];
    });
  }
  //@@viewOff:render
});

export default Form;
