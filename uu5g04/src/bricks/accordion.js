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

import Panel from "./panel.js";

import "./accordion.less";
//@@viewOff:imports

const MOUNT_CONTENT_VALUES = {
  onFirstRender: "onFirstRender",
  onFirstExpand: "onFirstExpand",
  onEachExpand: "onEachExpand"
};

export const Accordion = UU5.Common.VisualComponent.create({
  displayName: "Accordion", // for backward compatibility (test snapshots)
  //@@viewOn:mixins
  mixins: [
    UU5.Common.BaseMixin,
    UU5.Common.ElementaryMixin,
    UU5.Common.NestingLevelMixin,
    UU5.Common.ColorSchemaMixin,
    UU5.Common.ContentMixin,
    UU5.Common.PureRenderMixin,
    UU5.Common.EditableMixin
  ],
  //@@viewOff:mixins

  //@@viewOn:statics
  statics: {
    tagName: ns.name("Accordion"),
    nestingLevelList: UU5.Environment.getNestingLevelList("bigBoxCollection", "box"),
    classNames: {
      main: ns.css("accordion")
    },
    defaults: {
      childTagName: "UU5.Bricks.Panel"
    },
    warnings: {
      unsupportedType: "Type %s of parameter %s is not supported. Allowed types are: %s."
    },
    opt: {
      nestingLevelWrapper: true
    },
    editableComponent: "UU5.BricksEditable.Accordion"
  },
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {
    panels: UU5.PropTypes.arrayOf(UU5.PropTypes.object),
    onClickNotCollapseOthers: UU5.PropTypes.bool,
    iconExpanded: UU5.PropTypes.oneOfType([UU5.PropTypes.string, UU5.PropTypes.object]),
    iconCollapsed: UU5.PropTypes.oneOfType([UU5.PropTypes.string, UU5.PropTypes.object]),
    onClick: UU5.PropTypes.func,
    allowTags: UU5.PropTypes.arrayOf(UU5.PropTypes.string),
    size: UU5.PropTypes.oneOf(["s", "m", "l", "xl"]),
    iconAlign: UU5.PropTypes.oneOf(["right", "after", "left"]),
    openClick: UU5.PropTypes.oneOf(["header", "icon", "none"]),
    preRender: UU5.PropTypes.bool,
    mountPanelContent: UU5.PropTypes.oneOf([
      MOUNT_CONTENT_VALUES.onEachExpand,
      MOUNT_CONTENT_VALUES.onFirstExpand,
      MOUNT_CONTENT_VALUES.onFirstRender
    ])
  },
  //@@viewOff:propTypes

  //@@viewOn:getDefaultProps
  getDefaultProps: function() {
    return {
      panels: null,
      iconExpanded: null,
      iconCollapsed: null,
      onClickNotCollapseOthers: false,
      onClick: null,
      allowTags: [],
      size: "m",
      iconAlign: null,
      openClick: null,
      mountPanelContent: undefined
    };
  },
  //@@viewOff:getDefaultProps

  //@@viewOn:reactLifeCycle
  //@@viewOff:reactLifeCycle

  //@@viewOn:interface
  getPanelById: function(panelId) {
    return this.getRenderedChildById(panelId);
  },

  getPanelByName: function(panelName) {
    return this.getRenderedChildByName(panelName);
  },

  getPanels: function() {
    return this.getRenderedChildren();
  },

  eachPanel: function(callback) {
    var panels = this.getPanels();
    for (var i = 0; i < panels.length; i++) {
      var result = callback(panels[i], i);
      if (result === false) {
        break;
      }
    }
    return this;
  },

  eachPanelByIds: function(ids, callback) {
    for (var i = 0; i < ids.length; i++) {
      var result = callback(this.getPanelById(ids[i]), i);
      if (result === false) {
        break;
      }
    }
    return this;
  },

  eachPanelByNames: function(names, callback) {
    for (var i = 0; i < names.length; i++) {
      var result = callback(this.getPanelByName(names[i]), i);
      if (result === false) {
        break;
      }
    }
    return this;
  },

  expandPanelById: function(panelId, setStateCallback) {
    this._eachPanelByIdWithCallback(panelId, setStateCallback, function(panel, i, newSetStateCallback) {
      panel.expand(newSetStateCallback);
    });
    return this;
  },

  expandPanelByName: function(panelName, setStateCallback) {
    this._eachPanelByNameWithCallback(panelName, setStateCallback, function(panel, i, newSetStateCallback) {
      panel.expand(newSetStateCallback);
    });
    return this;
  },

  collapsePanelById: function(panelId, setStateCallback) {
    this._eachPanelByIdWithCallback(panelId, setStateCallback, function(panel, i, newSetStateCallback) {
      panel.collapse(newSetStateCallback);
    });
    return this;
  },

  collapsePanelByName: function(panelName, setStateCallback) {
    this._eachPanelByNameWithCallback(panelName, setStateCallback, function(panel, i, newSetStateCallback) {
      panel.collapse(newSetStateCallback);
    });
    return this;
  },

  togglePanelById: function(panelId, setStateCallback) {
    this._eachPanelByIdWithCallback(panelId, setStateCallback, function(panel, i, newSetStateCallback) {
      panel.toggle(newSetStateCallback);
    });
    return this;
  },

  togglePanelByName: function(panelName, setStateCallback) {
    this._eachPanelByNameWithCallback(panelName, setStateCallback, function(panel, i, newSetStateCallback) {
      panel.toggle(newSetStateCallback);
    });
    return this;
  },

  expandAll: function(setStateCallback) {
    this._eachPanelWithCallback(setStateCallback, function(panel, i, newSetStateCallback) {
      panel.expand(newSetStateCallback);
    });
    return this;
  },

  collapseAll: function(setStateCallback) {
    this._eachPanelWithCallback(setStateCallback, function(panel, i, newSetStateCallback) {
      panel.collapse(newSetStateCallback);
    });
    return this;
  },

  toggleAll: function(setStateCallback) {
    this._eachPanelWithCallback(setStateCallback, function(panel, i, newSetStateCallback) {
      panel.toggle(newSetStateCallback);
    });
    return this;
  },

  shouldCollapseOthers: function() {
    return !this.props.onClickNotCollapseOthers;
  },

  collapseOthers: function(panelId, setStateCallback) {
    var panels = this.getPanels();

    var counter = 0;
    panels.forEach(function(panel) {
      panel.getId() !== panelId && panel.isExpandable() && counter++;
    });

    if (counter > 0) {
      var newSetStateCallback = UU5.Common.Tools.buildCounterCallback(setStateCallback, counter);
      panels.forEach(function(panel) {
        panel.getId() !== panelId && panel.isExpandable() && panel.collapse(newSetStateCallback);
      });
    } else if (typeof setStateCallback === "function") {
      setStateCallback();
    }

    return this;
  },
  //@@viewOff:interface

  //@@viewOn:overriding
  shouldChildRender_: function(child) {
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

  expandChildProps_: function(child, i) {
    var newChildProps = { ...child.props };
    var onClick = newChildProps.onClick || this.props.onClick;

    newChildProps.onClick = this.shouldCollapseOthers()
      ? panel => {
          panel && panel.isExpanded()
            ? this.collapseOthers(panel.getId(), () => onClick && onClick(panel))
            : child.props.onClick
            ? child.props.onClick(panel)
            : this.props.onClick
            ? this.props.onClick(panel)
            : null;
        }
      : child.props.onClick || this.props.onClick;
    newChildProps.iconExpanded = newChildProps.iconExpanded || this.props.iconExpanded;
    newChildProps.iconCollapsed = newChildProps.iconCollapsed || this.props.iconCollapsed;
    newChildProps.colorSchema = newChildProps.colorSchema || this.props.colorSchema;
    if (!newChildProps.iconAlign) {
      newChildProps.iconAlign = this.props.iconAlign;
    }
    if (!newChildProps.openClick) {
      newChildProps.openClick = this.props.openClick;
    }
    newChildProps.size = this.props.size;
    newChildProps.mountContent =
      newChildProps.mountContent !== undefined ? newChildProps.mountContent : this.props.mountPanelContent;
    return newChildProps;
  },
  //@@viewOff:overriding

  //@@viewOn:private
  _getValuesAsArray: function(value, name) {
    var values = [];

    if (typeof value === "string") {
      values = [value];
    } else if (Array.isArray(value)) {
      values = value;
    } else {
      this.showWarning("unsupportedType", [typeof value, name, "string, array"]);
    }

    return values;
  },

  _eachPanelWithCallback: function(setStateCallback, callback) {
    var panels = this.getPanels();
    var newSetStateCallback = UU5.Common.Tools.buildCounterCallback(setStateCallback, panels.length);

    for (var i = 0; i < panels.length; i++) {
      var result = callback(panels[i], i, newSetStateCallback);
      if (result === false) {
        break;
      }
    }

    return this;
  },

  _eachPanelByIdWithCallback: function(panelId, setStateCallback, callback) {
    var ids = this._getValuesAsArray(panelId, "panelId");
    var newSetStateCallback = UU5.Common.Tools.buildCounterCallback(setStateCallback, ids.length);

    this.eachPanelByIds(ids, function(panel, i) {
      return callback(panel, i, newSetStateCallback);
    });

    return this;
  },

  _eachPanelByNameWithCallback: function(panelName, setStateCallback, callback) {
    var names = this._getValuesAsArray(panelName, "panelName");
    var newSetStateCallback = UU5.Common.Tools.buildCounterCallback(setStateCallback, names.length);

    this.eachPanelByNames(names, function(panel, i) {
      return callback(panel, i, newSetStateCallback);
    });

    return this;
  },
  //@@viewOff:private

  //Render
  _buildChildren: function() {
    var childrenProps = {};
    if (this.props.panels) {
      childrenProps.content = { tag: this.getDefault().childTagName, propsArray: this.props.panels };
    } else if (this.getContent()) {
      childrenProps.content = this.getContent();
    } else if (this.props.children) {
      childrenProps.children = this.props.children;
    } else {
      childrenProps.content = <Panel />;
    }

    return this.buildChildren(childrenProps);
  },

  //@@viewOn:render
  render: function() {
    return this.getNestingLevel() ? (
      <div {...this.getMainAttrs()}>
        {this._buildChildren()}
        {this.getDisabledCover()}
      </div>
    ) : null;
  }
  //@@viewOff:render
});

export default Accordion;
