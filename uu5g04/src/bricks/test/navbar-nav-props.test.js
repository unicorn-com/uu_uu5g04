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

//@@viewOn:imports
import UU5 from "uu5g04";
import "uu5g04-bricks";
//@@viewOff:imports

const { mount, shallow, wait } = UU5.Test.Tools;

const MyAllowTagsComponents = UU5.Common.VisualComponent.create({
  mixins: [UU5.Common.BaseMixin],
  statics: { tagName: "UU5.Example.MyCompButton", classNames: { main: "mytr" } },
  render() {
    return <UU5.Example.MyCompButton {...this.getMainPropsToPass()} />;
  },
});

const CONFIG = {
  mixins: [
    "UU5.Common.BaseMixin",
    "UU5.Common.ElementaryMixin",
    "UU5.Common.ContentMixin",
    "UU5.Common.PureRenderMixin",
  ],
  props: {
    aligned: {
      values: ["left", "right"],
    },
    smoothScroll: {
      values: [3000],
    },
    offset: {
      values: [70],
    },
    allowTags: {
      allowTagsArray: ["UU5.Example.MyCompButton"],
    },
  },
  requiredProps: {
    parent: shallow(<UU5.Bricks.NavBar id="parentId" />).instance(),
    children: [<UU5.Bricks.NavBar.Nav.Item id={"child02"}>News</UU5.Bricks.NavBar.Nav.Item>],
  },
  opt: {
    shallowOpt: {
      disableLifecycleMethods: false,
    },
  },
};

const This = {};

describe(`UU5.Bricks.NavBar.Nav props`, () => {
  UU5.Test.Tools.testProperties(UU5.Bricks.NavBar.Nav, CONFIG);

  it("UU5.Bricks.NavBar.Nav - props.AllowTags", () => {
    const wrapper = shallow(
      <UU5.Bricks.NavBar id={"uuID"} colorSchema="primary">
        <UU5.Bricks.NavBar.Header id={"uuID2"} content="aligned='right'" />
        <UU5.Bricks.NavBar.Nav id={"uuID3"} allowTags={["UU5.Example.MyCompButton"]}>
          <UU5.Bricks.NavBar.Nav.Item id={"uuID4"}>
            <UU5.Bricks.Icon id={"uuID5"} icon="mdi-home" />
            Home
          </UU5.Bricks.NavBar.Nav.Item>
          <MyAllowTagsComponents id={"allowID"} content={"allowTags Content"} />
        </UU5.Bricks.NavBar.Nav>
      </UU5.Bricks.NavBar>
    );
    expect(wrapper).toMatchSnapshot();
  });
});

describe(`UU5.Bricks.NavBar.Nav docKit example`, () => {
  it(`UU5.Bricks.NavBar.Nav example01`, () => {
    const wrapper = shallow(
      <UU5.Bricks.NavBar id={"uuID"} colorSchema="primary">
        <UU5.Bricks.NavBar.Header id={"uuID2"} content="aligned='right'" />
        <UU5.Bricks.NavBar.Nav id={"uuID3"}>
          <UU5.Bricks.NavBar.Nav.Item id={"uuID4"}>
            <UU5.Bricks.Icon id={"uuID5"} icon="mdi-home" />
            Home
          </UU5.Bricks.NavBar.Nav.Item>
          <UU5.Bricks.NavBar.Nav.Item id={"uuID6"}>
            <UU5.Bricks.Icon icon="mdi-newspaper" id={"uuID7"} />
            News
          </UU5.Bricks.NavBar.Nav.Item>
          <UU5.Bricks.NavBar.Nav.Item id={"uuID8"}>
            <UU5.Bricks.Icon id={"uuID9"} icon="mdi-account" />
            MyProfile
          </UU5.Bricks.NavBar.Nav.Item>
          <UU5.Bricks.NavBar.Nav.Item id={"uuID10"}>
            <UU5.Bricks.Icon id={"uuID11"} icon="mdi-logout" style={{ color: "red" }} />
            LogOut
          </UU5.Bricks.NavBar.Nav.Item>
        </UU5.Bricks.NavBar.Nav>
      </UU5.Bricks.NavBar>
    );
    expect(wrapper).toMatchSnapshot();
  });

  it(`UU5.Bricks.NavBar.Nav example02`, () => {
    const wrapper = shallow(
      <UU5.Bricks.NavBar id={"uuID"} colorSchema="primary">
        <UU5.Bricks.NavBar.Header id={"uuID2"} content="aligned='right'" />
        <UU5.Bricks.NavBar.Nav id={"uuID3"} aligned="right" smoothScroll={3000} offset={70}>
          <UU5.Bricks.NavBar.Nav.Item id={"uuID4"}>
            <UU5.Bricks.Icon id={"uuID5"} icon="mdi-home" />
            Home
          </UU5.Bricks.NavBar.Nav.Item>
          <UU5.Bricks.NavBar.Nav.Item id={"uuID6"}>
            <UU5.Bricks.Icon icon="mdi-newspaper" id={"uuID7"} />
            News
          </UU5.Bricks.NavBar.Nav.Item>
          <UU5.Bricks.NavBar.Nav.Item id={"uuID8"}>
            <UU5.Bricks.Icon id={"uuID9"} icon="mdi-account" />
            MyProfile
          </UU5.Bricks.NavBar.Nav.Item>
          <UU5.Bricks.NavBar.Nav.Item id={"uuID10"}>
            <UU5.Bricks.Icon id={"uuID11"} icon="mdi-logout" style={{ color: "red" }} />
            LogOut
          </UU5.Bricks.NavBar.Nav.Item>
        </UU5.Bricks.NavBar.Nav>
      </UU5.Bricks.NavBar>
    );
    expect(wrapper).toMatchSnapshot();
  });
});
