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
import { TAG, css } from "./config.js";
import Row from "./row.js";
import LsiButton from "./_lsi-button.js";
//@@viewOff:imports

function getItemContent(item, isActive) {
  let content = isActive ? item.activeContent : item.content;
  if (content) return typeof content === "string" ? content : <UU5.Bricks.Lsi lsi={content} />;
  else return undefined;
}

function getItemIcon(item) {
  return item.activeIcon || item.icon || undefined;
}

function getDropdownItemList(itemList) {
  return itemList.map((item) => ({
    label: getItemContent(item),
    disabled: item.disabled,
    onClick: item.onClick,
    onCtrlClick: item.onCtrlClick,
    onWheelClick: item.onWheelClick,
  }));
}

export const Block = UU5.Common.VisualComponent.create({
  displayName: "Block", // for backward compatibility (test snapshots)
  //@@viewOn:mixins
  mixins: [
    UU5.Common.BaseMixin,
    UU5.Common.ElementaryMixin,
    UU5.Common.NestingLevelMixin,
    UU5.Common.ContentMixin,
    UU5.Common.PureRenderMixin,
  ],
  //@@viewOff:mixins

  //@@viewOn:statics
  statics: {
    tagName: TAG + "Block",
    nestingLevelList: UU5.Environment.getNestingLevelList("boxCollection"),
    classNames: {
      main: () => css`
        margin: 8px;
      `,
      firstRow: () => css`
        display: flex;
        justify-content: space-between;
        align-items: flex-start;

        & + .${Row.classNames.main()} {
          margin-top: 0;
        }
      `,
      buttons: () => css`
        white-space: nowrap;
        flex: none;
      `,
      button: () => css`
        margin-left: 8px;
      `,
    },
    opt: {
      pureRender: true,
    },
  },
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {
    // content x activeContent and icon x activeIcon props currently behave in a weird way.
    // - if one of active, activeIcon or activeContent is defined, the item is automatically active
    // - if item is active then either icon or activeIcon is used
    // - if item is not active then neither icon or activeIcon is used
    // - if item is not active then content is used and if item is active then activeContent is used (that makes sense)
    actions: UU5.PropTypes.arrayOf(
      UU5.PropTypes.shape({
        onClick: UU5.PropTypes.func,
        onCtrlClick: UU5.PropTypes.func,
        onWheelClick: UU5.PropTypes.func,
        icon: UU5.PropTypes.string,
        content: UU5.PropTypes.oneOfType([UU5.PropTypes.object, UU5.PropTypes.string]),
        active: UU5.PropTypes.bool,
        activeIcon: UU5.PropTypes.string,
        activeContent: UU5.PropTypes.oneOfType([UU5.PropTypes.object, UU5.PropTypes.string]),
        bgStyle: UU5.PropTypes.string,
        borderRadius: UU5.PropTypes.string,
        disabled: UU5.PropTypes.bool,
        colorSchema: UU5.PropTypes.string,
        itemList: UU5.PropTypes.arrayOf(
          UU5.PropTypes.shape({
            content: UU5.PropTypes.oneOfType([UU5.PropTypes.object, UU5.PropTypes.string]),
            disabled: UU5.PropTypes.bool,
            onClick: UU5.PropTypes.func,
            onCtrlClick: UU5.PropTypes.func,
            onWheelClick: UU5.PropTypes.func,
          })
        ),
      })
    ),
    menuColorSchema: UU5.PropTypes.string,
    menuBgStyle: UU5.PropTypes.string,
    menuBorderRadius: UU5.PropTypes.string,
  },
  //@@viewOff:propTypes

  //@@viewOn:getDefaultProps
  getDefaultProps() {
    return {
      actions: [],
      menuColorSchema: "default",
      menuBgStyle: "outline",
      menuBorderRadius: undefined,
    };
  },
  //@@viewOff:getDefaultProps

  //@@viewOn:reactLifeCycle
  //@@viewOff:reactLifeCycle

  //@@viewOn:interface
  //@@viewOff:interface

  //@@viewOn:overriding
  //@@viewOff:overriding

  //@@viewOn:private
  _getButton(item, i) {
    let icon = getItemIcon(item);
    if (icon) icon = <UU5.Bricks.Icon icon={icon} key="icon" />;
    let content = null;
    if (item.activeContent) {
      content = getItemContent(item, true);
    }

    if (Array.isArray(item.itemList)) {
      content = <span key="content">{content}</span>;
      return (
        <UU5.Bricks.Dropdown
          key={i}
          className={this.getClassName("button")}
          bgStyle={item.bgStyle || "outline"}
          borderRadius={item.borderRadius}
          disabled={item.disabled}
          tooltip={item.content}
          label={[icon, content]}
          colorSchema={item.colorSchema}
          items={getDropdownItemList(item.itemList)}
        />
      );
    } else {
      return (
        <LsiButton
          key={i}
          className={this.getClassName("button")}
          onClick={item.onClick}
          onCtrlClick={item.onCtrlClick}
          onWheelClick={item.onWheelClick}
          bgStyle={item.bgStyle || "outline"}
          borderRadius={item.borderRadius}
          disabled={item.disabled}
          tooltip={item.content}
          content={[icon, content]}
          colorSchema={item.colorSchema}
        />
      );
    }
  },

  _getButtons(actions) {
    let buttons = [];
    let dropdownItems = [];
    let addDivider = undefined;

    actions.forEach((item, i) => {
      if (item.active || item.activeContent || item.activeIcon) {
        buttons.push(this._getButton(item, i));
      } else {
        if (addDivider) {
          dropdownItems.push({ divider: true });
          addDivider = false;
        } else {
          addDivider = undefined;
        }
        if (Array.isArray(item.itemList)) {
          if (addDivider !== false && dropdownItems.length) dropdownItems.push({ divider: true });
          item.itemList.forEach((item) => {
            dropdownItems.push({
              label: getItemContent(item, false),
              icon: item.icon,
              onClick: item.onClick,
              onCtrlClick: item.onCtrlClick,
              onWheelClick: item.onWheelClick,
              disabled: item.disabled,
            });
          });
          addDivider = true;
        } else {
          dropdownItems.push({
            label: getItemContent(item, false),
            onClick: item.onClick,
            disabled: item.disabled,
          });
        }
      }
    });

    if (dropdownItems.length) {
      buttons.push(
        <UU5.Bricks.Dropdown
          key="other"
          label={<UU5.Bricks.Icon icon="mdi-dots-vertical" />}
          className={this.getClassName("button")}
          colorSchema={this.props.menuColorSchema}
          bgStyle={this.props.menuBgStyle}
          borderRadius={this.props.menuBorderRadius}
          iconHidden
          items={dropdownItems}
          pullRight
        />
      );
    }

    return buttons;
  },

  _getChildren() {
    let children = this.getChildren();

    if (children && typeof children.find === "function") {
      if (this.props.actions.length) {
        let firstRowIndex;
        for (let i = 0; i < children.length; i++) {
          if (children[i].type && children[i].type.tagName === TAG + "Row") {
            firstRowIndex = i;
            break;
          }
        }

        if (firstRowIndex !== undefined) {
          let buttons;

          if (this.props.actions.length > 1) {
            buttons = <div className={this.getClassName("buttons")}>{this._getButtons(this.props.actions)}</div>;
          } else {
            buttons = this._getButton(this.props.actions[0]);
          }

          children.splice(
            firstRowIndex,
            1,
            <div key="cover" className={this.getClassName("firstRow")}>
              {children[firstRowIndex]}
              {buttons}
            </div>
          );
        }
      }
    }

    return children;
  },
  //@@viewOff:private

  //@@viewOn:render
  render() {
    return this.getNestingLevel() ? (
      <div {...this.getMainAttrs()}>
        {this._getChildren()}
        {this.getDisabledCover()}
      </div>
    ) : null;
  },
  //@@viewOff:render
});

export default Block;
