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

describe(`UU5.Bricks.Box interface testing`, () => {
  it(`UU5.Bricks.Box shallow snapshot should render withoutcrash`, () => {
    const wrapper = shallow(
      <UU5.Bricks.Box
        id={"uuID01"}
        infoHeader="This is infoHeader from the Box"
        infoContent="This is infoContent from the Box"
      >
        <UU5.Bricks.Span id={"boxContent"} content=" CLICK ME! Box with some icons and text " />
      </UU5.Bricks.Box>
    );
    expect(wrapper).toMatchSnapshot();
  });

  it("openInfo(modalProps, setStateCallBack)", () => {
    const wrapper = mount(
      <UU5.Bricks.Box
        id={"uuID01"}
        infoHeader="This is infoHeader from the Box"
        infoContent="This is infoContent from the Box"
      >
        <UU5.Bricks.Span id={"boxContent"} content=" CLICK ME! Box with some icons and text " />
      </UU5.Bricks.Box>
    );
    const mockFunc = jest.fn();
    //assertion before we open the modal with modal props
    expect(wrapper.find("Modal").instance().state.hidden).toBeTruthy();
    expect(wrapper.find("Modal").instance().state.header).toMatch(/This is infoHeader from the Box/);
    expect(wrapper.find("Modal").instance().state.content).toMatch(/This is infoContent from the Box/);
    expect(wrapper.find("Modal").instance().state.footer).toBeNull();
    expect(wrapper.find("Modal").instance().state.className).toBeNull();
    expect(wrapper.find("Modal").instance().state.size).toEqual("m");
    expect(wrapper.find("Modal").instance().state.sticky).toBeFalsy();
    expect(wrapper.find("Modal").instance().state.stickyBackground).toBeFalsy();
    expect(wrapper.find("Modal").instance().state.scrollableBackground).toBeFalsy();
    const returnValue = wrapper.instance().openInfo(
      {
        id: "id-modal",
        className: "modal-className",
        content: "new content",
        size: "xl",
        sticky: true,
        stickyBackground: true,
        scrollableBackground: true,
      },
      mockFunc
    );
    wrapper.update();
    expect(mockFunc).toBeCalled();
    expect(mockFunc).toHaveBeenCalledTimes(1);
    expect(returnValue === wrapper.instance()).toBe(true);
    //State variables have changed now. Without snaphosts we need to verify them by expect.
    expect(wrapper.find("Modal").instance().state.hidden).toBeFalsy();
    expect(wrapper.find("Modal").instance().state.header).toMatch(/This is infoHeader from the Box/);
    expect(wrapper.find("Modal").instance().state.content).toMatch(/new content/);
    expect(wrapper.find("Modal").instance().state.footer).toBeNull();
    expect(wrapper.find("Modal").instance().state.className).toMatch(/modal-className/);
    expect(wrapper.find("Modal").instance().state.size).toMatch(/xl/);
    expect(wrapper.find("Modal").instance().state.sticky).toBeTruthy();
    expect(wrapper.find("Modal").instance().state.stickyBackground).toBeTruthy();
    expect(wrapper.find("Modal").instance().state.scrollableBackground).toBeTruthy();
  });

  it("closeInfo(setStateCallBack)", () => {
    jest.useFakeTimers();
    const wrapper = mount(
      <UU5.Bricks.Box
        id={"uuID01"}
        infoHeader="This is infoHeader from the Box"
        infoContent="This is infoContent from the Box"
      >
        <UU5.Bricks.Span id={"boxContent"} content=" CLICK ME! Box with some icons and text " />
      </UU5.Bricks.Box>
    );
    const mockFunc = jest.fn();
    expect(wrapper.find("Modal").instance().state.hidden).toBeTruthy();
    wrapper.instance().openInfo({ content: "new content" }, mockFunc);
    wrapper.update();
    expect(mockFunc).toBeCalled();
    expect(mockFunc).toHaveBeenCalledTimes(1);
    mockFunc.mockClear();
    expect(wrapper.find("Modal").instance().state.hidden).toBeFalsy();
    const returnValue = wrapper.instance().closeInfo(mockFunc);
    jest.runAllTimers();
    wrapper.update();
    expect(mockFunc).toBeCalled();
    expect(mockFunc).toHaveBeenCalledTimes(1);
    expect(wrapper.find("Modal").instance().state.hidden).toBeTruthy();
    expect(returnValue === wrapper.instance()).toBe(true);
  });
});
