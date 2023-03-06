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

import UU5 from "uu5g04";
import "uu5g04-bricks";

const { mount, shallow } = UU5.Test.Tools;

describe("UU5.Bricks.ProgressBar.Item interface testing", function () {
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
    let progress1, progress2;
    mount(
      <UU5.Bricks.ProgressBar id={"uuID01"}>
        <UU5.Bricks.ProgressBar.Item
          id={"uuID02"}
          progress={40}
          colorSchema="blue"
          animated
          striped
          ref_={(_progress2) => (progress2 = _progress2)}
          content="number"
        />
        <UU5.Bricks.ProgressBar.Item
          id={"uuID03"}
          progress={35}
          colorSchema="purple"
          ref_={(_progress1) => (progress1 = _progress1)}
        />
      </UU5.Bricks.ProgressBar>
    );
    expect(progress2.getProgress()).toBe(40);
    expect(progress1.getProgress()).toBe(35);
  });

  it("getProgressContent()", () => {
    let progress1, progress2;
    mount(
      <UU5.Bricks.ProgressBar id={"uuID01"}>
        <UU5.Bricks.ProgressBar.Item
          id={"uuID02"}
          progress={40}
          colorSchema="blue"
          animated
          striped
          ref_={(_progress2) => (progress2 = _progress2)}
          content="number"
        />
        <UU5.Bricks.ProgressBar.Item
          id={"uuID03"}
          progress={35}
          content={"Progress1"}
          colorSchema="purple"
          ref_={(_progress1) => (progress1 = _progress1)}
        />
      </UU5.Bricks.ProgressBar>
    );
    expect(progress1.getProgressContent()).toEqual("Progress1");
    expect(progress2.getProgressContent()).toEqual("number");
  });

  it("isStriped()", () => {
    let progress1, progress2;
    mount(
      <UU5.Bricks.ProgressBar id={"uuID01"}>
        <UU5.Bricks.ProgressBar.Item
          id={"uuID02"}
          progress={40}
          colorSchema="blue"
          animated
          striped
          ref_={(_progress2) => (progress2 = _progress2)}
          content="number"
        />
        <UU5.Bricks.ProgressBar.Item
          id={"uuID03"}
          progress={35}
          content={"Progress1"}
          colorSchema="purple"
          ref_={(_progress1) => (progress1 = _progress1)}
        />
      </UU5.Bricks.ProgressBar>
    );
    expect(progress1.isStriped()).toBeFalsy();
    expect(progress2.isStriped()).toBeTruthy();
  });

  it("isAnimated()", () => {
    let progress1, progress2;
    mount(
      <UU5.Bricks.ProgressBar id={"uuID01"}>
        <UU5.Bricks.ProgressBar.Item
          id={"uuID02"}
          progress={40}
          colorSchema="blue"
          animated
          striped
          ref_={(_progress2) => (progress2 = _progress2)}
          content="number"
        />
        <UU5.Bricks.ProgressBar.Item
          id={"uuID03"}
          progress={35}
          content={"Progress1"}
          colorSchema="purple"
          ref_={(_progress1) => (progress1 = _progress1)}
        />
      </UU5.Bricks.ProgressBar>
    );
    expect(progress1.isAnimated()).toBeFalsy();
    expect(progress2.isAnimated()).toBeTruthy();
  });

  it("setProgress(param, setStateCallBack)", () => {
    let progress1;
    const wrapper = mount(
      <UU5.Bricks.ProgressBar id={"uuID01"}>
        <UU5.Bricks.ProgressBar.Item
          id={"uuID03"}
          progress={35}
          content={"Progress1"}
          colorSchema="purple"
          ref_={(_progress1) => (progress1 = _progress1)}
        />
      </UU5.Bricks.ProgressBar>
    );
    const mockFunc = jest.fn();
    expect(wrapper.find("ProgressBarItem").instance().state.progress).toBe(35);
    expect(wrapper.find("ProgressBarItem").instance().state.content).toEqual("Progress1");
    expect(wrapper.find("ProgressBarItem").instance().state.striped).toBeFalsy();
    expect(progress1.getProgressContent()).toEqual("Progress1");
    expect(progress1.getProgress()).toBe(35);
    progress1.setProgress({ value: 68, content: "Jarda Jágr", striped: true }, mockFunc);
    wrapper.update();
    expect(mockFunc).toBeCalled();
    expect(mockFunc).toHaveBeenCalledTimes(1);
    //Verifying returnValue takes a long time here. The program falls on FATAL ERROR - lack of memory.
    //expect(returnValue === wrapper.instance()).toBe(true);
    expect(wrapper.find("ProgressBarItem").instance().state.progress).toBe(68);
    expect(wrapper.find("ProgressBarItem").instance().state.content).toEqual("Jarda Jágr");
    expect(wrapper.find("ProgressBarItem").instance().state.striped).toBeTruthy();
    expect(progress1.getProgressContent()).toEqual("Jarda Jágr");
    expect(progress1.getProgress()).toBe(68);
  });

  it("increase(value, setStateCallBack)", () => {
    let progress1;
    const wrapper = mount(
      <UU5.Bricks.ProgressBar id={"uuID01"}>
        <UU5.Bricks.ProgressBar.Item
          id={"uuID03"}
          progress={2}
          content={"Progress1"}
          colorSchema="purple"
          ref_={(_progress1) => (progress1 = _progress1)}
        />
      </UU5.Bricks.ProgressBar>
    );
    const mockFunc = jest.fn();
    expect(wrapper.find("ProgressBarItem").instance().state.progress).toBe(2);
    expect(wrapper.find("ProgressBarItem").instance().state.content).toEqual("Progress1");
    expect(progress1.getProgressContent()).toEqual("Progress1");
    expect(progress1.getProgress()).toBe(2);
    progress1.increase({ value: 68, content: "Jarda Jágr postupuje" }, mockFunc);
    wrapper.update();
    expect(mockFunc).toBeCalled();
    expect(mockFunc).toHaveBeenCalledTimes(1);
    //Verifying returnValue takes a long time here. The program falls on FATAL ERROR - lack of memory.
    //expect(returnValue === wrapper.instance()).toBe(true);
    expect(wrapper.find("ProgressBarItem").instance().state.progress).toBe(70);
    expect(wrapper.find("ProgressBarItem").instance().state.content).toEqual("Jarda Jágr postupuje");
    expect(progress1.getProgressContent()).toEqual("Jarda Jágr postupuje");
    expect(progress1.getProgress()).toBe(70);
    progress1.increase(35);
    wrapper.update();
    expect(progress1.getProgress()).toBe(100);
  });

  it("decrease(value, setStateCallBack)", () => {
    let progress1;
    const wrapper = mount(
      <UU5.Bricks.ProgressBar id={"uuID01"}>
        <UU5.Bricks.ProgressBar.Item
          id={"uuID03"}
          progress={20}
          content={"Progress1"}
          colorSchema="purple"
          ref_={(_progress1) => (progress1 = _progress1)}
        />
      </UU5.Bricks.ProgressBar>
    );
    const mockFunc = jest.fn();
    expect(wrapper.find("ProgressBarItem").instance().state.progress).toBe(20);
    expect(wrapper.find("ProgressBarItem").instance().state.content).toEqual("Progress1");
    expect(progress1.getProgressContent()).toEqual("Progress1");
    expect(progress1.getProgress()).toBe(20);
    progress1.decrease({ value: 18, content: "Jarda Jágr ustupuje" }, mockFunc);
    wrapper.update();
    expect(mockFunc).toBeCalled();
    expect(mockFunc).toHaveBeenCalledTimes(1);
    //Verifying returnValue takes a long time here. The program falls on FATAL ERROR - lack of memory.
    //expect(returnValue === wrapper.instance()).toBe(true);
    expect(wrapper.find("ProgressBarItem").instance().state.progress).toBe(2);
    expect(wrapper.find("ProgressBarItem").instance().state.content).toEqual("Jarda Jágr ustupuje");
    expect(progress1.getProgressContent()).toEqual("Jarda Jágr ustupuje");
    expect(progress1.getProgress()).toBe(2);
    progress1.decrease(5);
    wrapper.update();
    expect(progress1.getProgress()).toBe(0);
  });
});
