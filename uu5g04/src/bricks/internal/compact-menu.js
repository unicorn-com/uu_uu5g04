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

//@@viewOn:revision
// coded: Martin Mach, 09.09.2020
// reviewed: Filip Janovský, 14.09.2020 - approved
//@@viewOff:revision

//@@viewOn:imports
import * as UU5 from "uu5g04";
import ns from "../bricks-ns.js";
import Item, { propTypes as itemPropTypes } from "./compact-menu-item";
//@@viewOff:imports

//@@viewOn:statics
const STATICS = {
  tagName: ns.name("CompactMenu")
};
//@@viewOff:statics

export const CompactMenu = UU5.Common.VisualComponent.create({
  ...STATICS,
  //@@viewOn:mixins
  mixins: [UU5.Common.BaseMixin],
  //@@viewOff:mixins

  //@@viewOn:propTypes
  propTypes: {
    items: UU5.PropTypes.arrayOf(UU5.PropTypes.shape(itemPropTypes))
  },
  //@@viewOff:propTypes

  //@@viewOn:getDefaultProps
  getDefaultProps() {
    return {
      items: undefined
    };
  },
  //@@viewOff:getDefaultProps

  //@@viewOn:reactLifeCycle
  getInitialState() {
    return {
      history: []
    };
  },
  //@@viewOff:reactLifeCycle

  //@@viewOn:interface
  //@@viewOff:interface

  //@@viewOn:overridingMethods
  //@@viewOff:overridingMethods

  //@@viewOn:private
  _renderCurrentLevel() {
    let currentItems = this.props.items;
    if (currentItems) {
      let prevItem;

      if (this.state.history.length) {
        for (let i = 0; i < this.state.history.length; i++) {
          let itemIndex = this.state.history[i];
          prevItem = currentItems[itemIndex];
          currentItems = currentItems[itemIndex].items;
        }

        currentItems = [
          {
            onClick: ({ component, event }) => {
              event.stopPropagation();
              this.setState(state => {
                let newHistory = [...state.history];
                newHistory.pop();
                return { history: newHistory };
              });
            },
            label: prevItem.label,
            icon: "mdi-menu-left"
          },
          "separator",
          ...currentItems
        ];
      }

      return currentItems.map((item, index) => {
        if (prevItem) {
          // back button was added with separator, so lower index to reflect the actual this.props.items
          index = index - 2;
        }

        let itemProps = { ...(typeof item !== "string" ? item : {}), key: index };

        if (typeof item !== "string") {
          itemProps.onClick = (component, event) => {
            if (item.items) {
              event.stopPropagation();
              this.setState(state => ({ history: [...state.history, index] }));
            }

            if (typeof item.onClick === "function") {
              item.onClick({ component: this, event });
            }
          };
        } else if (item === "separator") {
          itemProps.separator = true;
        }

        return <Item {...itemProps} />;
      });
    } else {
      return null;
    }
  },
  //@@viewOff:private

  //@@viewOn:render
  render() {
    return <div {...this.getMainAttrs()}>{this._renderCurrentLevel()}</div>;
  }
  //@@viewOff:render
});

export default CompactMenu;
