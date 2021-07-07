import UU5 from "uu5g04";
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

import "./group-mixin.less";

export const GroupMixin = {
  //@@viewOn:mixins
  //@@viewOff:mixins

  //@@viewOn:statics
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {
    value: UU5.PropTypes.arrayOf(
      UU5.PropTypes.shape({
        label: UU5.PropTypes.any.isRequired,
        name: UU5.PropTypes.string,
        value: UU5.PropTypes.bool,
        disabled: UU5.PropTypes.bool,
        hidden: UU5.PropTypes.bool,
      })
    ),
    required: UU5.PropTypes.bool,
    requiredMessage: UU5.PropTypes.any,
    onIcon: UU5.PropTypes.string,
    offIcon: UU5.PropTypes.string,
    labelPosition: UU5.PropTypes.oneOf(["left", "right"]),
    inline: UU5.PropTypes.bool,
    colWidth: UU5.PropTypes.oneOfType([
      UU5.PropTypes.shape({
        xs: UU5.PropTypes.number,
        s: UU5.PropTypes.number,
        m: UU5.PropTypes.number,
        l: UU5.PropTypes.number,
        xl: UU5.PropTypes.number,
      }),
      UU5.PropTypes.string,
    ]),
  },
  //@@viewOff:propTypes

  //@@viewOn:getDefaultProps
  getDefaultProps: function () {
    return {
      value: [],
      required: false,
      requiredMessage: null,
      onIcon: "",
      offIcon: "",
      inline: false,
      labelPosition: "right",
      colWidth: null,
    };
  },
  //@@viewOff:getDefaultProps

  //@@viewOn:reactLifeCycle
  //@@viewOff:reactLifeCycle

  //@@viewOn:interface
  isValid: function () {
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
  },
  //@@viewOff:interface

  //@@viewOn:overriding
  //@@viewOff:overriding

  //@@viewOn:private
  //@@viewOff:private

  //@@viewOn:render
  //@@viewOff:render
};

export default GroupMixin;
