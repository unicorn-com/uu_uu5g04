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
import React from "react";
import { Session } from "./session.js";
import IdentityItem from "./identity-item.js";
import BaseMixin from "./base-mixin.js";
import ContentMixin from "./content-mixin.js";
import VisualComponent from "./visual-component.js";
import Element from "./element.js";
//@@viewOff:imports

export const Identity = VisualComponent.create({
  displayName: "Identity", // for backward compatibility (test snapshots)
  //@@viewOn:mixins
  mixins: [BaseMixin, ContentMixin],
  //@@viewOff:mixins

  //@@viewOn:statics
  statics: {
    tagName: "UU5.Common.Identity",
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

        children = allChildren.map((child) => {
          let newChild = child;

          if (Element.isValid(child)) {
            if (child.type.tagName === IdentityItem.tagName) {
              if (child.props[authProp]) {
                // Identity.Item
                childItem = Element.clone(child, opt);
              } else {
                newChild = null;
              }
            } else {
              // ...opt as props
              newChild = Element.clone(child, opt);
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
    return <Session.Context.Consumer>{this._getChildren}</Session.Context.Consumer>;
  },
  //@@viewOff:render
});

Identity.Item = IdentityItem;
export default Identity;
