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

import Button from "./button.js";
import Icon from "./icon.js";

import "./nav-bar-header.less";
//@@viewOff:imports

export default UU5.Common.VisualComponent.create({
  displayName: "nav-bar-header", // for backward compatibility (test snapshots)
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
    tagName: ns.name("NavBar.Header"),
    classNames: {
      main: ns.css("nav-bar-header navbar-header"),
      hamburger: ns.css("nav-bar-header-hamburger"),
      brand: ns.css("nav-bar-header-brand")
    },
    defaults: {
      parentTagName: "UU5.Bricks.NavBar"
    },
    errors: {
      invalidParent: "Parent of this component is not NavBar."
    }
  },
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {
    _icon: UU5.PropTypes.string,
    _size: UU5.PropTypes.string,
    _hamburger: UU5.PropTypes.bool,
    _onOpen: UU5.PropTypes.func,
    _onClose: UU5.PropTypes.func
  },
  //@@viewOff:propTypes

  //@@viewOn:getDefaultProps
  getDefaultProps() {
    return {
      _icon: "mdi-menu",
      _size: "m",
      _hamburger: true,
      _onOpen: null,
      _onClose: null
    };
  },
  //@@viewOff:getDefaultProps

  //@@viewOn:reactLifeCycle
  componentWillMount() {
    this.checkParentTagName(this.getDefault().parentTagName);

    let parent = this.getParent();

    if (parent) {
      while (parent.getOpt("parentWrapper")) {
        parent = parent.getParent();
      }
    }

    if (!(parent && parent.isNavBar)) {
      this.showError("invalidParent");
    }
  },

  //@@viewOff:reactLifeCycle

  //@@viewOn:interface
  //@@viewOff:interface

  //@@viewOn:overriding
  //@@viewOff:overriding

  //@@viewOn:private
  _onClickHamburger() {
    let parent = this.getParent();

    if (parent) {
      while (parent.getOpt("parentWrapper")) {
        parent = parent.getParent();
      }
    }

    parent &&
      parent.toggle(() => {
        if (parent.isOpen()) {
          typeof this.props._onOpen === "function" && this.props._onOpen(parent);
        } else {
          typeof this.props._onClose === "function" && this.props._onClose(parent);
        }
      });
  },
  //@@viewOff:private

  //@@viewOn:render
  render() {
    var hamburger = null;
    if (this.props._hamburger) {
      hamburger = (
        <Button
          className={this.getClassName("hamburger")}
          size={this.props._size}
          bgStyle="transparent"
          onClick={() => this._onClickHamburger()}
        >
          <Icon icon={this.props._icon} />
        </Button>
      );
    }

    var children = this.getChildren();
    if (children) {
      children = <span className={this.getClassName().brand}>{children}</span>;
    }

    return this.getNestingLevel() ? (
      <div {...this.getMainAttrs()}>
        {children}
        {hamburger}
        {this.getDisabledCover()}
      </div>
    ) : null;
  }
  //@@viewOff:render
});
