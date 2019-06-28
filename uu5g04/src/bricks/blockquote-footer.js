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



import './blockquote-footer.less';

export default createReactClass({

  //@@viewOn:mixins
  mixins: [
    UU5.Common.BaseMixin,
    UU5.Common.ElementaryMixin,
    UU5.Common.NestingLevelMixin,
    UU5.Common.ContentMixin,
    UU5.Common.PureRenderMixin
  ],
  //@@viewOff:mixins

  //@@viewOn:statics
  statics: {
    tagName: ns.name("Blockquote.footer"),
    nestingLevelList: UU5.Environment.getNestingLevelList('bigBoxCollection', 'box'),
    classNames: {
      main: ns.css("blockquote-footer"),
      right: ns.css("blockquote-footer-right"),
      left: ns.css("blockquote-footer-left")
    },
    opt: {
      nestingLevelWrapper: true
    }
  },
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {
    alignment: PropTypes.oneOf([
      'left',
      'right'
    ])
  },
  //@@viewOff:propTypes

  //@@viewOn:getDefaultProps
  getDefaultProps: function () {
    return {
      alignment: 'left'
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
  _buildMainAttrs: function () {
    var mainAttrs = this.getMainAttrs();
    this.props.alignment === 'right' && (mainAttrs.className += ' ' + this.getClassName().right);
    this.props.alignment === 'left' && (mainAttrs.className += ' ' + this.getClassName().left);
    return mainAttrs;
  },
  //@@viewOff:componentSpecificHelpers

  //@@viewOn:render
  render: function () {
    return (
      this.getNestingLevel()
        ? (
        <footer {...this._buildMainAttrs()}>
          {this.getChildren()}
        </footer>
        ) : null
    );
  }
  //@@viewOff:render
});