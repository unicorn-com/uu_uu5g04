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

import React from "react";
import UU5 from "uu5g04";
import "uu5g04-bricks";
import "uu5g04-bricks";
import "uu5g04-forms";

describe("UU5.Common.Url - test interface of instance", () => {
  it("test01 - parse().toString()", () => {
    let myUrl = UU5.Common.Url.parse("http://example.com:3000/pathname/?search=test#hash");
    expect(myUrl.toString()).toEqual("http://example.com:3000/pathname/?search=test#hash");

    myUrl = UU5.Common.Url.parse("https://example.com/?search=test#hash");
    expect(myUrl.toString()).toEqual("https://example.com/?search=test#hash");

    myUrl = UU5.Common.Url.parse("https://example.com/");
    expect(myUrl.toString()).toEqual("https://example.com/");

    myUrl = UU5.Common.Url.parse("https://example.com/a#b");
    expect(myUrl.toString()).toEqual("https://example.com/a#b");

    myUrl = UU5.Common.Url.parse("https://example.com/#b");
    expect(myUrl.toString()).toEqual("https://example.com/#b");
  });

  it("test02 - encodeValue(String)", () => {
    let myUrl = UU5.Common.Url.encodeValue("John Smith");
    expect(myUrl).toMatch(/John%20Smith/);
  });

  it("test03 - encodeValue(Object)", () => {
    const mockObject = {
      name: "john",
      surname: "smith",
    };
    let myUrl = UU5.Common.Url.encodeValue(mockObject);
    expect(myUrl).toMatch(/%7B%22name%22%3A%22john%22%2C%22surname%22%3A%22smith%22%7D/);
  });

  it("test04 - encodeValue(Array)", () => {
    const mockArray = ["John", "Smith"];
    let myUrl = UU5.Common.Url.encodeValue(mockArray);
    expect(myUrl).toMatch(/%5B%22John%22%2C%22Smith%22%5D/);
  });

  it("test05 - Url.encodeQuery(Object)", () => {
    let myUrl = UU5.Common.Tools.encodeQuery({ name: "John", surname: "Smith" });
    expect(myUrl).toEqual("?name=John&surname=Smith");
  });

  it("test06 - Url.decodeValue(value)", () => {
    let mockString = "John%20Smith";
    let mockObject = "%7B%22name%22%3A%22john%22%2C%22surname%22%3A%22smith%22%7D";
    let mockArray = "%5B%22John%22%2C%22Smith%22%5D";
    expect(UU5.Common.Url.decodeValue(mockString)).toMatch(/John Smith/);
    expect(UU5.Common.Url.decodeValue(mockObject)).toEqual(
      expect.objectContaining({
        name: "john",
        surname: "smith",
      })
    );
    expect(UU5.Common.Url.decodeValue(mockArray)).toEqual(expect.arrayContaining(["John", "Smith"]));
  });

  it("test07 - Url.decodeQuery(query)", () => {
    let myUrl = UU5.Common.Url.decodeQuery("name=John&surname=Smith");
    expect(myUrl).toEqual(
      expect.objectContaining({
        name: "John",
        surname: "Smith",
      })
    );
  });
});

let setObject = {
  protocol: "https",
  hostName: "plus4u.net",
  port: "1234",
  pathName: "/uu5/doc/e00.html",
  parameters: { name: "John", age: 18 },
  hash: "anchor",
};

describe("UU5.Common.Url - test interface of class", () => {
  //NOTE: HP-15 - New instance should have null props
  it("test01 - new() - should create new empty instance", () => {
    const Url = UU5.Common.Url;
    const url1 = new Url();
    //parameters of instance should be empty after created.
    expect(url1.protocol).toBe(null);
    expect(url1.hostName).toBe(null);
    expect(url1.port).toBe(null);
    expect(url1.host).toBe(null);
    expect(url1.origin).toBe(null);
    expect(url1.pathName).toBe(null);
    expect(url1.baseName).toBe(null);
    expect(url1.useCase).toBe(null);
    expect(url1.parameters).toBe(null);
    expect(url1.hash).toBe(null);
  });

  it("test02 - set(params) + toString()", () => {
    const Url = UU5.Common.Url;
    const url1 = new Url();
    url1.set(setObject);
    expect(url1.toString()).toEqual("https://plus4u.net:1234/uu5/doc/e00.html?name=John&age=18#anchor");
  });

  it("test03 - get all params after set", () => {
    const Url = UU5.Common.Url;
    const url1 = new Url();
    url1.set(setObject);
    expect(url1.toString()).toEqual("https://plus4u.net:1234/uu5/doc/e00.html?name=John&age=18#anchor");
    expect(url1.protocol).toMatch(/https/);
    expect(url1.hostName).toMatch(/plus4u.net/);
    expect(url1.port).toMatch(/1234/);
    expect(url1.host).toMatch(/plus4u.net:1234/);
    expect(url1.origin).toEqual("https://plus4u.net:1234");
    expect(url1.pathName).toEqual("uu5/doc/e00.html");
    expect(url1.baseName).toBeNull();
    expect(url1.useCase).toBe("uu5/doc/e00.html");
    expect(url1.parameters).toEqual(
      expect.objectContaining({
        name: "John",
        age: 18,
      })
    );
    expect(url1.hash).toMatch(/anchor/);
  });

  it("test04 - useCase", () => {
    let url = new UU5.Common.Url.parse(
      "https://uuos9.plus4u.net/uu-bookkitg01-main/78462435-ed11ec379073476db0aa295ad6c00178/book"
    );
    expect(url.useCase).toBe("uu-bookkitg01-main/78462435-ed11ec379073476db0aa295ad6c00178/book");
    url.useCase = "book";
    expect(url.useCase).toBe("book");
    expect(url.toString()).toBe("https://uuos9.plus4u.net/book");

    let origGABP = UU5.Environment.getAppBasePath;
    UU5.Environment.getAppBasePath = () => "/a-b/c-d/";
    try {
      url = UU5.Common.Url.parse("http://example.com/a-b/c-d/book");
      expect(url.useCase).toBe("book");
      url.useCase = "my/book";
      expect(url.toString()).toBe("http://example.com/a-b/c-d/my/book");
      url.useCase = "";
      expect(url.toString()).toBe("http://example.com/a-b/c-d/");

      // special case when parsing URL which is baseUri with missing ending slash
      url = UU5.Common.Url.parse("http://example.com/a-b/c-d");
      expect(url.useCase).toBe("");
      expect(url.toString()).toBe("http://example.com/a-b/c-d");
    } finally {
      UU5.Environment.getAppBasePath = origGABP;
    }
  });

  it("test05 - join", () => {
    const test = {
      "https://a/b": ["https://a", "b"],
      "https://a/b2": ["https://a/", "b2"],
      "https://a/b3": ["https://a/", "/b3"],
      "https://a/b4": ["https://a/", "b4/"],
      "https://a/b5": ["https://a/", "/b5/"],
      "https://a/b6": ["https://a/", "/b6", "/"],
      "/aa/bb": ["/aa", "bb"],
      "/b": ["", "b"],
      "a/b": ["a", "b"],
      "https://ahoj/cau/aa/bb/cc/dd": ["https://ahoj", "cau", "/aa", "bb/", "/cc/", "/dd"],
    };

    for (let result in test) {
      expect(UU5.Common.Url.join(...test[result])).toBe(result);
    }
  });
});
