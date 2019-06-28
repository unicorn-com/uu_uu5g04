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



import Section from './section.js';

import './newspaper.less';

export const Newspaper = createReactClass({

  //@@viewOn:mixins
  mixins: [
    UU5.Common.BaseMixin,
    UU5.Common.PureRenderMixin,
    UU5.Common.ElementaryMixin,
    UU5.Common.SectionMixin,
    UU5.Common.ColorSchemaMixin,
    UU5.Common.NestingLevelMixin
  ],
  //@@viewOff:mixins

  //@@viewOn:statics
  statics: {
    tagName: ns.name("Newspaper"),
    nestingLevelList: UU5.Environment.getNestingLevelList('bigBoxCollection', 'box'),
    classNames: {
      main: ns.css("newspaper uu5-common-text"),
      //bg: 'uu5-common-bg',
      columns: 'uu5-common-newspaper-layout-'
    }
  },
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {
    columnsCount: PropTypes.oneOf([
      1, 2, 3, 4, 5, 6
    ]),
    //background: PropTypes.bool
  },
  //@@viewOff:propTypes

  //@@viewOn:getDefaultProps
  getDefaultProps: function () {
    return {
      columnsCount: 2,
      //background: false
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
  _getMainProps: function () {
    var mainProps = this.getMainPropsToPass();
    mainProps.className += ' ' + this.getClassName().columns + this.props.columnsCount;
    //this.props.background && (mainProps.className += ' ' + this.getClassName().bg);
    return mainProps;
  },
  //@@viewOff:componentSpecificHelpers

  //@@viewOn:render
  render: function () {
    return (
      this.getNestingLevel()
        ? (
          <Section {...this._getMainProps()}>
            {this.props.children && React.Children.toArray(this.props.children)}
          </Section>
        ) : null
    );
  }
  //@@viewOff:render
});

export default Newspaper;
