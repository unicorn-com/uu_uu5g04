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
import TestTools from "../../core/test/test-tools.js";
import renderer from 'react-test-renderer';

const TagName = "UU5.Bricks.Swiper.Body";

const CONFIG = {
  mixins: [
    "UU5.Common.BaseMixin",
    "UU5.Common.ElementaryMixin",
    "UU5.Common.ContentMixin",
    "UU5.Common.NestingLevelMixin",
    "UU5.Common.PureRenderMixin"
  ],
  props: {

  },
  requiredProps: {
    parent: shallow(<UU5.Bricks.Swiper id="parentId"/>).instance()
  },
  opt: {
    shallowOpt: {
      disableLifecycleMethods: false
    },
    enzymeToJson: false
  }
};

describe(`${TagName}`, () => {
  TestTools.testProperties(TagName, CONFIG);
});


describe(`${TagName} docKit examples`, () => {
  it(`${TagName} example01`, () => {
    const wrapper = renderer.create(
      <UU5.Bricks.Swiper
        id={"uuID"}
        style={{
          backgroundColor: "lightblue",
          minHeight: "200px",
          width: "100%"
        }}
      >
        {/*@@viewOn:0*/}
        <UU5.Bricks.Swiper.Body id={"uuID2"}>
          <UU5.Bricks.P id={"uuID3"} className="center">
            On touch screen you can open menus by swipe on blue area. If you dont have touchscreen, turn on
            console(chrome - F12) and switch to mobile device view by pressing icon at top left corner of the
            console or by pressing ctrl+shift+M.
          </UU5.Bricks.P>
        </UU5.Bricks.Swiper.Body>
        {/*@@viewOff:0*/}
      </UU5.Bricks.Swiper>
    ).toJSON();
    expect(wrapper).toMatchSnapshot();
  });
});










