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
import TestTools from "../../test/test-tools.js";

const Ready = (props) => (
  <pre>Ready: {JSON.stringify(props.data, null, 2) + ""}</pre>
);

const Error = (props) => (
  <pre>Error: {JSON.stringify(props.data, null, 2) + ""}</pre>
);

const TagName = "UU5.Common.Loader";

const CONFIG = {
  mixins: [
    "UU5.Common.BaseMixin"
  ],
  props: {
    method: {
      values: ["get"]
    },
    loading: {
      values: ["Loading..."]
    },
    reloadInterval: {
      values: [10000, 11000]
    }
  },
  requiredProps: {
    uri: "https://uuos9.plus4u.net/uu-uu5libraryregistryg01-main/85849867896916817-fe96c133c895434bbd4d5b24831483f3/getLibrary",
    data: { code: "UU5.Bricks" },
    children: <Ready />
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
  test("data", () => {
    TestTools.testProperty(UU5.Common.Loader, { children: <Ready /> }, "data", [{ test: "value" }], CONFIG.opt);
  });

  test("error", () => {
    TestTools.testProperty(UU5.Common.Loader, {
      children: <Ready />,
      error: <Error />,
      uri: "https://uuos9.plus4u.net/uu-uu5libraryregistryg01-main/85849867896916817-fe96c133c895434bbd4d5b24831483f3/getLibrary"
    }, "data", [{ test: "value" }], CONFIG.opt);
  });

  test("onLoad", () => {
    const mockFunc = jest.fn();

    const wrapper = shallow(<UU5.Common.Loader onLoad={mockFunc} data={{ test: "value" }} />, CONFIG.opt.shallowOpt);

    // check if click was called
    expect(mockFunc).toBeCalled();

    // another way to check parameters
    expect(mockFunc.mock.calls[0][0]).toBeInstanceOf(Object);
    expect(mockFunc.mock.calls[0][0].data.test).toBe("value");
    expect(mockFunc.mock.calls[0][0].done).toBeInstanceOf(Function);
    expect(mockFunc.mock.calls[0][0].fail).toBeInstanceOf(Function);
  });
});
