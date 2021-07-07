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
import ns from "./bricks-editable-ns.js";
import Button from "../button.js";
import EditableLsi from "./bricks-editable-lsi.js";
import Css from "./css.js";
//@@viewOff:imports

const Lsi = EditableLsi.authenticated;

const DEFAULT_PROPS_MAP = {
  authenticated: null,
  notAuthenticated: null,
  pending: null,
};

const MAIN_CLASS_NAME = ns.css("authenticated-editable");
const NAME = ns.name("AuthenticatedEditable");
const authenticatedStates = ["authenticated", "notAuthenticated", "pending"];

export const AuthorizedEditable = UU5.Common.VisualComponent.create({
  //@@viewOn:mixins
  mixins: [UU5.Common.BaseMixin, UU5.Common.ContentMixin],
  //@@viewOff:mixins

  //@@viewOn:statics
  statics: {
    tagName: NAME,
    classNames: {
      main: MAIN_CLASS_NAME,
      switchSelector: Css.css`
        margin: -4px 0;
      `,
    },
    lsi: () => Lsi,
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
    return { ...this.props.component.getEditablePropsValues(Object.keys(DEFAULT_PROPS_MAP)) };
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
  _registerEditToolbar(toolbar) {
    this._editToolbar = toolbar;
  },

  // props actions
  _onEndEditation() {
    this.props.component.endEditation(this._getPropsToSave());
  },

  _getPropsToSave(propsToSave) {
    if (propsToSave === undefined) propsToSave = { ...this.state };

    for (let propName in DEFAULT_PROPS_MAP) {
      if (propsToSave[propName] !== undefined && propsToSave[propName] === DEFAULT_PROPS_MAP[propName]) {
        propsToSave[propName] = undefined;
      }
    }

    return propsToSave;
  },

  _onChangeAuthState(value) {
    let newState = {};
    if (this.state[value]) {
      newState[value] = false;
    } else {
      newState[value] = true;
    }
    this.setState(newState);
  },

  _getToolbarItems() {
    return authenticatedStates.map((value) => {
      let isSelected = this.state[value] === true;
      return (
        <Button
          key={value}
          bgStyle="transparent"
          colorSchema={isSelected ? "grey" : "default"}
          pressed={isSelected}
          // eslint-disable-next-line react/jsx-no-bind
          onClick={() => this._onChangeAuthState(value)}
        >
          {this.getLsiComponent(value)}
        </Button>
      );
    });
  },
  //@@viewOff:private

  //@@viewOn:render
  render() {
    return (
      <UU5.BricksEditable.Toolbar
        {...this.getMainPropsToPass()}
        ref_={this._registerEditToolbar}
        items={this._getToolbarItems()}
        onClose={this._onEndEditation}
      >
        {this.props.component.getChildren()}
      </UU5.BricksEditable.Toolbar>
    );
  },
  //@@viewOff:render
});

export default AuthorizedEditable;
