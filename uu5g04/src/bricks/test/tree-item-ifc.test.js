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

/**
 * The test requires mount () for proper functionality. Do not use snapshots due to lack of memory.
 */

describe("UU5.Bricks.Tree.Item interface testing", function () {
  it("Shallow rendering: Take snapshot without crash", () => {
    let treeItem;
    const wrapper = shallow(
      <UU5.Bricks.Tree id={"uuID01"}>
        <UU5.Bricks.Tree.Item
          id={"uuID02"}
          label="Movies"
          className="MyClass"
          name={"locatorName"}
          ref_={(_treeItem) => (treeItem = _treeItem)}
        >
          <UU5.Bricks.Tree.Item id={"uuID03"} label="Comedies">
            <UU5.Bricks.Tree.Item id={"uuID04"} label="Anchorman" />
            <UU5.Bricks.Tree.Item id={"uuID05"} label="Yesman" />
          </UU5.Bricks.Tree.Item>
        </UU5.Bricks.Tree.Item>
      </UU5.Bricks.Tree>
    );
    expect(wrapper).toMatchSnapshot();
  });

  it("expand(setStateCallBack)", () => {
    let treeItem;
    const wrapper = mount(
      <UU5.Bricks.Tree id={"uuID01"}>
        <UU5.Bricks.Tree.Item
          id={"uuID02"}
          label="Movies"
          className="MyClass"
          name={"locatorName"}
          ref_={(_treeItem) => (treeItem = _treeItem)}
        >
          <UU5.Bricks.Tree.Item id={"uuID03"} label="Comedies">
            <UU5.Bricks.Tree.Item id={"uuID04"} label="Anchorman" />
            <UU5.Bricks.Tree.Item id={"uuID05"} label="Yesman" />
          </UU5.Bricks.Tree.Item>
        </UU5.Bricks.Tree.Item>
      </UU5.Bricks.Tree>
    );
    const mockFunc = jest.fn();
    expect(treeItem.isExpanded()).toBeFalsy();
    expect(wrapper.find({ className: "MyClass" }).instance().state.expanded).toBeFalsy();
    treeItem.expand(mockFunc);
    wrapper.update();
    expect(mockFunc).toBeCalled();
    expect(treeItem.isExpanded()).toBeTruthy();
    expect(wrapper.find({ className: "MyClass" }).instance().state.expanded).toBeTruthy();
  });

  it("collapse(setStateCallBack)", () => {
    let treeItem;
    const wrapper = mount(
      <UU5.Bricks.Tree id={"uuID01"}>
        <UU5.Bricks.Tree.Item
          id={"uuID02"}
          label="Movies"
          className="MyClass"
          expanded={true}
          name={"locatorName"}
          ref_={(_treeItem) => (treeItem = _treeItem)}
        >
          <UU5.Bricks.Tree.Item id={"uuID03"} label="Comedies">
            <UU5.Bricks.Tree.Item id={"uuID04"} label="Anchorman" />
            <UU5.Bricks.Tree.Item id={"uuID05"} label="Yesman" />
          </UU5.Bricks.Tree.Item>
        </UU5.Bricks.Tree.Item>
      </UU5.Bricks.Tree>
    );
    const mockFunc = jest.fn();
    expect(treeItem.isExpanded()).toBeTruthy();
    expect(wrapper.find({ className: "MyClass" }).instance().state.expanded).toBeTruthy();
    treeItem.collapse(mockFunc);
    wrapper.update();
    expect(mockFunc).toBeCalled();
    expect(treeItem.isExpanded()).toBeFalsy();
    expect(wrapper.find({ className: "MyClass" }).instance().state.expanded).toBeFalsy();
  });

  it("toggleExpanded(setStateCallBack)", () => {
    let treeItem;
    const wrapper = mount(
      <UU5.Bricks.Tree id={"uuID01"}>
        <UU5.Bricks.Tree.Item
          id={"uuID02"}
          label="Movies"
          className="MyClass"
          expanded={false}
          name={"locatorName"}
          ref_={(_treeItem) => (treeItem = _treeItem)}
        >
          <UU5.Bricks.Tree.Item id={"uuID03"} label="Comedies">
            <UU5.Bricks.Tree.Item id={"uuID04"} label="Anchorman" />
            <UU5.Bricks.Tree.Item id={"uuID05"} label="Yesman" />
          </UU5.Bricks.Tree.Item>
        </UU5.Bricks.Tree.Item>
      </UU5.Bricks.Tree>
    );
    const mockFunc = jest.fn();
    expect(treeItem.isExpanded()).toBeFalsy();
    expect(wrapper.find({ className: "MyClass" }).instance().state.expanded).toBeFalsy();
    treeItem.toggleExpanded(mockFunc);
    wrapper.update();
    expect(mockFunc).toBeCalled();
    expect(treeItem.isExpanded()).toBeTruthy();
    expect(wrapper.find({ className: "MyClass" }).instance().state.expanded).toBeTruthy();
    treeItem.toggleExpanded(mockFunc);
    wrapper.update();
    expect(mockFunc).toBeCalled();
    expect(mockFunc).toHaveBeenCalledTimes(2);
    expect(treeItem.isExpanded()).toBeFalsy();
    expect(wrapper.find({ className: "MyClass" }).instance().state.expanded).toBeFalsy();
  });

  it("isExpanded() return true", () => {
    let treeItem;
    const wrapper = mount(
      <UU5.Bricks.Tree id={"uuID01"}>
        <UU5.Bricks.Tree.Item
          id={"uuID02"}
          label="Movies"
          className="MyClass"
          expanded={true}
          name={"locatorName"}
          ref_={(_treeItem) => (treeItem = _treeItem)}
        >
          <UU5.Bricks.Tree.Item id={"uuID03"} label="Comedies">
            <UU5.Bricks.Tree.Item id={"uuID04"} label="Anchorman" />
            <UU5.Bricks.Tree.Item id={"uuID05"} label="Yesman" />
          </UU5.Bricks.Tree.Item>
        </UU5.Bricks.Tree.Item>
      </UU5.Bricks.Tree>
    );
    expect(treeItem.isExpanded()).toBeTruthy();
    expect(wrapper.find({ className: "MyClass" }).instance().state.expanded).toBeTruthy();
  });

  it("isExpanded() return false", () => {
    let treeItem;
    const wrapper = mount(
      <UU5.Bricks.Tree id={"uuID01"}>
        <UU5.Bricks.Tree.Item
          id={"uuID02"}
          label="Movies"
          className="MyClass"
          expanded={false}
          name={"locatorName"}
          ref_={(_treeItem) => (treeItem = _treeItem)}
        >
          <UU5.Bricks.Tree.Item id={"uuID03"} label="Comedies">
            <UU5.Bricks.Tree.Item id={"uuID04"} label="Anchorman" />
            <UU5.Bricks.Tree.Item id={"uuID05"} label="Yesman" />
          </UU5.Bricks.Tree.Item>
        </UU5.Bricks.Tree.Item>
      </UU5.Bricks.Tree>
    );
    expect(treeItem.isExpanded()).toBeFalsy();
    expect(wrapper.find({ className: "MyClass" }).instance().state.expanded).toBeFalsy();
  });
});
