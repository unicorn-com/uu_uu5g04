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
import enzymeToJson from "enzyme-to-json";
import {shallow, mount} from 'enzyme';
import "uu5g04-bricks";
import "uu5g04-forms";

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

describe('UU5.Form.DateRangePicker intreface testing', () => {

  it('parseDate(date)', () => {
    const wrapper = shallow(
      <UU5.Forms.DateRangePicker
        label='Date of birth'
        disableBackdrop
        id={"uuID01"}
      />
    );
    expect(wrapper.instance().parseDate(["1.1.2019", "5.5.2020"])).toEqual(expect.any(Object));
    const returnValue = wrapper.instance().parseDate(["1.1.2019", "5.5.2020"]);
    expect(Array.isArray(returnValue)).toBeTruthy();
    expect(returnValue.length).toBe(2);
    expect(returnValue[0]).toBeInstanceOf(Date);
    expect(returnValue[1]).toBeInstanceOf(Date);
    expect(wrapper.instance().parseDate(["1.1.2019", "5.5.2020"])).not.toBeNull();
    expect(enzymeToJson(wrapper)).toMatchSnapshot();
  });


  it('toggle(setStateCallBack, e)', () => {
    const wrapper = mount(
      <UU5.Forms.DateRangePicker
        label='Date of birth'
        disableBackdrop
        id={"uuID01"}
      />
    );
    const mockFunc = jest.fn();
    expect(wrapper.instance().state.open).toBeFalsy();
    expect(wrapper.instance().state.open).toBeFalsy();
    const returnValue = wrapper.instance().toggle(mockFunc);
    wrapper.update();
    expect(mockFunc).toBeCalled();
    expect(returnValue).toBe(wrapper.instance());
    expect(wrapper.instance().state.open).toBeTruthy();
    expect(wrapper.instance().state.open).toBeTruthy();
    wrapper.instance().toggle(); //close component
    wrapper.update();
    expect(wrapper.instance().state.open).toBeFalsy()
  });


  it('close(setStateCallBack, e)', () => {
    const wrapper = mount(
      <UU5.Forms.DateRangePicker
        label='Date of birth'
        disableBackdrop
        id={"uuID01"}
      />
    );
    const mockFunc = jest.fn();
    expect(wrapper.instance().state.open).toBeFalsy();
    wrapper.instance().toggle(mockFunc);
    wrapper.update();
    expect(wrapper.instance().state.open).toBeTruthy();
    const returnValue = wrapper.instance().close(mockFunc);
    wrapper.update();
    expect(mockFunc).toBeCalled();
    expect(returnValue).toBe(wrapper.instance());
    expect(wrapper.instance().state.open).toBeFalsy();
  });

});

