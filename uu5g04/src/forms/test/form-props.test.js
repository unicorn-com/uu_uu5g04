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
import createReactClass from "create-react-class";
import React from "react";
import UU5 from "uu5g04";
import "uu5g04-bricks";
import "uu5g04-forms";
//@@viewOff:imports

const { mount, shallow, wait } = UU5.Test.Tools;

const MyCustomForms = createReactClass({
  mixins: [
    UU5.Common.BaseMixin,
    UU5.Common.ElementaryMixin,
    UU5.Common.PureRenderMixin,
    UU5.Common.SectionMixin,
    UU5.Forms.FormMixin
  ],

  getInitialState: () => {
    return {
      isCalled: false,
      message: "",
      feedback: "initial"
    };
  },

  onSaveDoneHandler(event) {
    alert("onSaveDone event has been called.");
    this.setState({ isCalled: true });
    this.setState({ message: "Is valid." });
    this.setState({ feedback: "success" });
  },

  onSaveFailHandler(event) {
    alert("onSaveFail event has been called.");
    this.setState({ isCalled: true });
    this.setState({ message: "Is valid." });
    this.setState({ feedback: "success" });
  },

  onSaveByKeyHandler(event) {
    alert("onSaveByKey event has been called.");
    this.setState({ isCalled: true });
    this.setState({ message: "Is valid." });
    this.setState({ feedback: "success" });
  },

  onSaveHandler(event) {
    alert("onSave event has been called.");
    this.setState({ isCalled: true });
    this.setState({ message: "Is valid." });
    this.setState({ feedback: "success" });
  },

  onInitHandler(event) {
    alert("onInit event has been called.");
    this.setState({ isCalled: true });
    this.setState({ message: "Is valid." });
    this.setState({ feedback: "success" });
  },

  onResetHandler(event) {
    alert("onReset event has been called.");
    this.setState({ isCalled: true });
    this.setState({ message: "Is valid." });
    this.setState({ feedback: "success" });
  },

  onValidateHandler(event) {
    alert("onValidate event has been called.");
    this.setState({ isCalled: true });
    this.setState({ message: "Is valid." });
    this.setState({ feedback: "success" });
  },

  onCancelHandler(event) {
    alert("onCancel event has been called.");
    this.setState({ isCalled: true });
    this.setState({ message: "Is valid." });
    this.setState({ feedback: "success" });
  },

  render() {
    return (
      <UU5.Bricks.Container>
        {/*@@viewOn:0*/}
        <UU5.Forms.Form
          onInit={this.onInitHandler}
          onSave={this.onSaveHandler}
          onSaveDone={this.onSaveDoneHandler}
          onSaveFail={this.onSaveFailHandler}
          onSaveByKey={this.onSaveByKeyHandler}
          onValidate={this.onValidateHandler}
          onReset={this.onResetHandler}
          onCancel={this.onCancelHandler}
          id={"uuID06"}
          header={
            <UU5.Bricks.Box id={"uuID04"} content="Registration form" colorSchema="green" className="font-size-m" />
          }
          footer={<UU5.Bricks.Box id={"uuID05"} content="Unicorn 2018" colorSchema="grey" className="font-size-xs" />}
        >
          <UU5.Forms.Text id={"uuID03"} name="name" label="Name" placeholder="John" required />
          <UU5.Forms.TextArea id={"uuID02"} name="description" label="Description" placeholder="Some text..." />
          <UU5.Forms.Controls id={"uuID01"} />
        </UU5.Forms.Form>
        {/*@@viewOff:0*/}
      </UU5.Bricks.Container>
    );
  }
});

const CONFIG = {
  mixins: [
    "UU5.Common.BaseMixin",
    "UU5.Common.ElementaryMixin",
    "UU5.Common.PureRenderMixin",
    "UU5.Common.SectionMixin",
    "UU5.Forms.FormMixin"
  ],
  props: {
    //The component does not have any own props
  },
  requiredProps: {
    children: [<UU5.Forms.Text name="name" label="Name" id={"uuID-child"} placeholder="John" required />]
  },
  opt: {
    shallowOpt: {
      disableLifecycleMethods: false
    }
  }
};

describe(`UU5.Forms.Form props`, () => {
  UU5.Test.Tools.testProperties(UU5.Forms.Form, CONFIG);

  it("padding", () => {
    const wrapper = mount(<UU5.Forms.Form padding="8px 8px" />);
    const element = wrapper.find(".uu5-forms-form").instance();
    expect(window.getComputedStyle(element).padding).toBe("8px 8px");
  });
});

