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
  modalBusViewContent: (minWidth, collapse) => {
    return Css.css`
      display: inline-flex;
      flex-direction: column;
      position: fixed;
      z-index: 1;
      min-width:  ${collapse ? "auto" : `${minWidth}px`};
      border-radius: 4px;
      ${collapse ? "width: auto !important;" : ""}
    `;
  },

  modalBusViewPortal: (activeItemId, itemList, collapse, minWidth, allowClose) => {
    return Css.css`
    display: ${collapse && itemList.length > 1 ? "none" : "block"};
    flex: 1 1 auto;
    overflow: auto;
    position: relative;

    .uu5-bricks-modal-layout-wrapper {
      background-color: #fff;
      max-width: 100%;
      min-width: ${minWidth}px;
    }


    ${
      activeItemId
        ? `& > :nth-child(${itemList.findIndex((item) => item.id === activeItemId) + 2}) {
            // increase index to skip focusCapturer
            display: block;
          }`
        : ""
    }

    ${
      itemList.length
        ? `& > :nth-child(${itemList.length + 1}) {
            // increase index to skip focusCapturer
            pointer-events: inherit;
          }`
        : ""
    }

    ${
      !allowClose
        ? `&&:after{
          position: absolute;
          left: 0;
          right: 0;
          bottom: 0;
          top: 0;
          background-color: rgba(0, 0, 0, 0.1);
          pointer-events: none;
          content: "";
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
      activeItemId: UU5.PropTypes.string,
    },
    //@@viewOff:propTypes

    //@@viewOn:getDefaultProps
    getDefaultProps() {
      return {
        onChange: undefined,
        itemList: undefined,
        activeItemId: undefined,
      };
    },
    //@@viewOff:getDefaultProps

    //@@viewOn:reactLifeCycle
    getInitialState() {
      this._contentRef = UU5.Common.Reference.create();
      this._portalRef = UU5.Common.Reference.create();
      return {
        collapse: false,
        minWidth: this.props.position.width || 0,
      };
    },

    componentDidMount() {
      // focusCapturer is used to capture focus in inactive modal
      this._focusCapturerId = UU5.Common.Tools.generateUUID();
      let focusCapturer = document.createElement("div");
      focusCapturer.id = this._focusCapturerId;
      focusCapturer.style.cssText = "opacity: 0.01; height: 0; width: 0;";
      focusCapturer.tabIndex = "0";
      focusCapturer.onfocus = this._onFocusInput;
      this._portalRef.current.insertBefore(focusCapturer, this._portalRef.current.firstChild);
      this._eventId = UU5.Common.Tools.generateUUID();
      UU5.Environment.EventListener.addWindowEvent("resize", this._eventId, this._onResize);
    },

    componentWillUnmount() {
      UU5.Environment.EventListener.removeWindowEvent("resize", this._eventId);
    },

    componentWillReceiveProps(nextProps) {
      if (!this.props.activeItemId && nextProps.activeItemId) {
        this._initPosition = true;
      } else if (this.props.activeItemId !== nextProps.activeItemId && nextProps.activeItemId) {
        this._updatePosition = true;
      }
      if (nextProps.itemList.length <= 1) this.setState({ collapse: false });
      if (this.state.minWidth < nextProps.position.width) {
        this.setState({ minWidth: nextProps.position.width });
      }
      if (nextProps.itemList.length === 0) {
        this.setState({ minWidth: 0 });
      }
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

      if (this.props.activeItemId === this.props.itemList[this.props.itemList.length - 1]?.id) {
        document.getElementById(this._focusCapturerId).tabIndex = "-1";
      } else {
        document.getElementById(this._focusCapturerId).tabIndex = "0";
      }
    },
    //@@viewOff:reactLifeCycle

    //@@viewOn:interface
    //@@viewOff:interface

    //@@viewOn:private
    _onFocusInput() {
      this._contentRef.current.querySelector("button")?.focus();
    },

    _onResize() {
      if (typeof this.props.updatePosition === "function" && this.props.itemList.length) {
        this.props.updatePosition(this._contentRef.current, "optimize");
      }
    },

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

    _onClickMask(itemList, activeItem, settings) {
      if (itemList.length === 1 && settings.stickyBackground === false) {
        if (activeItem && typeof activeItem.close === "function") {
          activeItem.close();
        }
      }
    },

    _getViewContentClassName(itemList, componentWidth, settings) {
      let result = itemList.length ? classNames.modalBusViewContent(componentWidth, this.state.collapse) : "";

      if (settings?.viewContentClassName) {
        result = UU5.Common.Tools.joinClassNames(result, settings.viewContentClassName).replace(
          "uu5-bricks-page-modal uu5-elevation-5",
          ""
        );
      }

      return result;
    },
    //@@viewOff:private

    //@@viewOn:render
    render() {
      let { itemList, activeItemId, onChange, setNext, setPrevious } = this.props;
      let { right, top, left, marginLeft, marginRight } = this.props.position;
      let componentWidth = this.state.minWidth;
      let activeItem = activeItemId ? itemList.find((item) => item.id === activeItemId) : undefined;
      let settings = activeItem?.settings;
      let isClosable = itemList[itemList.length - 1]?.id === activeItemId;

      if (!this._initPosition && document.body.clientWidth < this.state.minWidth) {
        componentWidth = document.body.clientWidth;

        if (marginLeft) componentWidth -= marginLeft;
        if (marginRight) componentWidth -= marginRight;
      }

      // center component if it is a near to the center of the screen
      const horizontalCenterOffset = (document.body.clientWidth - componentWidth) / 2 - MAGNETIC_OFFSET;
      if (right > horizontalCenterOffset && left > horizontalCenterOffset) {
        right = (document.body.clientWidth - componentWidth) / 2;
        if (marginRight) right -= marginRight;
      }

      const style = { right, top };
      return (
        <div
          data-name="ModalBusViewMask"
          className={itemList.length ? classNames.modalBusViewMask() : undefined}
          onClick={() => this._onClickMask(itemList, activeItem, settings)}
        >
          <div
            data-name="ModalBusViewContent"
            ref={this._contentRef}
            className={this._getViewContentClassName(itemList, componentWidth, settings)}
            style={style}
          >
            {itemList.length > 1 && (
              <div data-name="ModalBusViewToolbar" onMouseDown={this._onMouseDown}>
                <ModalBusToolbar
                  itemList={itemList}
                  activeItemId={activeItemId}
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
              className={classNames.modalBusViewPortal(
                activeItemId,
                itemList,
                this.state.collapse,
                componentWidth,
                isClosable
              )}
              ref={this._portalRef}
            />
          </div>
        </div>
      );
    },
    //@@viewOff:render
  })
);

export default ModalBusView;
