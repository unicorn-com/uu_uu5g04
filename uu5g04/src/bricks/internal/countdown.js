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
import React from "react";
import createReactClass from "create-react-class";
import PropTypes from "prop-types";
import * as UU5 from "uu5g04";
import ns from "../bricks-ns.js";
import Css from "./css.js";
//@@viewOff:imports

export const Countdown = createReactClass({
  //@@viewOn:mixins
  mixins: [UU5.Common.BaseMixin],
  //@@viewOff:mixins

  //@@viewOn:statics
  statics: {
    tagName: ns.name("Countdown"),
    classNames: {
      main: props =>
        ns.css("countdown") +
        " " +
        Css.css(`
        position: relative;
        height: ${props.size}px;
        width: ${props.size}px;
        text-align: center;
        display: inline-flex;
        justify-content: center;
        align-items: center;
      `),
      timer: props =>
        Css.css(`
        color: rgba(0, 0, 0, 0.54);
        display: inline-block;
        position: absolute;
        line-height: ${props.size / 2}px;
        font-size: ${props.size / 2}px;
      `),
      svg: props =>
        Css.css(`
        position: relative;
        margin: auto;
        width: ${props.size}px;
        height: ${props.size}px;
        transform: rotateY(-180deg) rotateZ(-90deg);
      `),
      circle: props =>
        Css.css(`
        stroke-dasharray: 113px;
        stroke-dashoffset: 0px;
        stroke-linecap: round;
        stroke-width: 2px;
        stroke: rgba(0, 0, 0, 0.54);
        fill: none;
        animation: countdown ${props.duration}ms linear 1 forwards;

        @keyframes countdown {
          from {
            stroke-dashoffset: 0px;
          }
          to {
            stroke-dashoffset: 113px;
          }
        }
      `)
    },
    defaults: {
      transitionDuration: 150,
      closeIcon: "mdi-close"
    },
    opt: {
      nestingLevelWrapper: true
    }
  },
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {
    reverse: PropTypes.bool,
    timer: PropTypes.bool,
    duration: PropTypes.number,
    size: PropTypes.number
  },
  //@@viewOff:propTypes

  //@@viewOn:getDefaultProps
  getDefaultProps() {
    return {
      reverse: false,
      timer: false,
      duration: 10,
      size: 32
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
      <div {...this.getMainAttrs()}>
        {this.props.timer ? <div className={this.getClassName("timer")}>{this.props.duration / 1000}</div> : null}
        <svg className={this.getClassName("svg")} viewBox="0 0 40 40" version="1.1" xmlns="http://www.w3.org/2000/svg">
          <circle r="18" cx="20" cy="20" className={this.getClassName("circle")} />
        </svg>
      </div>
    );
  }
  //@@viewOff:render
});

export default Countdown;
