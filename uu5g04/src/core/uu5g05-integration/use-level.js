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

import { useLevel, useContext } from "uu5g05";

const LevelContext = useLevel._context;
useLevel._override = function (g05Hook, ...hookArgs) {
  // eslint-disable-next-line uu5/hooks-rules
  let contextValue = useContext(LevelContext);
  let level = computeComponentLevel(contextValue, true);
  // TODO Remove g05Result after release of uu5g05 0.15.0 and then always return array.
  let g05Result = g05Hook(...hookArgs);
  return Array.isArray(g05Result) ? [level, contextValue.setLevel] : level;
};

function computeComponentLevel(contextValue, skipIncrease = false) {
  let level;
  if (contextValue.level == null) {
    level = skipIncrease ? null : 0;
  } else {
    level = contextValue.level + (contextValue.isDummyLevel ? 0 : 1) + (skipIncrease ? -1 : 0);
  } // NOTE isDummyLevel is legacy flag from LevelMixin (for backward compatibility). Level component doesn't send it in Provider as it doesn't do "dummy" levels (it always increases the level).
  return level;
}

export { LevelContext, useLevel, computeComponentLevel };
