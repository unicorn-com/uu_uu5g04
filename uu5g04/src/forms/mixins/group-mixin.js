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

import React from "react";
import PropTypes from "prop-types";

import "./group-mixin.less";

export const GroupMixin = {
  //@@viewOn:mixins
  //@@viewOff:mixins

  //@@viewOn:statics
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {
    value: PropTypes.arrayOf(
      PropTypes.shape({
        label: PropTypes.any.isRequired,
        name: PropTypes.string,
        value: PropTypes.bool,
        disabled: PropTypes.bool,
        hidden: PropTypes.bool
      })
    ),
    required: PropTypes.bool,
    requiredMessage: PropTypes.any,
    onIcon: PropTypes.string,
    offIcon: PropTypes.string,
    labelPosition: PropTypes.oneOf(["left", "right"]),
    inline: PropTypes.bool,
    colWidth: PropTypes.oneOfType([
      PropTypes.shape({
        xs: PropTypes.number,
        s: PropTypes.number,
        m: PropTypes.number,
        l: PropTypes.number,
        xl: PropTypes.number
      }),
      PropTypes.string
    ])
  },
  //@@viewOff:propTypes

  //@@viewOn:getDefaultProps
  getDefaultProps: function() {
    return {
      value: [],
      required: false,
      requiredMessage: null,
      onIcon: "",
      offIcon: "",
      inline: false,
      labelPosition: "right",
      colWidth: null
    };
  },
  //@@viewOff:getDefaultProps

  //@@viewOn:reactLifeCycle
  //@@viewOff:reactLifeCycle

  //@@viewOn:interface
  isValid: function() {
    let feedback = this.getFeedback();
    let value = this.getValue();
    let result = true;

    if (this.props.required && (value === null || value.length < 1)) {
      this.setError(this.props.requiredMessage || this.getLsiComponent("requiredMessageGroup"));
      result = false;
    } else if (feedback === "error") {
      result = false;
    }

    if (result) {
      if (typeof this.isValid_ === "function") {
        result = this.isValid_();
      }

      if (this.props.onValidate) {
        let validation = this.props.onValidate(value, this);
        if (validation && typeof validation === "object") {
          if (validation.feedback === "error") {
            result = false;
          }
        }
      }
    }

    return result;
  }
  //@@viewOff:interface

  //@@viewOn:overriding
  //@@viewOff:overriding

  //@@viewOn:private
  //@@viewOff:private

  //@@viewOn:render
  //@@viewOff:render
};

export default GroupMixin;
