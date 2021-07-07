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

describe("UU5.Bricks.Video interface testing", () => {
  it("toggleMuted(setStateCallBack)", () => {
    const wrapper = shallow(
      <UU5.Bricks.Video
        id={"uuID01"}
        src="http://www.sample-videos.com/video/mp4/240/big_buck_bunny_240p_5mb.mp4"
        autoPlay={true}
      />
    );
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.instance().state.muted).toBeFalsy();
    const returtValue = wrapper.instance().toggleMuted();
    wrapper.update();
    expect(returtValue === wrapper.instance()).toBe(true);
    expect(wrapper.instance().state.muted).toBeTruthy();
    expect(wrapper).toMatchSnapshot();
    wrapper.instance().toggleMuted();
    wrapper.update();
    expect(wrapper.instance().state.muted).toBeFalsy();
    expect(wrapper).toMatchSnapshot();
  });
});
