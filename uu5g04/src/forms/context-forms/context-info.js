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
import ns from "../forms-ns.js";

import Css from "./css.js";
//@@viewOff:imports

export const ContextInfo = UU5.Common.VisualComponent.create({
  //@@viewOn:statics
  statics: {
    tagName: ns.name("ContextInfo"),
    classNames: {
      icon: () => Css.css`
        font-size: 26px;
        margin-right: 16px;
        align-self: start;
        color: rgba(0,0,0,0.54);
      `,
      content: () => Css.css`
        /** just for IE **/
        @media screen and (-ms-high-contrast: active), (-ms-high-contrast: none) {
          flex: 1;
        }
      `
    }
  },
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {
    content: UU5.PropTypes.any,
    icon: UU5.PropTypes.string
  },
  //@@viewOff:propTypes

  //@@viewOn:getDefaultProps
  getDefaultProps() {
    return {
      content: undefined,
      icon: "mdi-help-circle"
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
  //@@viewOff:private

  //@@viewOn:render
  render() {
    return (
      <UU5.Common.Fragment>
        <UU5.Bricks.Icon icon={this.props.icon} className={this.constructor.classNames.icon()} />
        <UU5.Bricks.Div content={this.props.content} className={this.constructor.classNames.content()} />
      </UU5.Common.Fragment>
    );
  }
  //@@viewOff:render
});

export default ContextInfo;
