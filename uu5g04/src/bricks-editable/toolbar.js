import * as UU5 from "uu5g04";
import "uu5g04-bricks";
import "uu5g04-forms";

import ns from "./bricks-editable-ns.js";
import { ToolbarContext, withContext } from "./toolbar-context.js";
import EditationPanel from "./internal/editation-panel.js";
import ToolbarButton from "./internal/toolbar-button.js";
import ToolbarDropdown from "./internal/toolbar-dropdown.js";
import ToolbarSeparator from "./internal/toolbar-separator.js";
import Css from "./internal/css.js";

const NAME = ns.name("Toolbar");

const DEFAULT_ITEM_PROPS = {
  bgStyle: "transparent",
  colorSchema: "default"
};

export const Toolbar = UU5.Common.VisualComponent.create({
  //@@viewOn:mixins
  mixins: [UU5.Common.BaseMixin, UU5.Common.ContentMixin],
  //@@viewOff:mixins

  //@@viewOn:statics
  statics: {
    tagName: NAME,
    classNames: {
      main: () =>
        ns.css("toolbar") +
        " " +
        Css.css(`
        background-color: white;

        .uu5-bricks-row-flex > & {
          flex: 0 0 100%;
        }
      `)
    }
  },
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {
    items: UU5.PropTypes.arrayOf(
      UU5.PropTypes.oneOfType([
        UU5.PropTypes.shape({
          type: UU5.PropTypes.oneOfType([UU5.PropTypes.oneOf(["button", "dropdown"]), UU5.PropTypes.func]),
          props: UU5.PropTypes.oneOfType([UU5.PropTypes.func, UU5.PropTypes.object])
        }),
        UU5.PropTypes.element
      ])
    ),
    settingsItems: UU5.PropTypes.arrayOf(UU5.PropTypes.oneOfType([UU5.PropTypes.object, UU5.PropTypes.element])),
    moreSettings: UU5.PropTypes.func,
    onMoreSettingsClick: UU5.PropTypes.func,
    onClose: UU5.PropTypes.func
  },
  //@@viewOff:propTypes

  //@@viewOn:getDefaultProps
  getDefaultProps() {
    return {
      items: undefined,
      settingsItems: undefined,
      moreSettings: undefined,
      onMoreSettingsClick: undefined,
      onClose: undefined
    };
  },
  //@@viewOff:getDefaultProps

  //@@viewOn:reactLifeCycle
  getInitialState() {
    return { dynamicContent: undefined, activeInput: undefined };
  },
  //@@viewOff:reactLifeCycle

  //@@viewOn:interface
  open(dynamicContent, newActiveInput, setStateCallback) {
    this.setState({ dynamicContent, activeInput: newActiveInput || this.state.activeInput }, setStateCallback);
    return this;
  },

  close(setStateCallback) {
    this.setState({ dynamicContent: undefined, activeInput: undefined }, setStateCallback);
    return this;
  },

  openSettings(setStateCallback) {
    this._toolbar.openSettings(setStateCallback);
    return this;
  },

  closeSettings(setStateCallback) {
    this._toolbar.closeSettings(setStateCallback);
    return this;
  },

  openMoreSettings(setStateCallback) {
    this._toolbar.openMoreSettings(setStateCallback);
    return this;
  },

  closeMoreSettings(setStateCallback) {
    this._toolbar.closeMoreSettings(setStateCallback);
    return this;
  },
  //@@viewOff:interface

  //@@viewOn:overridingMethods
  //@@viewOff:overridingMethods

  //@@viewOn:private
  _lockInput() {
    // e.preventDefault();
    if (this.state.activeInput) {
      this.state.activeInput.setReadOnly(true);
    }
  },

  _unlockInput() {
    if (this.state.activeInput) {
      this.state.activeInput.setReadOnly(false, this.state.activeInput.focus);
    }
  },

  _getPanelComponents(content) {
    let components;

    if (Array.isArray(content)) {
      components = content.map((contentItem, index) => {
        let props;
        if (typeof contentItem.props === "function") {
          props = { ...DEFAULT_ITEM_PROPS, ...contentItem.props() };
        } else {
          props = { ...DEFAULT_ITEM_PROPS, ...contentItem.props };
        }

        const key =
          props.key ||
          (this.state.activeInput ? this.state.activeInput.getId() + " " + index : UU5.Common.Tools.generateUUID());

        if (contentItem.type !== "separator") {
          // separator is an exception
          const origOnApply = props.onClick;
          props.onClick = (...args) => {
            let result = typeof origOnApply === "function" && origOnApply(...args);
            Promise.resolve()
              .then(() => result)
              .then(() => this._unlockInput());
          };
        }

        if (typeof contentItem.type !== "string") {
          return <contentItem.type {...props} key={key} />;
        } else if (typeof contentItem === "object") {
          if (contentItem.type === "button") {
            return <ToolbarButton {...props} key={key} />;
          } else if (contentItem.type === "dropdown") {
            return <ToolbarDropdown {...props} key={key} />;
          } else if (contentItem.type === "separator") {
            return <ToolbarSeparator {...props} key={key} />;
          }
        }
      });
    }

    return components;
  },

  _registerToolbar(panel) {
    this._toolbar = panel;
  },

  _getPanelContent() {
    let result = [];

    if (this.props.items) {
      result.push(this._getPanelComponents(this.props.items));
    }

    if (this.state.dynamicContent) {
      result.push(this._getPanelComponents(this.state.dynamicContent));
    }

    return result;
  },
  //@@viewOff:private

  //@@viewOn:render
  render() {
    return (
      <ToolbarContext.Provider value={{ open: this.open, close: this.close }}>
        <EditationPanel
          {...this.getMainPropsToPass()}
          ref_={this._registerToolbar}
          onEndEditation={this.props.onClose}
          settingsItems={this.props.settingsItems}
          moreSettings={this.props.moreSettings}
          onMoreSettingsClick={this.props.onMoreSettingsClick}
          activeInput={this.state.activeInput}
        >
          {this._getPanelContent()}
        </EditationPanel>
        {this.props.children}
      </ToolbarContext.Provider>
    );
  }
  //@@viewOff:render
});

Toolbar.withContext = withContext;

export default Toolbar;
