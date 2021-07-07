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

describe("UU5.Common.UUData interface test", () => {
  it("test01 - parse()", () => {
    UU5.Environment.uu5DataMap["someKey"] = {
      jest: "22.4.2",
      jestenvironmentjsdom: "^22.4.3",
      jestenvironmentjsdomglobal: "^1.0.3",
      jesthtmlreporter: "^0.6.0",
      jestlocalstoragemock: "2.2.0",
      jestresolve: "22.4.2",
    };
    let ifc = UU5.Common.UU5Data.parse("someKey");
    expect(() => {
      ifc;
    }).not.toThrow();
    expect(ifc).toEqual(
      expect.objectContaining({
        jest: "22.4.2",
        jestenvironmentjsdom: "^22.4.3",
        jestenvironmentjsdomglobal: "^1.0.3",
        jesthtmlreporter: "^0.6.0",
        jestlocalstoragemock: "2.2.0",
        jestresolve: "22.4.2",
      })
    );
  });

  it("test01 - parse(<uu5data/>someKey)", () => {
    UU5.Environment.uu5DataMap["someKey"] = {
      jest: "22.4.2",
      jestenvironmentjsdom: "^22.4.3",
      jestenvironmentjsdomglobal: "^1.0.3",
      jesthtmlreporter: "^0.6.0",
      jestlocalstoragemock: "2.2.0",
      jestresolve: "22.4.2",
    };
    let ifc = UU5.Common.UU5Data.parse("<uu5data/>someKey");
    expect(() => {
      ifc;
    }).not.toThrow();
    expect(ifc).toEqual(
      expect.objectContaining({
        jest: "22.4.2",
        jestenvironmentjsdom: "^22.4.3",
        jestenvironmentjsdomglobal: "^1.0.3",
        jesthtmlreporter: "^0.6.0",
        jestlocalstoragemock: "2.2.0",
        jestresolve: "22.4.2",
      })
    );
  });

  it("parse(<uu5data/>deeper.nested.key)", () => {
    UU5.Environment.uu5DataMap = {
      deeper: {
        nested: {
          key: "value",
        },
      },
    };
    let parsed;
    expect(() => (parsed = UU5.Common.UU5Data.parse("<uu5data/>deeper.nested.key"))).not.toThrow();
    expect(parsed).toBe("value");

    expect(() => (parsed = UU5.Common.UU5Data.parse("<uu5data/>deeper.nonExisting.key"))).not.toThrow();
    expect(parsed).toBe(undefined);

    UU5.Environment.uu5DataMap = undefined;
    expect(() => (parsed = UU5.Common.UU5Data.parse("<uu5data/>deeper.nonExisting.key"))).not.toThrow();
    expect(parsed).toBe(undefined);
  });
});
