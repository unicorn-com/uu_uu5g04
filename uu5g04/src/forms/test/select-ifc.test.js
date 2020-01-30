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

import UU5 from "uu5g04";
import "uu5g04-bricks";
import "uu5g04-forms";

const { mount, shallow, wait } = UU5.Test.Tools;

describe("UU5.Forms.Select interface test", () => {
  it("isOpen() should return false", () => {
    const wrapper = shallow(
      <UU5.Forms.Select id={"idSelect"} label="Issue category" disableBackdrop multiple>
        <UU5.Forms.Select.Option id={"item01"} value="Info" />
        <UU5.Forms.Select.Option id={"item02"} value="Bug" />
        <UU5.Forms.Select.Option id={"item03"} value="Task" />
      </UU5.Forms.Select>
    );
    expect(wrapper.instance().state.open).toBeFalsy();
    expect(wrapper.instance().isOpen()).toBeFalsy();
    expect(wrapper).toMatchSnapshot();
  });

  it("isOpen() should return true", () => {
    const wrapper = shallow(
      <UU5.Forms.Select id={"idSelect"} label="Issue category" disableBackdrop multiple>
        <UU5.Forms.Select.Option id={"item01"} value="Info" />
        <UU5.Forms.Select.Option id={"item02"} value="Bug" />
        <UU5.Forms.Select.Option id={"item03"} value="Task" />
      </UU5.Forms.Select>
    );
    const mockFunc = jest.fn();
    expect(wrapper.instance().state.open).toBeFalsy();
    expect(wrapper.instance().isOpen()).toBeFalsy();
    expect(wrapper).toMatchSnapshot();
    const returnOpen = wrapper.instance().open(mockFunc);
    wrapper.update();
    expect(wrapper.instance().state.open).toBeTruthy();
    expect(wrapper.instance().isOpen()).toBeTruthy();
    expect(mockFunc).toBeCalled();
    expect(returnOpen).toBe(wrapper.instance());
    expect(wrapper).toMatchSnapshot();
  });

  it("open(setStateCallBack)", () => {
    const wrapper = shallow(
      <UU5.Forms.Select id={"idSelect"} label="Issue category" disableBackdrop multiple>
        <UU5.Forms.Select.Option id={"item01"} value="Info" />
        <UU5.Forms.Select.Option id={"item02"} value="Bug" />
        <UU5.Forms.Select.Option id={"item03"} value="Task" />
      </UU5.Forms.Select>
    );
    const mockFunc = jest.fn();
    expect(wrapper.instance().state.open).toBeFalsy();
    expect(wrapper.instance().isOpen()).toBeFalsy();
    expect(wrapper).toMatchSnapshot();
    const returnOpen = wrapper.instance().open(mockFunc);
    wrapper.update();
    expect(wrapper.instance().state.open).toBeTruthy();
    expect(wrapper.instance().isOpen()).toBeTruthy();
    expect(mockFunc).toBeCalled();
    expect(returnOpen).toBe(wrapper.instance());
    expect(wrapper).toMatchSnapshot();
  });

  it("close(setStateCallBack)", () => {
    const wrapper = shallow(
      <UU5.Forms.Select id={"idSelect"} label="Issue category" disableBackdrop multiple>
        <UU5.Forms.Select.Option id={"item01"} value="Info" />
        <UU5.Forms.Select.Option id={"item02"} value="Bug" />
        <UU5.Forms.Select.Option id={"item03"} value="Task" />
      </UU5.Forms.Select>
    );
    const mockFunc = jest.fn();
    expect(wrapper.instance().state.open).toBeFalsy();
    expect(wrapper.instance().isOpen()).toBeFalsy();
    expect(wrapper).toMatchSnapshot();
    const returnOpen = wrapper.instance().open(mockFunc);
    wrapper.update();
    expect(wrapper.instance().state.open).toBeTruthy();
    expect(wrapper.instance().isOpen()).toBeTruthy();
    expect(mockFunc).toBeCalled();
    expect(returnOpen).toBe(wrapper.instance());
    expect(wrapper).toMatchSnapshot();
    const returnClose = wrapper.instance().close(mockFunc);
    wrapper.update();
    expect(mockFunc).toHaveBeenCalledTimes(2);
    expect(returnClose).toBe(wrapper.instance());
    expect(wrapper.instance().state.open).toBeFalsy();
    expect(wrapper.instance().isOpen()).toBeFalsy();
    expect(wrapper).toMatchSnapshot();
  });

  it("toggle(setStateCallBack)", () => {
    const wrapper = mount(
      <UU5.Forms.Select id={"idSelect"} label="Issue category" disableBackdrop multiple>
        <UU5.Forms.Select.Option id={"item01"} value="Info" />
        <UU5.Forms.Select.Option id={"item02"} value="Bug" />
        <UU5.Forms.Select.Option id={"item03"} value="Task" />
      </UU5.Forms.Select>
    );
    const mockFunc = jest.fn();
    expect(wrapper.instance().state.open).toBeFalsy();
    expect(wrapper.instance().isOpen()).toBeFalsy();
    const openMenu = wrapper.instance().toggle(mockFunc);
    wrapper.update();
    expect(mockFunc).toBeCalled();
    expect(mockFunc).toHaveBeenCalledTimes(1);
    expect(openMenu).toBe(wrapper.instance());
    expect(wrapper.instance().state.open).toBeTruthy();
    expect(wrapper.instance().isOpen()).toBeTruthy();
    const closeMenu = wrapper.instance().toggle(mockFunc);
    wrapper.update();
    expect(mockFunc).toBeCalled();
    expect(mockFunc).toHaveBeenCalledTimes(2);
    expect(closeMenu).toBe(wrapper.instance());
    expect(wrapper.instance().state.open).toBeFalsy();
    expect(wrapper.instance().isOpen()).toBeFalsy();
  });

  it("addValue(value, setStateCallBack)", () => {
    const wrapper = shallow(
      <UU5.Forms.Select id={"idSelect"} label="Issue category" disableBackdrop multiple>
        <UU5.Forms.Select.Option id={"item01"} value="Info" />
        <UU5.Forms.Select.Option id={"item02"} value="Bug" />
        <UU5.Forms.Select.Option id={"item03"} value="Task" />
      </UU5.Forms.Select>
    );
    const mockFunc = jest.fn();
    expect(wrapper.instance().state.value).toEqual(expect.arrayContaining([]));
    expect(wrapper).toMatchSnapshot();
    const returnValue = wrapper.instance().addValue("Task", mockFunc);
    wrapper.update();
    expect(mockFunc).toBeCalled();
    expect(returnValue).toBe(wrapper.instance());
    expect(wrapper.instance().state.value).toEqual(expect.arrayContaining(["Task"]));
    expect(wrapper).toMatchSnapshot();
  });

  it("removeValue(opt, setStateCallBack)", () => {
    const wrapper = mount(
      <UU5.Forms.Select id={"idSelect"} label="Issue category" disableBackdrop multiple>
        <UU5.Forms.Select.Option id={"item01"} value="Info" />
        <UU5.Forms.Select.Option id={"item02"} value="Bug" />
        <UU5.Forms.Select.Option id={"item03"} value="Task" />
      </UU5.Forms.Select>
    );
    const mockFunc = jest.fn();
    expect(wrapper.instance().state.value).toEqual(expect.arrayContaining([]));
    const returnValue = wrapper.instance().addValue("Task", mockFunc);
    wrapper.update();
    expect(mockFunc).toHaveBeenCalledTimes(1);
    expect(returnValue).toBe(wrapper.instance());
    expect(wrapper.instance().state.value).toEqual(expect.arrayContaining(["Task"]));
    const removeReturValue = wrapper.instance().removeValue({ index: 0 }, mockFunc);
    wrapper.update();
    expect(mockFunc).toHaveBeenCalledTimes(2);
    expect(wrapper.instance().state.value).toEqual(expect.arrayContaining([]));
    //expect(wrapper).toMatchSnapshot();
  });
});

