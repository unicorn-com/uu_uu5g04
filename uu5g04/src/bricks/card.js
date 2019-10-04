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
import PropTypes from 'prop-types';
import * as UU5 from "uu5g04";
import ns from "./bricks-ns.js";
import Section from "./section.js";
import Css from "./internal/css.js";
const ClassNames = UU5.Common.ClassNames;

import './card.less';

export const Card = createReactClass({
  //@@viewOn:mixins
  mixins: [
    UU5.Common.BaseMixin,
    UU5.Common.ElementaryMixin,
    UU5.Common.NestingLevelMixin,
    UU5.Common.SectionMixin,
    UU5.Common.PureRenderMixin,
    UU5.Common.ColorSchemaMixin
  ],
  //@@viewOff:mixins

  //@@viewOn:statics
  statics: {
    tagName: ns.name("Card"),
    nestingLevelList: UU5.Environment.getNestingLevelList('bigBoxCollection', 'box'),
    classNames: {
      main: ns.css("card"),
      inline: ns.css("card-inline"),
      spaces: ns.css("card-spaces"),
      defaultColor: ns.css("card-default")
    },
    opt: {
      dummyLevel: true
    }
  },
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {
    elevation: PropTypes.oneOf(['-1', '0', '1', '2', '3', '4', '5', -1, 0, 1, 2, 3, 4, 5]),
    elevationHover: PropTypes.oneOf(['-1', '0', '1', '2', '3', '4', '5', -1, 0, 1, 2, 3, 4, 5]),
    inline: PropTypes.bool,
    width: PropTypes.number,
    minWidth: PropTypes.number,
    noSpaces: PropTypes.bool,
    bgStyle: PropTypes.oneOf(['filled', 'outline', 'transparent', 'underline']),
    borderRadius: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
  },
  //@@viewOff:propTypes

  //@@viewOn:getDefaultProps
  getDefaultProps() {
    return {
      elevation: 1,
      elevationHover: 1,
      inline: false,
      width: null,
      minWidth: null,
      noSpaces: false,
      bgStyle: "filled",
      borderRadius: null
    };
  },
  //@@viewOff:getDefaultProps

  //@@viewOn:standardComponentLifeCycle
  //@@viewOff:standardComponentLifeCycle

  //@@viewOn:interface
  //@@viewOff:interface

  //@@viewOn:overridingMethods
  //@@viewOff:overridingMethods

  //@@viewOn:componentSpecificHelpers
  _getMainProps() {
    const mainProps = this.getMainPropsToPass();
    mainProps.className += ' uu5-elevation-' + this.props.elevation;
    mainProps.className += ' uu5-elevation-hover-' + this.props.elevationHover;
    mainProps.underline = this.props.underline;

    !this.props.noSpaces && (mainProps.className += " " + this.getClassName("spaces"));

    if (this.props.bgStyle) {
      mainProps.className += " " + ClassNames[this.props.bgStyle];
    }

    if (this.props.bgStyle === "filled") {
      mainProps.className += " " + this.getClassName("defaultColor");
    }

    if (this.props.elevation) {
      mainProps.className += " " + ClassNames.elevation + this.props.elevation;
    }

    if (this.props.elevationHover !== null) {
      mainProps.className += " " + ClassNames.elevationHover + this.props.elevationHover;
    }

    if (this.props.width !== null || this.props.minWidth !== null) {
      mainProps.style = mainProps.style || {};
      this.props.width !== null && (mainProps.style.width = this.props.width);
      this.props.minWidth !== null && (mainProps.style.minWidth = this.props.minWidth);
      mainProps.className += ' ' + this.getClassName('inline');
    } else if (this.props.inline) {
      mainProps.className += ' ' + this.getClassName('inline');
    }

    if (this.props.borderRadius) {
      mainProps.style = { ...mainProps.style, ...{ borderRadius: this.props.borderRadius } };
    }

    if (this.props.header) {
      mainProps.className += " " + Css.css(`
        [id="${this.getId()}-inner-header"] {
          margin-top: 0px;
        }
      `);
    }

    return mainProps;
  },
  //@@viewOff:componentSpecificHelpers

  //@@viewOn:render
  render() {
    return (
      this.getNestingLevel() ? (
        <Section {...this._getMainProps()}>
          {React.Children.toArray(this.props.children)}
        </Section>
      ) : null
    );
  }
  //@@viewOff:render
});

export default Card;