describe('UU5.Forms.InputMixin interface testing', () => {

  it('isInput()', () => {
    const wrapper = shallow(
      <UU5.Forms.DateRangePicker
        id={"idText"}
        label="Valid time"
        placeholder="Enter time"
        required={false}
      />
    );
    expect(wrapper.instance().isInput()).toBeTruthy();
    expect(enzymeToJson(wrapper)).toMatchSnapshot();
  });

  it('getValue() should return value', () => {
    const wrapper = shallow(
      <UU5.Forms.DateRangePicker
        id={"idText"}
        label="Valid time"
        placeholder="Enter time"
        value={["1.1.2019", "5.5.2020"]}
        required={false}
      />
    );
    expect(Array.isArray(wrapper.instance().getValue())).toBeTruthy();
    expect(wrapper.instance().getValue().length).toBe(2);
    expect(wrapper.instance().getValue()[0]).toBeInstanceOf(Date);
    expect(wrapper.instance().getValue()[1]).toBeInstanceOf(Date);
  });

  it('setValue(value,setStateCallBack)', () => {
    const wrapper = shallow(
      <UU5.Forms.DateRangePicker
        id={"idText"}
        label="Valid time"
        placeholder="Enter time"
        required={false}
      />
    );
    expect(wrapper.instance().state.value).toEqual(null);
    const mockFunc = jest.fn();
    expect(enzymeToJson(wrapper)).toMatchSnapshot();
    const returnValue = wrapper.instance().setValue(["1.1.2019", "5.5.2020"], mockFunc);
    wrapper.update();
    expect(mockFunc).toBeCalled();
    expect(mockFunc).toHaveBeenCalledTimes(1);
    expect(returnValue).toBe(wrapper.instance());
    expect(Array.isArray(wrapper.instance().getValue())).toBeTruthy();
    expect(wrapper.instance().getValue().length).toBe(2);
    expect(wrapper.instance().getValue()[0]).toBeInstanceOf(Date);
    expect(wrapper.instance().getValue()[1]).toBeInstanceOf(Date);
    expect(enzymeToJson(wrapper)).toMatchSnapshot();
  });


  it('getMessage()', () => {
    const wrapper = shallow(
      <UU5.Forms.DateRangePicker
        id={"idText"}
        label="Enter valid time"
        placeholder="Valid time"
        required={false}
      />
    );
    expect(wrapper.instance().getMessage()).toBe(null);
    expect(enzymeToJson(wrapper)).toMatchSnapshot();
    wrapper.setProps({message: "New Setting message"});
    expect(wrapper.instance().getMessage()).toMatch(/New Setting message/);
  });

  it('setMessage(msg, setStateCallBack)', () => {
    const wrapper = shallow(
      <UU5.Forms.DateRangePicker
        id={"idText"}
        label="Enter valid time"
        placeholder="Valid time"
        required={false}
      />
    );
    const mockFunc = jest.fn();
    expect(enzymeToJson(wrapper)).toMatchSnapshot();
    expect(wrapper.instance().getMessage()).toBeNull();
    const returnValue = wrapper.instance().setMessage("New Message", mockFunc);
    wrapper.update();
    expect(mockFunc).toBeCalled();
    expect(mockFunc).toHaveBeenCalledTimes(1);
    expect(returnValue).toBe(wrapper.instance());
    expect(wrapper.instance().getMessage()).toMatch(/New Message/);
    expect(enzymeToJson(wrapper)).toMatchSnapshot();
  });


  it('getFeedBack()', () => {
    const wrapper = shallow(
      <UU5.Forms.DateRangePicker
        id={"idText"}
        label="Enter valid time"
        placeholder="Valid time"
        required={false}
      />
    );
    expect(wrapper.instance().getFeedback()).toMatch(/initial/);
    expect(enzymeToJson(wrapper)).toMatchSnapshot();
    wrapper.setProps({feedback: "success"});
    wrapper.update();
    expect(wrapper.instance().getFeedback()).toMatch(/success/);
    expect(enzymeToJson(wrapper)).toMatchSnapshot();
  });

  it('setFeedBack(feedback, message, value, setStateCallBack)', () => {
    const wrapper = shallow(
      <UU5.Forms.DateRangePicker
        id={"idText"}
        label="Enter valid time"
        placeholder="Valid time"
        required={false}
      />
    );
    expect(wrapper.instance().getFeedback()).toMatch(/initial/);
    expect(wrapper.instance().getMessage()).toBe(null);
    expect(wrapper.instance().state.value).toEqual(null);
    const mockFunc = jest.fn();
    expect(enzymeToJson(wrapper)).toMatchSnapshot();
    const returnValue = wrapper.instance().setFeedback("success", "This is valid message.", ["1.1.2019", "5.5.2020"], mockFunc);
    wrapper.update();
    expect(mockFunc).toBeCalled();
    expect(mockFunc).toHaveBeenCalledTimes(1);
    expect(returnValue).toBe(wrapper.instance());
    expect(wrapper.instance().getFeedback()).toEqual("success");
    expect(wrapper.instance().getMessage()).toEqual("This is valid message.");
    expect(Array.isArray(wrapper.instance().getValue())).toBeTruthy();
    expect(wrapper.instance().getValue().length).toBe(2);
    expect(wrapper.instance().getValue()[0]).toBeInstanceOf(Date);
    expect(wrapper.instance().getValue()[1]).toBeInstanceOf(Date);
    expect(enzymeToJson(wrapper)).toMatchSnapshot();
  });

  it('setInitial(msg, value, setStateCallBack)', () => {
    const wrapper = shallow(
      <UU5.Forms.DateRangePicker
        id={"idText"}
        label="Enter valid time"
        placeholder="Valid time"
        message={"This input is required"}
        feedback={"error"}
        required={true}
      />
    );
    const mockFunc = jest.fn();
    expect(enzymeToJson(wrapper)).toMatchSnapshot();
    expect(wrapper.instance().getFeedback()).toEqual("error");
    expect(wrapper.instance().state.value).toEqual(null);
    expect(wrapper.instance().getMessage()).toEqual("This input is required")
    expect(wrapper.instance().isInitial()).toBeFalsy();
    const returnValue = wrapper.instance().setInitial("Initial Message", null, mockFunc);
    wrapper.update();
    expect(mockFunc).toBeCalled();
    expect(mockFunc).toHaveBeenCalledTimes(1);
    expect(returnValue).toBe(wrapper.instance());
    expect(wrapper.instance().getFeedback()).toEqual("initial");
    expect(wrapper.instance().state.value).toEqual(null);
    expect(wrapper.instance().getMessage()).toEqual("Initial Message")
    expect(wrapper.instance().isInitial()).toBeTruthy();
    expect(enzymeToJson(wrapper)).toMatchSnapshot();
  });

  it('isInitial() shoud return true', () => {
    const wrapper = shallow(
      <UU5.Forms.DateRangePicker
        id={"idText"}
        label="Enter valid time"
        placeholder="Valid time"
        required={false}
      />
    );
    expect(wrapper.instance().isInitial()).toBeTruthy();
  });

  it('isInitial() should return false', () => {
    const wrapper = shallow(
      <UU5.Forms.DateRangePicker
        id={"idText"}
        label="Enter valid time"
        placeholder="Valid time"
        required={false}
        feedback={"error"}
        message={"Error messagess"}
      />
    );
    expect(wrapper.instance().isInitial()).toBeFalsy();
  });

  it('setLoading(message, value, setStateCallBack)', () => {
    const wrapper = shallow(
      <UU5.Forms.DateRangePicker
        id={"idText"}
        label="Enter valid time"
        placeholder="Valid time"
        required={false}
      />
    );
    const mockFunc = jest.fn();
    expect(enzymeToJson(wrapper)).toMatchSnapshot();
    expect(wrapper.instance().state.value).toEqual(null);
    expect(wrapper.instance().getMessage()).toBeNull();
    expect(wrapper.instance().isLoading()).toBeFalsy();
    const returnValue = wrapper.instance().setLoading("Loading messsagess", ["1.1.2019", "5.5.2020"], mockFunc);
    wrapper.update();
    expect(mockFunc).toBeCalled();
    expect(mockFunc).toHaveBeenCalledTimes(1);
    expect(returnValue).toBe(wrapper.instance());
    expect(wrapper.instance().isLoading()).toBeTruthy();
    expect(wrapper.instance().getMessage()).toEqual("Loading messsagess");
    expect(Array.isArray(wrapper.instance().getValue())).toBeTruthy();
    expect(wrapper.instance().getValue().length).toBe(2);
    expect(wrapper.instance().getValue()[0]).toBeInstanceOf(Date);
    expect(wrapper.instance().getValue()[1]).toBeInstanceOf(Date);
    expect(enzymeToJson(wrapper)).toMatchSnapshot();
  });

  it('isLoading()', () => {
    const wrapper = shallow(
      <UU5.Forms.DateRangePicker
        id={"idText"}
        label="Enter valid time"
        placeholder="Valid time"
        required={false}
      />
    );
    expect(wrapper.instance().isLoading()).toBeFalsy();
    expect(enzymeToJson(wrapper)).toMatchSnapshot();
  });

  it('setSuccess(message, value, setStateCallBack)', () => {
    const wrapper = shallow(
      <UU5.Forms.DateRangePicker
        id={"idText"}
        label="Enter valid time"
        placeholder="Valid time"
        required={false}
      />
    );
    const mockFunc = jest.fn();
    expect(wrapper.instance().getFeedback()).toEqual("initial");
    expect(wrapper.instance().getMessage()).toBe(null);
    expect(wrapper.instance().state.value).toEqual(null);
    expect(enzymeToJson(wrapper)).toMatchSnapshot();
    const returnValue = wrapper.instance().setSuccess("This is success message", ["1.1.2019", "5.5.2020"], mockFunc);
    wrapper.update();
    expect(mockFunc).toBeCalled();
    expect(mockFunc).toHaveBeenCalledTimes(1);
    expect(returnValue).toBe(wrapper.instance());
    expect(wrapper.instance().getFeedback()).toEqual("success");
    expect(wrapper.instance().getMessage()).toEqual("This is success message")
    expect(Array.isArray(wrapper.instance().getValue())).toBeTruthy();
    expect(wrapper.instance().getValue().length).toBe(2);
    expect(wrapper.instance().getValue()[0]).toBeInstanceOf(Date);
    expect(wrapper.instance().getValue()[1]).toBeInstanceOf(Date);
    expect(wrapper.instance().isSuccess()).toBeTruthy();
    expect(enzymeToJson(wrapper)).toMatchSnapshot();
  });

  it('isSuccess() fisr return false, second return true', () => {
    const wrapper = shallow(
      <UU5.Forms.DateRangePicker
        id={"idText"}
        label="Enter valid time"
        placeholder="Valid time"
        required={true}
      />
    );
    const mockFunc = jest.fn();
    expect(wrapper.instance().isSuccess()).toBeFalsy();
    const returnValue = wrapper.instance().setSuccess("This is success message", ["1.1.2019", "5.5.2020"], mockFunc);
    wrapper.update();
    expect(mockFunc).toBeCalled();
    expect(mockFunc).toHaveBeenCalledTimes(1);
    expect(returnValue).toBe(wrapper.instance());
    expect(wrapper.instance().getFeedback()).toEqual("success");
    expect(wrapper.instance().getMessage()).toEqual("This is success message")
    expect(Array.isArray(wrapper.instance().getValue())).toBeTruthy();
    expect(wrapper.instance().getValue().length).toBe(2);
    expect(wrapper.instance().getValue()[0]).toBeInstanceOf(Date);
    expect(wrapper.instance().getValue()[1]).toBeInstanceOf(Date);
    expect(wrapper.instance().isSuccess()).toBeTruthy();
    expect(enzymeToJson(wrapper)).toMatchSnapshot();
  });

  it('setWarning(message, value, setStateCallBack)', () => {
    const wrapper = shallow(
      <UU5.Forms.DateRangePicker
        id={"idText"}
        label="Enter valid time"
        placeholder="Valid time"
        required={false}
      />
    );
    const mockFunc = jest.fn();
    expect(wrapper.instance().getFeedback()).toEqual("initial");
    expect(wrapper.instance().getMessage()).toBe(null);
    expect(wrapper.instance().state.value).toEqual(null);
    expect(enzymeToJson(wrapper)).toMatchSnapshot();
    expect(wrapper.instance().isSuccess()).toBeFalsy();
    expect(wrapper.instance().isWarning()).toBeFalsy();
    const returnValue = wrapper.instance().setWarning("This is warning message", ["1.1.2019", "5.5.2020"], mockFunc);
    wrapper.update();
    expect(mockFunc).toBeCalled();
    expect(mockFunc).toHaveBeenCalledTimes(1);
    expect(returnValue).toBe(wrapper.instance());
    expect(wrapper.instance().getFeedback()).toEqual("warning");
    expect(wrapper.instance().getMessage()).toEqual("This is warning message")
    expect(Array.isArray(wrapper.instance().getValue())).toBeTruthy();
    expect(wrapper.instance().getValue().length).toBe(2);
    expect(wrapper.instance().getValue()[0]).toBeInstanceOf(Date);
    expect(wrapper.instance().getValue()[1]).toBeInstanceOf(Date);
    expect(wrapper.instance().isWarning()).toBeTruthy();
    expect(wrapper.instance().isSuccess()).toBeFalsy();
    expect(enzymeToJson(wrapper)).toMatchSnapshot();
  });


  it('isWarning()', () => {
    const wrapper = shallow(
      <UU5.Forms.DateRangePicker
        id={"idText"}
        label="Enter valid time"
        placeholder="Valid time"
        feedback={"warning"}
        message={"Warning message"}
        required={true}
      />
    );
    const mockFunc = jest.fn();
    expect(wrapper.instance().getFeedback()).toEqual("warning");
    expect(wrapper.instance().getMessage()).toEqual("Warning message");
    expect(wrapper.instance().isWarning()).toBeTruthy();
    expect(enzymeToJson(wrapper)).toMatchSnapshot();
    const setRetVal = wrapper.instance().setFeedback("success", "success message", ["1.1.2019", "5.5.2020"], mockFunc);
    wrapper.update();
    expect(mockFunc).toBeCalled();
    expect(setRetVal).toBe(wrapper.instance());
    expect(wrapper.instance().isWarning()).toBeFalsy();
    expect(enzymeToJson(wrapper)).toMatchSnapshot();
  });

  it('setError(message, value, setStateCallBack)', () => {
    const wrapper = shallow(
      <UU5.Forms.DateRangePicker
        id={"idText"}
        label="Full name"
        placeholder="John Smith"
      />
    );
    const mockFunc = jest.fn();
    expect(wrapper.instance().isError()).toBeFalsy();
    expect(wrapper.instance().isWarning()).toBeFalsy();
    expect(wrapper.instance().isSuccess()).toBeFalsy();
    expect(wrapper.instance().isInitial()).toBeTruthy();
    expect(wrapper.instance().state.value).toEqual(null);
    expect(wrapper.instance().getFeedback()).toEqual("initial");
    expect(wrapper.instance().getMessage()).toBe(null);
    expect(enzymeToJson(wrapper)).toMatchSnapshot();
    const returnValue = wrapper.instance().setError("This is error mesage", ["1.1.2019", "5.5.2020"], mockFunc);
    wrapper.update();
    expect(mockFunc).toBeCalled();
    expect(mockFunc).toHaveBeenCalledTimes(1);
    expect(returnValue).toBe(wrapper.instance());
    expect(wrapper.instance().isWarning()).toBeFalsy();
    expect(wrapper.instance().isSuccess()).toBeFalsy();
    expect(wrapper.instance().isInitial()).toBeFalsy;
    expect(wrapper.instance().isError()).toBeTruthy();
    expect(Array.isArray(wrapper.instance().getValue())).toBeTruthy();
    expect(wrapper.instance().getValue().length).toBe(2);
    expect(wrapper.instance().getValue()[0]).toBeInstanceOf(Date);
    expect(wrapper.instance().getValue()[1]).toBeInstanceOf(Date);
    expect(wrapper.instance().getFeedback()).toEqual("error");
    expect(wrapper.instance().getMessage()).toEqual("This is error mesage");
    expect(enzymeToJson(wrapper)).toMatchSnapshot();
  });

  it('isError()', () => {
    const wrapper = shallow(
      <UU5.Forms.DateRangePicker
        id={"idText"}
        label="Enter valid time"
        placeholder="Valid time"
        feedback={"error"}
        message={"Error message"}
        required={true}
      />
    );
    const mockFunc = jest.fn();
    expect(wrapper.instance().getFeedback()).toEqual("error");
    expect(wrapper.instance().getMessage()).toEqual("Error message");
    expect(wrapper.instance().isError()).toBeTruthy();
    expect(enzymeToJson(wrapper)).toMatchSnapshot();
    const setRetVal = wrapper.instance().setFeedback("success", "success message", ["1.1.2019", "5.5.2020"], mockFunc);
    wrapper.update();
    expect(mockFunc).toBeCalled();
    expect(setRetVal).toBe(wrapper.instance());
    expect(wrapper.instance().isError()).toBeFalsy();
    expect(enzymeToJson(wrapper)).toMatchSnapshot();
  });

  it('reset(setStateCallBack)', () => {
    const wrapper = shallow(
      <UU5.Forms.DateRangePicker
        id={"idText"}
        label="Enter valid time"
        placeholder="Valid time"
        required={true}
      />
    );
    const mockFunc = jest.fn();
    wrapper.instance().setFeedback("success", "New Message", ["1.1.2019", "5.5.2020"], mockFunc);
    wrapper.update();
    wrapper.instance().readOnly(mockFunc);
    wrapper.update();
    expect(wrapper.instance().getFeedback()).toEqual("success");
    expect(wrapper.instance().getMessage()).toEqual("New Message");
    expect(Array.isArray(wrapper.instance().getValue())).toBeTruthy();
    expect(wrapper.instance().getValue().length).toBe(2);
    expect(wrapper.instance().getValue()[0]).toBeInstanceOf(Date);
    expect(wrapper.instance().getValue()[1]).toBeInstanceOf(Date);
    expect(wrapper.instance().isReadOnly()).toBeTruthy();
    expect(mockFunc).toBeCalled();
    expect(enzymeToJson(wrapper)).toMatchSnapshot();
    //Now we reset seting value.
    const returnValue = wrapper.instance().reset(mockFunc);
    wrapper.update();
    expect(mockFunc).toBeCalled();
    expect(mockFunc).toHaveBeenCalledTimes(3);
    expect(returnValue).toBe(wrapper.instance());
    expect(wrapper.instance().state.value).toEqual(null);
    expect(wrapper.instance().getFeedback()).toEqual("initial");
    expect(wrapper.instance().getMessage()).toBe(null);
    expect(wrapper.instance().isReadOnly()).toBeFalsy();
    expect(enzymeToJson(wrapper)).toMatchSnapshot();
  });

  it('getChangeFeedback()', () => {
    const wrapper = shallow(
      <UU5.Forms.DateRangePicker
        id={"idText"}
        label="Enter valid time"
        placeholder="Valid time"
        required={true}
      />
    );
    expect(wrapper.instance().getChangeFeedback({})).toEqual(expect.objectContaining({
      feedback: 'initial',
      message: null,
      value: null,
      foundAutocompleteItems: null,
      selectedIndex: null
    }));
    expect(enzymeToJson(wrapper)).toMatchSnapshot();
  });

  it('setChangeFeedback()', () => {
    const wrapper = shallow(
      <UU5.Forms.DateRangePicker
        id={"idText"}
        label="Enter valid time"
        placeholder="Valid time"
        required={true}
      />
    );
    const mockFunc = jest.fn();
    expect(wrapper.instance().getChangeFeedback({})).toEqual(expect.objectContaining({
      feedback: 'initial',
      message: null,
      value: null,
      foundAutocompleteItems: null,
      selectedIndex: null
    }));
    const returnValue = wrapper.instance().setChangeFeedback({
      feedback: 'success',
      message: 'Success message from setChangeFeedback',
      value: ["1.1.2019", "5.5.2020"]
    }, mockFunc);
    wrapper.update();
    expect(mockFunc).toBeCalled();
    expect(returnValue).toBe(wrapper.instance());
    expect(Array.isArray(wrapper.instance().getValue())).toBeTruthy();
    expect(wrapper.instance().state.value.length).toBe(2);
    let expectedValue1 = (new Date("2019-01-01T00:00")).getTime();
    let expectedValue2 = (new Date("2020-05-05T00:00")).getTime();
    expect(wrapper.instance().state.value[0].getTime() === expectedValue1).toBeTruthy();
    expect(wrapper.instance().state.value[1].getTime() === expectedValue2).toBeTruthy();
    expect(wrapper.instance().state.feedback).toEqual("success");
    expect(wrapper.instance().state.message).toEqual("Success message from setChangeFeedback");
    expect(enzymeToJson(wrapper)).toMatchSnapshot();
  });


  it('isReadOnly()', () => {
    const wrapper = shallow(
      <UU5.Forms.DateRangePicker
        id={"idText"}
        label="Enter valid time"
        placeholder="Valid time"
        required={true}
      />
    );
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

  it('setEditableValue(true, setStateCallback)', () => {
    const wrapper = shallow(
      <UU5.Forms.DateRangePicker
        id={"idText"}
        label="Enter valid time"
        placeholder="Valid time"
        value={["1.1.2019", "5.5.2020"]}
        required={true}
      />
    );
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


  it('setEditableValue(false, setStateCallback)', () => {
    const wrapper = shallow(
      <UU5.Forms.DateRangePicker
        id={"idText"}
        label="Enter valid time"
        placeholder="Valid time"
        value={["1.1.2019", "5.5.2020"]}
        required={true}
      />
    );
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


  it('readOnly(setStatecallback)', () => {
    const wrapper = shallow(
      <UU5.Forms.DateRangePicker
        id={"idText"}
        label="Enter valid time"
        placeholder="Valid time"
        value={["1.1.2019", "5.5.2020"]}
        required={true}
      />
    );
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

  it('editable(setStatecallback)', () => {
    const wrapper = shallow(
      <UU5.Forms.DateRangePicker
        id={"idText"}
        label="Enter valid time"
        placeholder="Valid time"
        value={["1.1.2019", "5.5.2020"]}
        required={true}
      />
    );
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

  it('getLabel(idinput)', () => {
    const wrapper = shallow(
      <UU5.Forms.DateRangePicker
        id={"idText"}
        label="Enter valid time"
        placeholder="Valid time"
        value={["1.1.2019", "5.5.2020"]}
        required={true}
      />
    );
    expect(wrapper.instance().getLabel()).not.toBeNull();
    expect(wrapper.instance().getLabel()).not.toBeUndefined();
    expect(() => wrapper.instance().getLabel()).not.toThrow();
    expect(wrapper.instance().getLabel()).toEqual(expect.any(Object));
    expect(wrapper.instance().getLabel()).toBeInstanceOf(Object);
    expect(wrapper).toMatchSnapshot();

  });

  it('getInputWrapper(inpuid)', () => {
    const wrapper = shallow(
      <UU5.Forms.DateRangePicker
        id={"idText"}
        label="Enter valid time"
        placeholder="Valid time"
        value={["1.1.2019", "5.5.2020"]}
        required={true}
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


describe('UU5.Forms.TextInputMixin interface testing', () => {

  it('isTextInput() should return true', () => {
    const wrapper = shallow(
      <UU5.Forms.DateRangePicker
        id={"idText"}
        label="Enter valid time"
        placeholder="Valid time"
        value={["1.1.2019", "5.5.2020"]}
      />
    );
    expect(wrapper.instance().isTextInput()).toBeTruthy();
    expect(enzymeToJson(wrapper)).toMatchSnapshot();
  });

  it('getInput()', () => {
    const wrapper = mount(
      <UU5.Forms.DateRangePicker
        id={"idText"}
        label="Enter valid time"
        placeholder="Valid time"
        value={["1.1.2019", "5.5.2020"]}
      />
    );
    expect(wrapper.instance().getInput() === wrapper.find('.uu5-forms-daterangepicker-main-input').first().instance().findDOMNode()).toBeTruthy();
  });

  it('focus()', () => {
    const wrapper = shallow(
      <UU5.Forms.DateRangePicker
        id={"idText"}
        label="Enter valid time"
        placeholder="Valid time"
        value={["1.1.2019", "5.5.2020"]}
      />
    );
    expect(enzymeToJson(wrapper)).toMatchSnapshot();
    wrapper.instance().focus();
    wrapper.update();
    expect(enzymeToJson(wrapper)).toMatchSnapshot();
  });

  it('isValid()', () => {
    const wrapper = shallow(
      <UU5.Forms.DateRangePicker
        id={"idText"}
        label="Enter valid time"
        placeholder="Valid time"
        value={["1.1.2019", "5.5.2020"]}
        required={true}
      />
    );
    expect(wrapper.instance().isValid()).toBeTruthy();
    expect(enzymeToJson(wrapper)).toMatchSnapshot();
  });

  it('isValid() should return false', () => {
    const wrapper = shallow(
      <UU5.Forms.DateRangePicker
        id={"idText"}
        label="Enter valid time"
        placeholder="Valid time"
        required={true}
      />
    );
    expect(wrapper.instance().isValid()).toBeFalsy();
    expect(enzymeToJson(wrapper)).toMatchSnapshot();
  });

  it('open(setStateCallBack)', () => {
    const wrapper = mount(
      <UU5.Forms.DateRangePicker
        id={"idText"}
        label="Enter valid time"
        placeholder="Valid time"
        value={["1.1.2019", "5.5.2020"]}
        required={true}
      />
    );
    const mockFunc = jest.fn();
    expect(wrapper.instance().isOpen()).toBeFalsy();
    const returnValue = wrapper.instance().open(mockFunc);
    wrapper.update();
    expect(mockFunc).toBeCalled();
    expect(mockFunc).toHaveBeenCalledTimes(1);
    expect(returnValue).toBe(wrapper.instance());
    expect(wrapper.instance().isOpen()).toBeTruthy();
  });

  it('isOpen() should return false', () => {
    const wrapper = shallow(
      <UU5.Forms.DateRangePicker
        id={"idText"}
        label="Enter valid time"
        placeholder="Valid time"
        value={["1.1.2019", "5.5.2020"]}
        required={true}
      />
    );
    expect(wrapper.instance().isOpen()).toBeFalsy();
    expect(enzymeToJson(wrapper)).toMatchSnapshot();
  });

  it('getFocusFeedback()', () => {
    const focusMessage = "Message";
    const wrapper = mount(
      <UU5.Forms.DateRangePicker
        id={"idText"}
        label="Enter valid time"
        placeholder="Valid time"
        focusMessage={focusMessage}
        required={true}
      />
    );
    wrapper.instance().focus();
    wrapper.update();
    expect(wrapper.instance().getFocusFeedback({})).toEqual({feedback: "initial", value: null, message: focusMessage});
  });

  it('getBlurFeedback()', () => {
    const wrapper = shallow(
      <UU5.Forms.DateRangePicker
        id={"idText"}
        label="Enter valid time"
        placeholder="Valid time"
        required={true}
      />
    );
    expect(wrapper.instance().getBlurFeedback({})).toEqual(expect.objectContaining({
      feedback: 'initial',
      message: null,
      value: undefined
    }));
    expect(enzymeToJson(wrapper)).toMatchSnapshot();
  });

});


