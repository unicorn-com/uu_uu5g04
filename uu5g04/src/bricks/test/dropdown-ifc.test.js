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

const { mount, shallow, wait } = UU5.Test.Tools;

describe(`UU5.Bricks.Dropdown interface testing`, () => {
  it("isDropdown()", () => {
    const wrapper = shallow(
      <UU5.Bricks.Dropdown id={"uuID01"} label="Dropdown" size="l" colorSchema="blue" disableBackdrop>
        <UU5.Bricks.Dropdown.Item id={"uuID02"} label="Label" />
      </UU5.Bricks.Dropdown>
    );
    expect(wrapper.instance().isDropdown()).toBeTruthy();
    expect(wrapper).toMatchSnapshot();
  });

  it("open(setStateCallBack)", () => {
    const wrapper = shallow(
      <UU5.Bricks.Dropdown id={"uuID01"} label="Dropdown" size="l" colorSchema="blue" disableBackdrop>
        <UU5.Bricks.Dropdown.Item id={"uuID02"} label="Label" />
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
    expect(returnValue === wrapper.instance()).toBe(true);
  });

  it("close(setStateCallBack)", () => {
    const wrapper = shallow(
      <UU5.Bricks.Dropdown id={"uuID01"} label="Dropdown" size="l" colorSchema="blue" disableBackdrop>
        <UU5.Bricks.Dropdown.Item id={"uuID02"} label="Label" />
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
    expect(returnValue === wrapper.instance()).toBe(true);
    //Now we closed opened drop down
    const closeValue = wrapper.instance().close(mockFunc);
    wrapper.update();
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.instance().isOpen()).toBeFalsy();
    expect(wrapper.instance().state.open).toBeFalsy();
    expect(mockFunc).toBeCalled();
    expect(mockFunc).toHaveBeenCalledTimes(2);
    expect(closeValue === wrapper.instance()).toBe(true);
  });

  it("toggle(setStateCallBack) first should open, second should close.", () => {
    const wrapper = shallow(
      <UU5.Bricks.Dropdown id={"uuID01"} label="Dropdown" size="l" colorSchema="blue" disableBackdrop>
        <UU5.Bricks.Dropdown.Item id={"uuID02"} label="Label" />
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

  it("isOpen() should return false", () => {
    const wrapper = shallow(
      <UU5.Bricks.Dropdown id={"uuID01"} label="Dropdown" size="l" colorSchema="blue" disableBackdrop>
        <UU5.Bricks.Dropdown.Item id={"uuID02"} label="Label" />
      </UU5.Bricks.Dropdown>
    );
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.instance().isOpen()).toBeFalsy();
  });

  it("isOpen() should return true", () => {
    const wrapper = shallow(
      <UU5.Bricks.Dropdown id={"uuID01"} label="Dropdown" size="l" colorSchema="blue" disableBackdrop>
        <UU5.Bricks.Dropdown.Item id={"uuID02"} label="Label" />
      </UU5.Bricks.Dropdown>
    );
    wrapper.instance().open();
    wrapper.update();
    expect(wrapper.instance().isOpen()).toBeTruthy();
  });
});
