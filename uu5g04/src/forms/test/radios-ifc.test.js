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

describe("UU5.Forms.InputMixin interface testing", () => {
  it("isInput()", () => {
    const wrapper = shallow(
      <UU5.Forms.Radios
        id={"uuID01"}
        label="What kind of pets do you like?"
        value={[
          { label: "Dogs", name: "dogs" },
          { label: "Cats", name: "cats" },
          { label: "Yaks", name: "yaks" },
          { label: "Rabbits", name: "rabbits", value: true },
          { label: "Hamsters", name: "hamsters" },
        ]}
      />
    );
    expect(wrapper.instance().isInput()).toBeTruthy();
    expect(wrapper).toMatchSnapshot();
  });

  it("getValue() should return value", () => {
    const wrapper = shallow(
      <UU5.Forms.Radios
        id={"uuID01"}
        label="What kind of pets do you like?"
        value={[
          { label: "Dogs", name: "dogs" },
          { label: "Cats", name: "cats" },
          { label: "Yaks", name: "yaks" },
          { label: "Rabbits", name: "rabbits", value: true },
          { label: "Hamsters", name: "hamsters" },
        ]}
      />
    );
    expect(wrapper.instance().getValue()).toEqual("rabbits");
    expect(wrapper).toMatchSnapshot();
  });

  it("getValue() should return null", () => {
    const wrapper = shallow(
      <UU5.Forms.Radios
        id={"uuID01"}
        label="What kind of pets do you like?"
        value={[
          { label: "Dogs", name: "dogs" },
          { label: "Cats", name: "cats" },
          { label: "Yaks", name: "yaks" },
          { label: "Rabbits", name: "rabbits", value: false },
          { label: "Hamsters", name: "hamsters" },
        ]}
      />
    );
    expect(wrapper.instance().getValue()).toBe(null);
    expect(wrapper).toMatchSnapshot();
  });

  it("setValue(value,setStateCallBack)", () => {
    const wrapper = shallow(
      <UU5.Forms.Radios
        id={"uuID01"}
        label="What kind of pets do you like?"
        value={[
          { label: "Dogs", name: "dogs" },
          { label: "Cats", name: "cats" },
          { label: "Yaks", name: "yaks" },
          { label: "Rabbits", name: "rabbits", value: true },
          { label: "Hamsters", name: "hamsters" },
        ]}
      />
    );
    expect(wrapper.instance().getValue()).toMatch(/rabbits/);
    const mockFunc = jest.fn();
    expect(wrapper).toMatchSnapshot();
    const returnValue = wrapper.instance().setValue("dogs", mockFunc);
    wrapper.update();
    expect(mockFunc).toBeCalled();
    expect(mockFunc).toHaveBeenCalledTimes(1);
    expect(returnValue === wrapper.instance()).toBe(true);
    expect(wrapper.instance().getValue()).toMatch(/dogs/);
    expect(wrapper).toMatchSnapshot();
  });

  it("getMessage() should return null, second: shoudl return new mesage", () => {
    const wrapper = shallow(
      <UU5.Forms.Radios
        id={"uuID01"}
        label="What kind of pets do you like?"
        value={[
          { label: "Dogs", name: "dogs" },
          { label: "Cats", name: "cats" },
          { label: "Yaks", name: "yaks" },
          { label: "Rabbits", name: "rabbits", value: true },
          { label: "Hamsters", name: "hamsters" },
        ]}
      />
    );
    expect(wrapper.instance().getMessage()).toBe(null);
    expect(wrapper).toMatchSnapshot();
    wrapper.setProps({ message: "New Setting message" });
    expect(wrapper.instance().getMessage()).toEqual("New Setting message");
  });

  it("setMessage(msg, setStateCallBack)", () => {
    const wrapper = shallow(
      <UU5.Forms.Radios
        id={"uuID01"}
        label="What kind of pets do you like?"
        value={[
          { label: "Dogs", name: "dogs" },
          { label: "Cats", name: "cats" },
          { label: "Yaks", name: "yaks" },
          { label: "Rabbits", name: "rabbits", value: true },
          { label: "Hamsters", name: "hamsters" },
        ]}
      />
    );
    const mockFunc = jest.fn();
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.instance().getMessage()).toBeNull();
    const returnValue = wrapper.instance().setMessage("New Message", mockFunc);
    wrapper.update();
    expect(mockFunc).toBeCalled();
    expect(mockFunc).toHaveBeenCalledTimes(1);
    expect(returnValue === wrapper.instance()).toBe(true);
    expect(wrapper.instance().getMessage()).toEqual("New Message");
    expect(wrapper).toMatchSnapshot();
  });

  it("getFeedBack()", () => {
    const wrapper = shallow(
      <UU5.Forms.Radios
        id={"uuID01"}
        label="What kind of pets do you like?"
        value={[
          { label: "Dogs", name: "dogs" },
          { label: "Cats", name: "cats" },
          { label: "Yaks", name: "yaks" },
          { label: "Rabbits", name: "rabbits", value: true },
          { label: "Hamsters", name: "hamsters" },
        ]}
      />
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
      <UU5.Forms.Radios
        id={"uuID01"}
        label="What kind of pets do you like?"
        value={[
          { label: "Dogs", name: "dogs" },
          { label: "Cats", name: "cats" },
          { label: "Yaks", name: "yaks" },
          { label: "Rabbits", name: "rabbits", value: true },
          { label: "Hamsters", name: "hamsters" },
        ]}
      />
    );
    expect(wrapper.instance().getFeedback()).toEqual("initial");
    expect(wrapper.instance().getMessage()).toBe(null);
    expect(wrapper.instance().getValue()).toEqual("rabbits");
    const mockFunc = jest.fn();
    expect(wrapper).toMatchSnapshot();
    const returnValue = wrapper.instance().setFeedback("success", "This is valid message.", "dogs", mockFunc);
    wrapper.update();
    expect(mockFunc).toBeCalled();
    expect(mockFunc).toHaveBeenCalledTimes(1);
    expect(returnValue === wrapper.instance()).toBe(true);
    expect(wrapper.instance().getFeedback()).toEqual("success");
    expect(wrapper.instance().getMessage()).toEqual("This is valid message.");
    expect(wrapper.instance().getValue()).toMatch(/dogs/);
    expect(wrapper).toMatchSnapshot();
  });

  it("setInitial(msg, value, setStateCallBack)", () => {
    const wrapper = shallow(
      <UU5.Forms.Radios
        id={"uuID01"}
        label="What kind of pets do you like?"
        value={[
          { label: "Dogs", name: "dogs" },
          { label: "Cats", name: "cats" },
          { label: "Yaks", name: "yaks" },
          { label: "Rabbits", name: "rabbits", value: false },
          { label: "Hamsters", name: "hamsters" },
        ]}
        message={"This input is required"}
        feedback={"error"}
        required={true}
      />
    );
    const mockFunc = jest.fn();
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.instance().getFeedback()).toEqual("error");
    expect(wrapper.instance().getValue()).toBe(null);
    expect(wrapper.instance().getMessage()).toEqual("This input is required");
    expect(wrapper.instance().isInitial()).toBeFalsy();
    const returnValue = wrapper.instance().setInitial("Initial Message", "rabbits", mockFunc);
    wrapper.update();
    expect(mockFunc).toBeCalled();
    expect(mockFunc).toHaveBeenCalledTimes(1);
    expect(returnValue === wrapper.instance()).toBe(true);
    expect(wrapper.instance().getFeedback()).toEqual("initial");
    expect(wrapper.instance().getValue()).toMatch(/rabbits/);
    expect(wrapper.instance().getMessage()).toEqual("Initial Message");
    expect(wrapper.instance().isInitial()).toBeTruthy();
    expect(wrapper).toMatchSnapshot();
  });

  it("isInitial()", () => {
    const wrapper = shallow(
      <UU5.Forms.Radios
        id={"uuID01"}
        label="What kind of pets do you like?"
        value={[
          { label: "Dogs", name: "dogs" },
          { label: "Cats", name: "cats" },
          { label: "Yaks", name: "yaks" },
          { label: "Rabbits", name: "rabbits", value: false },
          { label: "Hamsters", name: "hamsters" },
        ]}
      />
    );
    const mockFunc = jest.fn();
    expect(wrapper.instance().isInitial()).toBeTruthy();
    expect(wrapper).toMatchSnapshot();
    wrapper.instance().setFeedback("error", "Error messagess", mockFunc);
    wrapper.update();
    expect(wrapper.instance().isInitial()).toBeFalsy();
    expect(wrapper).toMatchSnapshot();
  });

  it("setLoading(message, value, setStateCallBack)", () => {
    const wrapper = shallow(
      <UU5.Forms.Radios
        id={"uuID01"}
        label="What kind of pets do you like?"
        value={[
          { label: "Dogs", name: "dogs" },
          { label: "Cats", name: "cats" },
          { label: "Yaks", name: "yaks" },
          { label: "Rabbits", name: "rabbits", value: true },
          { label: "Hamsters", name: "hamsters" },
        ]}
      />
    );
    const mockFunc = jest.fn();
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.instance().getValue()).toEqual("rabbits");
    expect(wrapper.instance().getMessage()).toBeNull();
    expect(wrapper.instance().isLoading()).toBeFalsy();
    const returnValue = wrapper.instance().setLoading("Loading messsagess", "dogs", mockFunc);
    wrapper.update();
    expect(mockFunc).toBeCalled();
    expect(mockFunc).toHaveBeenCalledTimes(1);
    expect(returnValue === wrapper.instance()).toBe(true);
    expect(wrapper.instance().isLoading()).toBeTruthy();
    expect(wrapper.instance().getMessage()).toEqual("Loading messsagess");
    expect(wrapper.instance().getValue()).toMatch(/dogs/);
    expect(wrapper).toMatchSnapshot();
  });

  it("isLoading()", () => {
    const wrapper = shallow(
      <UU5.Forms.Radios
        id={"uuID01"}
        label="What kind of pets do you like?"
        value={[
          { label: "Dogs", name: "dogs" },
          { label: "Cats", name: "cats" },
          { label: "Yaks", name: "yaks" },
          { label: "Rabbits", name: "rabbits", value: true },
          { label: "Hamsters", name: "hamsters" },
        ]}
      />
    );
    expect(wrapper.instance().isLoading()).toBeFalsy();
    expect(wrapper).toMatchSnapshot();
  });

  it("setSuccess(message, value, setStateCallBack)", () => {
    const wrapper = shallow(
      <UU5.Forms.Radios
        id={"uuID01"}
        label="What kind of pets do you like?"
        value={[
          { label: "Dogs", name: "dogs" },
          { label: "Cats", name: "cats" },
          { label: "Yaks", name: "yaks" },
          { label: "Rabbits", name: "rabbits", value: false },
          { label: "Hamsters", name: "hamsters" },
        ]}
      />
    );
    const mockFunc = jest.fn();
    expect(wrapper.instance().getFeedback()).toEqual("initial");
    expect(wrapper.instance().getMessage()).toBe(null);
    expect(wrapper.instance().getValue()).toBe(null);
    expect(wrapper).toMatchSnapshot();
    const returnValue = wrapper.instance().setSuccess("This is success message", "rabbits", mockFunc);
    wrapper.update();
    expect(mockFunc).toBeCalled();
    expect(mockFunc).toHaveBeenCalledTimes(1);
    expect(returnValue === wrapper.instance()).toBe(true);
    expect(wrapper.instance().getFeedback()).toEqual("success");
    expect(wrapper.instance().getMessage()).toEqual("This is success message");
    expect(wrapper.instance().getValue()).toEqual("rabbits");
    expect(wrapper.instance().isSuccess()).toBeTruthy();
    expect(wrapper).toMatchSnapshot();
  });

  it("isSuccess() fisr return false, second return true", () => {
    const wrapper = shallow(
      <UU5.Forms.Radios
        id={"uuID01"}
        label="What kind of pets do you like?"
        required={true}
        value={[
          { label: "Dogs", name: "dogs" },
          { label: "Cats", name: "cats" },
          { label: "Yaks", name: "yaks" },
          { label: "Rabbits", name: "rabbits", value: false },
          { label: "Hamsters", name: "hamsters" },
        ]}
      />
    );
    const mockFunc = jest.fn();
    expect(wrapper.instance().isSuccess()).toBeFalsy();
    const returnValue = wrapper.instance().setSuccess("This is success message", "rabbits", mockFunc);
    wrapper.update();
    expect(mockFunc).toBeCalled();
    expect(mockFunc).toHaveBeenCalledTimes(1);
    expect(returnValue === wrapper.instance()).toBe(true);
    expect(wrapper.instance().getFeedback()).toEqual("success");
    expect(wrapper.instance().getMessage()).toEqual("This is success message");
    expect(wrapper.instance().getValue()).toEqual("rabbits");
    expect(wrapper.instance().isSuccess()).toBeTruthy();
    expect(wrapper).toMatchSnapshot();
  });

  it("setWarning(message, value, setStateCallBack)", () => {
    const wrapper = shallow(
      <UU5.Forms.Radios
        id={"uuID01"}
        label="What kind of pets do you like?"
        required={false}
        value={[
          { label: "Dogs", name: "dogs" },
          { label: "Cats", name: "cats" },
          { label: "Yaks", name: "yaks" },
          { label: "Rabbits", name: "rabbits", value: false },
          { label: "Hamsters", name: "hamsters" },
        ]}
      />
    );
    const mockFunc = jest.fn();
    expect(wrapper.instance().getFeedback()).toEqual("initial");
    expect(wrapper.instance().getMessage()).toBe(null);
    expect(wrapper.instance().getValue()).toBe(null);
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.instance().isSuccess()).toBeFalsy();
    expect(wrapper.instance().isWarning()).toBeFalsy();
    const returnValue = wrapper.instance().setWarning("This is warning message", "cats", mockFunc);
    wrapper.update();
    expect(mockFunc).toBeCalled();
    expect(mockFunc).toHaveBeenCalledTimes(1);
    expect(returnValue === wrapper.instance()).toBe(true);
    expect(wrapper.instance().getFeedback()).toEqual("warning");
    expect(wrapper.instance().getMessage()).toEqual("This is warning message");
    expect(wrapper.instance().getValue()).toMatch(/cats/);
    expect(wrapper.instance().isWarning()).toBeTruthy();
    expect(wrapper.instance().isSuccess()).toBeFalsy();
    expect(wrapper).toMatchSnapshot();
  });

  it("isWarning()", () => {
    const wrapper = shallow(
      <UU5.Forms.Radios
        id={"uuID01"}
        label="What kind of pets do you like?"
        required={true}
        feedback={"warning"}
        message={"Warning message"}
        value={[
          { label: "Dogs", name: "dogs" },
          { label: "Cats", name: "cats" },
          { label: "Yaks", name: "yaks" },
          { label: "Rabbits", name: "rabbits", value: false },
          { label: "Hamsters", name: "hamsters" },
        ]}
      />
    );
    const mockFunc = jest.fn();
    expect(wrapper.instance().getFeedback()).toEqual("warning");
    expect(wrapper.instance().getMessage()).toEqual("Warning message");
    expect(wrapper.instance().isWarning()).toBeTruthy();
    expect(wrapper).toMatchSnapshot();
    const setRetVal = wrapper.instance().setFeedback("success", "success message", "dogs", mockFunc);
    wrapper.update();
    expect(mockFunc).toBeCalled();
    expect(setRetVal === wrapper.instance()).toBe(true);
    expect(wrapper.instance().isWarning()).toBeFalsy();
    expect(wrapper).toMatchSnapshot();
  });

  it("setError(message, value, setStateCallBack)", () => {
    const wrapper = shallow(
      <UU5.Forms.Radios
        id={"uuID01"}
        label="What kind of pets do you like?"
        required={true}
        value={[
          { label: "Dogs", name: "dogs" },
          { label: "Cats", name: "cats" },
          { label: "Yaks", name: "yaks" },
          { label: "Rabbits", name: "rabbits", value: false },
          { label: "Hamsters", name: "hamsters" },
        ]}
      />
    );
    const mockFunc = jest.fn();
    expect(wrapper.instance().isError()).toBeFalsy();
    expect(wrapper.instance().isWarning()).toBeFalsy();
    expect(wrapper.instance().isSuccess()).toBeFalsy();
    expect(wrapper.instance().isInitial()).toBeTruthy();
    expect(wrapper.instance().getValue()).toBe(null);
    expect(wrapper.instance().getFeedback()).toEqual("initial");
    expect(wrapper.instance().getMessage()).toBe(null);
    expect(wrapper).toMatchSnapshot();
    const returnValue = wrapper.instance().setError("This is error mesage", "cats", mockFunc);
    wrapper.update();
    expect(mockFunc).toBeCalled();
    expect(mockFunc).toHaveBeenCalledTimes(1);
    expect(returnValue === wrapper.instance()).toBe(true);
    expect(wrapper.instance().isWarning()).toBeFalsy();
    expect(wrapper.instance().isSuccess()).toBeFalsy();
    expect(wrapper.instance().isInitial()).toBeFalsy;
    expect(wrapper.instance().isError()).toBeTruthy();
    expect(wrapper.instance().getValue()).toEqual("cats");
    expect(wrapper.instance().getFeedback()).toEqual("error");
    expect(wrapper.instance().getMessage()).toEqual("This is error mesage");
    expect(wrapper).toMatchSnapshot();
  });

  it("isError()", () => {
    const wrapper = shallow(
      <UU5.Forms.Radios
        id={"uuID01"}
        label="What kind of pets do you like?"
        required={true}
        feedback={"error"}
        message={"Error message"}
        value={[
          { label: "Dogs", name: "dogs" },
          { label: "Cats", name: "cats" },
          { label: "Yaks", name: "yaks" },
          { label: "Rabbits", name: "rabbits", value: false },
          { label: "Hamsters", name: "hamsters" },
        ]}
      />
    );
    const mockFunc = jest.fn();
    expect(wrapper.instance().getFeedback()).toEqual("error");
    expect(wrapper.instance().getMessage()).toEqual("Error message");
    expect(wrapper.instance().isError()).toBeTruthy();
    expect(wrapper).toMatchSnapshot();
    const setRetVal = wrapper.instance().setFeedback("success", "success message", "cats", mockFunc);
    wrapper.update();
    expect(mockFunc).toBeCalled();
    expect(setRetVal === wrapper.instance()).toBe(true);
    expect(wrapper.instance().isError()).toBeFalsy();
    expect(wrapper).toMatchSnapshot();
  });

  it("reset(setStateCallBack)", () => {
    const wrapper = shallow(
      <UU5.Forms.Radios
        id={"uuID01"}
        label="What kind of pets do you like?"
        required={true}
        value={[
          { label: "Dogs", name: "dogs" },
          { label: "Cats", name: "cats" },
          { label: "Yaks", name: "yaks" },
          { label: "Rabbits", name: "rabbits", value: false },
          { label: "Hamsters", name: "hamsters" },
        ]}
      />
    );
    const mockFunc = jest.fn();
    wrapper.instance().setFeedback("success", "New Message", "cats", mockFunc);
    wrapper.update();
    wrapper.instance().readOnly(mockFunc);
    wrapper.update();
    expect(wrapper.instance().getFeedback()).toEqual("success");
    expect(wrapper.instance().getMessage()).toEqual("New Message");
    expect(wrapper.instance().getValue()).toEqual("cats");
    expect(wrapper.instance().isReadOnly()).toBeTruthy();
    expect(mockFunc).toBeCalled();
    expect(wrapper).toMatchSnapshot();
    //Now we reset seting value.
    const returnValue = wrapper.instance().reset(mockFunc);
    wrapper.update();
    expect(mockFunc).toBeCalled();
    expect(mockFunc).toHaveBeenCalledTimes(3);
    expect(returnValue === wrapper.instance()).toBe(true);
    expect(wrapper.instance().getValue()).toBe(null);
    expect(wrapper.instance().getFeedback()).toEqual("initial");
    expect(wrapper.instance().getMessage()).toBe(null);
    expect(wrapper.instance().isReadOnly()).toBeFalsy();
    expect(wrapper).toMatchSnapshot();
  });

  it("getChangeFeedback()", () => {
    const wrapper = shallow(
      <UU5.Forms.Radios
        id={"uuID01"}
        label="What kind of pets do you like?"
        required={true}
        value={[
          { label: "Dogs", name: "dogs" },
          { label: "Cats", name: "cats" },
          { label: "Yaks", name: "yaks" },
          { label: "Rabbits", name: "rabbits", value: true },
          { label: "Hamsters", name: "hamsters" },
        ]}
      />
    );
    expect(wrapper.instance().getChangeFeedback({})).toEqual(
      expect.objectContaining({
        feedback: "initial",
        message: null,
        value: "rabbits",
      })
    );
    expect(wrapper).toMatchSnapshot();
  });

  it("setChangeFeedback()", () => {
    const wrapper = shallow(
      <UU5.Forms.Radios
        id={"uuID01"}
        label="What kind of pets do you like?"
        required={true}
        value={[
          { label: "Dogs", name: "dogs" },
          { label: "Cats", name: "cats" },
          { label: "Yaks", name: "yaks" },
          { label: "Rabbits", name: "rabbits", value: true },
          { label: "Hamsters", name: "hamsters" },
        ]}
      />
    );
    const mockFunc = jest.fn();
    expect(wrapper.instance().getChangeFeedback({})).toEqual(
      expect.objectContaining({
        feedback: "initial",
        message: null,
        value: "rabbits",
      })
    );
    const returnValue = wrapper.instance().setChangeFeedback(
      {
        feedback: "success",
        message: "Success message from setChangeFeedback",
        value: "cats",
      },
      mockFunc
    );
    wrapper.update();
    expect(mockFunc).toBeCalled();
    expect(returnValue === wrapper.instance()).toBe(true);
    expect(wrapper.instance().state.value).toEqual("cats");
    expect(wrapper.instance().state.feedback).toEqual("success");
    expect(wrapper.instance().state.message).toEqual("Success message from setChangeFeedback");
    expect(wrapper).toMatchSnapshot();
  });

  it("isReadOnly()", () => {
    const wrapper = shallow(
      <UU5.Forms.Radios
        id={"uuID01"}
        label="What kind of pets do you like?"
        required={true}
        value={[
          { label: "Dogs", name: "dogs" },
          { label: "Cats", name: "cats" },
          { label: "Yaks", name: "yaks" },
          { label: "Rabbits", name: "rabbits", value: true },
          { label: "Hamsters", name: "hamsters" },
        ]}
      />
    );
    const mockFunc = jest.fn();
    expect(wrapper.instance().isReadOnly()).toBeFalsy();
    expect(wrapper).toMatchSnapshot();
    const returnValue = wrapper.instance().readOnly(mockFunc);
    wrapper.update();
    expect(mockFunc).toBeCalled();
    expect(returnValue === wrapper.instance()).toBe(true);
    expect(wrapper.instance().isReadOnly()).toBeTruthy();
    expect(wrapper).toMatchSnapshot();
  });

  it("setEditableValue(true, setStateCallback)", () => {
    const wrapper = shallow(
      <UU5.Forms.Radios
        id={"uuID01"}
        label="What kind of pets do you like?"
        required={true}
        value={[
          { label: "Dogs", name: "dogs" },
          { label: "Cats", name: "cats" },
          { label: "Yaks", name: "yaks" },
          { label: "Rabbits", name: "rabbits", value: true },
          { label: "Hamsters", name: "hamsters" },
        ]}
      />
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
    expect(returnValue === wrapper.instance()).toBe(true);
    expect(wrapper.instance().isReadOnly()).toBeFalsy();
    expect(wrapper.instance().editable(mockFunc)).toBeTruthy();
    expect(wrapper).toMatchSnapshot();
    expect(mockFunc).toHaveBeenCalledTimes(4);
  });

  it("setEditableValue(false, setStateCallback)", () => {
    const wrapper = shallow(
      <UU5.Forms.Radios
        id={"uuID01"}
        label="What kind of pets do you like?"
        required={true}
        value={[
          { label: "Dogs", name: "dogs" },
          { label: "Cats", name: "cats" },
          { label: "Yaks", name: "yaks" },
          { label: "Rabbits", name: "rabbits", value: true },
          { label: "Hamsters", name: "hamsters" },
        ]}
      />
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
    expect(returnValue === wrapper.instance()).toBe(true);
    expect(wrapper.instance().isReadOnly()).toBeTruthy();
    expect(wrapper).toMatchSnapshot();
    expect(mockFunc).toHaveBeenCalledTimes(3);
  });

  it("readOnly(setStatecallback)", () => {
    const wrapper = shallow(
      <UU5.Forms.Radios
        id={"uuID01"}
        label="What kind of pets do you like?"
        required={true}
        value={[
          { label: "Dogs", name: "dogs" },
          { label: "Cats", name: "cats" },
          { label: "Yaks", name: "yaks" },
          { label: "Rabbits", name: "rabbits", value: true },
          { label: "Hamsters", name: "hamsters" },
        ]}
      />
    );
    expect(wrapper.instance().isReadOnly()).toBeFalsy();
    const mockFunc = jest.fn();
    expect(wrapper).toMatchSnapshot();
    const returnValue = wrapper.instance().readOnly(mockFunc);
    wrapper.update();
    expect(mockFunc).toBeCalled();
    expect(mockFunc).toHaveBeenCalledTimes(1);
    expect(returnValue === wrapper.instance()).toBe(true);
    expect(wrapper.instance().isReadOnly()).toBeTruthy();
    expect(wrapper).toMatchSnapshot();
  });

  it("editable(setStatecallback)", () => {
    const wrapper = shallow(
      <UU5.Forms.Radios
        id={"uuID01"}
        label="What kind of pets do you like?"
        required={true}
        value={[
          { label: "Dogs", name: "dogs" },
          { label: "Cats", name: "cats" },
          { label: "Yaks", name: "yaks" },
          { label: "Rabbits", name: "rabbits", value: true },
          { label: "Hamsters", name: "hamsters" },
        ]}
      />
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
    expect(returnValue === wrapper.instance()).toBe(true);
    expect(wrapper.instance().isReadOnly()).toBeFalsy();
    expect(wrapper.instance().state.readOnly).toBeFalsy();
    expect(wrapper).toMatchSnapshot();
  });

  it("getLabel(idinput)", () => {
    const wrapper = shallow(
      <UU5.Forms.Radios
        id={"uuID01"}
        label="What kind of pets do you like?"
        required={true}
        value={[
          { label: "Dogs", name: "dogs" },
          { label: "Cats", name: "cats" },
          { label: "Yaks", name: "yaks" },
          { label: "Rabbits", name: "rabbits", value: true },
          { label: "Hamsters", name: "hamsters" },
        ]}
      />
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
      <UU5.Forms.Radios
        id={"uuID01"}
        label="What kind of pets do you like?"
        required={true}
        value={[
          { label: "Dogs", name: "dogs" },
          { label: "Cats", name: "cats" },
          { label: "Yaks", name: "yaks" },
          { label: "Rabbits", name: "rabbits", value: true },
          { label: "Hamsters", name: "hamsters" },
        ]}
      />
    );
    expect(wrapper.instance().getInputWrapper()).not.toBeNull();
    expect(wrapper.instance().getInputWrapper()).not.toBeUndefined();
    expect(() => wrapper.instance().getInputWrapper()).not.toThrow();
    expect(wrapper.instance().getInputWrapper()).toEqual(expect.any(Object));
    expect(wrapper.instance().getInputWrapper()).toBeInstanceOf(Object);
    expect(wrapper).toMatchSnapshot();
  });
});
