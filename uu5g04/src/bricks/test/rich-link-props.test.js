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

//@@viewOn:imports
import UU5 from "uu5g04";
import "uu5g04-bricks";
//@@viewOff:imports

const { mount, shallow, wait } = UU5.Test.Tools;

const CONFIG = {
  mixins: ["UU5.Common.BaseMixin", "UU5.Common.ElementaryMixin"],
  props: {
    href: {
      values: ["https://unicorn.com/"]
    },
    type: {
      values: ["full", "simple"]
    }
  },
  requiredProps: {
    href: "https://unicorn.com/"
  },
  opt: {}
};

const MIXED_DATA = `<html><head>
  <meta name="twitter:title" content="twitter-title">
  <meta name="twitter:description" content="twitter-description">
  <meta name="twitter:image" content="http://example.com/twitter-image">
  <meta itemprop="description" content="itemprop-description">
  <meta itemprop="image" content="http://example.com/itemprop-image">
  <meta property="og:title" content="og-title"/> 
  <meta property="og:description" content="og-description"/> 
  <meta property="og:image" content="http://example.com/og-image" />
  <link rel="icon" href="http://example.com/favicon.ico"/>
</head></html>`;
const TWITTER_DATA = `<html><head>
  <meta name="twitter:title" content="twitter-title">
  <meta name="twitter:description" content="twitter-description">
  <meta name="twitter:image" content="http://example.com/twitter-image">
  <link rel="shortcut icon" href="http://example.com/favicon.ico"/>
</head></html>`;
const ITEMPROP_DATA = `<html><head>
  <meta itemprop="description" content="itemprop-description">
  <meta itemprop="image" content="http://example.com/itemprop-image">
  <link rel="icon" href="http://example.com/favicon.ico"/>
</head></html>`;
const NO_IMAGE_DATA = `<html><head>
  <meta property="og:title" content="og-title"/> 
  <link rel="icon" href="http://example.com/favicon.ico"/>
</head></html>`;
const GUESS_BASE_URI_DATA = String.raw`<html><head>
  <meta property="og:title" content="og-title"/> 
  <script>document.write("<link rel=\"icon\" href=\"" + appBaseUrlPath + appAssetsRelativeUrlPath + "favicon.ico\">");</script>
</head></html>`;
const NO_FAVICON_DATA = String.raw`<html><head>
  <meta property="og:title" content="og-title"/> 
</head></html>`;

let origGet;
beforeEach(() => {
  origGet = UU5.Common.Request.get;
  UU5.Common.Request.get = jest.fn(async () => ({ data: await MIXED_DATA }));
});
afterEach(() => {
  UU5.Common.Request.get = origGet;

  UU5.Bricks.RichLink.cache = {};
});

describe(`UU5.Bricks.RichLink`, () => {
  UU5.Test.Tools.testProperties(UU5.Bricks.RichLink, CONFIG);

  let wrapper;
  it("should have proper content", async () => {
    UU5.Bricks.RichLink.cache = {};
    UU5.Common.Request.get.mockImplementationOnce(async () => ({ data: MIXED_DATA }));
    wrapper = mount(<UU5.Bricks.RichLink href="https://unicorn.com/" />);
    await wait();
    expect(wrapper.text()).toContain("og-title");
    expect(wrapper.text()).toContain("og-description");
    expect(wrapper.html()).toContain("og-image");
    expect(wrapper.html()).toContain("favicon.ico");

    UU5.Bricks.RichLink.cache = {};
    UU5.Common.Request.get.mockImplementationOnce(async () => ({ data: TWITTER_DATA }));
    wrapper = mount(<UU5.Bricks.RichLink href="https://unicorn.com/" />);
    await wait();
    expect(wrapper.text()).toContain("twitter-title");
    expect(wrapper.text()).toContain("twitter-description");
    expect(wrapper.html()).toContain("twitter-image");
    expect(wrapper.html()).toContain("favicon.ico");

    UU5.Bricks.RichLink.cache = {};
    UU5.Common.Request.get.mockImplementationOnce(async () => ({ data: ITEMPROP_DATA }));
    wrapper = mount(<UU5.Bricks.RichLink href="https://unicorn.com/" />);
    await wait();
    expect(wrapper.text()).not.toContain("title");
    expect(wrapper.text()).toContain("itemprop-description");
    expect(wrapper.html()).toContain("itemprop-image");
    expect(wrapper.html()).toContain("favicon.ico");

    UU5.Bricks.RichLink.cache = {};
    UU5.Common.Request.get.mockImplementationOnce(async () => ({ data: NO_IMAGE_DATA }));
    wrapper = mount(<UU5.Bricks.RichLink href="https://unicorn.com/" />);
    await wait();
    expect(wrapper.text()).toContain("og-title");
    expect(wrapper.text()).not.toContain("og-description");
    expect(wrapper.html()).not.toContain("og-image");
    expect(wrapper.html()).toContain("mdi-web"); // should display font icon
    expect(wrapper.html()).toContain("favicon.ico");

    // test favicon URLs and its heuristic for aliased uuApp-s
    UU5.Bricks.RichLink.cache = {};
    UU5.Common.Request.get.mockImplementationOnce(async () => ({ data: GUESS_BASE_URI_DATA }));
    wrapper = mount(<UU5.Bricks.RichLink href="https://uuos9.plus4u.net/uu-bookkitg01-main/0-1/get/uve" />);
    await wait();
    expect(wrapper.html()).toContain("https://uuos9.plus4u.net/uu-bookkitg01-main/0-1/public/favicon.ico");

    UU5.Bricks.RichLink.cache = {};
    UU5.Common.Request.get.mockImplementationOnce(async () => ({ data: GUESS_BASE_URI_DATA }));
    wrapper = mount(<UU5.Bricks.RichLink href="https://unicorn.com/" />); // should look like alias
    await wait();
    expect(wrapper.html()).toContain("https://unicorn.com/public/favicon.ico");

    UU5.Bricks.RichLink.cache = {};
    UU5.Common.Request.get.mockImplementationOnce(async () => ({ data: GUESS_BASE_URI_DATA }));
    wrapper = mount(<UU5.Bricks.RichLink href="https://unicorn.com/bla/bla/bla?code=1" />); // should look like alias
    await wait();
    expect(wrapper.html()).toContain("https://unicorn.com/public/favicon.ico");

    UU5.Bricks.RichLink.cache = {};
    UU5.Common.Request.get.mockImplementationOnce(async () => ({ data: NO_FAVICON_DATA }));
    wrapper = mount(<UU5.Bricks.RichLink href="https://unicorn.com/" />);
    await wait();
    expect(wrapper.html()).toContain("https://unicorn.com/favicon.ico");
  });
});
