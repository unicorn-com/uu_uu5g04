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

import React from 'react';
import {shallow} from 'enzyme';
import UU5 from "uu5g04";
import "uu5g04-bricks";
import TestTools from "../../core/test/test-tools.js";

const TagName = "UU5.Bricks.Button";

const CONFIG = {
  mixins: [
    "UU5.Common.BaseMixin",
    "UU5.Common.ElementaryMixin",
    "UU5.Common.NestingLevelMixin",
    "UU5.Common.ColorSchemaMixin",
    "UU5.Common.ContentMixin",
    "UU5.Common.PureRenderMixin"
  ],
  props: {
    size: {
      values: ["s", "m", "l", "xl"]
    },
    displayBlock: {
      values: [true, false]
    },
    pressed: {
      values: [true, false]
    },
    bgStyle: {
      values: ["filled", "outline", "transparent"]
    }
  },
  requiredProps: {},
  opt: {
    enzymeToJson: false
  }
};

describe(`${TagName} props testing`, () => {
  TestTools.testProperties(TagName, CONFIG);

  it(`${TagName} prop onClick`, () => {
    const This = {};
    const event = {target: {value: "On click function"}};
    const mockFunc = jest.fn();

    const wrapper = shallow(
      <UU5.Bricks.Button
        ref_={button => This._button = button}
        onClick={mockFunc}
      />
    );

    // event simulate event object of button element
    // call click event
    wrapper.find("button").simulate('click', event);

    // check if click was called
    expect(mockFunc).toBeCalled();

    // check if those parameters were send to the function
    expect(mockFunc).toBeCalledWith(This._button, event);

    // another way to check parameters
    expect(mockFunc.mock.calls[0][0]).toBe(This._button);
    expect(mockFunc.mock.calls[0][1].target).toBe(event.target);
  });


});
