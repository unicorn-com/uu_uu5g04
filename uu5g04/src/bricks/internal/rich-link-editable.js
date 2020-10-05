//@@viewOn:imports
import UU5 from "uu5g04";

import ns from "./bricks-editable-ns.js";
import EditableLsi from "./bricks-editable-lsi.js";
//@@viewOff:imports

const targetList = ["_blank", "_parent", "_top", "_self"];
const typeList = ["simple", "full"];

function capitalizeStringFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

const editableComponentPropsSetup = [
  {
    name: "href",
    type: "text",
    label: EditableLsi.richLink.hrefLabel,
  },
  {
    name: "type",
    type: "switchSelector",
    label: EditableLsi.richLink.typeLabel,
    getProps: () => ({
      items: typeList.map((item) => ({
        content: <UU5.Bricks.Lsi lsi={EditableLsi.richLink[`typeValue${capitalizeStringFirstLetter(item)}`]} />,
        value: item,
      })),
    }),
  },
];

const editableAdditionalPropsSetup = [
  {
    name: "target",
    type: "switchSelector",
    label: EditableLsi.richLink.targetLabel,
    getProps: () => ({ items: targetList.map((item) => ({ content: item, value: item })) }),
  },
  {
    name: "smoothScroll",
    type: "number",
    label: EditableLsi.richLink.smoothScrollLabel,
    getProps: (props) => ({
      min: 0,
      step: 0.5,
      suffix: "s",
      valueType: "number",
      value: props.value / 1000, // from ms to s
      onChange: (opt) => props.onChange({ ...opt, value: opt.value * 1000 }), // to ms
      message: <UU5.Bricks.Lsi lsi={EditableLsi.richLink.smoothScrollMessage} />,
    }),
  },
  {
    name: "offset",
    type: "number",
    label: EditableLsi.richLink.offsetLabel,
    getProps: () => ({
      min: 0,
      step: 5,
      suffix: "px",
      valueType: "number",
      message: <UU5.Bricks.Lsi lsi={EditableLsi.richLink.offsetMessage} />,
    }),
  },
  {
    name: "download",
    type: "switchSelectorBool",
    label: EditableLsi.richLink.downloadLabel,
  },
  {
    name: "authenticate",
    type: "switchSelectorBool",
    label: EditableLsi.richLink.authenticateLabel,
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

export const RichLinkEditable = UU5.Common.VisualComponent.create({
  //@@viewOn:mixins
  mixins: [UU5.Common.BaseMixin],
  //@@viewOff:mixins

  //@@viewOn:statics
  statics: {
    tagName: ns.name("RichLinkEditable"),
    classNames: {
      main: ns.css("rich-link-editable"),
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
  //@@viewOff:private

  //@@viewOn:render
  render() {
    return (
      <UU5.BricksEditable.Modal
        shown
        componentName={this.props.component.getTagName()}
        componentProps={this.props.component.getEditablePropsValues(Object.keys(this.props.component.props))}
        onClose={this.props.component.endEditation}
        component={this.props.component}
        ref_={this._registerEditModal}
        componentPropsForm={editablePropsSetup}
      />
    );
  },
  //@@viewOff:render
});

export default RichLinkEditable;
