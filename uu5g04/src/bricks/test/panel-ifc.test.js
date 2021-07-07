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

describe("UU5.Bricks.Panel ifc testing", () => {
  it("setExpandedValue(true, setStateCallBack)", () => {
    const wrapper = shallow(
      <UU5.Bricks.Panel
        id="panel0"
        name="Panel"
        header="Large team"
        colorSchema="primary"
        content={"This is content in panel"}
      />
    );
    const mockFunc = jest.fn();
    expect(wrapper.instance().isExpanded()).toBeFalsy();
    expect(wrapper.instance().isExpandable()).toBeTruthy();
    expect(wrapper.instance().state.expanded).toBeFalsy();
    expect(wrapper).toMatchSnapshot();
    //When is setExpandedValue true we can use toggle and it close panel.
    const returnValue = wrapper.instance().setExpandedValue(true, mockFunc);
    wrapper.update();
    expect(wrapper.instance().state.expanded).toBeTruthy();
    expect(wrapper.instance().isExpanded()).toBeTruthy();
    expect(mockFunc).toBeCalled();
    expect(mockFunc).toHaveBeenCalledTimes(1);
    expect(returnValue === wrapper.instance()).toBe(true);
  });

  it("setExpandedValue(false, setStateCallBack)", () => {
    const wrapper = shallow(
      <UU5.Bricks.Panel
        id="panel0"
        name="Panel"
        header="Large team"
        colorSchema="primary"
        content={"This is content in panel"}
      />
    );
    const mockFunc = jest.fn();
    expect(wrapper.instance().isExpanded()).toBeFalsy();
    expect(wrapper.instance().isExpandable()).toBeTruthy();
    expect(wrapper.instance().state.expanded).toBeFalsy();
    expect(wrapper).toMatchSnapshot();
    const returnValue = wrapper.instance().setExpandedValue(false, mockFunc);
    wrapper.update();
    expect(wrapper.instance().state.expanded).toBeFalsy();
    expect(wrapper.instance().isExpanded()).toBeFalsy();
    expect(mockFunc).toBeCalled();
    expect(mockFunc).toHaveBeenCalledTimes(1);
    expect(returnValue === wrapper.instance()).toBe(true);
  });

  it("expand(setStateCallBack)", () => {
    const wrapper = shallow(
      <UU5.Bricks.Panel
        id="panel0"
        name="Panel"
        header="Large team"
        colorSchema="primary"
        content={"This is content in panel"}
      />
    );
    const mockFunc = jest.fn();
    expect(wrapper.instance().isExpanded()).toBeFalsy();
    expect(wrapper.instance().state.expanded).toBeFalsy();
    expect(wrapper).toMatchSnapshot();
    const returnValue = wrapper.instance().expand(mockFunc);
    wrapper.update();
    expect(mockFunc).toBeCalled();
    expect(mockFunc).toHaveBeenCalledTimes(1);
    expect(returnValue === wrapper.instance()).toBe(true);
    expect(wrapper.instance().isExpanded()).toBeTruthy();
    expect(wrapper.instance().state.expanded).toBeTruthy();
    expect(wrapper).toMatchSnapshot();
  });

  it("collapse(setStateCallBack)", () => {
    const wrapper = shallow(
      <UU5.Bricks.Panel
        id="panel0"
        name="Panel"
        header="Large team"
        colorSchema="primary"
        content={"This is content in panel"}
        expanded={true}
      />
    );
    const mockFunc = jest.fn();
    expect(wrapper.instance().isExpanded()).toBeTruthy();
    expect(wrapper.instance().state.expanded).toBeTruthy();
    expect(wrapper).toMatchSnapshot();
    const returnValue = wrapper.instance().collapse(mockFunc);
    wrapper.update();
    expect(mockFunc).toBeCalled();
    expect(mockFunc).toHaveBeenCalledTimes(1);
    expect(returnValue === wrapper.instance()).toBe(true);
    expect(wrapper.instance().isExpanded()).toBeFalsy();
    expect(wrapper.instance().state.expanded).toBeFalsy();
    expect(wrapper).toMatchSnapshot();
  });

  /**
   * First call toggle() open panel.
   * Second call toggle() close opened panel.
   */
  it("toggle(setStateCallBack)", () => {
    const wrapper = shallow(
      <UU5.Bricks.Panel
        id="panel0"
        name="Panel"
        header="Large team"
        colorSchema="primary"
        content={"This is content in panel"}
      />
    );
    const mockFunc = jest.fn();
    expect(wrapper.instance().isExpanded()).toBeFalsy();
    expect(wrapper.instance().state.expanded).toBeFalsy();
    expect(wrapper).toMatchSnapshot();
    const returnValue = wrapper.instance().toggle(mockFunc);
    wrapper.update();
    expect(mockFunc).toBeCalled();
    expect(mockFunc).toHaveBeenCalledTimes(1);
    expect(returnValue === wrapper.instance()).toBe(true);
    expect(wrapper.instance().isExpanded()).toBeTruthy();
    expect(wrapper.instance().state.expanded).toBeTruthy();
    expect(wrapper).toMatchSnapshot();
    wrapper.instance().toggle(mockFunc);
    wrapper.update();
    expect(mockFunc).toBeCalled();
    expect(mockFunc).toHaveBeenCalledTimes(2);
    expect(wrapper.instance().isExpanded()).toBeFalsy();
    expect(wrapper.instance().state.expanded).toBeFalsy();
    expect(wrapper).toMatchSnapshot();
  });

  it("isExpanded() return true", () => {
    const wrapper = shallow(
      <UU5.Bricks.Panel
        id="panel0"
        name="Panel"
        header="Large team"
        colorSchema="primary"
        content={"This is content in panel"}
        expanded={true}
      />
    );
    expect(wrapper.instance().isExpanded()).toBeTruthy();
    expect(wrapper).toMatchSnapshot();
  });

  it("isExpanded() return false", () => {
    const wrapper = shallow(
      <UU5.Bricks.Panel
        id="panel0"
        name="Panel"
        header="Large team"
        colorSchema="primary"
        content={"This is content in panel"}
      />
    );
    expect(wrapper.instance().isExpanded()).toBeFalsy();
    expect(wrapper).toMatchSnapshot();
  });

  it("isExpandable() return true", () => {
    const wrapper = shallow(
      <UU5.Bricks.Panel
        id="panel0"
        name="Panel"
        header="Large team"
        colorSchema="primary"
        content={"This is content in panel"}
      />
    );
    expect(wrapper.instance().isExpandable()).toBeTruthy();
    expect(wrapper).toMatchSnapshot();
  });

  it("isExpandable() return false", () => {
    const wrapper = shallow(
      <UU5.Bricks.Panel
        id="panel0"
        name="Panel"
        header="Large team"
        colorSchema="primary"
        disabled={true}
        alwayExpanded={true}
        content={"This is content in panel"}
      />
    );
    expect(wrapper.instance().isExpandable()).toBeFalsy();
    expect(wrapper).toMatchSnapshot();
  });

  it("isExpandable() return true when alwaysExpanded is true and disabled is false", () => {
    const wrapper = shallow(
      <UU5.Bricks.Panel
        id="panel0"
        name="Panel"
        header="Large team"
        colorSchema="primary"
        disabled={false}
        alwayExpanded={true}
        content={"This is content in panel"}
      />
    );
    expect(wrapper.instance().isExpandable()).toBeTruthy();
    expect(wrapper).toMatchSnapshot();
  });
});
