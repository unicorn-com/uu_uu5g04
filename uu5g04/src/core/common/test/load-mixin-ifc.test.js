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

//@@viewOn:imports
import React from "react";
import UU5 from "uu5g04";
import createReactClass from "create-react-class";
//@@viewOff:imports

const { mount, shallow, wait } = UU5.Test.Tools;

// TODO Add testing of interface methods.

let loadCallCount;
let reloadCallCount;

beforeEach(() => {
  loadCallCount = 0;
  reloadCallCount = 0;
});

const LOAD_DURATION = 50;
const RELOAD_DURATION = 50;
const Calls = {
  load(dtoIn) {
    loadCallCount++;
    // console.log(Date.now(), "loading", loadCallCount);
    setTimeout(() => {
      dtoIn.done({ data: {} });
    }, LOAD_DURATION);
  },

  reload(dtoIn) {
    reloadCallCount++;
    // console.log(Date.now(), "reloading", reloadCallCount);
    setTimeout(() => {
      dtoIn.done({ data: {} });
    }, RELOAD_DURATION);
  },
};

const Component = createReactClass({
  mixins: [UU5.Common.BaseMixin, UU5.Common.ElementaryMixin, UU5.Common.LoadMixin],
  statics: {
    tagName: "Component",
    calls: {
      onLoad: "load",
      onReload: "reload",
    },
  },
  componentDidMount() {
    this.setCalls(Calls);
  },
  render() {
    return <div {...this.getMainAttrs()}>{this.props.children}</div>;
  },
});

// make minReloadInterval smaller than 10s
let origMinReloadInterval = Component["UU5.Common.LoadMixin"].defaults.minReloadInterval;
beforeEach(() => {
  Component["UU5.Common.LoadMixin"].defaults.minReloadInterval = 1;
});
afterEach(() => {
  Component["UU5.Common.LoadMixin"].defaults.minReloadInterval = origMinReloadInterval;
});

// NOTE We need  Date.now() to return mocked date (consistent with
// fake timers when using jest.advanceTimersByTime(time)), but Jest currently
// doesn't provide API for that - use workaround until they resolve it in
// https://github.com/facebook/jest/issues/5165
let timeDelta = 0;
let timeInterval;
let origDateNow = Date.now;
beforeEach(() => {
  Date.now = () => origDateNow.call(Date) + timeDelta;
});
afterEach(() => {
  Date.now = origDateNow;
  if (timeInterval != null) clearInterval(timeInterval);
  timeDelta = 0;
  timeInterval = null;
});
function advanceTime(time) {
  if (timeInterval == null) timeInterval = setInterval(() => (timeDelta += 10), 10);
  jest.advanceTimersByTime(time);
}

// support for Page Visibility API
let documentHidden = false;
Object.defineProperty(document, "hidden", {
  get() {
    return documentHidden;
  },
  set(v) {
    documentHidden = v;
  },
});
beforeEach(() => {
  documentHidden = false;
});
function togglePageVisibility(visible) {
  document.hidden = !visible;
  document.dispatchEvent(new Event("visibilitychange"));
}

