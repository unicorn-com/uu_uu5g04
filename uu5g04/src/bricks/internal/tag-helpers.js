import Css from "./css";
import ns from "../bricks-ns.js";

export const STATE_MAP = {
  system: "#9E9E9E",
  initial: "#00C3DB",
  active: "#51B954",
  final: "#F94734",
  alternativeActive: "#FF9800",
  problemActive: "#079FF8",
  passive: "#C371D1",
  alternativeFinal: "#F56A9C",
  cancelled: "#EFEFEF",
};

const getIconStyles = (props, icon) => {
  let stateColor = STATE_MAP[props.state];
  let iconLibrary = icon.split("-")[0];
  let styles = "";

  if (iconLibrary === "uubml") {
    styles += `
      &&::before {
        color: ${stateColor} !important;
      }
    `;

    if (icon.startsWith("uubml-symbol-state") && !icon.endsWith("state-s98")) {
      styles += `
        font-size: 1.332em;
      `;
    }
  }

  return styles ? `${styles}` : undefined;
};

export const CLASS_NAMES = {
  main: (props) => {
    let stateColor = STATE_MAP[props.state];
    let styles = `
      display: inline-flex;
      align-items: center;
      justify-content: center;
      border-radius: ${props.size === "s" ? `0.125em` : `0.25em`};
      background-color: ${stateColor};
      height: ${props.size === "s" ? `0.5em` : `1.334em`};
      ${props.size === "s" ? `width: 0.5em;` : `min-width: 1.334em;`}
      ${props.state === "cancelled" ? `color: #757575` : `color: #FFFFFF`};

      &::before {
        content: "\\200b";
      }

      & > .uu5-bricks-icon::after {
        color: inherit !important;
      }
    `;

    return ns.css("state-icon") + " " + Css.css`${styles}`;
  },
  icon: (props, hasLabel) => {
    let styles = getIconStyles(props, props.icon);
    if (hasLabel) {
      styles =
        (styles || "") +
        `
        margin-left: 0.125em;
      `;
    }
    return styles ? Css.css`${styles}` : undefined;
  },
  iconAfter: (props, hasLabel) => {
    let styles = getIconStyles(props, props.iconAfter);
    if (hasLabel) {
      styles =
        (styles || "") +
        `
        margin-right: 0.125em;
      `;
    }
    return styles ? Css.css`${styles}` : undefined;
  },
  label: (props) => Css.css`
    margin: 0 0.125em;
    ${!props.icon ? "margin-left: 0.5em;" : ""}
    ${!props.iconAfter ? "margin-right: 0.5em;" : ""}
  `,
};
