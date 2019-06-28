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

// NOTE Tests in this file are disabled because component internally loads Google API from
// external domain which is unsafe (if the domain is compromised, we'll execute
// its arbitrary JS file within Node with file system access, ...).
// The test is otherwise functional, i.e. it's possible to remove following 2 lines
// and it will work.
let describe = global.describe.skip;
let it = global.it.skip; // let it = (name) => global.it("(IGNORED) " + name, () => {});

/**
 * @jest-environment <rootDir>/src/core/test/unsafe-environment.js
 */

import React from 'react';
import {shallow, mount} from 'enzyme';
import UU5 from "uu5g04";
import "uu5g04-bricks";
import enzymeToJson from 'enzyme-to-json';

const TagName = "UU5.Bricks.GoogleMap";

const MAX_TIMEOUT = 5000;
describe(`${TagName} interface testing`, function () {

  it('getMap()', () => {
    const wrapper = mount(
      <UU5.Bricks.GoogleMap
        id={"uuID"}
        zoom={11}
        disableDefaultUI
        googleApiKey="AIzaSyBkv-K9tpS-MrvvRKOpIGEj7H5wwdHD9pA"
      />
    );
    return waitUntil(() => wrapper.instance().getMap(), "Google API didn't load in time.", MAX_TIMEOUT-50).then(() => {
      expect(wrapper.instance().getMap()).not.toBeUndefined();
    });
  }, MAX_TIMEOUT);

  it('setMapOptions(props)', () => {
    const wrapper = mount(
      <UU5.Bricks.GoogleMap
        id={"uuID01"}
        zoom={11}
        disableDefaultUI
        googleApiKey="AIzaSyBkv-K9tpS-MrvvRKOpIGEj7H5wwdHD9pA"
      />,
      {disableLifecycleMethods: false}
    );
    wrapper.instance().setMapOptions({zoom: 6});
    wrapper.update();
    return waitUntil(() => wrapper.instance().getMap(), "Google API didn't load in time.", MAX_TIMEOUT-50).then(() => {
      let googleMap = wrapper.instance().getMap();
      expect(googleMap).not.toBeUndefined();
      expect(googleMap.getZoom()).toBe(6);
    });
  }, MAX_TIMEOUT);

});

/** Waits until condition is met (function which shall return true in such case) or until timeout is reached. */
function waitUntil(conditionFn, failMessage, maxTimeout) {
  let start = new Date().getTime();
  return new Promise((resolve, reject) => {
    let fn = () => {
      if (conditionFn()) return resolve();
      if (new Date().getTime() - start > maxTimeout) return reject(failMessage || "Test failed due to timeout - condition for test continuation was not met.");
      setTimeout(fn, 25);
    };
    fn();
  });
}
