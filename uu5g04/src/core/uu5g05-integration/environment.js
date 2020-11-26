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

import { Environment } from "uu5g05";

const adaptedG05Environment = {};

// copy g05 environment settings to legacy names used by g04
function mapEnvironment(srcEnv, srcKey, targetEnv, targetKey) {
  Object.defineProperty(srcEnv, srcKey, {
    enumerable: true,
    configurable: true,
    get: () => targetEnv[targetKey],
    set: (v) => (targetEnv[targetKey] = v),
  });
}

const G04_RENAME_MAP = Environment._G04_RENAME_MAP; // g04 => g05 environment names (e.g. "COMPONENT_RENDER_UVE" => "componentRenderUri")
const G05_RENAME_MAP = Object.keys(G04_RENAME_MAP).reduce((r, k) => ((r[G04_RENAME_MAP[k]] = k), r), {}); // g05 => g04
for (let k in Environment) {
  mapEnvironment(adaptedG05Environment, G05_RENAME_MAP[k] || k, Environment, k);
}
// NOTE Environment.statisticsLogLibrariesUri has no direct mapping into g04 and is therefore
// handled directly in statistics.js.

export { mapEnvironment };
export default adaptedG05Environment;
