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

const fs = require("fs-extra");
const path = require("path");

let pkg = require("../package.json");

async function run() {
  // add extra items to library descriptor
  console.log("Replacing library descriptor file.");
  let { version } = pkg;
  let descriptorFiles = fs.readdirSync("target").filter(name => name.indexOf("-uu5libraryregistry-" + version) !== -1);
  descriptorFiles.sort();
  let descriptorFileName = path.join("target", descriptorFiles[descriptorFiles.length - 1]); // take last (with highest timestamp, if version is "beta")
  let genDescriptor = JSON.parse(fs.readFileSync(descriptorFileName, "utf-8"));
  let item = genDescriptor[0];

  let descriptor = [
    {
      ...item,
      "code": "UU5.Bricks",
      "name": "uu5g04-bricks",
      "desc": {
        "cs": "<uu5string/>UU5.Bricks je modul knihovny <UU5.Bricks.LinkUU5 />, který obsahuje základní komponenty pro vývoj uživatelského rozhraní. Knihovna <UU5.Bricks.LinkUU5 /> je postavena na HTML5 a Javascriptu a integruje populární webové frameworky React a Material Design. Je zaměřena na vývoj responzivních mobile-first aplikací, které pro každé zařízení přizpůsobí své uživatelské rozhraní tak, aby byl uživatelský zážitek excelentní a srovnatelný s nativní aplikací pro danou platformu.",
        "en": "<uu5string/>UU5.Bricks is a module of <UU5.Bricks.LinkUU5 /> library that contains basic components for user interface development. Library <UU5.Bricks.LinkUU5 /> is based on HTML5 and Javascript and integrates popular web frameworks, React and Material Design. The main purpose of UU5 is to develop responsive mobile-first applications that are able to adjust their user interface for every device in a way to make user experience the best possible and comparable with a native application for a given platform."
      },
      "source": "https://cdn.plus4u.net/uu-uu5g04/%s/uu5g04-bricks.min.js",
      "versionList": [
        {
          "dependencyMap": {
            "uu5g04": item.versionList[0].dependencyMap["uu5g04"]
          },
          version
        }
      ]
    },
    {
      ...item,
      "code": "UU5.BricksEditable",
      "name": "uu5g04-bricks-editable",
      "desc": {
        "cs": "<uu5string/>UU5.BricksEditable je modul knihovny <UU5.Bricks.LinkUU5 />, který obsahuje editační módy pro základní komponenty pro vývoj uživatelského rozhraní. Knihovna <UU5.Bricks.LinkUU5 /> je postavena na HTML5 a Javascriptu a integruje populární webové frameworky React a Material Design. Je zaměřena na vývoj responzivních mobile-first aplikací, které pro každé zařízení přizpůsobí své uživatelské rozhraní tak, aby byl uživatelský zážitek excelentní a srovnatelný s nativní aplikací pro danou platformu.",
        "en": "<uu5string/>UU5.BricksEditable is a module of <UU5.Bricks.LinkUU5 /> library that contains editation modes for basic components for user interface development. Library <UU5.Bricks.LinkUU5 /> is based on HTML5 and Javascript and integrates popular web frameworks, React and Material Design. The main purpose of UU5 is to develop responsive mobile-first applications that are able to adjust their user interface for every device in a way to make user experience the best possible and comparable with a native application for a given platform."
      },
      "source": "https://cdn.plus4u.net/uu-uu5g04/%s/uu5g04-bricks-editable.min.js",
      "dependencyMap": {},
      "versionList": [
        {
          "dependencyMap": {
            "uu5g04": item.versionList[0].dependencyMap["uu5g04"],
            "uu5g04-bricks": item.versionList[0].dependencyMap["uu5g04-bricks"],
            "uu5g04-forms": item.versionList[0].dependencyMap["uu5g04-forms"]
          },
          version
        }
      ]
    },
    {
      ...item,
      "code": "UU5.Forms",
      "name": "uu5g04-forms",
      "desc": {
        "cs": "<uu5string/>UU5.Forms je modul knihovny <UU5.Bricks.LinkUU5 />, který obsahuje základní formuláře a formulářové komponenty pro vývoj uživatelského rozhraní. Knihovna <UU5.Bricks.LinkUU5 /> je postavena na HTML5 a Javascriptu a integruje populární webové frameworky React a Material Design. Je zaměřena na vývoj responzivních mobile-first aplikací, které pro každé zařízení přizpůsobí své uživatelské rozhraní tak, aby byl uživatelský zážitek excelentní a srovnatelný s nativní aplikací pro danou platformu.",
        "en": "<uu5string/>UU5.Forms is a module of <UU5.Bricks.LinkUU5 /> library that contains basic forms and form's components for user interface development. Library <UU5.Bricks.LinkUU5 /> is based on HTML5 and Javascript and integrates popular web frameworks, React and Material Design. The main purpose of UU5 is to develop responsive mobile-first applications that are able to adjust their user interface for every device in a way to make user experience the best possible and comparable with a native application for a given platform."
      },
      "source": "https://cdn.plus4u.net/uu-uu5g04/%s/uu5g04-forms.min.js",
      "versionList": [
        {
          "dependencyMap": {
            "uu5g04": item.versionList[0].dependencyMap["uu5g04"],
            "uu5g04-bricks": item.versionList[0].dependencyMap["uu5g04-bricks"]
          },
          version
        }
      ]
    }
  ];
  fs.writeFileSync(descriptorFileName, JSON.stringify(descriptor, null, 2), "utf-8");
}

if (!process.env.WATCH) run();
