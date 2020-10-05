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
import Context from "./context.js";
import BaseMixin from "./base-mixin.js";
import IdentityMixin from "./identity-mixin.js";
import Component from "./component.js";
import memoizeOne from "memoize-one";
//@@viewOff:imports

// TODO 2.0.0 Don't export. It's not documented and it's not consistent with other exported contexts
// (LsiMixin.Context, Level.Context, ScreenSize.Context, ...).
export const SessionContext = Context.create();

export const Session = Component.create({
  displayName: "Session", // for backward compatibility (test snapshots)
  //@@viewOn:mixins
  mixins: [BaseMixin, IdentityMixin],
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
  getInitialState() {
    this._computeMemoizedValue = memoizeOne(this._computeMemoizedValue);
    return {
      // NOTE SessionMixin keeps expiring flag outside of state - we have to use overriden methods
      // and put it to our state to cause re-render.
      expiring: this.isSessionExpiring(),
    };
  },
  //@@viewOff:reactLifeCycle

  //@@viewOn:interface
  //@@viewOff:interface

  //@@viewOn:overriding
  onSessionExpiring_(e) {
    this.onSessionExpiringDefault(e);
    this.setState((state) => (state.expiring !== true ? true : undefined));
  },
  onSessionExtended_(e) {
    this.onSessionExtendedDefault(e);
    this.setState((state) => (state.expiring !== false ? false : undefined));
  },
  //@@viewOff:overriding

  //@@viewOn:private
  _getValues() {
    // NOTE Keep value in sync with hooks/use-session.js.
    return this._computeMemoizedValue(
      this.getIdentityFeedback(),
      this.getIdentity(),
      this.state.expiring,
      this.getSession(),
      this.login,
      this.logout
    );
  },
  _computeMemoizedValue(sessionState, identity, isExpiring, session, login, logout) {
    return { sessionState, identity, isExpiring, session, login, logout };
  },
  //@@viewOff:private

  //@@viewOn:render
  render() {
    return <SessionContext.Provider value={this._getValues()}>{this.props.children}</SessionContext.Provider>;
  },
  //@@viewOff:render
});
Session.Context = SessionContext;

export default Session;
