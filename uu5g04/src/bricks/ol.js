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
import ns from "./bricks-ns.js";
import Css from "./internal/css.js";
import { ListContext, Context } from "./list-context.js";

import "./ol.less";
//@@viewOff:imports

// static counter for generating unique id
let counter = 0;
const getCounter = () => counter++;

export const Ol = Context.withListContext(
  UU5.Common.VisualComponent.create({
    displayName: "Ol", // for backward compatibility (test snapshots)

    //@@viewOn:mixins
    mixins: [UU5.Common.BaseMixin, UU5.Common.ElementaryMixin, UU5.Common.SectionMixin, UU5.Common.NestingLevelMixin],
    //@@viewOff:mixins

    //@@viewOn:statics
    statics: {
      tagName: ns.name("Ol"),
      nestingLevelList: UU5.Environment.getNestingLevelList("bigBoxCollection", "box"),
      classNames: {
        main: (props) => {
          let classNames = [ns.css("ol")];

          if (props.type === "1.1" && props.listLevel > 1) {
            classNames.push(Css.css`
              &&& {
                padding-left: ${props.listLevel}.2em;
              }
            `);
          }

          return classNames.join(" ");
        },
        type: ns.css("ol-type-"),
        inline: Css.css(`


        &&& ol{
          display:inline-flex;
          width: auto;
          padding:0;
          margin:0;
          padding-left: 0px;
        };

        && > li{
          display:inline-flex;
          list-style:none;
          text-decoration:none;
          margin-left:0px;
          ::before{
            width:16px;
            padding:0px 12px;
            left: 0;
          }
      };
        `),
      },
      defaults: {
        childTagName: "UU5.Bricks.Li",
      },
    },
    //@@viewOff:statics

    //@@viewOn:propTypes
    propTypes: {
      allowTags: UU5.PropTypes.arrayOf(UU5.PropTypes.string),
      type: UU5.PropTypes.oneOf(["1", "a", "A", "i", "I", "1.1"]),
      counterId: UU5.PropTypes.string, // received from context
      listLevel: UU5.PropTypes.number, // received from context
    },
    //@@viewOff:propTypes

    //@@viewOn:getDefaultProps
    getDefaultProps() {
      return {
        allowTags: [],
        type: null,
        counterId: undefined,
        listLevel: 1,
      };
    },
    //@@viewOff:getDefaultProps

    //@@viewOn:reactLifeCycle
    getInitialState() {
      this._counterId = this.props.counterId || "uu5_bricks_list_counter_" + getCounter();

      return {};
    },

    UNSAFE_componentWillReceiveProps(nextProps) {
      if (this.props.type === "1.1" && nextProps.type !== "1.1") {
        this._counterId = this.props.counterId || undefined;
      } else if (this.props.type !== "1.1" && nextProps.type === "1.1") {
        this._counterId = "counter_id_" + UU5.Common.Tools.generateUUID();
      }
    },

    shouldComponentUpdate(nextProps, nextState) {
      return this.shouldRender(nextProps, nextState);
    },
    //@@viewOff:reactLifeCycle

    //@@viewOn:interface
    //@@viewOff:interface

    //@@viewOn:overriding
    shouldChildRender_(child) {
      let childTagName = UU5.Common.Tools.getChildTagName(child);
      let defaultChildTagName = this.getDefault().childTagName;
      let childTagNames = this.props.allowTags.concat(defaultChildTagName);
      let result = childTagNames.indexOf(childTagName) > -1;
      if (!result && (typeof child !== "string" || child.trim())) {
        if (childTagName)
          this.showError("childTagNotAllowed", [childTagName, this.getTagName(), childTagName, defaultChildTagName], {
            mixinName: "UU5.Common.BaseMixin",
          });
        else this.showError("childNotAllowed", [child, defaultChildTagName], { mixinName: "UU5.Common.BaseMixin" });
      }
      return result;
    },
    //@@viewOff:overriding

    //@@viewOn:private
    _getContextValues() {
      return {
        ordered: true,
        type: this.props.type,
        counterId: this._counterId,
        listLevel: this.props.listLevel,
      };
    },

    _getMainAttrs(isInline) {
      const mainAttrs = this.getMainAttrs();
      mainAttrs.type = this.props.type;

      if (this.props.type) {
        mainAttrs.className += " " + this.getClassName("type") + this.props.type;

        if ((this.props.type === "1.1" || isInline) && this._counterId) {
          mainAttrs.className +=
            " " +
            Css.css`
              counter-reset: ${this._counterId};
              list-style-type: none;
            `;
        }
      }
      isInline && (mainAttrs.className += " " + this.getClassName("inline"));

      return mainAttrs;
    },
    //@@viewOff:private

    //@@viewOn:render
    render() {
      return (
        <ListContext.Provider value={this._getContextValues()}>
          <ol {...this._getMainAttrs(!this.getNestingLevel())}>
            {this.getHeaderChild()}
            {this.getChildren()}
            {this.getFooterChild()}
            {this.getDisabledCover()}
          </ol>
        </ListContext.Provider>
      );
    },
    //@@viewOff:render
  })
);

export default Ol;
