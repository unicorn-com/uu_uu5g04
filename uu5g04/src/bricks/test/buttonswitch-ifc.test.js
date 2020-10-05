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

describe(`UU5.Bricks.ButtonSwitch interface testing`, () => {
  it("switchOn(setStateCallBack)", () => {
    const wrapper = shallow(
      <UU5.Bricks.ButtonSwitch
        id={"uuID"}
        size="xl"
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
        size="xl"
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
        size="xl"
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
        size="xl"
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
        size="xl"
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
        size="xl"
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
