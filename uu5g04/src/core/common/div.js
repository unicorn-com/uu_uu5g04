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
import ns from "./common-ns.js";
import BaseMixin from './base-mixin.js';
import ElementaryMixin from './elementary-mixin.js';
import ContentMixin from './content-mixin.js';
import NestingLevelMixin from './nesting-level-mixin.js';
import Environment from '../environment/environment.js'
import PureRenderMixin from "./pure-render-mixin";

import './div.less';

export const Div = createReactClass({

  //@@viewOn:mixins
  mixins: [
    BaseMixin,
    ElementaryMixin,
    ContentMixin,
    NestingLevelMixin,
    PureRenderMixin
  ],
  //@@viewOff:mixins

  //@@viewOn:statics
  statics: {
    tagName: ns.name("Div"),
    classNames: {
      main: ns.css("div")
    },
    nestingLevelList: Environment.getNestingLevelList('bigBoxCollection', 'smallBox')
  },
  //@@viewOff:statics

  //@@viewOn:propTypes
  //@@viewOff:propTypes

  //@@viewOn:getDefaultProps
  //@@viewOff:getDefaultProps

  //@@viewOn:standardComponentLifeCycle
  //@@viewOff:standardComponentLifeCycle

  //@@viewOn:interface
  //@@viewOff:interface

  //@@viewOn:overridingMethods
  //@@viewOff:overridingMethods

  //@@viewOn:componentSpecificHelpers
  //@@viewOff:componentSpecificHelpers

  //@@viewOn:render
  render: function () {
    return this.getNestingLevel() ? React.createElement(
        'div',
        this.getMainAttrs(),
        this.getChildren(),
        this.getDisabledCover()
      ) : null;
  }
  //@@viewOff:render
});

export default Div;