describe("UU5.Forms.InputMixin interface test", () => {
  it("isInput()", () => {
    const wrapper = shallow(
      <UU5.Forms.Select id={"idSelect"} label="Issue category" disableBackdrop multiple>
        <UU5.Forms.Select.Option id={"item01"} value="Info" />
        <UU5.Forms.Select.Option id={"item02"} value="Bug" />
        <UU5.Forms.Select.Option id={"item03"} value="Task" />
      </UU5.Forms.Select>
    );
    expect(wrapper.instance().isInput()).toBeTruthy();
    expect(wrapper).toMatchSnapshot();
  });

  it("getValue() should return value", () => {
    const wrapper = mount(
      <UU5.Forms.Select id={"idSelect"} label="Issue category" value={"Info"}>
        <UU5.Forms.Select.Option id={"item01"} value="Info" />
        <UU5.Forms.Select.Option id={"item02"} value="Bug" />
        <UU5.Forms.Select.Option id={"item03"} value="Task" />
      </UU5.Forms.Select>
    );

    expect(wrapper.instance().getValue()).toEqual(expect.any(String));
    expect(wrapper.instance().getValue()).toEqual("Info");
  });

  it("getValue() value is empty. Should return empty string.", () => {
    const wrapper = shallow(
      <UU5.Forms.Select id={"idSelect"} label="Issue category">
        <UU5.Forms.Select.Option id={"item01"} value="Info" />
        <UU5.Forms.Select.Option id={"item02"} value="Bug" />
        <UU5.Forms.Select.Option id={"item03"} value="Task" />
      </UU5.Forms.Select>
    );
    expect(wrapper.instance().getValue()).toEqual(expect.arrayContaining([]));
    expect(wrapper).toMatchSnapshot();
  });

  it("setValue(value,setStateCallBack)", () => {
    const wrapper = mount(
      <UU5.Forms.Select id={"idSelect"} label="Issue category">
        <UU5.Forms.Select.Option id={"item01"} value="Info" />
        <UU5.Forms.Select.Option id={"item02"} value="Bug" />
        <UU5.Forms.Select.Option id={"item03"} value="Task" />
      </UU5.Forms.Select>
    );
    expect(wrapper.instance().getValue()).toEqual(expect.arrayContaining([]));
    expect(wrapper.instance().getValue()).toBe(undefined);
    const mockFunc = jest.fn();
    const returnValue = wrapper.instance().setValue(["Task"], mockFunc);
    wrapper.update();
    expect(mockFunc).toBeCalled();
    expect(mockFunc).toHaveBeenCalledTimes(1);
    expect(returnValue).toBe(wrapper.instance());
    expect(wrapper.instance().getValue()).toEqual("Task");
  });

  it("getMessage() should return null, second: shoudl return new mesage", () => {
    const wrapper = shallow(
      <UU5.Forms.Select id={"idSelect"} label="Issue category">
        <UU5.Forms.Select.Option id={"item01"} value="Info" />
        <UU5.Forms.Select.Option id={"item02"} value="Bug" />
        <UU5.Forms.Select.Option id={"item03"} value="Task" />
      </UU5.Forms.Select>
    );
    expect(wrapper.instance().getMessage()).toBe(null);
    expect(wrapper).toMatchSnapshot();
    wrapper.setProps({ message: "New Setting message" });
    expect(wrapper.instance().getMessage()).toEqual("New Setting message");
  });

  it("setMessage(msg, setStateCallBack)", () => {
    const wrapper = shallow(
      <UU5.Forms.Select id={"idSelect"} label="Issue category">
        <UU5.Forms.Select.Option id={"item01"} value="Info" />
        <UU5.Forms.Select.Option id={"item02"} value="Bug" />
        <UU5.Forms.Select.Option id={"item03"} value="Task" />
      </UU5.Forms.Select>
    );
    const mockFunc = jest.fn();
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.instance().getMessage()).toBeNull();
    const returnValue = wrapper.instance().setMessage("New Message", mockFunc);
    wrapper.update();
    expect(mockFunc).toBeCalled();
    expect(mockFunc).toHaveBeenCalledTimes(1);
    expect(returnValue).toBe(wrapper.instance());
    expect(wrapper.instance().getMessage()).toEqual("New Message");
    expect(wrapper).toMatchSnapshot();
  });

  it("getFeedBack()", () => {
    const wrapper = shallow(
      <UU5.Forms.Select id={"idSelect"} label="Issue category">
        <UU5.Forms.Select.Option id={"item01"} value="Info" />
        <UU5.Forms.Select.Option id={"item02"} value="Bug" />
        <UU5.Forms.Select.Option id={"item03"} value="Task" />
      </UU5.Forms.Select>
    );
    expect(wrapper.instance().getFeedback()).toEqual("initial");
    expect(wrapper).toMatchSnapshot();
    wrapper.setProps({ feedback: "success" });
    wrapper.update();
    expect(wrapper.instance().getFeedback()).toEqual("success");
    expect(wrapper).toMatchSnapshot();
  });

  it("setFeedBack(feedback, message, value, setStateCallBack)", () => {
    const wrapper = shallow(
      <UU5.Forms.Select id={"idSelect"} label="Issue category">
        <UU5.Forms.Select.Option id={"item01"} value="Info" />
        <UU5.Forms.Select.Option id={"item02"} value="Bug" />
        <UU5.Forms.Select.Option id={"item03"} value="Task" />
      </UU5.Forms.Select>
    );
    expect(wrapper.instance().getFeedback()).toEqual("initial");
    expect(wrapper.instance().getMessage()).toBe(null);
    expect(wrapper.instance().state.value).toEqual(expect.arrayContaining([]));
    const mockFunc = jest.fn();
    expect(wrapper).toMatchSnapshot();
    const returnValue = wrapper.instance().setFeedback("success", "This is valid message.", "Task", mockFunc);
    wrapper.update();
    expect(mockFunc).toBeCalled();
    expect(mockFunc).toHaveBeenCalledTimes(1);
    expect(returnValue).toBe(wrapper.instance());
    expect(wrapper.instance().getFeedback()).toEqual("success");
    expect(wrapper.instance().getMessage()).toEqual("This is valid message.");
    expect(wrapper.instance().state.value).toEqual(expect.arrayContaining(["Task"]));
    expect(wrapper).toMatchSnapshot();
  });

  it("setInitial(msg, value, setStateCallBack)", () => {
    const wrapper = shallow(
      <UU5.Forms.Select
        id={"idSelect"}
        label="Issue category"
        message={"This input is required"}
        feedback={"error"}
        required={true}
      >
        <UU5.Forms.Select.Option id={"item01"} value="Info" />
        <UU5.Forms.Select.Option id={"item02"} value="Bug" />
        <UU5.Forms.Select.Option id={"item03"} value="Task" />
      </UU5.Forms.Select>
    );
    const mockFunc = jest.fn();
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.instance().getFeedback()).toEqual("error");
    expect(wrapper.instance().state.value).toEqual(expect.arrayContaining([]));
    expect(wrapper.instance().getMessage()).toEqual("This input is required");
    expect(wrapper.instance().isInitial()).toBeFalsy();
    const returnValue = wrapper.instance().setInitial("Initial Message", "Task", mockFunc);
    wrapper.update();
    expect(mockFunc).toBeCalled();
    expect(mockFunc).toHaveBeenCalledTimes(1);
    expect(returnValue).toBe(wrapper.instance());
    expect(wrapper.instance().getFeedback()).toEqual("initial");
    expect(wrapper.instance().state.value).toEqual(expect.arrayContaining(["Task"]));
    expect(wrapper.instance().getMessage()).toEqual("Initial Message");
    expect(wrapper.instance().isInitial()).toBeTruthy();
    expect(wrapper).toMatchSnapshot();
  });

  it("isInitial()", () => {
    const wrapper = shallow(
      <UU5.Forms.Select id={"idSelect"} label="Issue category">
        <UU5.Forms.Select.Option id={"item01"} value="Info" />
        <UU5.Forms.Select.Option id={"item02"} value="Bug" />
        <UU5.Forms.Select.Option id={"item03"} value="Task" />
      </UU5.Forms.Select>
    );
    const mockFunc = jest.fn();
    expect(wrapper.instance().isInitial()).toBeTruthy();
    expect(wrapper).toMatchSnapshot();
    wrapper.instance().setFeedback("error", "Error messagess", "Info", mockFunc);
    wrapper.update();
    expect(wrapper.instance().isInitial()).toBeFalsy();
    expect(wrapper).toMatchSnapshot();
  });

  it("setLoading(message, value, setStateCallBack)", () => {
    const wrapper = shallow(
      <UU5.Forms.Select id={"idSelect"} label="Issue category">
        <UU5.Forms.Select.Option id={"item01"} value="Info" />
        <UU5.Forms.Select.Option id={"item02"} value="Bug" />
        <UU5.Forms.Select.Option id={"item03"} value="Task" />
      </UU5.Forms.Select>
    );
    const mockFunc = jest.fn();
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.instance().state.value).toEqual(expect.arrayContaining([]));
    expect(wrapper.instance().getMessage()).toBeNull();
    expect(wrapper.instance().isLoading()).toBeFalsy();
    const returnValue = wrapper.instance().setLoading("Loading messsagess", "Task", mockFunc);
    wrapper.update();
    expect(mockFunc).toBeCalled();
    expect(mockFunc).toHaveBeenCalledTimes(1);
    expect(returnValue).toBe(wrapper.instance());
    expect(wrapper.instance().isLoading()).toBeTruthy();
    expect(wrapper.instance().getMessage()).toEqual("Loading messsagess");
    expect(wrapper.instance().state.value).toEqual(expect.arrayContaining(["Task"]));
    expect(wrapper).toMatchSnapshot();
  });

  it("isLoading()", () => {
    const wrapper = shallow(
      <UU5.Forms.Select id={"idSelect"} label="Issue category">
        <UU5.Forms.Select.Option id={"item01"} value="Info" />
        <UU5.Forms.Select.Option id={"item02"} value="Bug" />
        <UU5.Forms.Select.Option id={"item03"} value="Task" />
      </UU5.Forms.Select>
    );
    expect(wrapper.instance().isLoading()).toBeFalsy();
    expect(wrapper).toMatchSnapshot();
  });

  it("setSuccess(message, value, setStateCallBack)", () => {
    const wrapper = shallow(
      <UU5.Forms.Select id={"idSelect"} label="Issue category">
        <UU5.Forms.Select.Option id={"item01"} value="Info" />
        <UU5.Forms.Select.Option id={"item02"} value="Bug" />
        <UU5.Forms.Select.Option id={"item03"} value="Task" />
      </UU5.Forms.Select>
    );
    const mockFunc = jest.fn();
    expect(wrapper.instance().getFeedback()).toEqual("initial");
    expect(wrapper.instance().getMessage()).toBe(null);
    expect(wrapper.instance().state.value).toEqual(expect.arrayContaining([]));
    expect(wrapper).toMatchSnapshot();
    const returnValue = wrapper.instance().setSuccess("This is success message", "Task", mockFunc);
    wrapper.update();
    expect(mockFunc).toBeCalled();
    expect(mockFunc).toHaveBeenCalledTimes(1);
    expect(returnValue).toBe(wrapper.instance());
    expect(wrapper.instance().getFeedback()).toEqual("success");
    expect(wrapper.instance().getMessage()).toEqual("This is success message");
    expect(wrapper.instance().state.value).toEqual(expect.arrayContaining(["Task"]));
    expect(wrapper.instance().isSuccess()).toBeTruthy();
    expect(wrapper).toMatchSnapshot();
  });

  it("isSuccess() fisr return false, second return true", () => {
    const wrapper = shallow(
      <UU5.Forms.Select id={"idSelect"} label="Issue category" required={true}>
        <UU5.Forms.Select.Option id={"item01"} value="Info" />
        <UU5.Forms.Select.Option id={"item02"} value="Bug" />
        <UU5.Forms.Select.Option id={"item03"} value="Task" />
      </UU5.Forms.Select>
    );
    const mockFunc = jest.fn();
    expect(wrapper.instance().isSuccess()).toBeFalsy();
    expect(wrapper).toMatchSnapshot();
    const returnValue = wrapper.instance().setSuccess("This is success message", "Task", mockFunc);
    wrapper.update();
    expect(mockFunc).toBeCalled();
    expect(mockFunc).toHaveBeenCalledTimes(1);
    expect(returnValue).toBe(wrapper.instance());
    expect(wrapper.instance().getFeedback()).toEqual("success");
    expect(wrapper.instance().getMessage()).toEqual("This is success message");
    expect(wrapper.instance().state.value).toEqual(expect.arrayContaining(["Task"]));
    expect(wrapper.instance().isSuccess()).toBeTruthy();
    expect(wrapper).toMatchSnapshot();
  });

  it("setWarning(message, value, setStateCallBack)", () => {
    const wrapper = shallow(
      <UU5.Forms.Select id={"idSelect"} label="Issue category" required={true}>
        <UU5.Forms.Select.Option id={"item01"} value="Info" />
        <UU5.Forms.Select.Option id={"item02"} value="Bug" />
        <UU5.Forms.Select.Option id={"item03"} value="Task" />
      </UU5.Forms.Select>
    );
    const mockFunc = jest.fn();
    expect(wrapper.instance().getFeedback()).toEqual("initial");
    expect(wrapper.instance().getMessage()).toBe(null);
    expect(wrapper.instance().state.value).toEqual(expect.arrayContaining([]));
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.instance().isSuccess()).toBeFalsy();
    expect(wrapper.instance().isWarning()).toBeFalsy();
    const returnValue = wrapper.instance().setWarning("This is warning message", "Task", mockFunc);
    wrapper.update();
    expect(mockFunc).toBeCalled();
    expect(mockFunc).toHaveBeenCalledTimes(1);
    expect(returnValue).toBe(wrapper.instance());
    expect(wrapper.instance().getFeedback()).toEqual("warning");
    expect(wrapper.instance().getMessage()).toEqual("This is warning message");
    expect(wrapper.instance().state.value).toEqual(expect.arrayContaining(["Task"]));
    expect(wrapper.instance().isWarning()).toBeTruthy();
    expect(wrapper.instance().isSuccess()).toBeFalsy();
    expect(wrapper).toMatchSnapshot();
  });

  it("isWarning()", () => {
    const wrapper = shallow(
      <UU5.Forms.Select
        id={"idSelect"}
        label="Issue category"
        required={true}
        feedback={"warning"}
        message={"Warning message"}
      >
        <UU5.Forms.Select.Option id={"item01"} value="Info" />
        <UU5.Forms.Select.Option id={"item02"} value="Bug" />
        <UU5.Forms.Select.Option id={"item03"} value="Task" />
      </UU5.Forms.Select>
    );
    const mockFunc = jest.fn();
    expect(wrapper.instance().getFeedback()).toEqual("warning");
    expect(wrapper.instance().getMessage()).toEqual("Warning message");
    expect(wrapper.instance().isWarning()).toBeTruthy();
    expect(wrapper).toMatchSnapshot();
    const setRetVal = wrapper.instance().setFeedback("success", "success message", "Task", mockFunc);
    wrapper.update();
    expect(mockFunc).toBeCalled();
    expect(setRetVal).toBe(wrapper.instance());
    expect(wrapper.instance().isWarning()).toBeFalsy();
    expect(wrapper).toMatchSnapshot();
  });

  it("setError(message, value, setStateCallBack)", () => {
    const wrapper = shallow(
      <UU5.Forms.Select id={"idSelect"} label="Issue category" required={true}>
        <UU5.Forms.Select.Option id={"item01"} value="Info" />
        <UU5.Forms.Select.Option id={"item02"} value="Bug" />
        <UU5.Forms.Select.Option id={"item03"} value="Task" />
      </UU5.Forms.Select>
    );
    const mockFunc = jest.fn();
    expect(wrapper.instance().isError()).toBeFalsy();
    expect(wrapper.instance().isWarning()).toBeFalsy();
    expect(wrapper.instance().isSuccess()).toBeFalsy();
    expect(wrapper.instance().isInitial()).toBeTruthy();
    expect(wrapper.instance().state.value).toEqual(expect.arrayContaining([]));
    expect(wrapper.instance().getFeedback()).toEqual("initial");
    expect(wrapper.instance().getMessage()).toBe(null);
    expect(wrapper).toMatchSnapshot();
    const returnValue = wrapper.instance().setError("This is error mesage", "Task", mockFunc);
    wrapper.update();
    expect(mockFunc).toBeCalled();
    expect(mockFunc).toHaveBeenCalledTimes(1);
    expect(returnValue).toBe(wrapper.instance());
    expect(wrapper.instance().isWarning()).toBeFalsy();
    expect(wrapper.instance().isSuccess()).toBeFalsy();
    expect(wrapper.instance().isInitial()).toBeFalsy;
    expect(wrapper.instance().isError()).toBeTruthy();
    expect(wrapper.instance().state.value).toEqual(expect.arrayContaining(["Task"]));
    expect(wrapper.instance().getFeedback()).toEqual("error");
    expect(wrapper.instance().getMessage()).toEqual("This is error mesage");
    expect(wrapper).toMatchSnapshot();
  });

  it("isError()", () => {
    const wrapper = shallow(
      <UU5.Forms.Select
        id={"idSelect"}
        label="Issue category"
        required={true}
        feedback={"error"}
        message={"Error message"}
      >
        <UU5.Forms.Select.Option id={"item01"} value="Info" />
        <UU5.Forms.Select.Option id={"item02"} value="Bug" />
        <UU5.Forms.Select.Option id={"item03"} value="Task" />
      </UU5.Forms.Select>
    );
    const mockFunc = jest.fn();
    expect(wrapper.instance().getFeedback()).toEqual("error");
    expect(wrapper.instance().getMessage()).toEqual("Error message");
    expect(wrapper.instance().isError()).toBeTruthy();
    expect(wrapper).toMatchSnapshot();
    const setRetVal = wrapper.instance().setFeedback("success", "success message", "Task", mockFunc);
    wrapper.update();
    expect(mockFunc).toBeCalled();
    expect(setRetVal).toBe(wrapper.instance());
    expect(wrapper.instance().isError()).toBeFalsy();
    expect(wrapper).toMatchSnapshot();
  });

  it("reset(setStateCallBack)", () => {
    const wrapper = shallow(
      <UU5.Forms.Select id={"idSelect"} label="Issue category" required={true}>
        <UU5.Forms.Select.Option id={"item01"} value="Info" />
        <UU5.Forms.Select.Option id={"item02"} value="Bug" />
        <UU5.Forms.Select.Option id={"item03"} value="Task" />
      </UU5.Forms.Select>
    );
    const mockFunc = jest.fn();
    wrapper.instance().setFeedback("success", "New Message", "Task", mockFunc);
    wrapper.update();
    wrapper.instance().readOnly(mockFunc);
    wrapper.update();
    expect(wrapper.instance().getFeedback()).toEqual("success");
    expect(wrapper.instance().getMessage()).toEqual("New Message");
    expect(wrapper.instance().state.value).toEqual(expect.arrayContaining(["Task"]));
    expect(wrapper.instance().isReadOnly()).toBeTruthy();
    expect(mockFunc).toBeCalled();
    expect(wrapper).toMatchSnapshot();
    //Now we reset seting value.
    const returnValue = wrapper.instance().reset(mockFunc);
    wrapper.update();
    expect(mockFunc).toBeCalled();
    expect(mockFunc).toHaveBeenCalledTimes(3);
    expect(returnValue).toBe(wrapper.instance());
    expect(wrapper.instance().state.value).toEqual(expect.arrayContaining([]));
    expect(wrapper.instance().getFeedback()).toEqual("initial");
    expect(wrapper.instance().getMessage()).toBe(null);
    expect(wrapper.instance().isReadOnly()).toBeFalsy();
    expect(wrapper).toMatchSnapshot();
  });

  it("getChangeFeedback()", () => {
    const wrapper = shallow(
      <UU5.Forms.Select id={"idSelect"} label="Issue category" required={true}>
        <UU5.Forms.Select.Option id={"item01"} value="Info" />
        <UU5.Forms.Select.Option id={"item02"} value="Bug" />
        <UU5.Forms.Select.Option id={"item03"} value="Task" />
      </UU5.Forms.Select>
    );

    expect(wrapper.instance().getChangeFeedback({})).toEqual(
      expect.objectContaining({
        feedback: "initial",
        message: null,
        value: []
      })
    );
    expect(wrapper).toMatchSnapshot();
  });

  it("setChangeFeedback()", () => {
    const wrapper = shallow(
      <UU5.Forms.Select id={"idSelect"} label="Issue category" required={true}>
        <UU5.Forms.Select.Option id={"item01"} value="Info" />
        <UU5.Forms.Select.Option id={"item02"} value="Bug" />
        <UU5.Forms.Select.Option id={"item03"} value="Task" />
      </UU5.Forms.Select>
    );
    const mockFunc = jest.fn();
    expect(wrapper.instance().getChangeFeedback({})).toEqual(
      expect.objectContaining({
        feedback: "initial",
        message: null,
        value: []
      })
    );
    const returnValue = wrapper.instance().setChangeFeedback(
      {
        feedback: "success",
        message: "Success message from setChangeFeedback",
        value: "Task"
      },
      mockFunc
    );
    wrapper.update();
    expect(mockFunc).toBeCalled();
    expect(returnValue).toBe(wrapper.instance());
    expect(wrapper.instance().state.value).toEqual("Task");
    expect(wrapper.instance().state.feedback).toEqual("success");
    expect(wrapper.instance().state.message).toEqual("Success message from setChangeFeedback");
    expect(wrapper).toMatchSnapshot();
  });

  it("isReadOnly()", () => {
    const wrapper = shallow(
      <UU5.Forms.Select id={"idSelect"} label="Issue category" required={true}>
        <UU5.Forms.Select.Option id={"item01"} value="Info" />
        <UU5.Forms.Select.Option id={"item02"} value="Bug" />
        <UU5.Forms.Select.Option id={"item03"} value="Task" />
      </UU5.Forms.Select>
    );
    const mockFunc = jest.fn();
    expect(wrapper.instance().isReadOnly()).toBeFalsy();
    expect(wrapper).toMatchSnapshot();
    const returnValue = wrapper.instance().readOnly(mockFunc);
    wrapper.update();
    expect(mockFunc).toBeCalled();
    expect(returnValue).toBe(wrapper.instance());
    expect(wrapper.instance().isReadOnly()).toBeTruthy();
    expect(wrapper).toMatchSnapshot();
  });

  it("setEditableValue(true, setStateCallback)", () => {
    const wrapper = shallow(
      <UU5.Forms.Select id={"idSelect"} label="Issue category" value={"Task"} required={true}>
        <UU5.Forms.Select.Option id={"item01"} value="Info" />
        <UU5.Forms.Select.Option id={"item02"} value="Bug" />
        <UU5.Forms.Select.Option id={"item03"} value="Task" />
      </UU5.Forms.Select>
    );
    const mockFunc = jest.fn();
    expect(wrapper).toMatchSnapshot();
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
    expect(wrapper).toMatchSnapshot();
    expect(mockFunc).toHaveBeenCalledTimes(4);
  });

  it("setEditableValue(false, setStateCallback)", () => {
    const wrapper = shallow(
      <UU5.Forms.Select id={"idSelect"} label="Issue category" value={"Task"} required={true}>
        <UU5.Forms.Select.Option id={"item01"} value="Info" />
        <UU5.Forms.Select.Option id={"item02"} value="Bug" />
        <UU5.Forms.Select.Option id={"item03"} value="Task" />
      </UU5.Forms.Select>
    );
    const mockFunc = jest.fn();
    expect(wrapper).toMatchSnapshot();
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
    expect(wrapper).toMatchSnapshot();
    expect(mockFunc).toHaveBeenCalledTimes(3);
  });

  it("readOnly(setStatecallback)", () => {
    const wrapper = shallow(
      <UU5.Forms.Select id={"idSelect"} label="Issue category" value={"Task"} required={true}>
        <UU5.Forms.Select.Option id={"item01"} value="Info" />
        <UU5.Forms.Select.Option id={"item02"} value="Bug" />
        <UU5.Forms.Select.Option id={"item03"} value="Task" />
      </UU5.Forms.Select>
    );
    expect(wrapper.instance().isReadOnly()).toBeFalsy();
    const mockFunc = jest.fn();
    expect(wrapper).toMatchSnapshot();
    const returnValue = wrapper.instance().readOnly(mockFunc);
    wrapper.update();
    expect(mockFunc).toBeCalled();
    expect(mockFunc).toHaveBeenCalledTimes(1);
    expect(returnValue).toBe(wrapper.instance());
    expect(wrapper.instance().isReadOnly()).toBeTruthy();
    expect(wrapper).toMatchSnapshot();
  });

  it("editable(setStatecallback)", () => {
    const wrapper = shallow(
      <UU5.Forms.Select id={"idSelect"} label="Issue category" value={"Task"} required={true}>
        <UU5.Forms.Select.Option id={"item01"} value="Info" />
        <UU5.Forms.Select.Option id={"item02"} value="Bug" />
        <UU5.Forms.Select.Option id={"item03"} value="Task" />
      </UU5.Forms.Select>
    );
    const mockFunc = jest.fn();
    expect(wrapper.instance().isReadOnly()).toBeFalsy();
    expect(wrapper.instance().state.readOnly).toBeFalsy();
    wrapper.instance().readOnly(mockFunc);
    wrapper.update();
    expect(wrapper.instance().isReadOnly()).toBeTruthy();
    expect(wrapper.instance().state.readOnly).toBeTruthy();
    expect(wrapper).toMatchSnapshot();
    const returnValue = wrapper.instance().editable(mockFunc);
    wrapper.update();
    expect(mockFunc).toBeCalled();
    expect(mockFunc).toHaveBeenCalledTimes(2);
    expect(returnValue).toBe(wrapper.instance());
    expect(wrapper.instance().isReadOnly()).toBeFalsy();
    expect(wrapper.instance().state.readOnly).toBeFalsy();
    expect(wrapper).toMatchSnapshot();
  });

  it("getLabel(idinput)", () => {
    const wrapper = shallow(
      <UU5.Forms.Select id={"idSelect"} label="Issue category" value={"Task"} required={true}>
        <UU5.Forms.Select.Option id={"item01"} value="Info" />
        <UU5.Forms.Select.Option id={"item02"} value="Bug" />
        <UU5.Forms.Select.Option id={"item03"} value="Task" />
      </UU5.Forms.Select>
    );
    expect(wrapper.instance().getLabel()).not.toBeNull();
    expect(wrapper.instance().getLabel()).not.toBeUndefined();
    expect(() => wrapper.instance().getLabel()).not.toThrow();
    expect(wrapper.instance().getLabel()).toEqual(expect.any(Object));
    expect(wrapper.instance().getLabel()).toBeInstanceOf(Object);
    expect(wrapper).toMatchSnapshot();
  });

  it("getInputWrapper(inpuid)", () => {
    const wrapper = shallow(
      <UU5.Forms.Select id={"idSelect"} label="Issue category" value={"Task"} required={true}>
        <UU5.Forms.Select.Option id={"item01"} value="Info" />
        <UU5.Forms.Select.Option id={"item02"} value="Bug" />
        <UU5.Forms.Select.Option id={"item03"} value="Task" />
      </UU5.Forms.Select>
    );
    expect(wrapper.instance().getInputWrapper()).not.toBeNull();
    expect(wrapper.instance().getInputWrapper()).not.toBeUndefined();
    expect(() => wrapper.instance().getInputWrapper()).not.toThrow();
    expect(wrapper.instance().getInputWrapper()).toEqual(expect.any(Object));
    expect(wrapper.instance().getInputWrapper()).toBeInstanceOf(Object);
    expect(wrapper).toMatchSnapshot();
  });
});
