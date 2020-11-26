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

// NOTE Tests in this file are disabled because component internally loads JS from
// external domain which is unsafe (if the domain is compromised, we'll execute
// its arbitrary JS file within Node with file system access, ...).
// The test is otherwise functional, i.e. it's possible to remove following 2 lines
// and it will work.
let describe = global.describe.skip;
let it = global.it.skip; // let it = (name) => global.it("(IGNORED) " + name, () => {});

/*
 * @jest-environment <rootDir>/uu5/core/test/unsafe-environment.js
 */

import React from "react";
import UU5 from "uu5g04";
import UU5Bricks from "uu5g04-bricks";
import ReactDOM from "react-dom";
import createReactClass from "create-react-class";
import { PropTypes } from "uu5g05";
import regeneratorRuntime from "regenerator-runtime";

const { mount, shallow, wait } = UU5.Test.Tools;

// loading SystemJS into JSDOM environment needs a bit of fiddling...
let origDocument = global.document;
let origLocation = global.location;
delete global.document;
delete global.location;
let SystemJS = require("systemjs");
global.document = origDocument;
global.location = origLocation;
SystemJS.set(SystemJS.normalizeSync("react"), SystemJS.newModule({ default: React, ...React, __useDefault: true }));
SystemJS.set(
  SystemJS.normalizeSync("react-dom"),
  SystemJS.newModule({ default: ReactDOM, ...ReactDOM, __useDefault: true })
);
SystemJS.set(
  SystemJS.normalizeSync("create-react-class"),
  SystemJS.newModule({ default: createReactClass, ...createReactClass, __useDefault: true })
);
SystemJS.set(
  SystemJS.normalizeSync("prop-types"),
  SystemJS.newModule({ default: PropTypes, ...PropTypes, __useDefault: true })
);
SystemJS.set(SystemJS.normalizeSync("uu5g04"), SystemJS.newModule({ default: UU5, ...UU5, __useDefault: true }));
SystemJS.set(
  SystemJS.normalizeSync("uu5g04-bricks"),
  SystemJS.newModule({ default: UU5Bricks, ...UU5Bricks, __useDefault: true })
);

// TODO Remove temporary fix (version setting of uu5g04 is set to undefined in uu5g04/dist-node/...).
UU5.Environment.version = "1.12.0";
let baseEl = document.createElement("base");
document.head.appendChild(baseEl);

let uu5string_controls = '<uu5string /><UU5.Forms.Controls key="react-key01" buttonReset=true />';

let origLoadLibrary = UU5.Common.Tools.loadLibrary;

beforeEach(() => {
  // mock, which data should be returned from the server
  let block_danger_response = {
    id: "5aa04e1e2a8c4d00051c81d8",
    code: "UU5.Forms",
    name: "uu5g04-forms",
    vendor: "UU",
    source: "https://cdn.plus4u.net/uu-uu5g04/1.0.0/uu5g04-forms.js",
    version: "1.12.0",
    doc: "https://uuos9.plus4u.net/uu-dockitg01-main/78462435-e3f5c648e85f4319bd8fc25ea5be6c2c/book",
    dependencyMap: {
      uu5g04: "https://cdn.plus4u.net/uu-uu5g04/1.0.0/uu5g04.min.js",
      "uu5g04-bricks": "https://cdn.plus4u.net/uu-uu5g04/1.0.0/uu5g04-bricks.min.js",
    },
    awid: "fe96c133c895434bbd4d5b24831483f3",
    sys: { cts: "2018-03-07T20:39:58.133Z", mts: "2018-03-07T20:39:58.133Z", rev: 0 },
    uuAppErrorMap: {},
  };

  UU5.Common.Tools.loadLibrary = function (libName, callback) {
    setTimeout(() => callback(block_danger_response), 0);
  };
});
afterEach(() => {
  UU5.Common.Tools.loadLibrary = origLoadLibrary;
});

const TIMEOUT = 4000;
describe(`UU5.Common.TagPlaceholder`, () => {
  // NOTE After this test completes, UU5.Forms library is loaded in the DOM.
  it(
    "test01 - It should render UU5.Forms.Controls",
    async () => {
      jest.useFakeTimers();
      const wrapper = mount(<UU5.Bricks.Div id={"divID"} content={uu5string_controls} />);
      const wrapperShallow = shallow(<UU5.Bricks.Div id={"divID1"} content={uu5string_controls} />);

      let tagPlaceholder = wrapper.findWhere(
        (node) =>
          node.instance() && node.instance().getTagName && node.instance().getTagName() === "UU5.Common.TagPlaceholder"
      );
      expect(tagPlaceholder.exists()).toBe(true);
      expect(tagPlaceholder.props()).toMatchObject({
        tagName: "UU5.Forms.Controls",
        props: {
          buttonReset: true,
        },
      });
      expect(wrapperShallow).toMatchSnapshot();
      // wait for TagPlaceholder to load the target file and prepare the component
      jest.runOnlyPendingTimers();
      await waitUntil(
        () => wrapper.html().indexOf("uu5-forms-controls") >= 0,
        "TagPlaceholder didn't load UU5.Forms within timeout or failed to render UU5.Forms.Controls.",
        TIMEOUT
      );
      console.log(wrapper.html());
      wrapper.update();
      wrapperShallow.update();
      let formControls = wrapper.findWhere(
        (node) => node.instance() && node.instance().getTagName && node.instance().getTagName() === "UU5.Forms.Controls"
      );
      expect(formControls.length).toBe(1);
      expect(formControls.props()).toMatchObject({ buttonReset: true });
      //NOTE: In the snapshot, the id will be randomly generated for span and div components that make up the component the tag placeholder loaded.
      expect(wrapper.html()).toMatchSnapshot();
      expect(wrapperShallow).toMatchSnapshot();
    },
    TIMEOUT + 1000
  );

  it("test02 - UU5.Common.Tools.findComponent(UuDocKit.Bricks.BlockDanger) should return Tagplaceholder", () => {
    jest.useFakeTimers();
    let calls = UU5.Common.Tools.findComponent("UuDocKit.Bricks.BlockDanger", {
      content: "Je lepší bejt chytrej nežli hloupej.",
      id: "componentRegistryId",
    });
    jest.runOnlyPendingTimers();
    expect(calls).toMatchSnapshot();
  });

  it("test03 - component is filled as tag and props", () => {
    //NOTE:  UU5.Forms is already loaded (because of 1st test), i.e. this won't use TagPlaceholder.
    jest.useFakeTimers();
    const wrapper = shallow(
      <UU5.Bricks.Div
        id={"divID"}
        content={{ tag: "UU5.Forms.Controls", props: { id: "uuID01", buttonReset: true, key: "uuKey" } }}
      />
    );
    jest.runOnlyPendingTimers();
    wrapper.update();
    expect(wrapper).toMatchSnapshot();
  });
});

/** Waits until condition is met (function which shall return true in such case) or until timeout is reached. */
let realSetTimeout = setTimeout;
function waitUntil(conditionFn, failMessage, maxTimeout) {
  let start = new Date().getTime();
  return new Promise((resolve, reject) => {
    let fn = () => {
      if (conditionFn()) return resolve();
      if (new Date().getTime() - start > maxTimeout)
        return reject(failMessage || "Test failed due to timeout - condition for test continuation was not met.");
      realSetTimeout(fn, 25);
    };
    fn();
  });
}
