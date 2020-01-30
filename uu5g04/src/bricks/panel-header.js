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

import Icon from "./icon.js";
import Css from "./internal/css.js";
import PanelStyles from "./internal/panel-styles.js";

import "./panel-header.less";
//@@viewOff:imports

const ClassNames = UU5.Common.ClassNames;
const Styles = {
  bgStyles: props => {
    // Only default colorSchema is here right now. Others are in .less files
    // let styles = Object.keys(UU5.Environment.colorSchemaMap).map(colorSchema => {
    let styles = ["default"].map(colorSchema => {
      let colors = PanelStyles.getColors(colorSchema, props._bgStyle);

      if (!colors) {
        // Something went wrong. Maybe the colorSchema doesn't exist
        return "";
      }

      let style = `
        &.uu5-bricks-panel-header {
          color: ${colors.textColor};
          background-color: ${colors.bgColor};
          border-color: ${colors.borderColor};

          &.uu5-bricks-panel-header-open-click {
            ${PanelStyles.getHoverStyles(
              colorSchema,
              colors.bgColorActive,
              colors.textColorActive,
              colors.borderColorActive,
              colors.bgColorHover,
              colors.textColorHover,
              colors.borderColorHover
            )}
          }

          .uu5-bricks-panel-header-button-icon .uu5-bricks-button {
            color: ${colors.buttonTextColor};
            background-color: ${colors.buttonBgColor};
            ${PanelStyles.getButtonActiveStyles(
              colorSchema,
              colors.buttonBgColorHover,
              colors.buttonTextColorHover,
              colors.buttonBgColorActive,
              colors.buttonTextColorActive
            )}
          }
        }
      `;

      return `
        ${colorSchema === "default" ? `&,` : ""}
        &.color-schema-${colorSchema},
        .color-schema-${colorSchema}  &:not([class*="color-schema-"]) {
          ${style}
        }
      `;
    });

    return Css.css(styles.join(" "));
  }
};

