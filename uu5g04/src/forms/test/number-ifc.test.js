/**
 * Copyright (C) 2021 Unicorn a.s.
 *
 * This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public
 * License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later
 * version.
 *
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied
 * warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License at
 * <https://gnu.org/licenses/> for more details.
 *
 * You may obtain additional information at <https://unicorn.com> or contact Unicorn a.s. at address: V Kapslovne 2767/2,
 * Praha 3, Czech Republic or at the email: info@unicorn.com.
 */

import UU5 from "uu5g04";
import "uu5g04-bricks";
import "uu5g04-forms";

const { mount } = UU5.Test.Tools;

describe("UU5.Forms.InputMixin interface testing", () => {
  it("isInput()", () => {
    const ref = UU5.Common.Reference.create();
    mount(<UU5.Forms.Number ref_={ref} min={0} max={300} step={1} required={false} />);
    expect(ref.current?.isInput()).toBeTruthy();
  });

  it("getValue() should return value", () => {
    const ref = UU5.Common.Reference.create();
    mount(<UU5.Forms.Number ref_={ref} value={100} min={0} max={300} step={1} required={false} />);
    expect(ref.current?.getValue()).toBe("100");
  });

  it("getValue() value is empty. Should return empty string.", () => {
    const ref = UU5.Common.Reference.create();
    mount(<UU5.Forms.Number ref_={ref} min={0} max={300} step={1} required={false} />);
    expect(ref.current?.getValue() ?? "").toBe("");
  });

  it("setValue(value,setStateCallBack)", () => {
    const ref = UU5.Common.Reference.create();
    mount(<UU5.Forms.Number ref_={ref} min={0} max={300} step={1} required={false} />);
    let mockFunc = jest.fn();
    let returnValue = ref.current?.setValue(100, mockFunc);
    expect(mockFunc).toHaveBeenCalledTimes(1);
    expect(returnValue === ref.current).toBe(true);
    expect(ref.current?.getValue()).toBe("100");

    mount(<UU5.Forms.Number ref_={ref} min={0} max={300} step={1} required={false} valueType="number" />);
    mockFunc = jest.fn();
    returnValue = ref.current?.setValue(200, mockFunc);
    expect(mockFunc).toHaveBeenCalledTimes(1);
    expect(returnValue === ref.current).toBe(true);
    expect(ref.current?.getValue()).toBe(200);
  });

  it("getMessage()", () => {
    const ref = UU5.Common.Reference.create();
    const wrapper = mount(<UU5.Forms.Number ref_={ref} min={0} max={300} step={1} required={false} />);
    expect(ref.current?.getMessage()).toBe(null);
    wrapper.setProps({ message: "New Setting message" });
    expect(ref.current?.getMessage()).toEqual("New Setting message");
  });

  it("setMessage(msg, setStateCallBack)", () => {
    const ref = UU5.Common.Reference.create();
    const wrapper = mount(<UU5.Forms.Number ref_={ref} min={0} max={300} step={1} required={false} />);
    const mockFunc = jest.fn();
    const returnValue = ref.current?.setMessage("New Message", mockFunc);
    wrapper.update();
    expect(mockFunc).toHaveBeenCalledTimes(1);
    expect(returnValue === ref.current).toBe(true);
    expect(ref.current?.getMessage()).toEqual("New Message");
  });

  it("getFeedBack()", () => {
    const ref = UU5.Common.Reference.create();
    const wrapper = mount(<UU5.Forms.Number ref_={ref} min={0} max={300} step={1} required={false} />);
    expect(ref.current?.getFeedback()).toEqual("initial");
    wrapper.setProps({ feedback: "success" });
    wrapper.update();
    expect(ref.current?.getFeedback()).toEqual("success");
  });

  it("setFeedBack(feedback, message, value, setStateCallBack)", () => {
    const ref = UU5.Common.Reference.create();
    const wrapper = mount(<UU5.Forms.Number ref_={ref} min={0} max={300} step={1} required={false} />);
    expect(ref.current?.getFeedback()).toEqual("initial");
    expect(ref.current?.getMessage()).toBe(null);
    expect(ref.current?.getValue() ?? "").toBe("");
    const mockFunc = jest.fn();
    const returnValue = ref.current?.setFeedback("success", "This is valid message.", 100, mockFunc);
    wrapper.update();
    expect(mockFunc).toHaveBeenCalledTimes(1);
    expect(returnValue === ref.current).toBe(true);
    expect(ref.current?.getFeedback()).toEqual("success");
    expect(ref.current?.getMessage()).toEqual("This is valid message.");
    expect(ref.current?.getValue()).toBe("100");
  });

  it("setInitial(msg, value, setStateCallBack)", () => {
    const ref = UU5.Common.Reference.create();
    const wrapper = mount(
      <UU5.Forms.Number
        ref_={ref}
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
    expect(ref.current?.getFeedback()).toEqual("error");
    expect(ref.current?.getValue() ?? "").toBe("");
    expect(ref.current?.getMessage()).toEqual("This input is required");
    expect(ref.current?.isInitial()).toBeFalsy();
    const returnValue = ref.current?.setInitial("Initial Message", 666, mockFunc);
    wrapper.update();
    expect(mockFunc).toHaveBeenCalledTimes(1);
    expect(returnValue === ref.current).toBe(true);
    expect(ref.current?.getFeedback()).toEqual("initial");
    expect(ref.current?.getValue()).toBe("666");
    expect(ref.current?.getMessage()).toEqual("Initial Message");
    expect(ref.current?.isInitial()).toBeTruthy();
  });

  it("isInitial()", () => {
    const ref = UU5.Common.Reference.create();
    const wrapper = mount(<UU5.Forms.Number ref_={ref} min={0} max={300} step={1} required={false} size="s" />);
    const mockFunc = jest.fn();
    expect(ref.current?.isInitial()).toBeTruthy();
    ref.current?.setFeedback("error", "Error messagess", "1000", mockFunc);
    wrapper.update();
    expect(ref.current?.isInitial()).toBeFalsy();
  });

  it("setLoading(message, value, setStateCallBack)", () => {
    const ref = UU5.Common.Reference.create();
    const wrapper = mount(<UU5.Forms.Number ref_={ref} min={0} max={300} step={1} required={false} size="s" />);
    const mockFunc = jest.fn();
    expect(ref.current?.getValue() ?? "").toBe("");
    expect(ref.current?.getMessage()).toBeNull();
    expect(ref.current?.isLoading()).toBeFalsy();
    const returnValue = ref.current?.setLoading("Loading messsagess", 100, mockFunc);
    wrapper.update();
    expect(mockFunc).toHaveBeenCalledTimes(1);
    expect(returnValue === ref.current).toBe(true);
    expect(ref.current?.isLoading()).toBeTruthy();
    expect(ref.current?.getMessage()).toEqual("Loading messsagess");
    expect(ref.current?.getValue()).toBe("100");
  });

  it("isLoading()", () => {
    const ref = UU5.Common.Reference.create();
    mount(<UU5.Forms.Number ref_={ref} min={0} max={300} step={1} required={false} size="s" />);
    expect(ref.current?.isLoading()).toBeFalsy();
  });

  it("setSuccess(message, value, setStateCallBack)", () => {
    const ref = UU5.Common.Reference.create();
    const wrapper = mount(<UU5.Forms.Number ref_={ref} min={0} max={300} step={1} required={false} size="s" />);
    const mockFunc = jest.fn();
    expect(ref.current?.getFeedback()).toEqual("initial");
    expect(ref.current?.getMessage()).toBeNull();
    expect(ref.current?.getValue() ?? "").toBe("");
    const returnValue = ref.current?.setSuccess("This is success message", 69, mockFunc);
    wrapper.update();
    expect(mockFunc).toHaveBeenCalledTimes(1);
    expect(returnValue === ref.current).toBe(true);
    expect(ref.current?.getFeedback()).toEqual("success");
    expect(ref.current?.getMessage()).toEqual("This is success message");
    expect(ref.current?.getValue()).toBe("69");
    expect(ref.current?.isSuccess()).toBeTruthy();
  });

  it("isSuccess()", () => {
    const ref = UU5.Common.Reference.create();
    const wrapper = mount(<UU5.Forms.Number ref_={ref} min={0} max={300} step={1} required={true} size="s" />);
    const mockFunc = jest.fn();
    expect(ref.current?.isSuccess()).toBeFalsy();
    const returnValue = ref.current?.setSuccess("This is success message", 100, mockFunc);
    wrapper.update();
    expect(mockFunc).toHaveBeenCalledTimes(1);
    expect(returnValue === ref.current).toBe(true);
    expect(ref.current?.getFeedback()).toEqual("success");
    expect(ref.current?.getMessage()).toEqual("This is success message");
    expect(ref.current?.getValue()).toEqual("100");
    expect(ref.current?.isSuccess()).toBeTruthy();
  });

  it("setWarning(message, value, setStateCallBack)", () => {
    const ref = UU5.Common.Reference.create();
    const wrapper = mount(<UU5.Forms.Number ref_={ref} min={0} max={300} step={1} required={false} size="s" />);
    const mockFunc = jest.fn();
    expect(ref.current?.getFeedback()).toEqual("initial");
    expect(ref.current?.getMessage()).toBeNull();
    expect(ref.current?.getValue() ?? "").toBe("");
    expect(ref.current?.isSuccess()).toBeFalsy();
    expect(ref.current?.isWarning()).toBeFalsy();
    const returnValue = ref.current?.setWarning("This is warning message", 100, mockFunc);
    wrapper.update();
    expect(mockFunc).toHaveBeenCalledTimes(1);
    expect(returnValue === ref.current).toBe(true);
    expect(ref.current?.getFeedback()).toEqual("warning");
    expect(ref.current?.getMessage()).toEqual("This is warning message");
    expect(ref.current?.getValue()).toBe("100");
    expect(ref.current?.isWarning()).toBeTruthy();
    expect(ref.current?.isSuccess()).toBeFalsy();
  });

  it("isWarning()", () => {
    const ref = UU5.Common.Reference.create();
    const wrapper = mount(
      <UU5.Forms.Number
        ref_={ref}
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
    expect(ref.current?.getFeedback()).toEqual("warning");
    expect(ref.current?.getMessage()).toEqual("Warning message");
    expect(ref.current?.isWarning()).toBeTruthy();
    const setRetVal = ref.current?.setFeedback("success", "success message", 100, mockFunc);
    wrapper.update();
    expect(mockFunc).toHaveBeenCalledTimes(1);
    expect(setRetVal === ref.current).toBe(true);
    expect(ref.current?.isWarning()).toBeFalsy();
  });

  it("setError(message, value, setStateCallBack)", () => {
    const ref = UU5.Common.Reference.create();
    const wrapper = mount(<UU5.Forms.Number ref_={ref} min={0} max={300} step={1} required={false} size="s" />);
    const mockFunc = jest.fn();
    expect(ref.current?.isError()).toBeFalsy();
    expect(ref.current?.isWarning()).toBeFalsy();
    expect(ref.current?.isSuccess()).toBeFalsy();
    expect(ref.current?.isInitial()).toBeTruthy();
    expect(ref.current?.getValue() ?? "").toBe("");
    expect(ref.current?.getFeedback()).toEqual("initial");
    expect(ref.current?.getMessage()).toBeNull();
    const returnValue = ref.current?.setError("This is error mesage", 100, mockFunc);
    wrapper.update();
    expect(mockFunc).toHaveBeenCalledTimes(1);
    expect(returnValue === ref.current).toBe(true);
    expect(ref.current?.isWarning()).toBeFalsy();
    expect(ref.current?.isSuccess()).toBeFalsy();
    expect(ref.current?.isInitial()).toBeFalsy();
    expect(ref.current?.isError()).toBeTruthy();
    expect(ref.current?.getValue()).toBe("100");
    expect(ref.current?.getFeedback()).toEqual("error");
    expect(ref.current?.getMessage()).toEqual("This is error mesage");
  });

  it("isError()", () => {
    const ref = UU5.Common.Reference.create();
    const wrapper = mount(
      <UU5.Forms.Number
        ref_={ref}
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
    expect(ref.current?.getFeedback()).toEqual("error");
    expect(ref.current?.getMessage()).toEqual("Error message");
    expect(ref.current?.isError()).toBeTruthy();
    const setRetVal = ref.current?.setFeedback("success", "success message", 100, mockFunc);
    wrapper.update();
    expect(mockFunc).toHaveBeenCalledTimes(1);
    expect(setRetVal === ref.current).toBe(true);
    expect(ref.current?.isError()).toBeFalsy();
  });

  it("reset(setStateCallBack)", () => {
    const ref = UU5.Common.Reference.create();
    const wrapper = mount(<UU5.Forms.Number ref_={ref} min={0} max={300} step={1} required={true} size="s" />);
    const mockFunc = jest.fn();
    const mockFunc2 = jest.fn();
    const mockFunc3 = jest.fn();
    ref.current?.setFeedback("success", "New Message", 100, mockFunc);
    wrapper.update();
    ref.current?.readOnly(mockFunc2);
    wrapper.update();
    expect(ref.current?.getFeedback()).toEqual("success");
    expect(ref.current?.getMessage()).toEqual("New Message");
    expect(ref.current?.getValue()).toBe("100");
    expect(ref.current?.isReadOnly()).toBeTruthy();
    expect(mockFunc).toHaveBeenCalledTimes(1);
    expect(mockFunc2).toHaveBeenCalledTimes(1);
    //Now we reset setting value.
    const returnValue = ref.current?.reset(mockFunc3);
    wrapper.update();
    expect(mockFunc3).toHaveBeenCalledTimes(1);
    expect(returnValue === ref.current).toBe(true);
    expect(ref.current?.getValue() ?? "").toBe("");
    expect(ref.current?.getFeedback()).toEqual("initial");
    expect(ref.current?.getMessage()).toBeNull();
    expect(ref.current?.isReadOnly()).toBeFalsy();
  });

  it("getChangeFeedback()", () => {
    const ref = UU5.Common.Reference.create();
    mount(<UU5.Forms.Number ref_={ref} min={0} max={300} step={1} required={true} size="s" />);
    expect(ref.current?.getChangeFeedback({})).toEqual(
      expect.objectContaining({
        feedback: "initial",
        message: null,
        value: "",
        foundAutocompleteItems: null,
        selectedIndex: null,
      })
    );
  });

  it("setChangeFeedback()", () => {
    const ref = UU5.Common.Reference.create();
    const wrapper = mount(<UU5.Forms.Number ref_={ref} min={0} max={300} step={1} required={true} size="s" />);
    const mockFunc = jest.fn();
    expect(ref.current?.getChangeFeedback({})).toEqual(
      expect.objectContaining({
        feedback: "initial",
        message: null,
        value: "",
        foundAutocompleteItems: null,
        selectedIndex: null,
      })
    );
    const returnValue = ref.current?.setChangeFeedback(
      {
        feedback: "error",
        message: "Error message from setChangeFeedback",
        value: "NaN",
      },
      mockFunc
    );
    wrapper.update();
    expect(returnValue === ref.current).toBe(true);
    expect(mockFunc).toBeCalled();
    expect(ref.current?.state.value).toMatch(/NaN/);
    expect(ref.current?.state.feedback).toEqual("error");
    expect(ref.current?.state.message).toEqual("Error message from setChangeFeedback");
  });

  it("isReadOnly()", () => {
    const ref = UU5.Common.Reference.create();
    const wrapper = mount(<UU5.Forms.Number ref_={ref} min={0} max={300} step={1} required={true} size="s" />);
    const mockFunc = jest.fn();
    expect(ref.current?.isReadOnly()).toBeFalsy();
    const returnValue = ref.current?.readOnly(mockFunc);
    wrapper.update();
    expect(mockFunc).toHaveBeenCalledTimes(1);
    expect(returnValue === ref.current).toBe(true);
    expect(ref.current?.isReadOnly()).toBeTruthy();
  });

  it("setEditableValue(true, setStateCallback)", () => {
    const ref = UU5.Common.Reference.create();
    const wrapper = mount(
      <UU5.Forms.Number
        ref_={ref}
        label="Number of items"
        min={0}
        max={300}
        step={1}
        value={100}
        required={true}
        size="s"
      />
    );
    const mockFunc1 = jest.fn();
    const mockFunc2 = jest.fn();
    expect(ref.current?.isReadOnly()).toBeFalsy();
    expect(ref.current?.editable(mockFunc1)).toBeTruthy();
    expect(mockFunc1).toHaveBeenCalledTimes(1);
    ref.current?.readOnly();
    wrapper.update();
    const returnValue = ref.current?.setEditableValue(true, mockFunc2);
    wrapper.update();
    expect(mockFunc2).toHaveBeenCalledTimes(1);
    expect(returnValue === ref.current).toBe(true);
    expect(ref.current?.isReadOnly()).toBeFalsy();
    expect(ref.current?.editable()).toBeTruthy();
  });

  it("setEditableValue(false, setStateCallback)", () => {
    const ref = UU5.Common.Reference.create();
    const wrapper = mount(
      <UU5.Forms.Number
        ref_={ref}
        label="Number of items"
        min={0}
        max={300}
        step={1}
        value={100}
        required={true}
        size="s"
      />
    );
    const mockFunc1 = jest.fn();
    const mockFunc2 = jest.fn();
    expect(ref.current?.isReadOnly()).toBeFalsy();
    expect(ref.current?.editable(mockFunc1)).toBeTruthy();
    expect(mockFunc1).toHaveBeenCalledTimes(1);
    ref.current?.readOnly();
    wrapper.update();
    const returnValue = ref.current?.setEditableValue(false, mockFunc2);
    wrapper.update();
    expect(mockFunc2).toHaveBeenCalledTimes(1);
    expect(returnValue === ref.current).toBe(true);
    expect(ref.current?.isReadOnly()).toBeTruthy();
  });

  it("readOnly(setStatecallback)", () => {
    const ref = UU5.Common.Reference.create();
    const wrapper = mount(
      <UU5.Forms.Number
        ref_={ref}
        label="Number of items"
        min={0}
        max={300}
        step={1}
        value={100}
        required={true}
        size="s"
      />
    );
    expect(ref.current?.isReadOnly()).toBeFalsy();
    const mockFunc = jest.fn();
    const returnValue = ref.current?.readOnly(mockFunc);
    wrapper.update();
    expect(mockFunc).toHaveBeenCalledTimes(1);
    expect(returnValue === ref.current).toBe(true);
    expect(ref.current?.isReadOnly()).toBeTruthy();
  });

  it("editable(setStatecallback)", () => {
    const ref = UU5.Common.Reference.create();
    const wrapper = mount(
      <UU5.Forms.Number
        ref_={ref}
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
    expect(ref.current?.isReadOnly()).toBeFalsy();
    ref.current?.readOnly();
    wrapper.update();
    expect(ref.current?.isReadOnly()).toBeTruthy();
    const returnValue = ref.current?.editable(mockFunc);
    wrapper.update();
    expect(mockFunc).toHaveBeenCalledTimes(1);
    expect(returnValue === ref.current).toBe(true);
    expect(ref.current?.isReadOnly()).toBeFalsy();
  });

  it("getLabel(idinput)", () => {
    const ref = UU5.Common.Reference.create();
    mount(
      <UU5.Forms.Number
        ref_={ref}
        label="Number of items"
        min={0}
        max={300}
        step={1}
        value={100}
        required={true}
        size="s"
      />
    );
    expect(ref.current?.getLabel()).not.toBeNull();
    expect(ref.current?.getLabel()).not.toBeUndefined();
    expect(ref.current?.getLabel()).toEqual(expect.any(Object));
    expect(ref.current?.getLabel()).toBeInstanceOf(Object);
  });

  it("getInputWrapper(inpuid)", () => {
    const ref = UU5.Common.Reference.create();
    const wrapper = mount(
      <UU5.Forms.Number
        ref_={ref}
        label="Number of items"
        min={0}
        max={300}
        step={1}
        value={100}
        required={true}
        size="s"
      />
    );
    expect(ref.current?.getInputWrapper()).not.toBeNull();
    expect(ref.current?.getInputWrapper()).not.toBeUndefined();
    expect(ref.current?.getInputWrapper()).toEqual(expect.any(Object));
    expect(ref.current?.getInputWrapper()).toBeInstanceOf(Object);
  });
});

describe("UU5.Forms.TextInputMixin interface testing", () => {
  it("isTextInput() should return true", () => {
    const ref = UU5.Common.Reference.create();
    mount(<UU5.Forms.Number ref_={ref} min={0} max={300} step={1} value={100} size="s" />);
    expect(ref.current?.isTextInput()).toBeTruthy();
  });

  it("getInput()", () => {
    const ref = UU5.Common.Reference.create();
    const wrapper = mount(<UU5.Forms.Number ref_={ref} min={0} max={300} step={1} value={100} size="s" />);
    expect(ref.current?.getInput()).toBe(wrapper.find("text-input").instance());
    expect(ref.current?.getInput()).toEqual(expect.any(Object));
    expect(ref.current?.getInput()).toBeInstanceOf(Object);
    expect(ref.current?.getInput()).not.toBe(undefined);
  });

  it("focus()", () => {
    const ref = UU5.Common.Reference.create();
    mount(<UU5.Forms.Number ref_={ref} min={0} max={300} step={1} value={100} size="s" />);
    ref.current?.focus();
  });

  it("isValid()", () => {
    const ref = UU5.Common.Reference.create();
    mount(
      <UU5.Forms.Number
        ref_={ref}
        label="Number of items"
        min={0}
        max={300}
        step={1}
        value={100}
        required={true}
        size="s"
      />
    );
    expect(ref.current?.isValid()).toBeTruthy();
  });

  it("isValid() should return false", () => {
    const ref = UU5.Common.Reference.create();
    mount(<UU5.Forms.Number ref_={ref} min={0} max={300} step={1} required={true} size="s" />);
    expect(ref.current?.isValid()).toBeFalsy();
  });

  it("getFocusFeedback()", () => {
    const ref = UU5.Common.Reference.create();
    const focusMessage = "Message";
    const wrapper = mount(
      <UU5.Forms.Number
        ref_={ref}
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
    ref.current?.focus();
    wrapper.update();
    expect(ref.current?.getFocusFeedback({})).toEqual({ feedback: "initial", value: "0", message: focusMessage });
  });

  it("getBlurFeedback()", () => {
    const ref = UU5.Common.Reference.create();
    mount(<UU5.Forms.Number ref_={ref} min={0} max={300} step={10} required={true} size="s" />);
    expect(ref.current?.getBlurFeedback({})).toEqual(
      expect.objectContaining({
        feedback: "initial",
        message: null,
      })
    );
  });

  it("setAutocompleteItems(items,opt,setStateCallBack)", () => {
    const ref = UU5.Common.Reference.create();
    const wrapper = mount(
      <UU5.Forms.Number
        ref_={ref}
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
    expect(ref.current?.state.autocompleteItems).toBe(null);
    const returnValue = ref.current?.setAutoCompleteItems(
      [
        {
          value: 10,
        },
        {
          value: 20,
        },
        {
          value: 30,
        },
        {
          value: 40,
        },
      ],
      null,
      mockFunc
    );
    wrapper.update();
    expect(ref.current?.state.autocompleteItems).not.toBe(null);
    expect(ref.current?.state.autocompleteItems).toEqual(
      expect.arrayContaining([{ value: 10 }, { value: 20 }, { value: 30 }, { value: 40 }])
    );
    expect(mockFunc).toHaveBeenCalledTimes(1);
    expect(returnValue === ref.current).toBe(true);
  });
});
