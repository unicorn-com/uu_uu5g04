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

const CONFIG = {
  mixins: [
    "UU5.Common.BaseMixin",
    "UU5.Common.ElementaryMixin",
    "UU5.Common.SwipeMixin",
    "UU5.Common.LsiMixin"
  ],
  props: {
    value: {
      values: ["12.12.2019", new Date(1548411167098)]
    },
    dateFrom: {
      values: ["15.1.2019", new Date(new Date(1548411167098).setMonth(-1))]
    },
    dateTo: {
      values: ["30.1.2019", new Date(new Date(1548411167098).setMonth(1))]
    },
    displayDate: {
      values: ["1.1.2020", new Date(new Date(1548411167098).setYear(2021))]
    },
    minSelection: {
      values: ["days", "months", "years"]
    },
    showTodayButton: {
      values: [true, false]
    },
    hideWeekNumber: {
      values: [true, false]
    },
    hidePrevSelection: {
      values: [true, false]
    },
    hideNextSelection: {
      values: [true, false]
    },
    hideOtherSections: {
      values: [true, false]
    }
    // onChange
    // onNextSelection
    // onPrevSelection
  },
  requiredProps: {},
  opt: {
    shallowOpt: {
      disableLifecycleMethods: false
    }
  }
};


describe(`UU5.Bricks.Calendar`, () => {
  UU5.Test.Tools.testProperties(UU5.Bricks.Calendar, CONFIG);
});

describe(`UU5.Bricks.Calendar props function`, () => {

  it(`UU5.Bricks.Calendar selectionMode single`, () => {
    const wrapper = mount(<UU5.Bricks.Calendar selectionMode="single" />, {
      attachTo: mockElement
    });
    expect(wrapper.instance().state.value).toBe(null);
    wrapper.find(".uu5-bricks-calendar-active-section .uu5-bricks-calendar-day-cell").first().simulate("click");
    expect(wrapper.instance().state.value).toBeInstanceOf(Date);
    expect(wrapper.instance().state.value.getTime()).toBe(firstDate);
    wrapper.unmount();
  });

  it(`UU5.Bricks.Calendar selectionMode range`, () => {
    const wrapper = mount(<UU5.Bricks.Calendar selectionMode="range" />, {
      attachTo: mockElement
    });
    expect(wrapper.instance().state.value).toBe(null);
    wrapper.find(".uu5-bricks-calendar-active-section .uu5-bricks-calendar-day-cell").first().simulate("click");
    wrapper.find(".uu5-bricks-calendar-active-section .uu5-bricks-calendar-day-cell").last().simulate("click");
    expect(Array.isArray(wrapper.instance().state.value)).toBeTruthy();
    expect(wrapper.instance().state.value.length).toBe(2);
    expect(wrapper.instance().state.value[0].getTime()).toBe(firstDate);
    expect(wrapper.instance().state.value[1].getTime()).toBe(lastDate);
    wrapper.unmount();
  });

  it(`UU5.Bricks.Calendar onChange`, () => {
    let onChangeFn = jest.fn((opt) => opt.component.onChangeDefault(opt));
    const wrapper = mount(<UU5.Bricks.Calendar onChange={onChangeFn} />, {
      attachTo: mockElement
    });
    expect(wrapper.instance().state.value).toBe(null);
    expect(onChangeFn).not.toHaveBeenCalled();
    wrapper.find(".uu5-bricks-calendar-active-section .uu5-bricks-calendar-day-cell").first().simulate("click");
    expect(onChangeFn).toBeCalled();
    let lastCall = onChangeFn.mock.calls[onChangeFn.mock.calls.length - 1];
    expect(lastCall[0]).toBeTruthy();
    expect(lastCall[0].component).toBe(wrapper.instance());
    expect(lastCall[0].value.getTime()).toBe(firstDate);
    wrapper.unmount();
  });

  it(`UU5.Bricks.Calendar onNextSelection`, () => {
    let onNextSelectionFn = jest.fn((opt) => opt.component.onNextSelectionDefault());
    const wrapper = mount(<UU5.Bricks.Calendar onNextSelection={onNextSelectionFn} />, {
      attachTo: mockElement
    });
    expect(onNextSelectionFn).not.toHaveBeenCalled();
    wrapper.find(".uu5-bricks-calendar-head-cell-next").first().simulate("click");
    expect(onNextSelectionFn).toBeCalled();
    wrapper.unmount();
  });

  it(`UU5.Bricks.Calendar onPrevSelection`, () => {
    let onPrevSelectionFn = jest.fn((opt) => opt.component.onPrevSelectionDefault());
    const wrapper = mount(<UU5.Bricks.Calendar onPrevSelection={onPrevSelectionFn} />, {
      attachTo: mockElement
    });
    expect(onPrevSelectionFn).not.toHaveBeenCalled();
    wrapper.find(".uu5-bricks-calendar-head-cell-prev").first().simulate("click");
    expect(onPrevSelectionFn).toBeCalled();
    wrapper.unmount();
  });

});








