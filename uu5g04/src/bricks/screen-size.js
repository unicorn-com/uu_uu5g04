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
import ScreenSizeItem from "./screen-size-item.js";
import Lsi from "./internal/bricks-editable-lsi.js";

import "./screen-size.less";

const EditationComponent = UU5.Common.Component.lazy(async () => {
  await SystemJS.import("uu5g04-forms");
  await SystemJS.import("uu5g04-bricks-editable");
  return import("./internal/screen-size-editable.js");
});
//@@viewOff:imports

let editationLazyLoaded = false;

export const ScreenSize = UU5.Common.VisualComponent.create({
  displayName: "ScreenSize", // for backward compatibility (test snapshots)
  //@@viewOn:mixins
  mixins: [
    UU5.Common.BaseMixin,
    UU5.Common.ElementaryMixin,
    UU5.Common.ContentMixin,
    UU5.Common.ScreenSizeMixin,
    UU5.Common.NestingLevelMixin,
    UU5.Common.EditableMixin,
  ],
  //@@viewOff:mixins

  //@@viewOn:statics
  statics: {
    tagName: ns.name("ScreenSize"),
    nestingLevelList: UU5.Environment.getNestingLevelList("spa"),
    classNames: {
      main: ns.css("screen-size"),
    },
    defaults: {
      childTagName: "UU5.Bricks.ScreenSize.Item",
    },
    opt: {
      nestingLevelWrapper: true,
    },
    editMode: {
      name: Lsi.screenSize.name,
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
    screenSize: UU5.PropTypes.string,
  },
  //@@viewOff:propTypes

  //@@viewOn:getDefaultProps
  getDefaultProps: function () {
    return {
      screenSize: null,
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
  isScreenSize() {
    return true;
  },
  //@@viewOff:interface

  //@@viewOn:overriding
  onBeforeForceEndEditation_() {
    return this._editableComponent ? this._editableComponent.getPropsToSave() : undefined;
  },
  //@@viewOff:overriding

  //@@viewOn:private
  _expandChildProps: function (child) {
    let newChildProps = { ...child.props };

    newChildProps.id = newChildProps.id || this.getId() + "-inner";
    newChildProps.controlled = true;
    newChildProps.hidden = this.isHidden();
    newChildProps.disabled = this.isDisabled();
    newChildProps.selected = this.isSelected();
    newChildProps.nestingLevel = this.getNestingLevel();

    return newChildProps;
  },

  _getChildren() {
    let children;
    let screenSizes = {};
    let screenSize = this.getScreenSize();

    if (typeof this.props.children === "function") {
      children = this.props.children({ screenSize });
    } else {
      let allChildren = this.getChildren();

      if (allChildren) {
        if (!Array.isArray(allChildren)) allChildren = [allChildren];

        children = allChildren.map((child, index) => {
          let newChild = child;

          if (UU5.Common.Element.isValid(child)) {
            if (child.type.tagName === this.getDefault("childTagName")) {
              // ScreenSize.Item
              let childScreenSizes;

              if (Array.isArray(child.props.screenSize)) {
                childScreenSizes = child.props.screenSize;
              } else {
                childScreenSizes = child.props.screenSize.split(" ");
              }

              childScreenSizes.forEach((childScreenSize) => (screenSizes[childScreenSize] = { child, index }));
              newChild = null;
            } else {
              // language as prop
              newChild = UU5.Common.Element.clone(child, { screenSize });
            }
          }

          return newChild;
        });
      }

      if (Object.keys(screenSizes).length > 0) {
        let { child, index } = screenSizes[screenSize] || screenSizes["*"] || {};
        if (child) children[index] = UU5.Common.Element.clone(child, this._expandChildProps(child));
      }
    }

    return children || null;
  },

  _isEditationLazyLoaded() {
    return editationLazyLoaded;
  },

  _registerEditableComponent(component) {
    this._editableComponent = component;
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
  render: function () {
    return this.getNestingLevel() ? (
      <>
        {this.isInlineEdited() ? this._renderEditationMode() : null}
        {this.isNotInlineEdited()  ? this._getChildren() : null}
      </>
    ) : null;
  },
  //@@viewOff:render
});

ScreenSize.Item = ScreenSizeItem;

export default ScreenSize;
