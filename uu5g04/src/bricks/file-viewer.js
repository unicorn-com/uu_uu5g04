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

import Loading from "./loading.js";
import Table from "./table.js";
import TBody from "./table-tbody.js";
import Tr from "./table-tr.js";
import Td from "./table-td.js";
import Link from "./link.js";
import Modal from "./modal.js";

import "./file-viewer.less";
//@@viewOff:imports

export const FileViewer = UU5.Common.VisualComponent.create({
  displayName: "FileViewer", // for backward compatibility (test snapshots)
  //@@viewOn:mixins
  mixins: [UU5.Common.BaseMixin, UU5.Common.ElementaryMixin, UU5.Common.NestingLevelMixin, UU5.Common.PureRenderMixin],
  //@@viewOff:mixins

  //@@viewOn:statics
  statics: {
    tagName: ns.name("FileViewer"),
    nestingLevelList: UU5.Environment.getNestingLevelList("bigBox", "inline"),
    defaults: {
      displayErrMsg: "Error during loading file ",
      regexpWhiteSpace: /^\s+/
    },
    classNames: {
      main: ns.css("file-viewer"),
      blockOfLines: ns.css("file-viewer-block-of-lines"),
      blockOfLineNumbers: ns.css("file-viewer-block-of-line-numbers uu5-common-right")
    },
    errors: {
      unknownCallFeedback: "Call feedback %s is not one of %s",
      loadError: "File %s cannot be found."
    }
  },
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {
    src: UU5.PropTypes.string,
    parameters: UU5.PropTypes.object,
    numbered: UU5.PropTypes.bool,
    trimmed: UU5.PropTypes.bool,
    blockKey: UU5.PropTypes.string,
    blockStart: UU5.PropTypes.string,
    blockEnd: UU5.PropTypes.string
  },
  //@@viewOff:propTypes

  //@@viewOn:getDefaultProps
  getDefaultProps: function() {
    return {
      src: null,
      parameters: null,
      numbered: false,
      trimmed: true,
      blockKey: null,
      blockStart: "@@viewOn:",
      blockEnd: "@@viewOff:"
    };
  },
  //@@viewOff:getDefaultProps

  //@@viewOn:reactLifeCycle
  getInitialState: function() {
    return {
      data: null,
      blockOfLines: null,
      blockOfLineNumbers: null,
      blockOfLineNumbersWidth: null,
      callFeedback: "loading",
      message: null
    };
  },

  componentWillMount: function() {
    !this.props.src && this.setState({ callFeedback: "ready" });
  },

  componentDidMount: function() {
    if (this.props.src) {
      this._loading = true;
      this._getData(this.props);
    }
  },

  componentWillReceiveProps: function(nextProps) {
    if (nextProps.src && (nextProps.src !== this.props.src || nextProps.parameters !== this.props.parameters)) {
      this.setState(
        {
          data: null,
          blockOfLines: null,
          blockOfLineNumbers: null,
          blockOfLineNumbersWidth: null,
          callFeedback: "loading",
          message: null
        },
        function() {
          this._getData(nextProps);
        }.bind(this)
      );
    } else {
      if (
        nextProps.numbered !== this.props.numbered ||
        nextProps.trimmed !== this.props.trimmed ||
        nextProps.blockKey !== this.props.blockKey ||
        nextProps.blockStart !== this.props.blockStart ||
        nextProps.blockEnd !== this.props.blockEnd
      ) {
        this._buildData(nextProps);
      }
    }
  },

  componentWillUnmount: function() {
    this._serverRequest && this._serverRequest.abort();
    this._loading = false;
  },
  //@@viewOff:reactLifeCycle

  //@@viewOn:interface
  //@@viewOff:interface

  //@@viewOn:overriding
  //@@viewOff:overriding

  //@@viewOn:private
  _getData: function(props) {
    this._serverRequest && this._serverRequest.abort();
    this._serverRequest = UU5.Common.Tools.getServerRequest(
      props.src,
      props.parameters,
      "text",
      data => {
        if (this._loading) {
          this.setState({ data: data, callFeedback: "ready" }, () => this._buildData(props));
        }
      },
      e => {
        if (this._loading) {
          this.showError("loadError", props.src, { context: { error: e } });
          this.setState({
            callFeedback: "error",
            message: this.getDefault().displayErrMsg + props.src + " (" + props.parameters + ")"
          });
        }
      }
    );
  },

  _buildData: function(props) {
    var fileViewer = this;
    var blockOfLines = "";
    var blockOfLineNumbers = "";
    if (this.state.data) {
      var lines = this.state.data.split("\n");
      var blockStart = props.blockStart + props.blockKey;
      var blockEnd = props.blockEnd + props.blockKey;
      var write = !props.blockKey;
      let toTrim = null;
      let _toTrim = null;

      if (props.trimmed) {
        lines.forEach((v, i) => {
          if (v.match(blockStart)) {
            write = true;
          } else if (v.match(blockEnd)) {
            write = false;
          } else if (write) {
            _toTrim = v.length - v.replace(this.getDefault().regexpWhiteSpace, "").length;
            if (toTrim === null || _toTrim < toTrim) {
              toTrim = _toTrim;
            }
          }
        });
      }

      lines.forEach(function(v, i) {
        if (v.match(blockStart)) {
          write = true;
        } else if (v.match(blockEnd)) {
          write = false;
        } else if (write) {
          if (props.numbered) {
            //blockOfLineNumbers += UU5.Common.Tools.pad(i + 1, blockOfLineNumbersWidth) + '\n';
            blockOfLineNumbers += i + 1 + "\n";
          }
          if (props.trimmed) {
            blockOfLines += v.substring(toTrim, v.length) + "\n";
          } else {
            blockOfLines += v + "\n";
          }
        }
      });
    }
    fileViewer.setState({
      blockOfLines: blockOfLines,
      blockOfLineNumbers: blockOfLineNumbers
    });
  },

  _getMainChild: function() {
    var mainChild;
    var mainProps = this.getMainPropsToPass();

    switch (this.state.callFeedback) {
      case "loading":
        mainChild = <Loading {...mainProps} />;
        break;
      case "ready":
        mainChild = (
          <Table {...this.getMainAttrs()}>
            <TBody>
              <Tr>
                {this.props.numbered && (
                  <Td
                    className={this.getClassName().blockOfLineNumbers}
                    mainAttrs={{ style: { width: this.state.blockOfLineNumbersWidth + 1 + "em" } }}
                    colorSchema="default"
                  >
                    {this.state.blockOfLineNumbers}
                  </Td>
                )}
                <Td className={this.getClassName().blockOfLines} colorSchema="default">
                  {this.state.blockOfLines}
                </Td>
              </Tr>
            </TBody>
          </Table>
        );
        break;
      case "error":
        mainChild = <UU5.Common.Error {...mainProps} content={this.state.message} />;
        break;
      default:
        this.showError("unknownCallFeedback", [this.state.callFeedback, "loading, ready, error"]);
        mainChild = <span />;
    }

    return mainChild;
  },
  //@@viewOff:private

  //@@viewOn:render
  render: function() {
    let component;
    switch (this.getNestingLevel()) {
      case "bigBox":
      case "boxCollection":
      case "box":
        component = this._getMainChild();
        break;
      case "inline":
        component =
          this.state.callFeedback === "ready" ? (
            <span>
              <Modal ref_={modal => (this._modal = modal)}>{this._getMainChild()}</Modal>
              <Link onClick={() => this._modal.open()} content={this.props.src} />
            </span>
          ) : null;
        break;
      default:
        component = null;
    }

    return component;
  }
  //@@viewOff:render
});

export default FileViewer;
