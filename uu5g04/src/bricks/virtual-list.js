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

import ScrollArea from "./scroll-area.js";

import "./virtual-list.less";
//@@viewOff:imports

export const VirtualList = UU5.Common.VisualComponent.create({
  displayName: "VirtualList", // for backward compatibility (test snapshots)
  //@@viewOn:mixins
  mixins: [UU5.Common.BaseMixin, UU5.Common.ElementaryMixin],
  //@@viewOff:mixins

  //@@viewOn:statics
  statics: {
    tagName: ns.name("VirtualList"),
    classNames: {
      main: ns.css("virtuallist"),
      content: ns.css("virtuallist-content"),
      scrollBox: ns.css("virtuallist-scrollbox"),
      renderBox: ns.css("virtuallist-renderbox"),
      item: ns.css("virtuallist-item")
    }
  },
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {
    data: UU5.PropTypes.array.isRequired,
    height: UU5.PropTypes.number,
    width: UU5.PropTypes.number,
    boxPadding: UU5.PropTypes.shape({
      left: UU5.PropTypes.number,
      right: UU5.PropTypes.number,
      top: UU5.PropTypes.number,
      bottom: UU5.PropTypes.number
    }),
    item: UU5.PropTypes.oneOfType([UU5.PropTypes.func, UU5.PropTypes.element]),
    itemHeight: UU5.PropTypes.number.isRequired,
    itemWidth: UU5.PropTypes.number,
    overscanRowCount: UU5.PropTypes.number,
    initialScrollTop: UU5.PropTypes.number
  },
  //@@viewOff:propTypes

  //@@viewOn:getDefaultProps
  getDefaultProps() {
    return {
      data: [],
      height: 500,
      width: null,
      boxPadding: {
        left: 0,
        right: 0,
        top: 0,
        bottom: 0
      },
      item: data => data + "",
      itemHeight: 32,
      itemWidth: null,
      overscanRowCount: 3,
      initialScrollTop: null
    };
  },
  //@@viewOff:getDefaultProps

  //@@viewOn:reactLifeCycle
  getInitialState() {
    return {
      offset: 0,
      width: this.props.width,
      height: this.props.height,
      loading: false
    };
  },

  componentWillMount() {
    this._handleDebounced = UU5.Common.Tools.debounce(() => {
      if (this._handleDebounced) {
        // make sure that the component is mounted
        this.setState({ loading: false });
      }
    }, 100);

    this._scrollbarWidth =
      UU5.Common.Tools.isChrome() && !UU5.Common.Tools.isMobileOrTablet ? 8 : UU5.Environment.getScrollBarWidth();
  },

  componentWillUnmount() {
    this._handleDebounced = undefined;
    this._scrollPos = this._scrollArea.getScrollTop();
  },

  componentDidMount() {
    if (!this.state.width) {
      this.setState({ width: this._div.clientWidth });
    }
  },

  componentWillReceiveProps(nextProps) {
    if (nextProps.controlled) {
      this.setState({ width: nextProps.width, height: nextProps.height });
    }
  },
  //@@viewOff:reactLifeCycle

  //@@viewOn:interface
  getScrollTop() {
    return this._scrollArea ? this._scrollArea.getScrollTop() : null;
  },

  setScrollTop(scrollTop) {
    if (this._scrollArea) {
      this._scrollArea.setScrollTop(scrollTop);
    }

    return this;
  },
  //@@viewOff:interface

  //@@viewOn:overriding
  //@@viewOff:overriding

  //@@viewOn:private
  _handleScroll(comp, e) {
    this.setState({ offset: this._scrollArea.getScrollTop(), loading: true }, () => {
      if (typeof this._handleDebounced === "function") {
        this._handleDebounced(comp, e);
      }
    });
  },

  _registerElement(div) {
    this._div = div.findDOMNode();
  },

  _getTableData() {
    let colCount = this.props.itemWidth ? Math.floor(this._getWidth() / this.props.itemWidth) : 1;
    let rowCount = this._getAllRows(colCount);
    let scrollbar = rowCount * this.props.itemHeight > this.props.height;
    if (scrollbar) {
      // has scrollbar so we need to recalculate number of columns
      colCount = this.props.itemWidth ? Math.floor(this._getWidth(true) / this.props.itemWidth) : 1;
      rowCount = this._getAllRows(colCount);
    }

    return { rows: rowCount, cols: colCount, scrollbar: scrollbar };
  },

  _getAllRows(cols = this._getColsCount()) {
    let dataLength = this.props.data.length;
    return Math.ceil(dataLength / cols);
  },

  _getWidth(excludeScrollbar) {
    return (
      this.state.width -
      this.props.boxPadding.right -
      this.props.boxPadding.left -
      (excludeScrollbar ? this._scrollbarWidth : 0)
    );
  },
  //@@viewOff:private

  //@@viewOn:render
  _renderBox(colsCount, scrollbar) {
    let items = [];
    let rowsVisibleCount = Math.ceil(this.state.height / this.props.itemHeight);
    let rowsHiddenCount = Math.floor(this.state.offset / this.props.itemHeight);
    let lastRowIndex = Math.ceil(this.props.data.length / colsCount) - 1;

    let startRowVisibleIndex = rowsHiddenCount;
    let startRowHiddenCount = Math.min(rowsHiddenCount, this.props.overscanRowCount);
    let startRowIndex = startRowVisibleIndex - startRowHiddenCount;
    let endRowVisibleIndex = startRowVisibleIndex + rowsVisibleCount;
    endRowVisibleIndex = Math.min(endRowVisibleIndex, lastRowIndex);
    let endRowHiddenCount = Math.min(lastRowIndex - endRowVisibleIndex + 1, this.props.overscanRowCount);
    let endRowIndex = endRowVisibleIndex + endRowHiddenCount;

    let startColIndex = startRowIndex * colsCount;
    let endColIndex = endRowIndex * colsCount - 1;

    let top = Math.max(rowsHiddenCount - startRowHiddenCount, 0) * this.props.itemHeight;

    for (let i = startColIndex; i <= endColIndex; i++) {
      let itemData = this.props.data[i];

      let item;

      if (itemData !== undefined) {
        item =
          typeof this.props.item === "function"
            ? this.props.item({ data: itemData, loading: this.state.loading }, i)
            : UU5.Common.Element.clone(this.props.item, itemData);
      }

      items.push(
        <div
          className={this.getClassName("item")}
          key={i}
          style={{
            width: this.props.itemWidth ? this.props.itemWidth : undefined,
            height: this.props.itemHeight
          }}
        >
          {item}
        </div>
      );
    }

    return (
      <div
        className={this.getClassName("renderBox")}
        style={{
          top,
          paddingLeft: this.props.boxPadding.left,
          paddingRight: scrollbar ? 0 : this.props.boxPadding.right,
          paddingTop: this.props.boxPadding.top,
          paddingBottom: this.props.boxPadding.bottom
        }}
        key="renderBox"
      >
        {items}
      </div>
    );
  },

  render() {
    let scrollBox, renderBox;

    let props = {
      ...this.getMainPropsToPass(),
      ref_: this._registerElement
    };

    let scrollAreaProps = {
      reserveSpace: true,
      hideOnBlur: false,
      customScrollbar: true,
      initialScrollTop: this.props.initialScrollTop,
      ref_: comp => (this._scrollArea = comp)
    };

    if (this.state.width) {
      props.mainAttrs = { ...props.mainAttrs };

      props.mainAttrs.style = {
        ...props.mainAttrs.style,
        height: this.state.height,
        width: this.state.width
      };

      scrollAreaProps.mainAttrs = {
        onScroll: this._handleScroll
      };

      let tableData = this._getTableData();

      scrollBox = (
        <div
          className={this.getClassName("scrollBox")}
          style={{
            height: tableData.rows * this.props.itemHeight
          }}
          key="scrollBox"
        />
      );

      renderBox = this._renderBox(tableData.cols, tableData.scrollbar);
    }

    return (
      <UU5.Bricks.Div {...props}>
        <ScrollArea {...scrollAreaProps}>
          {scrollBox}
          {renderBox}
        </ScrollArea>
      </UU5.Bricks.Div>
    );
  }
  //@@viewOff:render
});

export default VirtualList;
