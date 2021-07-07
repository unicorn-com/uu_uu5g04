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

describe(`UU5.Bricks.Iframe interface testing`, () => {
  //In src should be file from same server when test running. Forexampple localhost.
  //Bud does not working.
  it("resize(setStateCallBack)", () => {
    const wrapper = shallow(
      <UU5.Bricks.Iframe
        id={"uuID01"}
        height={"300"}
        //src='http://localhost:4321/bricks/test/bricks/examples.html'
        src="https://plus4u.net/"
        resize={true}
      />
    );
    const mockFunc = jest.fn();
    expect(wrapper).toMatchSnapshot();
    const returnValue = wrapper.instance().resize(mockFunc);
    wrapper.update();
    expect(mockFunc).toBeCalled();
    expect(returnValue === wrapper.instance()).toBe(true);
    expect(wrapper).toMatchSnapshot();
  });

  it("setSize(w,h,setStateCallBack)", () => {
    const wrapper = shallow(<UU5.Bricks.Iframe id={"uuID01"} height={"300"} src="https://plus4u.net" />);
    const mockFunc = jest.fn();
    expect(wrapper.instance().state.height).toBe(0);
    expect(wrapper.instance().state.width).toBe(0);
    expect(wrapper).toMatchSnapshot();
    const returnValue = wrapper.instance().setSize("450", "450", mockFunc);
    wrapper.update();
    expect(wrapper).toMatchSnapshot();
    expect(mockFunc).toBeCalled();
    expect(mockFunc).toHaveBeenCalledTimes(1);
    expect(returnValue === wrapper.instance()).toBe(true);
    expect(wrapper.instance().state.height).toMatch(/450/);
    expect(wrapper.instance().state.width).toMatch(/450/);
  });
});
