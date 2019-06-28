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

import List from './tree-list.js';
import Item from './tree-item.js';

import './tree.less';

export const Tree = createReactClass({

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
    tagName: ns.name("Tree"),
    nestingLevelList: UU5.Environment.getNestingLevelList('box', 'smallBox'),
    classNames: {
      main: ns.css("tree"),
      size: ns.css("tree-")
    },
    defaults: {
      childTagName: 'UU5.Bricks.Tree.Item'
    }
  },
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {
    items: PropTypes.array,
    iconExpanded: PropTypes.string,
    iconCollapsed: PropTypes.string,
    size: PropTypes.oneOf(['s', 'm', 'l', 'xl']),
    allowTags: PropTypes.arrayOf(PropTypes.string)
  },
  //@@viewOff:propTypes

  //@@viewOn:getDefaultProps
  getDefaultProps: function () {
    return {
      items: null,
      iconExpanded: null,
      iconCollapsed: null,
      size: 'm',
      allowTags: []
    };
  },
  //@@viewOff:getDefaultProps

  //@@viewOn:standardComponentLifeCycle
  //@@viewOff:standardComponentLifeCycle

  //@@viewOn:interface
  isTree() {
    return true;
  },
  //@@viewOff:interface

  //@@viewOn:overridingMethods
  //@@viewOff:overridingMethods

  //@@viewOn:componentSpecificHelpers
  _getListItems() {
    let items = this.props.items || this.getChildren();
    if (items != null && !Array.isArray(items)) items = [items];
    return items;
  },
  //@@viewOff:componentSpecificHelpers

  //@@viewOn:render
  render() {
    const mainPropsToPass = this.getMainPropsToPass();
    mainPropsToPass.className += ' ' + this.getClassName('size') + this.props.size;

    return (
      this.getNestingLevel()
        ? (
          <List
            {...mainPropsToPass}
            items={this.props.items}
            iconExpanded={this.props.iconExpanded}
            iconCollapsed={this.props.iconCollapsed}
          >
            {this.props.children && React.Children.toArray(this.props.children)}
          </List>
        ) : null
    );
  }
  //@@viewOff:render
});

Tree.List = List;
Tree.Item = Item;

export default Tree;
