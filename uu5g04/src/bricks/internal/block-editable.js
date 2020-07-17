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

import * as UU5 from "uu5g04";
import "uu5g04-bricks";
//import "uu5g04-bricks-editable";

import ns from "./bricks-editable-ns.js";
import Lsi from "./bricks-editable-lsi.js";
import Css from "./css.js";

import ColorPicker from "./color-picker.js";

const DEFAULT_PROPS_MAP = {
  contentEditable: false,
  colorSchema: "default",
  content: null,
  children: null,
  background: false
};

const MAIN_CLASS_NAME = ns.css("block");
const NAME = ns.name("Block");

export const Block = UU5.Common.VisualComponent.create({
  displayName: NAME,
  //@@viewOn:mixins
  mixins: [UU5.Common.BaseMixin],
  //@@viewOff:mixins

  //@@viewOn:statics
  statics: {
    tagName: NAME,
    classNames: {
      main: MAIN_CLASS_NAME,
      checkbox: () =>
        Css.css(`
          cursor: pointer;
          margin-top: 0px;
          width: 100%;

          &:hover {
            background-color: #EEEEEE;
          }

          &:first-child {
            margin-top: 4px;
          }

          &:last-child {
            margin-bottom: 4px;
          }

          .uu5-forms-checkbox-button.uu5-forms-checkbox-button.uu5-forms-checkbox-button {
            border-color: transparent;
            background-color: transparent;
            outline: none;
          }

          label {
            cursor: pointer;
          }

          .uu5-forms-label {
            width: 80%;

            + .uu5-forms-input-wrapper {
              width: 20%;
            }
          }
        `)
    },
    lsi: () => ({ ...Lsi.block, ...Lsi.common })
  },
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {
    component: UU5.PropTypes.object.isRequired
  },
  //@@viewOff:propTypes

  //@@viewOn:getDefaultProps
  getDefaultProps() {
    return {
      component: null
    };
  },
  //@@viewOff:getDefaultProps

  //@@viewOn:reactLifeCycle
  getInitialState() {
    this._defaultProps = { ...DEFAULT_PROPS_MAP };
    let values = this.props.component.getEditablePropsValues(Object.keys(this._defaultProps));

    return {
      ...values,
      background: values.background
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
    let { background, children, content, ...result } = state;

    for (let propName in DEFAULT_PROPS_MAP) {
      if (result[propName] !== undefined && result[propName] === DEFAULT_PROPS_MAP[propName]) {
        result[propName] = undefined;
      }
    }

    return result;
  },

  // change state handlers
  _changeColorSchema(opt) {
    this.setState({ colorSchema: opt.value }, () => {
      this.props.component.saveEditation({
        colorSchema: !opt.value || opt.value === "default" ? undefined : opt.value
      });
    });
  },

  _toggleBackground() {
    this.setState(
      state => ({ background: !state.background }),
      () => {
        this.props.component.saveEditation({ background: this.state.background });
      }
    );
  },

  _getToolbarItems() {
    return [
      {
        type: ColorPicker,
        props: () => {
          return {
            value: this.state.colorSchema,
            onClick: this._changeColorSchema,
            tooltip: this.getLsiValue("colorSchemaTooltip")
          };
        }
      }
    ];
  },

  _getToolbarSettings() {
    return [
      {
        value: this.state.background,
        onClick: this._toggleBackground,
        label: this.getLsiComponent("backgroundCheckboxLabel")
      }
    ];
  },
  //@@viewOff:private

  //@@viewOn:render
  render() {
    return (
      <UU5.BricksEditable.Toolbar
        {...this.getMainPropsToPass()}
        onClose={this._onEndEditation}
        items={this._getToolbarItems()}
        settingsItems={this._getToolbarSettings()}
      >
        {this.props.component.getChildren()}
      </UU5.BricksEditable.Toolbar>
    );
  }
  //@@viewOff:render
});

export default Block;
