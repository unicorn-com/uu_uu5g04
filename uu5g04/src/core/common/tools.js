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

import React from "react";
import { Utils } from "uu5g05";
import Environment from "../environment/environment.js";
import EnvTools from "../environment/tools.js";
import Context from "./context.js";
import Element from "./element.js";
import ScreenSize from "../utils/screen-size.js";
import Lsi from "../utils/lsi.js";
import DOM from "./dom.js";
import Url from "./url.js";
import { checkTag } from "../uu5g05-integration/use-dynamic-library-component.js";

export const REGEXP = {
  /** @deprecated Remove in 2.0.0. */
  attrs: /([-\w]+)(?:\s*=\s*(?:(?:"\s*(<uu5json\s*\/>(?:\\.|[^"])*?)")|(?:'\s*(<uu5json\s*\/>(?:\\.|[^'])*?)')|(?:"\s*(<uu5string\s*\/>(?:\\.|[^"])*?)")|(?:'\s*(<uu5string\s*\/>(?:\\.|[^'])*?)')|(?:"\s*(<uu5data\s*\/>(?:\\.|[^"])*?)")|(?:'\s*(<uu5data\s*\/>(?:\\.|[^'])*?)')|(?:"((?:\\.|[^"])*?)")|(?:'((?:\\.|[^'])*?)')|([^\s]+)))?/g,

  uu5string: /^\s*<uu5string\s*\/>/,
  uu5stringTemplate: /\${([0-9a-zA-Z.\-_]+)\s*(:\s*([0-9a-zA-Z.\-_ ()\[\]<>\\\/]+))?}/,
  uu5json: /^\s*<uu5json\s*\/>/,
  uu5data: /^\s*<uu5data\s*\/>/,
  slashes: /^.*[\\\/]/,
  char: /(\-[a-z])/g,
  mobile1: /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i,
  mobile2: /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i,
  xy: /[xy]/g,
  splitByWhiteSpace: /\s+/,
  whiteSpaces: /\s\s+/g,
  digitInBracket: /{(\d+)}/g,
  stringParamsArray: /%((%)|s|d)/g,
  stringParamsObject: /(\$\{[^}]+})/g,
  jsCode: /^(javascript:\s*)*/i,
  columnRegexp: /^((?:offset-)?[a-z]+)(?:-)?(\d+)$/,
  chrome: /Chrome\/[.0-9]*/,
  edge: /Edge\/[.0-9]*/,
  ie: /Trident\/[.0-9]*/,
  windowsPhone: /windows phone/i,
  android: /android/i,
  iPhone: /iPad|iPhone|iPod/,
  mobile: /(OS|Android|Windows Phone) (\d+[_\.]\d+)/,
  weekYear: /^(w+[^dmhHMSstTqz]*[yY]+)|([yY]+[^dmhHMSstTqz]*w+)$/,
  numberParts: /\B(?=(\d{3})+(?!\d))/g,
  isoTimeZone: /(Z|[+-](\d{2})\:(\d{2}))?$/,
};

let COMPONENT_NAME = String.raw`[-\w.]+`;
let ATTR = String.raw`([-\w]+)(?:\s*=\s*("(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|([^"'>\s/][^>\s/]*)))?`; // groups: attr name, attr value, indication whether without quotes
let TAG = String.raw`<(${COMPONENT_NAME})((?:\s+(?:${ATTR}))*)\s*(/)?>|</(${COMPONENT_NAME})>`; // groups: comp name, attrs, -, -, -, self-closing, closing tag
let ATTR_REGEXP = new RegExp(ATTR); // groups: see ATTR
let ATTR_VALUE_TYPE_REGEXP = new RegExp(
  String.raw`(${REGEXP.uu5json.source})|(${REGEXP.uu5string.source})|(${REGEXP.uu5data.source})|`
); // groups: uu5json, uu5string, uu5data
const TIME_FORMAT_AM = "AM";
const TIME_FORMAT_PM = "PM";
const TIME_FORMAT_12 = "12";
const TIME_FORMAT_24 = "24";

const COOKIE_CSRF_TOKEN = "uu.app.csrf";

export const Tools = {
  ELEVATIONS: {
    "-1": "inset 0 1px 5px 0 rgba(0,0,0,.14),inset 0 2px 4px 0 rgba(0,0,0,.3),inset 0 1px 5px 0 rgba(0,0,0,.15)",
    "1": "0 2px 2px 0 rgba(0,0,0,.14),0 3px 1px -2px rgba(0,0,0,.12),0 1px 5px 0 rgba(0,0,0,.2)",
    "2": "0 4px 5px 0 rgba(0,0,0,.14),0 1px 10px 0 rgba(0,0,0,.12),0 2px 4px -1px rgba(0,0,0,.2)",
    "3": "0 6px 10px 0 rgba(0,0,0,.14),0 1px 18px 0 rgba(0,0,0,.12),0 3px 5px -1px rgba(0,0,0,.2)",
    "4": "0 8px 10px 1px rgba(0,0,0,.14),0 3px 14px 2px rgba(0,0,0,.12),0 5px 5px -3px rgba(0,0,0,.2)",
    "5": "0 12px 17px 2px rgba(0,0,0,.14),0 5px 22px 4px rgba(0,0,0,.12),0 7px 8px -4px rgba(0,0,0,.2)",
  },
};

Tools.events = {
  lsi: "UU5_Common_LsiMixin_lsiEvent",
  highlight: "UU5_Bricks_TextCorrector_highlightEvent",
  dateTime: "UU5_Bricks_DateTime_event",
  number: "UU5_Bricks_Number_event",
};

Tools.screenSize = {
  xs: 480,
  s: 768,
  m: 992,
  l: 1360,
  xl: Infinity,
};

Tools.getPage = () => {
  return Environment.page;
};

Tools.checkTag = checkTag;

Tools.findComponent = (tag, props, content, error, onLoad) => {
  let newTag = tag;
  if (typeof tag === "object" && tag.tag) {
    newTag = tag.tag;
    props = tag.props;
  }
  props = props || {};

  let callOnLoad = typeof onLoad === "function";
  let result;
  let UU5 = window.UU5;
  // TODO: backward compatibility
  if (Environment.useComponentRegistry && Environment.useLibraryRegistry) {
    let fTag = Tools.checkTag(newTag, true);
    if (fTag) {
      result = Element.create(fTag, props, content);
      if (callOnLoad) onLoad(fTag);
    } else {
      let module = newTag.split(".");
      module.splice(-1, 1);

      if (
        module.length === 2 &&
        window[module[0]] &&
        window[module[0]][module[1]] &&
        Object.keys(window[module[0]][module[1]]).length
      ) {
        result = (
          <UU5.Common.NotFoundTag key={props.key} tagName={newTag} id={props.id} ref_={props.ref_} error={error} />
        );
        if (callOnLoad) onLoad(null, new Error(`Component ${newTag} has not been found.`));
      } else {
        result = (
          <UU5.Common.TagPlaceholder
            key={props.key}
            _tagName={newTag}
            _props={props}
            _content={content}
            _error={error}
            _fromFindComponent
            _onLoad={onLoad}
          />
        );
      }

      // let fModule = Tools.checkTag(module.join('.'), true);
      // result = fModule ? <UU5.Common.NotFoundTag tagName={tag} id={props.id} ref_={props.ref_} /> :
      //   <UU5.Common.TagPlaceholder _tagName={newTag} _props={props} _content={content} _fromFindComponent />;
    }
  } else {
    let component = Tools.checkTag(newTag, false);
    result = component ? (
      Element.create(component, props, content)
    ) : (
      <UU5.Common.NotFoundTag key={props.key} tagName={newTag} id={props.id} ref_={props.ref_} error={error} />
    );
    if (callOnLoad) {
      if (component) onLoad(component);
      else onLoad(null, new Error(`Component ${newTag} has not been found.`));
    }
  }

  return result;
};

// NOTE This is for "backward compatibility" in sense that some demo pages / tests override Tools.loadLibrary
// to be able to supply custom data for library registry.
let getLibrary;
let loadLibrary = (libraryName, callback) => {
  return (getLibrary || Utils.LibraryRegistry.getLibrary)(libraryName).then(callback, (e) => callback(undefined, e));
};
Object.defineProperty(Tools, "loadLibrary", {
  get: () => loadLibrary,
  set: (fn) => {
    loadLibrary = fn;
    getLibrary = Utils.LibraryRegistry.getLibrary;
    Utils.LibraryRegistry.getLibrary = async (namespace) => {
      return new Promise((resolve, reject) => {
        fn(namespace, (result, error) => (error != null ? reject(error) : resolve(result)));
      });
    };
  },
});

Tools.loadLibraryCache = {};

