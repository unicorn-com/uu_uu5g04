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

import Version from "../common/version.js";

describe("Version testing", () => {

  it("new 1.2.3", () => {
    let version = new Version("1.2.3");

    expect(version.major).toBe(1);
    expect(version.minor).toBe(2);
    expect(version.patch).toBe(3);
  });

  it("new 1.2.3-beta.1", () => {
    let version = new Version("1.2.3-beta.1");

    expect(version.major).toBe(1);
    expect(version.minor).toBe(2);
    expect(version.patch).toBe(3);
    expect(version.prerelease1).toBe("beta");
    expect(version.prerelease2).toBe(1);
  });

  it("new 1.2.3-beta.alpha", () => {
    let version = new Version("1.2.3-beta.alpha");

    expect(version.major).toBe(1);
    expect(version.minor).toBe(2);
    expect(version.patch).toBe(3);
    expect(version.prerelease1).toBe("beta");
    expect(version.prerelease2).toBe("alpha");
  });

  it("new 1.2.3-beta.alpha.1", () => {
    let version = new Version("1.2.3-beta.alpha.1");

    expect(version.major).toBe(1);
    expect(version.minor).toBe(2);
    expect(version.patch).toBe(3);
    expect(version.prerelease1).toBe("beta");
    expect(version.prerelease2).toBe("alpha");
    expect(version.prerelease3).toBe(1);
  });

  it("new 1.2.3-rc.1", () => {
    let version = new Version("1.2.3-rc.1");

    expect(version.major).toBe(1);
    expect(version.minor).toBe(2);
    expect(version.patch).toBe(3);
    expect(version.prerelease1).toBe("rc");
    expect(version.prerelease2).toBe(1);
  });

  it("compare major", () => {
    expect(Version.compare(new Version("1.2.3"), new Version("1.2.3"))).toBe(0);

    expect(Version.compare(new Version("2.1.3"), new Version("1.2.3"))).toBe(1);
    expect(Version.compare(new Version("12.1.3-alpha"), new Version("3.2.3-alpha"))).toBe(1);
    expect(Version.compare(new Version("2.1.3-alpha.beta"), new Version("1.2.3-alpha.beta"))).toBe(1);
    expect(Version.compare(new Version("2.1.3-alpha.beta.1"), new Version("1.2.3-alpha.beta.1"))).toBe(1);
    expect(Version.compare(new Version("2.1.3-rc.1"), new Version("1.2.3-rc.1"))).toBe(1);

    expect(Version.compare(new Version("1.2.3"), new Version("2.1.3"))).toBe(-1);
    expect(Version.compare(new Version("1.2.3-alpha"), new Version("2.1.3-alpha"))).toBe(-1);
    expect(Version.compare(new Version("1.2.3-alpha.beta"), new Version("2.1.3-alpha.beta"))).toBe(-1);
    expect(Version.compare(new Version("1.2.3-alpha.beta.1"), new Version("2.1.3-alpha.beta.1"))).toBe(-1);
    expect(Version.compare(new Version("1.2.3-rc.1"), new Version("2.1.3-rc.1"))).toBe(-1);
  });

  it("compare minor", () => {
    expect(Version.compare(new Version("1.2.3"), new Version("1.1.3"))).toBe(1);
    expect(Version.compare(new Version("1.12.3-alpha"), new Version("1.3.3-alpha"))).toBe(1);
    expect(Version.compare(new Version("1.2.3-alpha.beta"), new Version("1.1.3-alpha.beta"))).toBe(1);
    expect(Version.compare(new Version("1.2.3-alpha.beta.1"), new Version("1.1.3-alpha.beta.1"))).toBe(1);
    expect(Version.compare(new Version("1.2.3-rc.1"), new Version("1.1.3-rc.1"))).toBe(1);

    expect(Version.compare(new Version("1.2.3"), new Version("1.3.3"))).toBe(-1);
    expect(Version.compare(new Version("1.2.3-alpha"), new Version("1.3.3-alpha"))).toBe(-1);
    expect(Version.compare(new Version("1.2.3-alpha.beta"), new Version("1.31.3-alpha.beta"))).toBe(-1);
    expect(Version.compare(new Version("1.2.3-alpha.beta.1"), new Version("1.3.3-alpha.beta.1"))).toBe(-1);
    expect(Version.compare(new Version("1.2.3-rc.1"), new Version("1.3.3-rc.1"))).toBe(-1);
  });

  it("compare patch", () => {
    expect(Version.compare(new Version("1.1.3"), new Version("1.1.2"))).toBe(1);
    expect(Version.compare(new Version("1.1.3-alpha"), new Version("1.1.2-alpha"))).toBe(1);
    expect(Version.compare(new Version("1.1.13-alpha.beta"), new Version("1.1.2-alpha.beta"))).toBe(1);
    expect(Version.compare(new Version("1.1.3-alpha.beta.1"), new Version("1.1.2-alpha.beta.1"))).toBe(1);
    expect(Version.compare(new Version("1.1.3-rc.1"), new Version("1.1.2-rc.5"))).toBe(1);

    expect(Version.compare(new Version("1.1.3"), new Version("1.1.5"))).toBe(-1);
    expect(Version.compare(new Version("1.1.3-alpha"), new Version("1.1.5-alpha"))).toBe(-1);
    expect(Version.compare(new Version("1.1.3-alpha.beta"), new Version("1.1.13-alpha.beta"))).toBe(-1);
    expect(Version.compare(new Version("1.1.3-alpha.beta.1"), new Version("1.1.5-alpha.beta.1"))).toBe(-1);
    expect(Version.compare(new Version("1.1.3-rc.1"), new Version("1.1.5-rc.1"))).toBe(-1);
  });

  it("compare prerelease1", () => {
    expect(Version.compare(new Version("1.2.3-alpha"), new Version("1.2.3-alpha"))).toBe(0);

    expect(Version.compare(new Version("1.2.3-alpha"), new Version("1.2.3-beta"))).toBe(-1);
    expect(Version.compare(new Version("1.2.3-beta"), new Version("1.2.3-alpha"))).toBe(1);
    expect(Version.compare(new Version("1.2.3-1"), new Version("1.2.3-beta"))).toBe(1);
    expect(Version.compare(new Version("1.2.3-beta"), new Version("1.2.3-1"))).toBe(-1);
    expect(Version.compare(new Version("1.2.3-2"), new Version("1.2.3-1"))).toBe(1);
    expect(Version.compare(new Version("1.2.3-2"), new Version("1.2.3-11"))).toBe(-1);
  });

  it("compare prerelease2", () => {
    expect(Version.compare(new Version("1.2.3-alpha.beta"), new Version("1.2.3-alpha.beta"))).toBe(0);

    expect(Version.compare(new Version("1.2.3-beta.alpha"), new Version("1.2.3-beta.beta"))).toBe(-1);
    expect(Version.compare(new Version("1.2.3-beta.beta"), new Version("1.2.3-beta.alpha"))).toBe(1);
    expect(Version.compare(new Version("1.2.3-beta.1"), new Version("1.2.3-beta.beta"))).toBe(1);
    expect(Version.compare(new Version("1.2.3-beta.beta"), new Version("1.2.3-beta.1"))).toBe(-1);
    expect(Version.compare(new Version("1.2.3-beta.2"), new Version("1.2.3-beta.1"))).toBe(1);
    expect(Version.compare(new Version("1.2.3-beta.2"), new Version("1.2.3-beta.11"))).toBe(-1);
    expect(Version.compare(new Version("1.2.3-1.2"), new Version("1.2.3-1.11"))).toBe(-1);
  });

  it("compare prerelease3", () => {
    expect(Version.compare(new Version("1.2.3-alpha.beta.1"), new Version("1.2.3-alpha.beta.1"))).toBe(0);

    expect(Version.compare(new Version("1.2.3-1.beta.alpha"), new Version("1.2.3-1.beta.beta"))).toBe(-1);
    expect(Version.compare(new Version("1.2.3-1.beta.beta"), new Version("1.2.3-1.beta.alpha"))).toBe(1);
    expect(Version.compare(new Version("1.2.3-1.beta.1"), new Version("1.2.3-1.beta.beta"))).toBe(1);
    expect(Version.compare(new Version("1.2.3-1.beta.beta"), new Version("1.2.3-1.beta.1"))).toBe(-1);
    expect(Version.compare(new Version("1.2.3-1.beta.2"), new Version("1.2.3-1.beta.1"))).toBe(1);
    expect(Version.compare(new Version("1.2.3-1.beta.2"), new Version("1.2.3-1.beta.11"))).toBe(-1);
    expect(Version.compare(new Version("1.2.3-1.1.2"), new Version("1.2.3-1.1.11"))).toBe(-1);
  });
});
