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
