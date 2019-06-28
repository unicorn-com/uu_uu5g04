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
import { shallow, mount } from 'enzyme';
import UU5 from "uu5g04";
import "uu5g04-bricks";
import enzymeToJson from 'enzyme-to-json';
import TestTools from "../../../core/test/test-tools";
import createReactClass from "create-react-class";

// TODO Add tests for prop "loading" - currently not available because enzyme doesn't support
// mounting of React.lazy + React.Suspense - https://github.com/airbnb/enzyme/issues/1917
// And testing whether "loading" prop works can't be done via shallow.

let renderButtons = () => (
  <UU5.Bricks.Div>
    <UU5.Bricks.Button
      onClick={() => UU5.Environment.setRoute({tag: 'UU5.Home', props: {title: "Home"}}, {url: 'home'})}
      content="Home"/>
    <UU5.Bricks.Button onClick={() => UU5.Environment.setRoute(<UU5.About title="About"/>, {url: 'about'})}
                       content="About"/>
    <UU5.Bricks.Button
      onClick={() => UU5.Environment.setRoute(<UU5.Default title="Page leave - default dialog"/>, {url: 'default'})}
      content="Page leave - default dialog"/>
    <UU5.Bricks.Button
      onClick={() => UU5.Environment.setRoute(<UU5.Custom title="Page leave - custom dialog"/>, {url: 'custom'})}
      content="Page leave - custom dialog"/>
    <UU5.Bricks.Button onClick={() => UU5.Environment.setRoute({tag: 'UU5.Bricks.Wrong'})} content="Wrong route"/>
  </UU5.Bricks.Div>
);

UU5.Home = createReactClass({
  displayName: "UU5.Home",
  mixins: [
    UU5.Common.BaseMixin,
    UU5.Common.ElementaryMixin,
    UU5.Common.RouteMixin
  ],

  render() {
    return (
      <UU5.Bricks.Container header="Home" title="Home">
        {renderButtons()}
      </UU5.Bricks.Container>
    );
  }
});

UU5.About = createReactClass({
  displayName: "UU5.About",
  mixins: [
    UU5.Common.BaseMixin,
    UU5.Common.ElementaryMixin,
    UU5.Common.RouteMixin
  ],

  render() {
    return (
      <UU5.Bricks.Container header="About">
        {renderButtons()}
      </UU5.Bricks.Container>
    );
  }
});

UU5.Default = createReactClass({
  displayName: "UU5.Default",
  mixins: [
    UU5.Common.BaseMixin,
    UU5.Common.ElementaryMixin,
    UU5.Common.RouteMixin
  ],

  componentDidMount() {
    UU5.Environment.getRouter().preventPageLeave();
  },

  render() {
    return (
      <UU5.Bricks.Container header="Page leave - default dialog" title="Default">
        {renderButtons()}
        <UU5.Bricks.Paragraph/>
        <UU5.Bricks.Button
          onClick={() => {
            UU5.Environment.getRouter().allowPageLeave();
          }}
          content={"Remove confirmation dialog"}
        />
      </UU5.Bricks.Container>
    );
  }
});

UU5.Custom = createReactClass({
  displayName: "UU5.Custom",
  mixins: [
    UU5.Common.BaseMixin,
    UU5.Common.ElementaryMixin,
    UU5.Common.RouteMixin
  ],

  componentDidMount() {
    UU5.Environment.getRouter().preventPageLeave((callback) => {
      return {
        header: "Test",
        content: (
          <UU5.Bricks.Div>
            Are you sure?
            <UU5.Bricks.Button onClick={() => callback(true)}>Yes</UU5.Bricks.Button>
            <UU5.Bricks.Button onClick={() => callback(false)}>No</UU5.Bricks.Button>
          </UU5.Bricks.Div>
        )
      };
    })
  },

  render() {
    return (
      <UU5.Bricks.Container header="Page leave - custom dialog" title="Custom">
        {renderButtons()}
        <UU5.Bricks.Paragraph/>
        <UU5.Bricks.Button
          onClick={() => {
            UU5.Environment.getRouter().allowPageLeave();
          }}
          content={"Remove confirmation dialog"}
        />
      </UU5.Bricks.Container>
    );
  }
});

