//@@viewOn:revision
// coded: Petr Bišof, 15.08.2020
//@@viewOff:revision

//@@viewOn:imports
import UU5, { createVisualComponent } from "uu5g04";
import ns from "./bricks-editable-ns.js";
import { ContentInput } from "./modal-editation-components";
import EditableLsi from "./bricks-editable-lsi.js";
//@@viewOff:imports

//@@viewOn:statics
const STATICS = {
  displayName: ns.name("TouchIconEditable"),
};
//@@viewOff:statics

const componentPropsSetup = [
  {
    name: "icon",
    type: "iconPicker",
    label: EditableLsi.touchIcon.iconLabel,
  },
  ContentInput,
  {
    name: "itemLines",
    type: "switchSelector",
    label: EditableLsi.touchIcon.linesLabel,
    getProps: (props) => ({
      items: [{ value: 0 }, { value: 2 }, { value: 3 }],
      value: props.value === undefined ? 3 : props.value,
    }),
  },
  {
    name: "href",
    type: "text",
    label: EditableLsi.common.hrefLabel,
  },
  {
    name: "target",
    type: "switchSelector",
    label: EditableLsi.common.targetLabel,
    getProps: () => ({
      items: [
        { content: <UU5.Bricks.Lsi lsi={EditableLsi.common.targetValueBlank} />, value: "_blank" },
        { content: <UU5.Bricks.Lsi lsi={EditableLsi.common.targetValueParent} />, value: "_parent" },
        { content: <UU5.Bricks.Lsi lsi={EditableLsi.common.targetValueTop} />, value: "_top" },
        { content: <UU5.Bricks.Lsi lsi={EditableLsi.common.targetValueSelf} />, value: "_self" },
      ],
    }),
  },
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
        { value: "link", content: <UU5.Bricks.Lsi lsi={EditableLsi.linkOption} /> },
      ],
    }),
  },
  {
    name: "elevation",
  },
  {
    name: "borderRadius",
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
];

const TouchIconEditable = createVisualComponent({
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
  //@@viewOff:reactLifeCycle

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

  _getProps() {
    let props = this.props.component.getEditablePropsValues(Object.keys(this.props.component.props));
    if (props.children) props.children = "<uu5string />" + props.children;
    return props;
  },
  //@@viewOff:private

  //@@viewOn:render
  render() {
    return (
      <UU5.BricksEditable.Modal
        shown
        header={<UU5.Bricks.Lsi lsi={EditableLsi.touchIcon.modalHeader} />}
        componentName={this.props.component.getTagName()}
        componentProps={this._getProps()}
        onClose={this.props.component.endEditation}
        componentPropsForm={editablePropsSetup}
        ref_={this._ref}
      />
    );
  },
  //@@viewOff:render
});

export default TouchIconEditable;
