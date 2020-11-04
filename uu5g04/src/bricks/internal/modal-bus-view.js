//@@viewOn:revision
// coded:
//   Petr Bišof, 16.10.2020
//   Filip Janovský, 20.10.2020
// reviewed: Filip Janovský, 19.10.2020
//@@viewOn:revision

//@@viewOn:imports
import UU5 from "uu5g04";
import ModalBusToolbar from "./modal-bus-toolbar";
import withPosition from "./with-position.js";

import Css from "./css";
import ns from "../bricks-ns.js";
//@@viewOff:imports

const MAGNETIC_OFFSET = 64;

const classNames = {
  modalBusViewMask: () => {
    return Css.css`
      position: fixed;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
      background-color: rgba(0, 0, 0, 0.4);
    `;
  },
  modalBusViewContent: () => {
    return Css.css`
      display: inline-flex;
      flex-direction: column;
      position: fixed;
      z-index: 1;
      margin: 16px;
      background-color: #fff;
      width: auto;
      border-radius: 4px;
      max-width: 100vw;
    `;
  },
  modalBusViewPortal: (activeItem, itemList, collapse) => {
    return Css.css`
    display: ${collapse && itemList.length > 1 ? "none" : "block"};
    padding: 8px;
    flex: 1 1 auto;
    overflow: auto;

    ${
      activeItem
        ? `& > :nth-child(${itemList.indexOf(activeItem) + 1}) {
      display: block;
    }`
        : ""
    }

    ${
      itemList.length
        ? `& > :nth-child(${itemList.length}) {
      pointer-events: inherit;
    }`
        : ""
    }
  `;
  },
};

export const ModalBusView = withPosition(
  UU5.Common.Component.create({
    //@@viewOn:mixins
    //@@viewOff:mixins

    //@@viewOn:statics
    statics: {
      tagName: ns.name("ModalBusView"),
    },
    //@@viewOff:statics

    //@@viewOn:propTypes
    propTypes: {
      onChange: UU5.PropTypes.func,
      itemList: UU5.PropTypes.array,
      activeItem: UU5.PropTypes.string,
    },
    //@@viewOff:propTypes

    //@@viewOn:getDefaultProps
    getDefaultProps() {
      return {
        onChange: undefined,
        itemList: undefined,
        activeItem: undefined,
      };
    },
    //@@viewOff:getDefaultProps

    //@@viewOn:reactLifeCycle
    getInitialState() {
      this._contentRef = UU5.Common.Reference.create();
      return {
        collapse: false,
      };
    },

    componentWillReceiveProps(nextProps) {
      if (!this.props.activeItem && nextProps.activeItem ) {
        this._initPosition = true;
      } else if (this.props.activeItem !== nextProps.activeItem && nextProps.activeItem) {
        this._updatePosition = true;
      }
      if (nextProps.itemList.length <= 1) this.setState({ collapse: false });
    },

    componentDidUpdate() {
      if (typeof this.props.updatePosition === "function") {
        if (this._initPosition) {
          this._initPosition = false;
          this.props.updatePosition(this._contentRef.current, "center");
        } else if (this._updatePosition) {
          this._updatePosition = false;
          this.props.updatePosition(this._contentRef.current, "optimize");
        }
      }
    },
    //@@viewOff:reactLifeCycle

    //@@viewOn:interface
    //@@viewOff:interface

    //@@viewOn:private
    _toggleCollapse() {
      this.setState((state) => ({
        collapse: !state.collapse,
      }));
    },

    _onMouseDown(e) {
      if (typeof this.props.onMouseDown === "function") {
        this.props.onMouseDown(e, this._contentRef.current);
      }
    },
    //@@viewOff:private

    //@@viewOn:render
    render() {
      let { itemList, activeItem, onChange, setNext, setPrevious } = this.props;
      let { right, top, left, componentWidth } = this.props.position;

      // center component if it is a near to the center of the screen
      const horizontalCenterOffset = (window.innerWidth - componentWidth) / 2 - MAGNETIC_OFFSET;
      if (right > horizontalCenterOffset && left > horizontalCenterOffset) {
        right = (window.innerWidth - componentWidth) / 2;
      }

      const style = { right, top };
      return (
        <div data-name="ModalBusViewMask" className={itemList.length ? classNames.modalBusViewMask() : undefined}>
          <div
            data-name="ModalBusViewContent"
            ref={this._contentRef}
            className={itemList.length ? classNames.modalBusViewContent() : undefined}
            style={style}
          >
            {itemList.length > 1 && (
              <div data-name="ModalBusViewToolbar" onMouseDown={this._onMouseDown}>
                <ModalBusToolbar
                  className={Css.css`cursor: move;`}
                  itemList={itemList}
                  activeItem={activeItem}
                  onChange={onChange}
                  collapse={this.state.collapse}
                  setNext={setNext}
                  setPrevious={setPrevious}
                  toggleCollapse={this._toggleCollapse}
                />
              </div>
            )}

            <div
              data-name="ModalBusViewPortal"
              id="modal-bus"
              className={classNames.modalBusViewPortal(activeItem, itemList, this.state.collapse)}
            />
          </div>
        </div>
      );
    },
    //@@viewOff:render
  })
);

export default ModalBusView;
