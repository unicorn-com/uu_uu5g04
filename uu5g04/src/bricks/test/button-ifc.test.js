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
import enzymeToJson from 'enzyme-to-json';

const TagName = "UU5.Bricks.Button";

describe(`${TagName} interface testing`, () => {

  it('setActive(true)', () => {
    const wrapper = shallow(
      <UU5.Bricks.Button
        id={"uuID_BTN"}
        content={"IFC BUTTON TESTING"}
      />
    );
    const mockFunc = jest.fn();
    expect(enzymeToJson(wrapper)).toMatchSnapshot();
    expect(wrapper.instance().state.pressed).toBeFalsy();
    expect(wrapper.instance().isPressed()).toBeFalsy();
    // test before calling interface
    expect(wrapper.instance().state.pressed).toEqual(false);
    const returnValue = wrapper.instance().setActive(true, mockFunc);
    wrapper.update();
    expect(wrapper.instance().state.pressed).toBeTruthy();
    expect(mockFunc).toBeCalled();
    expect(mockFunc).toHaveBeenCalledTimes(1);
    expect(returnValue).toBe(wrapper.instance());
    expect(wrapper.instance().isPressed()).toBeTruthy();
    expect(enzymeToJson(wrapper)).toMatchSnapshot();
  });

  it('setActive(false)', () => {
    const wrapper = shallow(
      <UU5.Bricks.Button
        id={"uuID_BTN"}
        pressed={true}
        content={"IFC BUTTON TESTING"}
      />
    );
    const mockFunc = jest.fn();
    expect(enzymeToJson(wrapper)).toMatchSnapshot();
    expect(wrapper.instance().isPressed()).toBeTruthy();
    expect(wrapper.instance().state.pressed).toBeTruthy();
    // test before calling interface
    expect(wrapper.instance().state.pressed).toEqual(true);
    const returnValue = wrapper.instance().setActive(false, mockFunc);
    wrapper.update();
    expect(enzymeToJson(wrapper)).toMatchSnapshot();
    expect(wrapper.instance().state.pressed).toBeFalsy();
    expect(mockFunc).toBeCalled();
    expect(mockFunc).toHaveBeenCalledTimes(1);
    expect(wrapper.instance().isPressed()).toBeFalsy();
    expect(returnValue).toBe(wrapper.instance());
  });

  it('press()', () => {
    const wrapper = shallow(
      <UU5.Bricks.Button
        id={"uuID_BTN"}
        pressed={false}
        content={"IFC BUTTON TESTING"}
      />
    );
    const mockFunc = jest.fn();
    expect(enzymeToJson(wrapper)).toMatchSnapshot();
    expect(wrapper.instance().isPressed()).toBeFalsy();
    expect(wrapper.instance().state.pressed).toBeFalsy();
    const returnValue = wrapper.instance().press(mockFunc);
    wrapper.update();
    expect(enzymeToJson(wrapper)).toMatchSnapshot();
    expect(wrapper.instance().state.pressed).toBeTruthy();
    expect(mockFunc).toBeCalled();
    expect(mockFunc).toHaveBeenCalledTimes(1);
    expect(wrapper.instance().isPressed()).toBeTruthy();
    expect(returnValue).toBe(wrapper.instance());
  });

  it('pressUp()', () => {
    const wrapper = shallow(
      <UU5.Bricks.Button
        id={"uuID_BTN"}
        pressed={true}
        content={"IFC BUTTON TESTING"}
      />
    );
    const mockFunc = jest.fn();
    expect(enzymeToJson(wrapper)).toMatchSnapshot();
    expect(wrapper.instance().isPressed()).toBeTruthy();
    expect(wrapper.instance().state.pressed).toBeTruthy();
    const returnValue = wrapper.instance().pressUp(mockFunc);
    wrapper.update();
    expect(enzymeToJson(wrapper)).toMatchSnapshot();
    expect(wrapper.instance().state.pressed).toBeFalsy();
    expect(mockFunc).toBeCalled();
    expect(mockFunc).toHaveBeenCalledTimes(1);
    expect(wrapper.instance().isPressed()).toBeFalsy();
    expect(returnValue).toBe(wrapper.instance());
  });

  it('togglePressed()', () => {
    const wrapper = shallow(
      <UU5.Bricks.Button
        id={"uuID_BTN"}
        pressed={false}
        content={"IFC BUTTON TESTING"}
      />
    );
    const mockFunc = jest.fn();
    expect(enzymeToJson(wrapper)).toMatchSnapshot();
    expect(wrapper.instance().isPressed()).toBeFalsy();
    expect(wrapper.instance().state.pressed).toBeFalsy();
    const returnValue = wrapper.instance().togglePressed(mockFunc);
    wrapper.update();
    expect(enzymeToJson(wrapper)).toMatchSnapshot();
    expect(wrapper.instance().state.pressed).toBeTruthy();
    expect(mockFunc).toBeCalled();
    expect(mockFunc).toHaveBeenCalledTimes(1);
    expect(wrapper.instance().isPressed()).toBeTruthy();
    expect(returnValue).toBe(wrapper.instance());
  });

  it('togglePressed() set to pressed=false', () => {
    const wrapper = shallow(
      <UU5.Bricks.Button
        id={"uuID_BTN"}
        pressed={true}
        content={"IFC BUTTON TESTING"}
      />
    );
    const mockFunc = jest.fn();
    expect(enzymeToJson(wrapper)).toMatchSnapshot();
    expect(wrapper.instance().isPressed()).toBeTruthy();
    expect(wrapper.instance().state.pressed).toBeTruthy();
    const returnValue = wrapper.instance().togglePressed(mockFunc);
    wrapper.update();
    expect(enzymeToJson(wrapper)).toMatchSnapshot();
    expect(wrapper.instance().state.pressed).toBeFalsy();
    expect(mockFunc).toBeCalled();
    expect(mockFunc).toHaveBeenCalledTimes(1);
    expect(wrapper.instance().isPressed()).toBeFalsy();
    expect(returnValue).toBe(wrapper.instance());
  });

  it('isPressed() props.pressed is true', () => {
    const wrapper = shallow(
      <UU5.Bricks.Button
        id={"uuID_BTN"}
        pressed={true}
        content={"IFC BUTTON TESTING"}
      />
    );
    expect(enzymeToJson(wrapper)).toMatchSnapshot();
    expect(wrapper.instance().state.pressed).toBeTruthy();
    expect(wrapper.instance().isPressed()).toBeTruthy();
  });

  it('isPressed() props.pressed is false', () => {
    const wrapper = shallow(
      <UU5.Bricks.Button
        id={"uuID_BTN"}
        pressed={false}
        content={"IFC BUTTON TESTING"}
      />
    );
    expect(enzymeToJson(wrapper)).toMatchSnapshot();
    expect(wrapper.instance().state.pressed).toBeFalsy();
    expect(wrapper.instance().isPressed()).toBeFalsy();
  });

});
