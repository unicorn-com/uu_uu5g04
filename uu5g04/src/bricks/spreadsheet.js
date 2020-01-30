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

import DataTable from "./data-table.js";

import "./spreadsheet.less";
//@@viewOff:imports

export const Spreadsheet = UU5.Common.VisualComponent.create({
  displayName: "Spreadsheet", // for backward compatibility (test snapshots)

  //@@viewOn:mixins
  mixins: [UU5.Common.BaseMixin, UU5.Common.PureRenderMixin, UU5.Common.ElementaryMixin, UU5.Common.SectionMixin],
  //@@viewOff:mixins

  //@@viewOn:statics
  statics: {
    tagName: ns.name("Spreadsheet"),
    classNames: {
      main: ns.css("spreadsheet")
    },
    lsi: () => UU5.Environment.Lsi.Bricks.spreadsheet,
    errors: {
      invalidDataType:
        "Data type of cell '%s' is not of type of '%s' of is not one of ('string', 'number' or 'date'). Cell value: '%s'"
    },
    defaults: {
      regExpNumbers: /[0-9]/g,
      regExpChars: /\D/g,
      regExpCellKey: /([A-Z]*)(\d)/g,
      regExpIsoDate: /^(?:[1-9]\d{3}-(?:(?:0[1-9]|1[0-2])-(?:0[1-9]|1\d|2[0-8])|(?:0[13-9]|1[0-2])-(?:29|30)|(?:0[13578]|1[02])-31)|(?:[1-9]\d(?:0[48]|[2468][048]|[13579][26])|(?:[2468][048]|[13579][26])00)-02-29)T(?:[01]\d|2[0-3]):[0-5]\d:[0-5]\d(?:Z|[+-][01]\d:[0-5]\d)$/g,
      regExpY: /(y+)/
    },
    opt: {
      dummyLevel: true
    }
  },
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {
    striped: UU5.PropTypes.bool,
    bordered: UU5.PropTypes.bool,
    hover: UU5.PropTypes.bool,
    condensed: UU5.PropTypes.bool,
    cols: UU5.PropTypes.object, //col props - 'A':{}
    rows: UU5.PropTypes.object, //row props - '1':{} - rowType (header|body|footer)
    cells: UU5.PropTypes.object //'A1':{'value':'','type':'','formula':'','format':'','colorSchema':'','className':''}
  },
  //@@viewOff:propTypes

  //@@viewOn:getDefaultProps
  getDefaultProps: function() {
    return {
      striped: false,
      bordered: false,
      hover: false,
      condensed: false,
      cols: null,
      rows: null,
      cells: null
    };
  },
  //@@viewOff:getDefaultProps

  //@@viewOn:reactLifeCycle
  getInitialState: function() {
    return {
      sortedCells: this._getSortedCells(),
      headerRowIndex: this._getHeaderRowIndex(),
      footerRowIndex: this._getFooterRowIndex()
    };
  },

  componentWillReceiveProps(nextProps) {
    if (nextProps.controlled) {
      this.setState({
        sortedCells: this._getSortedCells(nextProps),
        headerRowIndex: this._getHeaderRowIndex(nextProps),
        footerRowIndex: this._getFooterRowIndex(nextProps)
      });
    }
    return this;
  },

  //@@viewOff:reactLifeCycle

  //@@viewOn:interface
  //@@viewOff:interface

  //@@viewOn:overriding
  //@@viewOff:overriding

  //@@viewOn:private
  _checkCellProp: function(prop, cell, coll, row) {
    var result = undefined;
    if (cell[prop] !== undefined) {
      result = cell[prop];
    } else if (coll && coll[prop] !== undefined) {
      result = coll[prop];
    } else if (row && row[prop] !== undefined) {
      result = row[prop];
    }
    return result;
  },

  _getSortedCells(props) {
    props = props || this.props;

    let hasValidData = true;
    let cellsArray = [];

    Object.keys(props.cells).forEach(key => {
      let rowIndex = this._getRowNumber(key) - 1;
      let rowArray = cellsArray[rowIndex] || [];

      let row = props.rows[this._getRowNumber(key)];
      let coll = props.cols[this._getColumnCharacter(key)];

      let cell = {
        key: key,
        value: props.cells[key].value,
        type: props.cells[key].type || (coll && coll.type) || (row && row.type) || null,
        format: props.cells[key].format || (coll && coll.format) || (row && row.format) || null,
        formula: props.cells[key].formula || (coll && coll.formula) || (row && row.formula) || null,
        colorSchema: this._checkCellProp("colorSchema", props.cells[key], coll, row),
        //background: spreadSheet._checkCellProp('background', cells[key], coll, row),
        className: props.cells[key].className
          ? props.cells[key].className
          : "" +
            (coll && coll.className ? " " + coll.className : "") +
            (row && row.className ? " " + row.className : "")
      };

      let isValid = true;
      cell.type && (isValid = this._isValidCellValueType(cell.value, cell.type));
      !isValid && this.showError("invalidDataType", [key, cell.type, cell.value]);
      hasValidData && (hasValidData = isValid);

      rowArray.push(cell);
      cellsArray[rowIndex] = rowArray.sort();
    });

    return hasValidData ? cellsArray : null;
  },

  _getColumnCharacter: function(cellKey) {
    return cellKey.replace(this.getDefault().regExpNumbers, "");
  },

  _getRowNumber: function(cellKey) {
    return cellKey.replace(this.getDefault().regExpChars, "");
  },

  _isValidCellValueType: function(value, type) {
    var result = false;
    switch (type) {
      case "string":
        result = typeof value === "string" || value === null;
        break;
      case "number":
        result = typeof value === "number";
        break;
      case "date":
        result = typeof value === "string" && value.match(this.getDefault().regExpIsoDate);
        break;
      default:
        result = false;
    }

    return result;
  },

  _getHeaderRowIndex(props) {
    props = props || this.props;
    let index;
    let rows = props.rows;

    for (let key in rows) {
      if (rows[key].header) {
        index = key;
        break;
      }
    }

    return index;
  },

  _getFooterRowIndex(props) {
    props = props || this.props;
    let index;
    let rows = props.rows;

    for (let key in rows) {
      if (rows[key].footer) {
        index = key;
        break;
      }
    }

    return index;
  },

  _getBodyRows: function() {
    var sortedCells = this.state.sortedCells;
    var headerRowIndex = this.state.headerRowIndex;
    var footerRowIndex = this.state.footerRowIndex;
    var spreadSheet = this;

    var rows = [];
    var row = [];

    sortedCells.forEach(function(cellsRow, i) {
      if (i + 1 != headerRowIndex && i + 1 != footerRowIndex) {
        cellsRow.forEach(function(cell, i) {
          row.push(spreadSheet._getCell(cell));
        });
        rows.push(row);
        row = [];
      }
    });

    return rows;
  },

  _getHeaderRow: function() {
    var sortedCells = this.state.sortedCells;
    var headerRowIndex = this.state.headerRowIndex;
    var spreadSheet = this;

    var row = [];
    sortedCells[headerRowIndex - 1].forEach(function(cell) {
      row.push(spreadSheet._getCell(cell));
    });

    return row.length > 0 ? row : null;
  },

  _getFooterRow: function() {
    var sortedCells = this.state.sortedCells;
    var footerRowIndex = this.state.footerRowIndex;
    var spreadSheet = this;

    var row = [];
    sortedCells[footerRowIndex - 1].forEach(function(cell) {
      row.push(spreadSheet._getCell(cell));
    });

    return row.length > 0 ? row : null;
  },

  _getCell: function(cell) {
    var formattedValue = cell.formula ? this._getFormulaResult(cell.formula) : cell.value;

    if (cell.format && cell.type === "date") {
      formattedValue = this._formatDate(new Date(formattedValue), cell.format);
    }

    return {
      className: cell.className,
      content: formattedValue,
      colorSchema: cell.colorSchema
      //background: cell.background
    };
  },

  _getFormulaResult: function(formula) {
    var spreadSheet = this;
    var cellsKeys = formula.match(this.getDefault().regExpCellKey);
    var formulaResultType = spreadSheet._getFormulaResultType(cellsKeys);

    var result;

    if (formulaResultType === "string") {
      cellsKeys.forEach(function(key) {
        formula = formula.replace(key, spreadSheet.props.cells[key].value.toString());
      });
      result = formula;
    } else if (formulaResultType === "date") {
      cellsKeys.forEach(function(key) {
        formula = formula.replace(key, new Date(spreadSheet.props.cells[key].value).getTime());
      });
      try {
        result = new Date(eval(formula)).toISOString();
      } finally {
      }
    } else if (formulaResultType === "number") {
      cellsKeys.forEach(function(key) {
        formula = formula.replace(key, spreadSheet.props.cells[key].value);
      });
      try {
        result = eval(formula);
      } finally {
      }
    }

    return result;
  },

  // check all formula members types
  // if any is string -> returns string
  // if members are date or numbers -> returns date
  // if all members are number -> returns number
  _getFormulaResultType: function(cellsKeys) {
    var formulaResultType;
    var spreadSheet = this;

    // check all formula keys value
    cellsKeys.forEach(function(key) {
      var cellValue = spreadSheet.props.cells[key].value;
      var cellType;

      // for each key returns their type
      if (typeof cellValue === "number") {
        cellType = "number";
      } else if (typeof cellValue === "string") {
        if (new Date(cellValue).getTime() > 0 && cellValue.match(spreadSheet.getDefault().regExpIsoDate)) {
          cellType = "date";
        } else {
          cellType = "string";
        }
      } else if (typeof cellValue === "object" && cellValue === null) {
        cellType = "string";
      }

      // for date and number must check previous formula key type
      switch (cellType) {
        case "string": // for string always -> string
          formulaResultType = cellType;
          break;
        case "date": // for date and number -> date
          if (!formulaResultType || formulaResultType === "date" || formulaResultType === "number") {
            formulaResultType = "date";
          }
          break;
        case "number": // for number -> number
          if (!formulaResultType || formulaResultType === "number") {
            formulaResultType = "number";
          }
          break;
        default:
          break;
      }
    });

    return formulaResultType;
  },

  _formatDate: function(date, format) {
    var config = {
      "M+": date.getMonth() + 1, //month
      "d+": date.getDate(), //day
      "h+": date.getHours(), //hour
      "m+": date.getMinutes(), //minute
      "s+": date.getSeconds(), //second
      "q+": Math.floor((date.getMonth() + 3) / 3), //quarter
      S: date.getMilliseconds() //millisecond
    };

    if (this.getDefault().regExpY.test(format)) {
      format = format.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
    }
    for (var k in config) {
      if (new RegExp("(" + k + ")").test(format)) {
        format = format.replace(
          RegExp.$1,
          RegExp.$1.length === 1 ? config[k] : ("00" + config[k]).substr(("" + config[k]).length)
        );
      }
    }
    return format;
  },

  _getMainProps: function() {
    var mainProps = this.getMainPropsToPass([
      "UU5.Common.BaseMixin",
      "UU5.Common.ElementaryMixin",
      "UU5.Common.SectionMixin"
    ]);

    mainProps.striped = this.props.striped;
    mainProps.bordered = this.props.bordered;
    mainProps.hover = this.props.hover;
    mainProps.condensed = this.props.condensed;
    mainProps.header = this.props.header;
    mainProps.footer = this.props.footer;

    mainProps.headerRow = this._getHeaderRow();
    mainProps.rows = this._getBodyRows();
    mainProps.footerRow = this._getFooterRow();

    return mainProps;
  },

  //@@viewOff:private

  //@@viewOn:render
  render: function() {
    var result;

    if (this.state.sortedCells && this.props.cells) {
      result = <DataTable {...this._getMainProps()} />;
    } else {
      result = <UU5.Common.Error content={this.getLsiComponent("invalidDataLabel")} />;
    }

    return result;
  }
  //@@viewOff:render
});

export default Spreadsheet;
