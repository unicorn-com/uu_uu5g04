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

//@@viewOn:imports
import Hls from "hls.js";
import UU5 from "uu5g04";
import VideoSettings from "./video-settings";
//@@viewOff:imports

const EMPTY_VIDEO_MP4 =
  "data:video/mp4;base64,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";

export const VideoHls = UU5.Common.VisualComponent.create({
  displayName: "VideoHls", // for backward compatibility (test snapshots)
  //@@viewOn:mixins
  mixins: [UU5.Common.BaseMixin],
  //@@viewOff:mixins

  //@@viewOn:statics
  statics: {
    tagName: "UU5.Bricks.Video.Hls",
    errors: {
      hlsVideoNotSupported: "This browser does not support playing of HLS (HTTP Live Streaming) videos.",
    },
  },
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {
    videoAttrs: UU5.PropTypes.object,
    authenticate: UU5.PropTypes.bool,
    onBeforeChunkLoad: UU5.PropTypes.func,
  },
  //@@viewOff:propTypes

  //@@viewOn:getDefaultProps
  getDefaultProps() {
    return {
      videoAttrs: {},
      authenticate: false,
      onBeforeChunkLoad: null,
    };
  },
  //@@viewOff:getDefaultProps

  //@@viewOn:reactLifeCycle
  getInitialState() {
    this._hls = null;
    this._video = null;
    this._preloaded = false;
    return { quality: null };
  },

  componentDidMount() {
    if (this._usesHlsLib()) {
      let { videoAttrs } = this.props;
      this._waitForToken(videoAttrs.src, () => {
        if (!this.isRendered()) return;

        let hlsConfig = {
          // debug: true, // FIXME Comment out.
          autoStartLoad: videoAttrs.autoPlay || videoAttrs.preload !== "none",
          xhrSetup: this._hlsXhrSetup,
          // 1. Try to load upto 1MB of the video (maxBufferSize)
          // 2. If it is less than 30s of video, then continue to load more fragments until 30s is reached (maxBufferLength).
          // 3. If trying to achieve step 1 and we already loaded >= 60s of video (maxMaxBufferLength) then stop loading fragments.
          maxBufferSize: 1 << 6,
          maxBufferLength: 30,
          maxMaxBufferLength: 60,
        };
        let hls = (this._hls = new Hls(hlsConfig));
        this._hls.on(Hls.Events.LEVEL_SWITCHING, (type, level) => {
          this.setState({ quality: level?.height ? level.height + "p" : undefined });
        });
        if (videoAttrs.src && (videoAttrs.autoPlay || videoAttrs.preload !== "none")) {
          this._doPreload();
        }
        if (!hlsConfig.autoStartLoad || videoAttrs.preload === "metadata") {
          UU5.Environment.EventListener.addEvent(this._video, "play", this.getId(), () => {
            let fn = () => hls.startLoad();
            let usedFn = !this._preloaded && this.props.videoAttrs.src ? () => this._doPreload(true, fn) : fn;
            usedFn();
          });
        }
      });
    } else if (!this._canPlayNativeHls()) {
      this.showError("hlsVideoNotSupported");
    }
  },

  componentDidUpdate(prevProps, prevState) {
    if (this.props.videoAttrs.src !== prevProps.videoAttrs.src) {
      if (this._preloaded) {
        this._waitForToken(this.props.videoAttrs.src, () => {
          this._hls.loadSource(this.props.videoAttrs.src);
        });
      }
    }
  },

  componentWillUnmount() {
    this._unmounted = true;
    UU5.Environment.EventListener.removeEvent(this._video, "play", this.getId());
    if (this._hls) this._hls.destroy();
  },
  //@@viewOff:reactLifeCycle

  //@@viewOn:interface
  //@@viewOff:interface

  //@@viewOn:overriding
  //@@viewOff:overriding

  //@@viewOn:private
  _doPreload(startPlay = null, callback = null) {
    let { videoAttrs } = this.props;
    if (!this._preloaded) {
      this._preloaded = true;
      this._hls.attachMedia(this._video);
    }
    this._hls.loadSource(videoAttrs.src);
    this._hls.once(Hls.Events.MANIFEST_PARSED, () => {
      if (this._unmounted) return;
      if (typeof startPlay !== "boolean") startPlay = this.props.videoAttrs.autoPlay;
      if (startPlay) this._video.play();
      else if (videoAttrs.preload === "metadata") {
        // if preloading only metadata, stop downloading after first fragment
        this._hls.once(Hls.Events.FRAG_PARSED, () => this._hls.stopLoad());
      }
      this.setState({ qualityList: (this._hls.levels || []).map((it) => it.height + "p") });
      if (typeof callback === "function") callback();
    });
  },

  _hlsXhrSetup(xhr, url) {
    if (typeof this.props.onBeforeChunkLoad === "function") {
      let opts = { url };
      this.props.onBeforeChunkLoad(opts);
      if (opts.url !== url) {
        xhr.open("GET", opts.url, true);
      }
    }
    if (this.props.authenticate) {
      let session = UU5.Environment.getSession();
      if (session && session.isAuthenticated() && UU5.Environment.isTrustedDomain(url)) {
        if (this._authenticationHeaders) {
          for (let k in this._authenticationHeaders) {
            xhr.setRequestHeader(k, this._authenticationHeaders[k]);
          }
        }
      }
    }
  },

  _usesHlsLib() {
    return Hls.isSupported();
  },

  _canPlayNativeHls() {
    if (this.constructor._canPlayNativeHls === undefined) {
      this.constructor._canPlayNativeHls = document.createElement("video").canPlayType("application/vnd.apple.mpegurl");
    }
    return this.constructor._canPlayNativeHls;
  },

  _setVideoRef(ref) {
    this._video = ref;
  },

  _getAuthenticatedUrl(url, session) {
    let result = "";
    if (this._authenticatedUrl === url) result = this.state.authenticatedUrl;
    else if (this._authenticatingUrl !== url) {
      this._authenticatingUrl = url;
      let promise = (this._urlPromise = this._computeAuthenticationData(url, session).then(
        ({ authenticatedUrl, headers }) => {
          if (this.isRendered() && promise === this._urlPromise) {
            delete this._authenticatingUrl;
            this._authenticatedUrl = url;
            this._authenticationHeaders = headers;
            this.setState({ authenticatedUrl });
          }
        },
        () => {
          delete this._authenticatingUrl;
        }
      ));
    }
    return result;
  },

  async _computeAuthenticationData(url, session) {
    let accessToken = await UU5.Common.Tools.getCallToken(url, session);
    let csrfToken = UU5.Common.Tools.getCsrfToken();
    let authenticatedUrl = await UU5.Common.Tools.getAuthenticatedUrl(url, session, accessToken, csrfToken);
    let headers = await UU5.Common.Tools.getAuthenticatedHeaders(url, session, accessToken, csrfToken);
    return { authenticatedUrl, headers };
  },

  async _waitForToken(url, callback) {
    if (this._authenticatedUrl === url) {
      // token is already prepared
      callback();
    } else if (this._authenticatingUrl === url) {
      // token is being prepared
      this._urlPromise.then(() => {
        if (this.isRendered()) callback();
      });
    } else {
      // there's no token used as it's not needed
      callback();
    }
  },

  _onQualityChange({ value }) {
    let index = this.state.qualityList.indexOf(value);
    if (index >= 0) {
      this._hls.currentLevel = index;
    }
  },
  //@@viewOff:private

  //@@viewOn:render
  render() {
    let { videoAttrs = {} } = this.props;
    let { quality, qualityList } = this.state;

    let authnUrl;
    if (this.props.authenticate) {
      let session = UU5.Environment.getSession();
      if (session && session.isAuthenticated() && UU5.Environment.isTrustedDomain(videoAttrs.src)) {
        // NOTE We're getting authenticated URL even if using Hls (because we'll need token).
        authnUrl = this._getAuthenticatedUrl(videoAttrs.src, session);
      }
    }
    if (this._usesHlsLib()) {
      // don't propagate some props when using hls.js library (they're handled in JS instead of via DOM attrs)
      let { autoPlay, src, ...rest2 } = videoAttrs; // eslint-disable-line no-unused-vars
      videoAttrs = rest2;
      // NOTE If using preload="none", <video> must still have "src" otherwise it's not possible to click Play.
      if (!this._preloaded && videoAttrs.preload === "none") videoAttrs.src = EMPTY_VIDEO_MP4;
    } else if (authnUrl) {
      videoAttrs.src = authnUrl;
    }
    return (
      <VideoSettings
        {...this.getMainPropsToPass()}
        quality={quality}
        qualityList={qualityList}
        onQualityChange={this._onQualityChange}
      >
        <video {...videoAttrs} ref={this._setVideoRef} />
      </VideoSettings>
    );
  },
  //@@viewOff:render
});

export default VideoHls;
