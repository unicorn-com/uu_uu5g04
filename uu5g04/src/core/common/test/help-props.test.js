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
import UU5 from "uu5g04";
import "uu5g04-bricks";

const { mount, shallow, wait } = UU5.Test.Tools;

const CONFIG = {
  mixins: [
    "UU5.Common.BaseMixin",
    "UU5.Common.ElementaryMixin",
    "UU5.Common.ContentMixin",
    "UU5.Common.PureRenderMixin"
  ],
  props: {
    tagName: {
      values: ["UU5.Bricks.Button", "UU5.Forms.TextArea", "Plus4U5.Link", "UU5.Bricks.Image"]
    },
    target: {
      values: ["_blank", "_parent", "_top", "_self"]
    }
  },
  requiredProps: {},
  opt: {
    shallowOpt: {
      disableLifecycleMethods: false
    }
  }
};

/**
 * UU5.Common.Help uses loadLibrary ifc to donate data from the server.
 * For a correct rendering of the component, it is necessary to mock the response we get in the browser in the network getLibrary? Code = UU5.Bricks.Link
 * These are JSON data. Before each test, we need to paste this rensponse as mock data.
 * After the test, it is necessary to return the original implementation of LoadLibrary ifc again.
 * To recognize the correct behavior, instead of the <Help .. /> component, we will renounce the Hypertext Link:
 * <a class = "uu5-bricks-link uu5-common-help" id = "helpID01-inner"
 * href = "https: // uuos9.plus4u.net/uu-dockitg01-main/78462435-ed11ec379073476db0aa295ad6c00178/book/page?code=uu5CommonHelp
 * "target =" _ blank "> UU5.Common.Help </a>
 */

let origLoadLibrary = UU5.Common.Tools.loadLibrary;

beforeEach(() => {
  // mock, which data should be returned from the server
  let response = {
    id: "5ad8c6042a8c4d00051c8201",
    code: "UU5.Common",
    name: "uu_uu5g04",
    vendor: "UU",
    dependencies: {},
    version: "1.11.0",
    source: "https://cdn.plus4u.net/uu-uu5g04/1.11.0/uu5g04.min.js",
    doc: "https://uuos9.plus4u.net/uu-dockitg01-main/78462435-ed11ec379073476db0aa295ad6c00178/book",
    awid: "fe96c133c895434bbd4d5b24831483f3",
    sys: { cts: "2018-04-19T16:38:28.917Z", mts: "2018-04-19T16:38:28.917Z", rev: 0 },
    uuAppErrorMap: {}
  };

  UU5.Common.Tools.loadLibrary = function(libName, callback) {
    setTimeout(() => callback(response), 10);
  };
});
afterEach(() => {
  UU5.Common.Tools.loadLibrary = origLoadLibrary;
});

