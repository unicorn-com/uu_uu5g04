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
    alt: "Popisek, který se zobrazí pokud je cesta ze src špatná..",
    type: {
      values: ["rounded", "circle", "thumbnail"]
    },
    src: "https://unicorn.com/img/index-career.jpg",
    responsive: {
      values: [true, false]
    },
    width: {
      values: [40, "50px", null]
    },
    height: {
      values: [40, "50px", null]
    }
  },
  requiredProps: {},
  opt: {
    shallowOpt: {
      disableLifecycleMethods: false
    }
  }
};

describe(`UU5.Bricks.Image`, () => {
  UU5.Test.Tools.testProperties(UU5.Bricks.Image, CONFIG);
});

describe(`UU5.Bricks.Image docKit examples`, () => {
  it(`UU5.Bricks.Image should render without crash`, () => {
    const wrapper = shallow(
      <UU5.Bricks.Container id={"uuID04"}>
        <UU5.Bricks.Image
          id={"uuID03"}
          src="https://unicorn.com/img/images/news/n2016110401/image-presov-index.jpg"
          type="rounded"
          style={{ width: 200 }}
        />
        <UU5.Bricks.Image
          id={"uuID02"}
          src="https://unicorn.com/img/images/news/n2016110401/image-presov-index.jpg"
          type="circle"
          style={{ width: 200 }}
        />
        <UU5.Bricks.Image
          id={"uuID01"}
          src="https://unicorn.com/img/images/news/n2016110401/image-presov-index.jpg"
          type="thumbnail"
          style={{ width: 200 }}
        />
      </UU5.Bricks.Container>
    );
    expect(wrapper).toMatchSnapshot();
  });

  it(`UU5.Bricks.Image should render without crash`, () => {
    const wrapper = shallow(
      <UU5.Bricks.Container id={"uuID01"}>
        <UU5.Bricks.Row id={"uuID02s"}>
          <UU5.Bricks.Column id={"uuID03"} colWidth="xs12 s3" header="src">
            {/*@@viewOn:0*/}
            <UU5.Bricks.Image id={"uuID04"} src="https://images.pexels.com/photos/371794/pexels-photo-371794.jpeg?" />
          </UU5.Bricks.Column>
          {/*@@viewOff:0*/}
          <UU5.Bricks.Column id={"uuID05"} colWidth="xs12 s3" header="alt">
            {/*@@viewOn:0*/}
            <UU5.Bricks.Image
              id={"uuID06"}
              src="https://images.pexels.com/photos/371794/pexels-photo-371794.jpegchyba?"
              name="Image description"
            />
          </UU5.Bricks.Column>
          {/*@@viewOff:0*/}
        </UU5.Bricks.Row>

        <UU5.Bricks.Row id={"uuID07"} header="type">
          <UU5.Bricks.Column id={"uuID08"} colWidth="xs12 s4" header="rounded">
            {/*@@viewOn:0*/}
            <UU5.Bricks.Image
              id={"uuID09"}
              src="https://images.pexels.com/photos/316093/pexels-photo-316093.jpeg?w=940&h=650"
              type="rounded"
            />
            {/*@@viewOff:0*/}
          </UU5.Bricks.Column>
          <UU5.Bricks.Column id={"uuID010"} colWidth="xs12 s4" header="circle">
            {/*@@viewOn:0*/}
            <UU5.Bricks.Image
              id={"uuID011"}
              src="https://images.pexels.com/photos/316093/pexels-photo-316093.jpeg?w=940&h=650"
              type="circle"
            />
            {/*@@viewOff:0*/}
          </UU5.Bricks.Column>
          <UU5.Bricks.Column id={"uuID012"} colWidth="xs12 s4" header="thumbnail">
            {/*@@viewOn:0*/}
            <UU5.Bricks.Image
              id={"uuID013"}
              src="https://unicorn.com/img/images/news/n2016110401/image-presov-index.jpg"
              type="thumbnail"
            />
            {/*@@viewOff:0*/}
          </UU5.Bricks.Column>
        </UU5.Bricks.Row>

        <UU5.Bricks.Row id={"uuID014"}>
          <UU5.Bricks.Column id={"uuID015"} colWidth="xs12 s4" header="responsive={true}">
            {/*@@viewOn:0*/}
            <UU5.Bricks.Image
              id={"uuID016"}
              src="https://images.pexels.com/photos/371794/pexels-photo-371794.jpeg?"
              responsive
            />
          </UU5.Bricks.Column>
          {/*@@viewOff:0*/}
          <UU5.Bricks.Column id={"uuID07"} colWidth="xs12 s4" header="responsive={false}">
            {/*@@viewOn:0*/}
            <UU5.Bricks.Image
              id={"uuID018"}
              src="https://images.pexels.com/photos/316093/pexels-photo-316093.jpeg?w=500&h=650"
              responsive={false}
            />
          </UU5.Bricks.Column>
          {/*@@viewOff:0*/}
        </UU5.Bricks.Row>
      </UU5.Bricks.Container>
    );
    expect(wrapper).toMatchSnapshot();
  });
});
