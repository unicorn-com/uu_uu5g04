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
import Column from "../column.js";
import Footer from "../footer.js";
import Header from "../header.js";
import Lsi from "../lsi.js";
import EditableLsi from "./bricks-editable-lsi.js";
import Css from "./css.js";
import { PresetEditComponent, ColWidthEditComponent } from "./modal-editation-components.js";
//@@viewOff:imports

const DEFAULT_PROPS_MAP = {
  contentEditable: false,
  noSpacing: false,
  level: null,
  underline: false,
  display: "standard",
  header: "",
  footer: "",
  content: null,
  children: null,
};

const MAIN_CLASS_NAME = ns.css("row");
const NAME = ns.name("Row");

const propsSetup = [
  {
    name: <Lsi lsi={EditableLsi.row.mainPropertiesLabel} />,
    setup: [
      PresetEditComponent,
      {
        name: "display",
        type: "switchSelector",
        label: EditableLsi.row.displayLabel,
        getProps: () => ({
          items: [
            { value: "standard", content: <Lsi lsi={EditableLsi.row.displayValueStandard} /> },
            { value: "flex", content: <Lsi lsi={EditableLsi.row.displayValueFlex} /> },
          ],
        }),
      },
      {
        name: "noSpacing",
        type: "switchSelector",
        label: EditableLsi.row.horizontalPaddingLabel,
        getProps: () => ({
          items: [
            { value: false, content: <Lsi lsi={EditableLsi.row.horizontalPaddingValueStandard} /> },
            { value: true, content: <Lsi lsi={EditableLsi.row.horizontalPaddingValueNone} /> },
          ],
        }),
      },
      {
        name: "className",
        type: "text",
        label: <Lsi lsi={EditableLsi.row.classNameLabel} />,
      },
    ],
  },
];

const editableItemPropsSetup = {
  setup: [
    ColWidthEditComponent,
    {
      name: "noSpacing",
      type: "switchSelector",
      label: EditableLsi.row.horizontalPaddingLabel,
      getProps: () => ({
        items: [
          { value: false, content: <Lsi lsi={EditableLsi.row.horizontalPaddingValueStandard} /> },
          { value: true, content: <Lsi lsi={EditableLsi.row.horizontalPaddingValueNone} /> },
        ],
      }),
    },
    {
      name: "className",
      type: "text",
      label: <Lsi lsi={EditableLsi.row.classNameLabel} />,
    },
  ],
};

const newEditableItem = {
  tagName: "UU5.Bricks.Column",
  isElement: true,
  props: {
    contentEditable: true,
  },
};

function getEditableItemLabel(item, itemIndex) {
  return `Column ${itemIndex + 1}`;
}

export const Row = UU5.Common.VisualComponent.create({
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

          &.uu5-forms-checkbox {
            margin-bottom: 0px;
          }

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
    },
    lsi: () => ({ ...EditableLsi.row, ...EditableLsi.common }),
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
    let editedProps = this.props.component.getEditablePropsValues(Object.keys(DEFAULT_PROPS_MAP));

    return {
      ...editedProps,
      showFooter: !!editedProps.footer,
      showHeader: !!editedProps.header,
      editModalOpen: false,
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
  _onEndEditation() {
    this.props.component.endEditation(this._getPropsToSave());
  },

  _getPropsToSave(state = this.state) {
    // unused vars are here just to separate them from the result
    // eslint-disable-next-line no-unused-vars
    let { children, content, flex, editModalOpen, showHeader, showFooter, ...result } = state;

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

  _onCloseEditationModal(newProps) {
    if (newProps) {
      let newState = { ...newProps };
      delete newState.children;
      delete newState.content;
      this.setState({ ...newState, editModalOpen: false }, () => this.props.component.saveEditation(newProps));
    } else {
      this.setState({ editModalOpen: false });
    }
  },

  _openEditModal() {
    this.setState({ editModalOpen: true });
  },

  _closeEditModal() {
    this.setState({ editModalOpen: false });
  },

  _toggleHeader() {
    this.setState((state) => ({
      showHeader: !state.showHeader,
    }));
  },

  _toggleFooter() {
    this.setState((state) => ({
      showFooter: !state.showFooter,
    }));
  },

  _toggleUnderline() {
    this.setState((state) => ({ underline: !state.underline }));
  },

  _toggleDisplay() {
    this.setState(
      (state) => ({ display: state.display === "flex" ? "standard" : "flex" }),
      () => {
        this.props.component.saveEditation({ display: this.state.display });
      }
    );
  },

  _changeLevel(value) {
    this.setState({ level: value });
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
    levelItems.unshift({ content: this.getLsiComponent("defaultLevel"), value: null });

    return [
      {
        type: "separator",
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
            tooltip: this.getLsiValue("levelTooltip"),
            items: levelItems,
            onClick: this._changeLevel,
          };
        },
      },
    ];
  },

  _getToolbarItems() {
    return [
      {
        type: "button",
        props: () => {
          return {
            pressed: this.state.editModalOpen,
            icon: "mdi-view-column",
            onClick: this._openEditModal,
            tooltip: this.getLsiValue("layoutTooltip"),
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
        value: this.state.display === "flex",
        onClick: this._toggleDisplay,
        label: this.getLsiComponent("flexCheckboxLabel"),
      },
    ];
  },

  _renderEditModal() {
    return (
      <UU5.Common.Suspense fallback="">
        <UU5.BricksEditable.Modal
          shown
          onClose={this._onCloseEditationModal}
          componentName={this.props.component.getTagName()}
          componentProps={this.props.component.getEditablePropsValues(Object.keys(this.props.component.props))}
          componentPropsForm={propsSetup}
          itemName={Column.tagName}
          itemDefaultProps={Column.defaultProps}
          itemPropsForm={editableItemPropsSetup}
          newItem={newEditableItem}
          getItemLabel={getEditableItemLabel}
        />
      </UU5.Common.Suspense>
    );
  },
  //@@viewOff:private

  //@@viewOn:render
  render() {
    return (
      <>
        <UU5.BricksEditable.Toolbar
          {...this.getMainPropsToPass()}
          onClose={this._onEndEditation}
          items={this._getToolbarItems()}
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
                  <Header underline={this.state.underline} level={this.state.level} parent={this.props.component}>
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
        {this.state.editModalOpen ? this._renderEditModal() : null}
      </>
    );
  },
  //@@viewOff:render
});

export default Row;
