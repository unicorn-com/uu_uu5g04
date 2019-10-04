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

const { mount, shallow, wait } = UU5.Test.Tools;

describe(`UU5.Bricks.ConfirmModal interface testing`, () => {
  it("open(content-props, callback)", () => {
    const onOpen = jest.fn();
    const wrapper = shallow(<UU5.Bricks.ConfirmModal id={"uuID-modal"} header="Jest modal" />);
    expect(wrapper.instance().isOpened()).toBeFalsy();
    wrapper.instance().open(
      {
        content: <UU5.Bricks.Div id={"uuID-div"}>Some content</UU5.Bricks.Div>
      },
      onOpen
    );
    wrapper.update();
    expect(wrapper.instance().isOpened()).toBeTruthy();
    expect(onOpen).toBeCalled();
    expect(onOpen).toHaveBeenCalledTimes(1);

    wrapper.unmount();
  });

  it("close dialog by close(callback)", () => {
    jest.useFakeTimers();
    const onRefuse = jest.fn();
    const onConfirm = jest.fn();
    const onClose = jest.fn();
    const wrapper = shallow(
      <UU5.Bricks.ConfirmModal id={"uuID-modal"} header="Jest modal" onConfirm={onConfirm} onRefuse={onRefuse} />
    );

    wrapper.instance().open();
    wrapper.update();

    wrapper.instance().close(onClose);
    wrapper.update();
    jest.runAllTimers();

    expect(wrapper.instance().isOpened()).toBeFalsy();
    // check that callback method was called
    expect(onClose).toBeCalled();
    expect(onClose).toHaveBeenCalledTimes(1);
    // check that dialog was refused and wasn't confirmed
    expect(onRefuse).toBeCalled();
    expect(onRefuse).toHaveBeenCalledTimes(1);
    expect(onConfirm).not.toBeCalled();
  });

  it("close dialog by refuse button", () => {
    jest.useFakeTimers();
    const onRefuse = jest.fn();
    const onConfirm = jest.fn();
    const wrapper = mount(
      <UU5.Bricks.ConfirmModal id={"uuID-modal"} header="Jest modal" onConfirm={onConfirm} onRefuse={onRefuse} />
    );

    wrapper.instance().open();
    wrapper.update();
    jest.runAllTimers();

    // let buttons = wrapper.find(UU5.Bricks.Button);
    let buttons = wrapper.find(".uu5-bricks-button");
    console.log(buttons);
    expect(buttons).toHaveLength(2);
    let refuseButton = buttons.at(0);
    refuseButton.simulate("click");

    wrapper.update();
    jest.runAllTimers();

    expect(wrapper.instance().isOpened()).toBeFalsy();
    // check that dialog was refused and wasn't confirmed
    expect(onRefuse).toBeCalled();
    expect(onRefuse).toHaveBeenCalledTimes(1);
    expect(onConfirm).not.toBeCalled();

    wrapper.unmount();
  });

  it("close dialog by confirm button", () => {
    jest.useFakeTimers();
    const onRefuse = jest.fn();
    const onConfirm = jest.fn();
    const wrapper = mount(
      <UU5.Bricks.ConfirmModal id={"uuID-modal"} header="Jest modal" onConfirm={onConfirm} onRefuse={onRefuse} />
    );

    wrapper.instance().open();
    wrapper.update();

    let buttons = wrapper.find(".uu5-bricks-button");
    expect(buttons).toHaveLength(2);
    let confirmButton = buttons.at(1);
    confirmButton.simulate("click");

    wrapper.update();
    jest.runAllTimers();

    expect(wrapper.instance().isOpened()).toBeFalsy();
    // check that dialog was refused and wasn't confirmed
    expect(onConfirm).toBeCalled();
    expect(onConfirm).toHaveBeenCalledTimes(1);
    expect(onRefuse).not.toBeCalled();

    wrapper.unmount();
  });

  it("close dialog by confirm button (reverse order of buttons)", () => {
    jest.useFakeTimers();
    const onRefuse = jest.fn();
    const onConfirm = jest.fn();
    const wrapper = mount(
      <UU5.Bricks.ConfirmModal
        id={"uuID-modal"}
        header="Jest modal"
        onConfirm={onConfirm}
        onRefuse={onRefuse}
        confirmButtonLeft={true}
      />
    );

    wrapper.instance().open();
    wrapper.update();

    let buttons = wrapper.find(".uu5-bricks-button");
    expect(buttons).toHaveLength(2);
    let confirmButton = buttons.at(0);
    confirmButton.simulate("click");

    wrapper.update();
    jest.runAllTimers();

    expect(wrapper.instance().isOpened()).toBeFalsy();
    // check that dialog was refused and wasn't confirmed
    expect(onConfirm).toBeCalled();
    expect(onConfirm).toHaveBeenCalledTimes(1);
    expect(onRefuse).not.toBeCalled();

    wrapper.unmount();
  });

  it("close dialog by cross button - sticky (button is not showed)", () => {
    jest.useFakeTimers();
    const onRefuse = jest.fn();
    const onConfirm = jest.fn();
    const wrapper = mount(
      <UU5.Bricks.ConfirmModal id={"uuID-modal"} header="Jest modal" onConfirm={onConfirm} onRefuse={onRefuse} />
    );

    wrapper.instance().open();
    wrapper.update();

    let buttons = wrapper.find(UU5.Bricks.Link);
    expect(buttons).toHaveLength(0);

    wrapper.unmount();
  });

  it("close dialog by cross button - no sticky", () => {
    jest.useFakeTimers();
    const onRefuse = jest.fn();
    const onConfirm = jest.fn();
    const wrapper = mount(
      <UU5.Bricks.ConfirmModal
        id={"uuID-modal"}
        header="Jest modal"
        onConfirm={onConfirm}
        onRefuse={onRefuse}
        sticky={false}
      />
    );

    wrapper.instance().open();
    wrapper.update();

    let buttons = wrapper.find(UU5.Bricks.Link);
    expect(buttons).toHaveLength(1);
    let crossButton = buttons.at(0);
    crossButton.simulate("click");

    wrapper.update();
    jest.runAllTimers();

    expect(wrapper.instance().isOpened()).toBeFalsy();
    // check that dialog was refused and wasn't confirmed
    expect(onRefuse).toBeCalled();
    expect(onRefuse).toHaveBeenCalledTimes(1);
    expect(onConfirm).not.toBeCalled();

    wrapper.unmount();
  });
});
