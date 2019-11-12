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
import UU5 from "uu5g04";
import "uu5g04-bricks";
import "uu5g04-forms";

const { mount, shallow, wait } = UU5.Test.Tools;

let origDateNow = Date.now;
let origGetLanguage = UU5.Common.Tools.getLanguage;
beforeEach(() => {
  Date.now = () => new Date(1548411167098); // 25.01.2019 11:12:47.098 GMT+0100
  UU5.Common.Tools.getLanguage = () => "en";
});
afterEach(() => {
  Date.now = origDateNow;
  UU5.Common.Tools.getLanguage = origGetLanguage;
});

describe("UU5.Forms.DateTimePicker interface testing", () => {
  it("openCalendar(setStateCallBack)", () => {
    const wrapper = shallow(
      <UU5.Forms.DateTimePicker label="Date of appointment" disableBackdrop id={"uuID01"} value="1.1.2019" />
    );
    const mockFunc = jest.fn();
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.instance().state.calendarOpen).toBeFalsy();
    expect(wrapper.instance().state.timeOpen).toBeFalsy();
    const returnValue = wrapper.instance().openCalendar(mockFunc);
    wrapper.update();
    expect(mockFunc).toBeCalled();
    expect(returnValue).toBe(wrapper.instance());
    expect(wrapper.instance().state.calendarOpen).toBeTruthy();
    expect(wrapper.instance().state.timeOpen).toBeFalsy();
    expect(wrapper).toMatchSnapshot();
  });

  it("openTime(setStateCallBack)", () => {
    const wrapper = shallow(
      <UU5.Forms.DateTimePicker label="Date of appointment" disableBackdrop id={"uuID01"} value="1.1.2019" />
    );
    const mockFunc = jest.fn();
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.instance().state.calendarOpen).toBeFalsy();
    expect(wrapper.instance().state.timeOpen).toBeFalsy();
    const returnValue = wrapper.instance().openTime(mockFunc);
    wrapper.update();
    expect(mockFunc).toBeCalled();
    expect(returnValue).toBe(wrapper.instance());
    expect(wrapper.instance().state.calendarOpen).toBeFalsy();
    expect(wrapper.instance().state.timeOpen).toBeTruthy();
    expect(wrapper).toMatchSnapshot();
  });

  it("toggleCalendar(setStateCallBack)", () => {
    const wrapper = mount(
      <UU5.Forms.DateTimePicker label="Date of appointment" disableBackdrop id={"uuID01"} value="1.1.2019" />
    );
    const mockFunc = jest.fn();
    expect(wrapper.instance().state.calendarOpen).toBeFalsy();
    expect(wrapper.instance().state.timeOpen).toBeFalsy();
    const returnValue = wrapper.instance().toggleCalendar(mockFunc);
    wrapper.update();
    expect(mockFunc).toBeCalled();
    expect(returnValue).toBe(wrapper.instance());
    expect(wrapper.instance().state.calendarOpen).toBeTruthy();
    expect(wrapper.instance().state.timeOpen).toBeFalsy();
    wrapper.instance().toggleCalendar(mockFunc);
    wrapper.update();
    expect(mockFunc).toHaveBeenCalledTimes(2);
    expect(wrapper.instance().state.calendarOpen).toBeFalsy();
    expect(wrapper.instance().state.timeOpen).toBeFalsy();
  });

  it("toggleTime(setStateCallBack)", () => {
    const wrapper = mount(
      <UU5.Forms.DateTimePicker label="Date of appointment" disableBackdrop id={"uuID01"} value="1.1.2019" />
    );
    const mockFunc = jest.fn();
    expect(wrapper.instance().state.calendarOpen).toBeFalsy();
    expect(wrapper.instance().state.timeOpen).toBeFalsy();
    const returnValue = wrapper.instance().toggleTime(mockFunc);
    wrapper.update();
    expect(mockFunc).toBeCalled();
    expect(returnValue).toBe(wrapper.instance());
    expect(wrapper.instance().state.calendarOpen).toBeFalsy();
    expect(wrapper.instance().state.timeOpen).toBeTruthy();
    wrapper.instance().toggleTime(mockFunc);
    wrapper.update();
    expect(mockFunc).toHaveBeenCalledTimes(2);
    expect(wrapper.instance().state.calendarOpen).toBeFalsy();
    expect(wrapper.instance().state.timeOpen).toBeFalsy();
  });

  it("close(setStateCallBack) should close calendar", () => {
    const wrapper = shallow(
      <UU5.Forms.DateTimePicker label="Date of appointment" disableBackdrop id={"uuID01"} value="1.1.2019" />
    );
    const mockFunc = jest.fn();
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.instance().state.calendarOpen).toBeFalsy();
    expect(wrapper.instance().state.timeOpen).toBeFalsy();
    const returnValue = wrapper.instance().openCalendar(mockFunc);
    wrapper.update();
    expect(mockFunc).toBeCalled();
    expect(returnValue).toBe(wrapper.instance());
    expect(wrapper.instance().state.calendarOpen).toBeTruthy();
    expect(wrapper.instance().state.timeOpen).toBeFalsy();
    expect(wrapper).toMatchSnapshot();
    const closeReturnValue = wrapper.instance().close(mockFunc);
    wrapper.update();
    expect(mockFunc).toHaveBeenCalledTimes(2);
    expect(closeReturnValue).toBe(wrapper.instance());
    expect(wrapper.instance().state.calendarOpen).toBeFalsy();
    expect(wrapper.instance().state.timeOpen).toBeFalsy();
    expect(wrapper).toMatchSnapshot();
  });

  it("close(setStateCallBack) should close time", () => {
    const wrapper = shallow(
      <UU5.Forms.DateTimePicker label="Date of appointment" disableBackdrop id={"uuID01"} value="1.1.2019" />
    );
    const mockFunc = jest.fn();
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.instance().state.calendarOpen).toBeFalsy();
    expect(wrapper.instance().state.timeOpen).toBeFalsy();
    const returnValue = wrapper.instance().openTime(mockFunc);
    wrapper.update();
    expect(mockFunc).toBeCalled();
    expect(returnValue).toBe(wrapper.instance());
    expect(wrapper.instance().state.calendarOpen).toBeFalsy();
    expect(wrapper.instance().state.timeOpen).toBeTruthy();
    expect(wrapper).toMatchSnapshot();
    const closeReturnValue = wrapper.instance().close(mockFunc);
    wrapper.update();
    expect(mockFunc).toHaveBeenCalledTimes(2);
    expect(closeReturnValue).toBe(wrapper.instance());
    expect(wrapper.instance().state.calendarOpen).toBeFalsy();
    expect(wrapper.instance().state.timeOpen).toBeFalsy();
    expect(wrapper).toMatchSnapshot();
  });
});

