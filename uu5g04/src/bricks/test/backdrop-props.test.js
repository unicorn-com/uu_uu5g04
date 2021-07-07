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

const MyBackDropComponent = UU5.Common.VisualComponent.create({
  getInitialState: () => {
    return {
      isCalled: false,
    };
  },

  onClickAlert(event) {
    alert("You just clicked on the backdrop");
    this.setState({ isCalled: true });
  },

  onMouseOverAlert(event) {
    alert("You have mouse over on the backdrop");
    this.setState({ isCalled: true });
  },

  render() {
    return <UU5.Bricks.Backdrop id={"idBackDrop"} onClick={this.onClickAlert} onMouseOver={this.onMouseOverAlert} />;
  },
});

const CONFIG = {
  mixins: [
    "UU5.Common.BaseMixin",
    "UU5.Common.ElementaryMixin",
    "UU5.Common.NestingLevelMixin",
    "UU5.Common.PureRenderMixin",
  ],
  props: {
    background: {
      values: [true, false],
    },
    //onClick:{}
    //onMouseOver:{}
  },
  requiredProps: {
    children: [<UU5.Bricks.Jumbotron content={"JumboTron Content"} className="center" id={"jumboID"} />],
  },
  opt: {},
};

describe(`UU5.Bricks.Backdrop`, () => {
  UU5.Test.Tools.testProperties(UU5.Bricks.Backdrop, CONFIG);
});

describe(`UU5.Bricks.Backdrop  props.function `, () => {
  it(`UU5.Bricks.Backdrop - onClick()`, () => {
    window.alert = jest.fn();
    const wrapper = shallow(<MyBackDropComponent />);
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.state().isCalled).toBeFalsy();
    wrapper.simulate("click");
    expect(window.alert).toBeCalled();
    expect(window.alert).toHaveBeenCalledWith("You just clicked on the backdrop");
    expect(wrapper.state().isCalled).toBeTruthy();
    expect(window.alert.mock.calls[0][0]).toEqual("You just clicked on the backdrop");
    expect(wrapper).toMatchSnapshot();
  });

  it(`UU5.Bricks.Backdrop - onMouseOver()`, () => {
    window.alert = jest.fn();
    const wrapper = shallow(<MyBackDropComponent />);
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.state().isCalled).toBeFalsy();
    wrapper.simulate("mouseOver");
    expect(window.alert).toBeCalled();
    expect(window.alert).toHaveBeenCalledWith("You have mouse over on the backdrop");
    expect(wrapper.state().isCalled).toBeTruthy();
    expect(window.alert.mock.calls[0][0]).toEqual("You have mouse over on the backdrop");
    expect(wrapper).toMatchSnapshot();
  });
});
