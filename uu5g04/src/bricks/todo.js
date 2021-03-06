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
import withLinkModal from "./internal/with-link-modal";

import "./todo.less";
//@@viewOff:imports

let Todo = UU5.Common.VisualComponent.create({
  displayName: "Todo", // for backward compatibility (test snapshots)

  //@@viewOn:mixins
  mixins: [UU5.Common.BaseMixin, UU5.Common.ElementaryMixin, UU5.Common.SectionMixin, UU5.Common.NestingLevelMixin],
  //@@viewOff:mixins

  //@@viewOn:statics
  statics: {
    tagName: ns.name("Todo"),
    nestingLevel: "box",
    classNames: {
      main: ns.css("todo"),
    },
    opt: {
      nestingLevelWrapper: true,
    },
  },
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {
    props: UU5.PropTypes.oneOfType([UU5.PropTypes.array, UU5.PropTypes.object]),
  },
  //@@viewOff:propTypes

  //@@viewOn:getDefaultProps
  getDefaultProps() {
    return {
      props: null,
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
  render: function () {
    return this.getNestingLevel() ? (
      <UU5.Bricks.Section {...this.getMainPropsToPass()} content={null}>
        <UU5.Bricks.Pre>{this.props.props && UU5.Common.Tools.prettyJson(this.props.props)}</UU5.Bricks.Pre>
      </UU5.Bricks.Section>
    ) : null;
  },
  //@@viewOff:render
});

Todo = withLinkModal(Todo, Todo.displayName, Todo.nestingLevel, Todo.displayName);

export { Todo };

export default Todo;
