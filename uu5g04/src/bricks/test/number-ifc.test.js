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

const { mount } = UU5.Test.Tools;

describe(`UU5.Bricks.Number interface testing`, () => {
  it("getThousandSeparator()", () => {
    const wrapper = mount(<UU5.Bricks.Number id={"uuID"} value={8766641564} />);
    expect(wrapper.instance().getThousandSeparator()).toBe(",");
    wrapper.setProps({ thousandSeparator: ";" });
    expect(wrapper.instance().getThousandSeparator()).toBe(";");
  });

  it("setThousandSeparator(separator,setStateCallBack)", () => {
    const wrapper = mount(<UU5.Bricks.Number id={"uuID"} value={8766641564} />);
    const mockFunc = jest.fn();
    expect(wrapper.instance().getThousandSeparator()).toBe(",");
    const returnValue = wrapper.instance().setThousandSeparator(";", mockFunc);
    wrapper.update();
    expect(wrapper.instance().getThousandSeparator()).toBe(";");
    expect(mockFunc).toHaveBeenCalledTimes(1);
    expect(returnValue === wrapper.instance()).toBeTruthy();
  });

  it("getDecimalSeparator()", () => {
    const wrapper = mount(<UU5.Bricks.Number id={"uuID"} value={87661564.1234} />);
    expect(wrapper.instance().getDecimalSeparator()).toBe(".");
    wrapper.setProps({ decimalSeparator: ";" });
    expect(wrapper.instance().getDecimalSeparator()).toBe(";");
  });

  it("setDecimalSeparator(separator, setStateCallBack)", () => {
    const wrapper = mount(<UU5.Bricks.Number id={"uuID"} value={87661564.1234} />);
    expect(wrapper.instance().getDecimalSeparator()).toBe(".");
    const mockFunc = jest.fn();
    const returnValue = wrapper.instance().setDecimalSeparator(";", mockFunc);
    wrapper.update();
    expect(wrapper.instance().getDecimalSeparator()).toBe(";");
    expect(mockFunc).toHaveBeenCalledTimes(1);
    expect(returnValue === wrapper.instance()).toBeTruthy();
  });

  it("getCountry()", () => {
    const wrapper = mount(<UU5.Bricks.Number id={"uuID"} value={8761564} country="cz-CZ" />);
    expect(wrapper.instance().getCountry()).toBe("cz-CZ");
    wrapper.setProps({ country: "sk-SK" });
    expect(wrapper.instance().getCountry()).toBe("sk-SK");
  });

  it("setCountry(country, setStateCallBack)", () => {
    const wrapper = mount(<UU5.Bricks.Number id={"uuID"} value={8761564} country="cz-CZ" />);
    expect(wrapper.instance().getCountry()).toBe("cz-CZ");
    const mockFunc = jest.fn();
    const returnValue = wrapper.instance().setCountry("en-US", mockFunc);
    wrapper.update();
    expect(wrapper.instance().getCountry()).toBe("en-US");
    expect(mockFunc).toHaveBeenCalledTimes(1);
    expect(returnValue === wrapper.instance()).toBeTruthy();
  });

  it("setOptions(setStateCallBack)", () => {
    const wrapper = mount(<UU5.Bricks.Number id={"uuID"} value={8761564} />);
    const mockFunc = jest.fn();
    const returnValue = wrapper.instance().setOptions(
      {
        country: "sk-SK",
        thousandSeparator: ";",
        decimalSeparator: "_"
      },
      mockFunc
    );
    wrapper.update();
    expect(mockFunc).toHaveBeenCalledTimes(1);
    expect(returnValue === wrapper.instance()).toBeTruthy();
    expect(wrapper.instance().getCountry()).toBe("sk-SK");
    expect(wrapper.instance().getThousandSeparator()).toBe(";");
    expect(wrapper.instance().getDecimalSeparator()).toBe("_");
  });
});
