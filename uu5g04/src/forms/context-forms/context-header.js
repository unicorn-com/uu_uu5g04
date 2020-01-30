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

import ContextInfo from "./context-info";
import { ContextFormConsumer } from "./context.js";
//@@viewOff:imports

const ALERT_ID = "info";

//TODO to model!!!
function buildChildren(children) {
  let result;

  if (children != null) {
    switch (typeof children) {
      case "string":
        result = UU5.Common.UU5String.isValid(children) ? UU5.Common.UU5String.toChildren(children) : children;
        break;
      case "object":
        if (Array.isArray(children)) {
          result = children.map(child => buildChildren(child));
        } else {
          result =
            (children.tag && children.props) || children.propsArray ? <UU5.Bricks.Span content={children} /> : children;
        }
        break;
      default:
        result = children;
    }
  }

  return result;
}

export const ContextHeader = UU5.Common.VisualComponent.create({
  //@@viewOn:statics
  statics: {
    tagName: ns.name("ContextHeader"),
    classNames: {
      icon: () => UU5.Common.Css.css`
        margin-left: 4px;
        line-height: 1;
        width: 1em;
        height: 1em;
        font-size: 20px;
        cursor: pointer;
        color: rgba(0,0,0,0.54)
      `
    }
  },
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {
    content: UU5.PropTypes.any,
    info: UU5.PropTypes.any,
    icon: UU5.PropTypes.string
  },
  //@@viewOff:propTypes

  //@@viewOn:getDefaultProps
  getDefaultProps() {
    return {
      content: undefined,
      info: undefined,
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
  _getOnClickFunction(getForm) {
    const alertBus = getForm().getAlertBus();
    const alert = alertBus.getAlerts().find(a => a.id === ALERT_ID);
    if (alert) {
      alertBus.removeAlert(alert.id);
    } else {
      alertBus.setAlert({
        id: ALERT_ID,
        content: <ContextInfo content={this.props.info} icon={this.props.icon} />,
        closeDisabled: true
      });
    }
  },
  //@@viewOff:private

  //@@viewOn:render
  render() {
    return (
      <ContextFormConsumer>
        {({ getForm }) => (
          <UU5.Common.Fragment>
            {buildChildren(this.props.content || this.props.children)}
            {this.props.info && (
              <UU5.Bricks.Icon
                icon={this.props.icon}
                mainAttrs={{ onClick: () => this._getOnClickFunction(getForm) }}
                className={this.constructor.classNames.icon()}
              />
            )}
          </UU5.Common.Fragment>
        )}
      </ContextFormConsumer>
    );
  }
  //@@viewOff:render
});

export default ContextHeader;
