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
import Modal from "./modal.js";
import "./box.less";
import Lsi from "./internal/bricks-editable-lsi.js";

const ClassNames = UU5.Common.ClassNames;

const EditationComponent = UU5.Common.Component.lazy(async () => {
  await SystemJS.import("uu5g04-forms");
  await SystemJS.import("uu5g04-bricks-editable");
  return import("./internal/box-editable.js");
});
//@@viewOff:imports

export const Box = UU5.Common.VisualComponent.create({
  displayName: "Box", // for backward compatibility (test snapshots)
  //@@viewOn:mixins
  mixins: [
    UU5.Common.BaseMixin,
    UU5.Common.ElementaryMixin,
    UU5.Common.NestingLevelMixin,
    UU5.Common.ContentMixin,
    UU5.Common.ColorSchemaMixin,
    UU5.Common.PureRenderMixin,
    UU5.Common.EditableMixin,
  ],
  //@@viewOff:mixins

  //@@viewOn:statics
  statics: {
    tagName: ns.name("Box"),
    nestingLevelList: UU5.Environment.getNestingLevelList("bigBoxCollection", "inline"),
    classNames: {
      main: ns.css("box", "text"),
      nestingLevelSmallBox: ns.css("box-nesting-level-small-box uu5-common-padding-s"),
      nestingLevelInline: ns.css("box-nesting-level-inline"),
      modal: ns.css("box-modal"),
      click: ns.css("box-click"),
    },
    opt: {
      nestingLevelWrapper: true,
    },
    editMode: {
      name: Lsi.box.name,
      enablePlaceholder: true,
      startMode: "button",
    },
  },
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {
    infoHeader: UU5.PropTypes.any,
    infoContent: UU5.PropTypes.any,
    disableClick: UU5.PropTypes.bool,
    bgStyle: UU5.PropTypes.oneOf(["filled", "outline", "transparent", "underline"]),
    borderRadius: UU5.PropTypes.string,
    elevation: UU5.PropTypes.oneOf(["-1", "0", "1", "2", "3", "4", "5", -1, 0, 1, 2, 3, 4, 5]),
    elevationHover: UU5.PropTypes.oneOf(["-1", "0", "1", "2", "3", "4", "5", -1, 0, 1, 2, 3, 4, 5]),
  },
  //@@viewOff:propTypes

  //@@viewOn:getDefaultProps
  getDefaultProps() {
    return {
      infoHeader: "Info",
      infoContent: null,
      disableClick: false,
      bgStyle: "filled",
      borderRadius: null,
      elevation: null,
      elevationHover: null,
    };
  },
  //@@viewOff:getDefaultProps

  //@@viewOn:reactLifeCycle
  //@@viewOff:reactLifeCycle

  //@@viewOn:interface
  openInfo(modalProps, setStateCallback) {
    if (this.props.infoContent || modalProps.content) {
      this.modal.open(modalProps, setStateCallback);
    }
    return this;
  },

  closeInfo(setStateCallback) {
    this.modal.close(true, setStateCallback);
    return this;
  },
  //@@viewOff:interface

  //@@viewOn:overriding
  onBeforeForceEndEditation_() {
    return this._editableComponent ? this._editableComponent.getPropsToSave() : undefined;
  },

  getEditablePropsValues_(propsArray) {
    let props = this.getEditablePropsValuesDefault(propsArray);

    if (typeof props.elevation === "number") {
      props.elevation = "" + props.elevation;
    }

    if (typeof props.elevationHover === "number") {
      props.elevationHover = "" + props.elevationHover;
    }

    return props;
  },
  //@@viewOff:overriding

  //@@viewOn:private
  _renderEditationMode() {
    return (
      <UU5.Common.Suspense fallback="">
        <EditationComponent component={this} ref_={this._registerEditableComponent} />
      </UU5.Common.Suspense>
    );
  },

  _registerEditableComponent(ref) {
    this._editableComponent = ref;
  },

  _getMainAttrs() {
    var attrs = this.getMainAttrs();

    if (this.props.borderRadius) {
      attrs.style = { ...attrs.style, ...{ borderRadius: this.props.borderRadius } };
    }

    if (this.props.bgStyle) {
      attrs.className += " " + ClassNames[this.props.bgStyle];
    }

    if (this.props.elevation) {
      attrs.className += " " + ClassNames.elevation + this.props.elevation;
    }

    if (this.props.elevationHover !== null) {
      attrs.className += " " + ClassNames.elevationHover + this.props.elevationHover;
    }

    if (this.props.infoContent && !this.props.disableClick) {
      attrs.onClick = () => !this.isDisabled() && this.modal.open();
      attrs.className += " " + this.getClassName().click + " " + ClassNames.hover;
    }

    switch (this.getNestingLevel()) {
      case "inline":
        attrs.className += " " + this.getClassName().nestingLevelInline;
        break;
      default:
        attrs.className += " " + this.getClassName().nestingLevelSmallBox;
    }

    return attrs;
  },
  //@@viewOff:private

  //@@viewOn:render
  render() {
    let component = null;
    if (this.getNestingLevel()) {
      if (this.getNestingLevel() === "inline") {
        component = <UU5.Bricks.Text {...this.getMainPropsToPass()}>{this.getChildren()}</UU5.Bricks.Text>;
      } else {
        let modal;

        if (this.props.infoContent) {
          modal = (
            <Modal
              className={this.getClassName().modal}
              ref_={(modal) => (this.modal = modal)}
              content={this.props.infoContent}
              header={this.props.infoHeader}
              parent={this}
            />
          );
        }

        component = (
          <UU5.Common.Fragment>
            <div {...this._getMainAttrs()}>
              {this.getChildren()}
              {this.getDisabledCover()}
            </div>
            {modal}
            {this.state.editation ? this._renderEditationMode() : null}
          </UU5.Common.Fragment>
        );
      }
    }

    return component;
  },
  //@@viewOff:render
});

export default Box;
