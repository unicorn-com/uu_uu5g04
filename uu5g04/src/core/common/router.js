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

import React from 'react';
import createReactClass from 'create-react-class';
import ns from "./common-ns.js";
import PropTypes from 'prop-types';
import Tools from './tools.js';
import Environment from '../environment/environment.js';
import BaseMixin from './base-mixin.js';
import ElementaryMixin from './elementary-mixin.js';
import CcrWriterMixin from './ccr-writer-mixin.js';
import Url from './url.js';
import PureRenderMixin from "./pure-render-mixin";
import Uu5CommonError from "./error.js";

import './router.less';

const REACT_LAZY_TYPEOF = React.lazy && React.lazy(() => ({ default: props => "" })).$$typeof;

export const Router = createReactClass({

  //@@viewOn:mixins
  mixins: [
    BaseMixin,
    ElementaryMixin,
    CcrWriterMixin,
    PureRenderMixin
  ],
  //@@viewOff:mixins

  //@@viewOn:statics
  statics: {
    tagName: ns.name("Router"),
    opt: {
      ccrKey: Environment.CCRKEY_ROUTER
    },
    classNames: {
      leaveConfirmationModal: ns.css("router-leave-confirmation-modal"),
      leaveConfirmationBody: ns.css("router-leave-confirmation-body"),
      leaveConfirmationFooter: ns.css("router-leave-confirmation-footer"),
      leaveConfirmationButtonConfirm: ns.css("router-leave-confirmation-button-confirm"),
      leaveConfirmationButtonDeny: ns.css("router-leave-confirmation-button-deny")
    },
    lsi: () => (Environment.Lsi.Common.router),
    getDerivedStateFromError(error) {
      return { routeError: error };
    }
  },
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {
    basePath: PropTypes.string,
    route: PropTypes.oneOfType([PropTypes.string, // path
      PropTypes.element, PropTypes.shape({
        tag: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
        props: PropTypes.object,
        source: PropTypes.string
      })]),
    notFoundRoute: PropTypes.oneOfType([PropTypes.string, // path
      PropTypes.element, PropTypes.shape({
        tag: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
        props: PropTypes.object
      })]),
    showNotFoundRouteInUrl: PropTypes.bool,
    routes: PropTypes.object,
    urlBuilder: PropTypes.func,
    strictRoutes: PropTypes.bool,
    loading: PropTypes.node
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
      loading: ""
    };
  },
  //@@viewOff:getDefaultProps

  //@@viewOn:standardComponentLifeCycle
  getInitialState() {
    Environment.router = this;
    this._history = [];
    this._routeIndex = null;
    this._displayLeaveConfirmation = false;
    this._getPageLeaveModalProps = null;

    return {
      route: null,
      routeError: null,
      requestedRoute: null // info about requested route for cases when it's invalid (wrong component tag / ...)
    };
  },

  componentWillMount() {
    if (window.location.pathname && this.props.routes && (typeof this.props.route === 'string' || this.props.route === undefined)) {
      let path = window.location.pathname;
      let basePath = this._getBasePath(path, this.props);
      basePath && (path = path.replace(basePath, ''));

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

  componentWillReceiveProps(nextProps) {
    if (nextProps.controlled) {
      this._setRoute(nextProps.route, null, nextProps);
    }
  },

  componentDidMount() {
    if (this._shouldImport(this.props.route)) {
      this._importRoute(this.props.route);
    }

    window.onpopstate = this._onWindowPopState;
    window.addEventListener("scroll", this._onWindowScroll);
    this.scrollToFragment();
  },

  componentDidUpdate() {
    this.scrollToFragment();

    // flag below solves this scenario:
    // 1. user is scrolled down
    // 2. user changes route to a new one which contains fragment; new route is using LoadMixin / doing some async stuff before rendering
    // 3. browser triggers scroll event towards top (new route doesn't yet have content and we were scrolled down)
    // 4. we don't want the scroll event to be considered as a user action, i.e. after new route loads, we still want to scroll to new fragment
    // => remember this situation with a timed flag and use it in _onWindowScroll for skipping fragment removal
    this._isScrollDueToRender = true;
    setTimeout(() => this._isScrollDueToRender = false, 50);
  },

  componentWillUnmount() {
    window.removeEventListener("scroll", this._onWindowScroll);
    Environment.EventListener.unregisterBeforeUnload();
  },
  //@@viewOff:standardComponentLifeCycle

  //@@viewOn:interface
  // newRoute =
  //   {component, noHistory, url, notFoundRoute: {} || < />, tag, props, source}
  //   "route name" ||
  //   {useCase, params, config} ||     (used only from goTo methods)
  //   @deprecated   <Node ... />
  // params =
  //   a) {url, noHistory, title}  if newRoute is <Node ... />
  //   b) {...}   if newRoute is "route name" (will be used as prop "params" for the component)
  setRoute(newRoute, /* params?, fragment?, setStateCallback? */ ...args) {
    let setStateCallback = typeof args[args.length - 1] === "function" ? args.pop() : undefined; // always last
    let params = args.shift();
    let fragment = args.shift();
    if (this._shouldImport(newRoute)) {
      this._importRoute(newRoute, params, setStateCallback);
    } else {
      this._setRoute(newRoute, params, null, fragment, setStateCallback);
    }
    return this;
  },

  allowPageLeave() {
    this._displayLeaveConfirmation = false;
    Environment.EventListener.unregisterBeforeUnload();
  },

  preventPageLeave(getPageLeaveModalPropsFn) {
    this._displayLeaveConfirmation = true;
    this._getPageLeaveModalProps = getPageLeaveModalPropsFn;
    Environment.EventListener.registerBeforeUnload();
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

  //@@viewOn:overridingMethods
  //@@viewOff:overridingMethods

  //@@viewOn:componentSpecificHelpers
  _getBasePath(path, props) {
    let result;
    if (props.basePath === null) {
      result = Environment.getAppBasePath();
      if (result === null) {
        path = path || window.location.pathname;
        result = (path ? path.replace(/(\/.*?\/.*?)\/.*/, "$1") : '');
      }
    } else {
      result = props.basePath;
    }
    if (result && result[result.length - 1] === "/") result = result.substr(0, result.length - 1);
    if (result && result[0] !== "/") result = "/" + result;
    return result;
  },

  _shouldImport(route) {
    return route && typeof route === 'object' && route.tag && !Tools.findComponent(route.tag, true);
  },

  _importRoute(route, params, setStateCallback) {
    if (window.SystemJS && window.SystemJS.import) {
      if (route.source) {
        SystemJS.import(route.source).then(exports => {
          let tagArray = route.tag.split('.');
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
        }, error => {
          Tools.error('Loading package "' + route.source + '" failed with error:', {
            error: error,
            tagName: this.constructor.tagName
          });
        });
      } else {
        Tools.error('Route was not found and has not set any source to import.', {
          route: route,
          tagName: this.constructor.tagName
        });
        this._setRoute(route.notFoundRoute, { requestedRoute: route });
      }
    } else {
      Tools.error('SystemJS is not defined in window! Cannot import source:', {
        source: route.source,
        tagName: this.constructor.tagName
      });
    }
    return this;
  },

  _setRoute(newRoute, params, props, frag, setStateCallback) {
    props = props || this.props;
    let { route, fragment, applyRouteFn } = this._buildRoute(newRoute, params, null, props, frag, null, null, setStateCallback);
    this._pendingFragmentToScrollTo = fragment;
    this._showPageLeaveConfirmation(() => {
      let applyToState = (typeof applyRouteFn !== "function" || applyRouteFn());
      applyToState && this.setState({ route: route, requestedRoute: newRoute, routeError: null }, setStateCallback);
    });
    return this;
  },

  _showPageLeaveConfirmation(continueWithPageLeaveCallback) {
    if (this._displayLeaveConfirmation) {
      let processed = false;
      let customModalProps = {};
      let processResultFn = (confirmed) => {
        if (!processed) { // process only first call of this method
          processed = true;
          if (confirmed) {
            this.allowPageLeave();
            continueWithPageLeaveCallback();
          }
          if (this._pageLeaveModal && customModalProps) this._pageLeaveModal.close();
        }
      };

      if (this._pageLeaveModal) {
        customModalProps = typeof this._getPageLeaveModalProps === "function"
          ? this._getPageLeaveModalProps(processResultFn) : {};

        if (customModalProps !== false) {
          let modalProps = Object.assign(
            this._getPageLeaveModalDefaultProps(processResultFn),
            customModalProps
          );
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

  _getPageLeaveModalDefaultProps(callback) {
    let UU5 = window.UU5; // assume that other bricks are available too (we already rendered UU5.Bricks.Modal)
    return {
      header: this.getLsiComponent("pageLeaveConfirmationHeader"),
      className: this.getClassName("leaveConfirmationModal"),
      onClose: (opt) => {
        opt.component._close(); // .closeDefault()
        callback(false);
      },
      content: [
        <UU5.Bricks.Div className={this.getClassName("leaveConfirmationBody")} key="body"
                        content={this.getLsiComponent("pageLeaveConfirmationBody")} />,
        <UU5.Bricks.Div className={this.getClassName("leaveConfirmationFooter")} key="footer">
          <UU5.Bricks.Button className={this.getClassName("leaveConfirmationButtonConfirm")}
                             onClick={() => callback(true)} content={this.getLsiComponent("pageLeaveConfirm")} />
          <UU5.Bricks.Button className={this.getClassName("leaveConfirmationButtonDeny")}
                             onClick={() => callback(false)} content={this.getLsiComponent("pageLeaveDeny")} />
        </UU5.Bricks.Div>
      ]
    };
  },

  _getRouteByPath(searchedPath, props) {
    let route = props.routes[searchedPath];
    if (route === undefined) {
      if (!props.strictRoutes) route = props.routes[searchedPath.replace(/\/?$/, m => m ? "" : "/")];
      if (route === undefined) {
        // prepend with "/" for backward compatibility
        route = props.routes["/" + searchedPath];
        if (route === undefined) {
          if (!props.strictRoutes) route = props.routes[searchedPath.replace(/\/?$/, m => m ? "" : "/")];
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
      if (typeof route === "string") { // rewrite
        if (useCase == null) useCase = nextPath;
        nextPath = route;
      } else if (route && route.url && route.url.useCase != null) { // redirect
        config = Object.assign({}, route, config);
        nextPath = route.url.useCase;
      } else if (route) { // normal config
        config = Object.assign({}, route, config);
        if (useCase == null) {
          useCase = nextPath;
          config.url = route.url; // URL is taken from the final path (after all redirects)
        } else { // there was a rewrite => clear explicit url
          delete config.url;
        }
        nextPath = null;
      } else { // missing route
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
            let applyToState = (typeof applyRouteFn !== "function" || applyRouteFn());
            applyToState && this.setState({ route: route, requestedRoute: newRoute, routeError: null });
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
    let url = document.location.origin + (this._getBasePath(null, props) || '') + "/" + route;
    params && (url += Tools.encodeQuery(params));
    fragment && (url += "#" + fragment);
    return url;
  },

  _buildComponent(newRoute, params) {
    let newRouteChild;

    if (newRoute && typeof newRoute === 'object') {
      let newProps = {
        parent: this.getParent()
      };

      params && (newProps.params = params);

      if (newRoute.tag) {
        let tag = Tools.checkTag(newRoute.tag, true);
        let props = Tools.merge({}, newRoute.props, newProps);
        newRouteChild = tag ? React.createElement(tag, props) : Tools.findComponent(newRoute.tag, props);
      } else {
        newRouteChild = React.cloneElement(newRoute, newProps);
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
      let useCase, config;
      if (route && typeof route === "object" && "config" in route) {
        params = route.params;
        usedFragment = route.fragment;
        useCase = route.useCase;
        config = route.config;
        if ("isFromHistory" in route) {
          isFromHistory = route.isFromHistory;
          delete route.isFromHistory;
        }
        route = ("component" in route ? route.component : route.useCase);
        if (ignoreGoTo == null) ignoreGoTo = true;
      }

      let newRoute = route;
      if (typeof route === 'string' && this.props.routes) {
        if (useCase === undefined) {
          if (route[0] === "/") route = route.substr(1);
          let routeInfo = this._getRouteAfterRewritesAndRedirects(route, props);
          if (routeInfo) ({ useCase, config } = routeInfo);
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
            let result = true;
            // if a route descriptor in "routes" props contains goTo method, pass resolved route there
            // and don't do anything with router state (the goTo method is supposed to call
            // router.setRoute(newRoute) by itself)
            if (config && typeof config.goTo === 'function' && !ignoreGoTo) {
              result = false;
              let oldHistoryEntry = this._history[this._routeIndex || 0];
              let oldRoute = oldHistoryEntry && Object.assign({}, oldHistoryEntry, { config: Tools.mergeDeep({}, oldHistoryEntry.config) }); // prevent modification of config
              let newRoute = {
                useCase: useCase,
                params: params,
                config: Tools.mergeDeep({}, config),
                fragment: usedFragment,
                isFromHistory: isFromHistory
              };
              config.goTo(oldRoute, newRoute, setStateCallback);
            } else if (!isFromHistory) {
              let method = 'replaceState';
              if (this._routeIndex === null) {
                this._routeIndex = 0;
                this._history.push({ useCase, params, config, fragment: usedFragment });
              } else if (!replace) {
                let leavingRoute = this._history[this._routeIndex];
                let leavingFromNoHistory = leavingRoute && leavingRoute.config && leavingRoute.config.noHistory;
                if (!leavingFromNoHistory) {
                  this._routeIndex++;
                  method = 'pushState';
                }
                this._history.splice(this._routeIndex, this._history.length - 1);
                this._history.push({ useCase, params, config, fragment: usedFragment });
              }

              // console.log(method, route, this._routeIndex, this._history);
              try {
                history[method]({
                  path: route,
                  index: this._routeIndex
                }, document.title, this._getUrl(useCase, params, props, usedFragment));
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
        let method = 'replaceState';

        if (params.url && typeof params.url === 'object') {
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
                .set(Tools.merge(urlParts, params.url)).toString();
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
            // NOTE _history entries with components have for some reasons different data than the ones
            // handled via routes map. We need config object with noHistory there so let's add it.
            let config = { noHistory: params.noHistory };
            if (this._routeIndex === null) {
              this._routeIndex = 0;
              this._history.push({ path: path, component: foundRoute, fragment: usedFragment, config });
            } else if (!replace) {
              let leavingRoute = this._history[this._routeIndex];
              let leavingFromNoHistory = leavingRoute && leavingRoute.config && leavingRoute.config.noHistory;
              if (!leavingFromNoHistory) {
                this._routeIndex++;
                method = 'pushState';
              }
              this._history.splice(this._routeIndex, this._history.length - 1);
              this._history.push({ path: path, component: foundRoute, fragment: usedFragment, config });
            }

            try {
              history[method]({
                path: path,
                index: this._routeIndex
              }, params.title || document.title, path + (usedFragment ? "#" + usedFragment : ""));
            } catch (e) {
              if (!(window.frameElement && e instanceof DOMException)) throw e; // cannot do replace/pushState when in <iframe srcdoc="&lt;html..." (ends with DOMException so ignore it), e.g. in BookKit examples
            }
            return true;
          };

          newRoute = foundRoute;
        }
      }

      newRouteChild = this._buildComponent(newRoute, params);
    }

    if (newRouteChild && (!newRouteChild.type || (!newRouteChild.type["UU5.Common.VucMixin"] && !newRouteChild.type["UU5.Common.RouteMixin"] && newRouteChild.type.$$typeof !== REACT_LAZY_TYPEOF))) {
      Tools.error('Route component which should be set is not Visual Use Case.', {
        routeParam: route,
        routeChild: newRouteChild,
        tagName: this.constructor.tagName
      });
    }

    return {
      route: newRouteChild,
      fragment: usedFragment,
      applyRouteFn
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
      Tools.error(this.constructor.tagName, 'Router has no content.');
    }
    if (REACT_LAZY_TYPEOF && children[0] && children[0].type && children[0].type.$$typeof === REACT_LAZY_TYPEOF && this.props.loading !== null) {
      children[0] = <React.Suspense fallback={this.props.loading}>{children[0]}</React.Suspense>;
    }

    let PortalModal = Tools.checkTag("UU5.Bricks.PortalModal", true);
    if (PortalModal) children.push(<PortalModal ref_={modal => this._pageLeaveModal = modal} />);

    return React.Fragment ? (
      <React.Fragment>{React.Children.toArray(children)}</React.Fragment>
    ) : (
      React.Children.toArray(children)
    );
  },

  _onWindowScroll(e) {
    // if user scrolls at any time then just remove info about fragment to scroll to
    // (we don't want to re-scroll elsewhere if user scrolled somewhere)
    if (!this._isScrollDueToRender) delete this._pendingFragmentToScrollTo;
  },
  //@@viewOff:componentSpecificHelpers

  //@@viewOn:render
  render() {
    return this._buildChild();
  }
  //@@viewOff:render
});

export default Router;
