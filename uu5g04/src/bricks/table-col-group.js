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
import ns from "./bricks-ns.js";

import "./table-col-group.less";
//@@viewOff:imports

export default UU5.Common.VisualComponent.create({
  displayName: "table-col-group", // for backward compatibility (test snapshots)
  //@@viewOn:mixins
  mixins: [
    UU5.Common.BaseMixin,
    UU5.Common.PureRenderMixin,
    UU5.Common.ElementaryMixin,
    UU5.Common.NestingLevelMixin,
    UU5.Common.ContentMixin,
    UU5.Common.ColorSchemaMixin,
  ],
  //@@viewOff:mixins

  //@@viewOn:statics
  statics: {
    tagName: ns.name("Table.ColGroup"),
    nestingLevelList: UU5.Environment.getNestingLevelList("bigBoxCollection", "smallBox"),
    classNames: {
      main: ns.css("table-col-group"),
      //bg: 'uu5-common-bg'
    },
    defaults: {
      parentTagName: "UU5.Bricks.Table",
      childTagNames: ["UU5.Bricks.Table.Col"],
    },
    opt: {
      nestingLevelWrapper: true,
    },
    errors: {
      invalidParent: "Parent of this component is not Table.",
    },
    editMode: {
      enableWrapper: false,
    },
  },
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {
    //background: UU5.PropTypes.bool,
    allowTags: UU5.PropTypes.arrayOf(UU5.PropTypes.string),
  },
  //@@viewOff:propTypes

  //@@viewOn:getDefaultProps
  getDefaultProps: function () {
    return {
      //background: false,
      allowTags: [],
    };
  },
  //@@viewOff:getDefaultProps

  //@@viewOn:reactLifeCycle
  UNSAFE_componentWillMount: function () {
    let parent = this.getParent();

    if (parent) {
      while (parent.getOpt("parentWrapper")) {
        parent = parent.getParent();
      }
    }

    if (!(parent && parent.isTable)) {
      this.showError("invalidParent");
    }
  },

  //@@viewOff:reactLifeCycle

  //@@viewOn:interface
  isColGroup() {
    return true;
  },
  //@@viewOff:interface

  //@@viewOn:overriding
  shouldChildRender_: function (child) {
    let childTagName = UU5.Common.Tools.getChildTagName(child);
    let defaultChildTagNames = this.getDefault().childTagNames;
    let childTagNames = this.props.allowTags.concat(defaultChildTagNames);
    let result = childTagNames.indexOf(childTagName) > -1;
    if (!result && (typeof child !== "string" || child.trim())) {
      if (childTagName)
        this.showError("childTagNotAllowed", [childTagName, this.getTagName(), childTagName, defaultChildTagNames[0]], {
          mixinName: "UU5.Common.BaseMixin",
        });
      else this.showError("childNotAllowed", [child, defaultChildTagNames[0]], { mixinName: "UU5.Common.BaseMixin" });
    }
    return result;
  },
  //@@viewOff:overriding

  //@@viewOn:private
  _getMainProps: function () {
    var props = this.getMainAttrs();
    //this.props.background && (props.className += ' ' + this.getClassName().bg);
    return props;
  },
  //@@viewOff:private

  //@@viewOn:render
  render: function () {
    return this.getNestingLevel() ? <colgroup {...this._getMainProps()}>{this.getChildren()}</colgroup> : null;
  },
  //@@viewOff:render
});
