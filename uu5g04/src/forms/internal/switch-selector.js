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
import React from "react";
import createReactClass from "create-react-class";
import * as UU5 from "uu5g04";
import PropTypes from "prop-types";
import "uu5g04-bricks";
import ns from "./forms-ns.js";
import InputMixin from "./mixins/input-mixin.js";
import Context from "./form-context.js";
import SwitchSelectorBody from "./internal/switch-selector-body.js";
import Select from "./select.js";
import Css from "./internal/css.js";
//@@viewOff:imports

const hiddenBodyExcludedProps = [
  "id",
  "mainAttrs",
  "editable",
  "contentEditable",
  "onChange",
  "onValidate",
  "onChangeFeedback",
  "inputAttrs"
];

const selectExcludedProps = ["items", "children", "content"];

export const SwitchSelector = UU5.Bricks.Resize.withResize(
  Context.withContext(
    createReactClass({
      //@@viewOn:mixins
      mixins: [UU5.Common.BaseMixin, UU5.Common.ElementaryMixin, InputMixin],
      //@@viewOff:mixins

      //@@viewOn:statics
      statics: {
        tagName: ns.name("SwitchSelector"),
        classNames: {
          main: ns.css("switch-selector"),
          hiddenWrapper: Css.css`
            position: absolute;
            left: 0;
            right: 0;
            visibility: hidden;
            overflow: hidden;
          `
        }
      },
      //@@viewOff:statics

      //@@viewOn:propTypes
      propTypes: {
        width: PropTypes.number,
        items: SwitchSelectorBody.propTypes.items,
        ref_: PropTypes.func
      },
      //@@viewOff:propTypes

      //@@viewOn:getDefaultProps
      getDefaultProps() {
        return {
          width: undefined
        };
      },
      //@@viewOff:getDefaultProps

      //@@viewOn:reactLifeCycle
      getInitialState() {
        return { displaySelect: false, value: undefined };
      },

      componentDidMount() {
        this.setState(() => ({ displaySelect: this._isOverflowing() }));
      },

      componentWillReceiveProps(nextProps) {
        if (nextProps.controlled) {
          let value;

          if (this.state.)
          let value = nextProps.value || this.state.value || nextProps.items[0].value;
          if (typeof this.props.onValidate === "function") {
            this._validateOnChange({ value, component: this }, true);
          } else {
            this.setFeedback(nextProps.feedback, nextProps.message, value);
          }
        }
      },

      componentDidUpdate(prevProps) {
        if (prevProps.width !== this.props.width) {
          this.setState(() => ({ displaySelect: this._isOverflowing() }));
        }
      },
      //@@viewOff:reactLifeCycle

      //@@viewOn:interface
      //@@viewOff:interface

      //@@viewOn:overriding
      //@@viewOff:overriding

      //@@viewOn:private
      _registerBody(ref) {
        this._bodyRef = ref;

        if (typeof this.props.ref_ === "function") {
          this.props.ref_(ref);
        }
      },

      _registerHiddenBody(ref) {
        this._bodyRef = ref;
      },

      _isOverflowing() {
        const root = UU5.Common.DOM.findNode(this._bodyRef);
        const inputWrapper = root.querySelector(".uu5-forms-input-wrapper");
        const buttonWrapper = inputWrapper.querySelector(".uu5-bricks-switch-selector");

        const inputWrapperWidth = inputWrapper.offsetWidth;
        const buttonWrapperWidth = buttonWrapper.offsetWidth;

        return buttonWrapperWidth > inputWrapperWidth;
      },

      _getBody() {
        return <SwitchSelectorBody {...this.props} ref_={this._registerBody} />;
      },

      _getMainComponent() {
        let component;

        if (this._isOverflowing()) {
          component = <Select {...this.props} />;
        } else {
          component = <SwitchSelectorBody {...this.props} ref_={this._registerBody} />;
        }

        return component;
      },

      _getSelectProps() {
        let props = { ...this.props };

        selectExcludedProps.forEach(propName => {
          delete props[propName];
        });

        return props;
      },

      _getHiddenBodyProps() {
        let props = { ...this.props };

        hiddenBodyExcludedProps.forEach(propName => {
          delete props[propName];
        });

        return props;
      },

      _getSelectItems() {
        return this.props.items.map((item, index) => <Select.Option key={index} {...item} />);
      },

      _onChange(opt) {
        this.setState({ value: opt.value }, opt.component.onChangeDefault(opt));
      },
      //@@viewOff:private

      //@@viewOn:render
      render() {
        let renderResult;

        if (this.state.displaySelect) {
          const selectProps = this._getSelectProps();
          const bodyProps = this._getHiddenBodyProps();

          renderResult = (
            <>
              <div className={this.getClassName("hiddenWrapper")}>
                <SwitchSelectorBody {...bodyProps} ref_={this._registerHiddenBody} />
              </div>
              <Select {...selectProps} onChange={this._onChangeSelect}>
                {this._getSelectItems()}
              </Select>
            </>
          );
        } else {
          renderResult = <SwitchSelectorBody {...this.props} ref_={this._registerBody} />;
        }

        return renderResult;
      }
      //@@viewOff:render
    })
  )
);

export default SwitchSelector;
