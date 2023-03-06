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

const { mount } = UU5.Test.Tools;

describe("UU5.Bricks.Slider.Item interface testing", function () {
  it("getValue() should return value of props value.", () => {
    let slider, sliderItem1, sliderItem2;
    mount(
      <UU5.Bricks.Slider id={"uuID01"} ref_={(_slider) => (slider = _slider)}>
        <UU5.Bricks.Slider.Item ref_={(_sliderItem1) => (sliderItem1 = _sliderItem1)} id={"uuID02"} content="1" />
        <UU5.Bricks.Slider.Item
          ref_={(_sliderItem2) => (sliderItem2 = _sliderItem2)}
          id={"uuID03"}
          content="2"
          value={3}
        />
      </UU5.Bricks.Slider>
    );
    expect(sliderItem1.getValue()).toBe(0);
    expect(sliderItem2.getValue()).toBe(3);
  });

  it("setValue(value, setStateCallBack)", () => {
    let slider, sliderItem1, sliderItem2;
    const wrapper = mount(
      <UU5.Bricks.Slider id={"uuID01"} ref_={(_slider) => (slider = _slider)}>
        <UU5.Bricks.Slider.Item
          ref_={(_sliderItem1) => (sliderItem1 = _sliderItem1)}
          id={"uuID02"}
          content="1"
          value={0}
        />
        <UU5.Bricks.Slider.Item
          ref_={(_sliderItem2) => (sliderItem2 = _sliderItem2)}
          id={"uuID03"}
          content="2"
          value={3}
        />
      </UU5.Bricks.Slider>
    );
    const mockFunc = jest.fn();
    expect(sliderItem2.getValue()).toBe(3);
    sliderItem2.setValue(2, mockFunc);
    wrapper.update();
    expect(mockFunc).toHaveBeenCalledTimes(1);
    expect(sliderItem2.getValue()).toBe(2);
  });

  it("increase(value, setStateCallBack)", () => {
    let slider, sliderItem1, sliderItem2;
    const wrapper = mount(
      <UU5.Bricks.Slider id={"uuID01"} ref_={(_slider) => (slider = _slider)} max={5}>
        <UU5.Bricks.Slider.Item
          ref_={(_sliderItem1) => (sliderItem1 = _sliderItem1)}
          id={"uuID02"}
          content="1"
          value={0}
        />
        <UU5.Bricks.Slider.Item
          ref_={(_sliderItem2) => (sliderItem2 = _sliderItem2)}
          id={"uuID03"}
          content="2"
          value={3}
        />
      </UU5.Bricks.Slider>
    );
    const mockFunc = jest.fn();
    expect(sliderItem2.getValue()).toBe(3);
    sliderItem2.increase(2, mockFunc);
    wrapper.update();
    expect(mockFunc).toHaveBeenCalledTimes(1);
    expect(sliderItem2.getValue()).toBe(5);
    sliderItem2.increase(2, mockFunc);
    wrapper.update();
    expect(mockFunc).toHaveBeenCalledTimes(2);
    expect(sliderItem2.getValue()).toBe(5);
  });

  it("decrease(value, setStateCallBack)", () => {
    let slider, sliderItem1, sliderItem2;
    const wrapper = mount(
      <UU5.Bricks.Slider id={"uuID01"} ref_={(_slider) => (slider = _slider)}>
        <UU5.Bricks.Slider.Item
          ref_={(_sliderItem1) => (sliderItem1 = _sliderItem1)}
          id={"uuID02"}
          content="1"
          value={0}
        />
        <UU5.Bricks.Slider.Item
          ref_={(_sliderItem2) => (sliderItem2 = _sliderItem2)}
          id={"uuID03"}
          content="2"
          value={3}
        />
      </UU5.Bricks.Slider>
    );
    const mockFunc = jest.fn();
    expect(sliderItem2.getValue()).toBe(3);
    sliderItem2.decrease(3, mockFunc);
    wrapper.update();
    expect(mockFunc).toHaveBeenCalledTimes(1);
    expect(sliderItem2.getValue()).toBe(0);
    sliderItem2.decrease(3, mockFunc);
    wrapper.update();
    expect(mockFunc).toHaveBeenCalledTimes(2);
    expect(sliderItem2.getValue()).toBe(0);
  });
});
