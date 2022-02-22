//@@viewOn:imports
import UU5 from "uu5g04";
import LazyLoadedLibraries from "./lazy-loaded-libraries";
import SpacesInput from "./spaces-input.js";

import ns from "../bricks-editable-ns.js";
import Lsi from "../bricks-editable-lsi.js";
//@@viewOff:imports

const { createVisualComponent, useState, useEffect } = LazyLoadedLibraries["uu5g04-hooks"];

let sizes = ["xs", "s", "l"];

let getPositionValue = (space, position, separatorChar) => {
  let valueToUse;
  if (typeof space === "string") {
    let separatedValues = space ? space.split(separatorChar) : undefined;
    if (space && space.indexOf(separatorChar) !== -1) {
      switch (position) {
        case "top":
          valueToUse = separatedValues[0];
          break;
        case "right":
          valueToUse = separatedValues[1];
          break;
        case "bottom":
          valueToUse = separatedValues[2];
          break;
        case "left":
          valueToUse = separatedValues[3];
          break;
        default:
          return;
      }
    } else {
      valueToUse = space;
    }
  } else {
    valueToUse = space;
  }
  return valueToUse;
};

const getComponentProps = (props, propName) => {
  let componentProps = { ...props };
  if ("marginTop" in componentProps && "marginBottom" in componentProps && !propName) {
    componentProps.spaces;
    componentProps.marginTop = parseValue(componentProps.marginTop);
    componentProps.marginBottom = parseValue(componentProps.marginBottom);
    componentProps.hideMarginHorizontal = true;
  } else if (propName) {
    componentProps.margin = parseValue(props[propName]);
  } else {
    componentProps.margin = parseValue(componentProps.margin);
  }

  let positions = (space, device) => {
    let spaceToUse = (space, position) => {
      let spaceToUse = space;
      if ("marginTop" in componentProps && "marginBottom" in componentProps) {
        if (space === "margin" && position === "top" && componentProps.marginTop) {
          spaceToUse = "marginTop";
        }
        if (space === "margin" && position === "bottom" && componentProps.marginBottom) {
          spaceToUse = "marginBottom";
        }
      }
      return spaceToUse;
    };
    return {
      top: getUnitsFromProps(componentProps, spaceToUse(space, "top"), "top", device, " "),
      right: getUnitsFromProps(componentProps, space, "right", device, " "),
      bottom: getUnitsFromProps(componentProps, spaceToUse(space, "bottom"), "bottom", device, " "),
      left: getUnitsFromProps(componentProps, space, "left", device, " "),
    };
  };

  componentProps.spaces = {
    margin: {
      xs: { ...positions("margin", "xs") },
      s: { ...positions("margin", "s") },
      l: { ...positions("margin", "l") },
    },
  };

  return componentProps.spaces;
};

let parseValue = (value) => {
  var result; // parse value
  let sizes = ["xs", "s", "l"];
  if (typeof value === "object") {
    result = value;
  } else if (typeof value === "string" && sizes.some((size) => value.includes(size))) {
    result = {};
    value.split(" ").forEach(function (item) {
      var parts = item.match(/^(([^-]+)?-(.*))$/);

      if (parts) {
        result[parts[2]] = parts[3];
      }
    });
  } else {
    return {
      xs: value,
      s: value,
      l: value,
    };
  } // filter all non screen size keys from result

  return result;
};

let getUnitsFromProps = (props, space, position, device, separatorChar = "-") => {
  // a different separator char has to be used when having negative values
  let valueToUse;
  let spaceToUse;
  if (props) {
    spaceToUse = props[space] || props;
  }
  if (typeof spaceToUse === "string") {
    if (spaceToUse.indexOf(" ") === -1) {
      valueToUse = getPositionValue(spaceToUse, position);
    } else {
      let variousScreens = spaceToUse.split(" ");
      let screenSizes = {};
      for (let i = 0; i < variousScreens.length; i++) {
        let splittedScreens = variousScreens[i].split(separatorChar);
        let screenKey = splittedScreens[0];
        splittedScreens.shift();
        screenSizes[screenKey] = splittedScreens.join(separatorChar);
      }
      if (device === "xs") {
        valueToUse = valueToUse = getPositionValue(screenSizes.xs, position, separatorChar);
      } else if (device === "s") {
        valueToUse = valueToUse = getPositionValue(screenSizes.s || screenSizes.m, position, separatorChar);
      } else if (device === "l") {
        valueToUse = valueToUse = getPositionValue(screenSizes.l || screenSizes.xl, position, separatorChar);
      }
    }
  } else if (typeof spaceToUse === "object") {
    if (device === "xs") {
      valueToUse = valueToUse = getPositionValue(spaceToUse.xs, position, separatorChar);
    } else if (device === "s") {
      valueToUse = valueToUse = getPositionValue(spaceToUse.s || spaceToUse.m, position, separatorChar);
    } else if (device === "l") {
      valueToUse = valueToUse = getPositionValue(spaceToUse.l || spaceToUse.xl, position, separatorChar);
    }
  }

  return valueToUse;
};

