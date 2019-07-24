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

import createReactClass from "create-react-class";
import ns from "./common-ns.js";
import PropTypes from "prop-types";
import BaseMixin from "./base-mixin.js";

export const Redirect = createReactClass({
  //@@viewOn:mixins
  mixins: [BaseMixin],
  //@@viewOff:mixins

  //@@viewOn:statics
  statics: {
    tagName: ns.name("Redirect"),
    classNames: {
      main: ns.css("redirect")
    }
  },
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {
    uri: PropTypes.string,
    target: PropTypes.oneOf(["_blank", "_parent", "_top", "_self"])
  },
  //@@viewOff:propTypes
  //@@viewOn:getDefaultProps
  getDefaultProps() {
    return {
      uri: undefined,
      target: "_self"
    };
  },
  //@@viewOff:getDefaultProps

  //@@viewOn:standardComponentLifeCycle
  componentDidMount() {
    if (this.props.uri) {
      window.open(this.props.uri, this.props.target || "_self");
    }
  },
  //@@viewOff:standardComponentLifeCycle

  //@@viewOn:interface
  //@@viewOff:interface

  //@@viewOn:overridingMethods
  //@@viewOff:overridingMethods

  //@@viewOn:componentSpecificHelpers
  //@@viewOff:componentSpecificHelpers

  //@@viewOn:render
  render() {
    return null;
  }
  //@@viewOff:render
});

export default Redirect;
