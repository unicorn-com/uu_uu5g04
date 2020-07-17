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
import ns from "./bricks-editable-ns.js";
import Css from "./css.js";
import EditableLsi from "./bricks-editable-lsi.js";

const DEFAULT_PROPS_MAP = {
  header: null,
  mountContent: undefined
};

const editablePropsComponentSetup = [
  {
    name: "size",
    type: "switchSelector",
    label: EditableLsi.common.sizeLabel,
    getProps: () => ({
      items: [
        { value: "s", content: <UU5.Bricks.Lsi lsi={EditableLsi.common.sizeValueS} /> },
        { value: "m", content: <UU5.Bricks.Lsi lsi={EditableLsi.common.sizeValueM} /> },
        { value: "l", content: <UU5.Bricks.Lsi lsi={EditableLsi.common.sizeValueL} /> },
        { value: "xl", content: <UU5.Bricks.Lsi lsi={EditableLsi.common.sizeValueXL} /> }
      ]
    })
  },
  [
    { name: "iconExpanded", type: "iconPicker", label: EditableLsi.panel.iconExpandedLabel },
    { name: "iconCollapsed", type: "iconPicker", label: EditableLsi.panel.iconCollapsedLabel }
  ],
  {
    name: "iconAlign",
    type: "switchSelector",
    label: EditableLsi.panel.iconAlignLabel,
    getProps: (props, componentProps) => ({
      disabled: !(componentProps.iconExpanded && componentProps.iconCollapsed),
      items: [
        { value: "left", content: <UU5.Bricks.Lsi lsi={EditableLsi.panel.iconAlignValueLeft} /> },
        { value: "right", content: <UU5.Bricks.Lsi lsi={EditableLsi.panel.iconAlignValueRight} /> },
        { value: "after", content: <UU5.Bricks.Lsi lsi={EditableLsi.panel.iconAlignValueAfter} /> }
      ]
    })
  },
  [
    { name: "expanded", type: "bool", label: EditableLsi.panel.expandedLabel },
    { name: "alwaysExpanded", type: "bool", label: EditableLsi.panel.alwaysExpandedLabel }
  ]
];

const editableDisplayPropsSetup = [
  {
    name: "colorSchemaHeader",
    type: "colorSchema",
    label: EditableLsi.panel.colorSchemaHeaderLabel
  },
  {
    name: "colorSchemaContent",
    type: "colorSchema",
    label: EditableLsi.panel.colorSchemaContentLabel
  },
  {
    name: "elevation",
    type: "switchSelector",
    label: EditableLsi.panel.elevationLabel,
    getProps: () => ({
      items: [{ value: 0 }, { value: 1 }, { value: 2 }, { value: 3 }, { value: 4 }, { value: 5 }]
    })
  },
  { name: "borderRadius" },
  {
    name: "bgStyleHeader",
    type: "bgStyle",
    label: EditableLsi.panel.bgStyleHeaderLabel
  },
  {
    name: "bgStyleContent",
    type: "bgStyle",
    label: EditableLsi.panel.bgStyleContentLabel
  },
  {
    name: "openClick",
    type: "switchSelector",
    label: EditableLsi.panel.openClickLabel,
    getProps: ({ value }) => ({
      value: value || "header",
      items: [
        { value: "header", content: <UU5.Bricks.Lsi lsi={EditableLsi.panel.openClickValueHeader} /> },
        { value: "icon", content: <UU5.Bricks.Lsi lsi={EditableLsi.panel.openClickValueIcon} /> }
      ]
    })
  },
  {
    name: "mountContent",
    type: "switchSelector",
    label: EditableLsi.panel.mountContentLabel,
    getProps: () => ({
      items: [
        { value: "onEachExpand", content: <UU5.Bricks.Lsi lsi={EditableLsi.panel.mountContentValueOnEachExpand} /> },
        { value: "onFirstExpand", content: <UU5.Bricks.Lsi lsi={EditableLsi.panel.mountContentValueOnFirstExpand} /> }
      ],
      message: <UU5.Bricks.Lsi lsi={EditableLsi.panel.mountContentDescription} />
    })
  }
];

