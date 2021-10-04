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

import { Environment } from "uu5g05";

const adaptedG04Environment = {};

// TODO Remove Environment._constants checks after there are no production apps using uu5g05 < 1.0.0.
// copy g05 environment settings to legacy names used by g04
const boolRevertKeys = Environment._constants ? ["useLibraryRegistry", "allowStatistics", "textEntityReplace"] : [];
const keysWritableToEnvDirectly = Environment._constants ? ["uu5DataMap"] : [];
function mapEnvironment(g04Env, g04Key, g05Env, g05EnvConstants, g05FullKey) {
  const usedG05Env = keysWritableToEnvDirectly.includes(g04Key) ? g05Env : g05EnvConstants || g05Env;
  const g05Key = usedG05Env === g05Env ? g05FullKey : g05FullKey.replace(/^[^_]+_/, "");
  let g04ValueSet;
  let g04Value;
  Object.defineProperty(g04Env, g04Key, {
    enumerable: true,
    configurable: true,
    get: () => {
      if (g04ValueSet) return g04Value;
      return boolRevertKeys.includes(g04Key) ? !usedG05Env[g05Key] : usedG05Env[g05Key];
    },
    set: (v) => {
      if (Environment._constants) {
        // uu5g05 >= 0.16.0 (Environment is not writable, except for some keys)
        if (keysWritableToEnvDirectly.includes(g04Key)) {
          usedG05Env[g05Key] = boolRevertKeys.includes(g04Key) ? !v : v;
        } else {
          g04ValueSet = true;
          g04Value = v;
        }
      } else {
        // uu5g05 < 0.16.0 (Environment is writable)
        usedG05Env[g05Key] = boolRevertKeys.includes(g04Key) ? !v : v;
      }
    },
  });
}

const G04_RENAME_MAP = Environment._constants?.G04_RENAME_MAP || Environment._G04_RENAME_MAP; // g04 => g05 environment names (e.g. "COMPONENT_RENDER_UVE" => "componentRenderUri")
const G05_RENAME_MAP = Object.keys(G04_RENAME_MAP).reduce((r, k) => ((r[G04_RENAME_MAP[k]] = k), r), {}); // g05 => g04
if (Environment._constants) {
  if (Environment._constants.default) {
    for (let k in Environment._constants.default) {
      adaptedG04Environment[k] = Environment._constants.default[k];
    }
  }
  for (let k in G05_RENAME_MAP) {
    mapEnvironment(adaptedG04Environment, G05_RENAME_MAP[k] || k, Environment, Environment._constants, k);
  }
}
for (let k in Environment) {
  mapEnvironment(adaptedG04Environment, G05_RENAME_MAP[k] || k, Environment, Environment._constants, k);
}

if (Environment._constants) {
  adaptedG04Environment.showProductionWarning = ["debug", "info", "warn"].includes(Environment._constants.logLevel);
}

// NOTE Environment.statisticsLogLibrariesUri has no direct mapping into g04 and is therefore
// handled directly in statistics.js.

export { mapEnvironment };
export default adaptedG04Environment;
