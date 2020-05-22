export const Helpers = {
  getComponentValidationResult: (value, isRequired) => {
    let isValid = isRequired ? Helpers.checkRequiredValue(value) : true;

    if (!isValid) {
      return {
        feedback: "error"
      };
    } else {
      return undefined;
    }
  },
  checkRequiredValue: value => {
    return value !== null && value !== undefined && value !== "";
  },
  getFeedback: validation => {
    if (validation) {
      if (typeof validation === "boolean") {
        return validation ? "error" : undefined;
      } else if (typeof validation === "object") {
        return validation.feedback;
      }
    }

    return undefined;
  },
  isValid: validationItems => {
    return !validationItems.find(validationItem => {
      if (validationItem) {
        return Object.keys(validationItem).find(validationItemKey => {
          if (
            validationItem[validationItemKey] &&
            typeof validationItem[validationItemKey] === "object" &&
            !isNaN(validationItemKey)
          ) {
            return Object.keys(validationItem[validationItemKey]).find(key => {
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
  isComponent: component => {
    if (typeof component === "function") {
      return true;
    } else if (typeof component === "object" && component.type) {
      return true;
    } else {
      return false;
    }
  }
};

export default Helpers;
