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
import "uu5g04-bricks";
import "uu5g04-forms";

let uu5json_data = '<uu5json/>{"style": {"fontSize": "20px","color": "red"}}';

describe("UU5.Common.UU5Json interface test", () => {
  it("parse()", () => {
    let ifc = UU5.Common.UU5Json.parse(uu5json_data);
    expect(() => {
      ifc;
    }).not.toThrow();
    expect(ifc).not.toBeNull();
    expect(ifc).toEqual(expect.objectContaining({ style: { fontSize: "20px", color: "red" } }));
  });

  it("toJson()", () => {
    let ifc = UU5.Common.UU5Json.toJson(uu5json_data);
    expect(() => {
      ifc;
    }).not.toThrow();
    expect(ifc).not.toBeNull();
    expect(ifc).toEqual(expect.stringContaining('{"style": {"fontSize": "20px","color": "red"}}'));
  });

  it("toObject()", () => {
    let uu5json = new UU5.Common.UU5Json('<uu5json/>{"style": {"fontSize": "20px","color": "red"}}');
    let ifc = uu5json.toObject();
    expect(() => {
      ifc;
    }).not.toThrow();
    expect(ifc).toEqual(expect.objectContaining({ style: { fontSize: "20px", color: "red" } }));
  });

  it("toUUJson()", () => {
    let uu5json = new UU5.Common.UU5Json('<uu5json/>{"style": {"fontSize": "20px","color": "red"}}');
    let ifc = uu5json.toUU5Json();
    expect(() => {
      ifc;
    }).not.toThrow();
    expect(ifc).toEqual(expect.stringContaining('<uu5json/>{"style": {"fontSize": "20px","color": "red"}}'));
  });

  it("clone()", () => {
    let uu5json = new UU5.Common.UU5Json('<uu5json/>{"style": {"fontSize": "20px","color": "red"}}');
    let ifc = uu5json.clone();
    expect(() => {
      ifc;
    }).not.toThrow();
    expect(ifc).toEqual(
      expect.objectContaining({
        _uu5json: '<uu5json/>{"style": {"fontSize": "20px","color": "red"}}',
        _object: { style: { fontSize: "20px", color: "red" } },
      })
    );
  });
});
