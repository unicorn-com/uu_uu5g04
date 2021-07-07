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

const CONFIG = {
  mixins: ["UU5.Common.BaseMixin", "UU5.Common.ElementaryMixin", "UU5.Common.ColorSchemaMixin"],

  props: {
    size: {
      values: ["s", "m", "l", "xl"],
    },
    borderRadius: {
      values: ["8", "15"],
    },
    bgStyle: {
      values: ["filled", "outline", "transparent", "underline"],
    },
    topVisitedStep: {
      values: [0, 5],
    },
    currentStep: {
      values: [0, 4],
    },
    elevation: {
      values: ["-1", "0", "1", "2", "3", "4", "5", -1, 0, 1, 2, 3, 4, 5],
    },
    index: {
      values: [0, 3],
    },
  },
  requiredProps: {
    parent: shallow(<UU5.Bricks.Stepper id={"idParent"} />).instance(),
  },
};

describe(`UU5.Bricks.Stepper.Item props`, () => {
  UU5.Test.Tools.testProperties(UU5.Bricks.Stepper.Item, CONFIG);
});

describe(`UU5.Bricks.Stepper.Item  props.function `, () => {
  it(`UU5.Bricks.Stepper.Item - onClick()`, () => {
    let mockFn = jest.fn();
    let secondItem;
    let fourItem;
    const wrapper = mount(
      <UU5.Bricks.Stepper id={"uuID"} onClick={mockFn} currentStep={2} topVisitedStep={3}>
        <UU5.Bricks.Stepper.Item>Dokoncený krok</UU5.Bricks.Stepper.Item>
        <UU5.Bricks.Stepper.Item ref_={(comp) => (secondItem = comp)}>Dokoncený krok</UU5.Bricks.Stepper.Item>
        <UU5.Bricks.Stepper.Item>Aktivní krok</UU5.Bricks.Stepper.Item>
        <UU5.Bricks.Stepper.Item ref_={(comp2) => (fourItem = comp2)}>Následujicí krok</UU5.Bricks.Stepper.Item>
        <UU5.Bricks.Stepper.Item>Následujicí krok</UU5.Bricks.Stepper.Item>
      </UU5.Bricks.Stepper>
    );

    wrapper.find(UU5.Bricks.Button).at(1).simulate("click");
    wrapper.find(UU5.Bricks.Button).at(4).simulate("click");

    expect(mockFn).toHaveBeenCalledTimes(1);
    let opt = mockFn.mock.calls[0][0];
    expect(opt).toMatchObject({
      value: 1,
    });
    expect(opt.component === secondItem).toBeTruthy();
    expect(opt.event).toBeTruthy();
    //trying click on disabled step
    expect(opt.component === fourItem).toBeFalsy();
  });
});
