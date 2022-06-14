//@@viewOn:imports
import React from "react";
import { PropTypes } from "uu5g05";
import { Utils } from "uu5g05";
import ns from "./common-ns.js";
import BaseMixin from "./base-mixin.js";
import Css from "./css";
import Uu5Component from "./component";
//@@viewOff:imports

const VISIBILITY_CHECK_ALLOWED = !navigator.webdriver; // don't check visibility if running in headless browser (e.g. when generating PDFs on server)

export const withVisibilityCheck = function (Component, reserve = 500, blockPrint = false) {
  if (typeof IntersectionObserver === "undefined" || !VISIBILITY_CHECK_ALLOWED) return Component;

  const VisibilityCheck = Uu5Component.create({
    //@@viewOn:mixins
    mixins: [BaseMixin],
    //@@viewOff:mixins
    //@@viewOn:statics
    statics: {
      tagName: ns.name("withVisibilityCheck"),
      classNames: {
        placeholder: () => Css.css`
          display: inline-block;
          height: 1px;
          width: 1px;
        `,
      },
      opt: {
        hoc: true,
      },
    },
    //@@viewOff:statics
    //@@viewOn:propTypes
    propTypes: {
      width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
      height: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    },
    //@@viewOff:propTypes

    //@@viewOn:getDefaultProps
    getDefaultProps() {
      return {
        width: undefined,
        height: undefined,
      };
    },
    //@@viewOff:getDefaultProps
    //@@viewOn:reactLifeCycle
    getInitialState() {
      return { visible: false };
    },
    componentDidMount() {
      if (blockPrint) this._printBlockerId = Utils.Print.registerPrintBlocker(this._printRequestCallback);
      let domNodeRect = this._domNode.getBoundingClientRect();
      let isVisible = domNodeRect.top <= window.innerHeight + reserve && domNodeRect.bottom >= -reserve;
      if (isVisible) {
        this.setState({ visible: true });
      } else {
        this._observer = new IntersectionObserver(this._onIntersected, { rootMargin: reserve + "px" });
        this._observer.observe(this._domNode);
      }
    },
    componentWillUnmount() {
      if (blockPrint) Utils.Print.unregisterPrintBlocker(this._printBlockerId);
      if (this._observer) this._observer.disconnect();
    },
    //@@viewOff:reactLifeCycle
    //@@viewOn:private
    _onPrintReady() {
      Utils.Print.unregisterPrintBlocker(this._printBlockerId);
    },

    _printRequestCallback() {
      this.setState({ visible: true });
    },

    _onIntersected(entries, observer) {
      let entry = entries[entries.length - 1];
      if (entry && entry.isIntersecting) {
        observer.disconnect();
        this.setState({ visible: true });
      }
    },
    _setRef(comp) {
      this._domNode = comp;
    },
    //@@viewOff:private
    //@@viewOn:render
    render() {
      let { visible } = this.state;
      let style = this.getMainAttrs().style || {};
      if (this.props.width) {
        style.width = this.props.width;
      }

      if (this.props.height) {
        style.height = this.props.height;
      }

      return visible ? (
        <Component
          {...this.props}
          onPrintReady={blockPrint ? this._onPrintReady : this.props.onPrintReady} // if print blocking is not enabled, do not overwrite original value just to be safe
        />
      ) : (
        <span ref={this._setRef} className={this.getClassName("placeholder")} style={style} />
      );
    },
    //@@viewOff:render
  });

  return VisibilityCheck;
};

export default withVisibilityCheck;
