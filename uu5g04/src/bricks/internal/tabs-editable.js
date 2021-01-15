//@@viewOn:imports
import UU5 from "uu5g04";
//import "uu5g04-bricks";
//import "uu5g04-bricks-editable";

import TabsItem from "../tabs-item.js";
import ns from "./bricks-editable-ns.js";
import EditableLsi from "./bricks-editable-lsi.js";
//@@viewOff:imports

const getEditableItemLabel = (itemProps, itemIndex) => {
  if (itemProps.header) {
    return itemProps.header;
  } else {
    return `Item ${itemIndex + 1}`;
  }
};

const newEditableItem = {
  tagName: "UU5.Bricks.Tabs.Item",
  props: {
    header: "New Item",
    contentEditable: true,
  },
};

const editableComponentPropsSetup = [
  {
    name: "type",
    type: "switchSelector",
    label: EditableLsi.tabs.typeLabel,
    getProps: () => ({
      items: [
        { value: "tabs", content: <UU5.Bricks.Lsi lsi={EditableLsi.tabs.typeValueTabs} /> },
        { value: "pills", content: <UU5.Bricks.Lsi lsi={EditableLsi.tabs.typeValuePills} /> },
      ],
    }),
  },
  {
    name: "size",
    type: "switchSelector",
    label: EditableLsi.common.sizeLabel,
    getProps: () => ({
      items: [
        { value: "s", content: <UU5.Bricks.Lsi lsi={EditableLsi.common.sizeValueS} /> },
        { value: "m", content: <UU5.Bricks.Lsi lsi={EditableLsi.common.sizeValueM} /> },
        { value: "l", content: <UU5.Bricks.Lsi lsi={EditableLsi.common.sizeValueL} /> },
        { value: "xl", content: <UU5.Bricks.Lsi lsi={EditableLsi.common.sizeValueXL} /> },
      ],
    }),
  },
  {
    name: "borderRadius",
    type: "text",
    label: <UU5.Bricks.Lsi lsi={EditableLsi.tabs.borderRadiusLabel} />,
    getProps: () => ({ placeholder: UU5.Common.BaseMixin.getLsiItem(EditableLsi.tabs.borderRadiusPlaceholder) }),
  },
  {
    name: "elevation",
    type: "switchSelector",
    label: EditableLsi.tabs.elevationLabel,
    getProps: () => ({
      items: [
        { value: "0", content: "0" },
        { value: "1", content: "1" },
        { value: "2", content: "2" },
        { value: "3", content: "3" },
        { value: "4", content: "4" },
        { value: "5", content: "5" },
      ],
    }),
  },
  {
    name: "elevationHover",
    type: "switchSelector",
    label: EditableLsi.tabs.elevationHoverLabel,
    getProps: () => ({
      items: [
        { value: "0", content: "0" },
        { value: "1", content: "1" },
        { value: "2", content: "2" },
        { value: "3", content: "3" },
        { value: "4", content: "4" },
        { value: "5", content: "5" },
      ],
    }),
  },
  {
    name: "justified",
    type: "switchSelector",
    label: EditableLsi.tabs.justifiedLabel,
    getProps: () => ({
      items: [
        { value: false, content: <UU5.Bricks.Lsi lsi={EditableLsi.tabs.justifiedValueFalse} /> },
        { value: true, content: <UU5.Bricks.Lsi lsi={EditableLsi.tabs.justifiedValueTrue} /> },
      ],
    }),
  },
  {
    name: "fade",
    type: "switchSelector",
    label: EditableLsi.tabs.fadeLabel,
    getProps: () => ({
      items: [
        { value: false, content: <UU5.Bricks.Lsi lsi={EditableLsi.tabs.fadeValueFalse} /> },
        { value: true, content: <UU5.Bricks.Lsi lsi={EditableLsi.tabs.fadeValueTrue} /> },
      ],
    }),
  },
  {
    name: "underline",
    type: "switchSelector",
    label: EditableLsi.tabs.underlineLabel,
    getProps: () => ({
      items: [
        { value: false, content: <UU5.Bricks.Lsi lsi={EditableLsi.tabs.underlineValueFalse} /> },
        { value: true, content: <UU5.Bricks.Lsi lsi={EditableLsi.tabs.underlineValueTrue} /> },
      ],
    }),
  },
];

