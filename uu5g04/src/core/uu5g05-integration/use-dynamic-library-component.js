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

import { useDynamicLibraryComponent, Utils } from "uu5g05";
import Environment from "../environment/environment";

useDynamicLibraryComponent._backCompatGetComponent = (componentName, item, Component, error) => {
  if (Component != null) return { Component, error };

  // fall back to getting a component from global variable
  let tagArray = componentName.split(".");
  let calculatedTag = window;
  while (calculatedTag && ["object", "function"].indexOf(typeof calculatedTag) > -1 && tagArray.length > 0) {
    calculatedTag = calculatedTag[tagArray.shift()];
  }
  let result = calculatedTag || null;

  return { Component: result, error: result != null ? undefined : error };
};

export const getComponentByName = useDynamicLibraryComponent._getComponentByName;
export const loadComponentByName = useDynamicLibraryComponent._loadComponentByName;
export const checkTag = useDynamicLibraryComponent._checkTag;

Utils.LibraryRegistry._backCompatGetLibrary = Environment.getLibrary;
