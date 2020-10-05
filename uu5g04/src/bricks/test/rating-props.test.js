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

//@@viewOn:imports
import UU5 from "uu5g04";
import "uu5g04-bricks";
//@@viewOff:imports

const { mount, shallow, wait } = UU5.Test.Tools;

const MyRatingHandler = UU5.Common.VisualComponent.create({
  getInitialState: () => {
    return {
      isCalled: false,
    };
  },

  onClickHandler(event) {
    alert("onClick have been called");
    this.setState({ isCalled: true });
  },

  render() {
    return <UU5.Bricks.Rating id={"uuID"} value={2} onClick={this.onClickHandler} />;
  },
});

const CONFIG = {
  mixins: [
    "UU5.Common.BaseMixin",
    "UU5.Common.ElementaryMixin",
    "UU5.Common.ColorSchemaMixin",
    "UU5.Common.NestingLevelMixin",
    "UU5.Common.ContentMixin",
  ],
  props: {
    count: {
      values: [0, 5],
    },
    value: {
      values: [2, 1.5],
    },
    //onClick
    icon: {
      values: ["mdi-pinteres"],
    },
    size: {
      values: ["s", "m", "l", "xl"],
    },
  },
  requiredProps: {},
  opt: {
    shallowOpt: {
      disableLifecycleMethods: false,
    },
  },
};

const This = {};

describe(`UU5.Bricks.Rating`, () => {
  UU5.Test.Tools.testProperties(UU5.Bricks.Rating, CONFIG);
});

describe(`UU5.Bricks.Rating`, () => {
  it(`UU5.Bricks.Rating - onClick()`, () => {
    window.alert = jest.fn();
    const wrapper = shallow(<MyRatingHandler />);
    expect(wrapper.state().isCalled).toBeFalsy();
    wrapper.simulate("click");
    expect(window.alert).toBeCalled();
    expect(window.alert).toHaveBeenCalledWith("onClick have been called");
    expect(wrapper.state().isCalled).toBeTruthy();
    expect(window.alert.mock.calls[0][0]).toEqual("onClick have been called");
    expect(wrapper).toMatchSnapshot();
  });
});

describe(`UU5.Bricks.Rating docKit examples`, () => {
  it(`UU5.Bricks.Rating should render without crash`, () => {
    const wrapper = shallow(
      <UU5.Bricks.Container id={"uuID01"}>
        <UU5.Bricks.Rating count={10} id={"uuID02"} />
        <UU5.Bricks.Rating id={"uuID03"} icon="mdi-heart" />
      </UU5.Bricks.Container>
    );
    expect(wrapper).toMatchSnapshot();
  });
});
