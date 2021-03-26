//@@viewOn:revision
// coded: Petr Bišof, 15.08.2020
//@@viewOff:revision

//@@viewOn:imports
import UU5, { createVisualComponent } from "uu5g04";
import ns from "./bricks-editable-ns.js";
import EditableLsi from "./bricks-editable-lsi";
//@@viewOff:imports

//@@viewOn:statics
const STATICS = {
  displayName: ns.name("TouchIconEditable"),
};
//@@viewOff:statics

const ItemType = ({ onChangeItems, items, editedItemId }) => {
  let editedItemIndex = items.findIndex((item) => item.id === editedItemId);
  let editedItem = items[editedItemIndex];
  let value = "link";
  if (editedItem.props.divider) {
    value = "divider";
  } else if (editedItem.props.header) {
    value = "header";
  }
  return (
    <UU5.Forms.SwitchSelector
      label={<UU5.Bricks.Lsi lsi={EditableLsi.dropdown.itemTypeLabel} />}
      labelColWidth="xs-12"
      inputColWidth="xs-12"
      value={value}
      onChange={({ value }) => {
        let newItems = items.map((item) => ({ id: item.id }));
        let itemProps = { divider: false, header: false };
        newItems[editedItemIndex].props = itemProps;
        if (value === "divider") {
          itemProps.divider = true;
        } else if (value === "header") {
          itemProps.header = true;
        }
        onChangeItems(newItems);
      }}
      items={[
        { value: "link", content: <UU5.Bricks.Lsi lsi={EditableLsi.dropdown.itemTypeValueLink} /> },
        { value: "header", content: <UU5.Bricks.Lsi lsi={EditableLsi.dropdown.itemTypeValueHeader} /> },
        { value: "divider", content: <UU5.Bricks.Lsi lsi={EditableLsi.dropdown.itemTypeValueDivider} /> },
      ]}
    />
  );
};

const componentPropsSetup = [
  {
    name: "label",
    type: "text",
    label: EditableLsi.dropdown.labelLabel,
  },
  {
    name: "iconHidden",
    type: "switchSelector",
    label: EditableLsi.dropdown.iconHiddenLabel,
    getProps: () => ({
      items: [
        { content: <UU5.Bricks.Lsi lsi={EditableLsi.dropdown.iconHiddenValueFalse} />, value: false },
        { content: <UU5.Bricks.Lsi lsi={EditableLsi.dropdown.iconHiddenValueTrue} />, value: true },
      ],
    }),
  },
  [
    {
      name: "iconOpen",
      type: "iconPicker",
      label: EditableLsi.dropdown.iconOpenLabel,
      getProps: (props, componentProps) => ({ disabled: componentProps.iconHidden }),
    },
    {
      name: "iconClosed",
      type: "iconPicker",
      label: EditableLsi.dropdown.iconClosedLabel,
      getProps: (props, componentProps) => ({ disabled: componentProps.iconHidden }),
    },
  ],
];

const visualPropsSetup = [
  { name: "colorSchema" },
  {
    name: "bgStyle",
    type: "switchSelector",
    label: EditableLsi.common.bgStyleLabel,
    getProps: () => ({
      items: [
        { value: "outline", content: <UU5.Bricks.Lsi lsi={EditableLsi.common.bgStyleValueOutline} /> },
        { value: "filled", content: <UU5.Bricks.Lsi lsi={EditableLsi.common.bgStyleValueFilled} /> },
        { value: "transparent", content: <UU5.Bricks.Lsi lsi={EditableLsi.common.bgStyleValueTransparent} /> },
        { value: "underline", content: <UU5.Bricks.Lsi lsi={EditableLsi.common.bgStyleValueUnderline} /> },
        { value: "link", content: <UU5.Bricks.Lsi lsi={EditableLsi.dropdown.linkOption} /> },
      ],
    }),
  },
  {
    name: "elevation",
  },
  {
    name: "elevationHover",
    type: "elevation",
    label: EditableLsi.dropdown.elevationHoverLabel,
  },
  {
    name: "borderRadius",
  },
  {
    name: "size",
    getProps: () => ({
      minSize: "s",
    }),
  },
];

const advancedPropsSetup = [
  [
    {
      name: "smoothScroll",
      type: "number",
      label: EditableLsi.common.smoothScrollLabel,
      getProps: (props) => {
        return {
          min: 0,
          step: 0.5,
          suffix: "s",
          valueType: "number",
          value: props.value / 1000, // from ms to s
          onChange: (opt) => props.onChange({ ...opt, value: opt.value * 1000 }), // to ms
        };
      },
    },
    {
      name: "offset",
      type: "number",
      label: EditableLsi.common.offsetLabel,
      getProps: (props) => {
        return {
          value: props.value || 0,
          min: 0,
          step: 8,
          suffix: "px",
          valueType: "number",
        };
      },
    },
  ],
  [
    {
      type: "message",
      getProps: () => ({ message: EditableLsi.common.smoothScrollMessage }),
    },
    {
      type: "message",
      getProps: () => ({ message: EditableLsi.common.offsetMessage }),
    },
  ],
  {
    name: "pullRight",
    type: "switchSelectorBool",
    label: EditableLsi.dropdown.pullRightLabel,
  },
  {
    name: "dropup",
    type: "switchSelectorBool",
    label: EditableLsi.dropdown.dropupLabel,
  },
  {
    name: "split",
    type: "switchSelectorBool",
    label: EditableLsi.dropdown.splitLabel,
  },
  {
    name: "closedOnLeave",
    type: "switchSelectorBool",
    label: EditableLsi.dropdown.closedOnLeaveLabel,
  },
  {
    name: "openOnHover",
    type: "switchSelectorBool",
    label: EditableLsi.dropdown.openOnHoverLabel,
  },
  {
    name: "disableBackdrop",
    type: "switchSelectorBool",
    label: EditableLsi.dropdown.disableBackdropLabel,
  },
  {
    name: "baseline",
    type: "switchSelectorBool",
    label: EditableLsi.dropdown.baselineLabel,
  },
  {
    name: "fitMenuToViewport",
    type: "switchSelectorBool",
    label: EditableLsi.dropdown.fitMenuToViewportLabel,
  },
];

