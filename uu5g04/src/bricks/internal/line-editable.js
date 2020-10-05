//@@viewOn:imports
import UU5 from "uu5g04";

import ns from "./bricks-editable-ns.js";
import Lsi from "./bricks-editable-lsi.js";
import { LineVertical } from "./modal-editation-components";
//@@viewOff:imports

const editableComponentPropsSetup = [
  {
    name: "size",
  },
  {
    name: "colorSchema",
  },
  {
    name: "borderRadius",
  },
  LineVertical,
];

const editablePropsSetup = [
  {
    name: <UU5.Bricks.Lsi lsi={Lsi.common.componentPropsLabel} />,
    setup: editableComponentPropsSetup,
  },
];

export const LineEditable = UU5.Common.VisualComponent.create({
  //@@viewOn:mixins
  mixins: [UU5.Common.BaseMixin],
  //@@viewOff:mixins

  //@@viewOn:statics
  statics: {
    tagName: ns.name("LineEditable"),
    classNames: {
      main: ns.css("line-editable"),
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
        header={<UU5.Bricks.Lsi lsi={Lsi.line.modalHeader} />}
      />
    );
  },
  //@@viewOff:render
});

export default LineEditable;
