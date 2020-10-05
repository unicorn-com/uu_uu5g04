// NOTE Can be removed when g04 & g05 are integrated together.
// Copy&pasted from uu5g05 (use-dynamic-library-component.js) and tweaked imports.

//@@viewOn:imports
import ReactDOM from "react-dom";
// import { useRef, useState, useEffect } from "./react-hooks";
// import Component from "../component";
// import PropTypes from "./prop-types";
// import Config from "./config/config";
import LibraryRegistry from "./library-registry";
import LibraryLoader /*, { ERROR_LIBRARY_LOAD_FAILED }*/ from "./library-loader";
// import Tools from "../tools";
// import Lsi from "./config/lsi";
// import LsiComponent from "./internal/lsi";
// import ErrorComponent from "./internal/error";
import Environment from "../../environment/environment";
//@@viewOff:imports

const ERROR_LIBRARY_JSON_LOAD_FAILURE = "LIBRARY_JSON_LOAD_FAILURE";
const ERROR_LIBRARY_MISSING_SOURCE = "LIBRARY_MISSING_SOURCE";
const ERROR_LIBRARY_REGISTRY_DISABLED = "LIBRARY_REGISTRY_DISABLED";
const ERROR_COMPONENT_MISSING = "COMPONENT_MISSING";

function useDynamicLibraryComponent(componentName) {
  //   let { Component, error } = getComponentByName(componentName);
  //   let forceUpdate = useForceUpdate();
  //   useEffect(() => {
  //     let active = true;
  //     if (Component == null && error == null) {
  //       _loadComponentByName(componentName, () => (active ? forceUpdate() : null));
  //     }
  //     return () => (active = false);
  //   }, [forceUpdate, componentName, Component, error]);
  //   return {
  //     Component: Component ?? null,
  //     errorData: error ? { error } : null,
  //     state: error != null ? "error" : Component != null ? "ready" : "pending",
  //   };
}

// const DynamicLibraryComponent = Component.create({
//   //@@viewOn:statics
//   displayName: Config.TAG + "DynamicLibraryComponent",
//   //@@viewOff:statics

//   //@@viewOn:propTypes
//   propTypes: {
//     componentName: PropTypes.string.isRequired,
//     props: PropTypes.object,
//   },
//   //@@viewOff:propTypes

//   //@@viewOn:defaultProps
//   defaultProps: {
//     componentName: undefined,
//     props: undefined,
//   },
//   //@@viewOff:defaultProps

//   render(fullProps) {
//     let { componentName, props, ...restProps } = fullProps;
//     let { Component, errorData, state } = useDynamicLibraryComponent(componentName);

//     //@@viewOn:render
//     let mergedProps = { ...restProps, ...props }; // some props are passed directly (e.g. nestingLevel, some can be in prop "props")
//     return state === "error" ? (
//       <ErrorComponent nestingLevel={mergedProps.nestingLevel}>
//         <LsiComponent
//           lsi={
//             Lsi.dynamicLibraryComponent[
//               (errorData.error.code === ERROR_LIBRARY_JSON_LOAD_FAILURE ||
//                 errorData.error.code === ERROR_LIBRARY_LOAD_FAILED) &&
//               errorData.error.wasOffline
//                 ? "offline"
//                 : "notFound"
//             ]
//           }
//           params={[componentName]}
//         />
//       </ErrorComponent>
//     ) : Component ? (
//       <Component {...mergedProps} />
//     ) : null;
//     //@@viewOff:render
//   },
// });

//@@viewOn:helpers
// function useForceUpdate() {
//   let [, setValue] = useState(0);
//   return useRef(() => setValue((c) => 1 - c)).current;
// }

let namespaceMap = LibraryRegistry._namespaceMap; // { "Uu5Bricks": { error: null, exports: {}, promise, namespace: "Uu5Bricks", name, version }}

/**
 * @return Synchronously returns { Component, error } by component name if it is available in the page.
 *         "Component" is component class, "error" is error if the library where component was supposed
 *         to be has been already attempted to load and failed.
 */
function getComponentByName(componentName) {
  let result;
  if (typeof componentName === "string") {
    if (componentName.indexOf(".") === -1) result = { error: undefined, Component: componentName };
    else {
      let error;
      let Component;
      let item = _getNamespaceMapItem(componentName, false);
      if (item && item.ready) {
        error = item.error;
        if (!error) {
          Component = _getByNamespace(item.exports, componentName.substr(item.namespace.length + 1));
          if (Component == null) {
            error = new Error(
              `Component ${componentName} not found in exports of library ${item.name} (namespace ${item.namespace}).`
            );
            error.code = ERROR_COMPONENT_MISSING;
          }
        }
      }
      // allow adjusting of the result for uu5g04
      if (useDynamicLibraryComponent._backCompatGetComponent) {
        ({ Component, error } = useDynamicLibraryComponent._backCompatGetComponent(
          componentName,
          item,
          Component,
          error
        ));
      }
      result = error != null || Component != null ? { error, Component } : {};
    }
  }
  return result;
}

