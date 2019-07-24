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
import {shallow, mount, render} from 'enzyme';
import "uu5g04-bricks";
import "uu5g04-forms";
import TestTools from "../../core/test/test-tools.js";


const TagName = "UU5.Forms.TextArea";

const MixinPropsFunction = createReactClass({

  mixins: [
    UU5.Common.BaseMixin,
  ],

  getInitialState: () => {
    return {
      isCalled: false,
      value: '',
      message: '',
      feedback: 'initial'
    };
  },

  onFocusHandler(event) {
    alert("onFocus event has been called.");
    this.setState({isCalled: true});
    this.setState({value: event.target.value})
    this.setState({message: 'Is valid.'})
    this.setState({feedback: 'success'})
  },

  onBlurHandler(event) {
    alert("onBlur event has been called.");
    this.setState({isCalled: true});
    this.setState({value: event.target.value})
    this.setState({message: 'Is valid.'})
    this.setState({feedback: 'success'})
  },

  onEnterHandler(event) {
    alert("onEnter event has been called.");
    this.setState({isCalled: true});
    this.setState({value: event.target.value})
    this.setState({message: 'Is valid.'})
    this.setState({feedback: 'success'})
  },

  validateOnChangeHandler(event) {
    alert("ValidateOnChange event has been called.");
    this.setState({isCalled: true});
  },

  onChangeHandler(event) {
    alert("onChange event has been called.");
    this.setState({isCalled: true});
    this.setState({value: event.target.value})
    this.setState({message: 'Is valid.'})
    this.setState({feedback: 'success'})
  },

  onValidateHandler(event) {
    alert("onValidate event has been called.");
    this.setState({isCalled: true});
    this.setState({value: event.target.value})
    this.setState({message: 'Is valid.'})
    this.setState({feedback: 'success'})
  },

  onChangeFeedbackHandler(event) {
    alert("onChangeFeedback event has been called.");
    this.setState({isCalled: true});
    this.setState({value: event.target.value})
    this.setState({message: 'Is valid.'})
    this.setState({feedback: 'success'})
  },


  render() {
    return (
      <UU5.Forms.TextArea
        id={"checkID"}
        label="Your name"
        value={this.state.value}
        feedback={this.state.feedback}
        message={this.state.message}
        onFocus={this.onFocusHandler}
        onBlur={this.onBlurHandler}
        onEnter={this.onEnterHandler}
        validateOnChange={true}
        onChange={this.onChangeHandler}
        onValidate={this.onValidateHandler}
        onChangeFeedback={this.onChangeFeedbackHandler}
      />
    );
  }
});

const CONFIG = {
  mixins: [
    "UU5.Common.BaseMixin",
    "UU5.Common.ElementaryMixin",
    "UU5.Common.PureRenderMixin",
    "UU5.Forms.InputMixin",
    "UU5.Common.ColorSchemaMixin",
    "UU5.Forms.TextInputMixin"
  ],
  props: {
    value: {
      values: ["Hodnota"]
    },
    rows: {
      values: [10]
    },
    autoResize: {
      values: [true, false]
    },
    maxRows: {
      values: [3]
    }
  },
  requiredProps: {},
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

describe(`${TagName} props function -> InputMixin`, () => {

  it('onChange()', () => {
    window.alert = jest.fn();
    const wrapper = shallow(<MixinPropsFunction/>);
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.instance().state.isCalled).toBeFalsy();
    expect(wrapper.instance().state.value).toEqual("");
    expect(wrapper.instance().state.message).toEqual("");
    expect(wrapper.instance().state.feedback).toMatch(/initial/);
    wrapper.simulate('change', {target: {value: "Testing react in jest"}});
    expect(window.alert).toBeCalled();
    expect(window.alert).toHaveBeenCalledWith('onChange event has been called.');
    expect(window.alert.mock.calls[0][0]).toEqual("onChange event has been called.");
    expect(wrapper.instance().state.isCalled).toBeTruthy();
    expect(wrapper.instance().state.value).toEqual("Testing react in jest");
    expect(wrapper.instance().state.message).toEqual("Is valid.");
    expect(wrapper.instance().state.feedback).toEqual("success");
    expect(wrapper).toMatchSnapshot();
  });

  it(`onChangeDefault() with callback`, () => {
    let callback = jest.fn();
    let wrapper = shallow(<UU5.Forms.TextArea />);
    wrapper.instance().onChangeDefault({}, callback);
    expect(callback).toBeCalled();
  });

  it('onValidate()', () => {
    window.alert = jest.fn();
    const wrapper = shallow(<MixinPropsFunction/>);
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.instance().state.isCalled).toBeFalsy();
    expect(wrapper.instance().state.value).toEqual("");
    expect(wrapper.instance().state.message).toEqual("");
    expect(wrapper.instance().state.feedback).toMatch(/initial/);
    wrapper.simulate('validate', {target: {value: "Testing react in jest"}});
    expect(window.alert).toBeCalled();
    expect(window.alert).toHaveBeenCalledWith('onValidate event has been called.');
    expect(window.alert.mock.calls[0][0]).toEqual("onValidate event has been called.");
    expect(wrapper.instance().state.isCalled).toBeTruthy();
    expect(wrapper.instance().state.value).toEqual("Testing react in jest");
    expect(wrapper.instance().state.message).toEqual("Is valid.");
    expect(wrapper.instance().state.feedback).toEqual("success");
    expect(wrapper).toMatchSnapshot();
  });

  it('onChangeFeedback()', () => {
    window.alert = jest.fn();
    const wrapper = shallow(<MixinPropsFunction/>);
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.instance().state.isCalled).toBeFalsy();
    expect(wrapper.instance().state.value).toEqual("");
    expect(wrapper.instance().state.message).toEqual("");
    expect(wrapper.instance().state.feedback).toMatch(/initial/);
    wrapper.simulate('changeFeedback', {target: {value: "Testing react in jest"}});
    expect(window.alert).toBeCalled();
    expect(window.alert).toHaveBeenCalledWith('onChangeFeedback event has been called.');
    expect(window.alert.mock.calls[0][0]).toEqual("onChangeFeedback event has been called.");
    expect(wrapper.instance().state.isCalled).toBeTruthy();
    expect(wrapper.instance().state.value).toEqual("Testing react in jest");
    expect(wrapper.instance().state.message).toEqual("Is valid.");
    expect(wrapper.instance().state.feedback).toEqual("success");
    expect(wrapper).toMatchSnapshot();
  });

});


