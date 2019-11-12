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
import React from "react";
import createReactClass from "create-react-class";
import PropTypes from "prop-types";
import * as UU5 from "uu5g04";
import ns from "./bricks-ns.js";

import "./audio.less";
//@@viewOff:imports

export const Audio = createReactClass({
  //@@viewOn:mixins
  mixins: [UU5.Common.BaseMixin, UU5.Common.PureRenderMixin, UU5.Common.ElementaryMixin, UU5.Common.NestingLevelMixin],
  //@@viewOff:mixins

  //@@viewOn:statics
  statics: {
    tagName: ns.name("Audio"),
    nestingLevelList: UU5.Environment.getNestingLevelList("bigBox", "box"),
    classNames: {
      main: ns.css("audio"),
      player: ns.css("audio-player"),
      wrapper: ns.css("audio-wrapper")
    }
  },
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {
    autoPlay: PropTypes.bool,
    loop: PropTypes.bool,
    preload: PropTypes.oneOf(["auto", "metadata", "none"]),
    src: PropTypes.string.isRequired,
    muted: PropTypes.bool,
    playbackRate: PropTypes.number,
    authenticate: PropTypes.bool
  },
  //@@viewOff:propTypes

  //@@viewOn:getDefaultProps
  getDefaultProps() {
    return {
      autoPlay: false,
      loop: false,
      preload: "auto",
      src: undefined,
      muted: false,
      playbackRate: 1.0,
      authenticate: false
    };
  },
  //@@viewOff:getDefaultProps

  //@@viewOn:reactLifeCycle
  getInitialState() {
    return {
      muted: this.props.muted,
      playbackRate: this.props.playbackRate
    };
  },

  componentDidMount() {
    if (this.state.playbackRate !== 1.0 && this._audio) {
      this._audio.playbackRate = this.state.playbackRate;
    }
  },

  componentWillReceiveProps(nextProps) {
    if (nextProps.controlled) {
      this.setState({ muted: nextProps.muted, playbackRate: nextProps.playbackRate });
    }
  },

  componentDidUpdate(prevProps, prevState) {
    if (this.props.src !== prevProps.src) {
      this._reload();
    }

    if (this.state.playbackRate !== prevState.playbackRate && this._audio) {
      this._audio.playbackRate = this.state.playbackRate;
    }
  },
  //@@viewOff:reactLifeCycle

  //@@viewOn:interface
  toggleMuted() {
    this.setState(state => ({ muted: !state.muted }));
    return this;
  },

  play() {
    this._audio.play();
    return this;
  },

  pause() {
    this._audio.pause();
    return this;
  },

  setPlaySpeed(speed) {
    this.setState({ playbackRate: speed });
    return this;
  },
  //@@viewOff:interface

  //@@viewOn:overriding
  //@@viewOff:overriding

  //@@viewOn:private
  _reload() {
    this._audio.load();
  },

  _getMainAttrs(removeMainClass) {
    let attrs = this.getMainAttrs();
    attrs.className += " " + this.getClassName("player");
    attrs.ref = ref => (this._audio = ref);
    attrs.controls = true;

    if (removeMainClass) attrs.className = attrs.className.replace(this.getClassName("main"), "").trim();
    if (this.props.autoPlay && !this.isDisabled()) attrs.autoPlay = true;
    if (this.state.muted) attrs.muted = true;
    if (this.props.loop) attrs.loop = true;
    if (this.props.preload !== "auto") attrs.preload = this.props.preload;

    return attrs;
  },

  _getWrapperAttrs() {
    let attrs = this.getMainAttrs();

    attrs.className += " " + this.getClassName("wrapper");

    return attrs;
  },
  //@@viewOff:private

  //@@viewOn:render
  render() {
    let result = null;
    let url = this.props.src;

    if (this.props.authenticate) {
      let session = UU5.Environment.getSession();
      if (session && session.isAuthenticated() && UU5.Environment.isTrustedDomain(url)) {
        let token = session.getCallToken().token;
        let parsedUrl = UU5.Common.Url.parse(url);
        url = parsedUrl.set({ parameters: { ...parsedUrl.parameters, access_token: token } }).toString();
      }
    }

    if (this.getNestingLevel()) {
      if (this.isDisabled()) {
        result = (
          <span {...this._getWrapperAttrs()}>
            {this.getDisabledCover()}
            <audio {...this._getMainAttrs(true)}>
              <source src={url} />
            </audio>
          </span>
        );
      } else {
        result = (
          <audio {...this._getMainAttrs()}>
            <source src={url} />
          </audio>
        );
      }
    }

    return result;
  }
  //@@viewOff:render
});

export default Audio;
