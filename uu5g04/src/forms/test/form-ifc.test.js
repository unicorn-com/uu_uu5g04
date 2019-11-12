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

describe("UU5.Forms.Form interface testing", () => {
  it("setValues(values)", () => {
    const wrapper = mount(
      <UU5.Forms.Form>
        <UU5.Forms.Text
          name="name"
          className="nameClass"
          required={true}
          id={"nameID"}
          label="Name"
          placeholder="John"
        />
        <UU5.Forms.TextArea name="description" label="Description" required={true} placeholder="Some text..." />
        <UU5.Forms.Controls />
      </UU5.Forms.Form>
    );
    expect(wrapper.instance().getValues()).toEqual(expect.objectContaining({ name: "", description: "" }));
    const returnValue = wrapper.instance().setValues({ name: "Jest", description: "Testing" });
    wrapper.update();
    expect(wrapper.instance().getValues()).toEqual(expect.objectContaining({ name: "Jest", description: "Testing" }));
  });

  it("eachFormInput(func)", () => {
    const wrapper = mount(
      <UU5.Forms.Form>
        <UU5.Forms.Text
          name="name"
          value={""}
          className="nameClass"
          required={true}
          id={"nameID"}
          label="Name"
          placeholder="John"
        />
        <UU5.Forms.TextArea
          name="description"
          value={""}
          label="Description"
          required={true}
          placeholder="Some text..."
        />
        <UU5.Forms.Controls />
      </UU5.Forms.Form>
    );
    const mockFunc = jest.fn();
    const returnValue = wrapper.instance().eachFormInput(mockFunc);
    wrapper.update();
    expect(mockFunc).toBeCalled();
    //In form are two inputs. Mock func must be called twice !
    expect(mockFunc).toHaveBeenCalledTimes(2);
    const instanceOfText = wrapper.find("Text").instance();
    const instanceOfArea = wrapper.find("TextArea").instance();
    expect(mockFunc.mock.calls[0][0]).toBe(instanceOfText);
    expect(mockFunc.mock.calls[1][0]).toBe(instanceOfArea);
  });

  it("eachFormControls(func)", () => {
    const wrapper = mount(
      <UU5.Forms.Form>
        <UU5.Forms.Text
          name="name"
          value={""}
          className="nameClass"
          required={true}
          id={"nameID"}
          label="Name"
          placeholder="John"
        />
        <UU5.Forms.TextArea
          name="description"
          value={""}
          label="Description"
          required={true}
          placeholder="Some text..."
        />
        <UU5.Forms.Controls id={"idControls"} name={"controlName"} className="form-controls-jest" />
      </UU5.Forms.Form>
    );
    const mockFunc = jest.fn();
    const returnValue = wrapper.instance().eachFormControls(mockFunc);
    wrapper.update();
    expect(mockFunc).toBeCalled();
    //Control component are in form only once. MockFunc must be called only once too.
    expect(mockFunc).toHaveBeenCalledTimes(1);
    const instanceOfControls = wrapper.find("Controls").instance();
    expect(mockFunc.mock.calls[0][0]).toBe(instanceOfControls);
  });

  it("isValid() should return false", () => {
    const wrapper = mount(
      <UU5.Forms.Form>
        <UU5.Forms.Text
          name="name"
          value={""}
          className="nameClass"
          required={true}
          id={"nameID"}
          label="Name"
          placeholder="John"
        />
        <UU5.Forms.TextArea
          name="description"
          value={""}
          label="Description"
          required={true}
          placeholder="Some text..."
        />
        <UU5.Forms.Controls />
      </UU5.Forms.Form>
    );
    expect(wrapper.instance().isValid()).toBeFalsy();
    expect(() => wrapper.instance().isValid()).not.toThrow();
    expect(wrapper.instance().isValid()).not.toBeNull();
    expect(wrapper.instance().isValid()).not.toBeUndefined();
  });

  it("isValid()", () => {
    const wrapper = mount(
      <UU5.Forms.Form>
        <UU5.Forms.Text
          name="name"
          value={"John"}
          className="nameClass"
          id={"nameID"}
          label="Name"
          placeholder="John"
        />
        <UU5.Forms.TextArea
          name="description"
          value={"This is my text."}
          label="Description"
          placeholder="Some text..."
        />
        <UU5.Forms.Controls />
      </UU5.Forms.Form>
    );
    expect(wrapper.instance().isValid()).toBeTruthy();
    expect(() => wrapper.instance().isValid()).not.toThrow();
    expect(wrapper.instance().isValid()).not.toBeNull();
    expect(wrapper.instance().isValid()).not.toBeUndefined();
  });

  it("isForms()", () => {
    const wrapper = mount(
      <UU5.Forms.Form>
        <UU5.Forms.Text
          name="name"
          value={"John"}
          className="nameClass"
          id={"nameID"}
          label="Name"
          placeholder="John"
        />
        <UU5.Forms.TextArea
          name="description"
          value={"This is my text."}
          label="Description"
          placeholder="Some text..."
        />
        <UU5.Forms.Controls />
      </UU5.Forms.Form>
    );
    expect(wrapper.instance().isForm()).toBeTruthy();
    expect(() => wrapper.instance().isForm()).not.toThrow();
    expect(wrapper.instance().isForm()).not.toBeNull();
    expect(wrapper.instance().isForm()).not.toBeUndefined();
  });

  it("getValues()", () => {
    const wrapper = mount(
      <UU5.Forms.Form>
        <UU5.Forms.Text
          name="name"
          value={"John"}
          className="nameClass"
          id={"nameID"}
          label="Name"
          placeholder="John"
        />
        <UU5.Forms.TextArea
          name="description"
          value={"This is my text."}
          label="Description"
          placeholder="Some text..."
        />
        <UU5.Forms.Controls />
      </UU5.Forms.Form>
    );
    const returnValue = wrapper.instance().getValues();
    expect(() => wrapper.instance().getValues()).not.toThrow();
    expect(returnValue).toEqual(expect.objectContaining({ name: "John", description: "This is my text." }));
  });

  it("getInputs()", () => {
    const wrapper = mount(
      <UU5.Forms.Form>
        <UU5.Forms.Text name="name" label="Name" placeholder="John" />
        <UU5.Forms.TextArea name="description" label="Description" placeholder="Some text..." />
        <UU5.Forms.Controls />
      </UU5.Forms.Form>
    );
    expect(() => wrapper.instance().getInputs()).not.toThrow();
    expect(wrapper.instance().getInputs()).not.toBe(null);
    expect(wrapper.instance().getInputs()).not.toBe(undefined);
    expect(wrapper.instance().getInputs()).toEqual(expect.any(Object));
    expect(wrapper.instance().getInputs()).toBeInstanceOf(Object);
  });

  it("getInputsByName(name)", () => {
    const wrapper = mount(
      <UU5.Forms.Form>
        <UU5.Forms.Text name="name" className="nameClass" id={"nameID"} label="Name" placeholder="John" />
        <UU5.Forms.TextArea name="description" label="Description" placeholder="Some text..." />
        <UU5.Forms.Controls />
      </UU5.Forms.Form>
    );
    const instanceOfText = wrapper.find("Text").instance();
    const instanceOfArea = wrapper.find("TextArea").instance();
    expect(() => wrapper.instance().getInputByName("name")).not.toThrow();
    expect(() => wrapper.instance().getInputByName("description")).not.toThrow();
    const returnOfIfc = wrapper.instance().getInputByName("name");
    const returnOfIfcArea = wrapper.instance().getInputByName("description");
    expect(returnOfIfc).toBe(instanceOfText);
    expect(returnOfIfcArea).toBe(instanceOfArea);
  });

  it("getFormChildren(fce)", () => {
    const wrapper = mount(
      <UU5.Forms.Form>
        <UU5.Forms.Text name="name" className="nameClass" id={"nameID"} label="Name" placeholder="John" />
        <UU5.Forms.TextArea name="description" label="Description" placeholder="Some text..." />
        <UU5.Forms.Controls />
      </UU5.Forms.Form>
    );
    expect(() => wrapper.instance().getFormChildren()).not.toThrow();
    expect(wrapper.instance().getFormChildren()).not.toBeNull();
    expect(wrapper.instance().getFormChildren()).not.toBeUndefined();
    expect(wrapper.instance().getFormChildren()).toEqual(expect.any(Object));
    expect(wrapper.instance().getFormChildren()).toBeInstanceOf(Object);
    expect(wrapper.instance().getFormChildren()).toEqual(
      expect.objectContaining({
        type: "form",
        key: null,
        ref: null
      })
    );
  });

  it("getAlertBus()", () => {
    const wrapper = mount(
      <UU5.Forms.Form>
        <UU5.Forms.Text name="name" className="nameClass" id={"nameID"} label="Name" placeholder="John" />
        <UU5.Forms.TextArea name="description" label="Description" placeholder="Some text..." />
        <UU5.Forms.Controls />
      </UU5.Forms.Form>
    );
    expect(() => wrapper.instance().getAlertBus()).not.toThrow();
    const instanceOfAlertBus = wrapper.find("AlertBus").instance();
    const returnValue = wrapper.instance().getAlertBus();
    expect(returnValue).not.toBeNull();
    expect(returnValue).not.toBeUndefined();
    expect(returnValue).toEqual(expect.any(Object));
    expect(returnValue).toBe(instanceOfAlertBus);
  });

  it("save(values)", () => {
    const mockFunc = jest.fn();
    const wrapper = mount(
      <UU5.Forms.Form onSave={mockFunc}>
        <UU5.Forms.Text
          name="name"
          value={"John"}
          className="nameClass"
          id={"nameID"}
          label="Name"
          placeholder="John"
        />
        <UU5.Forms.TextArea
          name="description"
          value={"This is my text."}
          label="Description"
          placeholder="Some text..."
        />
        <UU5.Forms.Controls />
      </UU5.Forms.Form>
    );
    const returnValue = wrapper.instance().save();
    wrapper.update();
    expect(mockFunc).toBeCalled();
    expect(returnValue).toBe(wrapper.instance());
    expect(mockFunc.mock.calls[0][0].component).toBe(wrapper.instance());
    expect(() => wrapper.instance().save()).not.toThrow();
  });

  it("saveDone(dtoOut)", () => {
    const mockFunc = jest.fn();
    const wrapper = mount(
      <UU5.Forms.Form onSaveDone={mockFunc}>
        <UU5.Forms.Text
          name="name"
          value={"John"}
          className="nameClass"
          id={"nameID"}
          label="Name"
          placeholder="John"
        />
        <UU5.Forms.TextArea
          name="description"
          value={"This is my text."}
          label="Description"
          placeholder="Some text..."
        />
        <UU5.Forms.Controls />
      </UU5.Forms.Form>
    );
    const returnValue = wrapper.instance().saveDone({ data: "My data" });
    wrapper.update();
    expect(mockFunc).toBeCalled();
    expect(returnValue).toBe(wrapper.instance());
    expect(mockFunc.mock.calls[0][0].component).toBe(wrapper.instance());
    expect(mockFunc.mock.calls[0][0].dtoOut).toEqual(expect.objectContaining({ data: "My data" }));
    expect(() => wrapper.instance().saveDone()).not.toThrow();
  });

  it("saveFail(dtoOut)", () => {
    const mockFunc = jest.fn();
    const wrapper = mount(
      <UU5.Forms.Form onSaveFail={mockFunc}>
        <UU5.Forms.Text name="name" className="nameClass" id={"nameID"} label="Name" placeholder="John" />
        <UU5.Forms.TextArea name="description" label="Description" placeholder="Some text..." />
        <UU5.Forms.Controls />
      </UU5.Forms.Form>
    );
    const returnValue = wrapper.instance().saveFail({ data: "My data" });
    wrapper.update();
    expect(mockFunc).toBeCalled();
    expect(returnValue).toBe(wrapper.instance());
    expect(mockFunc.mock.calls[0][0].component).toBe(wrapper.instance());
    expect(mockFunc.mock.calls[0][0].dtoOut).toEqual(expect.objectContaining({ data: "My data" }));
    expect(() => wrapper.instance().saveFail()).not.toThrow();
  });

  it("validate()", () => {
    const wrapper = mount(
      <UU5.Forms.Form>
        <UU5.Forms.Text
          name="name"
          value={"John"}
          className="nameClass"
          id={"nameID"}
          label="Name"
          placeholder="John"
        />
        <UU5.Forms.TextArea
          name="description"
          value={"This is my text."}
          label="Description"
          placeholder="Some text..."
        />
        <UU5.Forms.Controls />
      </UU5.Forms.Form>
    );
    expect(() => wrapper.instance().validate()).not.toThrow();
    const returnValue = wrapper.instance().validate();
    wrapper.update();
    expect(wrapper.instance().isValid()).toBeTruthy();
    expect(returnValue).toBe(wrapper.instance());
  });

  //The simulation and verification of the correct effect of the setReady interface call is as follows
  //1 / I call the setPending () interface. Before this call, input elements are not disabled. After calling setPending, they are disabled.
  it("setPending(setStateCallBack)", () => {
    const wrapper = mount(
      <UU5.Forms.Form>
        <UU5.Forms.Text
          name="name"
          value={"John"}
          className="nameClass"
          id={"nameID"}
          label="Name"
          placeholder="John"
        />
        <UU5.Forms.TextArea
          name="description"
          value={"This is my text."}
          label="Description"
          placeholder="Some text..."
        />
        <UU5.Forms.Controls />
      </UU5.Forms.Form>
    );
    const instanceText = wrapper.find("Text").instance();
    const instanceArea = wrapper.find("TextArea").instance();
    expect(instanceText.isDisabled()).toBeFalsy();
    expect(instanceArea.isDisabled()).toBeFalsy();
    const mockFunc = jest.fn();
    const returnValue = wrapper.instance().setPending(mockFunc);
    wrapper.update();
    expect(instanceText.isDisabled()).toBeTruthy();
    expect(instanceArea.isDisabled()).toBeTruthy();
    expect(mockFunc).toBeCalled();
    expect(returnValue).toBe(wrapper.instance());
  });

  //The simulation and verification of the correct effect of the setReady interface call is as follows
  //1 / I call the setPending () interface. Before this call, input elements are not disabled. After calling setPending, they are disabled.
  //2 / call ifc setReady (). If text element inputs and textarea are not disabled, the input elements are OK.
  it("setReady(setStateCallBack)", () => {
    const wrapper = mount(
      <UU5.Forms.Form>
        <UU5.Forms.Text
          name="name"
          value={"John"}
          className="nameClass"
          id={"nameID"}
          label="Name"
          placeholder="John"
        />
        <UU5.Forms.TextArea
          name="description"
          value={"This is my text."}
          label="Description"
          placeholder="Some text..."
        />
        <UU5.Forms.Controls />
      </UU5.Forms.Form>
    );
    const mockFunc = jest.fn();
    const instanceText = wrapper.find("Text").instance();
    const instanceArea = wrapper.find("TextArea").instance();
    expect(instanceText.isDisabled()).toBeFalsy();
    expect(instanceArea.isDisabled()).toBeFalsy();
    const returnValue = wrapper.instance().setPending(mockFunc);
    wrapper.update();
    expect(instanceText.isDisabled()).toBeTruthy();
    expect(instanceArea.isDisabled()).toBeTruthy();
    expect(mockFunc).toHaveBeenCalledTimes(1);
    expect(returnValue).toBe(wrapper.instance());
    const returnValueReady = wrapper.instance().setReady(mockFunc);
    wrapper.update();
    expect(mockFunc).toHaveBeenCalledTimes(2);
    expect(returnValueReady).toBe(wrapper.instance());
    expect(instanceText.isDisabled()).toBeFalsy();
    expect(instanceArea.isDisabled()).toBeFalsy();
  });

  it("reset(setStateCallBack)", () => {
    const wrapper = mount(
      <UU5.Forms.Form>
        <UU5.Forms.Text name="name" className="nameClass" id={"nameID"} label="Name" placeholder="John" />
        <UU5.Forms.TextArea name="description" label="Description" placeholder="Some text..." />
        <UU5.Forms.Controls />
      </UU5.Forms.Form>
    );
    const mockFunc = jest.fn();
    expect(wrapper.instance().getValues()).toEqual(expect.objectContaining({ name: "", description: "" }));
    wrapper.instance().setValues({ name: "John", description: "This is my text." });
    wrapper.update();
    expect(wrapper.instance().getValues()).toEqual(
      expect.objectContaining({
        name: "John",
        description: "This is my text."
      })
    );
    const returnValue = wrapper.instance().reset(mockFunc);
    wrapper.update();
    expect(mockFunc).toBeCalled();
    expect(returnValue).toBe(wrapper.instance());
    expect(wrapper.instance().getValues()).toEqual(expect.objectContaining({ name: "", description: "" }));
  });

  it("cancel()", () => {
    const mockFunc = jest.fn();
    const wrapper = mount(
      <UU5.Forms.Form onCancel={mockFunc}>
        <UU5.Forms.Text name="name" className="nameClass" id={"nameID"} label="Name" placeholder="John" />
        <UU5.Forms.TextArea name="description" label="Description" placeholder="Some text..." />
        <UU5.Forms.Controls />
      </UU5.Forms.Form>
    );
    const returnValue = wrapper.instance().cancel();
    wrapper.update();
    expect(mockFunc).toBeCalled();
    expect(returnValue).toBe(wrapper.instance());
    expect(mockFunc.mock.calls[0][0].component).toBe(wrapper.instance());
    expect(() => wrapper.instance().cancel()).not.toThrow();
  });
});
