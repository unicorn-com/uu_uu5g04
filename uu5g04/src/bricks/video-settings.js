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

//@@viewOn:revision
// coded: Martin Mach, 07.09.2020
// reviewed: Petr Bišof, 14.09.2020
//@@viewOff:revision
//@@viewOn:imports

import * as UU5 from "uu5g04";
import ns from "./bricks-ns.js";
import Css from "./internal/css.js";
import Dropdown from "./dropdown.js";
import Icon from "./icon.js";
//@@viewOff:imports

const CLASS_NAMES = {
  main: () => Css.css`
    position: relative;
  `,
  wrapper: () => Css.css`
    background: linear-gradient(0deg, transparent 0%, rgba(0,0,0,1) 100%);
    color: white;
    width: 100%;
    text-align: right;
    padding: 8px;

    visibility: hidden;
    pointer-events: none;
    position: absolute;
    top: 0;
    right: 0;
    opacity: 0;
    transition: opacity 0.2s, visibility 0.2s;
    z-index: 1;

    .${CLASS_NAMES.main()}:hover > & {
      pointer-events: auto;
      visibility: visible;
      opacity: 1;
    }
  `,
  qualityPicker: () => Css.css`

  `,
};

export const VideoSettings = UU5.Common.VisualComponent.create({
  //@@viewOn:mixins
  mixins: [UU5.Common.BaseMixin],
  //@@viewOff:mixins

  //@@viewOn:statics
  statics: {
    tagName: ns.name("VideoSettings"),
    classNames: CLASS_NAMES,
  },
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {
    quality: UU5.PropTypes.string,
    qualityList: UU5.PropTypes.arrayOf(UU5.PropTypes.string),
    onQualityChange: UU5.PropTypes.func,
  },
  //@@viewOff:propTypes

  //@@viewOn:getDefaultProps
  getDefaultProps: function() {
    return {
      quality: null,
      qualityList: [],
      onQualityChange: null,
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
  _onQualityItemClick(component, e) {
    let { onQualityChange } = this.props;
    if (typeof onQualityChange === "function") onQualityChange({ value: component.props.value });
  },
  //@@viewOff:private

  //@@viewOn:render
  render() {
    let { quality, qualityList, children } = this.props;
    return (
      <div {...this.getMainAttrs()}>
        {Array.isArray(qualityList) && qualityList.length > 1 ? (
          <div className={this.getClassName("wrapper")}>
            Quality: <Dropdown
              key="q"
              className={this.getClassName("qualityPicker")}
              pullRight
              baseline
              bgStyle="transparent"
              colorSchema="white"
              label={quality || ""}
              items={qualityList.map((value) => ({
                onClick: this._onQualityItemClick,
                icon: value === quality ? "mdi-check" : undefined,
                value,
                label: (
                  <>
                    <Icon icon={value === quality ? "mdi-check" : "mdi-blank"} />
                    {" " + value}
                  </>
                ),
              }))}
            />
          </div>
        ) : null}
        {children}
      </div>
    );
  },
  //@@viewOff:render
});

export default VideoSettings;
