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

import React from 'react';
import {shallow, mount} from 'enzyme';
import UU5 from "uu5g04";
import "uu5g04-bricks";

const TagName = "UU5.Bricks.Page";

afterEach(() => {
  delete UU5.Environment.page;
});

describe(`${TagName} interface testing`, () => {

  it('isLeftFloat()', () => {
    const wrapper = mount(
      <UU5.Bricks.Page
        type="1"
        top={<UU5.Bricks.Box id={"idTop"} colorSchema="blue-rich" content="TOP" className="center"/>}
        bottom={<UU5.Bricks.Box id={"idBottom"} colorSchema="grey">Bottom Panel</UU5.Bricks.Box>}
        left={
          <UU5.Bricks.Section id={"left01"}>
            <UU5.Bricks.Box id={"left02"} colorSchema='primary' content='Left Menu'/>
            <br/>
            <UU5.Bricks.Column id={"left03"}>
              Lorem ipsum dolor sit amet, consectetuer adipiscing elit.
              Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos hymenaeos.
            </UU5.Bricks.Column>
          </UU5.Bricks.Section>
        }
        rightOpen={
          <UU5.Bricks.Section id={"r_open01"}>
            <UU5.Bricks.Box id={"r_open02"} colorSchema='primary' content='Menu'/>
            <br/>
            <UU5.Bricks.Column id={"r_open03"}>
              <UU5.Bricks.ButtonGroup id={"r_open04"} vertical>
                <UU5.Bricks.Button id={"r_open05"} colorSchema="primary" ref_={(button) => this.MenuButton = button}>Home
                  <UU5.Bricks.Icon id={"r_open06"} icon="mdi-home"/>
                </UU5.Bricks.Button>
              </UU5.Bricks.ButtonGroup>
            </UU5.Bricks.Column>
          </UU5.Bricks.Section>
        }
        rightClosed={<UU5.Bricks.Section id={"r_closed01"}>
          <UU5.Bricks.Box id={"r_closed02"} colorSchema='primary' content=''/>
          <br/>
          <UU5.Bricks.Column id={"r_closed03"}>
            <UU5.Bricks.Button id={"r_closed04"} colorSchema="primary">
              <UU5.Bricks.Icon id={"r_closed05"} icon="mdi-home"/>
            </UU5.Bricks.Button>
          </UU5.Bricks.Column>
        </UU5.Bricks.Section>
        }
        systemLayerContent={<UU5.Bricks.Alert id={"systemLayerID"}>systemLayerContent</UU5.Bricks.Alert>}
        appLayerContent={<UU5.Bricks.Alert id={"appLayerId"}>appLayerContent</UU5.Bricks.Alert>}
        leftWidth="!xs-2em-60px !s-3em-80px !m-4em-100px !l-3em-160px !xl-4em-180px"
        rightWidth="!xs-2em-60px !s-3em-80px !m-4em-100px !l-3em-160px !xl-4em-180px"
        modal={<UU5.Bricks.Modal id={"pageModalId"} content="Content"/>}
      >
        <UU5.Bricks.Div id={"contentID01"} className="padding">
          <UU5.Bricks.Header id={"contentID02"} level={1}>Content</UU5.Bricks.Header>
          <UU5.Bricks.Section id={"contentID03"} className="center"><UU5.Bricks.Paragraph
            id={"contentID04"}/></UU5.Bricks.Section>
        </UU5.Bricks.Div>
      </UU5.Bricks.Page>,
      {disableLifecycleMethods: false}
    );
    expect(wrapper.instance().isLeftFloat()).toBeTruthy();
    expect(() => wrapper.instance().isLeftFloat()).not.toThrow();
    expect(wrapper.instance().isLeftFloat()).not.toBeNull();
    expect(wrapper.instance().isLeftFloat()).not.toBeUndefined();
  });

  it('isRightFloat()', () => {
    const wrapper = mount(
      <UU5.Bricks.Page
        type="1"
        top={<UU5.Bricks.Box id={"idTop"} colorSchema="blue-rich" content="TOP" className="center"/>}
        bottom={<UU5.Bricks.Box id={"idBottom"} colorSchema="grey">Bottom Panel</UU5.Bricks.Box>}
        left={
          <UU5.Bricks.Section id={"left01"}>
            <UU5.Bricks.Box id={"left02"} colorSchema='primary' content='Left Menu'/>
            <br/>
            <UU5.Bricks.Column id={"left03"}>
              Lorem ipsum dolor sit amet, consectetuer adipiscing elit.
              Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos hymenaeos.
            </UU5.Bricks.Column>
          </UU5.Bricks.Section>
        }
        rightOpen={
          <UU5.Bricks.Section id={"r_open01"}>
            <UU5.Bricks.Box id={"r_open02"} colorSchema='primary' content='Menu'/>
            <br/>
            <UU5.Bricks.Column id={"r_open03"}>
              <UU5.Bricks.ButtonGroup id={"r_open04"} vertical>
                <UU5.Bricks.Button id={"r_open05"} colorSchema="primary" ref_={(button) => this.MenuButton = button}>Home
                  <UU5.Bricks.Icon id={"r_open06"} icon="mdi-home"/>
                </UU5.Bricks.Button>
              </UU5.Bricks.ButtonGroup>
            </UU5.Bricks.Column>
          </UU5.Bricks.Section>
        }
        rightClosed={<UU5.Bricks.Section id={"r_closed01"}>
          <UU5.Bricks.Box id={"r_closed02"} colorSchema='primary' content=''/>
          <br/>
          <UU5.Bricks.Column id={"r_closed03"}>
            <UU5.Bricks.Button id={"r_closed04"} colorSchema="primary">
              <UU5.Bricks.Icon id={"r_closed05"} icon="mdi-home"/>
            </UU5.Bricks.Button>
          </UU5.Bricks.Column>
        </UU5.Bricks.Section>
        }
        systemLayerContent={<UU5.Bricks.Alert id={"systemLayerID"}>systemLayerContent</UU5.Bricks.Alert>}
        appLayerContent={<UU5.Bricks.Alert id={"appLayerId"}>appLayerContent</UU5.Bricks.Alert>}
        leftWidth="!xs-2em-60px !s-3em-80px !m-4em-100px !l-3em-160px !xl-4em-180px"
        rightWidth="!xs-2em-60px !s-3em-80px !m-4em-100px !l-3em-160px !xl-4em-180px"
        modal={<UU5.Bricks.Modal id={"pageModalId"} content="Content"/>}
      >
        <UU5.Bricks.Div id={"contentID01"} className="padding">
          <UU5.Bricks.Header id={"contentID02"} level={1}>Content</UU5.Bricks.Header>
          <UU5.Bricks.Section id={"contentID03"} className="center"><UU5.Bricks.Paragraph
            id={"contentID04"}/></UU5.Bricks.Section>
        </UU5.Bricks.Div>
      </UU5.Bricks.Page>,
      {disableLifecycleMethods: false}
    );
    expect(wrapper.instance().isRightFloat()).toBeTruthy();
    expect(() => wrapper.instance().isRightFloat()).not.toThrow();
    expect(wrapper.instance().isRightFloat()).not.toBeNull();
    expect(wrapper.instance().isRightFloat()).not.toBeUndefined();
  });

  it('getLeft()', () => {
    const wrapper = mount(
      <UU5.Bricks.Page
        type="1"
        top={<UU5.Bricks.Box id={"idTop"} colorSchema="blue-rich" content="TOP" className="center"/>}
        bottom={<UU5.Bricks.Box id={"idBottom"} colorSchema="grey">Bottom Panel</UU5.Bricks.Box>}
        left={
          <UU5.Bricks.Section id={"left01"}>
            <UU5.Bricks.Box id={"left02"} colorSchema='primary' content='Left Menu'/>
            <br/>
            <UU5.Bricks.Column id={"left03"}>
              Lorem ipsum dolor sit amet, consectetuer adipiscing elit.
              Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos hymenaeos.
            </UU5.Bricks.Column>
          </UU5.Bricks.Section>
        }
        rightOpen={
          <UU5.Bricks.Section id={"r_open01"}>
            <UU5.Bricks.Box id={"r_open02"} colorSchema='primary' content='Menu'/>
            <br/>
            <UU5.Bricks.Column id={"r_open03"}>
              <UU5.Bricks.ButtonGroup id={"r_open04"} vertical>
                <UU5.Bricks.Button id={"r_open05"} colorSchema="primary" ref_={(button) => this.MenuButton = button}>Home
                  <UU5.Bricks.Icon id={"r_open06"} icon="mdi-home"/>
                </UU5.Bricks.Button>
              </UU5.Bricks.ButtonGroup>
            </UU5.Bricks.Column>
          </UU5.Bricks.Section>
        }
        rightClosed={<UU5.Bricks.Section id={"r_closed01"}>
          <UU5.Bricks.Box id={"r_closed02"} colorSchema='primary' content=''/>
          <br/>
          <UU5.Bricks.Column id={"r_closed03"}>
            <UU5.Bricks.Button id={"r_closed04"} colorSchema="primary">
              <UU5.Bricks.Icon id={"r_closed05"} icon="mdi-home"/>
            </UU5.Bricks.Button>
          </UU5.Bricks.Column>
        </UU5.Bricks.Section>
        }
        systemLayerContent={<UU5.Bricks.Alert id={"systemLayerID"}>systemLayerContent</UU5.Bricks.Alert>}
        appLayerContent={<UU5.Bricks.Alert id={"appLayerId"}>appLayerContent</UU5.Bricks.Alert>}
        leftWidth="!xs-2em-60px !s-3em-80px !m-4em-100px !l-3em-160px !xl-4em-180px"
        rightWidth="!xs-2em-60px !s-3em-80px !m-4em-100px !l-3em-160px !xl-4em-180px"
        modal={<UU5.Bricks.Modal id={"pageModalId"} content="Content"/>}
      >
        <UU5.Bricks.Div id={"contentID01"} className="padding">
          <UU5.Bricks.Header id={"contentID02"} level={1}>Content</UU5.Bricks.Header>
          <UU5.Bricks.Section id={"contentID03"} className="center"><UU5.Bricks.Paragraph
            id={"contentID04"}/></UU5.Bricks.Section>
        </UU5.Bricks.Div>
      </UU5.Bricks.Page>,
      {disableLifecycleMethods: false}
    );
    expect(wrapper.instance().getLeft()).not.toBeNull();
    expect(wrapper.instance().getLeft()).not.toBeUndefined();
    expect(wrapper.instance().getLeft()).toEqual(expect.any(Object));
    expect(wrapper.instance().getLeft()).toBeInstanceOf(Object);
    expect(() => wrapper.instance().getLeft()).not.toThrow();
  });


  it('getRight()', () => {
    const wrapper = mount(
      <UU5.Bricks.Page
        type="1"
        top={<UU5.Bricks.Box id={"idTop"} colorSchema="blue-rich" content="TOP" className="center"/>}
        bottom={<UU5.Bricks.Box id={"idBottom"} colorSchema="grey">Bottom Panel</UU5.Bricks.Box>}
        left={
          <UU5.Bricks.Section id={"left01"}>
            <UU5.Bricks.Box id={"left02"} colorSchema='primary' content='Left Menu'/>
            <br/>
            <UU5.Bricks.Column id={"left03"}>
              Lorem ipsum dolor sit amet, consectetuer adipiscing elit.
              Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos hymenaeos.
            </UU5.Bricks.Column>
          </UU5.Bricks.Section>
        }
        rightOpen={
          <UU5.Bricks.Section id={"r_open01"}>
            <UU5.Bricks.Box id={"r_open02"} colorSchema='primary' content='Menu'/>
            <br/>
            <UU5.Bricks.Column id={"r_open03"}>
              <UU5.Bricks.ButtonGroup id={"r_open04"} vertical>
                <UU5.Bricks.Button id={"r_open05"} colorSchema="primary" ref_={(button) => this.MenuButton = button}>Home
                  <UU5.Bricks.Icon id={"r_open06"} icon="mdi-home"/>
                </UU5.Bricks.Button>
              </UU5.Bricks.ButtonGroup>
            </UU5.Bricks.Column>
          </UU5.Bricks.Section>
        }
        rightClosed={<UU5.Bricks.Section id={"r_closed01"}>
          <UU5.Bricks.Box id={"r_closed02"} colorSchema='primary' content=''/>
          <br/>
          <UU5.Bricks.Column id={"r_closed03"}>
            <UU5.Bricks.Button id={"r_closed04"} colorSchema="primary">
              <UU5.Bricks.Icon id={"r_closed05"} icon="mdi-home"/>
            </UU5.Bricks.Button>
          </UU5.Bricks.Column>
        </UU5.Bricks.Section>
        }
        systemLayerContent={<UU5.Bricks.Alert id={"systemLayerID"}>systemLayerContent</UU5.Bricks.Alert>}
        appLayerContent={<UU5.Bricks.Alert id={"appLayerId"}>appLayerContent</UU5.Bricks.Alert>}
        leftWidth="!xs-2em-60px !s-3em-80px !m-4em-100px !l-3em-160px !xl-4em-180px"
        rightWidth="!xs-2em-60px !s-3em-80px !m-4em-100px !l-3em-160px !xl-4em-180px"
        modal={<UU5.Bricks.Modal id={"pageModalId"} content="Content"/>}
      >
        <UU5.Bricks.Div id={"contentID01"} className="padding">
          <UU5.Bricks.Header id={"contentID02"} level={1}>Content</UU5.Bricks.Header>
          <UU5.Bricks.Section id={"contentID03"} className="center"><UU5.Bricks.Paragraph
            id={"contentID04"}/></UU5.Bricks.Section>
        </UU5.Bricks.Div>
      </UU5.Bricks.Page>,
      {disableLifecycleMethods: false}
    );
    expect(wrapper.instance().getRight()).not.toBeNull();
    expect(wrapper.instance().getRight()).not.toBeUndefined()
    expect(wrapper.instance().getRight()).toEqual(expect.any(Object));
    expect(wrapper.instance().getRight()).toBeInstanceOf(Object);
    expect(() => wrapper.instance().getRight()).not.toThrow();
  });

  it('getLeftOpen() should return true', () => {
    const wrapper = mount(
      <UU5.Bricks.Page
        type="1"
        top={<UU5.Bricks.Box id={"idTop"} colorSchema="blue-rich" content="TOP" className="center"/>}
        bottom={<UU5.Bricks.Box id={"idBottom"} colorSchema="grey">Bottom Panel</UU5.Bricks.Box>}
        isLeftOpen={true}
        leftOpen={
          <UU5.Bricks.Section id={"l_open01"}>
            <UU5.Bricks.Box id={"l_open02"} colorSchema='primary' content='Left Menu'/>
            <br/>
            <UU5.Bricks.Column id={"l_open3"}>
              Lorem ipsum dolor sit amet, consectetuer adipiscing elit.
              Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos hymenaeos.
            </UU5.Bricks.Column>
          </UU5.Bricks.Section>
        }
        leftClosed={
          <UU5.Bricks.Section id={"l_close01"}>
          <UU5.Bricks.Box id={"l_close02"} colorSchema='primary' content='Left Menu'/>
          <br/>
          <UU5.Bricks.Column id={"l_close03"}>
          </UU5.Bricks.Column>
        </UU5.Bricks.Section>
        }
        rightOpen={
          <UU5.Bricks.Section id={"r_open01"}>
            <UU5.Bricks.Box id={"r_open02"} colorSchema='primary' content='Menu'/>
            <br/>
            <UU5.Bricks.Column id={"r_open03"}>
              <UU5.Bricks.ButtonGroup id={"r_open04"} vertical>
                <UU5.Bricks.Button id={"r_open05"} colorSchema="primary" ref_={(button) => this.MenuButton = button}>Home
                  <UU5.Bricks.Icon id={"r_open06"} icon="mdi-home"/>
                </UU5.Bricks.Button>
              </UU5.Bricks.ButtonGroup>
            </UU5.Bricks.Column>
          </UU5.Bricks.Section>
        }
        rightClosed={<UU5.Bricks.Section id={"r_closed01"}>
          <UU5.Bricks.Box id={"r_closed02"} colorSchema='primary' content=''/>
          <br/>
          <UU5.Bricks.Column id={"r_closed03"}>
            <UU5.Bricks.Button id={"r_closed04"} colorSchema="primary">
              <UU5.Bricks.Icon id={"r_closed05"} icon="mdi-home"/>
            </UU5.Bricks.Button>
          </UU5.Bricks.Column>
        </UU5.Bricks.Section>
        }
        systemLayerContent={<UU5.Bricks.Alert id={"systemLayerID"}>systemLayerContent</UU5.Bricks.Alert>}
        appLayerContent={<UU5.Bricks.Alert id={"appLayerId"}>appLayerContent</UU5.Bricks.Alert>}
        leftWidth="!xs-2em-60px !s-3em-80px !m-4em-100px !l-3em-160px !xl-4em-180px"
        rightWidth="!xs-2em-60px !s-3em-80px !m-4em-100px !l-3em-160px !xl-4em-180px"
        modal={<UU5.Bricks.Modal id={"pageModalId"} content="Content"/>}
      >
        <UU5.Bricks.Div id={"contentID01"} className="padding">
          <UU5.Bricks.Header id={"contentID02"} level={1}>Content</UU5.Bricks.Header>
          <UU5.Bricks.Section id={"contentID03"} className="center"><UU5.Bricks.Paragraph
            id={"contentID04"}/></UU5.Bricks.Section>
        </UU5.Bricks.Div>
      </UU5.Bricks.Page>,
      {disableLifecycleMethods: false}
    );
    expect(wrapper.instance().getLeftOpen()).toEqual(expect.any(Object));
    expect(wrapper.instance().getLeftOpen()).toBeInstanceOf(Object);
    expect(wrapper.instance().getLeftOpen()).toBe(wrapper.find({id: "l_open01"}).first().instance());
    expect(wrapper.instance().getLeftOpen()).not.toBeNull();
    expect(wrapper.instance().getLeftOpen()).not.toBeUndefined();
    expect(() => wrapper.instance().getLeftOpen()).not.toThrow();
  });


  it('getRightOpen() should return false', () => {
    const wrapper = mount(
      <UU5.Bricks.Page
        type="1"
        top={<UU5.Bricks.Box id={"idTop"} colorSchema="blue-rich" content="TOP" className="center"/>}
        bottom={<UU5.Bricks.Box id={"idBottom"} colorSchema="grey">Bottom Panel</UU5.Bricks.Box>}
        left={
          <UU5.Bricks.Section id={"left01"}>
            <UU5.Bricks.Box id={"left02"} colorSchema='primary' content='Left Menu'/>
            <br/>
            <UU5.Bricks.Column id={"left03"}>
              Lorem ipsum dolor sit amet, consectetuer adipiscing elit.
              Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos hymenaeos.
            </UU5.Bricks.Column>
          </UU5.Bricks.Section>
        }
        leftOpen={
          <UU5.Bricks.Section id={"left_open01"}>
            <UU5.Bricks.Box id={"left_open02"} colorSchema='primary' content='Left Menu'/>
            <br/>
            <UU5.Bricks.Column id={"left_open03"}>
              Lorem ipsum dolor sit amet, consectetuer adipiscing elit.
              Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos hymenaeos.
            </UU5.Bricks.Column>
          </UU5.Bricks.Section>}
        leftClosed={
          <UU5.Bricks.Section id={"left_closed01"}>
            <UU5.Bricks.Box id={"left02"} colorSchema='primary' content='Left Menu'/>
            <br/>
            <UU5.Bricks.Column id={"left_closed03"}>
              Lorem ipsum dolor sit amet, consectetuer adipiscing elit.
              Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos hymenaeos.
            </UU5.Bricks.Column>
          </UU5.Bricks.Section>}
        rightOpen={
          <UU5.Bricks.Section id={"r_open01"}>
            <UU5.Bricks.Box id={"r_open02"} colorSchema='primary' content='Menu'/>
            <br/>
            <UU5.Bricks.Column id={"r_open03"}>
              <UU5.Bricks.ButtonGroup id={"r_open04"} vertical>
                <UU5.Bricks.Button id={"r_open05"} colorSchema="primary" ref_={(button) => this.MenuButton = button}>Home
                  <UU5.Bricks.Icon id={"r_open06"} icon="mdi-home"/>
                </UU5.Bricks.Button>
              </UU5.Bricks.ButtonGroup>
            </UU5.Bricks.Column>
          </UU5.Bricks.Section>
        }
        rightClosed={<UU5.Bricks.Section id={"r_closed01"}>
          <UU5.Bricks.Box id={"r_closed02"} colorSchema='primary' content=''/>
          <br/>
          <UU5.Bricks.Column id={"r_closed03"}>
            <UU5.Bricks.Button id={"r_closed04"} colorSchema="primary">
              <UU5.Bricks.Icon id={"r_closed05"} icon="mdi-home"/>
            </UU5.Bricks.Button>
          </UU5.Bricks.Column>
        </UU5.Bricks.Section>
        }
        systemLayerContent={<UU5.Bricks.Alert id={"systemLayerID"}>systemLayerContent</UU5.Bricks.Alert>}
        appLayerContent={<UU5.Bricks.Alert id={"appLayerId"}>appLayerContent</UU5.Bricks.Alert>}
        leftWidth="!xs-2em-60px !s-3em-80px !m-4em-100px !l-3em-160px !xl-4em-180px"
        rightWidth="!xs-2em-60px !s-3em-80px !m-4em-100px !l-3em-160px !xl-4em-180px"
        modal={<UU5.Bricks.Modal id={"pageModalId"} content="Content"/>}
      >
        <UU5.Bricks.Div id={"contentID01"} className="padding">
          <UU5.Bricks.Header id={"contentID02"} level={1}>Content</UU5.Bricks.Header>
          <UU5.Bricks.Section id={"contentID03"} className="center"><UU5.Bricks.Paragraph
            id={"contentID04"}/></UU5.Bricks.Section>
        </UU5.Bricks.Div>
      </UU5.Bricks.Page>,
      {disableLifecycleMethods: false}
    );
    expect(wrapper.instance().getRightOpen()).toBeNull();
  });


  it('getLeftClosed() should return undefined', () => {
    const wrapper = mount(
      <UU5.Bricks.Page
        type="1"
        top={<UU5.Bricks.Box id={"idTop"} colorSchema="blue-rich" content="TOP" className="center"/>}
        bottom={<UU5.Bricks.Box id={"idBottom"} colorSchema="grey">Bottom Panel</UU5.Bricks.Box>}
        left={
          <UU5.Bricks.Section id={"left01"}>
            <UU5.Bricks.Box id={"left02"} colorSchema='primary' content='Left Menu'/>
            <br/>
            <UU5.Bricks.Column id={"left03"}>
              Lorem ipsum dolor sit amet, consectetuer adipiscing elit.
              Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos hymenaeos.
            </UU5.Bricks.Column>
          </UU5.Bricks.Section>
        }
        leftOpen={
          <UU5.Bricks.Section id={"left_open01"}>
            <UU5.Bricks.Box id={"left_open02"} colorSchema='primary' content='Left Menu'/>
            <br/>
            <UU5.Bricks.Column id={"left_open03"}>
              Lorem ipsum dolor sit amet, consectetuer adipiscing elit.
              Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos hymenaeos.
            </UU5.Bricks.Column>
          </UU5.Bricks.Section>}
        leftClosed={
          <UU5.Bricks.Section id={"left_closed01"}>
            <UU5.Bricks.Box id={"left02"} colorSchema='primary' content='Left Menu'/>
            <br/>
            <UU5.Bricks.Column id={"left_closed03"}>
              Lorem ipsum dolor sit amet, consectetuer adipiscing elit.
              Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos hymenaeos.
            </UU5.Bricks.Column>
          </UU5.Bricks.Section>}
        rightOpen={
          <UU5.Bricks.Section id={"r_open01"}>
            <UU5.Bricks.Box id={"r_open02"} colorSchema='primary' content='Menu'/>
            <br/>
            <UU5.Bricks.Column id={"r_open03"}>
              <UU5.Bricks.ButtonGroup id={"r_open04"} vertical>
                <UU5.Bricks.Button id={"r_open05"} colorSchema="primary" ref_={(button) => this.MenuButton = button}>Home
                  <UU5.Bricks.Icon id={"r_open06"} icon="mdi-home"/>
                </UU5.Bricks.Button>
              </UU5.Bricks.ButtonGroup>
            </UU5.Bricks.Column>
          </UU5.Bricks.Section>
        }
        rightClosed={<UU5.Bricks.Section id={"r_closed01"}>
          <UU5.Bricks.Box id={"r_closed02"} colorSchema='primary' content=''/>
          <br/>
          <UU5.Bricks.Column id={"r_closed03"}>
            <UU5.Bricks.Button id={"r_closed04"} colorSchema="primary">
              <UU5.Bricks.Icon id={"r_closed05"} icon="mdi-home"/>
            </UU5.Bricks.Button>
          </UU5.Bricks.Column>
        </UU5.Bricks.Section>
        }
        systemLayerContent={<UU5.Bricks.Alert id={"systemLayerID"}>systemLayerContent</UU5.Bricks.Alert>}
        appLayerContent={<UU5.Bricks.Alert id={"appLayerId"}>appLayerContent</UU5.Bricks.Alert>}
        leftWidth="!xs-2em-60px !s-3em-80px !m-4em-100px !l-3em-160px !xl-4em-180px"
        rightWidth="!xs-2em-60px !s-3em-80px !m-4em-100px !l-3em-160px !xl-4em-180px"
        modal={<UU5.Bricks.Modal id={"pageModalId"} content="Content"/>}
      >
        <UU5.Bricks.Div id={"contentID01"} className="padding">
          <UU5.Bricks.Header id={"contentID02"} level={1}>Content</UU5.Bricks.Header>
          <UU5.Bricks.Section id={"contentID03"} className="center"><UU5.Bricks.Paragraph
            id={"contentID04"}/></UU5.Bricks.Section>
        </UU5.Bricks.Div>
      </UU5.Bricks.Page>,
      {disableLifecycleMethods: false}
    );
    expect(wrapper.instance().getLeftClosed()).toEqual(expect.any(Object));
    expect(wrapper.instance().getLeftClosed()).toBeInstanceOf(Object);
    expect(wrapper.instance().getLeftClosed()).toBe(wrapper.find({id: 'left_closed01'}).first().instance())
  });

  it('getRightClosed() should return instance', () => {
    const wrapper = mount(
      <UU5.Bricks.Page
        type="1"
        top={<UU5.Bricks.Box id={"idTop"} colorSchema="blue-rich" content="TOP" className="center"/>}
        bottom={<UU5.Bricks.Box id={"idBottom"} colorSchema="grey">Bottom Panel</UU5.Bricks.Box>}
        left={
          <UU5.Bricks.Section id={"left01"}>
            <UU5.Bricks.Box id={"left02"} colorSchema='primary' content='Left Menu'/>
            <br/>
            <UU5.Bricks.Column id={"left03"}>
              Lorem ipsum dolor sit amet, consectetuer adipiscing elit.
              Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos hymenaeos.
            </UU5.Bricks.Column>
          </UU5.Bricks.Section>
        }
        rightOpen={
          <UU5.Bricks.Section id={"r_open01"}>
            <UU5.Bricks.Box id={"r_open02"} colorSchema='primary' content='Menu'/>
            <br/>
            <UU5.Bricks.Column id={"r_open03"}>
              <UU5.Bricks.ButtonGroup id={"r_open04"} vertical>
                <UU5.Bricks.Button id={"r_open05"} colorSchema="primary" ref_={(button) => this.MenuButton = button}>Home
                  <UU5.Bricks.Icon id={"r_open06"} icon="mdi-home"/>
                </UU5.Bricks.Button>
              </UU5.Bricks.ButtonGroup>
            </UU5.Bricks.Column>
          </UU5.Bricks.Section>
        }
        rightClosed={<UU5.Bricks.Section id={"r_closed01"}>
          <UU5.Bricks.Box id={"r_closed02"} colorSchema='primary' content=''/>
          <br/>
          <UU5.Bricks.Column id={"r_closed03"}>
            <UU5.Bricks.Button id={"r_closed04"} colorSchema="primary">
              <UU5.Bricks.Icon id={"r_closed05"} icon="mdi-home"/>
            </UU5.Bricks.Button>
          </UU5.Bricks.Column>
        </UU5.Bricks.Section>
        }
        systemLayerContent={<UU5.Bricks.Alert id={"systemLayerID"}>systemLayerContent</UU5.Bricks.Alert>}
        appLayerContent={<UU5.Bricks.Alert id={"appLayerId"}>appLayerContent</UU5.Bricks.Alert>}
        leftWidth="!xs-2em-60px !s-3em-80px !m-4em-100px !l-3em-160px !xl-4em-180px"
        rightWidth="!xs-2em-60px !s-3em-80px !m-4em-100px !l-3em-160px !xl-4em-180px"
        modal={<UU5.Bricks.Modal id={"pageModalId"} content="Content"/>}
      >
        <UU5.Bricks.Div id={"contentID01"} className="padding">
          <UU5.Bricks.Header id={"contentID02"} level={1}>Content</UU5.Bricks.Header>
          <UU5.Bricks.Section id={"contentID03"} className="center"><UU5.Bricks.Paragraph
            id={"contentID04"}/></UU5.Bricks.Section>
        </UU5.Bricks.Div>
      </UU5.Bricks.Page>,
      {disableLifecycleMethods: false}
    );
    expect(wrapper.instance().getRightClosed()).toEqual(expect.any(Object));
    expect(wrapper.instance().getRightClosed()).toBeInstanceOf(Object);
    expect(wrapper.instance().getRightClosed()).toBe(wrapper.find({id: 'r_closed01'}).first().instance());
  });

  it('getTop()', () => {
    const wrapper = mount(
      <UU5.Bricks.Page
        type="1"
        top={<UU5.Bricks.Box id={"idTop"} colorSchema="blue-rich" content="TOP" className="getTop" name={"getTop"}/>}
        bottom={<UU5.Bricks.Box className="getBottom" name={"getBottom"} id={"idBottom"} colorSchema="grey">Bottom
          Panel</UU5.Bricks.Box>}
        left={
          <UU5.Bricks.Section id={"left01"}>
            <UU5.Bricks.Box id={"left02"} colorSchema='primary' content='Left Menu'/>
            <br/>
            <UU5.Bricks.Column id={"left03"}>
              Lorem ipsum dolor sit amet, consectetuer adipiscing elit.
              Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos hymenaeos.
            </UU5.Bricks.Column>
          </UU5.Bricks.Section>
        }
        rightOpen={
          <UU5.Bricks.Section id={"r_open01"}>
            <UU5.Bricks.Box id={"r_open02"} colorSchema='primary' content='Menu'/>
            <br/>
            <UU5.Bricks.Column id={"r_open03"}>
              <UU5.Bricks.ButtonGroup id={"r_open04"} vertical>
                <UU5.Bricks.Button id={"r_open05"} colorSchema="primary" ref_={(button) => this.MenuButton = button}>Home
                  <UU5.Bricks.Icon id={"r_open06"} icon="mdi-home"/>
                </UU5.Bricks.Button>
              </UU5.Bricks.ButtonGroup>
            </UU5.Bricks.Column>
          </UU5.Bricks.Section>
        }
        rightClosed={<UU5.Bricks.Section id={"r_closed01"}>
          <UU5.Bricks.Box id={"r_closed02"} colorSchema='primary' content=''/>
          <br/>
          <UU5.Bricks.Column id={"r_closed03"}>
            <UU5.Bricks.Button id={"r_closed04"} colorSchema="primary">
              <UU5.Bricks.Icon id={"r_closed05"} icon="mdi-home"/>
            </UU5.Bricks.Button>
          </UU5.Bricks.Column>
        </UU5.Bricks.Section>
        }
        systemLayerContent={<UU5.Bricks.Alert id={"systemLayerID"}>systemLayerContent</UU5.Bricks.Alert>}
        appLayerContent={<UU5.Bricks.Alert id={"appLayerId"}>appLayerContent</UU5.Bricks.Alert>}
        leftWidth="!xs-2em-60px !s-3em-80px !m-4em-100px !l-3em-160px !xl-4em-180px"
        rightWidth="!xs-2em-60px !s-3em-80px !m-4em-100px !l-3em-160px !xl-4em-180px"
        modal={<UU5.Bricks.Modal id={"pageModalId"} content="Content"/>}
      >
        <UU5.Bricks.Div id={"contentID01"} className="padding">
          <UU5.Bricks.Header id={"contentID02"} level={1}>Content</UU5.Bricks.Header>
          <UU5.Bricks.Section id={"contentID03"} className="center"><UU5.Bricks.Paragraph
            id={"contentID04"}/></UU5.Bricks.Section>
        </UU5.Bricks.Div>
      </UU5.Bricks.Page>,
      {disableLifecycleMethods: false}
    );
    expect(wrapper.instance().getTop()).toBe(wrapper.find({className: 'getTop'}).instance());
    expect(wrapper.instance().getTop()).toEqual(expect.any(Object));
    expect(wrapper.instance().getTop()).toBeInstanceOf(Object);
  });

  it('getBottom()', () => {
    const wrapper = mount(
      <UU5.Bricks.Page
        type="1"
        top={<UU5.Bricks.Box id={"idTop"} colorSchema="blue-rich" content="TOP" className="getTop" name={"getTop"}/>}
        bottom={<UU5.Bricks.Box className="getBottom" name={"getBottom"} id={"idBottom"} colorSchema="grey">Bottom
          Panel</UU5.Bricks.Box>}
        left={
          <UU5.Bricks.Section id={"left01"}>
            <UU5.Bricks.Box id={"left02"} colorSchema='primary' content='Left Menu'/>
            <br/>
            <UU5.Bricks.Column id={"left03"}>
              Lorem ipsum dolor sit amet, consectetuer adipiscing elit.
              Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos hymenaeos.
            </UU5.Bricks.Column>
          </UU5.Bricks.Section>
        }
        rightOpen={
          <UU5.Bricks.Section id={"r_open01"}>
            <UU5.Bricks.Box id={"r_open02"} colorSchema='primary' content='Menu'/>
            <br/>
            <UU5.Bricks.Column id={"r_open03"}>
              <UU5.Bricks.ButtonGroup id={"r_open04"} vertical>
                <UU5.Bricks.Button id={"r_open05"} colorSchema="primary" ref_={(button) => this.MenuButton = button}>Home
                  <UU5.Bricks.Icon id={"r_open06"} icon="mdi-home"/>
                </UU5.Bricks.Button>
              </UU5.Bricks.ButtonGroup>
            </UU5.Bricks.Column>
          </UU5.Bricks.Section>
        }
        rightClosed={<UU5.Bricks.Section id={"r_closed01"}>
          <UU5.Bricks.Box id={"r_closed02"} colorSchema='primary' content=''/>
          <br/>
          <UU5.Bricks.Column id={"r_closed03"}>
            <UU5.Bricks.Button id={"r_closed04"} colorSchema="primary">
              <UU5.Bricks.Icon id={"r_closed05"} icon="mdi-home"/>
            </UU5.Bricks.Button>
          </UU5.Bricks.Column>
        </UU5.Bricks.Section>
        }
        systemLayerContent={<UU5.Bricks.Alert id={"systemLayerID"}>systemLayerContent</UU5.Bricks.Alert>}
        appLayerContent={<UU5.Bricks.Alert id={"appLayerId"}>appLayerContent</UU5.Bricks.Alert>}
        leftWidth="!xs-2em-60px !s-3em-80px !m-4em-100px !l-3em-160px !xl-4em-180px"
        rightWidth="!xs-2em-60px !s-3em-80px !m-4em-100px !l-3em-160px !xl-4em-180px"
        modal={<UU5.Bricks.Modal id={"pageModalId"} content="Content"/>}
      >
        <UU5.Bricks.Div id={"contentID01"} className="padding">
          <UU5.Bricks.Header id={"contentID02"} level={1}>Content</UU5.Bricks.Header>
          <UU5.Bricks.Section id={"contentID03"} className="center"><UU5.Bricks.Paragraph
            id={"contentID04"}/></UU5.Bricks.Section>
        </UU5.Bricks.Div>
      </UU5.Bricks.Page>,
      {disableLifecycleMethods: false}
    );
    expect(wrapper.instance().getBottom()).toBe(wrapper.find({className: 'getBottom'}).instance());
    expect(wrapper.instance().getBottom()).toEqual(expect.any(Object));
    expect(wrapper.instance().getBottom()).toBeInstanceOf(Object);
  });
  

  it('openLeft(setStateCallBack)', () => {
    const wrapper = mount(
      <UU5.Bricks.Page
        type="1"
        left={
          <UU5.Bricks.Section id={"l_open1"}>
            <UU5.Bricks.Box id={"l_open2"} colorSchema='primary' content='Menu'/>
            <br/>
            <UU5.Bricks.Column id={"l_open3"}>
              <UU5.Bricks.ButtonGroup id={"l_open4"} vertical>
                <UU5.Bricks.Button id={"l_open5"} colorSchema="primary">Home
                  <UU5.Bricks.Icon id={"l_open6"} icon="mdi-home"/>
                </UU5.Bricks.Button>
              </UU5.Bricks.ButtonGroup>
            </UU5.Bricks.Column>
          </UU5.Bricks.Section>
        }
        leftWidth="!xs-2em-60px !s-3em-80px !m-4em-100px !l-3em-160px !xl-4em-180px"
      >
        <UU5.Bricks.Div id={"contentID01"} className="padding">
          <UU5.Bricks.Header id={"contentID02"} level={1}>Content</UU5.Bricks.Header>
          <UU5.Bricks.Section id={"contentID03"} className="center"><UU5.Bricks.Paragraph
            id={"contentID04"}/></UU5.Bricks.Section>
        </UU5.Bricks.Div>
      </UU5.Bricks.Page>,
      {disableLifecycleMethods: false}
    );
    const mockFunc = jest.fn();
    expect(wrapper.instance().isLeftOpen()).toBeFalsy();
    const returnValue = wrapper.instance().openLeft(mockFunc);
    wrapper.update();
    expect(mockFunc).toBeCalled();
    expect(mockFunc).toHaveBeenCalledTimes(1);
    expect(returnValue).toBe(wrapper.instance());
    expect(wrapper.instance().isLeftOpen()).toBeTruthy();
  });

  it('openRight(setStateCallBack)', () => {
    const wrapper = mount(
      <UU5.Bricks.Page
        type="1"
        right={
          <UU5.Bricks.Section id={"r_open01"}>
            <UU5.Bricks.Box id={"r_open02"} colorSchema='primary' content='Menu'/>
            <br/>
            <UU5.Bricks.Column id={"r_open03"}>
              <UU5.Bricks.ButtonGroup id={"r_open04"} vertical>
                <UU5.Bricks.Button id={"r_open05"} colorSchema="primary">Home
                  <UU5.Bricks.Icon id={"r_open06"} icon="mdi-home"/>
                </UU5.Bricks.Button>
              </UU5.Bricks.ButtonGroup>
            </UU5.Bricks.Column>
          </UU5.Bricks.Section>
        }
        rightWidth="!xs-2em-60px !s-3em-80px !m-4em-100px !l-3em-160px !xl-4em-180px"
      >
        <UU5.Bricks.Div id={"contentID01"} className="padding">
          <UU5.Bricks.Header id={"contentID02"} level={1}>Content</UU5.Bricks.Header>
          <UU5.Bricks.Section id={"contentID03"} className="center"><UU5.Bricks.Paragraph
            id={"contentID04"}/></UU5.Bricks.Section>
        </UU5.Bricks.Div>
      </UU5.Bricks.Page>,
      {disableLifecycleMethods: false}
    );
    const mockFunc = jest.fn();
    expect(wrapper.instance().isRightOpen()).toBeFalsy();
    const returnValue = wrapper.instance().openRight(mockFunc);
    wrapper.update();
    expect(mockFunc).toBeCalled();
    expect(mockFunc).toHaveBeenCalledTimes(1);
    expect(returnValue).toBe(wrapper.instance());
    expect(wrapper.instance().isRightOpen()).toBeTruthy();
  });

  it('closeLeft(setStateCallBack)', () => {
    const wrapper = mount(
      <UU5.Bricks.Page
        type="1"
        isLeftOpen
        left={
          <UU5.Bricks.Section id={"l_open1"}>
            <UU5.Bricks.Box id={"l_open2"} colorSchema='primary' content='Menu'/>
            <br/>
            <UU5.Bricks.Column id={"l_open3"}>
              <UU5.Bricks.ButtonGroup id={"l_open4"} vertical>
                <UU5.Bricks.Button id={"l_open5"} colorSchema="primary">Home
                  <UU5.Bricks.Icon id={"l_open6"} icon="mdi-home"/>
                </UU5.Bricks.Button>
              </UU5.Bricks.ButtonGroup>
            </UU5.Bricks.Column>
          </UU5.Bricks.Section>
        }
        leftWidth="!xs-2em-60px !s-3em-80px !m-4em-100px !l-3em-160px !xl-4em-180px"
      >
        <UU5.Bricks.Div id={"contentID01"} className="padding">
          <UU5.Bricks.Header id={"contentID02"} level={1}>Content</UU5.Bricks.Header>
          <UU5.Bricks.Section id={"contentID03"} className="center"><UU5.Bricks.Paragraph
            id={"contentID04"}/></UU5.Bricks.Section>
        </UU5.Bricks.Div>
      </UU5.Bricks.Page>,
      {disableLifecycleMethods: false}
    );
    const mockFunc = jest.fn();
    expect(wrapper.instance().isLeftOpen()).toBeTruthy();
    const returnValue = wrapper.instance().closeLeft(mockFunc);
    wrapper.update();
    expect(mockFunc).toBeCalled();
    expect(mockFunc).toHaveBeenCalledTimes(1);
    expect(returnValue).toBe(wrapper.instance());
    expect(wrapper.instance().isLeftOpen()).toBeFalsy();
  });

  it('closeRight(setStateCallBack)', () => {
    const wrapper = mount(
      <UU5.Bricks.Page
        type="1"
        isRightOpen
        right={
          <UU5.Bricks.Section id={"r_open01"}>
            <UU5.Bricks.Box id={"r_open02"} colorSchema='primary' content='Menu'/>
            <br/>
            <UU5.Bricks.Column id={"r_open03"}>
              <UU5.Bricks.ButtonGroup id={"r_open04"} vertical>
                <UU5.Bricks.Button id={"r_open05"} colorSchema="primary">Home
                  <UU5.Bricks.Icon id={"r_open06"} icon="mdi-home"/>
                </UU5.Bricks.Button>
              </UU5.Bricks.ButtonGroup>
            </UU5.Bricks.Column>
          </UU5.Bricks.Section>
        }
        rightWidth="!xs-2em-60px !s-3em-80px !m-4em-100px !l-3em-160px !xl-4em-180px"
      >
        <UU5.Bricks.Div id={"contentID01"} className="padding">
          <UU5.Bricks.Header id={"contentID02"} level={1}>Content</UU5.Bricks.Header>
          <UU5.Bricks.Section id={"contentID03"} className="center"><UU5.Bricks.Paragraph
            id={"contentID04"}/></UU5.Bricks.Section>
        </UU5.Bricks.Div>
      </UU5.Bricks.Page>,
      {disableLifecycleMethods: false}
    );
    const mockFunc = jest.fn();
    expect(wrapper.instance().isRightOpen()).toBeTruthy();
    const returnValue = wrapper.instance().closeRight(mockFunc);
    wrapper.update();
    expect(mockFunc).toBeCalled();
    expect(mockFunc).toHaveBeenCalledTimes(1);
    expect(returnValue).toBe(wrapper.instance());
    expect(wrapper.instance().isRightOpen()).toBeFalsy();
  });

  it('toggleLeft(setStateCallBack)', () => {
    const wrapper = mount(
      <UU5.Bricks.Page
        type="1"
        top={<UU5.Bricks.Box id={"idTop"} colorSchema="blue-rich" content="TOP" className="getTop" name={"getTop"}/>}
        bottom={<UU5.Bricks.Box className="getBottom" name={"getBottom"} id={"idBottom"} colorSchema="grey">Bottom
          Panel</UU5.Bricks.Box>}
        leftOpen={
          <UU5.Bricks.Section id={"r_open01"}>
            <UU5.Bricks.Box id={"r_open02"} colorSchema='primary' content='Menu'/>
            <br/>
            <UU5.Bricks.Column id={"r_open03"}>
              <UU5.Bricks.ButtonGroup id={"r_open04"} vertical>
                <UU5.Bricks.Button id={"r_open05"} colorSchema="primary">Home
                  <UU5.Bricks.Icon id={"r_open06"} icon="mdi-home"/>
                </UU5.Bricks.Button>
              </UU5.Bricks.ButtonGroup>
            </UU5.Bricks.Column>
          </UU5.Bricks.Section>
        }
        leftClosed={<UU5.Bricks.Section id={"r_closed01"}>
          <UU5.Bricks.Box id={"r_closed02"} colorSchema='primary' content=''/>
          <br/>
          <UU5.Bricks.Column id={"r_closed03"}>
            <UU5.Bricks.Button id={"r_closed04"} colorSchema="primary">
              <UU5.Bricks.Icon id={"r_closed05"} icon="mdi-home"/>
            </UU5.Bricks.Button>
          </UU5.Bricks.Column>
        </UU5.Bricks.Section>
        }
        systemLayerContent={<UU5.Bricks.Alert id={"systemLayerID"}>systemLayerContent</UU5.Bricks.Alert>}
        appLayerContent={<UU5.Bricks.Alert id={"appLayerId"}>appLayerContent</UU5.Bricks.Alert>}
        leftWidth="!xs-2em-60px !s-3em-80px !m-4em-100px !l-3em-160px !xl-4em-180px"
        modal={<UU5.Bricks.Modal id={"pageModalId"} content="Content"/>}
      >
        <UU5.Bricks.Div id={"contentID01"} className="padding">
          <UU5.Bricks.Header id={"contentID02"} level={1}>Content</UU5.Bricks.Header>
          <UU5.Bricks.Section id={"contentID03"} className="center"><UU5.Bricks.Paragraph
            id={"contentID04"}/></UU5.Bricks.Section>
        </UU5.Bricks.Div>
      </UU5.Bricks.Page>,
      {disableLifecycleMethods: false}
    );
    const mockFunc = jest.fn();
    expect(wrapper.instance().getLeftOpen()).toBe(null);
    expect(wrapper.instance().getLeftClosed()).not.toBe(undefined);
    expect(wrapper.instance().getLeftClosed()).toEqual(expect.any(Object));
    const returnValue = wrapper.instance().toggleLeft(mockFunc);
    wrapper.update();
    expect(mockFunc).toBeCalled();
    expect(mockFunc).toHaveBeenCalledTimes(1);
    expect(returnValue).toBe(wrapper.instance());
    expect(wrapper.instance().getLeftOpen()).toEqual(expect.any(Object));
    expect(wrapper.instance().getLeftClosed()).toEqual(expect.any(Object));
  });

  it('toggleRight(setStateCallBack)', () => {
    const wrapper = mount(
      <UU5.Bricks.Page
        type="1"
        top={<UU5.Bricks.Box id={"idTop"} colorSchema="blue-rich" content="TOP" className="getTop" name={"getTop"}/>}
        bottom={<UU5.Bricks.Box className="getBottom" name={"getBottom"} id={"idBottom"} colorSchema="grey">Bottom
          Panel</UU5.Bricks.Box>}
        left={
          <UU5.Bricks.Section id={"left01"}>
            <UU5.Bricks.Box id={"left02"} colorSchema='primary' content='Left Menu'/>
            <br/>
            <UU5.Bricks.Column id={"left03"}>
              Lorem ipsum dolor sit amet, consectetuer adipiscing elit.
              Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos hymenaeos.
            </UU5.Bricks.Column>
          </UU5.Bricks.Section>
        }
        rightOpen={
          <UU5.Bricks.Section id={"r_open01"}>
            <UU5.Bricks.Box id={"r_open02"} colorSchema='primary' content='Menu'/>
            <br/>
            <UU5.Bricks.Column id={"r_open03"}>
              <UU5.Bricks.ButtonGroup id={"r_open04"} vertical>
                <UU5.Bricks.Button id={"r_open05"} colorSchema="primary">Home
                  <UU5.Bricks.Icon id={"r_open06"} icon="mdi-home"/>
                </UU5.Bricks.Button>
              </UU5.Bricks.ButtonGroup>
            </UU5.Bricks.Column>
          </UU5.Bricks.Section>
        }
        rightClosed={<UU5.Bricks.Section id={"r_closed01"}>
          <UU5.Bricks.Box id={"r_closed02"} colorSchema='primary' content=''/>
          <br/>
          <UU5.Bricks.Column id={"r_closed03"}>
            <UU5.Bricks.Button id={"r_closed04"} colorSchema="primary">
              <UU5.Bricks.Icon id={"r_closed05"} icon="mdi-home"/>
            </UU5.Bricks.Button>
          </UU5.Bricks.Column>
        </UU5.Bricks.Section>
        }
        systemLayerContent={<UU5.Bricks.Alert id={"systemLayerID"}>systemLayerContent</UU5.Bricks.Alert>}
        appLayerContent={<UU5.Bricks.Alert id={"appLayerId"}>appLayerContent</UU5.Bricks.Alert>}
        leftWidth="!xs-2em-60px !s-3em-80px !m-4em-100px !l-3em-160px !xl-4em-180px"
        rightWidth="!xs-2em-60px !s-3em-80px !m-4em-100px !l-3em-160px !xl-4em-180px"
        modal={<UU5.Bricks.Modal id={"pageModalId"} content="Content"/>}
      >
        <UU5.Bricks.Div id={"contentID01"} className="padding">
          <UU5.Bricks.Header id={"contentID02"} level={1}>Content</UU5.Bricks.Header>
          <UU5.Bricks.Section id={"contentID03"} className="center"><UU5.Bricks.Paragraph
            id={"contentID04"}/></UU5.Bricks.Section>
        </UU5.Bricks.Div>
      </UU5.Bricks.Page>,
      {disableLifecycleMethods: false}
    );
    const mockFunc = jest.fn();
    expect(wrapper.instance().getRightOpen()).toBe(null);
    expect(wrapper.instance().getRightClosed()).toEqual(expect.any(Object));
    expect(wrapper.instance().getRightClosed()).not.toBe(undefined);
    const returnValue = wrapper.instance().toggleRight(mockFunc);
    wrapper.update();
    expect(mockFunc).toBeCalled();
    expect(mockFunc).toHaveBeenCalledTimes(1);
    expect(returnValue).toBe(wrapper.instance());
    expect(wrapper.instance().getRightOpen()).not.toBe(undefined);
    expect(wrapper.instance().getRightOpen()).toEqual(expect.any(Object));
    expect(wrapper.instance().getLeftClosed()).not.toBe(undefined);
    expect(wrapper.instance().getLeftClosed()).toEqual(expect.any(Object));
    wrapper.instance().toggleRight(mockFunc);
    wrapper.update();
    expect(mockFunc).toBeCalled();
    expect(mockFunc).toHaveBeenCalledTimes(2);
  });

  it('getAppLayer()', () => {
    const wrapper = mount(
      <UU5.Bricks.Page
        type="1"
        top={<UU5.Bricks.Box id={"idTop"} colorSchema="blue-rich" content="TOP" className="getTop" name={"getTop"}/>}
        bottom={<UU5.Bricks.Box className="getBottom" name={"getBottom"} id={"idBottom"} colorSchema="grey">Bottom
          Panel</UU5.Bricks.Box>}
        left={
          <UU5.Bricks.Section id={"left01"}>
            <UU5.Bricks.Box id={"left02"} colorSchema='primary' content='Left Menu'/>
            <br/>
            <UU5.Bricks.Column id={"left03"}>
              Lorem ipsum dolor sit amet, consectetuer adipiscing elit.
              Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos hymenaeos.
            </UU5.Bricks.Column>
          </UU5.Bricks.Section>
        }
        rightOpen={
          <UU5.Bricks.Section id={"r_open01"}>
            <UU5.Bricks.Box id={"r_open02"} colorSchema='primary' content='Menu'/>
            <br/>
            <UU5.Bricks.Column id={"r_open03"}>
              <UU5.Bricks.ButtonGroup id={"r_open04"} vertical>
                <UU5.Bricks.Button id={"r_open05"} colorSchema="primary" ref_={(button) => this.MenuButton = button}>Home
                  <UU5.Bricks.Icon id={"r_open06"} icon="mdi-home"/>
                </UU5.Bricks.Button>
              </UU5.Bricks.ButtonGroup>
            </UU5.Bricks.Column>
          </UU5.Bricks.Section>
        }
        rightClosed={<UU5.Bricks.Section id={"r_closed01"}>
          <UU5.Bricks.Box id={"r_closed02"} colorSchema='primary' content=''/>
          <br/>
          <UU5.Bricks.Column id={"r_closed03"}>
            <UU5.Bricks.Button id={"r_closed04"} colorSchema="primary">
              <UU5.Bricks.Icon id={"r_closed05"} icon="mdi-home"/>
            </UU5.Bricks.Button>
          </UU5.Bricks.Column>
        </UU5.Bricks.Section>
        }
        appLayerWrapperProps={{id: 'appLayerId', name: 'appLayerName', className: 'appLayerClassName'}}
        systemLayerContent={<UU5.Bricks.Alert id={"systemLayerID"}>systemLayerContent</UU5.Bricks.Alert>}
        appLayerContent={<UU5.Bricks.Alert id={"appLayerId"}>appLayerContent</UU5.Bricks.Alert>}
        leftWidth="!xs-2em-60px !s-3em-80px !m-4em-100px !l-3em-160px !xl-4em-180px"
        rightWidth="!xs-2em-60px !s-3em-80px !m-4em-100px !l-3em-160px !xl-4em-180px"
        modal={<UU5.Bricks.Modal id={"pageModalId"} content="Content"/>}
      >
        <UU5.Bricks.Div id={"contentID01"} className="padding">
          <UU5.Bricks.Header id={"contentID02"} level={1}>Content</UU5.Bricks.Header>
          <UU5.Bricks.Section id={"contentID03"} className="center"><UU5.Bricks.Paragraph
            id={"contentID04"}/></UU5.Bricks.Section>
        </UU5.Bricks.Div>
      </UU5.Bricks.Page>,
      {disableLifecycleMethods: false}
    );
    expect(wrapper.instance().getAppLayer()).toEqual(expect.any(Object));
    expect(() => wrapper.instance().getAppLayer()).not.toThrow();
    expect(wrapper.instance().getAppLayer()).not.toBeNull();
    expect(wrapper.instance().getAppLayer()).not.toBeUndefined();
  });

  it('getSystemLayer()', () => {
    const wrapper = mount(
      <UU5.Bricks.Page
        type="1"
        top={<UU5.Bricks.Box id={"idTop"} colorSchema="blue-rich" content="TOP" className="getTop" name={"getTop"}/>}
        bottom={<UU5.Bricks.Box className="getBottom" name={"getBottom"} id={"idBottom"} colorSchema="grey">Bottom
          Panel</UU5.Bricks.Box>}
        left={
          <UU5.Bricks.Section id={"left01"}>
            <UU5.Bricks.Box id={"left02"} colorSchema='primary' content='Left Menu'/>
            <br/>
            <UU5.Bricks.Column id={"left03"}>
              Lorem ipsum dolor sit amet, consectetuer adipiscing elit.
              Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos hymenaeos.
            </UU5.Bricks.Column>
          </UU5.Bricks.Section>
        }
        rightOpen={
          <UU5.Bricks.Section id={"r_open01"}>
            <UU5.Bricks.Box id={"r_open02"} colorSchema='primary' content='Menu'/>
            <br/>
            <UU5.Bricks.Column id={"r_open03"}>
              <UU5.Bricks.ButtonGroup id={"r_open04"} vertical>
                <UU5.Bricks.Button id={"r_open05"} colorSchema="primary" ref_={(button) => this.MenuButton = button}>Home
                  <UU5.Bricks.Icon id={"r_open06"} icon="mdi-home"/>
                </UU5.Bricks.Button>
              </UU5.Bricks.ButtonGroup>
            </UU5.Bricks.Column>
          </UU5.Bricks.Section>
        }
        rightClosed={<UU5.Bricks.Section id={"r_closed01"}>
          <UU5.Bricks.Box id={"r_closed02"} colorSchema='primary' content=''/>
          <br/>
          <UU5.Bricks.Column id={"r_closed03"}>
            <UU5.Bricks.Button id={"r_closed04"} colorSchema="primary">
              <UU5.Bricks.Icon id={"r_closed05"} icon="mdi-home"/>
            </UU5.Bricks.Button>
          </UU5.Bricks.Column>
        </UU5.Bricks.Section>
        }
        appLayerWrapperProps={{id: 'appLayerId', name: 'appLayerName', className: 'appLayerClassName'}}
        systemLayerContent={<UU5.Bricks.Alert id={"systemLayerID"}>systemLayerContent</UU5.Bricks.Alert>}
        appLayerContent={<UU5.Bricks.Alert id={"appLayerId"}>appLayerContent</UU5.Bricks.Alert>}
        leftWidth="!xs-2em-60px !s-3em-80px !m-4em-100px !l-3em-160px !xl-4em-180px"
        rightWidth="!xs-2em-60px !s-3em-80px !m-4em-100px !l-3em-160px !xl-4em-180px"
        modal={<UU5.Bricks.Modal id={"pageModalId"} content="Content"/>}
      >
        <UU5.Bricks.Div id={"contentID01"} className="padding">
          <UU5.Bricks.Header id={"contentID02"} level={1}>Content</UU5.Bricks.Header>
          <UU5.Bricks.Section id={"contentID03"} className="center"><UU5.Bricks.Paragraph
            id={"contentID04"}/></UU5.Bricks.Section>
        </UU5.Bricks.Div>
      </UU5.Bricks.Page>,
      {disableLifecycleMethods: false}
    );
    expect(wrapper.instance().getSystemLayer()).toEqual(expect.any(Object));
    expect(() => wrapper.instance().getSystemLayer()).not.toThrow();
    expect(wrapper.instance().getSystemLayer()).not.toBeNull();
    expect(wrapper.instance().getSystemLayer()).not.toBeUndefined();
  });

  it('getAlertBus()', () => {
    const wrapper = mount(
      <UU5.Bricks.Page
        type="1"
        top={<UU5.Bricks.Box id={"idTop"} colorSchema="blue-rich" content="TOP" className="getTop" name={"getTop"}/>}
        bottom={<UU5.Bricks.Box className="getBottom" name={"getBottom"} id={"idBottom"} colorSchema="grey">Bottom
          Panel</UU5.Bricks.Box>}
        left={
          <UU5.Bricks.Section id={"left01"}>
            <UU5.Bricks.Box id={"left02"} colorSchema='primary' content='Left Menu'/>
            <br/>
            <UU5.Bricks.Column id={"left03"}>
              Lorem ipsum dolor sit amet, consectetuer adipiscing elit.
              Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos hymenaeos.
            </UU5.Bricks.Column>
          </UU5.Bricks.Section>
        }
        rightOpen={
          <UU5.Bricks.Section id={"r_open01"}>
            <UU5.Bricks.Box id={"r_open02"} colorSchema='primary' content='Menu'/>
            <br/>
            <UU5.Bricks.Column id={"r_open03"}>
              <UU5.Bricks.ButtonGroup id={"r_open04"} vertical>
                <UU5.Bricks.Button id={"r_open05"} colorSchema="primary" ref_={(button) => this.MenuButton = button}>Home
                  <UU5.Bricks.Icon id={"r_open06"} icon="mdi-home"/>
                </UU5.Bricks.Button>
              </UU5.Bricks.ButtonGroup>
            </UU5.Bricks.Column>
          </UU5.Bricks.Section>
        }
        rightClosed={<UU5.Bricks.Section id={"r_closed01"}>
          <UU5.Bricks.Box id={"r_closed02"} colorSchema='primary' content=''/>
          <br/>
          <UU5.Bricks.Column id={"r_closed03"}>
            <UU5.Bricks.Button id={"r_closed04"} colorSchema="primary">
              <UU5.Bricks.Icon id={"r_closed05"} icon="mdi-home"/>
            </UU5.Bricks.Button>
          </UU5.Bricks.Column>
        </UU5.Bricks.Section>
        }
        appLayerWrapperProps={{id: 'appLayerId', name: 'appLayerName', className: 'appLayerClassName'}}
        systemLayerContent={<UU5.Bricks.Alert id={"systemLayerID"}>systemLayerContent</UU5.Bricks.Alert>}
        appLayerContent={<UU5.Bricks.Alert id={"appLayerId"}>appLayerContent</UU5.Bricks.Alert>}
        leftWidth="!xs-2em-60px !s-3em-80px !m-4em-100px !l-3em-160px !xl-4em-180px"
        rightWidth="!xs-2em-60px !s-3em-80px !m-4em-100px !l-3em-160px !xl-4em-180px"
        modal={<UU5.Bricks.Modal id={"pageModalId"} content="Content"/>}
        alertBus={<UU5.Bricks.AlertBus id={"myAlertBus"} className="myAlertBusClassName" name={"myAlertbus"}/>}
      >
        <UU5.Bricks.Div id={"contentID01"} className="padding">
          <UU5.Bricks.Header id={"contentID02"} level={1}>Content</UU5.Bricks.Header>
          <UU5.Bricks.Section id={"contentID03"} className="center"><UU5.Bricks.Paragraph
            id={"contentID04"}/></UU5.Bricks.Section>
        </UU5.Bricks.Div>
      </UU5.Bricks.Page>,
      {disableLifecycleMethods: false}
    );
    expect(wrapper.instance().getAlertBus()).toBe(wrapper.find({id: 'myAlertBus'}).instance());
    expect(wrapper.instance().getAlertBus()).toEqual(expect.any(Object))
  });

  it('getModal()', () => {
    const wrapper = mount(
      <UU5.Bricks.Page
        type="1"
        top={<UU5.Bricks.Box id={"idTop"} colorSchema="blue-rich" content="TOP" className="getTop" name={"getTop"}/>}
        bottom={<UU5.Bricks.Box className="getBottom" name={"getBottom"} id={"idBottom"} colorSchema="grey">Bottom
          Panel</UU5.Bricks.Box>}
        left={
          <UU5.Bricks.Section id={"left01"}>
            <UU5.Bricks.Box id={"left02"} colorSchema='primary' content='Left Menu'/>
            <br/>
            <UU5.Bricks.Column id={"left03"}>
              Lorem ipsum dolor sit amet, consectetuer adipiscing elit.
              Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos hymenaeos.
            </UU5.Bricks.Column>
          </UU5.Bricks.Section>
        }
        rightOpen={
          <UU5.Bricks.Section id={"r_open01"}>
            <UU5.Bricks.Box id={"r_open02"} colorSchema='primary' content='Menu'/>
            <br/>
            <UU5.Bricks.Column id={"r_open03"}>
              <UU5.Bricks.ButtonGroup id={"r_open04"} vertical>
                <UU5.Bricks.Button id={"r_open05"} colorSchema="primary" ref_={(button) => this.MenuButton = button}>Home
                  <UU5.Bricks.Icon id={"r_open06"} icon="mdi-home"/>
                </UU5.Bricks.Button>
              </UU5.Bricks.ButtonGroup>
            </UU5.Bricks.Column>
          </UU5.Bricks.Section>
        }
        rightClosed={<UU5.Bricks.Section id={"r_closed01"}>
          <UU5.Bricks.Box id={"r_closed02"} colorSchema='primary' content=''/>
          <br/>
          <UU5.Bricks.Column id={"r_closed03"}>
            <UU5.Bricks.Button id={"r_closed04"} colorSchema="primary">
              <UU5.Bricks.Icon id={"r_closed05"} icon="mdi-home"/>
            </UU5.Bricks.Button>
          </UU5.Bricks.Column>
        </UU5.Bricks.Section>
        }
        appLayerWrapperProps={{id: 'appLayerId', name: 'appLayerName', className: 'appLayerClassName'}}
        systemLayerContent={<UU5.Bricks.Alert id={"systemLayerID"}>systemLayerContent</UU5.Bricks.Alert>}
        appLayerContent={<UU5.Bricks.Alert id={"appLayerId"}>appLayerContent</UU5.Bricks.Alert>}
        leftWidth="!xs-2em-60px !s-3em-80px !m-4em-100px !l-3em-160px !xl-4em-180px"
        rightWidth="!xs-2em-60px !s-3em-80px !m-4em-100px !l-3em-160px !xl-4em-180px"
        modal={<UU5.Bricks.Modal id={"pageModalId"} className="pageModalClassName" name={"MyModal"} content="Content"/>}
        alertBus={<UU5.Bricks.AlertBus id={"myAlertBus"} className="myAlertBusClassName" name={"myAlertbus"}/>}
      >
        <UU5.Bricks.Div id={"contentID01"} className="padding">
          <UU5.Bricks.Header id={"contentID02"} level={1}>Content</UU5.Bricks.Header>
          <UU5.Bricks.Section id={"contentID03"} className="center"><UU5.Bricks.Paragraph
            id={"contentID04"}/></UU5.Bricks.Section>
        </UU5.Bricks.Div>
      </UU5.Bricks.Page>,
      {disableLifecycleMethods: false}
    );
    expect(wrapper.instance().getModal()).toBe(wrapper.find('Modal').instance());
    expect(wrapper.instance().getModal()).toEqual(expect.any(Object))
  });

});
