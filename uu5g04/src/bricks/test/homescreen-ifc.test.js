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

// make userAgent settable
if (
  !window.navigator.hasOwnProperty("userAgent") ||
  !Object.getOwnPropertyDescriptor(window.navigator, "userAgent").set
) {
  let userAgent = window.navigator.userAgent;
  Object.defineProperty(window.navigator, "userAgent", {
    get() {
      return userAgent;
    },
    set(value) {
      userAgent = value;
    },
  });
}

describe(`UU5.Bricks.HomeScreen interface testing`, () => {
  it("activate(setStateCallBack)", () => {
    // change userAgent to Safari on iOS 10 to pass homescreen detection
    // and use fake timers because activation is async operation
    jest.useFakeTimers();
    let origUserAgent = window.navigator.userAgent;
    window.navigator.userAgent =
      "Mozilla/5.0 (iPhone; CPU iPhone OS 10_0_1 like Mac OS X) AppleWebKit/602.1.50 (KHTML, like Gecko) Version/10.0 Mobile/14A403 Safari/602.1";
    try {
      const wrapper = shallow(
        <UU5.Bricks.HomeScreen
          screenSize={"xs"}
          id={"uuID"}
          startDelay={1000}
          message="Something"
          lifespan={30000}
          displayPace={0}
        />
      );
      expect(wrapper).toMatchSnapshot();
      const mockFunc = jest.fn();
      const returnValue = wrapper.instance().activate(mockFunc);
      jest.runAllTimers();
      wrapper.update();
      expect(wrapper).toMatchSnapshot();
      expect(mockFunc).toBeCalled();
      expect(mockFunc).toHaveBeenCalledTimes(1);
      expect(returnValue === wrapper.instance()).toBe(true);
    } finally {
      window.navigator.userAgent = origUserAgent;
    }
  });
});
