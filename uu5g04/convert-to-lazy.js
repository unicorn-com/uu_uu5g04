const path = require("path");
const fs = require(require.resolve("fs-extra", { paths: ["."] }));
const klawSync = require(require.resolve("klaw-sync", { paths: ["."] }));

const DEBUG_ADD_BROWSER_LOGGING_OF_IMPORTS = true; // will show which component is lazy-imported during page load (in browser)
const FORCED_CONFIG = [
  // { re: /\/bricks\/(button|factory|icon|link|lsi|lsi-item|loading|screen-size|span)\.js/, skip: true }, // skip basic bricks
  // { re: /\/bricks\/(page|page-.*|update-wrapper|row|resize-observer|column|scroll-area|backdrop)\.js/, skip: true }, // skip Page and its dependencies
  // {
  //   re: /\/forms\/(form|text|internal\/input-wrapper|internal\/autocomplete-text-input|internal\/text-input)\.js/, // skip bacis forms
  //   skip: true
  // },
  {
    re: /\/core\/common\/(?!(?:help|not-found-tag|outline-modal|outline|prop-mapper)\.js)/, // skip UU5.Common.* except these
    skip: true
  },
  {
    re: /\/bricks\/(?!(?:accordion|camera|carousel|click-confirm|console|cookie-bar|cookies-info|data-table|dl|draggable-item|file-viewer|floating-box|google-map|home-screen|mark|nav-bar.*|number|pager|progress-bus|q-r-code|rich-link|slider.*|swiper.*|switch|table-col|table-col-group|table-tfoot|table-thead|tabs.*|todo|tree.*|video|youtube-video)\.js)/, // skip UU5.Bricks.* except these
    skip: true
  },
  {
    // re: /\/forms\/(?!(?:checkboxes|context-forms\/(?:context-controls|context-form|context-header|context-modal|context-section)|date-picker|date-range-picker|date-time-picker|date-time-range-picker|slider|switch-selector|text-button|time-picker|tri-state-checkbox)\.js)/, // skip UU5.Forms.* except these
    re: /\/forms\//,
    skip: true
  }
  // { re: /\/forms\/(context-forms\/context)\.js/, skip: true }
  // -------
  // { re: /\/bricks\/image\.js/, tagName: "UU5.Bricks.Image" },
  // { re: /\/bricks\/rating\.js/, tagName: "UU5.Bricks.Rating" },
  // { re: /\/bricks\/li\.js/, ignoreExports: ["ListContext"] },
  // { re: /\/forms\/date-picker\.js/, ignoreExports: ["Datepicker"], reExportAs: "Datepicker" },
  // { re: /\/forms\/date-time-picker\.js/, ignoreExports: ["Datetimepicker"], reExportAs: "Datetimepicker" },
  // { re: /\/forms\/icon-picker\.js/, ignoreExports: ["Iconpicker"], reExportAs: "Iconpicker" },
  // { re: /\/forms\/time-picker\.js/, ignoreExports: ["Timepicker"], reExportAs: "Timepicker" }
];
let items = [...klawSync("src/core/common"), ...klawSync("src/bricks"), ...klawSync("src/forms")];

