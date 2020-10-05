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

import UU5 from "uu5g04";
import "uu5g04-bricks";

const { mount, shallow, wait } = UU5.Test.Tools;

const items = [
  { label: "Low", value: "low" },
  { label: "Normal", value: "normal" },
  { label: "High", value: "high" },
];

const CONFIG = {
  mixins: ["UU5.Common.BaseMixin", "UU5.Common.ElementaryMixin"],
  props: {
    value: {
      values: [undefined, "low", "normal", "high"],
    },
    size: {
      values: ["s", "m", "l", "xl"],
    },
    width: {
      values: [undefined, 400, "5em"],
    },
    readOnly: {
      values: [false, true],
    },
    colorSchema: {
      values: [undefined, "red", "red-rich", "grey", "grey-rich", "white", "black"],
    },
    bgStyle: {
      values: [undefined, "outline", "underline", "filled", "transparent"],
    },
    elevation: {
      values: [undefined, 1, 5, -1],
    },
    borderRadius: {
      values: [undefined, 8, "50%"],
    },
    borderWidth: {
      values: [undefined, 2, 3],
    },
    borderWidthFocus: {
      values: [undefined, 2, 3],
    },
  },
  requiredProps: {
    items: items,
  },
  opt: {
    shallowOpt: {
      disableLifecycleMethods: false,
    },
  },
};

describe(`UU5.Bricks.SwitchSelector props testing`, () => {
  UU5.Test.Tools.testProperties(UU5.Bricks.SwitchSelector, CONFIG);

  it(`UU5.Bricks.SwitchSelector onChange with items()`, () => {
    const onChangeFn = jest.fn();
    const wrapper = mount(<UU5.Bricks.SwitchSelector items={items} onChange={onChangeFn} />);
    const button = wrapper.find("button").at(2);

    button.simulate("click");
    expect(onChangeFn).toHaveBeenCalledTimes(1);
  });
});
