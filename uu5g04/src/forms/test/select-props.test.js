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

const MyAllowTagsComponents = UU5.Common.VisualComponent.create({
  mixins: [UU5.Common.BaseMixin],
  statics: { tagName: "UU5.Example.MyCompButton", classNames: { main: "mytr" } },
  render() {
    return <UU5.Example.MyCompButton {...this.getMainPropsToPass()} />;
  }
});

const MixinPropsFunction = UU5.Common.VisualComponent.create({
  mixins: [UU5.Common.BaseMixin],

  getInitialState: () => {
    return {
      isCalled: false,
      value: "",
      message: "",
      feedback: "initial"
    };
  },
  onChangeHandler(event) {
    alert("onChange event has been called.");
    this.setState({ isCalled: true });
    this.setState({ value: event.target.value });
    this.setState({ message: "Is valid." });
    this.setState({ feedback: "success" });
  },

  onValidateHandler(event) {
    alert("onValidate event has been called.");
    this.setState({ isCalled: true });
    this.setState({ value: event.target.value });
    this.setState({ message: "Is valid." });
    this.setState({ feedback: "success" });
  },

  onChangeFeedbackHandler(event) {
    alert("onChangeFeedback event has been called.");
    this.setState({ isCalled: true });
    this.setState({ value: event.target.value });
    this.setState({ message: "Is valid." });
    this.setState({ feedback: "success" });
  },

  render() {
    return (
      <UU5.Forms.Select
        id={"checkID"}
        value={this.state.value}
        feedback={this.state.feedback}
        message={this.state.message}
        onChange={this.onChangeHandler}
        onValidate={this.onValidateHandler}
        onChangeFeedback={this.onChangeFeedbackHandler}
      />
    );
  }
});

//`UU5.Forms.Select`
const CONFIG = {
  mixins: [
    "UU5.Common.BaseMixin",
    "UU5.Common.ElementaryMixin",
    "UU5.Common.ContentMixin",
    "UU5.Common.LsiMixin",
    "UU5.Common.PureRenderMixin",
    "UU5.Forms.InputMixin",
    "UU5.Forms.ChoiceMixin",
    "UU5.Common.ColorSchemaMixin"
  ],
  props: {
    value: {
      values: ["item_1", "item_2", "item_3"]
    },
    multiple: {
      values: [true, false]
    },
    selectAllEnabled: {
      values: [true, false]
    },
    allowTags: {
      values: [["UU5.Example.MyCompButton"]]
    },
    disableBackdrop: {
      values: [true, false]
    }
  },
  requiredProps: {
    children: [
      <UU5.Forms.Select.Option key="item_1" value="item_1" id="idChild_1" />,
      <UU5.Forms.Select.Option key="item_2" value="item_2" id="idChild_2" />
    ]
  },
  opt: {
    shallowOpt: {
      disableLifecycleMethods: false
    }
  }
};

describe(`UU5.Forms.Select props`, () => {
  UU5.Test.Tools.testProperties(UU5.Forms.Select, CONFIG);

  it(`UU5.Forms.Select Component from allow tags is used in example`, () => {
    const wrapper = shallow(
      <UU5.Forms.Select id={"uuID"} allowTags={["UU5.Example.MyCompButton"]}>
        <MyAllowTagsComponents id={"allowID"} content={"Allow content"} />
        <UU5.Forms.Select.Option id={"uuItem"} value="Info" />
      </UU5.Forms.Select>
    );
    expect(wrapper).toMatchSnapshot();
  });
});

