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
import ns from "./bricks-ns.js";
import Css from "./internal/css.js";
import { ListContext, Context } from "./list-context.js";
import { typeIconMap } from "./ul.js";

import "./li.less";
//@@viewOff:imports

export const Li = Context.withListItemContext(
  UU5.Common.VisualComponent.create({
    displayName: "Li", // for backward compatibility (test snapshots)
    //@@viewOn:mixins
    mixins: [
      UU5.Common.BaseMixin,
      UU5.Common.PureRenderMixin,
      UU5.Common.ElementaryMixin,
      UU5.Common.ContentMixin,
      UU5.Common.NestingLevelMixin,
    ],
    //@@viewOff:mixins

    //@@viewOn:statics
    statics: {
      tagName: ns.name("Li"),
      nestingLevelList: UU5.Environment.getNestingLevelList("bigBoxCollection", "inline"),
      classNames: {
        main: ns.css("li"),
        mainClass: (props, nestingLevel) => {
          let classNames = [];

          if (!props.ordered || (props.ordered && props.type === "1.1")) {
            classNames.push(Css.css`
              display: flex;
              align-items: baseline;
            `);

            if (props.markerIcon === "mdi-default") {
              classNames.push(Css.css`
                &:before {
                  top: -0.45em;
                }
              `);
            }
          }

          if (
            (props.ordered && props.type === "1.1" && props.counterId) ||
            (nestingLevel === "inline" && props.ordered)
          ) {
            let counterStyle;
            switch (props.type) {
              case "1.1":
                counterStyle = '"."';
                break;
              case "i":
                counterStyle = '".", lower-roman';
                break;
              case "I":
                counterStyle = '".", upper-roman';
                break;
              case "a":
                counterStyle = '".", lower-latin';
                break;
              case "A":
                counterStyle = '".", upper-latin';
                break;
              default:
                ".";
            }
            classNames.push(Css.css`
              &::before {
                counter-increment: ${props.counterId};
                content: counters(${props.counterId}, ${counterStyle}) ". ";
                display: inline-block;
                position: relative;
                width: 0;
                left: -${props.listLevel}.46em;
                text-align: right;
              }
            `);
          }

          return classNames.join(" ");
        },
      },
      defaults: {
        parentTagNames: ["UU5.Bricks.Ul", "UU5.Bricks.Ol"],
        markerIcon: "mdi-default",
      },
      editMode: {
        enableWrapper: false,
      },
    },
    //@@viewOff:statics

    //@@viewOn:propTypes
    propTypes: {
      markerIcon: UU5.PropTypes.string,
      iconColorSchema: UU5.PropTypes.string,
      ordered: UU5.PropTypes.bool, // received from context
      type: UU5.PropTypes.string, // received from context
      counterId: UU5.PropTypes.string, // received from context
      listLevel: UU5.PropTypes.number, // received from context
    },
    //@@viewOff:propTypes

    //@@viewOn:getDefaultProps
    getDefaultProps() {
      return {
        markerIcon: null,
        iconColorSchema: null,
        ordered: false,
        type: undefined,
        counterId: undefined,
        listLevel: 1,
      };
    },
    //@@viewOff:getDefaultProps

    //@@viewOn:reactLifeCycle
    getInitialState() {
      UU5.Environment.getColorSchema(this.props.iconColorSchema);
    },

    UNSAFE_componentWillMount: function () {
      this.checkParentTagName(this.getDefault().parentTagNames);
    },

    UNSAFE_componentWillReceiveProps(nextProps) {
      if (nextProps.controlled) {
        if (this.props.iconColorSchema !== nextProps.iconColorSchema) {
          UU5.Environment.getColorSchema(nextProps.iconColorSchema);
        }
      }
    },
    //@@viewOff:reactLifeCycle

    //@@viewOn:interface
    //@@viewOff:interface

    //@@viewOn:overriding
    //@@viewOff:overriding

    //@@viewOn:private
    _getMarkerIcon() {
      if (this.props.markerIcon) {
        return this.props.markerIcon;
      } else if (this.props.type) {
        return typeIconMap[this.props.type];
      } else {
        return "mdi-default";
      }
    },

    _getContextValues() {
      return {
        ordered: this.props.ordered,
        markerIcon: this._getMarkerIcon(),
        type: this.props.type,
        iconColorSchema: this.props.iconColorSchema,
        counterId: this.props.counterId,
        listLevel: this.props.listLevel,
      };
    },
    //@@viewOff:private

    //@@viewOn:render
    render: function () {
      let mainClassName = this.getClassName().mainClass(this.props, this.getNestingLevel());
      return this.getNestingLevel() ? (
        <ListContext.Provider value={this._getContextValues()}>
          <li {...getMainAttrs(this.props, this.getMainAttrs(), mainClassName)}>
            <span>{this.getChildren()}</span>
            {this.getDisabledCover()}
          </li>
        </ListContext.Provider>
      ) : null;
    },
    //@@viewOff:render
  })
);

const getIconColor = (colorSchema) => {
  colorSchema = colorSchema === "default" || !colorSchema ? "black" : colorSchema;
  colorSchema = UU5.Environment.colorSchemaMap[colorSchema].color;
  let colorShades = UU5.Environment.colors[colorSchema.split("-rich")[0]];

  return colorShades
    ? " " +
        UU5.Common.Css.css(`
      ::before {
        color: ${colorShades[colorSchema === "black" || colorSchema === "white" ? "c900" : "c500"]}
      }
    `)
    : "";
};

const getMainAttrs = function (props, attrs, mainClassName) {
  attrs.className = mainClassName + (attrs.className ? " " + attrs.className : "");
  
  if (!props.ordered && props.markerIcon) {
    let splitter = props.markerIcon.split("-");

    if (splitter) {
      let iconsName = splitter[0];
      UU5.Environment.IconManager.addIcons(iconsName);
      attrs.className += ` ${iconsName}`;
    }
    attrs.className += ` ${props.markerIcon}${getIconColor(props.iconColorSchema)}`;
  }
  return attrs;
};

export default Li;
