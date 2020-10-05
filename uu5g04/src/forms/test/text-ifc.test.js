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

const MyTextComponent = UU5.Common.VisualComponent.create({
  mixins: [UU5.Common.BaseMixin],

  render() {
    return (
      <UU5.Forms.Text
        id={"idText"}
        label="Full name"
        placeholder="John Smith"
        value="My Value"
        required={false}
        size="s"
      />
    );
  },
});

describe("UU5.Forms.InputMinxin interface", () => {
  it("isInput()", () => {
    const wrapper = shallow(
      <UU5.Forms.Text id={"idText"} label="Full name" placeholder="John Smith" value="" required={false} size="s" />
    );
    expect(wrapper.instance().isInput()).toBeTruthy();
    expect(wrapper).toMatchSnapshot();
  });

  it("getValue() should return value", () => {
    const wrapper = shallow(
      <UU5.Forms.Text
        id={"idText"}
        label="Full name"
        placeholder="John Smith"
        value="My Value"
        required={false}
        size="s"
      />
    );
    expect(wrapper.instance().getValue()).toMatch(/My Value/);
    expect(wrapper).toMatchSnapshot();
  });

  it("getValue() value is empty. Should return empty string.", () => {
    const wrapper = shallow(
      <UU5.Forms.Text id={"idText"} label="Full name" placeholder="John Smith" value="" required={false} size="s" />
    );
    expect(wrapper.instance().getValue()).toEqual("");
    expect(wrapper).toMatchSnapshot();
  });

  it("setValue(value,setStateCallBack)", () => {
    const wrapper = shallow(
      <UU5.Forms.Text id={"idText"} label="Full name" placeholder="John Smith" value="" required={false} size="s" />
    );
    expect(wrapper.instance().getValue()).toEqual("");
    const mockFunc = jest.fn();
    expect(wrapper).toMatchSnapshot();
    const returnValue = wrapper.instance().setValue("My New Set Value", mockFunc);
    wrapper.update();
    expect(mockFunc).toBeCalled();
    expect(mockFunc).toHaveBeenCalledTimes(1);
    expect(returnValue === wrapper.instance()).toBe(true);
    expect(wrapper.instance().getValue()).toMatch(/My New Set Value/);
    expect(wrapper).toMatchSnapshot();
  });

  it("getMessage()", () => {
    const wrapper = shallow(
      <UU5.Forms.Text id={"idText"} label="Full name" placeholder="John Smith" value="" required={false} size="s" />
    );
    expect(wrapper.instance().getMessage()).toBe(null);
    expect(wrapper).toMatchSnapshot();
    wrapper.setProps({ message: "New Setting message" });
    expect(wrapper.instance().getMessage()).toEqual("New Setting message");
  });

  it("setMessage(msg, setStateCallBack)", () => {
    const wrapper = shallow(
      <UU5.Forms.Text id={"idText"} label="Full name" placeholder="John Smith" value="" required={false} size="s" />
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
      <UU5.Forms.Text id={"idText"} label="Full name" placeholder="John Smith" value="" required={false} size="s" />
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
      <UU5.Forms.Text id={"idText"} label="Full name" placeholder="John Smith" value="" required={false} size="s" />
    );
    expect(wrapper.instance().getFeedback()).toEqual("initial");
    expect(wrapper.instance().getMessage()).toBe(null);
    expect(wrapper.instance().getValue()).toEqual("");
    const mockFunc = jest.fn();
    expect(wrapper).toMatchSnapshot();
    const returnValue = wrapper
      .instance()
      .setFeedback("success", "This is valid message.", "This is valid value", mockFunc);
    wrapper.update();
    expect(mockFunc).toBeCalled();
    expect(mockFunc).toHaveBeenCalledTimes(1);
    expect(returnValue === wrapper.instance()).toBe(true);
    expect(wrapper.instance().getFeedback()).toEqual("success");
    expect(wrapper.instance().getMessage()).toEqual("This is valid message.");
    expect(wrapper.instance().getValue()).toEqual("This is valid value");
    expect(wrapper).toMatchSnapshot();
  });

  it("setInitial(msg, value, setStateCallBack)", () => {
    const wrapper = shallow(
      <UU5.Forms.Text
        id={"idText"}
        label="Full name"
        placeholder="John Smith"
        value=""
        message={"This input is required"}
        feedback={"error"}
        required={true}
        size="s"
      />
    );
    const mockFunc = jest.fn();
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.instance().getFeedback()).toEqual("error");
    expect(wrapper.instance().getValue()).toEqual("");
    expect(wrapper.instance().getMessage()).toEqual("This input is required");
    expect(wrapper.instance().isInitial()).toBeFalsy();
    const returnValue = wrapper.instance().setInitial("Initial Message", "", mockFunc);
    wrapper.update();
    expect(mockFunc).toBeCalled();
    expect(mockFunc).toHaveBeenCalledTimes(1);
    expect(returnValue === wrapper.instance()).toBe(true);
    expect(wrapper.instance().getFeedback()).toEqual("initial");
    expect(wrapper.instance().getValue()).toEqual("");
    expect(wrapper.instance().getMessage()).toEqual("Initial Message");
    expect(wrapper.instance().isInitial()).toBeTruthy();
    expect(wrapper).toMatchSnapshot();
  });

  it("isInitial()", () => {
    const wrapper = shallow(
      <UU5.Forms.Text id={"idText"} label="Full name" placeholder="John Smith" value="" required={false} size="s" />
    );
    const mockFunc = jest.fn();
    expect(wrapper.instance().isInitial()).toBeTruthy();
    expect(wrapper).toMatchSnapshot();
    wrapper.instance().setFeedback("error", "Error messagess", "", mockFunc);
    wrapper.update();
    expect(wrapper.instance().isInitial()).toBeFalsy();
    expect(wrapper).toMatchSnapshot();
  });

  it("setLoading(message, value, setStateCallBack)", () => {
    const wrapper = shallow(
      <UU5.Forms.Text id={"idText"} label="Full name" placeholder="John Smith" value="" required={false} size="s" />
    );
    const mockFunc = jest.fn();
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.instance().getValue()).toEqual("");
    expect(wrapper.instance().getMessage()).toBeNull();
    expect(wrapper.instance().isLoading()).toBeFalsy();
    const returnValue = wrapper.instance().setLoading("Loading messsagess", "Value is loaded", mockFunc);
    wrapper.update();
    expect(mockFunc).toBeCalled();
    expect(mockFunc).toHaveBeenCalledTimes(1);
    expect(returnValue === wrapper.instance()).toBe(true);
    expect(wrapper.instance().isLoading()).toBeTruthy();
    expect(wrapper.instance().getMessage()).toEqual("Loading messsagess");
    expect(wrapper.instance().getValue()).toEqual("Value is loaded");
    expect(wrapper).toMatchSnapshot();
  });

  it("isLoading()", () => {
    const wrapper = shallow(
      <UU5.Forms.Text id={"idText"} label="Full name" placeholder="John Smith" value="" required={false} size="s" />
    );
    expect(wrapper.instance().isLoading()).toBeFalsy();
    expect(wrapper).toMatchSnapshot();
  });

  it("setSuccess(message, value, setStateCallBack)", () => {
    const wrapper = shallow(
      <UU5.Forms.Text id={"idText"} label="Full name" placeholder="John Smith" value="" required={false} size="s" />
    );
    const mockFunc = jest.fn();
    expect(wrapper.instance().getFeedback()).toEqual("initial");
    expect(wrapper.instance().getMessage()).toBe(null);
    expect(wrapper.instance().getValue()).toEqual("");
    expect(wrapper).toMatchSnapshot();
    const returnValue = wrapper.instance().setSuccess("This is success message", "Success Value", mockFunc);
    wrapper.update();
    expect(mockFunc).toBeCalled();
    expect(mockFunc).toHaveBeenCalledTimes(1);
    expect(returnValue === wrapper.instance()).toBe(true);
    expect(wrapper.instance().getFeedback()).toEqual("success");
    expect(wrapper.instance().getMessage()).toEqual("This is success message");
    expect(wrapper.instance().getValue()).toEqual("Success Value");
    expect(wrapper.instance().isSuccess()).toBeTruthy();
    expect(wrapper).toMatchSnapshot();
  });

  it("isSuccess() fisr return false, second return true", () => {
    const wrapper = shallow(
      <UU5.Forms.Text id={"idText"} label="Full name" placeholder="John Smith" value="" required={true} size="s" />
    );
    const mockFunc = jest.fn();
    expect(wrapper.instance().isSuccess()).toBeFalsy();
    const returnValue = wrapper.instance().setSuccess("This is success message", "Success Value", mockFunc);
    wrapper.update();
    expect(mockFunc).toBeCalled();
    expect(mockFunc).toHaveBeenCalledTimes(1);
    expect(returnValue === wrapper.instance()).toBe(true);
    expect(wrapper.instance().getFeedback()).toEqual("success");
    expect(wrapper.instance().getMessage()).toEqual("This is success message");
    expect(wrapper.instance().getValue()).toEqual("Success Value");
    expect(wrapper.instance().isSuccess()).toBeTruthy();
    expect(wrapper).toMatchSnapshot();
  });

  it("setWarning(message, value, setStateCallBack)", () => {
    const wrapper = shallow(
      <UU5.Forms.Text id={"idText"} label="Full name" placeholder="John Smith" value="" required={false} size="s" />
    );
    const mockFunc = jest.fn();
    expect(wrapper.instance().getFeedback()).toEqual("initial");
    expect(wrapper.instance().getMessage()).toBe(null);
    expect(wrapper.instance().getValue()).toEqual("");
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.instance().isSuccess()).toBeFalsy();
    expect(wrapper.instance().isWarning()).toBeFalsy();
    const returnValue = wrapper.instance().setWarning("This is warning message", "Warning Value", mockFunc);
    wrapper.update();
    expect(mockFunc).toBeCalled();
    expect(mockFunc).toHaveBeenCalledTimes(1);
    expect(returnValue === wrapper.instance()).toBe(true);
    expect(wrapper.instance().getFeedback()).toEqual("warning");
    expect(wrapper.instance().getMessage()).toEqual("This is warning message");
    expect(wrapper.instance().getValue()).toEqual("Warning Value");
    expect(wrapper.instance().isWarning()).toBeTruthy();
    expect(wrapper.instance().isSuccess()).toBeFalsy();
    expect(wrapper).toMatchSnapshot();
  });

  it("isWarning()", () => {
    const wrapper = shallow(
      <UU5.Forms.Text
        id={"idText"}
        label="Full name"
        placeholder="John Smith"
        value=""
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
    const setRetVal = wrapper.instance().setFeedback("success", "success message", "Default value", mockFunc);
    wrapper.update();
    expect(mockFunc).toBeCalled();
    expect(setRetVal === wrapper.instance()).toBe(true);
    expect(wrapper.instance().isWarning()).toBeFalsy();
    expect(wrapper).toMatchSnapshot();
  });

  it("setError(message, value, setStateCallBack)", () => {
    const wrapper = shallow(
      <UU5.Forms.Text id={"idText"} label="Full name" placeholder="John Smith" value="" size="s" />
    );
    const mockFunc = jest.fn();
    expect(wrapper.instance().isError()).toBeFalsy();
    expect(wrapper.instance().isWarning()).toBeFalsy();
    expect(wrapper.instance().isSuccess()).toBeFalsy();
    expect(wrapper.instance().isInitial()).toBeTruthy();
    expect(wrapper.instance().getValue()).toEqual("");
    expect(wrapper.instance().getFeedback()).toEqual("initial");
    expect(wrapper.instance().getMessage()).toBe(null);
    expect(wrapper).toMatchSnapshot();
    const returnValue = wrapper.instance().setError("This is error mesage", "Error value", mockFunc);
    wrapper.update();
    expect(mockFunc).toBeCalled();
    expect(mockFunc).toHaveBeenCalledTimes(1);
    expect(returnValue === wrapper.instance()).toBe(true);
    expect(wrapper.instance().isWarning()).toBeFalsy();
    expect(wrapper.instance().isSuccess()).toBeFalsy();
    expect(wrapper.instance().isInitial()).toBeFalsy();
    expect(wrapper.instance().isError()).toBeTruthy();
    expect(wrapper.instance().getValue()).toEqual("Error value");
    expect(wrapper.instance().getFeedback()).toEqual("error");
    expect(wrapper.instance().getMessage()).toEqual("This is error mesage");
    expect(wrapper).toMatchSnapshot();
  });

  it("isError()", () => {
    const wrapper = shallow(
      <UU5.Forms.Text
        id={"idText"}
        label="Full name"
        placeholder="John Smith"
        value=""
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
    const setRetVal = wrapper.instance().setFeedback("success", "success message", "Default value", mockFunc);
    wrapper.update();
    expect(mockFunc).toBeCalled();
    expect(setRetVal === wrapper.instance()).toBe(true);
    expect(wrapper.instance().isError()).toBeFalsy();
    expect(wrapper).toMatchSnapshot();
  });

  it("reset(setStateCallBack)", () => {
    const wrapper = shallow(
      <UU5.Forms.Text id={"idText"} label="Full name" placeholder="John Smith" value="" required={true} size="s" />
    );
    const mockFunc = jest.fn();
    wrapper.instance().setFeedback("success", "New Message", "New Value", mockFunc);
    wrapper.update();
    wrapper.instance().readOnly(mockFunc);
    wrapper.update();
    expect(wrapper.instance().getFeedback()).toEqual("success");
    expect(wrapper.instance().getMessage()).toEqual("New Message");
    expect(wrapper.instance().getValue()).toEqual("New Value");
    expect(wrapper.instance().isReadOnly()).toBeTruthy();
    expect(mockFunc).toBeCalled();
    expect(wrapper).toMatchSnapshot();
    //Now we reset seting value.
    const returnValue = wrapper.instance().reset(mockFunc);
    wrapper.update();
    expect(mockFunc).toBeCalled();
    expect(mockFunc).toHaveBeenCalledTimes(3);
    expect(returnValue === wrapper.instance()).toBe(true);
    expect(wrapper.instance().getValue()).toEqual("");
    expect(wrapper.instance().getFeedback()).toEqual("initial");
    expect(wrapper.instance().getMessage()).toBe(null);
    expect(wrapper.instance().isReadOnly()).toBeFalsy();
    expect(wrapper).toMatchSnapshot();
  });

  it("getChangeFeedback()", () => {
    const wrapper = shallow(
      <UU5.Forms.Text id={"idText"} label="Full name" placeholder="John Smith" value="" required={true} size="s" />
    );
    expect(wrapper.instance().getChangeFeedback({})).toEqual(
      expect.objectContaining({
        feedback: "initial",
        message: null,
        value: "",
        foundAutocompleteItems: null,
        selectedIndex: null,
      })
    );
    expect(wrapper).toMatchSnapshot();
  });

  it("setChangeFeedback()", () => {
    const wrapper = shallow(
      <UU5.Forms.Text id={"idText"} label="Full name" placeholder="John Smith" value="" required={true} size="s" />
    );
    const mockFunc = jest.fn();
    expect(wrapper.instance().getChangeFeedback({})).toEqual(
      expect.objectContaining({
        feedback: "initial",
        message: null,
        value: "",
        foundAutocompleteItems: null,
        selectedIndex: null,
      })
    );
    const returnValue = wrapper.instance().setChangeFeedback(
      {
        feedback: "error",
        message: "Error message from setChangeFeedback",
        value: "NaN",
      },
      mockFunc
    );
    wrapper.update();
    expect(returnValue === wrapper.instance()).toBe(true);
    expect(mockFunc).toBeCalled();
    expect(wrapper.instance().state.value).toEqual("NaN");
    expect(wrapper.instance().state.feedback).toEqual("error");
    expect(wrapper.instance().state.message).toEqual("Error message from setChangeFeedback");
    expect(wrapper).toMatchSnapshot();
  });

  it("isReadOnly()", () => {
    const wrapper = shallow(
      <UU5.Forms.Text id={"idText"} label="Full name" placeholder="John Smith" value="" required={true} size="s" />
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
      <UU5.Forms.Text
        id={"idText"}
        label="Full name"
        placeholder="John Smith"
        value="John Doe"
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
    expect(returnValue === wrapper.instance()).toBe(true);
    expect(wrapper.instance().isReadOnly()).toBeFalsy();
    expect(wrapper.instance().editable(mockFunc)).toBeTruthy();
    expect(wrapper).toMatchSnapshot();
    expect(mockFunc).toHaveBeenCalledTimes(4);
  });

  it("setEditableValue(false, setStateCallback)", () => {
    const wrapper = shallow(
      <UU5.Forms.Text
        id={"idText"}
        label="Full name"
        placeholder="John Smith"
        value="John Doe"
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
    expect(returnValue === wrapper.instance()).toBe(true);
    expect(wrapper.instance().isReadOnly()).toBeTruthy();
    expect(wrapper).toMatchSnapshot();
    expect(mockFunc).toHaveBeenCalledTimes(3);
  });

  it("readOnly(setStatecallback)", () => {
    const wrapper = shallow(
      <UU5.Forms.Text
        id={"idText"}
        label="Full name"
        placeholder="John Smith"
        value="John Doe"
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
    expect(returnValue === wrapper.instance()).toBe(true);
    expect(wrapper.instance().isReadOnly()).toBeTruthy();
    expect(wrapper).toMatchSnapshot();
  });

  it("editable(setStatecallback)", () => {
    const wrapper = shallow(
      <UU5.Forms.Text
        id={"idText"}
        label="Full name"
        placeholder="John Smith"
        value="John Doe"
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
    expect(returnValue === wrapper.instance()).toBe(true);
    expect(wrapper.instance().isReadOnly()).toBeFalsy();
    expect(wrapper.instance().state.readOnly).toBeFalsy();
    expect(wrapper).toMatchSnapshot();
  });

  it("getLabel(idinput)", () => {
    const wrapper = shallow(
      <UU5.Forms.Text
        id={"idText"}
        label="Full name"
        placeholder="John Smith"
        value="John Doe"
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
      <UU5.Forms.Text
        id={"idText"}
        label="Full name"
        placeholder="John Smith"
        value="John Doe"
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

describe(`UU5.Forms.Text interface test TextInputMixin `, () => {
  it("isTextInput() should return true", () => {
    const wrapper = shallow(
      <UU5.Forms.Text id={"idText"} label="Full name" placeholder="John Smith" value="Anna Simpson" size="s" />
    );
    expect(wrapper.instance().isTextInput()).toBeTruthy();
    expect(wrapper).toMatchSnapshot();
  });

  it("getInput()", () => {
    const wrapper = mount(
      <UU5.Forms.Text id={"idText"} label="Full name" placeholder="John Smith" value="Anna Simpson" size="s" />
    );
    expect(wrapper.instance().getInput()).toBe(wrapper.find("autocomplete-text-input").instance());
    expect(wrapper.instance().getInput()).toEqual(expect.any(Object));
    expect(wrapper.instance().getInput()).toBeInstanceOf(Object);
    expect(wrapper.instance().getInput()).not.toBe(undefined);
  });

  it("focus()", () => {
    const wrapper = shallow(
      <UU5.Forms.Text id={"idText"} label="Full name" placeholder="John Smith" value="Anna Simpson" size="s" />
    );
    expect(wrapper).toMatchSnapshot();
    wrapper.instance().focus();
    wrapper.update();
    expect(wrapper).toMatchSnapshot();
  });

  it("isValid()", () => {
    const wrapper = shallow(
      <UU5.Forms.Text
        id={"idText"}
        label="Full name"
        placeholder="John Smith"
        value="Anna Simpson"
        required={true}
        size="s"
      />
    );
    expect(wrapper.instance().isValid()).toBeTruthy();
    expect(wrapper).toMatchSnapshot();
  });

  it("isValid() should return false", () => {
    const wrapper = shallow(
      <UU5.Forms.Text id={"idText"} label="Full name" placeholder="John Smith" value="" required={true} size="s" />
    );
    expect(wrapper.instance().isValid()).toBeFalsy();
    expect(wrapper).toMatchSnapshot();
  });

  it("getFocusFeedback()", () => {
    const focusMessage = "Message";
    const wrapper = shallow(
      <UU5.Forms.Text
        id={"idText"}
        label="Full name"
        placeholder="John Smith"
        focusMessage={focusMessage}
        value=""
        required={true}
        size="s"
      />
    );
    wrapper.instance().focus();
    wrapper.update();
    expect(wrapper.instance().getFocusFeedback({})).toEqual({ feedback: "initial", value: "", message: focusMessage });
  });

  it("getBlurFeedback()", () => {
    const wrapper = shallow(
      <UU5.Forms.Text id={"idText"} label="Full name" placeholder="John Smith" value="" required={true} size="s" />
    );
    expect(wrapper.instance().getBlurFeedback({})).toEqual(
      expect.objectContaining({
        feedback: "initial",
        message: null,
        value: undefined,
      })
    );
    expect(wrapper).toMatchSnapshot();
  });

  it("setAutocompleteItems(items,opt,setStateCallBack)", () => {
    const wrapper = shallow(
      <UU5.Forms.Text id={"idText"} label="Full name" placeholder="John Smith" value="" required={false} size="s" />
    );
    const mockFunc = jest.fn();
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.instance().state.autocompleteItems).toBe(null);
    const returnValue = wrapper.instance().setAutoCompleteItems(
      [
        {
          value: "Kovar",
        },
        {
          value: "Novak",
        },
        {
          value: "Novotny",
        },
        {
          value: "Svacina",
        },
      ],
      null,
      mockFunc
    );
    wrapper.update();
    expect(wrapper.instance().state.autocompleteItems).not.toBe(null);
    expect(wrapper.instance().state.autocompleteItems).toEqual(
      expect.arrayContaining([{ value: "Kovar" }, { value: "Novak" }, { value: "Novotny" }, { value: "Svacina" }])
    );
    expect(mockFunc).toBeCalled();
    expect(mockFunc).toHaveBeenCalledTimes(1);
    expect(returnValue === wrapper.instance()).toBe(true);
    expect(wrapper).toMatchSnapshot();
    wrapper.instance().open();
    wrapper.update();
    expect(wrapper).toMatchSnapshot();
  });
});
