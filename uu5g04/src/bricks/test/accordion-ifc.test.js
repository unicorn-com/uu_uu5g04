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

describe(`UU5.Bricks.Accordion interface testing`, () => {

  /**
   * Interface accordion component use mount() method.
   * IF we use mount() in complicated component we can't make a snapshot.
   * In first test we make a snapshot by shallow and save all default values.
   *
   */
  it('Take shallow snapshot without crash', () => {
    const wrapper = shallow(
      <UU5.Bricks.Accordion id={"uuID"} name={"rootAccorion"} colorSchema="blue">
        <UU5.Bricks.Panel
          id="panel11"
          name="panel1"
          expanded
          header="Panel 1"
          iconExpanded="mdi-chevron-up"
          iconCollapsed="mdi-chevron-down"
        >
          Lorem ipsum dolor sit amet, consectetur adipiscing elit.
        </UU5.Bricks.Panel>
        <UU5.Bricks.Panel
          id="panel22"
          name="panel2"
          alwaysExpanded
          header="Panel 2 - alwaysExpanded"
          content="Lorem ipsum dolor sit amet, consectetur adipiscing elit."
          iconExpanded="mdi-chevron-up"
          iconCollapsed="mdi-chevron-down"
        />
      </UU5.Bricks.Accordion>
    );
    expect(wrapper).toMatchSnapshot();
  });

  it('getPanelById()', () => {
    const wrapper = mount(
      <UU5.Bricks.Accordion id={"uuID"} name={"rootAccorion"} colorSchema="blue">
        <UU5.Bricks.Panel
          id="panel11"
          name="panel1"
          className="panel1-className"
          expanded
          header="Panel 1"
          iconExpanded="mdi-chevron-up"
          iconCollapsed="mdi-chevron-down"
        >
          Lorem ipsum dolor sit amet, consectetur adipiscing elit.
        </UU5.Bricks.Panel>
        <UU5.Bricks.Panel
          id="panel22"
          name="panel2"
          alwaysExpanded
          className="panel2-className"
          header="Panel 2 - alwaysExpanded"
          content="Lorem ipsum dolor sit amet, consectetur adipiscing elit."
          iconExpanded="mdi-chevron-up"
          iconCollapsed="mdi-chevron-down"
        />
      </UU5.Bricks.Accordion>
    );
    expect(wrapper.instance().getPanelById("panel11")).not.toBeNull();
    expect(wrapper.instance().getPanelById("panel11")).toBe(wrapper.find({className: 'panel1-className'}).instance());
  });

  it('getPanelByName()', () => {
    const wrapper = mount(
      <UU5.Bricks.Accordion id={"uuID"} name={"rootAccorion"} colorSchema="blue">
        <UU5.Bricks.Panel
          id="panel11"
          name="panel1"
          expanded
          className="panel1-className"
          header="Panel 1"
          iconExpanded="mdi-chevron-up"
          iconCollapsed="mdi-chevron-down"
        >
          Lorem ipsum dolor sit amet, consectetur adipiscing elit.
        </UU5.Bricks.Panel>
        <UU5.Bricks.Panel
          id="panel22"
          name="panel2"
          alwaysExpanded
          className="panel2-className"
          header="Panel 2 - alwaysExpanded"
          content="Lorem ipsum dolor sit amet, consectetur adipiscing elit."
          iconExpanded="mdi-chevron-up"
          iconCollapsed="mdi-chevron-down"
        />
      </UU5.Bricks.Accordion>
    );
    expect(wrapper.instance().getPanelByName("panel2")).not.toBeNull();
    expect(wrapper.instance().getPanelByName("panel2")).toBe(wrapper.find({className: 'panel2-className'}).instance());
  });

  it('getPanels()', () => {
    const wrapper = mount(
      <UU5.Bricks.Accordion id={"uuID"} name={"rootAccorion"} colorSchema="blue">
        <UU5.Bricks.Panel
          id="panel11"
          name="panel1"
          expanded
          header="Panel 1"
          iconExpanded="mdi-chevron-up"
          iconCollapsed="mdi-chevron-down"
        >
          Lorem ipsum dolor sit amet, consectetur adipiscing elit.
        </UU5.Bricks.Panel>
        <UU5.Bricks.Panel
          id="panel22"
          name="panel2"
          alwaysExpanded
          header="Panel 2 - alwaysExpanded"
          content="Lorem ipsum dolor sit amet, consectetur adipiscing elit."
          iconExpanded="mdi-chevron-up"
          iconCollapsed="mdi-chevron-down"
        />
      </UU5.Bricks.Accordion>
    );
    expect(wrapper.instance().getPanels()).not.toBeNull();
    expect(() => wrapper.instance().getPanels()).not.toThrow();
    expect(wrapper.instance().getPanels()).not.toBeUndefined();
    expect(wrapper.instance().getPanels()).toEqual(expect.any(Object));
  });

  it('eachPanel()', () => {
    const wrapper = mount(
      <UU5.Bricks.Accordion id={"uuID"} name={"rootAccorion"} colorSchema="blue">
        <UU5.Bricks.Panel
          id="panel11"
          name="panel1"
          expanded
          header="Panel 1"
          iconExpanded="mdi-chevron-up"
          iconCollapsed="mdi-chevron-down"
        >
          Lorem ipsum dolor sit amet, consectetur adipiscing elit.
        </UU5.Bricks.Panel>
        <UU5.Bricks.Panel
          id="panel22"
          name="panel2"
          alwaysExpanded
          header="Panel 2 - alwaysExpanded"
          content="Lorem ipsum dolor sit amet, consectetur adipiscing elit."
          iconExpanded="mdi-chevron-up"
          iconCollapsed="mdi-chevron-down"
        />
      </UU5.Bricks.Accordion>
    );
    const mockFunc = jest.fn();
    const returnValue = wrapper.instance().eachPanel(mockFunc);
    wrapper.update();
    //If these expectations setStateCallBack has been correctly called.
    expect(mockFunc).toBeCalled();
    //Called times twice because in accoridion is two panels
    expect(mockFunc).toHaveBeenCalledTimes(2);
    expect(wrapper.instance().getPanels()).not.toBeNull();
    expect(() => wrapper.instance().getPanels()).not.toThrow();
    expect(wrapper.instance().getPanels()).not.toBeUndefined();
    expect(wrapper.instance().getPanels()).toEqual(expect.any(Object));
  });

  it('eachPanelByIds()', () => {
    const wrapper = mount(
      <UU5.Bricks.Accordion id={"uuID"} name={"rootAccorion"} colorSchema="blue">
        <UU5.Bricks.Panel
          id="panel11"
          name="panel1"
          expanded
          header="Panel 1"
          iconExpanded="mdi-chevron-up"
          iconCollapsed="mdi-chevron-down"
        >
          Lorem ipsum dolor sit amet, consectetur adipiscing elit.
        </UU5.Bricks.Panel>
        <UU5.Bricks.Panel
          id="panel22"
          name="panel2"
          alwaysExpanded
          header="Panel 2 - alwaysExpanded"
          content="Lorem ipsum dolor sit amet, consectetur adipiscing elit."
          iconExpanded="mdi-chevron-up"
          iconCollapsed="mdi-chevron-down"
        />
      </UU5.Bricks.Accordion>
    );
    const mockFunc = jest.fn();
    const returnValue = wrapper.instance().eachPanelByIds(["panel11", "panel22"], mockFunc);
    wrapper.update();
    //If these expectations setStateCallBack has been correctly called.
    expect(mockFunc).toBeCalled();
    //Called times twice because in accoridion is two panels
    expect(mockFunc).toHaveBeenCalledTimes(2);
    expect(wrapper.instance().getPanels()).not.toBeNull();
    expect(() => wrapper.instance().getPanels()).not.toThrow();
    expect(wrapper.instance().getPanels()).not.toBeUndefined();
    expect(wrapper.instance().getPanels()).toEqual(expect.any(Object));
  });


  it('eachPanelByNames()', () => {
    const wrapper = mount(
      <UU5.Bricks.Accordion id={"uuID"} name={"rootAccorion"} colorSchema="blue">
        <UU5.Bricks.Panel
          id="panel11"
          name="panel1"
          expanded={false}
          header="Panel 1"
          iconExpanded="mdi-chevron-up"
          iconCollapsed="mdi-chevron-down"
        >
          Lorem ipsum dolor sit amet, consectetur adipiscing elit.
        </UU5.Bricks.Panel>
        <UU5.Bricks.Panel
          id="panel22"
          name="panel2"
          alwaysExpanded
          header="Panel 2 - alwaysExpanded"
          content="Lorem ipsum dolor sit amet, consectetur adipiscing elit."
          iconExpanded="mdi-chevron-up"
          iconCollapsed="mdi-chevron-down"
        />
      </UU5.Bricks.Accordion>
    );
    const mockFunc = jest.fn();
    const returnValue = wrapper.instance().eachPanelByNames(["panel1", "panel2"], mockFunc);
    wrapper.update();
    //If these expectations setStateCallBack has been correctly called.
    expect(mockFunc).toBeCalled();
    //Called times twice because in accoridion is two panels
    expect(mockFunc).toHaveBeenCalledTimes(2);
    expect(wrapper.instance().getPanels()).not.toBeNull();
    expect(() => wrapper.instance().getPanels()).not.toThrow();
    expect(wrapper.instance().getPanels()).not.toBeUndefined();
    expect(wrapper.instance().getPanels()).toEqual(expect.any(Object));
  });

  it('expandPanelById(id, setStateCallBack)', () => {
    const wrapper = mount(
      <UU5.Bricks.Accordion id={"uuID"} name={"rootAccorion"} colorSchema="blue">
        <UU5.Bricks.Panel
          className="locationClass01"
          id="panel11"
          name="panel1"
          expanded={false}
          header="Panel 1"
          iconExpanded="mdi-chevron-up"
          iconCollapsed="mdi-chevron-down"
        >
          Lorem ipsum dolor sit amet, consectetur adipiscing elit.
        </UU5.Bricks.Panel>
        <UU5.Bricks.Panel
          id="panel22"
          name="panel2"
          className="locationClass02"
          alwaysExpanded
          header="Panel 2 - alwaysExpanded"
          content="Lorem ipsum dolor sit amet, consectetur adipiscing elit."
          iconExpanded="mdi-chevron-up"
          iconCollapsed="mdi-chevron-down"
        />
      </UU5.Bricks.Accordion>
    );
    const mockFunc = jest.fn();
    expect(wrapper.find({className: "locationClass01"}).instance().state.expanded).toBeFalsy();
    wrapper.instance().expandPanelById("panel11", mockFunc);
    wrapper.update();
    expect(mockFunc).toBeCalled();
    expect(mockFunc).toHaveBeenCalledTimes(1);
    expect(wrapper.find({className: "locationClass01"}).instance().state.expanded).toBeTruthy();
  });

  it('collapsePanelById(id, setStateCallBack)', () => {
    const wrapper = mount(
      <UU5.Bricks.Accordion id={"uuID"} name={"rootAccorion"} colorSchema="blue">
        <UU5.Bricks.Panel
          className="locationClass01"
          id="panel11"
          name="panel1"
          expanded={true}
          header="Panel 1"
          iconExpanded="mdi-chevron-up"
          iconCollapsed="mdi-chevron-down"
        >
          Lorem ipsum dolor sit amet, consectetur adipiscing elit.
        </UU5.Bricks.Panel>
        <UU5.Bricks.Panel
          id="panel22"
          name="panel2"
          className="locationClass02"
          alwaysExpanded
          header="Panel 2 - alwaysExpanded"
          content="Lorem ipsum dolor sit amet, consectetur adipiscing elit."
          iconExpanded="mdi-chevron-up"
          iconCollapsed="mdi-chevron-down"
        />
      </UU5.Bricks.Accordion>
    );
    const mockFunc = jest.fn();
    expect(wrapper.find({className: "locationClass01"}).instance().state.expanded).toBeTruthy();
    const returnValue = wrapper.instance().collapsePanelById("panel11", mockFunc);
    wrapper.update();
    expect(mockFunc).toBeCalled();
    expect(mockFunc).toHaveBeenCalledTimes(1);
    expect(returnValue).toBe(wrapper.instance());
    expect(wrapper.find({className: "locationClass01"}).instance().state.expanded).toBeFalsy();
  });

  it('collapsePanelByName(name, setStateCallBack)', () => {
    const wrapper = mount(
      <UU5.Bricks.Accordion id={"uuID"} name={"rootAccorion"} colorSchema="blue">
        <UU5.Bricks.Panel
          className="locationClass01"
          id="panel11"
          name="panel1"
          expanded={true}
          header="Panel 1"
          iconExpanded="mdi-chevron-up"
          iconCollapsed="mdi-chevron-down"
        >
          Lorem ipsum dolor sit amet, consectetur adipiscing elit.
        </UU5.Bricks.Panel>
        <UU5.Bricks.Panel
          id="panel22"
          name="panel2"
          className="locationClass02"
          alwaysExpanded
          header="Panel 2 - alwaysExpanded"
          content="Lorem ipsum dolor sit amet, consectetur adipiscing elit."
          iconExpanded="mdi-chevron-up"
          iconCollapsed="mdi-chevron-down"
        />
      </UU5.Bricks.Accordion>
    );
    const mockFunc = jest.fn();
    expect(wrapper.find({className: "locationClass01"}).instance().state.expanded).toBeTruthy();
    const returnValue = wrapper.instance().collapsePanelByName("panel1", mockFunc);
    wrapper.update();
    expect(mockFunc).toBeCalled();
    expect(mockFunc).toHaveBeenCalledTimes(1);
    expect(returnValue).toBe(wrapper.instance());
    expect(wrapper.find({className: "locationClass01"}).instance().state.expanded).toBeFalsy();
  });

  it('togglePanelById(id, setStateCallBack)', () => {
    const wrapper = mount(
      <UU5.Bricks.Accordion id={"uuID"} name={"rootAccorion"} colorSchema="blue">
        <UU5.Bricks.Panel
          className="locationClass01"
          id="panel11"
          name="panel1"
          expanded={false}
          header="Panel 1"
          iconExpanded="mdi-chevron-up"
          iconCollapsed="mdi-chevron-down"
        >
          Lorem ipsum dolor sit amet, consectetur adipiscing elit.
        </UU5.Bricks.Panel>
      </UU5.Bricks.Accordion>
    );
    const mockFunc = jest.fn();
    expect(wrapper.find({className: "locationClass01"}).instance().state.expanded).toBeFalsy();
    const returnValue = wrapper.instance().togglePanelById("panel11", mockFunc);
    wrapper.update();
    expect(mockFunc).toBeCalled();
    expect(mockFunc).toHaveBeenCalledTimes(1);
    expect(returnValue).toBe(wrapper.instance());
    expect(wrapper.find({className: "locationClass01"}).instance().state.expanded).toBeTruthy();
    wrapper.instance().togglePanelById("panel11", mockFunc);
    wrapper.update();
    expect(mockFunc).toBeCalled();
    expect(mockFunc).toHaveBeenCalledTimes(2);
    expect(wrapper.find({className: "locationClass01"}).instance().state.expanded).toBeFalsy();
  });

  it('togglePanelByName(name, setStateCallBack)', () => {
    const wrapper = mount(
      <UU5.Bricks.Accordion id={"uuID"} name={"rootAccorion"} colorSchema="blue">
        <UU5.Bricks.Panel
          className="locationClass01"
          id="panel11"
          name="panel1"
          expanded={false}
          header="Panel 1"
          iconExpanded="mdi-chevron-up"
          iconCollapsed="mdi-chevron-down"
        >
          Lorem ipsum dolor sit amet, consectetur adipiscing elit.
        </UU5.Bricks.Panel>
      </UU5.Bricks.Accordion>
    );
    const mockFunc = jest.fn();
    expect(wrapper.find({className: "locationClass01"}).instance().state.expanded).toBeFalsy();
    const returnValue = wrapper.instance().togglePanelByName("panel1", mockFunc);
    wrapper.update();
    expect(mockFunc).toBeCalled();
    expect(mockFunc).toHaveBeenCalledTimes(1);
    expect(returnValue).toBe(wrapper.instance());
    expect(wrapper.find({className: "locationClass01"}).instance().state.expanded).toBeTruthy();
    wrapper.instance().togglePanelByName("panel1", mockFunc);
    wrapper.update();
    expect(mockFunc).toBeCalled();
    expect(mockFunc).toHaveBeenCalledTimes(2);
    expect(wrapper.find({className: "locationClass01"}).instance().state.expanded).toBeFalsy();
  });

  it('expandAll(setStateCallBack)', () => {
    const wrapper = mount(
      <UU5.Bricks.Accordion id={"uuID"} name={"rootAccorion"} colorSchema="blue">
        <UU5.Bricks.Panel
          id="panel11"
          name="panel1"
          className="locationClass01"
          expanded={false}
          header="Panel 1"
          iconExpanded="mdi-chevron-up"
          iconCollapsed="mdi-chevron-down"
        >
          Lorem ipsum dolor sit amet, consectetur adipiscing elit.
        </UU5.Bricks.Panel>
        <UU5.Bricks.Panel
          id="panel22"
          name="panel2"
          className="locationClass02"
          expanded={false}
          header="Panel 2 - alwaysExpanded"
          content="Lorem ipsum dolor sit amet, consectetur adipiscing elit."
          iconExpanded="mdi-chevron-up"
          iconCollapsed="mdi-chevron-down"
        />
      </UU5.Bricks.Accordion>
    );
    const mockFunc = jest.fn();
    expect(wrapper.find({className: "locationClass01"}).instance().state.expanded).toBeFalsy();
    expect(wrapper.find({className: "locationClass02"}).instance().state.expanded).toBeFalsy();
    const returnValue = wrapper.instance().expandAll(mockFunc);
    wrapper.update();
    expect(mockFunc).toBeCalled();
    expect(mockFunc).toHaveBeenCalledTimes(1);
    expect(returnValue).toBe(wrapper.instance());
    expect(wrapper.find({className: "locationClass01"}).instance().state.expanded).toBeTruthy();
    expect(wrapper.find({className: "locationClass02"}).instance().state.expanded).toBeTruthy();
  });

  it('collapseAll(setStateCallBack)', () => {
    const wrapper = mount(
      <UU5.Bricks.Accordion id={"uuID"} name={"rootAccorion"} colorSchema="blue">
        <UU5.Bricks.Panel
          id="panel11"
          name="panel1"
          className="locationClass01"
          expanded={true}
          header="Panel 1"
          iconExpanded="mdi-chevron-up"
          iconCollapsed="mdi-chevron-down"
        >
          Lorem ipsum dolor sit amet, consectetur adipiscing elit.
        </UU5.Bricks.Panel>
        <UU5.Bricks.Panel
          id="panel22"
          name="panel2"
          className="locationClass02"
          expanded={true}
          header="Panel 2 - alwaysExpanded"
          content="Lorem ipsum dolor sit amet, consectetur adipiscing elit."
          iconExpanded="mdi-chevron-up"
          iconCollapsed="mdi-chevron-down"
        />
      </UU5.Bricks.Accordion>
    );
    const mockFunc = jest.fn();
    expect(wrapper.find({className: "locationClass01"}).instance().state.expanded).toBeTruthy();
    expect(wrapper.find({className: "locationClass02"}).instance().state.expanded).toBeTruthy();
    const returnValue = wrapper.instance().collapseAll(mockFunc);
    wrapper.update();
    expect(mockFunc).toBeCalled();
    expect(mockFunc).toHaveBeenCalledTimes(1);
    expect(returnValue).toBe(wrapper.instance());
    expect(wrapper.find({className: "locationClass01"}).instance().state.expanded).toBeFalsy();
    expect(wrapper.find({className: "locationClass02"}).instance().state.expanded).toBeFalsy();
  });

  it('toggleAll(setStateCallBack)', () => {
    const wrapper = mount(
      <UU5.Bricks.Accordion id={"uuID"} name={"rootAccorion"} colorSchema="blue">
        <UU5.Bricks.Panel
          id="panel11"
          name="panel1"
          className="locationClass01"
          expanded={true}
          header="Panel 1"
          iconExpanded="mdi-chevron-up"
          iconCollapsed="mdi-chevron-down"
        >
          Lorem ipsum dolor sit amet, consectetur adipiscing elit.
        </UU5.Bricks.Panel>
        <UU5.Bricks.Panel
          id="panel22"
          name="panel2"
          className="locationClass02"
          expanded={true}
          header="Panel 2 - alwaysExpanded"
          content="Lorem ipsum dolor sit amet, consectetur adipiscing elit."
          iconExpanded="mdi-chevron-up"
          iconCollapsed="mdi-chevron-down"
        />
      </UU5.Bricks.Accordion>
    );
    const mockFunc = jest.fn();
    expect(wrapper.find({className: "locationClass01"}).instance().state.expanded).toBeTruthy();
    expect(wrapper.find({className: "locationClass02"}).instance().state.expanded).toBeTruthy();
    const returnValue = wrapper.instance().toggleAll(mockFunc);
    wrapper.update();
    expect(mockFunc).toBeCalled();
    expect(mockFunc).toHaveBeenCalledTimes(1);
    expect(returnValue).toBe(wrapper.instance());
    expect(wrapper.find({className: "locationClass01"}).instance().state.expanded).toBeFalsy();
    expect(wrapper.find({className: "locationClass02"}).instance().state.expanded).toBeFalsy();
    wrapper.instance().toggleAll(mockFunc);
    wrapper.update();
    expect(mockFunc).toBeCalled();
    expect(mockFunc).toHaveBeenCalledTimes(2);
    expect(wrapper.find({className: "locationClass01"}).instance().state.expanded).toBeTruthy();
    expect(wrapper.find({className: "locationClass02"}).instance().state.expanded).toBeTruthy();
  });

  it('shouldCollpaseOthers(bool) should return false each times.', () => {
    const wrapper = mount(
      <UU5.Bricks.Accordion id={"uuID01"} onClickNotCollapseOthers name={"rootAccorion"}>
        <UU5.Bricks.Panel id={"uuPanel01"} className="first" header="Panel 1" content="Panel content1"/>
        <UU5.Bricks.Panel id={"uuPanel02"} className="second" header="Panel 2" content="Panel content2"/>
        <UU5.Bricks.Panel id={"uuPanel03"} className="third" header="Panel 3" content="Panel content3"/>
      </UU5.Bricks.Accordion>
    );
    const mockFunc = jest.fn();
    expect(wrapper.find({className: "first"}).instance().state.expanded).toBeFalsy();
    expect(wrapper.find({className: "second"}).instance().state.expanded).toBeFalsy();
    expect(wrapper.find({className: "third"}).instance().state.expanded).toBeFalsy();
    expect(wrapper.instance().shouldCollapseOthers()).toBeFalsy();
    wrapper.instance().expandPanelById("uuPanel01", mockFunc);
    wrapper.update();
    expect(mockFunc).toBeCalled();
    expect(mockFunc).toHaveBeenCalledTimes(1);
    expect(wrapper.find({className: "first"}).instance().state.expanded).toBeTruthy();
    expect(wrapper.find({className: "second"}).instance().state.expanded).toBeFalsy();
    expect(wrapper.find({className: "third"}).instance().state.expanded).toBeFalsy();
    expect(wrapper.instance().shouldCollapseOthers()).toBeFalsy();
    wrapper.instance().expandPanelById("uuPanel02", mockFunc);
    wrapper.update();
    expect(mockFunc).toBeCalled();
    expect(mockFunc).toHaveBeenCalledTimes(2);
    expect(wrapper.find({className: "first"}).instance().state.expanded).toBeTruthy();
    expect(wrapper.find({className: "second"}).instance().state.expanded).toBeTruthy();
    expect(wrapper.find({className: "third"}).instance().state.expanded).toBeFalsy();
    expect(wrapper.instance().shouldCollapseOthers()).toBeFalsy();
    wrapper.instance().expandPanelById("uuPanel03", mockFunc);
    wrapper.update();
    expect(mockFunc).toBeCalled();
    expect(mockFunc).toHaveBeenCalledTimes(3);
    //Now all three panels are opened at once because they have props onClickNotCollapseOthers=true
    expect(wrapper.find({className: "first"}).instance().state.expanded).toBeTruthy();
    expect(wrapper.find({className: "second"}).instance().state.expanded).toBeTruthy();
    expect(wrapper.find({className: "third"}).instance().state.expanded).toBeTruthy();
    expect(wrapper.instance().shouldCollapseOthers()).toBeFalsy();
  });

  it('shouldCollpaseOthers(bool)  should return TRUE', () => {
    const wrapper = mount(
      <UU5.Bricks.Accordion id={"uuID01"} onClickNotCollapseOthers={false} name={"rootAccorion"}>
        <UU5.Bricks.Panel id={"uuPanel01"} expanded={false} className="first" header="Panel 1"
                          content="Panel content1"/>
        <UU5.Bricks.Panel id={"uuPanel02"} expanded={true} className="second" header="Panel 2"
                          content="Panel content2"/>
        <UU5.Bricks.Panel id={"uuPanel03"} expanded={true} className="third" header="Panel 3" content="Panel content3"/>
      </UU5.Bricks.Accordion>
    );
    const mockFunc = jest.fn();
    expect(wrapper.find({className: "first"}).instance().state.expanded).toBeFalsy();
    expect(wrapper.find({className: "second"}).instance().state.expanded).toBeTruthy();
    expect(wrapper.find({className: "third"}).instance().state.expanded).toBeTruthy();
    wrapper.instance().expandPanelById("uuPanel01", mockFunc);
    wrapper.update();
    expect(mockFunc).toBeCalled();
    expect(mockFunc).toHaveBeenCalledTimes(1);
    expect(wrapper.instance().shouldCollapseOthers()).toBeTruthy();
  });

  it('collapseOthers(id, setStateCallBack)', () => {
    const wrapper = mount(
      <UU5.Bricks.Accordion id={"uuID"} name={"rootAccorion"} colorSchema="blue">
        <UU5.Bricks.Panel
          id="panel11"
          name="panel1"
          className="locationClass01"
          expanded={true}
          header="Panel 1"
          iconExpanded="mdi-chevron-up"
          iconCollapsed="mdi-chevron-down"
        >
          Lorem ipsum dolor sit amet, consectetur adipiscing elit.
        </UU5.Bricks.Panel>
        <UU5.Bricks.Panel
          id="panel22"
          name="panel2"
          className="locationClass02"
          expanded={true}
          header="Panel 2 - alwaysExpanded"
          content="Lorem ipsum dolor sit amet, consectetur adipiscing elit."
          iconExpanded="mdi-chevron-up"
          iconCollapsed="mdi-chevron-down"
        />
      </UU5.Bricks.Accordion>
    );
    const mockFunc = jest.fn();
    expect(wrapper.find({className: "locationClass01"}).instance().state.expanded).toBeTruthy();
    expect(wrapper.find({className: "locationClass02"}).instance().state.expanded).toBeTruthy();
    const returnValue = wrapper.instance().collapseOthers("panel11", mockFunc);
    wrapper.update();
    expect(mockFunc).toBeCalled();
    expect(mockFunc).toHaveBeenCalledTimes(1);
    expect(returnValue).toBe(wrapper.instance());
    expect(wrapper.find({className: "locationClass01"}).instance().state.expanded).toBeTruthy();
    expect(wrapper.find({className: "locationClass02"}).instance().state.expanded).toBeFalsy();
  });

});