let RouteComponent = createReactClass({
  mixins: [
    UU5.Common.BaseMixin,
    UU5.Common.ElementaryMixin,
    UU5.Common.RouteMixin
  ],
  render() {
    return (
      <UU5.Bricks.Div>
        {this.props.content || this.props.children}
        {Object.keys(this.props.params || {}).length > 0 && <div>Params: <pre>{JSON.stringify(this.props.params)}</pre></div>}
      </UU5.Bricks.Div>
    );
  }
});

let NotFoundRoute = createReactClass({
  mixins: [
    UU5.Common.BaseMixin,
    UU5.Common.ElementaryMixin,
    UU5.Common.RouteMixin
  ],
  render() {
    let { requestedRoute } = this.props.params || {};
    let useCase = (requestedRoute && requestedRoute.useCase) || requestedRoute;
    return (
      <UU5.Common.Error content={`Route "${useCase}" not found.`} />
    );
  }
});

let routes = {
  "home": { component: <RouteComponent content="home" /> }
};


const TagName = "UU5.Common.Router";

const CONFIG = {
  mixins: [
    "UU5.Common.BaseMixin",
    "UU5.Common.ElementaryMixin",
    "UU5.Common.CcrWriterMixin",
    "UU5.Common.PureRenderMixin",
    "UU5.Common.RouterMixin"
  ],
  props: {
    basePath: {
      values: ["/uu-dockitg01-main/12345-890890908"]
    },
    route: {
      values: [<RouteComponent content="initial route" />]
    },
    notFoundRoute: {
      values: [<NotFoundRoute />]
    },
    showNotFoundRouteInUrl: {
      values: [false, true, null]
    },
    //routes props is tested separatelly
    //routes: {},
    urlBuilder: {
      values: [UU5.Common.Url]
    },
    strictProps: {
      values: [true, false]
    }
  },
  requiredProps: {
    route: "welcome",
    notFoundRoute: "Error"
  },
  opt: {
    enzymeToJson: false,
    shallowOpt: {
      disableLifecycleMethods: false
    },
  }
};


describe(`${TagName} Test Tool API test`, () => {

  TestTools.testProperties(TagName, CONFIG);

  it('test 01 - routes props', () => {

    const wrapper = shallow(
      <UU5.Common.Router
        id={"myRouter"}
        basePath="/vendor-app-subapp/tid-awid"
        notFoundRoute={<NotFoundRoute />}
        routes={{"": {component: {tag: "Ucl.Parrot.Home"}, noHistory: true}}}
        urlBuilder={UU5.Common.Url}
        route={<RouteComponent content="initial route" />}
      />
    );
    expect(wrapper).toMatchSnapshot();
    wrapper.setProps({routes: {'': {component: {tag: 'Ucl.Parrot.About'}, noHistory: false}}});
    wrapper.update();
    expect(wrapper.instance().props.routes).toEqual(expect.objectContaining(
      {'': {component: {tag: 'Ucl.Parrot.About'}, noHistory: false}}
    ));
    expect(wrapper).toMatchSnapshot();
  });


});

//Test without test_tools  API.

