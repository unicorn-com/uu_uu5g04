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

import React from 'react';
import PropTypes from "prop-types";
import * as UU5 from "uu5g04";

export const ControlsMixin = {

  //@@viewOn:mixins
  mixins: [
    UU5.Common.BaseMixin,
    UU5.Common.PureRenderMixin,
    UU5.Common.ElementaryMixin
  ],
  //@@viewOff:mixins

  //@@viewOn:statics
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {
    getForm: PropTypes.oneOfType([PropTypes.func, PropTypes.object])
  },
  //@@viewOff:propTypes

  //@@viewOn:getDefaultProps
  getDefaultProps() {
    return {
      getForm: undefined
    };
  },
  //@@viewOff:getDefaultProps

  //@@viewOn:standardComponentLifeCycle
  componentDidMount: function () {
    let parentForm = this.getForm();
    parentForm && parentForm.registerFormControls(this.getId(), this);
  },

  componentWillReceiveProps: function (nextProps) {
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
  //@@viewOff:standardComponentLifeCycle

  //@@viewOn:interface
  getForm() {
    return (typeof this.props.getForm === "function" ? this.props.getForm(this) : this.props.getForm)
      || this.getParentByType('isForm');
  },
  //@@viewOff:interface

  //@@viewOn:overridingMethods
  //@@viewOff:overridingMethods

  //@@viewOn:componentSpecificHelpers

  //@@viewOff:componentSpecificHelpers

  //@@viewOn:render
  //@@viewOff:render
};

export default ControlsMixin;
