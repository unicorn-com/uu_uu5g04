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

describe(`UU5.Bricks.Heading interface testing`, () => {
  /**
   * When props offset is note set ifc return null.
   */

  it("getOffsetTop()", () => {
    const wrapper = shallow(
      <UU5.Bricks.Heading
        content="Fixed"
        id={"uuID01"}
        fixed={false}
        style={{
          padding: "10px",
          backgroundColor: "cornflowerblue",
        }}
      />
    );
    expect(() => wrapper.instance().getOffsetTop()).not.toThrow();
    expect(wrapper.instance().getOffsetTop()).toBeNull();
    expect(wrapper).toMatchSnapshot();
  });

  it("isFixed() - props.fixed=true", () => {
    const wrapper = shallow(
      <UU5.Bricks.Heading
        content="Fixed"
        id={"uuID01"}
        fixed={true}
        style={{
          padding: "10px",
          backgroundColor: "cornflowerblue",
        }}
      />
    );
    expect(wrapper.instance().isFixed()).toBeTruthy();
    expect(wrapper).toMatchSnapshot();
    const returnValue = wrapper.instance().isFixed();
  });

  it("isFixed() - props.fixed=false", () => {
    const wrapper = shallow(
      <UU5.Bricks.Heading
        content="Fixed"
        id={"uuID01"}
        fixed={false}
        style={{
          padding: "10px",
          backgroundColor: "cornflowerblue",
        }}
      />
    );
    expect(wrapper.instance().isFixed()).toBeFalsy();
    expect(wrapper).toMatchSnapshot();
  });

  it("setFixed(setStateCallBack)", () => {
    const wrapper = shallow(
      <UU5.Bricks.Heading
        content="Fixed"
        id={"uuID01"}
        fixed={false}
        style={{
          padding: "10px",
          backgroundColor: "cornflowerblue",
        }}
      />
    );
    const mockFunc = jest.fn();
    expect(wrapper.instance().isFixed()).toBeFalsy();
    expect(wrapper).toMatchSnapshot();
    const returnValue = wrapper.instance().setFixed(mockFunc);
    wrapper.update();
    expect(wrapper.instance().isFixed()).toBeTruthy();
    expect(wrapper).toMatchSnapshot();
    expect(mockFunc).toBeCalled();
    expect(mockFunc).toHaveBeenCalledTimes(1);
    expect(returnValue === wrapper.instance()).toBe(true);
  });

  it("setBlocked(setStateCallBack)", () => {
    const wrapper = shallow(
      <UU5.Bricks.Heading
        content="Fixed"
        id={"uuID01"}
        fixed={true}
        style={{
          padding: "10px",
          backgroundColor: "cornflowerblue",
        }}
      />
    );
    const mockFunc = jest.fn();
    expect(wrapper.instance().isFixed()).toBeTruthy();
    expect(wrapper).toMatchSnapshot();
    const returnValue = wrapper.instance().setBlocked(mockFunc);
    wrapper.update();
    expect(wrapper.instance().isFixed()).toBeFalsy();
    expect(wrapper.instance().state.fixed).toBeFalsy();
    expect(wrapper).toMatchSnapshot();
    expect(mockFunc).toBeCalled();
    expect(mockFunc).toHaveBeenCalledTimes(1);
    expect(returnValue === wrapper.instance()).toBe(true);
  });

  it("setFixedValue(true, setStateCallBack)", () => {
    const wrapper = shallow(
      <UU5.Bricks.Heading
        content="Fixed"
        id={"uuID01"}
        style={{
          padding: "10px",
          backgroundColor: "cornflowerblue",
        }}
      />
    );
    const mockFunc = jest.fn();
    expect(wrapper.instance().isFixed()).toBeFalsy();
    expect(wrapper.instance().state.fixed).toBeFalsy();
    expect(wrapper).toMatchSnapshot();
    const returnValue = wrapper.instance().setFixedValue(true, mockFunc);
    wrapper.update();
    expect(wrapper.instance().isFixed()).toBeTruthy();
    expect(wrapper.instance().state.fixed).toBeTruthy();
    expect(mockFunc).toBeCalled();
    expect(mockFunc).toHaveBeenCalledTimes(1);
    expect(returnValue === wrapper.instance()).toBe(true);
    expect(wrapper).toMatchSnapshot();
  });

  it("setFixedValue(false, setStateCallBack)", () => {
    const wrapper = shallow(
      <UU5.Bricks.Heading
        content="Fixed"
        id={"uuID01"}
        fixed={true}
        style={{
          padding: "10px",
          backgroundColor: "cornflowerblue",
        }}
      />
    );
    const mockFunc = jest.fn();
    expect(wrapper.instance().isFixed()).toBeTruthy();
    expect(wrapper.instance().state.fixed).toBeTruthy();
    expect(wrapper).toMatchSnapshot();
    const returnValue = wrapper.instance().setFixedValue(false, mockFunc);
    wrapper.update();
    expect(wrapper.instance().isFixed()).toBeFalsy();
    expect(wrapper.instance().state.fixed).toBeFalsy();
    expect(mockFunc).toBeCalled();
    expect(mockFunc).toHaveBeenCalledTimes(1);
    expect(returnValue === wrapper.instance()).toBe(true);
    expect(wrapper).toMatchSnapshot();
  });
});
