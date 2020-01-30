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
const ClassNames = UU5.Common.ClassNames;

import Header from "./nav-bar-header.js";
import Nav from "./nav-bar-nav.js";
import NavBarNavItem from "./nav-bar-nav-item.js";
import "./nav-bar.less";
//@@viewOff:imports

export const NavBar = UU5.Common.VisualComponent.create({
  displayName: "NavBar", // for backward compatibility (test snapshots)
  //@@viewOn:mixins
  mixins: [
    UU5.Common.BaseMixin,
    UU5.Common.ElementaryMixin,
    UU5.Common.ContentMixin,
    UU5.Common.ColorSchemaMixin,
    UU5.Common.NestingLevelMixin,
    UU5.Common.PureRenderMixin
  ],
  //@@viewOff:mixins

  //@@viewOn:statics
  statics: {
    tagName: ns.name("NavBar"),
    nestingLevelList: UU5.Environment.getNestingLevelList("bigBoxCollection", "box"),
    classNames: {
      main: ns.css("nav-bar"),
      body: ns.css("nav-bar-body"),
      navCover: ns.css("nav-bar-cover"),
      navContainer: ns.css("nav-bar-container"),
      open: ns.css("nav-bar-open"),
      fixed: ns.css("nav-bar-fixed-"),
      size: ns.css("nav-bar-size-")
    },
    defaults: {
      tagNames: {
        header: "UU5.Bricks.NavBar.Header",
        nav: "UU5.Bricks.NavBar.Nav"
      },
      duration: 250
    },
    warnings: {
      cannotOpenIfAlwaysOpen: "Cannot open navBar if alwaysOpen is set to true.",
      cannotCloseIfAlwaysOpen: "Cannot close navBar if alwaysOpen is set to true.",
      cannotToggleIfAlwaysOpen: "Cannot toggle navBar if alwaysOpen is set to true."
    },
    opt: {
      nestingLevelWrapper: true
    }
  },
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {
    fixed: UU5.PropTypes.oneOf(["top", "bottom"]),
    smoothScroll: UU5.PropTypes.number,
    offset: UU5.PropTypes.number,
    open: UU5.PropTypes.bool,
    alwaysOpen: UU5.PropTypes.bool,
    iconOpen: UU5.PropTypes.string,
    iconClosed: UU5.PropTypes.string,
    onOpen: UU5.PropTypes.func,
    onClose: UU5.PropTypes.func,
    size: UU5.PropTypes.oneOf(["s", "m", "l", "xl"]),
    elevation: UU5.PropTypes.oneOf(["-1", "0", "1", "2", "3", "4", "5", -1, 0, 1, 2, 3, 4, 5])
  },
  //@@viewOff:propTypes

  //@@viewOn:getDefaultProps
  getDefaultProps() {
    return {
      fixed: null,
      smoothScroll: 1000,
      offset: null,
      open: false,
      alwaysOpen: false,
      iconOpen: "mdi-menu",
      iconClosed: "mdi-menu",
      onOpen: null,
      onClose: null,
      size: "m",
      elevation: null
    };
  },
  //@@viewOff:getDefaultProps

  //@@viewOn:reactLifeCycle
  getInitialState() {
    return {
      height: this._getHeight(this.props.open),
      offset: this.props.offset,
      expanded: this.props.open
    };
  },

  componentWillReceiveProps(nextProps) {
    if (nextProps.controlled) {
      var newState = {};
      (nextProps.alwaysOpen || nextProps.open) && this.open();
      if (nextProps.offset !== undefined && nextProps.offset !== this.getOffset()) {
        newState.offset = nextProps.offset;
      }
      this.setState(newState);
    }
  },

  componentDidMount() {
    var newState = {};

    if (this.props.fixed === "top" && !this.state.offset) {
      newState.offset = UU5.Common.Tools.getOuterHeight(this);
    }

    if (this.props.alwaysOpen || this.props.open) {
      newState.height = null;
      newState.offset && (newState.offset += newState.height);
    }

    Object.keys(newState).length && this.setState(newState);
  },
  //@@viewOff:reactLifeCycle

  //@@viewOn:interface
  isNavBar() {
    return true;
  },

  isOpen() {
    return this.state.expanded;
  },

  open(setStateCallback) {
    if (!this.props.alwaysOpen) {
      if (!this.state.expanded) {
        var height = this._getHeight(true);
        this.setState({ height: 0, expanded: true }, () => {
          this.setState({ height: height }, () => {
            this._timer && clearTimeout(this._timer);
            this._timer = setTimeout(
              () => this.setAsyncState({ height: null }, setStateCallback),
              this.getDefault().duration
            );
          });
        });
      }
    } else if (typeof setStateCallback === "function") {
      this.showWarning("cannotOpenIfAlwaysOpen");
    }
    return this;
  },

  close(setStateCallback) {
    if (!this.props.alwaysOpen) {
      var height = this._getHeight(true);
      this.setState({ height: height }, () => {
        // TODO: must to be timeout because of animation
        setTimeout(() => this.setAsyncState({ height: 0, expanded: false }, setStateCallback), 0);
      });
    } else if (typeof setStateCallback === "function") {
      this.showWarning("cannotCloseIfAlwaysOpen");
    }
    return this;
  },

  toggle(setStateCallback) {
    if (!this.props.alwaysOpen) {
      // TODO: to setState function
      this.state.expanded ? this.close(setStateCallback) : this.open(setStateCallback);
    } else if (typeof setStateCallback === "function") {
      this.showWarning("cannotToggleIfAlwaysOpen", null);
    }
    return this;
  },

  getOffset() {
    return this.state.offset;
  },
  //@@viewOff:interface

  //@@viewOn:overriding
  expandChildProps_(child) {
    const newChildProps = { ...child.props };
    newChildProps._size = this.props.size;
    return newChildProps;
  },
  //@@viewOff:overriding

  //@@viewOn:private
  _getHeight(expanded) {
    return expanded && this._container ? UU5.Common.Tools.getOuterHeight(this._container, true) : 0;
  },

  _getMainAttrs() {
    const mainAttrs = this.getMainAttrs();
    mainAttrs.className += " " + this.getClassName("size") + this.props.size;

    if (this.props.elevation) {
      mainAttrs.className += " " + ClassNames.elevation + this.props.elevation;
    }

    this.props.fixed && (mainAttrs.className += " " + this.getClassName("fixed") + this.props.fixed);
    this.isOpen() && (mainAttrs.className += " " + this.getClassName().open);

    mainAttrs.style = mainAttrs.style || {};
    const time = this.getDefault().duration / 1000;
    [
      "WebkitTransitionDuration",
      "MozTransitionDuration",
      "MsTransitionDuration",
      "OTransitionDuration",
      "transitionDuration"
    ].forEach(function(style) {
      mainAttrs.style[style] = time + "s";
    });

    return mainAttrs;
  },

  _prepareHeader(headerProps) {
    const headerPropsToPass = {
      id: this.getId() + "-header",
      parent: this
    };

    var newHeaderProps = headerProps ? UU5.Common.Tools.mergeDeep(headerPropsToPass, headerProps) : headerPropsToPass;
    newHeaderProps._icon = this.isOpen() ? this.props.iconOpen : this.props.iconClosed;
    newHeaderProps._hamburger = !this.props.alwaysOpen;
    newHeaderProps._onOpen = typeof this.props.onOpen === "function" ? this.props.onOpen : null;
    newHeaderProps._onClose = typeof this.props.onClose === "function" ? this.props.onClose : null;
    newHeaderProps._size = this.props.size;

    return <Header {...newHeaderProps} />;
  },

  _prepareNavs(navsProps) {
    return navsProps.map(function(props, i) {
      props.key = props.key || "nav-" + i;
      return <Nav {...props} />;
    });
  },

  _prepareChildren() {
    let children = this.getChildren();
    let headerProps = null;

    const newNavProps = { smoothScroll: this.props.smoothScroll, offset: this.getOffset(), parent: this };
    const navsProps = [];

    if (children) {
      if (!Array.isArray(children)) children = [children];
      children.map(child => {
        switch (UU5.Common.Tools.getChildTagName(child)) {
          case this.getDefault().tagNames.header:
            headerProps = child.props;
            break;
          case this.getDefault().tagNames.nav:
            // TODO: max 3?
            var newProps = {};
            // default values is used if child is set as react element so null or undefined will not set!!!
            for (var key in child.props) {
              child.props[key] !== null && child.props[key] !== undefined && (newProps[key] = child.props[key]);
            }
            navsProps.push(UU5.Common.Tools.merge({}, newNavProps, newProps));
            break;
        }
      });
    }

    navsProps.length === 0 && navsProps.push(newNavProps);

    return {
      header: this._prepareHeader(headerProps),
      navs: this._prepareNavs(navsProps)
    };
  },

  _getNavContainerId() {
    return this.getId() + "-navContainer";
  },

  _getNavCoverId() {
    return this.getId() + "-navCover";
  },

  _getNavHeight() {
    return this.state.height;
  },

  _countNavHeight() {
    return UU5.Common.Tools.getOuterHeight(this._container, true);
  },

  _getNavCoverProps() {
    return {
      className: this.getClassName().navCover,
      id: this._getNavCoverId(),
      style: {
        height: this._getNavHeight()
      }
    };
  },

  _getNavContainerProps() {
    return {
      id: this._getNavContainerId(),
      className: this.getClassName().navContainer
    };
  },

  _getNavBodyProps() {
    return {
      className: this.getClassName().body
    };
  },
  //@@viewOff:private

  //@@viewOn:render
  render() {
    const childrenObject = this._prepareChildren();

    return (
      <nav {...this._getMainAttrs()}>
        <div {...this._getNavBodyProps()}>
          {childrenObject.header}
          <div {...this._getNavCoverProps()}>
            <div {...this._getNavContainerProps()} ref={navContainer => (this._container = navContainer)}>
              {childrenObject.navs}
            </div>
          </div>
        </div>
        {this.getDisabledCover()}
      </nav>
    );
  }
  //@@viewOff:render
});

NavBar.Header = Header;
NavBar.Nav = Nav;
NavBar.Nav.Item = NavBarNavItem;

export default NavBar;
