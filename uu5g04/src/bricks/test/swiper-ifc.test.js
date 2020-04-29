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

import UU5 from "uu5g04";
import "uu5g04-bricks";

const { mount, shallow, wait } = UU5.Test.Tools;

describe("UU5.Bricks.Swiper interface testing", () => {
  it("openMenuLeft(setStateCallBack)", () => {
    const wrapper = shallow(
      <UU5.Bricks.Swiper id={"uuID01"} style={{ backgroundColor: "lightblue" }}>
        <UU5.Bricks.Swiper.Menu id={"uuID02"} style={{ backgroundColor: "lightgrey" }}>
          <UU5.Bricks.P id={"uuID03"}>Content</UU5.Bricks.P>
        </UU5.Bricks.Swiper.Menu>
        <UU5.Bricks.Swiper.Menu id={"uuID04"} pullRight style={{ backgroundColor: "lightgrey" }}>
          <UU5.Bricks.P id={"uuID05"}>Content</UU5.Bricks.P>
        </UU5.Bricks.Swiper.Menu>
        <UU5.Bricks.Swiper.Body id={"uuID06"} className="center">
          <UU5.Bricks.Paragraph id={"uuID07"} />
        </UU5.Bricks.Swiper.Body>
      </UU5.Bricks.Swiper>
    );
    const mockFunc = jest.fn();
    expect(wrapper.instance().state.leftMenuOpen).toBeFalsy();
    expect(wrapper.instance().isLeftMenuOpen()).toBeFalsy();
    expect(wrapper).toMatchSnapshot();
    const returnValue = wrapper.instance().openLeftMenu(mockFunc);
    wrapper.update();
    expect(mockFunc).toBeCalled();
    expect(mockFunc).toHaveBeenCalledTimes(1);
    expect(returnValue === wrapper.instance()).toBe(true);
    expect(wrapper.instance().state.leftMenuOpen).toBeTruthy();
    expect(wrapper.instance().isLeftMenuOpen()).toBeTruthy();
    expect(wrapper).toMatchSnapshot();
  });

  it("closeLeftMenu(setStateCallBack)", () => {
    const wrapper = shallow(
      <UU5.Bricks.Swiper id={"uuID01"} style={{ backgroundColor: "lightblue" }} leftMenuOpen={true}>
        <UU5.Bricks.Swiper.Menu id={"uuID02"} style={{ backgroundColor: "lightgrey" }}>
          <UU5.Bricks.P id={"uuID03"}>Content</UU5.Bricks.P>
        </UU5.Bricks.Swiper.Menu>
        <UU5.Bricks.Swiper.Menu id={"uuID04"} pullRight style={{ backgroundColor: "lightgrey" }}>
          <UU5.Bricks.P id={"uuID05"}>Content</UU5.Bricks.P>
        </UU5.Bricks.Swiper.Menu>
        <UU5.Bricks.Swiper.Body id={"uuID06"} className="center">
          <UU5.Bricks.Paragraph id={"uuID07"} />
        </UU5.Bricks.Swiper.Body>
      </UU5.Bricks.Swiper>
    );
    const mockFunc = jest.fn();
    expect(wrapper.instance().state.leftMenuOpen).toBeTruthy();
    expect(wrapper.instance().isLeftMenuOpen()).toBeTruthy();
    expect(wrapper).toMatchSnapshot();
    const returnValue = wrapper.instance().closeLeftMenu(mockFunc);
    wrapper.update();
    expect(mockFunc).toBeCalled();
    expect(mockFunc).toHaveBeenCalledTimes(1);
    expect(returnValue === wrapper.instance()).toBe(true);
    expect(wrapper.instance().state.leftMenuOpen).toBeFalsy();
    expect(wrapper.instance().isLeftMenuOpen()).toBeFalsy();
    expect(wrapper).toMatchSnapshot();
  });

  it("toggleLeftMenu(setStateCallBack)", () => {
    const wrapper = shallow(
      <UU5.Bricks.Swiper id={"uuID01"} style={{ backgroundColor: "lightblue" }} leftMenuOpen={false}>
        <UU5.Bricks.Swiper.Menu id={"uuID02"} style={{ backgroundColor: "lightgrey" }}>
          <UU5.Bricks.P id={"uuID03"}>Content</UU5.Bricks.P>
        </UU5.Bricks.Swiper.Menu>
        <UU5.Bricks.Swiper.Menu id={"uuID04"} pullRight style={{ backgroundColor: "lightgrey" }}>
          <UU5.Bricks.P id={"uuID05"}>Content</UU5.Bricks.P>
        </UU5.Bricks.Swiper.Menu>
        <UU5.Bricks.Swiper.Body id={"uuID06"} className="center">
          <UU5.Bricks.Paragraph id={"uuID07"} />
        </UU5.Bricks.Swiper.Body>
      </UU5.Bricks.Swiper>
    );
    const mockFunc = jest.fn();
    expect(wrapper.instance().state.leftMenuOpen).toBeFalsy();
    expect(wrapper.instance().isLeftMenuOpen()).toBeFalsy();
    expect(wrapper).toMatchSnapshot();
    const returnValue = wrapper.instance().toggleLeftMenu(mockFunc);
    wrapper.update();
    expect(mockFunc).toBeCalled();
    expect(mockFunc).toHaveBeenCalledTimes(1);
    expect(returnValue === wrapper.instance()).toBe(true);
    expect(wrapper.instance().state.leftMenuOpen).toBeTruthy();
    expect(wrapper.instance().isLeftMenuOpen()).toBeTruthy();
    expect(wrapper).toMatchSnapshot();
    wrapper.instance().toggleLeftMenu(mockFunc);
    wrapper.update();
    expect(mockFunc).toBeCalled();
    expect(mockFunc).toHaveBeenCalledTimes(2);
    expect(wrapper.instance().state.leftMenuOpen).toBeFalsy();
    expect(wrapper.instance().isLeftMenuOpen()).toBeFalsy();
    expect(wrapper).toMatchSnapshot();
  });

  it("openRightMenu(setStateCallBack)", () => {
    const wrapper = shallow(
      <UU5.Bricks.Swiper id={"uuID01"} style={{ backgroundColor: "lightblue" }} rightMenuOpen={false}>
        <UU5.Bricks.Swiper.Menu id={"uuID02"} style={{ backgroundColor: "lightgrey" }}>
          <UU5.Bricks.P id={"uuID03"}>Content</UU5.Bricks.P>
        </UU5.Bricks.Swiper.Menu>
        <UU5.Bricks.Swiper.Menu id={"uuID04"} pullRight style={{ backgroundColor: "lightgrey" }}>
          <UU5.Bricks.P id={"uuID05"}>Content</UU5.Bricks.P>
        </UU5.Bricks.Swiper.Menu>
        <UU5.Bricks.Swiper.Body id={"uuID06"} className="center">
          <UU5.Bricks.Paragraph id={"uuID07"} />
        </UU5.Bricks.Swiper.Body>
      </UU5.Bricks.Swiper>
    );
    const mockFunc = jest.fn();
    expect(wrapper.instance().state.rightMenuOpen).toBeFalsy();
    expect(wrapper.instance().isRightMenuOpen()).toBeFalsy();
    expect(wrapper).toMatchSnapshot();
    const returnValue = wrapper.instance().openRightMenu(mockFunc);
    wrapper.update();
    expect(mockFunc).toBeCalled();
    expect(mockFunc).toHaveBeenCalledTimes(1);
    expect(returnValue === wrapper.instance()).toBe(true);
    expect(wrapper.instance().state.rightMenuOpen).toBeTruthy();
    expect(wrapper.instance().isRightMenuOpen()).toBeTruthy();
    expect(wrapper).toMatchSnapshot();
  });

  it("closeRightMenu(setStateCallBack)", () => {
    const wrapper = shallow(
      <UU5.Bricks.Swiper id={"uuID01"} style={{ backgroundColor: "lightblue" }} rightMenuOpen={true}>
        <UU5.Bricks.Swiper.Menu id={"uuID02"} style={{ backgroundColor: "lightgrey" }}>
          <UU5.Bricks.P id={"uuID03"}>Content</UU5.Bricks.P>
        </UU5.Bricks.Swiper.Menu>
        <UU5.Bricks.Swiper.Menu id={"uuID04"} pullRight style={{ backgroundColor: "lightgrey" }}>
          <UU5.Bricks.P id={"uuID05"}>Content</UU5.Bricks.P>
        </UU5.Bricks.Swiper.Menu>
        <UU5.Bricks.Swiper.Body id={"uuID06"} className="center">
          <UU5.Bricks.Paragraph id={"uuID07"} />
        </UU5.Bricks.Swiper.Body>
      </UU5.Bricks.Swiper>
    );
    const mockFunc = jest.fn();
    expect(wrapper.instance().state.rightMenuOpen).toBeTruthy();
    expect(wrapper.instance().isRightMenuOpen()).toBeTruthy();
    expect(wrapper).toMatchSnapshot();
    const returnValue = wrapper.instance().closeRightMenu(mockFunc);
    wrapper.update();
    expect(mockFunc).toBeCalled();
    expect(mockFunc).toHaveBeenCalledTimes(1);
    expect(returnValue === wrapper.instance()).toBe(true);
    expect(wrapper.instance().state.rightMenuOpen).toBeFalsy();
    expect(wrapper.instance().isRightMenuOpen()).toBeFalsy();
    expect(wrapper).toMatchSnapshot();
  });

  it("toggleRightMenu(setStateCallBack)", () => {
    const wrapper = shallow(
      <UU5.Bricks.Swiper id={"uuID01"} style={{ backgroundColor: "lightblue" }} rightMenuOpen={false}>
        <UU5.Bricks.Swiper.Menu id={"uuID02"} style={{ backgroundColor: "lightgrey" }}>
          <UU5.Bricks.P id={"uuID03"}>Content</UU5.Bricks.P>
        </UU5.Bricks.Swiper.Menu>
        <UU5.Bricks.Swiper.Menu id={"uuID04"} pullRight style={{ backgroundColor: "lightgrey" }}>
          <UU5.Bricks.P id={"uuID05"}>Content</UU5.Bricks.P>
        </UU5.Bricks.Swiper.Menu>
        <UU5.Bricks.Swiper.Body id={"uuID06"} className="center">
          <UU5.Bricks.Paragraph id={"uuID07"} />
        </UU5.Bricks.Swiper.Body>
      </UU5.Bricks.Swiper>
    );
    const mockFunc = jest.fn();
    expect(wrapper.instance().state.rightMenuOpen).toBeFalsy();
    expect(wrapper.instance().isRightMenuOpen()).toBeFalsy();
    expect(wrapper).toMatchSnapshot();
    const returnValue = wrapper.instance().toggleRightMenu(mockFunc);
    wrapper.update();
    expect(mockFunc).toBeCalled();
    expect(mockFunc).toHaveBeenCalledTimes(1);
    expect(returnValue === wrapper.instance()).toBe(true);
    expect(wrapper.instance().state.rightMenuOpen).toBeTruthy();
    expect(wrapper.instance().isRightMenuOpen()).toBeTruthy();
    expect(wrapper).toMatchSnapshot();
    wrapper.instance().toggleRightMenu(mockFunc);
    wrapper.update();
    expect(mockFunc).toBeCalled();
    expect(mockFunc).toHaveBeenCalledTimes(2);
    expect(wrapper.instance().state.rightMenuOpen).toBeFalsy();
    expect(wrapper.instance().isRightMenuOpen()).toBeFalsy();
    expect(wrapper).toMatchSnapshot();
  });

  it("isLeftMenuOpen()", () => {
    const wrapper = shallow(
      <UU5.Bricks.Swiper
        id={"uuID01"}
        style={{ backgroundColor: "lightblue" }}
        rightMenuOpen={false}
        leftMenuOpen={true}
      >
        <UU5.Bricks.Swiper.Menu id={"uuID02"} style={{ backgroundColor: "lightgrey" }}>
          <UU5.Bricks.P id={"uuID03"}>Content</UU5.Bricks.P>
        </UU5.Bricks.Swiper.Menu>
        <UU5.Bricks.Swiper.Menu id={"uuID04"} pullRight style={{ backgroundColor: "lightgrey" }}>
          <UU5.Bricks.P id={"uuID05"}>Content</UU5.Bricks.P>
        </UU5.Bricks.Swiper.Menu>
        <UU5.Bricks.Swiper.Body id={"uuID06"} className="center">
          <UU5.Bricks.Paragraph id={"uuID07"} />
        </UU5.Bricks.Swiper.Body>
      </UU5.Bricks.Swiper>
    );
    expect(wrapper.instance().isLeftMenuOpen()).toBeTruthy();
    expect(wrapper.instance().isRightMenuOpen()).toBeFalsy();
    expect(wrapper).toMatchSnapshot();
  });

  it("isRightMenuOpen()", () => {
    const wrapper = shallow(
      <UU5.Bricks.Swiper
        id={"uuID01"}
        style={{ backgroundColor: "lightblue" }}
        rightMenuOpen={true}
        leftMenuOpen={false}
      >
        <UU5.Bricks.Swiper.Menu id={"uuID02"} style={{ backgroundColor: "lightgrey" }}>
          <UU5.Bricks.P id={"uuID03"}>Content</UU5.Bricks.P>
        </UU5.Bricks.Swiper.Menu>
        <UU5.Bricks.Swiper.Menu id={"uuID04"} pullRight style={{ backgroundColor: "lightgrey" }}>
          <UU5.Bricks.P id={"uuID05"}>Content</UU5.Bricks.P>
        </UU5.Bricks.Swiper.Menu>
        <UU5.Bricks.Swiper.Body id={"uuID06"} className="center">
          <UU5.Bricks.Paragraph id={"uuID07"} />
        </UU5.Bricks.Swiper.Body>
      </UU5.Bricks.Swiper>
    );
    expect(wrapper.instance().isLeftMenuOpen()).toBeFalsy();
    expect(wrapper.instance().isRightMenuOpen()).toBeTruthy();
    expect(wrapper).toMatchSnapshot();
  });
});
