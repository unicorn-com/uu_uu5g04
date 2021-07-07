/**
 * Copyright (C) 2021 Unicorn a.s.
 *
 * This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public
 * License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later
 * version.
 *
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied
 * warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License at
 * <https://gnu.org/licenses/> for more details.
 *
 * You may obtain additional information at <https://unicorn.com> or contact Unicorn a.s. at address: V Kapslovne 2767/2,
 * Praha 3, Czech Republic or at the email: info@unicorn.com.
 */

//@@viewOn:imports
import * as UU5 from "uu5g04";
import ns from "./bricks-ns.js";
import Icon from "./icon";
import { CLASS_NAMES, STATE_MAP } from "./internal/tag-helpers";
//@@viewOff:imports

const STATICS = {
  nestingLevel: "inline",
  classNames: CLASS_NAMES,
};

export const Tag = UU5.Common.VisualComponent.create({
  //@@viewOn:mixins
  mixins: [UU5.Common.BaseMixin, UU5.Common.NestingLevelMixin],
  //@@viewOff:mixins

  //@@viewOn:statics
  statics: {
    tagName: ns.name("Tag"),
    ...STATICS,
  },
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {
    icon: UU5.PropTypes.string,
    iconAfter: UU5.PropTypes.string,
    size: UU5.PropTypes.oneOf(["s", "m"]),
    state: UU5.PropTypes.oneOf(Object.keys(STATE_MAP)),
  },
  //@@viewOff:propTypes

  //@@viewOn:getDefaultProps
  getDefaultProps() {
    return {
      icon: undefined,
      iconAfter: undefined,
      size: "m",
      state: "system",
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
    let label = UU5.Utils.Content.getChildren(this.props.children, this.props, STATICS);
    return this.getNestingLevel() ? (
      <span {...this.getMainAttrs()}>
        {this.props.size === "s" || !this.props.icon ? null : (
          <Icon icon={this.props.icon} className={CLASS_NAMES.icon(this.props, !!label)} />
        )}
        {this.props.size === "s" || !label ? null : <span className={CLASS_NAMES.label(this.props)}>{label}</span>}
        {this.props.size === "s" || !this.props.iconAfter ? null : (
          <Icon icon={this.props.iconAfter} className={CLASS_NAMES.iconAfter(this.props, !!label)} />
        )}
      </span>
    ) : null;
  },
  //@@viewOff:render
});

export default Tag;