describe(`UU5.Forms.Select props function -> InputMixin`, () => {
  it("onChange()", () => {
    window.alert = jest.fn();
    const wrapper = shallow(<MixinPropsFunction />);
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.instance().state.isCalled).toBeFalsy();
    expect(wrapper.instance().state.value).toEqual("");
    expect(wrapper.instance().state.message).toEqual("");
    expect(wrapper.instance().state.feedback).toMatch(/initial/);
    wrapper.simulate("change", { target: { value: "Testing react in jest" } });
    expect(window.alert).toBeCalled();
    expect(window.alert).toHaveBeenCalledWith("onChange event has been called.");
    expect(window.alert.mock.calls[0][0]).toEqual("onChange event has been called.");
    expect(wrapper.instance().state.isCalled).toBeTruthy();
    expect(wrapper.instance().state.value).toEqual("Testing react in jest");
    expect(wrapper.instance().state.message).toEqual("Is valid.");
    expect(wrapper.instance().state.feedback).toEqual("success");
    expect(wrapper).toMatchSnapshot();
  });

  it(`onChangeDefault() with callback`, () => {
    let callback = jest.fn();
    let wrapper = shallow(
      <UU5.Forms.Select>
        <UU5.Forms.Select.Option value="Info" />
      </UU5.Forms.Select>
    );
    wrapper.instance().onChangeDefault({ _data: { type: "changeValue" } }, callback);
    expect(callback).toBeCalled();
  });

  it("onValidate()", () => {
    window.alert = jest.fn();
    const wrapper = shallow(<MixinPropsFunction />);
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.instance().state.isCalled).toBeFalsy();
    expect(wrapper.instance().state.value).toEqual("");
    expect(wrapper.instance().state.message).toEqual("");
    expect(wrapper.instance().state.feedback).toMatch(/initial/);
    wrapper.simulate("validate", { target: { value: "Testing react in jest" } });
    expect(window.alert).toBeCalled();
    expect(window.alert).toHaveBeenCalledWith("onValidate event has been called.");
    expect(window.alert.mock.calls[0][0]).toEqual("onValidate event has been called.");
    expect(wrapper.instance().state.isCalled).toBeTruthy();
    expect(wrapper.instance().state.value).toEqual("Testing react in jest");
    expect(wrapper.instance().state.message).toEqual("Is valid.");
    expect(wrapper.instance().state.feedback).toEqual("success");
    expect(wrapper).toMatchSnapshot();
  });

  it("onChangeFeedback()", () => {
    window.alert = jest.fn();
    const wrapper = shallow(<MixinPropsFunction />);
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.instance().state.isCalled).toBeFalsy();
    expect(wrapper.instance().state.value).toEqual("");
    expect(wrapper.instance().state.message).toEqual("");
    expect(wrapper.instance().state.feedback).toMatch(/initial/);
    wrapper.simulate("changeFeedback", { target: { value: "Testing react in jest" } });
    expect(window.alert).toBeCalled();
    expect(window.alert).toHaveBeenCalledWith("onChangeFeedback event has been called.");
    expect(window.alert.mock.calls[0][0]).toEqual("onChangeFeedback event has been called.");
    expect(wrapper.instance().state.isCalled).toBeTruthy();
    expect(wrapper.instance().state.value).toEqual("Testing react in jest");
    expect(wrapper.instance().state.message).toEqual("Is valid.");
    expect(wrapper.instance().state.feedback).toEqual("success");
    expect(wrapper).toMatchSnapshot();
  });
});

describe(`UU5.Forms.Select default props`, () => {
  it(`UU5.Forms.Select check default props`, () => {
    const wrapper = shallow(
      <UU5.Forms.Select id={"uuID"}>
        <UU5.Forms.Select.Option value="Info" />
      </UU5.Forms.Select>
    );
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.instance().props.value).toBe(null);
    expect(wrapper.instance().props.multiple).toBeFalsy();
    expect(wrapper.instance().props.selectAllEnabled).toBeFalsy();
    expect(wrapper.instance().props.disableBackdrop).toBeFalsy();
  });
});

describe(`UU5.Forms.Select check default default props from Mixins`, () => {
  it(`UU5.Forms.ChoiceMixin`, () => {
    const wrapper = shallow(
      <UU5.Forms.Select id={"uuID"}>
        <UU5.Forms.Select.Option value="Info" />
      </UU5.Forms.Select>
    );
    expect(wrapper.instance().props.placeholder).toBe(null);
    expect(wrapper.instance().props.required).toBeFalsy();
    expect(wrapper.instance().props.requiredMessage).toBe(null);
    expect(wrapper.instance().props.iconOpen).toEqual("mdi-menu-up");
    expect(wrapper.instance().props.iconClosed).toEqual("mdi-menu-down");
    expect(wrapper.instance().props.buttonHidden).toBeFalsy();
  });

  it(`UU5.Forms.InputMixin`, () => {
    const wrapper = shallow(
      <UU5.Forms.Select id={"uuID"}>
        <UU5.Forms.Select.Option value="Info" />
      </UU5.Forms.Select>
    );
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

  it(`UU5.Common.Base,Elementary,Pure,Color,Lsi`, () => {
    const wrapper = shallow(
      <UU5.Forms.Select id={"uuID"}>
        <UU5.Forms.Select.Option value="Info" />
      </UU5.Forms.Select>
    );
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
    //default value of colorSchema and LSI language props are in snapshot.
  });

  it(`UU5.Common.ContentMixin`, () => {
    const wrapper = shallow(
      <UU5.Forms.Select id={"uuID"}>
        <UU5.Forms.Select.Option value="Info" />
      </UU5.Forms.Select>
    );
    expect(wrapper.instance().props.content).toBe(null);
    expect(wrapper.instance().props.ignoreInnerHTML).toBeFalsy();
    expect(wrapper.instance().props.checkSpaces).toBeFalsy();
    expect(wrapper.instance().props.checkGrammar).toBeFalsy();
    expect(wrapper.instance().props.checkHighlight).toBeFalsy();
    expect(wrapper.instance().props.textCorrector).toBeFalsy();
    expect(wrapper.instance().props.dynamic).toBeFalsy();
  });
});
