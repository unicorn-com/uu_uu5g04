//@@viewOn:imports
import UU5 from "uu5g04";

import ns from "./bricks-editable-ns.js";
import Lsi from "./bricks-editable-lsi.js";
//@@viewOff:imports

const editableComponentPropsSetup = [
  {
    name: "colorSchema",
  },
  {
    name: "inline",
    type: "switchSelector",
    label: Lsi.loading.inlineLabel,
    getProps: () => ({
      items: [
        { content: <UU5.Bricks.Lsi lsi={Lsi.loading.inlineValueFalse} />, value: false },
        { content: <UU5.Bricks.Lsi lsi={Lsi.loading.inlineValueTrue} />, value: true },
      ],
    }),
  },
];

const editablePropsSetup = [
  {
    name: <UU5.Bricks.Lsi lsi={Lsi.common.componentPropsLabel} />,
    setup: editableComponentPropsSetup,
  },
];

export const LoadingEditable = UU5.Common.VisualComponent.create({
  //@@viewOn:mixins
  mixins: [UU5.Common.BaseMixin],
  //@@viewOff:mixins

  //@@viewOn:statics
  statics: {
    tagName: ns.name("LoadingEditable"),
    classNames: {
      main: ns.css("loading-editable"),
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
  _onClose(props) {
    props = props || {};
    props = { ...props, contentEditable: false }; // to prevent DCC from adding DccPlaceholder to empty Items
    return this.props.component.endEditation(props);
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
        header={<UU5.Bricks.Lsi lsi={Lsi.loading.modalHeader} />}
      />
    );
  },
  //@@viewOff:render
});

export default LoadingEditable;
