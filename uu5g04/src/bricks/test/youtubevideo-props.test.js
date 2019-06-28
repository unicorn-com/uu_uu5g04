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
import TestTools from "../../core/test/test-tools.js";


const TagName = "UU5.Bricks.YoutubeVideo";

const CONFIG = {
  mixins: [
    "UU5.Common.BaseMixin",
    "UU5.Common.ElementaryMixin",
    "UU5.Common.NestingLevelMixin",
    "UU5.Common.PureRenderMixin"
  ],
  props: {
    src: {
      values: ["https://www.youtube.com/watch?v=xfG15i_uQvc"]
    },
    autoPlay: {
      values: [true, false]
    },
    disableControls: {
      values: [true, false]
    },
    loop: {
      values: [true, false]
    },
    disableInfo: {
      values: [true, false]
    },
    disableRelatedVideos: {
      values: [true, false]
    },
    disableFullscreen: {
      values: [true,false]
    },
    size: {
      values: ["s", "m", "l", "xl"]
    }
  },
  requiredProps: {},
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

  it(`${TagName} should render without crash`, () => {
    const wrapper = shallow(
      <UU5.Bricks.Container id={"uuID01"}>
        <UU5.Bricks.YoutubeVideo id={"uuID02"} src="https://www.youtube.com/watch?v=1rDVz_Fb6HQ" autoplay={true} s/>
        <UU5.Bricks.YoutubeVideo id={"uuID03"} src="https://www.youtube.com/watch?v=1rDVz_Fb6HQ" disableControls/>
        <UU5.Bricks.YoutubeVideo id={"uuID04"} src="https://www.youtube.com/watch?v=1rDVz_Fb6HQ" loop/>
        <UU5.Bricks.YoutubeVideo id={"uuID05"} src="https://www.youtube.com/watch?v=1rDVz_Fb6HQ" disableInfo/>
        <UU5.Bricks.YoutubeVideo id={"uuID06"} src="https://www.youtube.com/watch?v=1rDVz_Fb6HQ" disableRelatedVideos/>
        <UU5.Bricks.YoutubeVideo id={"uuID07"} src="https://www.youtube.com/watch?v=1rDVz_Fb6HQ" disableFullscreen/>
        <UU5.Bricks.YoutubeVideo id={"uuID08"} src="https://www.youtube.com/watch?v=1rDVz_Fb6HQ" size="s"/>
      </UU5.Bricks.Container>
    );
    expect(enzymeToJson(wrapper)).toMatchSnapshot();
  });

});










