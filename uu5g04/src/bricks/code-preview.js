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

import "./code-preview.less";
//@@viewOff:imports

export const CodePreview = UU5.Common.VisualComponent.create({
  displayName: "CodePreview", // for backward compatibility (test snapshots)
  //@@viewOn:mixins
  mixins: [UU5.Common.BaseMixin, UU5.Common.ElementaryMixin, UU5.Common.PureRenderMixin],
  //@@viewOff:mixins

  //@@viewOn:statics
  statics: {
    tagName: ns.name("CodePreview"),
    classNames: {
      main: ns.css("code-preview"),
      toolbar: ns.css("code-preview-toolbar")
    },
    opt: {
      pureRender: true
    }
  },
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {
    tagName: UU5.PropTypes.string,
    props: UU5.PropTypes.object,
    uu5string: UU5.PropTypes.bool
  },
  //@@viewOff:propTypes

  //@@viewOn:getDefaultProps
  getDefaultProps() {
    return {
      tagName: "",
      props: {},
      uu5string: false
    };
  },
  //@@viewOff:getDefaultProps

  //@@viewOn:reactLifeCycle
  getInitialState() {
    return {
      props: this.props.props,
      uu5string: this.props.uu5string
    };
  },

  componentWillReceiveProps(nextProps) {
    if (nextProps.controlled) {
      this.setState({
        props: nextProps.props,
        uu5string: nextProps.uu5string
      });
    }
  },
  //@@viewOff:reactLifeCycle

  //@@viewOn:interface
  setProp(name, value) {
    this.setState(state => {
      let newProps = UU5.Common.Tools.merge({}, state.props);
      newProps[name] = value;
      return { props: newProps };
    });
    return this;
  },
  //@@viewOff:interface

  //@@viewOn:overriding
  //@@viewOff:overriding

  //@@viewOn:private
  _indentRows(text, indent = "  ", skipFirst = true) {
    return text
      .split("\n")
      .map((line, i) => {
        if (skipFirst && i === 0) {
          return line;
        } else {
          return `${indent}${line}`;
        }
      })
      .join("\n");
  },

  _getJson(object) {
    let json = JSON.stringify(object, null, 2);
    let result = this.state.uu5string ? `'<uu5json/>${json}'` : `{${json}}`;
    return this._indentRows(result);
  },

  _getUu5String(uu5string) {
    let result;
    if (this.state.uu5string) {
      result = `"${uu5string.replace(/\n/g, "\\n").replace(/"/g, '\\"')}"`;
    } else {
      result = this._indentRows(uu5string.replace(/^<uu5string *\/>/, ""), "    ");
      result = `{\n    ${result}\n  }`;
    }
    return result;
  },

  _getProps() {
    let { children, ...otherProps } = this.state.props;
    let isUu5string = this.state.uu5string;
    let props = [];
    for (let name in otherProps) {
      let origValue = otherProps[name];
      if (origValue === undefined) continue;

      let value;

      switch (typeof origValue) {
        case "string":
          // test uu5string
          if (/^<uu5string *\/>/.exec(origValue)) {
            value = this._getUu5String(origValue);
          } else {
            value = `"${origValue}"`;
          }
          break;
        case "number":
        case "boolean":
          value = isUu5string ? origValue + "" : `{${origValue}}`;
          break;
        case "object":
          if (origValue) {
            // object | array
            value = this._getJson(origValue);
          } else {
            // null
            value = isUu5string ? "null" : `{null}`;
          }
          break;
      }

      // undefined because of true value;
      origValue === true ? props.push(name) : props.push(`${name}=${value}`);
    }

    return props;
  },

  _toggleUu5String() {
    this.setState(state => ({ uu5string: !state.uu5string }));
  },

  _copy() {
    UU5.Common.Tools.copyToClipboard(this._getValue());
  },

  _getValue() {
    let value = `<${this.props.tagName}`;
    let props = this._getProps();
    let lineProps;
    if (Array.isArray(props) && props.length !== 0) {
      lineProps = ` ${props.join(" ")}`;
    } else {
      lineProps = "";
    }

    if (this.state.props.children) {
      // pair tag

      if (lineProps.length + value.length + 1 > 120 || lineProps.indexOf("\n") > -1) {
        value += `\n  ${props.join("\n  ")}`;
      } else {
        value += lineProps;
      }

      let children = this._indentRows(this.state.props.children.replace(/^<uu5string *\/>/, ""), "  ", false);
      value += `>\n${children}\n</${this.props.tagName}>`;
    } else {
      // not pair tag

      if (lineProps.length + value.length + 1 + 3 > 120 || lineProps.indexOf("\n") > -1) {
        value += `\n  ${props.join("\n  ")}\n/>`;
      } else {
        value += `${lineProps} />`;
      }
    }

    return value;
  },
  //@@viewOff:private

  //@@viewOn:render
  render() {
    let result = null;

    if (this.props.tagName) {
      result = (
        <UU5.Bricks.Div {...this.getMainPropsToPass()}>
          <UU5.Bricks.Div className={this.getClassName("toolbar")}>
            <UU5.Bricks.ButtonGroup>
              <UU5.Bricks.Button onClick={this._toggleUu5String} colorSchema={this.state.uu5string ? "success" : null}>
                <UU5.Bricks.Icon icon="mdi-code-string" />
              </UU5.Bricks.Button>
              <UU5.Bricks.Button onClick={this._copy}>
                <UU5.Bricks.Icon icon="mdi-content-copy" />
              </UU5.Bricks.Button>
            </UU5.Bricks.ButtonGroup>
          </UU5.Bricks.Div>
          {UU5.Common.Tools.findComponent("UU5.CodeKit.CodeViewer", {
            codeStyle: "js",
            showGutter: false,
            value: this._getValue()
          })}
        </UU5.Bricks.Div>
      );
    }

    return result;
  }
  //@@viewOff:render
});

export default CodePreview;
