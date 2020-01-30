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
//@@viewOff:imports

export const Authenticated = UU5.Common.VisualComponent.create({
  displayName: "Authenticated", // for backward compatibility (test snapshots)
  //@@viewOn:mixins
  mixins: [UU5.Common.BaseMixin, UU5.Common.IdentityMixin, UU5.Common.ContentMixin],
  //@@viewOff:mixins

  //@@viewOn:statics
  statics: {
    tagName: ns.name("Authenticated"),
    warnings: {
      noPropsGiven:
        "The component will never show any content - you should always set at least one of the props 'pending', 'authenticated', 'notAuthenticated'."
    }
  },
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {
    authenticated: UU5.PropTypes.bool,
    notAuthenticated: UU5.PropTypes.bool,
    pending: UU5.PropTypes.bool
  },
  //@@viewOff:propTypes

  //@@viewOn:getDefaultProps
  getDefaultProps() {
    return {
      authenticated: null, // using null-s to be able to show development warning if none of these 3 props was given
      notAuthenticated: null,
      pending: null
    };
  },
  //@@viewOff:getDefaultProps

  //@@viewOn:reactLifeCycle
  getInitialState() {
    this._checkProps(this.props);
  },

  componentWillReceiveProps(nextProps) {
    this._checkProps(nextProps);
  },
  //@@viewOff:reactLifeCycle

  //@@viewOn:interface
  //@@viewOff:interface

  //@@viewOn:overriding
  //@@viewOff:overriding

  //@@viewOn:private
  _checkProps(props) {
    if (props.pending == null && props.authenticated == null && props.notAuthenticated == null) {
      this.showWarning("noPropsGiven");
    }
  },
  //@@viewOff:private

  //@@viewOn:render
  render() {
    let renderContent =
      (this.props.notAuthenticated && this.isNotAuthenticated()) ||
      (this.props.pending && this.isPending()) ||
      (this.props.authenticated && this.isAuthenticated());
    return renderContent ? this.getChildren() : null;
  }
  //@@viewOff:render
});

export default Authenticated;
