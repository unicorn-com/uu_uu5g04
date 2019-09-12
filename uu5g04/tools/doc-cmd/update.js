const Config = require("./core/config.js");

const BATCH_SIZE = 10;

// nasty hack while Ruby uuGateway is not fixed and thus doesn't support uploading >5MB files from NodeJS due to
// being case-sensitive about HTTP request headers (and those are being automatically lowercased by NodeJS)
const http = require("http");
let orig_send = http.OutgoingMessage.prototype._send;
http.OutgoingMessage.prototype._send = function(...args) {
  if (typeof this._header === "string") {
    this._header = this._header.replace(
      /(\r\n|^)([-a-zA-Z0-9]+):/g,
      (m, g1, g2) => g1 + g2.replace(/(^.|-.)/g, m2 => m2.toUpperCase()) + ":"
    );
  }
  return orig_send.apply(this, args);
};

let args = process.argv.slice(2);
if (args[0] === "files") updateFiles(...args.slice(1));
else if (args[0] === "examples") updateExamples();
else updateSources();

async function updateFiles(...params) {
  let uploadFile = require("./core/upload-file.js");
  let overwrite = params.some(it => it === "-y") ? true : undefined;
  for (let k in Config.FILES) {
    await uploadFile.File.upload(Config.FILES[k], k, overwrite);
  }
  process.exit(0);
}

async function updateExamples() {
  let Component = require("./core/component.js");
  return batchedExec(
    Config.COMPONENTS.map(tagName => () => {
      return new Component(tagName, Config.BOOK_AWID).update_examples();
    })
  );
}

async function updateSources() {
  let Component = require("./core/component.js");
  return batchedExec(
    Config.COMPONENTS.map(tagName => () => {
      return new Component(tagName, Config.BOOK_AWID).update_source();
    })
  );
}

async function batchedExec(fnList, batchSize = BATCH_SIZE) {
  return fnList.reduce(async (batchPromise, fn, i, arr) => {
    let batch = await batchPromise;
    batch.push(fn());
    if (i === arr.length - 1 || batch.length >= BATCH_SIZE) {
      await Promise.all(batch);
      return [];
    }
    return batch;
  }, []);
}
