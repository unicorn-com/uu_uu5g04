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

import { Div, Pre } from "./factory";
import Text from "./text";
import withLinkModal from "./internal/with-link-modal";

import "./console.less";
//@@viewOff:imports

let Console = UU5.Common.VisualComponent.create({
  displayName: "Console", // for backward compatibility (test snapshots)
  //@@viewOn:mixins
  mixins: [UU5.Common.BaseMixin, UU5.Common.ElementaryMixin, UU5.Common.NestingLevelMixin, UU5.Common.PureRenderMixin],
  //@@viewOff:mixins

  //@@viewOn:statics
  statics: {
    tagName: ns.name("Console"),
    nestingLevelList: UU5.Environment.getNestingLevelList("bigBoxCollection", "smallBox"),
    classNames: {
      main: ns.css("console"),
      arrow: ns.css("console-with-arrow"),
    },
  },
  //@@viewOff:statics

  //@@viewOn:propTypes
  //@@viewOff:propTypes

  //@@viewOn:getDefaultProps
  //@@viewOff:getDefaultProps

  //@@viewOn:reactLifeCycle
  getInitialState() {
    return {
      content: [],
    };
  },
  //@@viewOff:reactLifeCycle

  //@@viewOn:interface
  info(input, setStateCallback) {
    this._log(input, "info", setStateCallback);
    return this;
  },
  warning(input, setStateCallback) {
    this._log(input, "warning", setStateCallback);
    return this;
  },
  error(input, setStateCallback) {
    this._log(input, "danger", setStateCallback);
    return this;
  },
  //@@viewOff:interface

  //@@viewOn:overriding
  //@@viewOff:overriding

  //@@viewOn:private
  _log(input, color, setStateCallback) {
    this.setState((state) => {
      const content = state.content.slice();
      content.push({
        content: this._prepareInput(input),
        color: color,
      });
      return { content };
    }, setStateCallback);
  },

  _prepareInput(input) {
    if (typeof input === "function") {
      return input.toString().split("{")[0];
    }
    return JSON.stringify(input, null, 2);
  },
  //@@viewOff:private

  //@@viewOn:render
  render() {
    let divs = [];
    for (let i = 0; i < this.state.content.length; i++) {
      divs.push(
        <Div key={i}>
          <Text
            className={this.getClassName().arrow}
            colorSchema={this.state.content[i].color}
            content={this.state.content[i].content}
          />
        </Div>
      );
    }
    return <Pre {...this.getMainPropsToPass()}>{divs}</Pre>;
  },
  //@@viewOff:render
});

Console = withLinkModal(Console, Console.displayName, Console.nestingLevelList, Console.displayName);

export { Console };
export default Console;
