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
import PropTypes from 'prop-types';

export const ChoiceMixin = {

  //@@viewOn:mixins
  //@@viewOff:mixins

  //@@viewOn:statics
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {
    placeholder: PropTypes.any,
    required: PropTypes.bool,
    requiredMessage: PropTypes.any,
    buttonHidden: PropTypes.bool,
    iconOpen: PropTypes.string,
    iconClosed: PropTypes.string
  },
  //@@viewOff:propTypes

  //@@viewOn:getDefaultProps
  getDefaultProps: function () {
    return {
      placeholder: null,
      required: false,
      requiredMessage: null,
      buttonHidden: false,
      iconOpen: 'uu5-arrow-up',
      iconClosed: 'uu5-arrow-down'
    };
  },
  //@@viewOff:getDefaultProps

  //@@viewOn:standardComponentLifeCycle
  //@@viewOff:standardComponentLifeCycle

  //@@viewOn:interface
  isValid() {
    var feedback = this.getFeedback();
    var value = this.getValue();
    var result = true;

    if (this.props.required && (!value || value.length < 1)) {
      this.setError(this.props.requiredMessage || this.getLsiComponent('requiredMessageChoice'));
      result = false;
    } else if (feedback === 'error') {
      result = false;
    } else if (typeof this.isValid_ === 'function') {
      result = this.isValid_();
    }

    if (result && typeof this.props.onValidate === 'function') {
      var validation = this.props.onValidate(value, this);
      if (validation && typeof validation === 'object') {
        if (validation.feedback === 'error') {
          result = false;
        }
      }
    }

    return result;
  },
//@@viewOff:interface

  //@@viewOn:overridingMethods
  //@@viewOff:overridingMethods

  //@@viewOn:componentSpecificHelpers
  //@@viewOff:componentSpecificHelpers

  //@@viewOn:render
  //@@viewOff:render
};

export default ChoiceMixin;
