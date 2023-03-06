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
    interval: 0, // turn off "autoSlide" so that revertedValueSnapshotCheck-s match
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
