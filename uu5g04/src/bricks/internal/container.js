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

import * as UU5 from "uu5g04";
import "uu5g04-bricks";
//import "uu5g04-forms";
//import "uu5g04-bricks-editable";

import ns from "./bricks-editable-ns.js";
import Lsi from "./bricks-editable-lsi.js";
import Css from "./css.js";

const DEFAULT_PROPS_MAP = {
  contentEditable: false,
  underline: false,
  level: "",
  header: "",
  footer: "",
  content: null,
  children: null,
  noSpacing: false
};

const MAIN_CLASS_NAME = ns.css("container");
const NAME = ns.name("Container");

export const Container = UU5.Common.VisualComponent.create({
  //@@viewOn:mixins
  mixins: [UU5.Common.BaseMixin],
  //@@viewOff:mixins

  //@@viewOn:statics
  statics: {
    tagName: NAME,
    classNames: {
      main: MAIN_CLASS_NAME,
      checkbox: () =>
        Css.css(`
          cursor: pointer;
          margin-top: 0px;
          width: 100%;

          &:hover {
            background-color: #EEEEEE;
          }

          &:first-child {
            margin-top: 4px;
          }

          &:last-child {
            margin-bottom: 4px;
          }

          .uu5-forms-checkbox-button.uu5-forms-checkbox-button.uu5-forms-checkbox-button {
            border-color: transparent;
            background-color: transparent;
            outline: none;
          }

          label {
            cursor: pointer;
          }

          .uu5-forms-label {
            width: 80%;

            + .uu5-forms-input-wrapper {
              width: 20%;
            }
          }
        `),
      levelDropdown: () =>
        Css.css(`
          &.uu5-bricks-editable-toolbar-dropdown {
            width: 148px;
          }
        `)
    },
    lsi: () => ({ ...Lsi.container, ...Lsi.common })
  },
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {
    component: UU5.PropTypes.object.isRequired
  },
  //@@viewOff:propTypes

  //@@viewOn:getDefaultProps
  getDefaultProps() {
    return {
      component: null
    };
  },
  //@@viewOff:getDefaultProps

  //@@viewOn:reactLifeCycle
  getInitialState() {
    let values = this.props.component.getEditablePropsValues(Object.keys(DEFAULT_PROPS_MAP));

    return {
      ...values,
      showFooter: !!values.footer,
      showHeader: true
    };
  },
  //@@viewOff:reactLifeCycle

  //@@viewOn:interface
  getPropsToSave() {
    return this._getPropsToSave();
  },
  //@@viewOff:interface

  //@@viewOn:overridingMethods
  //@@viewOff:overridingMethods

  //@@viewOn:private
  // props actions
  _onEndEditation() {
    this.props.component.endEditation(this._getPropsToSave());
  },

  _getPropsToSave(state = this.state) {
    // unused vars are here just to separate them from the result
    // eslint-disable-next-line no-unused-vars
    let { showFooter, showHeader, children, content, ...result } = state;

    for (let propName in DEFAULT_PROPS_MAP) {
      if (result[propName] !== undefined && result[propName] === DEFAULT_PROPS_MAP[propName]) {
        result[propName] = undefined;
      }
    }

    // remove header or footer if they are not showed
    if (!showHeader) {
      result.header = undefined;
    }
    if (!showFooter) {
      result.footer = undefined;
    }

    return result;
  },

  // change state handlers
  _toggleHeader() {
    this.setState(state => ({
      showHeader: !state.showHeader
    }));
  },

  _toggleFooter() {
    this.setState(state => ({
      showFooter: !state.showFooter
    }));
  },

  _changeLevel(value) {
    this.setState({ level: value });
  },

  _toggleUnderline() {
    this.setState(state => ({ underline: !state.underline }));
  },

  _toggleNoSpacing() {
    this.setState(
      state => ({ noSpacing: !state.noSpacing }),
      () => {
        this.props.component.saveEditation({ noSpacing: this.state.noSpacing });
      }
    );
  },

  _changeHeaderContent(opt) {
    this.setState({ header: opt.value });
  },

  _changeFooterContent(opt) {
    this.setState({ footer: opt.value });
  },

  _getHeaderToolbarItems() {
    let levelItems = [1, 2, 3, 4, 5, 6].map(level => ({
      content: `${this.getLsiValue("level")} ${level}`,
      value: `${level}`
    }));
    levelItems.unshift({ content: this.getLsiValue("defaultLevel"), value: null });

    return [
      {
        type: "button",
        props: () => {
          return {
            pressed: this.state.underline,
            onClick: this._toggleUnderline,
            tooltip: this.getLsiValue("underlineTooltip"),
            icon: "mdi-format-underline"
          };
        }
      },
      {
        type: "dropdown",
        props: () => {
          let label = this.state.level
            ? `${this.getLsiValue("level")} ${this.state.level}`
            : `${this.getLsiValue("defaultLevel")}`;

          return {
            value: this.state.level,
            label,
            tooltip: this.getLsiValue("levelTooltip"),
            items: levelItems,
            onClick: this._changeLevel
          };
        }
      }
    ];
  },

  _getToolbarSettings() {
    return [
      {
        value: this.state.showHeader,
        onClick: this._toggleHeader,
        label: this.getLsiComponent("showHeaderCheckboxLabel")
      },
      {
        value: this.state.showFooter,
        onClick: this._toggleFooter,
        label: this.getLsiComponent("showFooterCheckboxLabel")
      },
      {
        value: this.state.noSpacing,
        onClick: this._toggleNoSpacing,
        label: this.getLsiComponent("noSpacingTooltip")
      }
    ];
  },
  //@@viewOff:private

  //@@viewOn:render
  render() {
    return (
      <UU5.BricksEditable.Toolbar
        {...this.getMainPropsToPass()}
        ref_={this._registerToolbar}
        onClose={this._onEndEditation}
        settingsItems={this._getToolbarSettings()}
      >
        {[
          this.state.showHeader ? (
            <UU5.BricksEditable.Input
              value={this.state.header || ""}
              placeholder={this.getLsi("headerPlaceholder")}
              onChange={this._changeHeaderContent}
              toolbarItems={this._getHeaderToolbarItems()}
              key="headerInput"
            >
              {({ children }) => (
                <UU5.Bricks.Header
                  underline={this.state.underline}
                  level={this.state.level}
                  parent={this.props.component}
                >
                  {children}
                </UU5.Bricks.Header>
              )}
            </UU5.BricksEditable.Input>
          ) : null,
          this.props.component.getChildren(),
          this.state.showFooter ? (
            <UU5.BricksEditable.Input
              value={this.state.footer || ""}
              placeholder={this.getLsi("footerPlaceholder")}
              onChange={this._changeFooterContent}
              key="footerInput"
            >
              {({ children }) => <UU5.Bricks.Footer parent={this.props.component}>{children}</UU5.Bricks.Footer>}
            </UU5.BricksEditable.Input>
          ) : null
        ]}
      </UU5.BricksEditable.Toolbar>
    );
  }
  //@@viewOff:render
});

export default Container;
