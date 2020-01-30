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
import "uu5g04-bricks";
import "uu5g04-forms";
import Tools from "./tools.js";
//@@viewOff:imports

const DEFAULT_PROPS = [
  {
    name: "icon",
    type: "texticon",
    label: "Icon",
    value: "mdi-file",
    props: {
      inputColWidth: "xs12 s7 m4",
      icon: "mdi-help-circle-outline",
      onClick: () => window.open(Tools.iconDocLink, "_blank")
    }
  },
  {
    name: "content",
    type: "uu5string",
    label: "Content",
    props: {
      maxRows: 1000,
      rows: 5,
      showGutter: false,
      wrapEnabled: true,
      inputColWidth: "xl12",
      labelColWidth: "xl12"
    },
    value: ""
  },
  {
    name: "href",
    type: "text",
    label: "Href",
    props: {
      inputColWidth: "xl12",
      labelColWidth: "xl12"
    },
    value: "#"
  },
  {
    name: "target",
    type: ["_blank", "_parent", "_top", "_self"],
    label: "Target",
    props: {
      colWidth: "xs12 s6 m6 l6 xl6",
      inputColWidth: "s12 m7",
      labelColWidth: "s12 m5"
    },
    value: "_self"
  },
  {
    name: "colorSchema",
    type: UU5.Environment.colorSchema,
    label: "Color Schema",
    props: {
      inputColWidth: "xs8 s4",
      labelColWidth: "xs12 s5"
    },
    value: null
  },
  {
    name: "bgStyle",
    type: ["filled", "transparent"],
    label: "Background Style",
    props: {
      colWidth: "xl6 l6 m6 s12 xs12",
      inputColWidth: "s12 m7",
      labelColWidth: "s12 m5"
    },
    value: "filled"
  },
  {
    name: "contentEditable",
    type: "bool",
    label: "Content Editable",
    props: {
      inputColWidth: "s8 m7",
      labelColWidth: "s4 m5"
    },
    value: false
  }
];

export const TouchIcon = UU5.Common.VisualComponent.create({
  displayName: "TouchIcon", // for backward compatibility (test snapshots)
  //@@viewOn:mixins
  mixins: [UU5.Common.BaseMixin],
  //@@viewOff:mixins

  //@@viewOn:statics
  statics: {
    tagName: "UU5.BricksEditable.TouchIcon",
    nestingLevelList: UU5.Environment.getNestingLevelList("bigBoxCollection", "box"),
    classNames: {
      main: "editable-touch-icon"
    }
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
      component: null
    };
  },
  getInitialState() {
    return this._getState();
  },
  componentWillReceiveProps(nextProps) {
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
    let customFunction = (item, currentValue) => {
      if (item.name == "href") {
        item.value = currentValue || "";
      }
    };
    return { props: Tools.getState(DEFAULT_PROPS, nextProps, customFunction) };
  },
  //@@viewOff:private

  //@@viewOn:render
  render() {
    return (
      <UU5.Bricks.Div {...this.getMainPropsToPass()}>
        <UU5.Forms.PropsForm props={this.state.props} onCancel={this._cancel} onSave={this._save} uu5string={true} />
      </UU5.Bricks.Div>
    );
  }
  //@@viewOff:render
});

export default TouchIcon;
