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

import "./context-menu-item.less";
import Span from "./span";
//@@viewOff:imports

export const ContextMenuItem = UU5.Common.VisualComponent.create({
  displayName: "ContextMenuItem", // for backward compatibility (test snapshots)
  //@@viewOn:mixins
  mixins: [UU5.Common.BaseMixin, UU5.Common.ElementaryMixin, UU5.Common.ContentMixin, UU5.Common.PureRenderMixin],
  //@@viewOff:mixins

  //@@viewOn:statics
  statics: {
    tagName: ns.name("ContextMenu.Item"),
    classNames: {
      main: ns.css("context-menu-item"),
      link: ns.css("context-menu-item-link"),
      icon: ns.css("context-menu-item-icon"),
      nestedIcon: ns.css("context-menu-item-nested-icon"),
      nestedItem: ns.css("context-menu-item-nested-item"),
      space: ns.css("context-menu-item-space"),
      divider: ns.css("context-menu-item-divider"),
      header: ns.css("context-menu-item-header")
    }
  },
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {
    label: UU5.PropTypes.any, // content
    href: UU5.PropTypes.string,
    onClick: UU5.PropTypes.func,
    smoothScroll: UU5.PropTypes.number,
    offset: UU5.PropTypes.number,
    target: UU5.PropTypes.string,
    icon: UU5.PropTypes.string,
    space: UU5.PropTypes.bool,
    header: UU5.PropTypes.bool,
    divider: UU5.PropTypes.bool,
    allowTags: UU5.PropTypes.arrayOf(UU5.PropTypes.string)
  },
  //@@viewOff:propTypes

  //@@viewOn:getDefaultProps
  getDefaultProps() {
    return {
      label: null,
      href: null,
      onClick: null,
      smoothScroll: 1000,
      offset: null,
      target: "_self",
      icon: null,
      space: false,
      divider: false,
      header: false,
      allowTags: []
    };
  },
  //@@viewOff:getDefaultProps

  //@@viewOn:reactLifeCycle
  //@@viewOff:reactLifeCycle

  //@@viewOn:interface
  onClickDefault(opt) {
    if (!opt) {
      return null;
    }
    let parent = opt.component;

    parent && parent.close ? parent.close() : this._getCloseableParent(parent);
    return this;
  },
  //@@viewOff:interface

  //@@viewOn:overriding
  //@@viewOff:overriding

  //@@viewOn:private
  _getLinkProps() {
    const linkProps = {
      className: this.getClassName().link,
      parent: this,
      disabled: this.isDisabled(),
      colorSchema: "custom"
    };

    if (!this.isDisabled()) {
      linkProps.onClick = this._onItemClick;
      linkProps.href = !this.props.href && typeof this.props.onClick !== "function" ? "#" : this.props.href;
      linkProps.smoothScroll = this.props.smoothScroll;
      linkProps.offset = this.props.offset;
      linkProps.target = this.props.target;
    }

    return linkProps;
  },

  _getStandardItem(props) {
    const linkProps = this._getLinkProps();

    this.props.space && !this.props.icon && (props.className += " " + this.getClassName("space"));
    let content = [this.props.label];
    this.props.icon && content.unshift(<Icon icon={this.props.icon} className={this.getClassName("icon")} />);
    linkProps.content = content;

    return (
      <li {...props}>
        <Link {...linkProps} />
      </li>
    );
  },

  _getNestingItem(props) {
    props.className += ` ${this.getClassName("link")} ${this.getClassName("nestedItem")}`;
    this.props.space && !this.props.icon && (props.className += " " + this.getClassName("space"));
    let content = [<span key="nestedLabel">{this.props.label}</span>];
    if (this.props.icon) {
      content.unshift(<Icon key="icon" icon={this.props.icon} className={this.getClassName("icon")} />);
    }
    content.push(<Icon key="nestedIcon" icon="mdi-menu-right" className={this.getClassName("nestedIcon")} />);

    return (
      <li
        {...props}
        onMouseEnter={
          !this.isDisabled() &&
          (e => {
            this._nestedMenu.open({
              aroundElement: this._nestingItem,
              position: "right-bottom"
            });
          })
        }
        onMouseLeave={!this.isDisabled() && (() => this._nestedMenu.close())}
        ref={item => (this._nestingItem = item)}
      >
        {content}
        {this._getNestedContextMenu()}
      </li>
    );
  },

  _getCloseableParent(parent) {
    if (parent.close) return parent.close();
    this._getCloseableParent(parent.getParent());
  },

  _onItemClick(target, event) {
    const parent = this.getParentByType("isContextMenu") || this.getParent();
    let opt = { component: parent, item: this, target: target, event: event, value: this.props.label };
    if (typeof this.props.onClick === "function") {
      this.props.onClick(opt);
    } else {
      this.onClickDefault(opt);
    }
    return this;
  },

  _getContentItem(props) {
    return <li {...props}>{this.getChildren()}</li>;
  },

  _getDividerItem(props) {
    props.className += " " + this.getClassName().divider;
    return <li {...props} />;
  },

  _getHeaderItem(props) {
    props.className += " " + this.getClassName().header;
    return (
      <li {...props}>
        <Span content={this.props.label} />
      </li>
    );
  },

  _getNestedContextMenu() {
    let ContextMenu = UU5.Common.Tools.checkTag("UU5.Bricks.ContextMenu", false);
    return (
      <ContextMenu
        ref_={cm => (this._nestedMenu = cm)}
        parent={this}
        content={this.props.content}
        forceRender
        allowTags={this.props.allowTags}
      >
        {UU5.Common.Children.toArray(this.props.children)}
      </ContextMenu>
    );
  },
  //@@viewOff:private

  //@@viewOn:render
  render() {
    let mainAttrs = this.getMainAttrs();
    mainAttrs.id = this.getId();

    let result = null;

    if (this.props.divider) {
      result = this._getDividerItem(mainAttrs);
    } else if (this.props.header) {
      result = this._getHeaderItem(mainAttrs);
    } else {
      let content = this.getContent() || this.props.children;
      if (content && (!Array.isArray(content) || content.length)) {
        if (this.props.label) {
          result = this._getNestingItem(mainAttrs);
        } else {
          result = this._getContentItem(mainAttrs);
        }
      } else {
        result = this._getStandardItem(mainAttrs);
      }
    }

    return result;
  }
  //@@viewOff:render
});

export default ContextMenuItem;