describe(`UU5.Common.Help component props testing`, () => {
  it("test01 - default props", () => {
    jest.useFakeTimers();
    const wrapper = shallow(<UU5.Common.Help id={"helpID01"} />);
    jest.runOnlyPendingTimers();
    wrapper.update();
    expect(wrapper.html()).toMatchSnapshot();
    expect(wrapper).toMatchSnapshot();
  });

  it("test02 - props tagName", () => {
    //respons for UU5.Bricks.Button component
    const responseBrickButton = {
      id: "5ad8c60e2a8c4d00051c8202",
      code: "UU5.Bricks",
      name: "uu_uu5g04-bricks",
      vendor: "UU",
      dependencies: { uu5g04: "https://cdn.plus4u.net/uu-uu5g04/1.11.0/uu5g04.min.js" },
      version: "1.11.0",
      source: "https://cdn.plus4u.net/uu-uu5g04/1.11.0/uu5g04-bricks.min.js",
      doc: "https://uuos9.plus4u.net/uu-dockitg01-main/78462435-ed11ec379073476db0aa295ad6c00178/book",
      awid: "fe96c133c895434bbd4d5b24831483f3",
      sys: { cts: "2018-04-19T16:38:38.136Z", mts: "2018-04-19T16:38:38.136Z", rev: 0 },
      uuAppErrorMap: {}
    };
    //mock of loadLibrary
    UU5.Common.Tools.loadLibrary = function(libName, callback) {
      setTimeout(() => callback(responseBrickButton), 10);
    };
    jest.useFakeTimers();
    const wrapper = shallow(<UU5.Common.Help id={"helpID01"} />);
    //Check default value of tagName
    expect(wrapper.instance().props.tagName).toEqual("UU5.Common.Help");
    jest.runOnlyPendingTimers();
    wrapper.update();
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.html()).toMatchSnapshot();
    wrapper.setProps({ tagName: "UU5.Bricks.Button" });
    jest.runOnlyPendingTimers();
    wrapper.update();
    expect(wrapper.instance().props.tagName).toEqual("UU5.Bricks.Button");
    expect(wrapper.html()).toMatchSnapshot();
    expect(wrapper).toMatchSnapshot();
    //return originaly implementation
    UU5.Common.Tools.loadLibrary = origLoadLibrary;
  });

  it("test03 - target props", () => {
    jest.useFakeTimers();
    const wrapper = shallow(<UU5.Common.Help id={"helpID01"} />);
    jest.runOnlyPendingTimers();
    wrapper.update();
    expect(wrapper.instance().props.target).toMatch(/blank/);
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.html()).toMatchSnapshot();
    wrapper.setProps({ target: "_parent" });
    jest.runOnlyPendingTimers();
    wrapper.update();
    expect(wrapper.instance().props.target).toMatch(/parent/);
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.html()).toMatchSnapshot();
    wrapper.setProps({ target: "_top" });
    jest.runOnlyPendingTimers();
    wrapper.update();
    expect(wrapper.instance().props.target).toMatch(/top/);
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.html()).toMatchSnapshot();
    wrapper.setProps({ target: "_self" });
    jest.runOnlyPendingTimers();
    wrapper.update();
    expect(wrapper.instance().props.target).toMatch(/self/);
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.html()).toMatchSnapshot();
  });
});

