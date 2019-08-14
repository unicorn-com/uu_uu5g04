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

import React from "react";
import createReactClass from "create-react-class";
import UU5 from "uu5g04";
import enzymeToJson from "enzyme-to-json";
import {shallow} from 'enzyme';
import "uu5g04-bricks";
import "uu5g04-forms";
import TestTools from "../../core/test/test-tools.js";

const MixinPropsFunction = createReactClass({

  mixins: [
    UU5.Common.BaseMixin,
  ],

  getInitialState() {
    return {
      isCalled: false,
      isChecked: false
    };
  },

  onChangeHandler(event) {
    alert("onChange event has been called.");
    this.setState({isCalled: true});
    this.setState({isChecked: event.target.value})
  },

  onValidateHandler(event) {
    alert("onValidate event has been called.");
    this.setState({isCalled: true});
  },

  onChangeFeedbackHandler(event) {
    alert("onChangeFeedback event has been called.");
    this.setState({isCalled: true});
    this.setState({isChecked: event.target.value})
  },


  render() {
    return (
      <UU5.Forms.Checkboxes
        id={"checkID"}
        colorSchema={"default"}
        value={[{label: "Checkbox 1", name: "box1", value: this.state.isChecked}]}
        onChange={this.onChangeHandler}
        onValidate={this.onValidateHandler}
        onChangeFeedback={this.onChangeFeedbackHandler}
      />
    );
  }
});

const TagName = "UU5.Forms.Checkboxes";

const CONFIG = {
  mixins: [
    "UU5.Common.BaseMixin",
    "UU5.Common.ElementaryMixin",
    "UU5.Common.PureRenderMixin",
    "UU5.Forms.InputMixin",
    "UU5.Forms.GroupMixin"
  ],
  props: {
    offIcon: {
      values: ["mdi-close"]
    },
    onIcon: {
      values: ["", "mdi-paw"]
    },
    type: {
      values: [1, 2]
    },
    bgStyleChecked: {
      values: ["outline", "filled"]
    },
    selectionBackground: {
      values: [true, false]
    }
  },
  requiredProps: {
    //The component does not have any required props
  },
  opt: {
    shallowOpt: {
      disableLifecycleMethods: false
    },
    enzymeToJson: true
  }
};


describe(`${TagName} props`, () => {
  TestTools.testProperties(TagName, CONFIG);
});


describe(`${TagName} props function -> Forms.InputMixin`, () => {

  it('onChange()', () => {
    window.alert = jest.fn();
    const wrapper = shallow(<MixinPropsFunction/>);
    expect(enzymeToJson(wrapper)).toMatchSnapshot();
    expect(wrapper.state().isChecked).toBeFalsy();
    expect(wrapper.state().isCalled).toBeFalsy();
    wrapper.simulate('change', {target: {value: true}});
    expect(window.alert).toBeCalled();
    expect(window.alert).toHaveBeenCalledWith('onChange event has been called.');
    expect(wrapper.state().isCalled).toBeTruthy();
    expect(wrapper.state().isChecked).toBeTruthy();
    expect(window.alert.mock.calls[0][0]).toEqual("onChange event has been called.");
    expect(enzymeToJson(wrapper)).toMatchSnapshot();
  });

  it(`onChangeDefault() with callback`, () => {
    let callback = jest.fn();
    let wrapper = shallow(<UU5.Forms.Checkboxes value={[{label: "Checkbox 1", name: "box1", value: false}]} />);
    wrapper.instance().onChangeDefault({}, callback);
    expect(callback).toBeCalled();
  });

  it('onValidate()', () => {
    window.alert = jest.fn();
    const wrapper = shallow(<MixinPropsFunction/>);
    expect(wrapper.state().isCalled).toBeFalsy();
    wrapper.simulate('validate');
    expect(window.alert).toBeCalled();
    expect(window.alert).toHaveBeenCalledWith('onValidate event has been called.');
    expect(wrapper.state().isCalled).toBeTruthy();
    expect(window.alert.mock.calls[0][0]).toEqual("onValidate event has been called.");
    expect(enzymeToJson(wrapper)).toMatchSnapshot();
  });

  it('onChangeFeedback()', () => {
    window.alert = jest.fn();
    const wrapper = shallow(<MixinPropsFunction/>);
    expect(enzymeToJson(wrapper)).toMatchSnapshot();
    expect(wrapper.state().isCalled).toBeFalsy();
    expect(wrapper.state().isChecked).toBeFalsy();
    wrapper.simulate('changeFeedback', {target: {value: true}});
    expect(wrapper.state().isChecked).toBeTruthy();
    expect(window.alert).toBeCalled();
    expect(window.alert).toHaveBeenCalledWith('onChangeFeedback event has been called.');
    expect(wrapper.state().isCalled).toBeTruthy();
    expect(window.alert.mock.calls[0][0]).toEqual("onChangeFeedback event has been called.");
    expect(enzymeToJson(wrapper)).toMatchSnapshot();
  });

});

