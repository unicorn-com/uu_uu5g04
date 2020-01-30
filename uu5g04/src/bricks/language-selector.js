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
import Dropdown from "./dropdown.js";
import DropdownItem from "./dropdown-item.js";

import Span from "./span.js";
import Button from "./button.js";

import "./language-selector.less";
//@@viewOff:imports

export const LanguageSelector = UU5.Common.LsiMixin.withContext(
  UU5.Common.VisualComponent.create({
    displayName: "LanguageSelector", // for backward compatibility (test snapshots)
    //@@viewOn:mixins
    mixins: [
      UU5.Common.BaseMixin,
      UU5.Common.PureRenderMixin,
      UU5.Common.ElementaryMixin,
      UU5.Common.ScreenSizeMixin,
      UU5.Common.LsiMixin,
      UU5.Common.NestingLevelMixin,
      UU5.Common.ColorSchemaMixin
    ],
    //@@viewOff:mixins

    //@@viewOn:statics
    statics: {
      tagName: ns.name("LanguageSelector"),
      nestingLevelList: UU5.Environment.getNestingLevelList("box", "inline"),
      classNames: {
        main: ns.css("language-selector"),
        left: ns.css("language-selector-left"),
        flag: ns.css("language-selector-flag"),
        text: ns.css("language-selector-text"),
        label: ns.css("language-selector-label"),
        code: ns.css("language-selector-code"),
        codeText: ns.css("language-selector-code-text"),
        labelCodeText: ns.css("language-selector-label-code-text"),
        selected: ns.css("language-selector-selected"),
        modalButton: ns.css("language-selector-modal-button"),
        button: ns.css("language-selector-button"),
        spaceBetween: ns.css("language-selector-space-between")
      },
      defaults: {
        regexpSpace: / /g
      }
    },
    //@@viewOff:statics

    //@@viewOn:propTypes
    propTypes: {
      headerMode: UU5.PropTypes.oneOf(["all", "flag", "label", "code"]),
      bodyMode: UU5.PropTypes.oneOf(["all", "flag", "label", "label-code"]),
      displayedLanguages: UU5.PropTypes.oneOfType([UU5.PropTypes.arrayOf(UU5.PropTypes.string), UU5.PropTypes.string]),
      languages: UU5.PropTypes.shape({
        languageCode: UU5.PropTypes.shape({
          flag: UU5.PropTypes.string,
          language: UU5.PropTypes.string
        })
      }),
      defaultLanguage: UU5.PropTypes.string,
      size: UU5.PropTypes.string,
      bgStyle: UU5.PropTypes.oneOf(["filled", "outline", "transparent", "underline"]),
      pullRight: UU5.PropTypes.bool,
      dropup: UU5.PropTypes.bool,
      borderRadius: UU5.PropTypes.string,
      elevation: UU5.PropTypes.oneOf(["-1", "0", "1", "2", "3", "4", "5", -1, 0, 1, 2, 3, 4, 5]),
      elevationHover: UU5.PropTypes.oneOf(["-1", "0", "1", "2", "3", "4", "5", -1, 0, 1, 2, 3, 4, 5]),
      baseline: UU5.PropTypes.bool
    },
    //@@viewOff:propTypes

    //@@viewOn:getDefaultProps
    getDefaultProps() {
      return {
        languages: null,
        headerMode: "all",
        bodyMode: "all",
        displayedLanguages: null,
        defaultLanguage: null,
        size: "m",
        bgStyle: "transparent",
        pullRight: false,
        dropup: false,
        borderRadius: null,
        elevation: null,
        elevationHover: null,
        baseline: false
      };
    },
    //@@viewOff:getDefaultProps

    //@@viewOn:reactLifeCycle
    getInitialState() {
      return {
        languages: this._getFilteredLanguages(this.props)
      };
    },

    componentWillMount() {
      if (!this.state.languages[this.state.language]) {
        let newLang = UU5.Common.Tools.getLsiKey(
          this.state.languages,
          null,
          this.state.language,
          this.props.defaultLanguage
        );
        this.setState({ language: newLang });
      }
    },

    componentWillReceiveProps(nextProps) {
      if (nextProps.controlled) {
        this.setState(state => {
          let newLanguage = state.language;
          let languages =
            typeof nextProps.displayedLanguages === "string"
              ? nextProps.displayedLanguages.replace(this.getDefault().regexpSpace, "").split(",")
              : nextProps.displayedLanguages;
          if (languages && languages.indexOf(newLanguage) === -1) {
            newLanguage = languages[0];
          }
          return {
            language: newLanguage,
            languages: this._getFilteredLanguages(nextProps)
          };
        });
      }
    },
    //@@viewOff:reactLifeCycle

    //@@viewOn:interface
    //@@viewOff:interface

    //@@viewOn:overriding
    onChangeLanguage_(language) {
      if (this.state.languages[language]) {
        this.setState({ language: language });
      }
      return this;
    },
    //@@viewOff:overriding

    //@@viewOn:private
    _getFilteredLanguages(props) {
      let languages = props.languages || UU5.Environment.languageList;
      let result;
      if (props.displayedLanguages) {
        let displayedLanguages =
          typeof props.displayedLanguages === "string"
            ? props.displayedLanguages.replace(this.getDefault().regexpSpace, "").split(",")
            : props.displayedLanguages;

        result = result || {};
        let languagesCodes = Object.keys(languages);
        displayedLanguages.forEach(key => {
          if (languagesCodes.indexOf(key) > -1) {
            result[key] = languages[key];
          }
        });
      }
      return result || languages;
    },

    _getFlag(language) {
      return <img src={this.state.languages[language].flag} className={this.getClassName().flag} />;
    },

    _getLabel(languageDescription) {
      return <Span content={languageDescription} className={this.getClassName().label} />;
    },

    _getCode(languageCode) {
      return <Span content={languageCode} className={this.getClassName("codeText")} />;
    },

    _getLabelCode(languageCode, languageDescription) {
      return (
        <Span>
          <Span content={languageDescription} className={this.getClassName("label")} />
          <Span content={languageCode} className={this.getClassName("labelCodeText")} />
        </Span>
      );
    },

    _getItemContent(language, languageDescription) {
      return [this._getFlag(language), <Span content={languageDescription} className={this.getClassName().text} />];
    },

    _getItems(language = this.state.language, languages = this.state.languages) {
      let this_ = this;
      let items = [];
      let className;
      if (this.props.bodyMode === "all") className = this.getClassName("left");
      else if (this.props.bodyMode === "label-code") className = this.getClassName("code");

      Object.keys(languages).forEach((key, i) => {
        let cls = className;
        if (key === language) {
          cls = cls ? cls + " " + this.getClassName("selected") : this.getClassName("selected");
        }
        items.push(
          <DropdownItem
            label={this_._getModalItem(key)}
            key={i}
            className={cls}
            onClick={() => {
              this_._setGlobalLanguage(key);
            }}
          />
        );
      });
      return items;
    },

    // _openModal() {
    //   this.modal.open({ content: this._getModalContent(this.state.language) });
    //   return this;
    // },

    _setGlobalLanguage(language) {
      if (typeof this.props.setLanguage === "function") {
        this.props.setLanguage(language);
      } else {
        UU5.Common.Tools.setLanguage(language);
      }
      this.modal && this.modal.close();
    },

    // _getModalContent(language) {
    //   var content = [];
    //   var this_ = this;
    //   let className = this.getClassName().modalButton;
    //   if (this.props.bodyMode === 'all' || this.props.bodyMode === 'label-code') {
    //     className += ' ' + this.getClassName().spaceBetween;
    //   }
    //   Object.keys(this.state.languages).forEach((key, i) => {
    //     content.push(
    //       <Button content={
    //         this_._getModalItem(key)
    //       }
    //               key={i}
    //               onClick={() => {
    //                 this_._setGlobalLanguage(key)
    //               }}
    //               className={className}
    //               selected={this_.state.language === key}
    //               displayBlock
    //               bgStyle={this.props.bgStyle || 'transparent'}
    //       />
    //     );
    //   });
    //   return content;

    // },

    _getModalItem(key) {
      var item;
      switch (this.props.bodyMode) {
        case "all":
          item = this._getItemContent(key, this.state.languages[key].language);
          break;
        case "flag":
          item = this._getFlag(key);
          break;
        case "label":
          item = this._getLabel(this.state.languages[key].language);
          break;
        case "code":
          item = this._getCode(key);
          break;
        case "label-code":
          item = this._getLabelCode(key, this.state.languages[key].language);
          break;
      }
      return item;
    },

    _getContent(mode, language = this.state.language) {
      var content;
      switch (mode) {
        case "all":
          content = this._getItemContent(language, this.state.languages[language].language);
          break;
        case "flag":
          content = this._getFlag(language);
          break;
        case "label":
          content = this._getLabel(this.state.languages[language].language);
          break;
        case "code":
          content = this._getCode(language);
          break;
        case "label-code":
          content = this._getLabelCode(language, this.state.languages[language].language);
          break;
      }
      return content;
    },
    //@@viewOff:private

    //@@viewOn:render
    render() {
      var result;
      // if (this.isXs()) {
      //   result = (
      //     <span {...this.getMainAttrs()}>
      //       <Button
      //         className={this.getClassName().button}
      //         content={this._getContent(this.props.headerMode)}
      //         disabled={this.isDisabled()}
      //         hidden={this.isHidden()}
      //         onClick={this._openModal}
      //         size={this.props.size}
      //         bgStyle={this.props.bgStyle || 'transparent'}
      //       />
      //       <Modal header='&nbsp;' ref_={(modal) => this.modal = modal} />
      //     </span>
      //   );
      // } else {
      result = (
        <Dropdown
          {...this.getMainPropsToPass()}
          label={this._getContent(this.props.headerMode)}
          size={this.props.size}
          bgStyle={this.props.bgStyle}
          pullRight={this.props.pullRight}
          dropup={this.props.dropup}
          menuClassName={this.getClassName("main")}
          borderRadius={this.props.borderRadius}
          elevation={this.props.elevation}
          elevationHover={this.props.elevationHover}
          baseline={this.props.baseline}
        >
          {this._getItems()}
          {this.props.children}
        </Dropdown>
      );
      // }
      return this.getNestingLevel() ? result : null;
    }
    //@@viewOff:render
  })
);

export default LanguageSelector;
