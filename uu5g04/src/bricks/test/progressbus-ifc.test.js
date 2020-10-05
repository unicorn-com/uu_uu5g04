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

const { mount, shallow, wait } = UU5.Test.Tools;

const itemProps = {
  code: "SK001",
  colorSchema: "info",
  message: "Some message",
  pending: true,
  closeDisabled: true,
  timeout: 10000,
  onClick: null,
  onClose: null,
};

const itemSecondProps = {
  code: "SK002",
  colorSchema: "warning",
  message: "Second message",
  pending: false,
  closeDisabled: false,
  timeout: 20000,
  onClick: null,
  onClose: null,
};

describe(`UU5.Bricks.ProgressBus interface testing`, () => {
  it("addItem(itemprops, setStateCallBack)", () => {
    const wrapper = shallow(<UU5.Bricks.ProgressBus key={"openID"} id={"uuID01"} verticalPosition="bottom" />);
    const mockFunc = jest.fn();
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.instance().getItemList()).toEqual(expect.arrayContaining([]));
    expect(wrapper).toMatchSnapshot();
    const returnValue = wrapper.instance().addItem(itemProps, mockFunc);
    wrapper.update();
    expect(mockFunc).toBeCalled();
    expect(mockFunc).toHaveBeenCalledTimes(1);
    expect(returnValue).toEqual(expect.any(String));
    const lastItem = wrapper.instance().getItemList().pop();
    const returnValueOfGetItem = wrapper.instance().getItem(lastItem.id);
    expect(returnValueOfGetItem).toEqual(
      expect.objectContaining({
        code: "SK001",
        message: "Some message",
        colorSchema: "info",
        pending: true,
        closeDisabled: true,
        timeout: 10000,
        onClick: null,
        onClose: null,
      })
    );
  });

  /**
   * The test adds one item to the progressBus component using addAlert and removes it from it after removing it.
   * The final state of the component is that the progressBuss component is empty.
   */
  it("removeItem(itemID, setStateCallBack)", () => {
    const wrapper = shallow(<UU5.Bricks.ProgressBus key={"openID"} id={"uuID01"} verticalPosition="bottom" />);
    const mockFunc = jest.fn();
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.instance().getItemList()).toEqual(expect.arrayContaining([]));
    expect(wrapper).toMatchSnapshot();
    const returnValue = wrapper.instance().addItem(itemProps, mockFunc);
    wrapper.update();
    expect(mockFunc).toBeCalled();
    expect(mockFunc).toHaveBeenCalledTimes(1);
    expect(returnValue).toEqual(expect.any(String));
    const lastItem = wrapper.instance().getItemList().pop();
    const returnValueOfGetItem = wrapper.instance().getItem(lastItem.id);
    expect(returnValueOfGetItem).toEqual(
      expect.objectContaining({
        code: "SK001",
        message: "Some message",
        colorSchema: "info",
        pending: true,
        closeDisabled: true,
        timeout: 10000,
        onClick: null,
        onClose: null,
      })
    );
    const lastItemRemove = wrapper.instance().getItemList().pop();
    const removeItemReturnValue = wrapper.instance().removeItem(lastItemRemove.id, mockFunc);
    wrapper.update();
    expect(mockFunc).toBeCalled();
    expect(mockFunc).toHaveBeenCalledTimes(2);
    expect(wrapper.instance().getItemList()).toEqual(expect.arrayContaining([]));
    expect(wrapper).toMatchSnapshot();
  });

  it("getItem(itemID)", () => {
    const wrapper = shallow(<UU5.Bricks.ProgressBus key={"openID"} id={"uuID01"} verticalPosition="bottom" />);
    const mockFunc = jest.fn();
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.instance().getItemList()).toEqual(expect.arrayContaining([]));
    expect(wrapper).toMatchSnapshot();
    const returnValue = wrapper.instance().addItem(itemProps, mockFunc);
    wrapper.update();
    expect(mockFunc).toBeCalled();
    expect(mockFunc).toHaveBeenCalledTimes(1);
    const lastItem = wrapper.instance().getItemList().pop();
    const returnValueOfGetItem = wrapper.instance().getItem(lastItem.id);
    expect(returnValueOfGetItem).toEqual(
      expect.objectContaining({
        code: "SK001",
        message: "Some message",
        colorSchema: "info",
        pending: true,
        closeDisabled: true,
        timeout: 10000,
        onClick: null,
        onClose: null,
      })
    );
  });

  it("getItemByCode(itemCode)", () => {
    const wrapper = shallow(<UU5.Bricks.ProgressBus key={"openID"} id={"uuID01"} verticalPosition="bottom" />);
    const mockFunc = jest.fn();
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.instance().getItemList()).toEqual(expect.arrayContaining([]));
    expect(wrapper).toMatchSnapshot();
    const returnValue = wrapper.instance().addItem(itemProps, mockFunc);
    wrapper.update();
    expect(mockFunc).toBeCalled();
    expect(mockFunc).toHaveBeenCalledTimes(1);
    expect(returnValue).toEqual(expect.any(String));
    const retGetItemByCode = wrapper.instance().getItemByCode("SK001");
    expect(retGetItemByCode).toEqual(
      expect.objectContaining({
        code: "SK001",
        message: "Some message",
        colorSchema: "info",
        pending: true,
        closeDisabled: true,
        timeout: 10000,
        onClick: null,
        onClose: null,
      })
    );
  });

  it("getItemsByCode(code)", () => {
    const wrapper = shallow(<UU5.Bricks.ProgressBus key={"openID"} id={"uuID01"} verticalPosition="bottom" />);
    const mockFunc = jest.fn();
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.instance().getItemList()).toEqual(expect.arrayContaining([]));
    expect(wrapper).toMatchSnapshot();
    wrapper.instance().addItem(itemProps, mockFunc);
    wrapper.update();
    expect(mockFunc).toBeCalled();
    expect(mockFunc).toHaveBeenCalledTimes(1);
    const returnValueAddItem = wrapper.instance().addItem(itemProps, mockFunc);
    wrapper.update();
    expect(returnValueAddItem).toEqual(expect.any(String));
    expect(mockFunc).toBeCalled();
    expect(mockFunc).toHaveBeenCalledTimes(2);
    const retGetItemsByCode = wrapper.instance().getItemsByCode("SK001");
    expect(retGetItemsByCode).toEqual(expect.anything());
  });

  it("setItem(itemID, itemProps, setStateCallBack)", () => {
    const wrapper = shallow(<UU5.Bricks.ProgressBus key={"openID"} id={"uuID01"} verticalPosition="bottom" />);
    const mockFunc = jest.fn();
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.instance().getItemList()).toEqual(expect.arrayContaining([]));
    const returnValue = wrapper.instance().addItem(itemProps, mockFunc);
    wrapper.update();
    expect(mockFunc).toBeCalled();
    expect(mockFunc).toHaveBeenCalledTimes(1);
    expect(returnValue).toEqual(expect.any(String));

    const lastItem = wrapper.instance().getItemList().pop();
    const returnValueOfGetItem = wrapper.instance().getItem(lastItem.id);
    expect(returnValueOfGetItem).toEqual(
      expect.objectContaining({
        code: "SK001",
        message: "Some message",
        colorSchema: "info",
        pending: true,
        closeDisabled: true,
        timeout: 10000,
        onClick: null,
        onClose: null,
      })
    );
    const returnSetItem = wrapper.instance().setItem(lastItem.id, itemSecondProps, mockFunc);
    wrapper.update();
    expect(mockFunc).toBeCalled();
    expect(mockFunc).toHaveBeenCalledTimes(2);
    expect(returnSetItem === wrapper.instance()).toBe(true);
    const returnValueOfGetItemTwice = wrapper.instance().getItem(lastItem.id);
    expect(returnValueOfGetItemTwice).toEqual(
      expect.objectContaining({
        code: "SK002",
        colorSchema: "warning",
        message: "Second message",
        pending: false,
        closeDisabled: false,
        timeout: 20000,
        onClick: null,
        onClose: null,
      })
    );
  });

  it("updateItem(itemID, updateItem, setStateCallBack)", () => {
    const wrapper = shallow(<UU5.Bricks.ProgressBus key={"openID"} id={"uuID01"} verticalPosition="bottom" />);
    const mockFunc = jest.fn();
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.instance().getItemList()).toEqual(expect.arrayContaining([]));
    const returnValue = wrapper.instance().addItem(itemProps, mockFunc);
    wrapper.update();
    expect(mockFunc).toBeCalled();
    expect(mockFunc).toHaveBeenCalledTimes(1);
    expect(returnValue).toEqual(expect.any(String));
    const lastItem = wrapper.instance().getItemList().pop();
    const returnValueOfGetItem = wrapper.instance().getItem(lastItem.id);
    expect(returnValueOfGetItem).toEqual(
      expect.objectContaining({
        code: "SK001",
        message: "Some message",
        colorSchema: "info",
        pending: true,
        closeDisabled: true,
        timeout: 10000,
        onClick: null,
        onClose: null,
      })
    );
    const returnupdateItem = wrapper.instance().updateItem(lastItem.id, itemSecondProps, mockFunc);
    wrapper.update();
    expect(mockFunc).toBeCalled();
    expect(mockFunc).toHaveBeenCalledTimes(2);
    expect(returnupdateItem === wrapper.instance()).toBe(true);
    const returnValueOfGetItemTwice = wrapper.instance().getItem(lastItem.id);
    expect(returnValueOfGetItemTwice).toEqual(
      expect.objectContaining({
        code: "SK002",
        message: "Second message",
        colorSchema: "warning",
        pending: false,
        closeDisabled: false,
        timeout: 20000,
        onClick: null,
        onClose: null,
      })
    );
  });

  it("getItemList()", () => {
    const wrapper = shallow(<UU5.Bricks.ProgressBus key={"openID"} id={"uuID01"} verticalPosition="bottom" />);
    const mockFunc = jest.fn();
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.instance().getItemList()).toEqual(expect.arrayContaining([]));
    const returnValue = wrapper.instance().addItem(itemProps, mockFunc);
    wrapper.update();
    expect(mockFunc).toBeCalled();
    expect(mockFunc).toHaveBeenCalledTimes(1);
    expect(returnValue).toEqual(expect.any(String));
    wrapper.instance().addItem(itemSecondProps, mockFunc);
    wrapper.update();
    expect(mockFunc).toBeCalled();
    expect(mockFunc).toHaveBeenCalledTimes(2);
    const returnOfGetItemList = wrapper.instance().getItemList();
    expect(returnOfGetItemList).not.toBe(null);
    expect(returnOfGetItemList).toEqual(expect.anything());
    expect(returnOfGetItemList).toEqual(expect.any(Array));
    expect(returnOfGetItemList).toEqual(
      expect.arrayContaining([
        {
          code: "SK001",
          message: "Some message",
          colorSchema: "info",
          pending: true,
          closeDisabled: true,
          timeout: 10000,
          onClick: null,
          onClose: null,
          id: expect.any(String),
        },
        {
          code: "SK002",
          message: "Second message",
          colorSchema: "warning",
          pending: false,
          closeDisabled: false,
          timeout: 20000,
          onClick: null,
          onClose: null,
          id: expect.any(String),
        },
      ])
    );
  });

  it("showAlert(itemId, setStateCallBack)", () => {
    const wrapper = shallow(<UU5.Bricks.ProgressBus key={"openID"} id={"uuID01"} verticalPosition="bottom" />);
    const mockFunc = jest.fn();
    expect(wrapper.instance().state.openId).toBeNull();
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.instance().getItemList()).toEqual(expect.arrayContaining([]));
    const returnValue = wrapper.instance().addItem(itemProps, mockFunc);
    wrapper.update();
    expect(mockFunc).toBeCalled();
    expect(mockFunc).toHaveBeenCalledTimes(1);
    expect(returnValue).toEqual(expect.any(String));
    const lastItem = wrapper.instance().getItemList().pop();
    const returnValueOfGetItem = wrapper.instance().getItem(lastItem.id);
    expect(returnValueOfGetItem).toEqual(
      expect.objectContaining({
        code: "SK001",
        message: "Some message",
        colorSchema: "info",
        pending: true,
        closeDisabled: true,
        timeout: 10000,
        onClick: null,
        onClose: null,
      })
    );
    const returnOfShowAlert = wrapper.instance().showAlert(lastItem.id, mockFunc);
    wrapper.update();
    expect(mockFunc).toBeCalled();
    expect(mockFunc).toHaveBeenCalledTimes(2);
    expect(returnOfShowAlert === wrapper.instance()).toBe(true);
    expect(wrapper.instance().state.openId).toEqual(expect.any(String));
    expect(wrapper.instance().state.openId).not.toBeNull();
  });

  it("hideAlert(itemID, setStateCallBack)", () => {
    const wrapper = shallow(<UU5.Bricks.ProgressBus key={"openID"} id={"uuID01"} verticalPosition="bottom" />);
    const mockFunc = jest.fn();
    expect(wrapper.instance().state.openId).toBeNull();
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.instance().getItemList()).toEqual(expect.arrayContaining([]));
    const returnValue = wrapper.instance().addItem(itemProps, mockFunc);
    wrapper.update();
    expect(mockFunc).toBeCalled();
    expect(mockFunc).toHaveBeenCalledTimes(1);
    expect(returnValue).toEqual(expect.any(String));
    const lastItem = wrapper.instance().getItemList().pop();
    const returnValueOfGetItem = wrapper.instance().getItem(lastItem.id);
    expect(returnValueOfGetItem).toEqual(
      expect.objectContaining({
        code: "SK001",
        message: "Some message",
        colorSchema: "info",
        pending: true,
        closeDisabled: true,
        timeout: 10000,
        onClick: null,
        onClose: null,
      })
    );
    const returnOfShowAlert = wrapper.instance().showAlert(lastItem.id, mockFunc);
    wrapper.update();
    expect(mockFunc).toBeCalled();
    expect(mockFunc).toHaveBeenCalledTimes(2);
    expect(returnOfShowAlert === wrapper.instance()).toBe(true);
    expect(wrapper.instance().state.openId).toEqual(expect.any(String));
    expect(wrapper.instance().state.openId).not.toBeNull();
    const returnOfHideAlert = wrapper.instance().hideAlert(lastItem.id, mockFunc);
    wrapper.update();
    expect(mockFunc).toBeCalled();
    expect(mockFunc).toHaveBeenCalledTimes(3);
    expect(returnOfHideAlert === wrapper.instance()).toBe(true);
    expect(wrapper.instance().state.openId).toBeNull();
  });
});
