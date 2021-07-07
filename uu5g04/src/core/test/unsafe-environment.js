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

// This is a Jest environment, which allows executing of arbitrary
// <script src="..."> elements (such as Google API, ...) within test pages.
//
// WARNING Tests using this environment should not be allowed to be run on CI servers
// because any such <script src="..."> will be fully executed in NodeJS environment,
// having access to file system, ...
//
// https://facebook.github.io/jest/docs/en/configuration.html#testenvironment-string
// Use it by including following comment in the test file:
/**
 * @jest-environment <rootDir>/src/core/test/unsafe-environment.js
 */

const JsdomEnvironment = require("jest-environment-jsdom");

module.exports = class UnsafeEnvironment extends JsdomEnvironment {
  constructor(config) {
    let cfg = Object.assign({}, config);
    if (!cfg.testEnvironmentOptions) cfg.testEnvironmentOptions = {};
    Object.assign(cfg.testEnvironmentOptions, {
      resources: "usable",
      runScripts: "dangerously",
    });
    super(cfg);
  }
};