const editableAdditionalPropsSetup = [
  { name: "colorSchema", type: "colorSchema", label: EditableLsi.common.colorSchemaLabel },
  {
    name: "initialActiveName",
    type: "switchSelector",
    label: EditableLsi.tabs.initialActiveNameLabel,
    getProps: (props, componentProps, items) => {
      let usedItems = items.map((item) => ({
        content: item.props.name || item.props.id + "",
        value: item.props.name || item.props.id + "",
      }));
      let hasValue = items.some((item) => item.props.name === props.value || item.props.id === props.value);
      return {
        ...props,
        items: usedItems,
        value: hasValue ? props.value : usedItems[0]?.value,
      };
    },
  },
  {
    name: "disabled",
    type: "switchSelector",
    label: EditableLsi.tabs.disabledLabel,
    getProps: () => ({
      items: [
        { value: false, content: <UU5.Bricks.Lsi lsi={EditableLsi.tabs.disabledValueFalse} /> },
        { value: true, content: <UU5.Bricks.Lsi lsi={EditableLsi.tabs.disabledValueTrue} /> },
      ],
    }),
  },
  {
    name: "mountTabContent",
    type: "switchSelector",
    label: EditableLsi.tabs.mountTabContentLabel,
    getProps: () => ({
      items: [
        { value: "onActive", content: <UU5.Bricks.Lsi lsi={EditableLsi.tabs.mountTabContentValueOnActive} /> },
        {
          value: "onFirstActive",
          content: <UU5.Bricks.Lsi lsi={EditableLsi.tabs.mountTabContentValueOnFirstActive} />,
        },
      ],
      message: <UU5.Bricks.Lsi lsi={EditableLsi.tabs.mountContentDescription} />,
    }),
  },
];

const editablePropsSetup = [
  {
    name: <UU5.Bricks.Lsi lsi={EditableLsi.common.componentPropsLabel} />,
    setup: editableComponentPropsSetup,
  },
  {
    name: <UU5.Bricks.Lsi lsi={EditableLsi.common.advancedPropsLabel} />,
    setup: editableAdditionalPropsSetup,
  },
];

const editableItemPropsSetup = {
  setup: [
    { name: "name", type: "text", label: <UU5.Bricks.Lsi lsi={EditableLsi.tabs.tabNameLabel} />, required: true },
    { name: "header", type: "text", label: <UU5.Bricks.Lsi lsi={EditableLsi.tabs.tabHeaderLabel} />, required: true },
  ],
};

export const TabsEditable = UU5.Common.VisualComponent.create({
  //@@viewOn:mixins
  mixins: [UU5.Common.BaseMixin],
  //@@viewOff:mixins

  //@@viewOn:statics
  statics: {
    tagName: ns.name("TabsEditable"),
    classNames: {
      main: ns.css("tabs-editable"),
    },
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
      component: undefined,
    };
  },
  //@@viewOff:getDefaultProps

  //@@viewOn:reactLifeCycle
  //@@viewOff:reactLifeCycle

  //@@viewOn:interface
  getPropsToSave() {
    return this._editModal ? this._editModal.getPropsToSave() : undefined;
  },
  //@@viewOff:interface

  //@@viewOn:overriding
  //@@viewOff:overriding

  //@@viewOn:private
  _registerEditModal(modal) {
    this._editModal = modal;
  },

  _onCloseEditationModal(newProps) {
    if (!newProps) newProps = {};
    this.props.component.endEditation({ ...newProps, mountContent: newProps.mountTabContent || "onActive" });
  },
  //@@viewOff:private

  //@@viewOn:render
  render() {
    let props = this.props.component.getEditablePropsValues(Object.keys(this.props.component.props));
    return (
      <UU5.BricksEditable.Modal
        shown
        componentName={this.props.component.getTagName()}
        componentProps={{
          ...props,
          mountTabContent: props.mountTabContent || "onActive",
        }}
        onClose={this._onCloseEditationModal}
        itemName={TabsItem.tagName}
        itemDefaultProps={TabsItem.defaultProps}
        ref_={this._registerEditModal}
        componentPropsForm={editablePropsSetup}
        itemPropsForm={editableItemPropsSetup}
        newItem={newEditableItem}
        itemsSource="children"
        getItemLabel={getEditableItemLabel}
      />
    );
  },
  //@@viewOff:render
});

export default TabsEditable;
