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
import UU5 from "uu5g04";
import ns from "./bricks-ns.js";

import "./session-watch.less";
//@@viewOff:imports

const PORTAL_ID = "uu5-bricks-session-watch-portal";

export const SessionWatch = UU5.Common.VisualComponent.create({
  displayName: "SessionWatch", // for backward compatibility (test snapshots)
  //@@viewOn:mixins
  mixins: [UU5.Common.BaseMixin, UU5.Common.ElementaryMixin, UU5.Common.ContentMixin, UU5.Common.IdentityMixin],
  //@@viewOff:mixins

  //@@viewOn:statics
  statics: {
    tagName: ns.name("SessionWatch"),
    classNames: {
      main: ns.css("session-watch"),
      header: ns.css("session-watch-header"),
      content: ns.css("session-watch-content"),
      footer: ns.css("session-watch-footer")
    },
    lsi: () => UU5.Environment.Lsi.Bricks.sessionWatch
  },
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {
    header: UU5.PropTypes.node
  },
  //@@viewOff:propTypes

  //@@viewOn:getDefaultProps
  getDefaultProps() {
    return {
      header: null
    };
  },
  //@@viewOff:getDefaultProps

  //@@viewOn:reactLifeCycle
  componentDidMount() {
    if (this.isSessionExpiring()) this._modal.open();
  },

  componentWillUnmount() {
    this._tryToRemovePortal();
  },
  //@@viewOff:reactLifeCycle

  //@@viewOn:interface
  //@@viewOff:interface

  //@@viewOn:overriding
  onSessionExpiring_(e) {
    this.onSessionExpiringDefault(e);
    this._modal.open();
  },
  onSessionExtended_(e) {
    this.onSessionExtendedDefault(e);
    this._modal.close();
  },
  onChangeIdentity_(e) {
    this.changeIdentity(() => {
      if (!this.isAuthenticated() && this._modal) this._modal.close();
    });
  },
  //@@viewOff:overriding

  //@@viewOn:private
  _setModalRef(ref) {
    this._modal = ref;
  },

  _getPortalElem(allowCreateElement) {
    // create portal in DOM
    let result = document.getElementById(PORTAL_ID);
    if (!result && allowCreateElement) {
      result = document.createElement("div");
      result.setAttribute("id", PORTAL_ID);
      document.body.appendChild(result);
    }

    return result;
  },

  _tryToRemovePortal() {
    // try to remove portal from DOM if does not exists
    if (!this.state.isOpened) {
      const portal = this._getPortalElem();
      if (portal && portal.childNodes.length === 0) {
        portal.parentNode.removeChild(portal);
      }
    }
  },

  _onLogin() {
    this.getSession().login({ prompt: "login", language: UU5.Common.Tools.getLanguage() });
  },
  _onCancel() {
    this._modal.close();
  },

  _renderDefaultHeader() {
    return <div className={this.getClassName("header")}>{this.getLsiComponent("header")}</div>;
  },
  _renderDefaultContent() {
    return <div className={this.getClassName("content")}>{this.getLsiComponent("content")}</div>;
  },
  _renderDefaultFooter() {
    return (
      <div className={this.getClassName("footer")}>
        <UU5.Bricks.Button onClick={this._onCancel} content={this.getLsiComponent("cancelButton")} />
        <UU5.Bricks.Button
          colorSchema="primary"
          onClick={this._onLogin}
          content={this.getLsiComponent("logInButton")}
        />
      </div>
    );
  },
  //@@viewOff:private

  //@@viewOn:render
  render() {
    let { header, content } = this.props;
    let propsToPass = this.getMainPropsToPass();
    // NOTE Not using UU5.Bricks.ConfirmModal because we don't want to close the modal
    // when "Log in" button is clicked and currently there's no way to prevent that.
    // => create portal just like ConfirmModal does
    return UU5.Common.Portal.create(
      <UU5.Bricks.Modal
        {...propsToPass}
        header={header != null ? header : this._renderDefaultHeader()}
        footer={this._renderDefaultFooter()}
        stickyBackground
        forceRender
        content={content != null ? content : this._renderDefaultContent()}
        controlled={false}
        ref_={this._setModalRef}
      />,
      this._getPortalElem(true)
    );
  }
  //@@viewOff:render
});

export default SessionWatch;
