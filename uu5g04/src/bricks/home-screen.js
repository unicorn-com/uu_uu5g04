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
import * as UU5 from "uu5g04";
import ns from "./bricks-ns.js";
import { Div } from "./factory.js";
import { P } from "./factory.js";
import Icon from "./icon.js";

import "./home-screen.less";
//@@viewOff:imports

export const HomeScreen = UU5.Common.LsiMixin.withContext(
  UU5.Common.VisualComponent.create({
    displayName: "HomeScreen", // for backward compatibility (test snapshots)
    //@@viewOn:mixins
    mixins: [
      UU5.Common.BaseMixin,
      UU5.Common.PureRenderMixin,
      UU5.Common.ElementaryMixin,
      UU5.Common.LsiMixin,
      UU5.Common.NestingLevelMixin
    ],
    //@@viewOff:mixins

    //@@viewOn:statics
    statics: {
      tagName: ns.name("HomeScreen"),
      nestingLevelList: UU5.Environment.getNestingLevelList("bigBoxCollection", "box"),
      classNames: {
        main: ns.css("home-screen")
      },
      defaults: {
        reSmartURL: /\/ath(\/)?$/,
        reQueryString: /([\?&]ath=[^&]*$|&ath=[^&]*(&))/,
        lsi: () => UU5.Environment.Lsi.Bricks.homeScreen,
        defaultSession: {
          lastDisplayTime: 0, // last time we displayed the message
          returningVisitor: false, // is this the first time you visit
          displayCount: 0, // number of times the message has been shown
          //optedout: false, // has the user opted out
          added: false // has been actually added to the homescreen
        },
        regexpIcon: /%icon(?:\[([^\]]+)\])?/gi,
        regexpSlash: /(\/)?$/
      },
      opt: {
        nestingLevelRoot: true
      }
    },
    //@@viewOff:statics

    //@@viewOn:propTypes
    propTypes: {
      appID: UU5.PropTypes.string, // local storage name
      skipFirstVisit: UU5.PropTypes.bool, // show only to returning visitors (ie: skip the first time you visit)
      startDelay: UU5.PropTypes.number, // display the message after that many seconds from page load
      lifespan: UU5.PropTypes.number, // life of the message in seconds
      displayPace: UU5.PropTypes.number, // minutes before the message is shown again (0: display every time, default 24 hours)
      maxDisplayCount: UU5.PropTypes.number, // absolute maximum number of times the message will be shown to the user (0: no limit)
      message: UU5.PropTypes.any, // the message can be customized
      detectHomescreen: UU5.PropTypes.oneOf(["hash", "query", "smart", false]) // try to detect if the site has been added to the homescreen (false | true | 'hash' | 'queryString' | 'smartURL')
    },
    //@@viewOff:propTypes

    //@@viewOn:getDefaultProps
    getDefaultProps: function() {
      return {
        appID: "uu5.homescreen",
        skipFirstVisit: false,
        startDelay: 1000,
        lifespan: 5000,
        displayPace: 1440,
        maxDisplayCount: 0,
        message: "",
        detectHomescreen: "hash"
        // autostart: true,			// show the message automatically
        // debug: false,				// override browser checks
        // logging: false,				// log reasons for showing or not showing to js console; defaults to true when debug is true
        // modal: false,				// prevent further actions until the message is closed
        // mandatory: false,			// you can't proceed if you don't add the app to the homescreen
        // icon: true,					// add touch icon to the message
        // validLocation: [],			// list of pages where the message will be shown (array of regexes)
        // onInit: null,				// executed on instance creation
        // onShow: null,				// executed when the message is shown
        // onRemove: null,				// executed when the message is removed
        // onAdd: null,				// when the application is launched the first time from the homescreen (guesstimate)
        // onPrivate: null,			// executed if user is in private mode
        // privateModeOverride: false,	// show the message even in private mode (very rude)
      };
    },
    //@@viewOff:getDefaultProps

    //@@viewOn:reactLifeCycle
    getInitialState: function() {
      return {
        receiveProps: false
      };
    },

    componentWillMount: function() {
      this.hide();
    },

    componentDidMount: function() {
      var homeScreen = this;
      if (!this.props.hidden) {
        setTimeout(
          function() {
            homeScreen.activate();
          },
          this.props.startDelay < 0 ? 1 : this.props.startDelay
        );
      }
    },

    componentWillReceiveProps: function(nextProps) {
      // cannot set visibility by receive props
      this.setState({ hidden: this.isHidden() });
    },

    componentWillUnmount: function() {
      this.hiddenTimeout && clearTimeout(this.hiddenTimeout);
    },

    //@@viewOff:reactLifeCycle

    //@@viewOn:interface
    activate: function(setStateCallback) {
      var shouldRender = this._shouldRender();
      // console.error("activate", shouldRender);
      if (shouldRender) {
        var homeScreen = this;

        this.setHiddenValue(false, function() {
          homeScreen.hiddenTimeout && clearTimeout(homeScreen.hiddenTimeout);
          homeScreen.hiddenTimeout = setTimeout(function() {
            homeScreen.hide(setStateCallback);
          }, homeScreen.props.lifespan);
        });
      }
      return this;
    },
    //@@viewOff:interface

    //@@viewOn:overriding
    //@@viewOff:overriding

    //@@viewOn:private
    _hasToken: function() {
      // console.error("_hasToken", document.location.hash === '#ath', this.getDefault().reSmartURL.test(document.location.href), this.getDefault().reQueryString.test(document.location.search))
      return (
        document.location.hash === "#ath" ||
        this.getDefault().reSmartURL.test(document.location.href) ||
        this.getDefault().reQueryString.test(document.location.search)
      );
    },

    _isCompatibleEnvironment: function() {
      return (
        (UU5.Common.Tools.isSafari() && UU5.Common.Tools.getMobileOSVersion() >= 6) ||
        UU5.Common.Tools.isAndroidChrome()
      );
    },

    _isStandAloneMode: function() {
      return !!window.navigator.standalone;
    },

    _getBrowserLanguage: function() {
      return window.navigator.language ? window.navigator.language.toLowerCase() : "en";
    },

    _shouldRender: function() {
      var shouldRender = false;

      // load session
      var session = this._getAppSession();

      // user most likely came from a direct link containing our token, we don't need it and we remove it
      if (this._hasToken() && (!this._isCompatibleEnvironment() || (!session && !this.props.detectHomescreen))) {
        this._removeToken();
      }

      // the device is supported
      if (this._isCompatibleEnvironment()) {
        session = session || this.getDefault().defaultSession;
        this._setAppSession(session);

        var now = Date.now();
        if (this._checkSession(session) && this._checkShowing(session, now)) {
          this._incrementDisplayCount(session, now);
          shouldRender = true;
        }
      }

      return shouldRender;
    },

    _checkSession: function(session) {
      // if is added at homescreen
      if (session.added) {
        return false;
      }

      // check if the app is in stand alone mode
      if (this._isStandAloneMode()) {
        session.added = true;
        this._setAppSession(session);
        return false;
      }

      // (try to) check if the page has been added to the homescreen
      if (this.props.detectHomescreen) {
        // the URL has the token, we are likely coming from the homescreen
        if (this._hasToken()) {
          this._removeToken(); // we don't actually need the token anymore, we remove it to prevent redistribution

          // this is called the first time the user opens the app from the homescreen
          session.added = true;
          this._setAppSession(session);
          return false;
        }

        // URL doesn't have the token, so add it
        this._addToken();
      }

      // check if this is a returning visitor
      if (!session.returningVisitor) {
        session.returningVisitor = true;
        this._setAppSession(session);

        // we do not show the message if this is your first visit
        if (this.props.skipFirstVisit) {
          return false;
        }
      }

      return true;
    },

    _getSession: function(item) {
      var session;
      if (localStorage) {
        session = localStorage.getItem(item);
        session && (session = JSON.parse(session));
      }
      return session || null;
    },

    _setSession: function(item, session) {
      localStorage && localStorage.setItem(item, JSON.stringify(session));
      return this;
    },

    _getAppSession: function() {
      return this._getSession(this.props.appID);
    },

    _setAppSession: function(session) {
      this._setSession(this.props.appID, session);
      return this;
    },

    _addToken: function() {
      // console.error("add token", this.props.detectHomescreen == 'hash');
      if (this.props.detectHomescreen == "hash") {
        document.location.hash !== "#ath" &&
          history.replaceState("", window.document.title, document.location.href + "#ath");
      } else if (this.props.detectHomescreen == "smart") {
        history.replaceState(
          "",
          window.document.title,
          document.location.href.replace(this.getDefault().regexpSlash, "/ath$1")
        );
      } else {
        history.replaceState(
          "",
          window.document.title,
          document.location.href + (document.location.search ? "&" : "?") + "ath="
        );
      }
      return this;
    },

    _removeToken: function() {
      if (document.location.hash == "#ath") {
        history.replaceState("", window.document.title, document.location.href.split("#")[0]);
      }

      if (this.getDefault().reSmartURL.test(document.location.href)) {
        history.replaceState(
          "",
          window.document.title,
          document.location.href.replace(this.getDefault().reSmartURL, "$1")
        );
      }

      if (this.getDefault().reQueryString.test(document.location.search)) {
        history.replaceState(
          "",
          window.document.title,
          document.location.href.replace(this.getDefault().reQueryString, "$2")
        );
      }

      return this;
    },

    _checkShowing: function(session, date) {
      var lastDisplayTime = session.lastDisplayTime;

      // we obey the display pace (prevent the message to popup too often)
      var showing = date - lastDisplayTime > this.props.displayPace * 60000;

      // obey the maximum number of display count
      showing = showing && (this.props.maxDisplayCount === 0 || session.displayCount < this.props.maxDisplayCount);

      return showing;
    },

    _incrementDisplayCount: function(session, date) {
      // increment the display count
      session.lastDisplayTime = date;
      session.displayCount++;
      this._setAppSession(session);
      return this;
    },

    _getMessage: function() {
      // var languages = UU5.Common.Tools.sortLanguages(this._getBrowserLanguage());
      var message;
      var messages;

      if (this.props.message) {
        if (typeof this.props.message === "object") {
          message = this.props.message[UU5.Common.Tools.getMobileOS()];
          if (!message) {
            messages = this.getLsiItem(this.props.message);
          }
        } else {
          message = this.props.message;
        }
      } else {
        let lsi = this.getDefault().lsi();
        messages = this.getLsiItem(lsi);
      }

      messages && (message = messages[UU5.Common.Tools.getMobileOS()]);

      message =
        message &&
        message.replace(this.getDefault().regexpIcon, function(matches, group1) {
          return '<span className="ath-action-icon">' + (!!group1 ? group1 : "icon") + "</span>";
        });

      return message;
    },
    //@@viewOff:private

    //@@viewOn:render
    render: function() {
      let message = this._getMessage();

      let visibility = this.isHidden() ? " uu5-bricks-home-screen-hidden" : " uu5-bricks-home-screen-shown";
      // console.log('render', visibility);

      let containerProps = {
        className:
          "ath-container ath-" +
          UU5.Common.Tools.getMobileOS() +
          " ath-" +
          UU5.Common.Tools.getMobileOS() +
          (parseInt(UU5.Common.Tools.getMobileOSVersion()) || "") +
          " ath-" +
          (UU5.Common.Tools.isTablet() ? "tablet" : "phone") +
          visibility
      };

      return (
        <Div className="ath-viewport" nestingLevel={this.getNestingLevel()}>
          <div {...containerProps}>
            <div key="1" onClick={() => this.hide()}>
              <Icon icon="mdi-close" />
            </div>
            <P key="2" content={message} />
          </div>
        </Div>
      );
    }
    //@@viewOff:render
  })
);

export default HomeScreen;
