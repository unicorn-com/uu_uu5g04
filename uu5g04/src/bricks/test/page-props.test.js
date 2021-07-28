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

const { mount, shallow, wait } = UU5.Test.Tools;

// these are using "require" for easier setting up of SystemJS
const React = require("react");
const ReactDnD = require("react-dnd");
const ReactDnDHtml5Backend = require("react-dnd-html5-backend");

// loading SystemJS into JSDOM environment needs a bit of fiddling...
let origDocument = global.document;
let origLocation = global.location;
delete global.document;
delete global.location;
let SystemJS = require("systemjs");
global.document = origDocument;
global.location = origLocation;
SystemJS.set(SystemJS.normalizeSync("react-dnd"), SystemJS.newModule(ReactDnD));
SystemJS.set(SystemJS.normalizeSync("react-dnd-html5-backend"), SystemJS.newModule(ReactDnDHtml5Backend));

class Component extends React.Component {
  render() {
    return this.props.connectDragSource(
      <div id={this.props.id}>
        <div>isDragging: {this.props.isDragging}</div>
        {this.props.children}
      </div>
    );
  }
}
const dragSpec = {
  beginDrag(props, monitor, component) {
    return { id: props.id };
  },
};
const dragCollect = function (connect, monitor) {
  return {
    connectDragSource: connect.dragSource(),
    isDragging: !!monitor.isDragging(),
  };
};
const DnDComponent = ReactDnD.DragSource("item", dragSpec, dragCollect)(Component);

const top = <UU5.Bricks.Box id="uuIDBOX" key="0" colorSchema="blue-rich" content="uuDocKit" className="center" />;
const bottom = (
  <UU5.Bricks.Box id={"uuIDBOX2"} key="0" colorSchema="grey">
    Bottom Panel
  </UU5.Bricks.Box>
);
const left = (
  <UU5.Bricks.Div id={"uuIDdiv"} key="0">
    <UU5.Bricks.Box id={"menuBox"} colorSchema="primary" content="Menu" />
    <UU5.Bricks.Ul id={"menuUl"}>
      <UU5.Bricks.Li id={"liItem1"}>Home</UU5.Bricks.Li>
      <UU5.Bricks.Li id={"liItem2"}>Content</UU5.Bricks.Li>
      <UU5.Bricks.Li id={"liItem3"}>About</UU5.Bricks.Li>
    </UU5.Bricks.Ul>
  </UU5.Bricks.Div>
);
const right = (
  <UU5.Bricks.Div id={"uuIDdiv_R_R_R"} key="0">
    <UU5.Bricks.Box id={"menuBox_R_R_R"} colorSchema="primary" content="Menu" />
    <UU5.Bricks.Ul id={"menuUl_R_R_R"}>
      <UU5.Bricks.Li id={"liItem1_R_R_R"}>Home</UU5.Bricks.Li>
      <UU5.Bricks.Li id={"liItem2_R_R_R"}>Content</UU5.Bricks.Li>
      <UU5.Bricks.Li id={"liItem3_R_R_R"}>About</UU5.Bricks.Li>
    </UU5.Bricks.Ul>
  </UU5.Bricks.Div>
);

