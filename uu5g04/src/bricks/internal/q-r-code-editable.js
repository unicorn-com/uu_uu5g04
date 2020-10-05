//@@viewOn:imports
import UU5 from "uu5g04";

import ns from "./bricks-editable-ns.js";
import EditableLsi from "./bricks-editable-lsi.js";
import { QRCodeSize } from "./modal-editation-components";
//@@viewOff:imports

const Lsi = EditableLsi.qRCode;

const editableComponentPropsSetup = [
  {
    name: "value",
    type: "text",
    label: Lsi.valueLabel,
    required: true,
  },
  QRCodeSize,
  {
    name: "correction",
    type: "switchSelector",
    label: Lsi.correctionLabel,
    getProps: () => ({
      items: [
        { value: "low", content: <UU5.Bricks.Lsi lsi={Lsi.lowValue} /> },
        { value: "medium", content: <UU5.Bricks.Lsi lsi={Lsi.mediumValue} /> },
        { value: "quartile", content: <UU5.Bricks.Lsi lsi={Lsi.quartileValue} /> },
        { value: "high", content: <UU5.Bricks.Lsi lsi={Lsi.highValue} /> },
      ],
      message: <UU5.Bricks.Lsi lsi={Lsi.correctionMessage} />,
    }),
  },
];

const editablePropsSetup = [
  {
    name: <UU5.Bricks.Lsi lsi={"Lsi.componentPropsLabel"} />,
    setup: editableComponentPropsSetup,
  },
];

export const QRCodeEditable = UU5.Common.VisualComponent.create({
  //@@viewOn:mixins
  mixins: [UU5.Common.BaseMixin],
  //@@viewOff:mixins

  //@@viewOn:statics
  statics: {
    tagName: ns.name("QRCodeEditable"),
    classNames: {
      main: ns.css("q-r-code-editable"),
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
        header={<UU5.Bricks.Lsi lsi={EditableLsi.qRCode.modalHeader} />}
      />
    );
  },
  //@@viewOff:render
});

export default QRCodeEditable;
