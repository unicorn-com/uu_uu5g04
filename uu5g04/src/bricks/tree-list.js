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

import './tree-list.less';

export default createReactClass({

  //@@viewOn:mixins
  mixins: [
    UU5.Common.BaseMixin,
    UU5.Common.PureRenderMixin,
    UU5.Common.ElementaryMixin,
    UU5.Common.ContentMixin
  ],
  //@@viewOff:mixins

  //@@viewOn:statics
  statics: {
    tagName: ns.name("Tree.List"),
    classNames: {
      main: ns.css("tree-list")
    },
    defaults: {
      childTagName: 'UU5.Bricks.Tree.Item'
    },
    errors: {
      invalidParent: 'Parent of this component is not Tree, Tree.Item or Tree.List.'
    }
  },
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {
    items: PropTypes.array,
    iconExpanded: PropTypes.string,
    iconCollapsed: PropTypes.string
  },
  //@@viewOff:propTypes

  //@@viewOn:getDefaultProps
  getDefaultProps: function () {
    return {
      items: null,
      iconExpanded: null,
      iconCollapsed: null
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

    if (!(parent && (parent.isTree || parent.isTreeItem || parent.isTreeList))) {
      this.showError("invalidParent");
    }
  },

  //@@viewOff:standardComponentLifeCycle

  //@@viewOn:interface
  isTreeList() {
    return true;
  },
  //@@viewOff:interface

  //@@viewOn:overridingMethods
  expandChildProps_: function (child) {
    let newChildProps = { ...child.props };
    newChildProps.iconExpanded = newChildProps.iconExpanded || this.props.iconExpanded;
    newChildProps.iconCollapsed = newChildProps.iconCollapsed || this.props.iconCollapsed;
    return newChildProps;
  },

  shouldChildRender_: function (child) {
    let childTagName = UU5.Common.Tools.getChildTagName(child);
    let childTagNames = this._getAllowTags();
    let result = childTagNames.indexOf(childTagName) > -1;
    if (!result && (typeof child !== 'string' || child.trim())) {
      let defaultChildTagName = this.getDefault().childTagName;
      if (childTagName) this.showError('childTagNotAllowed', [childTagName, this.getTagName(), childTagName, defaultChildTagName], { mixinName: 'UU5.Common.BaseMixin' });
      else this.showError('childNotAllowed', [child, defaultChildTagName], { mixinName: 'UU5.Common.BaseMixin' });
    }
    return result;
  },
  //@@viewOff:overridingMethods

  //@@viewOn:componentSpecificHelpers
  _getAllowTags() {
    let treeParent = this.getParentByType("isTree");
    return [this.getDefault().childTagName].concat(treeParent ? treeParent.props.allowTags : []);
  },

  _getItems: function () {
    let list = this;
    let content = this.getContent();

    if (this.props.items) {
      content = this.props.items.map(function (itemProps) {
        let result;
        if (typeof itemProps.type === 'function') {
          result = itemProps;
        } else {
          result = { tag: list.getDefault().childTagName, props: itemProps };
        }
        return result;
      });
    }
    return this.buildChildren({ content: content, children: this.props.children });
  },
  //@@viewOff:componentSpecificHelpers

  //@@viewOn:render
  render: function () {
    return (
      <ul {...this.getMainAttrs()}>
        {this._getItems()}
        {this.getDisabledCover()}
      </ul>
    );
  }
  //@@viewOff:render
});
