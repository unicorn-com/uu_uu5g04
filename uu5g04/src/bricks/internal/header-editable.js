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
import UU5 from "uu5g04";
import ns from "./bricks-editable-ns.js";
import Css from "./css.js";
import EditableLsi from "./bricks-editable-lsi.js";
//@@viewOff:imports

const DEFAULT_PROPS_MAP = {
  contentEditable: undefined,
  underline: false,
  level: null,
  content: null,
  children: null,
};

const MAIN_CLASS_NAME = ns.css("header");
const NAME = ns.name("Header");

export const Header = UU5.Common.VisualComponent.create({
  //@@viewOn:mixins
  mixins: [UU5.Common.BaseMixin],
  //@@viewOff:mixins

  //@@viewOn:statics
  statics: {
    tagName: NAME,
    classNames: {
      main: MAIN_CLASS_NAME,
      levelDropdown: () =>
        Css.css(`
           &.uu5-bricks-editable-toolbar-dropdown {
             width: 148px;
           }
         `),
    },
    lsi: () => ({ ...EditableLsi.header, ...EditableLsi.common }),
  },
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {
    component: UU5.PropTypes.object.isRequired,
  },
  //@@viewOff:propTypes

  //@@viewOn:getDefaultProps
  getDefaultProps() {
    return {
      component: null,
    };
  },
  //@@viewOff:getDefaultProps

  //@@viewOn:reactLifeCycle
  getInitialState() {
    this._contentProp = "children";
    let values = this.props.component.getEditablePropsValues(Object.keys(DEFAULT_PROPS_MAP));
    let content;

    if (values.content) {
      content = values.content;
      this._contentProp = "content";
    } else if (values.children) {
      content = values.children;
    }

    return {
      ...values,
      content,
    };
  },
  //@@viewOff:reactLifeCycle

  //@@viewOn:interface
  getPropsToSave() {
    return this._getPropsToSave();
  },
  //@@viewOff:interface

  //@@viewOn:overridingMethods
  //@@viewOff:overridingMethods

  //@@viewOn:private
  // props actions
  _onEndEditation() {
    this.props.component.endEditation(this._getPropsToSave());
  },

  _getPropsToSave(state = this.state) {
    // unused vars are here just to separate them from the result
    // eslint-disable-next-line no-unused-vars
    let { children, content, ...result } = state;

    for (let propName in DEFAULT_PROPS_MAP) {
      if (result[propName] !== undefined && result[propName] === DEFAULT_PROPS_MAP[propName]) {
        result[propName] = undefined;
      }
    }

    result[this._contentProp] = content;

    return result;
  },

  _changeLevel(value) {
    this.setState({ level: value });
  },

  _toggleUnderline() {
    this.setState((state) => ({ underline: !state.underline }));
  },

  _changeContent(opt) {
    this.setState({ content: opt.value });
  },

  _getToolbarItems() {
    let levelItems = [1, 2, 3, 4, 5, 6].map((level) => ({
      content: `${this.getLsiValue("level")} ${level}`,
      value: `${level}`,
    }));
    levelItems.unshift({ content: this.getLsiValue("defaultLevel"), value: null });

    return [
      {
        type: "button",
        props: () => {
          return {
            pressed: this.state.underline,
            onClick: this._toggleUnderline,
            tooltip: this.getLsiValue("underlineTooltip"),
            icon: "mdi-format-underline",
          };
        },
      },
      {
        type: "dropdown",
        props: () => {
          let label = this.state.level
            ? `${this.getLsiValue("level")} ${this.state.level}`
            : `${this.getLsiValue("defaultLevel")}`;

          return {
            value: this.state.level,
            label,
            tooltip: this.getLsiValue("levelTooltip"),
            items: levelItems,
            onClick: this._changeLevel,
          };
        },
      },
    ];
  },
  //@@viewOff:private

  //@@viewOn:render
  render() {
    return (
      <UU5.BricksEditable.Toolbar
        {...this.getMainPropsToPass()}
        ref_={this._registerToolbar}
        onClose={this._onEndEditation}
        items={this._getToolbarItems()}
      >
        <UU5.BricksEditable.Input
          value={this.state.content || ""}
          placeholder={this.getLsi("headerPlaceholder")}
          onChange={this._changeContent}
        >
          {({ children }) => (
            <UU5.Bricks.Header underline={this.state.underline} level={this.state.level} parent={this.props.parent}>
              {children}
            </UU5.Bricks.Header>
          )}
        </UU5.BricksEditable.Input>
      </UU5.BricksEditable.Toolbar>
    );
  },
  //@@viewOff:render
});

export default Header;