describe(`${TagName} props`, () => {

  it('test 01 - default props', () => {
    const wrapper = shallow(
      <UU5.Common.Router
        id={"myRouter"}
        basePath="/vendor-app-subapp/tid-awid"
        notFoundRoute={<NotFoundRoute />}
        routes={{"": {component: {tag: "Ucl.Parrot.Home"}, noHistory: true}}}
        urlBuilder={UU5.Common.Url}
        route={<RouteComponent content="initial route" />}
      />
    );
    expect(enzymeToJson(wrapper)).toMatchSnapshot();
  });


  it('test 02 - basePath props', () => {
    const wrapper = shallow(
      <UU5.Common.Router
        id={"myRouter"}
        notFoundRoute={<NotFoundRoute />}
        routes={{"": {component: {tag: "Ucl.Parrot.Home"}, noHistory: true}}}
        urlBuilder={UU5.Common.Url}
        route={<RouteComponent content="initial route" />}
      />
    );
    expect(wrapper.instance().props.basePath).toBeNull();
    expect(wrapper).toMatchSnapshot();
    wrapper.setProps({basePath: "/uu-dockitg01-main/12345-890890908"});
    wrapper.update();
    expect(wrapper.instance().props.basePath).toEqual("/uu-dockitg01-main/12345-890890908");
    expect(wrapper).toMatchSnapshot();
  });

  it('test 03 - notFoundRoute props', () => {
    const wrapper = shallow(
      <UU5.Common.Router
        id={"myRouter"}
        basePath="/vendor-app-subapp/tid-awid"
        notFoundRoute={{tag: 'UU5.Common.NotFoundTag'}}
        routes={{"": {component: {tag: "Ucl.Parrot.Home"}, noHistory: true}}}
        urlBuilder={UU5.Common.Url}
        route={<RouteComponent content="initial route" />}
      />
    );
    expect(wrapper.instance().props.notFoundRoute).toEqual(expect.objectContaining(
      {tag: 'UU5.Common.NotFoundTag'}
    ));
    wrapper.setProps({notFoundRoute: "error"});
    wrapper.update();
    expect(wrapper.instance().props.notFoundRoute).toMatch(/error/);
    expect(enzymeToJson(wrapper)).toMatchSnapshot();
  });

  it('test 04 - route props', () => {
    const wrapper = shallow(
      <UU5.Common.Router
        id={"myRouter"}
        basePath="/vendor-app-subapp/tid-awid"
        notFoundRoute={{tag: 'UU5.Common.NotFoundTag'}}
        routes={{"": {component: {tag: "Ucl.Parrot.Home"}, noHistory: true}}}
        urlBuilder={UU5.Common.Url}
        route={{tag: 'UU5.Home'}}
      />
    );
    expect(wrapper.instance().props.route).toEqual(expect.objectContaining(
      {tag: 'UU5.Home'}
    ));
    wrapper.setProps({route: {tag: 'UU5.About'}});
    wrapper.update();
    expect(wrapper.instance().props.route).toEqual(expect.objectContaining(
      {tag: 'UU5.About'}
    ));
    expect(wrapper).toMatchSnapshot();
  });

  it('test 05 - routes props', () => {
    const wrapper = shallow(
      <UU5.Common.Router
        id={"myRouter"}
        basePath="/vendor-app-subapp/tid-awid"
        notFoundRoute={{tag: 'UU5.Common.NotFoundTag'}}
        routes={{"": {component: {tag: "Ucl.Parrot.Home"}, noHistory: true}}}
        urlBuilder={UU5.Common.Url}
        route={{tag: 'UU5.Home'}}
      />
    );
    expect(wrapper.instance().props.routes).toEqual(expect.objectContaining(
      {'': {component: {tag: 'Ucl.Parrot.Home'}, noHistory: true}}
    ));
    expect(wrapper).toMatchSnapshot();
    wrapper.setProps({routes: {'': {component: {tag: 'Ucl.Parrot.About'}, noHistory: false}}});
    wrapper.update();
    expect(wrapper.instance().props.routes).toEqual(expect.objectContaining(
      {'': {component: {tag: 'Ucl.Parrot.About'}, noHistory: false}}
    ));
    expect(wrapper).toMatchSnapshot();
  });

  it('test 06 - urlBuilder props', () => {
    const wrapper = shallow(
      <UU5.Common.Router
        id={"myRouter"}
        basePath="/vendor-app-subapp/tid-awid"
        notFoundRoute={{tag: 'UU5.Common.NotFoundTag'}}
        routes={{"": {component: {tag: "Ucl.Parrot.Home"}, noHistory: true}}}
        route={{tag: 'UU5.Home'}}
      />
    );
    //Make default snapshot. There is urlBuilder null
    expect(wrapper).toMatchSnapshot();
    wrapper.setProps({urlBuilder: UU5.Common.Url});
    wrapper.update();
    expect(wrapper.instance().props.urlBuilder).not.toBeNull();
    expect(wrapper.instance().props.urlBuilder).not.toBeUndefined();
    let typeUrl = typeof wrapper.instance().props.urlBuilder;
    expect(typeUrl).toBe('function');
    //Now if we set urlBuilder props in the snapshot must be: {[Function]}
    expect(wrapper).toMatchSnapshot();
  });

});

