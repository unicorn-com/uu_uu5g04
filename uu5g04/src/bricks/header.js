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

import Jumbotron from "./jumbotron.js";

import "./header.less";
import Lsi from "./internal/bricks-editable-lsi.js";

const EditationComponent = UU5.Common.Component.lazy(async () => {
  await SystemJS.import("uu5g04-forms");
  await SystemJS.import("uu5g04-bricks-editable");
  return import("./internal/header-editable.js");
});
//@@viewOff:imports

export const Header = UU5.Common.VisualComponent.create({
  displayName: "Header", // for backward compatibility (test snapshots)

  //@@viewOn:mixins
  mixins: [
    UU5.Common.BaseMixin,
    UU5.Common.ElementaryMixin,
    UU5.Common.NestingLevelMixin,
    UU5.Common.ContentMixin,
    UU5.Common.ColorSchemaMixin,
    UU5.Common.LevelMixin,
    UU5.Common.PureRenderMixin,
    UU5.Common.EditableMixin,
  ],
  //@@viewOff:mixins

  //@@viewOn:statics
  statics: {
    tagName: ns.name("Header"),
    nestingLevelList: UU5.Environment.getNestingLevelList("bigBoxCollection", "box"),
    classNames: {
      main: ns.css("header"),
      text: "uu5-common-text",
      underline: ns.css("header-underline"),
      jumbotronContent: ns.css("header-jumbotron-content"),
    },
    editMode: {
      name: Lsi.header.name,
      startMode: "content",
      displayType: "block",
    },
  },
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {
    underline: UU5.PropTypes.bool,
  },
  //@@viewOff:propTypes

  //@@viewOn:getDefaultProps
  getDefaultProps() {
    return {
      underline: undefined, // default: false
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

  _renderEditationMode() {
    return (
      <UU5.Common.Suspense fallback={this.getEditingLoading()}>
        <EditationComponent component={this} ref_={this._registerEditableComponent} />
      </UU5.Common.Suspense>
    );
  },
  //@@viewOff:private

  //@@viewOn:render
  render() {
    const level = this.getLevel();
    let result;
    let attrs = this.getMainAttrs();
    attrs.className += " " + this.getClassName("text");

    if (level > 0) {
      this.props.underline && (attrs.className += " " + this.getClassName("underline"));

      result = UU5.Common.Element.create("h" + level, attrs, this.getChildren(), this.getDisabledCover());
    } else {
      result = (
        <Jumbotron
          disabled={this.isDisabled()}
          hidden={this.isHidden()}
          selected={this.isSelected()}
          colorSchema={this.props.colorSchema}
          id={this.props.id}
          mainAttrs={attrs}
          tooltip={attrs.title}
        >
          <h1 className={this.getClassName("jumbotronContent") + " " + this.getClassName("text")}>
            {this.getChildren()}
          </h1>
        </Jumbotron>
      );
    }

    return this.getNestingLevel() ? (
      <>
        {this.isInlineEdited() && this._renderEditationMode()}
        {this.isNotInlineEdited() && result}
      </>
    ) : null;
  },
  //@@viewOff:render
});

export default Header;
