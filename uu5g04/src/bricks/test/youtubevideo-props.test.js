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

const { mount, shallow, wait } = UU5.Test.Tools;

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
      values: [true, false]
    },
    size: {
      values: ["s", "m", "l", "xl"]
    }
  },
  requiredProps: {},
  opt: {
    shallowOpt: {
      disableLifecycleMethods: false
    }
  }
};

describe(`UU5.Bricks.YoutubeVideo`, () => {
  UU5.Test.Tools.testProperties(UU5.Bricks.YoutubeVideo, CONFIG);
});

describe(`UU5.Bricks.YoutubeVideo docKit examples`, () => {
  it(`UU5.Bricks.YoutubeVideo should render without crash`, () => {
    const wrapper = shallow(
      <UU5.Bricks.YoutubeVideo id={"uuID08"} src="https://www.youtube.com/watch?v=1rDVz_Fb6HQ" size="s" />
    );
    expect(wrapper).toMatchSnapshot();
  });

  it(`UU5.Bricks.YoutubeVideo youtube parameters`, () => {
    let wrapper = mount(<UU5.Bricks.YoutubeVideo src="https://www.youtube.com/watch?v=1rDVz_Fb6HQ" autoplay />);
    let iframe = wrapper.find("iframe");
    expect(iframe.instance().getAttribute("src")).toBe("https://youtube.com/embed/1rDVz_Fb6HQ?autoplay=1");

    wrapper = mount(<UU5.Bricks.YoutubeVideo src="https://www.youtube.com/watch?v=1rDVz_Fb6HQ" disableControls />);
    iframe = wrapper.find("iframe");
    expect(iframe.instance().getAttribute("src")).toBe("https://youtube.com/embed/1rDVz_Fb6HQ?controls=0");

    wrapper = mount(<UU5.Bricks.YoutubeVideo src="https://www.youtube.com/watch?v=1rDVz_Fb6HQ" loop />);
    iframe = wrapper.find("iframe");
    expect(iframe.instance().getAttribute("src")).toMatch(
      /https:\/\/youtube.com\/embed\/1rDVz_Fb6HQ\?loop=1&playlist=.+/
    );

    wrapper = mount(<UU5.Bricks.YoutubeVideo src="https://www.youtube.com/watch?v=1rDVz_Fb6HQ" disableInfo />);
    iframe = wrapper.find("iframe");
    expect(iframe.instance().getAttribute("src")).toBe("https://youtube.com/embed/1rDVz_Fb6HQ?showinfo=0");

    wrapper = mount(<UU5.Bricks.YoutubeVideo src="https://www.youtube.com/watch?v=1rDVz_Fb6HQ" disableRelatedVideos />);
    iframe = wrapper.find("iframe");
    expect(iframe.instance().getAttribute("src")).toBe("https://youtube.com/embed/1rDVz_Fb6HQ?rel=0");

    wrapper = mount(<UU5.Bricks.YoutubeVideo src="https://www.youtube.com/watch?v=1rDVz_Fb6HQ" muted />);
    iframe = wrapper.find("iframe");
    expect(iframe.instance().getAttribute("src")).toBe("https://youtube.com/embed/1rDVz_Fb6HQ?mute=1");
  });
});
