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

// FIXME Use streaming. This just loads the whole data into memory.
const fs = require("fs");

class BinaryValue {
  constructor(value) {
    if (value instanceof fs.ReadStream) this.data = value;
    else if (value instanceof Buffer) this.data = value;
    else if (typeof value !== "object") this.data = value;
    else if (value) {
      this.data = value.data;
      this.name = value.name;
    }
    this._buffer = null;
  }
  asStreamOrBuffer() {
    if (this.data instanceof fs.ReadStream) return this.data;
    if (this.data instanceof Buffer) return this.data;
    return (this.data != null ? Buffer.from(this.data + "", "utf-8") : null);
  }
  // FIXME Remove whole method.
  async load() {
    if (this._buffer) return;
    if (this.data instanceof Buffer) this._buffer = this.data;
    else if (this.data instanceof fs.ReadStream) {
      let chunks = [];
      await new Promise((resolve, reject) => {
        this.data.on("data", chunk => chunks.push(Buffer.from(chunk, "binary")));
        this.data.on("end", resolve);
      });
      this._buffer = Buffer.concat(chunks);
      chunks = null;
    } else {
      this._buffer = Buffer.from(this.data != null ? this.data.toString() : "");
    }
  }
  toJSON() {
    if (!this._buffer) throw new Error("Conversion to JSON must be currently preceded by 'await binaryValue.load();'.");
    let value = {
      dataHandler: this._buffer.toString("base64")
    };
    if (this.name) value["fileName"] = this.name;
    return value;
  }
}

module.exports = BinaryValue;