describe(`UU5.Common.Help BaseMixin props testing`, () => {
  it("test01 - props id", () => {
    jest.useFakeTimers();
    const wrapper = shallow(<UU5.Common.Help id={"helpID01"} />);
    jest.runOnlyPendingTimers();
    wrapper.update();
    expect(wrapper.instance().props.id).toMatch(/helpID01/);
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.html()).toMatchSnapshot();
    //Here we set new props
    wrapper.setProps({ id: "helpID02" });
    jest.runOnlyPendingTimers();
    wrapper.update();
    expect(wrapper.instance().props.id).toMatch(/helpID02/);
    expect(wrapper.html()).toMatchSnapshot();
    expect(wrapper).toMatchSnapshot();
  });

  it("test02 - props name", () => {
    jest.useFakeTimers();
    const wrapper = shallow(<UU5.Common.Help id={"helpID01"} />);
    //Check default value
    jest.runOnlyPendingTimers();
    wrapper.update();
    expect(wrapper.instance().props.name).toBeNull();
    expect(wrapper.html()).toMatchSnapshot();
    expect(wrapper).toMatchSnapshot();
    //Here we set new props
    wrapper.setProps({ name: "uu5-common-help-my-name" });
    jest.runOnlyPendingTimers();
    wrapper.update();
    expect(wrapper.instance().props.name).toMatch(/uu5-common-help-my-name/);
    expect(wrapper.html()).toMatchSnapshot();
    expect(wrapper).toMatchSnapshot();
  });

  it("test03 - props tooltip", () => {
    jest.useFakeTimers();
    const wrapper = shallow(<UU5.Common.Help id={"helpID01"} />);
    //Check default value
    jest.runOnlyPendingTimers();
    expect(wrapper.instance().props.tooltip).toBeNull();
    expect(wrapper).toMatchSnapshot();
    //Here we set new props
    wrapper.setProps({ name: "This is tooltip of common.help component." });
    jest.runOnlyPendingTimers();
    wrapper.update();
    expect(wrapper.instance().props.name).toMatch(/This is tooltip of common.help component./);
    expect(wrapper.html()).toMatchSnapshot();
    expect(wrapper).toMatchSnapshot();
  });

  it("test04 - props className", () => {
    jest.useFakeTimers();
    const wrapper = shallow(<UU5.Common.Help id={"helpID01"} />);
    jest.runOnlyPendingTimers();
    //Check default value of tagName
    wrapper.update();
    //Check default value
    expect(wrapper.instance().props.className).toBeNull();
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.html()).toMatchSnapshot();
    //Here we set new props
    wrapper.setProps({ className: "MyCommonHelpClassName" });
    jest.runOnlyPendingTimers();
    wrapper.update();
    expect(wrapper.instance().props.className).toMatch(/MyCommonHelpClassName/);
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.html()).toMatchSnapshot();
  });

  it("test05 - props style", () => {
    jest.useFakeTimers();
    const wrapper = shallow(<UU5.Common.Help id={"helpID01"} />);
    jest.runOnlyPendingTimers();
    //Check default value of tagName
    wrapper.update();
    expect(wrapper.instance().props.tagName).toEqual("UU5.Common.Help");
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.html()).toMatchSnapshot();
    //Here we set new props
    wrapper.setProps({ style: "padding:8px; borderRadius: 2px" });
    jest.runOnlyPendingTimers();
    wrapper.update();
    expect(wrapper.instance().props.style).toMatch(/padding:8px; borderRadius: 2px/);
    expect(wrapper.html()).toMatchSnapshot();
    expect(wrapper).toMatchSnapshot();
  });

  it("test06 - props mainAttrs", () => {
    jest.useFakeTimers();
    const wrapper = shallow(<UU5.Common.Help id={"helpID01"} />);
    jest.runOnlyPendingTimers();
    wrapper.update();
    //Check default value of tagName
    expect(wrapper.instance().props.mainAttrs).toBeNull();
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.html()).toMatchSnapshot();
    //Here we set new props
    wrapper.setProps({ mainAttrs: { style: { backgroundColor: "red", color: "blue" } } });
    jest.runOnlyPendingTimers();
    wrapper.update();
    expect(wrapper.instance().props.mainAttrs).not.toBeNull();
    expect(wrapper.instance().props.mainAttrs).toEqual(expect.any(Object));
    expect(wrapper.html()).toMatchSnapshot();
    expect(wrapper).toMatchSnapshot();
  });

  it("test07 - props noindex", () => {
    jest.useFakeTimers();
    const wrapper = shallow(<UU5.Common.Help id={"helpID01"} />);
    jest.runOnlyPendingTimers();
    wrapper.update();
    //Check default value
    expect(wrapper.instance().props.noIndex).toBeFalsy();
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.html()).toMatchSnapshot();
    //Here we set new props
    wrapper.setProps({ noIndex: true });
    jest.runOnlyPendingTimers();
    wrapper.update();
    expect(wrapper.instance().props.noIndex).toBeTruthy();
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.html()).toMatchSnapshot();
  });
});

