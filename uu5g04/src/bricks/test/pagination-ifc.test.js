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

describe(`UU5.Bricks.Pagination interface testing`, () => {
  it("getItemsLength()", () => {
    const wrapper = shallow(
      <UU5.Bricks.Pagination
        id={"uuID"}
        size="l"
        items={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]}
        activeIndex={2}
        nextLabel={"Další"}
        prevLabel={"Předchozí"}
        lastLabel={"Poslední"}
        firstLabel={"První"}
        range={4}
      />
    );
    expect(wrapper.instance().getItemsLength()).toBe(12);
    expect(wrapper).toMatchSnapshot();
  });

  it("getActiveIndex()", () => {
    const wrapper = shallow(
      <UU5.Bricks.Pagination
        id={"uuID"}
        size="l"
        items={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]}
        activeIndex={2}
        nextLabel={"Další"}
        prevLabel={"Předchozí"}
        lastLabel={"Poslední"}
        firstLabel={"První"}
        range={4}
      />
    );
    expect(wrapper.instance().getActiveIndex()).toBe(2);
    expect(wrapper).toMatchSnapshot();
  });

  it("setActiveIndex(true, setStateCallback)", () => {
    const wrapper = shallow(
      <UU5.Bricks.Pagination
        id={"uuID"}
        size="l"
        items={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]}
        nextLabel={"Další"}
        prevLabel={"Předchozí"}
        lastLabel={"Poslední"}
        firstLabel={"První"}
        range={4}
      />
    );
    const mockFunc = jest.fn();
    expect(wrapper.instance().getActiveIndex()).toBeFalsy();
    expect(wrapper).toMatchSnapshot();
    const returnValue = wrapper.instance().setActiveIndex(true, mockFunc);
    wrapper.update();
    expect(mockFunc).toBeCalled();
    expect(mockFunc).toHaveBeenCalledTimes(1);
    expect(returnValue).toBe(wrapper.instance());
    expect(wrapper.instance().getActiveIndex()).toBeTruthy();
    expect(wrapper).toMatchSnapshot();
  });

  it("setActiveIndex(false, setStateCallback)", () => {
    const wrapper = shallow(
      <UU5.Bricks.Pagination
        id={"uuID"}
        size="l"
        items={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]}
        nextLabel={"Další"}
        prevLabel={"Předchozí"}
        lastLabel={"Poslední"}
        firstLabel={"První"}
        range={4}
      />
    );
    const mockFunc = jest.fn();
    expect(wrapper.instance().getActiveIndex()).toBeFalsy();
    expect(wrapper).toMatchSnapshot();
    const returnValue = wrapper.instance().setActiveIndex(false, mockFunc);
    wrapper.update();
    expect(mockFunc).toBeCalled();
    expect(mockFunc).toHaveBeenCalledTimes(1);
    expect(returnValue).toBe(wrapper.instance());
    expect(wrapper.instance().getActiveIndex()).toBeFalsy();
    expect(wrapper).toMatchSnapshot();
  });

  it("setActiveIndex(number, setStateCallback)", () => {
    const wrapper = shallow(
      <UU5.Bricks.Pagination
        id={"uuID"}
        size="l"
        items={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]}
        nextLabel={"Další"}
        prevLabel={"Předchozí"}
        lastLabel={"Poslední"}
        firstLabel={"První"}
        range={4}
      />
    );
    const mockFunc = jest.fn();
    expect(wrapper.instance().getActiveIndex()).toBeFalsy();
    expect(wrapper).toMatchSnapshot();
    const returnValue = wrapper.instance().setActiveIndex(4, mockFunc);
    wrapper.update();
    expect(mockFunc).toBeCalled();
    expect(mockFunc).toHaveBeenCalledTimes(1);
    expect(returnValue).toBe(wrapper.instance());
    expect(wrapper.instance().getActiveIndex()).toBe(4);
    expect(wrapper).toMatchSnapshot();
  });

  it("increaseActiveIndex(setStateCallBack) increase from 11 to max_range", () => {
    const wrapper = shallow(
      <UU5.Bricks.Pagination
        id={"uuID"}
        size="l"
        items={[1, 2, 3]}
        nextLabel={"Další"}
        prevLabel={"Předchozí"}
        lastLabel={"Poslední"}
        firstLabel={"První"}
      />
    );
    const mockFunc = jest.fn();
    expect(wrapper.instance().state.activeIndex).toBe(0);
    expect(wrapper).toMatchSnapshot();
    const returnValue = wrapper.instance().increaseActiveIndex(mockFunc);
    wrapper.update();
    expect(mockFunc).toBeCalled();
    expect(returnValue).toBe(wrapper.instance());
    expect(wrapper.instance().state.activeIndex).toBe(1);
    expect(wrapper).toMatchSnapshot();
    wrapper.instance().increaseActiveIndex(mockFunc);
    wrapper.update();
    expect(mockFunc).toBeCalled();
    expect(wrapper.instance().state.activeIndex).toBe(2);
    expect(wrapper).toMatchSnapshot();
    //Now is active index out of range. Active index must be still 2.
    wrapper.instance().increaseActiveIndex(mockFunc);
    wrapper.update();
    expect(mockFunc).toBeCalled();
    expect(wrapper.instance().state.activeIndex).toBe(2);
    expect(wrapper).toMatchSnapshot();
  });

  it("decreaseActiveIndex(setStateCallBack) when activeIndex is 0", () => {
    const wrapper = shallow(
      <UU5.Bricks.Pagination
        id={"uuID"}
        size="l"
        items={[1, 2, 3]}
        nextLabel={"Další"}
        prevLabel={"Předchozí"}
        lastLabel={"Poslední"}
        firstLabel={"První"}
      />
    );
    const mockFunc = jest.fn();
    expect(wrapper.instance().state.activeIndex).toBe(0);
    const returnValue = wrapper.instance().decreaseActiveIndex(mockFunc);
    wrapper.update();
    expect(wrapper.instance().state.activeIndex).toBe(0);
    expect(mockFunc).toBeCalled();
    expect(returnValue).toBe(wrapper.instance());
    expect(wrapper).toMatchSnapshot();
  });

  it("decreaseActiveIndex(setStateCallBack)", () => {
    const wrapper = shallow(
      <UU5.Bricks.Pagination
        id={"uuID"}
        size="l"
        activeIndex={4}
        items={[1, 2, 3, 4, 5, 6]}
        nextLabel={"Další"}
        prevLabel={"Předchozí"}
        lastLabel={"Poslední"}
        firstLabel={"První"}
      />
    );
    const mockFunc = jest.fn();
    expect(wrapper.instance().state.activeIndex).toBe(4);
    expect(wrapper).toMatchSnapshot();
    const returnValue = wrapper.instance().decreaseActiveIndex(mockFunc);
    wrapper.update();
    expect(wrapper.instance().state.activeIndex).toBe(3);
    expect(mockFunc).toBeCalled();
    expect(returnValue).toBe(wrapper.instance());
    expect(wrapper).toMatchSnapshot();
  });
});
