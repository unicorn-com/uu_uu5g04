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

import "./link.less";
//@@viewOff:imports

export const Link = UU5.Common.VisualComponent.create({
  displayName: "Link", // for backward compatibility (test snapshots)
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
    tagName: ns.name("Link"),
    nestingLevelList: UU5.Environment.getNestingLevelList("bigBoxCollection", "inline"),
    classNames: {
      main: ns.css("link")
    },
    defaults: {
      content: "noText",
      regexpHash: /^#/,
      httpRegexp: /^(\/|[a-z0-9\-+.]+:)/
    }
  },
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {
    href: UU5.PropTypes.string,
    onClick: UU5.PropTypes.func,
    onCtrlClick: UU5.PropTypes.func,
    onWheelClick: UU5.PropTypes.func,
    smoothScroll: UU5.PropTypes.number,
    offset: UU5.PropTypes.number,
    target: UU5.PropTypes.oneOf(["_blank", "_parent", "_top", "_self"]),
    download: UU5.PropTypes.oneOfType([UU5.PropTypes.bool, UU5.PropTypes.string]),
    authenticate: UU5.PropTypes.bool
  },
  //@@viewOff:propTypes

  //@@viewOn:getDefaultProps
  getDefaultProps() {
    return {
      href: null,
      onClick: null,
      onCtrlClick: null,
      onWheelClick: null,
      smoothScroll: 1000,
      offset: 0,
      target: "_self",
      download: false,
      authenticate: undefined
    };
  },
  //@@viewOff:getDefaultProps

  //@@viewOn:reactLifeCycle
  getInitialState() {
    return {
      authenticatedUrl: undefined
    };
  },
  //@@viewOff:reactLifeCycle

  //@@viewOn:interface
  focus() {
    this._link && this._link.focus();
  },
  //@@viewOff:interface

  //@@viewOn:overriding
  //@@viewOff:overriding

  //@@viewOn:private
  _isFragmentLink() {
    return this.props.href && this.props.href.length > 1 && this.props.href.lastIndexOf("#", 0) === 0;
  },

  _onClickFragment(e) {
    e.preventDefault();
    //let basePath = location.href.replace(/#.*/, "");

    let id = this.props.href.replace("#", "");
    let foundElement = document.getElementById(id);

    if (!foundElement) {
      id = id.replace("-inner", "");
      foundElement = document.getElementById(id);
    }

    //let path = basePath + "#" + id;
    //history.pushState(null, document.title, path);
    UU5.Common.Tools.scrollToTarget(id, this.props.smoothScroll, this.props.offset);
    this._onClick(e);
    return this;
  },

  _shouldOnWheelClick() {
    return typeof this.props.onWheelClick === "function" || this._isRoute();
  },

  _shouldOnClick() {
    return (
      typeof this.props.onClick === "function" ||
      typeof this.props.onCtrlClick === "function" ||
      this._isFragmentLink() ||
      this._isRoute()
    );
  },

  _onWheelClick(e) {
    typeof this.props.onWheelClick === "function" && this.props.onWheelClick(this, e);
    return this;
  },

  _onCtrlClick(e) {
    typeof this.props.onCtrlClick === "function" && this.props.onCtrlClick(this, e);
    return this;
  },

  _openRouteNewTab() {
    window.open(this._getRouteUrl(), "_blank");
  },

  _onClick(e) {
    if (this._isRoute() && UU5.Environment.getRouter()) {
      let [base, ...fragmentParts] = this.props.href.split("#");
      let [path, ...queryParts] = base.split("?");
      let fragment = fragmentParts.join("#");
      let query = queryParts.join("?");
      let params = query ? UU5.Common.Url.decodeQuery("?" + query) : null;

      e.preventDefault();
      if (this.props.target === "_blank") {
        this._openRouteNewTab();
      } else {
        let useCase = path || UU5.Common.Url.parse(location.href).useCase || "";
        UU5.Environment.setRoute(useCase, params, fragment);
      }
    }
    typeof this.props.onClick === "function" && this.props.onClick(this, e);
    return this;
  },

  _containsHash(url) {
    return this.getDefault("regexpHash").test(url);
  },

  _isRoute() {
    return (
      this.props.href && !this.getDefault("httpRegexp").test(this.props.href) && !this._containsHash(this.props.href)
    );
  },

  _getRouteUrl() {
    let { href } = this.props;
    let basePath = UU5.Environment.getAppBasePath();
    let usedHref = href.charAt(0) === "?" ? (UU5.Common.Url.parse(location.href).useCase || "") + href : href;
    return basePath ? basePath.replace(/\/*$/, "/") + usedHref.replace(/^\/+/, "") : usedHref;
  },

  _getHref() {
    let href;

    if (this._containsHash(this.props.href)) {
      href = location.href.split("#")[0] + this.props.href;
    } else if (this._isRoute()) {
      href = this._getRouteUrl();
    } else {
      href = this.props.href;
    }

    if (this.props.authenticate) {
      let session = UU5.Environment.getSession();
      if (session && session.isAuthenticated() && UU5.Environment.isTrustedDomain(href)) {
        href = this._getAuthenticatedUrl(href, session);
      }
    }

    return href;
  },

  _getAuthenticatedUrl(url, session) {
    let result = "";
    if (this._authenticatedUrl === url) result = this.state.authenticatedUrl;
    else if (this._authenticatingUrl !== url) {
      this._authenticatingUrl = url;
      let promise = (this._urlPromise = this._computeAuthenticatedUrl(url, session).then(
        authenticatedUrl => {
          delete this._authenticatingUrl;
          this._authenticatedUrl = url;
          if (this.isRendered() && promise === this._urlPromise) this.setState({ authenticatedUrl });
        },
        () => {
          delete this._authenticatingUrl;
        }
      ));
    }
    return result;
  },

  async _computeAuthenticatedUrl(url, session) {
    let token = await UU5.Common.Tools.getCallToken(url, session);
    let parsedUrl = UU5.Common.Url.parse(url);
    let result = parsedUrl.set({ parameters: { ...parsedUrl.parameters, access_token: token } }).toString();
    return result;
  },
  //@@viewOff:private

  //@@viewOn:render
  render() {
    let mainAttrs = this.getMainAttrs();

    if (!this.isDisabled()) {
      mainAttrs.href = this._getHref();

      if (this._shouldOnClick() || this._shouldOnWheelClick()) {
        mainAttrs.onClick = e => {
          if (e.ctrlKey || (UU5.Common.Tools.isMac() && e.metaKey)) {
            this._onCtrlClick(e);
          } else {
            if (this._isFragmentLink()) {
              this._onClickFragment(e);
            } else if (e.button !== 1) {
              this._onClick(e);
            }
          }
        };

        if (this._shouldOnWheelClick()) {
          let onMouseDown = mainAttrs.onMouseDown;
          mainAttrs.onMouseDown = e => {
            e.button === 1 && e.preventDefault();
            typeof onMouseDown === "function" && onMouseDown(e, this);
          };

          let onMouseUp = mainAttrs.onMouseUp;
          mainAttrs.onMouseUp = e => {
            if (e.button === 1) {
              e.preventDefault();
              this._onWheelClick(e);

              // stop pending "click" event because e.preventDefault() doesn't stop it in FF
              let clickHandler = e => {
                e.stopPropagation();
                document.removeEventListener("click", clickHandler, true);
              };
              document.addEventListener("click", clickHandler, true);
              setTimeout(() => document.removeEventListener("click", clickHandler, true), 0);
            }
            typeof onMouseUp === "function" && onMouseUp(e, this);
          };
        }
      }
      mainAttrs.target = this.props.target;
      mainAttrs.download = this.props.download;
    }

    let children = this.getChildren();
    children = children == null ? this.props.href || this.getDefault().content : children;

    return this.getNestingLevel() ? (
      <a {...mainAttrs} ref={link => (this._link = link)}>
        {children}
      </a>
    ) : null;
  }
  //@@viewOff:render
});

export const A = Link;

export default Link;
