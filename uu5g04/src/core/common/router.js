/**
 * Copyright (C) 2021 Unicorn a.s.
 *
 * This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public
 * License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later
 * version.
 *
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied
 * warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License at
 * <https://gnu.org/licenses/> for more details.
 *
 * You may obtain additional information at <https://unicorn.com> or contact Unicorn a.s. at address: V Kapslovne 2767/2,
 * Praha 3, Czech Republic or at the email: info@unicorn.com.
 */

//@@viewOn:imports
import React from "react";
import { Fragment, PropTypes, Utils } from "uu5g05";
import { RouteLeaveContext } from "../uu5g05-integration/use-route-leave.js";
import ns from "./common-ns.js";
import Tools from "./tools.js";
import Environment from "../environment/environment.js";
import BaseMixin from "./base-mixin.js";
import ElementaryMixin from "./elementary-mixin.js";
import CcrWriterMixin from "./ccr-writer-mixin.js";
import Url from "./url.js";
import Uu5CommonError from "./error.js";
import VisualComponent from "./visual-component.js";
import Element from "./element.js";

import "./router.less";
//@@viewOff:imports

const REACT_LAZY_TYPEOF = React.lazy && React.lazy(() => ({ default: (props) => "" })).$$typeof;

function getParamsFromQuery(query) {
  let result = {};
  query.split(/&/).forEach((it) => {
    let eqlIdx = it.indexOf("=");
    let key = decodeURIComponent((eqlIdx == -1 ? it.substr(0) : it.substr(0, eqlIdx)).replace(/\+/g, " "));
    if (key) {
      let value = decodeURIComponent((eqlIdx == -1 ? "" : it.substr(eqlIdx + 1)).replace(/\+/g, " "));
      result[key] = value;
    }
  });
  return Object.keys(result).length > 0 ? result : undefined;
}

