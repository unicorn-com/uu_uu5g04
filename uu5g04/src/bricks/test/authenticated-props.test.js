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
import { shallow, mount } from "enzyme";
import UU5 from "uu5g04";
import "uu5g04-bricks";
import enzymeToJson from "enzyme-to-json";
import regeneratorRuntime from "regenerator-runtime";

import TestTools from "../../core/test/test-tools.js";
import MockSession from "../../core/test/mock-session.js";

let mockSession = MockSession.init();
beforeEach(() => {
  UU5.Environment.session = mockSession;
  mockSession.setPending();
});
afterEach(() => {
  UU5.Environment.session = undefined;
});

const TagName = "UU5.Bricks.Authenticated";

const CONFIG = {
  mixins: ["UU5.Common.BaseMixin", "UU5.Common.IdentityMixin", "UU5.Common.ContentMixin"],
  props: {
    authenticated: {
      values: [true, false]
    },
    notAuthenticated: {
      values: [true, false]
    },
    pending: {
      values: [true, false]
    }
  },
  requiredProps: {
    content: "Content to render"
  },
  opt: {
    enzymeToJson: false
  }
};

describe(`${TagName}`, () => {
  TestTools.testProperties(TagName, CONFIG);
});

describe(`${TagName} content based on Session state`, () => {
  it("default props", async () => {
    const wrapper = shallow(
      <UU5.Bricks.Authenticated>
        <div id="content" />
      </UU5.Bricks.Authenticated>
    );
    expect(wrapper.find("#content").length).toBe(0);

    await mockSession.setIdentity(null);
    expect(wrapper.find("#content").length).toBe(0);

    await mockSession.setIdentity(MockSession.TEST_IDENTITY);
    wrapper.update();
    expect(wrapper.find("#content").length).toBe(0);
  });

  it("pending", async () => {
    const wrapper = mount(
      <UU5.Bricks.Authenticated pending>
        <div id="content" />
      </UU5.Bricks.Authenticated>
    );
    expect(wrapper.find("#content").length).toBeGreaterThan(0);

    await mockSession.setIdentity(null);
    wrapper.update();
    expect(wrapper.find("#content").length).toBe(0);

    await mockSession.setIdentity(MockSession.TEST_IDENTITY);
    wrapper.update();
    expect(wrapper.find("#content").length).toBe(0);
  });

  it("notAuthenticated", async () => {
    const wrapper = mount(
      <UU5.Bricks.Authenticated notAuthenticated>
        <div id="content" />
      </UU5.Bricks.Authenticated>
    );
    expect(wrapper.find("#content").length).toBe(0);

    await mockSession.setIdentity(null);
    wrapper.update();
    expect(wrapper.find("#content").length).toBeGreaterThan(0);

    await mockSession.setIdentity(MockSession.TEST_IDENTITY);
    wrapper.update();
    expect(wrapper.find("#content").length).toBe(0);
  });

  it("authenticated", async () => {
    const wrapper = mount(
      <UU5.Bricks.Authenticated authenticated>
        <div id="content" />
      </UU5.Bricks.Authenticated>
    );
    expect(wrapper.find("#content").length).toBe(0);

    await mockSession.setIdentity(null);
    wrapper.update();
    expect(wrapper.find("#content").length).toBe(0);

    await mockSession.setIdentity(MockSession.TEST_IDENTITY);
    wrapper.update();
    expect(wrapper.find("#content").length).toBeGreaterThan(0);
  });

  it("pending + notAuthenticated", async () => {
    const wrapper = mount(
      <UU5.Bricks.Authenticated pending notAuthenticated>
        <div id="content" />
      </UU5.Bricks.Authenticated>
    );
    expect(wrapper.find("#content").length).toBeGreaterThan(0);

    await mockSession.setIdentity(null);
    wrapper.update();
    expect(wrapper.find("#content").length).toBeGreaterThan(0);

    await mockSession.setIdentity(MockSession.TEST_IDENTITY);
    wrapper.update();
    expect(wrapper.find("#content").length).toBe(0);
  });

  it("pending + notAuthenticated + authenticated", async () => {
    const wrapper = mount(
      <UU5.Bricks.Authenticated pending notAuthenticated authenticated>
        <div id="content" />
      </UU5.Bricks.Authenticated>
    );
    expect(wrapper.find("#content").length).toBeGreaterThan(0);

    await mockSession.setIdentity(null);
    wrapper.update();
    expect(wrapper.find("#content").length).toBeGreaterThan(0);

    await mockSession.setIdentity(MockSession.TEST_IDENTITY);
    wrapper.update();
    expect(wrapper.find("#content").length).toBeGreaterThan(0);
  });

  it("all false", async () => {
    const wrapper = mount(
      <UU5.Bricks.Authenticated pending={false} notAuthenticated={false} authenticated={false}>
        <div id="content" />
      </UU5.Bricks.Authenticated>
    );
    expect(wrapper.find("#content").length).toBe(0);

    await mockSession.setIdentity(null);
    wrapper.update();
    expect(wrapper.find("#content").length).toBe(0);

    await mockSession.setIdentity(MockSession.TEST_IDENTITY);
    wrapper.update();
    expect(wrapper.find("#content").length).toBe(0);
  });
});