describe(`${TagName} Common.BaseMixin props`, () => {

  it('test 01 - id props', () => {
    const wrapper = shallow(
      <UU5.Common.Router
        id={"myRouter"}
        basePath="/vendor-app-subapp/tid-awid"
        notFoundRoute={<NotFoundRoute />}
        routes={{"": {component: {tag: "Ucl.Parrot.Home"}, noHistory: true}}}
        urlBuilder={UU5.Common.Url}
        route={<RouteComponent content="initial route" />}
      />
    );
    expect(wrapper.instance().props.id).toMatch(/myRouter/);
    expect(wrapper).toMatchSnapshot();
    wrapper.setProps({id: "newRouterID"});
    wrapper.update();
    expect(wrapper.instance().props.id).toMatch(/newRouterID/);
    expect(wrapper).toMatchSnapshot();
  });


  it('test 02 - name props', () => {
    const wrapper = shallow(
      <UU5.Common.Router
        id={"myRouter"}
        basePath="/vendor-app-subapp/tid-awid"
        notFoundRoute={<NotFoundRoute />}
        routes={{"": {component: {tag: "Ucl.Parrot.Home"}, noHistory: true}}}
        urlBuilder={UU5.Common.Url}
        route={<RouteComponent content="initial route" />}
      />
    );
    expect(wrapper.instance().props.name).toBeNull();
    expect(wrapper).toMatchSnapshot();
    wrapper.setProps({name: "RouterNewName"});
    wrapper.update();
    expect(wrapper.instance().props.name).toMatch(/RouterNewName/);
    expect(wrapper).toMatchSnapshot();
  });

  it('test 03 - tooltip props', () => {
    const wrapper = shallow(
      <UU5.Common.Router
        id={"myRouter"}
        basePath="/vendor-app-subapp/tid-awid"
        notFoundRoute={{tag: 'UU5.Common.NotFoundTag'}}
        routes={{"": {component: {tag: "Ucl.Parrot.Home"}, noHistory: true}}}
        urlBuilder={UU5.Common.Url}
        route={<RouteComponent content="initial route" />}
      />
    );
    expect(wrapper.instance().props.tooltip).toBeNull();
    expect(wrapper).toMatchSnapshot();
    wrapper.setProps({tooltip: "This is router tooltips"});
    wrapper.update();
    expect(wrapper.instance().props.tooltip).toMatch(/This is router tooltips/);
    expect(wrapper).toMatchSnapshot();
  });

  it('test 04 - className props', () => {
    const wrapper = shallow(
      <UU5.Common.Router
        id={"myRouter"}
        basePath="/vendor-app-subapp/tid-awid"
        notFoundRoute={{tag: 'UU5.Common.NotFoundTag'}}
        routes={{"": {component: {tag: "Ucl.Parrot.Home"}, noHistory: true}}}
        urlBuilder={UU5.Common.Url}
        route={{tag: 'UU5.Home'}}
      />
    );
    expect(wrapper.instance().props.className).toBeNull();
    expect(wrapper).toMatchSnapshot();
    wrapper.setProps({className: "uu5-my-router"});
    wrapper.update();
    expect(wrapper.instance().props.className).toMatch(/uu5-my-router/);
    expect(wrapper).toMatchSnapshot();
  });

  it('test 05 - style props', () => {
    const wrapper = shallow(
      <UU5.Common.Router
        id={"myRouter"}
        basePath="/vendor-app-subapp/tid-awid"
        notFoundRoute={{tag: 'UU5.Common.NotFoundTag'}}
        routes={{"": {component: {tag: "Ucl.Parrot.Home"}, noHistory: true}}}
        urlBuilder={UU5.Common.Url}
        route={{tag: 'UU5.Home'}}
      />
    );
    expect(wrapper.instance().props.style).toBeNull();
    expect(wrapper).toMatchSnapshot();
    wrapper.setProps({style: {fontSize: "20px", color: "red"}});
    wrapper.update();
    expect(wrapper.instance().props.style).toEqual(expect.objectContaining(
      {fontSize: "20px", color: "red"}
    ));
    expect(wrapper).toMatchSnapshot();
  });

  it('test 06 - mainAttrs props', () => {
    const wrapper = shallow(
      <UU5.Common.Router
        id={"myRouter"}
        basePath="/vendor-app-subapp/tid-awid"
        notFoundRoute={{tag: 'UU5.Common.NotFoundTag'}}
        routes={{"": {component: {tag: "Ucl.Parrot.Home"}, noHistory: true}}}
        route={{tag: 'UU5.Home'}}
      />
    );
    //Make default snapshot. There is urlBuilder null
    expect(wrapper.instance().props.mainAttrs).toBeNull();
    expect(wrapper).toMatchSnapshot();
    wrapper.setProps({mainAttrs: {style: {fontSize: "20px", color: "red"}}});
    wrapper.update();
    expect(wrapper.instance().props.mainAttrs).not.toBeNull();
    expect(wrapper.instance().props.mainAttrs).not.toBeUndefined();
    expect(wrapper).toMatchSnapshot();
  });

  it('test 07 - noIndex props', () => {
    const wrapper = shallow(
      <UU5.Common.Router
        id={"myRouter"}
        basePath="/vendor-app-subapp/tid-awid"
        notFoundRoute={{tag: 'UU5.Common.NotFoundTag'}}
        routes={{"": {component: {tag: "Ucl.Parrot.Home"}, noHistory: true}}}
        urlBuilder={UU5.Common.Url}
        route={{tag: 'UU5.Home'}}
      />
    );
    expect(wrapper.instance().props.noIndex).toBeFalsy();
    expect(wrapper).toMatchSnapshot();
    wrapper.setProps({noIndex: true});
    wrapper.update();
    expect(wrapper.instance().props.noIndex).toBeTruthy();
    expect(wrapper).toMatchSnapshot();
  });

});

