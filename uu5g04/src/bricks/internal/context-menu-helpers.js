import Icon from "../icon.js";
import Css from "./css.js";

export const ClassNames = {
  submenu: () => Css.css`
    margin: 0;
    padding: 2px 0;
    width: 100%;
  `,
  icon: () => Css.css`
    display: flex;
    align-items: center;
    width: 32px;
    font-size: 1.4em;
    color: rgba(0, 0, 0, 0.54);
  `,
  nestedIcon: () => Css.css`
    .uu5-bricks-context-menu-item-nested-item > &.uu5-common-disabled {
      color: rgba(0, 0, 0, 0.24);
    }
  `,
  compactItem: () => Css.css`
    & > .uu5-bricks-context-menu-item-link {
      min-height: 40px;
    }
  `,
  compactSubmenuItem: () => Css.css`
    & > .uu5-bricks-context-menu-item-link {
      padding: 8px 0 8px 16px;
      justify-content: space-between;
    }
  `,
  backButton: () => Css.css`
    & > .uu5-bricks-context-menu-item-link {
      min-height: 40px;
    }
  `
};

export const Helpers = {
  getNestingItemLabel: (label, icon) => {
    let result = [];
    icon && result.push(<Icon key="icon" icon={icon} className={ClassNames.icon()} />);
    result.push(<span key="nestedLabel">{label}</span>);
    result.push(
      <Icon key="nestedIcon" icon="mdi-menu-right" className={`${ClassNames.icon()} ${ClassNames.nestedIcon()}`} />
    );
    return result;
  },

  getBackItemContent: label => {
    let result = [
      <Icon key="icon" icon="mdi-menu-left" className={`${ClassNames.icon()} ${ClassNames.nestedIcon()}`} />
    ];
    result.push(<span key="label">{label}</span>);
    return result;
  },

  wrapSubmenu: content => {
    let result = content;
    if (content && content.length) {
      result = <ul className={ClassNames.submenu()}>{content}</ul>;
    }
    return result;
  }
};

export default { ClassNames, Helpers };
