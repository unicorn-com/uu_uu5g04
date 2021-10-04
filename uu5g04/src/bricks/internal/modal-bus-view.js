//@@viewOn:revision
// coded:
//   Petr Bišof, 16.10.2020
//   Filip Janovský, 20.10.2020
// reviewed: Filip Janovský, 19.10.2020
//@@viewOn:revision

//@@viewOn:imports
import UU5, { createComponent } from "uu5g04";
import ModalBusToolbar from "./modal-bus-toolbar";
import withPosition from "./with-position.js";

import Css from "./css";
import ns from "../bricks-ns.js";
import { LAYER, RenderIntoPortal } from "./portal.js";
//@@viewOff:imports

const MAGNETIC_OFFSET = 64;

const classNames = {
  modalBusViewMask: ({ itemList }) => {
    let staticClassName = Css.css`
      position: fixed;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
      z-index: 1040;
      background-color: rgba(0, 0, 0, 0.4);
      overflow: auto;
    `;
    let dynamicClassName = Css.css({ display: itemList.length > 0 ? "block" : "none" });
    return [staticClassName, dynamicClassName].join(" ");
  },
  modalBusViewContent: (minWidth, collapse) => {
    return Css.css`
      display: inline-flex;
      flex-direction: column;
      position: absolute;
      z-index: 1;
      min-width:  ${collapse ? "auto" : `${minWidth}px`};
      border-radius: 4px;
      ${collapse ? "width: auto !important;" : ""}
    `;
  },

  modalBusViewPortalContainer: () => Css.css({ display: "inline-flex" }),
  modalBusViewPortal: (activeItemId, itemList, collapse, minWidth, allowClose) => {
    return Css.css`
    display: ${collapse && itemList.length > 1 ? "none" : "flex"};
    flex: 1 1 auto;
    position: relative;
    min-height: 0;

    .uu5-bricks-modal-layout-wrapper {
      background-color: #fff;
      max-width: 100%;
      min-width: ${minWidth}px;
    }


    ${
      activeItemId
        ? `& > :nth-child(${itemList.findIndex((item) => item.id === activeItemId) + 2}) {
            // increase index to skip focusCapturer
            display: flex;
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

let ModalBusView = withPosition(
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
      portalElement: UU5.PropTypes.object.isRequired,
    },
    //@@viewOff:propTypes

    //@@viewOn:getDefaultProps
    getDefaultProps() {
      return {
        onChange: undefined,
        itemList: undefined,
        activeItemId: undefined,
        portalElement: undefined,
      };
    },
    //@@viewOff:getDefaultProps

    //@@viewOn:reactLifeCycle
    getInitialState() {
      this._contentRef = UU5.Common.Reference.create();
      this._containerRef = UU5.Common.Reference.create();
      return {
        collapse: false,
        minWidth: this.props.position.width || 0,
      };
    },

    componentDidMount() {
      this._containerRef.current.appendChild(this.props.portalElement);
      this._syncPortalElement();
      this._updatePositionOnActiveItemChange({});

      // focusCapturer is used to capture focus in inactive modal
      this._focusCapturerId = UU5.Common.Tools.generateUUID();
      let focusCapturer = document.createElement("div");
      focusCapturer.id = this._focusCapturerId;
      focusCapturer.style.cssText = "opacity: 0.01; height: 0; width: 0;";
      focusCapturer.tabIndex = "0";
      focusCapturer.onfocus = this._onFocusInput;
      this.props.portalElement.insertBefore(focusCapturer, this.props.portalElement.firstChild);
      this._eventId = UU5.Common.Tools.generateUUID();
      UU5.Environment.EventListener.addWindowEvent("resize", this._eventId, this._onResize);
    },

    componentWillUnmount() {
      UU5.Environment.EventListener.removeWindowEvent("resize", this._eventId);
      this.props.portalElement.removeChild(this.props.portalElement.firstChild); // focusCapturer
      this._containerRef.current.removeChild(this._containerRef.current.lastChild);
    },

    componentWillReceiveProps(nextProps) {
      if (process.env.NODE_ENV === "development" && this.props.portalElement !== nextProps.portalElement) {
        console.error("ModalBusView does not support changing of props.portalElement!");
      }

      if (this.props.activeItemId !== nextProps.activeItemId && nextProps.activeItemId) {
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

    componentDidUpdate(prevProps) {
      this._syncPortalElement();
      this._updatePositionOnActiveItemChange(prevProps);

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
    _updatePositionOnActiveItemChange(prevProps) {
      if (typeof this.props.updatePosition === "function") {
        if (!prevProps.activeItemId && this.props.activeItemId) {
          this.props.updatePosition(this._contentRef.current, "center");
        } else if (!this.props.isInitialPosition && this._updatePosition) {
          this._updatePosition = false;
          this.props.updatePosition(this._contentRef.current, "optimize");
        }
      }
    },

    _syncPortalElement() {
      const { portalElement, activeItemId, itemList } = this.props;
      let componentWidth = this.state.minWidth;
      let isClosable = itemList[itemList.length - 1]?.id === activeItemId;

      portalElement.dataset.name = "ModalBusViewPortal";
      portalElement.id = "modal-bus";
      portalElement.className = classNames.modalBusViewPortal(
        activeItemId,
        itemList,
        this.state.collapse,
        componentWidth,
        isClosable
      );
    },

    _onFocusInput() {
      this._contentRef.current.querySelector("button")?.focus();
    },

    _onResize() {
      if (
        typeof this.props.updatePosition === "function" &&
        this.props.itemList.length &&
        !this.props.isInitialPosition
      ) {
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
        let canStartDrag = true;
        let node = e.target;

        while (node != document.body && node != document.documentElement && node && canStartDrag) {
          if (node.getAttribute("data-name") === "Toolbar-Button") {
            canStartDrag = false;
          }
          node = node.parentNode;
        }

        if (canStartDrag) {
          this.props.onMouseDown(e, this._contentRef.current);
        }
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
      let { itemList, activeItemId, onChange, setNext, setPrevious, isInitialPosition } = this.props;
      let { right, top } = this.props.position;
      let componentWidth = this.state.minWidth;
      let activeItem = activeItemId ? itemList.find((item) => item.id === activeItemId) : undefined;
      let settings = activeItem?.settings;
      let style = { top, right };

      if (isInitialPosition) {
        style.right = "50%";
        style.transform = "translateX(50%)";
      }

      return (
        <div
          data-name="ModalBusViewMask"
          className={classNames.modalBusViewMask(this.props)}
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

            <div ref={this._containerRef} className={classNames.modalBusViewPortalContainer()}></div>
          </div>
        </div>
      );
    },
    //@@viewOff:render
  }),
  MAGNETIC_OFFSET
);

//@@viewOn:helpers
function withPagePortals(Component) {
  return createComponent({
    displayName: `withPagePortals(${Component.displayName})`,
    getInitialState() {
      return { pageReady: false };
    },
    componentDidMount() {
      this.setState({ pageReady: true });
    },
    render() {
      // NOTE ModalBus is above Page in hierarchy, but we need to know portal element used by Page
      // (ModalBusView needs to be rendered there, so that e.g. Popover-s are above ModalBusView)
      //   => assume that Page gets readied during mount and re-render ourselves after mount
      const page = UU5.Environment.page;
      const portalElement = page?.getPortalElement(LAYER.MODAL);
      return !this.state.pageReady ? null : (
        <RenderIntoPortal layer={LAYER.MODAL} portalElement={portalElement || undefined}>
          <Component {...this.props} />
        </RenderIntoPortal>
      );
    },
  });
}
//@@viewOff:helpers

ModalBusView = withPagePortals(ModalBusView);

export { ModalBusView };
export default ModalBusView;
