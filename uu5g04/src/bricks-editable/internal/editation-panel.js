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
import "uu5g04-bricks";
import ns from "../bricks-editable-ns.js";
import Lsi from "../bricks-editable-lsi.js";

import SettingsCheckbox from "./settings-checkbox.js";
import Css from "./css.js";
import EndEditation from "../end-editation.js";
//@@viewOff:imports

const MAIN_CLASS_NAME = ns.css("editation-panel");

const DEFAULT_ITEM_PROPS = {
  colorSchema: "default"
};

export const EditationPanel = UU5.Common.VisualComponent.create({
  displayName: "EditationPanel", // for backward compatibility (test snapshots)
  //@@viewOn:mixins
  mixins: [UU5.Common.BaseMixin, UU5.Common.PureRenderMixin, UU5.Common.ElementaryMixin],
  //@@viewOff:mixins

  //@@viewOn:statics
  statics: {
    tagName: ns.name("EditationPanel"),
    classNames: {
      main: () =>
        MAIN_CLASS_NAME +
        " " +
        Css.css(`
          position: relative;
          display: flex;
          justify-content: space-between;
          align-items: stretch;
          border-bottom: 1px solid #E3E3E3;

          > * {
            min-width: 0px;
          }
        `),
      leftToolbarSide: Css.css(`
        flex: 1 1 auto;
        padding: 4px;
      `),
      rightToolbarSide: Css.css(` flex: 0 0 auto; `),
      cogwheelButton: Css.css(`
        color: rgba(0,0,0,0.54);
        background-color: transparent;
        margin: 4px 8px 4px 0;
      `),
      separator: () =>
        Css.css(`
          margin: 0;
          width: 100%;
        `),
      settingsButton: () =>
        Css.css(`
          &.uu5-bricks-button {
            background-color: transparent;
            width: 100%;
            text-align: left;
            margin-bottom: 4px;

            &:hover {
              background-color: #EEEEEE;
            }
          }
        `),
      settingsModal: () =>
        Css.css(`
          .uu5-bricks-modal-header {
            font-size: 18px;
            color: #303030;
            border-bottom: solid 1px #BDBDBD;
          }

          .uu5-bricks-modal-footer {
            padding: 0;
            border-top: solid 1px #BDBDBD;
          }

          .uu5-bricks-modal-body {
            padding: 0;
          }
        `)
    },
    lsi: Lsi.editablePanel
  },
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {
    onEndEditation: UU5.PropTypes.func,
    settingsItems: UU5.PropTypes.arrayOf(UU5.PropTypes.oneOfType([UU5.PropTypes.object, UU5.PropTypes.element])),
    moreSettings: UU5.PropTypes.func,
    onSettingsClick: UU5.PropTypes.func,
    onMoreSettingsClick: UU5.PropTypes.func,
    activeInput: UU5.PropTypes.object
  },
  //@@viewOff:propTypes

  //@@viewOn:getDefaultProps
  getDefaultProps() {
    return {
      onEndEditation: null,
      settingsItems: null,
      moreSettings: null,
      onSettingsClick: null,
      onMoreSettingsClick: null,
      activeInput: null
    };
  },
  //@@viewOff:getDefaultProps

  //@@viewOn:reactLifeCycle
  getInitialState() {
    if (this.props.activeInput) {
      this._hasListener = true;
    } else {
      this._hasListener = false;
    }

    return {
      settingsOpen: false,
      moreSettingsOpen: false
    };
  },

  componentWillReceiveProps(nextProps) {
    if (nextProps.activeInput && !this._hasListener) {
      this._addEvent();
    } else if (!nextProps.activeInput && this._hasListener) {
      this._removeEvent();
    }
  },
  //@@viewOff:reactLifeCycle

  //@@viewOn:interface
  openSettings(setStateCallback) {
    this._openSettings(this._button, setStateCallback);
  },

  closeSettings(setStateCallback) {
    this._closeSettings(setStateCallback);
  },

  openMoreSettings(setStateCallback) {
    this._openMoreSettings(setStateCallback);
  },

  closeMoreSettings(setStateCallback) {
    this._closeMoreSettings(setStateCallback);
  },
  //@@viewOff:interface

  //@@viewOn:overriding
  //@@viewOff:overriding

  //@@viewOn:private
  _addEvent() {
    this._hasListener = true;
    window.addEventListener("mousedown", this._handleMouseDown, true);
  },

  _removeEvent() {
    this._hasListener = false;
    window.removeEventListener("mousedown", this._handleMouseDown, true);
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

  _isBlur(e) {
    let result = true;
    let eventPath = this._getEventPath(e);

    eventPath.every(item => {
      if (item.id === this.getId()) {
        result = false;
        return false;
      }

      return true;
    });

    return result;
  },

  _handleMouseDown(e) {
    let isBlur = this._isBlur(e);

    if (!isBlur) {
      this._lockInput();
    } else {
      this._unlockInput();
    }
  },

  _lockInput() {
    if (this.props.activeInput) {
      this.props.activeInput.setReadOnly(true);
    }
  },

  _unlockInput() {
    if (this.props.activeInput) {
      this.props.activeInput.setReadOnly(false, this.props.activeInput.focus);
    }
  },

  _registerButton(ref) {
    this._button = ref;
  },

  _registerPopover(popover) {
    this._popover = popover;
  },

  _registerMoreSettingsModal(modal) {
    this._moreSettingsModal = modal;
  },

  _onMoreSettingsModalClose(opt) {
    this.setState({ moreSettingsOpen: false }, () => opt.component.onCloseDefault(opt));
  },

  _openMoreSettings(setStateCallback) {
    if (this._hasMoreSettings()) {
      this.setState({ moreSettingsOpen: true }, () => {
        if (this._moreSettingsModal) {
          this._moreSettingsModal.open(null, setStateCallback);
        } else if (typeof setStateCallback === "function") {
          setStateCallback();
        }
      });
    }
  },

  _closeMoreSettings(setStateCallback) {
    if (this._hasMoreSettings()) {
      if (this._moreSettingsModal) {
        this._moreSettingsModal.close(null, this.setState({ moreSettingsOpen: false }, setStateCallback));
      } else if (typeof setStateCallback === "function") {
        this.setState({ moreSettingsOpen: false }, setStateCallback);
      }
    }
  },

  _openSettings(component, setStateCallback) {
    if (this._hasSettings()) {
      const opts = {
        aroundElement: UU5.Common.DOM.findNode(component),
        position: "bottom-right",
        onClose: this._onClose
      };

      this.setState({ settingsOpen: true }, () => this._popover.open(opts, setStateCallback));
    }
  },

  _closeSettings(setStateCallback) {
    if (this._hasSettings()) {
      this._popover.close(() => this.setState({ settingsOpen: false }, setStateCallback));
    }
  },

  _hasMoreSettings() {
    return this.props.moreSettings || typeof this.props.onMoreSettingsClick === "function";
  },

  _hasSettings() {
    return this.props.settingsItems || typeof this.props.onSettingsClick === "function";
  },

  _onButtonClick(component) {
    if (this._hasSettings()) {
      this._toggleSettings(component, this.props.onSettingsClick);
    } else if (this._hasMoreSettings()) {
      this._toggleMoreSettings(this.props.onMoreSettingsClick);
    }
  },

  _onMoreSettingsClick() {
    if (this.state.moreSettingsOpen) {
      this._closeMoreSettings(this.props.onMoreSettingsClick);
    } else {
      this._openMoreSettings(this.props.onMoreSettingsClick);
    }

    this._closeSettings();
  },

  _toggleSettings(component, setStateCallback) {
    if (this.state.settingsOpen) {
      this._closeSettings(setStateCallback);
    } else {
      this._openSettings(component, setStateCallback);
    }
  },

  _toggleMoreSettings(setStateCallback) {
    if (this.state.moreSettingsOpen) {
      this._closeMoreSettings(setStateCallback);
    } else {
      this._openMoreSettings(setStateCallback);
    }
  },

  _onClose() {
    this._unlockInput();
    this.setState({ settingsOpen: false });
  },

  _getSettingsComponents(items) {
    let components = [];

    if (Array.isArray(items)) {
      components = items.map((itemProps, index) => {
        let props = { ...DEFAULT_ITEM_PROPS, ...itemProps };

        const key = props.key || index;
        const origOnApply = props.onClick;
        props.onClick = (...args) => {
          let result = origOnApply(...args);
          Promise.resolve()
            .then(() => result)
            .then(() => {
              this._closeSettings();
              this._unlockInput();
            });
        };

        return <SettingsCheckbox {...props} key={key} />;
      });
    }

    if (this.props.moreSettings || typeof this.props.onMoreSettingsClick === "function") {
      // TODO: Create a component Separator and SettingsButton
      components.push(
        <UU5.Bricks.Line key="separator" colorSchema="default" size={1} className={this.getClassName("separator")} />,
        <UU5.Bricks.Button
          key="moreSettings"
          onClick={this._onMoreSettingsClick}
          content={this.getLsiComponent("settingsButton")}
          colorSchema="default"
          className={this.getClassName("settingsButton")}
        />
      );
    }

    return components;
  },

  _getMainAttrs() {
    let mainAttrs = this.getMainAttrs();

    mainAttrs.id = this.getId();

    return mainAttrs;
  },
  //@@viewOff:private

  //@@viewOn:render
  render() {
    return (
      <div {...this._getMainAttrs()}>
        <div className={this.getClassName("leftToolbarSide")}>{this.props.children}</div>
        <div className={this.getClassName("rightToolbarSide")}>
          {typeof this.props.onEndEditation === "function" && <EndEditation onClick={this.props.onEndEditation} />}
          {(this.props.settingsItems ||
            this.props.moreSettings ||
            typeof this.props.onMoreSettingsClick === "function") && [
            <UU5.Bricks.Button
              key="props-button"
              title={this.getLsiValue("propsButtonTitle")}
              className={this.getClassName("cogwheelButton")}
              onClick={this._onButtonClick}
              ref_={this._registerButton}
              colorSchema="custom"
              pressed={this.state.settingsOpen}
              tooltip={this.getLsiValue("moreSettingsTooltip")}
            >
              <UU5.Bricks.Icon icon="mdi-settings" />
            </UU5.Bricks.Button>,
            this.props.settingsItems && (
              <UU5.Bricks.Popover key="edit-popover" ref_={this._registerPopover} forceRender controlled={false}>
                {this._getSettingsComponents(this.props.settingsItems)}
              </UU5.Bricks.Popover>
            )
          ]}
          {this.props.moreSettings && (
            <UU5.Bricks.Modal
              controlled={false}
              ref_={this._registerMoreSettingsModal}
              className={this.getClassName("settingsModal")}
              onClose={this._onMoreSettingsModalClose}
              {...this.props.moreSettings(this._closeMoreSettings)}
            />
          )}
        </div>
      </div>
    );
  }
  //@@viewOff:render
});

export default EditationPanel;
