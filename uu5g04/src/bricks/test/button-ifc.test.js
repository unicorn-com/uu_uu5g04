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

describe(`UU5.Bricks.Button interface testing`, () => {
  it("setActive(true)", () => {
    const wrapper = shallow(<UU5.Bricks.Button id={"uuID_BTN"} content={"IFC BUTTON TESTING"} />);
    const mockFunc = jest.fn();
    expect(wrapper.instance().isPressed()).toBeFalsy();
    const returnValue = wrapper.instance().setActive(true, mockFunc);
    wrapper.update();
    expect(mockFunc).toHaveBeenCalledTimes(1);
    expect(returnValue === wrapper.instance()).toBeTruthy();
    expect(wrapper.instance().isPressed()).toBeTruthy();
  });

  it("setActive(false)", () => {
    const wrapper = shallow(<UU5.Bricks.Button id={"uuID_BTN"} pressed={true} content={"IFC BUTTON TESTING"} />);
    const mockFunc = jest.fn();
    expect(wrapper.instance().isPressed()).toBeTruthy();
    const returnValue = wrapper.instance().setActive(false, mockFunc);
    wrapper.update();
    expect(mockFunc).toHaveBeenCalledTimes(1);
    expect(wrapper.instance().isPressed()).toBeFalsy();
    expect(returnValue === wrapper.instance()).toBeTruthy();
  });

  it("press()", () => {
    const wrapper = shallow(<UU5.Bricks.Button id={"uuID_BTN"} pressed={false} content={"IFC BUTTON TESTING"} />);
    const mockFunc = jest.fn();
    expect(wrapper.instance().isPressed()).toBeFalsy();
    const returnValue = wrapper.instance().press(mockFunc);
    wrapper.update();
    expect(mockFunc).toHaveBeenCalledTimes(1);
    expect(wrapper.instance().isPressed()).toBeTruthy();
    expect(returnValue === wrapper.instance()).toBeTruthy();
  });

  it("pressUp()", () => {
    const wrapper = shallow(<UU5.Bricks.Button id={"uuID_BTN"} pressed={true} content={"IFC BUTTON TESTING"} />);
    const mockFunc = jest.fn();
    expect(wrapper.instance().isPressed()).toBeTruthy();
    const returnValue = wrapper.instance().pressUp(mockFunc);
    wrapper.update();
    expect(mockFunc).toHaveBeenCalledTimes(1);
    expect(wrapper.instance().isPressed()).toBeFalsy();
    expect(returnValue === wrapper.instance()).toBeTruthy();
  });

  it("togglePressed()", () => {
    const wrapper = shallow(<UU5.Bricks.Button id={"uuID_BTN"} pressed={false} content={"IFC BUTTON TESTING"} />);
    const mockFunc = jest.fn();
    expect(wrapper.instance().isPressed()).toBeFalsy();
    const returnValue = wrapper.instance().togglePressed(mockFunc);
    wrapper.update();
    expect(mockFunc).toHaveBeenCalledTimes(1);
    expect(wrapper.instance().isPressed()).toBeTruthy();
    expect(returnValue === wrapper.instance()).toBeTruthy();
  });

  it("togglePressed() set to pressed=false", () => {
    const wrapper = shallow(<UU5.Bricks.Button id={"uuID_BTN"} pressed={true} content={"IFC BUTTON TESTING"} />);
    const mockFunc = jest.fn();
    expect(wrapper.instance().isPressed()).toBeTruthy();
    const returnValue = wrapper.instance().togglePressed(mockFunc);
    wrapper.update();
    expect(mockFunc).toHaveBeenCalledTimes(1);
    expect(wrapper.instance().isPressed()).toBeFalsy();
    expect(returnValue === wrapper.instance()).toBeTruthy();
  });

  it("isPressed() props.pressed is true", () => {
    const wrapper = shallow(<UU5.Bricks.Button id={"uuID_BTN"} pressed={true} content={"IFC BUTTON TESTING"} />);
    expect(wrapper.instance().isPressed()).toBeTruthy();
  });

  it("isPressed() props.pressed is false", () => {
    const wrapper = shallow(<UU5.Bricks.Button id={"uuID_BTN"} pressed={false} content={"IFC BUTTON TESTING"} />);
    expect(wrapper.instance().isPressed()).toBeFalsy();
  });
});
