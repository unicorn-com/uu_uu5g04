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

describe('UU5.Bricks.ProgressBar interface testing', () => {

  it('Should render with shallow', () => {
    const wrapper = shallow(
      <UU5.Bricks.ProgressBar
        id={"uuID01"}
        name={"progressName"}
        progress={40}
      />
    );
    expect(wrapper).toMatchSnapshot();
  });


  it('setProgress(params, setStateCallBack)', () => {
    const wrapper = mount(
      <UU5.Bricks.ProgressBar
        id={"uuID01"}
        name={"progressName"}
        progress={40}
      />
    );
    const mockFunc = jest.fn();
    expect(wrapper.find("ProgressBarItem").instance().state.progress).toBe(40);
    expect(wrapper.find("ProgressBarItem").instance().state.content).toBeNull();
    expect(wrapper.find("ProgressBarItem").instance().state.striped).toBeFalsy();
    expect(wrapper.instance().getProgress()).toBe(40);
    wrapper.instance().setProgress({value: 50, content: "New Content", striped: true}, mockFunc);
    wrapper.update();
    expect(mockFunc).toBeCalled();
    expect(mockFunc).toHaveBeenCalledTimes(1);
    expect(wrapper.find("ProgressBarItem").instance().state.progress).toBe(50);
    expect(wrapper.find("ProgressBarItem").instance().state.content).toMatch(/New Content/);
    expect(wrapper.find("ProgressBarItem").instance().state.striped).toBeTruthy();
  });

  it('getProgress(name)', () => {
    const wrapper = mount(
      <UU5.Bricks.ProgressBar
        id={"uuID01"}
        name={"progressName"}
        progress={40}
      />
    );
    const returnValue = wrapper.instance().getProgress();
    expect(returnValue).toBe(40)
  });


  it('isPossibleChangeProgress()', () => {
    const wrapper = mount(
      <UU5.Bricks.ProgressBar
        id={"uuID01"}
        name={"progressName"}
        progress={40}
      />
    );
    expect(wrapper.instance().isPossibleChangeProgress(60)).toBeTruthy();
    expect(wrapper.instance().isPossibleChangeProgress(70)).toBeFalsy();
    expect(wrapper.instance().isPossibleChangeProgress(-40)).toBeTruthy();
  });


  it('isPossibleIncrease()', () => {
    const wrapper = mount(
      <UU5.Bricks.ProgressBar
        id={"uuID01"}
        name={"progressName"}
        progress={40}
      />
    );
    expect(wrapper.instance().isPossibleIncrease(60)).toBeTruthy();
    expect(wrapper.instance().isPossibleIncrease(70)).toBeFalsy();
  });

  it('isPossibleDecrease()', () => {
    const wrapper = mount(
      <UU5.Bricks.ProgressBar
        id={"uuID01"}
        name={"progressName"}
        progress={40}
      />
    );
    expect(wrapper.instance().isPossibleDecrease(40)).toBeTruthy();
    expect(wrapper.instance().isPossibleDecrease(50)).toBeFalsy();
  });

  it('increase(value, setStateCallBack)', () => {
    const wrapper = mount(
      <UU5.Bricks.ProgressBar
        id={"uuID01"}
        name={"progressName"}
        progress={40}
      />
    );
    const mockFunc = jest.fn();
    expect(wrapper.instance().getProgress()).toBe(40);
    const returnValue = wrapper.instance().increase(60, mockFunc);
    wrapper.update();
    expect(mockFunc).toBeCalled();
    expect(mockFunc).toHaveBeenCalledTimes(1);
    expect(returnValue).toBe(wrapper.instance());
    expect(wrapper.instance().getProgress()).toBe(100);
  });

  it('decrease(value, setStateCallBack)', () => {
    const wrapper = mount(
      <UU5.Bricks.ProgressBar
        id={"uuID01"}
        name={"progressName"}
        progress={40}
      />
    );
    const mockFunc = jest.fn();
    expect(wrapper.instance().getProgress()).toBe(40);
    const returnValue = wrapper.instance().decrease(20, mockFunc);
    wrapper.update();
    expect(mockFunc).toBeCalled();
    expect(mockFunc).toHaveBeenCalledTimes(1);
    expect(returnValue).toBe(wrapper.instance());
    expect(wrapper.instance().getProgress()).toBe(20);
  });

  it('getItem()', () => {
    const wrapper = mount(
      <UU5.Bricks.ProgressBar>
        <UU5.Bricks.ProgressBar.Item progress={40} colorSchema="blue" animated name="ProgressBar1"/>
        <UU5.Bricks.ProgressBar.Item progress={60} colorSchema="purple" name="ProgressBar2"/>
      </UU5.Bricks.ProgressBar>
    );
    expect(wrapper.instance().getItem("ProgressBar2")).not.toBeNull();
    const getPropsName = wrapper.instance().getItem("ProgressBar2").props.name;
    const getPropsProgress = wrapper.instance().getItem("ProgressBar2").props.progress;
    expect(getPropsName).toEqual("ProgressBar2");
    expect(getPropsProgress).toBe(60);
  });


});


