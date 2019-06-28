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
import {shallow} from 'enzyme';
import UU5 from "uu5g04";
import "uu5g04-bricks";

const TagName = "UU5.Bricks.Iframe";

describe(`${TagName} interface testing`, () => {

  //In src should be file from same server when test running. Forexampple localhost.
  //Bud does not working.
  it('resize(setStateCallBack)', () => {
    const wrapper = shallow(
      <UU5.Bricks.Iframe
        id={"uuID01"}
        height={"300"}
        //src='http://localhost:4321/bricks/test/bricks/examples.html'
        src="https://plus4u.net/"
        resize={true}
      />
    );
    const mockFunc = jest.fn();
    expect(wrapper).toMatchSnapshot();
    const returnValue = wrapper.instance().resize(mockFunc);
    wrapper.update();
    expect(mockFunc).toBeCalled();
    expect(returnValue).toBe(wrapper.instance());
    expect(wrapper).toMatchSnapshot();
  });

  it('setSize(w,h,setStateCallBack)', () => {
    const wrapper = shallow(
      <UU5.Bricks.Iframe
        id={"uuID01"}
        height={"300"}
        src='https://plus4u.net'
      />
    );
    const mockFunc = jest.fn();
    expect(wrapper.instance().state.height).toBe(0);
    expect(wrapper.instance().state.width).toBe(0);
    expect(wrapper).toMatchSnapshot();
    const returnValue = wrapper.instance().setSize("450", "450", mockFunc);
    wrapper.update();
    expect(wrapper).toMatchSnapshot();
    expect(mockFunc).toBeCalled();
    expect(mockFunc).toHaveBeenCalledTimes(1);
    expect(returnValue).toBe(wrapper.instance());
    expect(wrapper.instance().state.height).toMatch(/450/);
    expect(wrapper.instance().state.width).toMatch(/450/);
  });

});
