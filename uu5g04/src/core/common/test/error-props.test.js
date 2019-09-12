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

import React from 'react';
import {shallow, mount} from 'enzyme';
import UU5 from "uu5g04";
import "uu5g04-bricks";
import enzymeToJson from 'enzyme-to-json';
import TestTools from "../../../core/test/test-tools.js";
import createReactClass from "create-react-class";

//`${TagName}`

const TagName = "UU5.Common.Error";

const data = {invalidToken: {"id": "123", "data": "some data..."}};
const newdata = {invalidToken: {"id": "456", "data": "some new set props data..."}};

// force navigator.hardwareConcurrency to 8 so that it doesn't differ between developers machines (used in snapshot of test "moreInfo")
Object.defineProperty(navigator, "hardwareConcurrency", {
  get() {
    return 8;
  }
});
// force userAgent string so that it doesn't change between versions of jsdom
Object.defineProperty(navigator, "userAgent", {
  get() {
    return "Mozilla/5.0 (win32) AppleWebKit/537.36 (KHTML, like Gecko) jsdom";
  }
});

const CONFIG = {
  mixins: [
    "UU5.Common.BaseMixin",
    "UU5.Common.ElementaryMixin",
    "UU5.Common.ContentMixin",
    "UU5.Common.NestingLevelMixin",
    "UU5.Common.PureRenderMixin",
    "UU5.Common.ColorSchemaMixin"
  ],
  props: {
    errorInfo: {
      values: ["Kontaktujte prosím +4U Helpdesk"]
    },
    moreInfo: {
      values: [true, false]
    },
    inline: {
      values: [true, false]
    },
    silent: {
      values: [true, false]
    },
    errorData: {
      data
    },
    bgStyle: {
      values: ["filled", "outline", "transparent"]
    },
    elevation: {
      values: ["-1", "5"]
    },
    borderRadius: {
      values: ["8px"]
    },
    //Error props is tested separatelly.
    error: {}
  },
  requiredProps: {},
  opt: {
    enzymeToJson: false,
    shallowOpt: {
      disableLifecycleMethods: false
    },
  }
};

describe(`${TagName} props`, () => {
  TestTools.testProperties(TagName, CONFIG);

  it('error props test', () => {

    const wrapper = shallow(
      <UU5.Common.Error
        id={"errorID"}
        error={new Error("This is test of error props")}
      />
    );
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.instance().props.error).not.toBeNull();
    expect(wrapper.instance().props.error).not.toBeUndefined();
    wrapper.setProps({error: new Error("This is new error setting by wrapper")});
    wrapper.update();
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.instance().props.error).not.toBeNull();
    expect(wrapper.instance().props.error).not.toBeUndefined();
  });

});


describe('UU5.Common.Error props without test tool API', () => {

  it('test01 - default snapshot', () => {
    const wrapper = mount(
      <UU5.Common.Error
        id={"errorID"}
      />
    );
    expect(enzymeToJson(wrapper)).toMatchSnapshot();
  });

  it('test02 - erroData', () => {
    const wrapper = mount(
      <UU5.Common.Error
        id={"errorID"}
        errorData={data}
      />
    );
    expect(enzymeToJson(wrapper)).toMatchSnapshot();
    expect(wrapper.instance().props.errorData).toEqual(expect.objectContaining(
      {invalidToken: {id: '123', data: 'some data...'}}
    ));
    wrapper.setProps({errorData: newdata});
    wrapper.update();
    expect(wrapper.instance().props.errorData).toEqual(expect.objectContaining(
      {invalidToken: {id: '456', data: 'some new set props data...'}}
    ));
    expect(enzymeToJson(wrapper)).toMatchSnapshot();
  });

  it('test03 - error', () => {
    const wrapper = mount(
      <UU5.Common.Error
        id={"errorID"}
        error={new Error("This is unhandled exception from Jest")}
      />
    );
    expect(enzymeToJson(wrapper)).toMatchSnapshot();
  });

  it('test04 - error', () => {
    const wrapper = mount(
      <UU5.Common.Error
        id={"errorID"}
      />
    );
    expect(enzymeToJson(wrapper)).toMatchSnapshot();
    expect(wrapper.instance().props.silent).toBeFalsy();
    wrapper.setProps({silent: true});
    wrapper.update();
    expect(wrapper.instance().props.silent).toBeTruthy();
    expect(enzymeToJson(wrapper)).toMatchSnapshot();
  });

  it('test05 - inline', () => {
    const wrapper = mount(
      <UU5.Common.Error
        id={"errorID"}
      />
    );
    expect(enzymeToJson(wrapper)).toMatchSnapshot();
    expect(wrapper.instance().props.inline).toBeFalsy();
    wrapper.setProps({inline: true});
    wrapper.update();
    expect(wrapper.instance().props.inline).toBeTruthy();
    expect(enzymeToJson(wrapper)).toMatchSnapshot();
  });


  it('test06 - moreInfo', () => {
    const wrapper = shallow(
      <UU5.Common.Error
        id={"errorID"}
      />
    );
    expect(enzymeToJson(wrapper)).toMatchSnapshot();
    expect(wrapper.instance().props.moreInfo).toBeFalsy();
    wrapper.setProps({moreInfo: true});
    wrapper.update();
    expect(wrapper.instance().props.moreInfo).toBeTruthy();
    expect(enzymeToJson(wrapper)).toMatchSnapshot();
  });

  it('test07 - errorInfo', () => {
    const wrapper = mount(
      <UU5.Common.Error
        id={"errorID"}
      />
    );
    expect(enzymeToJson(wrapper)).toMatchSnapshot();
    expect(wrapper.instance().props.errorInfo).toBeNull();
    wrapper.setProps({errorInfo: "Please contact +4U Helpdesk"});
    wrapper.update();
    expect(wrapper.instance().props.errorInfo).not.toBeNull();
    expect(enzymeToJson(wrapper)).toMatchSnapshot();
  });


  it('test08 - All Error props is set', () => {
    const wrapper = mount(
      <UU5.Common.Error
        id={"errorID"}
        errorData={data}
        error={new Error("Unhandled exception")}
        silent={true}
        inline={true}
        moreInfo={true}
        errorInfo={"Please contact helpdesk."}
      />
    );
    expect(enzymeToJson(wrapper)).toMatchSnapshot();
  });

});
