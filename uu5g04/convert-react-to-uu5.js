const path = require("path");
const fs = require(require.resolve("fs-extra", { paths: ["."] }));
const klawSync = require(require.resolve("klaw-sync", { paths: ["."] }));

const REPLACEMENTS = [
  { from: /\bcreateReactClass\s*\(/g, to: "UU5.Common.VisualComponent.create(" },
  { from: /([^.])\bPropTypes\./g, to: "$1UU5.PropTypes." },
  { from: /\bReact\.createElement/g, to: "UU5.Common.Element.create" },
  { from: /\bReact\.cloneElement/g, to: "UU5.Common.Element.clone" },
  { from: /\bReact\.isValidElement/g, to: "UU5.Common.Element.isValid" },
  { from: /\bReact\.Fragment/g, to: "UU5.Common.Fragment" },
  { from: /\bReact\.Suspense/g, to: "UU5.Common.Suspense" },
  { from: /\bReact\.Children/g, to: "UU5.Common.Children" },
  { from: /\bReact\.createContext/g, to: "UU5.Common.Context.create" },
  { from: /\bReact\.createRef/g, to: "UU5.Common.Reference.create" },
  { from: /\bReact\.forwardRef/g, to: "UU5.Common.Reference.forward" },
  { from: /\bReact\.lazy/g, to: "UU5.Common.Component.lazy" },
  { from: /\bReact\.memo/g, to: "UU5.Common.Component.memo" },
  { from: /\bReactDOM\.render/g, to: "UU5.Common.DOM.render" },
  { from: /\bReactDOM\.findDOMNode/g, to: "UU5.Common.DOM.findNode" },
  { from: /\bReactDOM\.hydrate/g, to: "UU5.Common.DOM.hydrate" },
  { from: /\bReactDOM\.unmountComponentAtNode/g, to: "UU5.Common.DOM.unmount" },
  { from: /\bReactDOM\.createPortal/g, to: "UU5.Common.Portal.create" }
];

async function run() {
  let totalProcessed = 0;
  let changed = 0;

  let files = [
    // ...klawSync("src/core/common").filter(it =>
    //   it.path.match(
    //     /(?:data-manager|div|dn-d|error|help|identity|level|list-data-manager|loader|not-found-tag|outline|outline-modal|prop-mapper|redirect|session|tag-placeholder|text-corrector.*)\.js$|\.(?!js)[^.]*$/
    //   )
    // ),
    ...klawSync("src/bricks"),
    ...klawSync("src/forms"),
    ...klawSync("src/bricks-editable"),
    ...klawSync("src/block-layout"),
    ...klawSync("doc/bricks"),
    ...klawSync("doc/forms"),
    ...klawSync("doc/bricks-editable"),
    ...klawSync("doc/block-layout")
    // ...(fs.existsSync("src") ? klawSync("src") : []),
    // ...(fs.existsSync("test") ? klawSync("test") : []),
    // ...(fs.existsSync("mock") ? klawSync("mock") : []),
    // ...(fs.existsSync("doc") ? klawSync("doc") : []),
  ];
  files.forEach(file => {
    if (!file.path.match(/(\.js|\.html)$/) || file.path.match(/[/\\](?:assets|lib)([/\\]|$)/)) {
      return;
    }

    let extra;
    let content = fs.readFileSync(file.path, "utf-8");
    let origContent = content;

    content = content.replace(/\bimport\s+React\s+from\s+['"]react['"];?\s*/, "");
    if ((extra = content.match(/\bimport.*?from\s+['"]react['"]/))) {
      console.warn(`${file.path} - remained: ${extra[0].trim()}`);
    }

    content = content.replace(/\bimport\s+ReactDOM\s+from\s+['"]react-dom['"];?\s*/, "");
    if ((extra = content.match(/\bimport.*?from\s+['"]react-dom['"]/))) {
      console.warn(`${file.path} - remained: ${extra[0].trim()}`);
    }

    content = content.replace(/\bimport\s+createReactClass\s+from\s+['"]create-react-class['"];?\s*/, "");
    if ((extra = content.match(/\bimport.*?from\s+['"]create-react-class['"]/))) {
      console.warn(`${file.path} - remained: ${extra[0].trim()}`);
    }

    content = content.replace(/\bimport\s+PropTypes\s+from\s+['"]prop-types['"];?\s*/, "");
    if ((extra = content.match(/\bimport.*?from\s+['"]prop-types['"]/))) {
      console.warn(`${file.path} - remained: ${extra[0].trim()}`);
    }

    // do the replacements
    REPLACEMENTS.forEach(({ from, to }) => {
      content = content.replace(from, to);
    });

    // add import from UU5 if there's none and the file needs it now
    if (
      content.match(/([^'"])\bUU5\./) &&
      !content.match(/\bimport\s+(\*\s+as\s+)?UU5\s+from\s+['"]uu5g04['"]/) &&
      !content.match(/\bUU5\s*=\s*require\(['"]uu5g04['"]\)/)
    ) {
      let uu5Import = `import UU5 from "uu5g04";\n`;
      if ((extra = content.match(/<script type=['"]text\/babel['"]>\s*?\n(\s*)/))) {
        content =
          content.substr(0, extra.index + extra[0].length) +
          uu5Import +
          extra[1] +
          content.substr(extra.index + extra[0].length);
      } else if ((extra = content.match(/\s*\/\/@@viewOn:imports\s*/))) {
        content = content.substr(0, extra[0].length) + uu5Import + content.substr(extra[0].length);
      } else {
        content = uu5Import + content;
      }
    }

    // check for usages of React & ReactDOM
    if ((extra = content.match(/\bReact\.[a-zA-Z0-9_$]+/g))) {
      console.warn(`${file.path} - remained usages of React: ${[...new Set(extra)].join(", ")}`);
    }
    if ((extra = content.match(/\bReactDOM\.[a-zA-Z0-9_$]+/g))) {
      console.warn(`${file.path} - remained usages of ReactDOM: ${[...new Set(extra)].join(", ")}`);
    }

    totalProcessed++;
    if (origContent !== content) {
      changed++;
      fs.writeFileSync(file.path, content, "utf-8");
    }
  });

  // update package.json
  let pkg = JSON.parse(fs.readFileSync("package.json", "utf-8"));
  let origPkgStr = JSON.stringify(pkg, null, 2);
  pkg.spec = (pkg.spec || "uu5-lib; uu_appg01@1.1.0").replace(/(uu_appg01@)1\.[0-2]\.\d$/, "$11.3.0");
  if (pkg.engines && pkg.engines.node === ">=8.9.0") pkg.engines.node = ">=10.16.0";
  // delete pkg.dependencies["react"];
  // delete pkg.dependencies["react-dom"];
  // delete pkg.dependencies["create-react-class"];
  // delete pkg.dependencies["prop-types"];
  // let extra = null;
  // if (
  //   !pkg.dependencies["uu5g04"] ||
  //   parseInt(((extra = pkg.dependencies["uu5g04"].match(/^(\^|~|)1\.(\d+)\.\d+$/)) || [0, 0, "19"])[2]) < 19
  // ) {
  //   pkg.dependencies["uu5g04"] = (extra ? extra[1] : "") + "1.19.0";
  // }

  // // keep only submodules & stuff that doesn't end with g01 and similar
  // let externals = pkg.uuBuildSettings && pkg.uuBuildSettings.externals;
  // if (externals) {
  //   delete externals["react"];
  //   delete externals["react-dom"];
  //   delete externals["create-react-class"];
  //   delete externals["prop-types"];
  //   for (let k in externals) {
  //     if (k.startsWith(pkg.name + "-") || !k.match(/^([a-zA-Z0-9]+_)?[a-zA-Z0-9]+g\d\d(([-_][a-zA-Z0-9]+)*)?$/)) {
  //       continue;
  //     }
  //     delete externals[k];
  //   }

  //   // check submodules in packs vs. in externals
  //   let { packs } = pkg.uuBuildSettings;
  //   let missingSubmodules = [];
  //   for (let pack of packs || []) {
  //     if (!pack.outputFile || !(pack.outputFile.startsWith(pkg.name + "-") && pack.outputFile.endsWith(".js")))
  //       continue;
  //     let submodule = pack.outputFile.replace(/(\.min)?\.js$/, "");
  //     if (!(submodule in externals)) missingSubmodules.push(submodule);
  //   }
  //   if (missingSubmodules.length) {
  //     console.warn(
  //       `${path.resolve("package.json")} - (probably) missing submodules in uuBuildSettings.externals: ${[
  //         ...new Set(missingSubmodules)
  //       ].join(", ")}`
  //     );
  //   }
  // }
  let pkgStr = JSON.stringify(pkg, null, 2);
  totalProcessed++;
  if (pkgStr !== origPkgStr) {
    changed++;
    fs.writeFileSync("package.json", pkgStr, "utf-8");
  }

  // print summary
  console.log(`Updated ${changed} file(s) out of ${totalProcessed} processed.`);
}

run();
