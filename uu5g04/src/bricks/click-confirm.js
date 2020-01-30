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

import { Div } from "./factory.js";

import "./click-confirm.less";
//@@viewOff:imports

export const ClickConfirm = UU5.Common.VisualComponent.create({
  displayName: "ClickConfirm", // for backward compatibility (test snapshots)
  //@@viewOn:mixins
  mixins: [
    UU5.Common.BaseMixin,
    UU5.Common.ElementaryMixin,
    UU5.Common.ColorSchemaMixin,
    UU5.Common.CcrWriterMixin,
    UU5.Common.NestingLevelMixin,
    UU5.Common.PureRenderMixin
  ],
  //@@viewOff:mixins

  //@@viewOn:statics
  statics: {
    tagName: ns.name("ClickConfirm"),
    nestingLevelList: UU5.Environment.getNestingLevelList("bigBoxCollection", "inline"),
    classNames: {
      main: ns.css("click-confirm"),
      open: ns.css("click-confirm-shown")
    },
    defaults: {
      showTimeout: 500,
      closeTimeout: 4000
    },
    opt: {
      nestingLevelRoot: true
    }
  },
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {},
  //@@viewOff:propTypes

  //@@viewOn:getDefaultProps
  getDefaultProps: function() {
    return {};
  },

  getInitialState: function() {
    return {
      content: null,
      pageX: null,
      pageY: null
    };
  },
  //@@viewOff:getDefaultProps

  //@@viewOn:reactLifeCycle
  componentWillMount: function() {
    this.setState({ hidden: true });
  },

  componentWillUnmount: function() {
    this.showTimeout && clearTimeout(this.showTimeout);
    this.closeTimeout && clearTimeout(this.closeTimeout);
  },
  //@@viewOff:reactLifeCycle

  //@@viewOn:interface
  open: function(openAttrs) {
    var pageX = openAttrs.pageX;
    var pageY = openAttrs.pageY;

    if (openAttrs.event) {
      pageX = pageX || openAttrs.event.pageX;
      pageY = pageY || openAttrs.event.pageY;
    }

    this.showTimeout && clearTimeout(this.showTimeout);
    this.closeTimeout && clearTimeout(this.closeTimeout);

    var _this = this;
    this.showTimeout = setTimeout(function() {
      _this.setAsyncState({ content: openAttrs.content, hidden: false, pageX: pageX, pageY: pageY }, function() {
        typeof openAttrs.onOpenCallback === "function" && openAttrs.onOpenCallback();

        _this.closeTimeout = setTimeout(function() {
          _this.close(openAttrs.onClosedCallback);
        }, _this.getDefault().closeTimeout);
      });
    }, _this.getDefault().showTimeout);

    return this;
  },

  close: function(setStateCallback) {
    this.showTimeout && clearTimeout(this.showTimeout);
    this.closeTimeout && clearTimeout(this.closeTimeout);
    this.setState({ content: null, hidden: true, pageX: null, pageY: null }, setStateCallback);
    return this;
  },
  //@@viewOff:interface

  //@@viewOn:overriding
  //@@viewOff:overriding

  //@@viewOn:private
  _getMainAttrs: function() {
    var props = this.getMainAttrs();

    !this.isHidden() && (props.className += " " + this.getClassName().open);

    if (this.state.pageX !== null) {
      props.style = {
        left: this.state.pageX,
        top: this.state.pageY
      };
    }
    props.nestingLevel = this.getNestingLevel();

    return props;
  },
  //@@viewOff:private

  //@@viewOn:render
  render: function() {
    return (
      <Div {...this._getMainAttrs()} disabled={this.isDisabled()}>
        {this.state.content}
      </Div>
    );
  }
  //@@viewOff:render
});

export default ClickConfirm;
