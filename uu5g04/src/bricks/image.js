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

import "./image.less";
//@@viewOff:imports

let Image = UU5.Common.VisualComponent.create({
  displayName: "Image", // for backward compatibility (test snapshots)
  //@@viewOn:mixins
  mixins: [UU5.Common.BaseMixin, UU5.Common.PureRenderMixin, UU5.Common.ElementaryMixin, UU5.Common.NestingLevelMixin],
  //@@viewOff:mixins

  //@@viewOn:statics
  statics: {
    tagName: ns.name("Image"),
    nestingLevelList: UU5.Environment.getNestingLevelList("bigBoxCollection", "box"),
    classNames: {
      main: ns.css("image"),
      type: ns.css("image-"),
      disabledWrapper: "uu5-common-disabled-cover-wrapper",
      elevationWrapper: ns.css("image-elevation-wrapper"),
      elevationHolder: ns.css("image-elevation-holder")
    },
    imageCache: {}
  },
  //@@viewOff:statics

  // TODO: strictCircle -> no ellipse but cut a circle from different image size - e.g. http://sixrevisions.com/css/circular-images-css/
  //@@viewOn:propTypes
  propTypes: {
    type: UU5.PropTypes.oneOf(["rounded", "circle", "thumbnail"]),
    src: UU5.PropTypes.string,
    responsive: UU5.PropTypes.bool,
    alt: UU5.PropTypes.string,
    authenticate: UU5.PropTypes.bool,
    borderRadius: UU5.PropTypes.string,
    elevation: UU5.PropTypes.oneOf(["0", "1", "2", "3", "4", "5", 0, 1, 2, 3, 4, 5]),
    width: UU5.PropTypes.oneOfType([UU5.PropTypes.number, UU5.PropTypes.string]),
    height: UU5.PropTypes.oneOfType([UU5.PropTypes.number, UU5.PropTypes.string])
  },
  //@@viewOff:propTypes

  //@@viewOn:getDefaultProps
  getDefaultProps() {
    return {
      type: null,
      src: "",
      responsive: true,
      alt: undefined,
      authenticate: false,
      borderRadius: null,
      elevation: null,
      width: undefined,
      height: undefined
    };
  },
  //@@viewOff:getDefaultProps

  //@@viewOn:reactLifeCycle
  getInitialState() {
    let { preloading, preloadedUri } = this._preloadImage(this.props);
    return {
      preloading,
      preloadedUri
    };
  },

  componentWillReceiveProps(nextProps) {
    // if (nextProps.controlled) {
    //   if (nextProps.borderRadius !== this.props.borderRadius) {
    //     this._removeElevationRadius();
    //     this._createElevationRadius();
    //   }
    // }

    let { preloading, preloadedUri } = this._preloadImage(nextProps);
    this.setState({
      preloading,
      preloadedUri
    });
  },

  // componentWillMount() {
  //   this._createElevationRadius();
  // },

  // componentWillUnmount() {
  //   this._removeElevationRadius();
  // },
  //@@viewOff:reactLifeCycle

  //@@viewOn:interface
  //@@viewOff:interface

  //@@viewOn:overriding
  //@@viewOff:overriding

  //@@viewOn:private
  // _createElevationRadius() {
  //   if (this.props.elevation === "-1" || this.props.elevation === -1) {
  //     UU5.Common.Tools.createStyleTag(
  //       "." + this.getClassName("elevationHolder") + "#" + this.getId() + "::before { border-radius:" + this.props.borderRadius + " }",
  //       this.getId()
  //     );
  //   }
  // },

  // _removeElevationRadius() {
  //   if (this.props.elevation === "-1" || this.props.elevation === -1) {
  //     UU5.Common.Tools.removeStyleTag(this.getId());
  //   }
  // },

  _getAlt() {
    let alt;

    if (typeof this.props.alt !== "undefined") {
      alt = this.props.alt;
    } else {
      alt = this.getName() || UU5.Common.Tools.getFileName(this.props.src) || "";
    }

    return alt;
  },

  _preloadImage(props) {
    let result;
    let url = props.src;
    let session = UU5.Environment.getSession();
    // load image via Ajax request if the image requires authentication
    if (props.authenticate && session && session.isAuthenticated() && UU5.Environment.isTrustedDomain(url)) {
      let { uuIdentity, loginLevelOfAssurance } = session.getIdentity();
      let cacheKey = url + " " + uuIdentity + " " + loginLevelOfAssurance;
      result = this.constructor.imageCache[cacheKey];
      if (!result) {
        result = this.constructor.imageCache[cacheKey] = {
          preloading: true,
          preloadedUri: "data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==", // transparent 1x1 image
          promise: null
        };
        result.promise = this._fetchImage(url, session).then(
          blob => {
            result.preloading = false;
            result.preloadedUri = URL.createObjectURL(blob);
          },
          err => {
            result.preloading = false;
            result.preloadedUri = "data:image/gif;base64,ZZZZZZZZ"; // invalid image
          }
        );
      }
      let runId = (this._preloadImageLastRunId = cacheKey);
      result.promise.then(() => {
        // show preloaded image (if we're still using the same props)
        if (this.isRendered() && runId === this._preloadImageLastRunId) {
          this.setState({ preloading: result.preloading, preloadedUri: result.preloadedUri });
        }
      });
    } else {
      result = {
        preloading: false,
        preloadedUri: null
      };
      delete this._preloadImageLastRunId;
    }
    return result;
  },

  async _fetchImage(url, session) {
    let token = await UU5.Common.Tools.getCallToken(url, session);
    let headers = token
      ? {
          Authorization: "Bearer " + token
        }
      : {};
    return new Promise((resolve, reject) => {
      let xhr = new XMLHttpRequest();
      xhr.open("GET", url, true);
      xhr.responseType = "blob";
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
  //@@viewOff:private

  //@@viewOn:render
  render() {
    var mainAttrs = this.getMainAttrs();

    this.props.type && (mainAttrs.className += " " + this.getClassName("type") + this.props.type);
    this.props.responsive && (mainAttrs.className += " " + this.getClassName("type") + "responsive");
    mainAttrs.src = this.state.preloadedUri || this.props.src;
    mainAttrs.alt = this._getAlt();
    let style = {};
    if (this.props.borderRadius && !this.props.type) {
      style.borderRadius = this.props.borderRadius;
    }
    if (this.props.width) {
      style.width = this.props.width;
    }
    if (this.props.height) {
      style.height = this.props.height;
    }
    if (Object.keys(style).length > 0) {
      mainAttrs.style = { ...mainAttrs.style, ...style };
    }

    if (this.props.elevation) {
      mainAttrs.className += " " + ClassNames.elevation + this.props.elevation;
    }

    // don't add onLoad, onXyz on <img> while we're preloading image
    if (this.state.preloading) {
      for (let k in mainAttrs) {
        if (k.match(/^on[A-Z]/) && typeof mainAttrs[k] === "function") delete mainAttrs[k];
      }
    }

    var image = <img {...mainAttrs} />;

    if (this.isDisabled()) {
      image = (
        <div className={this.getClassName("disabledWrapper")}>
          {image}
          {this.getDisabledCover()}
        </div>
      );
    }

    if (this.props.elevation === "-1" || this.props.elevation === -1) {
      image = (
        <div className={this.getClassName("elevationWrapper")}>
          <div
            className={this.getClassName("elevationHolder") + " " + ClassNames.elevation + this.props.elevation}
            style={{ borderRadius: this.props.borderRadius }}
          >
            {image}
          </div>
        </div>
      );
    }

    return this.getNestingLevel() ? image : null;
  }
  //@@viewOff:render
});
Image = UU5.Common.withVisibilityCheck(Image);

export { Image };
export default Image;