//@@viewOn:statics
const STATICS = {
  displayName: ns.name("EditationModalMarginInput"),
};
//@@viewOff:statics

const EditationModalMarginInput = createVisualComponent({
  ...STATICS,

  //@@viewOn:propTypes
  propTypes: {
    onChange: UU5.PropTypes.func,
    label: UU5.PropTypes.object,
    items: UU5.PropTypes.arrayOf(UU5.PropTypes.object),
    value: UU5.PropTypes.string,
  },
  //@@viewOff:propTypes

  //@@viewOn:defaultProps
  defaultProps: {
    onChange: undefined,
    label: <UU5.Bricks.Lsi lsi={Lsi.bgStyleInput.label} />,
    items: [
      { value: "filled", content: <UU5.Bricks.Lsi lsi={Lsi.bgStyleInput.filled} /> },
      { value: "outline", content: <UU5.Bricks.Lsi lsi={Lsi.bgStyleInput.outline} /> },
      { value: "transparent", content: <UU5.Bricks.Lsi lsi={Lsi.bgStyleInput.transparent} /> },
      { value: "underline", content: <UU5.Bricks.Lsi lsi={Lsi.bgStyleInput.underline} /> },
    ],
    value: UU5.PropTypes.string,
  },
  //@@viewOff:defaultProps

  render({ componentProps, onChangeProps, ...props }) {
    //@@viewOn:hooks
    let [margin, setMargin] = useState(getComponentProps(componentProps, props.propName));
    useEffect(() => {
      setMargin(getComponentProps(componentProps, props.propName));
    }, [componentProps]);
    //@@viewOff:hooks

    //@@viewOn:interface

    //@@viewOff:interface

    //@@viewOn:private
    let onChange = (spaces) => {
      if ("marginTop" in componentProps && "marginBottom" in componentProps && !props.propName) {
        let marginTop = {};
        let marginBottom = {};
        for (let i = 0; i < sizes.length; i++) {
          let margins = { ...spaces.value.margin };
          marginTop[sizes[i]] = margins[sizes[i]].top;
          marginBottom[sizes[i]] = margins[sizes[i]].bottom;
        }

        setMargin(getComponentProps({ marginTop, marginBottom }));
        onChangeProps({
          marginTop: Object.values(marginTop).filter((value) => value).length > 0 ? marginTop : undefined,
          marginBottom: Object.values(marginBottom).filter((value) => value).length > 0 ? marginBottom : undefined,
        });
      } else {
        let marginToUse = {};
        for (let i = 0; i < sizes.length; i++) {
          let margins = { ...spaces.value.margin };
          let oneSizePadding = "";
          // let unit;

          let hasValue = false;
          for (const [key, value] of Object.entries(margins[sizes[i]])) {
            if (value) {
              hasValue = true;
              // unit = value.match(/[a-z]+|%|[^a-z]+$/gi)[1]
            }
          }

          if (hasValue) {
            for (const [key, value] of Object.entries(margins[sizes[i]])) {
              if (value) {
                oneSizePadding += `${UU5.Common.Tools.fillUnit(value)} `;
              } else {
                // oneSizePadding += unit ? `0${unit} ` :  "0 ";
                oneSizePadding += "0 ";
              }
            }
            marginToUse[sizes[i]] = oneSizePadding.trim();
          }
        }

        setMargin(getComponentProps({ margin: marginToUse }));
        if (props.propName) {
          onChangeProps({ [props.propName]: marginToUse });
        } else {
          onChangeProps({ margin: marginToUse });
        }
      }
    };
    //@@viewOff:private

    //@@viewOn:render
    return (
      <SpacesInput
        value={margin}
        header={<UU5.Bricks.Lsi lsi={Lsi.marginInput.header} />}
        onChange={onChange}
        hidePaddingVertical={true}
        hidePaddingHorizontal={true}
        hideMarginHorizontal={props.hideMarginHorizontal}
        hideMarginVertical={props.hideMarginVertical}
      />
    );
    //@@viewOff:render
  },
});

export default EditationModalMarginInput;