describe(`UU5.Common.LoadMixin - load / reload handling`, () => {
  it(`basic load / reload call count`, () => {
    jest.useFakeTimers();
    const wrapper = mount(<Component reloadInterval={500} />);

    // wait some time - 1 load and 2 reloads should happen
    let expectedLoadCount = 1;
    let expectedReloadCount = 0;
    expect(loadCallCount).toBe(expectedLoadCount);
    expect(reloadCallCount).toBe(expectedReloadCount);
    advanceTime(550);
    expectedReloadCount += 1;
    expect(loadCallCount).toBe(expectedLoadCount);
    expect(reloadCallCount).toBe(expectedReloadCount);
    advanceTime(550);
    expectedReloadCount += 1;
    expect(loadCallCount).toBe(expectedLoadCount);
    expect(reloadCallCount).toBe(expectedReloadCount);

    // do reload explicitly
    wrapper.instance().forceReload();
    expectedReloadCount += 1;
    expect(loadCallCount).toBe(expectedLoadCount);
    expect(reloadCallCount).toBe(expectedReloadCount);

    // unmount - no reloads should happen anymore
    wrapper.unmount();
    advanceTime(1000);
    expect(loadCallCount).toBe(expectedLoadCount);
    expect(reloadCallCount).toBe(expectedReloadCount);
  });

  it(`disabled reload when page not visible 1`, () => {
    jest.useFakeTimers();

    const wrapper = mount(<Component reloadInterval={500} refireLoad={false} />);

    // wait for 1 load and 1 reload
    let expectedLoadCount = 1;
    let expectedReloadCount = 0;
    expect(loadCallCount).toBe(expectedLoadCount);
    expect(reloadCallCount).toBe(expectedReloadCount);
    advanceTime(510);
    expectedReloadCount += 1;
    expect(loadCallCount).toBe(expectedLoadCount);
    expect(reloadCallCount).toBe(expectedReloadCount);

    // make page invisible - reloads should not be triggering anymore
    togglePageVisibility(false);
    advanceTime(1000);
    expect(loadCallCount).toBe(expectedLoadCount);
    expect(reloadCallCount).toBe(expectedReloadCount);

    // page is invisible - forced "reload" should still do the reload
    wrapper.instance().forceReload();
    advanceTime(10);
    expectedReloadCount += 1;
    expect(loadCallCount).toBe(expectedLoadCount);
    expect(reloadCallCount).toBe(expectedReloadCount);

    // page is invisible - refiring "load" should still do the load (but not reload)
    wrapper.setProps({ refireLoad: true });
    expectedLoadCount += 1;
    expect(loadCallCount).toBe(expectedLoadCount);
    expect(reloadCallCount).toBe(expectedReloadCount);
    wrapper.setProps({ refireLoad: false }); // unset refiring or it would happen at each re-render
    expect(loadCallCount).toBe(expectedLoadCount);
    expect(reloadCallCount).toBe(expectedReloadCount);
    advanceTime(1000);
    expect(loadCallCount).toBe(expectedLoadCount);
    expect(reloadCallCount).toBe(expectedReloadCount);

    // make page visible - reload should happen immediately (because we advanced time by > 500)
    togglePageVisibility(true);
    advanceTime(10);
    expectedReloadCount += 1;
    expect(reloadCallCount).toBe(expectedReloadCount);

    // check that interval is registered again
    advanceTime(400);
    expect(reloadCallCount).toBe(expectedReloadCount); // not yet
    advanceTime(150);
    expectedReloadCount += 1;
    expect(reloadCallCount).toBe(expectedReloadCount);

    // !!! must unmount so that other tests are not affected
    wrapper.unmount();
  });

  it(`disabled reload when page not visible 2`, () => {
    jest.useFakeTimers();

    // make page invisible and mount - component should still fire "load"
    togglePageVisibility(false);
    const wrapper = mount(<Component reloadInterval={500} refireLoad={false} />);
    let expectedLoadCount = 1;
    let expectedReloadCount = 0;
    expect(loadCallCount).toBe(expectedLoadCount);
    expect(reloadCallCount).toBe(expectedReloadCount);

    // toggle page visibility couple of times - no "load" or "reload" should happen
    togglePageVisibility(true);
    advanceTime(100);
    togglePageVisibility(false);
    advanceTime(100);
    togglePageVisibility(true);
    expect(loadCallCount).toBe(expectedLoadCount);
    expect(reloadCallCount).toBe(expectedReloadCount);

    // page is visible - reload should happen in ~300ms (because we advanced time by ~200 since last (re)load)
    advanceTime(200);
    expect(loadCallCount).toBe(expectedLoadCount);
    expect(reloadCallCount).toBe(expectedReloadCount);
    advanceTime(150);
    expectedReloadCount += 1;
    expect(loadCallCount).toBe(expectedLoadCount);
    expect(reloadCallCount).toBe(expectedReloadCount);
    advanceTime(500);
    expectedReloadCount += 1;
    expect(loadCallCount).toBe(expectedLoadCount);
    expect(reloadCallCount).toBe(expectedReloadCount);

    // !!! must unmount so that other tests are not affected
    wrapper.unmount();
  });
});
