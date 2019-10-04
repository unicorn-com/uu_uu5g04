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

describe('UU5.Bricks.Slider interface testing', () => {

  it('default snapshot', () => {
    const wrapper = shallow(
      <UU5.Bricks.Slider
        id={"uuID01"}
        value={80}
        max={100}
        colorSchema="red"
      />
    );
    expect(wrapper).toMatchSnapshot();
  });


  it('getValue()', () => {
    const wrapper = mount(
      <UU5.Bricks.Slider
        id={"uuID01"}
        value={80}
        max={100}
        colorSchema="red"
      />
    );
    expect(wrapper.instance().getValue()).toBe(80);
    expect(wrapper.find('slider-item').instance().getValue()).toBe(80);
  });


  it('setValue(value, setStateCallBack)', () => {
    const wrapper = mount(
      <UU5.Bricks.Slider
        id={"uuID01"}
        value={80}
        max={100}
        colorSchema="red"
      />
    );
    const mockFunc = jest.fn();
    expect(wrapper.instance().getValue()).toBe(80);
    expect(wrapper.find('slider-item').instance().getValue()).toBe(80);
    const returnValue = wrapper.instance().setValue(20, mockFunc);
    wrapper.update();
    expect(mockFunc).toBeCalled();
    expect(mockFunc).toHaveBeenCalledTimes(1);
    expect(returnValue).toBe(wrapper.instance());
    expect(wrapper.instance().getValue()).toBe(20);
    expect(wrapper.find('slider-item').instance().getValue()).toBe(20);
  });


  it('increase(value, setStateCallBack)', () => {
    const wrapper = mount(
      <UU5.Bricks.Slider
        id={"uuID01"}
        value={80}
        max={100}
        colorSchema="red"
      />
    );
    const mockFunc = jest.fn();
    expect(wrapper.instance().getValue()).toBe(80);
    expect(wrapper.find('slider-item').instance().getValue()).toBe(80);
    const returnValue = wrapper.instance().increase(20, mockFunc);
    wrapper.update();
    expect(wrapper.instance().getValue()).toBe(100);
    expect(wrapper.find('slider-item').instance().getValue()).toBe(100);
    expect(mockFunc).toBeCalled();
    expect(mockFunc).toHaveBeenCalledTimes(1);
    expect(returnValue).toBe(wrapper.instance());
    //this increase is out of range. Return value must be same. It must be 100.
    wrapper.instance().increase(10, mockFunc);
    wrapper.update();
    expect(wrapper.instance().getValue()).toBe(100);
    expect(wrapper.find('slider-item').instance().getValue()).toBe(100);
    expect(mockFunc).toHaveBeenCalledTimes(2);
  });


  it('decrease(value, setStateCallBack)', () => {
    const wrapper = mount(
      <UU5.Bricks.Slider
        id={"uuID01"}
        value={20}
        max={100}
        colorSchema="red"
      />
    );
    const mockFunc = jest.fn();
    expect(wrapper.instance().getValue()).toBe(20);
    const returnValue = wrapper.instance().decrease(20, mockFunc);
    wrapper.update();
    expect(wrapper.instance().getValue()).toBe(0);
    expect(wrapper.find('slider-item').instance().getValue()).toBe(0);
    expect(mockFunc).toBeCalled();
    expect(mockFunc).toHaveBeenCalledTimes(1);
    expect(returnValue).toBe(wrapper.instance());
    //this increase is out of range. Return value must be same. It must be 100.
    wrapper.instance().decrease(10, mockFunc);
    wrapper.update();
    expect(wrapper.instance().getValue()).toBe(0);
    expect(wrapper.find('slider-item').instance().getValue()).toBe(0);
    expect(mockFunc).toHaveBeenCalledTimes(2);
  });

  it('getpointers()should return instace of first item.', () => {
    const wrapper = mount(
      <UU5.Bricks.Slider id={"uuID01"}>
        <UU5.Bricks.Slider.Item id={"uuID02"} content="1" value={3}/>
      </UU5.Bricks.Slider>
    );
    const instaceOfFirstItem = wrapper.find('slider-item').instance();
    const return01 = wrapper.instance().getPointers()[0];
    expect(return01).toBe(instaceOfFirstItem);
  });


});
