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

import Footer from "./blockquote-footer.js";

const EditableBlockquote = UU5.Common.Component.lazy(async () => {
  await SystemJS.import("uu5g04-forms");
  await SystemJS.import("uu5g04-bricks-editable");
  return import("./internal/blockquote.js");
});

let editationLazyLoaded = false;

import "./blockquote.less";
//@@viewOff:imports

export const Blockquote = UU5.Common.VisualComponent.create({
  displayName: "Blockquote", // for backward compatibility (test snapshots)
  //@@viewOn:mixins
  mixins: [
    UU5.Common.BaseMixin,
    UU5.Common.ElementaryMixin,
    UU5.Common.NestingLevelMixin,
    UU5.Common.ColorSchemaMixin,
    UU5.Common.ContentMixin,
    UU5.Common.PureRenderMixin,
    UU5.Common.EditableMixin
  ],
  //@@viewOff:mixins

  //@@viewOn:statics
  statics: {
    tagName: ns.name("Blockquote"),
    nestingLevelList: UU5.Environment.getNestingLevelList("bigBoxCollection", "box"),
    classNames: {
      main: ns.css("blockquote"),
      bg: ns.css("blockquote-bg"),
      right: "blockquote-reverse",
      noSpacing: ns.css("blockquote-nospacing"),
      editation: ns.css("blockquote-editation")
    },
    opt: {
      nestingLevelWrapper: true
    }
  },
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {
    background: UU5.PropTypes.bool,
    alignment: UU5.PropTypes.oneOf(["left", "right"]),
    footer: UU5.PropTypes.any,
    footerAlignment: UU5.PropTypes.oneOf(["left", "right"]),
    noSpacing: UU5.PropTypes.bool
  },
  //@@viewOff:propTypes

  //@@viewOn:getDefaultProps
  getDefaultProps: function() {
    return {
      background: false,
      alignment: "left",
      footer: null,
      footerAlignment: null,
      noSpacing: false
    };
  },
  //@@viewOff:getDefaultProps

  //@@viewOn:reactLifeCycle
  getInitialState() {
    return {
      editationLazyLoaded: false
    };
  },
  //@@viewOff:reactLifeCycle

  //@@viewOn:interface
  //@@viewOff:interface

  //@@viewOn:overriding
  onBeforeForceEndEditation_() {
    return this._editableBlockquote ? this._editableBlockquote.getPropsToSave() : undefined;
  },
  //@@viewOff:overriding

  //@@viewOn:private
  _buildMainAttrs: function() {
    var mainAttrs = this.getMainAttrs();
    this.props.background && (mainAttrs.className += " " + this.getClassName().bg);
    this.props.alignment === "right" && (mainAttrs.className += " " + this.getClassName().right);
    this.props.noSpacing && (mainAttrs.className += " " + this.getClassName().noSpacing);
    return mainAttrs;
  },

  _getFooterAlignment: function() {
    return this.props.footerAlignment || this.props.alignment;
  },

  _registerNull(inst) {
    // unmount of component means that suspense is loaded and component should be rendered
    if (!inst) {
      this.setState(state => {
        if (state.editationLazyLoaded) return;

        // Edit component is loaded - need to set to static variable because other Edit component does not render fallback component
        // editationLazyLoaded is stored in both state and static variable for cases such as when more edit modes are loaded at the same time
        editationLazyLoaded = true;
        return { editationLazyLoaded: true };
      });
    }
  },

  _isEditationLazyLoaded() {
    return editationLazyLoaded;
  },

  _renderEditationMode() {
    return (
      <UU5.Common.Suspense fallback={<span ref={this._registerNull} />}>
        <EditableBlockquote component={this} ref_={this._registerEditableBlockquote} />
      </UU5.Common.Suspense>
    );
  },

  _registerEditableBlockquote(blockquote) {
    this._editableBlockquote = blockquote;
  },
  //@@viewOff:private

  //@@viewOn:render
  render: function() {
    return this.getNestingLevel() ? (
      <blockquote {...this._buildMainAttrs()}>
        {this.state.editation ? this._renderEditationMode() : null}
        {!this.state.editation || !this._isEditationLazyLoaded()
          ? [
              this.getChildren(),
              this.props.footer && (
                <Footer content={this.props.footer} alignment={this._getFooterAlignment()} key="footer" />
              ),
              this.getDisabledCover()
            ]
          : null}
      </blockquote>
    ) : null;
  }
  //@@viewOff:render
});

export default Blockquote;
