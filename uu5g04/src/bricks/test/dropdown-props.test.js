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
import createReactClass from "create-react-class";

const { mount, shallow, wait } = UU5.Test.Tools;

/**
 * This is a created component for the Allow Tags test.
 * It is tested that a self-created component can be inserted into the dropDown under its own brand.
 */
const MyAllowTagsDropDown = createReactClass({
  mixins: [UU5.Common.BaseMixin],
  statics: {tagName: "UU5.Example.MyCompButton", classNames: {main: "mytr"}},
  render() {
    return (
      <UU5.Example.MyCompButton {...this.getMainPropsToPass()}/>
    );
  }
});

const MyDropDownHandlers = createReactClass({

  getInitialState: () => {
    return {
      isCalled: false
    };
  },

  onClickHandler(event) {
    alert("You Clicked to DropDown");
    this.setState({isCalled: true})
  },

  render() {
    return (
      <UU5.Bricks.Dropdown
        id={"dropID"}
        label="onClickEvent"
        size="l"
        colorSchema="pink"
        onClick={this.onClickHandler}
      >
        <UU5.Bricks.Dropdown.Item id={"itemID"} label="{user name}" header/>
      </UU5.Bricks.Dropdown>
    );
  }
});


const CONFIG = {
  mixins: [
    "UU5.Common.BaseMixin",
    "UU5.Common.ElementaryMixin",
    "UU5.Common.ColorSchemaMixin",
    "UU5.Common.ContentMixin",
    "UU5.Common.PureRenderMixin",
    "UU5.Common.NestingLevelMixin"
  ],
  props: {
    label: {
      values: ["Rozbal mě"]
    },
    size: {
      values: ["s", "m", "l", "xl"]
    },
    //onClick
    iconOpen: {
      values: ["uu5-plus"]
    },
    iconClosed: {
      values: ["uu5-minus"]
    },
    iconHidden: {
      values: [true, false]
    },
    items: {
      values: [
        [
          {label: "Rock", href: "#Rock"},
          {label: "Metal", href: "#Metal"},
          {label: "Jazz", href: "#Jazz"}
        ]
      ]
    },
    pullRight: {
      values: [true, false]
    },
    dropup: {
      values: [true, false]
    },
    split: {
      values: [true, false]
    },
    smoothScroll: {
      values: [3000]
    },
    offset: {
      values: [70]
    },
    closedOnLeave: {
      values: [true, false]
    },
    openOnHover: {
      values: [true, false]
    },
    allowTags: {
      allowTagsArray: ["UU5.Example.MyCompButton"]
    },
    disableBackdrop: {
      values: [true, false]
    },
  },
  requiredProps: {
    children: [<UU5.Bricks.Dropdown.Item id={"childID"} label="Profile"/>]
  },
  opt: {
    shallowOpt: {
      disableLifecycleMethods: true
    }
  }
};


describe(`UU5.Bricks.Dropdown`, () => {
  UU5.Test.Tools.testProperties(UU5.Bricks.Dropdown, CONFIG);
});

describe(`UU5.Bricks.Dropdown`, () => {

  it(`UU5.Bricks.Dropdown - onClick()`, () => {
    window.alert = jest.fn();
    const wrapper = shallow(
      <MyDropDownHandlers/>
    );
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.state().isCalled).toBeFalsy();
    wrapper.find('Dropdown').simulate('click');
    expect(window.alert).toBeCalled();
    expect(window.alert).toHaveBeenCalledWith('You Clicked to DropDown');
    expect(wrapper.state().isCalled).toBeTruthy();
    expect(window.alert.mock.calls[0][0]).toEqual("You Clicked to DropDown");
    expect(wrapper).toMatchSnapshot();

  });

});


describe(`UU5.Bricks.Dropdown AllowTags + Dockit example`, () => {

  it('UU5.Bricks.DropDown - props.allowTags contain myComponent', () => {
    const wrapper = shallow(
      <UU5.Bricks.Dropdown id={"uuID"} label="User account" size="l" colorSchema="green" iconClosed="mdi-eye"
                           allowTags={["UU5.Example.MyCompButton"]}>
        <MyAllowTagsDropDown id={"allowID"} content={"Allow Tags Contentn in Button"}/>
        <UU5.Bricks.Dropdown.Item id={"uuID2"} label="{user name}" header/>
      </UU5.Bricks.Dropdown>
    );
    expect(wrapper).toMatchSnapshot();
  });


  it(`UU5.Bricks.Dropdown example make snapshot`, () => {
    const wrapper = shallow(
      <UU5.Bricks.Dropdown id={"uuID"}>
        <UU5.Bricks.Dropdown.Item id={"uuID2"} label="{user name}" header/>
        <UU5.Bricks.Dropdown.Item id={"uuID3"} label="Profile"/>
        <UU5.Bricks.Dropdown.Item id={"uuID4"} label="Settings"/>
        <UU5.Bricks.Dropdown.Item id={"uuID5"} divider/>
        <UU5.Bricks.Dropdown.Item id={"uuID6"} label="Logout"/>
      </UU5.Bricks.Dropdown>
    );
    expect(wrapper.instance().props.label).toMatch(/Dropdown/);
    expect(wrapper.instance().props.size).toMatch(/m/);
    expect(wrapper.instance().props.iconOpen).toMatch(/mdi-menu-down/);
    expect(wrapper.instance().props.iconClosed).toMatch(/mdi-menu-down/);
    expect(wrapper.instance().props.iconHidden).toBeFalsy();
    //expect(wrapper.instance().props.items).toEqual([]);
    expect(wrapper.instance().props.pullRight).toBeFalsy();
    expect(wrapper.instance().props.pullRight).not.toBeUndefined();
    expect(wrapper.instance().props.pullRight).not.toBeNull();
    expect(wrapper.instance().props.dropup).toBeFalsy();
    expect(wrapper.instance().props.dropup).not.toBeUndefined();
    expect(wrapper.instance().props.dropup).not.toBeNull();
    expect(wrapper.instance().props.split).toBeFalsy();
    expect(wrapper.instance().props.split).not.toBeUndefined();
    expect(wrapper.instance().props.split).not.toBeNull();
    expect(wrapper.instance().props.smoothScroll).toBe(1000);
    expect(wrapper.instance().props.offset).toBe(null);
    expect(wrapper.instance().props.closedOnLeave).toBeFalsy();
    expect(wrapper.instance().props.closedOnLeave).not.toBeUndefined();
    expect(wrapper.instance().props.closedOnLeave).not.toBeNull();
    expect(wrapper.instance().props.openOnHover).toBeFalsy();
    expect(wrapper.instance().props.openOnHover).not.toBeUndefined();
    expect(wrapper.instance().props.openOnHover).not.toBeNull();
    expect(wrapper.instance().props.disableBackdrop).toBeFalsy();
    expect(wrapper.instance().props.disableBackdrop).not.toBeUndefined();
    expect(wrapper.instance().props.disableBackdrop).not.toBeNull();
    expect(wrapper).toMatchSnapshot();
  });
});