function getTagNamespace(filePath) {
  if (filePath.match(/\/core\/common\//)) return "UU5.Common";
  if (filePath.match(/\/block-layout\//)) return "UU5.BlockLayout";
  if (filePath.match(/\/bricks\//)) return "UU5.Bricks";
  if (filePath.match(/\/bricks-editable\//)) return "UU5.BricksEditable";
  if (filePath.match(/\/forms\//)) return "UU5.Forms";
  throw new Error("Unknown tag namespace for file " + filePath);
}

let stats = { alreadyLazy: 0, unableToProcess: 0, processed: 0, notAComponent: 0, skippedByConfig: 0 };
items.forEach(item => {
  if (!item.path.endsWith(".js")) return;
  if (item.path.match(/-lazy\.js|\.test\./)) return;

  let baseName = path.relative(".", item.path).replace(/\\/g, "/");

  let content = fs.readFileSync(item.path, "utf-8");
  let origContent = content;
  if (!content.match(/createReactClass|UU5\.Common\.(Visual)?Component\.create/)) {
    stats.notAComponent++;
    return;
  }

  let lazyFile = item.path.replace(/\.js$/, m => "-lazy" + m);
  if (fs.existsSync(lazyFile)) {
    stats.alreadyLazy++;
    return;
  }

  let configEntry = FORCED_CONFIG.find(it => it.re && baseName.match(it.re));
  let { tagName, exportName, ignoreExports, staticFields, reExportAs, skip } = configEntry || {};

  if (skip) {
    stats.skippedByConfig++;
    return;
  }

  // NOTE tagName required for allowTags components.
  if (tagName === undefined) {
    let tagNames = new Set();
    content.replace(/tagName:(.*)/g, (m, g) => {
      g = g.trim();
      let match = g.match(/^ns.name\(['"]([^'"]+)['"]\)/);
      if (match) return tagNames.add(getTagNamespace(baseName) + "." + match[1]);
      match = g.match(/^['"]([^'"]+)['"]/);
      if (match) return tagNames.add(match[1]);
    });
    if (tagNames.size === 0) {
      console.log(`${item.path} - unrecognized component tag name, skipping.`);
      stats.unableToProcess++;
      return;
    }
    if (tagNames.size > 1) {
      console.log(`${item.path} - multiple component tag names found, skipping: ${[...tagNames]}`);
      stats.unableToProcess++;
      return;
    }
    tagName = tagNames.values().next().value;
    let tagReConfigEntry = FORCED_CONFIG.find(it => it.tagRe && tagName.match(it.tagRe));
    if (tagReConfigEntry && tagReConfigEntry.skip) {
      stats.skippedByConfig++;
      return;
    }
  }

  if (exportName === undefined) {
    let exports = [];
    content.replace(/export\s+(?:const|var|let)\s+([a-zA-Z0-9_$]+)\s*=\s*/g, (m, g) => exports.push(g));
    content.replace(/export\s+\{(\s*[a-zA-Z0-9_$]+\s*(?:,\s*[a-zA-Z0-9_$]+\s*)*)\}/g, (m, g) =>
      exports.push(...g.split(",").map(it => it.trim()))
    );
    content.replace(/export\s+default\s+([a-zA-Z0-9_$]+)/g, (m, g) => {
      if (exports.indexOf(g) === -1) exports.push("default");
    });
    if (exports.length === 0) {
      console.log(`${item.path} - export name not found, skipping.`);
      stats.unableToProcess++;
      return;
    }
    if (ignoreExports) {
      for (let ignored of ignoreExports) {
        let idx = exports.indexOf(ignored);
        if (idx !== -1) exports.splice(idx, 1);
      }
    }
    if (exports.length > 1) {
      console.log(`${item.path} - multiple exports detected, skipping: ${exports.join(", ")}`);
      stats.unableToProcess++;
      return;
    }
    exportName = exports[0];
  }

  // NOTE We must copy static fields. E.g.:
  //   original (component.js):
  //     import Item from "...";
  //     export const Component = ...;
  //     Component.Item = Item;
  //   new (component.js):
  //    +import Item from "...";
  //     const Lazy = lazy(() => import("./component-lazy.js"));
  //     export const Component = ...;
  //    +Component.Item = Item;
  if (staticFields === undefined) {
    staticFields = [];
    let exportNameRegexpEscaped = exportName.replace(/\$/g, m => "\\" + m);
    origContent.replace(
      new RegExp("\\b" + exportNameRegexpEscaped + "\\.([a-zA-Z0-9_$.]+)\\s*=\\s*(.*)", "g"),
      (m, g, v) => {
        staticFields.push({ keys: g, value: v.trim() });
      }
    );
    for (let field of staticFields) {
      // try to match static fields with imports, i.e. having `Component.X.Y.Z = Abc;` look for `import Abc from ...`
      let { keys, value } = field;
      value = value.trim();
      if (value.match(/^[a-zA-Z0-9_$]+;$/)) {
        value = field.value = value.replace(";", "");
        let valueRegexpEscaped = value.replace(/\$/g, m => "\\" + m);
        let importPath;
        origContent.replace(
          new RegExp(`\\bimport\\s+${valueRegexpEscaped}\\s+from\\s+['"]([^'"]+)`),
          (m, g) => (importPath = g)
        );
        if (importPath) {
          field.importPath = importPath;
          field.resolved = true;
        }
      }
    }
    if (staticFields.some(it => !it.resolved)) {
      console.log(
        `${item.path} - unrecognized static fields detected, skipping: ${staticFields
          .filter(it => !it.resolved)
          .map(it => it.keys + " (=" + it.value + ")")
          .join(", ")}`
      );
      stats.unableToProcess++;
      return;
    }
  }

  // ensure that -lazy.js has default export.
  if (!origContent.match(/export default /)) {
    console.log(`${item.path} - no default export present, skipping.`);
    stats.unableToProcess++;
    return;
  }

  // copy original file to -lazy & create wrapper
  fs.copySync(item.path, lazyFile);
  let localExportName = exportName === "default" ? "Component" : exportName;
  let uu5Import = tagName.startsWith("UU5.Common.") ? "" : 'import UU5 from "uu5g04";\n';
  let reactLazy = tagName.startsWith("UU5.Common.") ? "React.lazy" : "UU5.Common.Component.lazy";
  let reactForwardRef = tagName.startsWith("UU5.Common.") ? "React.forwardRef" : "UU5.Common.Reference.forward";
  let reactSuspense = tagName.startsWith("UU5.Common.") ? "React.Suspense" : "UU5.Common.Suspense";
  content = `/**
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
import React from "react";
${uu5Import}${staticFields
    .filter(it => it.importPath)
    .map(it => `import ${it.value} from "${it.importPath}";\n`)
    .join("")}//@@viewOff:imports

const Lazy = ${reactLazy}(() => ${(DEBUG_ADD_BROWSER_LOGGING_OF_IMPORTS &&
    `console.log("loading", ${JSON.stringify(tagName)}) || `) ||
    ""}import("./${path.basename(lazyFile)}"));

const ${localExportName} = ${reactForwardRef}((props, ref) => {
  return (
    <${reactSuspense} fallback="">
      <Lazy {...props} ref={ref} />
    </${reactSuspense}>
  );
});
export ${exportName === "default" ? `default ${localExportName}` : `{ ${localExportName} }`};
${localExportName}.isUu5PureComponent = true;
${localExportName}.displayName = ${JSON.stringify("lazy(" + tagName + ")")};
${localExportName}.tagName = ${JSON.stringify(tagName)};
${localExportName}.getDefaultProps = function () {
  return {};
};
if (process.env.NODE_ENV !== "production") ${localExportName}.getDefaultProps.isReactClassApproved = true;
${staticFields.map(it => `${localExportName}.${it.keys} = ${it.value};\n`).join("")}${
    exportName === "default" ? `` : `export default ${localExportName};\n`
  }${reExportAs ? `export { ${localExportName} as ${reExportAs} };\n` : ""}`;

  fs.writeFileSync(item.path, content, "utf-8");
  stats.processed++;
});

// print statistics
let { alreadyLazy, notAComponent, processed, skippedByConfig, unableToProcess } = stats;
let total = alreadyLazy + notAComponent + processed + skippedByConfig + unableToProcess;
let pad = n => (n + "").padStart(3, " ");
console.log(`
${pad(total)} total JS files processed
${pad(processed)} changed to lazy
${pad(alreadyLazy)} skipped due to already being lazy
${pad(skippedByConfig)} skipped due to tool config
${pad(notAComponent)} skipped due to not a component
${pad(unableToProcess)} unable to process (see list above)
`);
