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

import React from "react";
import PropTypes from "prop-types";
import CallsMixin from "./calls-mixin.js";
import Error from "./error.js";
import Tools from "./tools.js";
import Environment from "../environment/environment.js";

export const LoadMixin = {
  //@@viewOn:mixins
  mixins: [CallsMixin],
  //@@viewOff:mixins

  //@@viewOn:statics
  statics: {
    "UU5.Common.LoadMixin": {
      defaults: {
        minReloadInterval: 10 * 1000, // 10s
        onLoadCall: "onLoad",
        onReloadCall: "onReload"
      },
      errors: {
        onLoad: "Error during loading data from server by call %s.",
        onReload: "Error during reloading data from server by call %s."
      },
      lsi: () => Environment.Lsi.Common.loadMixin
    }
  }, //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {
    uri: PropTypes.string,
    dtoOut: PropTypes.object,
    reloadInterval: PropTypes.number,
    refireLoad: PropTypes.bool,
    overrideMinReloadInterval: PropTypes.bool
  },
  //@@viewOff:propTypes

  //@@viewOn:getDefaultProps
  getDefaultProps() {
    return {
      uri: null,
      dtoOut: null,
      reloadInterval: 0,
      refireLoad: true,
      overrideMinReloadInterval: false
    };
  },
  //@@viewOff:getDefaultProps

  //@@viewOn:reactLifeCycle
  getInitialState() {
    // initialize
    this.registerMixin("UU5.Common.LoadMixin");
    this._lastLoadOrReloadTime = null;
    this._pageVisible = Environment.isPageVisible();
    // state
    return {
      loadFeedback: "loading",
      dtoOut: null,
      errorDtoOut: null
    };
  },

  componentWillMount() {
    if (this.props.dtoOut) {
      if (typeof this.onLoadSuccess_ === "function") {
        this.onLoadSuccess_(this.props.dtoOut);
      } else {
        this.onLoadSuccessDefault(this.props.dtoOut);
      }
    }
  },

  componentDidMount() {
    Environment.EventListener.registerPageVisibility(this.getId(), this._onPageVisibilityChange);
    if (!this.props.dtoOut) {
      this.setState(
        {
          loadFeedback: "loading",
          dtoOut: null,
          errorDtoOut: null
        },
        () => this._onLoad(this.props)
      );
    }
  },

  componentWillReceiveProps(nextProps) {
    if (nextProps.controlled && nextProps.refireLoad) {
      this._onLoad(nextProps);
    }
  },

  componentWillUnmount() {
    this._unregisterReloading();
    Environment.EventListener.unregisterPageVisibility(this.getId());
  },
  //@@viewOff:reactLifeCycle

  //@@viewOn:interface
  getUri() {
    return this.props.uri;
  },

  getDtoOut() {
    return this.state.dtoOut;
  },

  getErrorData() {
    return this.state.errorDtoOut;
  },

  getLoadFeedback() {
    return this.state.loadFeedback;
  },

  isLoading() {
    return this.getLoadFeedback() === "loading";
  },

  isReady() {
    return this.getLoadFeedback() === "ready";
  },

  isError() {
    return this.getLoadFeedback() === "error";
  },

  onLoadSuccess(dtoOut, setStateCallback) {
    this._lastLoadOrReloadTime = Date.now();
    this.setAsyncState({ loadFeedback: "ready", dtoOut: dtoOut, errorDtoOut: null }, () => {
      if (setStateCallback) return setStateCallback.apply(this, arguments);
    });
    return this;
  },

  onReloadSuccess(dtoOut, setStateCallback) {
    this._lastLoadOrReloadTime = Date.now();
    this.setAsyncState({ loadFeedback: "ready", dtoOut: dtoOut, errorDtoOut: null }, setStateCallback);
    return this;
  },

  onLoadError(dtoOut, setStateCallback) {
    this._lastLoadOrReloadTime = Date.now();
    this.setAsyncState({ loadFeedback: "error", errorDtoOut: dtoOut }, setStateCallback);
    return this;
  },

  onReloadError(dtoOut, setStateCallback) {
    this._lastLoadOrReloadTime = Date.now();
    this.onLoadError(dtoOut, setStateCallback);
    return this;
  },

  getLoadFeedbackChildren(getChildren) {
    let children;

    switch (this.getLoadFeedback()) {
      case "loading":
        children = Tools.findComponent("UU5.Bricks.Loading");
        break;
      case "ready":
        children = getChildren(this.getDtoOut());
        break;
      case "error":
        children = <Error>{this.getLsiComponent("error", "UU5.Common.LoadMixin")}</Error>;
        break;
    }

    return children;
  },

  reload(callName, dtoIn) {
    this.setState({ loadFeedback: "loading" }, () => {
      this.forceReload(callName, dtoIn);
    });

    return this;
  },

  forceReload(callName, dtoIn) {
    let reloadCall = (callName && this.getCall(callName)) || this._getOnReloadCall();
    if (reloadCall) {
      let reloadDtoIn = dtoIn || this._getReloadDtoIn(this.props);
      reloadCall(reloadDtoIn);
    }
  },
  //@@viewOff:interface

  //@@viewOn:private
  _getOnLoadCall() {
    return this.getCall(this.getDefault("onLoadCall", "UU5.Common.LoadMixin"));
  },

  _getOnReloadCall() {
    let result;

    let callNames = this.constructor.calls;
    if (callNames) {
      let callName = callNames[this.getDefault("onReloadCall", "UU5.Common.LoadMixin")];

      if (callName) {
        result = this.getCalls()[callName];
      } else {
        result = this._getOnLoadCall();
      }
    } else {
      result = this._getOnLoadCall();
    }

    return result;
  },

  _getLoadDtoIn(props) {
    props = props || this.props;

    let dtoIn = {};

    if (props.uri) {
      dtoIn.uri = props.uri;
    }

    if (typeof this.getOnLoadData_ === "function") {
      dtoIn.data = this.getOnLoadData_(props);
    }

    dtoIn.done = dtoOut => {
      if (typeof this.onLoadSuccess_ === "function") {
        this.onLoadSuccess_(dtoOut);
      } else {
        this.onLoadSuccessDefault(dtoOut);
      }
      this._scrollToFragment();
    };

    let callKey = this.getDefault("onLoadCall", "UU5.Common.LoadMixin");
    dtoIn.fail = dtoOut => {
      this.showError("onLoad", this.getCallName(callKey), {
        mixinName: "UU5.Common.LoadMixin",
        context: {
          calls: this.getCalls(),
          dtoOut: dtoOut,
          callKey: callKey,
          uri: dtoIn.uri,
          data: dtoIn.data
        }
      });
      if (typeof this.onLoadError_ === "function") {
        this.onLoadError_(dtoOut);
      } else {
        this.onLoadErrorDefault(dtoOut);
      }
    };

    return dtoIn;
  },

  onLoadSuccessDefault(dtoOut) {
    this.onLoadSuccess(dtoOut);
    return this;
  },

  onLoadErrorDefault(dtoOut) {
    this.onLoadError(dtoOut);
    return this;
  },

  _getReloadDtoIn(props) {
    props = props || this.props;
    let dtoIn = {};

    if (props.uri) {
      dtoIn.uri = props.uri;
    }

    let getData = this.getOnReloadData_ || this.getOnLoadData_;
    if (typeof getData === "function") {
      dtoIn.data = getData(props);
    }

    dtoIn.done = dtoOut => {
      let loadSuccess = this.onReloadSuccess_ || this.onLoadSuccess_;
      if (typeof loadSuccess === "function") {
        loadSuccess(dtoOut);
      } else {
        this.onReloadSuccess(dtoOut);
      }
      this._scrollToFragment();
    };

    let calls = this.constructor.calls;
    let callKey = this.getDefault("onReloadCall", "UU5.Common.LoadMixin");
    calls && !calls[callKey] && (callKey = this.getDefault("onLoadCall", "UU5.Common.LoadMixin"));

    dtoIn.fail = dtoOut => {
      this.showError("onReload", this.getCallName(callKey), {
        mixinName: "UU5.Common.LoadMixin",
        context: {
          calls: this.getCalls(),
          dtoOut: dtoOut,
          callKey: callKey,
          uri: dtoIn.uri,
          data: dtoIn.data
        }
      });

      let loadError = this.onReloadError_ || this.onLoadError_;
      if (typeof loadError === "function") {
        loadError(dtoOut);
      } else {
        this.onReloadError(dtoOut);
      }
    };

    return dtoIn;
  },

  _onLoad(props) {
    let loadCall = this._getOnLoadCall();

    if (loadCall) {
      this._unregisterReloading();

      let dtoIn = this._getLoadDtoIn(props);
      loadCall(dtoIn);
      if (this._pageVisible && this._isReloadable()) {
        this._registerReloading(false, this._getUsedReloadCall(loadCall));
      }
    }

    return this;
  },

  _isReloadable() {
    return Boolean(this._getUsedReloadInterval());
  },
  _getUsedReloadInterval() {
    let value = this.props.reloadInterval || this.getOpt("reloadInterval");
    if (value && !this.props.overrideMinReloadInterval)
      value = Math.max(value, this.getDefault("minReloadInterval", "UU5.Common.LoadMixin"));
    return value;
  },
  _getUsedReloadCall(loadCall) {
    return this._getOnReloadCall() || loadCall || this._getOnLoadCall();
  },

  _registerReloading(execReloadFirst = false, reloadCall = this._getUsedReloadCall()) {
    if (reloadCall) {
      let execReloadFn = () => {
        let reloadDtoIn = this._getReloadDtoIn(this.props);
        reloadCall(reloadDtoIn);
      };
      if (execReloadFirst) execReloadFn();
      this._reloadInterval = setInterval(execReloadFn, this._getUsedReloadInterval());
    }
  },
  _unregisterReloading() {
    this._reloadInterval && clearInterval(this._reloadInterval);
    this._reloadInterval = null;
    this._resumeReloadingTimeout && clearTimeout(this._resumeReloadingTimeout);
    this._resumeReloadingTimeout = null;
  },
  _onPageVisibilityChange({ visible, focus }) {
    if (this._pageVisible !== visible) {
      this._pageVisible = visible;
      if (visible) {
        // became visible => plan "reload" with respect to the last (re)load time
        if (this._isReloadable()) {
          let delay = Math.max(
            0,
            this._getUsedReloadInterval() - (this._lastLoadOrReloadTime ? Date.now() - this._lastLoadOrReloadTime : 0)
          );
          this._resumeReloadingTimeout = setTimeout(() => this._registerReloading(true), delay);
        }
      } else {
        // became hidden => cancel "reload" plan
        this._unregisterReloading();
      }
    }
  },
  _scrollToFragment() {
    Promise.resolve().then(() => {
      let router = Environment.getRouter();
      if (router) router.scrollToFragment();
    });
  }
  //@@viewOff:private
};

export default LoadMixin;
