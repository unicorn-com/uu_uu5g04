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

//@@viewOn:imports
import * as UU5 from "uu5g04";
import ns from "./bricks-ns.js";

import "./nav-bar-nav.less";
//@@viewOff:imports

export default UU5.Common.VisualComponent.create({
  displayName: "nav-bar-nav", // for backward compatibility (test snapshots)
  //@@viewOn:mixins
  mixins: [UU5.Common.BaseMixin, UU5.Common.PureRenderMixin, UU5.Common.ElementaryMixin, UU5.Common.ContentMixin],
  //@@viewOff:mixins

  //@@viewOn:statics
  statics: {
    tagName: ns.name("NavBar.Nav"),
    classNames: {
      main: ns.css("nav-bar-nav nav navbar-nav"),
      align: ns.css("nav-bar-nav-")
    },
    defaults: {
      childTagName: "UU5.Bricks.NavBar.Nav.Item",
      parentTagName: "UU5.Bricks.NavBar"
    },
    errors: {
      invalidParent: "Parent of this component is not NavBar."
    }
  },
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {
    aligned: UU5.PropTypes.oneOf(["left", "right"]),
    smoothScroll: UU5.PropTypes.number,
    offset: UU5.PropTypes.number,
    allowTags: UU5.PropTypes.arrayOf(UU5.PropTypes.string),
    _size: UU5.PropTypes.string
  },
  //@@viewOff:propTypes

  //@@viewOn:getDefaultProps
  getDefaultProps: function() {
    return {
      aligned: "left",
      smoothScroll: 1000,
      offset: null,
      allowTags: [],
      _size: "m"
    };
  },
  //@@viewOff:getDefaultProps

  //@@viewOn:reactLifeCycle
  componentWillMount: function() {
    let parent = this.getParent();

    if (parent) {
      while (parent.getOpt("parentWrapper")) {
        parent = parent.getParent();
      }
    }

    if (!(parent && parent.isNavBar)) {
      this.showError("invalidParent");
    }
  },

  //@@viewOff:reactLifeCycle

  //@@viewOn:interface
  isNav: function() {
    return true;
  },
  //@@viewOff:interface

  //@@viewOn:overriding
  shouldChildRender_: function(child) {
    let childTagName = UU5.Common.Tools.getChildTagName(child);
    let defaultChildTagName = this.getDefault().childTagName;
    let childTagNames = this.props.allowTags.concat(defaultChildTagName);
    let result = childTagNames.indexOf(childTagName) > -1;
    if (!result && (typeof child !== "string" || child.trim())) {
      if (childTagName)
        this.showError("childTagNotAllowed", [childTagName, this.getTagName(), childTagName, defaultChildTagName], {
          mixinName: "UU5.Common.BaseMixin"
        });
      else this.showError("childNotAllowed", [child, defaultChildTagName], { mixinName: "UU5.Common.BaseMixin" });
    }
    return result;
  },

  expandChildProps_: function(child, i) {
    var newChildProps = { ...child.props };

    newChildProps._size = this.props._size;
    newChildProps.smoothScroll =
      newChildProps.smoothScroll === undefined || newChildProps.smoothScroll === null
        ? this.props.smoothScroll
        : newChildProps.smoothScroll;
    newChildProps.offset =
      newChildProps.offset === undefined || newChildProps.offset === null ? this.props.offset : newChildProps.offset;

    return newChildProps;
  },
  //@@viewOff:overriding

  //@@viewOn:private
  //@@viewOff:private

  //@@viewOn:render
  render: function() {
    var mainAttrs = this.getMainAttrs();
    mainAttrs.className += " " + this.getClassName().align + this.props.aligned;

    return (
      <ul {...mainAttrs}>
        {this.getChildren()}
        {this.getDisabledCover()}
      </ul>
    );
  }
  //@@viewOff:render
});
