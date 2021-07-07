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

describe(`UU5.Bricks.Carousel interface testing`, () => {
  it("setActiveIndex(index, setStateCallBack) - set index from 2 to 1", () => {
    const wrapper = shallow(
      <UU5.Bricks.Carousel
        id={"uuID01"}
        colorSchema="pink"
        interval={0}
        activeIndex={2}
        type="final"
        style={{ width: 350 }}
      >
        <UU5.Bricks.Carousel.Item id={"uuID02"}>
          <UU5.Bricks.Div
            id={"uuID03"}
            style={{
              backgroundImage: "url(https://images.pexels.com/photos/243971/pexels-photo-243971.jpeg?w=350&h=270)",
              height: 270,
              transform: "scale(1)",
            }}
          />
        </UU5.Bricks.Carousel.Item>
        <UU5.Bricks.Carousel.Item id={"uuID04"}>
          <UU5.Bricks.Div
            id={"uuID05"}
            style={{
              backgroundImage: "url(https://images.pexels.com/photos/639/clouds-rainy-rain-asia.jpg?w=400&h=270)",
              height: 270,
              transform: "scale(1)",
            }}
          />
        </UU5.Bricks.Carousel.Item>
        <UU5.Bricks.Carousel.Item id={"uuID06"}>
          <UU5.Bricks.Div
            id={"uuID07"}
            style={{
              backgroundImage: "url(https://images.pexels.com/photos/1553/glass-rainy-car-rain.jpg?w=400&h=270)",
              height: 270,
              transform: "scale(1)",
            }}
          />
        </UU5.Bricks.Carousel.Item>
        <UU5.Bricks.Carousel.Item id={"uuID08"}>
          <UU5.Bricks.Div
            id={"uuID09"}
            style={{
              backgroundImage: "url(https://images.pexels.com/photos/110874/pexels-photo-110874.jpeg?w=400&h=270)",
              height: 270,
              transform: "scale(1)",
            }}
          />
        </UU5.Bricks.Carousel.Item>
      </UU5.Bricks.Carousel>
    );
    const mockFunc = jest.fn();
    expect(wrapper.instance().state.activeIndex).toBe(2);
    expect(wrapper).toMatchSnapshot();
    const returnValue = wrapper.instance().setActiveIndex(1, mockFunc);
    wrapper.update();
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.instance().state.activeIndex).toBe(1);
    expect(mockFunc).toBeCalled();
    expect(mockFunc).toHaveBeenCalledTimes(1);
    expect(returnValue === wrapper.instance()).toBe(true);
  });

  it("getActiveIndex()", () => {
    const wrapper = shallow(
      <UU5.Bricks.Carousel
        id={"uuID01"}
        colorSchema="pink"
        interval={0}
        activeIndex={2}
        type="final"
        style={{ width: 350 }}
      >
        <UU5.Bricks.Carousel.Item id={"uuID02"}>
          <UU5.Bricks.Div
            id={"uuID03"}
            style={{
              backgroundImage: "url(https://images.pexels.com/photos/243971/pexels-photo-243971.jpeg?w=350&h=270)",
              height: 270,
              transform: "scale(1)",
            }}
          />
        </UU5.Bricks.Carousel.Item>
        <UU5.Bricks.Carousel.Item id={"uuID04"}>
          <UU5.Bricks.Div
            id={"uuID05"}
            style={{
              backgroundImage: "url(https://images.pexels.com/photos/639/clouds-rainy-rain-asia.jpg?w=400&h=270)",
              height: 270,
              transform: "scale(1)",
            }}
          />
        </UU5.Bricks.Carousel.Item>
        <UU5.Bricks.Carousel.Item id={"uuID06"}>
          <UU5.Bricks.Div
            id={"uuID07"}
            style={{
              backgroundImage: "url(https://images.pexels.com/photos/1553/glass-rainy-car-rain.jpg?w=400&h=270)",
              height: 270,
              transform: "scale(1)",
            }}
          />
        </UU5.Bricks.Carousel.Item>
        <UU5.Bricks.Carousel.Item id={"uuID08"}>
          <UU5.Bricks.Div
            id={"uuID09"}
            style={{
              backgroundImage: "url(https://images.pexels.com/photos/110874/pexels-photo-110874.jpeg?w=400&h=270)",
              height: 270,
              transform: "scale(1)",
            }}
          />
        </UU5.Bricks.Carousel.Item>
      </UU5.Bricks.Carousel>
    );
    const mockFunc = jest.fn();
    expect(wrapper.instance().state.activeIndex).toBe(2);
    const getIndex = wrapper.instance().getActiveIndex();
    expect(getIndex).toBe(2);
    expect(wrapper).toMatchSnapshot();
    const returnValue = wrapper.instance().setActiveIndex(3, mockFunc);
    wrapper.update();
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.instance().getActiveIndex()).toBe(3);
    expect(wrapper.instance().state.activeIndex).toBe(3);
  });

  it("setNext(setStateCallBack)", () => {
    const wrapper = shallow(
      <UU5.Bricks.Carousel
        id={"uuID01"}
        colorSchema="pink"
        interval={0}
        activeIndex={2}
        type="final"
        style={{ width: 350 }}
      >
        <UU5.Bricks.Carousel.Item id={"uuID02"}>
          <UU5.Bricks.Div
            id={"uuID03"}
            style={{
              backgroundImage: "url(https://images.pexels.com/photos/243971/pexels-photo-243971.jpeg?w=350&h=270)",
              height: 270,
              transform: "scale(1)",
            }}
          />
        </UU5.Bricks.Carousel.Item>
        <UU5.Bricks.Carousel.Item id={"uuID04"}>
          <UU5.Bricks.Div
            id={"uuID05"}
            style={{
              backgroundImage: "url(https://images.pexels.com/photos/639/clouds-rainy-rain-asia.jpg?w=400&h=270)",
              height: 270,
              transform: "scale(1)",
            }}
          />
        </UU5.Bricks.Carousel.Item>
        <UU5.Bricks.Carousel.Item id={"uuID06"}>
          <UU5.Bricks.Div
            id={"uuID07"}
            style={{
              backgroundImage: "url(https://images.pexels.com/photos/1553/glass-rainy-car-rain.jpg?w=400&h=270)",
              height: 270,
              transform: "scale(1)",
            }}
          />
        </UU5.Bricks.Carousel.Item>
        <UU5.Bricks.Carousel.Item id={"uuID08"}>
          <UU5.Bricks.Div
            id={"uuID09"}
            style={{
              backgroundImage: "url(https://images.pexels.com/photos/110874/pexels-photo-110874.jpeg?w=400&h=270)",
              height: 270,
              transform: "scale(1)",
            }}
          />
        </UU5.Bricks.Carousel.Item>
      </UU5.Bricks.Carousel>
    );
    const mockFunc = jest.fn();
    expect(wrapper.instance().state.activeIndex).toBe(2);
    expect(wrapper.instance().getActiveIndex()).toBe(2);
    expect(wrapper).toMatchSnapshot();
    const returnValue = wrapper.instance().setNext(mockFunc);
    wrapper.update();
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.instance().state.activeIndex).toBe(3);
    expect(wrapper.instance().getActiveIndex()).toBe(3);
    expect(mockFunc).toBeCalled();
    expect(mockFunc).toHaveBeenCalledTimes(1);
    expect(returnValue === wrapper.instance()).toBe(true);
  });

  it("setPrevious(setStateCallBack)", () => {
    const wrapper = shallow(
      <UU5.Bricks.Carousel
        id={"uuID01"}
        colorSchema="pink"
        interval={0}
        activeIndex={2}
        type="final"
        style={{ width: 350 }}
      >
        <UU5.Bricks.Carousel.Item id={"uuID02"}>
          <UU5.Bricks.Div
            id={"uuID03"}
            style={{
              backgroundImage: "url(https://images.pexels.com/photos/243971/pexels-photo-243971.jpeg?w=350&h=270)",
              height: 270,
              transform: "scale(1)",
            }}
          />
        </UU5.Bricks.Carousel.Item>
        <UU5.Bricks.Carousel.Item id={"uuID04"}>
          <UU5.Bricks.Div
            id={"uuID05"}
            style={{
              backgroundImage: "url(https://images.pexels.com/photos/639/clouds-rainy-rain-asia.jpg?w=400&h=270)",
              height: 270,
              transform: "scale(1)",
            }}
          />
        </UU5.Bricks.Carousel.Item>
        <UU5.Bricks.Carousel.Item id={"uuID06"}>
          <UU5.Bricks.Div
            id={"uuID07"}
            style={{
              backgroundImage: "url(https://images.pexels.com/photos/1553/glass-rainy-car-rain.jpg?w=400&h=270)",
              height: 270,
              transform: "scale(1)",
            }}
          />
        </UU5.Bricks.Carousel.Item>
        <UU5.Bricks.Carousel.Item id={"uuID08"}>
          <UU5.Bricks.Div
            id={"uuID09"}
            style={{
              backgroundImage: "url(https://images.pexels.com/photos/110874/pexels-photo-110874.jpeg?w=400&h=270)",
              height: 270,
              transform: "scale(1)",
            }}
          />
        </UU5.Bricks.Carousel.Item>
      </UU5.Bricks.Carousel>
    );
    const mockFunc = jest.fn();
    expect(wrapper.instance().state.activeIndex).toBe(2);
    expect(wrapper.instance().getActiveIndex()).toBe(2);
    expect(wrapper).toMatchSnapshot();
    const returnValue = wrapper.instance().setPrevious(mockFunc);
    wrapper.update();
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.instance().state.activeIndex).toBe(1);
    expect(wrapper.instance().getActiveIndex()).toBe(1);
    expect(mockFunc).toBeCalled();
    expect(mockFunc).toHaveBeenCalledTimes(1);
    expect(returnValue === wrapper.instance()).toBe(true);
  });
});
