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

// NOTE For this test only we'll use non-HOC variant of UU5.Bricks.Modal (without modal bus HOC).
const NonHocModal = UU5.Bricks.Modal._originalComponent;

describe(`UU5.Bricks.Modal interface testing`, () => {
  it("open(content-props, callback)", () => {
    const wrapper = shallow(<NonHocModal id={"uuID-modal"} header="Jest modal"></NonHocModal>);
    const mockFunc = jest.fn();
    expect(wrapper.instance().state.hidden).toBeTruthy();
    expect(wrapper.instance().isHidden()).toBeTruthy();
    expect(wrapper).toMatchSnapshot();
    const returnValue = wrapper.instance().open(
      {
        content: <UU5.Bricks.Div id={"uuID-div"}>Some content</UU5.Bricks.Div>,
      },
      mockFunc
    );
    wrapper.update();
    expect(wrapper.instance().state.hidden).toBeFalsy();
    expect(wrapper.instance().isHidden()).toBeFalsy();
    expect(mockFunc).toBeCalled();
    expect(mockFunc).toHaveBeenCalledTimes(1);
    expect(returnValue === wrapper.instance()).toBe(true);
    expect(wrapper).toMatchSnapshot();
  });

  it("close(callback)", () => {
    jest.useFakeTimers();
    const wrapper = shallow(<NonHocModal id={"uuID-modal"} shown={true} header="Jest modal"></NonHocModal>);
    const mockFunc = jest.fn();
    expect(wrapper.instance().state.hidden).toBeFalsy();
    expect(wrapper.instance().isHidden()).toBeFalsy();
    expect(wrapper).toMatchSnapshot();
    const returnValue = wrapper.instance().close(true, mockFunc);
    jest.runAllTimers();
    wrapper.update();
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.instance().state.hidden).toBeTruthy();
    expect(wrapper.instance().isHidden()).toBeTruthy();
    expect(returnValue === wrapper.instance()).toBe(true);
    expect(mockFunc).toBeCalled();
    expect(mockFunc).toHaveBeenCalledTimes(1);
  });

  it("isSticky() - modal is sticky", () => {
    const wrapper = shallow(
      <NonHocModal id={"uuID-modal"} shown={true} header="Jest modal" sticky={true}></NonHocModal>
    );
    expect(wrapper.instance().state.hidden).toBeFalsy();
    expect(wrapper.instance().isHidden()).toBeFalsy();
    expect(wrapper.instance().isSticky()).toBeTruthy();
    expect(wrapper).toMatchSnapshot();
  });

  it("isSticky() - modal is not sticky", () => {
    const wrapper = shallow(
      <NonHocModal id={"uuID-modal"} shown={true} header="Jest modal" sticky={false}></NonHocModal>
    );
    expect(wrapper.instance().state.hidden).toBeFalsy();
    expect(wrapper.instance().isHidden()).toBeFalsy();
    expect(wrapper.instance().isSticky()).toBeFalsy();
    expect(wrapper).toMatchSnapshot();
  });

  it("toggle() - should close window", () => {
    jest.useFakeTimers();
    const wrapper = shallow(<NonHocModal id={"uuID-modal"} shown={true} header="Jest modal"></NonHocModal>);
    const mockFunc = jest.fn();
    expect(wrapper.instance().state.hidden).toBeFalsy();
    expect(wrapper.instance().isHidden()).toBeFalsy();
    expect(wrapper).toMatchSnapshot();
    const returnValue = wrapper.instance().toggle(mockFunc);
    jest.runAllTimers();
    wrapper.update();
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.instance().state.hidden).toBeTruthy();
    expect(wrapper.instance().isHidden()).toBeTruthy();
    expect(mockFunc).toBeCalled();
    expect(mockFunc).toHaveBeenCalledTimes(1);
    expect(returnValue === wrapper.instance()).toBe(true);
  });

  it("toggle() - should open window", () => {
    jest.useFakeTimers();
    const wrapper = shallow(<NonHocModal id={"uuID-modal"} shown={false} header="Jest modal"></NonHocModal>);
    const mockFunc = jest.fn();
    expect(wrapper.instance().state.hidden).toBeTruthy();
    expect(wrapper.instance().isHidden()).toBeTruthy();
    expect(wrapper).toMatchSnapshot();
    const returnValue = wrapper.instance().toggle(mockFunc);
    jest.runAllTimers();
    wrapper.update();
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.instance().state.hidden).toBeFalsy();
    expect(wrapper.instance().isHidden()).toBeFalsy();
    expect(mockFunc).toBeCalled();
    expect(mockFunc).toHaveBeenCalledTimes(1);
    expect(returnValue === wrapper.instance()).toBe(true);
  });
});
