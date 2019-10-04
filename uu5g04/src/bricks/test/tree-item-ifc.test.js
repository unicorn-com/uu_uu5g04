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

/**
 * The test requires mount () for proper functionality. Do not use snapshots due to lack of memory.
 */

describe('UU5.Bricks.Tree.Item interface testing', function () {

  it('Shallow rendering: Take snapshot without crash', () => {
    const wrapper = shallow(
      <UU5.Bricks.Tree id={"uuID01"}>
        <UU5.Bricks.Tree.Item id={"uuID02"} label='Movies' className="MyClass" name={"locatorName"}
                              ref_={(treeItem) => this.treeItem = treeItem}>
          <UU5.Bricks.Tree.Item id={"uuID03"} label='Comedies'>
            <UU5.Bricks.Tree.Item id={"uuID04"} label='Anchorman'/>
            <UU5.Bricks.Tree.Item id={"uuID05"} label='Yesman'/>
          </UU5.Bricks.Tree.Item>
        </UU5.Bricks.Tree.Item>
      </UU5.Bricks.Tree>
    );
    expect(wrapper).toMatchSnapshot();
  });

  it('expand(setStateCallBack)', () => {
    const wrapper = mount(
      <UU5.Bricks.Tree id={"uuID01"}>
        <UU5.Bricks.Tree.Item id={"uuID02"} label='Movies' className="MyClass" name={"locatorName"}
                              ref_={(treeItem) => this.treeItem = treeItem}>
          <UU5.Bricks.Tree.Item id={"uuID03"} label='Comedies'>
            <UU5.Bricks.Tree.Item id={"uuID04"} label='Anchorman'/>
            <UU5.Bricks.Tree.Item id={"uuID05"} label='Yesman'/>
          </UU5.Bricks.Tree.Item>
        </UU5.Bricks.Tree.Item>
      </UU5.Bricks.Tree>
    );
    const mockFunc = jest.fn();
    expect(this.treeItem.isExpanded()).toBeFalsy();
    expect(wrapper.find({className: 'MyClass'}).instance().state.expanded).toBeFalsy();
    const returnValue = this.treeItem.expand(mockFunc);
    wrapper.update();
    expect(mockFunc).toBeCalled();
    expect(this.treeItem.isExpanded()).toBeTruthy();
    expect(wrapper.find({className: 'MyClass'}).instance().state.expanded).toBeTruthy();
  });

  it('collapse(setStateCallBack)', () => {
    const wrapper = mount(
      <UU5.Bricks.Tree id={"uuID01"}>
        <UU5.Bricks.Tree.Item id={"uuID02"} label='Movies' className="MyClass" expanded={true} name={"locatorName"}
                              ref_={(treeItem) => this.treeItem = treeItem}>
          <UU5.Bricks.Tree.Item id={"uuID03"} label='Comedies'>
            <UU5.Bricks.Tree.Item id={"uuID04"} label='Anchorman'/>
            <UU5.Bricks.Tree.Item id={"uuID05"} label='Yesman'/>
          </UU5.Bricks.Tree.Item>
        </UU5.Bricks.Tree.Item>
      </UU5.Bricks.Tree>
    );
    const mockFunc = jest.fn();
    expect(this.treeItem.isExpanded()).toBeTruthy();
    expect(wrapper.find({className: 'MyClass'}).instance().state.expanded).toBeTruthy();
    const returnValue = this.treeItem.collapse(mockFunc);
    wrapper.update();
    expect(mockFunc).toBeCalled();
    expect(this.treeItem.isExpanded()).toBeFalsy();
    expect(wrapper.find({className: 'MyClass'}).instance().state.expanded).toBeFalsy();
  });

  it('toggleExpanded(setStateCallBack)', () => {
    const wrapper = mount(
      <UU5.Bricks.Tree id={"uuID01"}>
        <UU5.Bricks.Tree.Item id={"uuID02"} label='Movies' className="MyClass" expanded={false} name={"locatorName"}
                              ref_={(treeItem) => this.treeItem = treeItem}>
          <UU5.Bricks.Tree.Item id={"uuID03"} label='Comedies'>
            <UU5.Bricks.Tree.Item id={"uuID04"} label='Anchorman'/>
            <UU5.Bricks.Tree.Item id={"uuID05"} label='Yesman'/>
          </UU5.Bricks.Tree.Item>
        </UU5.Bricks.Tree.Item>
      </UU5.Bricks.Tree>
    );
    const mockFunc = jest.fn();
    expect(this.treeItem.isExpanded()).toBeFalsy();
    expect(wrapper.find({className: 'MyClass'}).instance().state.expanded).toBeFalsy();
    const returnValue = this.treeItem.toggleExpanded(mockFunc);
    wrapper.update();
    expect(mockFunc).toBeCalled();
    expect(this.treeItem.isExpanded()).toBeTruthy();
    expect(wrapper.find({className: 'MyClass'}).instance().state.expanded).toBeTruthy();
    this.treeItem.toggleExpanded(mockFunc);
    wrapper.update();
    expect(mockFunc).toBeCalled();
    expect(mockFunc).toHaveBeenCalledTimes(2);
    expect(this.treeItem.isExpanded()).toBeFalsy();
    expect(wrapper.find({className: 'MyClass'}).instance().state.expanded).toBeFalsy();
  });

  it('isExpanded() return true', () => {
    const wrapper = mount(
      <UU5.Bricks.Tree id={"uuID01"}>
        <UU5.Bricks.Tree.Item id={"uuID02"} label='Movies' className="MyClass" expanded={true} name={"locatorName"}
                              ref_={(treeItem) => this.treeItem = treeItem}>
          <UU5.Bricks.Tree.Item id={"uuID03"} label='Comedies'>
            <UU5.Bricks.Tree.Item id={"uuID04"} label='Anchorman'/>
            <UU5.Bricks.Tree.Item id={"uuID05"} label='Yesman'/>
          </UU5.Bricks.Tree.Item>
        </UU5.Bricks.Tree.Item>
      </UU5.Bricks.Tree>
    );
    expect(this.treeItem.isExpanded()).toBeTruthy();
    expect(wrapper.find({className: 'MyClass'}).instance().state.expanded).toBeTruthy();
  });

  it('isExpanded() return false', () => {
    const wrapper = mount(
      <UU5.Bricks.Tree id={"uuID01"}>
        <UU5.Bricks.Tree.Item id={"uuID02"} label='Movies' className="MyClass" expanded={false} name={"locatorName"}
                              ref_={(treeItem) => this.treeItem = treeItem}>
          <UU5.Bricks.Tree.Item id={"uuID03"} label='Comedies'>
            <UU5.Bricks.Tree.Item id={"uuID04"} label='Anchorman'/>
            <UU5.Bricks.Tree.Item id={"uuID05"} label='Yesman'/>
          </UU5.Bricks.Tree.Item>
        </UU5.Bricks.Tree.Item>
      </UU5.Bricks.Tree>
    );
    expect(this.treeItem.isExpanded()).toBeFalsy();
    expect(wrapper.find({className: 'MyClass'}).instance().state.expanded).toBeFalsy();
  });

});
