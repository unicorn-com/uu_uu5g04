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

import ns from "../forms-ns.js";
import AnimatedContainer from "./animated-container.js";
import Css from "./css.js";
//@@viewOff:imports

const MoreSettings = UU5.Common.VisualComponent.create({
  displayName: "MoreSettings", // for backward compatibility (test snapshots)
  mixins: [UU5.Common.BaseMixin],
  statics: {
    tagName: ns.name("MoreSettings"),
    classNames: {
      main: () => ns.css("more-settings") + " " + Css.css(`.uu5-bricks-icon { position: static; }`)
    }
  },
  getInitialState() {
    return { opened: false };
  },

  toggle() {
    this.setState(state => ({ opened: !state.opened }));
  },

  render() {
    return (
      <div {...this.getMainAttrs()}>
        <div onClick={this.toggle}>
          <UU5.Bricks.Link>More Settings</UU5.Bricks.Link>
          <UU5.Bricks.Icon icon={this.state.opened ? "mdi-menu-down" : "mdi-menu-right"} />
        </div>
        <AnimatedContainer opened={this.state.opened}>{this.props.children}</AnimatedContainer>
      </div>
    );
  }
});

export default MoreSettings;
