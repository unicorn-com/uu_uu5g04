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
import Css from "./css.js";

import ns from "../forms-ns.js";
//@@viewOff:imports

const SIZES = {
  s: { width: 72, height: 24, squareSize: 8 },
  m: { width: 72, height: 24, squareSize: 8 },
  l: { width: 96, height: 40, squareSize: 14 },
  xl: { width: 96, height: 40, squareSize: 14 }
};

const ColorPreview = UU5.Common.VisualComponent.create({
  displayName: "ColorPreview", // for backward compatibility (test snapshots)
  //@@viewOn:mixins
  mixins: [UU5.Common.BaseMixin],
  //@@viewOff:mixins

  //@@viewOn:statics
  statics: {
    tagName: ns.name("ColorPreview"),
    classNames: {
      main: ns.css("color-preview"),
      chessboard: props => {
        const width = props.width || SIZES[props.size].width;
        const height = props.height || SIZES[props.size].height;
        const squareSize = props.squareSize || SIZES[props.size].squareSize;
        const classes = ["color-preview"];
        const borderRadius = props.borderRadius || "2px";
        classes.push(
          Css.css(`
            display: inline-block;
            width: ${width}px;
            height: ${height}px;
            border-radius: ${borderRadius};
            overflow: hidden;
            position: relative;
            vertical-align: bottom;
            background-color: #FFFFFF;

            &::before {
              content: "";
              width: 100%;
              height: 100%;
              display: block;
              position: absolute;
            }

            &::after {
              content: "";
              width: 100%;
              height: 100%;
              border: 1px solid #BDBDBD;
              box-sizing: border-box;
              border-radius: ${borderRadius};
              position: absolute;
              left: 0;
            }
          `)
        );

        if (props.color) {
          classes.push(
            Css.css(`
              &::before {
                background-image:
                  -moz-linear-gradient(45deg, #000 25%, transparent 25%),
                  -moz-linear-gradient(-45deg, #000 25%, transparent 25%),
                  -moz-linear-gradient(45deg, transparent 75%, #000 75%),
                  -moz-linear-gradient(-45deg, transparent 75%, #000 75%);
                background-image:
                  -webkit-gradient(linear, 0 100%, 100% 0, color-stop(.25, #000), color-stop(.25, transparent)),
                  -webkit-gradient(linear, 0 0, 100% 100%, color-stop(.25, #000), color-stop(.25, transparent)),
                  -webkit-gradient(linear, 0 100%, 100% 0, color-stop(.75, transparent), color-stop(.75, #000)),
                  -webkit-gradient(linear, 0 0, 100% 100%, color-stop(.75, transparent), color-stop(.75, #000));

                -webkit-background-size: ${2 * squareSize}px ${2 * squareSize}px;
                -moz-background-size: ${2 * squareSize}px ${2 * squareSize}px;
                background-size: ${2 * squareSize}px ${2 * squareSize}px;

                background-position:0 0, ${squareSize}px 0, ${squareSize}px -${squareSize}px, 0px ${squareSize}px;
              }

              &::after {
                background-color: ${props.color}
              }
            `)
          );
        } else {
          // compute width and angle of diagonal line
          let dWidth = Math.sqrt(width * width + height * height);
          let dAngle = Math.atan(height / width); // result in radians
          classes.push(
            // TODO Fix emotion same-specificity classes order. Here, we need height&width
            // to have higher priority (with optimally the same specificity) but the class
            // above sometimes ends up later in <style> overriding width&height to 100%...
            Css.css(`
              &&::before {
                height: 1px;
                width: ${dWidth}px;
              }
              &::before {
                border-top: 1px solid red;
                position: absolute;
                left: ${(width - dWidth) / 2}px;
                top: ${height / 2}px;
                transform: rotate(-${dAngle}rad);
                z-index: 2;
              }

              &::after {
                background: #FFFFFF;
                z-index: 1;
              }
            `)
          );
        }

        return classes.join(" ");
      }
    }
  },
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {
    color: UU5.PropTypes.string,
    size: UU5.PropTypes.oneOf(["s", "m", "l", "xl"]),
    width: UU5.PropTypes.number,
    height: UU5.PropTypes.number,
    squareSize: UU5.PropTypes.number,
    borderRadius: UU5.PropTypes.string
  },
  //@@viewOff:propTypes

  //@@viewOn:getDefaultProps
  getDefaultProps() {
    return { color: null, width: null, height: null, size: "m", squareSize: null };
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
    // let mainAttrs = this.getMainAttrs();
    return (
      <div {...this.getMainAttrs()}>
        <div key="chessboard" className={this.getClassName("chessboard")}>
          {"\u200b" /* needed some content to correctly vertical align component via flex */}
        </div>
      </div>
    );
  }
  //@@viewOff:render
});

export default ColorPreview;
