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
import "uu5g04-bricks"; // UU5.Common.Loader will try to show UU5.Bricks.Loading

const { mount, wait } = UU5.Test.Tools;

const TestReady = props => <pre>Ready: {JSON.stringify(props.data, null, 2) + ""}</pre>;
const TestError = props => <pre>Error: {JSON.stringify(props.data, null, 2) + ""}</pre>;

const CONFIG = {
  mixins: ["UU5.Common.BaseMixin"],
  props: {
    // TODO This prop must be checked by custom test only...
    // method: {
    //   values: ["get"]
    // }
    loading: {
      values: [undefined, "Loading..."],
      opt: { wait: false }
    }
    // TODO This prop must be checked by custom test only...
    // reloadInterval: {
    //   values: [10000, 11000]
    // }
  },
  requiredProps: {
    // TODO This prop must be checked by custom test only...
    // uri:
    //   "https://uuos9.plus4u.net/uu-uu5libraryregistryg01-main/85849867896916817-fe96c133c895434bbd4d5b24831483f3/getLibrary",
    // data: { code: "UU5.Bricks" },
    onLoad: async () => "data",
    children: <TestReady />
  }
};

describe("UU5.Common.Loader props testing", () => {
  UU5.Test.Tools.testProperties(UU5.Common.Loader, CONFIG);

  test("onLoad", () => {
    let onLoadFn = jest.fn(async () => "data");
    let wrapper = mount(<UU5.Common.Loader onLoad={onLoadFn} data={{ test: "value" }} />);

    expect(onLoadFn).toBeCalled();
    expect(onLoadFn.mock.calls[0][0]).toBeInstanceOf(Object);
    expect(onLoadFn.mock.calls[0][0].data).toMatchObject({ test: "value" });
    expect(onLoadFn.mock.calls[0][0].done).toBeInstanceOf(Function);
    expect(onLoadFn.mock.calls[0][0].fail).toBeInstanceOf(Function);
  });
});

describe("UU5.Common.Loader behaviour", () => {
  let wrapper;

  it("checks passing of loaded data", async () => {
    wrapper = mount(
      <UU5.Common.Loader onLoad={async () => "data"} error={<TestError />}>
        <TestReady />
      </UU5.Common.Loader>
    );
    expect(wrapper.find(UU5.Bricks.Loading).length).toBe(1); // Loader is performing onLoad call and therefore displaying Loading
    expect(wrapper.find(TestError).length).toBe(0);
    expect(wrapper.find(TestReady).length).toBe(0);
    await wait();
    expect(wrapper.find(UU5.Bricks.Loading).length).toBe(0);
    expect(wrapper.find(TestError).length).toBe(0);
    expect(wrapper.find(TestReady).length).toBe(1);
    expect(wrapper.find(TestReady).props().data).toBe("data");

    // TODO This logs stuff to console, mock loader.showError() somehow.
    wrapper.setProps({
      onLoad: async () => {
        throw new Error("TestError");
      }
    });
    await wait();
    expect(wrapper.find(UU5.Bricks.Loading).length).toBe(0);
    expect(wrapper.find(TestReady).length).toBe(0);
    expect(wrapper.find(TestError).length).toBe(1);
    expect(wrapper.find(TestError).props().data).toBeInstanceOf(Error);
    expect(wrapper.find(TestError).props().data.message).toBe("TestError");
  });
});
