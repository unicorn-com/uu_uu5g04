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
import ContextMenuItem from "./context-menu-item.js";
import Popover from "./popover.js";
import ScreenSize from "./screen-size.js";
import CompactContextMenu from "./internal/compact-context-menu.js";
import { Helpers } from "./internal/context-menu-helpers.js";

import "./context-menu.less";
//@@viewOff:imports

export const ContextMenu = UU5.Common.VisualComponent.create({
  displayName: "ContextMenu", // for backward compatibility (test snapshots)

  //@@viewOn:mixins
  mixins: [
    UU5.Common.BaseMixin,
    UU5.Common.ElementaryMixin,
    UU5.Common.SectionMixin,
    UU5.Common.CcrWriterMixin,
    UU5.Common.NestingLevelMixin,
    UU5.Common.PureRenderMixin
  ],
  //@@viewOff:mixins

  //@@viewOn:statics
  statics: {
    tagName: ns.name("ContextMenu"),
    nestingLevelList: UU5.Environment.getNestingLevelList("bigBoxCollection", "box"),
    classNames: {
      main: ns.css("context-menu")
    },
    defaults: {
      childTagName: "UU5.Bricks.ContextMenu.Item"
    },
    opt: {
      nestingLevelRoot: true
    }
  },
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {
    shown: UU5.PropTypes.bool,
    forceRender: UU5.PropTypes.bool,
    parentElement: UU5.PropTypes.object,
    allowTags: UU5.PropTypes.arrayOf(UU5.PropTypes.string),
    compactSubmenu: UU5.PropTypes.oneOfType([UU5.PropTypes.bool, UU5.PropTypes.string])
  },
  //@@viewOff:propTypes

  //@@viewOn:getDefaultProps
  getDefaultProps() {
    return {
      shown: false,
      forceRender: false,
      parentElement: null,
      allowTags: [],
      compactSubmenu: "xs"
    };
  },
  //@@viewOff:getDefaultProps

  //@@viewOn:reactLifeCycle
  //@@viewOff:reactLifeCycle

  //@@viewOn:interface
  isContextMenu() {
    return true;
  },

  open(opt, setStateCallback) {
    if (!this.isOpen()) {
      opt && (opt.content = this._getPopoverContent(opt.content));
    }
    this._popover.open(opt, setStateCallback);
    return this;
  },

  close(setStateCallback) {
    this._popover.close(setStateCallback);
    return this;
  },

  isOpen() {
    return this._popover.isOpen();
  },
  //@@viewOff:interface

  //@@viewOn:overriding
  shouldChildRender_(child) {
    let childTagName = UU5.Common.Tools.getChildTagName(child);
    let defaultChildTagName = this.getDefault().childTagName;
    let childTagNames = this.props.allowTags.concat(defaultChildTagName);
    let result = childTagNames.indexOf(childTagName) > -1;
    if (!result && (typeof child !== "string" || child.trim())) {
      if (childTagName)
        this.showError("childTagNotAllowed", [childTagName, this.getTagName(), childTagName, defaultChildTagName], {
          mixinName: "UU5.Common.BaseMixin"
        });
      else this.showError("childNotAllowed", [child, defaultChildTagName], { mixinName: "UU5.Common.BaseMixin" });
    }
    return result;
  },
  //@@viewOff:overriding

  //@@viewOn:private
  _getPopoverContent(content) {
    return <ScreenSize>{opt => this._renderMenuType(opt, content)}</ScreenSize>;
  },

  _getChildren(content) {
    return Helpers.wrapSubmenu(this.buildChildren({ content, children: this.props.children }));
  },

  _getMainProps() {
    let props = this.getMainPropsToPass();

    props.shown = this.props.shown;
    props.forceRender = this.props.forceRender;
    props.parentElement = this.props.parentElement;
    props.header = this.getHeader();
    props.footer = this.getFooter();
    props.nestingLevel = this.getNestingLevel();
    props.ref_ = ref => (this._popover = ref);

    return props;
  },

  _renderMenuType({ screenSize }, content) {
    if (!content) {
      content = this.props.content || this.props.children;
    }

    let screenSizeRegExp = new RegExp(`\\b${screenSize}\\b`);
    if (this.props.compactSubmenu === true || this.props.compactSubmenu.match(screenSizeRegExp)) {
      return (
        <CompactContextMenu
          key={UU5.Common.Tools.generateUUID()}
          content={this.buildChildren({ content })}
          parent={this}
        />
      );
    } else {
      return this._getChildren(content);
    }
  },
  //@@viewOff:private

  //@@viewOn:render
  render() {
    return (
      <Popover {...this._getMainProps()}>
        <ScreenSize>{this._renderMenuType}</ScreenSize>
      </Popover>
    );
  }
  //@@viewOff:render
});

ContextMenu.Item = ContextMenuItem;
export default ContextMenu;
