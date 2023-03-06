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

describe(`UU5.Bricks.ButtonSwitch interface testing`, () => {
  it("switchOn(setStateCallBack)", () => {
    const wrapper = shallow(
      <UU5.Bricks.ButtonSwitch
        id={"uuID"}
        props={{
          size: "s",
          bgStyle: "outline",
        }}
        onProps={{
          colorSchema: "success",
          content: "turned on",
        }}
        offProps={{
          content: "turned off",
        }}
      />
    );

    const mockFunc = jest.fn();
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.instance().state.switchedOn).toBeFalsy();
    expect(wrapper.instance().isSwitchOn()).toBeFalsy();
    expect(wrapper.instance().isSwitchOff()).toBeTruthy();
    const returnValue = wrapper.instance().switchOn(mockFunc);
    wrapper.update();
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.instance().state.switchedOn).toBeTruthy();
    expect(wrapper.instance().isSwitchOn()).toBeTruthy();
    expect(wrapper.instance().isSwitchOff()).toBeFalsy();
    expect(mockFunc).toBeCalled();
    expect(mockFunc).toHaveBeenCalledTimes(1);
    expect(returnValue === wrapper.instance()).toBe(true);
  });

  it("switchOff(setStateCallBack)", () => {
    const wrapper = shallow(
      <UU5.Bricks.ButtonSwitch
        id={"uuID"}
        switchedOn={true}
        props={{
          size: "s",
          bgStyle: "outline",
        }}
        onProps={{
          colorSchema: "success",
          content: "turned on",
        }}
        offProps={{
          content: "turned off",
        }}
      />
    );
    const mockFunc = jest.fn();
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.instance().state.switchedOn).toBeTruthy();
    expect(wrapper.instance().isSwitchOn()).toBeTruthy();
    expect(wrapper.instance().isSwitchOff()).toBeFalsy();
    const returnValue = wrapper.instance().switchOff(mockFunc);
    wrapper.update();
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.instance().state.switchedOn).toBeFalsy();
    expect(wrapper.instance().isSwitchOn()).toBeFalsy();
    expect(wrapper.instance().isSwitchOff()).toBeTruthy();
    expect(mockFunc).toBeCalled();
    expect(mockFunc).toHaveBeenCalledTimes(1);
    expect(returnValue === wrapper.instance()).toBe(true);
  });

  it("toggle(setStateCallBack) set off to on", () => {
    const wrapper = shallow(
      <UU5.Bricks.ButtonSwitch
        id={"uuID"}
        switchedOn={false}
        props={{
          size: "s",
          bgStyle: "outline",
        }}
        onProps={{
          colorSchema: "success",
          content: "turned on",
        }}
        offProps={{
          content: "turned off",
        }}
      />
    );
    const mockFunc = jest.fn();
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.instance().state.switchedOn).toBeFalsy();
    expect(wrapper.instance().isSwitchOn()).toBeFalsy();
    expect(wrapper.instance().isSwitchOff()).toBeTruthy();
    const returnValue = wrapper.instance().toggle(mockFunc);
    wrapper.update();
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.instance().state.switchedOn).toBeTruthy();
    expect(wrapper.instance().isSwitchOn()).toBeTruthy();
    expect(wrapper.instance().isSwitchOff()).toBeFalsy();
    expect(mockFunc).toBeCalled();
    expect(mockFunc).toHaveBeenCalledTimes(1);
    expect(returnValue === wrapper.instance()).toBe(true);
  });

  it("toggle(setStateCallBack) set on to off", () => {
    const wrapper = shallow(
      <UU5.Bricks.ButtonSwitch
        id={"uuID"}
        switchedOn={true}
        props={{
          size: "s",
          bgStyle: "outline",
        }}
        onProps={{
          colorSchema: "success",
          content: "turned on",
        }}
        offProps={{
          content: "turned off",
        }}
      />
    );
    const mockFunc = jest.fn();
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.instance().state.switchedOn).toBeTruthy();
    expect(wrapper.instance().isSwitchOn()).toBeTruthy();
    expect(wrapper.instance().isSwitchOff()).toBeFalsy();
    const returnValue = wrapper.instance().toggle(mockFunc);
    wrapper.update();
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.instance().state.switchedOn).toBeFalsy();
    expect(wrapper.instance().isSwitchOn()).toBeFalsy();
    expect(wrapper.instance().isSwitchOff()).toBeTruthy();
    expect(mockFunc).toBeCalled();
    expect(mockFunc).toHaveBeenCalledTimes(1);
    expect(returnValue === wrapper.instance()).toBe(true);
  });

  it("isSwitchOn(boolean)", () => {
    const wrapper = shallow(
      <UU5.Bricks.ButtonSwitch
        id={"uuID"}
        switchedOn={true}
        props={{
          size: "s",
          bgStyle: "outline",
        }}
        onProps={{
          colorSchema: "success",
          content: "turned on",
        }}
        offProps={{
          content: "turned off",
        }}
      />
    );
    expect(wrapper.instance().state.switchedOn).toBeTruthy();
    expect(wrapper.instance().isSwitchOn()).toBeTruthy();
    expect(wrapper).toMatchSnapshot();
  });

  it("isSwitchOff(boolean)", () => {
    const wrapper = shallow(
      <UU5.Bricks.ButtonSwitch
        id={"uuID"}
        switchedOn={false}
        props={{
          size: "s",
          bgStyle: "outline",
        }}
        onProps={{
          colorSchema: "success",
          content: "turned on",
        }}
        offProps={{
          content: "turned off",
        }}
      />
    );
    expect(wrapper.instance().state.switchedOn).toBeFalsy();
    expect(wrapper.instance().isSwitchOn()).toBeFalsy();
    expect(wrapper).toMatchSnapshot();
  });
});
