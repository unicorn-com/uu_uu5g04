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

const { mount, shallow, wait } = UU5.Test.Tools;

//NOTE: scrollToFragment and CopyToClipboard ifc will be tested by selenium.

// NOTE Some tests require Date.now() to return mocked date (consistent with
// fake timers when using jest.advanceTimersByTime(time)), but Jest currently
// doesn't provide API for that - use workaround until they resolve it in
// https://github.com/facebook/jest/issues/5165
let timeDelta = 0;
let timeInterval;
let origDateNow = Date.now;
let origLoadLibrary = UU5.Common.Tools.loadLibrary;
beforeEach(() => {
  Date.now = () => origDateNow.call(Date) + timeDelta;
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
  Date.now = origDateNow;
  if (timeInterval != null) clearInterval(timeInterval);
  timeDelta = 0;
  timeInterval = null;
  UU5.Common.Tools.loadLibrary = origLoadLibrary;
});

function advanceTime(time) {
  if (timeInterval == null) timeInterval = setInterval(() => (timeDelta += 10), 10);
  jest.advanceTimersByTime(time);
}

describe("UU5.Common.Tools interface", () => {
  it("checkTag() should return null", () => {
    const returnValue = UU5.Common.Tools.checkTag("UU5.CodeKit.CodeEditor", { hideError: true });
    expect(returnValue).toBeNull();
    expect(returnValue).toMatchSnapshot();
  });

  it("checkTag() should not return null and return [Function]", () => {
    const returnValue = UU5.Common.Tools.checkTag("UU5.Bricks.Button");
    expect(returnValue).not.toBeNull();
    expect(returnValue).toMatchSnapshot();
  });

  it("findComponent(tag, props, content) should return instance of button", () => {
    const returnValue = UU5.Common.Tools.findComponent("UU5.Bricks.Button", { pressed: false });
    expect(() => {
      returnValue;
    }).not.toBeNull();
    expect(returnValue).toMatchSnapshot();
  });

  it("findComponent(tag, props, content) should return tagplaceholder component", () => {
    jest.useFakeTimers();
    let calls = UU5.Common.Tools.findComponent("UuDocKit.Bricks.BlockDanger", {
      content: "Je lepší bejt chytrej nežli hloupej.",
      id: "componentRegistryId",
    });
    jest.runAllTimers();
    expect(calls).toMatchSnapshot();
  });

  it("findComponent(tag, props, content, error) should return error component from the 4th parameter component", () => {
    //NOTE:  UU5.Forms is already loaded (because of 1st test), i.e. this won't use TagPlaceholder.
    jest.useFakeTimers();

    const ErrorComponent = (props) => {
      return "component " + props.tagName + " couldn't be rendered!";
    };

    let customError1 = UU5.Common.Tools.findComponent("UU5.Forms.C", null, null, <ErrorComponent />);
    let customError2 = UU5.Common.Tools.findComponent(
      "UU5.Forms.C",
      null,
      null,
      ({ tagName }) => "component " + tagName + " couldn't be rendered!"
    );
    let customError3 = UU5.Common.Tools.findComponent(
      "UU5.Forms.C",
      null,
      null,
      "component ${tagName} couldn't be rendered!"
    );

    const wrapper = mount(
      <span>
        {customError1}
        {customError2}
        {customError3}
      </span>
    );

    jest.runAllTimers();
    wrapper.update();
    expect(wrapper.text()).toContain("component UU5.Forms.C couldn't be rendered!");
  });

  it('pad(number, lenght, char="0") ', () => {
    const returnValue = UU5.Common.Tools.pad(9, 3, "0");
    expect(returnValue).toMatch(/009/);
    expect(returnValue).toMatchSnapshot();
  });

  it("merge(obj1, obj2) should merge two object to one.", () => {
    const returnValue = UU5.Common.Tools.merge({ a: "a" }, { b: "b" });
    expect(returnValue).toEqual(expect.objectContaining({ a: "a", b: "b" }));
    expect(returnValue).toMatchSnapshot();
  });

  it("mergedeep(obj1, obj2) should merge two object to one.", () => {
    const returnValue = UU5.Common.Tools.mergeDeep({ a: "a" }, { b: "b" });
    expect(returnValue).toEqual(expect.objectContaining({ a: "a", b: "b" }));
    expect(returnValue).toMatchSnapshot();
  });

  //NOTE: jest testURL
  //In the json package, the testURL attribute must be set in section.
  //Please do not delete the test url from the package otherwise this test will fail.
  //Default url is about: blank

  it("getUrlParam()", () => {
    //in package.json is default testURL like this. Please dont remove.
    expect(window.location.href).toEqual(expect.stringContaining("http://example.com/test_url_for_tools-ifc.test.js"));
    let ifc;
    expect(() => {
      ifc = UU5.Common.Tools.getUrlParam("param");
    }).not.toThrow();
    expect(ifc).not.toBeNull();
    expect(ifc).toBe("value");
  });

  it("getBasicObject(uu5component) should return tagName of Bricks.Button", () => {
    expect(() => {
      UU5.Common.Tools.getBasicObject(<UU5.Bricks.Button id={"uu01"} />);
    }).not.toThrow();
    expect(UU5.Common.Tools.getBasicObject(<UU5.Bricks.Button id={"uu01"} />)).toMatch(/UU5.Bricks.Button/);
    expect(UU5.Common.Tools.getBasicObject(<UU5.Bricks.Button id={"uu01"} />)).toMatchSnapshot();
  });

  it("getBasicObject(HTML tag) should return tagName of HTML hypertext tag", () => {
    expect(() => {
      UU5.Common.Tools.getBasicObject(
        <a href={"#"} target={"_blank"}>
          HTML odkaz
        </a>
      );
    }).not.toThrow();
    expect(
      UU5.Common.Tools.getBasicObject(
        <a href={"#"} target={"_blank"}>
          HTML odkaz
        </a>
      )
    ).toMatch(/a/);
    expect(
      UU5.Common.Tools.getBasicObject(
        <a href={"#"} target={"_blank"}>
          HTML odkaz
        </a>
      )
    ).toMatchSnapshot();
  });

  it("getBasicObject(function)", () => {
    const mockFce = jest.fn();
    expect(() => {
      UU5.Common.Tools.getBasicObject(() => {
        alert("function");
      });
    }).not.toThrow();
    expect(
      UU5.Common.Tools.getBasicObject(() => {
        alert("function");
      })
    ).toEqual(expect.objectContaining({}));
  });

  it("getBasicObject(array)", () => {
    const basicArray = [true, "Ahoj", 10];
    expect(() => {
      UU5.Common.Tools.getBasicObject(basicArray);
    }).not.toThrow();
    expect(UU5.Common.Tools.getBasicObject(basicArray)).toEqual(
      expect.objectContaining({ "0": true, "1": "Ahoj", "2": 10 })
    );
  });

  it("getBasicObject(Object,Boolean, String, Number, Array)", () => {
    expect(UU5.Common.Tools.getBasicObject(Object)).toEqual(expect.objectContaining({}));
    expect(UU5.Common.Tools.getBasicObject(Boolean)).toEqual(expect.objectContaining({}));
    expect(UU5.Common.Tools.getBasicObject(String)).toEqual(expect.objectContaining({}));
    expect(UU5.Common.Tools.getBasicObject(Number)).toEqual(expect.objectContaining({}));
    expect(UU5.Common.Tools.getBasicObject(Array)).toEqual(expect.objectContaining({}));
  });

  it("generateUUID(32)", () => {
    const returnValue = UU5.Common.Tools.generateUUID(32);
    expect(returnValue).toEqual(expect.any(String));
  });

  it("buildCounterCallbacks() should be called only once after three buttons will be disabled", function () {
    let mockFunc = jest.fn();
    let but, but1, but2;
    let wrapper = mount(
      <UU5.Bricks.Container>
        <UU5.Bricks.Button ref_={(ref) => (but = ref)} />
        <UU5.Bricks.Button ref_={(ref) => (but1 = ref)} />
        <UU5.Bricks.Button ref_={(ref) => (but2 = ref)} />
        <br />
      </UU5.Bricks.Container>
    );
    //Now we call buildCounterCallback with params 3 (we have 3 buttons)
    let counterCallback = UU5.Common.Tools.buildCounterCallback(mockFunc, 3);
    expect(typeof counterCallback).toBe("function");
    //Above each button we call disable
    but.disable(counterCallback);
    expect(mockFunc).toHaveBeenCalledTimes(0);
    but1.disable(counterCallback);
    expect(mockFunc).toHaveBeenCalledTimes(0);
    but2.disable(counterCallback);
    //Now build Counter CallBack ifc has to be called only once
    expect(mockFunc).toHaveBeenCalledTimes(1);
  });

  it("formatString(string, string), replace %s by string", () => {
    let returnValue;
    expect(() => {
      returnValue = UU5.Common.Tools.formatString("Test replace of %s.", "percent s by string");
    }).not.toThrow();
    expect(returnValue).toMatch("Test replace of percent s by string.");
  });

  it("formatString(string, %s)", () => {
    let returnValue = UU5.Common.Tools.formatString("Uživateli %s je %d let.", ["Unicorn Univers", "25"]);
    expect(returnValue).toMatch(/Uživateli Unicorn Univers je 25 let./);

    returnValue = UU5.Common.Tools.formatString("Uživateli ${user} je ${age} let.", {
      user: "Unicorn Univers",
      age: "25",
    });
    expect(returnValue).toMatch(/Uživateli Unicorn Univers je 25 let./);

    returnValue = UU5.Common.Tools.formatString("Uživateli je %s let.", "");
    expect(returnValue).toMatch(/Uživateli je  let./);
  });

  it("formatString(string, ())", () => {
    const returnValue = UU5.Common.Tools.formatString("Uživateli {0} je {1} roky, prože se narodil před {1} roky.", [
      "Unicorn Univers",
      "25",
    ]);
    expect(returnValue).toMatch(/Uživateli Unicorn Univers je 25 roky, prože se narodil před 25 roky./);
  });

  it("formatString() with object", () => {
    const returnValue = UU5.Common.Tools.formatString("Uživateli ${user} je ${age} let.", {
      user: "Unicorn Univers",
      age: "25",
    });
    expect(returnValue).toMatch(/Uživateli Unicorn Univers je 25 let./);
  });

  it("formatDate(date, format, timezone) dd,mm,Y", () => {
    let date = new Date(2018, 1, 1);
    const returnValue01 = UU5.Common.Tools.formatDate(date, "dd.mm.Y", null);
    expect(returnValue01).toMatchSnapshot();
    const returnValue02 = UU5.Common.Tools.formatDate(date, "dd-mm-Y", null);
    expect(returnValue02).toMatchSnapshot();
    const returnValue03 = UU5.Common.Tools.formatDate(date, "dd/mm/Y", null);
    expect(returnValue03).toMatchSnapshot();
  });

  it("formatDate(date, format, timezone) d,m,y", () => {
    let date = new Date(2018, 1, 1);
    const returnValue01 = UU5.Common.Tools.formatDate(date, "d.m.y", null);
    expect(returnValue01).toMatchSnapshot();
    const returnValue02 = UU5.Common.Tools.formatDate(date, "d-m-y", null);
    expect(returnValue02).toMatchSnapshot();
    const returnValue03 = UU5.Common.Tools.formatDate(date, "d/m/y", null);
    expect(returnValue03).toMatchSnapshot();
  });

  it("formatDate(date, format, timezone) hours,minutes,secons,miliseconds", () => {
    let date = new Date(2018, 1, 1, 1, 5, 8, 120);
    const returnValue01 = UU5.Common.Tools.formatDate(date, "dd.mm.Y HH:MM:SS:ss", null);
    expect(returnValue01).toMatchSnapshot();
    const returnValue02 = UU5.Common.Tools.formatDate(date, "dd.mm.Y H:M:S:s", null);
    expect(returnValue01).toMatchSnapshot();
  });

  it("formatDate(date, format, timezone) hours,minutes,secons,miliseconds p.m & a.m / PM & AM", () => {
    let date = new Date(2018, 1, 1, 1, 5, 8, 120);
    const returnValue01 = UU5.Common.Tools.formatDate(date, "dd.mm.Y HH:MM:SS:ss t", null);
    expect(returnValue01).toMatchSnapshot();
    const returnValue02 = UU5.Common.Tools.formatDate(date, "dd.mm.Y HH:MM:SS:ss T", null);
    expect(returnValue02).toMatchSnapshot();
  });

  it("formatDate(date, format, timezone) hours,minutes,secons,miliseconds w vs. ww", () => {
    let date = new Date(2018, 1, 1, 1, 5, 8, 120);
    const returnValue03 = UU5.Common.Tools.formatDate(date, "dd.mm.Y HH:MM:SS:ss w", null);
    expect(returnValue03).toMatchSnapshot();
    const returnValue04 = UU5.Common.Tools.formatDate(date, "dd.mm.Y HH:MM:SS:ss ww", null);
    expect(returnValue04).toMatchSnapshot();

    expect(UU5.Common.Tools.formatDate(new Date("2018-12-31"), "w/Y")).toBe("1/2019");
    expect(UU5.Common.Tools.formatDate(new Date("2018-12-31"), "d.m.Y (w)")).toBe("31.12.2018 (1)");
  });

  it("formatDate(date, format, timezone) hours,minutes,secons,miliseconds q vs. Z", () => {
    let date = new Date(2018, 1, 1, 1, 5, 8, 120);
    const returnValue03 = UU5.Common.Tools.formatDate(date, "dd.mm.Y HH:MM:SS:ss q", null);
    expect(returnValue03).toMatchSnapshot();
    const returnValue04 = UU5.Common.Tools.formatDate(date, "dd.mm.Y HH:MM:SS:ss Z", null);
    expect(returnValue04).toEqual("01.02.2018 01:05:08:120 +01:00");
    expect(returnValue04).toMatchSnapshot();
  });

  it("parseDate(stringDate, opt)", () => {
    let resultDate = UU5.Common.Tools.parseDate("2018/12/31", { format: "Y/m/d", country: "en" });
    expect(resultDate).toMatchSnapshot();
    resultDate = UU5.Common.Tools.parseDate("2018/12/31", { format: "Y/m/d" });
    expect(resultDate).toMatchSnapshot();
    resultDate = UU5.Common.Tools.parseDate("12/31/2018", { country: "en" });
    expect(resultDate).toMatchSnapshot();
    resultDate = UU5.Common.Tools.parseDate("31/12/2018"); // en-gb (UU5.Environment.defaultLanguage)
    expect(resultDate).toMatchSnapshot();
  });

  it("getDateString(date, opt)", () => {
    let resultDate = UU5.Common.Tools.getDateString(new Date("2018-12-31"), { format: "Y/m/d", country: "en" });
    expect(resultDate).toMatchSnapshot();
    resultDate = UU5.Common.Tools.getDateString(new Date("2018-12-31"), { format: "Y/m/d" });
    expect(resultDate).toMatchSnapshot();
    resultDate = UU5.Common.Tools.getDateString(new Date("2018-12-31"), { format: "d.m.y" });
    expect(resultDate).toMatchSnapshot();
    resultDate = UU5.Common.Tools.getDateString(new Date("2018-12-31"), { country: "en" });
    expect(resultDate).toMatchSnapshot();
    resultDate = UU5.Common.Tools.getDateString(new Date("2018-12-31"));
    expect(resultDate).toMatchSnapshot();
  });

  // TODO Mock console.
  it("Tools.error(msg, context)", () => {
    let result;
    expect(() => {
      result = UU5.Common.Tools.error("This error is expected to be shown in console.", { errorData: "invalidToken" });
    }).not.toThrow();
    expect(result).not.toBeNull();
    expect(result).toMatchSnapshot();
  });

  it("Tools.warning(msg, context)", () => {
    let result;
    expect(() => {
      result = UU5.Common.Tools.warning("This warning is expected to be shown in console.", {
        warningData: "Session will be deleted.",
      });
    }).not.toThrow();
    expect(result).not.toBeNull();
    expect(result).toMatchSnapshot();
  });

  it("[string] Tools.getScreenSize()", () => {
    const retV = UU5.Common.Tools.getScreenSize();
    expect(retV).not.toBeNull();
    expect(retV).toMatch(/l/);
  });

  it("[string] Tools.getLanguage()", () => {
    const retV = UU5.Common.Tools.getLanguage();
    expect(retV).not.toBeNull();
    expect(retV).toMatchSnapshot();
  });

  //TODO: VPH-BT:44754540766279800
  // https://uuos9.plus4u.net/uu-dockitg01-main/78462435-ed11ec379073476db0aa295ad6c00178/book/page?code=environmentAndUu5Configuration
  it("Tools.setLanguage(language); VPH-BT:44754540766279800", () => {
    const newLanguage = UU5.Common.Tools.setLanguage([{ language: "cs", location: "cs-cz", q: 0.8 }]);
    expect(UU5.Common.Tools.getLanguage()).toMatchSnapshot();
  });

  it("Tools.setLanguage(language)", () => {
    const newLanguage1 = UU5.Common.Tools.setLanguage("cs-CZ, cs;q=0.9, en;q=0.8");
    expect(UU5.Common.Tools.getLanguage()).toMatchSnapshot();
    const newLanguage2 = UU5.Common.Tools.setLanguage("cs-CZ");
    expect(UU5.Common.Tools.getLanguage()).toMatchSnapshot();
  });

  it("Tools.getLsiValue(lsi, language, params)", () => {
    let lsi = { cs: "lang cs", de: "lang de" };

    expect(UU5.Common.Tools.getLsiValueByLanguage(lsi, "cs")).toBe(lsi.cs);
    expect(UU5.Common.Tools.getLsiValueByLanguage(lsi, "de")).toBe(lsi.de);
    expect(UU5.Common.Tools.getLsiValueByLanguage(lsi, "cs-cz")).toBe(lsi.cs);
    expect(UU5.Common.Tools.getLsiValueByLanguage(lsi, "es")).toBe(lsi.cs);
    expect(UU5.Common.Tools.getLsiValueByLanguage({ ...lsi, en: "lang en" }, "es")).toBe("lang en");
  });

  it("[function] Tools.debounce(func, wait) mock should be called one time", () => {
    jest.useFakeTimers();
    let fcDebounce = jest.fn(); //mock function of debounce ifc
    let funcDebounce = UU5.Common.Tools.debounce(fcDebounce, 1000);
    let dateStart = Date.now();
    let intervalDebounce = setInterval(() => {
      let result = Date.now() - dateStart;
      if (result > 4000) {
        clearInterval(intervalDebounce);
        return;
      }
      funcDebounce(result);
    }, 333);
    expect(fcDebounce).not.toBeCalled(); //now debounce ifc should not be called.
    advanceTime(4000 + 1000 + 100); // move the time ahead; 100 is just a constant as setInterval is not exact
    expect(fcDebounce).toHaveBeenCalledTimes(1);
    expect(fcDebounce.mock.calls[0][0]).toEqual(expect.any(Number)); // param should be time
  });

  it("[function] Tools.throttle(func, wait) mock should be called five times", function () {
    jest.useFakeTimers();
    let fcThrottle = jest.fn(); //mock function of throttle ifc
    let funcThrottle = UU5.Common.Tools.throttle(fcThrottle, 1000);
    let dateStart = Date.now();
    let intervalThrottle = setInterval(() => {
      let result = Date.now() - dateStart;
      if (result > 333 + 4 * 1000 + 100) {
        clearInterval(intervalThrottle);
        return;
      }
      funcThrottle(result);
    }, 333);
    expect(fcThrottle).not.toBeCalled(); //now throttle ifc should not be called.
    advanceTime(333 + 4 * 1000 + 100); // move the time ahead; 100 is just a constant as setInterval is not exact
    expect(fcThrottle).toHaveBeenCalledTimes(5);
    expect(fcThrottle.mock.calls[0][0]).toEqual(expect.any(Number)); // param should be time 333,1333,2333,3333,4333
  });

  //NOTE: return Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight);
  it("getDocumentHeight() should return max of result", () => {
    Object.defineProperty(document.body, "scrollHeight", {
      writable: true,
      value: 800,
    });
    Object.defineProperty(document.body, "offsetHeight", {
      writable: true,
      value: 900,
    });
    Object.defineProperty(document.documentElement, "scrollHeight", {
      writable: true,
      value: 600,
    });
    Object.defineProperty(document.documentElement, "clientHeight", {
      writable: true,
      value: 500,
    });
    Object.defineProperty(document.documentElement, "offsetHeight", {
      writable: true,
      value: 50,
    });
    let ifc = UU5.Common.Tools.getDocumentHeight();
    expect(ifc).not.toBeNull();
    expect(ifc).toBe(900);
  });

  //NOTE: should return max from Math.max(body.scrollWidth, body.offsetWidth, html.clientWidth, html.scrollWidth, html.offsetWidth)
  it("getDocumentWidth() should return max note", () => {
    Object.defineProperty(document.body, "scrollWidth", {
      writable: true,
      value: 800,
    });
    Object.defineProperty(document.body, "offsetWidth", {
      writable: true,
      value: 900,
    });
    Object.defineProperty(document.documentElement, "scrollWidth", {
      writable: true,
      value: 600,
    });
    Object.defineProperty(document.documentElement, "clientWidth", {
      writable: true,
      value: 500,
    });
    Object.defineProperty(document.documentElement, "offsetWidth", {
      writable: true,
      value: 50,
    });
    let ifc = UU5.Common.Tools.getDocumentWidth();
    expect(ifc).not.toBeNull();
    expect(ifc).toBe(900);
  });

  it("getWidth() should return result = clientWidth - paddingLeft- paddingRight", () => {
    //we should create some element with css style padding left and right
    let element = document.createElement("Button");
    element.setAttribute("style", "padding-left:200px; padding-right:100px");
    //now we must set clientWidth becasue default value is 0.
    Object.defineProperty(element, "clientWidth", {
      writable: true,
      value: 500,
    });
    //result should be 500 - 200 - 100 = 200
    let ifc = UU5.Common.Tools.getWidth(element);
    expect(ifc).not.toBeNull();
    expect(ifc).toBe(200);
  });

  it("getWidth() should return result = clientHeight - paddingTop - paddingBottom", () => {
    let element = document.createElement("Button");
    element.setAttribute("style", "padding-top:200px; padding-bottom:200px");
    Object.defineProperty(element, "clientHeight", {
      writable: true,
      value: 500,
    });
    //result should be 500 - 200 - 200 = 100
    let ifc = UU5.Common.Tools.getHeight(element);
    expect(ifc).not.toBeNull();
    expect(ifc).toBe(100);
  });

  it("getInnerWidth() should return element.clientWidth=500", () => {
    let element = document.createElement("Button");
    Object.defineProperty(element, "clientWidth", {
      writable: true,
      value: 500,
    });
    let ifc = UU5.Common.Tools.getInnerWidth(element);
    expect(ifc).not.toBeNull();
    expect(ifc).toBe(500);
  });

  it("getOuterWidth(element,withMargin=false) should return 300", () => {
    // result += marginLeft + marginRight;
    let element = document.createElement("Button");
    element.setAttribute("style", "margin-left:200px; margin-right:200px");
    Object.defineProperty(element, "offsetWidth", {
      writable: true,
      value: 300,
    });
    //margin is ignored with false
    let ifc = UU5.Common.Tools.getOuterWidth(element, false);
    expect(ifc).not.toBeNull();
    expect(ifc).toBe(300);
  });

  it("getOuterWidth(element,withMargin=true) should return 700", () => {
    let element = document.createElement("Button");
    element.setAttribute("style", "margin-left:200px; margin-right:200px");
    Object.defineProperty(element, "offsetWidth", {
      writable: true,
      value: 300,
    });
    let ifc = UU5.Common.Tools.getOuterWidth(element, true);
    expect(ifc).not.toBeNull();
    expect(ifc).toBe(700);
  });

  it("getInnerHeight() should return element.clientHeight=500", () => {
    let element = document.createElement("Button");
    Object.defineProperty(element, "clientHeight", {
      writable: true,
      value: 500,
    });
    let ifc = UU5.Common.Tools.getInnerHeight(element);
    expect(ifc).not.toBeNull();
    expect(ifc).toBe(500);
  });

  it("getOuterHeight(element,withMargin=false) should return 300", () => {
    // result += marginLeft + marginRight;
    let element = document.createElement("Button");
    element.setAttribute("style", "margin-top:200px; margin-bottom:200px");
    Object.defineProperty(element, "offsetHeight", {
      writable: true,
      value: 300,
    });
    //margin is ignored with false
    let ifc = UU5.Common.Tools.getOuterHeight(element, false);
    expect(ifc).not.toBeNull();
    expect(ifc).toBe(300);
  });

  it("getOuterHeight(element,withMargin=true) should return 700", () => {
    let element = document.createElement("Button");
    element.setAttribute("style", "margin-top:200px; margin-bottom:200px");
    Object.defineProperty(element, "offsetHeight", {
      writable: true,
      value: 300,
    });
    let ifc = UU5.Common.Tools.getOuterHeight(element, true);
    expect(ifc).not.toBeNull();
    expect(ifc).toBe(700);
  });

  it("getOffsetTop(element)", () => {
    let element = document.createElement("Button");
    element.setAttribute("style", "margin: 10px  10px 10px 10px; padding: 5px 5px 5px 5px");
    Object.defineProperty(element, "offsetTop", {
      writable: true,
      value: 300,
    });
    let ifc = UU5.Common.Tools.getOffsetTop(element);
    expect(ifc).not.toBeNull();
    // expect(ifc).toBe(300); // commented out as jsdom environment doesn't support getting measures (our implementation uses getBoundingClientRect)
  });

  it("getOffsetLeft(element)", () => {
    let element = document.createElement("Button");
    element.setAttribute("style", "margin: 10px  10px 10px 10px; padding: 5px 5px 5px 5px");
    Object.defineProperty(element, "offsetLeft", {
      writable: true,
      value: 200,
    });
    let ifc = UU5.Common.Tools.getOffsetLeft(element);
    expect(ifc).not.toBeNull();
    // expect(ifc).toBe(200); // commented out as jsdom environment doesn't support getting measures (our implementation uses getBoundingClientRect)
  });

  it("getWeekNumber(date, startOfTheWeek)", () => {
    const resultMatrix = [
      [52, 52, 52, 1, 1, 1, 1, 1, 1, 1],
      [52, 52, 52, 52, 1, 1, 1, 1, 1, 1],
      [52, 52, 52, 52, 52, 1, 1, 1, 1, 1],
      [52, 52, 52, 52, 52, 52, 1, 1, 1, 1],
      [52, 52, 52, 52, 52, 52, 52, 1, 1, 1],
      [52, 53, 53, 53, 53, 53, 53, 53, 1, 1],
      [52, 52, 1, 1, 1, 1, 1, 1, 1, 2],
    ];

    // backward compatibility - ensure correct work of default value
    for (let dateOffset = 0; dateOffset < 10; dateOffset++) {
      let date = new Date("12/27/2019");
      date.setDate(date.getDate() + dateOffset);
      expect(UU5.Common.Tools.getWeekNumber(date)).toBe(resultMatrix[0][dateOffset]);
    }

    for (let dayStart = 1; dayStart <= 7; dayStart++) {
      for (let dateOffset = 0; dateOffset < 10; dateOffset++) {
        let date = new Date("12/27/2019");
        date.setDate(date.getDate() + dateOffset);
        expect(UU5.Common.Tools.getWeekNumber(date, dayStart)).toBe(resultMatrix[dayStart - 1][dateOffset]);
      }
    }
  });

  it("streamToString()", () => {
    let stream = [196, 140, 97, 117];
    let result = UU5.Common.Tools.streamToString(stream);
    expect(result).toBe("Čau");
  });

  const country = "en-us";
  const settings = [
    { params: [12345.6789, { country, maxDecimals: 3 }], result: "12,345.679" },
    { params: [12345.6789, { country, maxDecimals: 3, roundType: "floor" }], result: "12,345.678" },
    { params: [12345.6789, { country, maxDecimals: 6, minDecimals: 5 }], result: "12,345.67890" },
    { params: [12345.6789, { country, maxDecimals: 6, minDecimals: 6 }], result: "12,345.678900" },
    {
      params: [12345.6789, { country, thousandSeparator: "\u00a0", decimalSeparator: "," }],
      result: "12\u00a0345,6789",
    },
    { params: [12345.6789, { country, thousandSeparator: ",", decimalSeparator: "." }], result: "12,345.6789" },
    { params: [12345.6789, { country: "en-us" }], result: "12,345.6789" },
    { params: [12345.6789, { country: "cs-cz" }], result: "12\u00a0345,6789" }, // requires NodeJS >= 13.x
    { params: [0, { country, minDecimals: 2 }], result: "0.00" },
    { params: [-27415.78963, { country, maxDecimals: 3 }], result: "-27,415.79" },
    { params: [-27415.78963, { country, maxDecimals: 3, roundType: "trunc" }], result: "-27,415.789" },
    { params: [0, { minDecimals: 0 }], result: "0" },
    { params: [0, { decimalSeparator: ",", minDecimals: 0 }], result: "0" },
    { params: [0, { decimalSeparator: ",", minDecimals: 1 }], result: "0,0" },
  ];

  settings.forEach(({ result, params }) => {
    it(`formatNumber(${params[0]}, ${JSON.stringify(params[1])})`, () => {
      expect(UU5.Common.Tools.formatNumber(...params)).toBe(result);
    });
  });
});
