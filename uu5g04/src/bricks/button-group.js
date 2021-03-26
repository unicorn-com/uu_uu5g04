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
import ns from "./bricks-ns.js";
import { Div } from "./factory.js";
import "./button-group.less";
import Lsi from "./internal/bricks-editable-lsi.js";

const EditationComponent = UU5.Common.Component.lazy(async () => {
  await SystemJS.import("uu5g04-forms");
  await SystemJS.import("uu5g04-bricks-editable");
  return import("./internal/button-group-editable.js");
});
//@@viewOff:imports

const ClassNames = UU5.Common.ClassNames;

export const ButtonGroup = UU5.Common.VisualComponent.create({
  displayName: "ButtonGroup", // for backward compatibility (test snapshots)
  //@@viewOn:mixins
  mixins: [
    UU5.Common.BaseMixin,
    UU5.Common.ElementaryMixin,
    UU5.Common.NestingLevelMixin,
    UU5.Common.ColorSchemaMixin,
    UU5.Common.ContentMixin,
    UU5.Common.PureRenderMixin,
    UU5.Common.EditableMixin,
  ],
  //@@viewOff:mixins

  //@@viewOn:statics
  statics: {
    tagName: ns.name("ButtonGroup"),
    nestingLevel: "smallBox",
    classNames: {
      main: ns.css("button-group"),
      horizontal: ns.css("button-group-horizontal"),
      vertical: ns.css("button-group-vertical"),
      bgStyle: ns.css("button-group-bg-"),
    },
    defaults: {
      validChildTagNames: [
        "UU5.Bricks.Button",
        "UU5.Bricks.Dropdown",
        "UU5.Bricks.ButtonSwitch",
        "UU5.Bricks.LanguageSelector",
      ],
    },
    opt: {
      nestingLevelWrapper: true,
    },
    editMode: {
      name: Lsi.buttonGroup.name,
      backgroundColor: "rgba(0,0,0,.2)",
      color: "rgba(0,0,0,.87)",
      highlightColor: "#CCCCCC",
      displayType: "inline",
      startMode: "button",
    },
  },
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {
    size: UU5.PropTypes.string,
    vertical: UU5.PropTypes.bool,
    allowTags: UU5.PropTypes.arrayOf(UU5.PropTypes.string),
    bgStyle: UU5.PropTypes.oneOf(["filled", "outline", "transparent", "underline", "link"]),
    borderRadius: UU5.PropTypes.string,
    elevation: UU5.PropTypes.oneOf(["0", "1", "2", "3", "4", "5", 0, 1, 2, 3, 4, 5]),
    baseline: UU5.PropTypes.bool,

    // TODO: not possible for button, but for <a> element
    //displayBlock: UU5.PropTypes.bool
  },
  //@@viewOff:propTypes

  //@@viewOn:getDefaultProps
  getDefaultProps() {
    return {
      size: "m",
      vertical: false,
      allowTags: [],
      bgStyle: undefined,
      borderRadius: null,
      elevation: 0,
      baseline: false,
    };
  },
  //@@viewOff:getDefaultProps

  //@@viewOn:reactLifeCycle
  //@@viewOff:reactLifeCycle

  //@@viewOn:interface
  //@@viewOff:interface

  //@@viewOn:overriding
  shouldChildRender_(child) {
    let childTagName = UU5.Common.Tools.getChildTagName(child);
    let defaultChildTagNames = this.getDefault().validChildTagNames;
    let childTagNames = this.props.allowTags.concat(defaultChildTagNames);
    let result = childTagNames.indexOf(childTagName) > -1 || childTagName === "UuDcc.Bricks.ComponentWrapper";
    if (!result && (typeof child !== "string" || child.trim())) {
      if (childTagName)
        this.showError("childTagNotAllowed", [childTagName, this.getTagName(), childTagName, defaultChildTagNames[0]], {
          mixinName: "UU5.Common.BaseMixin",
        });
      else this.showError("childNotAllowed", [child, defaultChildTagNames[0]], { mixinName: "UU5.Common.BaseMixin" });
    }
    return result;
  },

  expandChildProps_(child, i) {
    let newChildProps = { ...child.props };

    let childTagName = UU5.Common.Tools.getChildTagName(child);
    if (childTagName === this.getDefault().validChildTagNames[1]) {
      let className = newChildProps.className ? newChildProps.className + " " : "";
      newChildProps.className = className;
    }

    // ButtonSwitch doesnt support individual props anymore. It requires them in one object property "props"
    if (childTagName === "UU5.Bricks.ButtonSwitch") {
      newChildProps.props = UU5.Common.Tools.merge(newChildProps.props, { size: this.props.size });
    } else {
      newChildProps.size = this.props.size;
    }
    newChildProps.disabled = this.isDisabled() || newChildProps.disabled;
    newChildProps.bgStyle = this.props.bgStyle || newChildProps.bgStyle;
    newChildProps.borderRadius = this.props.borderRadius || newChildProps.borderRadius;

    return newChildProps;
  },

  onBeforeForceEndEditation_() {
    return this._editableComponent ? this._editableComponent.getPropsToSave() : undefined;
  },
  //@@viewOff:overriding

  //@@viewOn:private
  _registerEditableComponent(component) {
    this._editableComponent = component;
  },

  _getPropsToPass() {
    let newProps = this.getMainPropsToPass();
    newProps.className += " " + this.getClassName(this.props.vertical ? "vertical" : "horizontal");

    if (this.props.elevation) {
      newProps.className += " " + ClassNames.elevation + this.props.elevation;
    }

    if (this.props.borderRadius) {
      newProps.style = { ...newProps.style, ...{ borderRadius: this.props.borderRadius } };
    }

    if (this.props.bgStyle) {
      newProps.className += " " + this.getClassName("bgStyle") + this.props.bgStyle;
    }

    if (this.props.baseline) {
      newProps.className += " uu5-bricks-button-baseline";
    }

    return newProps;
  },
  //@@viewOff:private

  //@@viewOn:render
  render() {
    return this.getNestingLevel() ? (
      <>
        {<Div {...this._getPropsToPass()}>{this.getChildren()}</Div>}
        {this.isInlineEdited() && (
          <UU5.Common.Suspense fallback={this.getEditingLoading()}>
            <EditationComponent component={this} ref_={this._registerEditableComponent} />
          </UU5.Common.Suspense>
        )}
      </>
    ) : null;
  },
  //@@viewOff:render
});

export default ButtonGroup;
