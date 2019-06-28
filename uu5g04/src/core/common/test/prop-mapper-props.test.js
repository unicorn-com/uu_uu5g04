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
import {shallow, mount} from 'enzyme';
import UU5 from "uu5g04";
import "uu5g04-bricks";
import TestTools from "../../test/test-tools.js";

const mockData = {
  name: 'John',
  surname: 'Doe',
  age: 25,
  country: 'USA',
  state: 'California',
  city: 'Los Angeles'
}

const TagName = "UU5.Common.PropMapper";

const CONFIG = {
  mixins: [
    "UU5.Common.BaseMixin"
  ],
  props: {
    mapping: {
      values: [{ "surname": "header", "name": "content", "state": "footer" }, { "city": "header", "state": "content", "country": "footer" }]
    }
  },
  requiredProps: {
    data: mockData,
    children: <UU5.Bricks.Container />
  },
  opt: {
    shallowOpt: {
      disableLifecycleMethods: false
    },
    enzymeToJson: false
  }
};

describe(`${TagName} props testing`, () => {
  TestTools.testProperties(TagName, CONFIG);
});

describe(`${TagName} custom props testing`, () => {
  test("with loader", () => {
    const onLoadFn = dtoIn => {
      dtoIn.done(mockData)
    };

    const wrapper = mount(
      <UU5.Common.Loader onLoad={onLoadFn}>
        <UU5.Common.PropMapper mapping={{ "name": "content" }}>
          <UU5.Bricks.Row />
        </UU5.Common.PropMapper>
      </UU5.Common.Loader>
    );
    wrapper.update();
    expect(wrapper.html()).toMatchSnapshot();
  });
});
