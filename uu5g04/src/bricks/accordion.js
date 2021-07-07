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

//@@viewOn:revision
//  coded: Petr Bišof 18.12.2020
//  reviewed: Martin Mach 22.12.2020
//@@viewOff:revision

//@@viewOn:imports
import * as UU5 from "uu5g04";
import ns from "./bricks-ns.js";

import Panel from "./panel.js";
import Css from "./internal/css.js";
import { InlineMode } from "./internal/inline-mode.js";
import Lsi from "./bricks-lsi.js";

import "./accordion.less";
const EditationComponent = UU5.Common.Component.lazy(async () => {
  await SystemJS.import("uu5g04-forms");
  await SystemJS.import("uu5g04-bricks-editable");
  return import("./internal/accordion-editable.js");
});
//@@viewOff:imports

let editationLazyLoaded = false;
const MOUNT_CONTENT_VALUES = {
  onFirstRender: "onFirstRender",
  onFirstExpand: "onFirstExpand",
  onEachExpand: "onEachExpand",
};

const CLASS_NAMES = {
  inline: (renderDots) => {
    let dots = renderDots ? "..." : "";
    return Css.css(`
      & > *{
        pointer-events: none;
        &::after {
          content: ", ";
        }
        &:last-child{
          &::after {
            content: "${dots}";
          }
        }
      }
    `);
  },
};