export default UU5.Common.VisualComponent.create({
  displayName: "panel-header", // for backward compatibility (test snapshots)
  //@@viewOn:mixins
  mixins: [
    UU5.Common.BaseMixin,
    UU5.Common.PureRenderMixin,
    UU5.Common.ElementaryMixin,
    UU5.Common.ContentMixin,
    UU5.Common.ColorSchemaMixin
  ],
  //@@viewOff:mixins

  //@@viewOn:statics
  statics: {
    tagName: ns.name("Panel.Header"),
    classNames: {
      main: ns.css("panel-header"),
      click: ns.css("panel-header-click"),
      content: ns.css("panel-header-content"),
      after: ns.css("panel-header-icon-after"),
      right: ns.css("panel-header-icon-right"),
      left: ns.css("panel-header-icon-left"),
      openClickIcon: ns.css("panel-icon-open-click"),
      openClickHeader: ns.css("panel-header-open-click"),
      iconButton: ns.css("panel-header-button-icon"),
      icon: ns.css("panel-header-icon"),
      bgStyles: Styles.bgStyles
    },
    defaults: {
      parentTagName: "UU5.Bricks.Panel"
    },
    errors: {
      invalidParent: "Parent of this component is not Panel."
    }
  },
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {
    _icon: UU5.PropTypes.string,
    _onClick: UU5.PropTypes.func,
    _disableHeaderClick: UU5.PropTypes.bool,
    iconAlign: UU5.PropTypes.oneOf(["right", "after", "left"]),
    openClick: UU5.PropTypes.oneOf(["header", "icon", "none"]),
    bgStyle: UU5.PropTypes.oneOf(["filled", "outline", "transparent", "underline"])
  },
  //@@viewOff:propTypes

  //@@viewOn:getDefaultProps
  getDefaultProps() {
    return {
      _icon: null,
      _onClick: null,
      _disableHeaderClick: undefined,
      iconAlign: "right",
      openClick: "header",
      bgStyle: null
    };
  },
  //@@viewOff:getDefaultProps
  getInitialState() {
    if (this.props._disableHeaderClick === true || this.props._disableHeaderClick === false) {
      UU5.Common.Tools.warning("Props disableHeaderClick is deprecated. Use props openClick instead.");
    }
  },

  //@@viewOn:reactLifeCycle
  componentWillMount() {
    let parent = this.getParent();

    if (parent) {
      while (parent.getOpt("parentWrapper")) {
        parent = parent.getParent();
      }
    }

    if (!(parent && parent.isPanel)) {
      this.showError("invalidParent");
    }
  },

  //@@viewOff:reactLifeCycle

  //@@viewOn:interface
  //@@viewOff:interface

  //@@viewOn:overriding
  //@@viewOff:overriding

  //@@viewOn:private
  _onClickHandler(comp, e) {
    if (e && e.currentTarget && e.currentTarget.blur) e.currentTarget.blur();
    this.props._onClick(comp, e);
    return this;
  },

  _getBorderRadiusButton() {
    if (this.props.openClick === "icon") {
      if (this.props.style.borderRadius) {
        if (this.props.iconAlign === "left") {
          let borderRadius;
          let border = this.props.style.borderRadius;
          let splitBorderLeft = border.split(" ");
          if (splitBorderLeft.length === 1) {
            return (borderRadius = splitBorderLeft[0] + " " + 0 + " " + 0 + " " + splitBorderLeft[0]);
          } else if (splitBorderLeft.length === 2) {
            return (borderRadius = splitBorderLeft[0] + " " + 0 + " " + 0 + " " + splitBorderLeft[1]);
          } else if (splitBorderLeft.length === 3) {
            return (borderRadius = splitBorderLeft[0] + " " + 0 + " " + 0 + " " + splitBorderLeft[2]);
          } else if (splitBorderLeft.length === 4) {
            return (borderRadius = splitBorderLeft[0] + " " + 0 + " " + 0 + " " + splitBorderLeft[3]);
          }
        }
        if (this.props.iconAlign === "right") {
          let borderRadius;
          let border = this.props.style.borderRadius;
          let splitBorderRight = border.split(" ");
          if (splitBorderRight.length === 1) {
            return (borderRadius = 0 + " " + splitBorderRight[0] + " " + splitBorderRight[0]) + " " + 0;
          } else if (splitBorderRight.length === 2) {
            return (borderRadius = 0 + " " + splitBorderRight[1] + " " + splitBorderRight[0]) + " " + 0;
          } else if (splitBorderRight.length === 3 || splitBorderRight.length === 4) {
            return (borderRadius = 0 + " " + splitBorderRight[1] + " " + splitBorderRight[2]) + " " + 0;
          }
        }
      }
    }
  },

  _getIcon() {
    let icon;

    if (this.props._icon && this.props.openClick === "icon" && !this.props._disableHeaderClick) {
      icon = (
        <div className={this.getClassName().iconButton}>
          <UU5.Bricks.Button
            borderRadius={this._getBorderRadiusButton()}
            colorSchema={"custom"}
            onClick={this._onClickHandler}
          >
            <Icon className={this.getClassName().icon} icon={this.props._icon} />
          </UU5.Bricks.Button>
        </div>
      );
    } else if (this.props._icon) {
      icon = <Icon className={this.getClassName().icon} icon={this.props._icon} />;
    }

    return icon;
  },

  _buildMainAttrs() {
    let mainAttrs = this.getMainAttrs();

    mainAttrs.className += " " + this.getClassName("bgStyles");

    if (!this.props._disableHeaderClick) {
      if (this.props._icon && this.props.openClick === "icon") {
        mainAttrs.className += " " + this.getClassName().openClickIcon + " " + this.getClassName().click;
      }

      if (this.props.openClick === "header" && !this.props._disableHeaderClick) {
        mainAttrs.onClick = this._onClickHandler;
        mainAttrs.className += " " + ClassNames.hover;
        if (this.props._icon) {
          mainAttrs.className += " " + this.getClassName().openClickHeader + " " + this.getClassName().click;
        }
      }
    }

    if (this.props.bgStyle) {
      mainAttrs.className += " " + ClassNames[this.props.bgStyle];
    }
    if (this.props._icon) {
      mainAttrs.className +=
        " " +
        (this.props.iconAlign === "after"
          ? this.getClassName().after
          : this.props.iconAlign === "left"
          ? this.getClassName().left
          : this.props.iconAlign === "right"
          ? this.getClassName().right
          : null);
    }
    return mainAttrs;
  },
  //@@viewOff:private

  //@@viewOn:render
  render() {
    return (
      <div {...this._buildMainAttrs()}>
        <span className={this.getClassName("content")}>{this.getChildren()}</span>
        {this._getIcon()}
        {this.getDisabledCover()}
      </div>
    );
  }
  //@@viewOff:render
});
