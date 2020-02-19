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
import "uu5g04-bricks";
import ns from "../forms-ns.js";
import ClassNames from "../../core/common/class-names.js";
import Css from "./css.js";

import Loading from "./loading.js";

import "./items-input.less";
//@@viewOff:imports

export default UU5.Common.LsiMixin.withContext(
  UU5.Common.VisualComponent.create({
    displayName: "items-input",
    //@@viewOn:mixins
    mixins: [UU5.Common.BaseMixin, UU5.Common.ElementaryMixin, UU5.Common.LsiMixin],
    //@@viewOff:mixins

    //@@viewOn:statics
    statics: {
      tagName: ns.name("ItemsInput"),
      classNames: {
        main: ns.css("items-input"),
        loading: ns.css("input-loading-icon"),
        value: ns.css("input-form-item-value"),
        item: ns.css("input-form-item items-input-item uu5-common-bg color-schema-blue"),
        link: ns.css("items-input-item-link"),
        icon: ns.css("items-input-item-icon"),
        placeholder: ns.css("input-placeholder"),
        inputError: ns.css("input-error")
      }
    },
    //@@viewOff:statics

    //@@viewOn:propTypes
    propTypes: {
      value: UU5.PropTypes.oneOfType([
        UU5.PropTypes.string,
        UU5.PropTypes.object,
        UU5.PropTypes.arrayOf(UU5.PropTypes.string),
        UU5.PropTypes.arrayOf(UU5.PropTypes.object)
      ]),
      multiple: UU5.PropTypes.bool,
      placeholder: UU5.PropTypes.oneOfType([UU5.PropTypes.object, UU5.PropTypes.string]),
      loading: UU5.PropTypes.bool,
      onItemClick: UU5.PropTypes.func,
      feedback: UU5.PropTypes.string,
      borderRadius: UU5.PropTypes.string,
      bgStyle: UU5.PropTypes.oneOf(["filled", "outline", "transparent", "underline"]),
      elevation: UU5.PropTypes.oneOf(["-1", "0", "1", "2", "3", "4", "5", -1, 0, 1, 2, 3, 4, 5]),
      colorSchema: UU5.PropTypes.string
    },
    //@@viewOff:propTypes

    //@@viewOn:getDefaultProps
    getDefaultProps: function() {
      return {
        value: "",
        multiple: false,
        placeholder: null,
        loading: false,
        onItemClick: null,
        feedback: null,
        borderRadius: null,
        bgStyle: null,
        elevation: null,
        colorSchema: null
      };
    },
    //@@viewOff:getDefaultProps

    //@@viewOn:reactLifeCycle
    componentDidMount() {
      UU5.Environment.getColorSchema("blue");
    },
    //@@viewOff:reactLifeCycle

    //@@viewOn:interface
    changeValue(index, e, setStateCallback) {
      if (typeof this.props.onChange === "function") {
        this.props.onChange({ value: index, event: e, component: this, setStateCallback: setStateCallback });
      }
    },
    //@@viewOff:interface

    //@@viewOn:overriding
    //@@viewOff:overriding

    //@@viewOn:private
    _getPlaceholder() {
      let placeholder;
      if (this.props.placeholder) {
        if (typeof this.props.placeholder === "string") {
          placeholder = this.props.placeholder;
        } else if (typeof this.props.placeholder === "object") {
          placeholder = this.getLsiItem(this.props.placeholder);
        }
      }

      return placeholder;
    },

    _getFeedbackIcon() {
      return this.props.loading ? (
        <Loading className={this.getClassName("loading")} id={this.getId()} />
      ) : this.props.icon ? (
        <UU5.Bricks.Icon icon={this.props.icon} className={this.props.iconClassName} />
      ) : null;
    },

    _getItems() {
      let value = this.props.value;
      if (this.props.multiple && this.props.value && this.props.value instanceof Array) {
        value = this.props.value.map((item, key) => {
          return (
            <UU5.Bricks.Span className={this.getClassName("item")} key={key}>
              {UU5.Common.Children.toArray(item)}
              {!this.props.readonly && (
                <UU5.Bricks.Link
                  className={this.getClassName("link")}
                  onClick={(link, e) => {
                    e.stopPropagation();
                    !this.props.disabled &&
                      this.props.onItemClick({ component: this, event: e, value: item, index: key });
                  }}
                >
                  <UU5.Bricks.Icon icon="mdi-close" className={this.getClassName("icon")} />
                </UU5.Bricks.Link>
              )}
            </UU5.Bricks.Span>
          );
        });
      } else {
        value = UU5.Common.Children.toArray(this.props.value);
      }

      this.props.value.length < 1 && (value = this._getPlaceholder());
      return value;
    },

    _getInputWidth() {
      return this.props.inputWidth === "auto" ? null : this.props.inputWidth;
    },

    _hasFeedback() {
      let result = false;

      switch (this.props.feedback) {
        case "success":
          result = true;
          break;
        case "warning":
          result = true;
          break;
        case "error":
          result = true;
          break;
      }

      return result;
    },

    _getMainAttrs() {
      let mainAttrs = this.getMainAttrs();

      if (!this.props.disabled && !this.props.readonly && this._hasFeedback()) {
        mainAttrs.className = mainAttrs.className
          .replace(/color-schema-[a-z-]+/, "")
          .replace(/ {2}/, " ")
          .trim(); // this might be unnecessary, but just in case ...

        switch (this.props.feedback) {
          case "success":
            mainAttrs.className += " color-schema-" + UU5.Environment.getColorSchema("success");
            break;
          case "warning":
            mainAttrs.className += " color-schema-" + UU5.Environment.getColorSchema("warning");
            break;
          case "error":
            mainAttrs.className += " color-schema-" + UU5.Environment.getColorSchema("danger");
            mainAttrs.className += " " + this.getClassName("inputError");
            break;
        }
      } else if (this.props.colorSchema) {
        mainAttrs.className += " color-schema-" + UU5.Environment.getColorSchema(this.props.colorSchema);
      }

      mainAttrs.style = { ...mainAttrs.style, ...{ borderRadius: this.props.borderRadius } };

      if (this.props.bgStyle === "filled" || this.props.bgStyle === "transparent") {
        mainAttrs.className += ` ${ClassNames.focus}`;
      }

      if (this.props.elevation) {
        mainAttrs.className += " " + ClassNames.elevation + this.props.elevation;
      }

      if (this.props.bgStyle) {
        mainAttrs.className += " " + ClassNames[this.props.bgStyle];
      } else if (["success", "warning", "error"].indexOf(this.props.feedback) > -1) {
        mainAttrs.className += " " + ClassNames["outline"];
        mainAttrs.className +=
          " " +
          Css.css(`
          &&&& {
            background-color: #FFFFFF;
          }
        `);
      }

      if (this.props.inputWidth) {
        mainAttrs = UU5.Common.Tools.mergeDeep(mainAttrs, { style: { width: this._getInputWidth() } });
      }

      return mainAttrs;
    },
    //@@viewOff:private

    //@@viewOn:render
    render: function() {
      let valueClass = this.getClassName().value;
      if (this.props.value.length < 1) {
        valueClass += " " + this.getClassName().placeholder;
      }

      return (
        <div {...this._getMainAttrs()}>
          <span className={valueClass}>{this._getItems()}</span>
          {this._getFeedbackIcon()}
        </div>
      );
    }
    //@@viewOn:render
  })
);
