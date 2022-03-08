/**
 * Copyright (C) 2021 Unicorn a.s.
 *
 * This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public
 * License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later
 * version.
 *
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied
 * warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License at
 * <https://gnu.org/licenses/> for more details.
 *
 * You may obtain additional information at <https://unicorn.com> or contact Unicorn a.s. at address: V Kapslovne 2767/2,
 * Praha 3, Czech Republic or at the email: info@unicorn.com.
 */

import { Utils } from "uu5g05";
import Environment from "../environment/environment.js";

// override uu5g05's Utils.NestingLevel.getNestingLevel() so that getting nesting level via
// "parent" prop is used too (NestingLevelMixin components)

const NestingLevel = {
  // NOTE These are legacy values (from the point of view of uu5g05).
  values: Environment.nestingLevelList,

  getNestingLevel(props, statics) {
    return _getNestingLevel(props, statics, true);
  },

  getChildNestingLevel(props, statics) {
    return _getChildNestingLevel(props, statics, true);
  },
};

function _getNestingLevel(props, statics, isG04 = false) {
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
        }
      }
    }
  }

  if (actualValidNestingLevel !== undefined) {
    // we computed the final value from parent mixin component
    if (!isG04) {
      actualValidNestingLevel =
        Utils.NestingLevel._normalizeLevel?.(actualValidNestingLevel) ?? actualValidNestingLevel; // normalize for uu5g05 (e.g. "bigBox" -> "area")
    }
  } else {
    // compute the final value like in uu5g05
    actualValidNestingLevel = origG05GetNestingLevel(props, statics);
    if (isG04 && actualValidNestingLevel) {
      actualValidNestingLevel =
        Utils.NestingLevel._denormalizeLevel?.(actualValidNestingLevel) ?? actualValidNestingLevel; // denormalize for uu5g04 (e.g. "area" -> "bigBox")
    }
  }
  return actualValidNestingLevel;
}

function _getChildNestingLevel(props, statics, isG04 = false) {
  let childNestingLevel = origG05GetChildNestingLevel(props, statics);
  if (isG04 && childNestingLevel) {
    childNestingLevel = Utils.NestingLevel._denormalizeLevel?.(childNestingLevel) ?? childNestingLevel;
  }
  return childNestingLevel;
}

const origG05GetNestingLevel = Utils.NestingLevel.getNestingLevel;
const origG05GetChildNestingLevel = Utils.NestingLevel.getChildNestingLevel;
Utils.NestingLevel.getNestingLevel = _getNestingLevel;
Utils.NestingLevel.getChildNestingLevel = _getChildNestingLevel;

export default NestingLevel;
