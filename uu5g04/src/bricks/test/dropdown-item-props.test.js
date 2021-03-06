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

const MyDropDownHandlers = UU5.Common.VisualComponent.create({
  getInitialState: () => {
    return {
      isCalled: false,
    };
  },

  onClickHandler(event) {
    alert("You Clicked to DropDown.Item");
    this.setState({ isCalled: true });
  },
  render() {
    return (
      <UU5.Bricks.Dropdown id={"dropID"} label="onClickEvent" size="l" colorSchema="pink">
        <UU5.Bricks.Dropdown.Item id={"itemID"} label="{user name}" header onClick={this.onClickHandler} />
      </UU5.Bricks.Dropdown>
    );
  },
});

const CONFIG = {
  mixins: [
    "UU5.Common.BaseMixin",
    "UU5.Common.ElementaryMixin",
    "UU5.Common.ContentMixin",
    "UU5.Common.PureRenderMixin",
    "UU5.Common.NestingLevelMixin",
  ],
  props: {
    header: {
      values: [true, false],
    },
    diviner: {
      values: [true, false],
    },
    label: {
      values: ["Label items"],
    },
    href: {
      values: ["https://www.plus4u.net/", "#elementID"],
    },
    //onClick
    smoothScroll: {
      values: [3000],
    },
    offset: {
      values: [70],
    },
    target: {
      values: ["_blank", "_parent", "_top", "_self"],
    },
    dropup: {
      values: [true, false],
    },
  },
  requiredProps: {
    parent: shallow(<UU5.Bricks.Dropdown id="parentId" />).instance(),
  },
  opt: {
    shallowOpt: {
      disableLifecycleMethods: false,
    },
  },
};

describe(`UU5.Bricks.Dropdown.Item`, () => {
  UU5.Test.Tools.testProperties(UU5.Bricks.Dropdown.Item, CONFIG);
});

describe(`UU5.Bricks.Dropdown.Item`, () => {
  it(`UU5.Bricks.Dropdown.Item - onClick()`, () => {
    window.alert = jest.fn();
    const wrapper = shallow(<MyDropDownHandlers />);
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.state().isCalled).toBeFalsy();
    wrapper.find("dropdown-item").simulate("click");
    expect(window.alert).toBeCalled();
    expect(window.alert).toHaveBeenCalledWith("You Clicked to DropDown.Item");
    expect(wrapper.state().isCalled).toBeTruthy();
    expect(window.alert.mock.calls[0][0]).toEqual("You Clicked to DropDown.Item");
    expect(wrapper).toMatchSnapshot();
  });
});

describe(`UU5.Bricks.Dropdown.Item docKit examples`, () => {
  it(`UU5.Bricks.Dropdown.Item example make snapshot`, () => {
    const wrapper = shallow(
      <UU5.Bricks.Dropdown id={"uuID"} label="User account" size="l" colorSchema="green" iconClosed="mdi-eye">
        <UU5.Bricks.Dropdown.Item ref_={(item) => (this.item = item)} id={"uuID2"} label="{user name}" header />
      </UU5.Bricks.Dropdown>
    );
    expect(wrapper).toMatchSnapshot();
  });
});
