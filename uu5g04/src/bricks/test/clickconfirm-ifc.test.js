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

import UU5 from "uu5g04";
import "uu5g04-bricks";

const { mount, shallow, wait } = UU5.Test.Tools;

describe(`UU5.Bricks.ClickConfirm interface testing`, () => {
  it("open(attrs)", () => {
    const wrapper = shallow(<UU5.Bricks.ClickConfirm id={"uuID-confirm"} content={"ClickConfirm content"} />);
    expect(wrapper).toMatchSnapshot();
    const returnValue = wrapper.instance().open({ content: <UU5.Bricks.Badge content="Verified" /> });
    wrapper.update();
    expect(wrapper).toMatchSnapshot();
    expect(returnValue === wrapper.instance()).toBe(true);
  });

  it("close(setStateCallBack)", () => {
    const wrapper = shallow(<UU5.Bricks.ClickConfirm id={"uuID-confirm"} content={"ClickConfirm content"} />);
    const mockFunc = jest.fn();
    expect(wrapper).toMatchSnapshot();
    const returnValue = wrapper.instance().close(mockFunc);
    wrapper.update();
    expect(wrapper).toMatchSnapshot();
    expect(mockFunc).toBeCalled();
    expect(mockFunc).toHaveBeenCalledTimes(1);
    expect(returnValue === wrapper.instance()).toBe(true);
  });
});
