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

import * as UU5 from "uu5g04";

export const ControlsMixin = {
  //@@viewOn:mixins
  mixins: [UU5.Common.BaseMixin, UU5.Common.PureRenderMixin, UU5.Common.ElementaryMixin],
  //@@viewOff:mixins

  //@@viewOn:statics
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {
    getForm: UU5.PropTypes.oneOfType([UU5.PropTypes.func, UU5.PropTypes.object]),
  },
  //@@viewOff:propTypes

  //@@viewOn:getDefaultProps
  getDefaultProps() {
    return {
      getForm: undefined,
    };
  },
  //@@viewOff:getDefaultProps

  //@@viewOn:reactLifeCycle
  componentDidMount: function () {
    this._registerToForm();
  },

  UNSAFE_componentWillReceiveProps: function (nextProps) {
    if (nextProps.id && nextProps.id !== this.props.id) {
      let parentForm = this.getForm();
      if (parentForm) {
        parentForm.unregisterFormControls(this.props.id);
        parentForm.registerFormControls(nextProps.id, this);
      }
    }
  },

  componentWillUnmount: function () {
    let parentForm = this.getForm();
    parentForm && parentForm.unregisterFormControls(this.getId());
  },
  //@@viewOff:reactLifeCycle

  //@@viewOn:interface
  getForm() {
    return (
      (typeof this.props.getForm === "function" ? this.props.getForm(this) : this.props.getForm) ||
      this.getParentByType("isForm")
    );
  },
  //@@viewOff:interface

  //@@viewOn:overriding
  //@@viewOff:overriding

  //@@viewOn:private
  _registerToForm() {
    let parentForm = this.getForm();
    parentForm && !parentForm.hasFormControls() && parentForm.registerFormControls(this.getId(), this);
  }
  //@@viewOff:private

  //@@viewOn:render
  //@@viewOff:render
};

export default ControlsMixin;
