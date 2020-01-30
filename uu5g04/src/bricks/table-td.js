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

import "./table-td.less";
//@@viewOff:imports

export default UU5.Common.VisualComponent.create({
  displayName: "table-td", // for backward compatibility (test snapshots)
  //@@viewOn:mixins
  mixins: [
    UU5.Common.BaseMixin,
    UU5.Common.PureRenderMixin,
    UU5.Common.ElementaryMixin,
    UU5.Common.NestingLevelMixin,
    UU5.Common.ContentMixin,
    UU5.Common.ColorSchemaMixin
  ],
  //@@viewOff:mixins

  //@@viewOn:statics
  statics: {
    tagName: ns.name("Table.Td"),
    nestingLevelList: UU5.Environment.getNestingLevelList("bigBoxCollection", "inline"),
    classNames: {
      main: ns.css("table-td uu5-common-text")
      //bg: 'uu5-common-bg'
    },
    defaults: {
      parentTagName: "UU5.Bricks.Table.Tr"
    },
    opt: {
      nestingLevelWrapper: true
    },
    errors: {
      invalidParent: "Parent of this component is not Table."
    }
  },
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {
    colSpan: UU5.PropTypes.oneOfType([UU5.PropTypes.number, UU5.PropTypes.string]),
    rowSpan: UU5.PropTypes.oneOfType([UU5.PropTypes.number, UU5.PropTypes.string])
    //background: UU5.PropTypes.bool
  },

  getDefaultProps: function() {
    return {
      colSpan: null,
      rowSpan: null
      //background: false
    };
  },
  //@@viewOff:propTypes

  //@@viewOn:getDefaultProps
  //@@viewOff:getDefaultProps

  //@@viewOn:reactLifeCycle
  componentWillMount: function() {
    let parent = this.getParent();

    if (parent) {
      while (parent.getOpt("parentWrapper")) {
        parent = parent.getParent();
      }
    }

    if (!(parent && (parent.isTable || parent.isTr))) {
      this.showError("invalidParent");
    }
  },

  //@@viewOff:reactLifeCycle

  //@@viewOn:interface
  //@@viewOff:interface

  //@@viewOn:overriding
  //@@viewOff:overriding

  //@@viewOn:private
  _getMainProps: function() {
    const props = this.getMainAttrs();
    //this.props.background && (props.className += ' ' + this.getClassName().bg);
    this.props.colSpan && (props.colSpan = this.props.colSpan);
    this.props.rowSpan && (props.rowSpan = this.props.rowSpan);
    return props;
  },
  //@@viewOff:private

  //@@viewOn:render
  render: function() {
    return this.getNestingLevel() ? (
      <td {...this._getMainProps()}>
        {this.getChildren()}
        {this.getDisabledCover()}
      </td>
    ) : null;
  }
  //@@viewOff:render
});
