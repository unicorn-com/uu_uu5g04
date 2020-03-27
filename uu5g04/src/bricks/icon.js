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

import "./icon.less";
//@@viewOff:imports

export const Icon = UU5.Common.VisualComponent.create({
  displayName: "Icon", // for backward compatibility (test snapshots)
  //@@viewOn:mixins
  mixins: [UU5.Common.BaseMixin, UU5.Common.PureRenderMixin, UU5.Common.ElementaryMixin, UU5.Common.NestingLevelMixin],
  //@@viewOff:mixins

  //@@viewOn:statics
  statics: {
    tagName: ns.name("Icon"),
    nestingLevel: "inline",
    classNames: {
      main: ns.css("icon"),
      notClickable: ns.css("icon-notclickable"),
      svg: ns.css("icon-svg")
    },
    imageCache: {},
    loadingSvg: '<svg width="1px" height="1px" viewBox="0 0 10 10" />', // transparent 1x1 image
    errorSvg: '<svg width="1px" height="1px" viewBox="0 0 10 10" />' // transparent 1x1 image
  },
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {
    icon: UU5.PropTypes.string,
    clickable: UU5.PropTypes.bool,
    src: UU5.PropTypes.string,
    authenticate: UU5.PropTypes.bool
  },
  //@@viewOff:propTypes

  //@@viewOn:getDefaultProps
  getDefaultProps: function() {
    return {
      icon: "mdi-check",
      clickable: true, //TODO check if it is still needed
      src: "",
      authenticate: false
    };
  },
  //@@viewOff:getDefaultProps

  //@@viewOn:reactLifeCycle
  getInitialState() {
    let { preloading, response } = this._preloadImage(this.props);
    return {
      preloading,
      response
    };
  },

  componentWillReceiveProps(nextProps) {
    let { preloading, response } = this._preloadImage(nextProps);
    this.setState({
      preloading,
      response
    });
  },
  //@@viewOff:reactLifeCycle

  //@@viewOn:interface
  //@@viewOff:interface

  //@@viewOn:overriding
  //@@viewOff:overriding

  //@@viewOn:private
  _preloadImage(props) {
    let result;
    let url = props.src;
    if (url) {
      let session = UU5.Environment.getSession();
      let withCredentials =
        props.authenticate && session && session.isAuthenticated() && UU5.Environment.isTrustedDomain(url);
      let cacheKey, inCache;
      ({ cacheKey, result, inCache } = this._loadImageToCache(url, withCredentials, "document"));

      // use custom icon while SVG is loading, verify that the loaded image is SVG and serialize it
      if (!inCache) {
        result.response = this.constructor.loadingSvg;
        result.promise.then(() => {
          let { error, response } = result;
          if (!error && response && response.documentElement && response.documentElement.nodeName === "svg") {
            result.response = new XMLSerializer().serializeToString(response);
          } else {
            result.response = this.constructor.errorSvg;
          }
        });
      }

      // if the icon is not yet loaded then wait for it and re-render
      this._preloadImageLastRunId = cacheKey;
      if (result.preloading) {
        let runId = this._preloadImageLastRunId;
        result.promise.then(() => {
          // show preloaded icon (if we're still using the same props)
          if (this.isRendered() && runId === this._preloadImageLastRunId) {
            this.setState({ preloading: result.preloading, response: result.response });
          }
        });
      }
    } else {
      result = {
        preloading: false,
        response: null
      };
      delete this._preloadImageLastRunId;
    }
    return result;
  },

  _loadImageToCache(url, withCredentials, responseType) {
    let cacheKey = url;
    if (withCredentials) {
      let identity = UU5.Environment.getSession().getIdentity();
      cacheKey += " " + identity.uuIdentity + " " + identity.loginLevelOfAssurance;
    }
    let result = this.constructor.imageCache[cacheKey];
    let inCache = Boolean(result);
    if (!result) {
      result = this.constructor.imageCache[cacheKey] = {
        preloading: true,
        promise: null,
        response: null,
        error: null
      };
      let session = UU5.Environment.getSession();
      result.promise = this._fetchImage(url, { responseType, withCredentials }, session).then(
        response => {
          result.preloading = false;
          result.response = response;
        },
        error => {
          result.preloading = false;
          result.error = error;
        }
      );
    }

    return { cacheKey, result, inCache };
  },

  async _fetchImage(url, { headers = {}, responseType, withCredentials } = {}, session) {
    if (withCredentials) {
      let token = await UU5.Common.Tools.getCallToken(url, session);
      if (token) headers["Authorization"] = "Bearer " + token;
    }
    return new Promise((resolve, reject) => {
      let xhr = new XMLHttpRequest();
      xhr.open("GET", url, true);
      xhr.responseType = responseType;
      xhr.setRequestHeader("Accept", "image/*,*/*;q=0.8");
      for (var k in headers) if (headers[k] != null) xhr.setRequestHeader(k, headers[k]);
      xhr.onreadystatechange = function(/*e*/) {
        if (xhr.readyState == 4) {
          if (xhr.status >= 200 && xhr.status < 300) {
            resolve(xhr.response);
          } else {
            reject(new Error("Got status " + xhr.status + " when loading image from " + url));
          }
        }
      };
      xhr.send(null);
    });
  },

  _renderSvg() {
    let svgStart = this.state.response.indexOf("<svg"); // there might be doctype / xml preamble
    return <span dangerouslySetInnerHTML={{ __html: this.state.response.substr(svgStart) }} />;
  },
  //@@viewOff:private

  //@@viewOn:render
  render: function() {
    let mainProps = this.getMainAttrs();
    if (this.props.src) {
      mainProps.className += " " + this.getClassName("svg");
    } else if (this.props.icon) {
      let splitter = this.props.icon.split("-");
      if (splitter) {
        let iconsName = splitter[0];
        if (iconsName === "uubmlicon") {
          const stencil = splitter[1];
          UU5.Environment.DocumentManager.addUniqueCss(UU5.Environment.iconLibraries.uubmlicon + stencil);
        } else {
          UU5.Environment.IconManager.addIcons(iconsName);
        }
        mainProps.className += " " + iconsName;
      }
      mainProps.className += " " + this.props.icon;
    }
    mainProps.className += !this.props.clickable ? " " + this.getClassName().notClickable : "";

    return this.getNestingLevel() ? (
      <span {...mainProps}>
        {this.props.src ? this._renderSvg() : null}
        {this.props.children && UU5.Common.Children.toArray(this.props.children)}
        {this.getDisabledCover()}
      </span>
    ) : null;
  }
  //@@viewOff:render
});

export default Icon;
