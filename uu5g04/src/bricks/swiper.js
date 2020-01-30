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

import SwiperBody from "./swiper-body.js";
import SwiperMenu from "./swiper-menu.js";

import "./swiper.less";
//@@viewOff:imports

export const Swiper = UU5.Common.VisualComponent.create({
  displayName: "Swiper", // for backward compatibility (test snapshots)
  //@@viewOn:mixins
  mixins: [
    UU5.Common.BaseMixin,
    UU5.Common.PureRenderMixin,
    UU5.Common.ElementaryMixin,
    UU5.Common.ContentMixin,
    UU5.Common.SwipeMixin,
    UU5.Common.NestingLevelMixin
  ],
  //@@viewOff:mixins

  //@@viewOn:statics
  statics: {
    tagName: ns.name("Swiper"),
    nestingLevelList: UU5.Environment.getNestingLevelList("bigBoxCollection", "box"),
    classNames: {
      main: ns.css("swiper")
    },
    errors: {
      childTagNotAllowed:
        'Child tag %s is by default not allowed here. Use <%s allowBodyTags={["%s"]} ...> or allowMenuTags={["%s"]} if you really want to allow it, or wrap it into %s or %s.',
      childNotAllowed: 'Child "%s" is by default not allowed here. Wrap it into %s or %s.'
    },
    defaults: {
      bodyTagName: "UU5.Bricks.Swiper.Body",
      menuTagName: "UU5.Bricks.Swiper.Menu"
    }
  },
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {
    leftMenuOpen: UU5.PropTypes.bool,
    rightMenuOpen: UU5.PropTypes.bool,
    onSwipeOpenLeftMenu: UU5.PropTypes.func,
    onSwipeCloseLeftMenu: UU5.PropTypes.func,
    onSwipeOpenRightMenu: UU5.PropTypes.func,
    onSwipeCloseRightMenu: UU5.PropTypes.func,
    allowBodyTags: UU5.PropTypes.array,
    allowMenuTags: UU5.PropTypes.array
  },
  //@@viewOff:propTypes

  //@@viewOn:getDefaultProps
  getDefaultProps: function() {
    return {
      leftMenuOpen: false,
      rightMenuOpen: false,
      onSwipeOpenLeftMenu: null,
      onSwipeCloseLeftMenu: null,
      onSwipeOpenRightMenu: null,
      onSwipeCloseRightMenu: null,
      allowBodyTags: [],
      allowMenuTags: []
    };
  },
  //@@viewOff:getDefaultProps

  //@@viewOn:reactLifeCycle
  getInitialState: function() {
    return {
      leftMenuOpen: this.props.leftMenuOpen,
      rightMenuOpen: this.props.rightMenuOpen
    };
  },

  componentWillReceiveProps(nextProps) {
    if (nextProps.controlled) {
      this.setState({
        leftMenuOpen: nextProps.leftMenuOpen,
        rightMenuOpen: nextProps.rightMenuOpen
      });
    }
    return this;
  },
  //@@viewOff:reactLifeCycle

  //@@viewOn:interface
  isSwiper() {
    return true;
  },

  openLeftMenu: function(setStateCallback) {
    this.setState(
      {
        leftMenuOpen: true,
        rightMenuOpen: false
      },
      setStateCallback
    );
    return this;
  },

  closeLeftMenu: function(setStateCallback) {
    this.setState(
      {
        leftMenuOpen: false
      },
      setStateCallback
    );
    return this;
  },

  toggleLeftMenu: function(setStateCallback) {
    this.setState(function(state) {
      var newState = { leftMenuOpen: !state.leftMenuOpen };
      !state.leftMenuOpen && (newState.rightMenuOpen = false);
      return newState;
    }, setStateCallback);
    return this;
  },

  openRightMenu: function(setStateCallback) {
    this.setState(
      {
        leftMenuOpen: false,
        rightMenuOpen: true
      },
      setStateCallback
    );
    return this;
  },

  closeRightMenu: function(setStateCallback) {
    this.setState(
      {
        rightMenuOpen: false
      },
      setStateCallback
    );
    return this;
  },

  toggleRightMenu: function(setStateCallback) {
    this.setState(function(state) {
      var newState = { rightMenuOpen: !state.rightMenuOpen };
      !state.rightMenuOpen && (newState.leftMenuOpen = false);
      return newState;
    }, setStateCallback);
    return this;
  },

  isLeftMenuOpen: function() {
    return this.state.leftMenuOpen;
  },

  isRightMenuOpen: function() {
    return this.state.rightMenuOpen;
  },

  onSwipeCloseRightMenuDefault(component) {
    this.closeRightMenu();

    return this;
  },

  onSwipeOpenLeftMenuDefault(component) {
    this.openLeftMenu();

    return this;
  },

  onSwipeCloseLeftMenuDefault(component) {
    this.closeLeftMenu();

    return this;
  },

  onSwipeOpenRightMenuDefault(component) {
    this.openRightMenu();

    return this;
  },
  //@@viewOff:interface

  //@@viewOn:overriding
  shouldChildRender_: function(child) {
    let childTagName = UU5.Common.Tools.getChildTagName(child);
    let result =
      this._getAllowMenuTags().indexOf(childTagName) > -1 || this._getAllowBodyTags().indexOf(childTagName) > -1;
    if (!result && (typeof child !== "string" || child.trim())) {
      if (childTagName)
        this.showError("childTagNotAllowed", [
          childTagName,
          this.getTagName(),
          childTagName,
          childTagName,
          this.getDefault().bodyTagName,
          this.getDefault().menuTagName
        ]);
      else this.showError("childNotAllowed", [child, this.getDefault().bodyTagName, this.getDefault().menuTagName]);
    }
    return result;
  },

  expandChildProps_: function(child) {
    var newChildProps = { ...child.props };
    if (this._getAllowMenuTags().indexOf(UU5.Common.Tools.getChildTagName(child)) > -1) {
      if (child.props.pullRight) {
        newChildProps._open = this.isRightMenuOpen();
      } else {
        newChildProps._open = this.isLeftMenuOpen();
      }
    }
    return newChildProps || child.props;
  },
  //@@viewOff:overriding

  //@@viewOn:private
  _getAllowBodyTags() {
    return this.props.allowBodyTags.concat(this.getDefault().bodyTagName);
  },

  _getAllowMenuTags() {
    return this.props.allowMenuTags.concat(this.getDefault().menuTagName);
  },

  _onSwipeEnd: function() {
    if (this.isSwipedRight()) {
      if (this.isRightMenuOpen()) {
        if (typeof this.props.onSwipeCloseRightMenu === "function") {
          this.props.onSwipeCloseRightMenu(this);
        } else {
          this.onSwipeCloseRightMenuDefault(this);
        }
      } else {
        if (typeof this.props.onSwipeOpenLeftMenu === "function") {
          this.props.onSwipeOpenLeftMenu(this);
        } else {
          this.onSwipeOpenLeftMenuDefault(this);
        }
      }
    } else if (this.isSwipedLeft()) {
      if (this.isLeftMenuOpen()) {
        if (typeof this.props.onSwipeCloseLeftMenu === "function") {
          this.props.onSwipeCloseLeftMenu(this);
        } else {
          this.onSwipeCloseLeftMenuDefault(this);
        }
      } else {
        if (typeof this.props.onSwipeOpenRightMenu === "function") {
          this.props.onSwipeOpenRightMenu(this);
        } else {
          this.onSwipeOpenRightMenuDefault(this);
        }
      }
    }
    return this;
  },
  //@@viewOff:private

  // Render
  _buildChildren: function() {
    var menuLeft;
    var menuRight;
    var body;

    var children = this.getChildren();
    if (children) {
      if (!Array.isArray(children)) children = [children];
      children.forEach(
        function(child) {
          if (this._getAllowBodyTags().indexOf(UU5.Common.Tools.getChildTagName(child)) > -1) {
            body = child;
          } else if (this._getAllowMenuTags().indexOf(UU5.Common.Tools.getChildTagName(child)) > -1) {
            if (child.props.pullRight) {
              menuRight = menuRight || child;
            } else {
              menuLeft = menuLeft || child;
            }
          }
        }.bind(this)
      );
    }

    var newChildren = [];
    menuLeft && newChildren.push(menuLeft);
    menuRight && newChildren.push(menuRight);
    body && newChildren.push(body);
    return newChildren;
  },

  //@@viewOn:render
  render: function() {
    return this.getNestingLevel() ? (
      <div
        {...this.getMainAttrs()}
        onTouchStart={this.swipeOnTouchStart}
        onTouchMove={this.swipeOnTouchMove}
        onTouchEnd={this.swipeOnTouchEnd.bind(this, this._onSwipeEnd)}
      >
        {this._buildChildren()}
        {this.getDisabledCover()}
      </div>
    ) : null;
  }
  //@@viewOff:render
});

Swiper.Menu = SwiperMenu;
Swiper.Body = SwiperBody;

export default Swiper;
