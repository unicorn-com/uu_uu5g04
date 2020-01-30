import React from "react";
import PropTypes from "prop-types";
import * as UU5 from "uu5g04";

import ns from "../bricks-editable-ns.js";
import Css from "./css.js";

const classNames = {
  main: () =>
    ns.css("settings-checkbox") +
    " " +
    Css.css(`
    cursor: pointer;
    margin-top: 0px;
    width: 100%;

    &:hover {
      background-color: #EEEEEE;
    }

    &:first-child {
      margin-top: 4px;
    }

    &:last-child {
      margin-bottom: 4px;
    }

    &&&&&&& .uu5-forms-checkbox-button {
      border-color: transparent;
      background-color: transparent;
      outline: none;
    }

    label {
      cursor: pointer;
    }

    .uu5-forms-label {
      width: 80%;

      + .uu5-forms-input-wrapper {
        width: 20%;
      }
    }
  `)
};

const getProps = props => {
  let propsToPass = { ...props };

  propsToPass.className += (propsToPass.className ? " " : "") + classNames.main();
  propsToPass.labelPosition = "right";

  if (propsToPass.onApply) {
    delete propsToPass.onApply;
    propsToPass.mainAttrs = {
      onClick: () => props.onApply(!props.value)
    };
  }

  return propsToPass;
};

export const SettingsCheckbox = props => {
  return <UU5.Forms.Checkbox {...getProps(props)} />;
};

SettingsCheckbox.displayName = ns.name("SettingsCheckbox");
SettingsCheckbox.tagName = ns.name("SettingsCheckbox");
SettingsCheckbox.propTypes = {
  value: PropTypes.bool,
  label: PropTypes.any,
  colorSchema: PropTypes.string,
  bgStyle: PropTypes.oneOf(["filled", "outline", "transparent", "underline", "link"]),
  onApply: PropTypes.func
};
SettingsCheckbox.defaultProps = {
  value: false,
  label: undefined,
  colorSchema: undefined,
  bgStyle: undefined,
  onApply: undefined
};
SettingsCheckbox.isStateless = true;

export default SettingsCheckbox;
