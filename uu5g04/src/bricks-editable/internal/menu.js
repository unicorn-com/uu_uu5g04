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
import "uu5g04-bricks";

import Css from "./css.js";
import ns from "../bricks-editable-ns.js";
import MenuItem from "./menu-item.js";
import Helpers from "./helpers.js";
import Lsi from "../bricks-editable-lsi.js";
//@@viewOff:imports

const ITEM_COLOR_SCHEMA = "grey-rich";
const ITEM_COLOR_SCHEMA_ACTIVE = "blue-rich";
const CONTROLS_COLOR_SCHEMA = "grey-rich";
const CONTROLS_COLOR_SCHEMA_ACTIVE = "blue-rich";

const Menu = UU5.Common.VisualComponent.create({
  //@@viewOn:mixins
  mixins: [UU5.Common.BaseMixin],
  //@@viewOff:mixins

  //@@viewOn:statics
  statics: {
    tagName: ns.name("Menu"),
    classNames: {
      main: () =>
        ns.css("menu") +
        " " +
        Css.css(`
        display: flex;
        flex-direction: column;
        height: 100%;
      `),
      scrollArea: (props, state) =>
        Css.css(`
        height: auto;
        ${state.hasScrollbar ? "border-bottom: solid 1px #E0E0E0;" : ""}
      `),
      itemList: (props, state) =>
        Css.css(`
        ${state.hasScrollbar ? "padding-right: 0;" : ""}
      `),
      list: () =>
        Css.css(`
        list-style-type: none;
        padding: 8px;
        margin: 0;
      `),
      addItemButton: () =>
        Css.css(`
        & > div {
          justify-content: center;
        }
      `),
    },
    lsi: Lsi.menu,
  },
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {
    items: UU5.PropTypes.array,
    activeItemIndex: UU5.PropTypes.number,
    controls: UU5.PropTypes.array,
    withDnD: UU5.PropTypes.bool,
    onItemClick: UU5.PropTypes.func,
    onAddItem: UU5.PropTypes.func,
    addItemLabel: UU5.PropTypes.oneOfType([UU5.PropTypes.node, UU5.PropTypes.object]),
  },
  //@@viewOff:propTypes

  //@@viewOn:getDefaultProps
  getDefaultProps() {
    return {
      items: undefined,
      activeItemIndex: undefined,
      controls: undefined,
      withDnD: false,
      onItemClick: undefined,
      onAddItem: undefined,
      addItemLabel: undefined,
    };
  },
  //@@viewOff:getDefaultProps

  //@@viewOn:reactLifeCycle
  getInitialState() {
    UU5.Environment.getColorSchema(ITEM_COLOR_SCHEMA);
    UU5.Environment.getColorSchema(ITEM_COLOR_SCHEMA_ACTIVE);

    return {
      hasScrollbar: false,
    };
  },

  componentDidUpdate() {
    this._onResize();
  },
  //@@viewOff:reactLifeCycle

  //@@viewOn:interface
  //@@viewOff:interface

  //@@viewOn:overridingMethods
  //@@viewOff:overridingMethods

  //@@viewOn:private
  _hasScrollbar() {
    if (this._scrollArea) {
      return this._scrollArea.hasScrollbar();
    } else {
      return false;
    }
  },

  _onResize() {
    let hasScrollbar = this._hasScrollbar();

    if (hasScrollbar !== this.state.hasScrollbar) {
      this.setState({ hasScrollbar });
    }
  },

  _registerScrollArea(ref) {
    this._scrollArea = ref;
  },

  _getAddItemButton() {
    let label = this.props.addItemLabel;
    let icon = "mdi-plus-circle-outline";
    if (!label) label = this.getLsiComponent("addItemButton");
    else if (Helpers.isComponent(label)) {
      icon = undefined;
    } else if (typeof label === "object") {
      // is lsi
      label = <UU5.Bricks.Lsi lsi={label} />;
    }
    return (
      <ul className={this.getClassName("list")}>
        <MenuItem icon={icon} onClick={this.props.onAddItem} className={this.getClassName("addItemButton")}>
          {label}
        </MenuItem>
      </ul>
    );
  },

  _getItemList() {
    let items = [];

    if (this.props.items) {
      items = this.props.items.map((item, index) => {
        let controls = this.props.controls
          ? this.props.controls.map((controlsItem) => {
              if (typeof controlsItem === "function") {
                return controlsItem(index);
              } else {
                return {
                  ...controlsItem,
                  onClick: () => {
                    controlsItem.onClick(index);
                  },
                };
              }
            })
          : null;

        return (
          <MenuItem
            key={index}
            icon={item.icon}
            // arrow fn necessary to pass index
            // eslint-disable-next-line react/jsx-no-bind
            onClick={() => this.props.onItemClick(index)}
            withDnD={this.props.withDnD}
            controls={controls}
            infoIcons={item.infoIcons}
            colorSchema={ITEM_COLOR_SCHEMA}
            colorSchemaActive={ITEM_COLOR_SCHEMA_ACTIVE}
            controlsColorSchema={CONTROLS_COLOR_SCHEMA}
            controlsColorSchemaActive={CONTROLS_COLOR_SCHEMA_ACTIVE}
            isActive={typeof this.props.activeItemIndex === "number" ? this.props.activeItemIndex === index : false}
          >
            {item.content}
          </MenuItem>
        );
      });
    }

    return items;
  },
  //@@viewOff:private

  //@@viewOn:render
  render() {
    return (
      <UU5.Bricks.Resize {...this.getMainAttrs()} onResize={this._onResize}>
        {this.props.items?.length ? (
          <UU5.Bricks.ScrollArea
            ref_={this._registerScrollArea}
            reserveSpace
            className={this.getClassName("scrollArea")}
          >
            <ul className={`${this.getClassName("list")} ${this.getClassName("itemList")}`}>{this._getItemList()}</ul>
          </UU5.Bricks.ScrollArea>
        ) : null}
        {typeof this.props.onAddItem === "function" ? this._getAddItemButton() : null}
      </UU5.Bricks.Resize>
    );
  },
  //@@viewOff:render
});

export default Menu;
