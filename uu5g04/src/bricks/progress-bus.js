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

import Alert from "./alert.js";
import Button from "./button.js";

import "./progress-bus.less";
//@@viewOff:imports

export const ProgressBus = UU5.Common.VisualComponent.create({
  displayName: "ProgressBus", // for backward compatibility (test snapshots)
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
    tagName: ns.name("ProgressBus"),
    nestingLevelList: UU5.Environment.getNestingLevelList("bigBoxCollection", "box"),
    classNames: {
      main: ns.css("progress-bus"),
      open: ns.css("progress-bus-open"),
      alert: ns.css("progress-bus-alert"),
      body: ns.css("progress-bus-body"),
      message: ns.css("progress-bus-message"),
      button: ns.css("progress-bus-button"),
      buttons: ns.css("progress-bus-buttons"),
      pending: ns.css("progress-bus-pending"),
      position: ns.css("progress-bus-"),
      alertPosition: ns.css("progress-bus-alert-")
    },
    warnings: {
      itemMissing: "Item id %s was not in item list."
    },
    errors: {
      itemMissing: "Item id %s was not in item list."
    }
  },
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {
    position: UU5.PropTypes.oneOf(["left", "center", "right"]),
    verticalPosition: UU5.PropTypes.oneOf(["top", "bottom"]),
    alertPosition: UU5.PropTypes.oneOf(["top", "bottom"])
  },
  //@@viewOff:propTypes

  //@@viewOn:getDefaultProps
  getDefaultProps: function() {
    return {
      position: "center",
      verticalPosition: "top",
      alertPosition: "top"
    };
  },
  //@@viewOff:getDefaultProps

  //@@viewOn:reactLifeCycle
  getInitialState: function() {
    return {
      openId: null,
      itemList: {}
    };
  },

  componentWillUnmount() {
    if (this._timeouts) {
      for (let key in this._timeouts) {
        clearTimeout(this._timeouts[key]);
      }
    }
  },

  //@@viewOff:reactLifeCycle

  //@@viewOn:interface
  addItem(itemProps, setStateCallback) {
    let id = UU5.Common.Tools.generateUUID();
    this.setState(state => {
      let itemList = UU5.Common.Tools.mergeDeep({}, state.itemList);
      itemList[id] = {
        code: itemProps.code || id,
        message: itemProps.message,
        colorSchema: itemProps.colorSchema || "grey",
        pending: itemProps.pending || false,
        closeDisabled: itemProps.closeDisabled || false,
        timeout: itemProps.timeout,
        onClick: itemProps.onClick,
        onClose: itemProps.onClose
      };

      return { itemList: itemList };
    }, setStateCallback);
    return id;
  },

  removeItem(itemId, setStateCallback) {
    this.setState(state => {
      let itemList = UU5.Common.Tools.mergeDeep({}, state.itemList);
      let result;
      if (itemList[itemId]) {
        delete itemList[itemId];
        result = { itemList: itemList };
      } else {
        this.showWarning("itemMissing", itemId);
      }
      return result;
    }, setStateCallback);

    return this;
  },

  getItem(itemId) {
    return this.state.itemList ? this.state.itemList[itemId] : null;
  },

  getItemByCode(code) {
    let item = null;

    let ids = Object.keys(this.state.itemList);
    for (let i = 0; i < ids.length; i++) {
      if (this.state.itemList[ids[i]].code === code) {
        item = this.state.itemList[ids[i]];
        item.id = ids[i];
        break;
      }
    }
    return item;
  },

  getItemsByCode(code) {
    let itemList = [];
    Object.keys(this.state.itemList).forEach(id => {
      let item = this.state.itemList[id];
      if (item.code === code) {
        itemList.push(UU5.Common.Tools.merge({}, item, { id: id }));
      }
    });
    return itemList;
  },

  setItem(itemId, itemProps, setStateCallback) {
    this.setState(state => {
      let result;
      state.itemList = UU5.Common.Tools.mergeDeep({}, state.itemList);
      if (state.itemList[itemId]) {
        let newItemList = state.itemList;
        newItemList[itemId] = itemProps;
        result = { itemList: newItemList };
      } else {
        this.showError("itemMissing", itemId);
      }
      return result;
    }, setStateCallback);

    return this;
  },

  updateItem(itemId, itemProps, setStateCallback) {
    this.setState(state => {
      let result;
      state.itemList = UU5.Common.Tools.mergeDeep({}, state.itemList);
      if (state.itemList[itemId]) {
        let newItemList = state.itemList;
        newItemList[itemId] = UU5.Common.Tools.merge(newItemList[itemId], itemProps);
        result = { itemList: newItemList };
      } else {
        this.showError("itemMissing", itemId);
      }
      return result;
    }, setStateCallback);

    return this;
  },

  getItemList() {
    let itemList = [];
    Object.keys(this.state.itemList).forEach(id => {
      let item = this.state.itemList[id];
      itemList.push(UU5.Common.Tools.merge(item, { id: id }));
    });
    return itemList;
  },

  showAlert(itemId, setStateCallback) {
    if (this.state.itemList[itemId]) {
      this.setState({ openId: itemId }, setStateCallback);
    } else {
      this.showError("itemMissing", itemId);
    }
    return this;
  },

  hideAlert(itemId, setStateCallback) {
    if (this.state.itemList[itemId] && this.state.openId === itemId) {
      this.setState({ openId: null }, setStateCallback);
    } else {
      this.showError("itemMissing", itemId);
    }
    return this;
  },

  //@@viewOff:interface

  //@@viewOn:overriding
  //@@viewOff:overriding

  //@@viewOn:private
  _getAlert() {
    let result;
    let itemProps = this.getItem(this.state.openId);
    let className = this.getClassName().alert + " " + this.getClassName().alertPosition + this.props.alertPosition;

    if (itemProps && itemProps.message) {
      result = (
        <Alert
          content={itemProps.message}
          onClose={itemProps.onClose || (() => this.removeItem(this.state.openId))}
          closeDisabled={itemProps.closeDisabled}
          colorSchema={itemProps.colorSchema}
          className={className}
          hidden={false}
          block
        />
      );
    }

    return result;
  },

  _getItems() {
    this._timeouts = this._timeouts || {};
    return Object.keys(this.state.itemList).map(key => {
      let itemProps = this.state.itemList[key];
      let onClick = itemProps.message ? itemProps.onClick || (() => this.showAlert(key)) : null;

      if (itemProps.timeout) {
        this._timeouts[key] =
          this._timeouts[key] || setTimeout(() => this.state.itemList[key] && this.removeItem(key), itemProps.timeout);
      }

      let className = itemProps.pending
        ? this.getClassName().button + " " + this.getClassName().pending
        : this.getClassName().button;

      return (
        <Button
          onClick={onClick}
          pressed={this.state.openId === key}
          key={key}
          content=" "
          colorSchema={itemProps.colorSchema}
          className={className}
          disabled={!itemProps.message}
        />
      );
    });
  },
  //@@viewOff:private

  // Render
  _getMainAttrs: function() {
    let mainAttrs = this.getMainAttrs();
    mainAttrs.className += " " + this.getClassName().position + this.props.position;
    mainAttrs.className += " " + this.getClassName().position + this.props.verticalPosition;
    mainAttrs.className += Object.keys(this.state.itemList).length > 0 ? " " + this.getClassName().open : null;
    return mainAttrs;
  },

  //@@viewOn:render
  render: function() {
    let mainAttrs = this._getMainAttrs();

    let result = <div {...mainAttrs} />;

    if (Object.keys(this.state.itemList).length > 0) {
      result = (
        <div {...mainAttrs}>
          {this.props.alertPosition === "top" && this._getAlert()}

          <div className={this.getClassName().body}>
            <div className={this.getClassName().message}>{this.getChildren()}</div>
            <div className={this.getClassName().buttons}>{this._getItems()}</div>
          </div>

          {this.props.alertPosition === "bottom" && this._getAlert()}
          {this.getDisabledCover()}
        </div>
      );
    }

    return this.getNestingLevel() ? result : null;
  }
  //@@viewOff:render
});

export default ProgressBus;
