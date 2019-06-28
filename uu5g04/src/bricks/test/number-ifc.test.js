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

const TagName = "UU5.Bricks.Number";

describe(`${TagName} interface testing`, () => {

  it('getThousandSeparator()', () => {
    const wrapper = shallow(
      <UU5.Bricks.Number
        id={"uuID"}
        thousandSeparator=","
        value={8766641564}
      />
    );
    expect(wrapper.instance().getThousandSeparator()).toMatch(/,/);
    expect(wrapper).toMatchSnapshot();
  });

  it('setThousandSeparator(separator,setStateCallBack)', () => {
    const wrapper = shallow(
      <UU5.Bricks.Number
        id={"uuID"}
        value={8766641564}
      />
    );
    const mockFunc = jest.fn();
    expect(wrapper.instance().getThousandSeparator()).toMatch(/&nbsp;/);
    expect(wrapper).toMatchSnapshot();
    const returnValue = wrapper.instance().setThousandSeparator(".", mockFunc);
    wrapper.update();
    expect(wrapper.instance().getThousandSeparator()).toMatch(/./);
    expect(mockFunc).toBeCalled();
    expect(mockFunc).toHaveBeenCalledTimes(1);
    expect(returnValue).toBe(wrapper.instance());
    expect(wrapper).toMatchSnapshot();
  });

  it('getDecimalSeparator()', () => {
    const wrapper = shallow(
      <UU5.Bricks.Number
        id={"uuID"}
        decimalSeparator="."
        value={87661564.1234}
      />
    );
    expect(wrapper.instance().getDecimalSeparator()).toMatch(/./);
    expect(wrapper).toMatchSnapshot();
  });

  it('setDecimalSeparator(separator, setStateCallBack)', () => {
    const wrapper = shallow(
      <UU5.Bricks.Number
        id={"uuID"}
        value={87661564.1234}
      />
    );
    expect(wrapper.instance().getDecimalSeparator()).toMatch(/,/);
    const mockFunc = jest.fn();
    expect(wrapper).toMatchSnapshot();
    const returnValue = wrapper.instance().setDecimalSeparator(".", mockFunc);
    wrapper.update();
    expect(wrapper.instance().getDecimalSeparator()).toMatch(/./);
    expect(mockFunc).toBeCalled();
    expect(mockFunc).toHaveBeenCalledTimes(1);
    expect(returnValue).toBe(wrapper.instance());
    expect(wrapper).toMatchSnapshot();
  });

  it('getCountry()', () => {
    const wrapper = shallow(
      <UU5.Bricks.Number
        id={"uuID"}
        value={8761564}
        country="cz-CZ"
      />
    );
    expect(wrapper.instance().getCountry()).toMatch(/cz-CZ/);
    expect(wrapper).toMatchSnapshot();
  });

  it('setCountry(country, setStateCallBack)', () => {
    const wrapper = shallow(
      <UU5.Bricks.Number
        id={"uuID"}
        value={8761564}
        country="cz-CZ"
      />
    );
    expect(wrapper.instance().getCountry()).toMatch(/cz-CZ/);
    const mockFunc = jest.fn();
    expect(wrapper).toMatchSnapshot();
    const returnValue = wrapper.instance().setCountry("en-US", mockFunc);
    wrapper.update();
    expect(wrapper.instance().getCountry()).toMatch(/en-US/);
    expect(mockFunc).toBeCalled();
    expect(mockFunc).toHaveBeenCalledTimes(1);
    expect(returnValue).toBe(wrapper.instance());
    expect(wrapper).toMatchSnapshot();
  });

  it('setOptions(setStateCallBack)', () => {
    const wrapper = shallow(
      <UU5.Bricks.Number
        id={"uuID"}
        value={8761564}
      />
    );
    const mockFunc = jest.fn();
    expect(wrapper.instance().getCountry()).toBeUndefined();
    expect(wrapper.instance().getThousandSeparator()).toMatch(/&nbsp;/);
    expect(wrapper.instance().getDecimalSeparator()).toMatch(/,/);
    expect(wrapper).toMatchSnapshot();
    const returnValue = wrapper.instance().setOptions({
      country: "en-GB",
      thousandSeparator: ",",
      decimalSeparator: "."
    }, mockFunc);
    wrapper.update();
    expect(mockFunc).toBeCalled();
    expect(mockFunc).toHaveBeenCalledTimes(1);
    expect(returnValue).toBe(wrapper.instance());
    expect(wrapper.instance().getCountry()).toMatch(/en-GB/);
    expect(wrapper.instance().getThousandSeparator()).toMatch(/,/);
    expect(wrapper.instance().getDecimalSeparator()).toMatch(/./);
    expect(wrapper).toMatchSnapshot();
  });


});
