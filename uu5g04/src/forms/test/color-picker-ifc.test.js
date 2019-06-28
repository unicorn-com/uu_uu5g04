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
import { shallow, mount } from "enzyme";
import UU5 from "uu5g04";
import "uu5g04-bricks";
import "uu5g04-forms";
import enzymeToJson from "enzyme-to-json";

const TagName = "UU5.Forms.ColorPicker";

describe("UU5.Form.ColorPicker intreface testing", () => {
  it("toggle(setStateCallBack, e)", () => {
    const wrapper = mount(<UU5.Forms.ColorPicker id={"idColorPicker"} label="color" value="" size="s" />);
    expect(wrapper.instance().state.open).toBeFalsy();
    const returnValue = wrapper.instance().toggle();
    wrapper.update();
    expect(returnValue).toBe(wrapper.instance());
    expect(wrapper.instance().state.open).toBeTruthy();
    wrapper.instance().toggle(); //close component
    wrapper.update();
    expect(wrapper.instance().state.open).toBeFalsy();
  });

  it("open(setStateCallBack, e)", () => {
    const wrapper = mount(<UU5.Forms.ColorPicker id={"idColorPicker"} label="color" value="" size="s" />);
    const mockFunc = jest.fn();
    expect(wrapper.instance().state.open).toBeFalsy();
    wrapper.instance().open(mockFunc);
    wrapper.update();
    expect(wrapper.instance().state.open).toBeTruthy();
    const returnValue = wrapper.instance().close(mockFunc);
    wrapper.update();
    expect(mockFunc).toBeCalled();
    expect(returnValue).toBe(wrapper.instance());
    expect(wrapper.instance().state.open).toBeFalsy();
  });

  it("close(setStateCallBack, e)", () => {
    const wrapper = mount(<UU5.Forms.ColorPicker id={"idColorPicker"} label="color" value="" size="s" />);
    const mockFunc = jest.fn();
    expect(wrapper.instance().state.open).toBeFalsy();
    wrapper.instance().open(mockFunc);
    wrapper.update();
    expect(wrapper.instance().state.open).toBeTruthy();
    const returnValue = wrapper.instance().close(mockFunc);
    wrapper.update();
    expect(mockFunc).toBeCalled();
    expect(returnValue).toBe(wrapper.instance());
    expect(wrapper.instance().state.open).toBeFalsy();
  });

  it("isOpen()", () => {
    const wrapper = mount(<UU5.Forms.ColorPicker id={"idColorPicker"} label="color" value="" size="s" />);
    expect(wrapper.instance().state.open).toBeFalsy();
    wrapper.instance().open();
    wrapper.update();
    const returnValue = wrapper.instance().isOpen();
    wrapper.update();
    expect(returnValue).toBeTruthy();
  });
});

