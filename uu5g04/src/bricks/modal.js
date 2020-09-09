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
import UU5, { createComponent } from "uu5g04";
import ns from "./bricks-ns.js";

import Header from "./modal-header.js";
import Body from "./modal-body.js";
import Footer from "./modal-footer.js";
import Css from "./internal/css.js";
import { enableBodyScrolling, disableBodyScrolling } from "./internal/page-utils.js";
import { RenderIntoPortal } from "./internal/portal.js";

import "./modal.less";
//@@viewOff:imports

const MOUNT_CONTENT_VALUES = {
  onFirstRender: "onFirstRender",
  onFirstOpen: "onFirstOpen",
  onEachOpen: "onEachOpen"
};

const getMountContent = (props = {}, state = {}) => {
  let mountContent = state.mountContent || props.mountContent;
  return mountContent === undefined
    ? props.location
      ? MOUNT_CONTENT_VALUES.onEachOpen
      : MOUNT_CONTENT_VALUES.onFirstRender // backward comaptibility
    : mountContent;
};

/**
 * Helper component for CSS animation - whenever prop "renderKey" changes, children
 * gets re-rendered twice. First render should typically render full content with visibility: hidden,
 * 2nd render should make it visible and apply CSS transition.
 */
const DoubleRender = createComponent({
  getInitialState() {
    let { doubleRenderOnMount, renderKey } = this.props;
    return { prevRenderKey: doubleRenderOnMount ? renderKey + "x" : renderKey };
  },
  componentDidMount() {
    let { doubleRenderOnMount } = this.props;
    if (doubleRenderOnMount) this._reRender();
  },
  componentDidUpdate(prevProps) {
    if (prevProps.renderKey !== this.props.renderKey) this._reRender();
  },
  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.renderKey !== this.props.renderKey) this.setState({ prevRenderKey: nextProps.renderKey + "x" });
  },
  _reRender() {
    if (this._rafId) cancelAnimationFrame(this._rafId);
    this._rafId = requestAnimationFrame(() => {
      delete this._rafId;
      this.setState({ prevRenderKey: this.props.renderKey });
    });
  },
  componentWillUnmount() {
    if (this._rafId) cancelAnimationFrame(this._rafId);
  },
  render() {
    let { renderKey, children } = this.props;
    let { prevRenderKey } = this.state;
    return children(renderKey !== prevRenderKey ? DoubleRender.FIRST_RENDER : DoubleRender.SECOND_RENDER);
  }
});
DoubleRender.FIRST_RENDER = 0;
DoubleRender.SECOND_RENDER = 1;

