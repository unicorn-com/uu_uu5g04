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
import Error from "./error.js";
import Tools from "./tools.js";
import Environment from "../environment/environment.js";

export const VucMixin = {
  //@@viewOn:mixins
  mixins: [],
  //@@viewOff:mixins

  //@@viewOn:statics
  statics: {
    "UU5.Common.VucMixin": {
      requiredMixins: ["UU5.Common.BaseMixin"],
      calls: {
        authorizeVuc: "authorizeVuc"
      },
      errors: {
        sysAuthorizeVuc: "Error of VUC %s during connection to server.",
        notErrorRoute: "Error route was not set either in props or in Environment.",
        notCall: "Call %s was not found either in props or in Environment."
      },
      lsi: () => Environment.Lsi.Common.vucMixin
    }
  },
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {
    authorized: PropTypes.bool,
    calls: PropTypes.object,
    errorRoute: PropTypes.oneOfType([
      PropTypes.string, // path
      PropTypes.element,
      PropTypes.shape({
        tag: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
        props: PropTypes.object
      })
    ]),
    params: PropTypes.object
  },
  //@@viewOff:propTypes

  //@@viewOn:getDefaultProps
  getDefaultProps() {
    return {
      authorized: true,
      calls: null,
      errorRoute: null,
      params: null
    };
  },
  //@@viewOff:getDefaultProps

  //@@viewOn:reactLifeCycle
  getInitialState() {
    // initialize
    this.registerMixin("UU5.Common.VucMixin");
    this.constructor.vucTitle && this.setTitle();

    return {
      authorizedFeedback: this.props.authorized ? "loading" : "ready",
      profiles: null
    };
  },

  componentDidMount() {
    this.constructor.vucTitle && window.UU5.Environment.EventListener.registerLsi(this.getId(), () => this.setTitle());
    this.props.authorized && this._checkAuthorizing();
  },

  componentWillUnmount: function() {
    this._unmounted = true;
    this.constructor.vucTitle && window.UU5.Environment.EventListener.unregisterLsi(this.getId());
  },
  //@@viewOff:reactLifeCycle

  //@@viewOn:interface
  hasUU5CommonVucMixin: function() {
    return this.hasMixin("UU5.Common.VucMixin");
  },

  getUU5CommonVucMixinProps: function() {
    return {
      // profiles: this.props.profiles
    };
  },

  getUU5CommonVucMixinPropsToPass: function() {
    return this.getUU5CommonVucMixinProps();
  },

  getProfiles() {
    return this.state.profiles;
  },

  isReady() {
    return this.state.authorizedFeedback == "ready";
  },

  isLoading() {
    return this.state.authorizedFeedback == "loading";
  },

  isError() {
    return this.state.authorizedFeedback == "error";
  },

  getVucChildren(getChildren) {
    let result;

    switch (this.state.authorizedFeedback) {
      case "loading":
        result = Tools.findComponent("UU5.Bricks.Loading");
        break;
      case "ready":
        result = getChildren(this.state.profiles);
        break;
      case "error":
        result = <Error>{Tools.findComponent("UU5.Bricks.Lsi", { lsi: this.state.message })}</Error>;
        break;
    }

    return result;
  },

  checkAuthorizing() {
    this._checkAuthorizing();
    return this;
  },

  setTitle(title) {
    title = title || this.constructor.vucTitle;

    if (title) {
      if (typeof title === "object") {
        title = Tools.getLsiItemByLanguage(title);
      }

      document.title = title;
    }

    return this;
  },
  //@@viewOff:interface

  //@@viewOn:overriding
  //@@viewOff:overriding

  //@@viewOn:private
  _getAuthorizeVucCall() {
    let call;

    if (this.props.calls) {
      call = this.props.calls[this.getCallName().authorizeVuc];
    } else if (Environment.App && Environment.App.callConfig && Environment.App.callConfig.authorizeVuc) {
      call = Environment.App.callConfig.authorizeVuc;
    }

    return call;
  },

  _checkAuthorizing() {
    let call = this._getAuthorizeVucCall();

    if (call) {
      // data = {}
      let data = { name: this.constructor.vucName };

      call({
        data: data,
        // dtoOut = {profiles: ['..', '..', ...], status: 'ok | error'}
        done: dtoOut => {
          if (!this._unmounted) {
            if (dtoOut.data.status === "error") {
              let errorRoute = this.props.errorRoute;
              if (!errorRoute) {
                if (Environment.App && Environment.App.vucConfig && Environment.App.vucConfig.errorRoute) {
                  errorRoute = Environment.App.vucConfig.errorRoute;
                } else {
                  this.showError("notErrorRoute", null, {
                    mixinName: "UU5.Common.VucMixin",
                    context: { environment: Environment }
                  });
                }
              }
              if (errorRoute) {
                Environment.setRoute(errorRoute);
              } else {
                this.setState({
                  authorizedFeedback: "error",
                  message: this.getLsi("notAuthorized", "UU5.Common.VucMixin")
                });
              }
            } else {
              this.setState({ authorizedFeedback: "ready", profiles: dtoOut.data.profiles || null });
            }
          }
        },
        fail: dtoOut => {
          if (!this._unmounted) {
            this.showError("sysAuthorizeVuc", this.constructor.vucName || window.location.pathname, {
              mixinName: "UU5.Common.VucMixin",
              context: { dtoOut: dtoOut }
            });
            this.setState({
              authorizedFeedback: "error",
              profiles: (dtoOut.data && dtoOut.data.profiles) || null,
              message: this.getLsi("serverConnection", "UU5.Common.VucMixin")
            });
          }
        }
      });
    } else {
      this.showError("notCall", this.getCall().authorizeVuc, {
        mixinName: "UU5.Common.VucMixin",
        context: { environment: Environment }
      });
    }
  }
  //@@viewOff:private

  //@@viewOn:render
  //@@viewOff:render
};

export default VucMixin;
