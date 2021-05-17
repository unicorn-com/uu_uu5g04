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
import ns from "./bricks-editable-ns.js";
import Lsi from "../lsi.js";
import Panel from "../panel.js";
import EditableLsi from "./bricks-editable-lsi.js";
import { EditItemInfo } from "./modal-editation-components.js";
//@@viewOff:imports

const DEFAULT_PROPS_MAP = {
  onClickNotCollapseOthers: false,
  iconExpanded: null,
  iconCollapsed: null,
  size: "m",
  iconAlign: null,
  openClick: null,
};

const MAIN_CLASS_NAME = ns.css("accordion-editable");
const NAME = ns.name("AccordionEditable");

const editablePropsComponentSetup = [
  {
    name: "size",
    type: "switchSelector",
    label: EditableLsi.common.sizeLabel,
    getProps: () => ({
      items: [
        { value: "s", content: <Lsi lsi={EditableLsi.common.sizeValueS} /> },
        { value: "m", content: <Lsi lsi={EditableLsi.common.sizeValueM} /> },
        { value: "l", content: <Lsi lsi={EditableLsi.common.sizeValueL} /> },
        { value: "xl", content: <Lsi lsi={EditableLsi.common.sizeValueXL} /> },
      ],
    }),
  },
  [
    { name: "iconExpanded", type: "iconPicker", label: EditableLsi.panel.iconExpandedLabel },
    { name: "iconCollapsed", type: "iconPicker", label: EditableLsi.panel.iconCollapsedLabel },
  ],
  {
    name: "iconAlign",
    type: "switchSelector",
    label: EditableLsi.panel.iconAlignLabel,
    getProps: () => ({
      items: [
        { value: "left", content: <Lsi lsi={EditableLsi.panel.iconAlignValueLeft} /> },
        { value: "right", content: <Lsi lsi={EditableLsi.panel.iconAlignValueRight} /> },
        { value: "after", content: <Lsi lsi={EditableLsi.panel.iconAlignValueAfter} /> },
      ],
    }),
  },
  { name: "onClickNotCollapseOthers", type: "bool", label: EditableLsi.accordion.onClickNotCollapseOthersLabel },
];

const editableAdditionalPropsSetup = [
  {
    name: "openClick",
    type: "switchSelector",
    label: EditableLsi.panel.openClickLabel,
    getProps: ({ value }) => ({
      value: value || "header",
      items: [
        { value: "header", content: <Lsi lsi={EditableLsi.panel.openClickValueHeader} /> },
        { value: "icon", content: <Lsi lsi={EditableLsi.panel.openClickValueIcon} /> },
      ],
    }),
  },
  {
    name: "mountPanelContent",
    type: "switchSelector",
    label: EditableLsi.accordion.mountPanelContentLabel,
    getProps: () => ({
      items: [
        {
          value: "onEachExpand",
          content: <Lsi lsi={EditableLsi.accordion.mountPanelContentValueOnEachExpand} />,
        },
        {
          value: "onFirstExpand",
          content: <Lsi lsi={EditableLsi.accordion.mountPanelContentValueOnFirstExpand} />,
        },
      ],
      message: <Lsi lsi={EditableLsi.accordion.mountPanelContentDescription} />,
    }),
  },
];

const editablePropsSetup = [
  {
    name: <Lsi lsi={EditableLsi.common.componentPropsLabel} />,
    setup: editablePropsComponentSetup,
  },
  {
    name: <Lsi lsi={EditableLsi.common.advancedPropsLabel} />,
    setup: editableAdditionalPropsSetup,
  },
];

const editableItemPropsSetup = { setup: EditItemInfo };
const newEditableItem = {
  tagName: "UU5.Bricks.Panel",
  isElement: true,
  props: {
    contentEditable: true,
  },
};
function getEditableItemLabel(itemProps, itemIndex) {
  return `Panel ${itemIndex + 1}`;
}

export const AccordionEditable = UU5.Common.VisualComponent.create({
  //@@viewOn:mixins
  mixins: [UU5.Common.BaseMixin],
  //@@viewOff:mixins

  //@@viewOn:statics
  statics: {
    tagName: NAME,
    classNames: {
      main: MAIN_CLASS_NAME,
    },
    lsi: () => ({ ...EditableLsi.common, ...EditableLsi.panel, ...EditableLsi.accordion }),
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
    let props = this.props.component.getEditablePropsValues(Object.keys(DEFAULT_PROPS_MAP));
    return {
      ...props,
      mountPanelContent: props.mountPanelContent || "onEachExpand",
      editationModalOpen: false,
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
  _registerEditToolbar(toolbar) {
    this._editToolbar = toolbar;
  },

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

  _onCloseEditationModal(newProps) {
    if (newProps) {
      let newState = { ...newProps };
      delete newState.children;
      delete newState.content;
      this.setState({ ...newState, editationModalOpen: false }, () => this.props.component.saveEditation(newProps));
    } else {
      this.setState({ editationModalOpen: false });
    }
  },

  _onSettingsClick() {
    //EditationModal will use the content/children value of the component, but it's children can be already in edit mode, so their actual values can be lost, so endChildrenEditation and make sure that data are correct.
    this.props.component.endChildrenEditation();
    this.setState((state) => ({ editationModalOpen: !state.editationModalOpen }));
  },

  _renderEditModal() {
    let itemsSource;

    if (this.props.component.props.panels) {
      itemsSource = "panels";
    } else if (this.props.component.props.content) {
      itemsSource = "content";
    } else if (this.props.component.props.children) {
      itemsSource = "children";
    }

    return (
      <UU5.Common.Suspense fallback="">
        <UU5.BricksEditable.Modal
          shown
          onClose={this._onCloseEditationModal}
          componentName={this.props.component.getTagName()}
          componentProps={{
            ...this.props.component.getEditablePropsValues(Object.keys(this.props.component.props)),
            mountPanelContent: this.state.mountPanelContent,
          }}
          componentPropsForm={editablePropsSetup}
          itemsSource={itemsSource}
          itemName={Panel.tagName}
          itemDefaultProps={Panel.defaultProps}
          itemPropsForm={editableItemPropsSetup}
          newItem={newEditableItem}
          getItemLabel={getEditableItemLabel}
          header={<Lsi lsi={EditableLsi.accordion.modalHeader} />}
        />
      </UU5.Common.Suspense>
    );
  },

  _renderPanels() {
    let content = {};

    if (this.props.component.props.panels) {
      content = { tag: "UU5.Bricks.Panel", propsArray: this.props.component.props.panels };
    } else if (this.props.component.props.content) {
      content = this.props.component.props.content;
    } else if (this.props.component.props.children) {
      content = this.props.component.props.children;
    } else {
      return null;
    }
    if (this.props.inline) {
      return this.props.component.buildChildren({ content }, () => ({ parent: null, nestingLevel: "bigBox" }));
    } else {
      this.props.component.buildChildren({ content });
    }
  },
  //@@viewOff:private

  //@@viewOn:render
  render() {
    return (
      <>
        <UU5.BricksEditable.Toolbar
          {...this.getMainPropsToPass()}
          ref_={this._registerEditToolbar}
          onClose={this._onEndEditation}
          onMoreSettingsClick={this._onSettingsClick}
        >
          {this._renderPanels()}
        </UU5.BricksEditable.Toolbar>
        {this.state.editationModalOpen ? this._renderEditModal() : null}
      </>
    );
  },
  //@@viewOff:render
});

export default AccordionEditable;
