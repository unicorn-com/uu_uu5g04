//@@viewOn:imports
import UU5 from "uu5g04";

import ns from "./bricks-editable-ns.js";
import EditableLsi from "./bricks-editable-lsi.js";
import ProgressBarItem from "../progress-bar-item.js";
import { ProgressBarStriped, ProgressBarItemStriped } from "./modal-editation-components";
//@@viewOff:imports

const editableComponentPropsSetup = [
  { name: "progress", type: "number", label: EditableLsi.progressBar.progressLabel },
  { name: "size", getProps: () => ({ minSize: "s" }) },
  { name: "colorSchema" },
  ProgressBarStriped,
  {
    name: "animated",
    type: "switchSelectorBool",
    label: EditableLsi.progressBar.animatedLabel,
    getProps: (props, componentProps) => ({ disabled: !componentProps.striped }),
  },
];

const editablePropsSetup = [
  {
    name: <UU5.Bricks.Lsi lsi={EditableLsi.common.componentPropsLabel} />,
    setup: editableComponentPropsSetup,
  },
];

const getEditableItemLabel = (itemProps, itemIndex) => {
  if (itemProps.header) {
    return itemProps.header;
  } else {
    return `Item ${itemIndex + 1}`;
  }
};

const newEditableItem = {
  tagName: "UU5.Bricks.ProgressBar.Item",
};

const editableItemPropsSetup = {
  setup: [
    { name: "colorSchema" },
    { name: "progress", type: "number", label: EditableLsi.progressBar.progressLabel },
    ProgressBarItemStriped,
    {
      name: "animated",
      type: "switchSelectorBool",
      label: EditableLsi.progressBar.animatedLabel,
      getProps: (props, componentProps, items, activeItemId) => {
        let activeItem = items.find((item) => item.id === activeItemId);
        return { disabled: !activeItem.props.striped };
      },
    },
  ],
};

export const ProgressBarEditable = UU5.Common.VisualComponent.create({
  //@@viewOn:mixins
  mixins: [UU5.Common.BaseMixin],
  //@@viewOff:mixins

  //@@viewOn:statics
  statics: {
    tagName: ns.name("ProgressBarEditable"),
    classNames: {
      main: ns.css("progress-bar-editable"),
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
    let props = this._editModal ? this._editModal.getPropsToSave() : {};
    props = { ...props, contentEditable: false };
    return props;
  },
  //@@viewOff:interface

  //@@viewOn:overriding
  //@@viewOff:overriding

  //@@viewOn:private
  _onClose(props) {
    props = props || {};
    props = { ...props, contentEditable: false }; // to prevent DCC from adding DccPlaceholder to empty Items
    return this.props.component.endEditation(props);
  },

  _registerEditModal(modal) {
    this._editModal = modal;
  },
  //@@viewOff:private

  //@@viewOn:render
  render() {
    return (
      <UU5.BricksEditable.Modal
        shown
        componentName={this.props.component.getTagName()}
        componentProps={this.props.component.getEditablePropsValues(Object.keys(this.props.component.props))}
        onClose={this._onClose}
        component={this.props.component}
        ref_={this._registerEditModal}
        componentPropsForm={editablePropsSetup}
        itemPropsForm={editableItemPropsSetup}
        newItem={newEditableItem}
        itemName={ProgressBarItem.tagName}
        itemDefaultProps={ProgressBarItem.defaultProps}
        getItemLabel={getEditableItemLabel}
      />
    );
  },
  //@@viewOff:render
});

export default ProgressBarEditable;
