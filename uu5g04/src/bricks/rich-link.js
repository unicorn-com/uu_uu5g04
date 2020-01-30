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
import Css from "./internal/css.js";
import Link from "./link.js";
import Image from "./image.js";
import Icon from "./icon.js";
//@@viewOff:imports

export const RichLink = UU5.Common.VisualComponent.create({
  //@@viewOn:mixins
  mixins: [UU5.Common.BaseMixin],
  //@@viewOff:mixins

  //@@viewOn:statics
  statics: {
    tagName: ns.name("RichLink"),
    nestingLevelList: UU5.Environment.getNestingLevelList("bigBoxCollection", "inline"),
    classNames: {
      main: () => {
        let className = Css.css`
          display: inline-block;
          width: 300px;
          background: ${UU5.Environment.colors.grey.c100};
          border-radius: 16px;
          overflow: hidden;
          vertical-align: top;
          text-decoration: none;
          &:hover {
            text-decoration: none;
          }
        `;
        return ns.css("richlink") + " " + className;
      },
      image: () => Css.css`display: flex; height: 150px; justify-content: center; align-items: center;`,
      imageImg: () => Css.css`object-fit: cover; width: 100%; height: 100%;`,
      imageIcon: Css.css`color: ${UU5.Environment.colors.grey.c500}; font-size: 64px;`,
      container: () => Css.css`
        display: block;
        padding: 8px;
        color: ${UU5.Environment.colors.black.c800};
        font-size: 14px;
        &>*:first-child { margin-top: 0 }`,
      title: () => Css.css`
        display: block;
        font-size: 16px;
        font-weight: bold;
        color: ${UU5.Environment.colors.black.c900}`,
      description: () => Css.css`display: block; margin-top: 8px;`,
      favicon: () => Css.css`vertical-align: -3px;`,
      href: () => Css.css`
        display: block;
        margin-top: 8px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;`
    },
    opt: {
      hoc: true
    },
    cache: {}
  },
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {
    ...Link.propTypes,
    type: UU5.PropTypes.oneOf(["simple", "full"])
  },
  //@@viewOff:propTypes

  //@@viewOn:getDefaultProps
  getDefaultProps() {
    return {
      type: "full",
      target: "_blank"
    };
  },
  //@@viewOff:getDefaultProps

  //@@viewOn:reactLifeCycle
  getInitialState() {
    return this._prepareLinkData({});
  },

  componentWillReceiveProps(nextProps) {
    if (nextProps.href !== this.props.href) {
      this.setState(state => this._prepareLinkData(state, nextProps));
    }
  },
  //@@viewOff:reactLifeCycle

  //@@viewOn:interface
  //@@viewOff:interface

  //@@viewOn:overriding
  //@@viewOff:overriding

  //@@viewOn:private
  _prepareLinkData(state = this.state, props = this.props) {
    let resultState;
    if (state.linkData === undefined || state.loadedForHref !== props.href) {
      if (typeof props.href === "string" && props.href.match(/^https?:/)) {
        let { cache } = this.constructor;
        let cacheKey = props.href;
        let { linkData, promise } = cache[cacheKey] || {};

        if (linkData === undefined && !promise) {
          promise = this._fetchHtml(props.href);
          cache[cacheKey] = { promise };
        }
        this._fetchPromise = promise;
        if (linkData === undefined) {
          promise.then(
            response => {
              let linkData = (cache[cacheKey].linkData =
                this._extractLinkData(response && response.data, props.href) || null);
              if (promise === this._fetchPromise) {
                this.setAsyncState({ linkData, loading: false });
              }
            },
            error => promise === this._fetchPromise && this.setAsyncState({ linkData: null, loading: false })
          );
          resultState = { loading: true, loadedForHref: props.href, linkData: null };
        } else {
          resultState = { loading: false, loadedForHref: props.href, linkData };
        }
      } else {
        resultState = { loading: false, loadedForHref: props.href, linkData: null };
      }
    }
    return resultState;
  },

  _fetchHtml(url) {
    return UU5.Common.Request.get(url, null, {
      headers: { Accept: "text/html;q=0.9,text/*;q=0.8,*/*;q=0.5", "Content-Type": "application/x-www-form-urlencoded" }
    });
  },

  _extractLinkData(html, href) {
    let result = null;
    if (html && typeof html === "string") {
      let metasAndLinks = [];
      html.replace(/<(?:meta|link)\s+[^>]*>/g, m => {
        if (m.indexOf('\\"') !== -1) {
          // due to UVEs being mostly static files with client-side routing, favicons are actually computed
          // and then written into DOM => try to parse it from the usual way of how it is written
          // NOTE We're not able to find out baseUri of uu5-app reliable as it could be aliased...
          m = m.replace(/" \+ appBaseUrlPath \+ appAssetsRelativeUrlPath \+ "/, () => {
            let parts = href.split("/");
            // check whether the URI looks like canonical uu5-app URI; if not then guess the root
            if (parts[3] && parts[3].indexOf("-") !== -1) {
              if (parts[4] && parts[4].match(/^[a-z0-9-]*$/i)) return parts.slice(0, 5).join("/") + "/public/"; // looks canonical
              return parts.slice(0, 4).join("/") + "/public/";
            }
            return parts.slice(0, 3).join("/") + "/public/";
          });
          try {
            m = JSON.parse('"' + m + '"');
          } catch (e) {} // eslint-disable-line no-empty
        }
        metasAndLinks.push(m);
      });

      let domFragment = new DOMParser().parseFromString(metasAndLinks.join("\n"), "text/html");
      let getContent = (...selectors) => {
        for (let selector of selectors) {
          let value = domFragment.querySelector(selector);
          if (value) return value.tagName === "META" ? value.content : value.href;
        }
      };
      let image = getContent('meta[property="og:image"]', 'meta[name="twitter:image"]', 'meta[itemprop="image"]');
      let title = getContent('meta[property="og:title"]', 'meta[name="twitter:title"]', 'meta[itemprop="title"]');
      let description = getContent(
        'meta[property="og:description"]',
        'meta[name="twitter:description"]',
        'meta[itemprop="description"]'
      );
      let favicon = getContent('link[rel="icon"]', 'link[rel="shortcut icon"]');
      if (!favicon) favicon = href.replace(/^(https?:\/\/[^/]*).*/, (m, g) => g + "/favicon.ico");
      result = { image, title, description, favicon };
    }
    return result;
  },

  _onImageError(e) {
    this.setState(state => {
      let result;
      if (state.loadedForHref === this.props.href) {
        result = { linkData: { ...state.linkData, image: null } };
      }
      return result;
    });
  },

  _onFaviconError(e) {
    this.setState(state => {
      let result;
      if (state.loadedForHref === this.props.href) {
        result = { linkData: { ...state.linkData, favicon: null } };
      }
      return result;
    });
  },
  //@@viewOff:private

  //@@viewOn:render
  render() {
    let { linkData } = this.state;
    let { type, href, content, tooltip, ...restProps } = this.props;
    let { image, title, description, favicon } = linkData || {};

    return (
      <Link {...restProps} {...this.getMainPropsToPass()} href={href} tooltip={tooltip != null ? tooltip : href}>
        {linkData && type === "full" ? (
          <span className={this.getClassName("image")}>
            {image ? (
              <Image
                src={image}
                className={this.getClassName("imageImg")}
                mainAttrs={{ onError: this._onImageError }}
                responsive={false}
              />
            ) : (
              <Icon icon="mdi-web" className={this.getClassName("imageIcon")} />
            )}
          </span>
        ) : null}
        <span className={this.getClassName("container")}>
          {title && <span className={this.getClassName("title")}>{title}</span>}
          {description && <span className={this.getClassName("description")}>{description}</span>}
          <span className={this.getClassName("href")}>
            {favicon
              ? [
                  <Image
                    key="favicon"
                    src={favicon}
                    className={this.getClassName("favicon")}
                    height={16}
                    width={16}
                    responsive={false}
                    mainAttrs={{ onError: this._onFaviconError }}
                  />,
                  " "
                ]
              : null}
            {href}
          </span>
        </span>
      </Link>
    );
  }
  //@@viewOff:render
});

export default RichLink;
