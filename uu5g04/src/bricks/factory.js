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
import * as UU5 from "uu5g04";
import ns from "./bricks-ns.js";
import Link from "./link";

import "./factory.less";
//@@viewOff:imports

export const Factory = {
  createTag: function (tag, uu5Name, className, defaultContent, levelFrom, levelTo) {
    let nestingLevelList = UU5.Environment.getNestingLevelList(levelFrom, levelTo);
    let mainClassName = ns.css((uu5Name || tag).toLowerCase()) + (className ? " " + className : "");
    let statics = {
      displayName: uu5Name || tag,
      nestingLevel: nestingLevelList,
    };

    // eslint-disable-next-line uu5/base-mixin
    return UU5.Common.VisualComponent.create({
      displayName: uu5Name || tag,
      //@@viewOn:mixins
      //@@viewOff:mixins

      //@@viewOn:statics
      statics: {
        tagName: ns.name(uu5Name || tag),
      },
      //@@viewOff:statics

      //@@viewOn:propTypes
      propTypes: {
        ref_: UU5.PropTypes.oneOfType([UU5.PropTypes.func, UU5.PropTypes.shape({ current: UU5.PropTypes.any })]),
      },
      //@@viewOff:propTypes

      //@@viewOn:getDefaultProps
      getDefaultProps: function () {
        return {
          ref_: null,
        };
      },
      //@@viewOff:getDefaultProps

      //@@viewOn:reactLifeCycle
      // TODO: uncomment when uuDCC will be ready to work with components without BaseMixin
      // componentDidMount: function() {
      //   if (
      //     typeof this.props.ref_ === "function" ||
      //     (typeof this.props.ref_ === "object" && this.props.ref_ !== null)
      //   ) {
      //     if ("current" in this.props.ref_) {
      //       this.props.ref_.current = this;
      //     } else {
      //       this.props.ref_(this);
      //     }
      //   }
      // },
      //@@viewOff:reactLifeCycle

      //@@viewOn:interface
      //@@viewOff:interface

      //@@viewOn:overriding
      //@@viewOff:overriding

      //@@viewOn:private
      //@@viewOff:private

      //@@viewOn:render
      render: function () {
        let nestingLevel = UU5.Utils.NestingLevel.getNestingLevel(this.props, statics);
        return nestingLevel
          ? UU5.Common.Element.create(
              tag.toLowerCase(),
              UU5.Common.VisualComponent.getAttrs(this.props, mainClassName),
              UU5.Utils.Content.getChildren(this.props.content || this.props.children, this.props, statics) ||
                defaultContent ||
                null
            )
          : null;
      },
      //@@viewOff:render
    });
  },
  createLink: function (uu5Name, href, defaultContent, target) {
    let nestingLevelList = ["inline"];
    let mainClassName = ns.css("link") + uu5Name.toLowerCase();
    let tagName = "UU5.Bricks.Link" + uu5Name;
    let statics = {
      displayName: tagName,
      nestingLevel: nestingLevelList,
    };
    if (!defaultContent) defaultContent = uu5Name;

    // eslint-disable-next-line uu5/base-mixin
    return UU5.Common.VisualComponent.create({
      //@@viewOn:mixins
      //@@viewOff:mixins

      //@@viewOn:statics
      statics: {
        tagName,
      },
      //@@viewOff:statics

      //@@viewOn:propTypes
      //@@viewOff:propTypes

      //@@viewOn:getDefaultProps
      //@@viewOff:getDefaultProps

      //@@viewOn:reactLifeCycle
      //@@viewOff:reactLifeCycle

      //@@viewOn:interface
      //@@viewOff:interface

      //@@viewOn:overriding
      //@@viewOff:overriding

      //@@viewOn:private
      //@@viewOff:private

      //@@viewOn:render
      render: function () {
        let nestingLevel = UU5.Utils.NestingLevel.getNestingLevel(this.props, statics);

        return nestingLevel ? (
          <Link
            {...this.props}
            href={href}
            target={target || "_blank"}
            nestingLevel={nestingLevel}
            className={[mainClassName, this.props.className].filter(Boolean).join(" ")}
          >
            {this.props.children || defaultContent}
          </Link>
        ) : null;
      },
      //@@viewOff:render
    });
  },
};

export const Div = UU5.Common.Div;

