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

import React from "react";
import UU5 from "uu5g04";
import "uu5g04-bricks";

const { mount, shallow, wait } = UU5.Test.Tools;

const mockData = {
  name: "John",
  surname: "Doe",
  age: 25,
  country: "USA",
  state: "California",
  city: "Los Angeles",
};

const CONFIG = {
  mixins: ["UU5.Common.BaseMixin"],
  props: {
    mapping: {
      values: [
        { surname: "header", name: "content", state: "footer" },
        { city: "header", state: "content", country: "footer" },
      ],
    },
  },
  requiredProps: {
    data: mockData,
    children: <UU5.Bricks.Container />,
  },
  opt: {
    shallowOpt: {
      disableLifecycleMethods: false,
    },
  },
};

describe(`UU5.Common.PropMapper props testing`, () => {
  UU5.Test.Tools.testProperties(UU5.Common.PropMapper, CONFIG);
});

describe(`UU5.Common.PropMapper custom props testing`, () => {
  test("with loader", () => {
    const onLoadFn = (dtoIn) => {
      dtoIn.done(mockData);
    };

    const wrapper = mount(
      <UU5.Common.Loader onLoad={onLoadFn}>
        <UU5.Common.PropMapper mapping={{ name: "content" }}>
          <UU5.Bricks.Row />
        </UU5.Common.PropMapper>
      </UU5.Common.Loader>
    );
    wrapper.update();
    expect(wrapper.html()).toMatchSnapshot();
  });
});
