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

describe(`UU5.Bricks.Console interface testing`, function () {
  it("info(input)", () => {
    const wrapper = shallow(<UU5.Bricks.Console id={"uuID-console"} ref_={(console) => (this.console = console)} />);
    const mockFunc = jest.fn();
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.instance().state.content).toEqual([]);
    const returnValue = this.console.info("Log Info", mockFunc);
    wrapper.update();
    //Data is in the snapshot.
    expect(wrapper).toMatchSnapshot();
    expect(mockFunc).toBeCalled();
    expect(mockFunc).toHaveBeenCalledTimes(1);
    expect(wrapper.instance().state.content).not.toBeNull();
    expect(returnValue === wrapper.instance()).toBe(true);
  });

  it("warning(input)", () => {
    const wrapper = shallow(<UU5.Bricks.Console id={"uuID-console"} ref_={(console) => (this.console = console)} />);
    const mockFunc = jest.fn();
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.instance().state.content).toEqual([]);
    const returnValue = this.console.warning("Log Warning", mockFunc);
    wrapper.update();
    //Data is in the snapshot.
    expect(wrapper).toMatchSnapshot();
    expect(mockFunc).toBeCalled();
    expect(mockFunc).toHaveBeenCalledTimes(1);
    expect(wrapper.instance().state.content).not.toBeNull();
    expect(returnValue === wrapper.instance()).toBe(true);
  });

  it("error(input)", () => {
    const wrapper = shallow(<UU5.Bricks.Console id={"uuID-console"} ref_={(console) => (this.console = console)} />);
    const mockFunc = jest.fn();
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.instance().state.content).toEqual([]);
    const returnValue = this.console.error("Log Error", mockFunc);
    wrapper.update();
    //Data is in the snapshot.
    expect(wrapper).toMatchSnapshot();
    expect(mockFunc).toBeCalled();
    expect(mockFunc).toHaveBeenCalledTimes(1);
    expect(wrapper.instance().state.content).not.toBeNull();
    expect(returnValue === wrapper.instance()).toBe(true);
  });
});
