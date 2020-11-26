/**
 * Copyright (C) 2019 Unicorn a.s.
 *
 * This program is free software; you can use it under the terms of the UAF Open License v01 or
 * any later version. The text of the license is available in the file LICENSE or at www.unicorn.com.
 *
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even
 * the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See LICENSE for more details.
 *
 * You may contact Unicorn a.s. at address: V Kapslovne 2767/2, Praha 3, Czech Republic or
 * at the email: info@unicorn.com.
 */

import { Utils } from "uu5g05";
import NestingLevelMixin from "../common/nesting-level-mixin";
import Tools from "../common/tools";

// override uu5g05's Utils.NestingLevel.getNestingLevel() so that getting nesting level via
// "parent" prop is used too (NestingLevelMixin components)

const NestingLevel = {
  values: Utils.NestingLevel.valueList,

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
          actualValidNestingLevel = nestingLevelList.find((it) => NestingLevel.values.indexOf(it) >= minIndex);
          if (!actualValidNestingLevel) {
            actualValidNestingLevel = null;
            // NOTE Disabled warnings. See nesting-level-mixin.js, checkNestingLevel().
            // logNestingLevelError("nestingLevelMismatch", [
            //   statics.displayName,
            //   JSON.stringify(nestingLevelList),
            //   getComponentName(parentNLComponent),
            //   parentNestingLevel,
            //   JSON.stringify(NestingLevel.values.slice(minIndex))
            // ]);
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
        let usableIndices = nestingLevelList.map((it) => NestingLevel.values.indexOf(it)).filter((v) => v >= index);
        if (usableIndices.length === 0) {
          actualValidNestingLevel = null;
          // NOTE Disabled warnings. See nesting-level-mixin.js, checkNestingLevel().
          // logNestingLevelError("incorrectRequestedNestingLevel", [
          //   statics.displayName,
          //   requestedNestingLevel,
          //   JSON.stringify(nestingLevelList)
          // ]);
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
    return Utils.NestingLevel.getChildNestingLevel(props, statics);
  },
};

function logNestingLevelError(mixinErrorCode, params) {
  let message = NestingLevelMixin.statics["UU5.Common.NestingLevelMixin"].errors[mixinErrorCode];
  let formattedMessage = Tools.formatString(message, params);
  Tools.error(formattedMessage);
}

// function getComponentName(component) {
//   return (
//     (component
//       ? typeof component.getTagName === "function"
//         ? component.getTagName()
//         : component.constructor && component.constructor.displayName
//       : "") || ""
//   );
// }

Utils.NestingLevel.getNestingLevel = NestingLevel.getNestingLevel;

export default NestingLevel;
