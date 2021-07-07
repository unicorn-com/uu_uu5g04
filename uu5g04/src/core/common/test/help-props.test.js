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

let origRequestCall;
beforeEach(() => {
  origRequestCall = UU5.Common.Request.call;

  let data = {
    id: "5ad8c6042a8c4d00051c8201",
    code: "UU5.Bricks.Button",
    name: "Button",
    versionSince: "1.0.0",
    imageUri: "https://uuos9.plus4u.net/uu-dockitg01-main/78462435-ed11ec379073476db0aa295ad6c00178/...",
    awid: "fe96c133c895434bbd4d5b24831483f3",
    sys: { cts: "2018-04-19T16:38:28.917Z", mts: "2018-04-19T16:38:28.917Z", rev: 0 },
    uuAppErrorMap: {},
  };
  let docUriPrefix =
    "https://uuos9.plus4u.net/uu-dockitg01-main/78462435-ed11ec379073476db0aa295ad6c00178/book/page?code=";
  UU5.Common.Request.call = jest.fn(async (method, url) =>
    url.indexOf("Nonexisting") === -1
      ? {
          status: 200,
          data: {
            ...data,
            docUri: docUriPrefix + url.split("?code=")[1].replace(/\./g, ""),
          },
        }
      : {
          status: 400,
          data: {
            uuAppErrorMap: {
              "uu-applibraryregistry-main/component/get/componentDoesNotExist": {
                id: "5d5aaa85394df98dd3c5890311292094",
                timestamp: "2021-02-10T21:41:11.951Z",
                type: "error",
                message: "Component does not exist.",
                paramMap: { code: url.split("?code=")[1] },
              },
            },
          },
        }
  );
});
afterEach(() => {
  UU5.Common.Request.call = origRequestCall;
});

const CONFIG = {
  mixins: [
    "UU5.Common.BaseMixin",
    "UU5.Common.ElementaryMixin",
    "UU5.Common.ContentMixin",
    "UU5.Common.PureRenderMixin",
  ],
  props: {
    tagName: {
      values: ["UU5.Bricks.Button", "UU5.Bricks.Image", "UU5.Bricks.Nonexisting"],
    },
    target: {
      values: ["_blank", "_parent", "_top", "_self"],
    },
  },
  requiredProps: {
    tagName: "UU5.Bricks.Button",
  },
  opt: {},
};

describe(`UU5.Common.Help component props testing`, () => {
  UU5.Test.Tools.testProperties(UU5.Common.Help, CONFIG);
});