const editablePropsSetup = [
  {
    name: <UU5.Bricks.Lsi lsi={EditableLsi.common.componentPropsLabel} />,
    setup: editablePropsComponentSetup
  },
  {
    name: <UU5.Bricks.Lsi lsi={EditableLsi.common.displayPropsLabel} />,
    setup: editableDisplayPropsSetup
  }
];

export const PanelEditable = UU5.Common.VisualComponent.create({
  //@@viewOn:mixins
  mixins: [UU5.Common.BaseMixin],
  //@@viewOff:mixins

  //@@viewOn:statics
  statics: {
    tagName: ns.name("PanelEditable"),
    classNames: {
      main: "panel-editable",
      switchSelector: Css.css`
        margin: -4px 0;
      `,
      panel: Css.css`
        .uu5-bricks-panel-header-content {
          width: 100%;
        }
      `
    },
    lsi: () => ({ ...EditableLsi.panel, ...EditableLsi.common })
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
    let props = this.props.component.getEditablePropsValues(Object.keys(DEFAULT_PROPS_MAP));
    return {
      ...props,
      mountContent: props.mountContent || "onEachExpand",
      editationModalOpen: false
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
    let { editationModalOpen, ...result } = state;

    for (let propName in DEFAULT_PROPS_MAP) {
      if (result[propName] !== undefined && result[propName] === DEFAULT_PROPS_MAP[propName]) {
        result[propName] = undefined;
      }
    }

    return result;
  },

  _onChangeRenderedItem({ value }) {
    this.setState({ activeItemIndex: value });
  },

  _onCloseEditationModal(newProps) {
    if (newProps) {
      this.setState({ ...newProps, editationModalOpen: false }, () => this.props.component.saveEditation(newProps));
    } else {
      this.setState({ editationModalOpen: false });
    }
  },

  _onSettingsClick() {
    //EditationModal will use the content/children value of the component, but it's children can be already in edit mode, so their actual values can be lost, so endChildrenEditation and make sure that data are correct.
    this.props.component.endChildrenEditation();
    this.setState(state => ({ editationModalOpen: !state.editationModalOpen }));
  },

  _renderMoreSettingsModal() {
    return (
      <UU5.BricksEditable.Modal
        componentName={this.props.component.getTagName()}
        componentProps={{
          ...this.props.component.getEditablePropsValues(Object.keys(this.props.component.props)),
          mountContent: this.state.mountContent
        }}
        componentPropsForm={editablePropsSetup}
        shown={this.state.editationModalOpen}
        onClose={this._onCloseEditationModal}
        header={<UU5.Bricks.Lsi lsi={EditableLsi.panel.modalHeader} />}
      />
    );
  },

  _changeHeaderContent(opt) {
    this.setState({ header: opt.value });
  },

  //@@viewOff:private

  //@@viewOn:render
  render() {
    let panelClassName = (this.state.className ? this.state.className + " " : "") + this.getClassName("panel");
    let { ref_, ...panelProps } = this.props.component.props;

    return (
      <>
        <UU5.BricksEditable.Toolbar
          {...this.getMainPropsToPass()}
          onClose={this._onEndEditation}
          onMoreSettingsClick={this._onSettingsClick}
        >
          {[
            <UU5.Bricks.Panel
              {...panelProps}
              className={panelClassName}
              key="editablePanel"
              expanded
              header={
                <UU5.BricksEditable.Input
                  value={this.state.header || ""}
                  placeholder={this.getLsi("headerPlaceholder")}
                  onChange={this._changeHeaderContent}
                  key="headerInput"
                  mainAttrs={{ onClick: e => e.stopPropagation() }}
                >
                  {({ children }) => children}
                </UU5.BricksEditable.Input>
              }
            >
              {this.props.component.getChildren()}
            </UU5.Bricks.Panel>
          ]}
        </UU5.BricksEditable.Toolbar>
        {this.state.editationModalOpen ? this._renderMoreSettingsModal() : null}
      </>
    );
  }
  //@@viewOff:render
});

export default PanelEditable;