const editablePropsSetup = [
  {
    name: EditableLsi.common.componentPropsLabel,
    setup: componentPropsSetup,
  },
  {
    name: EditableLsi.common.displayPropsLabel,
    setup: visualPropsSetup,
  },
  {
    name: EditableLsi.common.advancedPropsLabel,
    setup: advancedPropsSetup,
  },
];

function getItemType(items, activeItemId) {
  let matchingItemProps = items.find((item) => item.id === activeItemId)?.props;
  if (matchingItemProps.divider) {
    return "divider";
  } else if (matchingItemProps.header) {
    return "header";
  } else {
    return "link";
  }
}

const editableItemPropsSetup = {
  setup: [
    ItemType,
    {
      name: "label",
      type: "text",
      label: EditableLsi.dropdown.labelLabel,
      getProps: (props, componentProps, items, activeItemId) => ({
        disabled: getItemType(items, activeItemId) === "divider",
      }),
    },
    {
      name: "href",
      type: "text",
      label: EditableLsi.common.hrefLabel,
      getProps: (props, componentProps, items, activeItemId) => ({
        disabled: getItemType(items, activeItemId) !== "link",
      }),
    },
    {
      name: "target",
      type: "switchSelector",
      label: EditableLsi.common.targetLabel,
      getProps: (props, componentProps, items, activeItemId) => ({
        items: [
          { content: <UU5.Bricks.Lsi lsi={EditableLsi.common.targetValueBlank} />, value: "_blank" },
          { content: <UU5.Bricks.Lsi lsi={EditableLsi.common.targetValueParent} />, value: "_parent" },
          { content: <UU5.Bricks.Lsi lsi={EditableLsi.common.targetValueTop} />, value: "_top" },
          { content: <UU5.Bricks.Lsi lsi={EditableLsi.common.targetValueSelf} />, value: "_self" },
        ],
        disabled: getItemType(items, activeItemId) !== "link",
      }),
    },
    [
      {
        name: "smoothScroll",
        type: "number",
        label: EditableLsi.common.smoothScrollLabel,
        getProps: (props, componentProps, items, activeItemId) => {
          return {
            min: 0,
            step: 0.5,
            suffix: "s",
            valueType: "number",
            value: props.value / 1000, // from ms to s
            onChange: (opt) => props.onChange({ ...opt, value: opt.value * 1000 }), // to ms
            disabled: getItemType(items, activeItemId) !== "link",
          };
        },
      },
      {
        name: "offset",
        type: "number",
        label: EditableLsi.common.offsetLabel,
        getProps: (props, componentProps, items, activeItemId) => {
          return {
            value: props.value || 0,
            min: 0,
            step: 8,
            suffix: "px",
            valueType: "number",
            disabled: getItemType(items, activeItemId) !== "link",
          };
        },
      },
    ],
    [
      {
        type: "message",
        getProps: () => ({ message: EditableLsi.common.smoothScrollMessage }),
      },
      {
        type: "message",
        getProps: () => ({ message: EditableLsi.common.offsetMessage }),
      },
    ],
  ],
};

const newEditableItem = {
  tagName: "UU5.Bricks.Dropdown.Item",
  isElement: true,
  props: {
    contentEditable: false,
  },
};

const DropdownEditable = createVisualComponent({
  ...STATICS,

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
  //@@viewOn:reactLifeCycle

  //@@viewOn:interface
  getPropsToSave() {
    return this._modalRef ? this._modalRef.getPropsToSave() : undefined;
  },
  //@@viewOff:interface

  //@@viewOn:overridingMethods
  //@@viewOff:overridingMethods

  //@@viewOn:private
  _ref(modal) {
    this._modalRef = modal;
  },
  //@@viewOff:private

  //@@viewOn:render
  render() {
    let item = this.props.component.constructor.Item;
    return (
      <UU5.BricksEditable.Modal
        shown
        header={<UU5.Bricks.Lsi lsi={EditableLsi.dropdown.modalHeader} />}
        componentName={this.props.component.getTagName()}
        componentProps={this.props.component.getEditablePropsValues(Object.keys(this.props.component.props))}
        onClose={this.props.component.endEditation}
        componentPropsForm={editablePropsSetup}
        ref_={this._ref}
        itemName={item.tagName}
        itemDefaultProps={item.defaultProps}
        itemPropsForm={editableItemPropsSetup}
        newItem={newEditableItem}
        getItemLabel={this._getEditableItemLabel}
      />
    );
  },
  //@@viewOff:render
});

export default DropdownEditable;
