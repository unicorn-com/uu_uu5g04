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

const MyContextmenuItem = UU5.Common.VisualComponent.create({
  getInitialState: () => {
    return {
      isCalled: false,
    };
  },

  onClickAlert(event) {
    alert("Your click in onClick event");
    this.setState({ isCalled: true });
  },

  render() {
    return (
      <UU5.Bricks.ContextMenu id={"menu"} shown={true}>
        <UU5.Bricks.ContextMenu.Item id={"items"} label="Dopoledne" onClick={this.onClickAlert} />
      </UU5.Bricks.ContextMenu>
    );
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
    label: {
      values: ["myLabel"],
    },
    href: {
      values: ["https://www.plus4u.net/", "#idELEMENT"],
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
    icon: {
      values: ["mdi-menu"],
    },
    space: {
      values: [true, false],
    },
    diviner: {
      values: [true, false],
    },
  },
  requiredProps: {
    parent: shallow(<UU5.Bricks.ContextMenu id="parentId" />).instance(),
  },
  opt: {
    shallowOpt: {
      disableLifecycleMethods: false,
    },
  },
};

describe(`UU5.Bricks.ContextMenu.Item`, () => {
  UU5.Test.Tools.testProperties(UU5.Bricks.ContextMenu.Item, CONFIG);

  it("props.onClick()", () => {
    window.alert = jest.fn();
    const wrapper = shallow(<MyContextmenuItem />);
    expect(wrapper.instance().state.isCalled).toBeFalsy();
    wrapper.find("ContextMenuItem").simulate("click");
    expect(window.alert).toBeCalled();
    expect(window.alert).toHaveBeenCalledWith("Your click in onClick event");
    expect(wrapper.instance().state.isCalled).toBeTruthy();
    expect(window.alert.mock.calls[0][0]).toEqual("Your click in onClick event");
    expect(wrapper).toMatchSnapshot();
  });
});

describe(`UU5.Bricks.ContextMenu.Item docKit examples`, () => {
  it(`UU5.Bricks.ContextMenu.Item example make snapshot`, () => {
    const wrapper = shallow(
      <UU5.Bricks.ContextMenu id={"uuID"} shown={true} header="Header" footer="Footer">
        <UU5.Bricks.ContextMenu.Item id={"uuID2"} label="Ráno" icon="mdi-weather-sunset-up" space />
        <UU5.Bricks.ContextMenu.Item id={"uuID3"} label="Dopoledne" space />
        <UU5.Bricks.ContextMenu.Item id={"uuID4"} label="V poledne" icon="mdi-weather-sunny" space disabled />
        <UU5.Bricks.ContextMenu.Item id={"uuID5"} label="Odpoledne" space />
        <UU5.Bricks.ContextMenu.Item id={"uuID6"} label="Večer" icon="mdi-weather-sunset" />
        <UU5.Bricks.ContextMenu.Item id={"uuID7"} divider />
        <UU5.Bricks.ContextMenu.Item id={"uuID8"} label="Vlastní" />
        <UU5.Bricks.ContextMenu.Item id={"uuID9"} label="Nějaké další" />
        <UU5.Bricks.ContextMenu.Item id={"uuID10"} label="Úplně jiné" disabled />
      </UU5.Bricks.ContextMenu>
    );
    expect(wrapper).toMatchSnapshot();
  });
});
