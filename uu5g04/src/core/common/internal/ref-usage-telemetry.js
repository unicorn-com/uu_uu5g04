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

import Environment from "../../environment/environment";

const APP_LIBRARY_REGISTRY_TELEMETRY_URI =
  "https://uuapp.plus4u.net/uu-applibraryregistry-statsg01/8fc27ec054b340cb98c9f10789bd4f63/sys/logTelemetryData";
const processedItems = new Set();
const pendingItems = new Set();

let pendingRafId;
let telemetryInstance;

export const RefUsageTelemetry = {
  process(tagName) {
    if (process.env.NODE_ENV !== "production" || !Environment.allowTelemetry) return;
    if (!tagName || processedItems.has(tagName)) return;

    pendingItems.add(tagName);
    if (!pendingRafId) {
      pendingRafId = requestAnimationFrame(() => {
        pendingRafId = null;
        // check that Plus4U5.Telemetry is available and that it has sufficient API (>4.7.0)
        if (window.Plus4U5?.Telemetry?.prototype?.info) {
          let tagNames = [...pendingItems].sort();
          if (tagNames.length > 0) {
            for (let item of pendingItems) processedItems.add(item);
            pendingItems.clear();

            if (!telemetryInstance) {
              telemetryInstance = new window.Plus4U5.Telemetry({
                uri: APP_LIBRARY_REGISTRY_TELEMETRY_URI,
                includeLibraries: false,
                forceEnableTelemetry: true,
              });
            }
            telemetryInstance.info("uu5g04RefUsage", { tagNames });
          }
        }
      });
    }
  },
};
export default RefUsageTelemetry;
