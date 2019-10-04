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

const MyNavBarHandler = createReactClass({

  getInitialState: () => {
    return {
      isCalled: false
    };
  },

  onOpenAlert(event) {
    alert("onOpen has been called.");
    this.setState({isCalled: true})
  },
  onCloseAlert(event) {
    alert("onClose has been called.");
    this.setState({isCalled: true})
  },

  render() {
    return (
      <UU5.Bricks.NavBar
        id={"NavBarID"}
        offset={70}
        onOpen={this.onOpenAlert}
        onClose={this.onCloseAlert}
      >
        <UU5.Bricks.NavBar.Nav id={"NavBarNavID"}>
          <UU5.Bricks.NavBar.Nav.Item id={"itemID"}>Cars</UU5.Bricks.NavBar.Nav.Item>
        </UU5.Bricks.NavBar.Nav>
      </UU5.Bricks.NavBar>
    );
  }
});



const CONFIG = {
  mixins: [
    "UU5.Common.BaseMixin",
    "UU5.Common.ElementaryMixin",
    "UU5.Common.ContentMixin",
    "UU5.Common.ColorSchemaMixin",
    "UU5.Common.NestingLevelMixin",
    "UU5.Common.PureRenderMixin"
  ],
  props: {
    fixed: {
      values: ["top", "bottom"]
    },
    smoothScroll: {
      values: [3000]
    },
    offset: {
      values: [70]
    },

    // NOTE :-( Skipping because controlled/open/alwaysOpen doesn't work properly with each other and there's
    // hard to estimate how to change it without breaking compatibility.
    open: {
      values: [true, false],
      opt: {
        skip: true
      }
    },
    alwaysOpen: {
      values: [true, false],
      opt: {
        skip: true
      }
    },

    iconOpen: {
      values: ["uu5-plus"]
    },
    iconClosed: {
      values: ["uu5-minus"]
    },
    //onOpen:
    //onClose
    size: {
      values: ["s", "m", "l", "xl"]
    }
  },
  requiredProps: {
    children: [
      <UU5.Bricks.NavBar.Nav id={"child01"}>
        <UU5.Bricks.NavBar.Nav.Item d={"child02"}>News</UU5.Bricks.NavBar.Nav.Item>
      </UU5.Bricks.NavBar.Nav>
    ]
  },
  opt: {
    shallowOpt: {
      disableLifecycleMethods: true
    }
  }
};


describe(`UU5.Bricks.NavBar props`, () => {
  UU5.Test.Tools.testProperties(UU5.Bricks.NavBar, CONFIG);
});

describe(`UU5.Bricks.NavBar props.Function`, () => {

  it(`UU5.Bricks.NavBar -  onOpen() should be called`, () => {
    window.alert = jest.fn();
    const wrapper = shallow(
      <MyNavBarHandler/>
    );
    expect(wrapper.state().isCalled).toBeFalsy();
    wrapper.find('NavBar').simulate('open');
    expect(window.alert).toBeCalled();
    expect(window.alert).toHaveBeenCalledWith('onOpen has been called.');
    expect(wrapper.state().isCalled).toBeTruthy();
    expect(window.alert.mock.calls[0][0]).toEqual("onOpen has been called.");
    expect(wrapper).toMatchSnapshot();

  });

  it(`UU5.Bricks.NavBar -  onClosed() should be called`, () => {
    window.alert = jest.fn();
    const wrapper = shallow(
      <MyNavBarHandler/>
    );
    expect(wrapper.state().isCalled).toBeFalsy();
    wrapper.find('NavBar').simulate('close');
    expect(window.alert).toBeCalled();
    expect(window.alert).toHaveBeenCalledWith('onClose has been called.');
    expect(wrapper.state().isCalled).toBeTruthy();
    expect(window.alert.mock.calls[0][0]).toEqual("onClose has been called.");
    expect(wrapper).toMatchSnapshot();

  });


});


describe(`UU5.Bricks.NavBar docKit example`, () => {
  it(`UU5.Bricks.NavBar example01`, () => {
    const wrapper = shallow(
      <UU5.Bricks.NavBar id={"uuID"}>
        <UU5.Bricks.NavBar.Header id={"uuID2"} content='Header'/>
        <UU5.Bricks.NavBar.Nav id={"uuID3"} glyphiconClosed='uu‑glyphicon‑calendar'>
          <UU5.Bricks.NavBar.Nav.Item id={"uuID4"} content='My Nav Item'/>
        </UU5.Bricks.NavBar.Nav>
      </UU5.Bricks.NavBar>
    );
    expect(wrapper).toMatchSnapshot();
  });
});
