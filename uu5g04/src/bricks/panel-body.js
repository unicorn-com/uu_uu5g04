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

import UpdateWrapper from "./update-wrapper.js";
import Css from "./internal/css.js";
import PanelStyles from "./internal/panel-styles.js";

import "./panel-body.less";
//@@viewOff:imports

const ClassNames = UU5.Common.ClassNames;
const Styles = {
  bgStyles: props => {
    // Only default colorSchema is here right now. Others are in .less files
    // let styles = Object.keys(UU5.Environment.colorSchemaMap).map(colorSchema => {
    let styles = ["default"].map(colorSchema => {
      let colors = PanelStyles.getColors(colorSchema, props.bgStyle);

      if (!colors) {
        // Something went wrong. Maybe the colorSchema doesn't exist
        return "";
      }

      let style = `
        &.uu5-bricks-panel-body.uu5-bricks-panel-body {
          color: ${colors.textColor};
          background-color: ${colors.bgColor};
          border-color: ${colors.borderColor};
        }
      `;

      return `
        &:not([class*="color-schema-"]),
        &.color-schema-${colorSchema},
        .color-schema-${colorSchema}  &:not([class*="color-schema-"]) {
          ${style}
        }
      `;
    });

    return Css.css(styles.join(" "));
  }
};

export default UU5.Common.VisualComponent.create({
  displayName: "panel-body", // for backward compatibility (test snapshots)
  //@@viewOn:mixins
  mixins: [
    UU5.Common.BaseMixin,
    UU5.Common.PureRenderMixin,
    UU5.Common.ElementaryMixin,
    UU5.Common.ContentMixin,
    UU5.Common.ColorSchemaMixin
  ],
  //@@viewOff:mixins

  //@@viewOn:statics
  statics: {
    tagName: ns.name("Panel.Body"),
    classNames: {
      main: ns.css("panel-body"),
      body: ns.css("panel-body-body"),
      block: ns.css("panel-body-block"),
      expanding: ns.css("panel-body-expanding"),
      bgStyles: Styles.bgStyles,
      preventOverflow: Css.css(`
        overflow: hidden;
      `)
    },
    defaults: {
      parentTagName: "UU5.Bricks.Panel",
      duration: 250
    },
    errors: {
      invalidParent: "Parent of this component is not Panel."
    }
  },
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {
    _expanded: UU5.PropTypes.bool,
    _preventUpdateChild: UU5.PropTypes.bool,
    bgStyle: UU5.PropTypes.oneOf(["filled", "outline", "transparent", "underline"])
  },
  //@@viewOff:propTypes

  //@@viewOn:getDefaultProps
  getDefaultProps: function() {
    return {
      _expanded: false,
      _preventUpdateChild: false,
      bgStyle: null
    };
  },
  //@@viewOff:getDefaultProps

  //@@viewOn:reactLifeCycle
  getInitialState: function() {
    this._preventUpdateChild = false;
    return {
      height: this.props._expanded ? null : this._getHeight(this.props),
      isAnimating: this.props._expanded
    };
  },

  componentWillMount: function() {
    let parent = this.getParent();

    if (parent) {
      while (parent.getOpt("parentWrapper")) {
        parent = parent.getParent();
      }
    }

    if (!(parent && parent.isPanel)) {
      this.showError("invalidParent");
    }
  },

  componentWillReceiveProps: function(nextProps) {
    let body = this;
    let height = this._getHeight(nextProps);
    let isAnimating = this.props._expanded !== nextProps._expanded;

    if (nextProps._expanded !== this.props._expanded) {
      if (height) {
        // open panel body
        this._preventUpdateChild = false;
        this.setState({ height, isAnimating }, function() {
          body.timer && clearTimeout(body.timer);
          body.timer = setTimeout(() => {
            // block rerender of childs - only change styles of current component
            this._preventUpdateChild = true;
            body.setAsyncState({ height: null, isAnimating: false }, () => (this._preventUpdateChild = false));
          }, body.getDefault().duration);
        });
      } else if (isAnimating) {
        // close panel body
        // prevent rerendering of children until end of animation
        this._preventUpdateChild = true;
        this.setState({ height: this._getHeight(this.props), isAnimating: true }, () => {
          body.timer && clearTimeout(body.timer);
          body.timer = setTimeout(() => {
            this._preventUpdateChild = true;
            body.setAsyncState({ height });
            body.timer = setTimeout(() => {
              // rerender panel after end of animation
              this._preventUpdateChild = false;
              this.setAsyncState({ isAnimating: false });
            }, body.getDefault().duration);
          }, 1);
        });
      } else {
        this.setState({ height: this._getHeight(this.props) }, () => {
          body.timer && clearTimeout(body.timer);
          body.timer = setTimeout(() => {
            this._preventUpdateChild = true;
            body.setAsyncState({ height }, () => {
              this._preventUpdateChild = false;
              this.forceUpdate();
            });
          }, 1);
        });
      }
    }
  },

  componentWillUnmount: function() {
    this.timer && clearTimeout(this.timer);
  },
  //@@viewOff:reactLifeCycle

  //@@viewOn:interface
  //@@viewOff:interface

  //@@viewOn:overriding
  //@@viewOff:overriding

  //@@viewOn:private
  _getPanelBodyId: function() {
    return this.getId() + "-content";
  },

  _getHeight: function(props) {
    let result;
    if (props._expanded) {
      let element = this._panelBody;
      element && (result = UU5.Common.Tools.getOuterHeight(element, true));
    } else {
      result = 0;
    }
    return result;
  },
  //@@viewOff:private

  // Render
  _getMainAttrs: function() {
    var mainAttrs = this.getMainAttrs();

    mainAttrs.className += " " + this.getClassName("bgStyles");

    if (this.state.height === null) {
      mainAttrs.className += " " + this.getClassName("block");
    } else {
      if (this.state.height > 0) {
        mainAttrs.className += " " + this.getClassName("expanding");
      }

      if (this.state.isAnimating || !this.state.height) {
        mainAttrs.className += " " + this.getClassName("preventOverflow");

        mainAttrs.style = mainAttrs.style || {};
        mainAttrs.style.height = this.state.height + "px";

        var time = this.getDefault().duration / 1000;
        [
          "WebkitTransitionDuration",
          "MozTransitionDuration",
          "MsTransitionDuration",
          "OTransitionDuration",
          "transitionDuration"
        ].forEach(function(style) {
          mainAttrs.style[style] = time + "s";
        });
      }
    }

    if (this.props.bgStyle && !this.props.bgStyleContent) {
      mainAttrs.className += " " + ClassNames[this.props.bgStyle];
    } else if (this.props.bgStyleContent) {
      mainAttrs.className += " " + ClassNames[this.props.bgStyleContent];
    }
    if (this.props.borderRadius) {
      mainAttrs.style.borderRadius = this.props.borderRadius;
    }
    if (!this.props.bgStyleContent && this.props.colorSchema) {
      mainAttrs.className += " " + ClassNames["filled"];
    }

    return mainAttrs;
  },

  _buildChildren: function() {
    return this.buildChildren();
  },
  //@@viewOff:private

  //@@viewOn:render
  render: function() {
    return (
      <div {...this._getMainAttrs()}>
        <UpdateWrapper preventRender={this._preventUpdateChild || this.props._preventUpdateChild}>
          <div
            className={this.getClassName().body}
            id={this._getPanelBodyId()}
            ref={panelBody => (this._panelBody = panelBody)}
          >
            {this._buildChildren()}
          </div>
        </UpdateWrapper>
        {this.getDisabledCover()}
      </div>
    );
  }
  //@@viewOff:render
});
