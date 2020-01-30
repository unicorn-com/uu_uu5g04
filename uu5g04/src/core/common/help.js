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
import ns from "./common-ns.js";
import PropTypes from "prop-types";
import BaseMixin from "./base-mixin.js";
import ElementaryMixin from "./elementary-mixin.js";
import Tools from "./tools.js";
import PureRenderMixin from "./pure-render-mixin";
import ContentMixin from "./content-mixin.js";
import VisualComponent from "./visual-component.js";
//@@viewOff:imports

export const Help = VisualComponent.create({
  displayName: "Help", // for backward compatibility (test snapshots)
  //@@viewOn:mixins
  mixins: [BaseMixin, ElementaryMixin, PureRenderMixin, ContentMixin],
  //@@viewOff:mixins

  //@@viewOn:statics
  statics: {
    tagName: ns.name("Help"),
    classNames: {
      main: ns.css("help")
    }
  },
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {
    tagName: PropTypes.string,
    target: PropTypes.oneOf(["_blank", "_parent", "_top", "_self"])
  },
  //@@viewOff:propTypes

  //@@viewOn:getDefaultProps
  getDefaultProps() {
    return {
      tagName: "UU5.Common.Help",
      target: "_blank"
    };
  },
  //@@viewOff:getDefaultProps

  //@@viewOn:reactLifeCycle
  getInitialState() {
    return {
      errorDetails: false,
      responseLink: null
    };
  },

  componentDidMount() {
    this._loadLibrary();
  },

  componentWillReceiveProps(nextProps) {
    if (nextProps.tagName !== this.props.tagName) {
      this._loadLibrary(nextProps);
    }
  },
  //@@viewOff:reactLifeCycle

  //@@viewOn:interface
  //@@viewOff:interface

  //@@viewOn:overriding
  //@@viewOff:overriding

  //@@viewOn:private
  _loadLibrary(props = this.props) {
    let tagNameArr = props.tagName.split(".");
    let libraryName = tagNameArr[0] + "." + tagNameArr[1];
    let pageName = "/page?code=" + tagNameArr[0].toLowerCase() + tagNameArr[1] + tagNameArr[2];
    Tools.loadLibrary(libraryName, (response, error) => {
      if (!error && response && response.doc) {
        this.setState({ responseLink: response.doc + pageName });
      }
    });
  },

  _getLink() {
    if (this.state.responseLink) {
      return Tools.findComponent(
        "UU5.Bricks.Link",
        UU5.Common.Tools.merge(this.getMainPropsToPass(), {
          href: this.state.responseLink,
          content: this.props.content || this.props.children || this.props.tagName,
          target: this.props.target
        })
      );
    } else {
      return this.props.tagName;
    }
  },
  //@@viewOff:private

  //@@viewOn:render
  render: function() {
    return this._getLink();
  }
  //@@viewOff:render
});

export default Help;
