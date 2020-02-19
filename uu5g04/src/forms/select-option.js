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
import "uu5g04-bricks";
import ns from "./forms-ns.js";

import "./select-option.less";
//@@viewOff:imports

export default UU5.Common.VisualComponent.create({
  displayName: "select-option", // for backward compatibility (test snapshots)
  //@@viewOn:mixins
  mixins: [UU5.Common.BaseMixin, UU5.Common.PureRenderMixin, UU5.Common.ElementaryMixin, UU5.Common.ContentMixin],
  //@@viewOff:mixins

  //@@viewOn:statics
  statics: {
    tagName: ns.name("Select.Option"),
    classNames: {
      main: ns.css("select-option", "group-item")
    },
    errors: {
      invalidParent: "Parent of this component is not Select."
    }
  },
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {
    value: UU5.PropTypes.string.isRequired,
    selectedContent: UU5.PropTypes.any,
    onClick: UU5.PropTypes.func
  },
  //@@viewOff:propTypes

  //@@viewOn:getDefaultProps
  getDefaultProps() {
    return {
      value: null,
      selectedContent: null,
      onClick: null
    };
  },
  //@@viewOff:getDefaultProps

  //@@viewOn:reactLifeCycle
  componentWillMount() {
    // because of auto-completed items
    if (
      !this.getParentByType("isSelect") &&
      !this.getParentByType("isTextInput") &&
      !this.getParentByType("isTagSelect")
    ) {
      this.showError("invalidParent");
    }
  },

  //@@viewOff:reactLifeCycle

  //@@viewOn:interface
  getValue() {
    return this.props.value;
  },

  focus() {
    this._item && this._item.focus();
  },
  //@@viewOff:interface

  //@@viewOn:overriding
  //@@viewOff:overriding

  //@@viewOn:private
  _getMainProps() {
    let props = this.getMainPropsToPass();

    props.onClick = (link, e) => {
      this.props.onClick({ component: this, event: e, value: this.props.value });
    };

    if (!props.content && !this.props.children) {
      props.content = this.props.value;
    }

    props.content =
      props.content == null ? this.props.children && UU5.Common.Children.toArray(this.props.children) : props.content;

    return props;
  },
  //@@viewOff:private

  //@@viewOn:render
  render() {
    return <UU5.Bricks.Link {...this._getMainProps()} ref_={item => (this._item = item)} />;
  }
  //@@viewOff:render
});
