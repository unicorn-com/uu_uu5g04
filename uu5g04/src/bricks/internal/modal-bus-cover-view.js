//@@viewOn:revision
// coded: Petr Bišof, 16.10.2020
// reviewed: Filip Janovský, 19.10.2020
//@@viewOn:revision

//@@viewOn:imports
import UU5 from "uu5g04";
import ns from "../bricks-ns.js";
import Css from "./css.js";
//@@viewOff:imports

const classNames = {
  modalCoverView: () => {
    return Css.css`
    display: none;
    pointer-events: none;

    .uu5-bricks-modal-body{
      background: none;
    }
    `;
  },
};

export const ModalCoverView = UU5.Common.Component.create({
  //@@viewOn:mixins
  //@@viewOff:mixins

  //@@viewOn:statics
  statics: {
    tagName: ns.name("ModalCoverView"),
  },
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {
    id: UU5.PropTypes.string,
    onMount: UU5.PropTypes.func,
    onUnmount: UU5.PropTypes.func,
  },
  //@@viewOff:propTypes

  //@@viewOn:getDefaultProps
  getDefaultProps() {
    return {
      onMount: null,
      onUnmount: null,
    };
  },
  //@@viewOff:getDefaultProps

  //@@viewOn:reactLifeCycle
  componentDidMount() {
    if (typeof this.props.onMount === "function") {
      this.props.onMount(this.props.id);
    }
  },

  componentWillUnmount() {
    if (typeof this.props.onUnmount === "function") {
      this.props.onUnmount(this.props.id);
    }
  },
  //@@viewOff:reactLifeCycle

  //@@viewOn:interface
  //@@viewOff:interface

  //@@viewOn:private
  //@@viewOff:private

  //@@viewOn:render
  render() {
    return (
      <div data-name="ModalCoverView" className={classNames.modalCoverView()}>
        {this.props.children}
      </div>
    );
  },
  //@@viewOff:render
});

export default ModalCoverView;
