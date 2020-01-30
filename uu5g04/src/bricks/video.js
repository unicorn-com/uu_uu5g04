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

import "./video.less";
//@@viewOff:imports

const VideoHls = UU5.Common.Component.lazy ? UU5.Common.Component.lazy(() => import("./video-hls.js")) : props => <video {...props.mainAttrs} />;

export const Video = UU5.Common.VisualComponent.create({
  displayName: "Video", // for backward compatibility (test snapshots)
  //@@viewOn:mixins
  mixins: [UU5.Common.BaseMixin, UU5.Common.PureRenderMixin, UU5.Common.ElementaryMixin, UU5.Common.NestingLevelMixin],
  //@@viewOff:mixins

  //@@viewOn:statics
  statics: {
    tagName: ns.name("Video"),
    nestingLevelList: UU5.Environment.getNestingLevelList("bigBox", "box"),
    classNames: {
      main: ns.css("video")
    },
    errors: {
      typeNotFound: "You have to set the type of the video or src has to contain the file extension."
    }
  },
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {
    autoPlay: UU5.PropTypes.bool,
    disableControls: UU5.PropTypes.bool,
    loop: UU5.PropTypes.bool,
    poster: UU5.PropTypes.string,
    preload: UU5.PropTypes.oneOf(["auto", "metadata", "none"]),
    src: UU5.PropTypes.string.isRequired,
    muted: UU5.PropTypes.bool,
    type: UU5.PropTypes.oneOf(["mp4", "webm", "ogg", "m3u8"]),
    authenticate: UU5.PropTypes.bool
  },
  //@@viewOff:propTypes

  //@@viewOn:getDefaultProps
  getDefaultProps: function() {
    return {
      autoPlay: false,
      disableControls: false,
      loop: false,
      poster: "",
      preload: "auto",
      src: "",
      muted: false,
      type: null,
      authenticate: false
    };
  },
  //@@viewOff:getDefaultProps

  //@@viewOn:reactLifeCycle
  getInitialState: function() {
    return {
      muted: this.props.muted,
      authenticatedUrl: undefined
    };
  },

  componentWillReceiveProps: function(nextProps) {
    if (nextProps.controlled) {
      this.setState({ muted: nextProps.muted });
    }
  },
  //@@viewOff:reactLifeCycle

  //@@viewOn:interface
  toggleMuted: function() {
    this.setState(state => ({ muted: !state.muted }));
    return this;
  },
  //@@viewOff:interface

  //@@viewOn:overriding
  //@@viewOff:overriding

  //@@viewOn:private
  _getType: function(props = this.props) {
    let type;
    if (props.type) {
      type = props.type;
    } else {
      let match = /\.([a-zA-Z0-9]+)(?:[?#]|$)/.exec(props.src);
      if (match) {
        type = match[1];
      } else {
        this.showError("typeNotFound");
      }
    }
    return type;
  },

  _isHls(type = this._getType()) {
    let result = type === "m3u8";
    if (result && !UU5.Common.Suspense && !this.constructor._warnedHlsOldReact) {
      this.constructor._warnedHlsOldReact = true;
      UU5.Common.Tools.error("Using HTTP Live Streaming videos is supported only with React >= 16.6.0.");
    }
    return result;
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

  // Render
  _buildMainAttrs: function() {
    let mainProps = this.getMainAttrs();

    if (this.props.autoPlay) mainProps.autoPlay = true;
    if (this.state.muted) mainProps.muted = true;
    this.props.disableControls ? (mainProps.controls = false) : (mainProps.controls = true);
    if (this.props.loop) mainProps.loop = true;
    if (this.props.poster !== "") mainProps.poster = this.props.poster;
    if (this.props.preload !== "auto") mainProps.preload = this.props.preload;
    if (this.isDisabled()) {
      mainProps.autoPlay = false;
    }
    mainProps.type = this._getType();
    return mainProps;
  },

  //@@viewOn:render
  render: function() {
    let { src, authenticate } = this.props;
    let url = src;
    let useHlsComponent = this._isHls() && UU5.Common.Suspense;
    if (authenticate && !useHlsComponent) {
      let session = UU5.Environment.getSession();
      if (session && session.isAuthenticated() && UU5.Environment.isTrustedDomain(url)) {
        url = this._getAuthenticatedUrl(url, session);
      }
    }

    return this.getNestingLevel() ? (
      <UU5.Bricks.Span {...this.getMainPropsToPass()}>
        {url ? (
          useHlsComponent ? (
            <UU5.Common.Suspense fallback="">
              <VideoHls mainAttrs={{ ...this._buildMainAttrs(), src: url }} authenticate={this.props.authenticate} />
            </UU5.Common.Suspense>
          ) : (
            <video {...this._buildMainAttrs()}>
              <source src={url} />
            </video>
          )
        ) : null}
      </UU5.Bricks.Span>
    ) : null;
  }
  //@@viewOff:render
});

export default Video;
