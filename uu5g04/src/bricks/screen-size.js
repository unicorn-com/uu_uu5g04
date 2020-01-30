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
import ScreenSizeItem from "./screen-size-item.js";

import "./screen-size.less";
//@@viewOff:imports

export const ScreenSize = UU5.Common.VisualComponent.create({
  displayName: "ScreenSize", // for backward compatibility (test snapshots)
  //@@viewOn:mixins
  mixins: [
    UU5.Common.BaseMixin,
    UU5.Common.ElementaryMixin,
    UU5.Common.ContentMixin,
    UU5.Common.ScreenSizeMixin,
    UU5.Common.NestingLevelMixin
  ],
  //@@viewOff:mixins

  //@@viewOn:statics
  statics: {
    tagName: ns.name("ScreenSize"),
    nestingLevelList: UU5.Environment.getNestingLevelList("spa"),
    classNames: {
      main: ns.css("screen-size")
    },
    defaults: {
      childTagName: "UU5.Bricks.ScreenSize.Item"
    },
    opt: {
      nestingLevelWrapper: true
    }
  },
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {
    screenSize: UU5.PropTypes.string
  },
  //@@viewOff:propTypes

  //@@viewOn:getDefaultProps
  getDefaultProps: function() {
    return {
      screenSize: null
    };
  },
  //@@viewOff:getDefaultProps

  //@@viewOn:reactLifeCycle
  //@@viewOff:reactLifeCycle

  //@@viewOn:interface
  isScreenSize() {
    return true;
  },
  //@@viewOff:interface

  //@@viewOn:overriding
  //@@viewOff:overriding

  //@@viewOn:private
  _expandChildProps: function(child) {
    let newChildProps = { ...child.props };

    newChildProps.id = newChildProps.id || this.getId() + "-inner";
    newChildProps.controlled = true;
    newChildProps.hidden = this.isHidden();
    newChildProps.disabled = this.isDisabled();
    newChildProps.selected = this.isSelected();
    newChildProps.nestingLevel = this.getNestingLevel();

    return newChildProps;
  },

  _getChildren() {
    let children;
    let screenSizes = {};
    let screenSize = this.getScreenSize();

    if (typeof this.props.children === "function") {
      children = this.props.children({ screenSize });
    } else {
      let allChildren = this.getChildren();

      if (allChildren) {
        if (!Array.isArray(allChildren)) allChildren = [allChildren];

        children = allChildren.map((child, index) => {
          let newChild = child;

          if (UU5.Common.Element.isValid(child)) {
            if (child.type.tagName === this.getDefault("childTagName")) {
              // ScreenSize.Item
              let childScreenSizes;

              if (Array.isArray(child.props.screenSize)) {
                childScreenSizes = child.props.screenSize;
              } else {
                childScreenSizes = child.props.screenSize.split(" ");
              }

              childScreenSizes.forEach(childScreenSize => (screenSizes[childScreenSize] = { child, index }));
              newChild = null;
            } else {
              // language as prop
              newChild = UU5.Common.Element.clone(child, { screenSize });
            }
          }

          return newChild;
        });
      }

      if (Object.keys(screenSizes).length > 0) {
        let { child, index } = screenSizes[screenSize] || screenSizes["*"] || {};
        if (child) children[index] = UU5.Common.Element.clone(child, this._expandChildProps(child));
      }
    }

    return children || null;
  },
  //@@viewOff:private

  //@@viewOn:render
  render: function() {
    return this.getNestingLevel() ? this._getChildren() : null;
  }
  //@@viewOff:render
});

ScreenSize.Item = ScreenSizeItem;

export default ScreenSize;
