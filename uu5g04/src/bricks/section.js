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
import { Div } from "./factory.js";
import { InlineMode } from "./internal/inline-mode.js";
import Css from "./internal/css.js";
const EditableSection = UU5.Common.Component.lazy(async () => {
  await SystemJS.import("uu5g04-forms");
  await SystemJS.import("uu5g04-bricks-editable");
  return import("./internal/section-editable.js");
});

let editationLazyLoaded = false;

import "./section.less";
import Lsi from "./bricks-lsi.js";
//@@viewOff:imports

let Section = UU5.Common.VisualComponent.create({
  displayName: "Section", // for backward compatibility (test snapshots)

  //@@viewOn:mixins
  mixins: [
    UU5.Common.BaseMixin,
    UU5.Common.PureRenderMixin,
    UU5.Common.ElementaryMixin,
    UU5.Common.NestingLevelMixin,
    UU5.Common.SectionMixin,
    UU5.Common.ColorSchemaMixin,
    UU5.Common.EditableMixin,
  ],
  //@@viewOff:mixins

  //@@viewOn:statics
  statics: {
    tagName: ns.name("Section"),
    nestingLevelList: UU5.Environment.getNestingLevelList("bigBoxCollection", "box"),
    classNames: {
      main: ns.css("section"),
      pageBreakBefore: () => Css.css`break-before: page;`,
    },
    opt: {
      nestingLevelWrapper: true,
    },
    editMode: {
      name: Lsi.inlineComponentHeaders.sectionName,
      backgroundColor: "rgba(0,0,0,.2)",
      color: "rgba(0,0,0,.87)",
      highlightColor: "#CCCCCC",
      enablePlaceholder: true,
    },
  },
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {
    pageBreakBefore: UU5.PropTypes.bool,
  },
  //@@viewOff:propTypes

  //@@viewOn:getDefaultProps
  getDefaultProps() {
    return {
      pageBreakBefore: false,
    };
  },
  //@@viewOff:getDefaultProps

  //@@viewOn:reactLifeCycle
  getInitialState() {
    return {
      editationLazyLoaded: false,
    };
  },
  //@@viewOff:reactLifeCycle

  //@@viewOn:interface
  //@@viewOff:interface

  //@@viewOn:overriding
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
  //@@viewOff:overriding

  //@@viewOn:private
  _getPropsToPass() {
    let propsToPass = this.getMainPropsToPass();
    if (this.props.pageBreakBefore) propsToPass.className += " " + this.getClassName("pageBreakBefore");
    return UU5.Common.Tools.merge(propsToPass, {
      content: null,
      header: null,
      footer: null,
      id: this.getId(),
    });
  },

  _registerNull(inst) {
    // unmount of component means that suspense is loaded and component should be rendered
    if (!inst) {
      this.setState((state) => {
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

  _renderEditationMode(inline = false) {
    return (
      <UU5.Common.Suspense fallback={<span ref={this._registerNull} />}>
        <EditableSection inline={inline} component={this} ref_={this._registerEditableSection} />
      </UU5.Common.Suspense>
    );
  },

  _registerEditableSection(section) {
    this._editableSection = section;
  },

  _registerEditableModal(ref) {
    this._editModal = ref;
    this._editModal.open();
  },
  //@@viewOff:private
  //@@viewOn:render
  render: function () {
    return this.getNestingLevel() ? (
      <Div {...this._getPropsToPass()}>
        {this.state.editation ? this._renderEditationMode() : null}
        {!this.state.editation || !this._isEditationLazyLoaded()
          ? [this.getHeaderChild(), this.getChildren(), this.getFooterChild()]
          : null}
      </Div>
    ) : (
      <InlineMode
        component={this}
        Component={UU5.Bricks.Section}
        editModalHeader={<UU5.Bricks.Lsi lsi={Lsi.inlineComponentHeaders.sectionEditHeader} />}
        modalHeader={this.props.header || <UU5.Bricks.Lsi lsi={Lsi.inlineComponentHeaders.sectionName} />}
        linkTitle={this.props.header || <UU5.Bricks.Lsi lsi={Lsi.inlineComponentHeaders.sectionName} />}
        getPropsToSave={this.onBeforeForceEndEditation_}
        renderEditationMode={this._renderEditationMode}
      />
    );
  },
  //@@viewOff:render
});

export { Section };

export default Section;
