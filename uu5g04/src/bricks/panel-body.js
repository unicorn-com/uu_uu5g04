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

import React from 'react';
import createReactClass from 'create-react-class';
import PropTypes from 'prop-types';
import * as UU5 from "uu5g04";
import ns from "./bricks-ns.js";
import ClassNames from '../core/common/class-names.js';
import UpdateWrapper from "./update-wrapper.js";

import './panel-body.less';

export default createReactClass({

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
      expanding: ns.css("panel-body-expanding")
    },
    defaults: {
      parentTagName: 'UU5.Bricks.Panel',
      duration: 250
    },
    errors: {
      invalidParent: 'Parent of this component is not Panel.'
    }
  },
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {
    _expanded: PropTypes.bool,
    _preventUpdateChild: PropTypes.bool,
    bgStyle: PropTypes.oneOf(['filled', 'outline', 'transparent', 'underline']),
  },
  //@@viewOff:propTypes

  //@@viewOn:getDefaultProps
  getDefaultProps: function () {
    return {
      _expanded: false,
      _preventUpdateChild: false,
      bgStyle: null
    };
  },
  //@@viewOff:getDefaultProps

  //@@viewOn:standardComponentLifeCycle
  getInitialState: function () {
    this._preventUpdateChild = false;
    return {
      height: this._getHeight(this.props)
    };
  },

  componentWillMount: function () {
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

  componentWillReceiveProps: function (nextProps) {
    var body = this;
    var height = this._getHeight(nextProps);

    if (height) {
      // open panel body
      this._preventUpdateChild = false;
      this.setState({ height: height }, function() {
        body.timer && clearTimeout(body.timer);
        body.timer = setTimeout(() => {
          // block rerender of childs - only change styles of current component
          this._preventUpdateChild = true;
          body.setAsyncState({ height: null }, () => (this._preventUpdateChild = false));
        }, body.getDefault().duration);
      });
    } else if (nextProps._expanded !== this.props._expanded) {
      // close panel body
      // prevent rerendering of children until end of animation
      this._preventUpdateChild = true;
      this.setState({ height: this._getHeight(this.props) }, () => {
        body.timer && clearTimeout(body.timer);
        body.timer = setTimeout(() => {
          this._preventUpdateChild = true;
          body.setAsyncState({ height: height });
          body.timer = setTimeout(() => {
            // rerender panel after end of animation
            this._preventUpdateChild = false;
            this.forceUpdate();
          }, body.getDefault().duration);
        }, 1);
      });
    } else {
      this.setState({ height: this._getHeight(this.props) }, () => {
        body.timer && clearTimeout(body.timer);
        body.timer = setTimeout(() => {
          this._preventUpdateChild = true;
          body.setAsyncState({ height: height }, () => {
            this._preventUpdateChild = false;
            this.forceUpdate();
          });
        }, 1);
      });
    }
  },

  componentWillUnmount: function () {
    this.timer && clearTimeout(this.timer);
  },

  //@@viewOff:standardComponentLifeCycle

  //@@viewOn:interface
  //@@viewOff:interface

  //@@viewOn:overridingMethods
  //@@viewOff:overridingMethods

  //@@viewOn:componentSpecificHelpers
  _getPanelBodyId: function () {
    return this.getId() + '-content';
  },

  _getHeight: function (props) {
    let result;
    if (props._expanded) {
      let element = this._panelBody;
      element && (result = UU5.Common.Tools.getOuterHeight(element, true));
    } else {
      result = 0;
    }
    return result;
  },
  //@@viewOff:componentSpecificHelpers

  // Render
  _getMainAttrs: function () {
    var mainAttrs = this.getMainAttrs();

    if (this.state.height === null) {
      mainAttrs.className += ' ' + this.getClassName().block;
    } else {
      this.state.height > 0 && (mainAttrs.className += ' ' + this.getClassName().expanding);

      mainAttrs.style = mainAttrs.style || {};
      mainAttrs.style.height = this.state.height + 'px';

      var time = this.getDefault().duration / 1000;
      ['WebkitTransitionDuration', 'MozTransitionDuration', 'MsTransitionDuration',
        'OTransitionDuration', 'transitionDuration'].forEach(function (style) {
        mainAttrs.style[style] = time + 's';
      });
    }

    if (this.props.bgStyle && !this.props.bgStyleContent) {
      mainAttrs.className += " " + ClassNames[this.props.bgStyle];
    } else if(this.props.bgStyleContent){
      mainAttrs.className += " " + ClassNames[this.props.bgStyleContent];
    }
    if(this.props.borderRadius){
      mainAttrs.style.borderRadius = this.props.borderRadius;
    }
    if(!this.props.bgStyleContent && this.props.colorSchema){
      mainAttrs.className += " " + ClassNames["filled"];
    }

    return mainAttrs;
  },

  _buildChildren: function () {
    return this.buildChildren();
  },

  //@@viewOn:render
  render: function () {
    // console.log(`prevent render in panel body: this: ${this._preventUpdateChild}, props: ${this.props._preventUpdateChild}`);
    return (
      <div {...this._getMainAttrs()}>
        <UpdateWrapper preventRender={this._preventUpdateChild || this.props._preventUpdateChild}>
          <div className={this.getClassName().body} id={this._getPanelBodyId()}
                ref={(panelBody) => this._panelBody = panelBody}>
            {this._buildChildren()}
          </div>
        </UpdateWrapper>
        {this.getDisabledCover()}
      </div>
    );
  }
  //@@viewOff:render
});
