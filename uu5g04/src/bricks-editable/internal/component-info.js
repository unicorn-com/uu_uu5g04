import * as UU5 from "uu5g04";

import ns from "../bricks-editable-ns.js";
import Css from "./css.js";

const classNames = {
  main: () =>
    ns.css("component-info") +
    " " +
    Css.css(`
    background-color: #F5F5F5;
    display: flex;
    align-items: center;
    color: #303030;
    padding: 16px 40px;
  `),
  icon: props =>
    Css.css(`
    color: rgba(0, 0, 0, 0.54);
    font-size: ${props.iconFontSize};
    align-items: center;
    margin-right: 16px;
    align-self: start;
  `)
};

export const ComponentInfo = props => {
  return (
    <div className={classNames.main()}>
      {props.icon ? <UU5.Bricks.Icon className={classNames.icon(props)} icon={props.icon} /> : null}
      <div>{props.children}</div>
    </div>
  );
};

ComponentInfo.displayName = ns.name("ComponentInfo");
ComponentInfo.tagName = ns.name("ComponentInfo");
ComponentInfo.propTypes = {
  icon: UU5.PropTypes.string,
  iconFontSize: UU5.PropTypes.string
};
ComponentInfo.defaultProps = {
  icon: "mdi-help-circle",
  iconFontSize: "26px"
};
ComponentInfo.isStateless = true;

export default ComponentInfo;
