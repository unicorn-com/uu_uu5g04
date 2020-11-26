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

import { useLevel, useContext } from "uu5g05";

const LevelContext = useLevel._context;
useLevel._override = function (g05Hook, ...hookArgs) {
  let contextValue = useContext(LevelContext);
  let result = computeComponentLevel(contextValue, true);
  return result;
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
