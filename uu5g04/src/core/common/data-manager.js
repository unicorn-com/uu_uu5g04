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
import React from "react";
import PropTypes from "prop-types";
import Context from "./context.js";
import BaseMixin from "./base-mixin.js";
import Component from "./component.js";
//@@viewOff:imports

export const DataManager = Component.create({
  displayName: "DataManager", // for backward compatibility (test snapshots)
  //@@viewOn:mixins
  mixins: [BaseMixin],
  //@@viewOff:mixins

  //@@viewOn:statics
  statics: {
    tagName: "UU5.Common.DataManager",
    errors: {
      serverLoad: "Error during %s data from server.",
      serverUpdate: "Error during %s data on server."
    }
  },
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {
    data: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
    onLoad: PropTypes.func,
    onReload: PropTypes.func,
    onUpdate: PropTypes.oneOfType([PropTypes.func, PropTypes.object]),
    // reloadInterval: PropTypes.number,
    pessimistic: PropTypes.bool
  },
  //@@viewOff:propTypes

  //@@viewOn:defaultProps
  getDefaultProps() {
    return {
      data: undefined,
      onLoad: undefined,
      onReload: undefined,
      onUpdate: undefined,
      // reloadInterval: undefined,
      pessimistic: false
    };
  },
  //@@viewOff:defaultProps

  //@@viewOn:reactLifeCycle
  getInitialState() {
    let state = {
      data: null,
      viewState: "load",
      errorState: null,
      errorData: null
    };

    if (typeof this.props.onLoad !== "function") {
      state.data = this.props.data;
      state.viewState = "ready";
    }

    return state;
  },

  componentDidMount() {
    this.load(this.props.data, false)
    // promise must have catch, in other way there is written error to console
      .catch(() => {
      });
    // this._startReload();
  },

  // componentWillUnmount() {
  //   this._stopReload();
  // },
  //@@viewOff:reactLifeCycle

  //@@viewOn:interface
  load(data = this.props.data, pessimistic = this.props.pessimistic) {
    return new Promise((resolve, reject) => {
      // this._stopReload();

      if (pessimistic) {
        this.setState({ viewState: "load", errorState: null, errorData: null }, () => {
          this._load(this.props.onLoad, data)
            .then(dtoOut => this._getPromiseCallback(resolve, dtoOut)())
            .catch(dtoOut => {
              this.showError("serverLoad", "loading", { context: { dtoOut } });
              this._getPromiseCallback(reject, dtoOut)();
            });
        });
      } else {
        this._load(this.props.onLoad, data)
          .then(dtoOut => this._getPromiseCallback(resolve, dtoOut)())
          .catch(dtoOut => {
            this.showError("serverLoad", "loading", { context: { dtoOut } });
            typeof reject === "function" && reject(dtoOut);
            // this._getPromiseCallback(reject, dtoOut)()
          });
      }
    });
  },

  reload(data = this.props.data, pessimistic = this.props.pessimistic) {
    return new Promise((resolve, reject) => {
      if (pessimistic) {
        this.setState({ viewState: "reload", errorState: null, errorData: null }, () => {
          this._load(this._getReloadCall(), data, "reload")
            .then(dtoOut => this._getPromiseCallback(resolve, dtoOut)())
            .catch(dtoOut => {
              this.showError("serverLoad", "reloading", { context: { dtoOut } });
              this._getPromiseCallback(reject, dtoOut)();
            });
        });
      } else {
        this._load(this._getReloadCall(), data, "reload")
          .then(dtoOut => this._getPromiseCallback(resolve, dtoOut)())
          .catch(dtoOut => {
            this.showError("serverLoad", "reloading", { context: { dtoOut } });
            this._getPromiseCallback(reject, dtoOut)();
          });
      }
    });
  },

  update(newData, pessimistic = this.props.pessimistic, serverParams, key) {
    // backward compatibility
    if (typeof serverParams === "string") {
      key = serverParams;
      serverParams = undefined;
    }

    return new Promise((resolve, reject) => {
      // this._stopReload();

      let [newState, oldData] = this._getUpdatedViewData(newData, pessimistic);
      this.setState(newState, () =>
        this._updateServer(key, newData, pessimistic, oldData, serverParams, resolve, reject)
      );
    });
  },

  updateData(newData) {
    return new Promise(resolve => {
      this.setState(({ data }) => ({ data: { ...data, ...newData } }), resolve);
    });
  },

  getData() {
    return Array.isArray(this.state.data) ? [...this.state.data] : this.state.data ? { ...this.state.data } : null;
  },
  //@@viewOff:interface

  //@@viewOn:private
  _load(call = this.props.onLoad, data = this.props.data, errorState = "load") {
    return new Promise((resolve, reject) => {
      if (typeof call === "function") {
        call(data || null)
          .then(data => {
            this.isRendered() &&
            this.setState(
              { viewState: "ready", errorState: null, errorData: null, data },
              typeof resolve === "function" ? () => resolve(data) : undefined
            );
          })
          .catch(errorData => {
            this.isRendered() &&
            this.setState(
              { errorData, viewState: "error", errorState },
              typeof reject === "function" ? () => reject(errorData) : undefined
            );
          });
      }
    });
  },

  _getUpdatedViewData(data, pessimistic) {
    let state,
      oldData = this.state.data;
    if (pessimistic) {
      state = { viewState: "update", errorState: null, errorData: null };
    } else {
      state = { data, errorState: null, errorData: null };
    }
    return [state, oldData];
  },

  _updateServer(key, newData, pessimistic, oldData, serverParams, resolve, reject) {
    let call = this._getUpdateCall(key);
    let promise = call(newData, serverParams);

    if (pessimistic) {
      promise
        .then(dtoOut => {
          // update just client data - data returns from server was not displayed
          this.isRendered() &&
          this.setState(
            { viewState: "ready", errorState: null, errorData: null, data: dtoOut },
            this._getPromiseCallback(resolve, dtoOut)
          );
        })
        .catch(errorData => {
          this.showError("serverLoad", "updating", { context: { dtoOut: errorData } });
          let newState = { viewState: "error", errorState: "update", errorData };
          this.isRendered() && this.setState(newState, this._getPromiseCallback(reject, errorData));
        });
    } else {
      promise
        .then(dtoOut => this._getPromiseCallback(resolve, dtoOut)())
        .catch(errorData => {
          this.showError("serverLoad", "updating", { context: { dtoOut: errorData } });
          let newState = { viewState: "error", errorState: "update", errorData };
          this.isRendered() &&
          this.setState({ ...newState, errorData, data: oldData }, this._getPromiseCallback(reject, errorData));
        });
    }
  },

  _getUpdateCall(key) {
    let call = this.props.onUpdate;
    if (call && call[key]) call = call[key];
    return call;
  },

  _getReloadCall() {
    return this.props.onReload || this.props.onLoad;
  },

  _getPromiseCallback(callback, data) {
    return () => {
      // this._startReload();
      typeof callback === "function" && callback(data);
    };
  },

  // _startReload() {
  //   if (this.props.reloadInterval) {
  //     this._interval = setInterval(
  //       () => this._load(this._getReloadCall(), undefined, "reload"),
  //       this.props.reloadInterval
  //     );
  //   }
  // },

  // _stopReload() {
  //   this._interval && clearInterval(this._interval);
  //   this._interval = undefined;
  // },

  _getValues() {
    return {
      ...this.state,
      // clone
      data: this.getData(),
      handleLoad: this.load,
      handleReload: this.reload,
      handleUpdate: this.update
    };
  },
  //@@viewOff:private

  //@@viewOn:render
  render() {
    return this.props.children(this._getValues());
  }
  //@@viewOff:render
});

DataManager.createContext = () => {
  const DataManagerContext = Context.create();

  const createProvider = ({ children, ...props }, ref) => (
    <DataManager {...props} ref_={ref}>
      {values => <DataManagerContext.Provider value={values}>{children}</DataManagerContext.Provider>}
    </DataManager>
  );

  const Provider = React.forwardRef(createProvider);

  return { Provider, Consumer: DataManagerContext.Consumer, Context: DataManagerContext };
};

export default DataManager;
