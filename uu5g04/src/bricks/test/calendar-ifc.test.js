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

let origDateNow = Date.now;
beforeEach(() => {
  Date.now = () => new Date(1548411167098);
});
afterEach(() => {
  Date.now = origDateNow;
});

let mockElement = document.createElement("div");
document.body.appendChild(mockElement);

let firstDate = new Date("2019-01-01T00:00:00").getTime();
let lastDate = new Date("2019-01-31T00:00:00").getTime();

describe(`UU5.Bricks.Calendar interface function`, () => {
  it(`UU5.Bricks.Calendar getValue`, () => {
    const wrapper = mount(<UU5.Bricks.Calendar value={new Date(firstDate)} />, {
      attachTo: mockElement
    });
    expect(
      wrapper
        .instance()
        .getValue()
        .getTime()
    ).toEqual(firstDate);
    wrapper.unmount();
  });

  it(`UU5.Bricks.Calendar setValue`, () => {
    const wrapper = mount(<UU5.Bricks.Calendar />, {
      attachTo: mockElement
    });
    expect(wrapper.instance().state.value).toBe(null);
    wrapper.instance().setValue(new Date(lastDate));
    expect(wrapper.instance().state.value.getTime()).toEqual(lastDate);
    wrapper.unmount();
  });

  it(`UU5.Bricks.Calendar setNext`, () => {
    const wrapper = mount(<UU5.Bricks.Calendar />, {
      attachTo: mockElement
    });
    let oldMonth = wrapper
      .find(".uu5-bricks-calendar-head-cell-header")
      .instance()
      .innerHTML.match(/\w+/)[0];
    wrapper.instance().setNext();
    wrapper.update();
    let newMonth = wrapper
      .find(".uu5-bricks-calendar-head-cell-header")
      .instance()
      .innerHTML.match(/\w+/)[0];
    expect(oldMonth).not.toMatch(newMonth);
    wrapper.unmount();
  });

  it(`UU5.Bricks.Calendar setPrevious`, () => {
    const wrapper = mount(<UU5.Bricks.Calendar />, {
      attachTo: mockElement
    });
    let oldMonth = wrapper
      .find(".uu5-bricks-calendar-head-cell-header")
      .instance()
      .innerHTML.match(/\w+/)[0];
    wrapper.instance().setPrevious();
    wrapper.update();
    let newMonth = wrapper
      .find(".uu5-bricks-calendar-head-cell-header")
      .instance()
      .innerHTML.match(/\w+/)[0];
    expect(oldMonth).not.toMatch(newMonth);
    wrapper.unmount();
  });
});
