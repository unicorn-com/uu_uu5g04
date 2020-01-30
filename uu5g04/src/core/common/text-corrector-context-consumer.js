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
import ns from "./common-ns.js";
import PropTypes from "prop-types";
import BaseMixin from "./base-mixin.js";
import ElementaryMixin from "./elementary-mixin.js";
import Tools from "./tools.js";
import Environment from "../environment/environment.js";
import PureRenderMixin from "./pure-render-mixin.js";
import { withTextCorrectorContext } from "./context.js";
import VisualComponent from "./visual-component.js";

import "./text-corrector.less";
//@@viewOff:imports

export const TextCorrectorContextConsumer = withTextCorrectorContext(props => {
  if (props.checkGrammar || props.checkHighlight || props.checkSpaces || Environment.textCorrector) {
    let extendedProps = Tools.merge(props);
    if (Environment.textCorrector) {
      extendedProps.checkGrammar = extendedProps.checkGrammar !== undefined ? extendedProps.checkGrammar : true;
      extendedProps.checkHighlight = extendedProps.checkHighlight !== undefined ? extendedProps.checkHighlight : true;
      extendedProps.checkSpaces = extendedProps.checkSpaces !== undefined ? extendedProps.checkSpaces : true;
    }
    return <TextCorrectorComponent {...extendedProps} />;
  }

  return props.text;
});

TextCorrectorContextConsumer.isUu5PureComponent = true;
TextCorrectorContextConsumer.displayName = ns.name("TextCorrectorContextConsumer");
TextCorrectorContextConsumer.isStateless = true;

