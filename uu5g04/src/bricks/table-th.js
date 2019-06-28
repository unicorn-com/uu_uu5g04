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

import './table-th.less';

export default createReactClass({

  //@@viewOn:mixins
  mixins: [
    UU5.Common.BaseMixin,
    UU5.Common.PureRenderMixin,
    UU5.Common.ElementaryMixin,
    UU5.Common.NestingLevelMixin,
    UU5.Common.ContentMixin,
    UU5.Common.ColorSchemaMixin
  ],
  //@@viewOff:mixins

  //@@viewOn:statics
  statics: {
    tagName: ns.name("Table.Th"),
    nestingLevelList: UU5.Environment.getNestingLevelList('boxCollection', 'inline'),
    classNames: {
      main: ns.css("table-th uu5-common-text"),
      //bg: 'uu5-common-bg'
    },
    defaults: {
      parentTagName: 'UU5.Bricks.Table.Tr'
    },
    opt: {
      nestingLevelWrapper: true
    },
    errors: {
      invalidParent: 'Parent of this component is not Table.'
    }
  },
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {
    colSpan: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    rowSpan: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  },

  getDefaultProps: function () {
    return {
      colSpan: null,
      rowSpan: null,
    };
  },
  //@@viewOff:propTypes

  //@@viewOn:getDefaultProps
  //@@viewOff:getDefaultProps

  //@@viewOn:standardComponentLifeCycle
  componentWillMount: function () {
    let parent = this.getParent();

    if (parent) {
      while (parent.getOpt("parentWrapper")) {
        parent = parent.getParent();
      }
    }

    if (!(parent && (parent.isTable || parent.isTr))) {
      this.showError("invalidParent");
    }
  },

  //@@viewOff:standardComponentLifeCycle

  //@@viewOn:interface
  //@@viewOff:interface

  //@@viewOn:overridingMethods
  //@@viewOff:overridingMethods

  //@@viewOn:componentSpecificHelpers
  _getMainProps: function () {
    const props = this.getMainAttrs();
    //this.props.background && (props.className += ' ' + this.getClassName().bg);
    this.props.colSpan && (props.colSpan = this.props.colSpan);
    this.props.rowSpan && (props.rowSpan = this.props.rowSpan);
    return props;
  },
  //@@viewOff:componentSpecificHelpers

  //@@viewOn:render
  render: function () {
    return (
      this.getNestingLevel()
        ? (
        <th {...this._getMainProps()}>
          {this.getChildren()}
          {this.getDisabledCover()}
        </th>
      ) : null
    );
  }
  //@@viewOff:render
});