const CONFIG = {
  mixins: [
    "UU5.Common.BaseMixin",
    "UU5.Common.ElementaryMixin",
    "UU5.Common.NestingLevelMixin",
    "UU5.Common.ContentMixin",
    "UU5.Common.ScreenSizeMixin",
    "UU5.Common.CcrWriterMixin",
    "UU5.Common.PureRenderMixin",
  ],
  props: {
    type: {
      values: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14],
    },
    fullPage: {
      values: [true, false],
    },
    topWrapperProps: {
      values: [{ style: { backgroundColor: "#2196F3" } }],
    },
    bottomWrapperProps: {
      values: [{ style: { backgroundColor: "#2196F3" } }],
    },
    leftWrapperProps: {
      values: [{ style: { backgroundColor: "#2196F3" } }],
    },
    rightWrapperProps: {
      values: [{ style: { backgroundColor: "#2111EE" } }],
    },
    contentWrapperProps: {
      values: [{ style: { backgroundColor: "#2111EE" } }],
    },
    appLayerWrapperProps: {
      values: [{ style: { backgroundColor: "#2111EE" } }],
    },
    systemLayerWrapperProps: {
      values: [{ style: { backgroundColor: "#2111EE" } }],
    },
    switchElevationTopBottom: {
      values: [true, false],
    },
    switchElevationLeftRight: {
      values: [true, false],
    },
    top: {
      values: [top],
    },
    bottom: {
      values: [bottom],
    },
    left: {
      values: [left],
    },
    leftOpen: {
      values: [
        <UU5.Bricks.Section id={"idSection1"} key="0">
          <br />
          <UU5.Bricks.Column id={"uuIDColumn1"}>
            <UU5.Bricks.ButtonGroup id={"butGRPPID"} vertical>
              <UU5.Bricks.Button id={"idBTN"} colorSchema="primary">
                Home
              </UU5.Bricks.Button>
            </UU5.Bricks.ButtonGroup>
          </UU5.Bricks.Column>
        </UU5.Bricks.Section>,
      ],
    },
    leftClosed: {
      values: [
        <UU5.Bricks.Section id={"S01"} key="0">
          <br />
          <UU5.Bricks.Column id={"C01"}>
            <UU5.Bricks.ButtonGroup id={"BTN01"} vertical>
              <UU5.Bricks.Button colorSchema="primary" id={"toggleRight"}>
                <UU5.Bricks.Icon id={"uuIcon"} icon="mdi-arrow-left-bold-circle-outline" />
              </UU5.Bricks.Button>
            </UU5.Bricks.ButtonGroup>
          </UU5.Bricks.Column>
        </UU5.Bricks.Section>,
      ],
    },
    right: {
      values: [right],
    },
    rightOpen: {
      values: [
        <UU5.Bricks.Section id={"idSection1_R_R"} key="0">
          <br />
          <UU5.Bricks.Column id={"uuIDColumn1_R_R"}>
            <UU5.Bricks.ButtonGroup id={"butGRPPID_R_R"} vertical>
              <UU5.Bricks.Button id={"idBTN_R_R"} colorSchema="primary">
                Home
              </UU5.Bricks.Button>
            </UU5.Bricks.ButtonGroup>
          </UU5.Bricks.Column>
        </UU5.Bricks.Section>,
      ],
    },
    rightClosed: {
      values: [
        <UU5.Bricks.Section id={"S01_R"} key="0">
          <br />
          <UU5.Bricks.Column id={"C01_R"}>
            <UU5.Bricks.ButtonGroup id={"BTN01_R"} vertical>
              <UU5.Bricks.Button colorSchema="primary" id={"toggleRight_R"}>
                <UU5.Bricks.Icon id={"uuIcon_R"} icon="mdi-arrow-left-bold-circle-outline" />
              </UU5.Bricks.Button>
            </UU5.Bricks.ButtonGroup>
          </UU5.Bricks.Column>
        </UU5.Bricks.Section>,
      ],
    },
    isLeftOpen: {
      values: [true, false],
    },
    isRightOpen: {
      values: [true, false],
    },
    alertBus: {
      values: [<UU5.Bricks.AlertBus id={"uuBUS"} key="0" content="ContentAlertBus" />],
    },
    modal: {
      values: [<UU5.Bricks.Modal id={"uuMODAL"} key="0" content="Content" />],
    },
    appLayerContent: {
      values: [
        <UU5.Bricks.Alert id={"uuAlertID"} key="0" colorSchema="red-rich">
          appLayerContent
        </UU5.Bricks.Alert>,
      ],
    },
    systemLayerContent: {
      values: ["Obsah který se zobrazí před page a appLayer"],
    },
    leftWidth: {
      values: ["xs-10em-50px s-20 m-15px-60 l-15-60rem xl-15-60rem", "!xs-10-30 s-10em !m-10-20 l-15 xl-15"],
    },
    rightWidth: {
      values: ["!xs-10-30 s-10em !m-10-20 l-15 xl-15", "!xs-10-30 s-10em !m-10-20 l-15 xl-15"],
    },
    topFixed: {
      values: [true, false, "always", "smart"],
    },
    bottomFixed: {
      values: [true, false, "always", "smart"],
    },
    leftSwipe: {
      values: [true, false],
    },
    rightSwipe: {
      values: [true, false],
    },
    leftFixed: {
      values: [true, false],
    },
    rightFixed: {
      values: [true, false],
    },
    leftRelative: {
      values: [null, "xs", "xs s", "xs s m", "xs s m l", "xs s m l xl"],
    },
    rightRelative: {
      values: [null, "xs", "xs s", "xs s m", "xs s m l", "xs s m l xl"],
    },
    leftResizable: {
      values: [true, false],
    },
    rightResizable: {
      values: [true, false],
    },
    leftResizableMinWidth: {
      values: [undefined, 100],
    },
    leftResizableMaxWidth: {
      values: [undefined, 100],
    },
    rightResizableMinWidth: {
      values: [undefined, 100],
    },
    rightResizableMaxWidth: {
      values: [undefined, 100],
    },
  },
  requiredProps: {},
  opt: {
    shallowOpt: {
      disableLifecycleMethods: true,
    },
  },
};

afterEach(() => {
  delete UU5.Environment.page;
});

