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
import { TAG, css } from "./config.js";
import Row from "./row.js";
import LsiButton from "./_lsi-button.js";
//@@viewOff:imports

export const Block = UU5.Common.VisualComponent.create({
  displayName: "Block", // for backward compatibility (test snapshots)
  //@@viewOn:mixins
  mixins: [
    UU5.Common.BaseMixin,
    UU5.Common.ElementaryMixin,
    UU5.Common.NestingLevelMixin,
    UU5.Common.ContentMixin,
    UU5.Common.PureRenderMixin
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
      `,
      button: () => css`
        margin-left: 8px;
      `
    },
    opt: {
      pureRender: true
    }
  },
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {
    actions: UU5.PropTypes.arrayOf(
      UU5.PropTypes.shape({
        onClick: UU5.PropTypes.func.isRequired,
        icon: UU5.PropTypes.string,
        content: UU5.PropTypes.oneOfType([UU5.PropTypes.object, UU5.PropTypes.string]),
        active: UU5.PropTypes.bool,
        activeIcon: UU5.PropTypes.string,
        activeContent: UU5.PropTypes.oneOfType([UU5.PropTypes.object, UU5.PropTypes.string]),
        bgStyle: UU5.PropTypes.string,
        borderRadius: UU5.PropTypes.string,
        disabled: UU5.PropTypes.bool,
        colorSchema: UU5.PropTypes.string
      })
    ),
    menuColorSchema: UU5.PropTypes.string,
    menuBgStyle: UU5.PropTypes.string,
    menuBorderRadius: UU5.PropTypes.string
  },
  //@@viewOff:propTypes

  //@@viewOn:getDefaultProps
  getDefaultProps() {
    return {
      actions: [],
      menuColorSchema: "default",
      menuBgStyle: "outline",
      menuBorderRadius: undefined
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
    let content = [];

    if (item.activeIcon || item.icon) {
      content.push(<UU5.Bricks.Icon icon={item.activeIcon || item.icon} key="icon" />);
    }

    if (item.activeContent) {
      content.push(
        typeof item.activeContent === "string" ? item.activeContent : <UU5.Bricks.Lsi lsi={item.activeContent} />
      );
    }

    return (
      <LsiButton
        key={i}
        className={this.getClassName("button")}
        onClick={item.onClick}
        bgStyle={item.bgStyle || "outline"}
        borderRadius={item.borderRadius}
        disabled={item.disabled}
        tooltip={item.content}
        content={content}
        colorSchema={item.colorSchema}
      />
    );
  },

  _getButtons(actions) {
    let buttons = [];
    let dropdownItems = [];

    actions.forEach((item, i) => {
      if (item.active || item.activeContent || item.activeIcon) {
        buttons.push(this._getButton(item, i));
      } else {
        dropdownItems.push({
          label: typeof item.content === "string" ? item.content : <UU5.Bricks.Lsi lsi={item.content} />,
          onClick: item.onClick,
          disabled: item.disabled
        });
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
  }
  //@@viewOff:render
});

export default Block;
