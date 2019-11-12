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

export class Version {
  /*
   * v1 > v2 => 1
   * v1 = v2 => 0
   * v1 < v2 => -1
   */
  static compare(v1, v2) {
    typeof v1 === "string" && (v1 = new Version(v1));
    typeof v2 === "string" && (v2 = new Version(v2));

    if (v1.major > v2.major) return 1;
    if (v1.major < v2.major) return -1;

    // same major
    if (v1.minor > v2.minor) return 1;
    if (v1.minor < v2.minor) return -1;

    // same minor
    if (v1.patch > v2.patch) return 1;
    if (v1.patch < v2.patch) return -1;

    // same patch
    let result = Version.checkPrerelease(v1.prerelease1, v2.prerelease1);
    if (result) return result;

    result = Version.checkPrerelease(v1.prerelease2, v2.prerelease2);
    if (result) return result;

    result = Version.checkPrerelease(v1.prerelease3, v2.prerelease3);
    if (result) return result;

    return 0;
  }

  static checkPrerelease(prerelease1, prerelease2) {
    if (prerelease1 === null && prerelease2 !== null) return 1;
    if (prerelease1 !== null && prerelease2 === null) return -1;

    // number vs text
    if (typeof prerelease1 === "number" && typeof prerelease2 !== "number") return 1;
    if (typeof prerelease1 !== "number" && typeof prerelease2 === "number") return -1;

    // just number
    if (typeof prerelease1 === "number" && typeof prerelease2 === "number") {
      if (prerelease1 > prerelease2) return 1;
      if (prerelease1 < prerelease2) return -1;
    }

    let pre1 = null;
    let pre2 = null;
    for (let i; i < Version.PRERELASE.length; i++) {
      let name = Version.PRERELASE[i];

      if (pre1 < 0 && new RegExp(`^${name}`).test(prerelease1)) pre1 = i;
      if (pre2 < 0 && new RegExp(`^${name}`).test(prerelease2)) pre2 = i;

      if (pre1 && pre2) break;
    }

    if (pre1 > pre2) return 1;
    if (pre1 < pre2) return -1;
    if (prerelease1 > prerelease2) return 1;
    if (prerelease1 < prerelease2) return -1;

    return 0;
  }

  constructor(version) {
    let matcher = version.match(new RegExp(`^(?:${Version.REGEX.source})$`));

    if (matcher) {
      this._major = +matcher[1];
      this._minor = +matcher[2];
      this._patch = +matcher[3];
      this._prerelease1 = /^\d+$/.test(matcher[4]) ? +matcher[4] : matcher[4] || null;
      this._prerelease2 = /^\d+$/.test(matcher[5]) ? +matcher[5] : matcher[5] || null;
      this._prerelease3 = /^\d+$/.test(matcher[6]) ? +matcher[6] : matcher[6] || null;
    } else {
      throw `Invalid version ${version}`;
    }
  }

  get major() {
    return this._major;
  }

  get minor() {
    return this._minor;
  }

  get patch() {
    return this._patch;
  }

  get prerelease1() {
    return this._prerelease1;
  }

  get prerelease2() {
    return this._prerelease2;
  }

  get prerelease3() {
    return this._prerelease3;
  }
}

Version.PRERELASE = ["alpha", "beta", "rc"];
Version.REGEX = /([0-9]+)\.([0-9]+)\.([0-9]+)(?:-([0-9A-Za-z-]+)(?:\.([0-9A-Za-z-]+))?(?:\.([0-9A-Za-z-]+))?)?/;

export default Version;
