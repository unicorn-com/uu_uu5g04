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

const EditableColumn = UU5.Common.Component.lazy(async () => {
  await SystemJS.import("uu5g04-forms");
  await SystemJS.import("uu5g04-bricks-editable");
  return import("./internal/column.js");
});

import "./column.less";
//@@viewOff:imports

let editationLazyLoaded = false;

export const Column = UU5.Common.VisualComponent.create({
  displayName: "Column", // for backward compatibility (test snapshots)
  //@@viewOn:mixins
  mixins: [
    UU5.Common.BaseMixin,
    UU5.Common.ElementaryMixin,
    UU5.Common.NestingLevelMixin,
    UU5.Common.SectionMixin,
    UU5.Common.PureRenderMixin,
    UU5.Common.EditableMixin
  ],
  //@@viewOff:mixins

  //@@viewOn:statics
  statics: {
    tagName: ns.name("Column"),
    nestingLevelList: UU5.Environment.getNestingLevelList("spa", "smallBoxCollection"),
    classNames: {
      main: ns.css("column"),
      spacing: ns.css("column-spacing"),
      noSpacing: ns.css("column-nospacing"),
      editation: ns.css("column-editation")
    },
    defaults: {
      colWidth: { xs: 12, s: 12, m: 12, l: 12, xl: 12 },
      columnRegexp: /^((?:offset-)?[a-z]+)(?:-)?(\d+)$/
    },
    opt: {
      nestingLevelWrapper: true
    },
    editMode: {
      name: { en: "Column", cs: "Sloupec" },
      backgroundColor: "rgba(186,104,200,.4)",
      color: "#4A148C",
      highlightColor: "rgba(227,195,233,.45)"
    }
  },
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {
    noSpacing: UU5.PropTypes.bool,
    width: UU5.PropTypes.oneOfType([UU5.PropTypes.string, UU5.PropTypes.number]),
    // BS Column magic
    colWidth: UU5.PropTypes.oneOfType([
      UU5.PropTypes.shape({
        xs: UU5.PropTypes.number,
        s: UU5.PropTypes.number,
        m: UU5.PropTypes.number,
        l: UU5.PropTypes.number,
        xl: UU5.PropTypes.number
      }),
      UU5.PropTypes.string
    ])
  },
  //@@viewOff:propTypes

  //@@viewOn:getDefaultProps
  getDefaultProps() {
    return {
      noSpacing: false,
      width: null,
      colWidth: null
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
    return this._editableColumn ? this._editableColumn.getPropsToSave() : undefined;
  },
  //@@viewOff:overriding

  //@@viewOn:private
  _getMainAttrs() {
    let mainAttrs = this.getMainAttrs();
    mainAttrs.className += " " + this.getClassName(this.props.noSpacing ? "noSpacing" : "spacing");

    if (this.state.editation) {
      mainAttrs.className += ` ${this.getClassName("editation")}`;
    }

    if (this.props.width) {
      mainAttrs.style = UU5.Common.Tools.merge(mainAttrs.style, { width: this.props.width });
    } else {
      mainAttrs.className +=
        " " + UU5.Common.Tools.buildColWidthClassName(this.props.colWidth || this.getDefault().colWidth);
    }

    return mainAttrs;
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
        <EditableColumn component={this} ref_={this._registerEditableColumn} />
      </UU5.Common.Suspense>
    );
  },

  _registerEditableColumn(column) {
    this._editableColumn = column;
  },
  //@@viewOff:private

  //@@viewOn:render
  render() {
    return this.getNestingLevel() ? (
      <div {...this._getMainAttrs()}>
        {this.state.editation ? this._renderEditationMode() : null}
        {!this.state.editation || !this._isEditationLazyLoaded()
          ? [this.getHeaderChild(), this.getChildren(), this.getFooterChild(), this.getDisabledCover()]
          : null}
      </div>
    ) : null;
  }
  //@@viewOff:render
});

export default Column;
