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
  noSpacing: false,
  underline: false,
  level: null,
  colWidth: "",
  width: "",
  header: "",
  footer: "",
  content: null,
  children: null
};

const MAIN_CLASS_NAME = ns.css("column");
const NAME = ns.name("Column");

function getColWidthValue(value) {
  // normalize value to string
  if (value && typeof value === "object") {
    return UU5.Common.Tools.buildColWidthClassName(value)
      .replace(/uu5-col-/g, "")
      .replace(/xs|s|m|l|xl/g, match => `${match}-`);
  } else {
    return value;
  }
}

const propsSetup = [
  {
    name: "Properties",
    setup: [
      {
        name: "colWidth",
        type: "text",
        label: Lsi.column.colWidthLabel,
        getProps: props => ({
          value: getColWidthValue(props.value),
          message: <UU5.Bricks.Lsi lsi={Lsi.column.colWidthTooltip} />,
          onChange: ({ value, component }) => {
            component.setFeedback("initial", <UU5.Bricks.Lsi lsi={Lsi.column.colWidthTooltip} />, value);
          }
        })
      },
      {
        name: "noSpacing",
        type: "switchSelector",
        label: Lsi.column.horizontalPaddingLabel,
        getProps: () => ({
          items: [
            { value: false, content: <UU5.Bricks.Lsi lsi={Lsi.column.horizontalPaddingValueStandard} /> },
            { value: true, content: <UU5.Bricks.Lsi lsi={Lsi.column.horizontalPaddingValueNone} /> }
          ]
        })
      },
      {
        name: "className",
        type: "text",
        label: <UU5.Bricks.Lsi lsi={Lsi.column.classNameLabel} />
      }
    ]
  }
];

export const Column = UU5.Common.VisualComponent.create({
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
      separator: () =>
        Css.css(`
          margin: 0;
          width: 100%;
        `),
      settings: () =>
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
        `),
      settingsForm: () =>
        Css.css(`
          &:last-child {
            margin-bottom: 24px;
          }
        `)
    },
    lsi: () => ({ ...Lsi.column, ...Lsi.common }),
    defaults: {
      colWidthRegexp: /([a-z])+(?:-)?(\d+)/
    }
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

    values.width = values.width || "";
    values.colWidth = values.colWidth || "";
    return {
      ...values,
      showFooter: !!values.footer,
      showHeader: !!values.header,
      editModalOpen: false
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
    let { showFooter, showHeader, editModalOpen, children, content, ...result } = state;

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
      this.setState({ ...newProps, editModalOpen: false }, () => this.props.component.saveEditation(newProps));
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

  _registerSettingsForm(form) {
    this._settingsForm = form;
  },

  _registerToolbar(ref) {
    this._toolbar = ref;
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

  _changeLevel(value) {
    this.setState({ level: value });
  },

  _changeHeaderContent(opt) {
    this.setState({ header: opt.value });
  },

  _changeFooterContent(opt) {
    this.setState({ footer: opt.value });
  },

  _saveSettings(opt) {
    if (opt.values.width.match(this.getDefault("colWidthRegexp"))) {
      opt.values.colWidth = opt.values.width;
      opt.values.width = null;
    } else {
      opt.values.colWidth = null;
    }

    this.setState({ ...opt.values }, () => this.props.component.saveEditation({ ...opt.values }));
  },

  _cancelSettings() {
    this._toolbar.closeMoreSettings();
  },

  _getControlsForm() {
    return this._settingsForm;
  },

  _getSettingsFormControls() {
    return (
      <UU5.Forms.Controls
        getForm={this._getControlsForm}
        buttonCancelProps={{
          content: this.getLsiComponent("controlsCancelButton")
        }}
        buttonSubmitProps={{
          content: this.getLsiComponent("controlsSubmitButton")
        }}
      />
    );
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
            onClick: this._toggleUnderline,
            tooltip: this.getLsiValue("underlineTooltip"),
            icon: "mdi-format-underline",
            pressed: this.state.underline
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
            onClick: this._changeLevel,
            value: this.state.level,
            label,
            tooltip: this.getLsiValue("levelTooltip"),
            items: levelItems
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

  _getToolbarProps() {
    let props = this.getMainPropsToPass();

    props.onClose = this._onEndEditation;
    props.onMoreSettingsClick = this._openEditModal;
    props.settingsItems = this._getToolbarSettings();
    props.ref_ = this._registerToolbar;

    return props;
  },

  _renderEditModal() {
    return (
      <UU5.Common.Suspense fallback="">
        <UU5.BricksEditable.Modal
          shown
          componentProps={this.props.component.getEditablePropsValues(Object.keys(this.props.component.props))}
          onClose={this._onCloseEditationModal}
          componentName={this.props.component.getTagName()}
          componentPropsForm={propsSetup}
        />
      </UU5.Common.Suspense>
    );
  },
  //@@viewOff:private

  //@@viewOn:render
  render() {
    return (
      <>
        <UU5.BricksEditable.Toolbar {...this._getToolbarProps()}>
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
        {this.state.editModalOpen ? this._renderEditModal() : null}
      </>
    );
  }
  //@@viewOff:render
});

export default Column;