export const TextCorrectorComponent = VisualComponent.create({
  displayName: "TextCorrectorComponent", // for backward compatibility (test snapshots)
  //@@viewOn:mixins
  mixins: [BaseMixin, ElementaryMixin, PureRenderMixin],
  //@@viewOff:mixins

  //@@viewOn:statics
  statics: {
    tagName: ns.name("TextCorrectorComponent"),
    classNames: {
      main: ns.css("text-corrector"),
      error: ns.css("text-corrector-error"),
      highlight: ns.css("text-corrector-highlight")
    },
    defaults: {
      highlightEvent: Tools.events.highlight
    }
  },
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {
    text: PropTypes.string,
    language: PropTypes.string,
    checkSpaces: PropTypes.bool,
    checkGrammar: PropTypes.bool,
    checkHighlight: PropTypes.bool
  },
  //@@viewOff:propTypes

  //@@viewOn:getDefaultProps
  getDefaultProps() {
    return {
      text: "",
      language: null,
      checkSpaces: false,
      checkGrammar: false,
      checkHighlight: false
    };
  },
  //@@viewOff:getDefaultProps

  //@@viewOn:reactLifeCycle
  getInitialState() {
    return {
      text: this._correctSpaces(this.props, this.props.text)
    };
  },

  componentDidMount() {
    this._switchHighlight(true);
    this._correctText(this.props, this.state.text, null, true);
  },

  componentWillReceiveProps(nextProps) {
    this._correctText(nextProps, nextProps.text);
  },

  componentWillUnmount() {
    this._switchHighlight(false);
  },
  //@@viewOff:reactLifeCycle

  //@@viewOn:interface
  //@@viewOff:interface

  //@@viewOn:overriding
  //@@viewOff:overriding

  //@@viewOn:private
  _correctSpaces(props, text) {
    let newText = text;
    if (props.checkSpaces) {
      newText = this.replaceByHardSpace(text, props.language);
    }
    return newText;
  },

  _isValidWord(word) {
    let result = true;

    let text = /[A-Za-z]+/i.exec(word);
    if (text) {
      result = text[0].toLowerCase() !== "vidra";
    }

    return result;
  },

  _isHighlightWord(word, searchedText) {
    return word.toLowerCase().indexOf(searchedText) > -1;
  },

  _checkWords(props, text, searchedTexts) {
    let newTextChildren = [];
    let spaceTmp = [];

    let spaceSplitter = text.split(" ");
    spaceSplitter.forEach(word => {
      if (word.indexOf(Environment.hardSpace.nbSpace) > -1) {
        let nbspSplitter = word.split(Environment.hardSpace.nbSpace);
        let nbspTmp = [];

        nbspSplitter.forEach(word => {
          let newWord = this._checkWord(props, word, searchedTexts);
          if (typeof newWord === "string") {
            nbspTmp.push(newWord);
          } else {
            if (nbspTmp.length) {
              spaceTmp.push(nbspTmp.join(Environment.hardSpace.nbSpace));
              nbspTmp = [];
            }

            if (spaceTmp.length) {
              newTextChildren.push(
                (newTextChildren.length ? " " : "") + spaceTmp.join(" ") + Environment.hardSpace.nbSpace
              );
              spaceTmp = [];
            }

            typeof newTextChildren[newTextChildren.length - 1] !== "string" &&
              newTextChildren.push(Environment.hardSpace.nbSpace);
            newTextChildren.push(newWord);
          }
        });

        if (nbspTmp.length) {
          spaceTmp.push(nbspTmp.join(Environment.hardSpace.nbSpace));
          nbspTmp = [];
        }
      } else {
        let newWord = this._checkWord(props, word, searchedTexts);

        if (typeof newWord === "string") {
          spaceTmp.push(newWord);
        } else {
          if (spaceTmp.length) {
            newTextChildren.push((newTextChildren.length ? " " : "") + spaceTmp.join(" ") + " ");
            spaceTmp = [];
          }
          typeof newTextChildren[newTextChildren.length - 1] === "object" && newTextChildren.push(" ");
          newTextChildren.push(newWord);
        }
      }
    });

    if (spaceTmp.length) {
      newTextChildren.push((newTextChildren.length ? " " : "") + spaceTmp.join(" "));
      spaceTmp = [];
    }

    return React.Children.toArray(newTextChildren);
  },

  _checkWord(props, word, searchedTexts) {
    let result = word;

    if (props.checkHighlight && searchedTexts) {
      let searchedText = this._getSearchedText(word, searchedTexts);
      if (searchedText) {
        // full word
        // result = <span className={this.getClassName().highlight}>{word}</span>;

        let startIndex = word.toLowerCase().indexOf(searchedText.toLowerCase());
        let endIndex = startIndex + searchedText.length - 1;
        let searchedPart = word.substr(startIndex, searchedText.length);
        result = [];

        let highlighter = <span className={this.getClassName().highlight}>{searchedPart}</span>;

        if (startIndex > 0) {
          result.push(word.substr(0, endIndex + 1 - searchedPart.length));
        }

        result.push(highlighter);

        if (endIndex < word.length - 1) {
          result.push(word.substr(endIndex + 1, word.length - endIndex - 1));
        }
      }
    }

    if (props.checkGrammar && !this._isValidWord(word)) {
      result = (
        <span className={this.getClassName().error}>
          {Array.isArray(result) ? React.Children.toArray(result) : result}
        </span>
      );
    }

    return result;
  },

  _correctText(props, text, searchedTexts, isDidMount) {
    let newText = text;
    if (!isDidMount && props.checkSpaces) {
      newText = this._correctSpaces(props, text);
    }

    if (props.checkGrammar || (props.checkHighlight && searchedTexts)) {
      newText = this._checkWords(props, newText || text, searchedTexts);
    }

    if (!isDidMount || text !== newText) {
      this.setState({ text: newText, searchedTexts: searchedTexts });
    }

    return this;
  },

  _switchHighlight(start) {
    if (this.props.checkHighlight) {
      if (start) {
        window.UU5.Environment.EventListener.registerHighlight(this.getId(), this._checkHighlight);
      } else {
        window.UU5.Environment.EventListener.unregisterHighlight(this.getId(), this._checkHighlight);
      }
    }
    return this;
  },

  _getSearchedText(text, searchedTexts) {
    let result = null;
    text = text.toLowerCase();
    for (let i = 0; i < searchedTexts.length; i++) {
      if (text.indexOf(searchedTexts[i].toLowerCase()) > -1) {
        result = searchedTexts[i];
        break;
      }
    }
    return result;
  },

  _checkHighlight(searchedTexts) {
    if (searchedTexts && searchedTexts.length > 0) {
      searchedTexts = Array.isArray(searchedTexts) ? searchedTexts : [searchedTexts];
    } else {
      searchedTexts = null;
    }

    if (!searchedTexts || this.state.searchedTexts || this._getSearchedText(this.props.text, searchedTexts)) {
      this._correctText(this.props, this.props.text, searchedTexts);
    }

    return this;
  },
  //@@viewOff:private

  //@@viewOn:render
  render() {
    return this.state.text;
  }
  //@@viewOff:render
});

export default TextCorrectorContextConsumer;
