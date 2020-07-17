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
import ReactDOM from "react-dom";
import UU5 from "uu5g04";
import "uu5g04-bricks";

const LIB_NAME = "<%= context.name %>";

class Controls extends React.Component {
  constructor(props) {
    super(props);

    let config = reconfigureDemo.getConfig();
    this.state = {
      config
    };
    this.toggleEnabled = this.toggleEnabled.bind(this);
  }
  _parsePath(path) {
    if (!path) return { error: "URL not specified" };
    let cdn = path.match(/^https:\/\/cdn\./);
    let cdnVersion = cdn ? path.replace(/^.*?\/((\d+)\.(\d+)\.(\d+)[^/]*).*/, (m, g1) => g1) : null;
    let cdnBeta = cdn ? !!path.match(/\/beta\//) : null;
    return { cdn, cdnVersion, cdnBeta };
  }
  _onItemClick(item, e) {
    let label = item.props.label || item.props.content;
    let data;
    if (label === "auto") data = { name: LIB_NAME };
    else data = { name: LIB_NAME, version: label.split(/\s+/)[1] || "local", beta: false };
    reconfigureDemo(data);
  }
  toggleEnabled() {
    this.setState(
      state => ({ config: { ...state.config, enabled: !state.config.enabled } }),
      () => {
        reconfigureDemo.setConfig(this.state.config);
        if ((this.state.config.items[LIB_NAME] || {}).version) location.reload();
      }
    );
  }
  render() {
    let { paths = {} } = this.props;
    let { config = {} } = this.state;
    let libItemAutoVersion = !config.enabled || !(config.items[LIB_NAME] || {}).version;
    let libItem = this._parsePath(paths[LIB_NAME]);
    let cdnMajor = (libItem.cdnVersion || "").split(".")[0] || "1";
    return (
      <div style={{ position: "fixed", right: "0", top: "0" }}>
        <input type="checkbox" checked={this.state.config.enabled} onChange={this.toggleEnabled} />
        <UU5.Bricks.Dropdown
          label={
            LIB_NAME +
            (libItemAutoVersion ? " auto - " : "") +
            (libItem.error ||
              (libItem.cdn ? " CDN " + (libItem.cdnBeta ? "beta " : "") + libItem.cdnVersion : " local"))
          }
          items={[
            { label: "auto", onClick: this._onItemClick },
            { label: "local", onClick: this._onItemClick },
            { label: "CDN " + cdnMajor + ".0.0", onClick: this._onItemClick }
          ]}
          disabled={!this.state.config.enabled}
        />
      </div>
    );
  }
}

let div = document.createElement("div");
document.body.appendChild(div);
ReactDOM.render(<Controls paths={SystemJS.getConfig().paths} />, div);
