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

describe(`UU5.Bricks.Console interface testing`, function () {
  it("info(input)", () => {
    let component;
    const wrapper = mount(<UU5.Bricks.Console id={"uuID-console"} ref_={(console) => (component = console)} />);
    const mockFunc = jest.fn();
    expect(wrapper.text()).toEqual("");
    const returnValue = component.info("Log Info", mockFunc);
    wrapper.update();
    //Data is in the snapshot.
    expect(wrapper.text()).toContain("Log Info");
    expect(mockFunc).toHaveBeenCalledTimes(1);
    expect(returnValue === component).toBe(true);
  });

  it("warning(input)", () => {
    let component;
    const wrapper = mount(<UU5.Bricks.Console id={"uuID-console"} ref_={(console) => (component = console)} />);
    const mockFunc = jest.fn();
    expect(wrapper.text()).toEqual("");
    const returnValue = component.warning("Log Warning", mockFunc);
    wrapper.update();
    //Data is in the snapshot.
    expect(wrapper).toMatchSnapshot();
    expect(mockFunc).toBeCalled();
    expect(mockFunc).toHaveBeenCalledTimes(1);
    expect(returnValue === component).toBe(true);
  });

  it("error(input)", () => {
    let component;
    const wrapper = mount(<UU5.Bricks.Console id={"uuID-console"} ref_={(console) => (component = console)} />);
    const mockFunc = jest.fn();
    expect(wrapper.text()).toEqual("");
    const returnValue = component.error("Log Error", mockFunc);
    wrapper.update();
    //Data is in the snapshot.
    expect(wrapper).toMatchSnapshot();
    expect(mockFunc).toBeCalled();
    expect(mockFunc).toHaveBeenCalledTimes(1);
    expect(returnValue === component).toBe(true);
  });
});
