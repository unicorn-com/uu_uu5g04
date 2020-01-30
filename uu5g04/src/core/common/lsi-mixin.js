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
import createReactClass from "create-react-class";
import Tools from "./tools.js";
import Environment from "../environment/environment.js";
import { LsiContext, withLsiContext } from "./context.js";

export const LsiMixin = {
  //@@viewOn:statics
  statics: {
    "UU5.Common.LsiMixin": {
      requiredMixins: ["UU5.Common.BaseMixin"],
      lsiEvent: Tools.events.lsi
    }
  },
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {
    language: PropTypes.string,
    registerLsi: PropTypes.func,
    unregisterLsi: PropTypes.func,
    setLanguage: PropTypes.func,
    getLanguage: PropTypes.func
  },
  //@@viewOff:propTypes

  //@@viewOn:getDefaultProps
  getDefaultProps() {
    return {
      language: null
    };
  },
  //@@viewOff:getDefaultProps

  //@@viewOn:reactLifeCycle
  getInitialState() {
    // initialize
    this.registerMixin("UU5.Common.LsiMixin");
    if (typeof this.props.registerLsi !== "function") {
      window.UU5.Environment.EventListener.registerLsi(this.getId(), this._changeLanguage);
    }
    // state
    return {
      language:
        this.props.language ||
        (typeof this.props.getLanguage === "function" && this.props.getLanguage()) ||
        Tools.getLanguages()[0].location ||
        Tools.getLanguages()[0].language
    };
  },

  componentDidMount() {
    if (typeof this.props.registerLsi === "function") {
      this.props.registerLsi(this.getId(), this._changeLanguage);
    }
  },

  componentWillUnmount() {
    if (typeof this.props.unregisterLsi === "function") {
      this.props.unregisterLsi(this.getId(), this._changeLanguage);
    } else {
      window.UU5.Environment.EventListener.unregisterLsi(this.getId(), this._changeLanguage);
    }
  },
  //@@viewOff:reactLifeCycle

  //@@viewOn:interface
  hasUU5CommonLsiMixin() {
    return this.hasMixin("UU5.Common.LsiMixin");
  },

  getUU5CommonLsiMixinProps() {
    return {
      language: this.props.language
    };
  },

  getUU5CommonLsiMixinPropsToPass() {
    return this.getUU5CommonLsiMixinProps();
  },

  getLanguages() {
    return Tools.getLanguages();
  },

  getLanguage() {
    return this.state.language;
  },
  //@@viewOff:interface

  //@@viewOn:overriding
  //@@viewOff:overriding

  //@@viewOn:private
  // TODO: 'cs-CZ,en;q=0.8...' is set to state and never will be used, necessary is doing setState and render the component
  _setLanguage(language, setStateCallback) {
    this.setState({ language: language }, setStateCallback);
    return this;
  },

  _changeLanguage(language) {
    // NOTE If a component has LsiMixin and it calls Tools.setLanguage() in its getInitialState, then
    // the flow will get here and the component has no state yet and it has actually no way to alter
    // its language in the state (it cannot call setState because its getInitialState didn't finish yet).
    // We will do nothing in this case.
    // (This started happening when language change listener registration got moved from componentDidMount
    // to getInitialState. However, end result in that flow had been exactly same - the component didn't
    // end up having intended language in its state, so this solution isn't worse than before.)
    if (this.state) {
      if (this.getLanguage() !== language) {
        if (typeof this.onChangeLanguage_ === "function") {
          this.onChangeLanguage_(language);
        } else {
          this.onChangeLanguageDefault(language);
        }
      }
    }
  },

  onChangeLanguageDefault(language) {
    this._setLanguage(language);
    return this;
  }
  //@@viewOff:private
};

LsiMixin.Context = LsiContext;

LsiMixin.withContext = withLsiContext;

export default LsiMixin;
