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

import React from "react";
import UU5 from "uu5g04";
import "uu5g04-bricks";

const { mount, shallow, wait } = UU5.Test.Tools;

describe('UU5.Bricks.Panel ifc testing', () => {

  it('setExpandedValue(true, setStateCallBack)', () => {
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
    expect(returnValue).toBe(wrapper.instance());
  });


  it('setExpandedValue(false, setStateCallBack)', () => {
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
    expect(returnValue).toBe(wrapper.instance());
  });

  it('expand(setStateCallBack)', () => {
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
    expect(returnValue).toBe(wrapper.instance());
    expect(wrapper.instance().isExpanded()).toBeTruthy();
    expect(wrapper.instance().state.expanded).toBeTruthy();
    expect(wrapper).toMatchSnapshot();
  });

  it('collapse(setStateCallBack)', () => {
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
    expect(returnValue).toBe(wrapper.instance());
    expect(wrapper.instance().isExpanded()).toBeFalsy();
    expect(wrapper.instance().state.expanded).toBeFalsy();
    expect(wrapper).toMatchSnapshot();
  });

  /**
   * First call toggle() open panel.
   * Second call toggle() close opened panel.
   */
  it('toggle(setStateCallBack)', () => {
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
    expect(returnValue).toBe(wrapper.instance());
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

  it('isExpanded() return true', () => {
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

  it('isExpanded() return false', () => {
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

  it('isExpandable() return true', () => {
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

  it('isExpandable() return false', () => {
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

  it('isExpandable() return true when alwaysExpanded is true and disabled is false', () => {
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
