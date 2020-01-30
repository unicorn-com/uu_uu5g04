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

import Loading from "./loading.js";

import "./iframe.less";
//@@viewOff:imports

export const Iframe = UU5.Common.VisualComponent.create({
  displayName: "Iframe", // for backward compatibility (test snapshots)
  //@@viewOn:mixins
  mixins: [UU5.Common.BaseMixin, UU5.Common.PureRenderMixin, UU5.Common.ElementaryMixin, UU5.Common.NestingLevelMixin],
  //@@viewOff:mixins

  //@@viewOn:statics
  statics: {
    tagName: ns.name("Iframe"),
    nestingLevelList: UU5.Environment.getNestingLevelList("bigBoxCollection", "box"),
    classNames: {
      main: ns.css("iframe"),
      inline: ns.css("iframe-inline"),
      disabledWrapper: ns.css("iframe-disabled-wrapper uu5-common-disabled-cover-wrapper")
    },
    defaults: {
      regexpIsUrl: /^(file|ftp|http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&\/=]*)/g,
      regexpBearer: /Bearer[^&]+/,
      regexpUnits: /(\d+)([a-zA-Z%]*)$/,
      loadingTimeout: [3000, 3000, 4000, 8000]
    },
    warnings: {
      cors: "Url %s cannot be automatically resized because of another origin."
    }
  },
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {
    src: UU5.PropTypes.string,
    resize: UU5.PropTypes.bool,
    height: UU5.PropTypes.string,
    syncTimeout: UU5.PropTypes.number,
    inline: UU5.PropTypes.bool,
    iframeAttrs: UU5.PropTypes.object
  },
  //@@viewOff:propTypes

  //@@viewOn:getDefaultProps
  getDefaultProps() {
    return {
      src: "https://unicorn.com",
      resize: false,
      height: "250",
      syncTimeout: 1,
      inline: false,
      iframeAttrs: {}
    };
  },
  //@@viewOff:getDefaultProps

  //@@viewOn:reactLifeCycle
  getInitialState() {
    return {
      loading: this.props.resize,
      height: 0,
      width: 0,
      visible: !this.props.syncTimeout
    };
  },

  componentDidMount() {
    if (this.props.syncTimeout) {
      this._timeout = setTimeout(() => this.setAsyncState({ visible: true }), this.props.syncTimeout);
    }
  },

  componentWillUnmount() {
    this._timeout && clearTimeout(this._timeout);
    this._resizeTimeout && clearTimeout(this._resizeTimeout);
  },
  //@@viewOff:reactLifeCycle

  //@@viewOn:interface
  resize(setStateCallback) {
    this._resize(0, setStateCallback);
    return this;
  },

  setSize(width, height, setStateCallback) {
    this.setState({ loading: false, width: width, height: height }, setStateCallback);
    return this;
  },
  //@@viewOff:interface

  //@@viewOn:overriding
  //@@viewOff:overriding

  //@@viewOn:private
  _resize(counter, setStateCallback) {
    let height, width;
    counter = counter || 0;

    if (this._iframe) {
      try {
        let body = this._iframe.contentWindow.document.body;
        height = body.scrollHeight;
        width = body.scrollWidth;

        if (counter > this.getDefault("loadingTimeout").length - 1) {
          this.setAsyncState({ loading: false, height, width }, setStateCallback);
          return this;
        }

        if (!height || !width) {
          this._resizeTimeout = setTimeout(() => this._resize(counter + 1), this.getDefault("loadingTimeout")[counter]);
          return this;
        }

        this._resizeTimeout && clearTimeout(this._resizeTimeout);
      } catch (ex) {
        this.showWarning("cors", this.props.src.replace(this.getDefault().regexpBearer, "Bearer..."), {
          context: { error: ex }
        });
        this.setAsyncState({ loading: false, height: this.props.height }, setStateCallback);
      }
    }

    if (height || width) {
      this.setAsyncState(
        {
          loading: false,
          height: height,
          width: null
        },
        () => {
          let body = this._iframe.contentWindow.document.body;
          this.setAsyncState({ height: body.scrollHeight, width: body.scrollWidth }, setStateCallback);
        }
      );
    } else {
      typeof setStateCallback === "function" && setStateCallback();
    }
  },

  _onLoad(e) {
    if (this.state.loading) {
      this.resize(() => {
        this.props.mainAttrs &&
          typeof this.props.mainAttrs.onLoad === "function" &&
          typeof this.props.mainAttrs.onLoad(e);
      });
    } else {
      this.props.mainAttrs &&
        typeof this.props.mainAttrs.onLoad === "function" &&
        typeof this.props.mainAttrs.onLoad(e);
    }

    return this;
  },

  _getIframeId() {
    return this.getId() + "-iframe";
  },

  _fillUnits(value) {
    let result = value;
    if (typeof value === "number") {
      value = "" + value;
    }

    if (value) {
      let splitter = value.match(this.getDefault("regexpUnits"));
      let size = splitter[1];
      let unit = splitter[2] || "px";
      result = [size, unit].join("");
    }

    return result;
  },

  _getIframeAttrs() {
    let attrs = UU5.Common.Tools.merge({}, this.props.iframeAttrs);
    attrs.id = this._getIframeId();
    if (this._isUrl(this.props.src)) {
      attrs.src = this.props.src;
    } else {
      attrs.srcDoc = this.props.src;
    }

    if (this.props.resize) {
      attrs.onLoad = this._onLoad;
      attrs.style = { ...attrs.style };
      this.state.height && (attrs.style.height = this._fillUnits(this.state.height));
      this.state.width && (attrs.style.width = this.state.width);
    } else {
      attrs.style = { ...attrs.style };
      attrs.style.height = this._fillUnits(this.state.height ? this.state.height : this.props.height);
      this.state.width && (attrs.style.width = this.state.width);
    }

    let origRef = attrs.ref;
    attrs.ref = comp => {
      this._iframe = comp;
      if (typeof origRef === "function") return origRef(comp);
    };

    return attrs;
  },

  _getMainAttrs() {
    let mainAttrs = this.getMainAttrs();
    this.props.inline && (mainAttrs.className += " " + this.getClassName().inline);
    return mainAttrs;
  },

  _isUrl(string) {
    return !!string.match(this.getDefault().regexpIsUrl);
  },
  //@@viewOff:private

  //@@viewOn:render
  render() {
    return this.getNestingLevel() ? (
      <div {...this._getMainAttrs()}>
        {this.state.loading ? <Loading /> : null}
        {this.state.visible && <iframe {...this._getIframeAttrs()} />}
        {this.getDisabledCover()}
      </div>
    ) : null;
  }
  //@@viewOff:render
});

export default Iframe;
