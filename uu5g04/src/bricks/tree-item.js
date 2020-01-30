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
import * as UU5 from "uu5g04";
import ns from "./bricks-ns.js";

import Link from "./link.js";
import Icon from "./icon.js";
import Span from "./span.js";
import { Div } from "./factory.js";
import List from "./tree-list.js";

import "./tree-item.less";
//@@viewOff:imports

const TreeItem = UU5.Common.VisualComponent.create({
  displayName: "TreeItem", // for backward compatibility (test snapshots)
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
    tagName: ns.name("Tree.Item"),
    nestingLevelList: UU5.Environment.getNestingLevelList("box", "smallBox"),
    classNames: {
      main: ns.css("tree-item"),
      link: ns.css("tree-item-link"),
      icon: ns.css("tree-item-icon"),
      iconHidden: ns.css("tree-item-icon-hidden"),
      nav: ns.css("tree-item-nav")
    },
    defaults: {
      iconExpanded: "mdi-menu-down",
      iconCollapsed: "mdi-menu-right"
    },
    errors: {
      invalidParent: "Parent of this component is not Tree, Tree.Item or Tree.List."
    }
  },
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {
    label: UU5.PropTypes.any,
    items: UU5.PropTypes.array,
    iconExpanded: UU5.PropTypes.string,
    iconCollapsed: UU5.PropTypes.string,
    expanded: UU5.PropTypes.bool
  },
  //@@viewOff:propTypes

  //@@viewOn:getDefaultProps
  getDefaultProps: function() {
    return {
      label: null,
      items: null,
      iconExpanded: null,
      iconCollapsed: null,
      expanded: false
    };
  },
  //@@viewOff:getDefaultProps

  //@@viewOn:reactLifeCycle
  getInitialState: function() {
    return {
      expanded: this.props.expanded
    };
  },

  componentWillMount: function() {
    if (!this.getParentByType("isTreeList")) {
      this.showError("invalidParent");
    }
  },

  componentWillReceiveProps: function(nextProps) {
    if (
      nextProps.controlled &&
      nextProps.expanded !== this.props.expanded &&
      nextProps.expanded !== this.isExpanded()
    ) {
      this.setState({ expanded: nextProps.expanded });
    }
  },

  //@@viewOff:reactLifeCycle

  //@@viewOn:interface
  isTreeItem() {
    return true;
  },

  expand: function(setStateCallback) {
    this.setState({ expanded: true }, setStateCallback);
  },

  collapse: function(setStateCallback) {
    this.setState({ expanded: false }, setStateCallback);
  },

  toggleExpanded: function(setStateCallback) {
    this.setState(function(state) {
      return { expanded: !state.expanded };
    }, setStateCallback);
  },

  isExpanded: function() {
    return this.state.expanded;
  },
  //@@viewOff:interface

  //@@viewOn:overriding
  //@@viewOff:overriding

  //@@viewOn:private
  _getItems: function() {
    let result = null;

    if (this.props.items || this.props.content || this.props.children) {
      // let items = this.props.items || this.getChildren();
      // if (items != null && !Array.isArray(items)) items = [items];
      result = (
        <List
          parent={this}
          items={this.props.items}
          iconExpanded={this.props.iconExpanded}
          iconCollapsed={this.props.iconCollapsed}
          hidden={!this.isExpanded()}
          controlled
          content={this.props.content}
        >
          {!this.props.item && !this.props.content
            ? this.buildChildren({ content: this.props.content, children: this.props.children })
            : null}
        </List>
      );
    }

    return result;
  },

  _onToggle: function() {
    this.toggleExpanded();
    return this;
  },

  _getIcon: function() {
    let icon;

    if (
      this.props.items ||
      this.props.content ||
      (this.props.children && (!Array.isArray(this.props.children) || this.props.children.length))
    ) {
      if (this.isExpanded()) {
        icon = this.props.iconExpanded || this.getDefault("iconExpanded");
      } else {
        icon = this.props.iconCollapsed || this.getDefault("iconCollapsed");
      }
    }

    let link = null;
    if (icon) {
      link = (
        <Link className={this.getClassName("link")} onClick={this._onToggle} parent={this}>
          <Icon className={this.getClassName("icon")} icon={icon} />
        </Link>
      );
    } else {
      link = <Icon className={this.getClassName("iconHidden")} />;
    }

    return link;
  },
  //@@viewOff:private

  //@@viewOn:render
  render: function() {
    return this.getNestingLevel() ? (
      <li {...this.getMainAttrs()}>
        <Div className={this.getClassName("nav")}>
          {this._getIcon()} <Span content={this.props.label} />
        </Div>
        {this._getItems()}
        {this.getDisabledCover()}
      </li>
    ) : null;
  }
  //@@viewOff:render
});

export default TreeItem;
