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

describe('UU5.Bricks.Audio interface testing', () => {

  it('toggleMuted(setStateCallBack)', () => {
    const wrapper = shallow(
      <UU5.Bricks.Audio
        id={"uuID01"}
        src="http://www.noiseaddicts.com/samples_1w72b820/3724.mp3"
        autoPlay={true}
      />
    );
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.instance().state.muted).toBeFalsy();
    const returtValue = wrapper.instance().toggleMuted();
    wrapper.update();
    expect(returtValue).toBe(wrapper.instance());
    expect(wrapper.instance().state.muted).toBeTruthy();
    expect(wrapper).toMatchSnapshot();
    wrapper.instance().toggleMuted();
    wrapper.update();
    expect(wrapper.instance().state.muted).toBeFalsy();
    expect(wrapper).toMatchSnapshot();
  });

});
