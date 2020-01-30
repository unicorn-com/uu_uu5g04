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
import Css from "./css.js";

import ns from "../forms-ns.js";
//@@viewOff:imports

const AnimatedContainer = UU5.Common.VisualComponent.create({
  displayName: "AnimatedContainer", // for backward compatibility (test snapshots)
  //@@viewOn:mixins
  mixins: [UU5.Common.BaseMixin],
  //@@viewOff:mixins

  //@@viewOn:statics
  statics: {
    tagName: ns.name("MoreSettings"),
    classNames: {
      main: () => ns.css("animated-container"),
      children: (props, state) => {
        let style = `transition: height ${props.animationTime}ms ease-out;padding: 1px 0;`;
        if (state.hidden) {
          style += "visibility: hidden;";
        }
        if (state.height !== "auto") {
          style += `overflow: hidden; height: ${state.height || 0}px;`;
        }
        return Css.css(style);
      }
    }
  },
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {
    opened: UU5.PropTypes.bool,
    unmount: UU5.PropTypes.bool,
    animationTime: UU5.PropTypes.number
  },
  //@@viewOff:propTypes

  //@@viewOn:getDefaultProps
  getDefaultProps() {
    return {
      opened: false,
      unmount: false,
      animationTime: 500
    };
  },
  //@@viewOff:getDefaultProps

  //@@viewOn:reactLifeCycle
  getInitialState() {
    this._childContainerRef = UU5.Common.Reference.create();
    return { opened: false, hidden: true, height: null };
  },

  componentWillReceiveProps(nextProps) {
    if (this.state.opened !== nextProps.opened) {
      this.toggle();
    }
  },

  componentDidUpdate() {
    // if _handleUpdate is set then state.opened is true
    // toggle method alwys set state.opened to true in first step
    if (this._handleUpdate) {
      this._handleUpdate = false;
      if (this._timeout) clearTimeout(this._timeout);
      // component is opened and hidden => measure component height, start animation and show component
      if (this.state.hidden) {
        this.setState({
          hidden: false,
          height: this._childContainerRef.current.scrollHeight
        });
        this._timeout = setTimeout(() => this.setState({ height: "auto" }), this.props.animationTime);
      } else {
        // need to set state asynchronously - otverwise css animation doesn't run
        setTimeout(() => this.setState({ height: 0 }), 0);
        this._timeout = setTimeout(() => this.setState({ opened: false, hidden: true }), this.props.animationTime);
      }
    }
  },
  //@@viewOff:reactLifeCycle

  //@@viewOn:interface
  toggle() {
    this._handleUpdate = true;
    this.setState(state => {
      let result = {};

      // component is not opened yet
      if (!state.opened) {
        result.opened = true;
        result.hidden = true;
        result.height = 0;
      } else {
        result.height = this._childContainerRef.current.scrollHeight;
      }

      return result;
    });
  },
  //@@viewOff:interface

  //@@viewOn:overriding
  //@@viewOff:overriding

  //@@viewOn:private
  //@@viewOff:private

  //@@viewOn:render
  render() {
    let mainAttrs = this.getMainAttrs();
    mainAttrs.className = mainAttrs.className
      ? `${mainAttrs.className} ${this.getClassName("children")}`
      : this.getClassName("children");

    return this.state.opened || !this.props.unmount ? (
      <div {...mainAttrs} ref={this._childContainerRef}>
        {this.props.children}
      </div>
    ) : null;
  }
  //@@viewOff:render
});

export default AnimatedContainer;
