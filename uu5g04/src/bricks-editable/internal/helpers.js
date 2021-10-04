import * as UU5 from "uu5g04";
import "uu5g04-bricks";

export const Helpers = {
  getComponentValidationResult: (value, isRequired) => {
    let isValid = isRequired ? Helpers.checkRequiredValue(value) : true;

    if (!isValid) {
      return {
        feedback: {
          feedback: "error",
          message: undefined,
        },
      };
    } else {
      return undefined;
    }
  },
  checkRequiredValue: (value) => {
    return value !== null && value !== undefined && value !== "";
  },
  getFeedback: (validation) => {
    if (validation) {
      if (typeof validation === "boolean") {
        return validation ? "error" : undefined;
      } else if (typeof validation === "object") {
        return validation.feedback;
      }
    }

    return undefined;
  },
  isValid: (validationItems) => {
    return !validationItems.find((validationItem) => {
      if (validationItem) {
        return Object.keys(validationItem).find((validationItemKey) => {
          if (
            validationItem[validationItemKey] &&
            typeof validationItem[validationItemKey] === "object" &&
            !isNaN(validationItemKey)
          ) {
            return Object.keys(validationItem[validationItemKey]).find((key) => {
              let feedbackItem = validationItem[validationItemKey][key];
              return Helpers.getFeedback(feedbackItem) === "error";
            });
          } else {
            return Helpers.getFeedback(validationItem[validationItemKey]) === "error";
          }
        });
      } else {
        return false;
      }
    });
  },
  isComponent: (component) => {
    if (typeof component === "function") {
      return true;
    } else if (typeof component === "object" && (component.type || component.isUu5PureComponent)) {
      return true;
    } else {
      return false;
    }
  },
  getLabel: (label) => {
    if (label && typeof label === "object" && !label.type) {
      return <UU5.Bricks.Lsi lsi={label} />;
    } else {
      return label;
    }
  },
};

export default Helpers;
