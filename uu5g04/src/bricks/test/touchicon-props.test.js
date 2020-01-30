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

const MyTouchIcon = UU5.Common.VisualComponent.create({
  getInitialState: () => {
    return {
      isCalled: false
    };
  },

  onClickAlert(event) {
    alert("You just clicked on the touchIcon");
    this.setState({ isCalled: true });
  },

  render() {
    return <UU5.Bricks.TouchIcon icon="mdi-evernote" content="Výchozí touch ikona" onClick={this.onClickAlert} />;
  }
});

const CONFIG = {
  mixins: [
    "UU5.Common.BaseMixin",
    "UU5.Common.ElementaryMixin",
    "UU5.Common.ColorSchemaMixin",
    "UU5.Common.ContentMixin",
    "UU5.Common.LevelMixin",
    "UU5.Common.NestingLevelMixin"
  ],
  props: {
    icon: {
      values: [
        "uu5-alert-circle",
        "uu5-arrow-down",
        "uu5-arrow-left",
        "uu5-arrow-right",
        "uu5-arrow-up",
        "uu5-calendar",
        "uu5-clock",
        "uu5-cross",
        "uu5-error-circle",
        "uu5-finder",
        "uu5-flag-upload",
        "uu5-menu",
        "uu5-minus",
        "uu5-ok",
        "uu5-ok-circle",
        "uu5-person",
        "uu5-picture",
        "uu5-plus",
        "uu5-point",
        "uu5-thumb"
      ]
    },
    href: {
      values: ["#elementID", "https://www.plus4u.net/"]
    },
    target: {
      values: ["_blank", "_parent", "_top", "_self"]
    },
    bgStyle: {
      values: ["filled", "transparent"]
    },
    borderRadius: {
      values: ["2px 3px 4px 5px"]
    }
    //onClick: {},
    //onCtrlClick: {},
    //onWheelClick: {}
  },
  requiredProps: {},
  opt: {
    shallowOpt: {
      disableLifecycleMethods: false
    }
  }
};

describe(`UU5.Bricks.TouchIcon`, () => {
  UU5.Test.Tools.testProperties(UU5.Bricks.TouchIcon, CONFIG);
});

describe(`UU5.Bricks.TouchIcon props.Function`, () => {
  it(`UU5.Bricks.TouchIcon -  onClick() should be called`, () => {
    window.alert = jest.fn();
    const wrapper = shallow(<MyTouchIcon />);
    expect(wrapper.state().isCalled).toBeFalsy();
    wrapper.simulate("click");
    expect(window.alert).toBeCalled();
    expect(window.alert).toHaveBeenCalledWith("You just clicked on the touchIcon");
    expect(wrapper.state().isCalled).toBeTruthy();
    expect(window.alert.mock.calls[0][0]).toEqual("You just clicked on the touchIcon");
    expect(wrapper).toMatchSnapshot();
  });
});

describe(`UU5.Bricks.TouchIcon docKit examples`, () => {
  it(`UU5.Bricks.TouchIcon should render without crash`, () => {
    const wrapper = shallow(
      <UU5.Bricks.Container id={"uuROOT"}>
        <UU5.Bricks.TouchIcon id={"uuID"} icon="mdi-evernote" content="Výchozí touch ikona" />
        <UU5.Bricks.TouchIcon id={"uuID2"} icon="mdi-evernote" content="Hover" className="hover" />
        <UU5.Bricks.TouchIcon id={"uuID3"} icon="mdi-evernote" content="Pressed" className="active" />
        <UU5.Bricks.TouchIcon id={"uuID4"} icon="mdi-evernote" content="Disabled" disabled />
        <UU5.Bricks.TouchIcon id={"uuID5"} icon="mdi-leaf" colorSchema="green" href="https://www.plus4u.net/" />
        <UU5.Bricks.TouchIcon
          id={"uuID6"}
          icon="mdi-pine-tree"
          colorSchema="brown"
          href="https://www.plus4u.net/"
          target="_blank"
        />
      </UU5.Bricks.Container>
    );
    expect(wrapper).toMatchSnapshot();
  });
});