describe(`UU5.Common.Help ElementaryMixin props testing`, () => {
  it("test01 - props hidden", () => {
    jest.useFakeTimers();
    const wrapper = shallow(<UU5.Common.Help id={"helpID01"} />);
    jest.runOnlyPendingTimers();
    wrapper.update();
    expect(wrapper.instance().props.hidden).toBeFalsy();
    expect(wrapper.instance().state.hidden).toBeFalsy();
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.html()).toMatchSnapshot();
    wrapper.setProps({ hidden: true });
    jest.runOnlyPendingTimers();
    wrapper.update();
    expect(wrapper.instance().props.hidden).toBeTruthy();
    expect(wrapper.instance().state.hidden).toBeTruthy();
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.html()).toMatchSnapshot();
  });

  it("test02 - props disabled", () => {
    jest.useFakeTimers();
    const wrapper = shallow(<UU5.Common.Help id={"helpID01"} />);
    jest.runOnlyPendingTimers();
    wrapper.update();
    expect(wrapper.instance().props.disabled).toBeFalsy();
    expect(wrapper.instance().state.disabled).toBeFalsy();
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.html()).toMatchSnapshot();
    wrapper.setProps({ disabled: true });
    jest.runOnlyPendingTimers();
    wrapper.update();
    expect(wrapper.instance().props.disabled).toBeTruthy();
    expect(wrapper.instance().state.disabled).toBeTruthy();
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.html()).toMatchSnapshot();
  });

  it("test03 - props selected", () => {
    jest.useFakeTimers();
    const wrapper = shallow(<UU5.Common.Help id={"helpID01"} />);
    jest.runOnlyPendingTimers();
    wrapper.update();
    expect(wrapper.instance().props.selected).toBeFalsy();
    expect(wrapper.instance().state.selected).toBeFalsy();
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.html()).toMatchSnapshot();
    wrapper.setProps({ selected: true });
    jest.runOnlyPendingTimers();
    wrapper.update();
    expect(wrapper.instance().props.selected).toBeTruthy();
    expect(wrapper.instance().state.selected).toBeTruthy();
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.html()).toMatchSnapshot();
  });

  it("test04 - props controlled", () => {
    jest.useFakeTimers();
    const wrapper = shallow(<UU5.Common.Help id={"helpID01"} />);
    jest.runOnlyPendingTimers();
    wrapper.update();
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.html()).toMatchSnapshot();
    wrapper.setProps({ controlled: false });
    jest.runOnlyPendingTimers();
    wrapper.update();
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.html()).toMatchSnapshot();
  });
});

