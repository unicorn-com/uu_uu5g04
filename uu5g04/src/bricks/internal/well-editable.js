//@@viewOn:imports
import UU5 from "uu5g04";

import ns from "./bricks-editable-ns.js";
import EditableLsi from "./bricks-editable-lsi.js";
//@@viewOff:imports

const editableComponentPropsSetup = [
  {
    name: "bgStyle"
  },
  {
    name: "colorSchema"
  },
  {
    name: "borderRadius"
  },
  {
    name: "elevation"
  }
];

const editablePropsSetup = [
  {
    setup: editableComponentPropsSetup
  }
];

export const WellEditable = UU5.Common.VisualComponent.create({
  //@@viewOn:mixins
  mixins: [UU5.Common.BaseMixin],
  //@@viewOff:mixins

  //@@viewOn:statics
  statics: {
    tagName: ns.name("WellEditable"),
    classNames: {
      main: ns.css("well-editable")
    },
    lsi: () => ({ ...EditableLsi.well, ...EditableLsi.common })
  },
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {
    component: UU5.PropTypes.object.isRequired
  },
  //@@viewOff:propTypes

  //@@viewOn:getDefaultProps
  getDefaultProps() {
    return {
      component: undefined
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
        header={this.getLsiValue("modalHeader")}
      />
    );
  }
  //@@viewOff:render
});

export default WellEditable;
