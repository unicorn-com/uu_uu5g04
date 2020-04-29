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

describe(`UU5.Bricks.NavBar interface testing`, () => {
  it("isOpen() return false", () => {
    const wrapper = shallow(
      <UU5.Bricks.NavBar id={"uuID01"} colorSchema="grey" fixed="bottom">
        <UU5.Bricks.NavBar.Header id={"uuID02"} content="fixed='bottom'" />
        <UU5.Bricks.NavBar.Nav id={"uuID03"}>
          <UU5.Bricks.NavBar.Nav.Item id={"uuID04"}>News</UU5.Bricks.NavBar.Nav.Item>
          <UU5.Bricks.NavBar.Nav.Item id={"uuID05"}>MyProfile</UU5.Bricks.NavBar.Nav.Item>
        </UU5.Bricks.NavBar.Nav>
      </UU5.Bricks.NavBar>
    );
    expect(wrapper.instance().isOpen()).toBeFalsy();
    expect(wrapper.instance().state.expanded).toBeFalsy();
    expect(wrapper).toMatchSnapshot();
  });

  it("isOpen() return true", () => {
    const wrapper = shallow(
      <UU5.Bricks.NavBar id={"uuID01"} colorSchema="grey" fixed="bottom" open={true}>
        <UU5.Bricks.NavBar.Header id={"uuID02"} content="fixed='bottom'" />
        <UU5.Bricks.NavBar.Nav id={"uuID03"}>
          <UU5.Bricks.NavBar.Nav.Item id={"uuID04"}>News</UU5.Bricks.NavBar.Nav.Item>
          <UU5.Bricks.NavBar.Nav.Item id={"uuID05"}>MyProfile</UU5.Bricks.NavBar.Nav.Item>
        </UU5.Bricks.NavBar.Nav>
      </UU5.Bricks.NavBar>
    );
    expect(wrapper.instance().isOpen()).toBeTruthy();
    expect(wrapper.instance().state.expanded).toBeTruthy();
    expect(wrapper).toMatchSnapshot();
  });

  it("open(setStateCallBack)", () => {
    jest.useFakeTimers(); // open() invokes callback via timeout

    const wrapper = shallow(
      <UU5.Bricks.NavBar id={"uuID01"} colorSchema="grey" fixed="bottom" alwaysOpen={false} open={false}>
        <UU5.Bricks.NavBar.Header id={"uuID02"} content="fixed='bottom'" />
        <UU5.Bricks.NavBar.Nav id={"uuID03"}>
          <UU5.Bricks.NavBar.Nav.Item id={"uuID04"}>News</UU5.Bricks.NavBar.Nav.Item>
          <UU5.Bricks.NavBar.Nav.Item id={"uuID05"}>MyProfile</UU5.Bricks.NavBar.Nav.Item>
        </UU5.Bricks.NavBar.Nav>
      </UU5.Bricks.NavBar>
    );
    const mockFunc = jest.fn();
    expect(wrapper.instance().isOpen()).toBeFalsy();
    expect(wrapper.instance().state.expanded).toBeFalsy();
    expect(wrapper).toMatchSnapshot();
    const returnValue = wrapper.instance().open(mockFunc);
    jest.runAllTimers();
    wrapper.update();
    expect(wrapper.instance().state.expanded).toBeTruthy();
    expect(wrapper.instance().isOpen()).toBeTruthy();
    expect(wrapper).toMatchSnapshot();
    expect(returnValue === wrapper.instance()).toBe(true);
    expect(mockFunc).toHaveBeenCalledTimes(1);
  });

  it("close(setStateCallBack)", () => {
    jest.useFakeTimers(); // close() invokes callback via timeout

    const wrapper = shallow(
      <UU5.Bricks.NavBar id={"uuID01"} colorSchema="grey" fixed="bottom" alwaysOpen={false} open={true}>
        <UU5.Bricks.NavBar.Header id={"uuID02"} content="fixed='bottom'" />
        <UU5.Bricks.NavBar.Nav id={"uuID03"}>
          <UU5.Bricks.NavBar.Nav.Item id={"uuID04"}>News</UU5.Bricks.NavBar.Nav.Item>
          <UU5.Bricks.NavBar.Nav.Item id={"uuID05"}>MyProfile</UU5.Bricks.NavBar.Nav.Item>
        </UU5.Bricks.NavBar.Nav>
      </UU5.Bricks.NavBar>
    );
    const mockFunc = jest.fn();
    expect(wrapper.instance().isOpen()).toBeTruthy();
    expect(wrapper.instance().state.expanded).toBeTruthy();
    expect(wrapper).toMatchSnapshot();
    const returnValue = wrapper.instance().close(mockFunc);
    jest.runAllTimers();
    wrapper.update();
    expect(wrapper.instance().state.expanded).toBeFalsy();
    expect(wrapper.instance().isOpen()).toBeFalsy();
    expect(wrapper).toMatchSnapshot();
    expect(returnValue === wrapper.instance()).toBe(true);
    expect(mockFunc).toHaveBeenCalledTimes(1);
  });

  it("toggle(setStateCallBack) should open navbar", () => {
    jest.useFakeTimers(); // toggle() invokes callback via timeout

    const wrapper = shallow(
      <UU5.Bricks.NavBar id={"uuID01"} colorSchema="grey" fixed="bottom">
        <UU5.Bricks.NavBar.Header id={"uuID02"} content="fixed='bottom'" />
        <UU5.Bricks.NavBar.Nav id={"uuID03"}>
          <UU5.Bricks.NavBar.Nav.Item id={"uuID04"}>News</UU5.Bricks.NavBar.Nav.Item>
          <UU5.Bricks.NavBar.Nav.Item id={"uuID05"}>MyProfile</UU5.Bricks.NavBar.Nav.Item>
        </UU5.Bricks.NavBar.Nav>
      </UU5.Bricks.NavBar>
    );
    expect(wrapper.instance().isOpen()).toBeFalsy();
    expect(wrapper.instance().state.expanded).toBeFalsy();
    const mockFunc = jest.fn();
    expect(wrapper).toMatchSnapshot();
    const returnValue = wrapper.instance().toggle(mockFunc);
    jest.runAllTimers();
    wrapper.update();
    expect(wrapper.instance().isOpen()).toBeTruthy();
    expect(wrapper.instance().state.expanded).toBeTruthy();
    expect(returnValue === wrapper.instance()).toBe(true);
    expect(wrapper).toMatchSnapshot();
    expect(mockFunc).toHaveBeenCalledTimes(1);
    expect(mockFunc).toBeCalled();
  });

  it("toggle(setStateCallBack) should close navbar", () => {
    jest.useFakeTimers(); // toggle() invokes callback via timeout

    const wrapper = shallow(
      <UU5.Bricks.NavBar id={"uuID01"} colorSchema="grey" fixed="bottom" alwaysOpen={false}>
        <UU5.Bricks.NavBar.Header id={"uuID02"} content="fixed='bottom'" />
        <UU5.Bricks.NavBar.Nav id={"uuID03"}>
          <UU5.Bricks.NavBar.Nav.Item id={"uuID04"}>News</UU5.Bricks.NavBar.Nav.Item>
          <UU5.Bricks.NavBar.Nav.Item id={"uuID05"}>MyProfile</UU5.Bricks.NavBar.Nav.Item>
        </UU5.Bricks.NavBar.Nav>
      </UU5.Bricks.NavBar>
    );
    const mockFunc = jest.fn();
    wrapper.instance().open();
    wrapper.update();
    expect(wrapper.instance().isOpen()).toBeTruthy();
    expect(wrapper).toMatchSnapshot();
    const returnValue = wrapper.instance().toggle(mockFunc);
    jest.runAllTimers();
    wrapper.update();
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.instance().isOpen()).toBeFalsy();
  });

  it("getOffset()", () => {
    const wrapper = shallow(
      <UU5.Bricks.NavBar id={"uuID01"} colorSchema="grey" offset={70} fixed="bottom">
        <UU5.Bricks.NavBar.Header id={"uuID02"} content="fixed='bottom'" />
        <UU5.Bricks.NavBar.Nav id={"uuID03"}>
          <UU5.Bricks.NavBar.Nav.Item id={"uuID04"}>News</UU5.Bricks.NavBar.Nav.Item>
          <UU5.Bricks.NavBar.Nav.Item id={"uuID05"}>MyProfile</UU5.Bricks.NavBar.Nav.Item>
        </UU5.Bricks.NavBar.Nav>
      </UU5.Bricks.NavBar>
    );
    expect(wrapper.instance().getOffset()).not.toBe(null);
    expect(wrapper.instance().getOffset()).toBe(70);
    expect(wrapper).toMatchSnapshot();
  });
});
