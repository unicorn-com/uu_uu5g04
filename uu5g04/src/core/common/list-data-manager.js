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

export const ListDataManager = Component.create({
  displayName: "ListDataManager", // for backward compatibility (test snapshots)
  //@@viewOn:mixins
  mixins: [BaseMixin],
  //@@viewOff:mixins

  //@@viewOn:statics
  statics: {
    tagName: "UU5.Common.ListDataManager",
    errors: {
      serverLoad: "Error during %s items from server.",
      serverUpdate: "Error during %s item on server."
    }
  },
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {
    data: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
    onLoad: PropTypes.func,
    onReload: PropTypes.func,
    onCreate: PropTypes.func,
    onUpdate: PropTypes.oneOfType([PropTypes.func, PropTypes.object]),
    onDelete: PropTypes.func,
    onBulkCreate: PropTypes.func,
    onBulkUpdate: PropTypes.oneOfType([PropTypes.func, PropTypes.object]),
    onBulkDelete: PropTypes.func,
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
      onCreate: undefined,
      onUpdate: undefined,
      onDelete: undefined,
      onBulkCreate: undefined,
      onBulkUpdate: undefined,
      onBulkDelete: undefined,
      // reloadInterval: undefined,
      pessimistic: false
    };
  },
  //@@viewOff:defaultProps

  //@@viewOn:reactLifeCycle
  getInitialState() {
    let state = {
      data: null,
      pageInfo: null,
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
    this._load(this.props.onLoad, this.props.data)
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
            .then(promise => this._getPromiseCallback(resolve, promise)())
            .catch(promise => {
              this.showError("serverLoad", "loading", { context: { promise } });
              this._getPromiseCallback(reject, promise)();
            });
        });
      } else {
        this._load(this.props.onLoad, data)
          .then(promise => this._getPromiseCallback(resolve, promise)())
          .catch(promise => {
            this.showError("serverLoad", "loading", { context: { promise } });
            this._getPromiseCallback(reject, promise)();
          });
      }
    });
  },

  reload(data = this.props.data, pessimistic = this.props.pessimistic) {
    return new Promise((resolve, reject) => {
      // this._stopReload();

      if (pessimistic) {
        this.setState({ viewState: "reload", errorState: null, errorData: null }, () => {
          this._load(this.props.onReload || this.props.onLoad, data, "reload")
            .then(dtoOut => this._getPromiseCallback(resolve, dtoOut)())
            .catch(dtoOut => {
              this.showError("serverLoad", "reloading", { context: { dtoOut } });
              this._getPromiseCallback(reject, dtoOut)();
            });
        });
      } else {
        this._load(this.props.onReload || this.props.onLoad, data, "reload")
          .then(dtoOut => this._getPromiseCallback(resolve, dtoOut)())
          .catch(dtoOut => {
            this.showError("serverLoad", "reloading", { context: { dtoOut } });
            this._getPromiseCallback(reject, dtoOut)();
          });
      }
    });
  },

  create(item, pessimistic = this.props.pessimistic, serverParams) {
    return new Promise((resolve, reject) => {
      // this._stopReload();

      let newState = this._getCreatedViewData(item, pessimistic);
      this.setState(newState, () => this._createServer(item, pessimistic, serverParams, resolve, reject));
    });
  },

  bulkCreate(items, pessimistic = this.props.pessimistic, serverParams) {
    return new Promise((resolve, reject) => {
      // this._stopReload();

      let newState = this._getCreatedViewData(items, pessimistic, true);
      this.setState(newState, () => this._createServer(items, pessimistic, serverParams, resolve, reject, true));
    });
  },

  update(id, item, pessimistic = this.props.pessimistic, serverParams, key) {
    return new Promise((resolve, reject) => {
      // this._stopReload();

      let [newState, oldItem] = this._getUpdatedViewData(id, item, pessimistic);
      this.setState(newState, () =>
        this._updateServer(key, id, item, pessimistic, oldItem, serverParams, resolve, reject)
      );
    });
  },

  bulkUpdate(ids, items, pessimistic = this.props.pessimistic, serverParams, key) {
    return new Promise((resolve, reject) => {
      // this._stopReload();

      let [newState, oldItems] = this._getUpdatedViewData(ids, items, pessimistic, true);
      this.setState(newState, () =>
        this._updateServer(key, ids, items, pessimistic, oldItems, serverParams, resolve, reject, true)
      );
    });
  },

  delete(id, pessimistic = this.props.pessimistic, serverParams) {
    return new Promise((resolve, reject) => {
      // this._stopReload();

      let [newState, oldItem, index] = this._getDeletedViewData(id, pessimistic);
      this.setState(newState, () => this._deleteServer(id, pessimistic, oldItem, index, serverParams, resolve, reject));
    });
  },

  bulkDelete(ids, pessimistic = this.props.pessimistic, serverParams) {
    return new Promise((resolve, reject) => {
      // this._stopReload();

      let [newState, oldItem, index] = this._getDeletedViewData(ids, pessimistic, true);
      this.setState(newState, () =>
        this._deleteServer(ids, pessimistic, oldItem, index, serverParams, resolve, reject, true)
      );
    });
  },
  //@@viewOff:interface

  //@@viewOn:private
  _load(call = this.props.onLoad, data = this.props.data || null, errorState = "load") {
    return new Promise((resolve, reject) => {
      if (typeof call === "function") {
        call(data)
          .then(response => {
            let pageInfo = null;
            let data = response;
            if (typeof response === "object" && response !== null && !Array.isArray(response)) {
              pageInfo = response.pageInfo;
              data = Array.isArray(response.itemList) ? response.itemList : response;
            }

            this.isRendered() &&
            this.setState(
              { viewState: "ready", errorState: null, errorData: null, data, pageInfo, response },
              typeof resolve === "function" ? () => resolve(data) : undefined
            );
          })
          .catch(response => {
            this.isRendered() &&
            this.setState(
              { errorData: response, viewState: "error", errorState, response },
              typeof reject === "function" ? () => reject(response) : undefined
            );
          });
      }
    });
  },

  // _startReload() {
  //   if (this.props.reloadInterval && !this._interval) {
  //     this._interval = setInterval(
  //       () => this._load(this.props.onReload || this.props.onLoad, undefined, "reload"),
  //       this.props.reloadInterval
  //     );
  //   }
  // },

  // _stopReload() {
  //   this._interval && clearInterval(this._interval);
  //   this._interval = undefined;
  // },

  _getPromiseCallback(callback, data) {
    return () => {
      // this._startReload();
      typeof callback === "function" && callback(data);
    };
  },

  _getCreatedViewData(item, pessimistic, bulk = false) {
    let items = bulk ? item : [item];
    let state;
    if (pessimistic) {
      state = { viewState: bulk ? "bulkCreate" : "create", errorState: null, errorData: null };
    } else {
      state = state => {
        let pageInfo = state.pageInfo ? { ...state.pageInfo } : null;
        if (pageInfo && typeof pageInfo.total === "number") {
          pageInfo.total += items.length;
        }

        return { data: [...state.data, ...items], pageInfo, errorState: null, errorData: null };
      };
    }
    return state;
  },

  _getUpdatedViewData(identifier, item, pessimistic, bulk = false) {
    let identifiers = bulk ? identifier : [identifier];
    let items = bulk ? item : [item];
    let oldItems = identifiers.map(identifier => {
      return this.state.data.find(typeof identifier === "function" ? identifier : item => item.id === identifier);
    });
    let state;

    if (pessimistic) {
      state = { viewState: bulk ? "bulkUpdate" : "update", errorState: null, errorData: null };
    } else {
      state = state => {
        let data = [...state.data];
        let oldItems = identifiers.map(identifier => {
          return state.data.find(typeof identifier === "function" ? identifier : item => item.id === identifier);
        });
        let changed = false;
        oldItems.forEach((oldItem, i) => {
          let index = data.indexOf(oldItem);
          if (index > -1) {
            data.splice(index, 1, { ...oldItem, ...items[i] });
            changed = true;
          }
        });
        let newState = changed ? { data, errorState: null, errorData: null } : undefined;

        return newState;
      };
    }
    return [state, bulk ? oldItems : oldItems[0]];
  },

  _getDeletedViewData(identifier, pessimistic, bulk = false) {
    let identifiers = bulk ? identifier : [identifier];
    let oldItems = identifiers.map(identifier => {
      return this.state.data.find(typeof identifier === "function" ? identifier : item => item.id === identifier);
    });
    let indices = oldItems.map(oldItem => this.state.data.indexOf(oldItem));
    let state;

    if (pessimistic) {
      state = { viewState: bulk ? "bulkDelete" : "delete", errorState: null, errorData: null };
    } else {
      state = state => {
        let data = [...state.data];
        let deleteCount = 0;
        identifiers.forEach(identifier => {
          let index = data.findIndex(typeof identifier === "function" ? identifier : item => item.id === identifier);
          if (index > -1) {
            data.splice(index, 1);
            deleteCount++;
          }
        });

        let newState;
        if (deleteCount > 0) {
          let pageInfo = state.pageInfo ? { ...state.pageInfo } : null;
          if (pageInfo && typeof pageInfo.total === "number") {
            pageInfo.total -= deleteCount;
          }

          newState = { data, pageInfo, errorState: null, errorData: null };
        }

        return newState;
      };
    }
    return [state, bulk ? oldItems : oldItems[0], bulk ? indices : indices[0]];
  },

  _createServer(item, pessimistic, serverParams, resolve, reject, bulk = false) {
    let promise = this.props[bulk ? "onBulkCreate" : "onCreate"](item, serverParams);
    let items = bulk ? item : [item];

    promise.then(
      response => {
        // array or object for backward compatibility
        const dtoOut = Array.isArray(response)
          ? response
          : (response && typeof response === "object" && response.data) || response;
        if (this.isRendered()) {
          this.setState(
            // NOTE We're updating data even when optimistic because server can send us updated
            // information and especially server-generated "id" for the created item.
            state => {
              let pageInfo = state.pageInfo;
              let dtoOutItems = bulk ? dtoOut : [dtoOut];

              if (pessimistic) {
                pageInfo = state.pageInfo ? { ...state.pageInfo } : null;
                if (pageInfo && typeof pageInfo.total === "number") {
                  pageInfo.total += items.length;
                }
              }
              let data = [...state.data];
              dtoOutItems.forEach((dtoOutItem, i) => {
                let origItem = items[i];
                let index = data.indexOf(origItem);
                const newItem = { ...origItem, ...dtoOutItem };
                // optimistic?
                index > -1 ? (data[index] = newItem) : data.push(newItem);
              });

              return { viewState: "ready", errorState: null, errorData: null, data, pageInfo, response };
            },
            this._getPromiseCallback(resolve, response)
          );
        } else {
          resolve(response);
        }
      },
      response => {
        this.showError("serverUpdate", "creating", { context: { response } });
        if (this.isRendered()) {
          this.setState(state => {
            let newState = { viewState: "error", errorState: "create", errorData: response, response };
            if (!pessimistic) {
              // rollback optimistic changes
              let data = [...state.data];
              items.forEach(item => {
                let index = data.indexOf(item);
                data.splice(index, 1);
              });
              let pageInfo = state.pageInfo ? { ...state.pageInfo } : null;
              if (pageInfo && typeof pageInfo.total === "number") {
                pageInfo.total -= items.length;
              }
              newState.data = data;
              newState.pageInfo = pageInfo;
            }
            return newState;
          }, this._getPromiseCallback(reject, response));
        } else {
          reject(response);
        }
      }
    );
  },

  _getUpdateCall(key, bulk = false) {
    let call = bulk ? this.props.onBulkUpdate : this.props.onUpdate;
    if (call && call[key]) call = call[key];
    return call;
  },

  _updateServer(key, identifier, item, pessimistic, oldItem, serverParams, resolve, reject, bulk = false) {
    let call = this._getUpdateCall(key, bulk);
    let promise = call(identifier, item, serverParams);
    let identifiers = bulk ? identifier : [identifier];
    let oldItems = bulk ? oldItem : [oldItem];

    promise.then(
      response => {
        // array for backward compatibility
        const dtoOut = Array.isArray(response)
          ? response
          : (response && typeof response === "object" && response.data) || response;
        // NOTE We're updating data even when optimistic because server can send us updated
        // information.
        if (this.isRendered()) {
          this.setState(state => {
            let data = [...state.data];
            let oldModItems = identifiers.map(identifier => {
              return state.data.find(typeof identifier === "function" ? identifier : item => item.id === identifier);
            });
            let dtoOutItems = bulk ? dtoOut : [dtoOut];
            oldModItems.forEach((oldModItem, i) => {
              let index = data.indexOf(oldModItem);
              if (index > -1) data[index] = { ...oldItems[i], ...(dtoOutItems[i] || data[index]) };
            });
            return { viewState: "ready", errorState: null, errorData: null, data, response };
          }, this._getPromiseCallback(resolve, dtoOut));
        } else {
          resolve(dtoOut);
        }
      },
      response => {
        this.showError("serverUpdate", "updating", { context: { response } });
        if (this.isRendered()) {
          this.setState(state => {
            let newState = { viewState: "error", errorState: "update", errorData: response, response };
            if (!pessimistic) {
              // rollback optimistic changes
              let data = [...state.data];
              let oldModItems = identifiers.map(identifier => {
                return state.data.find(typeof identifier === "function" ? identifier : item => item.id === identifier);
              });
              oldModItems.forEach((oldModItem, i) => {
                let index = data.indexOf(oldModItem);
                if (index > -1) data.splice(index, 1, oldItems[i]);
              });
              newState.data = data;
            }
            return newState;
          }, this._getPromiseCallback(reject, response));
        } else {
          reject(response);
        }
      }
    );
  },

  _deleteServer(identifier, pessimistic, oldItem, index, serverParams, resolve, reject, bulk = false) {
    let promise = this.props[bulk ? "onBulkDelete" : "onDelete"](identifier, serverParams);
    let identifiers = bulk ? identifier : [identifier];
    let oldItems = bulk ? oldItem : [oldItem];
    let indices = bulk ? index : [index];

    if (pessimistic) {
      promise
        .then(response => {
          const dtoOut = response && typeof response === "object" ? response.data : undefined;
          this.isRendered() &&
          this.setState(state => {
            let data = [...state.data];
            let deleteCount = 0;
            let dtoOutItems = bulk ? dtoOut || [] : [dtoOut];
            identifiers.forEach((identifier, i) => {
              let index = data.findIndex(
                typeof identifier === "function" ? identifier : item => item.id === identifier
              );
              if (index > -1) {
                if (dtoOutItems[i] == null) {
                  data.splice(index, 1);
                  deleteCount++;
                } else {
                  data.splice(index, 1, { ...data[index], ...dtoOutItems[i] });
                }
              }
            });

            let pageInfo = state.pageInfo ? { ...state.pageInfo } : null;
            if (pageInfo && typeof pageInfo.total === "number") {
              pageInfo.total -= deleteCount;
            }

            return { viewState: "ready", errorState: null, errorData: null, data, pageInfo, response };
          }, this._getPromiseCallback(resolve, response));
        })
        .catch(response => {
          this.showError("serverUpdate", "deleting", { context: { response } });
          let newState = { viewState: "error", errorState: "delete", errorData: response, response };
          this.isRendered() && this.setState(newState, this._getPromiseCallback(reject, response));
        });
    } else {
      promise
        .then(response => {
          const dtoOut = response && typeof response === "object" ? response.data : undefined;
          let dtoOutItems = bulk ? dtoOut || [] : [dtoOut];
          this.isRendered() &&
          this.setState(state => {
            let data = [...state.data];
            let restoredCount = 0;
            let mergedOldSorted = oldItems.map((oldItem, i) => ({ oldItem, i, index: indices[i] }));
            mergedOldSorted.sort((a, b) => a.index - b.index);
            mergedOldSorted.forEach(({ oldItem, index, i }) => {
              // backward compatibility if dtoOut is undefined
              if (index > -1 && dtoOutItems[i] != null) {
                data.splice(index, 0, { ...oldItem, ...dtoOutItems[i] });
                restoredCount++;
              }
            });
            let pageInfo = state.pageInfo ? { ...state.pageInfo } : null;
            if (pageInfo && typeof pageInfo.total === "number") {
              pageInfo.total += restoredCount;
            }
            return { data, pageInfo, response };
          }, this._getPromiseCallback(resolve, response));
        })
        .catch(response => {
          this.showError("serverUpdate", "deleting", { context: { response } });
          let newState = { viewState: "error", errorState: "update", errorData: response, response };
          this.isRendered() &&
          this.setState(state => {
            let data = [...state.data];
            let restoredCount = 0;
            let mergedOldSorted = oldItems.map((oldItem, i) => ({ oldItem, index: indices[i] }));
            mergedOldSorted.sort((a, b) => a.index - b.index);
            mergedOldSorted.forEach(({ oldItem, index }) => {
              if (index > -1) {
                data.splice(index, 0, oldItem);
                restoredCount++;
              }
            });
            let pageInfo = state.pageInfo ? { ...state.pageInfo } : null;
            if (pageInfo && typeof pageInfo.total === "number") {
              pageInfo.total += restoredCount;
            }
            return { ...newState, data, pageInfo };
          }, this._getPromiseCallback(reject, response));
        });
    }
  },

  _getValues() {
    return {
      ...this.state,
      // clone
      data: this.state.data ? [...this.state.data] : null,
      pageInfo: this.state.pageInfo,
      handleLoad: this.load,
      handleReload: this.reload,
      handleCreate: this.create,
      handleUpdate: this.update,
      handleDelete: this.delete,
      handleBulkCreate: this.bulkCreate,
      handleBulkUpdate: this.bulkUpdate,
      handleBulkDelete: this.bulkDelete
    };
  },
  //@@viewOff:private

  //@@viewOn:render
  render() {
    return this.props.children(this._getValues());
  }
  //@@viewOff:render
});

ListDataManager.createContext = () => {
  let ListDataManagerContext = Context.create();

  const Provider = ({ children, ...props }) => (
    <ListDataManager {...props}>
      {values => <ListDataManagerContext.Provider value={values}>{children}</ListDataManagerContext.Provider>}
    </ListDataManager>
  );

  return { Provider, Consumer: ListDataManagerContext.Consumer, Context: ListDataManagerContext };
};

export default ListDataManager;
