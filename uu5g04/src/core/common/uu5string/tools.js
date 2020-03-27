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

import SYMBOLS from "./symbols";
import {
  TAG,
  TEMPLATE_REG_EXP,
  UU5STRING_REGEXP,
  ATTR_REGEXP,
  ATTR_VALUE_TYPE_REGEXP,
  UU5DATA_REGEXP,
  JSCODE_REGEXP
} from "./constants";
import Environment from "../../environment/environment";
import _Tools from "../tools.js";
import UU5Data from "./uu5-data.js";
import UU5Json from "./uu5-json.js";

export const defaultPlainTextFilterFn = ({ tag, props }) => {
  if (props) {
    let result = { tag, props: {} };
    if (props.header) {
      result.props.header = props.header;
    }
    if (props.uu5string) {
      result.props.uu5string = props.uu5string;
    }
    if (props.content || props.children) {
      result.props.children = props.content || props.children;
    }
    if (props.footer) {
      result.props.footer = props.footer;
    }
    return result;
  }
};

const Tools = {
  /*
    Transform content into React components.

    @param content - array of UU5StringObjects, strings, numbers, booleans and UU5StringTemplates
    @param data - map with data for UU5String templates
    @param filterFn({tag, props}) - function to change tag and props used for rendering into components. Function is called for each descendant UU5StringObject before creation of React component. This function cannot change data of UU5StringObjects.
    @returns array of React components
   */
  contentToChildren(content, data, filterFn, preferChildrenAsFunction = false) {
    if (!content || !content.length) {
      return null;
    }
    return content.map((item, index) =>
      typeof item === "string"
        ? Tools.printTemplateToChildren(Environment.textEntityMap.replace(item), data)
        : Tools._contentWithKeyToChildren(item, index, data, filterFn, preferChildrenAsFunction)
    );
  },

  // render all children with stable key derivated from child index
  _contentWithKeyToChildren(item, index, data, filterFn, preferChildrenAsFunction) {
    // let props = item.props.clone();
    // let original = item.props;
    let props = item.props.toObject();
    if (!props.key) {
      item.props.props.push({ name: "key", value: props.id || `uu5string-child_${index}` });
    }
    // item.props = props;
    const result = item.toChildren(data, filterFn, preferChildrenAsFunction);
    // item.props = original;
    if (!props.key) {
      item.props.props.pop();
    }
    return result;
  },

  /*
    Transform content into string.

    @param content - array of UU5StringObjects, strings, numbers, booleans and UU5StringTemplates
    @param data - map with data for UU5String templates
    @param filterFn({tag, props}) - function to change tag and props used for printing into string. Function is called for each descendant UU5StringObject before print into string. This function cannot change data of UU5StringObjects.
    @returns string
  */
  contentToString(content, data, filterFn) {
    if (!content || !content.length) {
      return "";
    }
    if (typeof content === "string") {
      return Tools.printTemplateToString(content, data);
    }
    let result = "";
    content.forEach(
      item =>
        (result += typeof item === "string" ? Tools.printTemplateToString(item, data) : item.toString(data, filterFn))
    );
    return result;
  },

  /*
    Transform content into plain text. Returned string will not contain tags, but only text from their props. If parameter data is undefined, data passed into constructor will be used instead.

    @param data - map with data for UU5String templates
    @param filterFn({tag, props}) - function to change props used for printing into plain text. Function is called for each descendant UU5StringObject before print props into plain text.
    @returns string
  */
  contentToPlainText(content, data, filterFn) {
    if (!content || !content.length) {
      return "";
    }
    if (typeof content === "string") {
      return Tools.printTemplateToString(content, data);
    }
    let result = "";
    content.forEach(item => {
      result +=
        (result ? " " : "") +
        (typeof item === "string" ? Tools.printTemplateToString(item, data) : item.toPlainText(data, filterFn));
    });
    return result.replace(/\s+/g, " ").trim();
  },

  printTemplateToString(string, data) {
    if (!data) {
      return string;
    }
    let result = Tools._printTemplate(string, data);
    return result.length === 1 ? result[0] : result.join("");
  },

  printTemplateToChildren(string, data) {
    if (!data) {
      return string;
    }
    let isChildren;
    let result = Tools._printTemplate(string, data, matchValue => {
      if (typeof matchValue === "string" && matchValue.match(UU5STRING_REGEXP) && Tools.isValidUU5String(matchValue)) {
        isChildren = true;
        // create component by _Tools.findComponent
        return Tools.parseUu5String(matchValue, Tools._buildReactComponent);
      }
      return matchValue;
    });

    // result contains parsed UU5String - return array
    if (isChildren) return result;

    return result.length === 1 ? result[0] : result.join("");
  },

  _buildReactComponent(tag, propsString, children) {
    if (!tag) return children;
    let propsArray = propsString ? Tools.parseUU5StringProps(propsString, Tools._buildReactComponent) : [];
    let props = {};
    propsArray.forEach(item => (props[item.name] = item.value));
    return _Tools.findComponent(tag, props, children);
  },

  _printTemplate(string, data, matchHandler) {
    // check if string is single template - in this case return template result ( posible another type then string )
    // let isTemplate = string.match(CHECK_IS_TEMPLATE);
    let useMatchHandler = typeof matchHandler === "function";

    let result = [];
    let templateMatch = TEMPLATE_REG_EXP.exec(string);
    let startIndex = 0;
    let endIndex = 0;
    /*
    template[1] - name
    template[2] - default value prefixed by :
    template[3] - default value
    */
    while (templateMatch) {
      let templateName = templateMatch[1];
      let value;

      endIndex = TEMPLATE_REG_EXP.lastIndex - templateMatch[0].length;
      if (endIndex > startIndex) {
        result.push(string.substring(startIndex, endIndex));
      }
      startIndex = TEMPLATE_REG_EXP.lastIndex;

      if (data[templateName]) {
        // check data
        let template = data[templateName];
        value = typeof template === "function" ? template() : template;
      } else if (SYMBOLS[templateName]) {
        // check symbols
        let template = SYMBOLS[templateName];
        value = typeof template === "function" ? template() : template;
      } else {
        // replace template by default value or empty string
        value = templateMatch[3] === undefined ? templateMatch[0] : templateMatch[3];
      }

      if (useMatchHandler) {
        let matchResult = matchHandler(value);
        if (Array.isArray(matchResult)) {
          matchResult.forEach(item => result.push(item));
        } else {
          result.push(matchResult);
        }
      } else {
        result.push(value);
      }

      templateMatch = TEMPLATE_REG_EXP.exec(string);
    }

    // add string after end of last match
    if (startIndex < string.length) {
      result.push(string.substring(startIndex));
    }

    return result;
  },

  isValidUU5String(uu5string) {
    if (typeof uu5string !== "string") return false;
    try {
      Tools.parseUu5String(uu5string);
      return true;
    } catch (e) {
      return false;
    }
  },

  parseUu5String(uu5string, buildItem) {
    if (!uu5string || typeof uu5string !== "string" || uu5string.length === 0) {
      return [];
    }

    uu5string = uu5string.trim().replace(/\r\n/g, "\n");

    let tagsRegExp = Environment.uu5StringTagsRegExp || null;

    let childStack = [
      {
        tag: "_root",
        children: [],
        index: 0
      }
    ];

    let pointer = childStack[0];

    let cIndex = -1;
    let pIndex = 0;
    let pre = false;
    let preTag = "";

    let matchS;
    let matchUu5String = uu5string.match(UU5STRING_REGEXP);
    if (matchUu5String) {
      // !!!!! Never put uu5stringRe to constants, otherwise it gets stuck - because of exec method on regexp
      // groups: comp name, attrs, -, -, -, self-closing, closing tag comp name, content upto next tag
      let tagRe = new RegExp(TAG, "g");
      pIndex = tagRe.lastIndex = matchUu5String[0].length;
      matchS = tagRe.exec(uu5string);

      while (matchS) {
        cIndex = matchS.index;
        if (cIndex > pIndex) {
          let head = uu5string.substring(pIndex, cIndex);
          let text = head;
          // let text = pre ? Environment.textEntityMap.replaceHtmlEntity(head) : Environment.textEntityMap.replace(head);
          pointer.children.push(typeof buildItem === "function" ? buildItem(null, null, text) : text);
        }
        let childTag = matchS[1] || matchS[9];
        let attrs = matchS[2];
        let isClosing = !!matchS[9];
        let isSelfClosing = !!matchS[8];
        let tagObj;

        if ((pre && !(childTag === preTag && isClosing)) || (childTag && childTag.match(/^script$/i))) {
          let text = matchS[0];
          // let text = Environment.textEntityMap.replaceHtmlEntity(matchS[0]);
          pointer.children.push(typeof buildItem === "function" ? buildItem(null, null, text) : text);
        } else {
          if (isClosing) {
            //closing tag

            tagObj = childStack.pop();

            if (tagObj.tag !== childTag) {
              const err = new Error(`Invalid uu5string: Tag ${tagObj.tag} at position ${tagObj.index} is not closed.`);
              err.code = "uu5StringInvalid";
              err.context = { uu5string, tag: tagObj.tag, index: tagObj.index };
              throw err;
            }

            pointer = childStack[childStack.length - 1];

            if (pre) {
              pre = false;
              let text = tagObj.children.join("");
              // let text = Environment.textEntityMap.replaceHtmlEntity(tagObj.children.join(''));
              pointer.children[pointer.children.length - 1] =
                typeof buildItem === "function" ? buildItem(tagObj.tag, tagObj.attrs, text) : text;
            } else {
              if (tagObj.forbidden) {
                tagObj.children = `Error: Tag <${tagObj.tag} /> is not allowed.`;
                tagObj.tag = "Error";
              }
              pointer.children[pointer.children.length - 1] =
                typeof buildItem === "function" ? buildItem(tagObj.tag, tagObj.attrs, tagObj.children, true) : tagObj;
            }
          } else {
            // prevent parsing json inside uu5json
            pre = childTag === "uu5string.pre" || childTag === "uu5json";
            preTag = childTag;
            tagObj = { tag: childTag, children: [], index: matchS.index };

            if (tagsRegExp && !tagsRegExp.test(childTag)) tagObj.forbidden = true;
            else if (attrs) {
              tagObj.attrs = attrs;
            }

            if (isSelfClosing) {
              //self-closing tag
              pre = false;

              if (childTag.indexOf("uu5string.") === 0) {
                //meta-tag uu5string.*
                let s = Tools.execMetaTag(childTag, tagObj.attrs);
                if (s)
                  s.forEach(item =>
                    pointer.children.push(typeof buildItem === "function" ? buildItem(null, null, item) : item)
                  );
              } else {
                pointer.children.push(
                  typeof buildItem === "function" ? buildItem(tagObj.tag, tagObj.attrs, tagObj.children, false) : tagObj
                );
              }
            } else {
              //common tag
              pointer.children.push(tagObj);
              childStack.push(tagObj);
              pointer = tagObj;
            }
          }
        }
        pIndex = cIndex + matchS[0].length;
        matchS = tagRe.exec(uu5string);
      }
      // handle ending text
      if (pIndex < uu5string.length) {
        let text = uu5string.substr(pIndex);
        // text = pre ? Environment.textEntityMap.replaceHtmlEntity(text) : Environment.textEntityMap.replace(text);
        pointer.children.push(typeof buildItem === "function" ? buildItem(null, null, text) : text);
      }

      if (childStack.length > 1) {
        let tagObj = childStack.pop();

        const err = new Error(`Invalid uu5string: Tag ${tagObj.tag} at position ${tagObj.index} is not closed.`);
        err.code = "uu5StringInvalid";
        err.context = { uu5string, tag: tagObj.tag, index: tagObj.index };
        throw err;
      }
    } else {
      pointer.children.push(typeof buildItem === "function" ? buildItem(null, null, uu5string) : uu5string);
    }

    return pointer.children;
  },

  parseUU5StringProps(attrsString, buildItem) {
    let attrs = [];

    // group1 = separator
    // group2 = attribute name
    // group3 = name and value separator
    // group4 = attribute value
    // group5 = indication that attribute value is not wrapped into quotes / single quotes
    let attrsReg = new RegExp(ATTR_REGEXP.source, "g");
    let matchAttrs = attrsReg.exec(attrsString);

    while (matchAttrs) {
      let separator = matchAttrs[1];
      let name = matchAttrs[2];
      let valueDelimiter = matchAttrs[3];
      let valueBoundaries = "";
      let value = true;
      let uu5DataKey = undefined;
      let valueType = null; // hold info if data is parsed from uu5string, uu5data or uu5json
      let matchValue = matchAttrs[4];
      let isUnquoted = !!matchAttrs[5];

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
        if (matchValue[0] === "'") {
          valueBoundaries = "'";
          matchValue = matchValue.substr(1, matchValue.length - 2).replace(/\\([\\'])/g, "$1");
        } else if (matchValue[0] === '"') {
          valueBoundaries = '"';
          matchValue = matchValue.substr(1, matchValue.length - 2).replace(/\\([\\"])/g, "$1");
        }

        let matchValueType = matchValue.match(ATTR_VALUE_TYPE_REGEXP);
        if (matchValueType[1]) {
          //uu5JSON
          valueType = "uu5json";
          try {
            value = UU5Json.parse(matchValue);
          } catch (e) {
            e.context.prop = name;
            throw e;
          }
        } else if (matchValueType[2]) {
          //uu5String
          valueType = "uu5string";
          value = Tools.parseUu5String(matchValue, buildItem);
        } else if (matchValueType[3]) {
          //uu5Data
          valueType = "uu5data";
          uu5DataKey = matchValue.replace(UU5DATA_REGEXP, "");
          value = UU5Data.parse(matchValue);
        } else {
          //as-is
          if (name === "href") {
            matchValue = matchValue.replace(JSCODE_REGEXP, "");
          }

          value = matchValue;
        }
      }

      attrs.push({ name, value, valueDelimiter, separator, valueBoundaries, valueType, uu5DataKey });
      matchAttrs = attrsReg.exec(attrsString);
    }

    return attrs;
  },

  execMetaTag(tag, args) {
    //TODO implement each metaTag as separate function, call functions dynamically (witch safety keyword guard)
    let metaTag = tag.slice(10);
    let r = [];
    switch (metaTag) {
      case "now":
        r.push(SYMBOLS.now());
        break;
      case "codeHex32":
        r.push(SYMBOLS.idHex32());
        break;
      case "codeHex64":
        r.push(SYMBOLS.idHex64());
        break;
      default:
        r.push(null);
    }
    return r;
  },

  _escapeEntities(text) {
    if (typeof text !== "string") return text;
    // TODO Maybe unescape emojis too.
    // NOTE Environment.textEntityMap doesn't have unescaping mechanism and it contains
    // multiple mappings to the same character, e.g. &lt; and &#060; are both mapped to ">".
    return text
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }
};

export default Tools;