export const Modal = UU5.Common.VisualComponent.create({
  displayName: "Modal", // for backward compatibility (test snapshots)

  //@@viewOn:mixins
  mixins: [
    UU5.Common.BaseMixin,
    UU5.Common.PureRenderMixin,
    UU5.Common.ElementaryMixin,
    UU5.Common.SectionMixin,
    UU5.Common.NestingLevelMixin,
    UU5.Common.CcrReaderMixin
  ],
  //@@viewOff:mixins

  //@@viewOn:statics
  statics: {
    tagName: ns.name("Modal"),
    nestingLevelList: UU5.Environment.getNestingLevelList("bigBoxCollection", "box"),
    classNames: {
      main: props => {
        let className = ns.css("modal");
        if (props.offsetTop === "auto") {
          className +=
            " " +
            Css.css(`
            && {
              display: flex !important;
              flex-direction: column;
              justify-content: center;
            }
          `);
        }
        return className;
      },
      dialog: props => {
        let className = ns.css("modal-dialog");
        if (typeof props.offsetTop === "number") {
          className +=
            " " +
            Css.css(`
            && {
              margin-top: ${props.offsetTop}px;
            }
          `);
        } else if (props.offsetTop === "auto") {
          className +=
            " " +
            Css.css(`
            && {
              margin-top: 0;
              margin-bottom: 0;
            }
          `);
        } else if (typeof props.offsetTop === "string") {
          className +=
            " " +
            Css.css(`
            && {
              margin-top: ${props.offsetTop};
            }
          `);
        }
        return className;
      },
      modalSize: ns.css("modal-"),
      isFooter: ns.css("modal-isfooter"),
      overflow: ns.css("modal-overflow"),
      bodyOverflow: ns.css("modal-body-overflow")
    },
    defaults: {
      header: "noHeader",
      body: "noBody",
      animationDuration: 150, // ms
      closeTypes: {
        closedButton: "closedButton",
        blur: "blur",
        ifc: "interface"
      }
    },
    opt: {
      nestingLevelRoot: true
    }
  },
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {
    size: UU5.PropTypes.oneOf(["s", "m", "l", "auto", "max"]),
    shown: UU5.PropTypes.bool,
    sticky: UU5.PropTypes.bool,
    stickyBackground: UU5.PropTypes.bool,
    scrollableBackground: UU5.PropTypes.bool,
    forceRender: UU5.PropTypes.bool,
    onClose: UU5.PropTypes.func,
    overflow: UU5.PropTypes.bool,
    mountContent: UU5.PropTypes.oneOf([
      MOUNT_CONTENT_VALUES.onEachOpen,
      MOUNT_CONTENT_VALUES.onFirstOpen,
      MOUNT_CONTENT_VALUES.onFirstRender
    ]),
    offsetTop: UU5.PropTypes.oneOfType([UU5.PropTypes.number, UU5.PropTypes.string]),
    location: UU5.PropTypes.oneOf(["local", "portal"])
  },
  //@@viewOff:propTypes

  //@@viewOn:getDefaultProps
  getDefaultProps() {
    return {
      size: "m",
      shown: false,
      sticky: false,
      stickyBackground: true,
      scrollableBackground: false,
      forceRender: false,
      onClose: null,
      overflow: false,
      mountContent: undefined,
      offsetTop: null,
      location: undefined
    };
  },
  //@@viewOff:getDefaultProps

  //@@viewOn:reactLifeCycle
  getInitialState() {
    this._closeCallbacks = [];
    this._openCounter = 0;

    let renderContent = getMountContent(this.props) === MOUNT_CONTENT_VALUES.onFirstRender || this.props.shown;

    return {
      header: renderContent ? this.getHeader() : null,
      content: renderContent ? this.getContent() || this.props.children : null,
      footer: renderContent ? this.getFooter() : null,
      className: null,
      size: this.props.size,
      sticky: this.props.sticky,
      stickyBackground: this.props.stickyBackground,
      scrollableBackground: this.props.scrollableBackground,
      onClose: this.props.onClose,
      overflow: this.props.overflow,
      openKey: undefined
    };
  },

  UNSAFE_componentWillMount() {
    this.setState({ hidden: !this.props.shown });
  },

  componentDidMount() {
    if (this._shouldOpenPageModal() && this.props.shown) {
      this.open();
    }
    if (!this.isSticky()) {
      UU5.Environment.EventListener.addWindowEvent("keydown", this.getId(), this._onCloseESC);
    }
    this._updateAfterCommit(true);
  },

  componentDidUpdate(prevProps, prevState) {
    this._updateAfterCommit(prevState.hidden);
  },

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.controlled) {
      this.setState(function(state) {
        let newState = {};

        if (nextProps.shown && state.hidden) {
          newState.hidden = false;
        } else if (!nextProps.shown && !state.hidden) {
          newState.hidden = true;
        }

        newState.header = nextProps.header;
        newState.footer = nextProps.footer;
        newState.content = nextProps.content || nextProps.children || state.content;
        newState.size = nextProps.size;
        newState.sticky = nextProps.sticky;
        newState.stickyBackground = nextProps.stickyBackground;
        newState.scrollableBackground = nextProps.scrollableBackground;
        newState.onClose = nextProps.onClose;

        return newState;
      });
    }
  },

  componentWillUnmount() {
    // close page modal if local modal is unmounting
    if (this._shouldOpenPageModal()) {
      let page = this.getCcrComponentByKey(UU5.Environment.CCRKEY_PAGE);
      let centralModal = page.getModal();
      centralModal.close({ shouldOnClose: false, _referrer: this });
    }

    enableBodyScrolling("modal-" + this.getId(), true);

    UU5.Environment.EventListener.removeWindowEvent("keydown", this.getId(), this._onCloseESC);
  },
  //@@viewOff:reactLifeCycle

  //@@viewOn:interface
  isModal() {
    return true;
  },

  open(openProps, setStateCallback) {
    openProps = openProps || {};
    let _referrer = openProps._referrer;
    this._openProps = openProps;
    if (this._shouldOpenPageModal()) {
      let page = this.getCcrComponentByKey(UU5.Environment.CCRKEY_PAGE);
      let centralModal = page.getModal();
      let newProps = UU5.Common.Tools.merge(this.props, openProps, { _referrer: this });
      centralModal.open(newProps, setStateCallback);
    } else {
      let newState = this._getOpenProps(openProps);

      newState.hidden = newState.hidden || false;
      newState._referrer = _referrer;
      newState.renderContent = true;
      newState.openKey = this._openCounter++;

      this.setState(newState, setStateCallback);
    }
    return this;
  },

  isOpen() {
    let result;
    if (this._shouldOpenPageModal()) {
      let page = this.getCcrComponentByKey(UU5.Environment.CCRKEY_PAGE);
      let centralModal = page.getModal();
      result = centralModal.isOpen();
    } else {
      result = !this.isHidden();
    }
    return result;
  },

  close(shouldOnClose = true, setStateCallback) {
    let _referrer;
    if (typeof shouldOnClose === "function") {
      setStateCallback = shouldOnClose;
      shouldOnClose = true;
    } else if (shouldOnClose != null && typeof shouldOnClose === "object") {
      _referrer = shouldOnClose._referrer;
      shouldOnClose = shouldOnClose.shouldOnClose;
    }

    // check if component that closing modal is the same that opens it
    if (_referrer && this.state._referrer !== _referrer) {
      // modal is trying to be close by another component that opens it
      return this;
    }

    if (this._shouldOpenPageModal()) {
      let page = this.getCcrComponentByKey(UU5.Environment.CCRKEY_PAGE);
      let centralModal = page.getModal();
      centralModal.close({ shouldOnClose, _referrer }, setStateCallback);
    } else if (typeof this.state.onClose === "function" && shouldOnClose !== false) {
      this.state.onClose({ component: this, closeType: this.getDefault().closeTypes.ifc, callback: setStateCallback });
    } else {
      this._close(setStateCallback);
    }
    return this;
  },

  toggle(setStateCallback) {
    if (this._shouldOpenPageModal()) {
      let page = this.getCcrComponentByKey(UU5.Environment.CCRKEY_PAGE);
      let centralModal = page.getModal();
      if (centralModal.isHidden()) {
        let openProps = this._getOpenProps(this._openProps);
        centralModal.open(openProps, setStateCallback);
      } else {
        centralModal.close(true, setStateCallback);
      }
    } else {
      if (this.state.hidden) {
        this.setState({ hidden: false }, setStateCallback);
      } else {
        this._close(setStateCallback);
      }
    }

    return this;
  },

  isSticky() {
    return this.state.sticky;
  },

  onCloseDefault(opt, setStateCallback) {
    this._close(setStateCallback);

    return this;
  },
  //@@viewOff:interface

  //@@viewOn:overriding
  buildHeaderChild_(headerTypes) {
    let headerType = this.getHeaderType(headerTypes);

    let headerChild;
    if (headerType === "contentOfStandardHeader") {
      headerChild = <Header content={headerTypes.header} />;
      headerChild = this.cloneChild(headerChild, this.expandHeaderProps(headerChild));
    }

    return headerChild;
  },

  expandHeaderProps_(headerChild) {
    let extendedHeaderProps = this._extendPartProps(headerChild.props, "header");
    if (extendedHeaderProps) {
      extendedHeaderProps._sticky = this.state.sticky;
      extendedHeaderProps._onClose = this._onCloseHandler;
    }
    return extendedHeaderProps;
  },

  buildFooterChild_(footerTypes) {
    let footerType = this.getFooterType(footerTypes);

    let footerChild;
    if (footerType === "contentOfStandardFooter") {
      footerChild = <Footer content={footerTypes.footer} />;
      footerChild = this.cloneChild(footerChild, this.expandFooterProps(footerChild));
    }

    return footerChild;
  },

  expandFooterProps_(footerChild) {
    return this._extendPartProps(footerChild.props, "footer");
  },
  //@@viewOff:overriding

  //@@viewOn:private
  _updateAfterCommit(prevHidden) {
    let { hidden, scrollableBackground } = this.state;
    if (hidden && !prevHidden) {
      // became closed
      let { _closeCallbacks } = this;
      this._closeCallbacks = [];
      this._flushCloseCallbacks = () => _closeCallbacks.forEach(fn => (typeof fn === "function" ? fn() : null));
      this._closeTimeout = setTimeout(() => {
        delete this._closeTimeout;

        enableBodyScrolling("modal-" + this.getId(), scrollableBackground);

        if (this.isRendered()) {
          this.setState(
            {
              header: this.state.renderContent ? this.state.header || this.getHeader() : null,
              content: this.state.renderContent ? this.state.content || this.getContent() || this.props.children : null,
              footer: this.state.renderContent ? this.state.footer || this.getFooter() : null,
              renderContent: true
            },
            this._flushCloseCallbacks
          );
        }
      }, this.getDefault().animationDuration);
    } else if (!hidden && prevHidden) {
      // became opened

      // stop closing animation if we were in the process of closing window (but call callbacks if any were registered)
      if (this._closeTimeout) {
        clearTimeout(this._closeTimeout);
        delete this._closeTimeout;
        this._flushCloseCallbacks();
      }
      // hide body scrollbars
      if (!scrollableBackground) disableBodyScrolling("modal-" + this.getId());
    }
  },

  _onCloseESC(e) {
    e.which === 27 && !this.isHidden() && !this.isSticky() && this._blur(e);
    return this;
  },

  _onBlurHandler(event) {
    event.target.id === this.getId() && this._blur(event);
    return this;
  },

  _onCloseHandler(e) {
    let opt = { component: this, event: e, closeType: this.getDefault().closeTypes.closedButton };

    if (typeof this.state.onClose === "function") {
      this.state.onClose(opt);
    } else {
      this.onCloseDefault(opt);
    }

    return this;
  },

  _blur(e) {
    if (typeof this.state.onClose === "function") {
      this.state.onClose({ component: this, event: e, closeType: this.getDefault().closeTypes.blur });
    } else {
      this._close();
    }
    return this;
  },

  _close(setStateCallback) {
    if (this.isRendered()) {
      let callCallbackHere; // if we're already hidden then nothing will be done in componentDidUpdate and therefore we'll have to call setStateCallback here right away
      this.setState(
        state => {
          callCallbackHere = state.hidden;
          if (!callCallbackHere) this._closeCallbacks.push(setStateCallback);
          return {
            hidden: true,
            renderContent: getMountContent(this.props, state) !== MOUNT_CONTENT_VALUES.onEachOpen
          };
        },
        () => {
          if (callCallbackHere && typeof setStateCallback === "function") setStateCallback();
        }
      );
    }
  },

  _getEventPath(e) {
    let path = [];
    let node = e.target;
    while (node != document.body && node != document.documentElement && node) {
      path.push(node);
      node = node.parentNode;
    }
    return path;
  },

  _findTarget(e) {
    let modalMatch = "[id='" + this.getId() + "'] .uu5-bricks-modal-dialog";
    let result = {
      dialog: false
    };
    let eventPath = this._getEventPath(e);
    eventPath.every(item => {
      let functionType = item.matches ? "matches" : "msMatchesSelector";
      if (item[functionType]) {
        if (item[functionType](modalMatch)) {
          result.dialog = true;
        }
        return true;
      } else {
        return false;
      }
    });

    return result;
  },

  _getMainAttrs(hidden = this.isHidden()) {
    let mainAttrs = this.getMainAttrs();

    // id because of checking backdrop on click in _onBlurHandler function
    mainAttrs.id = this.getId();
    this.state.footer && (mainAttrs.className += " " + this.getClassName("isFooter"));
    this.state.className && (mainAttrs.className += " " + this.state.className);
    if (!this.state.sticky && !this.state.stickyBackground) {
      let allowBlur = true;
      mainAttrs.onMouseDown = e => {
        let clickData = this._findTarget(e.nativeEvent);
        if (clickData.dialog) {
          allowBlur = false;
        }
      };
      mainAttrs.onMouseUp = e => {
        if (allowBlur) {
          let clickData = this._findTarget(e.nativeEvent);
          if (clickData.dialog) {
            allowBlur = false;
          }
        }
      };
      mainAttrs.onClick = e => {
        if (allowBlur) {
          this._onBlurHandler(e);
        }
        allowBlur = true;
      };
    }

    if (this.state.overflow) {
      mainAttrs.className += " " + this.getClassName("overflow");
    }

    mainAttrs.className = mainAttrs.className.replace(/\s*\buu5-common-hidden\b\s*/, " ").trim();
    if (hidden) mainAttrs.className += " uu5-common-hidden";

    let sec = this.getDefault().animationDuration / 1000 + "s";
    mainAttrs.style = mainAttrs.style || {};
    mainAttrs.style.WebkitTransitionDuration = sec;
    mainAttrs.style.MozTransitionDuration = sec;
    mainAttrs.style.OTransitionDuration = sec;
    mainAttrs.style.transitionDuration = sec;

    return mainAttrs;
  },

  _getOpenProps(props = {}) {
    let newProps = {};
    newProps.header = props.header === undefined ? this.props.header : props.header;
    newProps.footer = props.footer === undefined ? this.props.footer : props.footer;
    newProps.content = props.content === undefined ? this.getContent() : props.content; // default value is null
    newProps.className = props.className === undefined ? this.props.className : props.className;
    newProps.size = props.size === undefined ? this.props.size : props.size;
    newProps.sticky = props.sticky === undefined ? this.props.sticky : props.sticky;
    newProps.stickyBackground =
      props.stickyBackground === undefined ? this.props.stickyBackground : props.stickyBackground;
    newProps.scrollableBackground =
      props.scrollableBackground === undefined ? this.props.scrollableBackground : props.scrollableBackground;
    newProps.onClose = props.onClose === undefined ? this.props.onClose : props.onClose;
    newProps.overflow = props.overflow === undefined ? this.props.overflow : props.overflow;
    newProps.mountContent = props.mountContent === undefined ? this.props.mountContent : props.mountContent;

    if ((newProps.content === undefined || newProps.content === null) && (this.props.children || props.children)) {
      newProps.content = props.children === undefined ? this.props.children : props.children;
    }

    return newProps;
  },

  _extendPartProps(partProps, part) {
    let newProps = {};

    // default values is used if child is set as react element so null or undefined will not set!!!
    for (let key in partProps) {
      partProps[key] !== null && partProps[key] !== undefined && (newProps[key] = partProps[key]);
    }

    newProps.key = newProps.id;

    return newProps;
  },

  _extendBodyProps(bodyProps) {
    let id = this.getId() + "-body";
    let className = this.state.overflow ? this.getClassName("bodyOverflow") : null;

    let newProps = {
      id: id,
      className: className
    };

    // default values is used if child is set as react element so null or undefined will not set!!!
    for (let key in bodyProps) {
      bodyProps[key] !== null && bodyProps[key] !== undefined && (newProps[key] = bodyProps[key]);
    }

    return UU5.Common.Tools.merge(newProps, { key: newProps.id });
  },
  _shouldOpenPageModal() {
    let page = this.getCcrComponentByKey(UU5.Environment.CCRKEY_PAGE);
    return (
      !this.props.location &&
      !this.props.forceRender &&
      page &&
      page.getModal() &&
      page.getModal().getId() !== this.getId()
    );
  },

  _buildChildren() {
    let header = this.state.header;
    let footer = this.state.footer;
    let bodyContent = this.state.content;

    let headerChild;
    let footerChild;

    if (!bodyContent && !header) {
      header = this.getDefault().header;
      bodyContent = this.getDefault().body;
    }

    header && (headerChild = this.buildHeaderChild({ header: header }));
    footer && (footerChild = this.buildFooterChild({ footer: footer }));

    let bodyProps = this._extendBodyProps({ content: bodyContent });

    let bodyChild;

    if (bodyProps.content) {
      bodyChild = this.buildChildren({
        children: UU5.Common.Element.create(Body, bodyProps)
      });
    }

    return [headerChild, bodyChild, footerChild];
  },

  _renderModal(getContentFn) {
    let { location } = this.props;
    let result;
    if (location === "portal") {
      let { openKey } = this.state;
      result = (
        <RenderIntoPortal>
          <DoubleRender renderKey={openKey} doubleRenderOnMount={false}>
            {renderAs => {
              let hidden = this.isHidden() || (renderAs === DoubleRender.FIRST_RENDER ? true : false);
              return getContentFn(hidden);
            }}
          </DoubleRender>
        </RenderIntoPortal>
      );
    } else {
      result = getContentFn();
    }
    return result;
  },
  //@@viewOff:private

  //@@viewOn:render
  render() {
    // Todo uu5-size is maped to bootstrap-size
    // let size;
    // switch (this.state.size) {
    //   case 'l':
    //     size = 'lg';
    //     break;
    //   case 'm':
    //     size = 'md';
    //     break;
    //   default:
    //     size = 'sm';
    //     break;
    // }

    // disable rendering of modal if there is a modal on the page
    if (this._shouldOpenPageModal()) {
      return null;
    }

    return this.getNestingLevel()
      ? this._renderModal(hidden => (
          <div {...this._getMainAttrs(hidden)}>
            <div className={this.getClassName("dialog") + " " + this.getClassName("modalSize") + this.state.size}>
              {this._buildChildren()}
              {this.getDisabledCover()}
            </div>
          </div>
        ))
      : null;
  }
  //@@viewOff:render
});

export default Modal;
