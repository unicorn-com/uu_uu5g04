/**
 * Copyright (C) 2021 Unicorn a.s.
 *
 * This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public
 * License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later
 * version.
 *
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied
 * warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License at
 * <https://gnu.org/licenses/> for more details.
 *
 * You may obtain additional information at <https://unicorn.com> or contact Unicorn a.s. at address: V Kapslovne 2767/2,
 * Praha 3, Czech Republic or at the email: info@unicorn.com.
 */

//@@viewOn:imports
import * as UU5 from "uu5g04";

import ns from "./bricks-editable-ns.js";
import Footer from "../footer.js";
import Header from "../header.js";
import Css from "./css.js";
import ColorPicker from "./color-picker.js";
import EditableLsi from "./bricks-editable-lsi.js";
//@@viewOff:imports

const DEFAULT_PROPS_MAP = {
  contentEditable: false,
  underline: false,
  level: null,
  header: "",
  footer: "",
  colorSchema: "default",
  content: null,
  children: null,
  pageBreakBefore: false,
};

const MAIN_CLASS_NAME = ns.css("section");
const NAME = ns.name("Section");

export const Section = UU5.Common.VisualComponent.create({
  //@@viewOn:mixins
  mixins: [UU5.Common.BaseMixin],
  //@@viewOff:mixins

  //@@viewOn:statics
  statics: {
    tagName: NAME,
    classNames: {
      main: MAIN_CLASS_NAME,
      levelDropdown: () =>
        Css.css(`
          &.uu5-bricks-editable-toolbar-dropdown {
            width: 148px;
          }
        `),
    },
    lsi: () => ({ ...EditableLsi.section, ...EditableLsi.common }),
  },
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {
    component: UU5.PropTypes.object.isRequired,
  },
  //@@viewOff:propTypes

  //@@viewOn:getDefaultProps
  getDefaultProps() {
    return {
      component: null,
    };
  },
  //@@viewOff:getDefaultProps

  //@@viewOn:reactLifeCycle
  getInitialState() {
    let values = this.props.component.getEditablePropsValues(Object.keys(DEFAULT_PROPS_MAP));

    return {
      ...values,
      showFooter: !!values.footer,
      showHeader: true,
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
  _changeColorSchema(opt) {
    this.setState({ colorSchema: opt.value }, () => {
      this.props.component.saveEditation({
        colorSchema: !opt.value || opt.value === "default" ? undefined : opt.value,
      });
    });
  },

  _toggleHeader(value, setStateCallback) {
    this.setState(
      (state) => ({
        showHeader: !state.showHeader,
      }),
      setStateCallback
    );
  },

  _toggleFooter(value, setStateCallback) {
    this.setState(
      (state) => ({
        showFooter: !state.showFooter,
      }),
      setStateCallback
    );
  },

  _togglePageBreakBefore(value, setStateCallback) {
    this.setState(
      (state) => ({
        pageBreakBefore: !state.pageBreakBefore,
      }),
      setStateCallback
    );
  },

  _toggleUnderline() {
    this.setState((state) => ({ underline: !state.underline }));
  },

  _changeLevel(value, setStateCallback) {
    this.setState({ level: value }, setStateCallback);
  },

  _changeHeaderContent(opt) {
    this.setState({ header: opt.value });
  },

  _changeFooterContent(opt) {
    this.setState({ footer: opt.value });
  },

  _getHeaderToolbarItems() {
    let levelItems = [1, 2, 3, 4, 5, 6].map((level) => ({
      content: `${this.getLsiValue("level")} ${level}`,
      value: `${level}`,
    }));
    levelItems.unshift({ content: this.getLsiValue("defaultLevel"), value: null });

    return [
      {
        type: ColorPicker,
        props: () => {
          return {
            value: this.state.colorSchema,
            onClick: this._changeColorSchema,
            tooltip: this.getLsiValue("colorSchemaTooltip"),
          };
        },
      },
      {
        type: "button",
        props: () => {
          return {
            pressed: this.state.underline,
            onClick: this._toggleUnderline,
            tooltip: this.getLsiValue("underlineTooltip"),
            icon: "mdi-format-underline",
          };
        },
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
            onClick: this._changeLevel,
            tooltip: this.getLsiValue("levelTooltip"),
            items: levelItems,
            className: this.getClassName("levelDropdown"),
          };
        },
      },
    ];
  },

  _getToolbarSettings() {
    return [
      {
        value: this.state.showHeader,
        onClick: this._toggleHeader,
        label: this.getLsiComponent("showHeaderCheckboxLabel"),
      },
      {
        value: this.state.showFooter,
        onClick: this._toggleFooter,
        label: this.getLsiComponent("showFooterCheckboxLabel"),
      },
      {
        value: this.state.pageBreakBefore,
        onClick: this._togglePageBreakBefore,
        label: this.getLsiComponent("pageBreakBeforeCheckboxLabel"),
      },
    ];
  },
  //@@viewOff:private

  //@@viewOn:render
  render() {
    const mainProps = this.getMainPropsToPass();
    return (
      <UU5.BricksEditable.Toolbar
        {...mainProps}
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
                <Header
                  underline={this.state.underline}
                  level={this.state.level}
                  parent={this.props.inline ? undefined : this.props.component}
                  nestingLevel={undefined}
                >
                  {children}
                </Header>
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
              {({ children }) => <Footer parent={this.props.component}>{children}</Footer>}
            </UU5.BricksEditable.Input>
          ) : null,
        ]}
      </UU5.BricksEditable.Toolbar>
    );
  },
  //@@viewOff:render
});

export default Section;
