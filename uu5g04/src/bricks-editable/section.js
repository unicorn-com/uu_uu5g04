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

import React from "react";
import PropTypes from "prop-types";
import createReactClass from "create-react-class";
import * as UU5 from "uu5g04";
import "uu5g04-bricks";
import "uu5g04-forms";

import ns from "./bricks-editable-ns.js";
import EditationPanel from "./internal/editation-panel.js";
import ColorSquare from "./internal/color-square.js";
import Lsi from "./bricks-editable-lsi.js";
import Css from "./internal/css.js";

const COLOR_SCHEMAS = [
  "indigo",
  "blue",
  "light-blue",
  "cyan",
  "teal",
  "green",
  "light-green",
  "lime",
  "yellow",
  "amber",
  "orange",
  "deep-orange",
  "red",
  "pink",
  "purple",
  "deep-purple",
  "brown",
  "grey",
  "blue-grey",
  "black",
  "white"
];

const DEFAULT_PROPS_MAP = {
  contentEditable: false,
  underline: false,
  level: null,
  header: "",
  footer: "",
  colorSchema: "default",
  content: null,
  children: null
};

const MAIN_CLASS_NAME = ns.css("section");
const NAME = ns.name("Section");

export const Section = createReactClass({
  displayName: NAME,
  //@@viewOn:mixins
  mixins: [UU5.Common.BaseMixin],
  //@@viewOff:mixins

  //@@viewOn:statics
  statics: {
    tagName: NAME,
    classNames: {
      main: MAIN_CLASS_NAME,

      select: () =>
        Css.css(`
        vertical-align: bottom;

        &:hover {
          background: #EEEEEE;
        }

        .uu5-forms-items-input {
          cursor: pointer;
          background: transparent;

          &.uu5-forms-items-input.uu5-forms-items-input {
            border-color: transparent;
            box-shadow: none;
            
            &:focus {
              border-color: #BDBDBD;
            }
          }


          &.uu5-forms-items-input.uu5-forms-items-input {
            width: 150px;
          }

          + .uu5-bricks-popover {
            min-width: 150px;

            a {
              padding: 5px 32px 6px 8px;
            }
          }
        }
        
        &.uu5-forms-select-open {
          background: #E0E0E0;

          .uu5-forms-items-input.uu5-forms-items-input {
            &:focus {
              border-color: transparent;
            }
          }
        }`),
      headerAndFooter: () =>
        Css.css(`
          &.uu5-bricks-header {
            margin-top: 0;
          }

          .uu5-forms-input {
            font-size: inherit;
            line-height: inherit;
            margin: 0px;
            min-height: 1em;

            .uu5-forms-input-form-item.uu5-forms-input-form-item {
              height: auto;
              padding: 0;
              font-weight: inherit;
              color: inherit;
              border-top-color: transparent;
              border-left-color: transparent;
              border-right-color: transparent;
              outline: none;
              box-shadow: none;
              background: transparent;

              &:not(:hover), &:focus {
                border-bottom-color: transparent;
              }
            }
          }
        `),
      colorButton: () =>
        Css.css(`
          position: relative;

          & > .uu5-bricks-icon.uu5-bricks-icon.uu5-bricks-icon {
            margin-right: -10px;
            position: relative;
            top: -2px;
          }

          & > div {
            position: absolute;
            bottom: -1px;
            left: 0;
          }
        `),
      outlineButton: () =>
        Css.css(`
          &.uu5-bricks-button {
            border: 1px solid transparent;

            &.active,
            &:active,
            &.active:hover,
            &:active:hover,
            &.active:focus,
            &:active:focus,
            &:hover {
              border-color: transparent;
            }
          }

          &:not(.active):not(:hover):not(:active):focus {
            background: transparent;
            border-color: #BDBDBD;
          }
      `),
      colorSchemaPopover: () =>
        Css.css(`
          width: 300px;

          .uu5-bricks-popover-body {
            & > div:last-child {
              justify-content: center;
              max-width: 100%;
            }
          }
        `),
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
            background: transparent;
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
      richtextToolbar: () =>
        Css.css(`
          &.uu5-richtext-toolbar {
            border: none;
            background: transparent;

            .uu5-richtext-toolbar-button.uu5-bricks-button.active,
            & > .uu5-bricks-dropdown .uu5-richtext-toolbar-button.active,
            & > .uu5-bricks-dropdown>div>.uu5-bricks-button.active,
            & > .uu5-bricks-dropdown a .uu5-richtext-toolbar-dropdown-button.active {
              background-color: #E0E0E0;
            }

            .uu5-richtext-toolbar-button.uu5-bricks-button:not(.active):hover,
            & > .uu5-bricks-dropdown .uu5-richtext-toolbar-button:not(.active):hover,
            & > .uu5-bricks-dropdown>div>.uu5-bricks-button:not(.active):hover,
            & > .uu5-bricks-dropdown a .uu5-richtext-toolbar-dropdown-button:hover {
              background-color: #EEEEEE;
            }

            .uu5-richtext-toolbar-button.uu5-bricks-button:not(.active):focus,
            & > .uu5-bricks-dropdown .uu5-richtext-toolbar-button:not(.active):focus,
            & > .uu5-bricks-dropdown>div>.uu5-bricks-button:not(.active):focus,
            & > .uu5-bricks-dropdown a .uu5-richtext-toolbar-dropdown-button:focus {
              background-color: transparent;
              border: 1px solid #BDBDBD;
            }
          }
        `)
    },
    lsi: Lsi.section
  },
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {
    component: PropTypes.object.isRequired
  },
  //@@viewOff:propTypes

  //@@viewOn:getDefaultProps
  getDefaultProps() {
    return {
      component: null
    };
  },
  //@@viewOff:getDefaultProps

  //@@viewOn:standardComponentLifeCycle
  getInitialState() {
    this._defaultProps = { ...DEFAULT_PROPS_MAP };
    let values = this.props.component.getEditablePropsValues(Object.keys(this._defaultProps));

    // normalize level to string
    if (typeof values.level === "number") {
      values.level = "" + values.level;
    } else {
      values.level = values.level || "";
    }

    // remember use of content or children
    this._useContent = !!values.content;

    values.level = [values.level];
    return {
      ...values,
      showFooter: !!values.footer,
      showHeader: true,
      showColors: false,
      showRichTextToolbar: false
    };
  },
  //@@viewOff:standardComponentLifeCycle

  //@@viewOn:interface
  //@@viewOff:interface

  //@@viewOn:overridingMethods
  getPropsToSave() {
    return this._getPropsToSave();
  },
  //@@viewOff:overridingMethods

  //@@viewOn:componentSpecificHelpers
  // props actions
  _onEndEditation() {
    // this.props.component.saveEditation(this._getPropsToSave()); // not work in current dcc - need to fiddle new version of DCC
    this.props.component.endEditation(this._getPropsToSave());
  },

  _getPropsToSave(state = this.state) {
    // eslint-disable-next-line no-unused-vars
    let { showFooter, showHeader, showColors, showRichTextToolbar, children, content, ...result } = this.state;

    // add header and footer to result props
    result.header = showHeader ? this._headerInput.getValue() : undefined;
    result.footer = showFooter ? this._footerInput.getValue() : undefined;

    // level is in array due to use in select component and to prevent creating new arrays in each render
    result.level = result.level[0] || undefined;

    // handle chenges in content
    if (!this.state.contentEditable) {
      let value = this._richtext.getValue();
      if (this._useContent) {
        result.content = value;
        if (!result.content || result.content.match(/^<uu5string\s*\/>\s*<br\s*\/>\s*$/)) {
          result.content = undefined;
        }
        result.children = undefined;
      } else {
        result.children = value.replace(/^<uu5string\s\/>/, "");
        if (!result.children || result.children.match(/^<uu5string\s*\/>\s*<br\s*\/>\s*$/)) {
          result.children = undefined;
        }
        result.content = undefined;
      }
    }

    for (let propName in DEFAULT_PROPS_MAP) {
      if (result[propName] !== undefined && result[propName] === DEFAULT_PROPS_MAP[propName]) {
        result[propName] = undefined;
      }
    }

    return result;
  },

  _toggleColorSchemaPicker(component) {
    this.setState(
      state => ({ showColors: !state.showColors }),
      () => {
        if (this.state.showColors) {
          this._colorSchemaPopover.open({
            aroundElement: component.findDOMNode(),
            position: "bottom",
            onClose: () => this.setState({ showColors: false })
          });
        } else {
          this._colorSchemaPopover.close();
        }
      }
    );
  },

  _getRichTextToolbar() {
    return this._richtextToolbar;
  },

  _showRichTextToolbar() {
    this.setState({ showRichTextToolbar: true });
  },

  _hideRichTextToolbar() {
    this._richtextToolbar.setItems(this._richtext, []);
    this.setState({ showRichTextToolbar: false });
  },

  // registration components
  _registerHeaderInput(input) {
    this._headerInput = input;
  },

  _registerFooterInput(input) {
    this._footerInput = input;
  },

  _registerColorSchemaPopover(popover) {
    this._colorSchemaPopover = popover;
  },

  _registerRichTextToolbar(toolbar) {
    this._richtextToolbar = toolbar;
  },

  _registerRichText(richtext) {
    this._richtext = richtext;
  },

  _registerPanel(panel) {
    this._panel = panel;
  },
  // change state handlers
  _toggleUnderline(opt) {
    this.setState(state => ({ underline: !state.underline }));
  },

  _toggleHeader() {
    this._panel.closeSettings();
    this.setState(state => ({
      showHeader: !state.showHeader,
      header: state.showHeader ? this._headerInput.getValue() : state.header
    }));
  },

  _toggleFooter() {
    this._panel.closeSettings();
    this.setState(state => ({
      showFooter: !state.showFooter,
      footer: state.showFooter ? this._footerInput.getValue() : state.footer
    }));
  },

  _toggleContentEditable(opt) {
    this._panel.closeSettings();
    let result = {};
    this.setState(
      state => {
        result.contentEditable = !state.contentEditable;

        // if content was edited by local richtext editor, we must save value
        if (!state.contentEditable) {
          const value = this._richtext.getValue();
          if (this._useContent) {
            result.content = value;
          } else {
            result.children = value.replace(/^<uu5string\s\/>/, "");
          }
        } else {
          result = { ...result, ...this.props.component.getEditablePropsValues(["content", "children"]) };

          // remember use of content or children
          this._useContent = !!result.content;
        }

        return result;
      },
      () => {
        this.props.component.saveEditation(result);
      }
    );
  },

  _changeLevel(opt) {
    this.setState({ level: [opt.value] });
  },

  _changeHeaderText(opt) {
    this.setState({ header: opt.value });
  },

  _changeColorSchema(colorSchema) {
    this.setState({ colorSchema, showColors: false }, () => {
      this.props.component.saveEditation({
        colorSchema: !colorSchema || colorSchema === "default" ? undefined : colorSchema
      });
      this._colorSchemaPopover.close();
    });
  },

  _getHeaderMargin() {
    let level = parseInt(this.state.level[0])
    if (isNaN(level)) return 32;

    switch (level) {
      case 0:
      case 1:
        return 48;
      case 2:
        return 40;
      default:
        return 32;
    }
  },
  //@@viewOff:componentSpecificHelpers

  //@@viewOn:render
  render() {
    const mainProps = this.getMainPropsToPass();
    if (this.state.noSpacing) {
      mainProps.className += " " + Css.css(`margin-top: ${this._getHeaderMargin()}px;`);
    }
    return [
      <EditationPanel
        {...mainProps}
        key="panel"
        ref_={this._registerPanel}
        onEndEditation={this._onEndEditation}
        settingsContent={[
          <UU5.Forms.Checkbox
            name="header"
            key="header"
            label={this.getLsiValue("showHeaderCheckboxLabel")}
            labelPosition="right"
            mainAttrs={{ onMouseDown: this._toggleHeader }}
            value={this.state.showHeader}
            colorSchema="default"
            className={this.getClassName("checkbox")}
          />,
          <UU5.Forms.Checkbox
            name="footer"
            key="footer"
            label={this.getLsiValue("showFooterCheckboxLabel")}
            labelPosition="right"
            mainAttrs={{ onMouseDown: this._toggleFooter }}
            value={this.state.showFooter}
            colorSchema="default"
            className={this.getClassName("checkbox")}
          />,
          <UU5.Forms.Checkbox
            name="contenteditable"
            key="contentEditable"
            label={this.getLsiValue("contenteditableCheckboxLabel")}
            mainAttrs={{ onMouseDown: this._toggleContentEditable }}
            value={this.state.contentEditable}
            labelPosition="right"
            colorSchema="default"
            className={this.getClassName("checkbox")}
          />
        ]}
      >
        <UU5.Common.TagPlaceholder
          tagName="UU5.RichText.Toolbar"
          props={{
            key: "richtext-toolbar",
            ref_: this._registerRichTextToolbar,
            controlled: false,
            className: this.getClassName("richtextToolbar")
          }}
        />
        {!this.state.showRichTextToolbar && [
          <UU5.Bricks.Button
            pressed={this.state.underline}
            baseline
            bgStyle="transparent"
            onClick={this._toggleUnderline}
            colorSchema="default"
            key="underline-button"
            className={this.getClassName("outlineButton")}
            tooltip={this.getLsiValue("underlineTooltip")}
          >
            <UU5.Bricks.Icon icon="mdi-format-underline" />
          </UU5.Bricks.Button>,
          <UU5.Bricks.Button
            baseline
            bgStyle="transparent"
            onClick={this._toggleColorSchemaPicker}
            pressed={this.state.showColors}
            className={`${this.getClassName("colorButton")} ${this.getClassName("outlineButton")}`}
            colorSchema="default"
            key="colorschema-button"
            tooltip={this.getLsiValue("colorSchemaTooltip")}
          >
            <UU5.Bricks.Icon icon="mdi-palette" />
            <ColorSquare className="color-viewer" colorSchema={this.state.colorSchema} width="24px" height="4px" />
          </UU5.Bricks.Button>,
          <UU5.Forms.Select
            value={this.state.level}
            onChange={this._changeLevel}
            nestingLevel="inline"
            colorSchema="default"
            className={this.getClassName("select")}
            key="header-level-select"
            tooltip={this.getLsiValue("levelTooltip")}
            openToContent={false}
          >
            <UU5.Forms.Select.Option value="" content={this.getLsiValue("defaultLevel")} />
            {[1, 2, 3, 4, 5, 6].map(level => (
              <UU5.Forms.Select.Option
                key={"option_" + level}
                value={`${level}`}
                content={`${this.getLsiValue("level")} ${level}`}
              />
            ))}
          </UU5.Forms.Select>
        ]}
      </EditationPanel>,
      this.state.showHeader ? (
        <UU5.Bricks.Header
          key="header"
          level={this.state.level[0] || null}
          underline={this.state.underline}
          colorSchema={this.state.colorSchema}
          parent={this.props.component}
          className={this.getClassName("headerAndFooter")}
        >
          <UU5.Forms.Text
            value={this.state.header || ""}
            onChange={this._changeHeaderText}
            ref_={this._registerHeaderInput}
            placeholder={this.getLsiValue("headerPlaceholder")}
            colorSchema="default"
          />
        </UU5.Bricks.Header>
      ) : null,
      this.state.contentEditable ? (
        this.props.component.getChildren()
      ) : (
        <UU5.Common.TagPlaceholder
          tagName="UU5.RichText.Editor"
          key="content-editor"
          props={{
            ref_: this._registerRichText,
            value: this._useContent
              ? this.state.content
              : this.state.children
                ? "<uu5string />" + this.state.children
                : "",
            getToolbar: this._getRichTextToolbar,
            onFocus: this._showRichTextToolbar,
            onBlur: this._hideRichTextToolbar
          }}
        />
      ),
      this.state.showFooter ? (
        <UU5.Bricks.Footer className={this.getClassName("headerAndFooter")}>
          <UU5.Forms.Text
            value={this.state.footer || ""}
            controlled={false}
            ref_={this._registerFooterInput}
            placeholder={this.getLsiValue("footerPlaceholder")}
            colorSchema="default"
          />
        </UU5.Bricks.Footer>
      ) : null,
      <UU5.Bricks.Popover
        key="color-schema-popover"
        ref_={this._registerColorSchemaPopover}
        controlled={false}
        className={this.getClassName("colorSchemaPopover")}
      >
        <UU5.Bricks.Div>
          <ColorSquare
            colorSchema="default"
            onClick={this._changeColorSchema}
            label={this.getLsiValue("defaultColorSchema")}
          />
        </UU5.Bricks.Div>
        <UU5.Bricks.Div style={{ display: "flex", flexWrap: "wrap" }}>
          {COLOR_SCHEMAS.map(colorSchema => {
            return <ColorSquare key={colorSchema} colorSchema={colorSchema} onClick={this._changeColorSchema} />;
          })}
        </UU5.Bricks.Div>
      </UU5.Bricks.Popover>
    ];
  }
  //@@viewOff:render
});

export default Section;