describe(`UU5.Bricks.Page`, () => {
  UU5.Test.Tools.testProperties(UU5.Bricks.Page, CONFIG);

  it("check default values of boolean props", function () {
    const wrapper = mount(
      <UU5.Bricks.Page
        type="1"
        top={<UU5.Bricks.Box id={"idTop"} colorSchema="blue-rich" content="TOP" className="center" />}
        bottom={
          <UU5.Bricks.Box id={"idBottom"} colorSchema="grey">
            Bottom Panel
          </UU5.Bricks.Box>
        }
        left={
          <UU5.Bricks.Section id={"left01"}>
            <UU5.Bricks.Box id={"left02"} colorSchema="primary" content="Left Menu" />
            <br />
            <UU5.Bricks.Column id={"left03"}>
              Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Class aptent taciti sociosqu ad litora torquent
              per conubia nostra, per inceptos hymenaeos.
            </UU5.Bricks.Column>
          </UU5.Bricks.Section>
        }
        rightOpen={
          <UU5.Bricks.Section id={"r_open01"}>
            <UU5.Bricks.Box id={"r_open02"} colorSchema="primary" content="Menu" />
            <br />
            <UU5.Bricks.Column id={"r_open03"}>
              <UU5.Bricks.ButtonGroup id={"r_open04"} vertical>
                <UU5.Bricks.Button id={"r_open05"} colorSchema="primary" ref_={(button) => (this.MenuButton = button)}>
                  Home
                  <UU5.Bricks.Icon id={"r_open06"} icon="mdi-home" />
                </UU5.Bricks.Button>
              </UU5.Bricks.ButtonGroup>
            </UU5.Bricks.Column>
          </UU5.Bricks.Section>
        }
        rightClosed={
          <UU5.Bricks.Section id={"r_closed01"}>
            <UU5.Bricks.Box id={"r_closed02"} colorSchema="primary" content="" />
            <br />
            <UU5.Bricks.Column id={"r_closed03"}>
              <UU5.Bricks.Button id={"r_closed04"} colorSchema="primary">
                <UU5.Bricks.Icon id={"r_closed05"} icon="mdi-home" />
              </UU5.Bricks.Button>
            </UU5.Bricks.Column>
          </UU5.Bricks.Section>
        }
        systemLayerContent={<UU5.Bricks.Alert id={"systemLayerID"}>systemLayerContent</UU5.Bricks.Alert>}
        appLayerContent={<UU5.Bricks.Alert id={"appLayerId"}>appLayerContent</UU5.Bricks.Alert>}
        leftWidth="!xs-2em-60px !s-3em-80px !m-4em-100px !l-3em-160px !xl-4em-180px"
        rightWidth="!xs-2em-60px !s-3em-80px !m-4em-100px !l-3em-160px !xl-4em-180px"
        modal={<UU5.Bricks.Modal id={"pageModalId"} content="Content" />}
      >
        <UU5.Bricks.Div id={"contentID01"} className="padding">
          <UU5.Bricks.Header id={"contentID02"} level={1}>
            Content
          </UU5.Bricks.Header>
          <UU5.Bricks.Section id={"contentID03"} className="center">
            <UU5.Bricks.Paragraph id={"contentID04"} />
          </UU5.Bricks.Section>
        </UU5.Bricks.Div>
      </UU5.Bricks.Page>,
      { disableLifecycleMethods: false }
    );
    expect(wrapper.instance().props.isLeftOpen).toBeFalsy();
    expect(wrapper.instance().props.isRightOpen).toBeFalsy();
    expect(wrapper.instance().props.fullPage).toBeTruthy();
    expect(wrapper.instance().props.switchElevationTopBottom).toBeFalsy();
    expect(wrapper.instance().props.switchElevationLeftRight).toBeFalsy();
  });

  it("prop useDnD", function () {
    let content = "Content of DnD Component";
    let wrapper = mount(
      <UU5.Bricks.Page useDnD>
        <DnDComponent id="dnd">{content}</DnDComponent>
      </UU5.Bricks.Page>
    );
    expect(wrapper.find("#dnd").first().html() || "").toContain(content);
    wrapper.unmount();

    wrapper = mount(
      <UU5.Bricks.Page>
        <DnDComponent id="dnd">{content}</DnDComponent>
      </UU5.Bricks.Page>
    );
    expect(wrapper.find("#dnd").first().html() || "").not.toContain(content);
    wrapper.unmount();
  });

  it("prop overlayTop", function () {
    let wrapper = shallow(
      <UU5.Bricks.Page id="pageId" top={top} left={left} right={right} overlayTop>
        <UU5.Bricks.Paragraph />
      </UU5.Bricks.Page>
    );

    expect(wrapper).toMatchSnapshot();
  });

  // TODO: Test by simulating drag event, which should resize the Column to a bigger width than allowed,
  // then check that the width didnt actually change
  // it("prop resizable widths", function() {
  //   let props = {
  //     left,
  //     right,
  //     leftResizableMinWidth: 100,
  //     leftResizableMaxWidth: 200,
  //     rightResizableMinWidth: 100,
  //     rightResizableMaxWidth: 200
  //   };
  //   let wrapper = mount(<UU5.Bricks.Page {...props} />);
  // });
});
