/**
 * Copyright (C) 2021 Unicorn a.s.
 *
 * This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public
 * License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later
 * version.
 *
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied
 * warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License at
 * <https://gnu.org/licenses/> for more details.
 *
 * You may obtain additional information at <https://unicorn.com> or contact Unicorn a.s. at address: V Kapslovne 2767/2,
 * Praha 3, Czech Republic or at the email: info@unicorn.com.
 */

//@@viewOn:revision
// coded: Martin Mach, 07.09.2020
// reviewed: Petr Bišof, 14.09.2020
//@@viewOff:revision
//@@viewOn:imports

import * as UU5 from "uu5g04";
import ns from "./bricks-ns.js";
import { InlineMode } from "./internal/inline-mode.js";

import "./video.less";
//@@viewOff:imports

const VideoHls = UU5.Common.Component.lazy
  ? UU5.Common.Component.lazy(() => import("./video-hls.js"))
  : (props) => <video {...props.mainAttrs} />;

let Video = UU5.Common.VisualComponent.create({
  displayName: "Video", // for backward compatibility (test snapshots)
  //@@viewOn:mixins
  mixins: [UU5.Common.BaseMixin, UU5.Common.PureRenderMixin, UU5.Common.ElementaryMixin, UU5.Common.NestingLevelMixin],
  //@@viewOff:mixins

  //@@viewOn:statics
  statics: {
    tagName: ns.name("Video"),
    nestingLevelList: UU5.Environment.getNestingLevelList("bigBox", "box"),
    classNames: {
      main: ns.css("video"),
    },
    errors: {
      typeNotFound: "You have to set the type of the video or src has to contain the file extension.",
    },
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
    authenticate: UU5.PropTypes.bool,
    onBeforeChunkLoad: UU5.PropTypes.func,
  },
  //@@viewOff:propTypes

  //@@viewOn:getDefaultProps
  getDefaultProps: function () {
    return {
      autoPlay: false,
      disableControls: false,
      loop: false,
      poster: "",
      preload: "auto",
      src: "",
      muted: false,
      type: null,
      authenticate: false,
      onBeforeChunkLoad: null,
    };
  },
  //@@viewOff:getDefaultProps

  //@@viewOn:reactLifeCycle
  getInitialState: function () {
    return {
      muted: this.props.muted,
      authenticatedVideoUrl: undefined,
      authenticatedPosterUrl: undefined,
    };
  },

  UNSAFE_componentWillReceiveProps: function (nextProps) {
    if (nextProps.controlled) {
      this.setState({ muted: nextProps.muted });
    }
  },
  //@@viewOff:reactLifeCycle

  //@@viewOn:interface
  toggleMuted: function () {
    this.setState((state) => ({ muted: !state.muted }));
    return this;
  },
  //@@viewOff:interface

  //@@viewOn:overriding
  //@@viewOff:overriding

  //@@viewOn:private
  _getType: function (props = this.props) {
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
    if (this._authenticatedVideoUrl === url) result = this.state.authenticatedVideoUrl;
    else if (this._authenticatingVideoUrl !== url) {
      this._authenticatingVideoUrl = url;
      let promise = (this._videoUrlPromise = UU5.Common.Tools.getAuthenticatedUrl(url, session).then(
        (authenticatedVideoUrl) => {
          delete this._authenticatingVideoUrl;
          this._authenticatedVideoUrl = url;
          if (this.isRendered() && promise === this._videoUrlPromise) this.setState({ authenticatedVideoUrl });
        },
        () => {
          delete this._authenticatingVideoUrl;
        }
      ));
    }
    return result;
  },

  _getAuthenticatedPosterUrl(url, session) {
    let result = "";
    if (this._authenticatedPosterUrl === url) result = this.state.authenticatedPosterUrl;
    else if (this._authenticatingPosterUrl !== url) {
      this._authenticatingPosterUrl = url;
      let promise = (this._posterUrlPromise = UU5.Common.Tools.getAuthenticatedUrl(url, session).then(
        (authenticatedPosterUrl) => {
          delete this._authenticatingPosterUrl;
          this._authenticatedPosterUrl = url;
          if (this.isRendered() && promise === this._posterUrlPromise) this.setState({ authenticatedPosterUrl });
        },
        () => {
          delete this._authenticatingPosterUrl;
        }
      ));
    }
    return result;
  },

  _buildMainAttrs(posterUrl) {
    let mainProps = this.getMainAttrs();

    if (this.props.autoPlay) mainProps.autoPlay = true;
    if (this.state.muted) mainProps.muted = true;
    this.props.disableControls ? (mainProps.controls = false) : (mainProps.controls = true);
    if (this.props.loop) mainProps.loop = true;
    if (posterUrl !== "") mainProps.poster = posterUrl;
    if (this.props.preload !== "auto") mainProps.preload = this.props.preload;
    if (this.isDisabled()) {
      mainProps.autoPlay = false;
    }
    mainProps.type = this._getType();
    return mainProps;
  },
  //@@viewOff:private

  //@@viewOn:render
  render() {
    let { src, poster, authenticate } = this.props;
    let videoUrl = src;
    let posterUrl = poster;
    let useHlsComponent = this._isHls() && UU5.Common.Suspense;
    if (authenticate && !useHlsComponent) {
      let session = UU5.Environment.getSession();
      if (session && session.isAuthenticated()) {
        if (UU5.Environment.isTrustedDomain(videoUrl) && !useHlsComponent) {
          videoUrl = this._getAuthenticatedUrl(videoUrl, session);
        }

        if (UU5.Environment.isTrustedDomain(posterUrl)) {
          posterUrl = this._getAuthenticatedPosterUrl(posterUrl, session);
        }
      }
    }

    return this.getNestingLevel() ? (
      <UU5.Bricks.Span {...this.getMainPropsToPass()}>
        {videoUrl ? (
          useHlsComponent ? (
            <UU5.Common.Suspense fallback="">
              <VideoHls
                videoAttrs={{ ...this._buildMainAttrs(posterUrl), src: videoUrl }}
                authenticate={this.props.authenticate}
                onBeforeChunkLoad={this.props.onBeforeChunkLoad}
              />
            </UU5.Common.Suspense>
          ) : (
            <video {...this._buildMainAttrs(posterUrl)}>
              <source src={videoUrl} />
            </video>
          )
        ) : null}
      </UU5.Bricks.Span>
    ) : (
      <InlineMode
        component={this}
        Component={UU5.Bricks.Video}
        modalHeader={Video.displayName}
        linkTitle={this.props.src}
      />
    );
  },
  //@@viewOff:render
});

export { Video };

export default Video;
