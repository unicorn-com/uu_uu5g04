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

describe('UU5.Forms.InputMixin interface testing', () => {

  it('isInput()', () => {
    const wrapper = shallow(
      <UU5.Forms.Number
        id={"idText"}
        label="Number of items"
        min={0}
        max={300}
        step={1}
        required={false}
      />
    );
    expect(wrapper.instance().isInput()).toBeTruthy();
    expect(enzymeToJson(wrapper)).toMatchSnapshot();
  });

  it('getValue() should return value', () => {
    const wrapper = shallow(
      <UU5.Forms.Number
        id={"idText"}
        label="Number of items"
        value={100}
        min={0}
        max={300}
        step={1}
        required={false}
      />
    );
    expect(wrapper.instance().getValue()).toBe("100");
    expect(enzymeToJson(wrapper)).toMatchSnapshot();
  });

  it('getValue() value is empty. Should return empty string.', () => {
    const wrapper = shallow(
      <UU5.Forms.Number
        id={"idText"}
        label="Number of items"
        min={0}
        max={300}
        step={1}
        required={false}
      />
    );
    expect(wrapper.instance().getValue()).toBe(null);
    expect(enzymeToJson(wrapper)).toMatchSnapshot();
  });

  it('setValue(value,setStateCallBack)', () => {
    const wrapper = shallow(
      <UU5.Forms.Number
        id={"idText"}
        label="Number of items"
        min={0}
        max={300}
        step={1}
        required={false}
      />
    );
    expect(wrapper.instance().getValue()).toBeNull();
    const mockFunc = jest.fn();
    expect(enzymeToJson(wrapper)).toMatchSnapshot();
    const returnValue = wrapper.instance().setValue(100, mockFunc);
    wrapper.update();
    expect(mockFunc).toBeCalled();
    expect(mockFunc).toHaveBeenCalledTimes(1);
    expect(returnValue).toBe(wrapper.instance());
    expect(wrapper.instance().getValue()).toBe(100);
    expect(enzymeToJson(wrapper)).toMatchSnapshot();
  });

  it('getMessage()', () => {
    const wrapper = shallow(
      <UU5.Forms.Number
        id={"idText"}
        label="Number of items"
        min={0}
        max={300}
        step={1}
        required={false}
      />
    );
    expect(wrapper.instance().getMessage()).toBe(null);
    expect(enzymeToJson(wrapper)).toMatchSnapshot();
    wrapper.setProps({message: "New Setting message"});
    expect(wrapper.instance().getMessage()).toEqual("New Setting message");
  });

  it('setMessage(msg, setStateCallBack)', () => {
    const wrapper = shallow(
      <UU5.Forms.Number
        id={"idText"}
        label="Number of items"
        min={0}
        max={300}
        step={1}
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
    expect(wrapper.instance().getMessage()).toEqual("New Message");
    expect(enzymeToJson(wrapper)).toMatchSnapshot();
  });

  it('getFeedBack()', () => {
    const wrapper = shallow(
      <UU5.Forms.Number
        id={"idText"}
        label="Number of items"
        min={0}
        max={300}
        step={1}
        required={false}
      />
    );
    expect(wrapper.instance().getFeedback()).toEqual("initial");
    expect(enzymeToJson(wrapper)).toMatchSnapshot();
    wrapper.setProps({feedback: "success"});
    wrapper.update();
    expect(wrapper.instance().getFeedback()).toEqual("success");
    expect(enzymeToJson(wrapper)).toMatchSnapshot();
  });

  it('setFeedBack(feedback, message, value, setStateCallBack)', () => {
    const wrapper = shallow(
      <UU5.Forms.Number
        id={"idText"}
        label="Number of items"
        min={0}
        max={300}
        step={1}
        required={false}
      />
    );
    expect(wrapper.instance().getFeedback()).toEqual("initial");
    expect(wrapper.instance().getMessage()).toBe(null);
    expect(wrapper.instance().getValue()).toBeNull();
    const mockFunc = jest.fn();
    expect(enzymeToJson(wrapper)).toMatchSnapshot();
    const returnValue = wrapper.instance().setFeedback("success", "This is valid message.", 100, mockFunc);
    wrapper.update();
    expect(mockFunc).toBeCalled();
    expect(mockFunc).toHaveBeenCalledTimes(1);
    expect(returnValue).toBe(wrapper.instance());
    expect(wrapper.instance().getFeedback()).toEqual("success");
    expect(wrapper.instance().getMessage()).toEqual("This is valid message.");
    expect(wrapper.instance().getValue()).toBe(100);
    expect(enzymeToJson(wrapper)).toMatchSnapshot();
  });

  it('setInitial(msg, value, setStateCallBack)', () => {
    const wrapper = shallow(
      <UU5.Forms.Number
        id={"idText"}
        label="Number of items"
        min={0}
        max={700}
        step={1}
        message={"This input is required"}
        feedback={"error"}
        required={true}
        size="s"
      />
    );
    const mockFunc = jest.fn();
    expect(enzymeToJson(wrapper)).toMatchSnapshot();
    expect(wrapper.instance().getFeedback()).toEqual("error");
    expect(wrapper.instance().getValue()).toBeNull();
    expect(wrapper.instance().getMessage()).toEqual("This input is required")
    expect(wrapper.instance().isInitial()).toBeFalsy();
    const returnValue = wrapper.instance().setInitial("Initial Message", 666, mockFunc);
    wrapper.update();
    expect(mockFunc).toBeCalled();
    expect(mockFunc).toHaveBeenCalledTimes(1);
    expect(returnValue).toBe(wrapper.instance());
    expect(wrapper.instance().getFeedback()).toEqual("initial");
    expect(wrapper.instance().getValue()).toBe(666);
    expect(wrapper.instance().getMessage()).toEqual("Initial Message")
    expect(wrapper.instance().isInitial()).toBeTruthy();
    expect(enzymeToJson(wrapper)).toMatchSnapshot();
  });

  it('isInitial()', () => {
    const wrapper = shallow(
      <UU5.Forms.Number
        id={"idText"}
        label="Number of items"
        min={0}
        max={300}
        step={1}
        required={false}
        size="s"
      />
    );
    const mockFunc = jest.fn();
    expect(wrapper.instance().isInitial()).toBeTruthy();
    expect(enzymeToJson(wrapper)).toMatchSnapshot();
    wrapper.instance().setFeedback("error", "Error messagess", "1000", mockFunc);
    wrapper.update();
    expect(wrapper.instance().isInitial()).toBeFalsy();
    expect(enzymeToJson(wrapper)).toMatchSnapshot();
  });

  it('setLoading(message, value, setStateCallBack)', () => {
    const wrapper = shallow(
      <UU5.Forms.Number
        id={"idText"}
        label="Number of items"
        min={0}
        max={300}
        step={1}
        required={false}
        size="s"
      />
    );
    const mockFunc = jest.fn();
    expect(enzymeToJson(wrapper)).toMatchSnapshot();
    expect(wrapper.instance().getValue()).toBeNull();
    expect(wrapper.instance().getMessage()).toBeNull();
    expect(wrapper.instance().isLoading()).toBeFalsy();
    const returnValue = wrapper.instance().setLoading("Loading messsagess", 100, mockFunc);
    wrapper.update();
    expect(mockFunc).toBeCalled();
    expect(mockFunc).toHaveBeenCalledTimes(1);
    expect(returnValue).toBe(wrapper.instance());
    expect(wrapper.instance().isLoading()).toBeTruthy();
    expect(wrapper.instance().getMessage()).toEqual("Loading messsagess");
    expect(wrapper.instance().getValue()).toBe(100);
    expect(enzymeToJson(wrapper)).toMatchSnapshot();
  });

  it('isLoading()', () => {
    const wrapper = shallow(
      <UU5.Forms.Number
        id={"idText"}
        label="Number of items"
        min={0}
        max={300}
        step={1}
        required={false}
        size="s"
      />
    );
    expect(wrapper.instance().isLoading()).toBeFalsy();
    expect(enzymeToJson(wrapper)).toMatchSnapshot();
  });

  it('setSuccess(message, value, setStateCallBack)', () => {
    const wrapper = shallow(
      <UU5.Forms.Number
        id={"idText"}
        label="Number of items"
        min={0}
        max={300}
        step={1}
        required={false}
        size="s"
      />
    );
    const mockFunc = jest.fn();
    expect(wrapper.instance().getFeedback()).toEqual("initial");
    expect(wrapper.instance().getMessage()).toBeNull();
    expect(wrapper.instance().getValue()).toBeNull();
    expect(enzymeToJson(wrapper)).toMatchSnapshot();
    const returnValue = wrapper.instance().setSuccess("This is success message", 69, mockFunc);
    wrapper.update();
    expect(mockFunc).toBeCalled();
    expect(mockFunc).toHaveBeenCalledTimes(1);
    expect(returnValue).toBe(wrapper.instance());
    expect(wrapper.instance().getFeedback()).toEqual("success");
    expect(wrapper.instance().getMessage()).toEqual("This is success message")
    expect(wrapper.instance().getValue()).toBe(69);
    expect(wrapper.instance().isSuccess()).toBeTruthy();
    expect(enzymeToJson(wrapper)).toMatchSnapshot();
  });

  it('isSuccess() fisr return false, second return true', () => {
    const wrapper = shallow(
      <UU5.Forms.Number
        id={"idText"}
        label="Number of items"
        min={0}
        max={300}
        step={1}
        required={true}
        size="s"
      />
    );
    const mockFunc = jest.fn();
    expect(wrapper.instance().isSuccess()).toBeFalsy();
    const returnValue = wrapper.instance().setSuccess("This is success message", 100, mockFunc);
    wrapper.update();
    expect(mockFunc).toBeCalled();
    expect(mockFunc).toHaveBeenCalledTimes(1);
    expect(returnValue).toBe(wrapper.instance());
    expect(wrapper.instance().getFeedback()).toEqual("success");
    expect(wrapper.instance().getMessage()).toEqual("This is success message")
    expect(wrapper.instance().getValue()).toEqual(100);
    expect(wrapper.instance().isSuccess()).toBeTruthy();
    expect(enzymeToJson(wrapper)).toMatchSnapshot();
  });

  it('setWarning(message, value, setStateCallBack)', () => {
    const wrapper = shallow(
      <UU5.Forms.Number
        id={"idText"}
        label="Number of items"
        min={0}
        max={300}
        step={1}
        required={false}
        size="s"
      />
    );
    const mockFunc = jest.fn();
    expect(wrapper.instance().getFeedback()).toEqual("initial");
    expect(wrapper.instance().getMessage()).toBeNull();
    expect(wrapper.instance().getValue()).toBeNull();
    expect(enzymeToJson(wrapper)).toMatchSnapshot();
    expect(wrapper.instance().isSuccess()).toBeFalsy();
    expect(wrapper.instance().isWarning()).toBeFalsy();
    const returnValue = wrapper.instance().setWarning("This is warning message", 100, mockFunc);
    wrapper.update();
    expect(mockFunc).toBeCalled();
    expect(mockFunc).toHaveBeenCalledTimes(1);
    expect(returnValue).toBe(wrapper.instance());
    expect(wrapper.instance().getFeedback()).toEqual("warning");
    expect(wrapper.instance().getMessage()).toEqual("This is warning message")
    expect(wrapper.instance().getValue()).toBe(100);
    expect(wrapper.instance().isWarning()).toBeTruthy();
    expect(wrapper.instance().isSuccess()).toBeFalsy();
    expect(enzymeToJson(wrapper)).toMatchSnapshot();
  });


  it('isWarning()', () => {
    const wrapper = shallow(
      <UU5.Forms.Number
        id={"idText"}
        label="Number of items"
        min={0}
        max={300}
        step={1}
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
    expect(enzymeToJson(wrapper)).toMatchSnapshot();
    const setRetVal = wrapper.instance().setFeedback("success", "success message", 100, mockFunc);
    wrapper.update();
    expect(mockFunc).toBeCalled();
    expect(setRetVal).toBe(wrapper.instance());
    expect(wrapper.instance().isWarning()).toBeFalsy();
    expect(enzymeToJson(wrapper)).toMatchSnapshot();
  });

  it('setError(message, value, setStateCallBack)', () => {
    const wrapper = shallow(
      <UU5.Forms.Number
        id={"idText"}
        label="Number of items"
        min={0}
        max={300}
        step={1}
        required={false}
        size="s"
      />
    );
    const mockFunc = jest.fn();
    expect(wrapper.instance().isError()).toBeFalsy();
    expect(wrapper.instance().isWarning()).toBeFalsy();
    expect(wrapper.instance().isSuccess()).toBeFalsy();
    expect(wrapper.instance().isInitial()).toBeTruthy();
    expect(wrapper.instance().getValue()).toBeNull();
    expect(wrapper.instance().getFeedback()).toEqual("initial");
    expect(wrapper.instance().getMessage()).toBeNull();
    expect(enzymeToJson(wrapper)).toMatchSnapshot();
    const returnValue = wrapper.instance().setError("This is error mesage", 100, mockFunc);
    wrapper.update();
    expect(mockFunc).toBeCalled();
    expect(mockFunc).toHaveBeenCalledTimes(1);
    expect(returnValue).toBe(wrapper.instance());
    expect(wrapper.instance().isWarning()).toBeFalsy();
    expect(wrapper.instance().isSuccess()).toBeFalsy();
    expect(wrapper.instance().isInitial()).toBeFalsy;
    expect(wrapper.instance().isError()).toBeTruthy();
    expect(wrapper.instance().getValue()).toBe(100);
    expect(wrapper.instance().getFeedback()).toEqual("error");
    expect(wrapper.instance().getMessage()).toEqual("This is error mesage");
    expect(enzymeToJson(wrapper)).toMatchSnapshot();
  });


  it('isError()', () => {
    const wrapper = shallow(
      <UU5.Forms.Number
        id={"idText"}
        label="Number of items"
        min={0}
        max={300}
        step={1}
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
    expect(enzymeToJson(wrapper)).toMatchSnapshot();
    const setRetVal = wrapper.instance().setFeedback("success", "success message", 100, mockFunc);
    wrapper.update();
    expect(mockFunc).toBeCalled();
    expect(setRetVal).toBe(wrapper.instance());
    expect(wrapper.instance().isError()).toBeFalsy();
    expect(enzymeToJson(wrapper)).toMatchSnapshot();
  });

  it('reset(setStateCallBack)', () => {
    const wrapper = shallow(
      <UU5.Forms.Number
        id={"idText"}
        label="Number of items"
        min={0}
        max={300}
        step={1}
        required={true}
        size="s"
      />
    );
    const mockFunc = jest.fn();
    wrapper.instance().setFeedback("success", "New Message", 100, mockFunc);
    wrapper.update();
    wrapper.instance().readOnly(mockFunc);
    wrapper.update();
    expect(wrapper.instance().getFeedback()).toEqual("success");
    expect(wrapper.instance().getMessage()).toEqual("New Message");
    expect(wrapper.instance().getValue()).toBe(100);
    expect(wrapper.instance().isReadOnly()).toBeTruthy();
    expect(mockFunc).toBeCalled();
    expect(enzymeToJson(wrapper)).toMatchSnapshot();
    //Now we reset setting value.
    const returnValue = wrapper.instance().reset(mockFunc);
    wrapper.update();
    expect(mockFunc).toBeCalled();
    expect(mockFunc).toHaveBeenCalledTimes(3);
    expect(returnValue).toBe(wrapper.instance());
    expect(wrapper.instance().getValue()).toBeNull();
    expect(wrapper.instance().getFeedback()).toEqual("initial");
    expect(wrapper.instance().getMessage()).toBeNull();
    expect(wrapper.instance().isReadOnly()).toBeFalsy();
    expect(enzymeToJson(wrapper)).toMatchSnapshot();
  });

  it('getChangeFeedback()', () => {
    const wrapper = shallow(
      <UU5.Forms.Number
        id={"idText"}
        label="Number of items"
        min={0}
        max={300}
        step={1}
        required={true}
        size="s"
      />
    );
    expect(wrapper.instance().getChangeFeedback({})).toEqual(expect.objectContaining(
      {
        feedback: 'initial',
        message: null,
        value: null,
        foundAutocompleteItems: null,
        selectedIndex: null
      }
    ));
    expect(enzymeToJson(wrapper)).toMatchSnapshot();
  });

  it('setChangeFeedback()', () => {
    const wrapper = shallow(
      <UU5.Forms.Number
        id={"idText"}
        label="Number of items"
        min={0}
        max={300}
        step={1}
        required={true}
        size="s"
      />
    );
    const mockFunc = jest.fn();
    expect(wrapper.instance().getChangeFeedback({})).toEqual(expect.objectContaining(
      {
        feedback: 'initial',
        message: null,
        value: null,
        foundAutocompleteItems: null,
        selectedIndex: null
      }
    ));
    const returnValue = wrapper.instance().setChangeFeedback({
      feedback: 'error',
      message: 'Error message from setChangeFeedback',
      value: 'NaN'
    }, mockFunc);
    wrapper.update();
    expect(returnValue).toBe(wrapper.instance());
    expect(mockFunc).toBeCalled();
    expect(wrapper.instance().state.value).toMatch(/NaN/);
    expect(wrapper.instance().state.feedback).toEqual("error");
    expect(wrapper.instance().state.message).toEqual("Error message from setChangeFeedback");
    expect(enzymeToJson(wrapper)).toMatchSnapshot();

  });


  it('isReadOnly()', () => {
    const wrapper = shallow(
      <UU5.Forms.Number
        id={"idText"}
        label="Number of items"
        min={0}
        max={300}
        step={1}
        required={true}
        size="s"
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
      <UU5.Forms.Number
        id={"idText"}
        label="Number of items"
        min={0}
        max={300}
        step={1}
        value={100}
        required={true}
        size="s"
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
      <UU5.Forms.Number
        id={"idText"}
        label="Number of items"
        min={0}
        max={300}
        step={1}
        value={100}
        required={true}
        size="s"
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
      <UU5.Forms.Number
        id={"idText"}
        label="Number of items"
        min={0}
        max={300}
        step={1}
        value={100}
        required={true}
        size="s"
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
      <UU5.Forms.Number
        id={"idText"}
        label="Number of items"
        min={0}
        max={300}
        step={1}
        value={100}
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
      <UU5.Forms.Number
        id={"idText"}
        label="Number of items"
        min={0}
        max={300}
        step={1}
        value={100}
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

  it('getInputWrapper(inpuid)', () => {
    const wrapper = shallow(
      <UU5.Forms.Number
        id={"idText"}
        label="Number of items"
        min={0}
        max={300}
        step={1}
        value={100}
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



describe('UU5.Forms.TextInputMixin interface testing', () => {

  it('isTextInput() should return true', () => {
    const wrapper = shallow(
      <UU5.Forms.Number
        id={"idText"}
        label="Number of items"
        min={0}
        max={300}
        step={1}
        value={100}
        size="s"
      />
    );
    expect(wrapper.instance().isTextInput()).toBeTruthy();
    expect(enzymeToJson(wrapper)).toMatchSnapshot();
  });

  it('getInput()', () => {
    const wrapper = mount(
      <UU5.Forms.Number
        id={"idText"}
        label="Number of items"
        min={0}
        max={300}
        step={1}
        value={100}
        size="s"
      />
    );
    expect(wrapper.instance().getInput()).toBe(wrapper.find('text-input').instance());
    expect(wrapper.instance().getInput()).toEqual(expect.any(Object));
    expect(wrapper.instance().getInput()).toBeInstanceOf(Object);
    expect(wrapper.instance().getInput()).not.toBe(undefined);
  });

  it('focus()', () => {
    const wrapper = shallow(
      <UU5.Forms.Number
        id={"idText"}
        label="Number of items"
        min={0}
        max={300}
        step={1}
        value={100}
        size="s"
      />
    );
    expect(enzymeToJson(wrapper)).toMatchSnapshot();
    wrapper.instance().focus();
    wrapper.update();
    expect(enzymeToJson(wrapper)).toMatchSnapshot();
  });

  it('isValid()', () => {
    const wrapper = shallow(
      <UU5.Forms.Number
        id={"idText"}
        label="Number of items"
        min={0}
        max={300}
        step={1}
        value={100}
        required={true}
        size="s"
      />
    );
    expect(wrapper.instance().isValid()).toBeTruthy();
    expect(enzymeToJson(wrapper)).toMatchSnapshot();
  });

  it('isValid() should return false', () => {
    const wrapper = shallow(
      <UU5.Forms.Number
        id={"idText"}
        label="Number of items"
        min={0}
        max={300}
        step={1}
        required={true}
        size="s"
      />
    );
    expect(wrapper.instance().isValid()).toBeFalsy();
    expect(enzymeToJson(wrapper)).toMatchSnapshot();
  });


  it('getFocusFeedback()', () => {
    const focusMessage = "Message";
    const wrapper = shallow(
      <UU5.Forms.Number
        id={"idText"}
        label="Number of items"
        focusMessage={focusMessage}
        value={0}
        min={0}
        max={300}
        step={10}
        required={true}
        size="s"
      />
    );
    expect(enzymeToJson(wrapper)).toMatchSnapshot();
    wrapper.instance().focus();
    wrapper.update();
    expect(wrapper.instance().getFocusFeedback({})).toEqual({ feedback: "initial", value: 0, message: focusMessage });
    expect(enzymeToJson(wrapper)).toMatchSnapshot();
  });

  it('getBlurFeedback()', () => {
    const wrapper = shallow(
      <UU5.Forms.Number
        id={"idText"}
        label="Number of items"
        min={0}
        max={300}
        step={10}
        required={true}
        size="s"
      />
    );
    expect(wrapper.instance().getBlurFeedback({})).toEqual(expect.objectContaining(
      {
        feedback: 'initial',
        message: null,
        value: undefined
      }
    ));
    expect(enzymeToJson(wrapper)).toMatchSnapshot();
  });


   it('setAutocompleteItems(items,opt,setStateCallBack)', () => {
    const wrapper = shallow(
      <UU5.Forms.Number
        id={"idText"}
        label="Number of items"
        min={0}
        max={300}
        step={10}
        multiple
        required={false}
        size="s"
      />
    );
    const mockFunc = jest.fn();
    expect(enzymeToJson(wrapper)).toMatchSnapshot();
    expect(wrapper.instance().state.autocompleteItems).toBe(null);
    const returnValue = wrapper.instance().setAutoCompleteItems(
      [{
        value: 10
      }, {
        value: 20
      }, {
        value: 30
      }, {
        value: 40
      }]
      , null, mockFunc)
    wrapper.update();
    expect(wrapper.instance().state.autocompleteItems).not.toBe(null);
    expect(wrapper.instance().state.autocompleteItems).toEqual(expect.arrayContaining(
      [ {value: 10},
        {value: 20},
        {value: 30},
        {value: 40}]
    ));
    expect(mockFunc).toBeCalled();
    expect(mockFunc).toHaveBeenCalledTimes(1);
    expect(returnValue).toBe(wrapper.instance());
    expect(enzymeToJson(wrapper)).toMatchSnapshot();
  });

});
