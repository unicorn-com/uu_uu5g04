//@@viewOn:imports
import * as UU5 from "uu5g04";
import "uu5g04-bricks";

import ns from "../bricks-editable-ns.js";
import Css from "./css.js";
//@@viewOff:imports

export const RollMenu = UU5.Common.VisualComponent.create({
  //@@viewOn:mixins
  mixins: [UU5.Common.BaseMixin, UU5.Common.ElementaryMixin, UU5.Common.ContentMixin],
  //@@viewOff:mixins

  //@@viewOn:statics
  statics: {
    tagName: ns.name("RollMenu"),
    classNames: {
      main: ns.css("roll-menu"),
      root: (props, state) => {
        let styles = [
          `
          position: absolute;
          left: 0;
          top: 0;
          right: 0;
          bottom: 0;
          overflow: hidden;
          `
        ];

        if (typeof props.zIndex === "number") {
          styles.push(`z-index: ${props.zIndex};`);
        }

        if (!state.open) {
          styles.push("pointer-events: none;");
        }

        return Css.css(styles.join(" "));
      },
      backgroundLayer: (props, state) => {
        let styles = ["transition: transform ease 0.4s; height: 100%;"];

        if (!state.open) {
          if (props.direction === "vertical") {
            styles.push(`transform: translateY(-100%);`);
          } else {
            styles.push(`transform: translateX(-100%);`);
          }
        }

        return Css.css(styles.join(" "));
      },
      measure: () =>
        Css.css(`
        && {
          height: auto;
          bottom: auto;
        }
      `)
    }
  },
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {
    open: UU5.PropTypes.bool,
    animatedWrapperProps: UU5.PropTypes.object,
    zIndex: UU5.PropTypes.number,
    direction: UU5.PropTypes.oneOf(["horizontal", "vertical"]),
    backgroundLayerClassName: UU5.PropTypes.string,
    header: UU5.PropTypes.node
  },
  //@@viewOff:propTypes

  //@@viewOn:getDefaultProps
  getDefaultProps() {
    return {
      open: false,
      animatedWrapperProps: undefined,
      zIndex: undefined,
      direction: "horizontal",
      backgroundLayerClassName: undefined,
      header: undefined
    };
  },
  //@@viewOff:getDefaultProps

  //@@viewOn:reactLifeCycle
  getInitialState() {
    return {
      open: this.props.open
    };
  },

  componentWillReceiveProps(nextProps) {
    if (nextProps.controlled) {
      if (nextProps.open !== this.state.open) {
        this.toggle();
      }
    }
  },
  //@@viewOff:reactLifeCycle

  //@@viewOn:interface
  toggle(setStateCallback) {
    this.setState(state => ({ open: !state.open }), setStateCallback);
  },

  open(setStateCallback) {
    this.setState({ open: true }, setStateCallback);
  },

  close(setStateCallback) {
    this.setState({ open: false }, setStateCallback);
  },

  measureHeight() {
    if (this._root) {
      let className = this.getClassName("measure");
      this._root.classList.add(className);
      let height = this._root.getBoundingClientRect().height;
      this._root.classList.remove(className);
      return height;
    }
  },
  //@@viewOff:interface

  //@@viewOn:overriding
  //@@viewOff:overriding

  //@@viewOn:private
  _registerRoot(ref) {
    this._root = ref;
  },

  _getMainProps() {
    let props = this.getMainAttrs();

    props.className += " " + this.getClassName("root");
    props.ref = this._registerRoot;

    return props;
  },
  //@@viewOff:private

  //@@viewOn:render
  render() {
    return (
      <div {...this._getMainProps()}>
        <div className={`${this.getClassName("backgroundLayer")} ${this.props.backgroundLayerClassName || ""}`}>
          {this.props.header}
          <div {...this.props.animatedWrapperProps}>{this.getChildren()}</div>
        </div>
      </div>
    );
  }
  //@@viewOff:render
});

export default RollMenu;
