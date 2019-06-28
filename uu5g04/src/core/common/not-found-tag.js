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
import PropTypes from 'prop-types';
import BaseMixin from './base-mixin.js';
import ElementaryMixin from './elementary-mixin.js';
import Error from './error.js';
import PureRenderMixin from "./pure-render-mixin";

import './not-found-tag.less';

export const NotFoundTag = createReactClass({

  //@@viewOn:mixins
  mixins: [
    BaseMixin,
    ElementaryMixin,
    PureRenderMixin
  ],
  //@@viewOff:mixins

  //@@viewOn:statics
  statics: {
    tagName: ns.name("NotFoundTag"),
    defaults: {
      body: 'Tag not found: '
    },
    classNames: {
      main: ns.css("not-found-tag")
    }
  },
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {
    tagName: PropTypes.string
  },
  //@@viewOff:propTypes

  //@@viewOn:getDefaultProps
  getDefaultProps: function () {
    return {
      tagName: null
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
  //@@viewOff:componentSpecificHelpers

  //@@viewOn:render
  render: function () {
    let value = this.getDefault().body;
    this.props.tagName && (value += ' ' + this.props.tagName);
    return (
      <Error {...this.getMainPropsToPass()} id={this.props.id}>
        {value}
      </Error>
    );
  }
  //@@viewOff:render
});

export default NotFoundTag;
