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
import Error from "./error.js";
import PureRenderMixin from "./pure-render-mixin";
import Tools from "./tools.js";
import VisualComponent from "./visual-component.js";

import "./not-found-tag.less";
//@@viewOff:imports

export const NotFoundTag = VisualComponent.create({
  displayName: "NotFoundTag", // for backward compatibility (test snapshots)
  //@@viewOn:mixins
  mixins: [BaseMixin, ElementaryMixin, PureRenderMixin],
  //@@viewOff:mixins

  //@@viewOn:statics
  statics: {
    tagName: ns.name("NotFoundTag"),
    classNames: {
      main: ns.css("not-found-tag")
    },
    lsi: () => UU5.Environment.Lsi.Common.notFoundTag
  },
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {
    tagName: PropTypes.string,
    error: PropTypes.oneOfType([PropTypes.func, PropTypes.string, PropTypes.element])
  },
  //@@viewOff:propTypes

  //@@viewOn:getDefaultProps
  getDefaultProps: function () {
    return {
      tagName: null,
      error: null
    };
  },
  //@@viewOff:getDefaultProps

  //@@viewOn:reactLifeCycle
  //@@viewOff:reactLifeCycle

  //@@viewOn:interface
  //@@viewOff:interface

  //@@viewOn:overriding
  //@@viewOff:overriding

  //@@viewOn:private
  _getCustomError() {
    let result;

    if (typeof this.props.error === "string") {
      result = Tools.formatString(this.props.error, { tagName: this.props.tagName });
    } else if (React.isValidElement(this.props.error)) {
      result = React.cloneElement(this.props.error, { tagName: this.props.tagName });
    } else if (typeof this.props.error === "function") {
      result = this.props.error({ tagName: this.props.tagName });
    } else {
      result = null;
    }

    return result;
  },
  //@@viewOff:private

  //@@viewOn:render
  render: function () {
    // cannot be getLsiComponent, because UU5.Bricks.Lsi is in Bricks and it could not be loaded and without
    // internet it will be loop
    const value = Tools.getLsiValueByLanguage(
      this.getLsi(window.navigator.onLine ? "notFound" : "offline"),
      UU5.Common.Tools.getLanguage(),
      this.props.tagName || ""
    );

    return this.props.error ? this._getCustomError() : (
      <Error {...this.getMainPropsToPass()} id={this.props.id}>
        {value}
      </Error>
    );
  }
  //@@viewOff:render
});

export default NotFoundTag;
