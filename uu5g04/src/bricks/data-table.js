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

import React from 'react';
import createReactClass from 'create-react-class';
import PropTypes from 'prop-types';
import * as UU5 from "uu5g04";
import ns from "./bricks-ns.js";

import Table from './table.js'
import THead from './table-thead.js'
import TFoot from './table-tfoot.js'
import TBody from './table-tbody.js'
import Th from './table-th.js'
import Td from './table-td.js'
import Tr from './table-tr.js'

import './data-table.less'

export const DataTable = UU5.Common.LsiMixin.withContext(
  createReactClass({    
    //@@viewOn:mixins
    mixins: [
      UU5.Common.BaseMixin,
      UU5.Common.ElementaryMixin,
      UU5.Common.LsiMixin,
      UU5.Common.SectionMixin,
      UU5.Common.NestingLevelMixin,
      UU5.Common.PureRenderMixin
    ],
    //@@viewOff:mixins

    //@@viewOn:statics
    statics: {
      tagName: ns.name("DataTable"),
      nestingLevelList: UU5.Environment.getNestingLevelList('bigBoxCollection', 'box'),
      classNames: {
        main: ns.css("data-table")
      },
      lsi: () => (UU5.Environment.Lsi.Bricks.dataTable),
      errors: {
        invalidDataHeader: 'Header row items count (%d) are not equal to data row (0) items length (%d).',
        invalidDataBody: 'Data row (%d) items count (%d) are not equal to data row (%d) items length (%d).',
        invalidDataFooter: 'Footer row items count (%d) are not equal to data row (%d) items length (%d).'
      },
      opt: {
        nestingLevelWrapper: true
      }
    },
    //@@viewOff:statics

    //@@viewOn:propTypes
    propTypes: {
      striped: PropTypes.bool,
      bordered: PropTypes.bool,
      hover: PropTypes.bool,
      condensed: PropTypes.bool,
      headerRow: PropTypes.arrayOf(
        PropTypes.any //content props
      ),
      footerRow: PropTypes.arrayOf(
        PropTypes.any //content props
      ),
      rows: PropTypes.arrayOf(
        PropTypes.arrayOf(
          PropTypes.any //content props
        )
      )
    },
    //@@viewOff:propTypes

    //@@viewOn:getDefaultProps
    getDefaultProps: function () {
      return {
        striped: false,
        bordered: false,
        hover: false,
        condensed: false,
        headerRow: null,
        footerRow: null,
        rows: null
      };
    },

    getInitialState: function () {
      return {
        valid: this._validateData(this.props)
      };
    },
    //@@viewOff:getDefaultProps

    //@@viewOn:standardComponentLifeCycle
    componentWillReceiveProps: function (nextProps) {
      if (this.props.headerRow !== nextProps.headerRow ||
        this.props.rows !== nextProps.rows ||
        this.props.footerRow !== nextProps.footerRow) {
        this.setState({valid: this._validateData(nextProps)});
      }
    },
    //@@viewOff:standardComponentLifeCycle

    //@@viewOn:interface
    //@@viewOff:interface

    //@@viewOn:overridingMethods
    //@@viewOff:overridingMethods

    //@@viewOn:componentSpecificHelpers
    _validateData: function (props) {
      var dataTable = this;
      var valid = true;
      var referenceRow = props.headerRow;

      for (var i = 0; i < props.rows.length; i++) {
        var row = props.rows[i];

        if (referenceRow && valid) {
          valid = referenceRow.length === row.length;

          if (!valid) {
            if (i === 0) {
              dataTable.showError('invalidDataHeader', [referenceRow.length, row.length]);
            } else {
              dataTable.showError('invalidDataBody', [(i - 1), referenceRow.length, i, row.length]);
            }
            break;
          }
        } else {
          referenceRow = row;
        }
      }

      if (valid && props.footerRow && referenceRow) {
        valid = props.footerRow.length === referenceRow.length;
        if (!valid) {
          dataTable.showError('invalidDataFooter', [props.footerRow.length, referenceRow.length - 1, referenceRow.length]);
        }
      }

      return valid;
    },

    _getHeaderRow: function () {
      return (
        <THead>
        <Tr content={this.props.headerRow && this._getRowCells(this.props.headerRow, true)}/>
        </THead>
      );
    },

    _getFooterRow: function () {
      return (
        <TFoot>
        <Tr content={this.props.footerRow && this._getRowCells(this.props.footerRow)}/>
        </TFoot>
      );
    },

    _getBodyRows: function () {
      var dataTable = this;
      var rows = this.props.rows.map(function (row, i) {
        return <Tr key={i}>{dataTable._getRowCells(row)}</Tr>
      });

      return (
        <TBody>
        {rows}
        </TBody>
      );
    },

    _getRowCells: function (row, isHeader) {
      var brick = isHeader ? Th : Td;
      var dataTable = this;
      return row.map(function (cell, i) {
        var props;
        if (dataTable._isProps(cell)) {
          props = UU5.Common.Tools.merge({}, cell, {key: i});
        } else {
          props = {content: dataTable._checkLsiContent(cell), key: i};
        }
        return React.createElement(brick, props);
      });
    },

    _isProps: function (cell) {
      return !(
        (typeof cell === 'string' || typeof  cell === 'number') ||         // number or string
        (typeof cell === 'object' && (cell.lsi || cell === null)) ||       // empty string or lsi content
        (typeof cell === 'object' && typeof cell.type === 'function')      // react.element
      );
    },

    _checkLsiContent: function (content) {
      return content.lsi ? this.getLsiItem(content.lsi) : content;
    },

    _getMainProps: function () {
      var mainProps = this.getMainPropsToPass([
        "UU5.Common.BaseMixin",
        "UU5.Common.ElementaryMixin",
        "UU5.Common.SectionMixin"
      ]);
      mainProps.striped = this.props.striped;
      mainProps.bordered = this.props.bordered;
      mainProps.hover = this.props.hover;
      mainProps.condensed = this.props.condensed;

      return mainProps;
    },
    //@@viewOff:componentSpecificHelpers

    //@@viewOn:render
    render: function () {
      var result;

      if (this.state.valid) {
        result = (
          <Table
            {...this._getMainProps()}
            header={this.props.header}
            footer={this.props.footer}
            nestingLevel={this.getNestingLevel()}
          >
            {this._getHeaderRow()}
            {this._getBodyRows()}
            {this._getFooterRow()}
          </Table>
        );
      } else {
        result = <UU5.Common.Error content={this.getLsiComponent('invalidDataLabel')}/>
      }

      return result;
    }
    //@@viewOff:render
  })
);

export default DataTable;
