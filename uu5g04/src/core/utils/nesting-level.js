import Environment from "../environment/environment";
import NestingLevelMixin from "../common/nesting-level-mixin";
import Tools from "../common/tools";

export const NestingLevel = {
  values: Environment.nestingLevelList,

  getNestingLevel(props, statics) {
    let nestingLevelList = statics.nestingLevel;
    if (nestingLevelList && !Array.isArray(nestingLevelList)) {
      nestingLevelList = [nestingLevelList];
    } else if (!nestingLevelList) {
      nestingLevelList = NestingLevel.values;
    }

    let actualValidNestingLevel;
    let requestedNestingLevel = props.nestingLevel;
    if (!requestedNestingLevel) {
      // current component does not have any nesting level => try to find out nesting level of nearest parent
      // with NestingLevelMixin
      let parentNLComponent = props.parent;
      while (parentNLComponent && !parentNLComponent.hasUU5CommonNestingLevelMixin) {
        parentNLComponent = (parentNLComponent.props || {}).parent;
      }
      if (parentNLComponent) {
        let parentNestingLevel = parentNLComponent.getNestingLevel();
        let index = NestingLevel.values.indexOf(parentNestingLevel);
        if (index !== -1) {
          let minIndex =
            /Collection$/.test(parentNestingLevel) || parentNLComponent.getOpt("nestingLevelWrapper")
              ? index
              : Math.min(index + 1, NestingLevel.values.length - 1);
          actualValidNestingLevel = nestingLevelList.find(it => NestingLevel.values.indexOf(it) >= minIndex);
          if (!actualValidNestingLevel) {
            actualValidNestingLevel = null;
            logNestingLevelError("nestingLevelMismatch", [
              statics.displayName,
              JSON.stringify(nestingLevelList),
              getComponentName(parentNLComponent),
              parentNestingLevel,
              JSON.stringify(NestingLevel.values.slice(minIndex))
            ]);
          }
        }
      }
    }

    if (actualValidNestingLevel === undefined) {
      // compute actual valid nesting level from requested nesting level
      if (requestedNestingLevel) {
        let index = NestingLevel.values.indexOf(requestedNestingLevel);
        if (index === -1) {
          logNestingLevelError("unsupportedNestingLevel", [requestedNestingLevel, JSON.stringify(nestingLevelList)]);
        }
        let usableIndices = nestingLevelList.map(it => NestingLevel.values.indexOf(it)).filter(v => v >= index);
        if (usableIndices.length === 0) {
          actualValidNestingLevel = null;
          logNestingLevelError("incorrectRequestedNestingLevel", [
            statics.displayName,
            requestedNestingLevel,
            JSON.stringify(nestingLevelList)
          ]);
        } else {
          actualValidNestingLevel = NestingLevel.values[Math.min(...usableIndices)];
        }
      }
      if (actualValidNestingLevel === undefined) {
        actualValidNestingLevel = nestingLevelList[0];
      }
    }
    return actualValidNestingLevel;
  },

  getChildNestingLevel(props, statics) {
    let childNestingLevel;

    let actualValidNestingLevel = NestingLevel.getNestingLevel(props, statics);
    if (actualValidNestingLevel) {
      let index = NestingLevel.values.indexOf(actualValidNestingLevel);
      if (!/Collection$/.test(actualValidNestingLevel)) index = Math.min(index + 1, NestingLevel.values.length - 1);
      childNestingLevel = NestingLevel.values[index];
    }

    return childNestingLevel;
  }
};

function logNestingLevelError(mixinErrorCode, params) {
  let message = NestingLevelMixin.statics["UU5.Common.NestingLevelMixin"].errors[mixinErrorCode];
  let formattedMessage = Tools.formatString(message, params);
  Tools.error(formattedMessage);
}

function getComponentName(component) {
  return (
    (component
      ? typeof component.getTagName === "function"
        ? component.getTagName()
        : component.constructor && component.constructor.displayName
      : "") || ""
  );
}

export default NestingLevel;
