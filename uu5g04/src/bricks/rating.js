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

import "./rating.less";
//@@viewOff:imports

export const Rating = UU5.Common.VisualComponent.create({
  displayName: "Rating", // for backward compatibility (test snapshots)
  //@@viewOn:mixins
  mixins: [
    UU5.Common.BaseMixin,
    UU5.Common.PureRenderMixin,
    UU5.Common.ElementaryMixin,
    UU5.Common.ContentMixin,
    UU5.Common.ColorSchemaMixin,
    UU5.Common.NestingLevelMixin
  ],
  //@@viewOff:mixins

  //@@viewOn:statics
  statics: {
    tagName: ns.name("Rating"),
    nestingLevelList: UU5.Environment.getNestingLevelList("bigBoxCollection", "smallBox"),
    classNames: {
      main: ns.css("rating"),
      click: ns.css("rating-clickable"),
      size: ns.css("rating-size-")
    }
  },
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {
    count: UU5.PropTypes.number,
    value: UU5.PropTypes.number,
    onClick: UU5.PropTypes.func,
    icon: UU5.PropTypes.string,
    size: UU5.PropTypes.oneOf(["s", "m", "l", "xl"])
  },
  //@@viewOff:propTypes

  //@@viewOn:getDefaultProps
  getDefaultProps() {
    return {
      count: 5,
      value: 0,
      onClick: null,
      icon: "mdi-star",
      size: "m"
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
  _createIconArray() {
    const iconArray = [];
    const value = this.props.value;
    const max = this.props.count;
    for (let i = max; i > 0; i--) {
      let iconValue = 0;
      i <= value && (iconValue = 1);
      const integerVal = Math.floor(value);
      const part = value - integerVal;

      part > 0 && i == integerVal + 1 && (iconValue = part);
      iconArray.push(
        <RatingIcon
          value={iconValue}
          key={i}
          icon={this.props.icon}
          onClick={this.props.onClick ? e => this.props.onClick(i, e, this) : null}
        />
      );
    }
    return iconArray;
  },
  //@@viewOff:private

  //@@viewOn:render
  render() {
    const mainAttrs = this.getMainAttrs();
    mainAttrs.className += " " + this.getClassName("size") + this.props.size;
    this.props.onClick && (mainAttrs.className = mainAttrs.className + " " + this.getClassName("click"));

    return this.getNestingLevel() ? (
      <div {...mainAttrs}>
        {this._createIconArray()}
        {this.getDisabledCoverTransparent()}
      </div>
    ) : null;
  }
  //@@viewOff:render
});

export default Rating;

const RatingIcon = UU5.Common.VisualComponent.create({
  displayName: "RatingIcon", // for backward compatibility (test snapshots)
  //@@viewOn:mixins
  mixins: [UU5.Common.BaseMixin, UU5.Common.PureRenderMixin, UU5.Common.ElementaryMixin, UU5.Common.ColorSchemaMixin],
  //@@viewOff:mixins

  //@@viewOn:statics
  statics: {
    tagName: ns.name("Rating.Icon"),
    classNames: {
      main: ns.css("rating-icon"),
      icon: ns.css("rating-icon-icon"),
      icon10: ns.css("rating-icon-part-10"),
      icon20: ns.css("rating-icon-part-20"),
      icon30: ns.css("rating-icon-part-30"),
      icon40: ns.css("rating-icon-part-40"),
      icon50: ns.css("rating-icon-part-50"),
      icon60: ns.css("rating-icon-part-60"),
      icon70: ns.css("rating-icon-part-70"),
      icon80: ns.css("rating-icon-part-80"),
      icon90: ns.css("rating-icon-part-90"),
      full: ns.css("rating-icon-full")
    }
  },
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {
    onClick: UU5.PropTypes.func,
    icon: UU5.PropTypes.string,
    value: UU5.PropTypes.number
  },
  //@@viewOff:propTypes

  //@@viewOn:getDefaultProps
  getDefaultProps() {
    return {
      onClick: null,
      icon: "mdi-star",
      value: 0
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
  _getCorrectClass() {
    let _class;
    let value = this.props.value;
    if (value === 1) {
      _class = { className: this.getClassName().full };
    } else if (value > 0 && value < 1) {
      value = 1 - value;
      let percents = Math.round(value * 10) * 10;
      percents = percents === 0 ? 10 : percents;
      _class = { className: this.getClassName()["icon" + percents] };
    }

    return _class;
  },
  //@@viewOff:private

  //@@viewOn:render
  render() {
    const mainAttrs = this.getMainAttrs();

    this.props.onClick && (mainAttrs.onClick = this.props.onClick);
    return (
      <span {...mainAttrs}>
        <Icon icon={this.props.icon} mainAttrs={this._getCorrectClass()} className={this.getClassName().icon} />
      </span>
    );
  }
  //@@viewOff:render
});
