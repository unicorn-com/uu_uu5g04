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

describe("UU5.Bricks.Tabs interface testing", () => {
  it("setActive(name)", () => {
    const wrapper = shallow(
      <UU5.Bricks.Tabs id={"uuID01"}>
        <UU5.Bricks.Tabs.Item id={"uuID02"} header="Tab 1">
          This is content first tabs item
        </UU5.Bricks.Tabs.Item>
        <UU5.Bricks.Tabs.Item id={"uuID03"} header="Tab 2" name="tab2">
          This is content second tabs item
        </UU5.Bricks.Tabs.Item>
        <UU5.Bricks.Tabs.Item id={"uuID04"} header="Tab 3">
          This is content third tabs item
        </UU5.Bricks.Tabs.Item>
      </UU5.Bricks.Tabs>
    );
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.instance().state.activeName).toBeNull();
    const returnValue = wrapper.instance().setActive("tab2");
    wrapper.update();
    expect(wrapper.instance().state.activeName).toMatch(/tab2/);
    expect(wrapper).toMatchSnapshot();
    expect(returnValue).toBe(wrapper.instance());
  });
});
