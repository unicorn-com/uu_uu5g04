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
//@@viewOff:imports

export const LsiContext = UU5.Common.VisualComponent.create({
  displayName: "LsiContext", // for backward compatibility (test snapshots)
  //@@viewOn:mixins
  mixins: [UU5.Common.BaseMixin, UU5.Common.ContentMixin],
  //@@viewOff:mixins

  //@@viewOn:statics
  statics: {
    tagName: ns.name("LsiContext"),
    classNames: {
      main: ns.css("lsi-context")
    }
  },
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {
    localLsi: UU5.PropTypes.bool
  },
  //@@viewOff:propTypes

  //@@viewOn:getDefaultProps
  getDefaultProps() {
    return {
      localLsi: false
    };
  },
  //@@viewOff:getDefaultProps

  //@@viewOn:reactLifeCycle
  getInitialState() {
    this._listeners = {};
    this._globalLanguage = UU5.Common.Tools.getLanguage();
    this._localLanguage = this._globalLanguage;
    return {
      providerValue: {
        setLanguage: this._setContextLanguage,
        getLanguage: this.getLanguage,
        registerLsi: this._registerLsi,
        unregisterLsi: this._unregisterLsi
      }
    };
  },

  componentDidMount: function() {
    window.UU5.Environment.EventListener.registerLsi(this.getId(), this._onChangeLanguage);
  },

  componentWillReceiveProps(nextProps) {
    if (this.props.localLsi !== nextProps.localLsi) {
      this._fireEvent(this._getContextLanguage(nextProps));
    }
  },

  componentWillUnmount() {
    window.UU5.Environment.EventListener.unregisterLsi(this.getId(), this._onChangeLanguage);
  },
  //@@viewOff:reactLifeCycle

  //@@viewOn:interface
  setLanguage(language) {
    this._setLocalLanguage(language);
  },

  getLanguage() {
    return this._getContextLanguage();
  },

  registerLsi(id, listener) {
    if (typeof listener === "function") {
      this._registerLsi(id, listener);
    } else {
      UU5.Common.Tools.error("Listener in registerLsi parameter is not a function.", {
        component: "UU5.Bricks.LsiContext",
        id: this.getId(),
        function: "registerLsi"
      });
    }
  },

  unregisterLsi(id) {
    this._unregisterLsi(id);
  },
  //@@viewOff:interface

  //@@viewOn:overriding
  //@@viewOff:overriding

  //@@viewOn:private
  _registerLsi(id, listener) {
    this._listeners[id] = listener;
  },

  _unregisterLsi(id) {
    delete this._listeners[id];
  },

  _onChangeLanguage(language) {
    this._setGlobalLanguage(language);
    if (!this.props.localLsi) {
      this._setLocalLanguage(language);
    }
  },

  _getContextLanguage(props = this.props) {
    if (props.localLsi) {
      return this._localLanguage;
    }
    return this._globalLanguage;
  },

  _setContextLanguage(language) {
    if (this.props.localLsi) {
      this._setLocalLanguage(language);
    } else {
      // cause _onChangeLanguage
      UU5.Common.Tools.setLanguage(language);
    }
  },

  _setLocalLanguage(language) {
    this._localLanguage = language;
    if (this.props.localLsi) {
      this._fireEvent(language);
    }
  },

  _setGlobalLanguage(language) {
    this._globalLanguage = language;
    if (!this.props.localLsi) {
      this._fireEvent(language);
    }
  },

  _fireEvent(language) {
    for (let i in this._listeners) {
      this._listeners[i](language);
    }
  },
  //@@viewOff:private

  //@@viewOn:render
  render() {
    return (
      <UU5.Common.LsiMixin.Context.Provider value={this.state.providerValue}>
        {this.getChildren()}
      </UU5.Common.LsiMixin.Context.Provider>
    );
  }
  //@@viewOff:render
});

export default LsiContext;
