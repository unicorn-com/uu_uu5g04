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

const { mount, shallow, wait } = UU5.Test.Tools;

describe(`UU5.Bricks.Dropdown interface testing`, () => {

  it('isDropdown()', () => {
    const wrapper = shallow(
      <UU5.Bricks.Dropdown
        id={"uuID01"}
        label="Dropdown"
        size="l"
        colorSchema="blue"
        disableBackdrop
      >
        <UU5.Bricks.Dropdown.Item id={"uuID02"} label="Label"/>
      </UU5.Bricks.Dropdown>
    );
    expect(wrapper.instance().isDropdown()).toBeTruthy();
    expect(wrapper).toMatchSnapshot();
  });

  it('open(setStateCallBack)', () => {
    const wrapper = shallow(
      <UU5.Bricks.Dropdown
        id={"uuID01"}
        label="Dropdown"
        size="l"
        colorSchema="blue"
        disableBackdrop
      >
        <UU5.Bricks.Dropdown.Item id={"uuID02"} label="Label"/>
      </UU5.Bricks.Dropdown>
    );
    expect(wrapper).toMatchSnapshot();
    const mockFunc = jest.fn();
    expect(wrapper.instance().isOpen()).toBeFalsy();
    expect(wrapper.instance().state.open).toBeFalsy();
    const returnValue = wrapper.instance().open(mockFunc);
    wrapper.update();
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.instance().state.open).toBeTruthy();
    expect(wrapper.instance().isOpen()).toBeTruthy();
    expect(mockFunc).toBeCalled();
    expect(mockFunc).toHaveBeenCalledTimes(1);
    expect(returnValue).toBe(wrapper.instance());
  });

  it('close(setStateCallBack)', () => {
    const wrapper = shallow(
      <UU5.Bricks.Dropdown
        id={"uuID01"}
        label="Dropdown"
        size="l"
        colorSchema="blue"
        disableBackdrop
      >
        <UU5.Bricks.Dropdown.Item id={"uuID02"} label="Label"/>
      </UU5.Bricks.Dropdown>
    );
    expect(wrapper).toMatchSnapshot();
    const mockFunc = jest.fn();
    expect(wrapper.instance().isOpen()).toBeFalsy();
    expect(wrapper.instance().state.open).toBeFalsy();
    const returnValue = wrapper.instance().open(mockFunc);
    wrapper.update();
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.instance().state.open).toBeTruthy();
    expect(wrapper.instance().isOpen()).toBeTruthy();
    expect(mockFunc).toBeCalled();
    expect(mockFunc).toHaveBeenCalledTimes(1);
    expect(returnValue).toBe(wrapper.instance());
    //Now we closed opened drop down
    const closeValue = wrapper.instance().close(mockFunc);
    wrapper.update();
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.instance().isOpen()).toBeFalsy();
    expect(wrapper.instance().state.open).toBeFalsy();
    expect(mockFunc).toBeCalled();
    expect(mockFunc).toHaveBeenCalledTimes(2);
    expect(closeValue).toBe(wrapper.instance());
  });


  it('toggle(setStateCallBack) first should open, second should close.', () => {
    const wrapper = shallow(
      <UU5.Bricks.Dropdown
        id={"uuID01"}
        label="Dropdown"
        size="l"
        colorSchema="blue"
        disableBackdrop
      >
        <UU5.Bricks.Dropdown.Item id={"uuID02"} label="Label"/>
      </UU5.Bricks.Dropdown>
    );
    const mockFunc = jest.fn();
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.instance().isOpen()).toBeFalsy();
    const returnValue = wrapper.instance().toggle(mockFunc);
    wrapper.update();
    expect(wrapper.instance().isOpen()).toBeTruthy();
    expect(wrapper).toMatchSnapshot();
    const returnValue2 = wrapper.instance().toggle(mockFunc);
    wrapper.update();
    expect(wrapper.instance().isOpen()).toBeFalsy();
    expect(wrapper).toMatchSnapshot();
  });


  it('isOpen() should return false', () => {
    const wrapper = shallow(
      <UU5.Bricks.Dropdown
        id={"uuID01"}
        label="Dropdown"
        size="l"
        colorSchema="blue"
        disableBackdrop
      >
        <UU5.Bricks.Dropdown.Item id={"uuID02"} label="Label"/>
      </UU5.Bricks.Dropdown>
    );
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.instance().isOpen()).toBeFalsy();
  });

  it('isOpen() should return true', () => {
    const wrapper = shallow(
      <UU5.Bricks.Dropdown
        id={"uuID01"}
        label="Dropdown"
        size="l"
        colorSchema="blue"
        disableBackdrop
      >
        <UU5.Bricks.Dropdown.Item id={"uuID02"} label="Label"/>
      </UU5.Bricks.Dropdown>
    );
    wrapper.instance().open();
    wrapper.update();
    expect(wrapper.instance().isOpen()).toBeTruthy();
  });


});
