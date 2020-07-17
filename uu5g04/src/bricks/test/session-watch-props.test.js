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

const { mount, wait } = UU5.Test.Tools;

let origIsTrustedDomain;
beforeEach(async () => {
  origIsTrustedDomain = UU5.Environment.isTrustedDomain;
  UU5.Environment.isTrustedDomain = () => true;
});
afterEach(() => {
  UU5.Environment.isTrustedDomain = origIsTrustedDomain;
});

const CONFIG = {
  mixins: ["UU5.Common.BaseMixin", "UU5.Common.ElementaryMixin", "UU5.Common.ContentMixin", "UU5.Common.IdentityMixin"],
  props: {
    header: {
      values: ["Custom header", undefined]
    }
  },
  requiredProps: {},
  opt: {}
};

describe(`UU5.Bricks.SessionWatch props testing`, () => {
  UU5.Test.Tools.testProperties(UU5.Bricks.SessionWatch, CONFIG);
});

describe(`UU5.Bricks.SessionWatch basic flow`, () => {
  it(`session becomes expiring after mount`, async () => {
    let wrapper = mount(<UU5.Bricks.SessionWatch />);
    expect(wrapper.find(".uu5-bricks-session-watch.uu5-common-hidden").length).toBe(1);
    await UU5.Test.Session.setExpiring();
    await wait(50); // SessionWatch renders Modal with animation which renders 1st time as hidden and after 1 animationFrame it gets visible (due to CSS transitions) - wait for animationFrame
    expect(wrapper.find(".uu5-bricks-session-watch.uu5-common-hidden").length).toBe(0);
  });

  it(`session is already expiring during mount`, async () => {
    await UU5.Test.Session.setExpiring();
    let wrapper = mount(<UU5.Bricks.SessionWatch />);
    await wait(50); // SessionWatch renders Modal with animation which renders 1st time as hidden and after 1 animationFrame it gets visible (due to CSS transitions) - wait for animationFrame
    expect(wrapper.find(".uu5-bricks-session-watch.uu5-common-hidden").length).toBe(0);
  });
});
