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
import { TAG } from "./config.js";
//@@viewOff:imports

const LsiButton = UU5.Common.VisualComponent.create({
  displayName: "LsiButton", // for backward compatibility (test snapshots)
  //@@viewOn:mixins
  mixins: [UU5.Common.BaseMixin, UU5.Common.LsiMixin],
  //@@viewOff:mixins

  //@@viewOn:statics
  statics: {
    tagName: TAG + "LsiButton"
  },
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {
    tooltip: UU5.PropTypes.oneOfType([UU5.PropTypes.string, UU5.PropTypes.object])
  },
  //@@viewOff:propTypes

  //@@viewOn:getDefaultProps
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
    return <UU5.Bricks.Button {...this.props} tooltip={this.getLsiItem(this.props.tooltip)} />;
  }
  //@@viewOff:render
});

export default LsiButton;
