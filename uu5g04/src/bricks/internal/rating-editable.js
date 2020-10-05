//@@viewOn:imports
import UU5 from "uu5g04";

import ns from "./bricks-editable-ns.js";
import Lsi from "./bricks-editable-lsi.js";
//@@viewOff:imports

const editableComponentPropsSetup = [
  {
    name: "count",
    type: "number",
    label: Lsi.rating.countLabel,
    getProps: () => ({ min: 0, valueType: "number" }),
  },
  {
    name: "value",
    type: "number",
    label: Lsi.rating.valueLabel,
    getProps: (props, componentProps) => ({
      rounded: true,
      decimals: 2,
      step: 0.5,
      min: 0,
      max: componentProps.count,
      decimalSeparator: ".",
      valueType: "number",
    }),
  },
  {
    name: "icon",
    type: "iconPicker",
    label: Lsi.rating.iconLabel,
    getProps: (props) => ({
      onChange: (opt) => props.onChange({ ...opt, value: opt.value || "mdi-star" }),
    }),
  },
  {
    name: "size",
    getProps: () => ({ minSize: "s" }),
  },
];

const editablePropsSetup = [
  {
    name: <UU5.Bricks.Lsi lsi={Lsi.common.componentPropsLabel} />,
    setup: editableComponentPropsSetup,
  },
];

export const RatingEditable = UU5.Common.VisualComponent.create({
  //@@viewOn:mixins
  mixins: [UU5.Common.BaseMixin],
  //@@viewOff:mixins

  //@@viewOn:statics
  statics: {
    tagName: ns.name("RatingEditable"),
    classNames: {
      main: ns.css("rating-editable"),
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
        header={<UU5.Bricks.Lsi lsi={Lsi.rating.modalHeader} />}
      />
    );
  },
  //@@viewOff:render
});

export default RatingEditable;
