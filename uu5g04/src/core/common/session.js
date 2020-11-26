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
import { SessionContext, SessionProvider } from "../uu5g05-integration/use-session.js";
import BaseMixin from "./base-mixin.js";
import IdentityMixin from "./identity-mixin.js";
import Component from "./component.js";
//@@viewOff:imports

// TODO 2.0.0 Don't export.
export { SessionContext };

export const Session = Component.create({
  displayName: "Session", // for backward compatibility (test snapshots)
  //@@viewOn:mixins
  mixins: [BaseMixin, IdentityMixin], // for backward compatibility only
  //@@viewOff:mixins

  //@@viewOn:statics
  statics: {
    tagName: "UU5.Common.Session",
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
  //@@viewOff:private

  //@@viewOn:render
  render() {
    let { children } = this.props;
    return <SessionProvider session={this.getSession()}>{children}</SessionProvider>;
  },
  //@@viewOff:render
});
Session.Context = SessionContext;

export default Session;
