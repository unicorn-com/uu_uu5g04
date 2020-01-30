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
import Css from "./internal/css.js";
import ButtonStyles from "./internal/button-styles.js";
import { elevationMixin } from "./internal/styles.js";

import "./button.less";
//@@viewOff:imports

const ClassNames = UU5.Common.ClassNames;
const Styles = {
  errorStyles: props => {
    let colorSchema = UU5.Environment.colorSchemaMap.danger.color;
    let colors = ButtonStyles.getColors(colorSchema, props.bgStyle);

    if (!colors) {
      // Something went wrong. Maybe the colorSchema doesn't exist
      return "";
    }

    let style = `
      box-shadow: inset 0 0 0 1px ${colors.borderColor};
    `;

    if (props.bgStyle === "filled") {
      style += `
        border-color: ${colors.borderColor};
        box-shadow: none;
        ${elevationMixin(`inset 0 0 0 1px ${colors.borderColor}`)};

        &:hover, &:focus {
          border-color: ${colors.borderColorHover};
          ${elevationMixin(`inset 0 0 0 1px ${colors.borderColorHover}`)};
        }

        &:active, &:active:hover, &:active:focus,
        &.active, &.active:hover, &.active:focus {
          border-color: ${colors.borderColorActive};
          ${elevationMixin(`inset 0 0 0 1px ${colors.borderColorActive}`)};
        }
      `;
    } else if (props.bgStyle === "outline") {
      style += `
        box-shadow: inset 0 0 0 1px ${colors.borderColor};
        ${elevationMixin(`inset 0 0 0 1px ${colors.borderColor}`)};

        &:hover, &:focus {
          box-shadow: inset 0 0 0 1px ${colors.borderColorHover};
          ${elevationMixin(`inset 0 0 0 1px ${colors.borderColorHover}`)};
        }

        &:active, &:active:hover, &:active:focus,
        &.active, &.active:hover, &.active:focus {
          box-shadow: inset 0 0 0 1px ${colors.borderColorActive};
          ${elevationMixin(`inset 0 0 0 1px ${colors.borderColorActive}`)};
        }
      `;
    } else if (props.bgStyle === "underline") {
      style += `
        background: linear-gradient(to right, ${colors.borderColor}, ${colors.borderColor}) 0 100% no-repeat;
        background-size: 100% 1px;
        box-shadow: none;
        ${elevationMixin(`inset 0 0 0 0 transparent`)};

        &:hover, &:focus {
          background: linear-gradient(to right, ${colors.borderColorHover}, ${colors.borderColorHover}) 0 100% no-repeat;
        }

        &:active, &:active:hover, &:active:focus,
        &.active, &.active:hover, &.active:focus {
          background: linear-gradient(to right, ${colors.borderColorActive}, ${colors.borderColorActive}) 0 100% no-repeat;
        }
      `;
    } else if (props.bgStyle === "transparent") {
      style += `
        background: linear-gradient(to right, ${colors.borderColor}, ${colors.borderColor}) 0 100% no-repeat;
        background-size: 100% 1px;
        box-shadow: none;
        ${elevationMixin(`inset 0 0 0 0 transparent`)};

        &:hover, &:focus {
          background: linear-gradient(to right, ${colors.borderColorHover}, ${colors.borderColorHover}) 0 100% no-repeat;
        }

        &:active, &:active:hover, &:active:focus,
        &.active, &.active:hover, &.active:focus {
          background: linear-gradient(to right, ${colors.borderColorActive}, ${colors.borderColorActive}) 0 100% no-repeat;
        }
      `;
    }

    return Css.css(`
      &.color-schema-${colorSchema},
      .color-schema-${colorSchema} &:not([class*="color-schema-"]) {
        &.uu5-forms-button-error {
          ${style}
        }
      }
    `);
  },
  bgStyles: props => {
    // Only default colorSchema is here right now. Others are in .less files
    // let styles = Object.keys(UU5.Environment.colorSchemaMap).map(colorSchema => {
    let styles = ["default"].map(colorSchema => {
      let colors = ButtonStyles.getColors(colorSchema, props.bgStyle);

      if (!colors) {
        // Something went wrong. Maybe the colorSchema doesn't exist
        return "";
      }

      let dropdownSplitColor = colors.textColor;
      let dropdownSplitColorHover = colors.textColorHover;
      let dropdownSplitColorActive = colors.textColorActive;

      if (props.bgStyle === "transparent") {
        dropdownSplitColor = colors.borderColor;
        dropdownSplitColorHover = colors.borderColorHover;
        dropdownSplitColorActive = colors.borderColorActive;
      }

      let style = `
        background-color: ${colors.bgColor};
        color: ${colors.textColor};
        border-color: ${colors.borderColor};

        &::before {
          border-color: ${colors.textColor};
        }

        + .uu5-bricks-dropdown-link-split {
          background-color: ${dropdownSplitColor};
        }

        &:hover, &:focus {
          background-color: ${colors.bgColorHover};
          color: ${colors.textColorHover};
          border-color: ${colors.borderColorHover};

          &::before {
            border-color: ${colors.borderColorHover};
          }

          + .uu5-bricks-dropdown-link-split {
            background-color: ${dropdownSplitColorHover};
          }
        }

        &:active, &:active:hover, &:active:focus,
        &.active, &.active:hover, &.active:focus {
          background-color: ${colors.bgColorActive};
          color: ${colors.textColorActive};
          border-color: ${colors.borderColorActive};

          &::before {
            border-color: ${colors.borderColorActive};
          }

          + .uu5-bricks-dropdown-link-split {
            background-color: ${dropdownSplitColorActive};
          }
        }
      `;

      return `
        ${colorSchema === "default" ? `&,` : ""}
        &.color-schema-${colorSchema},
        .color-schema-${colorSchema} &:not([class*="color-schema-"]) {
          ${style}
        }
      `;
    });

    return Css.css(styles.join(" "));
  }
};

