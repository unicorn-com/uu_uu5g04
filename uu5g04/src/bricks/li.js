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
import Icon from "./icon.js";
import ListContext from "./list-context.js";

import "./li.less";
//@@viewOff:imports

export const Li = UU5.Common.VisualComponent.create({
  displayName: "Li", // for backward compatibility (test snapshots)
  //@@viewOn:mixins
  mixins: [
    UU5.Common.BaseMixin,
    UU5.Common.PureRenderMixin,
    UU5.Common.ElementaryMixin,
    UU5.Common.ContentMixin,
    UU5.Common.NestingLevelMixin
  ],
  //@@viewOff:mixins

  //@@viewOn:statics
  statics: {
    tagName: ns.name("Li"),
    nestingLevelList: UU5.Environment.getNestingLevelList("bigBoxCollection", "inline"),
    classNames: {
      main: ns.css("li")
    },
    defaults: {
      parentTagNames: ["UU5.Bricks.Ul", "UU5.Bricks.Ol"],
      markerIcon: "mdi-default"
    }
  },
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {
    markerIcon: UU5.PropTypes.string,
    iconColorSchema: UU5.PropTypes.string
  },
  //@@viewOff:propTypes

  //@@viewOn:getDefaultProps
  getDefaultProps() {
    return {
      icon: null,
      markerIcon: null,
      iconColorSchema: null
    };
  },
  //@@viewOff:getDefaultProps

  //@@viewOn:reactLifeCycle
  getInitialState() {
    UU5.Environment.getColorSchema(this.props.iconColorSchema);
  },
  componentWillMount: function() {
    this.checkParentTagName(this.getDefault().parentTagNames);
  },
  componentWillReceiveProps(nextProps) {
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
  //@@viewOff:private

  //@@viewOn:render
  render: function() {
    return this.getNestingLevel() ? (
      <ListContext.Consumer>
        {({ tagName }) => (
          <li {...this.getMainAttrs()}>
            {tagName !== "UU5.Bricks.Ol" && this.props.markerIcon && (
              <Icon
                icon={this.props.markerIcon}
                className={"uu5-common-text color-schema-" + this.props.iconColorSchema}
              />
            )}
            {this.getChildren()}
            {this.getDisabledCover()}
          </li>
        )}
      </ListContext.Consumer>
    ) : null;
  }
  //@@viewOff:render
});

export default Li;
