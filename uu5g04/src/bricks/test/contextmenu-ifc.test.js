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

describe(`UU5.Bricks.ContextMenu interface testing`, () => {
  let container;
  beforeEach(function () {
    container = document.createElement("div");
    document.body.appendChild(container);
  });
  afterEach(function () {
    container.remove();
  });

  it("Take snapshot with shallow without crash", () => {
    const wrapper = shallow(
      <UU5.Bricks.ContextMenu id={"uuID-contextMenu"} header="Header" footer="Footer">
        <UU5.Bricks.ContextMenu.Item id={"uuID-item01"} label="Ráno" icon="mdi-weather-sunset-up" space />
      </UU5.Bricks.ContextMenu>
    );
    expect(wrapper).toMatchSnapshot();
  });

  it("open(opt)", () => {
    const wrapper = mount(
      <UU5.Bricks.ContextMenu id={"uuID-contextMenu"} header="Header" footer="Footer">
        <UU5.Bricks.ContextMenu.Item id={"uuID-item01"} label="Ráno" icon="mdi-weather-sunset-up" space />
      </UU5.Bricks.ContextMenu>,
      { attachTo: container }
    );
    expect(wrapper.instance().isOpen()).toBeFalsy();
    expect(wrapper.find("Popover").instance().state.hidden).toBeTruthy();
    const returnValue = wrapper.instance().open();
    wrapper.update();
    expect(wrapper.find("Popover").instance().state.hidden).toBeFalsy();
    expect(wrapper.instance().isOpen()).toBeTruthy();
  });

  it("close(opt) show is true", () => {
    const wrapper = mount(
      <UU5.Bricks.ContextMenu id={"uuID-contextMenu"} shown={true} header="Header" footer="Footer">
        <UU5.Bricks.ContextMenu.Item id={"uuID-item01"} label="Ráno" icon="mdi-weather-sunset-up" space />
      </UU5.Bricks.ContextMenu>,
      { attachTo: container }
    );
    expect(wrapper.instance().isOpen()).toBeTruthy();
    expect(wrapper.find("Popover").instance().state.hidden).toBeFalsy();
    const returnValue = wrapper.instance().close();
    wrapper.update();
    expect(wrapper.find("Popover").instance().state.hidden).toBeTruthy();
    expect(wrapper.instance().isOpen()).toBeFalsy();
  });

  it("isOpen() show is true", () => {
    const wrapper = mount(
      <UU5.Bricks.ContextMenu id={"uuID-contextMenu"} header="Header" shown={true} footer="Footer">
        <UU5.Bricks.ContextMenu.Item id={"uuID-item01"} label="Ráno" icon="mdi-weather-sunset-up" space />
      </UU5.Bricks.ContextMenu>,
      { attachTo: container }
    );
    expect(wrapper.instance().isOpen()).toBeTruthy();
  });

  it("isOpen() show is false", () => {
    const wrapper = mount(
      <UU5.Bricks.ContextMenu id={"uuID-contextMenu"} header="Header" shown={false} footer="Footer">
        <UU5.Bricks.ContextMenu.Item id={"uuID-item01"} label="Ráno" icon="mdi-weather-sunset-up" space />
      </UU5.Bricks.ContextMenu>,
      { attachTo: container }
    );
    expect(wrapper.instance().isOpen()).toBeFalsy();
  });
});
