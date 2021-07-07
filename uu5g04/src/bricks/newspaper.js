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
import { InlineMode } from "./internal/inline-mode.js";
import "./newspaper.less";
import Lsi from "./bricks-lsi.js";

const EditationComponent = UU5.Common.Component.lazy(async () => {
  await SystemJS.import("uu5g04-forms");
  await SystemJS.import("uu5g04-bricks-editable");
  return import("./internal/newspaper-editable.js");
});
//@@viewOff:imports

export const Newspaper = UU5.Common.VisualComponent.create({
  displayName: "Newspaper", // for backward compatibility (test snapshots)

  //@@viewOn:mixins
  mixins: [
    UU5.Common.BaseMixin,
    UU5.Common.PureRenderMixin,
    UU5.Common.ElementaryMixin,
    UU5.Common.SectionMixin,
    UU5.Common.ColorSchemaMixin,
    UU5.Common.NestingLevelMixin,
    UU5.Common.EditableMixin,
  ],
  //@@viewOff:mixins

  //@@viewOn:statics
  statics: {
    tagName: ns.name("Newspaper"),
    nestingLevelList: UU5.Environment.getNestingLevelList("bigBoxCollection", "box"),
    classNames: {
      main: ns.css("newspaper uu5-common-text"),
      //bg: 'uu5-common-bg',
      columns: "uu5-common-newspaper-layout-",
    },
    editMode: {
      name: Lsi.inlineComponentHeaders.newspaperName,
      backgroundColor: "rgba(0,0,0,.2)",
      color: "rgba(0,0,0,.87)",
      highlightColor: "#CCCCCC",
      enablePlaceholder: true,
      startMode: "button",
    },
  },
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {
    columnsCount: UU5.PropTypes.oneOf([1, 2, 3, 4, 5, 6]),
    //background: UU5.PropTypes.bool
  },
  //@@viewOff:propTypes

  //@@viewOn:getDefaultProps
  getDefaultProps() {
    return {
      columnsCount: 2,
      //background: false
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

  _renderEditationMode(renderInline) {
    return (
      <UU5.Common.Suspense fallback={this.getEditingLoading()}>
        <EditationComponent
          renderInline={renderInline}
          component={this}
          ref_={this._registerEditableComponent}
          renderView={this._renderView}
        />
      </UU5.Common.Suspense>
    );
  },

  _renderView(forcedContent, nestingLevel, isEdited) {
    let props = this._getMainProps(this.isInlineEdited());
    if (forcedContent) {
      props.content = forcedContent;
    }
    let header = {};
    let inlineProps = {};
    let headerToUse = nestingLevel
      ? this.props.header
      : this.props.header || <UU5.Bricks.Lsi lsi={Lsi.inlineComponentHeaders.newspaperName} />;
    if (!isEdited) {
      header.header = headerToUse;
    }
    if (!nestingLevel) {
      inlineProps.nestingLevel = "bigBox";
      inlineProps.parent = null;
    }
    return (
      <Section {...props} {...inlineProps} {...header}>
        {this.props.children && UU5.Common.Children.toArray(this.props.children)}
      </Section>
    );
  },

  _getMainProps(editation) {
    let mainProps = this.getMainPropsToPass();

    if (editation) {
      mainProps.header = undefined;
      mainProps.footer = undefined;
    } else {
      // display only single column in editation because if there is a RichText (DccPlaceholder) in the content, it will be weirdly split into columns
      // and sometimes it freezes the whole page (maybe some infinite loop) after an interaction
      mainProps.className += " " + this.getClassName().columns + this.props.columnsCount;
    }

    return mainProps;
  },
  //@@viewOff:private

  //@@viewOn:render
  render() {
    let nestingLevel = this.getNestingLevel();
    return nestingLevel ? (
      <>
        {this.isInlineEdited() && this._renderEditationMode()}
        {this.isNotInlineEdited() && this._renderView(null, nestingLevel)}
      </>
    ) : (
      <InlineMode
        component={this}
        Component={UU5.Bricks.Newspaper}
        editModalHeader={<UU5.Bricks.Lsi lsi={Lsi.inlineComponentHeaders.newspaperEditHeader} />}
        modalHeader={this.props.header || <UU5.Bricks.Lsi lsi={Lsi.inlineComponentHeaders.newspaperName} />}
        linkTitle={this.props.header || <UU5.Bricks.Lsi lsi={Lsi.inlineComponentHeaders.newspaperName} />}
        getPropsToSave={this.onBeforeForceEndEditation_}
        renderEditationMode={this.renderEditationMode}
      />
    );
  },
  //@@viewOff:render
});

export default Newspaper;
