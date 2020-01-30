//@@viewOn:imports
import React from "react";
import PropTypes from "prop-types";
import ns from "./common-ns.js";
import BaseMixin from "./base-mixin.js";
import Css from "./css";
import Uu5Component from "./component";
//@@viewOff:imports

export const withVisibilityCheck = function(Component, reserve = 500) {
  if (typeof IntersectionObserver === "undefined") return Component;

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
        `
      },
      opt: {
        hoc: true
      }
    },
    //@@viewOff:statics
    //@@viewOn:propTypes
    propTypes: {
      width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
      height: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
    },
    //@@viewOff:propTypes

    //@@viewOn:getDefaultProps
    getDefaultProps() {
      return {
        width: undefined,
        height: undefined
      };
    },
    //@@viewOff:getDefaultProps
    //@@viewOn:reactLifeCycle
    getInitialState() {
      return { visible: false };
    },
    componentDidMount() {
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
      if (this._observer) this._observer.disconnect();
    },
    //@@viewOff:reactLifeCycle
    //@@viewOn:private
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
        <Component {...this.props} />
      ) : (
        <span ref={this._setRef} className={this.getClassName("placeholder")} style={style} />
      );
    }
    //@@viewOff:render
  });

  return VisibilityCheck;
};

export default withVisibilityCheck;
