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

describe("UU5.Bricks.Slider.Item interface testing", function() {
  it("getValue() should return value of props value.", () => {
    const wrapper = mount(
      <UU5.Bricks.Slider id={"uuID01"} ref_={slider => (this.slider = slider)}>
        <UU5.Bricks.Slider.Item ref_={sliderItem1 => (this.sliderItem1 = sliderItem1)} id={"uuID02"} content="1" />
        <UU5.Bricks.Slider.Item
          ref_={sliderItem2 => (this.sliderItem2 = sliderItem2)}
          id={"uuID03"}
          content="2"
          value={3}
        />
      </UU5.Bricks.Slider>
    );
    expect(this.sliderItem1.getValue()).toBe(0);
    expect(this.sliderItem2.getValue()).toBe(3);
  });

  it("setValue(value, setStateCallBack)", () => {
    const wrapper = mount(
      <UU5.Bricks.Slider id={"uuID01"} ref_={slider => (this.slider = slider)}>
        <UU5.Bricks.Slider.Item
          ref_={sliderItem1 => (this.sliderItem1 = sliderItem1)}
          id={"uuID02"}
          content="1"
          value={0}
        />
        <UU5.Bricks.Slider.Item
          ref_={sliderItem2 => (this.sliderItem2 = sliderItem2)}
          id={"uuID03"}
          content="2"
          value={3}
        />
      </UU5.Bricks.Slider>
    );
    const mockFunc = jest.fn();
    expect(this.sliderItem2.getValue()).toBe(3);
    const returnValue = this.sliderItem2.setValue(2, mockFunc);
    wrapper.update();
    expect(mockFunc).toBeCalled();
    expect(this.sliderItem2.getValue(2));
  });

  it("increase(value, setStateCallBack)", () => {
    const wrapper = mount(
      <UU5.Bricks.Slider id={"uuID01"} ref_={slider => (this.slider = slider)} max={5}>
        <UU5.Bricks.Slider.Item
          ref_={sliderItem1 => (this.sliderItem1 = sliderItem1)}
          id={"uuID02"}
          content="1"
          value={0}
        />
        <UU5.Bricks.Slider.Item
          ref_={sliderItem2 => (this.sliderItem2 = sliderItem2)}
          id={"uuID03"}
          content="2"
          value={3}
        />
      </UU5.Bricks.Slider>
    );
    const mockFunc = jest.fn();
    expect(this.sliderItem2.getValue()).toBe(3);
    const returnValue = this.sliderItem2.increase(2, mockFunc);
    wrapper.update();
    expect(mockFunc).toBeCalled();
    expect(this.sliderItem2.getValue()).toBe(5);
    this.sliderItem2.increase(2, mockFunc);
    wrapper.update();
    expect(mockFunc).toHaveBeenCalledTimes(2);
    expect(this.sliderItem2.getValue()).toBe(5);
  });

  it("decrease(value, setStateCallBack)", () => {
    const wrapper = mount(
      <UU5.Bricks.Slider id={"uuID01"} ref_={slider => (this.slider = slider)}>
        <UU5.Bricks.Slider.Item
          ref_={sliderItem1 => (this.sliderItem1 = sliderItem1)}
          id={"uuID02"}
          content="1"
          value={0}
        />
        <UU5.Bricks.Slider.Item
          ref_={sliderItem2 => (this.sliderItem2 = sliderItem2)}
          id={"uuID03"}
          content="2"
          value={3}
        />
      </UU5.Bricks.Slider>
    );
    const mockFunc = jest.fn();
    expect(this.sliderItem2.getValue()).toBe(3);
    const returnValue = this.sliderItem2.decrease(3, mockFunc);
    wrapper.update();
    expect(mockFunc).toBeCalled();
    expect(this.sliderItem2.getValue(0));
    this.sliderItem2.decrease(3, mockFunc);
    wrapper.update();
    expect(mockFunc).toHaveBeenCalledTimes(2);
    expect(this.sliderItem2.getValue(0));
  });
});
