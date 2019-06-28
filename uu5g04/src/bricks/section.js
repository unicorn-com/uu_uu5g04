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

import React from "react";
import createReactClass from "create-react-class";
import * as UU5 from "uu5g04";
import ns from "./bricks-ns.js";

import { Div } from "./factory.js";

import "./section.less";

export const Section = createReactClass({
  //@@viewOn:mixins
  mixins: [
    UU5.Common.BaseMixin,
    UU5.Common.PureRenderMixin,
    UU5.Common.ElementaryMixin,
    UU5.Common.NestingLevelMixin,
    UU5.Common.SectionMixin,
    UU5.Common.ColorSchemaMixin,
    UU5.Common.EditableMixin
  ],
  //@@viewOff:mixins

  //@@viewOn:statics
  statics: {
    tagName: ns.name("Section"),
    nestingLevelList: UU5.Environment.getNestingLevelList("bigBoxCollection", "box"),
    classNames: {
      main: ns.css("section")
    },
    opt: {
      nestingLevelWrapper: true
    }
  },
  //@@viewOff:statics

  //@@viewOn:propTypes
  //@@viewOff:propTypes

  //@@viewOn:getDefaultProps
  //@@viewOff:getDefaultProps

  //@@viewOn:standardComponentLifeCycle
  //@@viewOff:standardComponentLifeCycle

  //@@viewOn:interface
  //@@viewOff:interface

  //@@viewOn:overridingMethods
  onBeforeForceEndEditation_() {
    return this._editableSection ? this._editableSection.getPropsToSave() : undefined;
  },
  expandHeaderProps_(header) {
    let props = { ...header.props };
    if (!props.colorSchema && this.props.colorSchema !== "default") {
      props.colorSchema = this.props.colorSchema;
    }

    return props;
  },
  //@@viewOff:overridingMethods

  //@@viewOn:componentSpecificHelpers
  _getPropsToPass() {
    return UU5.Common.Tools.merge(this.getMainPropsToPass(), {
      content: null,
      header: null,
      footer: null,
      id: this.getId()
    });
  },

  _renderEditationMode() {
    return (
      <UU5.Common.TagPlaceholder
        key="edit-mode"
        id="edit-mode"
        tagName="UU5.BricksEditable.Section"
        props={{
          component: this,
          ref_: this._registerEditableSection
        }}
      />
    );
  },

  _registerEditableSection(section) {
    this._editableSection = section;
  },
  //@@viewOff:componentSpecificHelpers

  //@@viewOn:render
  render: function() {
    return this.getNestingLevel() ? (
      <Div {...this._getPropsToPass()}>
        {this.state.editation
          ? this._renderEditationMode()
          : [this.getHeaderChild(), this.getChildren(), this.getFooterChild()]}
      </Div>
    ) : null;
  }
  //@@viewOff:render
});

export default Section;
