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
import {mount} from 'enzyme';
import UU5 from "uu5g04";
import "uu5g04-bricks";


describe('UU5.Bricks.Popover ifc testing', () => {

  let container;
  beforeEach(function() {
    container = document.createElement('div');
    document.body.appendChild(container);
  });
  afterEach(function() {
    container.remove();
  });

  // IFC methods require "mount" instead of "shallow" because they use document.getElementById...
  it('open()', () => {
    const wrapper = mount(
      <UU5.Bricks.Popover id={"uuID"} shown={false} header='Header' footer='Footer'>
        <UU5.Bricks.Div id={"uuID2"} style={{textAlign: "center", width: "100%"}}>
          <UU5.Bricks.Button id={"uuID3"} bgStyle="transparent" content="OK"/>
          <br/>
          <UU5.Bricks.Button id={"uuID4"} bgStyle="transparent" content="Storno"/>
        </UU5.Bricks.Div>
      </UU5.Bricks.Popover>,
      { attachTo: container }
    );
    const mockFunc = jest.fn();
    expect(wrapper.instance().isOpen()).toBeFalsy();
    expect(wrapper.instance().state.hidden).toBeTruthy();
    const returnValue = wrapper.instance().open();
    wrapper.update();
    expect(wrapper.instance().isOpen()).toBeTruthy();
    expect(returnValue).toBe(wrapper.instance());
  });


  it('close()', () => {
    const wrapper = mount(
      <UU5.Bricks.Popover id={"uuID"} shown header='Header' footer='Footer'>
        <UU5.Bricks.Div id={"uuID2"} style={{textAlign: "center", width: "100%"}}>
          <UU5.Bricks.Button id={"uuID3"} bgStyle="transparent" content="OK"/>
          <br/>
          <UU5.Bricks.Button id={"uuID4"} bgStyle="transparent" content="Storno"/>
        </UU5.Bricks.Div>
      </UU5.Bricks.Popover>,
      { attachTo: container }
    );
    const mockFunc = jest.fn();
    expect(wrapper.instance().state.hidden).toBeFalsy();
    expect(wrapper.instance().isOpen()).toBeTruthy();
    const returnValue = wrapper.instance().close(mockFunc);
    wrapper.update();
    expect(wrapper.instance().state.hidden).toBeTruthy();
    expect(wrapper.instance().isOpen()).toBeFalsy();
    expect(mockFunc).toBeCalled();
    expect(mockFunc).toHaveBeenCalledTimes(1);
    expect(returnValue).toBe(wrapper.instance());
  });

  it('isOpen() should return true', () => {
    const wrapper = mount(
      <UU5.Bricks.Popover id={"uuID"} shown header='Header' footer='Footer'>
        <UU5.Bricks.Div id={"uuID2"} style={{textAlign: "center", width: "100%"}}>
          <UU5.Bricks.Button id={"uuID3"} bgStyle="transparent" content="OK"/>
          <br/>
          <UU5.Bricks.Button id={"uuID4"} bgStyle="transparent" content="Storno"/>
        </UU5.Bricks.Div>
      </UU5.Bricks.Popover>,
      { attachTo: container }
    );
    expect(wrapper.instance().state.hidden).toBeFalsy();
    expect(wrapper.instance().isOpen()).toBeTruthy();
  });

  it('isOpen() should return false', () => {
    const wrapper = mount(
      <UU5.Bricks.Popover id={"uuID"} shown={false} header='Header' footer='Footer'>
        <UU5.Bricks.Div id={"uuID2"} style={{textAlign: "center", width: "100%"}}>
          <UU5.Bricks.Button id={"uuID3"} bgStyle="transparent" content="OK"/>
          <br/>
          <UU5.Bricks.Button id={"uuID4"} bgStyle="transparent" content="Storno"/>
        </UU5.Bricks.Div>
      </UU5.Bricks.Popover>,
      { attachTo: container }
    );
    expect(wrapper.instance().state.hidden).toBeTruthy();
    expect(wrapper.instance().isOpen()).toBeFalsy();
  });


});
