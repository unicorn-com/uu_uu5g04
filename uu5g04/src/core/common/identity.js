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
import React from "react";
import { SessionContext } from "./session.js";
import IdentityItem from "./identity-item.js";
import BaseMixin from "./base-mixin.js";
import ContentMixin from "./content-mixin.js";
import VisualComponent from "./visual-component.js";
//@@viewOff:imports

export const Identity = VisualComponent.create({
  displayName: "Identity", // for backward compatibility (test snapshots)
  //@@viewOn:mixins
  mixins: [BaseMixin, ContentMixin],
  //@@viewOff:mixins

  //@@viewOn:statics
  statics: {
    tagName: "UU5.Common.Identity"
  },
  //@@viewOff:statics

  //@@viewOn:propTypes
  //@@viewOff:propTypes

  //@@viewOn:getDefaultProps
  //@@viewOff:getDefaultProps

  //@@viewOn:reactLifeCycle
  //@@viewOff:reactLifeCycle

  //@@viewOn:interface
  //@@viewOff:interface

  //@@viewOn:overriding
  //@@viewOff:overriding

  //@@viewOn:private
  _getChildren(opt) {
    let children, childItem;
    let authProp =
      opt.identity === undefined ? "pending" : opt.identity === null ? "notAuthenticated" : "authenticated";

    if (typeof this.props.children === "function") {
      // fce
      children = this.props.children(opt);
    } else {
      let allChildren = this.getChildren();

      if (allChildren) {
        if (!Array.isArray(allChildren)) allChildren = [allChildren];

        children = allChildren.map(child => {
          let newChild = child;

          if (React.isValidElement(child)) {
            if (child.type.tagName === IdentityItem.tagName) {
              if (child.props[authProp]) {
                // Identity.Item
                childItem = React.cloneElement(child, opt);
              }
            } else {
              // ...opt as props
              newChild = React.cloneElement(child, opt);
            }
          }

          return newChild;
        });
      }
    }

    return childItem || children || null;
  },
  //@@viewOff:private

  //@@viewOn:render
  render() {
    return <SessionContext.Consumer>{this._getChildren}</SessionContext.Consumer>;
  }
  //@@viewOff:render
});

Identity.Item = IdentityItem;
export default Identity;