describe('Default values from mixins', () => {

  it(`UU5.Commons.Mixin Base,Elementary`, () => {
    const wrapper = shallow(
      <UU5.Forms.Checkboxes id={"uuID"}/>
    );
    //Check UU5.Common.Elementary.Mixin default props
    expect(wrapper.instance().props.hidden).toBeFalsy();
    expect(wrapper.instance().props.disabled).toBeFalsy();
    expect(wrapper.instance().props.selected).toBeFalsy();
    expect(wrapper.instance().props.controlled).toBeTruthy();
    //Check default values of props BaseMixin.
    expect(wrapper.instance().props.id).toEqual("uuID");
    expect(wrapper.instance().props.name).toBe(null);
    expect(wrapper.instance().props.tooltip).toBe(null);
    expect(wrapper.instance().props.className).toBe(null);
    expect(wrapper.instance().props.style).toBe(null);
    expect(wrapper.instance().props.mainAttrs).toBe(null);
    expect(wrapper.instance().props.parent).toBe(null);
    expect(wrapper.instance().props.ref_).toBe(null);
    expect(wrapper.instance().props.noIndex).toBeFalsy();
    //Check UU5.Common.PureRender.Mixin default values
    expect(wrapper.instance().props.pureRender).toBeFalsy();
  });

  it(`UU5.Forms.GroupMixin`, () => {
    const wrapper = shallow(
      <UU5.Forms.Checkboxes id={"uuID"}/>
    );
    expect(wrapper).toMatchSnapshot();
    //value of default props is in the snapshot
    expect(wrapper.instance().props.required).toBeFalsy();
    expect(wrapper.instance().props.requiredMessage).toBe(null);
    expect(wrapper.instance().props.icon).toBe(undefined);
    expect(wrapper.instance().props.inline).toBeFalsy();
    expect(wrapper.instance().props.colWidth).toBe(null);
    expect(wrapper.instance().props.labelPosition).toEqual("right");
  });

  it(`UU5.Forms.InputMixin`, () => {
    const wrapper = shallow(
      <UU5.Forms.Checkboxes id={"uuID"}/>
    );
    expect(wrapper.instance().props.inputAttrs).toBe(null);
    expect(wrapper.instance().props.size).toEqual("m");
    expect(wrapper.instance().props.readOnly).toBeFalsy();
    expect(wrapper.instance().props.feedback).toEqual("initial");
    expect(wrapper.instance().props.message).toBe(null);
    expect(wrapper.instance().props.label).toBe(null);
    expect(wrapper.instance().props.onChange).toBe(null);
    expect(wrapper.instance().props.onValidate).toBe(null);
    //onChangeFeedback is not defined console.log(wrapper.instance().props);
    expect(wrapper.instance().props.onChangeFeedback).toBe(undefined);
    expect(wrapper.instance().props.inputColWidth).toMatchObject({ xs: 12, s: 7 });
    expect(wrapper.instance().props.labelColWidth).toMatchObject({ xs: 12, s: 5 });
  });

});


describe(`${TagName} docKit example`, () => {

  it(`${TagName} should render as type 1`, () => {
    const wrapper = shallow(
      <UU5.Forms.Checkboxes
        id={"uuID"}
        label="What kind of pets do you like?"
        size="s"
        value={[
          {label: 'Dogs', name: 'dogs', value: true},
          {label: 'Cats', name: 'cats'},
          {label: 'Yaks', name: 'yaks'}
        ]}
      />
    );
    expect(enzymeToJson(wrapper)).toMatchSnapshot();
  });

  it(`${TagName} should render as type 2`, () => {
    const wrapper = shallow(
      <UU5.Forms.Checkboxes
        id={"uuID"}
        label="What kind of pets do you like?"
        size="s"
        type={2}
        value={[
          {label: 'Dogs', name: 'dogs', value: true},
          {label: 'Cats', name: 'cats'},
          {label: 'Yaks', name: 'yaks'}
        ]}
      />
    );
    expect(enzymeToJson(wrapper)).toMatchSnapshot();
  });


});
