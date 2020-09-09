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
import PropTypes from "prop-types";
import ns from "./common-ns.js";
import BaseMixin from "./base-mixin.js";
import Tools from "./tools.js";
import Environment from "../environment/environment.js";
import NotFoundTag from "./not-found-tag.js";
import Version from "./version.js";
import VisualComponent from "./visual-component.js";
import Element from "./element.js";
//@@viewOff:imports

//import './tag-placeholder.less';

let importLibraryCache = {};

export const TagPlaceholder = VisualComponent.create({
  displayName: "TagPlaceholder", // for backward compatibility (test snapshots)
  //@@viewOn:mixins
  mixins: [BaseMixin],
  //@@viewOff:mixins

  //@@viewOn:statics
  statics: {
    tagName: ns.name("TagPlaceholder"),
    classNames: {
      main: ns.css("tag-placeholder"),
    },
    errors: {
      serverError: "Unexpected error: %s.",
    },
    defaults: {
      regexpVersion: /\/\d*\.\d*\.\d*(?:-[a-z]+\d+(?:\.\d){0,2})?\//g,
      regexpSlash: /\//g,
      regexpDigit: /^\d/g,
    },
    opt: {
      hoc: true,
    },
  },
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {
    tagName: PropTypes.string, // deprecated
    props: PropTypes.object, // deprecated
    content: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]), // deprecated
    error: PropTypes.oneOfType([PropTypes.func, PropTypes.string, PropTypes.element]), // deprecated
    _tagName: PropTypes.string,
    _props: PropTypes.object,
    _content: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]),
    _error: PropTypes.oneOfType([PropTypes.func, PropTypes.string, PropTypes.element]),
    _fromFindComponent: PropTypes.bool,
    _onLoad: PropTypes.func,
  },
  //@@viewOff:propTypes
  //@@viewOn:getDefaultProps
  getDefaultProps() {
    return {
      tagName: null,
      props: null,
      content: null,
      error: null,
      _tagName: null,
      _props: null,
      _content: null,
      _error: null,
      _fromFindComponent: false,
      _onLoad: null,
    };
  },
  //@@viewOff:getDefaultProps

  //@@viewOn:reactLifeCycle
  getInitialState() {
    return {
      component: null,
      props: null,
    };
  },

  componentDidMount() {
    if (!this.props._fromFindComponent) {
      Tools.warning('Component "TagPlaceholder" is deprecated! Use "UU5.Common.Tools.findComponent()" method instead.');
    }
    this._findLib();
  },

  UNSAFE_componentWillReceiveProps(nextProps) {
    let component = this._get("tagName", nextProps) && Tools.checkTag(this._get("tagName", nextProps));
    component ? this._setComponent(component, this._get("props", nextProps)) : this._findLib(nextProps);

    return this;
  },

  componentWillUnmount() {
    this._unmounted = true;
  },
  //@@viewOff:reactLifeCycle

  //@@viewOn:interface
  //@@viewOff:interface

  //@@viewOn:overriding
  //@@viewOff:overriding

  //@@viewOn:private
  _get(key, props = this.props) {
    return props._fromFindComponent ? props["_" + key] : props[key];
  },

  _findLib(props) {
    props = props || this.props;
    let tagNameArr = this._get("tagName", props).split(".");
    let libraryName = tagNameArr[0] + "." + tagNameArr[1];
    let libraryReady = (exports, error) => {
      if (error) {
        let library = Environment.getLibrary(libraryName);
        if (!library || !library.error) {
          this.showError("serverError", error, {
            component: this.getTagName(),
            searchedTag: this._get("tagName", props),
            library: libraryName,
          });
        }
        this._setLibError(libraryName);
        this._setComponent(this._get("tagName", props), this._get("props", props));
      } else {
        // TODO We should take the component from exports instead of assuming that the library makes it available in a global variable.
        // let parts = libraryName.split(".");
        // let lastPart = parts.pop();
        // let parent = parts.reduce((r, it) => r[it], window);
        // if (!exports[tagNameArr[2]]) {
        //   this.showWarning("Library handling " + libraryName + ".* has no export named " + tagNameArr[2] + "! It has these: " + Object.keys(exports).join(", ") + ". This might still work if the library exports API to window / " + tagNameArr[0] + " by itself.");
        // } else {
        //   parent[lastPart] = exports;
        // }
        this._setComponent(this._get("tagName", props), this._get("props", props));
      }
    };

    Tools.loadLibrary(libraryName, (libraryJson, error) => {
      if (!error && libraryJson.source) {
        this._importLibrary(libraryJson, libraryReady);
      } else {
        libraryReady(null, error || new Error("Library is missing a source"));
      }
    });

    return this;
  },

  _getSourceUrl(library) {
    let result;
    if (library && library.name && library.version) {
      let sourceName = library.name.replace(/^uu_uu5/, "uu5"); // some libraries include duplicit uu (vendor) in their registration (uu_uu5g04), most don't
      let baseName = sourceName.replace(/-.*/, ""); // remove -bricks, ... suffix
      if (baseName.indexOf("_") === -1 && baseName.startsWith("uu")) baseName = "uu_" + baseName; // baseName needs duplicit uu (vendor)
      baseName = baseName.replace(/_/g, "-");
      result =
        Environment.CDN_URL +
        "/" +
        baseName +
        "/" +
        library.version +
        "/" +
        sourceName +
        (process.env.NODE_ENV === "production" ? ".min.js" : ".js");
    }
    return result;
  },

  _setComponent(tagName, props) {
    if (!this._unmounted) {
      // props = props || this.props.props;

      let component = tagName && Tools.checkTag(tagName);
      let isError = !component;
      if (isError) {
        component = NotFoundTag;
        props = Tools.merge({}, props);
        props.tagName = this._get("tagName", props) || tagName;
        props.error = this._get("error", this.props);
      }
      if (typeof this.props._onLoad === "function") {
        this.props._onLoad(
          isError ? null : component,
          isError ? props.error || new Error(`Component ${tagName} has not been found.`) : null
        );
      }

      if (!this._unmounted) {
        component && this.setState({ component, props });
      }
    }
    return this;
  },

  _setNotFound(tagCalls) {
    tagCalls.forEach((fce) => fce());
    return this;
  },

  _setLibError(libCode) {
    let libSettings = Environment.getLibrary(libCode);
    if (libSettings) {
      libSettings.error = true;
    } else {
      Environment.addLibrary(libCode, { error: true });
    }
    return this;
  },

  _getLogicalVersionFromUrl(version, systemUrl) {
    let result = version;
    if (version && version.match(/^\d+\.0\.0$/) && (!systemUrl || systemUrl.indexOf("/libs/") === -1)) {
      result = version.replace(/\..*/, "") + ".999.0";
    }
    return result;
  },

  _getUrlVersionFromLogical(logicalVersion, systemUrl) {
    let result = logicalVersion;
    if (logicalVersion && (!systemUrl || systemUrl.indexOf("/libs/") === -1)) {
      result = logicalVersion.replace(/\.999\.0$/, ".0.0");
    }
    return result;
  },

  _getModuleConfig(name, code, runtimeLibraries) {
    let configuredUrl;
    let configuredVersion;
    let libConf = Environment.getLibrary(code);
    if (runtimeLibraries[name]) {
      configuredVersion = runtimeLibraries[name].version;
    } else if (libConf && libConf.version) configuredVersion = libConf.version;
    if (window.SystemJS) {
      let systemUrl = window.SystemJS.normalizeSync(name);
      configuredUrl = !systemUrl.endsWith(name) ? systemUrl : null;
      if (configuredVersion && (!libConf || !libConf.version)) {
        // check for major version of loaded runtime library because on CDN it's handled as "last version of this major version"
        // (but that meaning is not applied to 3rd-party libs and libraries with concrete version set on Environment)
        configuredVersion = this._getLogicalVersionFromUrl(configuredVersion, systemUrl);
      }
      // use version from SystemJS config if the library is not registered
      // via Environment.addRuntimeLibrary
      if (!configuredVersion) {
        let cdnVersion = configuredUrl ? (systemUrl.match(Version.REGEX) || {})[0] : null;
        if (cdnVersion) {
          // check for major version because on CDN it's handled as "last version of this major version"
          // (but that meaning is not applied to 3rd-party libs)
          configuredVersion = this._getLogicalVersionFromUrl(cdnVersion, systemUrl);
        }
      }
    }
    return { configuredUrl, configuredVersion };
  },

  _validateAndRegisterLibrary(
    name,
    version,
    url,
    code,
    dependencyOf,
    runtimeLibraries = Environment.getRuntimeLibraries()
  ) {
    let { configuredUrl, configuredVersion } = this._getModuleConfig(name, code, runtimeLibraries);

    // special case - for submodules within single product (e.g. uu5g04-forms within uu5g04) force the version
    // according to the main module, i.e. if requesting uu5g04-forms@1.15.3 and the page has uu5g04@1.15.2 we'll
    // force 1.15.2 for uu5g04-forms.
    let usedUrl = configuredUrl || url;
    let isSubmodule = name.match(
      /^(uu5g04-(bricks|forms|bricks-editable|block-layout|hooks)|uu_plus4u5g01-(app|bricks|uubmldraw|hooks))$/
    ); // limiting only for our known submodules because there're libraries with names that look like submodules but are not (e.g. uu_plus4u5g01-uuforum)
    let isForcedSubmoduleVersion = false;
    if (isSubmodule) {
      let mainModule = name.replace(/-.*/, "");
      let mainModuleCode;
      if (code) mainModuleCode = code.split(".", 2).join(".");
      let { configuredVersion: mainVersion } = this._getModuleConfig(mainModule, mainModuleCode, runtimeLibraries);
      if (mainVersion) {
        isForcedSubmoduleVersion = true;
        configuredVersion = mainVersion;
        if (!dependencyOf) version = configuredVersion; // force compatibility if loading directly a submodule (if validating as a dependency of a normal module then configure too but still check for compatibility - which should pass as the deps should be using major version only)
        if (!configuredUrl) {
          // if the lib URL has been already configured, we'll assume it's already correct (if we changed it and the lib was already loaded then it would get re-imported from this new URL & re-executed)
          if (usedUrl) {
            configuredUrl = usedUrl.replace(
              /\/\d+\.\d+\.\d+[^/]*/,
              (m) => "/" + this._getUrlVersionFromLogical(configuredVersion, usedUrl)
            );
          } else {
            configuredUrl = this._getSourceUrl({ name, version: this._getUrlVersionFromLogical(configuredVersion) });
          }
          if (window.SystemJS) window.SystemJS.config({ paths: { [name]: configuredUrl } });
        }
      }
    }

    if (window.SystemJS) {
      if (configuredVersion && !configuredUrl) {
        if (version === configuredVersion) {
          configuredUrl = url;
          window.SystemJS.config({ paths: { [name]: configuredUrl } });
        } else {
          // situation: we're loading library B which depends on library A; library A is pre-configured
          // to be in specific version via UU5.Environment.addRuntimeLibrary(A) but info from libRegistry
          // about B specifies that it depends on different version of A
          //   => use the pre-configured version of A but since we don't have the URL for it (and it wasn't configured
          //      in SystemJS either), we'll guess it
          configuredUrl = this._getSourceUrl({ name, version: configuredVersion });
          window.SystemJS.config({ paths: { [name]: configuredUrl } });
        }
      }
    }

    let compatible = !configuredVersion || isForcedSubmoduleVersion || Version.compare(version, configuredVersion) <= 0;
    if (
      compatible &&
      configuredVersion &&
      !isForcedSubmoduleVersion &&
      new Version(version).major < new Version(configuredVersion).major
    ) {
      Tools.error(
        `Page contains ${name} in version ${configuredVersion.replace(
          /^(\d+)\.999\.0$/,
          "latest $1.x"
        )}, dynamically-loaded component ${this._get("tagName")} requested to use ${
          dependencyOf ? "library " + dependencyOf + " requiring dependency " + name + " in " : ""
        }OLDER version ${version}. ` +
          "The already-present (newer) version of the library / dependency will be used, i.e. request for older version is skipped. " +
          "The library should update its dependencies to newer versions to prevent this error.",
        {
          tag: this._get("tagName"),
          libraryName: dependencyOf || name,
          dependencyName: dependencyOf ? name : null,
          requestedVersion: version,
          inPageVersion: configuredVersion.replace(/^(\d+)\.999\.0$/, "latest $1.x"),
        }
      );
      version = configuredVersion;
    }
    if (compatible && configuredVersion && !isForcedSubmoduleVersion) {
      version = configuredVersion;
    }
    if (!compatible && configuredVersion && new Version(version).major > new Version(configuredVersion).major) {
      if (
        name === "uu5g04" ||
        name === "uu_plus4u5g01" ||
        name === "uu_appg01_core" ||
        name === "uu_appg01" ||
        name === "uu_appg01_oidc" ||
        name === "uu_oidcg01"
      ) {
        // don't allow overwriting of uu5g04 / uu_plus4u5g01
        Tools.error(
          `Page contains ${name} in version ${configuredVersion.replace(
            /^(\d+)\.999\.0$/,
            "latest $1.x"
          )}, dynamically-loaded component ${this._get("tagName")} requested to use ${
            dependencyOf ? "library " + dependencyOf + " requiring dependency " + name + " in " : ""
          }NEWER version ${version}. ` +
            "The already-present (older) version of the library / dependency will be used, i.e. request for newer version is skipped. Application should " +
            "update its dependencies configuration to use newest versions or it should restrict versions of dynamically loaded libraries " +
            "using UU5.Environment.addLibrary API.",
          {
            tag: this._get("tagName"),
            libraryName: dependencyOf || name,
            dependencyName: dependencyOf ? name : null,
            requestedVersion: version,
            inPageVersion: configuredVersion.replace(/^(\d+)\.999\.0$/, "latest $1.x"),
          }
        );
        compatible = true;
        version = configuredVersion;
      } else {
        // NOTE We're handling bigger major version as being compatible (with error) to handle situation:
        // 1. Library A is released in new major version (2.0.0).
        // 2. Library B wants to use A@2.0.0 - it gets registered to library registry and has dependency there with A@2.0.0.
        // 3. All existing apps which use A@1.x and do dynamic loading will start failing because library registry will now
        //    be returning newest B with dependency A@2.0.0 (i.e. major versions don't match).
        Tools.error(
          `Page contains ${name} in version ${configuredVersion.replace(
            /^(\d+)\.999\.0$/,
            "latest $1.x"
          )}, dynamically-loaded component ${this._get("tagName")} requested to use ${
            dependencyOf ? "library " + dependencyOf + " requiring dependency " + name + " in " : ""
          }NEWER version ${version}. ` +
            "Library / dependency in NEWER version will be loaded and will overwrite already present one. Application should " +
            "update its dependencies configuration to use newest versions or it should restrict versions of dynamically loaded libraries " +
            "using UU5.Environment.addLibrary API.",
          {
            tag: this._get("tagName"),
            libraryName: dependencyOf || name,
            dependencyName: dependencyOf ? name : null,
            requestedVersion: version,
            inPageVersion: configuredVersion.replace(/^(\d+)\.999\.0$/, "latest $1.x"),
          }
        );
        compatible = true;
        configuredVersion = configuredUrl = null;
      }
    }

    // NOTE We'll allow the flow to continue even if requesting incompatible version - log it
    // and use already-present one.
    if (!compatible) {
      Tools.error(
        `Page contains ${name} in version ${configuredVersion.replace(
          /^(\d+)\.999\.0$/,
          "latest $1.x"
        )}, dynamically-loaded component ${this._get("tagName")} requested to use ${
          dependencyOf ? "library " + dependencyOf + " requiring dependency " + name + " in " : ""
        }NEWER version ${version}. ` +
          "The already-present (older) version of the library / dependency will be used, i.e. request for newer version is skipped. Application should " +
          "update its dependencies configuration to use newest versions or it should restrict versions of dynamically loaded libraries " +
          "using UU5.Environment.addLibrary API.",
        {
          tag: this._get("tagName"),
          libraryName: dependencyOf || name,
          dependencyName: dependencyOf ? name : null,
          requestedVersion: version,
          inPageVersion: configuredVersion,
        }
      );
      compatible = true;
      version = configuredVersion;
    }

    if (compatible) {
      if (!runtimeLibraries[name] || !configuredVersion) Environment.addRuntimeLibrary({ name, version });
      if (!url) {
        Tools.error("Library / dependency does not have any source URL specified.", {
          tagName: this._get("tagName"),
          libraryName: dependencyOf || name,
          dependencyName: dependencyOf ? name : null,
        });
      }
    }
    return { configuredUrl, configuredVersion, compatible, isSubmodule, isForcedSubmoduleVersion };
  },

  _getLoaderConfig(library) {
    let paths = {};
    let runtimeLibraries = Environment.getRuntimeLibraries();

    // some libraries include duplicit uu (vendor) in their registration (uu_uu5g04), most don't => remove
    // it because "import" statements are without it
    let name = library.name.replace(/^uu_uu5/, "uu5");
    let version = library.version;
    let url = library.source || this._getSourceUrl(library);
    let code = library.code;

    let {
      compatible,
      configuredUrl,
      configuredVersion,
      isSubmodule,
      isForcedSubmoduleVersion,
    } = this._validateAndRegisterLibrary(name, version, url, code, null, runtimeLibraries);
    let depsCompatible = true;
    if (compatible) {
      if (!configuredUrl) paths[name] = url;
      let dependencies = library.dependencyMap;

      // special case - this whole library is a submodule of a product (e.g. uu5g04-forms) and
      // thus we want this library to be the same version as main module (e.g. uu5g04) => update
      // version of all dependencies that are submodules of our product (e.g. uu5g04-bricks)
      if (isSubmodule && isForcedSubmoduleVersion && (configuredUrl || url)) {
        dependencies = { ...dependencies };
        let productUrlBase = (configuredUrl || url).replace(/(\/\d+\.\d+\.\d+[^/]*\/).*/, "$1"); // strip what's after version
        let productUrlBaseNoVersion = productUrlBase.replace(/\/\d+\.\d+\.\d+[^/]*\/$/, "/");
        Object.keys(dependencies).forEach((key) => {
          let value = dependencies[key];
          if (value && value.startsWith(productUrlBaseNoVersion)) {
            dependencies[key] = productUrlBaseNoVersion + configuredVersion + "/" + value.substr(productUrlBase.length);
          }
        });
      }

      // validate dependencies
      Object.keys(dependencies).forEach((key) => {
        let value = dependencies[key];
        let depName = key.replace(/^uu_uu5/, "uu5");
        let isVersionOnly = this.getDefault().regexpDigit.test(value);
        let depUrl = isVersionOnly ? this._getSourceUrl({ name: depName, version: value }) : value;
        let depVersion = isVersionOnly ? value : (value.match(Version.REGEX) || {})[0];
        let depCode = null;

        let { compatible, configuredUrl } = this._validateAndRegisterLibrary(
          depName,
          depVersion,
          depUrl,
          depCode,
          name,
          runtimeLibraries
        );
        if (!compatible) {
          depsCompatible = false;
        } else if (!configuredUrl) paths[depName] = depUrl;
      });
    }
    return {
      compatible,
      configuredUrl,
      depsCompatible,
      paths,
      url,
      importName: name,
    };
  },

  _importLibrary(library, callback) {
    let query = library.id;
    let cache = importLibraryCache;
    if (!cache[query]) {
      cache[query] = {
        result: null,
        error: null,
        pendingCallback: [callback],
      };
      let SystemJS = window.SystemJS;
      if (SystemJS) {
        let { paths, importName, compatible, depsCompatible, configuredUrl, url } = this._getLoaderConfig(library);
        if (compatible && depsCompatible && (configuredUrl || url)) {
          SystemJS.config({ paths });

          SystemJS.import(importName).then(
            (libraryComponents) => {
              cache[query].result = libraryComponents;
              cache[query].pendingCallback.forEach((fn) => fn(cache[query].result));
            },
            (e) => {
              Tools.error("Importing library from URL failed: " + e, {
                source: SystemJS.normalizeSync(importName),
                tagName: this._get("tagName"),
                cause: e,
              });
              this._setLibError(library.code);
              cache[query].error = e;
              cache[query].pendingCallback.forEach((fn) => fn(null, cache[query].error));
            }
          );
        } else {
          cache[query].error = new Error();
          cache[query].pendingCallback.forEach((fn) => fn(null, cache[query].error));
        }
      } else {
        Tools.error("SystemJS is not defined in window! Cannot import library:", {
          libraryName: library.name,
          tagName: this._get("tagName"),
        });
        this._setLibError(library.code);
        cache[query].error = new Error();
        cache[query].pendingCallback.forEach((fn) => fn(null, cache[query].error));
      }
    } else if (cache[query].result || cache[query].error) {
      callback(cache[query].result, cache[query].error);
    } else {
      cache[query].pendingCallback.push(callback);
    }
    return this;
  },
  //@@viewOff:private

  //@@viewOn:render
  render() {
    if (this.state.component) {
      const { _tagName, _props, _content, _error, _fromFindComponent, ...restProps } = this.props;
      return Element.create(
        this.state.component,
        _fromFindComponent ? { ...restProps, ...this.state.props } : this.state.props,
        _fromFindComponent ? _content : this.props.content
      );
    } else {
      return null;
    }
  },
  //@@viewOff:render
});

export default TagPlaceholder;
