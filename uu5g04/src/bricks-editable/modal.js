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

import ns from "./bricks-editable-ns.js";
import Body from "./internal/modal-body.js";
//@@viewOff:imports

const { ...propTypes } = Body.propTypes;
delete propTypes.screenSize;

const { defaultProps } = Body.getDefaultProps();

export const Modal = UU5.Common.VisualComponent.create({
  //@@viewOn:mixins
  mixins: [UU5.Common.BaseMixin],
  //@@viewOff:mixins

  //@@viewOn:statics
  statics: {
    tagName: ns.name("Modal"),
    classNames: {
      main: ns.css("items-component")
    }
  },
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes,
  //@@viewOff:propTypes

  //@@viewOn:getDefaultProps
  getDefaultProps() {
    return defaultProps;
  },
  //@@viewOff:getDefaultProps

  //@@viewOn:reactLifeCycle
  //@@viewOff:reactLifeCycle

  //@@viewOn:interface
  getPropsToSave() {
    return this._body.getPropsToSave();
  },
  //@@viewOff:interface

  //@@viewOn:overridingMethods
  //@@viewOff:overridingMethods

  //@@viewOn:private
  _registerBody(ref) {
    this._body = ref;
  },

  _renderBody({ screenSize }) {
    return <Body {...this.props} screenSize={screenSize} ref_={this._registerBody} />;
  },
  //@@viewOff:private

  //@@viewOn:render
  render() {
    return <UU5.Bricks.ScreenSize>{this._renderBody}</UU5.Bricks.ScreenSize>;
  }
  //@@viewOff:render
});

export default Modal;