export const P = Factory.createTag("P", null, null, null, "smallBox", "smallBox"); //smallBox,smallBox

export const Paragraph = Factory.createTag(
  "p",
  "Paragraph",
  null,
  "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos hymenaeos. Donec ipsum massa, ullamcorper in, auctor et, scelerisque sed, est. Vestibulum fermentum tortor id mi. Etiam commodo dui eget wisi. Integer malesuada. Fusce consectetuer risus a nunc. Nullam eget nisl. In sem justo, commodo ut, suscipit at, pharetra vitae, orci. Aenean placerat. Etiam neque. Fusce suscipit libero eget elit.",
  "smallBox",
  "smallBox"
);

export const Small = Factory.createTag("Small", null, null, null, "inline"); //inline
export const Lead = Factory.createTag("span", "Lead", "lead", "inline"); //inline
export const Del = Factory.createTag("Del", null, null, null, "inline"); //inline
export const S = Factory.createTag("S", null, null, null, "inline"); //inline
export const Ins = Factory.createTag("Ins", null, null, null, "inline"); //inline
export const U = Factory.createTag("U", null, null, null, "inline"); //inline
export const Strong = Factory.createTag("Strong", null, null, null, "inline"); //inline
export const Em = Factory.createTag("Em", null, null, null, "inline"); //inline
export const Abbr = Factory.createTag("Abbr", null, null, null, "inline"); //inline
export const Address = Factory.createTag("Address", null, null, null, "inline"); //inline
export const Dd = Factory.createTag("Dd", null, null, null, "smallBox", "smallBox"); //smallBox,smallBox
export const Dt = Factory.createTag("Dt", null, null, null, "smallBox", "smallBox"); //smallBox,smallBox

// code
export const Var = Factory.createTag("Var", null, null, null, "inline"); //inline
export const Kbd = Factory.createTag("Kbd", null, null, null, "inline"); //inline
export const Pre = Factory.createTag("Pre", null, ns.css("pre"), null, "boxCollection", "inline"); //boxCollection,inline
export const Samp = Factory.createTag("Samp", null, null, null, "inline"); //inline

export const LinkUnicorn = Factory.createLink("Unicorn", "http://unicorn.com", "Unicorn");
export const LinkUnicornSystems = Factory.createLink(
  "UnicornSystems",
  "http://unicornsystems.eu",
  "Unicorn\u00a0Systems"
);
export const LinkUnicornUniverse = Factory.createLink(
  "UnicornUniverse",
  "https://unicornuniverse.eu",
  "Unicorn\u00a0Universe"
);
export const LinkUnicornUniversity = Factory.createLink(
  "UnicornUniversity",
  "https://unicornuniversity.net",
  "Unicorn\u00a0University"
);
export const LinkUnicornCollege = LinkUnicornUniversity;

