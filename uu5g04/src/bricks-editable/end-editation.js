import React from "react";
import createReactClass from "create-react-class";
import * as UU5 from "uu5g04";
import PropTypes from "prop-types";

import ns from "./bricks-editable-ns.js";
import Lsi from "./bricks-editable-lsi.js";
import Css from "./internal/css.js";

const NAME = ns.name("EndEditation");

export const EndEditation = UU5.Common.LsiMixin.withContext(
  createReactClass({
    displayName: NAME,
    //@@viewOn:mixins
    mixins: [UU5.Common.BaseMixin],
    //@@viewOff:mixins

    //@@viewOn:statics
    statics: {
      tagName: NAME,
      classNames: {
        main: () =>
          ns.css("end-editation") +
          " " +
          Css.css(`
          color: #4CAF50;
          background-color: transparent;
          font-family: ClearSans-Medium;
          border-radius: 2px;
          margin: 8px 8px 8px 0;

          &:hover {
            color: #FFFFFF;
            background-color: #4CAF50;
          }

          &:focus, &:active, &:focus:active {
            color: #FFFFFF;
            background-color: #388E3C;
          }
        `)
      },
      lsi: Lsi.endEditation
    },
    //@@viewOff:statics

    //@@viewOn:propTypes
    propTypes: {
      onClick: PropTypes.func
    },
    //@@viewOff:propTypes

    //@@viewOn:getDefaultProps
    getDefaultProps() {
      return {
        onClick: undefined
      };
    },
    //@@viewOff:getDefaultProps

    //@@viewOn:reactLifeCycle
    //@@viewOff:reactLifeCycle

    //@@viewOn:interface
    //@@viewOff:interface

    //@@viewOn:overridingMethods
    //@@viewOff:overridingMethods

    //@@viewOn:private
    //@@viewOff:private

    //@@viewOn:render
    render() {
      return (
        <UU5.Bricks.Button
          {...this.getMainPropsToPass()}
          size="s"
          colorSchema="custom"
          onClick={this.props.onClick}
          baseline
        >
          {this.getLsiComponent("label")}
        </UU5.Bricks.Button>
      );
    }
    //@@viewOff:render
  })
);

export default EndEditation;