describe("UU5.Forms.FormMixin props.function testing", () => {
  it("onInit()", () => {
    window.alert = jest.fn();
    const wrapper = shallow(<MyCustomForms />);
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.instance().state.isCalled).toBeFalsy();
    expect(wrapper.instance().state.message).toEqual("");
    expect(wrapper.instance().state.feedback).toMatch(/initial/);
    wrapper.find("Form").simulate("init");
    expect(window.alert).toBeCalled();
    expect(window.alert).toHaveBeenCalledTimes(1);
    expect(window.alert).toHaveBeenCalledWith("onInit event has been called.");
    expect(window.alert.mock.calls[0][0]).toEqual("onInit event has been called.");
    expect(wrapper.instance().state.isCalled).toBeTruthy();
    expect(wrapper.instance().state.message).toEqual("Is valid.");
    expect(wrapper.instance().state.feedback).toEqual("success");
    expect(wrapper).toMatchSnapshot();
  });

  it("onSave()", () => {
    window.alert = jest.fn();
    const wrapper = shallow(<MyCustomForms />);
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.instance().state.isCalled).toBeFalsy();
    expect(wrapper.instance().state.message).toEqual("");
    expect(wrapper.instance().state.feedback).toMatch(/initial/);
    wrapper.find("Form").simulate("save");
    expect(window.alert).toBeCalled();
    expect(window.alert).toHaveBeenCalledTimes(1);
    expect(window.alert).toHaveBeenCalledWith("onSave event has been called.");
    expect(window.alert.mock.calls[0][0]).toEqual("onSave event has been called.");
    expect(wrapper.instance().state.isCalled).toBeTruthy();
    expect(wrapper.instance().state.message).toEqual("Is valid.");
    expect(wrapper.instance().state.feedback).toEqual("success");
    expect(wrapper).toMatchSnapshot();
  });

  it("onSaveDone()", () => {
    window.alert = jest.fn();
    const wrapper = shallow(<MyCustomForms />);
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.instance().state.isCalled).toBeFalsy();
    expect(wrapper.instance().state.message).toEqual("");
    expect(wrapper.instance().state.feedback).toMatch(/initial/);
    wrapper.find("Form").simulate("saveDone");
    expect(window.alert).toBeCalled();
    expect(window.alert).toHaveBeenCalledTimes(1);
    expect(window.alert).toHaveBeenCalledWith("onSaveDone event has been called.");
    expect(window.alert.mock.calls[0][0]).toEqual("onSaveDone event has been called.");
    expect(wrapper.instance().state.isCalled).toBeTruthy();
    expect(wrapper.instance().state.message).toEqual("Is valid.");
    expect(wrapper.instance().state.feedback).toEqual("success");
    expect(wrapper).toMatchSnapshot();
  });

  it("onSaveFail()", () => {
    window.alert = jest.fn();
    const wrapper = shallow(<MyCustomForms />);
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.instance().state.isCalled).toBeFalsy();
    expect(wrapper.instance().state.message).toEqual("");
    expect(wrapper.instance().state.feedback).toMatch(/initial/);
    wrapper.find("Form").simulate("saveFail");
    expect(window.alert).toBeCalled();
    expect(window.alert).toHaveBeenCalledTimes(1);
    expect(window.alert).toHaveBeenCalledWith("onSaveFail event has been called.");
    expect(window.alert.mock.calls[0][0]).toEqual("onSaveFail event has been called.");
    expect(wrapper.instance().state.isCalled).toBeTruthy();
    expect(wrapper.instance().state.message).toEqual("Is valid.");
    expect(wrapper.instance().state.feedback).toEqual("success");
    expect(wrapper).toMatchSnapshot();
  });

  it("onSaveByKey()", () => {
    window.alert = jest.fn();
    const wrapper = shallow(<MyCustomForms />);
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.instance().state.isCalled).toBeFalsy();
    expect(wrapper.instance().state.message).toEqual("");
    expect(wrapper.instance().state.feedback).toMatch(/initial/);
    wrapper.find("Form").simulate("saveByKey");
    expect(window.alert).toBeCalled();
    expect(window.alert).toHaveBeenCalledTimes(1);
    expect(window.alert).toHaveBeenCalledWith("onSaveByKey event has been called.");
    expect(window.alert.mock.calls[0][0]).toEqual("onSaveByKey event has been called.");
    expect(wrapper.instance().state.isCalled).toBeTruthy();
    expect(wrapper.instance().state.message).toEqual("Is valid.");
    expect(wrapper.instance().state.feedback).toEqual("success");
    expect(wrapper).toMatchSnapshot();
  });

  it("onValidate()", () => {
    window.alert = jest.fn();
    const wrapper = shallow(<MyCustomForms />);
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.instance().state.isCalled).toBeFalsy();
    expect(wrapper.instance().state.message).toEqual("");
    expect(wrapper.instance().state.feedback).toMatch(/initial/);
    wrapper.find("Form").simulate("validate");
    expect(window.alert).toBeCalled();
    expect(window.alert).toHaveBeenCalledTimes(1);
    expect(window.alert).toHaveBeenCalledWith("onValidate event has been called.");
    expect(window.alert.mock.calls[0][0]).toEqual("onValidate event has been called.");
    expect(wrapper.instance().state.isCalled).toBeTruthy();
    expect(wrapper.instance().state.message).toEqual("Is valid.");
    expect(wrapper.instance().state.feedback).toEqual("success");
    expect(wrapper).toMatchSnapshot();
  });
  it("onReset()", () => {
    window.alert = jest.fn();
    const wrapper = shallow(<MyCustomForms />);
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.instance().state.isCalled).toBeFalsy();
    expect(wrapper.instance().state.message).toEqual("");
    expect(wrapper.instance().state.feedback).toMatch(/initial/);
    wrapper.find("Form").simulate("reset");
    expect(window.alert).toBeCalled();
    expect(window.alert).toHaveBeenCalledTimes(1);
    expect(window.alert).toHaveBeenCalledWith("onReset event has been called.");
    expect(window.alert.mock.calls[0][0]).toEqual("onReset event has been called.");
    expect(wrapper.instance().state.isCalled).toBeTruthy();
    expect(wrapper.instance().state.message).toEqual("Is valid.");
    expect(wrapper.instance().state.feedback).toEqual("success");
    expect(wrapper).toMatchSnapshot();
  });

  it("onCancel()", () => {
    window.alert = jest.fn();
    const wrapper = shallow(<MyCustomForms />);
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.instance().state.isCalled).toBeFalsy();
    expect(wrapper.instance().state.message).toEqual("");
    expect(wrapper.instance().state.feedback).toMatch(/initial/);
    wrapper.find("Form").simulate("cancel");
    expect(window.alert).toBeCalled();
    expect(window.alert).toHaveBeenCalledTimes(1);
    expect(window.alert).toHaveBeenCalledWith("onCancel event has been called.");
    expect(window.alert.mock.calls[0][0]).toEqual("onCancel event has been called.");
    expect(wrapper.instance().state.isCalled).toBeTruthy();
    expect(wrapper.instance().state.message).toEqual("Is valid.");
    expect(wrapper.instance().state.feedback).toEqual("success");
    expect(wrapper).toMatchSnapshot();
  });
});

