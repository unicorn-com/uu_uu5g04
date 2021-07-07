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

import Environment from "../environment/environment.js";

export const CcrReaderMixin = {
  //@@viewOn:statics
  statics: {
    "UU5.Common.CcrReaderMixin": {
      requiredMixins: ["UU5.Common.BaseMixin"],
      errors: {
        keyNotRegistered: "Component with key %s is not registered.",
      },
    },
  },
  //@@viewOff:statics

  //@@viewOn:reactLifeCycle
  getInitialState: function () {
    // initialize
    this.registerMixin("UU5.Common.CcrReaderMixin");
    // state
    return null;
  },
  //@@viewOff:reactLifeCycle

  //@@viewOn:interface
  hasUU5CommonCcrReaderMixin: function () {
    return this.hasMixin("UU5.Common.CcrReaderMixin");
  },

  getUU5CommonCcrReaderMixinProps: function () {
    return {};
  },

  getUU5CommonCcrReaderMixinPropsToPass: function () {
    return this.getUU5CommonCcrReaderMixinProps();
  },

  getCcrComponentByKey: function (key) {
    return this.getCcrByKeyRegister()[key] || null;
  },

  isCcrRegisteredByKey: function (key) {
    return !!this.getCcrByKeyRegister()[key];
  },

  getCcrByKeyRegister: function () {
    return Environment.ccr.byKey;
  },
  //@@viewOff:interface

  //@@viewOn:overriding
  //@@viewOff:overriding

  //@@viewOn:private
  //@@viewOff:private
};

export default CcrReaderMixin;