// function findComponent(componentName, props, children) {
//   let { Component } = getComponentByName(componentName);
//   if (Component === "invalidTag") {
//     Component = ErrorComponent;
//     props = { key: props.key, ref: props.ref };
//     children = <LsiComponent lsi={Lsi.dynamicLibraryComponent.invalidTag} />;
//   }

//   let result = Component ? (
//     <Component {...props}>{children}</Component>
//   ) : (
//     <DynamicLibraryComponent componentName={componentName} props={props} key={props.key}>
//       {children}
//     </DynamicLibraryComponent>
//   );
//   return result;
// }

function _getNamespaceMapItem(componentName, create = false) {
  let nameParts = componentName.split(".");
  let foundItemParts = [...nameParts];
  while (foundItemParts.length > 0) {
    let prefixName = foundItemParts.join(".");
    if (prefixName in namespaceMap) break;
    foundItemParts.pop();
  }
  let item = foundItemParts.length > 0 ? namespaceMap[foundItemParts.join(".")] : null;
  // normalize item if library was registered via LibraryRegistry.registerLibrary() (i.e. load exports from SystemJS,
  // set it as ready, etc.).
  if (item && !item.ready && !item.promise && item.exports === undefined && item.name) {
    item.ready = true;
    item.exports = typeof SystemJS !== "undefined" ? SystemJS.get(SystemJS.normalizeSync(item.name)) : undefined;
  }
  if (!item && create) {
    let estimatedLibNamespace = nameParts.slice(0, Math.min(2, nameParts.length - 1)).join(".");
    namespaceMap[estimatedLibNamespace] = item = { namespace: estimatedLibNamespace }; // NOTE Can change after library registry JSON is obtained.
  }
  // consider all items as errored out if library registry is disabled and they are not ready yet
  if (!Environment.useLibraryRegistry && !item?.ready) {
    let error = new Error(
      `Component ${componentName} could not have been loaded because usage of library registry is disabled in UU5 environment.`
    );
    error.code = ERROR_LIBRARY_REGISTRY_DISABLED;
    item = { ready: true, error };
  }
  return item;
}
function _getByNamespace(obj, key) {
  if (key === "") return obj && obj.default !== undefined ? obj.default : obj; // if the library has single default export acting like a component (~UuForum)
  let result = obj;
  let keyParts = key.split(".");
  while (result != null && keyParts.length > 0) result = result[keyParts.shift()];
  return result;
}
function _loadComponentByName(componentName, onReady) {
  let item = _getNamespaceMapItem(componentName, true);
  if (item.ready) {
    onReady(item);
  } else if (!item.promise) {
    item.callbacks = [onReady];
    item.promise = (async () => {
      let libraryJson;
      try {
        libraryJson = await LibraryRegistry.getLibrary(item.namespace);
      } catch (e) {
        e.message = `Failed to load library registry JSON for library with namespace ${item.namespace}: ${e.message}`;
        e.code = ERROR_LIBRARY_JSON_LOAD_FAILURE;
        throw e;
      }
      if (!item.name) item.name = libraryJson?.name;
      if (!item.version) item.version = libraryJson?.version;
      if (libraryJson?.code && libraryJson.code !== item.namespace) {
        item.namespace = libraryJson.code; // we might have been loading 'Uu5Bricks.Select' (due to name 'Uu5Bricks.Select.Item') and server returned 'Uu5Bricks'
      }
      if (!libraryJson?.source) {
        let error = new Error(
          `Library ${libraryJson?.name} is missing 'source' field. Full library JSON:\n${JSON.stringify(
            libraryJson,
            null,
            2
          )}`
        );
        error.code = ERROR_LIBRARY_MISSING_SOURCE;
        throw error;
      }
      let { exports, problems } = await LibraryLoader.importLibrary(libraryJson);
      item.exports = exports;
      item.problems = problems;
    })()
      .catch((e) => {
        item.problems = e.problems;
        let error = e.error || e;
        error.message = `Error loading ${componentName}: ${error.message}`;
        error.wasOffline = navigator.onLine === false;
        item.error = error;
      })
      .finally(() => {
        item.ready = true;
        let { problems, callbacks } = item;
        if (problems) {
          problems.forEach(({ message, ...context }) => {
            console.error(`Problem with loading ${componentName}: ${message}`, context); // not using Tools due to cyclic dependencies
          });
          delete item.problems;
        }
        ReactDOM.unstable_batchedUpdates(() => {
          callbacks.forEach((fn) => fn(item));
        });
        delete item.callbacks;
      });
  } else {
    item.callbacks.push(onReady);
  }
  return item.promise;
}
//@@viewOff:helpers

export { useDynamicLibraryComponent, getComponentByName, _loadComponentByName };
