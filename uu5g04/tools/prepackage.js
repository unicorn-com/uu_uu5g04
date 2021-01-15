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

const fs = require("fs");

async function run() {
  // remove uu5g05 from externals (it must not be in .tgz's package.json)
  console.log("Fixing externals for 'package' step.");
  let pkgJson = JSON.parse(fs.readFileSync("package.json", "utf-8"));
  delete pkgJson.uuBuildSettings.externals.uu5g05;
  fs.writeFileSync("package.json", JSON.stringify(pkgJson, null, 2) + "\n", "utf-8");
}

run();
