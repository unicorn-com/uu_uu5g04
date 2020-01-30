import * as UU5 from "uu5g04";

export const StyleFunctions = {
  editableLine: (backgroundColor, color, text) => {
    return `
      &[class *= "-editation "], &[class $= "-editation"] {
        background-color: ${backgroundColor};

        &::before {
          height: 0;
          overflow: hidden;
        }
      }

      &::before {
        content: ${text};
        background-color: ${backgroundColor};
        color: ${color};
        width: 100%;
        left: 0;
        height: 8px;
        font-size: 9px;
        text-align: center;
        line-height: 7px;
        display: block;
      }
    `;
  }
};

export default StyleFunctions;
