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

import React from "react";
import { PropTypes } from "uu5g05";
import Environment from "../environment/environment.js";
import CcrReaderMixin from "./ccr-reader-mixin.js";

export const CcrWriterMixin = {
  //@@viewOn:mixins
  mixins: [CcrReaderMixin],
  //@@viewOff:mixins

  //@@viewOn:statics
  statics: {
    "UU5.Common.CcrWriterMixin": {
      requiredMixins: ["UU5.Common.CcrReaderMixin"],
      warnings: {
        keyNotRegistered: "Component with key %s was not registered.",
      },
      errors: {
        alreadyRegistered: "Component with ccr key %s is already registered.",
        unregisterNotThis: "Component with ccr key %s is not this component, cannot be unregistered.",
      },
    },
  },
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {
    ccrKey: PropTypes.string,
  },
  //@@viewOff:propTypes

  //@@viewOn:getDefaultProps
  getDefaultProps: function () {
    return {
      ccrKey: null,
    };
  },
  //@@viewOff:getDefaultProps

  //@@viewOn:reactLifeCycle
  getInitialState: function () {
    // initialize
    this.registerMixin("UU5.Common.CcrWriterMixin");
    // state
    return null;
  },

  UNSAFE_componentWillMount: function () {
    this.getCcrKey() && this._registerToCcrByKey(this.getCcrKey());
  },

  UNSAFE_componentWillReceiveProps: function (nextProps) {
    if (this.getCcrKey(nextProps) && this.getCcrKey(nextProps) !== this.getCcrKey()) {
      this.getCcrKey() && this.isCcrRegisteredByKey(this.getCcrKey()) && this._unregisterFromCcrByKey(this.getCcrKey());
      this._registerToCcrByKey(this.getCcrKey(nextProps));
    }
  },

  componentWillUnmount: function () {
    this.getCcrKey() && this.isCcrRegisteredByKey(this.getCcrKey()) && this._unregisterFromCcrByKey(this.getCcrKey());
  },
  //@@viewOff:reactLifeCycle

  //@@viewOn:interface
  hasUU5CommonCcrWriterMixin: function () {
    return this.hasMixin("UU5.Common.CcrWriterMixin");
  },

  getUU5CommonCcrWriterMixinProps: function () {
    return {
      ccrKey: this.getCcrKey(),
    };
  },

  getUU5CommonCcrWriterMixinPropsToPass: function () {
    return {};
  },

  getCcrKey: function (props) {
    props = props || this.props;
    return props.ccrKey || this.getOpt("ccrKey") || null;
  },
  //@@viewOff:interface

  //@@viewOn:overriding
  //@@viewOff:overriding

  //@@viewOn:private
  _registerToCcrByKey: function (key) {
    var component = this.getCcrByKeyRegister()[key];
    if (Environment.ccrStrict && component && component !== this) {
      this.showError("alreadyRegistered", key, {
        mixinName: "UU5.Common.CcrWriterMixin",
        context: {
          registeredComponent: {
            tagName: component.getTagName(),
            id: component.getId(),
            component: component,
          },
        },
      });
    }
    this.getCcrByKeyRegister()[key] = this;
    return this;
  },

  _unregisterFromCcrByKey: function (key) {
    var component = this.getCcrByKeyRegister()[key];
    if (!component) {
      this.showWarning("keyNotRegistered", key, {
        mixinName: "UU5.Common.CcrWriterMixin",
      });
    } else if (component !== this) {
      Environment.ccrStrict &&
        this.showError("unregisterNotThis", key, {
          mixinName: "UU5.Common.CcrWriterMixin",
          context: {
            registeredComponent: {
              tagName: component.getTagName(),
              id: component.getId(),
              component: component,
            },
          },
        });
    } else {
      delete this.getCcrByKeyRegister()[key];
    }
    return this;
  },
  //@@viewOff:private
};

export default CcrWriterMixin;
