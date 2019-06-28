// uu5-library-1.7.0
var path = require("path");
var fs = require("fs-extra");
var CopyWebpackPlugin = require("copy-webpack-plugin");
var WrapperPlugin = require("wrapper-webpack-plugin");
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var WriteFilePlugin = require("write-file-webpack-plugin");
var CircularDependencyPlugin = require("circular-dependency-plugin");
var webpack = require("webpack");
var cors = require("cors");
var eslintFormatter = require("eslint/lib/formatters/stylish");
var autoprefixer = require("autoprefixer");

var pkg = require("../package.json");

function fillDefaults(opts) {
  if (opts.minify == null) opts.minify = false;
  if (opts.useSourceMaps == null) opts.useSourceMaps = true;
  if (opts.separateCss == null) opts.separateCss = opts.outputFile && opts.outputFile.match(/\.css$/);
  if (opts.sourcePath == null) opts.sourcePath = "src";
  if (opts.outputPath == null) opts.outputPath = "dist";
  if (opts.entryPoints == null) opts.entryPoints = [];
  if (opts.https == null) opts.https = false;
  if (opts.copyFiles == null) opts.copyFiles = false;
  if (opts.includeDemoPages == null) opts.includeDemoPages = false;
  return opts;
}

function getWebpackConfig(options) {
  var opts = Object.assign({}, options);
  opts = fillDefaults(opts);

  var srcAbsPath = path.resolve(opts.sourcePath);
  var src = path.relative(path.resolve("."), srcAbsPath).replace(/\\/g, "/");

  // CONFIG webpack rules
  var eslintLoader = {
    loader: "eslint-loader",
    options: {
      formatter: function () {
        // omit summary "<number> problems" displayed after each file
        return eslintFormatter.apply(this, arguments).split(/\n\n/).slice(0, -1).join("\n\n").trim();
      }
    }
  };
  var cssRule, lessRule;
  var cssLoader = { loader: "css-loader", options: { minimize: opts.minify } };
  var postCssLoader = { loader: "postcss-loader", options: { plugins: [autoprefixer()] } };
  var rules = [{
    oneOf: [ // use only first matched
      { test: /\.jsx?$/, use: ["babel-loader", eslintLoader], parser: { import: false, system: false } },
      cssRule = { test: /\.css$/, use: ["style-loader", cssLoader, postCssLoader] },
      lessRule = { test: /\.less$/, use: ["style-loader", cssLoader, postCssLoader, "less-loader"] },
      { use: [{ loader: "file-loader", options: { name: "[path][name].[ext]" } }] } // if import-ing anything else just copy it
    ]
  }];
  var extractCss = (opts.separateCss ? new ExtractTextPlugin(((opts.outputFile || "").replace(/\.(js|css)$/, "") || "[name]") + ".css") : null);
  if (extractCss) {
    cssRule.use = extractCss.extract({ fallback: cssRule.use.shift(), use: cssRule.use });
    lessRule.use = extractCss.extract({ fallback: lessRule.use.shift(), use: lessRule.use });
  }

  // CONFIG webpack plugins
  var plugins = [
    // NOTE CommonsChunkPlugin does not work with externals - do not use it (https://github.com/webpack/webpack/issues/439 & https://github.com/webpack/webpack/issues/622).

    // write files to output folder even when using webpack-dev-server (because by default it builds & serves them from memory)
    new WriteFilePlugin({ log: false }),

    new webpack.DefinePlugin({
      "process.env": {
        NAME: JSON.stringify(pkg.name),
        VERSION: JSON.stringify(pkg.version),
        NODE_ENV: JSON.stringify(opts.isProductionBuild ? "production" : "development")
      }
    })
  ];

  // copy unrecognized files as-is ("from" path is relative to webpack's context, i.e. srcAbsPath)
  if (opts.copyFiles) {
    plugins.push(new CopyWebpackPlugin([{ from: "**/*" }], { ignore: ["*.js", "*.jsx", "*.css", "*.less", "**/demo/**", "assets/**", "lib/**", "**/test/**"] }));
    plugins.push(new CopyWebpackPlugin([{ from: "assets/**" }, { from: "lib/**" }])); // copy assets/ folder as-is (including any .less, ..., files)
    if (opts.includeDemoPages) plugins.push(new CopyWebpackPlugin([{ from: "**/demo/**" }]));
  }

  // add copyright
  plugins.push(
    new WrapperPlugin({
      header: function (fileName) {
        if (!fileName.match(/\.js$/)) return "";
        var licenceText = fs.readFileSync("LICENCE", "utf-8");
        return `/*! ${licenceText} */\n`;
      }
    })
  );

  // extract CSS & minify
  if (extractCss) plugins.push(extractCss);
  if (opts.minify) {
    plugins = [
      new webpack.optimize.UglifyJsPlugin({
        sourceMap: opts.useSourceMaps,
        // // show warnings only for JS files in srcAbsPath
        // warningsFilter: function (sourceUri) { // commented out because of warnings related to webpack import variables (related to css imports)
        //   var filePath = sourceUri.split("!").pop();
        //   return filePath.match(/\.js$/) && path.resolve(filePath).startsWith(srcAbsPath + path.sep);
        // },
        compress: {
          warnings: false
        }
      })
    ].concat(plugins);
  }

  // add detection of circular dependencies
  plugins.push(new CircularDependencyPlugin({ failOnError: false }));

  // enable scope hoisting
  plugins.push(new webpack.optimize.ModuleConcatenationPlugin());

  // improve debug messages (module names) when hot module reload is used
  if (process.env.NODE_ENV !== "production") plugins.push(new webpack.NamedModulesPlugin());

  // configuration of dependencies
  var externalsConfig = opts.dependencies || {};
  externalsConfig["UU_ENVIRONMENT"] = { baseUri: true }; // force external
  externalsConfig["module"] = { baseUri: true, format: "global", exports: "undefined" }; // force external (shimmed to be undefined if loading directly via <script> tag)

  // aliases for resolving modules
  var aliases = Object.assign({}, opts.aliases, {
    "__project__": srcAbsPath, // alias for root of src folder (used by all on-the-fly created modules / chunks)
  });

  if (opts.entryPoints.length == 0) {
    throw new Error("At least 1 entry point must be specified in the configuration (config/config.js).");
  }
  fs.mkdirsSync(opts.outputPath);
  var outputAbsPath = path.resolve(opts.outputPath);

  // configure output verbosity - https://webpack.js.org/configuration/stats/
  var stats = {
    modules: false,
    colors: true,
    hash: false,
    version: false
  };

  // webpack development server
  var devServerConfig = {
    contentBase: opts.includeDemoPages ? outputAbsPath : srcAbsPath, // TODO We should use outputAbsPath here, but we want demo pages always listed in directory listing and that wouldn't work when running with production build ("npm run start-prod").
    host: opts.host,
    port: opts.port,
    https: opts.https,
    open: opts.autoOpenInBrowser,
    disableHostCheck: true, // to be able to use http://localhost.plus4u.net bound to 127.0.0.1
    stats: stats,
    setup: function (app) {
      app.set("strict routing", true); // strict routing - "/home" is different than "/home/"

      // allow CORS when running via webpack-dev-server
      app.use(cors({origin: true, credentials: true}));

      // files from outputAbsPath have biggest priority
      app.use((req, res, next) => {
        var relPath = req.path.replace(/^\/+/, "");
        if (relPath) {
          // redirect to minified file if it exists (for "npm start" there aren't any; for "npm run start-prod" there are)
          var minFileRelPath = relPath.replace(/(\.js)$/, ".min$1");
          if (minFileRelPath !== relPath) {
            var minFile = path.resolve(outputAbsPath, minFileRelPath);
            if (fs.existsSync(minFile) && fs.statSync(minFile).isFile()) return res.redirect("/" + minFileRelPath);
          }
          // send the file from output folder if it exists
          var file = path.resolve(outputAbsPath, relPath);
          if (fs.existsSync(file) && fs.statSync(file).isFile()) return res.sendFile(relPath, { root: outputAbsPath });
        }
        next();
      });
    }
  };

  // prepare webpack configuration
  var webpackConfig = [];

  // convert entry files from entryPoints to webpack configuration (we'll need to generate different entry file
  // for each of these as a workaround because we need to set publicPath during runtime, not during compile time
  // which is not as straightforward with webpack - https://github.com/webpack/webpack/issues/2776)
  var entryList = opts.outputFile ? [{ files: opts.entryPoints }] : opts.entryPoints.map(it => ({ files: [it] })); // if outputFile is given, assume all entries are to be bundled there; otherwise make separate output for each entry
  var entryMap = entryList.reduce((result, entry) => {
    let initialFile = "./" + path.relative(srcAbsPath, path.resolve(srcAbsPath, entry.files[0])).replace(/\\/g, "/"); // "./entry/index.js"
    let name = initialFile.substr(2).replace(/\.(js|css|less)$/, ""); // "entry/index"
    let isCssOnly = !entry.files.some(filePath => !filePath.match(/\.(css|less|sass)$/));

    // make sure that the target name was not used yet
    if (result[name]) {
      let i = 0;
      while (result[name + "-" + i]) ++i;
      name += "-" + i;
    }

    let files;
    if (!isCssOnly) files = entry.files.map(filePath => createEntryPointFile("./" + path.relative(srcAbsPath, path.resolve(srcAbsPath, filePath)).replace(/\\/g, "/"), opts));
    else files = [createTemporaryModuleFile(entry.files.map(filePath => `import ${JSON.stringify("./" + path.relative(path.resolve(".tmp"), path.resolve(srcAbsPath, filePath)).replace(/\\/g, "/"))};`).join("\n"))];
    result[name] = files;
    return result;
  }, {});

  webpackConfig.push({
    context: srcAbsPath,
    entry: entryMap,
    output: {
      filename: opts.outputFile || "[name].js",
      chunkFilename: "chunks/[name]-[hash].js",
      path: outputAbsPath,
      // publicPath: undefined, // publicPath is configured during runtime (in browser)
      pathinfo: !opts.minify,
      jsonpFunction: "__webpack_jsonp_" + pkg.name.replace(/[^a-zA-Z0-9]/g, "_"), // to prevent collisions between libraries if they load chunks themselves
      libraryTarget: "umd",
      library: (opts.libraryGlobalVariable ? opts.libraryGlobalVariable.split(/\./) : "[name]"),
      umdNamedDefine: true,
      devtoolModuleFilenameTemplate: (opts.useSourceMaps
        ? (process.env.NODE_ENV !== "production"
             // when debugging in IDE (RubyMine, VS Code) IDEs map sourceMap addresses into workspace folders;
             // VS Code uses "sourceMapPathOverrides" for that and we want the value not to change between
             // different projects/app so we'll not include package name & version while developing
             // NOTE "src/" part is only to be consistent with react-create-app, no other reason.
            ? "webpack:///src/[resource-path]"
             // include package name & version in source map names so that they don't collide
             // in an application which uses more libraries built by these tools
            : "webpack:///" + pkg.name + "@" + pkg.version + "/" + src.replace(/\\/g, "/") + "/[resource-path]"
          )
        : undefined
      )
    },
    resolve: {
      alias: aliases
    },
    module: {
      rules: rules
    },
    plugins: plugins,
    externals: function (context, request, callback) {
      if (request.match(/\.less$/)) return callback(); // .less files are always considered non-external

      // distinguish externals dynamically on per-file basis, if specified
      if (opts.externalsMapper) {
        var result = opts.externalsMapper(request, context, opts);
        if (result != null) return callback(null, result);
      }

      // distinguish externals by using static "externalsConfig" configuration
      var conf;
      var rootModule = request.replace(/\/.*/, ""); // "module/that/is/nested" => "module"
      if (externalsConfig[request] === false) conf = false;
      else if (externalsConfig[request] != null) conf = externalsConfig[request];
      else conf = externalsConfig[rootModule];
      if (!conf) return callback(); // configured as not external
      var loadAs = {
        amd: request,
        commonjs: request,
        commonjs2: request,
        root: typeof conf == "string" ? conf : (conf.format == "global" ? conf.exports : request)
      };
      return callback(null, loadAs);
    },
    devtool: (opts.useSourceMaps ? "source-map" : false),
    devServer: devServerConfig,
    stats: stats
  });

  return webpackConfig;

  function createEntryPointFile(name, opts) {
    fs.mkdirsSync(".tmp/" + name.replace(/^(.*\/).*/, "$1").replace(/^\.\//, ""));
    var noRelativeName = name.replace(/^\.\//, "");
    var noRelativeOutputName = (opts.outputFile ? opts.outputFile.replace(/^\.\//, "").replace(/\\/g, "/") : noRelativeName);
    var depthFromAppAssetsBase = noRelativeOutputName.split(/\//).length;
    var entryFileContents =
  `var mod=require("module");
  var uri = ((mod ? mod.uri : (document.currentScript || Array.prototype.slice.call(document.getElementsByTagName("script"), -1)[0] || {}).src) || "").toString();
  __webpack_public_path__=uri.split(/\\//).slice(0, -${depthFromAppAssetsBase}).join("/") + "/"; // runtime publicPath configuration required for proper linking of styles, background images, ...
  module.exports = require("__project__/${noRelativeName}");`;

    return createTemporaryModuleFile(entryFileContents, noRelativeName);
  }
}

var tempCounter = 0;
function createTemporaryModuleFile(fileContents, optionalFileName) {
  fs.ensureDirSync(".tmp");
  var tmpFilePath = ".tmp/" + (optionalFileName ? optionalFileName : "temp-" + (tempCounter++) + ".js");
  fs.removeSync(tmpFilePath);
  fs.writeFileSync(tmpFilePath, fileContents, "utf-8");

  // prevent re-compilation loop during first few seconds after "npm start"
  // https://github.com/webpack/watchpack/issues/25
  var timeInPast = Date.now() / 1000 - 10;
  fs.utimesSync(tmpFilePath, timeInPast, timeInPast);
  return path.resolve(tmpFilePath);
}

var nsApp = require("../package.json")["namespace"];
var nsCss = nsApp.replace(/\w+/g, m => m.toLowerCase()).replace(/\W+/g, "-"); // "UU.DemoApp" => "uu-demoapp" (lowercased with non-word characters changed to single "-")
function createNamespaceAliasFileForJs() {
  if (fs.existsSync(path.join(".tmp", "ns.js"))) return path.resolve(".tmp", "ns.js");
  var nsConfig = `const ns = {
    namespace: "${nsApp}",
    cssPrefix: "${nsCss}",
    tag: function(component) {return ns.namespace + "." + component;},
    css: function(component) {return ns.cssPrefix + "-" + component;}
  };
  export default ns;`;
  return createTemporaryModuleFile(nsConfig, "ns.js");
}
function createNamespaceAliasFileForCss() {
  if (fs.existsSync(path.join(".tmp", "cssns.less"))) return path.resolve(".tmp", "cssns.less");
  var nsLess = `@cssNs: ${nsCss};`;
  return createTemporaryModuleFile(nsLess, "cssns.less");
}

module.exports = {
  getWebpackConfig,
  createNamespaceAliasFileForJs,
  createNamespaceAliasFileForCss
};
