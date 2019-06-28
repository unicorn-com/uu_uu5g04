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

import React from 'react';
import createReactClass from 'create-react-class';
import PropTypes from 'prop-types';
import * as UU5 from "uu5g04";
import ns from "./bricks-ns.js";

import './row.less'

export const Row = createReactClass({

  //@@viewOn:mixins
  mixins: [
    UU5.Common.BaseMixin,
    UU5.Common.PureRenderMixin,
    UU5.Common.ElementaryMixin,
    UU5.Common.NestingLevelMixin,
    UU5.Common.SectionMixin
  ],
  //@@viewOff:mixins

  //@@viewOn:statics
  statics: {
    tagName: ns.name("Row"),
    nestingLevelList: ['spa', 'page', 'bigBoxCollection', 'bigBoxCollection', 'boxCollection', 'box','smallBoxCollection'],
    classNames: {
      main: ns.css("row"),
      spacing: ns.css("row-spacing"),
      noSpacing: ns.css("row-nospacing"),
      standard: ns.css("row-standard"),
      flex: ns.css("row-flex")
    },
    opt: {
      nestingLevelWrapper: true
    }
  },
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {
    noSpacing: PropTypes.bool,
    display: PropTypes.oneOf(['standard', 'flex'])
  },
  //@@viewOff:propTypes

  //@@viewOn:getDefaultProps
  getDefaultProps() {
    return {
      noSpacing: false,
      display: 'standard'
    };
  },
  //@@viewOff:getDefaultProps

  //@@viewOn:standardComponentLifeCycle
  //@@viewOff:standardComponentLifeCycle

  //@@viewOn:interface
  //@@viewOff:interface

  //@@viewOn:overridingMethods
  //@@viewOff:overridingMethods

  //@@viewOn:componentSpecificHelpers
  _getMainAttrs() {
    let mainAttrs = this.getMainAttrs();
    mainAttrs.className +=  ' ' + this.getClassName(this.props.display);
    mainAttrs.className +=  ' ' + this.getClassName(this.props.noSpacing ? 'noSpacing' : 'spacing');
    return mainAttrs;
  },
  //@@viewOff:componentSpecificHelpers

  //@@viewOn:render
  render() {
    return (
      this.getNestingLevel()
        ? (
        <div {...this._getMainAttrs()}>
          {this.getHeaderChild()}
          {this.getChildren()}
          {this.getFooterChild()}
          {this.getDisabledCover()}
        </div>
      ) : null
    );
  }
  //@@viewOff:render
});

export default Row;
