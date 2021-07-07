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

import React from "react";
import UU5 from "uu5g04";
import Alert from "../alert.js";
import Button from "../button.js";
import Icon from "../icon.js";
import { Div } from "../factory.js";
import Css from "./css.js";
import Lsi from "../bricks-lsi.js";

export const AlertBusMulti = (props) => {
  const getControlPanel = () => {
    return (
      <Div className={AlertBusMulti.classNames.controlPanel(props)}>
        {!props.showAll ? (
          <Button
            bgStyle="transparent"
            size="s"
            className={AlertBusMulti.classNames.showAllButton()}
            onClick={props.onShowAll}
          >
            <UU5.Bricks.Lsi lsi={Lsi.alertBus.showAll} />
            <Icon icon="mdi-chevron-down" />
          </Button>
        ) : null}
        <Button
          bgStyle="transparent"
          size="s"
          className={AlertBusMulti.classNames.clearAllButton()}
          onClick={props.onClearAll}
        >
          <UU5.Bricks.Lsi lsi={Lsi.alertBus.clearAll} />
        </Button>
      </Div>
    );
  };

  const getAlertStack = () => {
    let stack = props.showAll ? props.stack : props.stack.slice(0, 4);
    stack = stack.map((alert, index) => {
      let alertProps = UU5.Common.Tools.merge(props, alert);
      alertProps.className += " " + AlertBusMulti.classNames.alert();
      delete alertProps.offsetTop;
      return (
        <Alert {...alertProps} id={alertProps.id + `-${index}`} key={alert.key || index} countdown block={false} />
      );
    });

    return stack;
  };

  return (
    <Div hidden={props.stack.length == 0} className={AlertBusMulti.classNames.main(props)}>
      {props.showAll ? getAlertStack(props.stack) : getAlertStack(props.stack.slice(0, 4))}
      {props.stack.length > 4 ? getControlPanel() : null}
    </Div>
  );
};

AlertBusMulti.propTypes = {
  id: UU5.PropTypes.string,
  stack: UU5.PropTypes.array,
  showAll: UU5.PropTypes.bool,
  block: UU5.PropTypes.bool,
  onShowAll: UU5.PropTypes.func,
  onClearAll: UU5.PropTypes.func,
  location: UU5.PropTypes.oneOf(["local", "page"]),
};

AlertBusMulti.defaultProps = {
  id: undefined,
  stack: undefined,
  showAll: undefined,
  block: false,
  onShowAll: undefined,
  onClearAll: undefined,
  location: "local",
};

AlertBusMulti.classNames = {
  main: (props) => {
    let className = `
      position: ${props.location === "page" ? "fixed" : "absolute"};
      top: 0;
      width: 640px;
      max-width: calc(100% - 16px);
      z-index: 90;
    `;

    if (props.block) {
      className += `
        position: relative;
      `;

      if (props.position === "center") {
        className += `
          left: 50%;
          transform: translateX(-50%);
        `;
      } else if (props.position === "right") {
        className += `
          left: 100%;
          transform: translateX(-100%);
        `;
      } else {
        className += "left: 0;";
      }
    } else {
      if (props.position === "center") {
        if (props.offsetTop !== "auto") {
          className += `
            left: 50%;
            transform: translateX(-50%);
          `;
        }
      } else if (props.position === "right") {
        className += `
          left: auto;
          right: 0;
        `;
      } else {
        className += "left: 0;";
      }

      if (props.offsetTop === "auto") {
        if (props.position === "center") {
          className += `
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
          `;
        } else {
          className += `
            top: 50%;
            transform: translateY(-50%);
          `;
        }
      } else {
        className += `
          top: ${UU5.Common.Tools.fillUnit(props.offsetTop)};
        `;
      }
    }

    return Css.css(className);
  },
  alert: () =>
    Css.css`
    top: auto;
    margin-bottom: 8px;
    left: auto;
    && {
      position: relative;
      transform: none;
    }
  `,
  controlPanel: (props) =>
    Css.css`
    display: flex;
    justify-content: ${props.showAll ? "flex-end" : "space-between"};
    padding: 7px 8px;
    align-items: center;
    background: #FFFFFF;
    border-radius: 4px;
    box-shadow: 0 4px 7px 0 rgba(0, 0, 0, 0.20);
  `,
  showAllButton: () =>
    Css.css`
    min-height: 26px;
    color: rgba(0,0,0,0.54);
  `,
  clearAllButton: () =>
    Css.css`
    min-height: 26px;
    color: #FF5722;
    text-align: center;
  `,
};

export default AlertBusMulti;
