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
import Section from "./section.js";
import Css from "./internal/css.js";
import { InlineMode } from "./internal/inline-mode.js";
import Lsi from "./bricks-lsi.js";
const ClassNames = UU5.Common.ClassNames;

import "./card.less";
const CardEditable = UU5.Common.Component.lazy(async () => {
  await SystemJS.import("uu5g04-forms");
  await SystemJS.import("uu5g04-bricks-editable");
  return import("./internal/card-editable.js");
});
//@@viewOff:imports

let Card = UU5.Common.VisualComponent.create({
  displayName: "Card", // for backward compatibility (test snapshots)

  //@@viewOn:mixins
  mixins: [
    UU5.Common.BaseMixin,
    UU5.Common.ElementaryMixin,
    UU5.Common.NestingLevelMixin,
    UU5.Common.SectionMixin,
    UU5.Common.PureRenderMixin,
    UU5.Common.ColorSchemaMixin,
    UU5.Common.EditableMixin,
  ],
  //@@viewOff:mixins

  //@@viewOn:statics
  statics: {
    tagName: ns.name("Card"),
    nestingLevelList: UU5.Environment.getNestingLevelList("bigBoxCollection", "box"),
    classNames: {
      main: ns.css("card"),
      inline: ns.css("card-inline"),
      spaces: ns.css("card-spaces"),
      defaultColor: ns.css("card-default"),
    },
    opt: {
      dummyLevel: true,
    },
    editMode: {
      enablePlaceholder: true,
      displayType: "inline",
      startMode: "button",
      name: Lsi.inlineComponentHeaders.cardName,
    },
  },
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {
    elevation: UU5.PropTypes.oneOf(["-1", "0", "1", "2", "3", "4", "5", -1, 0, 1, 2, 3, 4, 5]),
    elevationHover: UU5.PropTypes.oneOf(["-1", "0", "1", "2", "3", "4", "5", -1, 0, 1, 2, 3, 4, 5]),
    inline: UU5.PropTypes.bool,
    width: UU5.PropTypes.number,
    minWidth: UU5.PropTypes.number,
    noSpaces: UU5.PropTypes.bool,
    bgStyle: UU5.PropTypes.oneOf(["filled", "outline", "transparent", "underline"]),
    borderRadius: UU5.PropTypes.oneOfType([UU5.PropTypes.string, UU5.PropTypes.number]),
  },
  //@@viewOff:propTypes

  //@@viewOn:getDefaultProps
  getDefaultProps() {
    return {
      elevation: 1,
      elevationHover: 1,
      inline: false,
      width: null,
      minWidth: null,
      noSpaces: false,
      bgStyle: "filled",
      borderRadius: null,
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

  _getMainProps(editation) {
    const mainProps = this.getMainPropsToPass();
    mainProps.className += " uu5-elevation-" + this.props.elevation;
    mainProps.className += " uu5-elevation-hover-" + this.props.elevationHover;
    mainProps.underline = this.props.underline;

    if (editation) {
      mainProps.header = undefined;
      mainProps.footer = undefined;
    }

    !this.props.noSpaces && (mainProps.className += " " + this.getClassName("spaces"));

    if (this.props.bgStyle) {
      mainProps.className += " " + ClassNames[this.props.bgStyle];
    }

    if (this.props.bgStyle === "filled") {
      mainProps.className += " " + this.getClassName("defaultColor");
    }

    if (this.props.elevation) {
      mainProps.className += " " + ClassNames.elevation + this.props.elevation;
    }

    if (this.props.elevationHover !== null) {
      mainProps.className += " " + ClassNames.elevationHover + this.props.elevationHover;
    }

    if (this.props.width !== null || this.props.minWidth !== null) {
      mainProps.style = mainProps.style || {};
      this.props.width !== null && (mainProps.style.width = this.props.width);
      this.props.minWidth !== null && (mainProps.style.minWidth = this.props.minWidth);
      mainProps.className += " " + this.getClassName("inline");
    } else if (this.props.inline) {
      mainProps.className += " " + this.getClassName("inline");
    }

    if (this.props.borderRadius) {
      mainProps.style = { ...mainProps.style, ...{ borderRadius: this.props.borderRadius } };
    }

    if (this.props.header) {
      mainProps.className += " " + Css.css`& > .uu5-bricks-header:first-child { margin-top: 0px; }`;
    }

    return mainProps;
  },

  _renderEditationMode(inline = false) {
    return (
      <UU5.Common.Suspense fallback={this.getEditingLoading()}>
        <CardEditable
          inline={inline}
          component={this}
          ref_={this._registerEditableComponent}
          renderView={this._renderView}
        />
      </UU5.Common.Suspense>
    );
  },

  _renderView(forcedContent, isInline) {
    let props = this._getMainProps(this.isInlineEdited());
    let inlineProps = {};
    if (forcedContent) {
      props.content = forcedContent;
    }
    if (isInline) {
      inlineProps.parent = undefined;
      inlineProps.nestingLevel = "bigBox";
    }

    return (
      <Section {...props} {...inlineProps}>
        {this.props.children && UU5.Common.Children.toArray(this.props.children)}
      </Section>
    );
  },
  //@@viewOff:private

  //@@viewOn:render
  render() {
    return (
      <>
        {this.getNestingLevel() ? (
          <>
            {this.isInlineEdited() && this._renderEditationMode()}
            {this.isNotInlineEdited() && this._renderView()}
          </>
        ) : (
          <InlineMode
            component={this}
            Component={UU5.Bricks.Card}
            editModalHeader={<UU5.Bricks.Lsi lsi={Lsi.inlineComponentHeaders.cardEditHeader} />}
            linkTitle={this.props.header || <UU5.Bricks.Lsi lsi={Lsi.inlineComponentHeaders.cardName} />}
            modalHeader={this.props.header || <UU5.Bricks.Lsi lsi={Lsi.inlineComponentHeaders.cardName} />}
            getPropsToSave={this.onBeforeForceEndEditation_}
            renderEditationMode={this._renderEditationMode}
          />
        )}
      </>
    );
  },
  //@@viewOff:render
});

export { Card };
export default Card;
