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

import React from "react";
import PropTypes from "prop-types";
import Environment from "../environment/environment.js";

export const SessionMixin = {
  //@@viewOn:statics
  statics: {
    "UU5.Common.SessionMixin": {
      requiredMixins: ["UU5.Common.BaseMixin"],
      errors: {
        sessionNotFound: "Session has to be set."
      }
    }
  },
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {
    session: PropTypes.shape({
      initComplete: PropTypes.bool,
      initPromise: PropTypes.object,
      addListener: PropTypes.func,
      removeListener: PropTypes.func,
      getIdentity: PropTypes.func,
      isAuthenticated: PropTypes.func
    })
  },
  //@@viewOff:propTypes

  //@@viewOn:getDefaultProps
  getDefaultProps() {
    return {
      session: null
    };
  },
  //@@viewOff:getDefaultProps

  //@@viewOn:reactLifeCycle
  getInitialState() {
    // initialize
    this.registerMixin("UU5.Common.SessionMixin");
    return null;
  },

  componentDidMount() {
    let session = this.props.session || Environment.getSession();
    if (session) {
      if (!session.initComplete) {
        session.initPromise.then(() => {
          if (this._unmount) return;
          window.UU5.Environment.EventListener.addSessionExpiringListener(
            session,
            this.getId(),
            this._onSessionExpiring
          );
          window.UU5.Environment.EventListener.addSessionExtendedListener(
            session,
            this.getId(),
            this._onSessionExtended
          );
        });
      } else {
        window.UU5.Environment.EventListener.addSessionExpiringListener(session, this.getId(), this._onSessionExpiring);
        window.UU5.Environment.EventListener.addSessionExtendedListener(session, this.getId(), this._onSessionExtended);
      }
    }
  },

  componentWillUnmount() {
    this._unmount = true;
    let session = this.getSession();
    if (session) {
      window.UU5.Environment.EventListener.removeSessionExpiringListener(session, this.getId());
      window.UU5.Environment.EventListener.removeSessionExtendedListener(session, this.getId());
    }
  },
  //@@viewOff:reactLifeCycle

  //@@viewOn:interface
  hasUU5CommonSessionMixin() {
    return this.hasMixin("UU5.Common.SessionMixin");
  },

  getUU5CommonSessionMixinProps() {
    return {
      session: this.props.session
    };
  },

  getUU5CommonSessionMixinPropsToPass() {
    return this.getUU5CommonSessionMixinProps();
  },

  getSession() {
    let session = this.props.session || Environment.getSession();
    !session && this.showError("sessionNotFound", null, { mixinName: "UU5.Common.SessionMixin" });
    return session;
  },

  login(opt) {
    let session = this.getSession();
    session && session.login(opt ? { acr_values: 1, ...opt } : undefined); // acr_values is necessary because of a bug in OIDC when any option is provided
    return this;
  },

  logout() {
    let session = this.getSession();
    session &&
      session.logout().catch(e => {
        // TODO
      });
    return this;
  },

  isSessionExpiring() {
    let session = this.getSession();
    let result;
    if (session && session.isExpiring) result = session.isExpiring();
    // uu_oidcg01 >= 3.5.0
    else result = session && session.isAuthenticated() && this._sessionExpiring;
    return result;
  },

  sessionExpiring(event) {
    window.UU5.Common.Tools.warning(
      "Method '[component].sessionExpiring()' is deprecated! Use '[component].onSessionExpiringDefault()' instead."
    );
    this.onSessionExpiringDefault(event);
  },

  sessionExtended(event) {
    window.UU5.Common.Tools.warning(
      "Method '[component].sessionExtended()' is deprecated! Use '[component].onSessionExtendedDefault()' instead."
    );
    this.onSessionExtendedDefault(event);
  },
  //@@viewOff:interface

  //@@viewOn:overriding
  //@@viewOff:overriding

  //@@viewOn:private
  _onSessionExpiring(event) {
    if (typeof this.onSessionExpiring_ === "function") {
      this.onSessionExpiring_(event);
    } else {
      this.onSessionExpiringDefault(event);
    }
  },

  onSessionExpiringDefault(event) {
    this._sessionExpiring = true;
    return this;
  },

  _onSessionExtended(event) {
    if (typeof this.onSessionExtended_ === "function") {
      this.onSessionExtended_(event);
    } else {
      this.onSessionExtendedDefault(event);
    }
  },

  onSessionExtendedDefault(event) {
    this._sessionExpiring = false;
    return this;
  }
  //@@viewOff:private
};

export default SessionMixin;