describe(`${TagName} props function -> Text.InputMixin`, () => {


  it('onFocus()', () => {
    window.alert = jest.fn();
    const wrapper = shallow(<MixinPropsFunction/>);
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.instance().state.isCalled).toBeFalsy();
    expect(wrapper.instance().state.value).toEqual("");
    expect(wrapper.instance().state.message).toEqual("");
    expect(wrapper.instance().state.feedback).toMatch(/initial/);
    wrapper.simulate('focus', {target: {value: "Testing react in jest"}});
    expect(window.alert).toBeCalled();
    expect(window.alert).toHaveBeenCalledWith('onFocus event has been called.');
    expect(window.alert.mock.calls[0][0]).toEqual("onFocus event has been called.");
    expect(wrapper.instance().state.isCalled).toBeTruthy();
    expect(wrapper.instance().state.value).toEqual("Testing react in jest");
    expect(wrapper.instance().state.message).toEqual("Is valid.");
    expect(wrapper.instance().state.feedback).toEqual("success");
    expect(wrapper).toMatchSnapshot();
  });

  it('onBlur()', () => {
    window.alert = jest.fn();
    const wrapper = shallow(<MixinPropsFunction/>);
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.instance().state.isCalled).toBeFalsy();
    expect(wrapper.instance().state.value).toEqual("");
    expect(wrapper.instance().state.message).toEqual("");
    expect(wrapper.instance().state.feedback).toMatch(/initial/);
    wrapper.simulate('blur', {target: {value: "Testing react in jest"}});
    expect(window.alert).toBeCalled();
    expect(window.alert).toHaveBeenCalledWith('onBlur event has been called.');
    expect(window.alert.mock.calls[0][0]).toEqual("onBlur event has been called.");
    expect(wrapper.instance().state.isCalled).toBeTruthy();
    expect(wrapper.instance().state.value).toEqual("Testing react in jest");
    expect(wrapper.instance().state.message).toEqual("Is valid.");
    expect(wrapper.instance().state.feedback).toEqual("success");
    expect(wrapper).toMatchSnapshot();
  });


  it('onEnter()', () => {
    window.alert = jest.fn();
    const wrapper = shallow(<MixinPropsFunction/>);
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.instance().state.isCalled).toBeFalsy();
    expect(wrapper.instance().state.value).toEqual("");
    expect(wrapper.instance().state.message).toEqual("");
    expect(wrapper.instance().state.feedback).toMatch(/initial/);
    wrapper.simulate('enter', {target: {value: "Testing react in jest"}});
    expect(window.alert).toBeCalled();
    expect(window.alert).toHaveBeenCalledWith('onEnter event has been called.');
    expect(window.alert.mock.calls[0][0]).toEqual("onEnter event has been called.");
    expect(wrapper.instance().state.isCalled).toBeTruthy();
    expect(wrapper.instance().state.value).toEqual("Testing react in jest");
    expect(wrapper.instance().state.message).toEqual("Is valid.");
    expect(wrapper.instance().state.feedback).toEqual("success");
    expect(wrapper).toMatchSnapshot();
  });

  /**
   * You can not simulate events that do not start with it on. For example, onChange, onChangeFeedback.
   * Therefore, the validateonChange event is simulated here so that it is set to true, and event onValidate sets the message and feedback to error,
   * success if the component is valid. Valid component means that it is not empty and has the correct format.
   */

  it('validateOnChange() - input is invalid', () => {
    const wrapper = shallow(
      <UU5.Forms.TextArea
        label="Description"
        id={"uuID"}
        validateOnChange
        onValidate={opt => {
          let feedback;
          if (opt.value !== '') {
            feedback = {
              feedback: 'success',
              message: 'Is valid.',
              value: opt.value
            };
          } else {
            feedback = {
              feedback: 'error',
              message: 'Not valid.',
              value: opt.value
            };
          }

          return feedback;
        }}
      />
    );
    expect(wrapper.instance().state.message).toEqual("Not valid.");
    expect(wrapper.instance().state.feedback).toEqual("error");
    expect(wrapper.instance().state.value).toEqual("");
    expect(wrapper).toMatchSnapshot();
  });

  it('validateOnChange() - input is valid', () => {
    const wrapper = shallow(
      <UU5.Forms.TextArea
        label="Description"
        id={"uuID"}
        value={"Text in the textArea."}
        validateOnChange
        onValidate={opt => {
          let feedback;
          if (opt.value !== '') {
            feedback = {
              feedback: 'success',
              message: 'Is valid.',
              value: opt.value
            };
          } else {
            feedback = {
              feedback: 'error',
              message: 'Not valid.',
              value: opt.value
            };
          }

          return feedback;
        }}
      />
    );
    expect(wrapper.instance().state.message).toEqual("Is valid.");
    expect(wrapper.instance().state.feedback).toEqual("success");
    expect(wrapper.instance().state.value).toEqual("Text in the textArea.");
    expect(wrapper).toMatchSnapshot();
  });

});


