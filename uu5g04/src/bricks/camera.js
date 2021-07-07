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
import * as UU5 from "uu5g04";
import ns from "./bricks-ns.js";
import withLinkModal from "./internal/with-link-modal";
import "./camera.less";
//@@viewOff:imports

// TODO
// quality of picture -> jpg, png, ...
// choice of camera devices if pc has more cameras
let Camera = UU5.Common.VisualComponent.create({
  displayName: "Camera", // for backward compatibility (test snapshots)
  //@@viewOn:mixins
  mixins: [UU5.Common.BaseMixin, UU5.Common.ElementaryMixin, UU5.Common.NestingLevelMixin, UU5.Common.PureRenderMixin],
  //@@viewOff:mixins

  //@@viewOn:statics
  statics: {
    tagName: ns.name("Camera"),
    nestingLevelList: UU5.Environment.getNestingLevelList("bigBox", "box"),
    classNames: {
      main: ns.css("camera"),
      video: ns.css("camera-video"),
      canvas: ns.css("camera-canvas"),
    },
    errors: {
      videoError: "Video can not be loaded.",
      detectionNotSupported: "Permission change listening for camera access isn't supported in this browser",
    },
  },
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {
    mode: UU5.PropTypes.oneOf(["environment", "user", "left", "right"]),
  },
  //@@viewOff:propTypes

  //@@viewOn:getDefaultProps
  getDefaultProps() {
    return {
      mode: undefined,
    };
  },
  //@@viewOff:getDefaultProps

  //@@viewOn:reactLifeCycle
  UNSAFE_componentWillMount: function () {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      this._initCamera(this.props);

      if (navigator.permissions) {
        navigator.permissions.query({ name: "camera" }).then(
          (permissionStatus) => {
            permissionStatus.addEventListener("change", () => {
              this._initCamera(this.props);
            });
          },
          (e) => {
            this.showWarning("detectionNotSupported", null, { context: { event: e } });
          }
        );
      }
    }
  },

  componentWillReceiveProps: function (nextProps) {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      this._initCamera(nextProps);

      if (navigator.permissions) {
        navigator.permissions.query({ name: "camera" }).then(
          (permissionStatus) => {
            permissionStatus.addEventListener("change", () => {
              this._initCamera(nextProps);
            });
          },
          (e) => {
            this.showWarning("detectionNotSupported", null, { context: { event: e } });
          }
        );
      }
    }
  },
  //@@viewOff:reactLifeCycle

  //@@viewOn:interface
  getScreenShot: function () {
    var img = null;

    if (this.localMediaStream) {
      var canvas = this.canvas;
      canvas.width = UU5.Common.Tools.getWidth(this);
      canvas.height = UU5.Common.Tools.getHeight(this);

      var ctx = canvas.getContext("2d");
      ctx.drawImage(this.video, 0, 0, UU5.Common.Tools.getWidth(this), UU5.Common.Tools.getHeight(this));
      img = canvas.toDataURL("image/png");
    }

    return img;
  },
  //@@viewOff:interface

  //@@viewOn:overriding
  //@@viewOff:overriding

  //@@viewOn:private
  _initCamera(props) {
    navigator.mediaDevices
      .getUserMedia({ video: props.mode ? { facingMode: props.mode } : true })
      .then((stream) => {
        this.video.srcObject = stream;
        this.localMediaStream = stream;
      })
      .catch((e) => {
        this.localMediaStream = null;
        this.video.srcObject = null;
        this.showError("videoError", null, { context: { event: e } });
      });
  },

  _refVideo: function (video) {
    this.video = video;
  },

  _refCanvas: function (canvas) {
    this.canvas = canvas;
  },
  //@@viewOff:private

  //@@viewOn:render
  render: function () {
    return this.getNestingLevel() ? (
      <div {...this.getMainAttrs()}>
        <video autoPlay playsInline ref={this._refVideo} className={this.getClassName().video} />
        <canvas ref={this._refCanvas} className={this.getClassName().canvas} />
        {this.getDisabledCover()}
      </div>
    ) : null;
  },
  //@@viewOff:render
});

Camera = withLinkModal(Camera, Camera.displayName, Camera.nestingLevelList, Camera.displayName);

export { Camera };
export default Camera;
