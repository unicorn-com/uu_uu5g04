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

describe("UU5.Bricks.ProgressBar.Item interface testing", function() {
  it("Should render with shallow and make a snapshot", () => {
    const wrapper = shallow(
      <UU5.Bricks.ProgressBar id={"uuID01"}>
        <UU5.Bricks.ProgressBar.Item id={"uuID02"} progress={40} colorSchema="blue" animated striped content="number" />
        <UU5.Bricks.ProgressBar.Item id={"uuID03"} progress={35} colorSchema="purple" />
      </UU5.Bricks.ProgressBar>
    );
    expect(wrapper).toMatchSnapshot();
  });

  it("getProgress()", () => {
    const wrapper = mount(
      <UU5.Bricks.ProgressBar id={"uuID01"}>
        <UU5.Bricks.ProgressBar.Item
          id={"uuID02"}
          progress={40}
          colorSchema="blue"
          animated
          striped
          ref_={progress2 => (this.progress2 = progress2)}
          content="number"
        />
        <UU5.Bricks.ProgressBar.Item
          id={"uuID03"}
          progress={35}
          colorSchema="purple"
          ref_={progress1 => (this.progress1 = progress1)}
        />
      </UU5.Bricks.ProgressBar>
    );
    expect(this.progress2.getProgress()).toBe(40);
    expect(this.progress1.getProgress()).toBe(35);
  });

  it("getProgressContent()", () => {
    const wrapper = mount(
      <UU5.Bricks.ProgressBar id={"uuID01"}>
        <UU5.Bricks.ProgressBar.Item
          id={"uuID02"}
          progress={40}
          colorSchema="blue"
          animated
          striped
          ref_={progress2 => (this.progress2 = progress2)}
          content="number"
        />
        <UU5.Bricks.ProgressBar.Item
          id={"uuID03"}
          progress={35}
          content={"Progress1"}
          colorSchema="purple"
          ref_={progress1 => (this.progress1 = progress1)}
        />
      </UU5.Bricks.ProgressBar>
    );
    expect(this.progress1.getProgressContent()).toEqual("Progress1");
    expect(this.progress2.getProgressContent()).toEqual("number");
  });

  it("isStriped()", () => {
    const wrapper = mount(
      <UU5.Bricks.ProgressBar id={"uuID01"}>
        <UU5.Bricks.ProgressBar.Item
          id={"uuID02"}
          progress={40}
          colorSchema="blue"
          animated
          striped
          ref_={progress2 => (this.progress2 = progress2)}
          content="number"
        />
        <UU5.Bricks.ProgressBar.Item
          id={"uuID03"}
          progress={35}
          content={"Progress1"}
          colorSchema="purple"
          ref_={progress1 => (this.progress1 = progress1)}
        />
      </UU5.Bricks.ProgressBar>
    );
    expect(this.progress1.isStriped()).toBeFalsy();
    expect(this.progress2.isStriped()).toBeTruthy();
  });

  it("isAnimated()", () => {
    const wrapper = mount(
      <UU5.Bricks.ProgressBar id={"uuID01"}>
        <UU5.Bricks.ProgressBar.Item
          id={"uuID02"}
          progress={40}
          colorSchema="blue"
          animated
          striped
          ref_={progress2 => (this.progress2 = progress2)}
          content="number"
        />
        <UU5.Bricks.ProgressBar.Item
          id={"uuID03"}
          progress={35}
          content={"Progress1"}
          colorSchema="purple"
          ref_={progress1 => (this.progress1 = progress1)}
        />
      </UU5.Bricks.ProgressBar>
    );
    expect(this.progress1.isAnimated()).toBeFalsy();
    expect(this.progress2.isAnimated()).toBeTruthy();
  });

  it("setProgress(param, setStateCallBack)", () => {
    const wrapper = mount(
      <UU5.Bricks.ProgressBar id={"uuID01"}>
        <UU5.Bricks.ProgressBar.Item
          id={"uuID03"}
          progress={35}
          content={"Progress1"}
          colorSchema="purple"
          ref_={progress1 => (this.progress1 = progress1)}
        />
      </UU5.Bricks.ProgressBar>
    );
    const mockFunc = jest.fn();
    expect(wrapper.find("ProgressBarItem").instance().state.progress).toBe(35);
    expect(wrapper.find("ProgressBarItem").instance().state.content).toEqual("Progress1");
    expect(wrapper.find("ProgressBarItem").instance().state.striped).toBeFalsy();
    expect(this.progress1.getProgressContent()).toEqual("Progress1");
    expect(this.progress1.getProgress()).toBe(35);
    this.progress1.setProgress({ value: 68, content: "Jarda Jágr", striped: true }, mockFunc);
    wrapper.update();
    expect(mockFunc).toBeCalled();
    expect(mockFunc).toHaveBeenCalledTimes(1);
    //Verifying returnValue takes a long time here. The program falls on FATAL ERROR - lack of memory.
    //expect(returnValue).toBe(wrapper.instance());
    expect(wrapper.find("ProgressBarItem").instance().state.progress).toBe(68);
    expect(wrapper.find("ProgressBarItem").instance().state.content).toEqual("Jarda Jágr");
    expect(wrapper.find("ProgressBarItem").instance().state.striped).toBeTruthy();
    expect(this.progress1.getProgressContent()).toEqual("Jarda Jágr");
    expect(this.progress1.getProgress()).toBe(68);
  });

  it("increase(value, setStateCallBack)", () => {
    const wrapper = mount(
      <UU5.Bricks.ProgressBar id={"uuID01"}>
        <UU5.Bricks.ProgressBar.Item
          id={"uuID03"}
          progress={2}
          content={"Progress1"}
          colorSchema="purple"
          ref_={progress1 => (this.progress1 = progress1)}
        />
      </UU5.Bricks.ProgressBar>
    );
    const mockFunc = jest.fn();
    expect(wrapper.find("ProgressBarItem").instance().state.progress).toBe(2);
    expect(wrapper.find("ProgressBarItem").instance().state.content).toEqual("Progress1");
    expect(this.progress1.getProgressContent()).toEqual("Progress1");
    expect(this.progress1.getProgress()).toBe(2);
    this.progress1.increase({ value: 68, content: "Jarda Jágr postupuje" }, mockFunc);
    wrapper.update();
    expect(mockFunc).toBeCalled();
    expect(mockFunc).toHaveBeenCalledTimes(1);
    //Verifying returnValue takes a long time here. The program falls on FATAL ERROR - lack of memory.
    //expect(returnValue).toBe(wrapper.instance());
    expect(wrapper.find("ProgressBarItem").instance().state.progress).toBe(70);
    expect(wrapper.find("ProgressBarItem").instance().state.content).toEqual("Jarda Jágr postupuje");
    expect(this.progress1.getProgressContent()).toEqual("Jarda Jágr postupuje");
    expect(this.progress1.getProgress()).toBe(70);
    this.progress1.increase(35);
    wrapper.update();
    expect(this.progress1.getProgress()).toBe(100);
  });

  it("decrease(value, setStateCallBack)", () => {
    const wrapper = mount(
      <UU5.Bricks.ProgressBar id={"uuID01"}>
        <UU5.Bricks.ProgressBar.Item
          id={"uuID03"}
          progress={20}
          content={"Progress1"}
          colorSchema="purple"
          ref_={progress1 => (this.progress1 = progress1)}
        />
      </UU5.Bricks.ProgressBar>
    );
    const mockFunc = jest.fn();
    expect(wrapper.find("ProgressBarItem").instance().state.progress).toBe(20);
    expect(wrapper.find("ProgressBarItem").instance().state.content).toEqual("Progress1");
    expect(this.progress1.getProgressContent()).toEqual("Progress1");
    expect(this.progress1.getProgress()).toBe(20);
    this.progress1.decrease({ value: 18, content: "Jarda Jágr ustupuje" }, mockFunc);
    wrapper.update();
    expect(mockFunc).toBeCalled();
    expect(mockFunc).toHaveBeenCalledTimes(1);
    //Verifying returnValue takes a long time here. The program falls on FATAL ERROR - lack of memory.
    //expect(returnValue).toBe(wrapper.instance());
    expect(wrapper.find("ProgressBarItem").instance().state.progress).toBe(2);
    expect(wrapper.find("ProgressBarItem").instance().state.content).toEqual("Jarda Jágr ustupuje");
    expect(this.progress1.getProgressContent()).toEqual("Jarda Jágr ustupuje");
    expect(this.progress1.getProgress()).toBe(2);
    this.progress1.decrease(5);
    wrapper.update();
    expect(this.progress1.getProgress()).toBe(0);
  });
});