Tools.buildAttributes = function (attrsString) {
  Tools.warning("UU5.Common.Tools.buildAttributes is deprecated. Use UU5.Common.UU5String.buildAttributes instead.");

  let attrs = {};
  // !!!!! Never put attrsReg to constants, otherwise it gets stuck - because of exec method on regexp
  // group1 = attribute name
  // group2 = attribute value
  // group3 = indication that attribute value is not wrapped into quotes / single quotes
  let attrsReg = new RegExp(ATTR_REGEXP.source, "g");
  let matchAttrs = attrsReg.exec(attrsString);

  while (matchAttrs) {
    let name = matchAttrs[1];
    let value = true;
    let matchValue = matchAttrs[2];
    let isUnquoted = !!matchAttrs[3];

    if (isUnquoted) {
      if (matchValue === "true") {
        //true
        value = true;
      } else if (matchValue === "false") {
        //false
        value = false;
      } else if (isFinite(matchValue)) {
        //number
        value = +matchValue;
      } else {
        //any other -> null
        value = null;
      }
    } else if (matchValue != null) {
      // unescape quoted value
      if (matchValue[0] === "'") matchValue = matchValue.substr(1, matchValue.length - 2).replace(/\\([\\'])/g, "$1");
      else if (matchValue[0] === '"')
        matchValue = matchValue.substr(1, matchValue.length - 2).replace(/\\([\\"])/g, "$1");

      let matchValueType = matchValue.match(ATTR_VALUE_TYPE_REGEXP);
      if (matchValueType[1]) {
        //uu5JSON
        try {
          value = this.parseFromUu5JSON(matchValue);
        } catch (e) {
          e.context.prop = name;
          throw e;
        }
      } else if (matchValueType[2]) {
        //uu5String
        value = this.getChildrenFromUu5String(matchValue);
      } else if (matchValueType[3]) {
        //uu5Data
        value = this.parseFromUu5Data(matchValue);
      } else {
        //as-is
        if (name === "href") {
          matchValue = matchValue.replace(REGEXP.jsCode, "");
        }

        value = matchValue;
      }
    }
    attrs[name] = value;

    matchAttrs = attrsReg.exec(attrsString);
  }

  return attrs;
};

Tools.isUU5String = (uu5String) => {
  Tools.warning("UU5.Common.Tools.isUU5String is deprecated. Use UU5.Common.UU5String.isValid instead.");
  return typeof uu5String === "string" && !!uu5String.match(REGEXP.uu5string);
};

Tools.getChildrenFromUu5String = function (uu5String, opt) {
  Tools.warning("UU5.Common.Tools.getChildrenFromUu5String is deprecated. Use UU5.Common.UU5String instead.");

  // opt (Object) - tagsRegExp, checkSpaces, checkGrammar, language - defaults from UU5.Common.TextCorrector
  opt = opt || {};

  // replace \r\n because of spaces at the start of text in some paragraph
  uu5String = uu5String.trim().replace(/\r\n/g, "\n");

  let body = opt && opt.body;

  let tagsRegExp = opt.tagsRegExp || Environment.uu5StringTagsRegExp || null;

  let childStack = [
    {
      tag: "_root",
      content: [],
      index: 0,
    },
  ];

  let pointer = childStack[0];

  let cIndex = -1;
  let pIndex = 0;
  let pre = false;

  let matchS;
  let matchUu5String = uu5String.match(REGEXP.uu5string);
  if (matchUu5String) {
    // !!!!! Never put uu5stringRe to constants, otherwise it gets stuck - because of exec method on regexp
    // groups: comp name, attrs, -, -, -, self-closing, closing tag comp name, content upto next tag
    let tagRe = new RegExp(TAG, "g");
    pIndex = tagRe.lastIndex = matchUu5String[0].length;
    matchS = tagRe.exec(uu5String);

    while (matchS) {
      cIndex = matchS.index;
      if (cIndex > pIndex) {
        let head = uu5String.substring(pIndex, cIndex);
        pointer.content.push(pre ? Environment.textEntityMap.replaceHtmlEntity(head) : Tools.replaceTextEntity(head));
      }
      let childTag = matchS[1] || matchS[7];
      let attrs = matchS[2];
      let isClosing = !!matchS[7];
      let isSelfClosing = !!matchS[6];
      let tagObj;

      if ((pre && !(childTag === "uu5string.pre" && isClosing)) || (childTag && childTag.match(/^script$/i))) {
        pointer.content.push(Environment.textEntityMap.replaceHtmlEntity(matchS[0]));
      } else {
        if (isClosing) {
          //closing tag

          tagObj = childStack.pop();

          if (tagObj.tag !== childTag) {
            //ERROR
            Tools.error("Invalid uu5string", { uu5String: uu5String, tag: tagObj.tag, position: tagObj.index });
            return Element.create(
              window.UU5.Common.Error, // eslint-disable-line no-undef
              null,
              <div>
                Invalid uu5string: Tag {tagObj.tag} at position {tagObj.index} is not closed.
                <br />
                {uu5String}
              </div>
            );
          }

          pointer = childStack[childStack.length - 1];

          if (pre) {
            pre = false;
            pointer.content[pointer.content.length - 1] = Environment.textEntityMap.replaceHtmlEntity(
              tagObj.content.join("")
            );
          } else {
            if (tagObj.forbidden) {
              tagObj.content = [`Error: Tag <${tagObj.tag}/> is not allowed.`];
              tagObj.tag = "UU5.Common.Error";
            }
            let props;
            if (body) {
              props = tagObj.attrs || {};
              props.content = props.content || tagObj.content;
            }
            pointer.content[pointer.content.length - 1] = body
              ? {
                  tag: tagObj.tag,
                  props: props,
                }
              : this.findComponent(tagObj.tag, tagObj.attrs, Utils.Content.toArray(tagObj.content));
          }
        } else {
          pre = childTag === "uu5string.pre";
          tagObj = { tag: childTag, content: [], index: matchS.index };

          if (tagsRegExp && !tagsRegExp.test(childTag)) tagObj.forbidden = true;
          else if (attrs) {
            try {
              tagObj.attrs = this.buildAttributes(attrs);
            } catch (err) {
              if (err.code === "uu5jsonInvalid") {
                const tag = tagObj.tag;

                tagObj = {
                  tag: window.UU5.Common.Error,
                  content: [],
                  index: matchS.index,
                  attrs: {
                    content: (
                      <div>
                        Invalid uu5json: Component {tag} has invalid property{" "}
                        {err.context.prop + `='<uu5json/>${err.context.json}'`}. {err.message}
                        <br />
                        {uu5String}
                      </div>
                    ),
                  },
                };
              } else {
                throw err;
              }
            }
          }

          if (isSelfClosing) {
            //self-closing tag
            pre = false;

            if (childTag.indexOf("uu5string.") === 0) {
              //meta-tag uu5string.*
              let s = this.execMetaTag(childTag, tagObj.attrs);
              if (s) s.forEach((item) => pointer.content.push(item));
            } else
              body
                ? pointer.content.push({
                    tag: tagObj.tag,
                    props: tagObj.attrs,
                  })
                : pointer.content.push(this.findComponent(tagObj.tag, tagObj.attrs, null));
          } else {
            //common tag
            pointer.content.push(tagObj);
            childStack.push(tagObj);
            pointer = tagObj;
          }
        }
      }
      pIndex = cIndex + matchS[0].length;
      matchS = tagRe.exec(uu5String);
    }
    if (pIndex < uu5String.length) {
      let content = uu5String.substr(pIndex);
      pointer.content.push(
        pre ? Environment.textEntityMap.replaceHtmlEntity(content) : Tools.replaceTextEntity(content)
      );
    }

    if (childStack.length > 1) {
      let tagObj = childStack.pop();

      Tools.error("Invalid uu5string", { uu5String: uu5String, tag: tagObj.tag, position: tagObj.index });
      return Element.create(
        window.UU5.Common.Error, // eslint-disable-line no-undef
        null,
        <div>
          Invalid uu5string: Tag {tagObj.tag} at position {tagObj.index} is not closed.
          <br />
          {uu5String}
        </div>
      );
    }
  } else {
    pointer.content.push(uu5String);
  }

  return body ? pointer.content : Utils.Content.toArray(pointer.content);
};

Tools.execMetaTag = (tag, args) => {
  //TODO implement each metaTag as separate function, call functions dynamically (witch safety keyword guard)
  let metaTag = tag.slice(10);
  let r = [];
  switch (metaTag) {
    case "now":
      r.push(Tools.toLocaleString(new Date(Date.now())));
      break;
    case "codeHex32":
      r.push(Tools.generateUUID());
      break;
    case "codeHex64":
      r.push(Tools.generateUUID() + Tools.generateUUID());
      break;
    default:
      r.push(null);
  }
  return r;
};

Tools.parseFromUu5JSON = function (uu5Json) {
  uu5Json = uu5Json.replace(REGEXP.uu5json, "");
  let value = null;
  try {
    value = JSON.parse(uu5Json);
  } catch (err) {
    Tools.error("Error uu5JSON parse.", {
      uu5Json: uu5Json,
      cause: err,
    });

    err.code = "uu5jsonInvalid";
    err.context = {
      json: uu5Json,
    };
    throw err;
  }
  return value;
};

Tools.parseFromUu5Data = function (uu5data) {
  uu5data = uu5data.replace(REGEXP.uu5data, "");
  let parts = uu5data.split(".");
  let data = UU5.Environment.uu5DataMap;
  while (data != null && parts.length > 0) data = data[parts.shift()];
  typeof data === "undefined" &&
    Tools.warning(`There is no component data in UU5.Environment.uu5DataMap for uu5Data: ${uu5data} !`, {
      string: uu5data,
    });
  return data;
};

Tools.replaceTextEntity = (text) => {
  return Utils.Uu5String._textEntityMap.replace(text);
};

Tools.pad = function (n, width, z) {
  //return width times leading z for n ... pad(99,5,'-') -> '---99'
  z = z || "0";
  n = n + "";
  return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
};

Tools.getServerRequest = function (src, parameters, contentType, done, fail) {
  let request = new XMLHttpRequest();
  request.open("GET", src, true);

  contentType && request.setRequestHeader("Content-type", contentType);
  parameters && request.setRequestHeader("Content-length", parameters.length);

  request.onload = () => {
    if (request.status >= 200 && request.status < 300) {
      typeof done === "function" && done(request.response);
    } else if (typeof fail === "function") {
      fail(request);
    }
  };

  request.onerror = () => {
    if (typeof fail === "function") {
      fail(request);
    }
  };

  request.send(parameters);
};

Tools._merge = function (args, deep, preserveRefs) {
  //   var result;
  //   if(args.length){
  //     result = window.Immutable.fromJS(args[0]);
  //
  //     for(var i = 1; i < args.length; i++){
  //       result = deep ? result.mergeDeep(args[i]) : result.merge(args[i]);
  //     }
  //
  //     result = result.toJS();
  //   }
  //   return result;

  var result;
  if (args.length) {
    var data = deep ? [!!preserveRefs, true, {}] : [!!preserveRefs, {}];

    for (var i = 0; i < args.length; i++) {
      data.push(args[i]);
    }

    result = Tools._extend.apply(null, data);
  }
  return result;
};

Tools.mergeDeep = function () {
  return Tools._merge(arguments, true, true);
};

Tools.merge = function () {
  return Tools._merge(arguments);
};

Tools.mergeEnvironmentUu5DataMap = function (uu5DataMap) {
  Environment.uu5DataMap = Tools.merge(Environment.uu5DataMap || {}, uu5DataMap);
};

Tools.getUrlParam = function (name) {
  var results = new RegExp("[?&]" + name + "=([^&#]*)").exec(window.location.href);
  return results ? results[1] : null;
};

// used for error context which is sent to server
Tools.getBasicObject = function (object) {
  var result = {};

  if (object["$$typeof"]) {
    result = typeof object.type === "function" ? object.type.tagName : object.type;
  } else if (object["updater"]) {
    result = object["getTagName"] ? object.getTagName() : "[React.element]";
  } else {
    for (var key in object) {
      if (key !== "__proto__") {
        var value = object[key];

        if (value && typeof value === "object") {
          value = this.getBasicObject(value);
        } else if (typeof value === "function") {
          value = "[function]";
        }

        result[key] = value;
      }
    }
  }
  return result;
};

Tools.getNavigator = function () {
  var navigator = window.navigator;
  return {
    vendor: navigator.vendor,
    maxTouchPoints: navigator.maxTouchPoints,
    hardwareConcurrency: navigator.hardwareConcurrency,
    appCodeName: navigator.appCodeName,
    appName: navigator.appName,
    appVersion: navigator.appVersion,
    platform: navigator.platform,
    product: navigator.product,
    userAgent: navigator.userAgent,
    language: navigator.language,
    languages: navigator.languages,
    onLine: navigator.onLine,
    cookieEnabled: navigator.cookieEnabled,
    doNotTrack: navigator.doNotTrack,
  };
};

// Tools.logError = function (data) {
//   $.ajax(
//     {
//       url: Environment.logErrorUrl,
//       type: 'post',
//       cache: false,
//       contentType: 'application/json',
//       data: JSON.stringify(
//         {
//           uri: Environment.logErrorUrl,
//           data: data
//         }
//       )
//     }
//   ).fail(
//     function (failDtoIn) {
//       Tools.error('Cannot send error to server', {failDtoIn: failDtoIn});
//     }
//   );
// };

Tools.getFileName = function (path) {
  return path.replace(REGEXP.slashes, "");
};

Tools.getCamelCase = function (string, firstCharLowerCase = false) {
  var camelCase = string || "";
  if (camelCase) {
    if (!firstCharLowerCase) camelCase = camelCase.charAt(0).toUpperCase() + camelCase.slice(1);
    camelCase = camelCase.replace(REGEXP.char, function ($1) {
      return $1.toUpperCase().replace("-", "");
    });
  }
  return camelCase;
};

Tools.getDashCase = (string) => {
  let dashCase = "";
  if (string) {
    dashCase = string.replace(/\B[A-Z]/g, ($1) => {
      return "-" + $1.toLowerCase();
    });
  }
  return dashCase;
};

Tools.getSnakeCase = (string) => {
  let snakeCase = "";
  if (string) {
    snakeCase = string.replace(/\B[A-Z]/g, ($1) => {
      return "_" + $1.toLowerCase();
    });
  }
  return snakeCase;
};

// Element
Tools.getDocumentHeight = () => {
  let body = document.body;
  let html = document.documentElement;

  return Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight);
};

Tools.getDocumentWidth = () => {
  let body = document.body;
  let html = document.documentElement;

  return Math.max(body.scrollWidth, body.offsetWidth, html.clientWidth, html.scrollWidth, html.offsetWidth);
};

Tools.getWidth = function (element) {
  let paddingLeft = parseInt(
    window.getComputedStyle(DOM.findNode(element), null).getPropertyValue("padding-left").replace("px", "") || "0"
  );
  let paddingRight = parseInt(
    window.getComputedStyle(DOM.findNode(element), null).getPropertyValue("padding-right").replace("px", "") || "0"
  );
  return DOM.findNode(element).clientWidth - paddingLeft - paddingRight;
};

Tools.getInnerWidth = function (element) {
  return DOM.findNode(element).clientWidth;
};

Tools.getOuterWidth = function (element, withMargin) {
  let result = DOM.findNode(element).offsetWidth;
  if (withMargin) {
    let marginLeft = parseInt(
      window.getComputedStyle(DOM.findNode(element), null).getPropertyValue("margin-left").replace("px", "") || "0"
    );
    let marginRight = parseInt(
      window.getComputedStyle(DOM.findNode(element), null).getPropertyValue("margin-right").replace("px", "") || "0"
    );
    result += marginLeft + marginRight;
  }
  return result;
};

Tools.getHeight = function (element) {
  let paddingTop = parseInt(
    window.getComputedStyle(DOM.findNode(element), null).getPropertyValue("padding-top").replace("px", "") || "0"
  );
  let paddingBottom = parseInt(
    window.getComputedStyle(DOM.findNode(element), null).getPropertyValue("padding-bottom").replace("px", "") || "0"
  );
  return DOM.findNode(element).clientHeight - paddingTop - paddingBottom;
};

Tools.getInnerHeight = function (element) {
  return DOM.findNode(element).clientHeight;
};

Tools.getOuterHeight = function (element, withMargin) {
  let result = DOM.findNode(element).offsetHeight;
  if (withMargin) {
    let marginTop = parseInt(
      window.getComputedStyle(DOM.findNode(element), null).getPropertyValue("margin-top").replace("px", "") || "0"
    );
    let marginBottom = parseInt(
      window.getComputedStyle(DOM.findNode(element), null).getPropertyValue("margin-bottom").replace("px", "") || "0"
    );
    result += marginTop + marginBottom;
  }
  return result;
};

Tools.calculateTextWidth = function (text, style) {
  let fontSize = style ? style.fontSize : "12px";
  let tempElement = document.createElement("div");

  tempElement.style.cssText = `
    position: absolute;
    visibility: hidden;
    height: auto;
    width: auto;
    white-space: nowrap;
    font-size: ${fontSize};
  `;
  Object.assign(tempElement.style, style);
  tempElement.innerText = text;
  document.documentElement.appendChild(tempElement);
  let width = tempElement.clientWidth;
  document.documentElement.removeChild(tempElement);

  if (Tools.isEdge()) {
    width += 4;
  } else if (Tools.isIE()) {
    width += 2;
  }

  return width;
};

Tools.getOffsetTop = function (offsetElement, scrollElement) {
  let offsetTop = 0;

  if (offsetElement) {
    let scrollTop = scrollElement
      ? scrollElement.scrollTop
      : window.scrollY || document.body.scrollTop || window.pageYOffset;
    offsetTop = offsetElement.getBoundingClientRect().top + scrollTop;
  }

  return offsetTop;
};

Tools.getOffsetLeft = function (offsetElement, scrollElement) {
  let offsetLeft = 0;

  if (offsetElement) {
    let scrollLeft = scrollElement
      ? scrollElement.scrollTop
      : window.scrollX || document.body.scrollLeft || window.pageXOffset;
    offsetLeft = offsetElement.getBoundingClientRect().left + scrollLeft;
  }

  return offsetLeft;
};

Tools.getChildTag = function (child) {
  // react child type
  return child.type;
};

Tools.getChildDisplayName = function (child) {
  var tag = Tools.getChildTag(child);
  return typeof tag === "function" ? tag.displayName : tag;
};

Tools.getChildTagName = function (child) {
  // UU5 tagNames or standard DOM tags ('div', 'span',...)
  var tag = Tools.getChildTag(child);
  return tag && tag.tagName ? tag.tagName : tag;
};

// Environment
Tools.isMobileOrTablet = (function () {
  var check = false;
  (function (a) {
    if (REGEXP.mobile1.test(a) || REGEXP.mobile2.test(a.substr(0, 4))) check = true;
  })(navigator.userAgent || navigator.vendor || window.opera);
  return check;
})();

Tools.getMobileOS = function () {
  var userAgent = navigator.userAgent || navigator.vendor || window.opera;
  var os = "unknown";

  // Windows Phone must come first because its UA also contains "Android"
  if (REGEXP.windowsPhone.test(userAgent)) {
    os = "windowsPhone";
  } else if (REGEXP.android.test(userAgent)) {
    os = "android";

    // iOS detection from: http://stackoverflow.com/a/9039885/177710
  } else if (REGEXP.iPhone.test(userAgent) && !window.MSStream) {
    os = "iOS";
  }

  return os;
};

Tools.isMobileIOS = function () {
  return this.getMobileOS() === "iOS";
};

Tools.isMobileAndroid = function () {
  return this.getMobileOS() === "android";
};

Tools.isSafari = function () {
  var userAgent = window.navigator.userAgent;
  return this.isMobileIOS() && userAgent.indexOf("Safari") > -1 && userAgent.indexOf("CriOS") === -1;
};

Tools.isChrome = function () {
  var userAgent = window.navigator.userAgent;
  return REGEXP.chrome.test(userAgent) && userAgent.indexOf("Version") === -1 && !Tools.isEdge();
};

Tools.isEdge = function () {
  var userAgent = window.navigator.userAgent;
  return REGEXP.edge.test(userAgent) && userAgent.indexOf("Version") === -1;
};

Tools.isIE = function () {
  var userAgent = window.navigator.userAgent;
  return REGEXP.ie.test(userAgent) && userAgent.indexOf("Version") === -1;
};

Tools.isAndroidChrome = function () {
  return this.isMobileAndroid() && this.isChrome();
};

Tools.isMac = function () {
  return window.navigator.platform && window.navigator.platform.match(/Mac/) ? true : false;
};

Tools.getBrowserLanguage = function () {
  return window.navigator.language ? window.navigator.language.toLowerCase() : "en";
};

Tools.getMobileOSVersion = function () {
  var version = window.navigator.userAgent.match(REGEXP.mobile);
  return version && version[2] ? +version[2].replace("_", ".") : 0;
};

Tools.isTablet = function () {
  var userAgent = window.navigator.userAgent;
  return (
    (this.isSafari() && userAgent.indexOf("iPad") > -1) ||
    (this.isAndroidChrome() && userAgent.indexOf("Mobile") === -1)
  );
};

// Cookies
Tools.setCookie = function (cookieName, cookieValue, expireDays) {
  var d = new Date();
  d.setTime(d.getTime() + expireDays * 24 * 60 * 60 * 1000);
  var expires = "expires=" + d.toUTCString();
  document.cookie = cookieName + "=" + cookieValue + "; " + expires;
};

Tools.getCookie = function (cookieName) {
  var name = cookieName + "=";
  var ca = document.cookie.split(";");
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == " ") {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
};

// languagesString = 'cs-CZ,en;q=0.6,sk;q=0.8' => [{language: 'cs', location: 'cs-cz', q: 1.0}, {language: 'sk', q:
// 0.8}, {language: 'en', q: 0.6}] languagesString = 'cs' => [{language: 'cs', q: 1.0}] languagesString =
// 'en;q=0.6,sk;q=0.8' => [{language: 'sk', q: 0.8}, {language: 'en', q: 0.6}]
Tools.sortLanguages = function (languagesString) {
  // languagesString = 'cs-CZ,en;q=0.6,sk;q=0.8' => languagesSplitter = ['cs-CZ', 'en;q=0.6', 'sk;q=0.8']
  var languagesSplitter = languagesString.toLowerCase().split(",");

  var languages = {};
  languagesSplitter.forEach(function (lang) {
    var lang = lang.trim();
    var language = {};

    var langOpt = lang.split(";");
    var langStr = langOpt[0];
    var q = 1; // quality factor
    if (langOpt.length > 1) {
      langStr = langOpt[0];
      q = parseFloat(langOpt[1].split("=")[1]);
    }

    var langStrSplitter = langStr.split("-");
    language.language = langStrSplitter[0];
    langStrSplitter[1] && (language.location = langStr);

    if (languages[lang]) {
      languages[lang].q < q && (languages[lang].q = q);
    } else {
      language.q = q;
      languages[lang] = language;
    }
  });

  // languagesArray = [{language: 'cs', location: 'cs-CZ', q: 1.0}, {language: 'en', q: 0.6}, {language: 'sk', q:
  // 0.8}]
  var languagesArray = Object.keys(languages)
    .map((lang) => languages[lang])
    .sort((langA, langB) => {
      if (langA.q < langB.q) {
        return -1;
      }
      if (langA.q > langB.q) {
        return 1;
      }
      return 0;
    });

  // [{language: 'cs', location: 'cs-CZ', q: 1.0}, {language: 'sk', q: 0.8}, {language: 'en', q: 0.6}]
  return languagesArray.sort(function (lang1, lang2) {
    var result = 0;
    if (lang1.q < lang2.q) {
      result = 1;
    } else if (lang1.q > lang2.q) {
      result = -1;
    }
    return result;
  });
};

Tools.generateUUID = (length) => {
  return EnvTools.generateId(length);
};

Tools.joinClassNames = (className1, className2) => {
  return [className1, className2].join(" ").replace(REGEXP.whiteSpaces, " ").trim();
};

Tools.buildClasses = function (classes, keys) {
  var className = "";
  classes &&
    keys.forEach(function (v) {
      classes[v] && (className += " " + classes[v]);
    });
  return className.trim();
};

Tools.isInClasses = function (classes, regExp) {
  var classesArray = classes ? classes.split(" ") : [];
  var result = false;
  while (!result && classesArray.length) {
    classesArray[0].match(regExp) && (result = true);
    classesArray.shift();
  }
  return result;
};

Tools.addClassName = function (newClassName, classes) {
  if (classes && classes.indexOf(newClassName) > -1) {
    classes = classes.replace(newClassName, "");
    classes = classes.replace(REGEXP.whiteSpaces, " ");
  }

  if (classes) {
    classes += " " + newClassName;
  } else {
    classes = newClassName;
  }

  return classes;
};

Tools.buildCounterCallback = function (callback, count) {
  /*
   Method wrap (function) callback by newCallBack.
   If newCallBack is used, increase closureCounter
   but call callback just if closureCounter === count.
   You can use this 'tricky' method, when you want to call callback
   just once but you have to send it to several methods.
   See examples!!!
   */
  var newCallback = null;
  if (typeof callback === "function") {
    var closureCounter = 0;
    newCallback = function () {
      closureCounter++;
      closureCounter === count && callback.apply(null, arguments);
    };
  }
  return newCallback;
};

Tools.formatString = function (string, stringParams) {
  let paramList = Array.isArray(stringParams) ? stringParams : arguments.length >= 2 ? [stringParams] : [];
  return Utils.String.format(string, ...paramList);
};

let postponedScrollToTarget;
Tools.scrollToTarget = (id, smoothScroll, offset, scrollElement, stickToPosition) => {
  let element = id ? document.getElementById(id.replace("#", "")) : document.body;
  if (!element) {
    return this;
  }

  // if page is not visible then postpone scrolling to target until it becomes visible
  if (!Environment.isPageVisible()) {
    if (!postponedScrollToTarget) {
      Environment.EventListener.registerPageVisibility("UU5.Common.Tools.scrollToTarget", ({ visible }) => {
        if (visible) {
          Environment.EventListener.unregisterPageVisibility("UU5.Common.Tools.scrollToTarget");
          Tools.scrollToTarget.apply(Tools, postponedScrollToTarget);
          postponedScrollToTarget = undefined;
        }
      });
    }
    postponedScrollToTarget = [id, smoothScroll, offset, scrollElement, stickToPosition];
    return this;
  }

  // if element is in position: fixed; container (and the container is not in a box with CSS transform)
  // then it makes no sense to scroll the body because the elements position relative to viewport won't change
  let elem = element;
  let hasFixed = false;
  if (!scrollElement) {
    while (elem && elem.tagName) {
      let computedStyle = getComputedStyle(elem);
      if (computedStyle.transform !== "none") hasFixed = false;
      if (!hasFixed) hasFixed = computedStyle.position === "fixed";
      elem = elem.parentNode;
    }

    if (hasFixed) {
      return this;
    }
  }

  //stop scroll on this events: scroll mousedown wheel DOMMouseScroll mousewheel keyup touchmove
  let html = scrollElement || document.documentElement;
  // window.UU5.Environment.EventListener.addEvent(html, 'scroll', id, cancel);

  window.UU5.Environment.EventListener.addEvent(html, "mousedown", id, cancel);
  window.UU5.Environment.EventListener.addEvent(html, "wheel", id, cancel);
  window.UU5.Environment.EventListener.addEvent(html, "DOMMouseScroll", id, cancel);
  window.UU5.Environment.EventListener.addEvent(html, "mousewheel", id, cancel);
  window.UU5.Environment.EventListener.addEvent(html, "keyup", id, cancel);
  window.UU5.Environment.EventListener.addEvent(html, "touchmove", id, cancel);

  let y = scrollElement ? offset || 0 : (Tools.getOffsetTop(element, scrollElement) || 0) - (offset || 0);

  let _update;
  let _from = scroll();
  let _duration = typeof smoothScroll === "number" ? smoothScroll : 1000;
  let _curr = _from; //Tools merge
  let _done = false;
  let _start = Date.now();

  let origFrom = scroll();
  // x, y coordinates
  let _to = { top: y, left: 0 };

  let _ease = (n) => {
    n *= 2;
    if (n < 1) return 0.5 * n * n;
    return -0.5 * (--n * (n - 2) - 1);
  };

  update((o) => {
    if (scrollElement) {
      scrollElement.scrollTop = o.top || 0;
      scrollElement.scrollLeft = o.left || 0;
    } else {
      window.scrollTo(o.left | 0, o.top | 0);
    }

    if (_done && !scrollElement && stickToPosition) {
      // make scroll position stick to the target element if there're DOM position changes going on
      // (stop it if there's no change during last few milliseconds)
      let NO_CHANGE_PERIOD = 5000;
      let unstickTimeout;
      let ignoreScroll = true; // initially true because we just did window.scrollTo(...)
      let ignoreScrollResetAnimFrame = requestAnimationFrame(() => (ignoreScroll = false), 0); // in case window.scrollTo(...) above did no scrolling
      let checkPositionChangeAnimFrame = requestAnimationFrame(checkPositionChange);
      window.addEventListener("scroll", function handler(e) {
        if (ignoreScroll) {
          ignoreScroll = false;
          return;
        }
        window.removeEventListener("scroll", handler);
        unstick();
      });
      replanUnstick();

      function checkPositionChange() {
        checkPositionChangeAnimFrame = requestAnimationFrame(checkPositionChange);
        let curTop = (Tools.getOffsetTop(element, scrollElement) || 0) - (offset || 0);
        if (curTop !== _to.top) {
          replanUnstick();
          _to.top = curTop;
          ignoreScroll = true;
          window.scrollTo(_to.left | 0, _to.top | 0); // enqueues scroll event (if needed)
          cancelAnimationFrame(ignoreScrollResetAnimFrame);
          ignoreScrollResetAnimFrame = requestAnimationFrame(() => (ignoreScroll = false), 0); // clear flag afterwards (if the scroll event was not enqueued)
        }
      }

      function replanUnstick() {
        clearTimeout(unstickTimeout);
        unstickTimeout = setTimeout(unstick, NO_CHANGE_PERIOD);
      }

      function unstick() {
        cancelAnimationFrame(checkPositionChangeAnimFrame);
        clearTimeout(unstickTimeout);
        cancelAnimationFrame(ignoreScrollResetAnimFrame);
      }
    }
  });

  function cancel() {
    _done = true;
    window.UU5.Environment.EventListener.removeEvent(html, "scroll", id);
    window.UU5.Environment.EventListener.removeEvent(html, "mousedown", id);
    window.UU5.Environment.EventListener.removeEvent(html, "wheel", id);
    window.UU5.Environment.EventListener.removeEvent(html, "DOMMouseScroll", id);
    window.UU5.Environment.EventListener.removeEvent(html, "mousewheel", id);
    window.UU5.Environment.EventListener.removeEvent(html, "keyup", id);
    window.UU5.Environment.EventListener.removeEvent(html, "touchmove", id);
    return this;
  }

  function step() {
    if (!_done) {
      // duration
      let duration = _duration;
      let now = Date.now();
      let delta = now - _start;
      let done = delta >= duration;
      // Fix for a situation when the position of the element is changed during the animation
      _to.top = (Tools.getOffsetTop(element, scrollElement) || 0) - (offset || 0);
      // complete
      if (done) {
        _from = _to;
        cancel();
        _update(_to);
        return this;
      }

      let from = _from;
      let to = _to;
      let curr = _curr;
      let fn = _ease;
      let p = (now - _start) / duration;
      let n = fn(p);

      for (let k in from) {
        curr[k] = (to[k] - origFrom[k]) * n + origFrom[k];
      }

      _update(curr);
    }
    return this;
  }

  function update(fn) {
    if (0 == arguments.length) return step();
    _update = fn;
    return this;
  }

  function scroll() {
    let x, y;
    if (scrollElement) {
      y = scrollElement.scrollTop;
      x = scrollElement.scrollLeft;
    } else {
      y = window.pageYOffset || document.documentElement.scrollTop;
      x = window.pageXOffset || document.documentElement.scrollLeft;
    }
    return { top: y, left: x };
  }

  function animate() {
    let raf =
      window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || fallback;
    !_done && raf(animate);
    update();
  }

  function fallback(fn) {
    let prev = new Date().getTime();
    let curr = new Date().getTime();
    let ms = Math.max(0, 16 - (curr - prev));
    let req = setTimeout(fn, ms);
    prev = curr;
    return req;
  }

  animate();

  return this;
};

Tools.error = function (msg, context) {
  // if (Environment.isProduction()) {
  //   console.error('For debugging use development mode.');
  // } else {
  console.error(msg, context);
  // }

  if (Environment.logErrorFunction) {
    let data = {
      message: msg,
      context: Tools.getBasicObject(context),
      navigator: Tools.getNavigator(),
      stackTrace: new Error().stack,
    };

    if (typeof Environment.logErrorFunction === "function") {
      Environment.logErrorFunction(data);
    } else {
      //Tools.logError(data);
      console.error(
        `Please add to "UU5.Environment.logErrorFunction" your own function as:
      function (data) {
        $.ajax(
          {
            url: '...',
            type: 'post',
            cache: false,
            contentType: 'application/json',
            data: JSON.stringify(
              {
                data: data
              }
            )
          }
        ).fail(
          function (failDtoIn) {
            UU5.Common.Tools.error('Cannot send error to server', {failDtoIn: failDtoIn});
          }
        );
      }`,
        context
      );
    }
  }
};

Tools.warning = function (msg, context = {}) {
  if (!Environment.isProduction() || (Environment.isProduction() && Environment.showProductionWarning)) {
    console.warn(msg, context);
  }
};

Tools.repeat = (value, count) => {
  let rpt = "";
  let str = value + "";

  for (;;) {
    if ((count & 1) == 1) {
      rpt += str;
    }
    count >>>= 1;
    if (count == 0) {
      break;
    }
    str += str;
  }

  return rpt;
};

Tools.rjust = (string, length, padding) => {
  string = "" + string;
  padding = padding || " ";
  let newString = string;

  if (string.length < length) {
    newString = Tools.repeat(padding, length).substr(0, length - string.length) + newString;
  }

  return newString;
};

Tools.ljust = (string, length, padding) => {
  string = "" + string;
  padding = padding || " ";
  let newString = string;

  if (string.length < length) {
    newString += Tools.repeat(padding, length).substr(0, length - string.length);
  }
  return newString;
};

// TODO: nezaokrouhluje jen desetinná místa -> není to decimalAdjust, ale numberAdjust
// type: round, floor, ceil, trunc
Tools.decimalAdjust = (type = "round", value, exp) => {
  // If the exp is undefined or zero...
  if (typeof exp === "undefined" || +exp === 0) {
    return Math[type](value);
  }
  value = +value;
  exp = +exp;
  // If the value is not a number or the exp is not an integer...
  if (isNaN(value) || !(typeof exp === "number" && exp % 1 === 0)) {
    return NaN;
  }
  // Shift
  value = value.toString().split("e");
  value = Math[type](+(value[0] + "e" + (value[1] ? +value[1] - exp : -exp)));
  // Shift back
  value = value.toString().split("e");
  return +(value[0] + "e" + (value[1] ? +value[1] + exp : exp));
};

// Decimal round
Tools.round10 = function (value, exp) {
  return Tools.decimalAdjust("round", value, exp);
};
// Decimal floor
Tools.floor10 = function (value, exp) {
  return Tools.decimalAdjust("floor", value, exp);
};
// Decimal ceil
Tools.ceil10 = function (value, exp) {
  return Tools.decimalAdjust("ceil", value, exp);
};

Tools.encodeValue = (value) => {
  let result = value + "";

  if (value && (Array.isArray(value) || typeof value === "object")) {
    result = JSON.stringify(value);
  }

  return encodeURIComponent(result);
};

Tools.encodeQuery = (params) => {
  let query = "?";

  for (let name in params) {
    query += name + "=" + Tools.encodeValue(params[name]) + "&";
  }

  return query.substr(0, query.length - 1);
};

Tools.isJson = (str) => {
  try {
    return JSON.parse(str);
  } catch (e) {
    return false;
  }
};

Tools.decodeValue = (value) => {
  value = decodeURIComponent(value);
  let result = value;

  if (!isNaN(value)) {
    result = +value;
  } else if (value === "true") {
    result = true;
  } else if (value === "false") {
    result = false;
  } else {
    let json = Tools.isJson(value);

    if (json) {
      result = json;
    }
  }

  return result;
};

Tools.decodeQuery = (query) => {
  let params = {};

  query
    .substr(1, query.length - 1)
    .split("&")
    .forEach((value) => {
      let valueSplitter = value.split("=");
      params[valueSplitter[0]] = Tools.decodeValue(valueSplitter[1]);
    });

  return params;
};

Tools.copyToClipboard = (content) => {
  let actualScroll = window.scrollY || document.body.scrollTop || window.pageYOffset;
  let tempElement = document.createElement("textarea");
  tempElement.className = "uu5-common-temp-textarea";
  tempElement.value = content;
  document.body.appendChild(tempElement);
  tempElement.select();
  document.execCommand("copy");

  if (tempElement.remove) {
    tempElement.remove();
  } else {
    tempElement.parentNode.removeChild(tempElement);
  }

  document.documentElement.scrollTop = actualScroll;
  document.body.scrollTop = actualScroll;
};

Tools.getWeekNumber = (date, startOfWeek = 1) => {
  let d = new Date(+date);
  d.setHours(0, 0, 0);
  let dayOffset = (d.getDay() || 7) - (startOfWeek - 1);
  if (dayOffset <= 0) dayOffset += 7;
  d.setDate(d.getDate() + 4 - dayOffset);
  return Math.ceil(((d - new Date(d.getFullYear(), 0, 1)) / 8.64e7 + 1) / 7);
};

// dateToDateString
Tools.formatDate = (date, format, timeZone = null) => {
  if (typeof timeZone === "number") {
    let utc = new Date(date.getTime() + date.getTimezoneOffset() * 60000);
    date = new Date(utc.getTime() + timeZone * 60 * 60000);
  }

  let year = date.getFullYear();
  let month = date.getMonth() + 1;
  let week = Tools.getWeekNumber(date);

  if (REGEXP.weekYear.test(format) && month === 12 && week === 1) {
    year++;
  }

  let config = {
    "d+": date.getDate(), //day
    "m+": month, //month
    y: (year + "").substr(2, 2), // year end
    Y: year, // year full
    "h+": date.getHours() > 12 ? date.getHours() - 12 : date.getHours() === 0 ? 12 : date.getHours(), //hour 1 - 12
    "H+": date.getHours(), //hour
    "M+": date.getMinutes(), //minute
    "S+": date.getSeconds(), //second
    "s+": date.getMilliseconds(), //millisecond
    t: date.getHours() >= 12 ? "p.m." : "a.m.",
    T: date.getHours() >= 12 ? "PM" : "AM",
    "w+": week,
    q: Math.floor((date.getMonth() + 3) / 3), //quarter
    Z: typeof timeZone === "number" ? timeZone * 60 : -date.getTimezoneOffset(),
  };

  for (let k in config) {
    if (new RegExp("(" + k + ")").test(format)) {
      let _formatValue = (chars, value) => {
        let result = value;

        if (chars === "Z") {
          if (value > 0) {
            result = "+";
          } else {
            result = "-";
            value *= -1;
          }
          result += Tools.rjust(Math.floor(value / 60), 2, "0") + ":" + Tools.rjust(Math.floor(value % 60), 2, "0");
        } else if (chars.length === 2) {
          if (chars === "ss") {
            result = Tools.rjust(value, 3, "0");
          } else {
            result = Tools.rjust(value, 2, "0");
          }
        }
        return result;
      };

      format = format.replace(RegExp.$1, _formatValue(RegExp.$1, config[k]));
    }
  }
  return format;
};

Tools.extend = function (...args) {
  return Tools._extend(false, ...args);
};

Tools._extend = function (preserveRefs, ...args) {
  let src,
    copyIsArray,
    copy,
    name,
    options,
    clone,
    target = args[0] || {},
    i = 1,
    length = args.length,
    deep = false;

  // Handle a deep copy situation
  if (typeof target === "boolean") {
    deep = target;

    // skip the boolean and the target
    target = args[i] || {};
    i++;
  }

  // Handle case when target is a string or something (possible in deep copy)
  if (typeof target !== "object" && typeof target !== "function") {
    target = {};
  }

  // extend jQuery itself if only one argument is passed
  if (i === length) {
    target = this;
    i--;
  }

  let targetIsArray = Array.isArray(target);
  for (; i < length; i++) {
    // Only deal with non-null/undefined values
    if ((options = args[i]) != null) {
      // Extend the base object

      // merge React elements via Element.clone (clone props separately, then do cloneElement)
      // because React Context elements are cyclic...
      if (deep && options && typeof options === "object" && Element.isValid(options)) {
        let newProps = {};
        if (options.props) {
          for (let k in options.props) {
            let v = options.props[k];
            if (preserveRefs && k === "ref_" && v && typeof v === "object") newProps[k] = v;
            else if (v && Array.isArray(v)) newProps[k] = Tools._extend(preserveRefs, deep, [], v);
            else if (v && Tools.isPlainObject(v)) newProps[k] = Tools._extend(preserveRefs, deep, {}, v);
            else newProps[k] = v;
          }
        }
        let newChildren = newProps.children;
        delete newProps.children;
        let clonedReactEl = Element.clone(options, newProps, newChildren);
        if (clonedReactEl._store && options._store) {
          clonedReactEl._store.validated = options._store.validated; // to prevent extra warnings about missing "key"
        }
        // if the target is a React element, then "merge" by actually replacing the element,
        // otherwise just copy all keys
        if (target && typeof target === "object" && Element.isValid(target)) {
          for (let k in target) delete target[k];
        }
        for (let k in clonedReactEl) target[k] = clonedReactEl[k];
      } else {
        for (name in options) {
          src = target[name];
          copy = options[name];

          // Prevent never-ending loop
          // TODO This is insufficient (works only when cycle is at parent-child level).
          if (target === copy) {
            continue;
          }

          // Recurse if we're merging plain objects or arrays
          if (deep && copy && (Tools.isPlainObject(copy) || (copyIsArray = Array.isArray(copy)))) {
            if (copyIsArray) {
              copyIsArray = false;
              clone = src && Array.isArray(src) ? src : [];
            } else {
              clone = src && Tools.isPlainObject(src) ? src : {};
            }

            // Never move original objects, clone them
            target[name] = Tools._extend(preserveRefs, deep, clone, copy);

            // Don't bring in undefined values (do for arrays as it might change their length otherwise)
          } else if (copy !== undefined || targetIsArray) {
            target[name] = copy;
          }
        }
      }
    }
  }

  // Return the modified object
  return target;
};

Tools.isPlainObject = (obj) => {
  let result = false;
  if (typeof obj == "object" && obj !== null) {
    if (typeof Object.getPrototypeOf == "function") {
      let proto = Object.getPrototypeOf(obj);
      result = proto === Object.prototype || proto === null;
    } else {
      result = Object.prototype.toString.call(obj) === "[object Object]";
    }
  }
  return result;
};

Tools.isSame = (x, y) => {
  if (x === y) {
    return x !== 0 || y !== 0 || 1 / x === 1 / y;
  } else {
    return x !== x && y !== y;
  }
};

// TODO: deprecated
Tools.shallowEqual = (objA, objB) => {
  Tools.warning("Method UU5.Common.Tools.shallowEqual is deprecated. Use UU5.Common.Tools.deepEqual instead.");
  return Tools.deepEqual(objA, objB);
};

Tools.deepEqual = (objA, objB) => {
  if (Tools.isSame(objA, objB)) {
    return true;
  }

  if (typeof objA !== "object" || objA === null || typeof objB !== "object" || objB === null) {
    return false;
  }

  let keysA = Object.keys(objA);
  let keysB = Object.keys(objB);

  if (keysA.length !== keysB.length) {
    return false;
  }

  for (let i = 0; i < keysA.length; i++) {
    if (!Object.prototype.hasOwnProperty.call(objB, keysA[i])) {
      return false;
    }

    if (objA[keysA[i]] && objB[keysA[i]] && typeof objA[keysA[i]] === "object" && typeof objB[keysA[i]] === "object") {
      // must be condition because in React 16 _owner is FiberNode which is recursive
      if ((!objA.$$typeof || keysA[i] !== "_owner") && !Tools.deepEqual(objA[keysA[i]], objB[keysA[i]])) {
        return false;
      }
    } else if (keysA[i] !== "ref_" && !Tools.isSame(objA[keysA[i]], objB[keysA[i]])) {
      return false;
    }
  }

  return true;
};

Tools.prettyJson = (object, space) =>
  JSON.stringify(typeof object === "string" ? JSON.parse(object) : object, null, space || 2);

Tools.childToBodyItem = (child) => {
  return { tag: Tools.getChildTagName(child), props: Tools.mergeDeep({}, child.props) };
};

Tools.getElementByComputedStyle = (element, styleProperty, value) => {
  let result;
  let parent = element.parentElement;
  if (parent) {
    let style = window.getComputedStyle(parent);
    if (
      Array.isArray(value)
        ? value.indexOf(style.getPropertyValue(styleProperty)) > -1
        : style.getPropertyValue(styleProperty) === value
    ) {
      result = parent;
    } else {
      result = Tools.getElementByComputedStyle(parent, styleProperty, value);
    }
  }

  return result;
};

Tools.createStyleTag = (css, id) => {
  let head = document.head || document.getElementsByTagName("head")[0];
  let style = document.createElement("style");

  style.type = "text/css";
  style.id = id + "-style-sheet";
  if (style.styleSheet) {
    // This is required for IE8 and below.
    style.styleSheet.cssText = css;
  } else {
    style.appendChild(document.createTextNode(css));
  }

  head.appendChild(style);

  return this;
};

Tools.removeStyleTag = (id) => {
  let style = this.getElementById(id + "-style-sheet");
  if (style) {
    if (style.remove) {
      style.remove();
    } else {
      style.parentNode.removeChild(style);
    }
  }
};

Tools.hasProfile = (sourceProfileList, requestedProfile) => {
  return sourceProfileList ? sourceProfileList.indexOf(requestedProfile) > -1 : false;
};

Tools.hasProfileOnly = (sourceProfileList, requestedProfile) => {
  return sourceProfileList ? sourceProfileList.indexOf(requestedProfile) > -1 && sourceProfileList.length === 1 : false;
};

Tools.hasSomeProfiles = (sourceProfileList, requestedProfileList) => {
  return requestedProfileList
    ? requestedProfileList.some((v) => {
        return Tools.hasProfile(sourceProfileList, v);
      })
    : false;
};

Tools.hasEveryProfiles = (sourceProfileList, requestedProfileList) => {
  return requestedProfileList
    ? requestedProfileList.every((v) => {
        return Tools.hasProfile(sourceProfileList, v);
      })
    : false;
};

Tools.getScreenSize = () => {
  return ScreenSize.countSize();
};

Tools.getLanguages = (language) => {
  return language ? Tools.sortLanguages(language) : Environment.languages;
};

Tools.getLanguage = () => {
  return EnvTools.getLanguage();
};

Tools.setLanguage = (language) => {
  Tools.setLanguages(language);
  let lang = Environment.languages[0];
  if (lang) {
    Lsi.setLanguage(lang.location || lang.language);
    Environment.setDateTimeCountry(lang.language);
    Environment.setNumberCountry(lang.language);
  }
  return this;
};

Tools.setLanguages = (languages) => {
  if (typeof languages === "string") {
    languages = Tools.sortLanguages(languages);
    Environment.languages = languages;
  } else if (Array.isArray(languages)) {
    languages.forEach((language) => {
      if (!(typeof language.language === "string") || !(0 < language.q && language.q < 1)) {
        Tools.error("The provided language array is not allowed.");
        return this;
      }
    });
    Environment.languages = languages;
  }

  let priorityLang = Environment.languages[0];
  if (priorityLang) {
    document.documentElement.setAttribute("lang", priorityLang.location || priorityLang.language);
  }

  return this;
};

Tools.getLsiKey = (lsi, languages, language, defaultLanguage) => {
  let lsiKey = null;
  languages = languages || Tools.getLanguages(language);

  if (lsi) {
    let keys = Object.keys(lsi);
    let resLang = keys[0];

    for (let i = 0; i < languages.length; i++) {
      let lang = languages[i];

      if (lsi[lang.location]) {
        resLang = lang.location;
        break;
      } else if (lsi[lang.language]) {
        resLang = lang.language;
        break;
      } else {
        let lsiKeys = keys.filter(function (key) {
          return key.match("^" + lang.language);
        });

        if (lsiKeys.length) {
          resLang = lsiKeys[0];
          break;
        } else {
          defaultLanguage = defaultLanguage || Environment.defaultLanguage;
          if (defaultLanguage) {
            if (lsi[defaultLanguage]) {
              resLang = defaultLanguage;
              break;
            } else if (lsi[defaultLanguage.split("-")[0]]) {
              resLang = defaultLanguage.split("-")[0];
              break;
            }
          }
        }
      }
    }

    lsiKey = lsi[resLang] ? resLang : lsi[keys[0]] ? keys[0] : null;
  }

  return lsiKey;
};

Tools.getLsiItemByLanguage = (lsi, params, languages) => {
  let lsiKey = Tools.getLsiKey(lsi, languages);
  let result = lsiKey ? lsi[lsiKey] : null;

  if (typeof result === "string" && params != null) {
    result = Tools.formatString(result, params);
  }

  return result;
};

Tools.getLsiValueByLanguage = (lsi, language, params) => {
  let lsiKey = Tools.getLsiKey(lsi, null, language);
  let result = lsiKey ? lsi[lsiKey] : null;

  if (typeof result === "string" && params) {
    result = Tools.formatString(result, params);
  }

  return result;
};

Tools.toLocaleDateString = (date, country, opt) => {
  // because of IE
  return date.toLocaleDateString(country, opt).replace(/\u200E/g, "");
};

Tools.toLocaleTimeString = (date, country, opt) => {
  // because of IE
  return date.toLocaleTimeString(country, opt).replace(/\u200E/g, "");
};

Tools.toLocaleString = (date, country, opt) => {
  // because of IE
  return date.toLocaleString(country, opt).replace(/\u200E/g, "");
};

Tools.adjustForTimezone = (date, outputTimeZone, inputTimeZone) => {
  inputTimeZone = typeof inputTimeZone === "number" ? inputTimeZone : Environment.dateTimeZone;

  if (date) {
    inputTimeZone = -inputTimeZone * 60 * 60000;

    if (typeof outputTimeZone === "number") {
      date = Tools.cloneDateObject(date);
      let utc = new Date(date.getTime() + inputTimeZone);
      date = new Date(utc.getTime() + outputTimeZone * 60 * 60000);
      return date;
    } else {
      date.setTime(date.getTime() - inputTimeZone);
      return date;
    }
  } else {
    return date;
  }
};

Tools.formatDateByCountry = (date, country) => {
  let result;
  if (Environment.dateTimeFormat[country]) {
    result = Tools.formatDate(date, Environment.dateTimeFormat[country]);
  } else {
    result = Tools.toLocaleDateString(new Date(date), country);
  }
  return result;
};

Tools.streamToString = (stream, encoding = "utf-8") => {
  return window.TextDecoder
    ? new window.TextDecoder(encoding).decode(stream)
    : decodeURIComponent(escape(stream.map((char) => String.fromCharCode(char)).join("")));
};

Tools.isDateReversed = (country) => {
  const dateFormat = country || Tools.getLanguage();
  return dateFormat.toLowerCase() === "en" || dateFormat.toLowerCase() === "en-us";
};

const DATE_TIME_FORMAT_FALLBACK = { year: "numeric", month: "numeric", day: "numeric" };
Tools.getLocaleFormat = (locale) => {
  let result;
  let dateTimeFormat = new Intl.DateTimeFormat(locale);
  // use locale-specific format if it uses numeric/2-digit day & month & year,
  // otherwise fall back to using DATE_TIME_FORMAT_CALLBACK format
  let dateTimeFormatOpts = dateTimeFormat.resolvedOptions();
  let initOpts = {};
  let isNumericFormat = ["year", "month", "day"].every((key) => {
    initOpts[key] = dateTimeFormatOpts[key];
    return dateTimeFormatOpts[key] === "numeric" || dateTimeFormatOpts[key] === "2-digit";
  });
  if (!isNumericFormat) initOpts = DATE_TIME_FORMAT_FALLBACK;
  dateTimeFormat = new Intl.DateTimeFormat(locale, initOpts);

  let formattingCharacters = {
    day: initOpts.day === "numeric" ? "d" : "dd",
    month: initOpts.month === "numeric" ? "m" : "mm",
    year: "Y",
  };
  if (dateTimeFormat.formatToParts) {
    result = dateTimeFormat
      .formatToParts(new Date())
      .map((it) =>
        it.type === "literal"
          ? typeof it.value === "string"
            ? it.value.replace(/\u200E/g, "")
            : it.value
          : formattingCharacters[it.type]
      )
      .filter(Boolean)
      .join("");
  } else {
    result = formattingCharacters.day + "." + formattingCharacters.month + "." + formattingCharacters.year;
  }
  return result;
};

// formatToDateString(dateTime or isoStringDateOnly)
Tools.getDateString = (dateTime, opt = {}) => {
  let format = opt.format;
  let country = opt.country;
  let result = dateTime;

  if (dateTime instanceof Date) {
    // backward-compatible behaviour
    if (format) {
      result = Tools.formatDate(dateTime, format);
    } else if (country) {
      result = Tools.formatDateByCountry(dateTime, country);
    } else {
      result = Tools.toLocaleDateString(dateTime, Tools.getLanguage());
    }
  } else if (typeof dateTime === "string" && dateTime.match(/^\d{4}-\d{2}-\d{2}$/)) {
    let parsedDate = Tools.parseDate(dateTime); // dateTime is not exact point in time, it's a year+month+day with no time / time zone
    result = Tools.formatDate(
      parsedDate,
      format || Environment.dateTimeFormat[country] || Tools.getLocaleFormat(country || Tools.getLanguage())
    );
  }

  return result;
};

Tools.getTimeString = (dateTime, displaySeconds, timeFormat, includeTimeFormat, timeStep = 1) => {
  let timeString = null,
    dateObject,
    dayPart;

  const getTimeString = () => {
    let result = null;

    if (typeof dateTime === "string") {
      dayPart = dateTime.match(/AM|PM/) && dateTime.match(/AM|PM/)[0];

      if (dayPart) {
        dateTime = dateTime.replace(dayPart, "").trim();
      }

      let timeFull = dateTime.trim().split(/(\s+)(?!.*\s+)/)[2] || ""; // assume that date is always last after last space

      // check if its actually a valid time
      if (!/\d{1,2}:\d{1,2}(:\d{1,2})?/.test(timeFull)) {
        timeFull = null;
      }

      let time = timeFull;

      if (!dayPart && time) {
        [time, dayPart] = timeFull.split(/\s+/);
      }

      if (time) {
        dateObject = new Date();
        dateObject.setHours(time.split(":")[0]);
        dateObject.setMinutes(time.split(":")[1] || 0);
        dateObject.setSeconds(time.split(":")[2] || 0);
      }
    } else if (dateTime instanceof Date) {
      dateObject = dateTime;
      dayPart = Tools.getDayPart(dateObject);
    } else if (Tools.isPlainObject(dateTime)) {
      dateObject = dateTime;
    }

    if (dateObject) {
      if (Tools.isPlainObject(dateObject)) {
        result = Tools.formatTime(dateObject, displaySeconds, timeFormat, includeTimeFormat, timeStep, true);
      } else if (dateObject instanceof Date && !isNaN(dateObject.getDate())) {
        result = Tools.formatTime(
          {
            hours: dateObject.getHours(),
            minutes: dateObject.getMinutes(),
            seconds: dateObject.getSeconds(),
            dayPart: dayPart || Tools.getDayPart(dateObject),
          },
          displaySeconds,
          timeFormat,
          includeTimeFormat,
          timeStep,
          true
        );
      }
    }

    return result;
  };

  if (Tools.isISODateString(dateTime)) {
    dateTime = new Date(dateTime);
  }

  timeString = getTimeString();

  return timeString;
};

Tools.isISODateString = (string) => {
  if (
    typeof string !== "string" ||
    !/^(-?(?:[1-9][0-9]*)?[0-9]{4})-(1[0-2]|0[1-9])-(3[01]|0[1-9]|[12][0-9])T(2[0-3]|[01][0-9]):([0-5][0-9]):([0-5][0-9])(.[0-9]+)?(Z|[+-](\d{2})\:(\d{2}))?$/.test(
      string
    )
  ) {
    return false;
  } else {
    return true;
  }
};

Tools.getISOTimeZone = (string) => {
  if (typeof string !== "string") {
    return null;
  }

  let match = string.match(REGEXP.isoTimeZone);

  if (match) {
    if (match[0] === "Z") {
      match = 0;
    } else {
      match = match[0].split(":")[0];
    }

    if (match) {
      match = parseInt(match);
    }
  } else {
    match = null;
  }

  return match;
};

Tools.getDayPart = (dateObject) => {
  let hours = dateObject.getHours();
  let dayPart;

  if (hours < 12) {
    dayPart = TIME_FORMAT_AM;
  } else {
    dayPart = TIME_FORMAT_PM;
  }

  return dayPart;
};

Tools.isValidTime = (timeString, format, seconds) => {
  let isValid;

  if (timeString) {
    isValid = false;
    let hours = ((timeString && timeString.split(":")[0]) || "").split(" ")[0];
    let hoursNumber = hours ? parseInt(hours) : null;
    let minutes = ((timeString && timeString.split(":")[1]) || "").split(" ")[0];
    let minutesNumber = minutes ? parseInt(minutes) : null;
    seconds = seconds && timeString && (timeString.split(":")[2] || "").split(" ")[0];
    let secondsNumber = seconds ? parseInt(seconds) : null;

    if (hours && hours.length == 2 && minutes && minutes.length == 2 && (!seconds || seconds.length == 2)) {
      if (format != TIME_FORMAT_12 || hoursNumber > 0) {
        isValid = true;
      }

      if (isValid) {
        if (format == TIME_FORMAT_24 && (hoursNumber < 0 || hoursNumber > 23)) {
          isValid = false;
        } else if (format == TIME_FORMAT_12 && (hoursNumber < 0 || hoursNumber > 12)) {
          isValid = false;
        } else if (minutesNumber < 0 || minutesNumber > 59) {
          isValid = false;
        } else if (secondsNumber < 0 || secondsNumber > 59) {
          isValid = false;
        }
      }
    }
  }

  return isValid;
};

Tools.parseDate = (anyDate, opt = {}) => {
  let result;
  if (anyDate == null || anyDate === "") {
    result = null;
  } else if (anyDate instanceof Date) {
    result = new Date(anyDate);
  } else if (typeof anyDate === "number") {
    result = new Date(anyDate);
  } else if (typeof anyDate === "string") {
    let stringDate = anyDate;
    let { format, country } = opt;

    // attempt to match a shortened date formats
    let potentiallyParsedDate;
    if (stringDate.match(/^\d{4}-\d{2}$/)) {
      // matches YYYY-MM
      potentiallyParsedDate = Tools.parseMonth(stringDate);
    } else if (stringDate.match(/^\d{2}\/\d{4}$/)) {
      // matches MM/YYYY
      potentiallyParsedDate = Tools.parseMonth(stringDate);
    } else if (stringDate.match(/^\d{4}$/)) {
      // matches YYYY
      potentiallyParsedDate = Tools.parseYear(stringDate);
    }
    if (potentiallyParsedDate) return potentiallyParsedDate;

    // parse the date according to the format string (fallback to country then to default format by locale)
    format = format || Environment.dateTimeFormat[country] || Tools.getLocaleFormat(country || Tools.getLanguage());
    format = format.replace(/m+/gi, "MM").replace(/d+/gi, "dd").replace(/Y+/g, "yyyy"); // change format to widely-used one (dd MM yyyy)

    // Always allow ISO date format
    if (stringDate.match(/^(\d{4})-(\d{2})-(\d{2})$/)) {
      format = "yyyy-MM-dd";
    } else if (
      Tools.isISODateString(stringDate) ||
      Tools.isISODateString(stringDate.replace(/ \d{1,2}:\d{1,2}(:\d{1,2})?/, ""))
    ) {
      return new Date(stringDate);
    } else {
      // this is a fix for a format yyyy-MM-dd hours:minutes:seconds
      let assumedStringDate = stringDate.replace(/ \d{1,2}:\d{1,2}(:\d{1,2})?/, "");
      if (assumedStringDate.match(/^(\d{4})-(\d{2})-(\d{2})$/)) {
        stringDate = assumedStringDate;
        format = "yyyy-MM-dd";
      }
    }

    let date = new Date(Date.now());
    date.setHours(0, 0, 0, 0);
    // let val = { y: date.getFullYear(), M: date.getMonth() + 1, d: date.getDate(), q: Math.floor(date.getMonth() / 3) };
    let val = { y: 0, M: undefined, d: undefined, q: 0 };
    let formatIdx = 0;
    for (let i = 0, len = stringDate.length; i < len && formatIdx < format.length; ) {
      // skip whitespaces and get format portion (e.g. "MMM")
      while (formatIdx < format.length && format.charAt(formatIdx).match(/\s/)) ++formatIdx;
      if (formatIdx == format.length) break;
      let formatLen = formatIdx;
      let formatChar = format.charAt(formatIdx++);
      while (formatIdx < format.length && format.charAt(formatIdx) == formatChar) ++formatIdx;
      formatLen = formatIdx - formatLen;

      // skip whitespaces
      while (i < len && stringDate.charAt(i).match(/\s/)) ++i;
      if (i == len) break;

      switch (formatChar) {
        case "M":
        case "d":
        // if (formatLen > 2) throw new Error("Parsing date with month / day names not implemented yet.");
        // fall through
        case "q":
        case "y": {
          let nextI = stringDate.substr(i).search(/\D|$/) + i;
          let s = stringDate.substr(i, nextI - i);
          if (!s) return null; // expecting number but got no digits
          let n = parseInt(s, 10);
          if (formatChar == "y" && formatLen <= 2) {
            n = n % 100;
            let cy = new Date().getFullYear();
            n = cy - 70 - ((cy - 70) % 100) + n + (n > (cy - 70) % 100 ? 0 : 100); // split from current: 70 in the past, the rest (~30) ahead
          }
          val[formatChar] = n;
          i = nextI;
          break;
        }
        default:
          for (let j = 0; j < formatLen && i < len; ++i) {
            let c = stringDate.charAt(i);
            if (c.match(/\s/)) continue;
            if (c != formatChar) {
              // backward compatibility - treat ./- characters as interchangeable
              if (!(c.match(/[-./]/) && formatChar.match(/[-./]/))) {
                return null; // format contains different character than the input
              }
            }
            ++j;
          }
      }
    }
    if (formatIdx < format.length) return null;

    // check values
    if (val.y < 1000 || val.y > 9999) return null;
    if (val.M === 0 || val.M > 12) return null; // invalid month - undefined is allowed for shortened dates
    let y = val.y;
    let monthDays = [
      31,
      y % 400 === 0 || (y % 4 === 0 && y % 100 !== 0) ? 29 : 28,
      31,
      30,
      31,
      30,
      31,
      31,
      30,
      31,
      30,
      31,
    ];
    if (val.d === 0 || val.d > monthDays[val.M - 1]) return null; // invalid day - undefined is allowed for shortened dates
    result = new Date(val.y, val.M - 1 || 0, val.d || 1, 0, 0, 0, 0);
  } else {
    result = null;
  }

  return result;
};

Tools.parseMonth = (stringDate) => {
  let day = 1;
  let month, year, parts;

  if (/^\d{2}\/\d{4}$/.test(stringDate)) {
    // 02/2019
    parts = stringDate.split("/");
    month = parts[0] - 1;
    year = parts[1];
  } else if (/^\d{4}-\d{2}$/.test(stringDate)) {
    // 2019-02
    parts = stringDate.split("-");
    month = parts[1] - 1;
    year = parts[0];
  }

  return new Date(year, month, day);
};

Tools.parseYear = (stringDate) => {
  let day = 1;
  let month = 0;
  let year = parseInt(stringDate.match(/^\d{4}$/)[0]);

  return new Date(year, month, day);
};

Tools.compareDates = (firstDate, secondDate, method, depth = "seconds") => {
  let result = false;

  if (firstDate && secondDate) {
    let firstMonth = 0;
    let firstDay = 0;
    let firstHour = 0;
    let firstMinute = 0;
    let firstSecond = 0;

    let secondMonth = 0;
    let secondDay = 0;
    let secondHour = 0;
    let secondMinute = 0;
    let secondSecond = 0;

    if (depth === "seconds" || depth === "minutes" || depth === "hours" || depth === "days" || depth === "months") {
      firstMonth = firstDate.getMonth();
      secondMonth = secondDate.getMonth();
    }

    if (depth === "seconds" || depth === "minutes" || depth === "hours" || depth === "days") {
      firstDay = firstDate.getDate();
      secondDay = secondDate.getDate();
    }

    if (depth === "seconds" || depth === "minutes" || depth === "hours") {
      firstHour = firstDate.getHours();
      secondHour = secondDate.getHours();
    }

    if (depth === "seconds" || depth === "minutes") {
      firstMinute = firstDate.getMinutes();
      secondMinute = secondDate.getMinutes();
    }

    if (depth === "seconds") {
      firstSecond = firstDate.getSeconds();
      secondSecond = secondDate.getSeconds();
    }

    firstDate = Date.UTC(firstDate.getFullYear(), firstMonth, firstDay, firstHour, firstMinute, firstSecond);

    secondDate = Date.UTC(secondDate.getFullYear(), secondMonth, secondDay, secondHour, secondMinute, secondSecond);

    if (method === "equals") {
      result = firstDate === secondDate;
    } else if (method === "greater") {
      result = firstDate > secondDate;
    } else if (method === "lesser") {
      result = firstDate < secondDate;
    }
  }

  return result;
};

Tools.formatTime = (timeObject, displaySeconds, timeFormat, includeTimeFormat, timeStep, fill0) => {
  let formatedTime = "";

  if (timeObject && typeof timeObject === "object") {
    let dayPart = timeObject.dayPart;
    if (timeFormat == TIME_FORMAT_12) {
      if (dayPart === TIME_FORMAT_PM) {
        if (timeObject.hours > 12) {
          timeObject.hours -= 12;
        }
      }
      if (timeObject.hours === 0) {
        timeObject.hours = 12;
        dayPart = dayPart ? dayPart : TIME_FORMAT_AM;
      } else if (timeObject.hours === 12) {
        dayPart = dayPart ? dayPart : TIME_FORMAT_PM;
      }
    }

    if (fill0) {
      formatedTime =
        Tools.rjust(timeObject.hours, 2, "0") +
        ":" +
        Tools.rjust(timeObject.minutes, 2, "0") +
        (displaySeconds && timeStep === 1 ? ":" + Tools.rjust(timeObject.seconds, 2, "0") : "");
    } else {
      formatedTime = timeObject.hours + ":" + timeObject.minutes + ":" + timeObject.seconds;
    }

    if (timeFormat == TIME_FORMAT_12 && includeTimeFormat) {
      formatedTime += " " + dayPart;
    }
  }

  return formatedTime;
};

Tools.parseTime = (stringTime, timeFormat, autofill, allow24) => {
  stringTime = stringTime || "00:00:00";
  stringTime = stringTime.trim();
  let parsedTime = null;
  let maxHours = allow24 ? 24 : 23;

  if (typeof stringTime === "string" && stringTime !== "") {
    parsedTime = {
      hours: 0,
      minutes: 0,
      seconds: 0,
    };

    if (stringTime.indexOf(":") !== -1) {
      let dateArray = stringTime.split(":");
      parsedTime.hours = (dateArray[0] && parseInt(dateArray[0].trim())) || 0;
      parsedTime.minutes = (dateArray[1] && parseInt(dateArray[1].trim())) || 0;
      parsedTime.seconds = (dateArray[2] && parseInt(dateArray[2].trim())) || 0;
    } else if (autofill) {
      parsedTime.hours = parseInt(stringTime) || 0;
    } else {
      parsedTime = null;
    }

    if (parsedTime) {
      if (
        parsedTime.hours < 0 ||
        parsedTime.hours > maxHours ||
        parsedTime.minutes < 0 ||
        parsedTime.minutes > 59 ||
        parsedTime.seconds < 0 ||
        parsedTime.seconds > 59
      ) {
        parsedTime = null;
      } else if (timeFormat == 12) {
        if (parsedTime.hours > 12) {
          parsedTime.hours -= 12;
        } else if (parsedTime.hours == 0) {
          parsedTime.hours = 12;
        }

        if (stringTime.match(/[Pp]\.?([Mm]\.?)?/)) {
          parsedTime.dayPart = TIME_FORMAT_PM;
        } else {
          parsedTime.dayPart = TIME_FORMAT_AM;
        }
      }
    }
  }

  return parsedTime;
};

Tools.changeTimeFormat = (timeString, format) => {
  let result = null;
  let inputFormat = timeString.match(/AM$|PM$/) ? 12 : 24;
  let timeObject = Tools.parseTime(timeString, inputFormat, true, false);

  if (format == TIME_FORMAT_24 && inputFormat == TIME_FORMAT_12) {
    if (timeObject.dayPart === "PM") {
      timeObject.hours += 12;
    }

    result = Tools.formatTime(timeObject, !!timeString.match(/:/)[2], 24, true, 0, true);
  }
  // TODO
  // else if (format == TIME_FORMAT_24) {

  // }

  return result;
};

Tools.compareTimeObjects = (firstTime, secondTime, method) => {
  let result = true;
  firstTime = firstTime.hours * 60 * 60 + firstTime.minutes * 60 + firstTime.seconds;
  secondTime = secondTime.hours * 60 * 60 + secondTime.minutes * 60 + secondTime.seconds;

  if (method === "equals") {
    if (firstTime !== secondTime) {
      result = false;
    }
  } else if (method === "greater") {
    if (firstTime <= secondTime) {
      result = false;
    }
  } else if (method === "lesser") {
    if (firstTime >= secondTime) {
      result = false;
    }
  }

  return result;
};

Tools.cloneDateObject = (dateObject) => {
  let result = null;

  if (dateObject instanceof Date) {
    result = new Date(dateObject.valueOf());
  }

  return result;
};

Tools.formatNumber = (
  number,
  { maxDecimals, roundType, country, thousandSeparator, decimalSeparator, minDecimals } = {}
) => {
  const roundedNum = maxDecimals == null ? number : Tools.decimalAdjust(roundType, number, maxDecimals * -1);
  let formattedNum;

  if (thousandSeparator || decimalSeparator || Environment.numberFormat[country]) {
    const [num, numDecimals] = (roundedNum + "").split(".");

    const numberFormat = Environment.numberFormat[country] || {};
    const thousandSep =
      thousandSeparator == null
        ? numberFormat.thousandSeparator == null
          ? ""
          : numberFormat.thousandSeparator
        : thousandSeparator;
    const decimalSep =
      decimalSeparator == null
        ? numberFormat.decimalSeparator == null
          ? "."
          : numberFormat.decimalSeparator
        : decimalSeparator;

    const formattedArr = [num.replace(REGEXP.numberParts, thousandSep)];

    if (minDecimals != null || numDecimals) {
      formattedArr.push(Tools.ljust(numDecimals || "0", minDecimals, "0"));
    }

    formattedNum = formattedArr.join(decimalSep);
  } else {
    formattedNum = roundedNum.toLocaleString(country, {
      minimumFractionDigits: minDecimals,
      maximumFractionDigits: maxDecimals == null ? 20 : maxDecimals,
    });
  }

  return formattedNum;
};

Tools.normalizeNumberSeparators = (number, opt = {}) => {
  let thousandSeparator = opt.thousandSeparator;
  let decimalSeparator = opt.decimalSeparator;

  if (number) {
    if (thousandSeparator) {
      number = number
        .toString()
        .trim()
        .replace(new RegExp(thousandSeparator.replace(/[.?*+^$[\]\\(){}|]/g, "\\$&"), "g"), "");
    }

    if (decimalSeparator) {
      number = number.toString().replace(new RegExp(decimalSeparator.replace(/[.?*+^$[\]\\(){}|]/g, "\\$&"), "g"), ".");
    }
  }

  return number;
};

Tools.parseNumber = (number, opt = {}) => {
  return +Tools.normalizeNumberSeparators(number, opt);
};

// TODO: deprecated
Tools.getLSIItemByLanguage = (lsi, params, languages) => {
  Tools.warning(
    "Method UU5.Common.Tools.getLSIItemByLanguage is deprecated. Use UU5.Common.Tools.getLsiItemByLanguage instead."
  );
  return Tools.getLsiItemByLanguage(lsi, params, languages);
};

/**
 * Creates a debounced function that delays invoking `func` until after `wait`
 * milliseconds have elapsed since the last time the debounced function was
 * invoked. The debounced function comes with a `cancel` method to cancel
 * delayed `func` invocations and a `flush` method to immediately invoke them.
 * Provide `options` to indicate whether `func` should be invoked on the
 * leading and/or trailing edge of the `wait` timeout. The `func` is invoked
 * with the last arguments provided to the debounced function. Subsequent
 * calls to the debounced function return the result of the last `func`
 * invocation.
 *
 * **Note:** If `leading` and `trailing` options are `true`, `func` is
 * invoked on the trailing edge of the timeout only if the debounced function
 * is invoked more than once during the `wait` timeout.
 *
 * If `wait` is `0` and `leading` is `false`, `func` invocation is deferred
 * until to the next tick, similar to `setTimeout` with a timeout of `0`.
 *
 * See [David Corbacho's article](https://css-tricks.com/debouncing-throttling-explained-examples/)
 * for details over the differences between `_.debounce` and `_.throttle`.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Function
 * @param {Function} func The function to debounce.
 * @param {number} [wait=0] The number of milliseconds to delay.
 * @param {Object} [options={}] The options object.
 * @param {boolean} [options.leading=false]
 *  Specify invoking on the leading edge of the timeout.
 * @param {number} [options.maxWait]
 *  The maximum time `func` is allowed to be delayed before it's invoked.
 * @param {boolean} [options.trailing=true]
 *  Specify invoking on the trailing edge of the timeout.
 * @returns {Function} Returns the new debounced function.
 * @example
 *
 * // Avoid costly calculations while the window size is in flux.
 * jQuery(window).on('resize', _.debounce(calculateLayout, 150));
 *
 * // Invoke `sendMail` when clicked, debouncing subsequent calls.
 * jQuery(element).on('click', _.debounce(sendMail, 300, {
 *   'leading': true,
 *   'trailing': false
 * }));
 *
 * // Ensure `batchLog` is invoked once after 1 second of debounced calls.
 * var debounced = _.debounce(batchLog, 250, { 'maxWait': 1000 });
 * var source = new EventSource('/stream');
 * jQuery(source).on('message', debounced);
 *
 * // Cancel the trailing debounced invocation.
 * jQuery(window).on('popstate', debounced.cancel);
 */
Tools.debounce = Utils.Function.debounce;

/**
 * Creates a throttled function that only invokes `func` at most once per
 * every `wait` milliseconds. The throttled function comes with a `cancel`
 * method to cancel delayed `func` invocations and a `flush` method to
 * immediately invoke them. Provide `options` to indicate whether `func`
 * should be invoked on the leading and/or trailing edge of the `wait`
 * timeout. The `func` is invoked with the last arguments provided to the
 * throttled function. Subsequent calls to the throttled function return the
 * result of the last `func` invocation.
 *
 * **Note:** If `leading` and `trailing` options are `true`, `func` is
 * invoked on the trailing edge of the timeout only if the throttled function
 * is invoked more than once during the `wait` timeout.
 *
 * If `wait` is `0` and `leading` is `false`, `func` invocation is deferred
 * until to the next tick, similar to `setTimeout` with a timeout of `0`.
 *
 * See [David Corbacho's article](https://css-tricks.com/debouncing-throttling-explained-examples/)
 * for details over the differences between `_.throttle` and `_.debounce`.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Function
 * @param {Function} func The function to throttle.
 * @param {number} [wait=0] The number of milliseconds to throttle invocations to.
 * @param {Object} [options={}] The options object.
 * @param {boolean} [options.leading=true]
 *  Specify invoking on the leading edge of the timeout.
 * @param {boolean} [options.trailing=true]
 *  Specify invoking on the trailing edge of the timeout.
 * @returns {Function} Returns the new throttled function.
 * @example
 *
 * // Avoid excessively updating the position while scrolling.
 * jQuery(window).on('scroll', _.throttle(updatePosition, 100));
 *
 * // Invoke `renewToken` when the click event is fired, but not more than once every 5 minutes.
 * var throttled = _.throttle(renewToken, 300000, { 'trailing': false });
 * jQuery(element).on('click', throttled);
 *
 * // Cancel the trailing throttled invocation.
 * jQuery(window).on('popstate', throttled.cancel);
 */
Tools.throttle = (func, wait, options = {}) => {
  var leading = true,
    trailing = true;

  //if (typeof func !== 'function') {
  //  throw new TypeError(FUNC_ERROR_TEXT);
  //}
  //if (isObject(options)) {
  if (typeof options === "object") {
    leading = "leading" in options ? !!options.leading : leading;
    trailing = "trailing" in options ? !!options.trailing : trailing;
  }
  return Tools.debounce(func, wait, {
    leading: leading,
    maxWait: wait,
    trailing: trailing,
  });
};

Tools.buildColWidthClassName = (colWidth) => {
  var newBsColWidth = colWidth;

  if (typeof newBsColWidth === "string") {
    var colWidthArray = newBsColWidth.trim().split(REGEXP.splitByWhiteSpace);
    newBsColWidth = {};
    colWidthArray.forEach((colWidthPart) => {
      var match = colWidthPart.match(REGEXP.columnRegexp);

      if (match) {
        newBsColWidth[match[1]] = parseInt(match[2]);
      } else {
        Tools.error("colWidth className couldn't be created", { value: colWidth });
      }
    });
  }

  var sizeClassNames = [];
  var lowerWidth = 12;

  ["xs", "s", "m", "l", "xl"].forEach((size) => {
    typeof newBsColWidth[size] !== "number" && typeof lowerWidth === "number" && (newBsColWidth[size] = lowerWidth);
    (lowerWidth = newBsColWidth[size]) &&
      typeof lowerWidth === "number" &&
      sizeClassNames.push(`uu5-col-${size}` + newBsColWidth[size]);

    typeof newBsColWidth[`offset-${size}`] === "number" &&
      sizeClassNames.push(`uu5-col-offset-${size}` + newBsColWidth[`offset-${size}`]);
  });

  return sizeClassNames.join(" ");
};

// deprecated! use UU5.Common.Context.create
Tools.createContext = Context.create;

Tools.wrapIfExists = (Wrapper, ...content) => {
  if (Wrapper) {
    return Element.create(Wrapper, null, ...content);
  } else {
    return content;
  }
};

Tools.fillUnit = (value, defaultUnit = "px") => {
  if (value != null) {
    if (value === 0) return value;
    value += "";
    return /\d$/.test(value) ? value + defaultUnit : value;
  }
};

Tools.getCallToken = async function (url, session) {
  let token;
  if (session) {
    let a = document.createElement("a");
    a.href = url || "";
    let fullUrl = a.href.toString(); // browser-normalized URL (removed "../" sequences, ensured that protocol+domain is present, ...)
    let scope =
      typeof session.getCallTokenScope === "function"
        ? await session.getCallTokenScope(fullUrl)
        : fullUrl.replace(/[?#].*/, "");
    let callToken = await session.getCallToken(scope, { excludeAuthenticationType: true }); // if using deprecated uu_oidcg01 the result will be an object (and "url" parameter got ignored), otherwise it's string
    token = typeof callToken === "string" ? callToken : callToken ? callToken.token : undefined;
  }
  return token;
};

Tools.getCsrfToken = function () {
  return Tools.getCookie(COOKIE_CSRF_TOKEN);
};

Tools.getAuthenticatedUrl = async function (url, session, accessToken = undefined, csrfToken = undefined) {
  let parameterName;
  let value = accessToken === undefined ? await Tools.getCallToken(url, session) : accessToken;
  if (value) {
    parameterName = "access_token";
  } else {
    value = csrfToken === undefined ? Tools.getCsrfToken() : csrfToken;
    if (value) parameterName = "csrf_token";
  }
  let result = url;
  if (url && parameterName) {
    let parsedUrl = Url.parse(url);
    result = parsedUrl.set({ parameters: { ...parsedUrl.parameters, [parameterName]: value } }).toString();
  }
  return result;
};

Tools.getAuthenticatedHeaders = async function (url, session, accessToken = undefined, csrfToken = undefined) {
  let headers = {};
  let token1 = accessToken === undefined ? await Tools.getCallToken(url, session) : accessToken;
  if (token1) headers["Authorization"] = "Bearer " + token1;
  else {
    let token2 = csrfToken === undefined ? Tools.getCsrfToken() : csrfToken;
    if (token2) headers["X-Csrf-Token"] = token2;
  }
  return headers;
};

Tools.deepSortObjectKeys = (object) => {
  let sortedObject = {};

  Object.keys(object)
    .sort()
    .forEach(function (key) {
      let value = object[key];
      sortedObject[key] = value && typeof value === "object" ? Tools.deepSortObjectKeys(value) : value;
    });

  return sortedObject;
};

const groupCallCache = {};
Tools.groupCall = (uri, dtoIn, doLoadFn) => {
  if (!groupCallCache.data) groupCallCache.data = {};
  const cacheKey = uri + " " + JSON.stringify(Tools.deepSortObjectKeys(dtoIn));
  let data = groupCallCache.data[cacheKey];

  if (!data) {
    data = groupCallCache.data[cacheKey] = {
      result: null,
    };
    const promise = doLoadFn().then(
      (result) => {
        data.result = result;
        setTimeout(() => {
          delete groupCallCache.data[cacheKey];
        }, 100);
        return result;
      },
      (error) => {
        data.error = error;
        setTimeout(() => {
          delete groupCallCache.data[cacheKey];
        }, 100);
        return Promise.reject(error);
      }
    );
    data.promise = promise;
  }

  return data.promise;
};

Tools.openWindow = (url, target) => {
  let features;
  // cannot use window.open(url, "_blank", "noopener") in Edge, ... because it will open new window, not new tab
  if (target === "_blank" && (Tools.isChrome() || navigator.userAgent.match(/\bfirefox\//i))) {
    features = "noopener";
  }
  return window.open(url, target, features);
};

// userLanguage for IE
const lang = window.navigator.userLanguage || window.navigator.language;
lang && Tools.setLanguage(lang);

// CSS class names - device / UA
let device = "uu5-device-desktop";
if (Tools.isMobileOrTablet) {
  device = "uu5-device-mobile-tablet";
}

document.documentElement.classList.add(device);

if (Tools.isMobileIOS()) {
  document.documentElement.classList.add("uu5-device-ios");
}

let ua;
if (navigator.userAgent.match(/MSIE|Trident/)) ua = "uu5-ua-ie";
else if (navigator.userAgent.match(/Edge/)) ua = "uu5-ua-edge";
else if (navigator.userAgent.match(/Chrome/)) ua = "uu5-ua-chrome";
else if (navigator.userAgent.match(/Safari/)) ua = "uu5-ua-safari";
else if (navigator.userAgent.match(/Mozilla/)) ua = "uu5-ua-ff";
if (ua) document.documentElement.classList.add(ua);

export default Tools;