describe(`UU5.Common.Help ContentMixin props testing`, () => {
  it("test01 - props content", () => {
    jest.useFakeTimers();
    const wrapper = shallow(<UU5.Common.Help id={"helpID01"} />);
    jest.runOnlyPendingTimers();
    wrapper.update();
    expect(wrapper.instance().props.content).toBeNull();
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.html()).toMatchSnapshot();
    wrapper.setProps({ content: "Content String" });
    jest.runOnlyPendingTimers();
    wrapper.update();
    expect(wrapper.instance().props.content).toMatch(/Content String/);
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.html()).toMatchSnapshot();
  });

  it("test02 - props ignoreInnerHTML", () => {
    jest.useFakeTimers();
    const wrapper = shallow(<UU5.Common.Help id={"helpID01"} content={"<UU5.Bricks.Icon />"} />);
    jest.runOnlyPendingTimers();
    wrapper.update();
    expect(wrapper.instance().props.ignoreInnerHTML).toBeFalsy();
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.html()).toMatchSnapshot();
    wrapper.setProps({ ignoreInnerHTML: true });
    jest.runOnlyPendingTimers();
    wrapper.update();
    expect(wrapper.instance().props.ignoreInnerHTML).toBeTruthy();
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.html()).toMatchSnapshot();
  });

  it("test03 - props checkSpaces", () => {
    jest.useFakeTimers();
    const wrapper = shallow(
      <UU5.Common.Help id={"helpID01"} content={"V ceně 5 000 000 Kč není zahrnuto vše, i když to bylo slíbeno."} />
    );
    jest.runOnlyPendingTimers();
    wrapper.update();
    expect(wrapper.instance().props.checkSpaces).toBeFalsy();
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.html()).toMatchSnapshot();
    wrapper.setProps({ checkSpaces: true });
    jest.runOnlyPendingTimers();
    wrapper.update();
    expect(wrapper.instance().props.checkSpaces).toBeTruthy();
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.html()).toMatchSnapshot();
  });

  it("test04 - props checkGrammar", () => {
    jest.useFakeTimers();
    const wrapper = shallow(
      <UU5.Common.Help id={"helpID01"} textCorrector={false} content={"V potoce plave vidra."} />
    );
    jest.runOnlyPendingTimers();
    wrapper.update();
    expect(wrapper.instance().props.checkGrammar).toBeFalsy();
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.html()).toMatchSnapshot();
    wrapper.setProps({ checkGrammar: true });
    jest.runOnlyPendingTimers();
    wrapper.update();
    expect(wrapper.instance().props.checkGrammar).toBeTruthy();
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.html()).toMatchSnapshot();
  });

  it("test05 - props checkHighlight", () => {
    jest.useFakeTimers();
    const wrapper = shallow(<UU5.Common.Help id={"helpID01"} content={"V potoce plave vydra."} />);
    jest.runOnlyPendingTimers();
    wrapper.update();
    expect(wrapper.instance().props.checkHighlight).toBeFalsy();
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.html()).toMatchSnapshot();
    wrapper.setProps({ checkHighlight: true });
    jest.runOnlyPendingTimers();
    wrapper.update();
    expect(wrapper.instance().props.checkHighlight).toBeTruthy();
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.html()).toMatchSnapshot();
  });

  it("test06 - props textCorrector", () => {
    jest.useFakeTimers();
    const wrapper = shallow(<UU5.Common.Help id={"helpID01"} content={"V potoce plave vidra."} />);
    jest.runOnlyPendingTimers();
    wrapper.update();
    expect(wrapper.instance().props.textCorrector).toBeFalsy();
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.html()).toMatchSnapshot();
    wrapper.setProps({ textCorrector: true });
    jest.runOnlyPendingTimers();
    wrapper.update();
    expect(wrapper.instance().props.textCorrector).toBeTruthy();
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.html()).toMatchSnapshot();
  });

  it("test07 - props dynamic", () => {
    jest.useFakeTimers();
    const wrapper = shallow(<UU5.Common.Help id={"helpID01"} />);
    jest.runOnlyPendingTimers();
    wrapper.update();
    expect(wrapper.instance().props.dynamic).toBeFalsy();
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.html()).toMatchSnapshot();
    wrapper.setProps({ dynamic: true });
    jest.runOnlyPendingTimers();
    wrapper.update();
    expect(wrapper.instance().props.dynamic).toBeTruthy();
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.html()).toMatchSnapshot();
  });

  it("test08 - props mode", () => {
    jest.useFakeTimers();
    const wrapper = shallow(<UU5.Common.Help id={"helpID01"} />);
    jest.runOnlyPendingTimers();
    wrapper.update();
    expect(wrapper.instance().props.mode).toBe(undefined);
    expect(wrapper).toMatchSnapshot();
    wrapper.setProps({ mode: "outline" });
    jest.runOnlyPendingTimers();
    wrapper.update();
    expect(wrapper.instance().props.mode).toMatch(/outline/);
    expect(wrapper).toMatchSnapshot();
  });
});

describe("UU5.Common.Help PureRenderMixin props testing", () => {
  it("test01 - pureRender props", () => {
    jest.useFakeTimers();
    const wrapper = shallow(<UU5.Common.Help id={"helpID01"} />);
    jest.runOnlyPendingTimers();
    wrapper.update();
    expect(wrapper.instance().props.pureRender).toBeFalsy();
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.html()).toMatchSnapshot();
    wrapper.setProps({ pureRender: true });
    jest.runOnlyPendingTimers();
    wrapper.update();
    expect(wrapper.instance().props.pureRender).toBeTruthy();
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.html()).toMatchSnapshot();
  });
});
