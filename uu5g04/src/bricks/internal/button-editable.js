//@@viewOn:revision
// coded: Petr Bišof, 18.09.2020
// reviewed: Martin Mach, 20.09.2020
//@@viewOff:revision

//@@viewOn:imports
import UU5, { createVisualComponent } from "uu5g04";
import ns from "./bricks-editable-ns.js";
import { ContentInput } from "./modal-editation-components";
import EditableLsi from "./bricks-editable-lsi.js";
//@@viewOff:imports

//@@viewOn:statics
const STATICS = {
  displayName: ns.name("ButtonEditable"),
};
//@@viewOff:statics

const componentPropsSetup = [
  ContentInput,
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
        { value: "link", content: <UU5.Bricks.Lsi lsi={EditableLsi.button.bgStyleValueLink} /> },
      ],
    }),
  },
  {
    name: "size",
    getProps: () => ({
      minSize: "s",
    }),
  },
  {
    name: "elevation",
  },
  {
    name: "elevationHover",
    type: "elevation",
    label: EditableLsi.common.elevationHoverLabel,
  },
  {
    name: "borderRadius",
    getProps: ({ value }) => ({ value: value ?? 2 }),
  },
];

const advancedPropsSetup = [
  {
    name: "displayBlock",
    type: "switchSelectorBool",
    label: EditableLsi.button.displayBlockLabel,
  },
  {
    name: "pressed",
    type: "switchSelectorBool",
    label: EditableLsi.button.pressedLabel,
  },
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
    type: "message",
    getProps: () => ({ message: EditableLsi.common.smoothScrollMessage }),
  },
  {
    name: "offset",
    type: "number",
    label: EditableLsi.common.offsetLabel,
    getProps: () => {
      return {
        min: 0,
        step: 8,
        suffix: "px",
        valueType: "number",
      };
    },
  },
  {
    type: "message",
    getProps: () => ({ message: EditableLsi.common.offsetMessage }),
  },
  {
    name: "baseline",
    type: "switchSelectorBool",
    label: EditableLsi.button.baselineLabel,
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

const ButtonEditable = createVisualComponent({
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
    return props;
  },
  //@@viewOff:private

  //@@viewOn:render
  render() {
    return (
      <UU5.BricksEditable.Modal
        shown
        header={<UU5.Bricks.Lsi lsi={EditableLsi.button.modalHeader} />}
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

export default ButtonEditable;
