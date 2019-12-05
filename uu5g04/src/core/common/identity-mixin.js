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
import SessionMixin from "./session-mixin.js";
import Error from "./error.js";
import Environment from "../environment/environment.js";
import Tools from "./tools.js";

const AUTH = "authenticated";
const NOT_AUTH = "notAuthenticated";
const PENDING = "pending";

export const IdentityMixin = {
  //@@viewOn:mixins
  mixins: [SessionMixin],
  //@@viewOff:mixins

  //@@viewOn:statics
  statics: {
    "UU5.Common.IdentityMixin": {
      requiredMixins: ["UU5.Common.BaseMixin"],
      lsi: {
        login: {
          cs: "Uživatel je odhlášen...",
          en: "User is logged out..."
        }
      }
    }
  },
  //@@viewOff:statics

  //@@viewOn:propTypes
  //@@viewOff:propTypess

  //@@viewOn:getDefaultProps
  //@@viewOff:getDefaultProps

  //@@viewOn:reactLifeCycle
  getInitialState() {
    this.registerMixin("UU5.Common.IdentityMixin");

    let identityState = {
      identity: undefined,
      identityFeedback: PENDING
    };

    let session = this.props.session || Environment.getSession();
    if (session && session.initComplete) {
      identityState.identity = session.getIdentity();
      identityState.identityFeedback = session.isAuthenticated() ? AUTH : NOT_AUTH;
    }

    // state
    return identityState;
  },

  componentDidMount() {
    let session = this.props.session || Environment.getSession();
    if (session) {
      if (!session.initComplete) {
        session.initPromise.then(() => {
          if (this.isRendered()) {
            this._onChangeIdentity();
            window.UU5.Environment.EventListener.addIdentityChangeListener(
              session,
              this.getId(),
              this._onChangeIdentity
            );
          }
        });
      } else {
        window.UU5.Environment.EventListener.addIdentityChangeListener(session, this.getId(), this._onChangeIdentity);
      }
    }
  },

  componentWillUnmount() {
    let session = this.getSession();
    session && window.UU5.Environment.EventListener.removeIdentityChangeListener(session, this.getId());
  },
  //@@viewOff:reactLifeCycle

  //@@viewOn:interface
  hasUU5CommonIdentityMixin() {
    return this.hasMixin("UU5.Common.IdentityMixin");
  },

  getUU5CommonIdentityMixinProps() {
    return {};
  },

  getUU5CommonIdentityMixinPropsToPass() {
    return this.getUU5CommonIdentityMixinProps();
  },

  isAuthenticated() {
    return this.state.identityFeedback === AUTH;
  },

  isNotAuthenticated() {
    return this.state.identityFeedback === NOT_AUTH;
  },

  isPending() {
    return this.state.identityFeedback === PENDING;
  },

  getIdentityFeedback() {
    return this.state.identityFeedback;
  },

  getIdentity() {
    return this.state.identity;
  },

  setAuthenticated(isAuth, setStateCallback) {
    this.setState({ identityFeedback: isAuth ? AUTH : NOT_AUTH }, setStateCallback);
    return this;
  },

  changeIdentity(setStateCallback) {
    let session = this.getSession();
    session &&
      this.setState(state => {
        let result;
        let identity = session.getIdentity();
        let identityFeedback = this._getIdentityFeedback(session);
        if (
          identityFeedback !== state.identityFeedback ||
          (identity !== state.identity && !Tools.deepEqual(identity, state.identity))
        ) {
          result = { identity, identityFeedback };
        }
        return result;
      }, setStateCallback);
    return this;
  },

  onChangeIdentityDefault(session) {
    this.changeIdentity();
    return this;
  },

  getAuthenticatedChild(getChild, opt) {
    let result;

    if (!this.isAuthenticated()) {
      result = (
        <Error
          {...this.getMainPropsToPass()}
          silent={opt.silent}
          inline={opt.inline}
          content={opt.message || this.getLsiComponent("login", "UU5.Common.IdentityMixin")}
        />
      );
    } else if (typeof getChild === "function") {
      result = getChild();
    }

    return result;
  },
  //@@viewOff:interface

  //@@viewOn:overriding
  //@@viewOff:overriding

  //@@viewOn:private
  _getIdentityFeedback(session) {
    let result = PENDING;
    if (session) {
      result = session.isAuthenticated() ? AUTH : NOT_AUTH;
    }

    return result;
  },

  _onChangeIdentity() {
    let session = this.getSession();
    if (session) {
      if (typeof this.onChangeIdentity_ === "function") {
        this.onChangeIdentity_(session);
      } else {
        this.onChangeIdentityDefault(session);
      }
    }
    return this;
  }
  //@@viewOff:private
};

export default IdentityMixin;
