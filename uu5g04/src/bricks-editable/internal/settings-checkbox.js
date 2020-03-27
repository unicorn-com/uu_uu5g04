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

  if (propsToPass.onClick) {
    delete propsToPass.onClick;
    propsToPass.mainAttrs = {
      onClick: () => props.onClick(!props.value)
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
  value: UU5.PropTypes.bool,
  label: UU5.PropTypes.any,
  colorSchema: UU5.PropTypes.string,
  bgStyle: UU5.PropTypes.oneOf(["filled", "outline", "transparent", "underline", "link"]),
  onClick: UU5.PropTypes.func
};
SettingsCheckbox.defaultProps = {
  value: false,
  label: undefined,
  colorSchema: undefined,
  bgStyle: undefined,
  onClick: undefined
};
SettingsCheckbox.isStateless = true;

export default SettingsCheckbox;
