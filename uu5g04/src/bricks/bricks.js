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

// Base
export * from "./alert.js";
export * from "./alert-bus.js";

export * from "./accordion.js";
export * from "./panel.js";

export * from "./button.js";
export * from "./button-group.js";
export * from "./dropdown.js";
export * from "./language-selector.js";
export * from "./touch-icon.js";

export * from "./nav-bar.js";

export * from "./page.js";
export * from "./container.js";
export * from "./row.js";
export * from "./column.js";

export * from "./lsi.js";
export * from "./lsi-context.js";
export * from "./screen-size.js";
export * from "./modal.js";
export * from "./confirm-modal.js";
export * from "./section.js";
export * from "./header.js";
export * from "./footer.js";
export * from "./card.js";
export * from "./resize.js";
export * from "./loader.js";

export * from "./text.js";
export * from "./span.js";
export * from "./mark.js";

export * from "./icon.js";
export * from "./image.js";
export * from "./link.js";
export * from "./loading.js";
export * from "./calendar.js";
export * from "./color-palette.js";

// Dev
export * from "./null.js";
export * from "./box.js";
export * from "./console.js";
export * from "./todo.js";

// App
export * from "./cookie-bar.js";
export * from "./cookies-info.js";
export * from "./home-screen.js";
export * from "./button-to-top.js";
export * from "./click-confirm.js";
export * from "./context-menu.js";
export * from "./line.js";
export * from "./pager.js";
export * from "./pagination.js";
export * from "./popover.js";
export * from "./progress-bar.js";
export * from "./rating";
export * from "./tabs.js";

// Extra
export * from "./backdrop.js";

export * from "./badge.js";
export * from "./label.js";

export * from "./draggable-mixin.js";
export * from "./draggable-item.js";
export * from "./swiper.js";

export * from "./iframe.js";
export * from "./jumbotron.js";

export * from "./block.js";
export * from "./blockquote.js";
export * from "./code.js";

export * from "./carousel.js";

export * from "./data-table.js";
export * from "./table.js";
export * from "./spreadsheet.js";

export * from "./date-time.js";
export * from "./number.js";
export * from "./slider.js";

export * from "./heading.js";

export * from "./tree.js";
export * from "./li.js";
export * from "./ul.js";
export * from "./ol.js";

export * from "./button-switch.js";
export * from "./camera.js";
export * from "./dl.js";
export * from "./file-viewer.js";
export * from "./google-map.js";
export * from "./newspaper.js";
export * from "./progress-bus.js";
export * from "./well.js";

export * from "./video.js";
export * from "./youtube-video.js";
export * from "./audio.js";

export * from "./factory.js";

export * from "./switch.js";
export * from "./switch-selector.js";

export * from "./code-preview.js";

export * from "./authenticated.js";

export * from "./virtual-list.js";
export * from "./scroll-area.js";

export * from "./stepper.js";
export * from "./floating-box.js";
export * from "./session-watch.js";

export * from "./q-r-code.js";

export * from "./portal-modal.js";
export * from "./rich-link.js";
export * from "./portal-popover.js";

export * from "./component.js";
export * from "./link-modal.js";
export * from "./link-uve.js";

// Aliases
import * as UU5 from "uu5g04";

let error = UU5.Common.Error;
export { error as Error };

UU5.Environment.addRuntimeLibrary({ name: `${UU5.Environment.name}-bricks`, version: UU5.Environment.version });
export const bookKitUrl =
  "https://uuos9.plus4u.net/uu-bookkitg01-main/78462435-ed11ec379073476db0aa295ad6c00178/book/page";

import "./color-schema/default.less";

import "./internal/bg-styles.js";

import Css from "./internal/css.js";

Css.injectGlobal`
  #uu5-modals > * {
    z-index: 1050;
  }
`;
