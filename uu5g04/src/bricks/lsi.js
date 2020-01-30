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

import LsiItem from "./lsi-item.js";

import "./lsi.less";
//@@viewOff:imports

export const Lsi = UU5.Common.LsiMixin.withContext(
  UU5.Common.VisualComponent.create({
    displayName: "Lsi", // for backward compatibility (test snapshots)
    //@@viewOn:mixins
    mixins: [
      UU5.Common.BaseMixin,
      UU5.Common.PureRenderMixin,
      UU5.Common.ElementaryMixin,
      UU5.Common.ContentMixin,
      UU5.Common.LsiMixin,
      UU5.Common.NestingLevelMixin
    ],
    //@@viewOff:mixins

    //@@viewOn:statics
    statics: {
      tagName: ns.name("Lsi"),
      nestingLevelList: UU5.Environment.getNestingLevelList("bigBoxCollection", "inline"),
      classNames: {
        main: ns.css("lsi")
      },
      defaults: {
        childTagName: "UU5.Bricks.Lsi.Item"
      },
      opt: {
        nestingLevelWrapper: true
      }
    },
    //@@viewOff:statics

    //@@viewOn:propTypes
    propTypes: {
      lsi: UU5.PropTypes.object,
      allowTags: UU5.PropTypes.arrayOf(UU5.PropTypes.string),
      params: UU5.PropTypes.oneOfType([UU5.PropTypes.string, UU5.PropTypes.array, UU5.PropTypes.object])
    },
    //@@viewOff:propTypes

    //@@viewOn:getDefaultProps
    getDefaultProps: function() {
      return {
        lsi: null,
        allowTags: [],
        params: null
      };
    },
    //@@viewOff:getDefaultProps

    //@@viewOn:reactLifeCycle
    //@@viewOff:reactLifeCycle

    //@@viewOn:interface
    isLsi() {
      return true;
    },
    //@@viewOff:interface

    //@@viewOn:overriding
    //@@viewOff:overriding

    //@@viewOn:private
    _expandChildProps: function(child) {
      let newChildProps = child ? { ...child.props } : {};

      newChildProps.id = newChildProps.id || this.getId() + "-inner";
      newChildProps.controlled = true;
      newChildProps.hidden = this.isHidden();
      newChildProps.disabled = this.isDisabled();
      newChildProps.selected = this.isSelected();
      newChildProps.nestingLevel = this.getNestingLevel();

      return newChildProps;
    },

    _getChildren() {
      let child;

      if (typeof this.props.children === "function") {
        child = this.props.children({ language: this.getLanguage() });
      } else {
        let children = this.getChildren();

        if (children) {
          let lsi = {};
          if (!Array.isArray(children)) children = [children];
          child = children.map(child => {
            let newChild = child;

            if (UU5.Common.Element.isValid(child)) {
              if (child.type.tagName === this.getDefault("childTagName")) {
                // Lsi.Item
                lsi[child.props.language] = child;
              } else {
                // language as prop
                newChild = UU5.Common.Element.clone(child, { language: this.getLanguage() });
              }
            }

            return newChild;
          });

          if (Object.keys(lsi).length) {
            child = this.getLsiItem(lsi, this.props.params, this.getLanguage());
            child = child ? UU5.Common.Element.clone(child, this._expandChildProps(child)) : null;
          }
        } else {
          child = (
            <LsiItem
              {...this.getMainPropsToPass(["UU5.Common.BaseMixin", "UU5.Common.ElementaryMixin"])}
              controlled
              language={this.getLanguage()}
              content={this.getLsiItem(this.props.lsi, this.props.params)}
              nestingLevel={this.getNestingLevel()}
            />
          );
        }
      }

      return child;
    },
    //@@viewOff:private

    //@@viewOn:render
    render: function() {
      return this.getNestingLevel() ? this._getChildren() : null;
    }
    //@@viewOff:render
  })
);

Lsi.Item = LsiItem;

export default Lsi;
