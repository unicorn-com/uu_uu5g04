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

import './swiper-menu.less';

export default createReactClass({

  //@@viewOn:mixins
  mixins: [
    UU5.Common.BaseMixin,
    UU5.Common.PureRenderMixin,
    UU5.Common.ElementaryMixin,
    UU5.Common.ContentMixin,
    UU5.Common.NestingLevelMixin
  ],
  //@@viewOff:mixins

  //@@viewOn:statics
  statics: {
    tagName: ns.name("Swiper.Menu"),
    nestingLevelList: UU5.Environment.getNestingLevelList('bigBoxCollection', 'box'),
    classNames: {
      main: ns.css("swiper-menu"),
      left: ns.css("swiper-menu-left"),
      right: ns.css("swiper-menu-right"),
      open: ns.css("swiper-menu-open")
    },
    defaults: {
      parentTagName: 'UU5.Bricks.Swiper'
    },
    errors: {
      invalidParent: 'Parent of this component is not Swiper.'
    }
  },
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {
    pullRight: PropTypes.bool,
    _open: PropTypes.bool
  },
  //@@viewOff:propTypes

  //@@viewOn:getDefaultProps
  getDefaultProps: function () {
    return {
      pullRight: false,
      _open: false
    };
  },
  //@@viewOff:getDefaultProps

  //@@viewOn:standardComponentLifeCycle
  componentWillMount: function () {
    let parent = this.getParent();

    if (parent) {
      while (parent.getOpt("parentWrapper")) {
        parent = parent.getParent();
      }
    }

    if (!(parent && parent.isSwiper)) {
      this.showError("invalidParent");
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
  render: function () {
    var mainAttrs = this.getMainAttrs();

    mainAttrs.className += ' ' + (this.props.pullRight ? this.getClassName().right : this.getClassName().left);
    this.props._open && (mainAttrs.className += ' ' + this.getClassName().open);

    return (
      this.getNestingLevel()
        ? (
        <div {...mainAttrs}>
          {this.getChildren()}
          {this.getDisabledCover()}
        </div>
      ) : null
    );
  }
  //@@viewOff:render
});
