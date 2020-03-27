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

import "./item-list.less";
//@@viewOff:imports

export default UU5.Common.VisualComponent.create({
  displayName: "item-list", // for backward compatibility (test snapshots)

  //@@viewOn:mixins
  mixins: [UU5.Common.BaseMixin, UU5.Common.ElementaryMixin, UU5.Common.SectionMixin],
  //@@viewOff:mixins

  //@@viewOn:statics
  statics: {
    tagName: ns.name("ItemList"),
    classNames: {
      main: ns.css("item-list"),
      header: ns.css("item-list-header"),
      body: ns.css("item-list-body"),
      footer: ns.css("item-list-footer"),
      selectedItem: ns.css("item-list-selected uu5-common-bg")
    },
    defaults: {
      childTagName: "UU5.Forms.Select.Option"
    }
  },
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {
    allowTags: UU5.PropTypes.arrayOf(UU5.PropTypes.string)
  },
  //@@viewOff:propTypes

  //@@viewOn:getDefaultProps
  getDefaultProps: function() {
    return {
      allowTags: []
    };
  },
  //@@viewOff:getDefaultProps

  //@@viewOn:reactLifeCycle
  //@@viewOff:reactLifeCycle

  //@@viewOn:interface
  changeValue(index, e, setStateCallback) {
    let opt = { value: index, event: e, component: this, setStateCallback: setStateCallback };
    if (typeof this.props.onChange === "function") {
      this.props.onChange(opt);
    } else {
      this.onChangeDefault(opt);
    }
  },

  onChangeDefault(opt) {
    typeof opt.setStateCallback === "function" && opt.setStateCallback();

    return this;
  },

  open(opt, setStateCallback) {
    opt.bodyClassName = this.getClassName().body;
    opt.headerClassName = this.getClassName().header;
    opt.footerClassName = this.getClassName().footer;

    if (!this.isHidden()) {
      this._popover.open(opt, setStateCallback);
    }
    return this;
  },

  close(setStateCallback) {
    this._popover.close(setStateCallback);
    return this;
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

  expandChildProps_(child, i) {
    var props = { ...child.props };

    if (this.props.value && this.props.value.find(value => value === child.props.value)) {
      props.selected = true;
      props.className = props.className
        ? props.className + " " + this.getClassName().selectedItem
        : this.getClassName().selectedItem;
      props.colorSchema = "info";
    }

    props.mainAttrs = props.mainAttrs || {};
    props.mainAttrs.id = this.getId() + "-item-" + i;

    var childOnClick = props.onClick;
    props.onClick = opt => {
      this.changeValue(opt.value, opt.event, childOnClick);
    };

    return props;
  },

  getRenderedChildren_() {
    return this._popover.getRenderedChildren();
  },

  getRenderedChildrenIdList_() {
    return this._popover.getRenderedChildrenIdList();
  },

  getRenderedChildrenNameList_() {
    return this._popover.getRenderedChildrenNameList();
  },
  //@@viewOff:overriding

  //@@viewOn:private
  _getHeader() {
    let result;
    if (this.props.header) {
      result = <div className={this.getClassName().header}>{this.getHeader()}</div>;
    }
    return result;
  },

  _getFooter() {
    let result;
    if (this.props.footer) {
      result = <div className={this.getClassName().footer}>{this.getFooter()}</div>;
    }
    return result;
  },

  _getMainProps() {
    let props = this.getMainPropsToPass();

    props.ref_ = ref => (this._popover = ref);
    props.disableBackdrop = true;
    props.shown = !this.isHidden();
    props.fitHeightToViewport = true;
    props.forceRender = true;
    props.header = this.getHeader();
    props.footer = this._getFooter();

    return props;
  },
  //@@viewOff:private

  //@@viewOn:render
  render: function() {
    return <UU5.Bricks.Popover {...this._getMainProps()}>{this.getChildren()}</UU5.Bricks.Popover>;
  }
  //@@viewOn:render
});