describe("UU5.Forms.ColorPicker interface", () => {
  it("isInput()", () => {
    const wrapper = shallow(<UU5.Forms.ColorPicker id={"idColorPicker"} label="color" value="" size="s" />);
    expect(wrapper.instance().isInput()).toBeTruthy();
    expect(enzymeToJson(wrapper)).toMatchSnapshot();
  });

  it("getValue() should return value", () => {
    const wrapper = shallow(<UU5.Forms.ColorPicker id={"idColorPicker"} label="color" value="#FFFFFF" size="s" />);
    expect(wrapper.instance().getValue()).toMatch("#FFFFFF");
    expect(enzymeToJson(wrapper)).toMatchSnapshot();
  });

  it("getValue() value is empty. Should return empty string.", () => {
    const wrapper = shallow(<UU5.Forms.ColorPicker id={"idColorPicker"} label="color" value="" size="s" />);
    expect(wrapper.instance().getValue()).toEqual("");
    expect(enzymeToJson(wrapper)).toMatchSnapshot();
  });

  it("setValue(value,setStateCallBack)", () => {
    const wrapper = shallow(<UU5.Forms.ColorPicker id={"idColorPicker"} label="color" value="" size="s" />);
    expect(wrapper.instance().getValue()).toEqual("");
    const mockFunc = jest.fn();
    expect(enzymeToJson(wrapper)).toMatchSnapshot();
    const returnValue = wrapper.instance().setValue("#FFFFFF", mockFunc);
    wrapper.update();
    expect(mockFunc).toBeCalled();
    expect(mockFunc).toHaveBeenCalledTimes(1);
    expect(returnValue).toBe(wrapper.instance());
    expect(wrapper.instance().getValue()).toMatch("#FFFFFF");
    expect(enzymeToJson(wrapper)).toMatchSnapshot();
  });

  it("getMessage()", () => {
    const wrapper = shallow(<UU5.Forms.ColorPicker id={"idColorPicker"} label="color" value="" size="s" />);
    expect(wrapper.instance().getMessage()).toBe(null);
    expect(enzymeToJson(wrapper)).toMatchSnapshot();
    wrapper.setProps({ message: "New Setting message" });
    expect(wrapper.instance().getMessage()).toEqual("New Setting message");
  });

  it("setMessage(msg, setStateCallBack)", () => {
    const wrapper = shallow(<UU5.Forms.ColorPicker id={"idColorPicker"} label="color" value="" size="s" />);
    const mockFunc = jest.fn();
    expect(enzymeToJson(wrapper)).toMatchSnapshot();
    expect(wrapper.instance().getMessage()).toBeNull();
    const returnValue = wrapper.instance().setMessage("New Message", mockFunc);
    wrapper.update();
    expect(mockFunc).toBeCalled();
    expect(mockFunc).toHaveBeenCalledTimes(1);
    expect(returnValue).toBe(wrapper.instance());
    expect(wrapper.instance().getMessage()).toEqual("New Message");
    expect(enzymeToJson(wrapper)).toMatchSnapshot();
  });

  it("getFeedBack()", () => {
    const wrapper = shallow(<UU5.Forms.ColorPicker id={"idColorPicker"} label="color" value="" size="s" />);
    expect(wrapper.instance().getFeedback()).toEqual("initial");
    expect(enzymeToJson(wrapper)).toMatchSnapshot();
    wrapper.setProps({ feedback: "success" });
    wrapper.update();
    expect(wrapper.instance().getFeedback()).toEqual("success");
    expect(enzymeToJson(wrapper)).toMatchSnapshot();
  });

  it("setFeedBack(feedback, message, value, setStateCallBack)", () => {
    const wrapper = shallow(<UU5.Forms.ColorPicker id={"idColorPicker"} label="color" value="" size="s" />);
    expect(wrapper.instance().getFeedback()).toEqual("initial");
    expect(wrapper.instance().getMessage()).toBe(null);
    expect(wrapper.instance().getValue()).toEqual("");
    const mockFunc = jest.fn();
    expect(enzymeToJson(wrapper)).toMatchSnapshot();
    const returnValue = wrapper.instance().setFeedback("success", "This is valid message.", "#FFFFFF", mockFunc);
    wrapper.update();
    expect(mockFunc).toBeCalled();
    expect(mockFunc).toHaveBeenCalledTimes(1);
    expect(returnValue).toBe(wrapper.instance());
    expect(wrapper.instance().getFeedback()).toEqual("success");
    expect(wrapper.instance().getMessage()).toEqual("This is valid message.");
    expect(wrapper.instance().getValue()).toEqual("#FFFFFF");
    expect(enzymeToJson(wrapper)).toMatchSnapshot();
  });

  it("setInitial(msg, value, setStateCallBack)", () => {
    const wrapper = shallow(
      <UU5.Forms.ColorPicker
        id={"idColorPicker"}
        label="color"
        value=""
        message={"This input is required"}
        feedback={"error"}
        size="s"
      />
    );
    const mockFunc = jest.fn();
    expect(enzymeToJson(wrapper)).toMatchSnapshot();
    expect(wrapper.instance().getFeedback()).toEqual("error");
    expect(wrapper.instance().getValue()).toEqual("");
    expect(wrapper.instance().getMessage()).toEqual("This input is required");
    expect(wrapper.instance().isInitial()).toBeFalsy();
    const returnValue = wrapper.instance().setInitial("Initial Message", "", mockFunc);
    wrapper.update();
    expect(mockFunc).toBeCalled();
    expect(mockFunc).toHaveBeenCalledTimes(1);
    expect(returnValue).toBe(wrapper.instance());
    expect(wrapper.instance().getFeedback()).toEqual("initial");
    expect(wrapper.instance().getValue()).toEqual("");
    expect(wrapper.instance().getMessage()).toEqual("Initial Message");
    expect(wrapper.instance().isInitial()).toBeTruthy();
    expect(enzymeToJson(wrapper)).toMatchSnapshot();
  });

  it("isInitial()", () => {
    const wrapper = shallow(<UU5.Forms.ColorPicker id={"idColorPicker"} label="color" value="" size="s" />);
    const mockFunc = jest.fn();
    expect(wrapper.instance().isInitial()).toBeTruthy();
    expect(enzymeToJson(wrapper)).toMatchSnapshot();
    wrapper.instance().setFeedback("error", "Error messagess", "", mockFunc);
    wrapper.update();
    expect(wrapper.instance().isInitial()).toBeFalsy();
    expect(enzymeToJson(wrapper)).toMatchSnapshot();
  });

  it("setLoading(message, value, setStateCallBack)", () => {
    const wrapper = shallow(<UU5.Forms.ColorPicker id={"idColorPicker"} label="color" value="" size="s" />);
    const mockFunc = jest.fn();
    expect(enzymeToJson(wrapper)).toMatchSnapshot();
    expect(wrapper.instance().getValue()).toEqual("");
    expect(wrapper.instance().getMessage()).toBeNull();
    expect(wrapper.instance().isLoading()).toBeFalsy();
    const returnValue = wrapper.instance().setLoading("Loading messsagess", "#FFFFFF", mockFunc);
    wrapper.update();
    expect(mockFunc).toBeCalled();
    expect(mockFunc).toHaveBeenCalledTimes(1);
    expect(returnValue).toBe(wrapper.instance());
    expect(wrapper.instance().isLoading()).toBeTruthy();
    expect(wrapper.instance().getMessage()).toEqual("Loading messsagess");
    expect(wrapper.instance().getValue()).toEqual("#FFFFFF");
    expect(enzymeToJson(wrapper)).toMatchSnapshot();
  });

  it("isLoading()", () => {
    const wrapper = shallow(<UU5.Forms.ColorPicker id={"idColorPicker"} label="color" value="" size="s" />);
    expect(wrapper.instance().isLoading()).toBeFalsy();
    expect(enzymeToJson(wrapper)).toMatchSnapshot();
  });

  it("setSuccess(message, value, setStateCallBack)", () => {
    const wrapper = shallow(<UU5.Forms.ColorPicker id={"idColorPicker"} label="color" value="" size="s" />);
    const mockFunc = jest.fn();
    expect(wrapper.instance().getFeedback()).toEqual("initial");
    expect(wrapper.instance().getMessage()).toBe(null);
    expect(wrapper.instance().getValue()).toEqual("");
    expect(enzymeToJson(wrapper)).toMatchSnapshot();
    const returnValue = wrapper.instance().setSuccess("This is success message", "#FFFFFF", mockFunc);
    wrapper.update();
    expect(mockFunc).toBeCalled();
    expect(mockFunc).toHaveBeenCalledTimes(1);
    expect(returnValue).toBe(wrapper.instance());
    expect(wrapper.instance().getFeedback()).toEqual("success");
    expect(wrapper.instance().getMessage()).toEqual("This is success message");
    expect(wrapper.instance().getValue()).toEqual("#FFFFFF");
    expect(wrapper.instance().isSuccess()).toBeTruthy();
    expect(enzymeToJson(wrapper)).toMatchSnapshot();
  });

  it("isSuccess() fisr return false, second return true", () => {
    const wrapper = shallow(<UU5.Forms.ColorPicker id={"idColorPicker"} label="color" value="" size="s" />);
    const mockFunc = jest.fn();
    expect(wrapper.instance().isSuccess()).toBeFalsy();
    const returnValue = wrapper.instance().setSuccess("This is success message", "#FFFFFF", mockFunc);
    wrapper.update();
    expect(mockFunc).toBeCalled();
    expect(mockFunc).toHaveBeenCalledTimes(1);
    expect(returnValue).toBe(wrapper.instance());
    expect(wrapper.instance().getFeedback()).toEqual("success");
    expect(wrapper.instance().getMessage()).toEqual("This is success message");
    expect(wrapper.instance().getValue()).toEqual("#FFFFFF");
    expect(wrapper.instance().isSuccess()).toBeTruthy();
    expect(enzymeToJson(wrapper)).toMatchSnapshot();
  });

  it("setWarning(message, value, setStateCallBack)", () => {
    const wrapper = shallow(<UU5.Forms.ColorPicker id={"idColorPicker"} label="color" value="" size="s" />);
    const mockFunc = jest.fn();
    expect(wrapper.instance().getFeedback()).toEqual("initial");
    expect(wrapper.instance().getMessage()).toBe(null);
    expect(wrapper.instance().getValue()).toEqual("");
    expect(enzymeToJson(wrapper)).toMatchSnapshot();
    expect(wrapper.instance().isSuccess()).toBeFalsy();
    expect(wrapper.instance().isWarning()).toBeFalsy();
    const returnValue = wrapper.instance().setWarning("This is warning message", "#FFFFFF", mockFunc);
    wrapper.update();
    expect(mockFunc).toBeCalled();
    expect(mockFunc).toHaveBeenCalledTimes(1);
    expect(returnValue).toBe(wrapper.instance());
    expect(wrapper.instance().getFeedback()).toEqual("warning");
    expect(wrapper.instance().getMessage()).toEqual("This is warning message");
    expect(wrapper.instance().getValue()).toEqual("#FFFFFF");
    expect(wrapper.instance().isWarning()).toBeTruthy();
    expect(wrapper.instance().isSuccess()).toBeFalsy();
    expect(enzymeToJson(wrapper)).toMatchSnapshot();
  });

  it("isWarning()", () => {
    const wrapper = shallow(
      <UU5.Forms.ColorPicker
        id={"idColorPicker"}
        label="color"
        value=""
        feedback={"warning"}
        message={"Warning message"}
        size="s"
      />
    );
    const mockFunc = jest.fn();
    expect(wrapper.instance().getFeedback()).toEqual("warning");
    expect(wrapper.instance().getMessage()).toEqual("Warning message");
    expect(wrapper.instance().isWarning()).toBeTruthy();
    expect(enzymeToJson(wrapper)).toMatchSnapshot();
    const setRetVal = wrapper.instance().setFeedback("success", "success message", "#FFFFFF", mockFunc);
    wrapper.update();
    expect(mockFunc).toBeCalled();
    expect(setRetVal).toBe(wrapper.instance());
    expect(wrapper.instance().isWarning()).toBeFalsy();
    expect(enzymeToJson(wrapper)).toMatchSnapshot();
  });

  it("setError(message, value, setStateCallBack)", () => {
    const wrapper = shallow(<UU5.Forms.ColorPicker id={"idColorPicker"} label="color" value="" size="s" />);
    const mockFunc = jest.fn();
    expect(wrapper.instance().isError()).toBeFalsy();
    expect(wrapper.instance().isWarning()).toBeFalsy();
    expect(wrapper.instance().isSuccess()).toBeFalsy();
    expect(wrapper.instance().isInitial()).toBeTruthy();
    expect(wrapper.instance().getValue()).toEqual("");
    expect(wrapper.instance().getFeedback()).toEqual("initial");
    expect(wrapper.instance().getMessage()).toBe(null);
    expect(enzymeToJson(wrapper)).toMatchSnapshot();
    const returnValue = wrapper.instance().setError("This is error mesage", "#FFFFFF", mockFunc);
    wrapper.update();
    expect(mockFunc).toBeCalled();
    expect(mockFunc).toHaveBeenCalledTimes(1);
    expect(returnValue).toBe(wrapper.instance());
    expect(wrapper.instance().isWarning()).toBeFalsy();
    expect(wrapper.instance().isSuccess()).toBeFalsy();
    expect(wrapper.instance().isInitial()).toBeFalsy();
    expect(wrapper.instance().isError()).toBeTruthy();
    expect(wrapper.instance().getValue()).toEqual("#FFFFFF");
    expect(wrapper.instance().getFeedback()).toEqual("error");
    expect(wrapper.instance().getMessage()).toEqual("This is error mesage");
    expect(enzymeToJson(wrapper)).toMatchSnapshot();
  });

  it("isError()", () => {
    const wrapper = shallow(
      <UU5.Forms.ColorPicker
        id={"idColorPicker"}
        label="color"
        value=""
        feedback={"error"}
        message={"Error message"}
        size="s"
      />
    );
    const mockFunc = jest.fn();
    expect(wrapper.instance().getFeedback()).toEqual("error");
    expect(wrapper.instance().getMessage()).toEqual("Error message");
    expect(wrapper.instance().isError()).toBeTruthy();
    expect(enzymeToJson(wrapper)).toMatchSnapshot();
    const setRetVal = wrapper.instance().setFeedback("success", "success message", "#FFFFFF", mockFunc);
    wrapper.update();
    expect(mockFunc).toBeCalled();
    expect(setRetVal).toBe(wrapper.instance());
    expect(wrapper.instance().isError()).toBeFalsy();
    expect(enzymeToJson(wrapper)).toMatchSnapshot();
  });

  it("reset(setStateCallBack)", () => {
    const wrapper = shallow(<UU5.Forms.ColorPicker id={"idColorPicker"} label="color" value="" size="s" />);
    const mockFunc = jest.fn();
    wrapper.instance().setFeedback("success", "New Message", "#FFFFFF", mockFunc);
    wrapper.update();
    wrapper.instance().readOnly(mockFunc);
    wrapper.update();
    expect(wrapper.instance().getFeedback()).toEqual("success");
    expect(wrapper.instance().getMessage()).toEqual("New Message");
    expect(wrapper.instance().getValue()).toEqual("#FFFFFF");
    expect(wrapper.instance().isReadOnly()).toBeTruthy();
    expect(mockFunc).toBeCalled();
    expect(enzymeToJson(wrapper)).toMatchSnapshot();
    //Now we reset seting value.
    const returnValue = wrapper.instance().reset(mockFunc);
    wrapper.update();
    expect(mockFunc).toBeCalled();
    expect(mockFunc).toHaveBeenCalledTimes(3);
    expect(returnValue).toBe(wrapper.instance());
    expect(wrapper.instance().getValue()).toEqual("");
    expect(wrapper.instance().getFeedback()).toEqual("initial");
    expect(wrapper.instance().getMessage()).toBe(null);
    expect(wrapper.instance().isReadOnly()).toBeFalsy();
    expect(enzymeToJson(wrapper)).toMatchSnapshot();
  });

  it("getChangeFeedback()", () => {
    const wrapper = shallow(<UU5.Forms.ColorPicker id={"idColorPicker"} label="color" value="" size="s" />);
    expect(wrapper.instance().getChangeFeedback({})).toEqual(
      expect.objectContaining({
        feedback: "initial",
        message: null,
        value: ""
      })
    );
    expect(enzymeToJson(wrapper)).toMatchSnapshot();
  });

  it("setChangeFeedback()", () => {
    const wrapper = shallow(<UU5.Forms.ColorPicker id={"idColorPicker"} label="color" value="" size="s" />);
    const mockFunc = jest.fn();
    expect(wrapper.instance().getChangeFeedback({})).toEqual(
      expect.objectContaining({ feedback: "initial", message: null, value: "" })
    );
    const returnValue = wrapper.instance().setChangeFeedback(
      {
        feedback: "error",
        message: "Error message from setChangeFeedback",
        value: "wrong value"
      },
      mockFunc
    );
    wrapper.update();
    expect(returnValue).toBe(wrapper.instance());
    expect(mockFunc).toBeCalled();
    expect(wrapper.instance().state.value).toEqual("wrong value");
    expect(wrapper.instance().state.feedback).toEqual("error");
    expect(wrapper.instance().state.message).toEqual("Error message from setChangeFeedback");
    expect(enzymeToJson(wrapper)).toMatchSnapshot();
  });

  it("isReadOnly()", () => {
    const wrapper = shallow(<UU5.Forms.ColorPicker id={"idColorPicker"} label="color" value="" size="s" />);
    const mockFunc = jest.fn();
    expect(wrapper.instance().isReadOnly()).toBeFalsy();
    expect(enzymeToJson(wrapper)).toMatchSnapshot();
    const returnValue = wrapper.instance().readOnly(mockFunc);
    wrapper.update();
    expect(mockFunc).toBeCalled();
    expect(returnValue).toBe(wrapper.instance());
    expect(wrapper.instance().isReadOnly()).toBeTruthy();
    expect(enzymeToJson(wrapper)).toMatchSnapshot();
  });

  it("setEditableValue(true, setStateCallback)", () => {
    const wrapper = shallow(<UU5.Forms.ColorPicker id={"idColorPicker"} label="color" value="" size="s" />);
    const mockFunc = jest.fn();
    expect(enzymeToJson(wrapper)).toMatchSnapshot();
    expect(wrapper.instance().isReadOnly()).toBeFalsy();
    expect(wrapper.instance().editable(mockFunc)).toBeTruthy();
    expect(mockFunc).toBeCalled();
    wrapper.instance().readOnly(mockFunc);
    wrapper.update();
    const returnValue = wrapper.instance().setEditableValue(true, mockFunc);
    wrapper.update();
    expect(mockFunc).toHaveBeenCalledTimes(3);
    expect(returnValue).toBe(wrapper.instance());
    expect(wrapper.instance().isReadOnly()).toBeFalsy();
    expect(wrapper.instance().editable(mockFunc)).toBeTruthy();
    expect(enzymeToJson(wrapper)).toMatchSnapshot();
    expect(mockFunc).toHaveBeenCalledTimes(4);
  });

  it("setEditableValue(false, setStateCallback)", () => {
    const wrapper = shallow(<UU5.Forms.ColorPicker id={"idColorPicker"} label="color" value="" size="s" />);
    const mockFunc = jest.fn();
    expect(enzymeToJson(wrapper)).toMatchSnapshot();
    expect(wrapper.instance().isReadOnly()).toBeFalsy();
    expect(wrapper.instance().editable(mockFunc)).toBeTruthy();
    expect(mockFunc).toBeCalled();
    wrapper.instance().readOnly(mockFunc);
    wrapper.update();
    const returnValue = wrapper.instance().setEditableValue(false, mockFunc);
    wrapper.update();
    expect(mockFunc).toHaveBeenCalledTimes(3);
    expect(returnValue).toBe(wrapper.instance());
    expect(wrapper.instance().isReadOnly()).toBeTruthy();
    expect(enzymeToJson(wrapper)).toMatchSnapshot();
    expect(mockFunc).toHaveBeenCalledTimes(3);
  });

  it("readOnly(setStatecallback)", () => {
    const wrapper = shallow(<UU5.Forms.ColorPicker id={"idColorPicker"} label="color" value="" size="s" />);
    expect(wrapper.instance().isReadOnly()).toBeFalsy();
    const mockFunc = jest.fn();
    expect(enzymeToJson(wrapper)).toMatchSnapshot();
    const returnValue = wrapper.instance().readOnly(mockFunc);
    wrapper.update();
    expect(mockFunc).toBeCalled();
    expect(mockFunc).toHaveBeenCalledTimes(1);
    expect(returnValue).toBe(wrapper.instance());
    expect(wrapper.instance().isReadOnly()).toBeTruthy();
    expect(enzymeToJson(wrapper)).toMatchSnapshot();
  });

  it("editable(setStatecallback)", () => {
    const wrapper = shallow(<UU5.Forms.ColorPicker id={"idColorPicker"} label="color" value="" size="s" />);
    const mockFunc = jest.fn();
    expect(wrapper.instance().isReadOnly()).toBeFalsy();
    expect(wrapper.instance().state.readOnly).toBeFalsy();
    wrapper.instance().readOnly(mockFunc);
    wrapper.update();
    expect(wrapper.instance().isReadOnly()).toBeTruthy();
    expect(wrapper.instance().state.readOnly).toBeTruthy();
    expect(enzymeToJson(wrapper)).toMatchSnapshot();
    const returnValue = wrapper.instance().editable(mockFunc);
    wrapper.update();
    expect(mockFunc).toBeCalled();
    expect(mockFunc).toHaveBeenCalledTimes(2);
    expect(returnValue).toBe(wrapper.instance());
    expect(wrapper.instance().isReadOnly()).toBeFalsy();
    expect(wrapper.instance().state.readOnly).toBeFalsy();
    expect(enzymeToJson(wrapper)).toMatchSnapshot();
  });

  it("getLabel(idinput)", () => {
    const wrapper = shallow(<UU5.Forms.ColorPicker id={"idColorPicker"} label="color" value="" size="s" />);
    expect(wrapper.instance().getLabel()).not.toBeNull();
    expect(wrapper.instance().getLabel()).not.toBeUndefined();
    expect(() => wrapper.instance().getLabel()).not.toThrow();
    expect(wrapper.instance().getLabel()).toEqual(expect.any(Object));
    expect(wrapper.instance().getLabel()).toBeInstanceOf(Object);
    expect(wrapper).toMatchSnapshot();
  });

  it("getInputWrapper(inpuid)", () => {
    const wrapper = shallow(<UU5.Forms.ColorPicker id={"idColorPicker"} label="color" value="" size="s" />);
    expect(wrapper.instance().getInputWrapper()).not.toBeNull();
    expect(wrapper.instance().getInputWrapper()).not.toBeUndefined();
    expect(() => wrapper.instance().getInputWrapper()).not.toThrow();
    expect(wrapper.instance().getInputWrapper()).toEqual(expect.any(Object));
    expect(wrapper.instance().getInputWrapper()).toBeInstanceOf(Object);
    expect(wrapper).toMatchSnapshot();
  });

  it("Test colors sets in different format.", () => {
    const wrapper = shallow(<UU5.Forms.ColorPicker id={"idColorPicker"} label="color" value="" size="s" />);
    expect(wrapper.instance().getValue()).toEqual("");

    // set white color as hexa
    wrapper.setProps({ value: "#FFFFFF" });
    wrapper.update();
    expect(wrapper.instance().getValue()).toEqual("#FFFFFF");

    // set white color as rgb
    wrapper.setProps({ value: "rgb(255,255,255)" });
    wrapper.update();
    expect(wrapper.instance().getValue()).toEqual("rgb(255,255,255)");

    // set white color as rgba
    wrapper.setProps({ value: "rgba(255,255,255, 1)" });
    wrapper.update();
    expect(wrapper.instance().getValue()).toEqual("rgba(255,255,255, 1)");

    // set white color with opacity
    wrapper.setProps({ value: "rgba(255, 255, 255, .4)" });
    wrapper.update();
    expect(wrapper.instance().getValue()).toEqual("rgba(255, 255, 255, .4)");
  });

  it("UU5.Forms.ColorPicker - test open and close fn", () => {
    let callback = jest.fn();
    const wrapper = shallow(<UU5.Forms.ColorPicker id={"idColorPicker"} label="color" value="" size="s" />);
    expect(wrapper.instance().isOpen()).toBeFalsy();
    expect(callback).not.toBeCalled();

    // open
    wrapper.instance().open(callback);
    expect(callback).toBeCalled();
    expect(callback).toBeCalledTimes(1);
    expect(wrapper.instance().isOpen()).toBeTruthy();

    // close
    wrapper.instance().close(callback);
    expect(callback).toBeCalledTimes(2);
    expect(wrapper.instance().isOpen()).toBeFalsy();

    // open
    wrapper.instance().toggle(callback);
    expect(callback).toBeCalledTimes(3);
    expect(wrapper.instance().isOpen()).toBeTruthy()

    // close
    wrapper.instance().toggle(callback);
    expect(callback).toBeCalledTimes(4);
    expect(wrapper.instance().isOpen()).toBeFalsy();
  });

  it("UU5.Forms.ColorPicker - setValue", () => {
    const wrapper = shallow(<UU5.Forms.ColorPicker />);
    expect(wrapper.instance().getValue()).toEqual("");
    wrapper.instance().setValue("#FFFFFF");
    expect(wrapper.instance().getValue()).toEqual("#FFFFFF");
  });

  it("UU5.Forms.ColorPicker - set invalid values", () => {

    const wrapper = shallow(<UU5.Forms.ColorPicker value="#FFFFFF" />);
    expect(wrapper.instance().getValue()).toEqual("#FFFFFF");
    // set invalid color -> component reset value to empty value
    let invalidColors = [
      // invalid hexa characters
      "#XXXXXX",
      // invalid color - too long hexa
      "#1234567",
      // invalid color - too shorrt hexa
      "#1234",
      // invalid rgb - negative number
      "rgb(100, -20, 100)",
      // invalid rgb - number larger then 255
      "rgb(256, 100, 100)",
      // invalid rgba - too large opacity
      "rgba(100, 100, 100, 2)"
    ];

    for (let i = 0; i < invalidColors.length; i++) {
      let value = invalidColors[i];

      // test change props
      wrapper.setProps({ value });
      wrapper.update();
      expect(wrapper.instance().getValue()).toEqual("");
      wrapper.setProps({ value: "#FFFFFF" });
      wrapper.update();
      expect(wrapper.instance().getValue()).toEqual("#FFFFFF");

      // test setValue API
      wrapper.instance().setValue(value);
      expect(wrapper.instance().getValue()).toEqual("");
      wrapper.instance().setValue("#FFFFFF");
      expect(wrapper.instance().getValue()).toEqual("#FFFFFF");
    }
  });

  it("UU5.Forms.ColorPicker - test custom validation", () => {
    const validFn = jest.fn(opt => {
      return { feedback: "initial", value: opt.value, message: "OK" };
    });
    const wrapper = shallow(<UU5.Forms.ColorPicker value="#FFFFFF" onValidate={validFn} />);
    expect(wrapper.instance().getValue()).toEqual("#FFFFFF");
    expect(validFn).not.toBeCalled();

    // test using only custom validation - disable component validation
    wrapper.setProps({ value: "#XXXXXX" });
    wrapper.update();
    expect(validFn).toBeCalled();
    expect(validFn).toBeCalledTimes(1);
    expect(wrapper.instance().getValue()).toEqual("");

    // reset back color to white to test effect of set invalid color via setValue API
    wrapper.setProps({ value: "#FFFFFF" });
    wrapper.update();
    expect(validFn).toBeCalledTimes(2);
    expect(wrapper.instance().getValue()).toEqual("#FFFFFF");

    wrapper.instance().setValue("#YYYYYY");
    expect(validFn).toBeCalledTimes(3);
    expect(wrapper.instance().getValue()).toEqual("");
  });

  it("UU5.Forms.ColorPicker - choose color from dialog", () => {
    const wrapper = mount(<UU5.Forms.ColorPicker value="#FFFFFF" />);

    expect(wrapper.instance().isOpen()).toBeFalsy();
    // open dialog by click on the button
    wrapper
      .find(UU5.Bricks.Button)
      .first()
      .simulate("click");

    expect(wrapper.instance().isOpen()).toBeTruthy();

    // check that palette is rendered
    let palette = wrapper.find(UU5.Bricks.ColorPalette);
    expect(palette.length).toBe(1);

    // emotion stable className for button with red color schema and shade 300
    let colorButton = palette.find({ className: "uu-pywk7e uu-1vlgrye" });
    expect(colorButton.length).toBe(1);

    colorButton.simulate("click");
    expect(wrapper.instance().getValue()).toBe(UU5.Environment.colors.red.c300);
    expect(wrapper.instance().isOpen()).toBeFalsy();
  });
});
