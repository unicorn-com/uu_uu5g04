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

import TableCol from "./table-col.js";
import TableColGroup from "./table-col-group.js";
import TableTBody from "./table-tbody.js";
import TableTd from "./table-td.js";
import TableTFoot from "./table-tfoot.js";
import TableTh from "./table-th.js";
import TableTHead from "./table-thead.js";
import TableTr from "./table-tr.js";

import "./table.less";
//@@viewOff:imports

export const Table = UU5.Common.VisualComponent.create({
  displayName: "Table", // for backward compatibility (test snapshots)

  //@@viewOn:mixins
  mixins: [
    UU5.Common.BaseMixin,
    UU5.Common.PureRenderMixin,
    UU5.Common.ElementaryMixin,
    UU5.Common.SectionMixin,
    UU5.Common.ColorSchemaMixin,
    UU5.Common.NestingLevelMixin
  ],
  //@@viewOff:mixins

  //@@viewOn:statics
  statics: {
    tagName: ns.name("Table"),
    nestingLevelList: UU5.Environment.getNestingLevelList("bigBoxCollection", "smallBox"),
    classNames: {
      main: ns.css("table"),
      table: ns.css("table-table"),
      striped: ns.css("table-striped"),
      bordered: ns.css("table-bordered"),
      hover: ns.css("table-hover"),
      condensed: ns.css("table-condensed"),
      responsive: ns.css("table-responsive")
    },
    defaults: {
      childTagNames: [
        "UU5.Bricks.Table.Tr",
        "UU5.Bricks.Table.THead",
        "UU5.Bricks.Table.TBody",
        "UU5.Bricks.Table.TFoot",
        "UU5.Bricks.Table.ColGroup"
      ]
    },
    opt: {
      nestingLevelWrapper: true
    }
  },
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {
    striped: UU5.PropTypes.bool,
    bordered: UU5.PropTypes.bool,
    hover: UU5.PropTypes.bool,
    condensed: UU5.PropTypes.bool,
    responsive: UU5.PropTypes.bool,
    allowTags: UU5.PropTypes.arrayOf(UU5.PropTypes.string)
  },
  //@@viewOff:propTypes

  //@@viewOn:getDefaultProps
  getDefaultProps: function() {
    return {
      striped: false,
      bordered: false,
      hover: false,
      condensed: false,
      responsive: false,
      allowTags: []
    };
  },
  //@@viewOff:getDefaultProps

  //@@viewOn:reactLifeCycle

  //@@viewOff:reactLifeCycle

  //@@viewOn:interface
  isTable() {
    return true;
  },
  //@@viewOff:interface

  //@@viewOn:overriding
  shouldChildRender_: function(child) {
    let childTagName = UU5.Common.Tools.getChildTagName(child);
    let defaultChildTagNames = this.getDefault().childTagNames;
    let childTagNames = this.props.allowTags.concat(defaultChildTagNames);
    let result = childTagNames.indexOf(childTagName) > -1;
    if (!result && (typeof child !== "string" || child.trim())) {
      if (childTagName)
        this.showError("childTagNotAllowed", [childTagName, this.getTagName(), childTagName, defaultChildTagNames[0]], {
          mixinName: "UU5.Common.BaseMixin"
        });
      else this.showError("childNotAllowed", [child, defaultChildTagNames[0]], { mixinName: "UU5.Common.BaseMixin" });
    }
    return result;
  },
  //@@viewOff:overriding

  //@@viewOn:private
  _getMainProps: function() {
    var props = this.getMainAttrs();
    this.props.responsive && (props.className += " " + this.getClassName().responsive);
    return props;
  },

  _buildTableAttrs: function() {
    var tableAttrs = { className: this.getClassName().table };
    this.props.striped && (tableAttrs.className += " " + this.getClassName().striped);
    this.props.bordered && (tableAttrs.className += " " + this.getClassName().bordered);
    this.props.hover && (tableAttrs.className += " " + this.getClassName().hover);
    this.props.condensed && (tableAttrs.className += " " + this.getClassName().condensed);
    return tableAttrs;
  },
  //@@viewOff:private

  //@@viewOn:render
  render: function() {
    return this.getNestingLevel() ? (
      <div {...this._getMainProps()}>
        {this.getHeaderChild()}
        <table {...this._buildTableAttrs()}>{this.getChildren()}</table>
        {this.getFooterChild()}
        {this.getDisabledCover()}
      </div>
    ) : null;
  }
  //@@viewOff:render
});

Table.ColGroup = TableColGroup;
Table.Col = TableCol;
Table.TBody = TableTBody;
Table.Td = TableTd;
Table.TFoot = TableTFoot;
Table.Th = TableTh;
Table.THead = TableTHead;
Table.Tr = TableTr;

export default Table;
