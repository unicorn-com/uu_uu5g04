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
import ns from "./bricks-ns.js";
const ClassNames = UU5.Common.ClassNames;

import "./well.less";
const WellEditable = UU5.Common.Component.lazy(async () => {
  await SystemJS.import("uu5g04-forms");
  await SystemJS.import("uu5g04-bricks-editable");
  return import("./internal/well-editable.js");
});
//@@viewOff:imports

export const Well = UU5.Common.VisualComponent.create({
  displayName: "Well", // for backward compatibility (test snapshots)
  //@@viewOn:mixins
  mixins: [
    UU5.Common.BaseMixin,
    UU5.Common.PureRenderMixin,
    UU5.Common.ElementaryMixin,
    UU5.Common.ContentMixin,
    UU5.Common.ColorSchemaMixin,
    UU5.Common.NestingLevelMixin,
    UU5.Common.EditableMixin,
  ],
  //@@viewOff:mixins

  //@@viewOn:statics
  statics: {
    tagName: ns.name("Well"),
    nestingLevelList: UU5.Environment.getNestingLevelList("bigBoxCollection", "box"),
    classNames: {
      main: ns.css("well"),
      defaultColor: ns.css("well-default"),
    },
    editMode: {
      enablePlaceholder: true,
      startMode: "button",
    }
  },
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {
    bgStyle: UU5.PropTypes.oneOf(["filled", "outline", "transparent", "underline"]),
    borderRadius: UU5.PropTypes.string,
    elevation: UU5.PropTypes.oneOf(["-1", "0", "1", "2", "3", "4", "5", -1, 0, 1, 2, 3, 4, 5]),
  },
  //@@viewOff:propTypes

  //@@viewOn:getDefaultProps
  getDefaultProps() {
    return {
      bgStyle: "filled",
      borderRadius: null,
      elevation: null,
    };
  },
  //@@viewOff:getDefaultProps

  //@@viewOn:reactLifeCycle
  //@@viewOff:reactLifeCycle

  //@@viewOn:interface
  //@@viewOff:interface

  //@@viewOn:overriding
  onBeforeForceEndEditation_() {
    return this._editableComponent ? this._editableComponent.getPropsToSave() : undefined;
  },
  //@@viewOff:overriding

  //@@viewOn:private
  _registerEditableComponent(ref) {
    this._editableComponent = ref;
  },

  _getMainAttrs() {
    let mainAttrs = this.getMainAttrs();

    if (this.props.borderRadius) {
      mainAttrs.style = { ...mainAttrs.style, ...{ borderRadius: this.props.borderRadius } };
    }

    if (this.props.bgStyle) {
      mainAttrs.className += " " + ClassNames[this.props.bgStyle];
    }

    if (this.props.bgStyle === "filled") {
      mainAttrs.className += " " + this.getClassName("defaultColor");
    }

    if (this.props.elevation) {
      mainAttrs.className += " " + ClassNames.elevation + this.props.elevation;
    }

    return mainAttrs;
  },

  _renderEditationMode() {
    return (
      <UU5.Common.Suspense fallback={this.getEditingLoading()}>
        <WellEditable component={this} ref_={this._registerEditableComponent} />
      </UU5.Common.Suspense>
    );
  },
  //@@viewOff:private

  //@@viewOn:render
  render() {
    const mainAttrs = this._getMainAttrs();

    return this.getNestingLevel() ? (
      <div {...mainAttrs}>
        {this.getChildren()}
        {this.getDisabledCover()}
        {this.isInlineEdited() && this._renderEditationMode()}
      </div>
    ) : null;
  },
  //@@viewOff:render
});

export default Well;
