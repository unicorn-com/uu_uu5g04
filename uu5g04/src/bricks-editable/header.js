/**
 * Copyright (C) 2021 Unicorn a.s.
 *
 * This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public
 * License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later
 * version.
 *
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied
 * warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License at
 * <https://gnu.org/licenses/> for more details.
 *
 * You may obtain additional information at <https://unicorn.com> or contact Unicorn a.s. at address: V Kapslovne 2767/2,
 * Praha 3, Czech Republic or at the email: info@unicorn.com.
 */

//@@viewOn:imports
import * as UU5 from "uu5g04";
import "uu5g04-bricks";
import "uu5g04-forms";
import Tools from "./tools.js";
//@@viewOff:imports

const DEFAULT_PROPS = [
  {
    name: "content",
    type: "uu5string",
    label: "Content",
    props: {
      maxRows: 1000,
      rows: 1,
      showGutter: false,
      wrapEnabled: true,
      inputColWidth: "xl12",
      labelColWidth: "xl12",
    },
    value: "",
  },
  {
    name: "level",
    type: "number",
    label: "Level",
    props: {
      inputColWidth: "xs6 s4 m2",
      labelColWidth: "xs12 s5",
      min: 0,
      max: 6,
    },
    value: null,
  },
  {
    name: "underline",
    type: "bool",
    label: "Underline",
    value: false,
  },
  {
    name: "contentEditable",
    type: "bool",
    label: "Content Editable",
    value: false,
  },
];

export const Header = UU5.Common.VisualComponent.create({
  displayName: "Header", // for backward compatibility (test snapshots)
  //@@viewOn:mixins
  mixins: [UU5.Common.BaseMixin],
  //@@viewOff:mixins

  //@@viewOn:statics
  statics: {
    tagName: "UU5.BricksEditable.Header",
    nestingLevelList: UU5.Environment.getNestingLevelList("bigBoxCollection", "box"),
    classNames: {
      main: "editable-header",
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
  getInitialState() {
    console.error(`Component ${this.getTagName()} is deprecated since version 1.43.0.`);
    return this._getState();
  },
  UNSAFE_componentWillReceiveProps(nextProps) {
    if (this.props.component !== nextProps.component) {
      this.setState(this._getState(nextProps));
    }
  },
  //@@viewOff:getDefaultProps

  //@@viewOn:reactLifeCycle
  //@@viewOff:reactLifeCycle

  //@@viewOn:interface
  //@@viewOff:interface

  //@@viewOn:overriding
  //@@viewOff:overriding

  //@@viewOn:private
  _save(form) {
    this.setState(form.values);
    this.props.component.endEditation(form.values);
  },

  _cancel() {
    this.props.component.endEditation();
  },

  _getState(nextProps = this.props) {
    return { props: Tools.getState(DEFAULT_PROPS, nextProps) };
  },
  //@@viewOff:private

  //@@viewOn:render
  render() {
    return (
      <UU5.Bricks.Div {...this.getMainPropsToPass()}>
        <UU5.Forms.PropsForm props={this.state.props} onCancel={this._cancel} onSave={this._save} uu5string={true} />
      </UU5.Bricks.Div>
    );
  },
  //@@viewOff:render
});

export default Header;