export const Button = UU5.Common.VisualComponent.create({
  displayName: "Button", // for backward compatibility (test snapshots)
  //@@viewOn:mixins
  mixins: [
    UU5.Common.BaseMixin,
    UU5.Common.ElementaryMixin,
    UU5.Common.NestingLevelMixin,
    UU5.Common.ColorSchemaMixin,
    UU5.Common.ContentMixin,
    UU5.Common.PureRenderMixin,
    UU5.Common.EditableMixin
  ],
  //@@viewOff:mixins

  //@@viewOn:statics
  statics: {
    tagName: ns.name("Button"),
    nestingLevel: "smallBox",
    classNames: {
      main:
        ns.css("button") +
        " " +
        Css.css`
        border: none;

        &.uu5-bricks-button-link {
          border: none;
          background-color: transparent;

          &:hover, &:focus {
            border: none;
            background-color: transparent;
          }
        }

        .uu5-bricks-button.uu5-bricks-button-underline {
          background: transparent;
        }
      `,
      bgStyle: ns.css("button-"),
      text: ns.css("button-text"),
      block: ns.css("button-block"),
      active: "active",
      size: ns.css("button-"),
      baseline: ns.css("button-baseline"),
      errorStyles: Styles.errorStyles,
      bgStyles: Styles.bgStyles
    },
    defaults: {
      content: "Button",
      regexpHash: /^#/,
      httpRegexp: /^(\/|[a-z0-9\-+.]+:)/
    },
    editableComponent: "UU5.BricksEditable.Button"
  },
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {
    size: UU5.PropTypes.oneOf(["s", "m", "l", "xl"]),
    displayBlock: UU5.PropTypes.bool,
    pressed: UU5.PropTypes.bool,
    bgStyle: UU5.PropTypes.oneOf(["filled", "outline", "transparent", "underline", "link"]),
    onClick: UU5.PropTypes.func,
    onWheelClick: UU5.PropTypes.func,
    onCtrlClick: UU5.PropTypes.func,
    href: UU5.PropTypes.string,
    target: UU5.PropTypes.oneOf(["_blank", "_parent", "_top", "_self"]),
    smoothScroll: UU5.PropTypes.number,
    offset: UU5.PropTypes.number,
    borderRadius: UU5.PropTypes.string,
    elevation: UU5.PropTypes.oneOf(["-1", "0", "1", "2", "3", "4", "5", -1, 0, 1, 2, 3, 4, 5]),
    elevationHover: UU5.PropTypes.oneOf(["-1", "0", "1", "2", "3", "4", "5", -1, 0, 1, 2, 3, 4, 5]),
    baseline: UU5.PropTypes.bool
  },
  //@@viewOff:propTypes

  //@@viewOn:getDefaultProps
  getDefaultProps() {
    return {
      size: "m",
      displayBlock: false,
      pressed: false,
      bgStyle: "filled",
      onClick: null,
      onWheelClick: null,
      onCtrlClick: null,
      href: null,
      target: "_self",
      smoothScroll: 1000,
      offset: 0,
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
      pressed: this.props.pressed
    };
  },

  componentWillReceiveProps(nextProps) {
    if (nextProps.controlled) {
      this.setState({ pressed: nextProps.pressed });
    }
  },

  componentWillMount() {
    if (this.props.bgStyle === "inverted") {
      UU5.Common.Tools.warning('Value "inverted" of property "bgStyle" is deprecated! Use "outline" instead.');
    }
  },
  //@@viewOff:reactLifeCycle

  //@@viewOn:interface
  setActive(pressed, setStateCallback) {
    this.setState({ pressed: pressed }, setStateCallback);
    return this;
  },

  press(setStateCallback) {
    return this.setActive(true, setStateCallback);
  },

  pressUp(setStateCallback) {
    return this.setActive(false, setStateCallback);
  },

  togglePressed(setStateCallback) {
    this.setState(state => ({ pressed: !state.pressed }), setStateCallback);
    return this;
  },

  isPressed() {
    return this.state.pressed;
  },

  focus() {
    this._button && this._button.focus();
  },
  //@@viewOff:interface

  //@@viewOn:overriding
  //@@viewOff:overriding

  //@@viewOn:private
  _onClickLink(e, middleClick) {
    let isRouterLink = this._isRoute() && UU5.Environment.getRouter();
    if (e.button === 0 || middleClick) {
      e.preventDefault();
      if (isRouterLink) {
        let [base, ...fragmentParts] = this.props.href.split("#");
        let [path, ...queryParts] = base.split("?");
        let fragment = fragmentParts.join("#");
        let query = queryParts.join("?");
        let params = query ? UU5.Common.Url.decodeQuery("?" + query) : null;

        e.preventDefault();
        if (this.props.target === "_blank") {
          this._openRouteNewTab();
        } else {
          let useCase = path || UU5.Common.Url.parse(location.href).useCase || "";
          UU5.Environment.setRoute(useCase, params, fragment);
        }
      }

      if (typeof this.props.onClick === "function") {
        this.props.onClick(this, e);
      } else if (typeof this.props.href === "string" && !isRouterLink) {
        if (e.ctrlKey || (UU5.Common.Tools.isMac() && e.metaKey) || e.button === 1) {
          let href = this.props.href.match(/^#.*/)
            ? window.location.href.split("#")[0] + this.props.href
            : this.props.href;
          window.open(href, "_blank");
        } else {
          if (this._isFragmentLink()) {
            this._onClickFragment(e);
          } else {
            window.open(this.props.href, this.props.target);
          }
        }
      }
    }

    return this;
  },

  _onClick(e) {
    if (e.button === 0 && e.ctrlKey && typeof this.props.onCtrlClick === "function") {
      this.props.onCtrlClick(this, e);
    } else if (e.button === 1 && typeof this.props.onWheelClick === "function") {
      this.props.onWheelClick(this, e);
    } else if (typeof this.props.onClick === "function") {
      this.props.onClick(this, e);
    } else if (typeof this.props.href === "string") {
      this._onClickLink(e);
    }
  },

  _onMouseUp(e) {
    if (e.button === 1) {
      e.stopPropagation();

      if (e.button === 1 && typeof this.props.onWheelClick === "function") {
        this.props.onWheelClick(this, e);
      } else if (typeof this.props.href === "string") {
        this._onClickLink(e, true);
      }
    }
    return this;
  },

  _onClickFragment(e) {
    e.preventDefault();
    //let basePath = location.href.replace(/#.*/, "");

    let id = this.props.href.replace("#", "");
    let foundElement = document.getElementById(id);

    if (!foundElement) {
      id = id.replace("-inner", "");
      foundElement = document.getElementById(id);
    }

    //let path = basePath + "#" + id;
    //history.pushState(null, document.title, path);
    UU5.Common.Tools.scrollToTarget(id, this.props.smoothScroll, this.props.offset);
    return this;
  },

  _isFragmentLink() {
    return this.props.href && this.props.href.length > 1 && this.props.href.lastIndexOf("#", 0) === 0;
  },

  _openRouteNewTab() {
    window.open(this._getRouteUrl(), "_blank");
  },

  _containsHash(url) {
    return this.getDefault("regexpHash").test(url);
  },

  _isRoute() {
    return (
      this.props.href && !this.getDefault("httpRegexp").test(this.props.href) && !this._containsHash(this.props.href)
    );
  },

  _getRouteUrl() {
    let { href } = this.props;
    let basePath = UU5.Environment.getAppBasePath();
    let usedHref = href.charAt(0) === "?" ? (UU5.Common.Url.parse(location.href).useCase || "") + href : href;
    return basePath ? basePath.replace(/\/*$/, "/") + usedHref.replace(/^\/+/, "") : usedHref;
  },

  _buildMainAttrs() {
    let mainAttrs = this.getMainAttrs();

    mainAttrs.className +=
      " " +
      this.getClassName("size") +
      this.props.size +
      " " +
      this.getClassName().bgStyle +
      (this.props.bgStyle || "filled") +
      (this.props.displayBlock ? " " + this.getClassName("block") : "") +
      (this.isPressed() ? " " + this.getClassName("active") : "") +
      (this.props.baseline ? " " + this.getClassName("baseline") : "");

    mainAttrs.className += " " + this.getClassName("errorStyles") + " " + this.getClassName("bgStyles");

    if (this.props.elevation) {
      mainAttrs.className += " " + ClassNames.elevation + this.props.elevation;
    }

    if (this.props.elevationHover !== null) {
      mainAttrs.className += " " + ClassNames.elevationHover + this.props.elevationHover;
    }

    if (this.props.borderRadius) {
      mainAttrs.style = { ...mainAttrs.style, ...{ borderRadius: this.props.borderRadius } };
    }

    if (this.isDisabled()) {
      mainAttrs.disabled = true;
    } else {
      mainAttrs.onClick = this._onClick;

      if (typeof this.props.href === "string") {
        mainAttrs.href = this._containsHash(this.props.href)
          ? location.href.split("#")[0] + this.props.href
          : this.props.href;
      }

      if (typeof this.props.href === "string" || typeof this.props.onWheelClick === "function") {
        mainAttrs.onMouseUp = this._onMouseUp;
      }
    }

    mainAttrs.type = "button";

    return mainAttrs;
  },

  _getChildren() {
    let children = this.getChildren() || this.getDefault().content;
    let newChildren = [];
    children = Array.isArray(children) ? children : [children];
    children.forEach((child, i) => {
      let childType = typeof child;
      let isTextCorrector =
        childType === "object" &&
        child &&
        child.type &&
        child.type.displayName === "UU5.Common.TextCorrectorContextConsumer";
      if (isTextCorrector) {
        childType = typeof child.props.text;
      }
      if (childType === "string") {
        let childLength;
        if (isTextCorrector) {
          let text = child.props.text;
          let replacedText = text.replace(/\n/g, "");
          if (text.length !== replacedText.length) {
            // clone child with new text prop
            child = UU5.Common.Element.clone(child, { text: replacedText });
          }
          childLength = replacedText.length;
        } else {
          child = child.replace(/\n/g, "");
          childLength = child.length;
        }
        if (childLength) {
          newChildren.push(
            <span key={i} className={this.getClassName().text}>
              {child}
            </span>
          );
        }
      } else if (childType === "number") {
        newChildren.push(
          <span key={i} className={this.getClassName().text}>
            {child}
          </span>
        );
      } else {
        newChildren.push(child);
      }
    });

    return newChildren.length > 0 ? newChildren : children;
  },
  //@@viewOff:private

  //@@viewOn:render
  render() {
    let component = (
      <button {...this._buildMainAttrs()} ref={button => (this._button = button)}>
        {this._getChildren()}
      </button>
    );

    return this.getNestingLevel() ? component : null;
  }
  //@@viewOff:render
});

export default Button;
