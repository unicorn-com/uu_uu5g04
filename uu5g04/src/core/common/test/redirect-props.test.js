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

const { mount, shallow, wait } = UU5.Test.Tools;

describe(`UU5.Common.Redirect custom props testing`, () => {
  it("redirect with absolute uri", () => {
    const mockFunc = jest.fn();
    window.open = mockFunc;

    shallow(<UU5.Common.Redirect uri="https://www.unicorn.com" />, {
      disableLifecycleMethods: false,
    });

    expect(mockFunc).toBeCalled();
    expect(mockFunc.mock.calls[0][0]).toBe("https://www.unicorn.com");
    expect(mockFunc.mock.calls[0][1]).toBe("_self");
  });

  it("redirect with appBasePath relative uri", () => {
    const mockFunc = jest.fn();
    window.open = mockFunc;
    let origGABP = UU5.Environment.getAppBasePath;

    UU5.Environment.getAppBasePath = () => "/a-b/c-d/";
    shallow(<UU5.Common.Redirect uri="aboutBook" />, {
      disableLifecycleMethods: false,
    });

    expect(mockFunc).toBeCalled();
    expect(mockFunc.mock.calls[0][0]).toBe("http://example.com/a-b/c-d/aboutBook");
    // http://example.com is the basePath

    UU5.Environment.getAppBasePath = origGABP;
  });
});
