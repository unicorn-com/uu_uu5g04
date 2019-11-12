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
import createReactClass from "create-react-class";
import PropTypes from "prop-types";
import * as UU5 from "uu5g04";
import ns from "./bricks-ns.js";

import "./column.less";
//@@viewOff:imports

export const Column = createReactClass({
  //@@viewOn:mixins
  mixins: [
    UU5.Common.BaseMixin,
    UU5.Common.ElementaryMixin,
    UU5.Common.NestingLevelMixin,
    UU5.Common.SectionMixin,
    UU5.Common.PureRenderMixin
  ],
  //@@viewOff:mixins

  //@@viewOn:statics
  statics: {
    tagName: ns.name("Column"),
    nestingLevelList: UU5.Environment.getNestingLevelList("spa", "smallBoxCollection"),
    classNames: {
      main: ns.css("column"),
      spacing: ns.css("column-spacing"),
      noSpacing: ns.css("column-nospacing")
    },
    defaults: {
      colWidth: { xs: 12, s: 12, m: 12, l: 12, xl: 12 },
      columnRegexp: /^((?:offset-)?[a-z]+)(?:-)?(\d+)$/
    },
    opt: {
      nestingLevelWrapper: true
    }
  },
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {
    noSpacing: PropTypes.bool,
    width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    // BS Column magic
    colWidth: PropTypes.oneOfType([
      PropTypes.shape({
        xs: PropTypes.number,
        s: PropTypes.number,
        m: PropTypes.number,
        l: PropTypes.number,
        xl: PropTypes.number
      }),
      PropTypes.string
    ])
  },
  //@@viewOff:propTypes

  //@@viewOn:getDefaultProps
  getDefaultProps() {
    return {
      noSpacing: false,
      width: null,
      colWidth: null
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
  _getMainAttrs() {
    let mainAttrs = this.getMainAttrs();
    mainAttrs.className += " " + this.getClassName(this.props.noSpacing ? "noSpacing" : "spacing");

    if (this.props.width) {
      mainAttrs.style = UU5.Common.Tools.merge(mainAttrs.style, { width: this.props.width });
    } else {
      mainAttrs.className =
        mainAttrs.className +
        " " +
        UU5.Common.Tools.buildColWidthClassName(this.props.colWidth || this.getDefault().colWidth);
    }

    return mainAttrs;
  },
  //@@viewOff:private

  //@@viewOn:render
  render() {
    return this.getNestingLevel() ? (
      <div {...this._getMainAttrs()}>
        {this.getHeaderChild()}
        {this.getChildren()}
        {this.getFooterChild()}
        {this.getDisabledCover()}
      </div>
    ) : null;
  }
  //@@viewOff:render
});

export default Column;
