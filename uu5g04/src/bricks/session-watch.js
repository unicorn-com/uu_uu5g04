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
import UU5 from "uu5g04";
import ns from "./bricks-ns.js";

import "./session-watch.less";
//@@viewOff:imports

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
      footer: ns.css("session-watch-footer"),
    },
    lsi: () => UU5.Environment.Lsi.Bricks.sessionWatch,
  },
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {
    header: UU5.PropTypes.node,
  },
  //@@viewOff:propTypes

  //@@viewOn:getDefaultProps
  getDefaultProps() {
    return {
      header: null,
    };
  },
  //@@viewOff:getDefaultProps

  //@@viewOn:reactLifeCycle
  componentDidMount() {
    if (this.isSessionExpiring()) this._modal.open();
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
    return (
      <UU5.Bricks.Modal
        {...propsToPass}
        location="portal"
        header={header != null ? header : this._renderDefaultHeader()}
        footer={this._renderDefaultFooter()}
        stickyBackground
        content={content != null ? content : this._renderDefaultContent()}
        controlled={false}
        ref_={this._setModalRef}
      />
    );
  },
  //@@viewOff:render
});

export default SessionWatch;
