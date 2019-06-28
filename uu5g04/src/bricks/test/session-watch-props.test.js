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
import { mount } from "enzyme";
import UU5 from "uu5g04";
import "uu5g04-bricks";
import TestTools from "../../core/test/test-tools.js";

import MockSession from "../../core/test/mock-session.js";

let origIsTrustedDomain;
beforeEach(async () => {
  MockSession.currentSession = MockSession.init(undefined, { identity: MockSession.TEST_IDENTITY });
  UU5.Environment.session = MockSession.currentSession;
  origIsTrustedDomain = UU5.Environment.isTrustedDomain;
  UU5.Environment.isTrustedDomain = () => true;
});
afterEach(() => {
  UU5.Environment.session = undefined;
  UU5.Environment.isTrustedDomain = origIsTrustedDomain;
});

const TagName = "UU5.Bricks.SessionWatch";

const CONFIG = {
  mixins: ["UU5.Common.BaseMixin", "UU5.Common.ElementaryMixin", "UU5.Common.ContentMixin", "UU5.Common.IdentityMixin"],
  props: {
    header: {
      values: ["Custom header", undefined]
    }
  },
  requiredProps: {},
  opt: {
    enzymeToJson: false
  }
};

describe(`${TagName} props testing`, () => {
  TestTools.testProperties(TagName, CONFIG);
});

describe(`${TagName} basic flow`, () => {
  it(`session becomes expiring after mount`, () => {
    let wrapper = mount(<UU5.Bricks.SessionWatch />);
    expect(wrapper.find(".uu5-bricks-session-watch.uu5-common-hidden").length).toBe(1);
    MockSession.currentSession.setExpiring();
    wrapper.update();
    expect(wrapper.find(".uu5-bricks-session-watch.uu5-common-hidden").length).toBe(0);
    wrapper.unmount();
  });

  it(`session is already expiring during mount`, () => {
    MockSession.currentSession.setExpiring();
    let wrapper = mount(<UU5.Bricks.SessionWatch />);
    expect(wrapper.find(".uu5-bricks-session-watch.uu5-common-hidden").length).toBe(0);
    wrapper.unmount();
  });
});