describe(`UU5.Forms.Form check default default props from Mixins`, () => {
  it(`UU5.Forms.FormMixin`, () => {
    const wrapper = shallow(<UU5.Forms.Form id={"uuID"} />);
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.instance().props.values).toBe(null);
    expect(wrapper.instance().props.progressIndicator).toBe(null);
    expect(wrapper.instance().props.onInit).toBe(null);
    expect(wrapper.instance().props.onSave).toBe(null);
    expect(wrapper.instance().props.onSaveDone).toBe(null);
    expect(wrapper.instance().props.onSaveFail).toBe(null);
    expect(wrapper.instance().props.onSaveByKey).toBe(null);
    expect(wrapper.instance().props.onValidate).toBe(null);
    expect(wrapper.instance().props.onReset).toBe(null);
    expect(wrapper.instance().props.onCancel).toBe(null);
    expect(wrapper.instance().props.saveOnEnter).toBeTruthy();
    expect(wrapper.instance().props.saveOnEnter).not.toBeNull();
    expect(wrapper.instance().props.saveOnEnter).not.toBeUndefined();
  });

  it(`UU5.Commons. Elementary, Base, Pure,Section`, () => {
    const wrapper = shallow(<UU5.Forms.Form id={"uuID"} />);
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
    //check section value:
    expect(wrapper.instance().props.header).toBe(null);
    expect(wrapper.instance().props.footer).toBe(null);
    expect(wrapper.instance().props.underline).toBeFalsy();
  });
});
