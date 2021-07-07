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
import ns from "../forms-ns.js";
//@@viewOff:imports

export const FormContext = UU5.Common.Context.create();

export const ContextFormConsumer = FormContext.Consumer;

export const ContextFormProvider = UU5.Common.VisualComponent.create({
  //@@viewOn:statics
  displayName: ns.name("ContextFormProvider"),
  //@@viewOff:statics

  //@@viewOn:propTypes
  //@@viewOff:propTypes

  //@@viewOn:getDefaultProps
  //@@viewOff:getDefaultProps

  //@@viewOn:reactLifeCycle
  getInitialState() {
    return { getForm: this._getForm, setForm: this._setForm };
  },
  //@@viewOff:reactLifeCycle

  //@@viewOn:interface
  //@@viewOff:interface

  //@@viewOn:overriding
  //@@viewOff:overriding

  //@@viewOn:private
  _getForm() {
    return this._form;
  },

  _setForm(form) {
    this._form = form;
  },
  //@@viewOff:private

  //@@viewOn:render
  render() {
    return <FormContext.Provider value={this.state}>{this.props.children}</FormContext.Provider>;
  },
  //@@viewOff:render
});

export default { FormContext, ContextFormProvider, ContextFormConsumer };