export const Router = VisualComponent.create({
  displayName: "Router", // for backward compatibility (test snapshots)
  //@@viewOn:mixins
  mixins: [BaseMixin, ElementaryMixin, CcrWriterMixin],
  //@@viewOff:mixins

  //@@viewOn:statics
  statics: {
    tagName: ns.name("Router"),
    opt: {
      ccrKey: Environment.CCRKEY_ROUTER,
    },
    classNames: {
      leaveConfirmationModal: ns.css("router-leave-confirmation-modal"),
      leaveConfirmationBody: ns.css("router-leave-confirmation-body"),
      leaveConfirmationFooter: ns.css("router-leave-confirmation-footer"),
      leaveConfirmationButtonConfirm: ns.css("router-leave-confirmation-button-confirm"),
      leaveConfirmationButtonDeny: ns.css("router-leave-confirmation-button-deny"),
    },
    lsi: () => Environment.Lsi.Common.router,
    getDerivedStateFromError(error) {
      return { routeError: error };
    },
  },
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {
    basePath: PropTypes.string,
    route: PropTypes.oneOfType([
      PropTypes.string, // path
      PropTypes.element,
      PropTypes.shape({
        tag: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
        props: PropTypes.object,
        source: PropTypes.string,
      }),
    ]),
    notFoundRoute: PropTypes.oneOfType([
      PropTypes.string, // path
      PropTypes.element,
      PropTypes.shape({
        tag: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
        props: PropTypes.object,
      }),
    ]),
    showNotFoundRouteInUrl: PropTypes.bool,
    routes: PropTypes.object,
    urlBuilder: PropTypes.func,
    strictRoutes: PropTypes.bool,
    loading: PropTypes.node,
    onRouteChanged: PropTypes.func,
  },
  //@@viewOff:propTypes

  //@@viewOn:getDefaultProps
  getDefaultProps() {
    return {
      basePath: null,
      notFoundRoute: null,
      routes: null,
      urlBuilder: null,
      showNotFoundRouteInUrl: false,
      strictRoutes: false,
      loading: "",
      onRouteChanged: null,
    };
  },
  //@@viewOff:getDefaultProps

  //@@viewOn:reactLifeCycle
  getInitialState() {
    Environment.router = this;
    this._history = [];
    this._routeIndex = null;
    this._preventLeave = {};
    this._preventLeaveUnkeyed = 0;

    return {
      route: null,
      routeError: null,
      requestedRoute: null, // info about requested route for cases when it's invalid (wrong component tag / ...)
      // integration with uu5g05 (so that useRouteLeave works)
      routeLeaveCtxValue: {
        id: null,
        nextRoute: null,
        prevent: this._routeLeaveCtxPrevent,
        allow: this._routeLeaveCtxAllow,
        confirm: this._routeLeaveCtxConfirm,
        refuse: this._routeLeaveCtxRefuse,
        _intermediaryConfirm: null,
      },
    };
  },

  UNSAFE_componentWillMount() {
    if (
      window.location.pathname &&
      this.props.routes &&
      (typeof this.props.route === "string" || this.props.route === undefined)
    ) {
      let path = window.location.pathname;
      let basePath = this._getBasePath(path, this.props);
      basePath && (path = path.replace(basePath, ""));

      let params = null;
      if (window.location.search) {
        params = Url.decodeQuery(window.location.search);
      }
      let fragment = null;
      if (window.location.hash.length > 1) {
        fragment = window.location.hash.substr(1);
      }
      this._setRoute(path, params, this.props, fragment);
    } else if (!this._shouldImport(this.props.route)) {
      this._setRoute(this.props.route, null, this.props);
    }
  },

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.controlled) {
      this._setRoute(nextProps.route, null, nextProps);
    }
  },

  shouldComponentUpdate(nextProps, nextState) {
    return nextProps.controlled || nextState !== this.state;
  },

  componentDidMount() {
    if (this._shouldImport(this.props.route)) {
      this._importRoute(this.props.route);
    }

    window.onpopstate = this._onWindowPopState;
    window.addEventListener("scroll", this._onWindowScroll);
    this.scrollToFragment();
  },

  componentDidUpdate(prevProps, prevState) {
    this.scrollToFragment();

    // flag below solves this scenario:
    // 1. user is scrolled down
    // 2. user changes route to a new one which contains fragment; new route is using LoadMixin / doing some async stuff before rendering
    // 3. browser triggers scroll event towards top (new route doesn't yet have content and we were scrolled down)
    // 4. we don't want the scroll event to be considered as a user action, i.e. after new route loads, we still want to scroll to new fragment
    // => remember this situation with a timed flag and use it in _onWindowScroll for skipping fragment removal
    this._isScrollDueToRender = true;
    setTimeout(() => (this._isScrollDueToRender = false), 50);

    if (typeof this.props.onRouteChanged === "function" && prevState.route !== this.state.route) {
      let { useCase, params, config } = this.state;
      let route = config || { component: this.state.route };
      this.props.onRouteChanged({ route, useCase, parameters: params });
    }
  },

  componentWillUnmount() {
    window.removeEventListener("scroll", this._onWindowScroll);
    Environment.EventListener.unregisterBeforeUnload();
  },
  //@@viewOff:reactLifeCycle

  //@@viewOn:interface
  // newRoute =
  //   {component, noHistory, url, notFoundRoute: {} || < />, tag, props, source} ||
  //   "route name" ||
  //   {useCase, params, config} ||     (used only from goTo methods)
  //   @deprecated   <Node ... />
  // params =
  //   a) {url, noHistory, title}  if newRoute is <Node ... />
  //   b) {...}   if newRoute is "route name" (will be used as prop "params" for the component)
  setRoute(newRoute, /* params?, fragment?, replace?, setStateCallback? */ ...args) {
    let setStateCallback = typeof args[args.length - 1] === "function" ? args.pop() : undefined; // always last
    let params = args.shift();
    let fragment = args.shift();
    let replace = args.shift();
    if (newRoute && typeof newRoute === "object") {
      if (newRoute.url && newRoute.url.fragment) {
        // fix API of using this object in the rest of the compnent - copy url.fragment into deprecated url.hash
        newRoute = { ...newRoute, url: { ...newRoute.url, hash: newRoute.url.fragment } };
      }
      if ("replace" in newRoute) {
        replace = newRoute.replace;
        newRoute = { ...newRoute };
        delete newRoute.replace;
      }
    }
    if (this._shouldImport(newRoute)) {
      this._importRoute(newRoute, params, setStateCallback);
    } else {
      this._setRoute(newRoute, params, null, fragment, setStateCallback, replace);
    }
    return this;
  },

  allowPageLeave(key = null) {
    this._allowPageLeave(false, key);
  },

  preventPageLeave(key = null, getPageLeaveModalPropsFn) {
    if (typeof key === "function") {
      getPageLeaveModalPropsFn = key;
      key = null;
    }
    if (!key) key = "default_" + this._preventLeaveUnkeyed++;
    key = "_" + key;
    delete this._preventLeave[key]; // to update insertion-order
    this._preventLeave[key] = getPageLeaveModalPropsFn;
    if (Object.keys(this._preventLeave).length === 1) Environment.EventListener.registerBeforeUnload();
  },

  scrollToFragment(/* smoothScroll, offset */) {
    if (this._pendingFragmentToScrollTo) {
      let id = this._pendingFragmentToScrollTo;
      let fragEl = document.getElementById(id);

      if (!fragEl) {
        id = id.replace("-inner", ""); // inner na konci
        fragEl = document.getElementById(id);
      }

      if (fragEl) {
        let args = [id].concat(Array.prototype.slice.call(arguments, 1));
        if (args.length < 5) {
          while (args.length < 4) args.push(undefined);
          args.push(true);
        }
        Tools.scrollToTarget.apply(Tools, args);
        // NOTE Deleting fragment only if the element exists (i.e. we already scrolled there). If it doesn't exist,
        // we preserve it which then gives opportunity to call scrollToFragment() from other components, e.g. if
        // they're using LoadMixin and need to scroll to the target element themselves after data is loaded.
        delete this._pendingFragmentToScrollTo;
      }
    }
  },
  //@@viewOff:interface

  //@@viewOn:overriding
  //@@viewOff:overriding

  //@@viewOn:private
  _allowPageLeave(allowAll, key) {
    if (allowAll) {
      this._preventLeave = {};
      this._preventLeaveUnkeyed = 0;
    } else {
      if (!key) key = "default_" + --this._preventLeaveUnkeyed;
      key = "_" + key; // to ensure insertion-ordering (numeric keys would be inserted before non-numeric otherwise)
      delete this._preventLeave[key];
      if (typeof key === "string" && key.startsWith("_default_")) {
        let curMaxValue = Object.keys(this._preventLeave)
          .reverse()
          .find((it) => it.startsWith("_default_"));
        this._preventLeaveUnkeyed = curMaxValue ? Number(curMaxValue.replace("_default_", "")) + 1 : 0;
      }
    }
    this._routeLeaveCtxAllowed(key, allowAll);
    if (!Object.keys(this._preventLeave).length) Environment.EventListener.unregisterBeforeUnload();
  },

  _getBasePath(path, props) {
    let result;
    if (props.basePath === null) {
      result = Environment.getAppBasePath();
      if (result === null) {
        path = path || window.location.pathname;
        result = path ? path.replace(/(\/.*?\/.*?)\/.*/, "$1") : "";
      }
    } else {
      result = props.basePath;
    }
    if (result && result[result.length - 1] === "/") result = result.substr(0, result.length - 1);
    if (result && result[0] !== "/") result = "/" + result;
    return result;
  },

  _shouldImport(route) {
    return route && typeof route === "object" && route.tag && !Tools.findComponent(route.tag, true);
  },

  _importRoute(route, params, setStateCallback) {
    if (window.SystemJS && window.SystemJS.import) {
      if (route.source) {
        SystemJS.import(route.source).then(
          (exports) => {
            let tagArray = route.tag.split(".");
            let calculatedTag = window;
            while (calculatedTag && tagArray.length > 1) {
              let moduleName = tagArray.shift();
              calculatedTag[moduleName] = calculatedTag[moduleName] || {};
              calculatedTag = calculatedTag[moduleName];
            }
            let tagName = tagArray.shift();
            let tagExport = exports[tagName];
            tagExport = tagExport || exports.default;
            calculatedTag[tagName] = tagExport;
            this._setRoute(route, params, null, null, setStateCallback);
          },
          (error) => {
            Tools.error('Loading package "' + route.source + '" failed with error:', {
              error: error,
              tagName: this.constructor.tagName,
            });
          }
        );
      } else {
        Tools.error("Route was not found and has not set any source to import.", {
          route: route,
          tagName: this.constructor.tagName,
        });
        this._setRoute(route.notFoundRoute, { requestedRoute: route });
      }
    } else {
      Tools.error("SystemJS is not defined in window! Cannot import source:", {
        source: route.source,
        tagName: this.constructor.tagName,
      });
    }
    return this;
  },

  _setRoute(newRoute, params, props, frag, setStateCallback, replace = null) {
    props = props || this.props;
    let { route, fragment, applyRouteFn } = this._buildRoute(
      newRoute,
      params,
      replace,
      props,
      frag,
      null,
      null,
      setStateCallback
    );
    this._pendingFragmentToScrollTo = fragment;
    this._showPageLeaveConfirmation(() => {
      let applyToState =
        typeof applyRouteFn !== "function"
          ? { config: undefined, useCase: undefined, params: undefined }
          : applyRouteFn();
      applyToState &&
        this.setState({ ...applyToState, route: route, requestedRoute: newRoute, routeError: null }, setStateCallback);
    });
    return this;
  },

  _showPageLeaveConfirmation(continueWithPageLeaveCallback) {
    if (Object.keys(this._preventLeave).length) {
      let processed = false;
      let modalOpen = false;

      const preventKey = Object.keys(this._preventLeave).reverse()[0];

      let processResultFn = (confirmed) => {
        if (!processed) {
          // process only first call of this method
          processed = true;
          if (confirmed) {
            this._allowPageLeave(true);
            continueWithPageLeaveCallback();
          }
          if (this._pageLeaveModal && modalOpen) this._pageLeaveModal.close();
        }
      };

      if (this._pageLeaveModal) {
        let customModalProps;
        const fn = this._preventLeave[preventKey];
        if (typeof fn === "function") {
          customModalProps = fn(processResultFn);
        }

        if (customModalProps !== false) {
          let modalProps = this._getPageLeaveModalProps(processResultFn, customModalProps);
          modalOpen = true;
          this._pageLeaveModal.open(modalProps);
        }
      } else {
        let wantToLeave = confirm(this.getLsiValue("pageLeaveConfirmationBody"));
        processResultFn(wantToLeave);
      }
    } else {
      continueWithPageLeaveCallback();
    }
  },

  _getPageLeaveModalProps(callback, customProps) {
    let { onClose, ...usedCustomProps } = customProps || {};
    let UU5 = window.UU5; // assume that other bricks are available too (we already rendered UU5.Bricks.Modal)
    return {
      header: this.getLsiComponent("pageLeaveConfirmationHeader"),
      className: this.getClassName("leaveConfirmationModal"),
      onClose: (...args) => {
        args[0].component.onCloseDefault(...args);
        if (typeof onClose === "function") onClose(...args);
        else callback(false);
      },
      content: [
        <UU5.Bricks.Div
          className={this.getClassName("leaveConfirmationBody")}
          key="body"
          content={this.getLsiComponent("pageLeaveConfirmationBody")}
        />,
        <UU5.Bricks.Div className={this.getClassName("leaveConfirmationFooter")} key="footer">
          <UU5.Bricks.Button
            className={this.getClassName("leaveConfirmationButtonConfirm")}
            onClick={() => callback(true)}
            content={this.getLsiComponent("pageLeaveConfirm")}
          />
          <UU5.Bricks.Button
            className={this.getClassName("leaveConfirmationButtonDeny")}
            onClick={() => callback(false)}
            content={this.getLsiComponent("pageLeaveDeny")}
          />
        </UU5.Bricks.Div>,
      ],
      ...usedCustomProps,
    };
  },

  _getRouteByPath(searchedPath, props) {
    let route = props.routes[searchedPath];
    if (route === undefined) {
      if (!props.strictRoutes) route = props.routes[searchedPath.replace(/\/?$/, (m) => (m ? "" : "/"))];
      if (route === undefined) {
        // prepend with "/" for backward compatibility
        route = props.routes["/" + searchedPath];
        if (route === undefined) {
          if (!props.strictRoutes) route = props.routes[searchedPath.replace(/\/?$/, (m) => (m ? "" : "/"))];
        }
      }
    }
    if (route === undefined) route = null;
    return route;
  },

  _getRouteAfterRewritesAndRedirects(routePath, props) {
    let useCase;
    let nextPath = routePath;
    let config;
    let followedPaths = new Set();
    do {
      if (followedPaths.has(nextPath)) {
        throw new Error("Cyclic route detected: " + [...followedPaths, nextPath].join(" -> "));
      }
      followedPaths.add(nextPath);
      let route = this._getRouteByPath(nextPath, props);
      if (typeof route === "string") {
        // rewrite
        if (useCase == null) useCase = nextPath;
        nextPath = route;
      } else if (route && route.url && route.url.useCase != null) {
        // redirect
        config = Object.assign({}, route, config);
        nextPath = route.url.useCase;
      } else if (route) {
        // normal config
        config = Object.assign({}, route, config);
        if (useCase == null) {
          useCase = nextPath;
          config.url = route.url; // URL is taken from the final path (after all redirects)
        } else {
          // there was a rewrite => clear explicit url
          delete config.url;
        }
        nextPath = null;
      } else {
        // missing route
        if (useCase == null) useCase = nextPath;
        nextPath = null;
      }
    } while (nextPath !== null);
    return { useCase, config };
  },

  _onWindowPopState(event) {
    if (!this._skipPopState) {
      if (event.state) {
        var routeIndex;
        if (event.state.index < this._routeIndex) {
          // go back
          routeIndex = event.state.index;
          // console.log('goBack', this._history[this._routeIndex], event.state, this._routeIndex, this._history);
        } else {
          // go forward
          routeIndex = event.state.index;
          // console.log('goForward', this._history[this._routeIndex], event.state, this._routeIndex, this._history);
        }
        let newRoute = this._history[routeIndex];
        if (newRoute === undefined) {
          // we might be in a situation where we used Back in the browser (we were on different domain),
          // we got back without having anything in this._history (this would be in _buildRoute) and then
          // we hit Back again so we're popping history state without having this._history[] populated
          // => try to re-create history entry from current URL only
          let pathname = location.pathname;
          let basePathPrefix = (this._getBasePath(null, this.props) || "") + "/";
          let useCase = pathname.startsWith(basePathPrefix) ? pathname.substr(basePathPrefix.length) : undefined;
          if (useCase != null && this.props.routes) {
            let params = getParamsFromQuery(location.search.substr(1));
            let fragment = location.hash.substr(1);
            let routeInfo = this._getRouteAfterRewritesAndRedirects(useCase, this.props);
            let config;
            if (routeInfo) ({ useCase, config } = routeInfo);
            while (routeIndex >= this._history.length) this._history.push(undefined);
            newRoute = this._history[routeIndex] = { useCase, params, fragment, config };
            this._routeIndex = routeIndex;
          }
        }
        if (newRoute) {
          // we're going to display confirmation whether to really navigate back / forward,
          // but the browser already updated current URL in address bar => go to the previous
          // history entry (before popstate) so that URL gets fixed without altering history queue,
          // wait until user confirms navigation and if (s)he does then go to the chosen
          // history entry again so that URL gets fixed again;
          // we'll skip the URL fixing if the navigation confirmation is done synchronously
          // or there's no confirmation at all
          let isWaitingForConfirmation = true;
          let isSynchronousPageLeave = true;
          this._showPageLeaveConfirmation(() => {
            if (!isSynchronousPageLeave && this._routeIndex !== routeIndex) {
              this._skipPopState = true;
              history.go(routeIndex - this._routeIndex);
            }
            isWaitingForConfirmation = false;

            let route, fragment, applyRouteFn;
            let that = this;
            this._routeIndex = routeIndex;
            if ("component" in newRoute) route = this._buildComponent(newRoute.component);
            else ({ route, fragment, applyRouteFn } = that._buildRoute(newRoute, null, true, null, null, false, true)); // TODO "that" - required due to some babel issue (it doesn't use proper "this")
            this._pendingFragmentToScrollTo = fragment;
            let applyToState =
              typeof applyRouteFn !== "function"
                ? { config: undefined, useCase: undefined, params: undefined }
                : applyRouteFn();
            applyToState &&
              this.setState({ ...applyToState, route: route, requestedRoute: newRoute, routeError: null });
          });
          isSynchronousPageLeave = false;
          if (isWaitingForConfirmation && this._routeIndex !== routeIndex) {
            this._skipPopState = true;
            Environment.EventListener.unregisterBeforeUnload();
            window.addEventListener("popstate", function onceListener() {
              window.removeEventListener("popstate", onceListener);
              Environment.EventListener.registerBeforeUnload();
            });
            history.go(this._routeIndex - routeIndex);
          }
        }
      }
      // else {
      //   console.log('goInvalid', window.location.pathname, event.state);
      // }
    } else {
      delete this._skipPopState;
    }
    return this;
  },

  _getUrl(route, params, props, fragment) {
    props = props || this.props;
    let url = document.location.origin + (this._getBasePath(null, props) || "") + "/" + route;
    params && (url += Tools.encodeQuery(params));
    fragment && (url += "#" + fragment);
    return url;
  },

  _buildComponent(newRoute, params) {
    let newRouteChild;

    if (newRoute && typeof newRoute === "object") {
      let newProps = {
        parent: this.getParent(),
      };

      params && (newProps.params = params);

      if (newRoute.tag) {
        let tag = Tools.checkTag(newRoute.tag, true);
        let props = Tools.merge({}, newRoute.props, newProps);
        newRouteChild = tag ? Element.create(tag, props) : Tools.findComponent(newRoute.tag, props);
      } else {
        newRouteChild = Element.clone(newRoute, newProps);
      }
    }

    return newRouteChild;
  },

  _buildRoute(route, params, replace, props, fragment, ignoreGoTo, isFromHistory, setStateCallback) {
    let usedFragment = fragment;
    let newRouteChild = null;
    let applyRouteFn;
    props = props || this.props;

    if (route != null) {
      // :-/ 2nd part of the config.goTo issue - see below
      if (typeof isFromHistory !== "boolean" && typeof this._isFromHistory === "boolean") {
        isFromHistory = this._isFromHistory;
        delete this._isFromHistory;
      }

      let useCase, config, noHistory;
      if (route && typeof route === "object" && "config" in route) {
        params = route.params;
        usedFragment = route.fragment;
        useCase = route.useCase;
        config = route.config;
        if ("isFromHistory" in route) {
          isFromHistory = route.isFromHistory;
          delete route.isFromHistory;
        }
        route = "component" in route ? route.component : route.useCase;
        if (ignoreGoTo == null) ignoreGoTo = true;
      } else if (typeof route === "object" && "url" in route && !("component" in route)) {
        let url = route.url;
        if (typeof route.url === "string") {
          url = Url.parse(Url.getAbsoluteUri(route.url));
        }

        if (typeof url === "object" && typeof url.useCase === "string" && this.props.routes) {
          params = url.parameters;
          usedFragment = url.hash;
          noHistory = route.noHistory;
          route = url.useCase;
        }
      }

      let newRoute = route;
      if (typeof route === "string" && this.props.routes) {
        if (useCase === undefined) {
          if (route[0] === "/") route = route.substr(1);
          let routeInfo = this._getRouteAfterRewritesAndRedirects(route, props);
          if (routeInfo) ({ useCase, config } = routeInfo);
          if (noHistory !== undefined) config.noHistory = noHistory;
          if (
            (!config || !config.component) &&
            props.showNotFoundRouteInUrl &&
            typeof props.notFoundRoute === "string"
          ) {
            routeInfo = this._getRouteAfterRewritesAndRedirects(props.notFoundRoute, props);
            if (routeInfo) {
              ({ useCase, config } = routeInfo);
              params = { requestedRoute: newRoute };
            }
          }
        }

        if (useCase !== undefined) {
          // we won't apply the route immediately, because it can be stopped by page-leave confirmation yet
          applyRouteFn = () => {
            let result = { useCase, params, config };
            // if a route descriptor in "routes" props contains goTo method, pass resolved route there
            // and don't do anything with router state (the goTo method is supposed to call
            // router.setRoute(newRoute) by itself)
            if (config && typeof config.goTo === "function" && !ignoreGoTo) {
              result = null;
              let oldHistoryEntry = this._history[this._routeIndex || 0];
              let oldRoute =
                oldHistoryEntry &&
                Object.assign({}, oldHistoryEntry, { config: Tools.mergeDeep({}, oldHistoryEntry.config) }); // prevent modification of config
              let newRoute = {
                useCase: useCase,
                params: params,
                config: Tools.mergeDeep({}, config),
                fragment: usedFragment,
                isFromHistory: isFromHistory,
                replace,
              };

              // 1st part of config.goTo issue - some apps don't simply call router.setRoute(newRoute) so we don't get
              // info whether the new route comes from popping history or not - when that happens, it effectively removes
              // forward history because without that info we simply perform history.pushState()
              // => we'll remember it in instance field because most apps call router.setRoute(newRoute) synchronously during config.goTo
              this._isFromHistory = !!isFromHistory;
              try {
                config.goTo(oldRoute, newRoute, setStateCallback);
              } finally {
                delete this._isFromHistory;
              }
            } else if (!isFromHistory) {
              let method = "replaceState";
              if (this._routeIndex === null) {
                if (history.state && history.state.index) {
                  // we might be in a situation where we used Back in the browser (we were on different domain)
                  // and now we got back without having anything in this._history
                  // => use at least the proper index and prepare this._history to be using sufficient length
                  this._routeIndex = history.state.index;
                  while (this._routeIndex >= this._history.length) this._history.push(undefined);
                  this._history[this._routeIndex] = { useCase, params, config, fragment: usedFragment };
                } else {
                  this._routeIndex = 0;
                  this._history.push({ useCase, params, config, fragment: usedFragment });
                }
              } else {
                if (!replace) {
                  let leavingRoute = this._history[this._routeIndex];
                  let leavingFromNoHistory = leavingRoute && leavingRoute.config && leavingRoute.config.noHistory;
                  if (!leavingFromNoHistory) {
                    this._routeIndex++;
                    method = "pushState";
                  }
                }
                this._history.splice(this._routeIndex, this._history.length - this._routeIndex);
                this._history.push({ useCase, params, config, fragment: usedFragment });
              }

              // console.log(method, route, this._routeIndex, this._history);
              try {
                history[method](
                  {
                    path: route,
                    index: this._routeIndex,
                  },
                  document.title,
                  this._getUrl(useCase, params, props, usedFragment)
                );
              } catch (e) {
                if (!(window.frameElement && e instanceof DOMException)) throw e; // cannot do replace/pushState when in <iframe srcdoc="&lt;html..." (ends with DOMException so ignore it), e.g. in BookKit examples
              }
            }
            return result;
          };

          newRoute = config && config.component;
        }
      } else {
        let foundRoute = route;
        if (foundRoute && typeof foundRoute === "object" && "component" in foundRoute) {
          ({ component: foundRoute, ...params } = foundRoute); // extract "component" into foundRoute, rest into params
        } else {
          params = params || {};
        }
        let path;
        let method = "replaceState";

        if (params.url && typeof params.url === "object") {
          let urlBuilder = this.props.urlBuilder;
          if (urlBuilder) {
            path = urlBuilder.parse(window.location.href.replace(/#.*/, "")).set(params.url).toString();
          } else {
            let basePath = this._getBasePath(null, props);
            if (typeof basePath === "string") {
              // to reset actual parameters
              let urlParts = { parameters: null };
              params.url.useCase && (urlParts.pathName = basePath + "/" + params.url.useCase);
              path = Url.parse(window.location.href.replace(/#.*/, ""))
                .set(Tools.merge(urlParts, params.url))
                .toString();
            }
          }
        }

        path = path || params.url || window.location.href.replace(/#.*/, "");

        if (!usedFragment) {
          let fragInPathIndex = path.indexOf("#");
          if (fragInPathIndex !== -1) {
            usedFragment = path.substr(fragInPathIndex + 1);
            path = path.substr(0, fragInPathIndex);
            if (!path) path = location.href.replace(/#.*/, "");
          }
        }

        if (foundRoute) {
          // we won't apply the route immediately, because it can be stopped by page-leave confirmation yet
          applyRouteFn = () => {
            if (!isFromHistory) {
              // NOTE _history entries with components have for some reasons different data than the ones
              // handled via routes map. We need config object with noHistory there so let's add it.
              let config = { noHistory: params.noHistory };
              if (this._routeIndex === null) {
                if (history.state && history.state.index) {
                  // we might be in a situation where we used Back in the browser (we were on different domain)
                  // and now we got back without having anything in this._history
                  // => use at least the proper index and prepare this._history to be using sufficient length
                  this._routeIndex = history.state.index;
                  while (this._routeIndex >= this._history.length) this._history.push(undefined);
                  this._history[this._routeIndex] = {
                    path: path,
                    component: foundRoute,
                    fragment: usedFragment,
                    config,
                  };
                } else {
                  this._routeIndex = 0;
                  this._history.push({ path: path, component: foundRoute, fragment: usedFragment, config });
                }
              } else {
                if (!replace) {
                  let leavingRoute = this._history[this._routeIndex];
                  let leavingFromNoHistory = leavingRoute && leavingRoute.config && leavingRoute.config.noHistory;
                  if (!leavingFromNoHistory) {
                    this._routeIndex++;
                    method = "pushState";
                  }
                }
                this._history.splice(this._routeIndex, this._history.length - this._routeIndex);
                this._history.push({ path: path, component: foundRoute, fragment: usedFragment, config });
              }

              try {
                history[method](
                  {
                    path: path,
                    index: this._routeIndex,
                  },
                  params.title || document.title,
                  path + (usedFragment ? "#" + usedFragment : "")
                );
              } catch (e) {
                if (!(window.frameElement && e instanceof DOMException)) throw e; // cannot do replace/pushState when in <iframe srcdoc="&lt;html..." (ends with DOMException so ignore it), e.g. in BookKit examples
              }
            }
            return { config: { ...params, component: foundRoute }, useCase: undefined, params: undefined };
          };

          newRoute = foundRoute;
        }
      }

      newRouteChild = this._buildComponent(newRoute, params);
    }

    return {
      route: newRouteChild,
      fragment: usedFragment,
      applyRouteFn,
    };
  },

  _buildChild() {
    let { routeError } = this.state;
    let children = [];

    if (routeError) {
      children.push(<Uu5CommonError error={routeError} content={this.getLsiComponent("routeError")} moreInfo />);
    } else if (this.state.route) {
      children.push(this.state.route);
    } else if (this.props.notFoundRoute) {
      children.push(this._buildRoute(this.props.notFoundRoute, { requestedRoute: this.state.requestedRoute }).route);
    } else {
      children.push(<div />);
      Tools.error(this.constructor.tagName, "Router has no content.");
    }
    if (
      REACT_LAZY_TYPEOF &&
      children[0] &&
      children[0].type &&
      children[0].type.$$typeof === REACT_LAZY_TYPEOF &&
      this.props.loading !== null
    ) {
      children[0] = <React.Suspense fallback={this.props.loading}>{children[0]}</React.Suspense>;
    }

    let Modal = Tools.checkTag("UU5.Bricks.Modal", true);
    if (Modal) {
      children.push(<Modal ref_={(modal) => (this._pageLeaveModal = modal)} controlled={false} location="portal" />);
    }

    return Fragment ? <Fragment>{Utils.Content.toArray(children)}</Fragment> : Utils.Content.toArray(children);
  },

  _onWindowScroll(e) {
    // if user scrolls at any time then just remove info about fragment to scroll to
    // (we don't want to re-scroll elsewhere if user scrolled somewhere)
    if (!this._isScrollDueToRender) delete this._pendingFragmentToScrollTo;
  },

  // integration with uu5g05 (so that useRouteLeave works)
  _routeLeaveCtxPrevent(id) {
    this.preventPageLeave(id, (_intermediaryConfirm) => {
      this.setState((state) => ({
        routeLeaveCtxValue: { ...state.routeLeaveCtxValue, id, _intermediaryConfirm, nextRoute: {} }, // for simplicity we send empty nextRoute (missing uu5Route & params); what's important is that nextRoute is not null
      }));
      return false;
    });
  },
  _routeLeaveCtxAllow(id) {
    if (this.state.routeLeaveCtxValue.id === id) this._routeLeaveCtxConfirm(id);
    this.allowPageLeave(id);
  },
  _routeLeaveCtxConfirm(id) {
    if (this.state.routeLeaveCtxValue.id !== id) return;
    this.state.routeLeaveCtxValue._intermediaryConfirm(true);
  },
  _routeLeaveCtxRefuse(id) {
    if (this.state.routeLeaveCtxValue.id !== id) return;
    this.state.routeLeaveCtxValue._intermediaryConfirm(false);
    this.setState((state) => ({
      routeLeaveCtxValue: { ...state.routeLeaveCtxValue, id: null, _intermediaryConfirm: null, nextRoute: null },
    }));
  },
  _routeLeaveCtxAllowed(id, allowedAll) {
    this.setState((state) => {
      if (!state.routeLeaveCtxValue.id || (!allowedAll && id !== state.routeLeaveCtxValue.id)) return;
      return {
        routeLeaveCtxValue: { ...state.routeLeaveCtxValue, id: null, _intermediaryConfirm: null, nextRoute: null },
      };
    });
  },
  //@@viewOff:private

  //@@viewOn:render
  render() {
    let result = this._buildChild();
    if (RouteLeaveContext) {
      result = <RouteLeaveContext.Provider value={this.state.routeLeaveCtxValue}>{result}</RouteLeaveContext.Provider>;
    }
    return result;
  },
  //@@viewOff:render
});

export default Router;
