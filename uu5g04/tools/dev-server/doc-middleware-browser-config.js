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

// NOTE Keep this file in ES5.
(function() {
  var cfgItemStr = localStorage.getItem("uu5g04DocMiddleware");
  var config = cfgItemStr ? JSON.parse(cfgItemStr) : {};

  var systemJsConfig = SystemJS.getConfig();
  var systemJsConfigPaths = systemJsConfig.paths || {};
  var paths = {};
  if (config.enabled) {
    if (config.items) {
      for (var name in config.items) {
        var dep = config.items[name];
        if (!dep) continue;
        var depBase =
          dep.version && dep.version !== "local"
            ? "https://cdn.plus4u.net/" +
              (dep.beta ? "beta/" : "") +
              (name.substr(0, 3) === "uu5" ? "uu-" + name : name.replace(/_/g, "-")) +
              "/" +
              dep.version +
              "/"
            : "/";

        // reconfigure <name>.js as well as <name>-<anything>.js (-bricks, -forms, etc.)
        // as well as <name>/<anything>
        paths[name] = depBase + name + ".js";
        var origBase = (systemJsConfigPaths[name] || "").replace(/[^/]*$/, "");
        for (var k in systemJsConfigPaths) {
          if (k.substr(0, name.length + 1) === name + "-") {
            paths[k] = depBase + k + ".js";
          } else if (
            k.substr(0, name.length + 1) === name + "/" &&
            (systemJsConfigPaths[k] || "").substr(0, origBase.length) === origBase
          ) {
            paths[k] = depBase + (systemJsConfigPaths[k] || "").substr(origBase.length);
          }
        }
      }
    }

    if (Object.keys(paths).length > 0) {
      console.log("Overridden doc/ demo page settings:\n" + JSON.stringify(paths, null, 2));
    }
    console.log(
      "Use %creconfigureDemoHelp()",
      "font-family: monospace; font-weight: bold;",
      "for configuration options."
    );

    // use non-minified versions
    for (var k in systemJsConfigPaths) {
      if (!paths[k]) {
        paths[k] = systemJsConfigPaths[k].replace(/\.min\.js$/, ".js");
      }
    }

    // update the config
    SystemJS.config({ paths: paths });
  }

  window.reconfigureDemo = reconfigureDemo;
  window.reconfigureDemoHelp = reconfigureDemoHelp;
  reconfigureDemo.getConfig = getConfig;
  reconfigureDemo.setConfig = setConfig;

  function getConfig() {
    var cfgItemStr = localStorage.getItem("uu5g04DocMiddleware");
    var config = cfgItemStr ? JSON.parse(cfgItemStr) : { items: {} };
    return config;
  }
  function setConfig(config) {
    localStorage.setItem("uu5g04DocMiddleware", JSON.stringify(config));
  }
  function reconfigureDemo(item) {
    var config = getConfig();
    if (!item) {
      console.log(config);
    } else {
      config.enabled = true;
      if (!config.items) config.items = {};
      if (item.version) config.items[item.name] = item;
      else delete config.items["<%= context.name %>"];
      setConfig(config);

      location.reload();
    }
  }
  function reconfigureDemoHelp() {
    var help =
      "Show current config:\n\nreconfigureDemo()\n------\n" +
      'Clear config:\n\nlocalStorage.removeItem("uu5g04DocMiddleware")\n------\n' +
      'Change config for library:\n\nreconfigureDemo({\n\
  name: "<%= context.name %>", // library name\n\
  version: "1.0.0", // CDN version or "local"\n\
  beta: false\n\
});\n';
    console.log(help);
  }
})();
