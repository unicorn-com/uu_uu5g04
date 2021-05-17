/**
 * Copyright (C) 2019 Unicorn a.s.
 *
 * This program is free software; you can use it under the terms of the UAF Open License v01 or
 * any later version. The text of the license is available in the file LICENSE or at www.unicorn.com.
 *
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even
 * the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See LICENSE for more details.
 *
 * You may contact Unicorn a.s. at address: V Kapslovne 2767/2, Praha 3, Czech Republic or
 * at the email: info@unicorn.com.
 */

//@@viewOn:imports
import * as UU5 from "uu5g04";
import ns from "./bricks-editable-ns.js";
import Lsi from "../lsi.js";
import EditableLsi from "./bricks-editable-lsi.js";
//@@viewOff:imports

const MAIN_CLASS_NAME = ns.css("button-group-editable");
const NAME = ns.name("ButtonGroupEditable");

const editableComponentPropsSetup = [
  { name: "size" },
  {
    name: "vertical",
    type: "switchSelector",
    label: EditableLsi.buttonGroup.verticalLabel,
    getProps: () => ({
      items: [
        { content: <Lsi lsi={EditableLsi.buttonGroup.verticalValueFalse} />, value: false },
        { content: <Lsi lsi={EditableLsi.buttonGroup.verticalLabelTrue} />, value: true },
      ],
    }),
  },
];

const editableDisplayPropsSetup = [
  { name: "colorSchema" },
  { name: "elevation" },
  { name: "borderRadius" },
  { name: "bgStyle", getProps: ({ value }) => ({ value: value || "filled" }) },
  {
    name: "baseline",
    type: "switchSelectorBool",
    label: EditableLsi.buttonGroup.baselineLabel,
  },
];

const editablePropsSetup = [
  {
    name: <Lsi lsi={EditableLsi.common.componentPropsLabel} />,
    setup: editableComponentPropsSetup,
  },
  {
    name: <Lsi lsi={EditableLsi.common.displayPropsLabel} />,
    setup: editableDisplayPropsSetup,
  },
];

export const ButtonGroupEditable = UU5.Common.VisualComponent.create({
  //@@viewOn:mixins
  mixins: [UU5.Common.BaseMixin],
  //@@viewOff:mixins

  //@@viewOn:statics
  statics: {
    tagName: NAME,
    classNames: {
      main: MAIN_CLASS_NAME,
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
      component: null,
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

  //@@viewOn:overridingMethods
  //@@viewOff:overridingMethods

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

export default ButtonGroupEditable;
