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
import UU5 from "uu5g04";
import "uu5g04-bricks";
import "uu5g04-forms";
//@@viewOff:imports

const { mount, shallow, wait } = UU5.Test.Tools;

const SliderFunctionProps = UU5.Common.VisualComponent.create({
  mixins: [UU5.Common.BaseMixin],

  getInitialState: () => {
    return {
      isCalled: false,
      value: 0,
      message: "",
      feedback: "initial"
    };
  },

  onChangeHandler(event) {
    alert("props.onChange is done.");
    this.setState({ isCalled: true });
    this.setState({ value: event.target.value });
    this.setState({ message: "Is valid." });
    this.setState({ feedback: "success" });
  },

  onChangedHandler(event) {
    alert("props.onChanged is done.");
    this.setState({ isCalled: true });
    this.setState({ value: event.target.value });
    this.setState({ message: "Is valid." });
    this.setState({ feedback: "success" });
  },

  onValidateHandler(event) {
    alert("onValidate is done.");
    this.setState({ isCalled: true });
    this.setState({ value: event.target.value });
    this.setState({ message: "Is valid." });
    this.setState({ feedback: "success" });
  },

  onChangeFeedbackHandler(event) {
    alert("onChangeFeedback is done.");
    this.setState({ isCalled: true });
    this.setState({ value: event.target.value });
    this.setState({ message: "Is valid." });
    this.setState({ feedback: "success" });
  },

  render() {
    return (
      <UU5.Forms.Slider
        id={"uuID"}
        label="Height"
        value={this.state.value}
        feedback={this.state.feedback}
        message={this.state.message}
        onChanged={this.onChangedHandler}
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
    "UU5.Common.ContentMixin",
    "UU5.Common.ColorSchemaMixin",
    "UU5.Common.PureRenderMixin",
    "UU5.Forms.InputMixin"
  ],
  props: {
    value: {
      values: [666]
    },
    step: {
      values: [5]
    },
    min: {
      values: [1]
    },
    max: {
      values: [700]
    }
    //onChange
    //onChanged
  },
  requiredProps: {},
  opt: {
    shallowOpt: {
      disableLifecycleMethods: false
    }
  }
};

describe(`UU5.Forms.Slider props`, () => {
  UU5.Test.Tools.testProperties(UU5.Forms.Slider, CONFIG);

  it("onChange()", () => {
    window.alert = jest.fn();
    const wrapper = shallow(<SliderFunctionProps />);
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.instance().state.isCalled).toBeFalsy();
    expect(wrapper.instance().state.value).toBe(0);
    expect(wrapper.instance().state.message).toEqual("");
    expect(wrapper.instance().state.feedback).toMatch(/initial/);
    wrapper.simulate("change", { target: { value: 5 } });
    expect(window.alert).toBeCalled();
    expect(window.alert).toHaveBeenCalledWith("props.onChange is done.");
    expect(window.alert.mock.calls[0][0]).toEqual("props.onChange is done.");
    expect(wrapper.instance().state.isCalled).toBeTruthy();
    expect(wrapper.instance().state.value).toBe(5);
    expect(wrapper.instance().state.message).toEqual("Is valid.");
    expect(wrapper.instance().state.feedback).toEqual("success");
    expect(wrapper).toMatchSnapshot();
  });

  it(`onChangeDefault() with callback`, () => {
    let callback = jest.fn();
    let wrapper = shallow(<UU5.Forms.Slider />);
    wrapper.instance().onChangeDefault({}, callback);
    expect(callback).toBeCalled();
  });

  it("onChanged()", () => {
    window.alert = jest.fn();
    const wrapper = shallow(<SliderFunctionProps />);
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.instance().state.isCalled).toBeFalsy();
    expect(wrapper.instance().state.value).toBe(0);
    expect(wrapper.instance().state.message).toEqual("");
    expect(wrapper.instance().state.feedback).toMatch(/initial/);
    wrapper.simulate("changed", { target: { value: 5 } });
    expect(window.alert).toBeCalled();
    expect(window.alert).toHaveBeenCalledWith("props.onChanged is done.");
    expect(window.alert.mock.calls[0][0]).toEqual("props.onChanged is done.");
    expect(wrapper.instance().state.isCalled).toBeTruthy();
    expect(wrapper.instance().state.value).toBe(5);
    expect(wrapper.instance().state.message).toEqual("Is valid.");
    expect(wrapper.instance().state.feedback).toEqual("success");
    expect(wrapper).toMatchSnapshot();
  });
});

