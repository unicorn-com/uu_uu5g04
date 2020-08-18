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
import Css from "./internal/css.js";
//@@viewOff:imports

export const AudioButton = UU5.Common.VisualComponent.create({
  displayName: "AudioButton", // for backward compatibility (test snapshots)
  //@@viewOn:mixins
  mixins: [UU5.Common.BaseMixin, UU5.Common.PureRenderMixin, UU5.Common.ElementaryMixin, UU5.Common.NestingLevelMixin],
  //@@viewOff:mixins

  //@@viewOn:statics
  statics: {
    tagName: ns.name("AudioButton"),
    nestingLevelList: UU5.Environment.getNestingLevelList("smallBoxCollection"),
    classNames: {
      main: ns.css("audio-button"),
      audio: Css.css`display: none;`
    }
  },
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {
    // button props
    playIcon: UU5.PropTypes.string,
    pauseIcon: UU5.PropTypes.string,
    size: UU5.PropTypes.oneOf(["s", "m", "l", "xl"]),
    displayBlock: UU5.PropTypes.bool,
    pressed: UU5.PropTypes.bool,
    bgStyle: UU5.PropTypes.oneOf(["filled", "outline", "transparent", "underline"]),
    borderRadius: UU5.PropTypes.oneOfType([UU5.PropTypes.string, UU5.PropTypes.number]),
    elevation: UU5.PropTypes.oneOf(["-1", "0", "1", "2", "3", "4", "5", -1, 0, 1, 2, 3, 4, 5]),
    elevationHover: UU5.PropTypes.oneOf(["-1", "0", "1", "2", "3", "4", "5", -1, 0, 1, 2, 3, 4, 5]),
    baseline: UU5.PropTypes.bool,
    // audio props
    src: UU5.PropTypes.string.isRequired,
    autoPlay: UU5.PropTypes.bool,
    loop: UU5.PropTypes.bool,
    preload: UU5.PropTypes.oneOf(["auto", "metadata", "none"]),
    muted: UU5.PropTypes.bool,
    playbackRate: UU5.PropTypes.number,
    authenticate: UU5.PropTypes.bool
  },
  //@@viewOff:propTypes

  //@@viewOn:getDefaultProps
  getDefaultProps() {
    return {
      // button props
      playIcon: "mdi-play",
      pauseIcon: "mdi-pause",
      size: "m",
      displayBlock: false,
      pressed: false,
      bgStyle: "filled",
      borderRadius: "50%",
      elevation: null,
      elevationHover: null,
      baseline: false,
      // audio props
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
      playing: false
    };
  },
  //@@viewOff:reactLifeCycle

  //@@viewOn:interface
  toggleMuted() {
    this._audioRef.toggleMuted();
    return this;
  },

  play() {
    this._audioRef.play();
    return this;
  },

  pause() {
    this._audioRef.pause();
    return this;
  },

  setPlaySpeed(speed) {
    this._audioRef.setPlaySpeed(speed);
    return this;
  },
  //@@viewOff:interface

  //@@viewOn:overriding
  //@@viewOff:overriding

  //@@viewOn:private
  _registerAudio(ref) {
    this._audioRef = ref;
  },

  _onPlay() {
    this.setState({ playing: true });
  },

  _onPause() {
    this.setState({ playing: false });
  },

  _onEnded() {
    this.setState({ playing: false });
  },

  _onClick(_, e) {
    e.stopPropagation();
    if (this.state.playing) {
      this._audioRef.pause();
    } else {
      this._audioRef.play();
    }
  },

  _getIcon() {
    return this.state.playing ? this.props.pauseIcon : this.props.playIcon;
  },
  //@@viewOff:private

  //@@viewOn:render
  render() {
    let { ref_, ...mainProps } = this.getMainPropsToPass();

    return (
      <>
        <UU5.Bricks.Button
          {...mainProps}
          size={this.props.size}
          displayBlock={this.props.displayBlock}
          pressed={this.props.pressed}
          bgStyle={this.props.bgStyle}
          borderRadius={UU5.Common.Tools.fillUnit(this.props.borderRadius)}
          elevation={this.props.elevation}
          elevationHover={this.props.elevationHover}
          baseline={this.props.baseline}
          onClick={this._onClick}
        >
          <UU5.Bricks.Icon icon={this._getIcon()} />
        </UU5.Bricks.Button>
        <UU5.Bricks.Audio
          autoPlay={this.props.autoPlay}
          loop={this.props.loop}
          preload={this.props.preload}
          muted={this.props.muted}
          playbackRate={this.props.playbackRate}
          authenticate={this.props.authenticate}
          src={this.props.src}
          ref_={this._registerAudio}
          className={this.getClassName("audio")}
          onPlay={this._onPlay}
          onPause={this._onPause}
          onEnded={this._onEnded}
        />
      </>
    );
  }
  //@@viewOff:render
});

export default AudioButton;
