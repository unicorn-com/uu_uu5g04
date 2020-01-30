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

import React from "react";
import PropTypes from "prop-types";
import ContentMixin from "./content-mixin.js";
import { LevelMixin, MIXINS_WITH_LEVEL_MIXIN } from "./level-mixin.js";
import Tools from "./tools.js";

export const SectionMixin = {
  //@@viewOn:mixins
  mixins: [ContentMixin, LevelMixin],
  //@@viewOff:mixins

  //@@viewOn:statics
  statics: {
    "UU5.Common.SectionMixin": {
      requiredMixins: ["UU5.Common.BaseMixin", "UU5.Common.ContentMixin", "UU5.Common.LevelMixin"],
      defaults: {
        headerTag: "UU5.Bricks.Header",
        footerTag: "UU5.Bricks.Footer",
        regexpUu5Json: /(^<uu5json\/>)/
      }
    }
  },
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {
    header: PropTypes.oneOfType([
      // content body:[{tag:'',props:{}},{tag:'',props:{}},...]
      PropTypes.arrayOf(
        PropTypes.shape({
          tag: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
          props: PropTypes.object
        })
      ),
      // content bodyItem:{tag:'',props{}}
      PropTypes.shape({
        tag: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
        props: PropTypes.arrayOf(PropTypes.object)
      }),
      // content items:{tag:'',propsArray:[{},{},{},...]}
      PropTypes.shape({
        tag: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
        propsArray: PropTypes.arrayOf(PropTypes.object)
      }),
      // content node
      PropTypes.node,
      // element
      PropTypes.shape({
        element: PropTypes.oneOfType([
          PropTypes.element,
          PropTypes.shape({
            tag: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
            props: PropTypes.object
          })
        ])
      })
    ]),
    footer: PropTypes.oneOfType([
      // content body:[{tag:'',props:{}},{tag:'',props:{}},...]
      PropTypes.arrayOf(
        PropTypes.shape({
          tag: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
          props: PropTypes.object
        })
      ),
      // content bodyItem:{tag:'',props{}}
      PropTypes.shape({
        tag: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
        props: PropTypes.arrayOf(PropTypes.object)
      }),
      // content items:{tag:'',propsArray:[{},{},{},...]}
      PropTypes.shape({
        tag: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
        propsArray: PropTypes.arrayOf(PropTypes.object)
      }),
      // content node
      PropTypes.node,
      // element
      PropTypes.shape({
        element: PropTypes.oneOfType([
          PropTypes.element,
          PropTypes.shape({
            tag: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
            props: PropTypes.object
          })
        ])
      })
    ]),
    underline: PropTypes.bool
  },
  //@@viewOff:propTypes

  //@@viewOn:getDefaultProps
  getDefaultProps() {
    return {
      header: null,
      footer: null,
      underline: false
    };
  },
  //@@viewOff:getDefaultProps

  //@@viewOn:reactLifeCycle
  getInitialState() {
    // initialize
    this.registerMixin("UU5.Common.SectionMixin");
    this.renderedHeaderChild = null; // renderedChild
    this.renderedFooterChild = null; // renderedChild
    // state
    return null;
  },
  //@@viewOff:reactLifeCycle

  //@@viewOn:interface
  hasUU5CommonSectionMixin() {
    return this.hasMixin("UU5.Common.SectionMixin");
  },

  getHeader(props = this.props) {
    return typeof this.getHeader_ === "function" ? this.getHeader_(props) : this.getHeaderDefault(props);
  },

  getHeaderDefault(props = this.props) {
    return props.header;
  },

  getFooter(props = this.props) {
    return typeof this.getFooter_ === "function" ? this.getFooter_(props) : this.getFooterDefault(props);
  },

  getFooterDefault(props = this.props) {
    return props.footer;
  },

  getHeaderType(headerContent) {
    var type = null; // one of ['contentOfStandardHeader','headerElement','headerBodyItem']
    if (headerContent || headerContent === "") {
      if (typeof headerContent.element === "object") {
        type = headerContent.element.tag ? "headerBodyItem" : "headerElement";
      } else if (typeof headerContent === "string") {
        let match = this.getDefault("regexpUu5Json", "UU5.Common.SectionMixin").exec(headerContent);
        type = match ? "uu5JSON" : "contentOfStandardHeader";
      } else {
        type = "contentOfStandardHeader";
      }
    }
    return type;
  },

  getFooterType(footerContent) {
    var type = null; // one of ['contentOfStandardFooter','footerElement','footerBodyItem']
    if (footerContent || footerContent === "") {
      if (typeof footerContent.element === "object") {
        type = footerContent.element.tag ? "footerBodyItem" : "footerElement";
      } else if (typeof footerContent === "string") {
        let match = this.getDefault("regexpUu5Json", "UU5.Common.SectionMixin").exec(footerContent);
        type = match ? "uu5JSON" : "contentOfStandardFooter";
      } else {
        type = "contentOfStandardFooter";
      }
    }
    return type;
  },

  getUU5CommonSectionMixinProps() {
    return {
      header: this.getHeader(),
      footer: this.getFooter()
    };
  },

  getUU5CommonSectionMixinPropsToPass() {
    return Tools.mergeDeep(
      {},
      this.getUU5CommonSectionMixinProps(),
      this.getUU5CommonContentMixinPropsToPass(),
      this.getUU5CommonLevelMixinPropsToPass()
    );
  },

  registerRenderedHeaderChild(renderedHeaderChild) {
    if (renderedHeaderChild.hasUU5CommonBaseMixin) {
      this.renderedHeaderChild = renderedHeaderChild;
    }
    return this;
  },

  registerRenderedFooterChild(renderedFooterChild) {
    if (renderedFooterChild.hasUU5CommonBaseMixin) {
      this.renderedFooterChild = renderedFooterChild;
    }
    return this;
  },

  expandHeaderProps(prevHeaderChild, level) {
    var newHeaderChildProps = prevHeaderChild.props;
    newHeaderChildProps = Tools.mergeDeep({}, newHeaderChildProps);
    newHeaderChildProps.parent = this;
    newHeaderChildProps.id = newHeaderChildProps.id || this.getId() + "-header";
    newHeaderChildProps.underline = newHeaderChildProps.underline || this.props.underline;
    newHeaderChildProps.level = level;

    if (typeof this.expandHeaderProps_ === "function") {
      var tempHeaderChild = this.cloneChild(prevHeaderChild, newHeaderChildProps);
      newHeaderChildProps = this.expandHeaderProps_(tempHeaderChild);
    }

    newHeaderChildProps.key = newHeaderChildProps.id;

    newHeaderChildProps.ref = function(renderedChild) {
      renderedChild && this.registerRenderedHeaderChild(renderedChild);
    }.bind(this);

    return newHeaderChildProps;
  },

  expandFooterProps(prevFooterChild, level) {
    var newFooterChildProps = prevFooterChild.props;
    newFooterChildProps = Tools.mergeDeep({}, newFooterChildProps);
    newFooterChildProps.parent = this;
    newFooterChildProps.id = newFooterChildProps.id || this.getId() + "-footer";
    newFooterChildProps.level = level;

    if (typeof this.expandFooterProps_ === "function") {
      var tempFooterChild = this.cloneChild(prevFooterChild, newFooterChildProps);
      newFooterChildProps = this.expandFooterProps_(tempFooterChild);
    }

    newFooterChildProps.key = newFooterChildProps.id;

    newFooterChildProps.ref = function(renderedChild) {
      renderedChild && this.registerRenderedFooterChild(renderedChild);
    }.bind(this);

    return newFooterChildProps;
  },

  buildHeaderChild(header, level) {
    header = header || this.getHeader();

    var headerChild = null;

    if (typeof this.buildHeaderChild_ === "function") {
      headerChild = this.buildHeaderChild_(header, level);
    } else {
      headerChild = this.buildHeaderChildDefault(header, level);
    }
    return headerChild;
  },

  buildHeaderChildDefault(header, level) {
    header = header || this.getHeader();
    var headerChild = null;
    var headerValue = header;
    var headerType = this.getHeaderType(headerValue);

    if (headerType === "uu5JSON") {
      headerValue = Tools.parseFromUu5JSON(headerValue);
      headerType = this.getHeaderType(headerValue);
    }

    switch (headerType) {
      case "headerBodyItem":
        headerChild = this.buildChild(headerValue.element.tag, headerValue.element.props);
        headerChild = this.cloneChild(headerChild, this.expandHeaderProps(headerChild, level));
        break;
      case "headerElement":
        headerChild = headerValue.element;
        headerChild = this.cloneChild(headerChild, this.expandHeaderProps(headerChild, level));
        break;
      case "contentOfStandardHeader":
        headerChild = this.buildChild(this.getDefault("headerTag", "UU5.Common.SectionMixin"), {
          content: headerValue
        });
        headerChild = this.cloneChild(headerChild, this.expandHeaderProps(headerChild, level));
        break;
      default:
      // there is no header
    }

    return headerChild;
  },

  buildFooterChild(footer, level) {
    footer = footer || this.getFooter();

    var footerChild = null;

    if (typeof this.buildFooterChild_ === "function") {
      footerChild = this.buildFooterChild_(footer, level);
    } else {
      footerChild = this.buildFooterChildDefault(footer, level);
    }
    return footerChild;
  },

  buildFooterChildDefault(footer, level) {
    footer = footer || this.getFooter();
    var footerChild = null;
    var footerValue = footer;
    var footerType = this.getFooterType(footerValue);

    if (footerType === "uu5JSON") {
      footerValue = Tools.parseFromUu5JSON(footerValue);
      footerType = this.getFooterType(footerValue);
    }

    switch (footerType) {
      case "footerBodyItem":
        footerChild = this.buildChild(footerValue.element.tag, footerValue.element.props);
        footerChild = this.cloneChild(footerChild, this.expandFooterProps(footerChild, level));
        break;
      case "footerElement":
        footerChild = footerValue.element;
        footerChild = this.cloneChild(footerChild, this.expandFooterProps(footerChild, level));
        break;
      case "contentOfStandardFooter":
        footerChild = this.buildChild(this.getDefault("footerTag", "UU5.Common.SectionMixin"), {
          content: footerValue
        });
        footerChild = this.cloneChild(footerChild, this.expandFooterProps(footerChild, level));
        break;
      default:
      // there is no footer
    }

    return footerChild;
  },

  getHeaderChild(level) {
    return this.buildHeaderChild(undefined, level);
  },

  getFooterChild(level) {
    return this.buildFooterChild(undefined, level);
  },

  getRenderedHeaderChild() {
    return this.renderedHeaderChild;
  },

  getRenderedFooterChild() {
    return this.renderedFooterChild;
  }
  //@@viewOff:interface

  //@@viewOn:overriding
  //@@viewOff:overriding

  //@@viewOn:private
  //@@viewOff:private
};

MIXINS_WITH_LEVEL_MIXIN.add(SectionMixin);

export default SectionMixin;