describe(`UU5.Forms.Slider props function -> Forms.InputMixin`, () => {
  it("onValidate()", () => {
    window.alert = jest.fn();
    const wrapper = shallow(<SliderFunctionProps />);
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.instance().state.isCalled).toBeFalsy();
    expect(wrapper.instance().state.value).toBe(0);
    expect(wrapper.instance().state.message).toEqual("");
    expect(wrapper.instance().state.feedback).toMatch(/initial/);
    wrapper.simulate("validate", { target: { value: 5 } });
    expect(window.alert).toBeCalled();
    expect(window.alert).toHaveBeenCalledWith("onValidate is done.");
    expect(window.alert.mock.calls[0][0]).toEqual("onValidate is done.");
    expect(wrapper.instance().state.isCalled).toBeTruthy();
    expect(wrapper.instance().state.value).toBe(5);
    expect(wrapper.instance().state.message).toEqual("Is valid.");
    expect(wrapper.instance().state.feedback).toEqual("success");
    expect(wrapper).toMatchSnapshot();
  });

  it("onChangeFeedback()", () => {
    window.alert = jest.fn();
    const wrapper = shallow(<SliderFunctionProps />);
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.instance().state.isCalled).toBeFalsy();
    expect(wrapper.instance().state.value).toBe(0);
    expect(wrapper.instance().state.message).toEqual("");
    expect(wrapper.instance().state.feedback).toMatch(/initial/);
    wrapper.simulate("changeFeedback", { target: { value: 5 } });
    expect(window.alert).toBeCalled();
    expect(window.alert).toHaveBeenCalledWith("onChangeFeedback is done.");
    expect(window.alert.mock.calls[0][0]).toEqual("onChangeFeedback is done.");
    expect(wrapper.instance().state.isCalled).toBeTruthy();
    expect(wrapper.instance().state.value).toBe(5);
    expect(wrapper.instance().state.message).toEqual("Is valid.");
    expect(wrapper.instance().state.feedback).toEqual("success");
    expect(wrapper).toMatchSnapshot();
  });
});

describe(`UU5.Forms.Slider default props`, () => {
  it(`UU5.Forms.Slider check default props`, () => {
    const wrapper = shallow(<UU5.Forms.Slider id={"uuID"} />);
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.instance().props.value).toBe(0);
    expect(wrapper.instance().props.step).toBe(1);
    expect(wrapper.instance().props.min).toBe(0);
    expect(wrapper.instance().props.max).toBe(10);
    expect(wrapper.instance().props.onChange).toBe(null);
    expect(wrapper.instance().props.onChanged).toBe(null);
  });
});

describe(`UU5.Forms.Slider check default default props from Mixins`, () => {
  it(`UU5.Forms.InputMixin`, () => {
    const wrapper = shallow(<UU5.Forms.Slider id={"uuID"} />);
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
    expect(wrapper.instance().props.inputColWidth).toMatchObject({ xs: 12, s: 7 });
    expect(wrapper.instance().props.labelColWidth).toMatchObject({ xs: 12, s: 5 });
  });

  it(`UU5.Commons.Base,Elementary,PureRender,Color`, () => {
    const wrapper = shallow(<UU5.Forms.Slider id={"uuID"} />);
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

  it(`UU5.Common.ContentMixin`, () => {
    const wrapper = shallow(<UU5.Forms.Slider id={"uuID"} />);
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.instance().props.content).toBe(null);
    expect(wrapper.instance().props.ignoreInnerHTML).toBeFalsy();
    expect(wrapper.instance().props.checkSpaces).toBeFalsy();
    expect(wrapper.instance().props.checkGrammar).toBeFalsy();
    expect(wrapper.instance().props.checkHighlight).toBeFalsy();
    expect(wrapper.instance().props.textCorrector).toBeFalsy();
    expect(wrapper.instance().props.dynamic).toBeFalsy();
  });
});