describe(`${TagName} Common.ElementaryMixin props`, () => {

  it('test 01 - hidden props', () => {
    const wrapper = shallow(
      <UU5.Common.Router
        id={"myRouter"}
        basePath="/vendor-app-subapp/tid-awid"
        notFoundRoute={<NotFoundRoute />}
        routes={{"": {component: {tag: "Ucl.Parrot.Home"}, noHistory: true}}}
        urlBuilder={UU5.Common.Url}
        route={<RouteComponent content="initial route" />}
      />
    );
    expect(wrapper.instance().props.hidden).toBeFalsy();
    expect(wrapper).toMatchSnapshot();
    wrapper.setProps({hidden: true});
    wrapper.update();
    expect(wrapper.instance().props.hidden).toBeTruthy();
    expect(wrapper).toMatchSnapshot();
  });


  it('test 02 - disabled props', () => {
    const wrapper = shallow(
      <UU5.Common.Router
        id={"myRouter"}
        basePath="/vendor-app-subapp/tid-awid"
        notFoundRoute={<NotFoundRoute />}
        routes={{"": {component: {tag: "Ucl.Parrot.Home"}, noHistory: true}}}
        urlBuilder={UU5.Common.Url}
        route={<RouteComponent content="initial route" />}
      />
    );
    expect(wrapper.instance().props.disabled).toBeFalsy();
    expect(wrapper).toMatchSnapshot();
    wrapper.setProps({disabled: true});
    wrapper.update();
    expect(wrapper.instance().props.disabled).toBeTruthy();
    expect(wrapper).toMatchSnapshot();
  });

  it('test 03 - selected props', () => {
    const wrapper = shallow(
      <UU5.Common.Router
        id={"myRouter"}
        basePath="/vendor-app-subapp/tid-awid"
        notFoundRoute={{tag: 'UU5.Common.NotFoundTag'}}
        routes={{"": {component: {tag: "Ucl.Parrot.Home"}, noHistory: true}}}
        urlBuilder={UU5.Common.Url}
        route={<RouteComponent content="initial route" />}
      />
    );
    expect(wrapper.instance().props.selected).toBeFalsy();
    expect(wrapper).toMatchSnapshot();
    wrapper.setProps({selected: true});
    wrapper.update();
    expect(wrapper.instance().props.selected).toBeTruthy();
    expect(wrapper).toMatchSnapshot();
  });

  it('test 04 - controlled props', () => {
    const wrapper = shallow(
      <UU5.Common.Router
        id={"myRouter"}
        basePath="/vendor-app-subapp/tid-awid"
        notFoundRoute={{tag: 'UU5.Common.NotFoundTag'}}
        routes={{"": {component: {tag: "Ucl.Parrot.Home"}, noHistory: true}}}
        urlBuilder={UU5.Common.Url}
        route={{tag: 'UU5.Home'}}
      />
    );
    expect(wrapper.instance().props.controlled).toBeTruthy();
    expect(wrapper).toMatchSnapshot();
    wrapper.setProps({controlled: false});
    wrapper.update();
    expect(wrapper.instance().props.controlled).toBeFalsy();
    expect(wrapper).toMatchSnapshot();
  });

});

describe(`${TagName} Common.CcrWriterMixin props`, () => {

  it('test01 - ccrKey props', () => {
    const wrapper = shallow(
      <UU5.Common.Router
        id={"myRouter"}
        basePath="/vendor-app-subapp/tid-awid"
        notFoundRoute={{tag: 'UU5.Common.NotFoundTag'}}
        routes={{"": {component: {tag: "Ucl.Parrot.Home"}, noHistory: true}}}
        urlBuilder={UU5.Common.Url}
        route={{tag: 'UU5.Home'}}
      />
    );
    expect(wrapper.instance().props.ccrKey).toBeNull();
    expect(wrapper).toMatchSnapshot();
    wrapper.setProps({ccrKey: '<UU5.Parrot.Page ccrKey="UU5.Parrot.Page" />'});
    wrapper.update();
    expect(wrapper).toMatchSnapshot();
  });

});

