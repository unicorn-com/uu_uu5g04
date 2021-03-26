import ns from "../forms-ns.js";
import Css from "./css";

const resetIconStyles = `
  right: auto;
  top: auto;
  position: relative;
  padding: 0;
  font-size: inherit;
`;

const pickerItemStyles = `
  border: 1px solid transparent;
  display: inline-block;
  border-radius: 4px;
  font-size: 20px;
  width: 32px;
  height: 32px;
  overflow: hidden;
  vertical-align: top;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: rgba(0,0,0,0.54);
  right: auto;
  top: auto;
  position: relative;
`;

const selectedIconStyles = `
  position: absolute;

  .uu5-bricks-icon {
    ${resetIconStyles}
  }

  .uu5-bricks-button-s & {
    font-size: 14px;
    left: 3px;
    top: 3px;
    bottom: 3px;
  }

  .uu5-bricks-button-m & {
    font-size: 20px;
    left: 3px;
    top: 3px;
    bottom: 3px;
  }

  .uu5-bricks-button-l & {
    font-size: 26px;
    left: 4px;
    top: 4px;
    bottom: 4px;
  }

  .uu5-bricks-button-xl & {
    font-size: 34px;
    left: 3px;
    top: 3px;
    bottom: 3px;
  }
`;

export const classNames = {
  rightWrapper: ns.css("right-wrapper"),
  right: ns.css("input-label-right"),
  main: ns.css("iconpicker"),
  open: ns.css("iconpicker-open"),
  openButton: ns.css("iconpicker-open-button"),
  selectedIcon: ns.css("iconpicker-selected-icon"),
  selectedTag: () => Css.css`${selectedIconStyles}`,
  selectedCustom: () => Css.css`
    ${selectedIconStyles}
    display: flex;
    align-items: center;
  `,
  arrowIcon: ns.css("iconpicker-arrow-down-icon"),
  picker: ns.css("iconpicker-picker"),
  pickerBody: ns.css("iconpicker-body"),
  pickerHeader: ns.css("iconpicker-header"),
  pickerFooter: ns.css("iconpicker-footer"),
  pickerItem: () => ns.css("iconpicker-item") + " " + Css.css`&& {${pickerItemStyles}}`,
  pickerItemTag: (props, state) => Css.css`
    width: 30px;
    height: 30px;
    outline: none;

    ${
      !state.readOnly && !state.disabled
        ? `
          border: 1px dashed transparent;
          cursor: pointer;

          &:hover {
            border: 1px dashed #696969;
          }
        `
        : ""
    }

    & > .uu5-bricks-icon {
      ${pickerItemStyles}
      color: inherit;
      font-size: 32px;
    }
  `,
  pickerItemCustom: () => ns.css("iconpicker-item") + " " + Css.css`&& {${pickerItemStyles}}`,
  pickerItemSelected: ns.css("iconpicker-item-selected"),
  error: ns.css("iconpicker-error"),
  multicategory: ns.css("iconpicker-multicategory"),
  searchInput: ns.css("iconpicker-search-input"),
  categoryInput: ns.css("iconpicker-category-input"),
  removeSelection: ns.css("iconpicker-remove-selected-icon"),
  loading: ns.css("input-loading-icon"),
  screenSizeBehaviour: ns.css("screen-size-behaviour"),
  buttonError: ns.css("button-error"),
  header: () => Css.css`
    display: flex;
  `,
};
