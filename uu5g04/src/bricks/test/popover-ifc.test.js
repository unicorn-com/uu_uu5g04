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

describe("UU5.Bricks.Popover ifc testing", () => {
  // IFC methods require "mount" instead of "shallow" because they use document.getElementById...
  it("open()", () => {
    let popover;
    const wrapper = mount(
      <UU5.Bricks.Popover id={"uuID"} shown={false} header="Header" footer="Footer" ref_={(ref) => (popover = ref)}>
        <UU5.Bricks.Div id={"uuID2"} style={{ textAlign: "center", width: "100%" }}>
          <UU5.Bricks.Button id={"uuID3"} bgStyle="transparent" content="OK" />
          <br />
          <UU5.Bricks.Button id={"uuID4"} bgStyle="transparent" content="Storno" />
        </UU5.Bricks.Div>
      </UU5.Bricks.Popover>
    );
    expect(popover.isOpen()).toBeFalsy();
    const returnValue = popover.open();
    wrapper.update();
    expect(popover.isOpen()).toBeTruthy();
    expect(returnValue).toBe(popover);
  });

  it("close()", () => {
    let popover;
    const wrapper = mount(
      <UU5.Bricks.Popover id={"uuID"} shown header="Header" footer="Footer" ref_={(ref) => (popover = ref)}>
        <UU5.Bricks.Div id={"uuID2"} style={{ textAlign: "center", width: "100%" }}>
          <UU5.Bricks.Button id={"uuID3"} bgStyle="transparent" content="OK" />
          <br />
          <UU5.Bricks.Button id={"uuID4"} bgStyle="transparent" content="Storno" />
        </UU5.Bricks.Div>
      </UU5.Bricks.Popover>
    );
    const mockFunc = jest.fn();
    expect(popover.isOpen()).toBeTruthy();
    const returnValue = popover.close(mockFunc);
    wrapper.update();
    expect(popover.isOpen()).toBeFalsy();
    expect(mockFunc).toBeCalled();
    expect(mockFunc).toHaveBeenCalledTimes(1);
    expect(returnValue).toBe(popover);
  });

  it("isOpen() should return true", () => {
    let popover;
    mount(
      <UU5.Bricks.Popover id={"uuID"} shown header="Header" footer="Footer" ref_={(ref) => (popover = ref)}>
        <UU5.Bricks.Div id={"uuID2"} style={{ textAlign: "center", width: "100%" }}>
          <UU5.Bricks.Button id={"uuID3"} bgStyle="transparent" content="OK" />
          <br />
          <UU5.Bricks.Button id={"uuID4"} bgStyle="transparent" content="Storno" />
        </UU5.Bricks.Div>
      </UU5.Bricks.Popover>
    );
    expect(popover.isOpen()).toBeTruthy();
  });

  it("isOpen() should return false", () => {
    let popover;
    mount(
      <UU5.Bricks.Popover id={"uuID"} shown={false} header="Header" footer="Footer" ref_={(ref) => (popover = ref)}>
        <UU5.Bricks.Div id={"uuID2"} style={{ textAlign: "center", width: "100%" }}>
          <UU5.Bricks.Button id={"uuID3"} bgStyle="transparent" content="OK" />
          <br />
          <UU5.Bricks.Button id={"uuID4"} bgStyle="transparent" content="Storno" />
        </UU5.Bricks.Div>
      </UU5.Bricks.Popover>
    );
    expect(popover.isOpen()).toBeFalsy();
  });
});
