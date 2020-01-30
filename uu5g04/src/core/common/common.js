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

import "!style-loader?transform=src/core/common/normalize-css.js&insertAt=top!css-loader!postcss-loader??postcss!less-loader??less!./normalize.less";
import "./common.less";
import "./font-size.less";

export * from "./css.js";
export * from "./tools.js";
export * from "./class-names.js";
export * from "./base-mixin.js";
export * from "./div.js";
export * from "./level.js";
export * from "./error.js";
export * from "./not-found-tag.js";
export * from "./elementary-mixin.js";
export * from "./identity-mixin.js";
export { LevelMixin } from "./level-mixin.js";
export * from "./nesting-level-mixin.js";
export * from "./content-mixin.js";
export * from "./color-schema-mixin.js";
export * from "./section-mixin.js";
export * from "./session-mixin.js";
export * from "./ccr-reader-mixin.js";
export * from "./ccr-writer-mixin.js";
export * from "./screen-size-mixin.js";
export * from "./calls-mixin.js";
export * from "./load-mixin.js";
export * from "./lsi-mixin.js";
export * from "./swipe-mixin.js";
export * from "./vuc-mixin.js";
export * from "./pure-render-mixin.js";
export * from "./resize-mixin.js";
export * from "./route-mixin.js";
export * from "./router.js";
export * from "./uu5string/uu5-string.js";
export * from "./uu5string/uu5-json.js";
export * from "./uu5string/uu5-data.js";
export * from "./url.js";
export * from "./event-listener.js";
export * from "./tag-placeholder.js";
export * from "./outline.js";
export * from "./help.js";
export * from "./editable-mixin.js";
export * from "./text-corrector.js";
export * from "./request.js";
export * from "./fragment-mixin.js";
export * from "./list-data-manager.js";
export * from "./data-manager.js";
export * from "./loader.js";
export * from "./prop-mapper.js";
export * from "./session.js";
export * from "./identity.js";
export * from "./redirect.js";

import Context from "./context.js";
export { Context };

export * from "./component.js";
export * from "./dn-d.js";
export * from "./dom.js";
export * from "./element.js";
export * from "./portal.js";
export * from "./reference.js";
export { VisualComponent } from "./visual-component.js";

export * from "./with-visibility-check.js";

export { Children, Fragment } from "react";

import React, { Suspense } from "react";
const UU5Suspense = ({ loading, ...props }) => <Suspense {...props} fallback={props.fallback || props.loading || ""} />;
UU5Suspense.displayName = "Suspense";
export { UU5Suspense as Suspense };

export const bookKitUrl =
  "https://uuos9.plus4u.net/uu-bookkitg01-main/78462435-ed11ec379073476db0aa295ad6c00178/book/page";
