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

import UU5 from "uu5g04";
import "uu5g04-bricks";

const { mount, shallow, wait } = UU5.Test.Tools;

const CONFIG = {
  mixins: [
    "UU5.Common.BaseMixin",
    "UU5.Common.ElementaryMixin",
    "UU5.Common.ColorSchemaMixin",
    "UU5.Common.ContentMixin",
    "UU5.Common.PureRenderMixin",
    "UU5.Common.SwipeMixin",
  ],
  props: {
    hideControls: {
      values: [true, false],
    },
    hideIndicators: {
      values: [true, false],
    },
    activeIndex: {
      values: [0, 1, 2, 3],
    },
    nextIcon: {
      values: ["mdi-chevron-right"],
    },
    prevIcon: {
      values: ["mdi-chevron-left"],
    },
    displayedItems: {
      values: [0, 1, 2, 3],
    },
    type: {
      values: ["circular", "final", "rewind"],
    },
    interval: {
      values: [0, 1000, 8000],
    },
    stepByOne: {
      values: [true, false],
    },
  },
  requiredProps: {
    children: ["UU5.Bricks.Carousel.Item"],
  },
  opt: {
    shallowOpt: {
      disableLifecycleMethods: true,
    },
  },
};

describe(`UU5.Bricks.Carousel`, () => {
  UU5.Test.Tools.testProperties(UU5.Bricks.Carousel, CONFIG);
});

describe("UU5.Bricks.Carousel", () => {
  //Here is all default props.
  it("Default props + content", () => {
    const wrapper = shallow(
      <UU5.Bricks.Carousel id={"idRoot"} interval={0} type="final">
        <UU5.Bricks.Carousel.Item id={"idItems"}>
          <UU5.Bricks.Div
            id={"idDiv"}
            style={{
              backgroundImage: "url(https://unicorn.com/img/images/news/n2016080801/image-electricity-index.jpg)",
              height: 250,
              transform: "scale(1.5)",
            }}
          />
        </UU5.Bricks.Carousel.Item>
      </UU5.Bricks.Carousel>
    );
    expect(wrapper).toMatchSnapshot();
  });
});
