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

const CONFIG = {
  mixins: [
    "UU5.Common.BaseMixin",
    "UU5.Common.ElementaryMixin",
    "UU5.Common.NestingLevelMixin",
    "UU5.Common.ColorSchemaMixin",
    "UU5.Common.ResizeMixin"
  ],
  props: {
    size: {
      values: ["s", "m", "l", "xl"]
    },
    orientation: {
      values: ["vertical", "horizontal"]
    },
    topVisitedStep: {
      values: [0, 5]
    },
    currentStep: {
      values: [0, 7]
    },
    alignment: {
      values: ["left", "center", "right"]
    },
    elevation: {
      values: ["0", "1", "2", "3", "4", "5", 0, 1, 2, 3, 4, 5]
    },
    itemProps: {
      elevation: {
        values: ["0", "1", "2", "3", "4", "5", 0, 1, 2, 3, 4, 5]
      },
      bgStyle: {
        values: ["filled", "outline", "transparent", "underline"]
      },
      borderRadius: {
        values: ["8", "15"]
      }
    }
  },
  requiredProps: {
    children: [
      <UU5.Bricks.Stepper.Item id={"childID"}>
        Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Class aptent taciti sociosqu ad litora
      </UU5.Bricks.Stepper.Item>
    ]
  }
};

describe(`UU5.Bricks.Stepper props`, () => {
  UU5.Test.Tools.testProperties(UU5.Bricks.Stepper, CONFIG);
});

describe(`UU5.Bricks.Stepper  props.function `, () => {
  it(`UU5.Bricks.Stepper - onClick()`, () => {
    let mockFn = jest.fn();
    let secondItem;
    let fiveItem;
    const wrapper = mount(
      <UU5.Bricks.Stepper id={"uuID"} onClick={mockFn} currentStep={2} topVisitedStep={3}>
        <UU5.Bricks.Stepper.Item>Dokončený krok</UU5.Bricks.Stepper.Item>
        <UU5.Bricks.Stepper.Item ref_={comp => (secondItem = comp)}>Dokončený krok</UU5.Bricks.Stepper.Item>
        <UU5.Bricks.Stepper.Item>Aktivní krok</UU5.Bricks.Stepper.Item>
        <UU5.Bricks.Stepper.Item>Následujicí krok</UU5.Bricks.Stepper.Item>
        <UU5.Bricks.Stepper.Item ref_={comp2 => (fiveItem = comp2)}>Následujicí krok</UU5.Bricks.Stepper.Item>
      </UU5.Bricks.Stepper>
    );

    wrapper
      .find(UU5.Bricks.Button)
      .at(1)
      .simulate("click");
    wrapper
      .find(UU5.Bricks.Button)
      .at(4)
      .simulate("click");

    expect(mockFn).toHaveBeenCalledTimes(1);
    let opt = mockFn.mock.calls[0][0];
    expect(opt).toMatchObject({
      value: 1
    });
    expect(opt.component === secondItem).toBeTruthy();
    expect(opt.event).toBeTruthy();
    //trying click on disabled step
    expect(opt.component === fiveItem).toBeFalsy();
  });
});
