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
import "uu5g04-bricks";

import Css from "./css.js";
import ns from "../bricks-editable-ns.js";
import MenuItemControls from "./menu-item-controls.js";
//@@viewOff:imports
const ClassNames = UU5.Common.ClassNames;

function getColorSchemaClassName(colorSchema) {
  if (colorSchema) {
    return `color-schema-${colorSchema}`;
  } else {
    return "";
  }
}

const MenuItem = UU5.Common.VisualComponent.create({
  //@@viewOn:mixins
  mixins: [UU5.Common.BaseMixin, UU5.Common.ContentMixin],
  //@@viewOff:mixins

  //@@viewOn:statics
  statics: {
    tagName: ns.name("MenuItem"),
    classNames: {
      main:
        ns.css("menu-item") +
        " " +
        Css.css(`
        position: relative;
        border-radius: 2px;

        & + & {
          margin-top: 2px;
        }
      `),
      styleWrapper: () =>
        Css.css(`
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 4px 8px;
        cursor: pointer;
        outline: none;

        &:hover, &:focus {
          .uu5-bricks-editable-menu-item-separator {
            visibility: visible;
          }

          & + .uu5-bricks-editable-menu-item-controls {
            opacity: 1;
          }
        }
      `),
      rightSide: () =>
        Css.css(`
        display: flex;
      `),
      itemContentWrapper: () =>
        Css.css(`
        display: flex;
        align-items: center;
      `),
      itemIcon: () =>
        Css.css(`
        margin-right: 8px;
      `),
      dndDragger: () =>
        Css.css(`
        font-size: 23px;
        cursor: drag;
      `),
      infoIcons: () =>
        Css.css(`
        margin-right: 4px;

        & + & {
          margin-left: 4px;
        }
      `),
      infoIconsItem: () =>
        Css.css(`
        padding: 0 8px;
        height: 21px;
        width: 21px;
        display: inline-flex;
        align-items: center;
        justify-content: center;

        & + & {
          margin-left: 4px;
        }
      `),
      separator: props =>
        ns.css("menu-item-separator") +
        " " +
        Css.css(`
        visibility: ${props.isActive ? "visible" : "hidden"};
        background-color: ${props.isActive ? "#FFFFFF" : "#000000"};
        padding-right: 1px;
        margin-right: -1px;
      `),
      controlsPlaceholder: () =>
        Css.css(`
        width: 28px;
        height: 24px;
      `),
      controls: () =>
        Css.css(`
        position: absolute;
        right: 0;
        top: 0;
        bottom: 0;
        width: 32px;
      `)
    }
  },
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {
    icon: UU5.PropTypes.string,
    onClick: UU5.PropTypes.func,
    controls: UU5.PropTypes.array,
    infoIcons: UU5.PropTypes.array,
    isActive: UU5.PropTypes.bool,
    colorSchema: UU5.PropTypes.string,
    colorSchemaActive: UU5.PropTypes.string,
    controlsColorSchema: UU5.PropTypes.string,
    controlsColorSchemaActive: UU5.PropTypes.string
  },
  //@@viewOff:propTypes

  //@@viewOn:getDefaultProps
  getDefaultProps() {
    return {
      icon: "mdi-blank",
      onClick: undefined,
      controls: undefined,
      infoIcons: undefined,
      isActive: false,
      colorSchema: undefined,
      colorSchemaActive: undefined,
      controlsColorSchema: undefined,
      controlsColorSchemaActive: undefined
    };
  },
  //@@viewOff:getDefaultProps

  //@@viewOn:reactLifeCycle
  //@@viewOff:reactLifeCycle

  //@@viewOn:interface
  //@@viewOff:interface

  //@@viewOn:overridingMethods
  //@@viewOff:overridingMethods

  //@@viewOn:private
  _getInfoIcons() {
    return (
      <span className={this.getClassName("infoIcons")}>
        {this.props.infoIcons.map((item, index) => {
          let classNames = [this.getClassName("infoIconsItem")];
          let colorSchema = UU5.Environment.getColorSchema(item.colorSchema);

          if (colorSchema) {
            classNames.push(`color-schema-${colorSchema} ${ClassNames.transparent}`);
          }

          return <UU5.Bricks.Icon icon={item.icon} key={index} className={classNames.join(" ")} />;
        })}
      </span>
    );
  },

  _getSeparator() {
    return <span className={this.getClassName("separator")} />;
  },

  _getChildren() {
    return (
      <div className={this.getClassName("itemContentWrapper")}>
        {this.props.icon ? <UU5.Bricks.Icon className={this.getClassName("itemIcon")} icon={this.props.icon} /> : null}
        <span className={this.getClassName("itemButtonText")}>{this.getChildren()}</span>
      </div>
    );
  },

  _getStyleWrapperAttrs() {
    let props = {
      tabIndex: "0",
      className: `${this.getClassName("styleWrapper")} ${UU5.Common.ClassNames.hover} ${UU5.Common.ClassNames.focus}`
    };

    if (this.props.isActive) {
      props.className += ` ${UU5.Common.ClassNames.bg} ${UU5.Common.ClassNames.filled} ${getColorSchemaClassName(
        this.props.colorSchemaActive
      )}`;
    } else {
      props.className += ` ${UU5.Common.ClassNames.transparent} ${getColorSchemaClassName(this.props.colorSchema)}`;
    }

    return props;
  },
  //@@viewOff:private

  //@@viewOn:render
  render() {
    return (
      <li {...this.getMainAttrs()} onClick={this.props.onClick}>
        <div {...this._getStyleWrapperAttrs()}>
          <span>{this._getChildren()}</span>
          <span className={this.getClassName("rightSide")}>
            {this.props.infoIcons ? this._getInfoIcons() : null}
            {this.props.infoIcons && this.props.controls ? this._getSeparator() : null}
            <span className={this.getClassName("controlsPlaceholder")} />
          </span>
        </div>
        {this.props.controls ? (
          <UU5.Bricks.ScreenSize>
            <MenuItemControls
              items={this.props.controls}
              isActive={this.props.isActive}
              colorSchema={this.props.isActive ? this.props.controlsColorSchemaActive : this.props.controlsColorSchema}
              className={this.getClassName("controls")}
            />
          </UU5.Bricks.ScreenSize>
        ) : null}
      </li>
    );
  }
  //@@viewOff:render
});

export default MenuItem;