let docKitUrl = "https://docs.plus4u.net/";
let bookKitUrl = "https://uuapp.plus4u.net/uu-bookkit-maing01/";
export const LinkUAF = Factory.createLink("UAF", docKitUrl + "uaf", "UAF");
export const LinkUuApp = Factory.createLink(
  "UuApp",
  docKitUrl + "uaf/uuapp",
  "uuApp"
);
export const LinkUU5 = Factory.createLink("UU5", docKitUrl + "uaf/uuapp/uu5", "uu5");
export const LinkUuPlus4U5 = Factory.createLink(
  "UuPlus4U5",
  docKitUrl + "uaf/uuapp/plus4u5",
  "uuPlus4U5"
);
export const LinkUuAppLibraryRegistry = Factory.createLink(
  "LinkUuAppLibraryRegistry",
  bookKitUrl + "d7a56a17285748f7a5a743898958af23",
  "uuAppLibraryRegistry"
);
export const LinkUu5LibraryRegistry = LinkUuAppLibraryRegistry;
export const LinkUu5ComponentRegistry = LinkUu5LibraryRegistry;
export const LinkUu5CodeKit = Factory.createLink(
  "Uu5CodeKit",
  bookKitUrl + "f2142743693e4b22b1753c9fb761e945",
  "uu5CodeKit"
);
export const LinkUuAppServer = Factory.createLink(
  "UuAppServer",
  docKitUrl + "uaf/uuapp/uuappserver",
  "uuAppServer"
);
export const LinkUuAppServerJava = Factory.createLink(
  "UuAppServerJava",
  bookKitUrl + "99c939a08e0849c68df5ee339c94054b",
  "uuAppServer-Java"
);
export const LinkUuOIDC = Factory.createLink(
  "UuOIDC",
  bookKitUrl + "d684156f06004f2781c88777e74834ef",
  "uuOIDC"
);
export const LinkUuCloud = Factory.createLink(
  "UuCloud",
  docKitUrl + "uaf/uuapp/uucloud",
  "uuCloud"
);
export const LinkUuBookKit = Factory.createLink(
  "UuBookKit",
  bookKitUrl + "e3f5c648e85f4319bd8fc25ea5be6c2c",
  "uuBookKit"
);
export const LinkUuDocKit = Factory.createLink(
  "UuDocKit",
  bookKitUrl + "e3f5c648e85f4319bd8fc25ea5be6c2c",
  "uuDocKit"
);
export const LinkUuBmlDraw = Factory.createLink(
  "UuBmlDraw",
  bookKitUrl + "6f64aebc07184e9088d6e0542a8f9682",
  "uuBmlDraw"
);
export const LinkUuKnowledgeBase = Factory.createLink(
  "UuKnowledgeBase",
  docKitUrl,
  "uuKnowledgeBase "
);
export const LinkUuP = Factory.createLink(
  "LinkUuP",
  bookKitUrl + "c86acb9189cb421892546005a1099ea7",
  "uuP"
);
export const LinkUUP = LinkUuP;
export const LinkMyTerritory = Factory.createLink("LinkMyTerritory", "https://unicorn.com", "My Territory");
export const LinkUuMT = Factory.createLink("LinkUuMT", "https://unicorn.com", "uuMT");
export const LinkBusinessTerritory = Factory.createLink(
  "LinkBusinessTerritory",
  "https://unicorn.com",
  "Business Territory"
);
export const LinkUuBT = Factory.createLink("LinkUuBT", "https://unicorn.com", "uuBT");
export const LinkUnicornApproach = Factory.createLink(
  "LinkUnicornApproach",
  bookKitUrl + "c86acb9189cb421892546005a1099ea7/book/page?code=22504990",
  "Unicorn\u00a0Approach"
);

// export const LinkUUIoT = Factory.createLink("UUIoT", docKitUrl + "84723967990075193-18171658587168657/book", "uuIoT");
// export const LinkUUBT = Factory.createLink("UUBT", docKitUrl + "84723967990075193-38780273195993502/book", "uuBT");
// export const LinkUUMT = Factory.createLink("UUMT", docKitUrl + "84723967990075193-12401017776126880/book", "uuMT");

export const LinkPlus4U = Factory.createLink("Plus4U", "https://plus4u.net", "Plus4U");
export const LinkBootstrap = Factory.createLink("Bootstrap", "http://getbootstrap.com", "Bootstrap");
export const LinkW3Schools = Factory.createLink("w3schools", "http://www.w3schools.com", "w3schools");
export const LinkHTML5 = Factory.createLink("HTML5", "http://www.w3schools.com/html/default.asp", "Html5");
export const LinkHTML = LinkHTML5;
export const LinkCSS = Factory.createLink("CSS", "http://www.w3schools.com/css/default.asp", "CSS");
export const LinkJavaScript = Factory.createLink("JavaScript", "http://www.w3schools.com/js/default.asp", "JavaScript");
export const LinkJQuery = Factory.createLink("JQuery", "https://jquery.com", "JQuery");
export const LinkReact = Factory.createLink("React", "https://reactjs.org", "React");
export const LinkRuby = Factory.createLink("Ruby", "https://www.ruby-lang.org", "Ruby");
export const LinkPuma = Factory.createLink("Puma", "http://puma.io", "Puma");
export const LinkDocker = Factory.createLink("Docker", "https://www.docker.com", "Docker");
export const LinkMSAzure = Factory.createLink("MSAzure", "https://azure.microsoft.com", "Microsoft\u00a0Azure");
export const LinkMongoDB = Factory.createLink("MongoDB", "https://www.mongodb.com", "MongoDB");
export const LinkMaterialDesign = Factory.createLink("MaterialDesign", "https://material.io", "Material\u00a0Design");
export const LinkNodeJs = Factory.createLink("NodeJs", "https://nodejs.org", "NodeJs");

export default Factory;
