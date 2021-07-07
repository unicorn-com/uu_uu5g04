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

const MyPageMenuButtonHandler = UU5.Common.VisualComponent.create({
  getInitialState: () => {
    return {
      isCalled: false,
    };
  },

  onClickHandler(event) {
    alert("You Clicked to Page.MenuButton");
    this.setState({ isCalled: true });
  },
  render() {
    return <UU5.Bricks.Page.MenuButton id={"uuID03"} screenSize={"xs"} menu="left" onClick={this.onClickHandler} />;
  },
});

const CONFIG = {
  mixins: [
    "UU5.Common.BaseMixin",
    "UU5.Common.ElementaryMixin",
    "UU5.Common.ContentMixin",
    "UU5.Common.ColorSchemaMixin",
    "UU5.Common.NestingLevelMixin",
    "UU5.Common.CcrWriterMixin",
  ],
  props: {
    menu: {
      values: ["left", "right"],
    },
    //onClick
    pageKey: {
      values: [null],
    },
    size: {
      values: ["xl", "l", "m", "s"],
    },
    displayBlock: {
      values: [true, false],
    },
    pressed: {
      values: [true, false],
    },
    bgStyle: {
      values: ["filled", "outline", "transparent"],
    },
  },
  requiredProps: {
    // NOTE PageMenuButton will render itself (snapshot) only if it has menu="left" (or menu="right")
    // and its ancestor Page has left="someContent" leftWidth="!xs-... some float setting".
    parent: shallow(
      <UU5.Bricks.Page
        id="parentId"
        type="1"
        left="L"
        right="R"
        leftWidth="!xs-20 !s-20 !m-25 !l-25"
        rightWidth="!xs-20 !s-20 !m-25 !l-25"
      />
    ).instance(),
    screenSize: "xs",
  },
  opt: {
    shallowOpt: {
      disableLifecycleMethods: true,
    },
  },
};

describe(`UU5.Bricks.Page.MenuButton`, () => {
  UU5.Test.Tools.testProperties(UU5.Bricks.Page.MenuButton, CONFIG);
});

describe(`UU5.Bricks.Page.MenuButton`, () => {
  it(`UU5.Bricks.Page.MenuButton - onClick()`, () => {
    window.alert = jest.fn();
    const wrapper = shallow(<MyPageMenuButtonHandler />);
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.state().isCalled).toBeFalsy();
    wrapper.simulate("click");
    expect(window.alert).toBeCalled();
    expect(window.alert).toHaveBeenCalledWith("You Clicked to Page.MenuButton");
    expect(wrapper.state().isCalled).toBeTruthy();
    expect(window.alert.mock.calls[0][0]).toEqual("You Clicked to Page.MenuButton");
    expect(wrapper).toMatchSnapshot();
  });
});
