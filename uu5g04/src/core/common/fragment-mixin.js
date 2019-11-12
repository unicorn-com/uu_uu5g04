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

import EditableMixin from "./editable-mixin.js";

const FRAGMENT_MIXIN_NAME = "UU5.Common.FragmentMixin";

export const FragmentMixin = {
  //@@viewOn:mixins
  mixins: [EditableMixin],
  //@@viewOff:mixins

  //@@viewOn:statics
  statics: {
    "UU5.Common.FragmentMixin": {
      requiredMixins: ["UU5.Common.BaseMixin"]
    }
  },
  //@@viewOff:statics

  //@@viewOn:propTypes
  //@@viewOff:propTypes

  //@@viewOn:getDefaultProps
  //@@viewOff:getDefaultProps

  //@@viewOn:reactLifeCycle
  getInitialState: function() {
    this.registerMixin(FRAGMENT_MIXIN_NAME);
    return null;
  },
  //@@viewOff:reactLifeCycle

  //@@viewOn:interface
  hasUU5CommonFragmentMixin() {
    return this.hasMixin(FRAGMENT_MIXIN_NAME);
  },

  initComponentFragmentation(initFn, nextProps) {
    if (typeof this.initComponentFragmentation_ === "function") {
      return this.initComponentFragmentation_(initFn, nextProps);
    } else {
      throw "UU5.Common.FragmentMixin: Component must implement method 'initComponentFragmentation_'";
    }
  },

  setFragment(fragment) {
    if (typeof this.setFragment_ === "function") {
      return this.setFragment_(fragment);
    } else {
      throw "UU5.Common.FragmentMixin: Component must implement method 'setFragment_'";
    }
  }
  //@@viewOff:interface

  //@@viewOn:overriding
  //@@viewOff:overriding

  //@@viewOn:private
  //@@viewOff:private
};

export default FragmentMixin;