describe(`${TagName} default props`, () => {

  it(`${TagName} check default props`, () => {
    const wrapper = shallow(
      <UU5.Forms.TextArea
       id={"uuID"}
      />
    );
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.instance().props.value).toBe("");
    expect(wrapper.instance().props.rows).toBe(3);
    expect(wrapper.instance().props.autoResize).toBeFalsy();
    expect(wrapper.instance().props.maxRows).toBe(null);

  });
});

describe(`${TagName} check default default props from Mixins`, () => {


  it(`UU5.Forms.InputMixin`, () => {
    const wrapper = shallow(
      <UU5.Forms.TextArea
        id={"uuID"}
      />
    );
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.instance().props.inputAttrs).toBe(null);
    expect(wrapper.instance().props.size).toEqual("m");
    expect(wrapper.instance().props.readOnly).toBeFalsy();
    expect(wrapper.instance().props.feedback).toEqual("initial");
    expect(wrapper.instance().props.message).toBe(null);
    expect(wrapper.instance().props.label).toBe(null);
    expect(wrapper.instance().props.onChange).toBe(null);
    expect(wrapper.instance().props.onValidate).toBe(null);
    expect(wrapper.instance().props.onChangeFeedback).toBe(undefined);
    expect(wrapper.instance().props.inputColWidth).toEqual("xs12 s7");
    expect(wrapper.instance().props.labelColWidth).toEqual("xs12 s5");
  });


  it(`UU5.Forms.TextInputMixin`, () => {
    const wrapper = shallow(
      <UU5.Forms.TextArea
        id={"uuID"}
      />
    );
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.instance().props.placeholder).toBe(null);
    expect(wrapper.instance().props.required).toBeFalsy();
    expect(wrapper.instance().props.requiredMessage).toBe(null);
    expect(wrapper.instance().props.focusMessage).toBe(null);
    expect(wrapper.instance().props.patternMessage).toBe(null);
    expect(wrapper.instance().props.autocompleteItems).toBe(null);
    expect(wrapper.instance().props.onFocus).toBe(null);
    expect(wrapper.instance().props.onBlur).toBe(null);
    expect(wrapper.instance().props.onEnter).toBe(null);
    expect(wrapper.instance().props.validateOnChange).toBeFalsy();
  });


  it(`${TagName} Common.Mixins`, () => {
    const wrapper = shallow(
      <UU5.Forms.TextArea
        id={"uuID"}
      />
    );
    expect(wrapper).toMatchSnapshot();
    //Check UU5.Common.Elementary.Mixin default props
    expect(wrapper.instance().props.hidden).toBeFalsy();
    expect(wrapper.instance().props.disabled).toBeFalsy();
    expect(wrapper.instance().props.selected).toBeFalsy();
    expect(wrapper.instance().props.controlled).toBeTruthy;
    //Check UU5.Common.PureRender.Mixin default values
    expect(wrapper.instance().props.pureRender).toBeFalsy();
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
    //check default css class of colorSchemaMixin
    expect(wrapper.instance().props.colorSchema).toBe(null);
  });


});
