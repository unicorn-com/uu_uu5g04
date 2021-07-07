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

import * as UU5 from "uu5g04";

import Css from "./css.js";

const getColor = function (colorSchema = "grey", depth = colorSchema === "black" ? 900 : 500) {
  let color = UU5.Environment.colors[colorSchema] || UU5.Environment.colors.grey;
  return color["c" + depth] || color.c500;
};

const ColorSquare = (props) => {
  return (
    <div
      title={props.title || props.colorSchema}
      className={
        Css.css(`
          display: flex;
          align-items: center;
          cursor: pointer;
        `) +
        " " +
        Css.css(`
          line-height: ${props.height};

          div {
            width: ${props.width};
            height: ${props.height};
          }
        `)
      }
      // eslint-disable-next-line react/jsx-no-bind
      onClick={() => {
        if (typeof props.onClick === "function") {
          props.onClick(props.colorSchema);
        }
      }}
    >
      <div
        className={
          Css.css(`
            margin: 4px;
            box-sizing: border-box;
          `) +
          " " +
          Css.css(`background-color: ${getColor(props.colorSchema, props.depth)}`) +
          " " +
          Css.css(`border: ${props.colorSchema === "white" ? "1px solid black" : "none"}`)
        }
        title={props.colorSchema}
      />
      {props.label}
    </div>
  );
};

ColorSquare.propTypes = {
  label: UU5.PropTypes.string,
  depth: UU5.PropTypes.number,
  onClick: UU5.PropTypes.func,
  title: UU5.PropTypes.string,
  colorSchema: UU5.PropTypes.string,
  height: UU5.PropTypes.string,
  width: UU5.PropTypes.string,
};

ColorSquare.defaultProps = {
  width: "32px",
  height: "32px",
};

export default ColorSquare;