describe(`${TagName} Common.PureRenderMixin props`, () => {

  it('test 01 - pureRender props', () => {
    const wrapper = shallow(
      <UU5.Common.Router
        id={"myRouter"}
        basePath="/vendor-app-subapp/tid-awid"
        notFoundRoute={{tag: 'UU5.Common.NotFoundTag'}}
        routes={{"": {component: {tag: "Ucl.Parrot.Home"}, noHistory: true}}}
        urlBuilder={UU5.Common.Url}
        route={{tag: 'UU5.Home'}}
      />
    );
    expect(wrapper.instance().props.pureRender).toBeFalsy();
    expect(wrapper).toMatchSnapshot();
    wrapper.setProps({pureRender: true});
    wrapper.update();
    expect(wrapper.instance().props.pureRender).toBeTruthy();
    expect(wrapper).toMatchSnapshot();
  });

});

describe(`${TagName} props extended test`, () => {
  let wrapper;
  let origGetAppBasePath = UU5.Environment.getAppBasePath;

  beforeEach(() => {
    UU5.Environment.getAppBasePath = () => "/vendor-app-subapp/tid-awid/";
  });
  afterEach(() => {
    UU5.Environment.getAppBasePath = origGetAppBasePath;
    if (wrapper && wrapper.length === 1) wrapper.unmount();
  });

  let routes = {
    welcome: { component: <RouteComponent content="@welcome@" /> },
    notFoundRoute: { component: <RouteComponent content="@notFoundRoute@" /> },
  };
  let routesDashed = {
    "welcome/": { component: <RouteComponent content="@welcome/@" /> },
    "notFoundRoute/": { component: <RouteComponent content="@notFoundRoute/@" /> },
  };

  it("strictRoutes", () => {
    window.history.replaceState({}, "New test URL", "/vendor-app-subapp/tid-awid/welcome");
    wrapper = mount(<UU5.Common.Router id="myRouter" notFoundRoute="notFoundRoute" routes={routes} strictRoutes />);
    expect(wrapper.find(RouteComponent).length).toBe(1);
    expect(wrapper.html()).toContain("@welcome@");
    expect(wrapper.html()).toMatchSnapshot();
    wrapper.unmount();

    window.history.replaceState({}, "New test URL", "/vendor-app-subapp/tid-awid/welcome/");
    wrapper = mount(<UU5.Common.Router id="myRouter" notFoundRoute="notFoundRoute" routes={routes} strictRoutes />);
    expect(wrapper.find(RouteComponent).length).toBe(1);
    expect(wrapper.html()).toContain("@notFoundRoute@");
    expect(wrapper.html()).toMatchSnapshot();
    wrapper.unmount();

    window.history.replaceState({}, "New test URL", "/vendor-app-subapp/tid-awid/welcome");
    wrapper = mount(
      <UU5.Common.Router id="myRouter" notFoundRoute="notFoundRoute" routes={routes} strictRoutes={false} />
    );
    expect(wrapper.find(RouteComponent).length).toBe(1);
    expect(wrapper.html()).toContain("@welcome@");
    expect(wrapper.html()).toMatchSnapshot();
    wrapper.unmount();

    window.history.replaceState({}, "New test URL", "/vendor-app-subapp/tid-awid/welcome/");
    wrapper = mount(
      <UU5.Common.Router id="myRouter" notFoundRoute="notFoundRoute" routes={routes} strictRoutes={false} />
    );
    expect(wrapper.find(RouteComponent).length).toBe(1);
    expect(wrapper.html()).toContain("@welcome@");
    expect(wrapper.html()).toMatchSnapshot();
    wrapper.unmount();

    window.history.replaceState({}, "New test URL", "/vendor-app-subapp/tid-awid/welcome");
    wrapper = mount(
      <UU5.Common.Router id="myRouter" notFoundRoute="notFoundRoute" routes={routesDashed} strictRoutes={false} />
    );
    expect(wrapper.find(RouteComponent).length).toBe(1);
    expect(wrapper.html()).toContain("@welcome/@");
    expect(wrapper.html()).toMatchSnapshot();
    wrapper.unmount();
  });
});