describe("UU5.Forms.InputMixin interface testing", () => {
  it("isInput()", () => {
    const wrapper = shallow(
      <UU5.Forms.DateTimePicker id={"idText"} label="Valid time" placeholder="Enter time" required={false} size="s" />
    );
    expect(wrapper.instance().isInput()).toBeTruthy();
    expect(wrapper).toMatchSnapshot();
  });

  it("getValue() should return value", () => {
    let value;
    const wrapper = shallow(
      <UU5.Forms.DateTimePicker
        id={"idText"}
        label="Valid time"
        placeholder="Enter time"
        value="2013-08-02 10:00:00"
        required={false}
        seconds={true}
        size="s"
      />
    );
    expect(() => wrapper.instance().getValue()).not.toThrow();
    value = wrapper.instance().getValue();
    expect(value).toBe("8/2/2013 10:00:00");
    expect(wrapper).toMatchSnapshot();

    wrapper.setProps({ valueType: "date" });
    value = wrapper.instance().getValue();
    expect(value).toBeInstanceOf(Date);
    expect(Math.floor(value.getTime() / 1000)).toBe(new Date(2013, 7, 2, 10, 0, 0, 0).getTime() / 1000);
    expect(wrapper).toMatchSnapshot();

    wrapper.setProps({ valueType: "string" });
    value = wrapper.instance().getValue();
    expect(typeof value).toBe("string");
    expect(value).toBe("8/2/2013 10:00:00");
    expect(wrapper).toMatchSnapshot();
  });

  it("setValue(value,setStateCallBack)", () => {
    const wrapper = shallow(
      <UU5.Forms.DateTimePicker id={"idText"} label="Valid time" placeholder="Enter time" required={false} size="s" />
    );
    expect(wrapper.instance().state.value).toBe(null);
    expect(wrapper.instance().state.dateString).toBe(null);
    expect(wrapper.instance().state.timeString).toBe(null);
    const mockFunc = jest.fn();
    expect(wrapper).toMatchSnapshot();
    const returnValue = wrapper.instance().setValue("9.11.2013 10:00", mockFunc);
    wrapper.update();
    expect(wrapper.instance().getValue()).toMatch(/9.11.2013 10:00/);
    expect(wrapper.instance().state.dateString).toEqual("9/11/2013");
    expect(wrapper.instance().state.timeString).toMatch(/10:00/);
    expect(mockFunc).toBeCalled();
    expect(mockFunc).toHaveBeenCalledTimes(1);
    expect(returnValue).toBe(wrapper.instance());
    expect(wrapper).toMatchSnapshot();
  });

  it("getMessage()", () => {
    const wrapper = shallow(
      <UU5.Forms.DateTimePicker
        id={"idText"}
        label="Enter valid time"
        placeholder="Valid time"
        required={false}
        size="s"
      />
    );
    expect(wrapper.instance().getMessage()).toBe(null);
    expect(wrapper).toMatchSnapshot();
    wrapper.setProps({ message: "New Setting message" });
    expect(wrapper.instance().getMessage()).toEqual("New Setting message");
  });

  it("setMessage(msg, setStateCallBack)", () => {
    const wrapper = shallow(
      <UU5.Forms.DateTimePicker
        id={"idText"}
        label="Enter valid time"
        placeholder="Valid time"
        required={false}
        size="s"
      />
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
      <UU5.Forms.DateTimePicker
        id={"idText"}
        label="Enter valid time"
        placeholder="Valid time"
        required={false}
        size="s"
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
      <UU5.Forms.DateTimePicker
        id={"idText"}
        label="Enter valid time"
        placeholder="Valid time"
        required={false}
        size="s"
      />
    );
    expect(wrapper.instance().getFeedback()).toEqual("initial");
    expect(wrapper.instance().getMessage()).toBe(null);
    expect(wrapper.instance().state.value).toBe(null);
    expect(wrapper.instance().state.dateString).toBe(null);
    expect(wrapper.instance().state.timeString).toBe(null);
    const mockFunc = jest.fn();
    expect(wrapper).toMatchSnapshot();
    const returnValue = wrapper
      .instance()
      .setFeedback("success", "This is valid message.", "9.11.2013 12:00", mockFunc);
    wrapper.update();
    expect(mockFunc).toBeCalled();
    expect(mockFunc).toHaveBeenCalledTimes(1);
    expect(returnValue).toBe(wrapper.instance());
    expect(wrapper.instance().getFeedback()).toEqual("success");
    expect(wrapper.instance().getMessage()).toEqual("This is valid message.");
    expect(wrapper.instance().getValue()).not.toBeNull();
    expect(wrapper.instance().getValue()).not.toBeUndefined();
    expect(wrapper.instance().state.dateString).toEqual("9/11/2013");
    expect(wrapper.instance().state.timeString).toBe("12:00");
    expect(wrapper).toMatchSnapshot();
  });

  it("setInitial(msg, value, setStateCallBack)", () => {
    const wrapper = shallow(
      <UU5.Forms.DateTimePicker
        id={"idText"}
        label="Enter valid time"
        placeholder="Valid time"
        message={"This input is required"}
        feedback={"error"}
        required={true}
        size="s"
      />
    );
    const mockFunc = jest.fn();
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.instance().getFeedback()).toEqual("error");
    expect(wrapper.instance().state.value).toBe(null);
    expect(wrapper.instance().state.dateString).toBe(null);
    expect(wrapper.instance().state.timeString).toBe(null);
    expect(wrapper.instance().getMessage()).toEqual("This input is required");
    expect(wrapper.instance().isInitial()).toBeFalsy();
    const returnValue = wrapper.instance().setInitial("Initial Message", null, mockFunc);
    wrapper.update();
    expect(mockFunc).toBeCalled();
    expect(mockFunc).toHaveBeenCalledTimes(1);
    expect(returnValue).toBe(wrapper.instance());
    expect(wrapper.instance().getFeedback()).toEqual("initial");
    expect(wrapper.instance().getValue()).toBe(null);
    expect(wrapper.instance().getMessage()).toEqual("Initial Message");
    expect(wrapper.instance().isInitial()).toBeTruthy();
    expect(wrapper).toMatchSnapshot();
  });

  it("isInitial() shoud return true", () => {
    const wrapper = shallow(
      <UU5.Forms.DateTimePicker
        id={"idText"}
        label="Enter valid time"
        placeholder="Valid time"
        required={false}
        size="s"
      />
    );
    expect(wrapper.instance().state.value).toBe(null);
    expect(wrapper.instance().state.dateString).toBe(null);
    expect(wrapper.instance().state.timeString).toBe(null);
    expect(wrapper.instance().isInitial()).toBeTruthy();
    expect(wrapper).toMatchSnapshot();
  });

  it("isInitial() should return false", () => {
    const wrapper = shallow(
      <UU5.Forms.DateTimePicker
        id={"idText"}
        label="Enter valid time"
        placeholder="Valid time"
        required={false}
        size="s"
        feedback={"error"}
        message={"Error messagess"}
      />
    );
    expect(wrapper.instance().state.value).toBe(null);
    expect(wrapper.instance().state.dateString).toBeFalsy();
    expect(wrapper.instance().state.timeString).toBeFalsy();
    expect(wrapper.instance().isInitial()).toBeFalsy();
    expect(wrapper).toMatchSnapshot();
  });

  it("setLoading(message, value, setStateCallBack)", () => {
    const wrapper = shallow(
      <UU5.Forms.DateTimePicker
        id={"idText"}
        label="Enter valid time"
        placeholder="Valid time"
        required={false}
        size="s"
      />
    );
    const mockFunc = jest.fn();
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.instance().state.value).toBe(null);
    expect(wrapper.instance().state.dateString).toBe(null);
    expect(wrapper.instance().state.timeString).toBe(null);
    expect(wrapper.instance().getMessage()).toBeNull();
    expect(wrapper.instance().isLoading()).toBeFalsy();
    const returnValue = wrapper.instance().setLoading("Loading messsagess", "9.11.2013 12:00", mockFunc);
    wrapper.update();
    expect(mockFunc).toBeCalled();
    expect(mockFunc).toHaveBeenCalledTimes(1);
    expect(returnValue).toBe(wrapper.instance());
    expect(wrapper.instance().isLoading()).toBeTruthy();
    expect(wrapper.instance().getMessage()).toEqual("Loading messsagess");
    expect(wrapper.instance().state.dateString).toEqual("9/11/2013");
    expect(wrapper.instance().state.timeString).toBe("12:00");
    expect(wrapper).toMatchSnapshot();
  });

  it("isLoading()", () => {
    const wrapper = shallow(
      <UU5.Forms.DateTimePicker
        id={"idText"}
        label="Enter valid time"
        placeholder="Valid time"
        required={false}
        size="s"
      />
    );
    expect(wrapper.instance().isLoading()).toBeFalsy();
    expect(wrapper).toMatchSnapshot();
  });

  it("setSuccess(message, value, setStateCallBack)", () => {
    const wrapper = shallow(
      <UU5.Forms.DateTimePicker
        id={"idText"}
        label="Enter valid time"
        placeholder="Valid time"
        required={false}
        size="s"
      />
    );
    const mockFunc = jest.fn();
    expect(wrapper.instance().getFeedback()).toEqual("initial");
    expect(wrapper.instance().getMessage()).toBe(null);
    expect(wrapper.instance().state.value).toBe(null);
    expect(wrapper.instance().state.dateString).toBe(null);
    expect(wrapper.instance().state.timeString).toBe(null);
    expect(wrapper).toMatchSnapshot();
    const returnValue = wrapper.instance().setSuccess("This is success message", "9.11.2013 12:00", mockFunc);
    wrapper.update();
    expect(mockFunc).toBeCalled();
    expect(mockFunc).toHaveBeenCalledTimes(1);
    expect(returnValue).toBe(wrapper.instance());
    expect(wrapper.instance().getFeedback()).toEqual("success");
    expect(wrapper.instance().getMessage()).toEqual("This is success message");
    expect(wrapper.instance().state.dateString).toEqual("9/11/2013");
    expect(wrapper.instance().state.timeString).toBe("12:00");
    expect(wrapper.instance().isSuccess()).toBeTruthy();
    expect(wrapper).toMatchSnapshot();
  });

  it("isSuccess() fisr return false, second return true", () => {
    const wrapper = shallow(
      <UU5.Forms.DateTimePicker
        id={"idText"}
        label="Enter valid time"
        placeholder="Valid time"
        required={true}
        size="s"
      />
    );
    const mockFunc = jest.fn();
    expect(wrapper.instance().isSuccess()).toBeFalsy();
    const returnValue = wrapper.instance().setSuccess("This is success message", "9.11.2013 12:00", mockFunc);
    wrapper.update();
    expect(mockFunc).toBeCalled();
    expect(mockFunc).toHaveBeenCalledTimes(1);
    expect(returnValue).toBe(wrapper.instance());
    expect(wrapper.instance().getFeedback()).toEqual("success");
    expect(wrapper.instance().getMessage()).toEqual("This is success message");
    expect(wrapper.instance().state.dateString).toEqual("9/11/2013");
    expect(wrapper.instance().state.timeString).toBe("12:00");
    expect(wrapper.instance().isSuccess()).toBeTruthy();
    expect(wrapper).toMatchSnapshot();
  });

  it("setWarning(message, value, setStateCallBack)", () => {
    const wrapper = shallow(
      <UU5.Forms.DateTimePicker
        id={"idText"}
        label="Enter valid time"
        placeholder="Valid time"
        required={false}
        size="s"
      />
    );
    const mockFunc = jest.fn();
    expect(wrapper.instance().getFeedback()).toEqual("initial");
    expect(wrapper.instance().getMessage()).toBe(null);
    expect(wrapper.instance().state.value).toBe(null);
    expect(wrapper.instance().state.dateString).toBe(null);
    expect(wrapper.instance().state.timeString).toBe(null);
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.instance().isSuccess()).toBeFalsy();
    expect(wrapper.instance().isWarning()).toBeFalsy();
    const returnValue = wrapper.instance().setWarning("This is warning message", "9.11.2013 12:00", mockFunc);
    wrapper.update();
    expect(mockFunc).toHaveBeenCalledTimes(1);
    expect(returnValue).toBe(wrapper.instance());
    expect(wrapper.instance().getFeedback()).toEqual("warning");
    expect(wrapper.instance().getMessage()).toEqual("This is warning message");
    expect(wrapper.instance().state.dateString).toEqual("9/11/2013");
    expect(wrapper.instance().state.timeString).toBe("12:00");
    expect(wrapper.instance().isWarning()).toBeTruthy();
    expect(wrapper.instance().isSuccess()).toBeFalsy();
    expect(wrapper).toMatchSnapshot();
  });

  /**
   * First should return true after setFeedback to success should return false.
   */

  it("isWarning()", () => {
    const wrapper = shallow(
      <UU5.Forms.DateTimePicker
        id={"idText"}
        label="Enter valid time"
        placeholder="Valid time"
        feedback={"warning"}
        message={"Warning message"}
        required={true}
        size="s"
      />
    );
    const mockFunc = jest.fn();
    expect(wrapper.instance().getFeedback()).toEqual("warning");
    expect(wrapper.instance().getMessage()).toEqual("Warning message");
    expect(wrapper.instance().isWarning()).toBeTruthy();
    expect(wrapper).toMatchSnapshot();
    const setRetVal = wrapper.instance().setFeedback("success", "success message", "9.11.2013 12:00", mockFunc);
    wrapper.update();
    expect(mockFunc).toBeCalled();
    expect(setRetVal).toBe(wrapper.instance());
    expect(wrapper.instance().isWarning()).toBeFalsy();
    expect(wrapper).toMatchSnapshot();
  });

  it("setError(message, value, setStateCallBack)", () => {
    const wrapper = shallow(
      <UU5.Forms.DateTimePicker id={"idText"} label="Full name" placeholder="John Smith" size="s" />
    );
    const mockFunc = jest.fn();
    expect(wrapper.instance().isError()).toBeFalsy();
    expect(wrapper.instance().isWarning()).toBeFalsy();
    expect(wrapper.instance().isSuccess()).toBeFalsy();
    expect(wrapper.instance().isInitial()).toBeTruthy();
    expect(wrapper.instance().state.value).toBe(null);
    expect(wrapper.instance().state.dateString).toBeNull();
    expect(wrapper.instance().state.timeString).toBeNull();
    expect(wrapper.instance().getFeedback()).toEqual("initial");
    expect(wrapper.instance().getMessage()).toBe(null);
    expect(wrapper).toMatchSnapshot();
    const returnValue = wrapper.instance().setError("This is error mesage", "9.11.2013 12:00", mockFunc);
    wrapper.update();
    expect(mockFunc).toBeCalled();
    expect(mockFunc).toHaveBeenCalledTimes(1);
    expect(returnValue).toBe(wrapper.instance());
    expect(wrapper.instance().isWarning()).toBeFalsy();
    expect(wrapper.instance().isSuccess()).toBeFalsy();
    expect(wrapper.instance().isInitial()).toBeFalsy;
    expect(wrapper.instance().isError()).toBeTruthy();
    expect(wrapper.instance().state.dateString).toEqual("9/11/2013");
    expect(wrapper.instance().state.timeString).toBe("12:00");
    expect(wrapper.instance().getFeedback()).toEqual("error");
    expect(wrapper.instance().getMessage()).toEqual("This is error mesage");
    expect(wrapper).toMatchSnapshot();
  });

  it("isError()", () => {
    const wrapper = shallow(
      <UU5.Forms.DateTimePicker
        id={"idText"}
        label="Enter valid time"
        placeholder="Valid time"
        feedback={"error"}
        message={"Error message"}
        required={true}
        size="s"
      />
    );
    const mockFunc = jest.fn();
    expect(wrapper.instance().getFeedback()).toEqual("error");
    expect(wrapper.instance().getMessage()).toEqual("Error message");
    expect(wrapper.instance().isError()).toBeTruthy();
    expect(wrapper).toMatchSnapshot();
    const setRetVal = wrapper.instance().setFeedback("success", "success message", "9.11.2013 12:00", mockFunc);
    wrapper.update();
    expect(mockFunc).toBeCalled();
    expect(setRetVal).toBe(wrapper.instance());
    expect(wrapper.instance().isError()).toBeFalsy();
    expect(wrapper).toMatchSnapshot();
  });

  it("reset(setStateCallBack)", () => {
    const wrapper = shallow(
      <UU5.Forms.DateTimePicker
        id={"idText"}
        label="Enter valid time"
        placeholder="Valid time"
        required={true}
        size="s"
      />
    );
    const mockFunc = jest.fn();
    wrapper.instance().setFeedback("success", "New Message", "9.11.2013 12:00", mockFunc);
    wrapper.update();
    wrapper.instance().readOnly(mockFunc);
    wrapper.update();
    expect(wrapper.instance().getFeedback()).toEqual("success");
    expect(wrapper.instance().getMessage()).toEqual("New Message");
    expect(wrapper.instance().state.dateString).toEqual("9/11/2013");
    expect(wrapper.instance().state.timeString).toBe("12:00");
    expect(wrapper.instance().isReadOnly()).toBeTruthy();
    expect(mockFunc).toBeCalled();
    expect(wrapper).toMatchSnapshot();
    //Now we reset seting value.
    const returnValue = wrapper.instance().reset(mockFunc);
    wrapper.update();
    expect(mockFunc).toBeCalled();
    expect(mockFunc).toHaveBeenCalledTimes(3);
    expect(returnValue).toBe(wrapper.instance());
    expect(wrapper.instance().state.value).toBe(null);
    expect(wrapper.instance().state.dateString).toBe(null);
    expect(wrapper.instance().state.timeString).toBe(null);
    expect(wrapper.instance().getFeedback()).toEqual("initial");
    expect(wrapper.instance().getMessage()).toBe(null);
    expect(wrapper.instance().isReadOnly()).toBeFalsy();
    expect(wrapper).toMatchSnapshot();
  });

  it("getChangeFeedback()", () => {
    const wrapper = shallow(
      <UU5.Forms.DateTimePicker
        id={"idText"}
        label="Enter valid time"
        placeholder="Valid time"
        required={true}
        size="s"
      />
    );
    expect(wrapper.instance().getChangeFeedback({})).toEqual(
      expect.objectContaining({
        feedback: "initial",
        message: null,
        value: null,
        foundAutocompleteItems: null,
        selectedIndex: null
      })
    );
    expect(wrapper).toMatchSnapshot();
  });

  it("setChangeFeedback()", () => {
    const wrapper = shallow(
      <UU5.Forms.DateTimePicker
        id={"idText"}
        label="Enter valid time"
        placeholder="Valid time"
        required={true}
        size="s"
      />
    );
    const mockFunc = jest.fn();
    expect(wrapper.instance().getChangeFeedback({})).toEqual(
      expect.objectContaining({
        feedback: "initial",
        message: null,
        value: null,
        foundAutocompleteItems: null,
        selectedIndex: null
      })
    );
    const returnValue = wrapper.instance().setChangeFeedback(
      {
        feedback: "success",
        message: "Success message from setChangeFeedback",
        value: "9.11.2013 12:00"
      },
      mockFunc
    );
    wrapper.update();
    expect(mockFunc).toBeCalled();
    expect(returnValue).toBe(wrapper.instance());
    expect(wrapper.instance().state.value).toMatch(/9.11.2013 12:00/);
    expect(wrapper.instance().state.feedback).toEqual("success");
    expect(wrapper.instance().state.message).toEqual("Success message from setChangeFeedback");
    expect(wrapper).toMatchSnapshot();
  });

  it("isReadOnly()", () => {
    const wrapper = shallow(
      <UU5.Forms.DateTimePicker
        id={"idText"}
        label="Enter valid time"
        placeholder="Valid time"
        value="9.11.2013 12:00"
        required={true}
        size="s"
      />
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
      <UU5.Forms.DateTimePicker
        id={"idText"}
        label="Enter valid time"
        placeholder="Valid time"
        value="9.11.2013 12:00"
        required={true}
        size="s"
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
    expect(returnValue).toBe(wrapper.instance());
    expect(wrapper.instance().isReadOnly()).toBeFalsy();
    expect(wrapper.instance().editable(mockFunc)).toBeTruthy();
    expect(wrapper).toMatchSnapshot();
    expect(mockFunc).toHaveBeenCalledTimes(4);
  });

  it("setEditableValue(false, setStateCallback)", () => {
    const wrapper = shallow(
      <UU5.Forms.DateTimePicker
        id={"idText"}
        label="Enter valid time"
        placeholder="Valid time"
        value="9.11.2013 12:00"
        required={true}
        size="s"
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
    expect(returnValue).toBe(wrapper.instance());
    expect(wrapper.instance().isReadOnly()).toBeTruthy();
    expect(wrapper).toMatchSnapshot();
    expect(mockFunc).toHaveBeenCalledTimes(3);
  });

  it("readOnly(setStatecallback)", () => {
    const wrapper = shallow(
      <UU5.Forms.DateTimePicker
        id={"idText"}
        label="Enter valid time"
        placeholder="Valid time"
        value="9.11.2013 12:00"
        required={true}
        size="s"
      />
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
      <UU5.Forms.DateTimePicker
        id={"idText"}
        label="Enter valid time"
        placeholder="Valid time"
        value="9.11.2013 12:00"
        required={true}
        size="s"
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
    expect(returnValue).toBe(wrapper.instance());
    expect(wrapper.instance().isReadOnly()).toBeFalsy();
    expect(wrapper.instance().state.readOnly).toBeFalsy();
    expect(wrapper).toMatchSnapshot();
  });

  it("getLabel(idinput)", () => {
    const wrapper = shallow(
      <UU5.Forms.DateTimePicker
        id={"idText"}
        label="Enter valid time"
        placeholder="Valid time"
        value="9.11.2013 12:00"
        required={true}
        size="s"
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
      <UU5.Forms.DateTimePicker
        id={"idText"}
        label="Enter valid time"
        placeholder="Valid time"
        value="9.11.2013 12:00"
        required={true}
        size="s"
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

describe("UU5.Forms.TextInputMixin interface testing", () => {
  it("isTextInput() should return true", () => {
    const wrapper = shallow(
      <UU5.Forms.DateTimePicker
        id={"idText"}
        label="Enter valid time"
        placeholder="Valid time"
        value="9.11.2013 12:00"
        size="s"
      />
    );
    expect(wrapper.instance().isTextInput()).toBeTruthy();
    expect(wrapper).toMatchSnapshot();
  });

  it("getInput()", () => {
    const wrapper = mount(
      <UU5.Forms.DateTimePicker
        id={"idText"}
        label="Enter valid time"
        placeholder="Valid time"
        value="9.11.2013 12:00"
        size="s"
      />
    );
    expect(() => wrapper.instance().getInput()).not.toThrow();
    expect(wrapper.instance().getInput()).toEqual(expect.any(Object));
    expect(wrapper.instance().getInput()).toBeInstanceOf(Object);
    expect(wrapper.instance().getInput()).not.toBe(undefined);
    expect(wrapper.instance().getInput()).not.toBe(null);
  });

  it("focus()", () => {
    const wrapper = shallow(
      <UU5.Forms.DateTimePicker
        id={"idText"}
        label="Enter valid time"
        placeholder="Valid time"
        value="9.11.2013 12:00"
        size="s"
      />
    );
    expect(wrapper).toMatchSnapshot();
    wrapper.instance().focus();
    wrapper.update();
    expect(wrapper).toMatchSnapshot();
  });

  it("isValid()", () => {
    const wrapper = shallow(
      <UU5.Forms.DateTimePicker
        id={"idText"}
        label="Enter valid time"
        placeholder="Valid time"
        value="9.11.2013 12:00"
        required={true}
        size="s"
      />
    );
    expect(wrapper.instance().isValid()).toBeTruthy();
    expect(wrapper).toMatchSnapshot();
  });

  it("open(setStateCallBack)", () => {
    const wrapper = mount(
      <UU5.Forms.DateTimePicker
        id={"idText"}
        label="Enter valid time"
        placeholder="Valid time"
        value="9.11.2013"
        autocompleteItems={[
          {
            value: "9.11.2013 12:00"
          },
          {
            value: "9.11.2013 13:00"
          },
          {
            value: "9.11.2013 14:00"
          },
          {
            value: "9.11.2013 15:00"
          }
        ]}
        required={true}
        size="s"
      />
    );
    const mockFunc = jest.fn();
    expect(wrapper.instance().state.open).toBeFalsy();
    const returnValue = wrapper.instance().open(mockFunc);
    wrapper.update();
    expect(mockFunc).toBeCalled();
    expect(mockFunc).toHaveBeenCalledTimes(1);
    expect(returnValue).toBe(wrapper.instance());
    expect(wrapper.instance().state.open).toBeFalsy();
  });

  it("isOpen() should return false", () => {
    const wrapper = shallow(
      <UU5.Forms.DateTimePicker
        id={"idText"}
        label="Enter valid time"
        placeholder="Valid time"
        autocompleteItems={[
          {
            value: "9.11.2013 12:00"
          },
          {
            value: "9.11.2013 13:00"
          },
          {
            value: "9.11.2013 14:00"
          },
          {
            value: "9.11.2013 15:00"
          }
        ]}
        required={true}
        size="s"
      />
    );
    expect(wrapper.instance().isOpen()).toBeFalsy();
    expect(wrapper).toMatchSnapshot();
  });

  it("getFocusFeedback()", () => {
    const focusMessage = "Message";
    const wrapper = mount(
      <UU5.Forms.DateTimePicker
        id={"idText"}
        label="Enter valid time"
        placeholder="Valid time"
        focusMessage={focusMessage}
        required={true}
        size="s"
      />
    );
    wrapper.instance().focus();
    wrapper.update();
    expect(wrapper.instance().getFocusFeedback({})).toEqual({
      feedback: "initial",
      value: null,
      message: focusMessage
    });
  });

  it("getBlurFeedback()", () => {
    const wrapper = shallow(
      <UU5.Forms.DateTimePicker
        id={"idText"}
        label="Enter valid time"
        placeholder="Valid time"
        required={true}
        size="s"
      />
    );
    expect(wrapper.instance().getBlurFeedback({})).toEqual(
      expect.objectContaining({
        feedback: "initial",
        message: null,
        value: undefined
      })
    );
    expect(wrapper).toMatchSnapshot();
  });

  it("setAutocompleteItems(items,opt,setStateCallBack)", () => {
    const wrapper = shallow(
      <UU5.Forms.DateTimePicker
        id={"idText"}
        label="Enter valid time"
        placeholder="Valid time"
        seconds={false}
        required={false}
        size="s"
      />
    );
    const mockFunc = jest.fn();
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.instance().state.autocompleteItems).toBe(null);
    const returnValue = wrapper.instance().setAutoCompleteItems(
      [
        {
          value: "9.11.2013 12:00"
        },
        {
          value: "9.11.2013 13:00"
        },
        {
          value: "9.11.2013 14:00"
        },
        {
          value: "9.11.2013 15:00"
        }
      ],
      null,
      mockFunc
    );
    wrapper.update();
    expect(wrapper.instance().state.autocompleteItems).not.toBe(null);
    expect(wrapper.instance().state.autocompleteItems).toEqual(
      expect.arrayContaining([
        { value: "9.11.2013 12:00" },
        { value: "9.11.2013 13:00" },
        { value: "9.11.2013 14:00" },
        { value: "9.11.2013 15:00" }
      ])
    );
    expect(mockFunc).toBeCalled();
    expect(mockFunc).toHaveBeenCalledTimes(1);
    expect(returnValue).toBe(wrapper.instance());
    expect(wrapper).toMatchSnapshot();
  });
});
