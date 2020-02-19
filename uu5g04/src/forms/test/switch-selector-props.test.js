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

//@@viewOn:imports
import createReactClass from "create-react-class";
import React from "react";
import UU5 from "uu5g04";
import "uu5g04-bricks";
import "uu5g04-forms";
//@@viewOff:imports

const { mount, shallow, wait } = UU5.Test.Tools;

const items = [
  { label: "Low", value: "low" },
  { label: "Normal", value: "normal" },
  { label: "High", value: "high" }
];

//`UU5.Forms.Select`
const CONFIG = {
  mixins: ["UU5.Common.BaseMixin", "UU5.Common.ElementaryMixin", "UU5.Forms.InputMixin"],
  props: {
    value: {
      values: [undefined, "low", "normal", "high"]
    },
    size: {
      values: ["s", "m", "l", "xl"]
    },
    bgStyle: {
      values: [undefined, "outline", "underline", "filled", "transparent"]
    },
    elevation: {
      values: [undefined, 1, 5, -1]
    },
    borderRadius: {
      values: [undefined, 8, "50%"]
    }
  },
  requiredProps: {
    items
  },
  opt: {
    shallowOpt: {
      disableLifecycleMethods: false
    }
  }
};

let MOCK_BOUNDING_CLIENT_RECT_SWITCH = { left: 0, top: 0, width: 400, height: 0, right: 0, bottom: 0 };
let MOCK_BOUNDING_CLIENT_RECT_WRAPPER = { left: 0, top: 0, width: 500, height: 0, right: 0, bottom: 0 };
let MOCK_BOUNDING_CLIENT_RECT_RESIZE = { left: 0, top: 0, width: 600, height: 200, right: 0, bottom: 0 };
let origImpl = HTMLElement.prototype.getBoundingClientRect;
beforeEach(() => {
  HTMLElement.prototype.getBoundingClientRect = jest.fn(function() {
    let result;

    if (this.matches(".uu5-bricks-resize-observer")) {
      result = MOCK_BOUNDING_CLIENT_RECT_RESIZE;
    }

    if (this.matches(".uu5-bricks-switch-selector")) {
      result = MOCK_BOUNDING_CLIENT_RECT_SWITCH;
    }

    if (
      this.matches(".uu5-forms-switch-selector .uu5-forms-input-wrapper") ||
      this.matches(".uu5-forms-switch-selector .uu5-forms-hidden-wrapper")
    ) {
      result = MOCK_BOUNDING_CLIENT_RECT_WRAPPER;
    }

    return result || origImpl.apply(this, arguments);
  });
});
afterEach(() => {
  HTMLElement.prototype.getBoundingClientRect = origImpl;
});

describe(`UU5.Forms.SwitchSelector props testing`, () => {
  UU5.Test.Tools.testProperties(UU5.Forms.SwitchSelector, CONFIG);

  it(`UU5.Forms.SwitchSelector onChange with items()`, () => {
    const onChangeFn = jest.fn();
    const wrapper = mount(<UU5.Forms.SwitchSelector items={items} onChange={onChangeFn} />);
    const button = wrapper.find("button").at(2);

    button.simulate("click");
    expect(onChangeFn).toHaveBeenCalledTimes(1);
  });

  it(`UU5.Forms.SwitchSelector type rendering`, () => {
    let wrapper = mount(<UU5.Forms.SwitchSelector items={items} />);
    expect(wrapper.find(".uu5-bricks-switch-selector").length).not.toBe(0);
    MOCK_BOUNDING_CLIENT_RECT_SWITCH.width = 550; // 50 bigger than MOCK_BOUNDING_CLIENT_RECT_WRAPPER -> overflowing -> Select will be rendered
    wrapper = mount(<UU5.Forms.SwitchSelector items={items} />);
    expect(wrapper.find(".uu5-forms-select-body").length).not.toBe(0);
  });
});
