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
import BaseMixin from "./base-mixin.js";
import ContentMixin from "./content-mixin.js";
import { TextCorrectorContext, withTextCorrectorContext } from "./context.js";
import VisualComponent from "./visual-component.js";
//@@viewOff:imports

export const TextCorrector = withTextCorrectorContext(
  VisualComponent.create({
    displayName: "TextCorrector", // for backward compatibility (test snapshots)
    //@@viewOn:mixins
    mixins: [BaseMixin, ContentMixin],
    //@@viewOff:mixins

    //@@viewOn:statics
    statics: {
      tagName: "UU5.Common.TextCorrector"
    },
    //@@viewOff:statics

    //@@viewOn:propTypes
    propTypes: {
      checkGrammar: PropTypes.bool,
      checkHighlight: PropTypes.bool,
      checkSpaces: PropTypes.bool,
      textCorrector: PropTypes.bool,
      language: PropTypes.string
    },
    //@@viewOff:propTypes

    //@@viewOn:getDefaultProps
    getDefaultProps() {
      return {
        checkGrammar: undefined,
        checkHighlight: undefined,
        checkSpaces: undefined,
        textCorrector: undefined,
        language: null
      };
    },
    //@@viewOff:getDefaultProps

    //@@viewOn:reactLifeCycle
    //@@viewOff:reactLifeCycle

    //@@viewOn:interface
    //@@viewOff:interface

    //@@viewOn:overriding
    //@@viewOff:overriding

    //@@viewOn:private
    //@@viewOff:private

    //@@viewOn:render
    render() {
      return (
        <TextCorrectorContext.Provider
          value={{
            checkGrammar: this.props.checkGrammar !== undefined ? this.props.checkGrammar : this.props.textCorrector,
            checkHighlight:
              this.props.checkHighlight !== undefined ? this.props.checkHighlight : this.props.textCorrector,
            checkSpaces: this.props.checkSpaces !== undefined ? this.props.checkSpaces : this.props.textCorrector,
            language: this.props.language
          }}
        >
          {this.getChildren()}
        </TextCorrectorContext.Provider>
      );
    }
    //@@viewOff:render
  })
);

TextCorrector.withContext = withTextCorrectorContext;

export default TextCorrector;