let Accordion = UU5.Common.VisualComponent.create({
  displayName: "Accordion", // for backward compatibility (test snapshots)
  //@@viewOn:mixins
  mixins: [
    UU5.Common.BaseMixin,
    UU5.Common.ElementaryMixin,
    UU5.Common.NestingLevelMixin,
    UU5.Common.ColorSchemaMixin,
    UU5.Common.ContentMixin,
    UU5.Common.PureRenderMixin,
    UU5.Common.EditableMixin,
  ],
  //@@viewOff:mixins

  //@@viewOn:statics
  statics: {
    tagName: ns.name("Accordion"),
    nestingLevelList: UU5.Environment.getNestingLevelList("bigBoxCollection", "box"),
    classNames: {
      main: ns.css("accordion"),
    },
    defaults: {
      validChildTagName: "UU5.Bricks.Panel", // different key name than usual because of DCC (do not rename!)
    },
    warnings: {
      unsupportedType: "Type %s of parameter %s is not supported. Allowed types are: %s.",
    },
    opt: {
      nestingLevelWrapper: true,
    },
    editMode: {
      name: Lsi.inlineComponentHeaders.accordionName,
      backgroundColor: "rgba(0,0,0,.2)",
      color: "rgba(0,0,0,.87)",
      highlightColor: "#CCCCCC",
      startMode: "button",
    },
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
    mountPanelContent: UU5.PropTypes.oneOf([
      MOUNT_CONTENT_VALUES.onEachExpand,
      MOUNT_CONTENT_VALUES.onFirstExpand,
      MOUNT_CONTENT_VALUES.onFirstRender,
    ]),
  },
  //@@viewOff:propTypes

  //@@viewOn:getDefaultProps
  getDefaultProps: function () {
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
      mountPanelContent: undefined,
      contentEditable: true,
    };
  },
  //@@viewOff:getDefaultProps

  //@@viewOn:reactLifeCycle
  //@@viewOff:reactLifeCycle

  //@@viewOn:interface
  getPanelById: function (panelId) {
    return this.getRenderedChildById(panelId);
  },

  getPanelByName: function (panelName) {
    return this.getRenderedChildByName(panelName);
  },

  getPanels: function () {
    return this.getRenderedChildren();
  },

  eachPanel: function (callback) {
    var panels = this.getPanels();
    for (var i = 0; i < panels.length; i++) {
      var result = callback(panels[i], i);
      if (result === false) {
        break;
      }
    }
    return this;
  },

  eachPanelByIds: function (ids, callback) {
    for (var i = 0; i < ids.length; i++) {
      var result = callback(this.getPanelById(ids[i]), i);
      if (result === false) {
        break;
      }
    }
    return this;
  },

  eachPanelByNames: function (names, callback) {
    for (var i = 0; i < names.length; i++) {
      var result = callback(this.getPanelByName(names[i]), i);
      if (result === false) {
        break;
      }
    }
    return this;
  },

  expandPanelById: function (panelId, setStateCallback) {
    this._eachPanelByIdWithCallback(panelId, setStateCallback, function (panel, i, newSetStateCallback) {
      panel.expand(newSetStateCallback);
    });
    return this;
  },

  expandPanelByName: function (panelName, setStateCallback) {
    this._eachPanelByNameWithCallback(panelName, setStateCallback, function (panel, i, newSetStateCallback) {
      panel.expand(newSetStateCallback);
    });
    return this;
  },

  collapsePanelById: function (panelId, setStateCallback) {
    this._eachPanelByIdWithCallback(panelId, setStateCallback, function (panel, i, newSetStateCallback) {
      panel.collapse(newSetStateCallback);
    });
    return this;
  },

  collapsePanelByName: function (panelName, setStateCallback) {
    this._eachPanelByNameWithCallback(panelName, setStateCallback, function (panel, i, newSetStateCallback) {
      panel.collapse(newSetStateCallback);
    });
    return this;
  },

  togglePanelById: function (panelId, setStateCallback) {
    this._eachPanelByIdWithCallback(panelId, setStateCallback, function (panel, i, newSetStateCallback) {
      panel.toggle(newSetStateCallback);
    });
    return this;
  },

  togglePanelByName: function (panelName, setStateCallback) {
    this._eachPanelByNameWithCallback(panelName, setStateCallback, function (panel, i, newSetStateCallback) {
      panel.toggle(newSetStateCallback);
    });
    return this;
  },

  expandAll: function (setStateCallback) {
    this._eachPanelWithCallback(setStateCallback, function (panel, i, newSetStateCallback) {
      panel.expand(newSetStateCallback);
    });
    return this;
  },

  collapseAll: function (setStateCallback) {
    this._eachPanelWithCallback(setStateCallback, function (panel, i, newSetStateCallback) {
      panel.collapse(newSetStateCallback);
    });
    return this;
  },

  toggleAll: function (setStateCallback) {
    this._eachPanelWithCallback(setStateCallback, function (panel, i, newSetStateCallback) {
      panel.toggle(newSetStateCallback);
    });
    return this;
  },

  shouldCollapseOthers: function () {
    return !this.props.onClickNotCollapseOthers;
  },

  collapseOthers: function (panelId, setStateCallback) {
    var panels = this.getPanels();

    var counter = 0;
    panels.forEach(function (panel) {
      if (typeof panel.isExpandable === "function") {
        panel.getId() !== panelId && panel.isExpandable() && counter++;
      }
    });

    if (counter > 0) {
      var newSetStateCallback = UU5.Common.Tools.buildCounterCallback(setStateCallback, counter);
      panels.forEach(function (panel) {
        if (typeof panel.isExpandable === "function") {
          panel.getId() !== panelId && panel.isExpandable() && panel.collapse(newSetStateCallback);
        }
      });
    } else if (typeof setStateCallback === "function") {
      setStateCallback();
    }

    return this;
  },
  //@@viewOff:interface

  //@@viewOn:overriding
  shouldChildRender_: function (child) {
    let childTagName = UU5.Common.Tools.getChildTagName(child);
    let defaultChildTagName = this.getDefault().validChildTagName;

    let childTagNames = this.props.allowTags.concat(defaultChildTagName);
    let result = childTagNames.indexOf(childTagName) > -1 || childTagName === "UuDcc.Bricks.ComponentWrapper";

    if (!result && (typeof child !== "string" || child.trim())) {
      if (childTagName)
        this.showError("childTagNotAllowed", [childTagName, this.getTagName(), childTagName, defaultChildTagName], {
          mixinName: "UU5.Common.BaseMixin",
        });
      else this.showError("childNotAllowed", [child, defaultChildTagName], { mixinName: "UU5.Common.BaseMixin" });
    }
    return result;
  },

  expandChildProps_: function (child, i) {
    var newChildProps = { ...child.props };
    var onClick = newChildProps.onClick || this.props.onClick;

    newChildProps.onClick = this.shouldCollapseOthers()
      ? (panel) => {
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

  onBeforeForceEndEditation_() {
    return this._editableComponent ? this._editableComponent.getPropsToSave() : undefined;
  },
  //@@viewOff:overriding

  //@@viewOn:private
  _registerNull(inst) {
    // unmount of component means that suspense is loaded and component should be rendered
    if (!inst) {
      this.setState((state) => {
        if (state.editationLazyLoaded) return;

        // Edit component is loaded - need to set to static variable because other Edit component does not render fallback component
        // editationLazyLoaded is stored in both state and static variable for cases such as when more edit modes are loaded at the same time
        editationLazyLoaded = true;
        return { editationLazyLoaded: true };
      });
    }
  },

  _isEditationLazyLoaded() {
    return editationLazyLoaded;
  },

  _renderEditationMode(inline = false) {
    return (
      <UU5.Common.Suspense fallback={<span ref={this._registerNull} />}>
        <EditationComponent inline={inline} component={this} ref_={this._registerEditableComponent} />
      </UU5.Common.Suspense>
    );
  },

  _registerEditableComponent(component) {
    this._editableComponent = component;
  },

  _getValuesAsArray: function (value, name) {
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

  _eachPanelWithCallback: function (setStateCallback, callback) {
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

  _eachPanelByIdWithCallback: function (panelId, setStateCallback, callback) {
    var ids = this._getValuesAsArray(panelId, "panelId");
    var newSetStateCallback = UU5.Common.Tools.buildCounterCallback(setStateCallback, ids.length);

    this.eachPanelByIds(ids, function (panel, i) {
      return callback(panel, i, newSetStateCallback);
    });

    return this;
  },

  _eachPanelByNameWithCallback: function (panelName, setStateCallback, callback) {
    var names = this._getValuesAsArray(panelName, "panelName");
    var newSetStateCallback = UU5.Common.Tools.buildCounterCallback(setStateCallback, names.length);

    this.eachPanelByNames(names, function (panel, i) {
      return callback(panel, i, newSetStateCallback);
    });

    return this;
  },

  _buildChildren: function () {
    var childrenProps = {};
    if (this.props.panels) {
      childrenProps.content = { tag: this.getDefault().validChildTagName, propsArray: this.props.panels };
    } else if (this.getContent()) {
      childrenProps.content = this.getContent();
    } else if (this.props.children) {
      childrenProps.children = this.props.children;
    } else {
      childrenProps.content = <Panel />;
    }

    return this.buildChildren(childrenProps);
  },

  _prepareInlineTitle: function () {
    let titles = this._buildChildren();
    let renderDots = titles.length > 3 ? true : false;
    if (Array.isArray(titles)) {
      titles = titles.slice(0, 3);

      return <span className={CLASS_NAMES.inline(renderDots)}>{titles.map((header) => header)}</span>;
    }
    return undefined;
  },
  //@@viewOff:private

  //@@viewOn:render
  render: function () {
    return this.getNestingLevel() ? (
      <div {...this.getMainAttrs()}>
        <>
          {this.state.editation ? this._renderEditationMode() : null}
          {!this.state.editation || !this._isEditationLazyLoaded() ? (
            <>
              {this._buildChildren()}
              {this.getDisabledCover()}
            </>
          ) : null}
        </>
      </div>
    ) : (
      <InlineMode
        component={this}
        Component={UU5.Bricks.Accordion}
        editModalHeader={<UU5.Bricks.Lsi lsi={Lsi.inlineComponentHeaders.accordionEditHeader} />}
        linkTitle={this._prepareInlineTitle() || <UU5.Bricks.Lsi lsi={Lsi.inlineComponentHeaders.accordionName} />}
        modalHeader={<UU5.Bricks.Lsi lsi={Lsi.inlineComponentHeaders.accordionName} />}
        getPropsToSave={this._editableSection ? this._editableSection : undefined}
        renderEditationMode={this._renderEditationMode}
      />
    );
  },
  //@@viewOff:render
});

export { Accordion };
export default Accordion;
