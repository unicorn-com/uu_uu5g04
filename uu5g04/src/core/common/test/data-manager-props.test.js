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

import regeneratorRuntime from "regenerator-runtime";
import React from "react";
import UU5 from "uu5g04";

const { mount, shallow, wait } = UU5.Test.Tools;

const loadTest = async (key, wrapper, childrenFn, onLoadFn, dataProp, dataReturn) => {
  // load render
  expect(childrenFn).toHaveBeenCalledTimes(1);
  let childrenParams1 = childrenFn.mock.calls[0][0];
  expect(childrenParams1).toMatchObject({
    viewState: "load",
    errorState: null,
    errorData: null,
    data: null,
  });
  expect(typeof childrenParams1.handleLoad).toBe("function");
  expect(typeof childrenParams1.handleReload).toBe("function");
  expect(typeof childrenParams1.handleUpdate).toBe("function");

  // props.onLoad
  expect(onLoadFn).toHaveBeenCalledTimes(1);
  let onLoadFnParams1 = onLoadFn.mock.calls[0][0];
  let onLoadFnResult1 = onLoadFn.mock.results[0].value;
  dataProp === null ? expect(onLoadFnParams1).toBeNull() : expect(onLoadFnParams1).toMatchObject(dataProp);
  expect(onLoadFnResult1).toBeInstanceOf(Promise);

  // waiting for loading
  await onLoadFnResult1;
  wrapper.update();

  // ready render
  expect(childrenFn).toHaveBeenCalledTimes(2);
  let childrenParams2 = childrenFn.mock.calls[1][0];
  expect(childrenParams2).toMatchObject({
    viewState: "ready",
    errorState: null,
    errorData: null,
    data: dataReturn,
  });
  expect(typeof childrenParams2.handleLoad).toBe("function");
  expect(typeof childrenParams2.handleReload).toBe("function");
  expect(typeof childrenParams2.handleUpdate).toBe("function");

  return childrenParams2;
};

const testHandle = async (key, wrapper, childrenFn, fn, calledTimes, paramsData, resultData1, resultData2) => {
  expect(fn).toHaveBeenCalledTimes(calledTimes);
  let fnParams = fn.mock.calls[calledTimes - 1][0];
  let fnResult = fn.mock.results[calledTimes - 1].value;
  expect(fnParams).toMatchObject(paramsData);
  expect(fnResult).toBeInstanceOf(Promise);

  // waiting for fn
  await fnResult;
  wrapper.update();

  // load -> ready -> ready || load
  expect(childrenFn).toHaveBeenCalledTimes(resultData2 ? 4 : 3);
  let childrenParams3 = childrenFn.mock.calls[2][0];
  expect(childrenParams3).toMatchObject({
    viewState: resultData2 ? key : "ready",
    errorState: null,
    errorData: null,
    data: resultData1,
  });
  expect(typeof childrenParams3.handleLoad).toBe("function");
  expect(typeof childrenParams3.handleReload).toBe("function");
  expect(typeof childrenParams3.handleUpdate).toBe("function");

  if (resultData2) {
    // load -> ready -> load -> ready
    let childrenParams4 = childrenFn.mock.calls[3][0];
    expect(childrenParams4).toMatchObject({
      viewState: "ready",
      errorState: null,
      errorData: null,
      data: resultData2,
    });
    expect(typeof childrenParams4.handleLoad).toBe("function");
    expect(typeof childrenParams4.handleReload).toBe("function");
    expect(typeof childrenParams4.handleUpdate).toBe("function");
  }
};

const data = { name: "AppName" };
const dataProp = { dtoIn: "data" };

const loadFn = () => new Promise((resolve, reject) => resolve(data));
const getChildrenFn = () => "test";

describe(`UU5.Common.DataManager onLoad`, () => {
  const loadDataParams = { param: "load" };

  it("optimistic", async () => {
    let onLoadFn = jest.fn().mockImplementation(loadFn);
    let childrenFn = jest.fn().mockImplementation(getChildrenFn);

    const wrapper = mount(
      <UU5.Common.DataManager onLoad={onLoadFn} data={dataProp}>
        {childrenFn}
      </UU5.Common.DataManager>
    );

    let childrenParams = await loadTest("onLoad", wrapper, childrenFn, onLoadFn, dataProp, data);

    // handleLoad
    childrenParams.handleLoad(loadDataParams);

    // onLoad
    await testHandle("load", wrapper, childrenFn, onLoadFn, 2, loadDataParams, data);
  });

  it("pessimistic", async () => {
    let onLoadFn = jest.fn().mockImplementation(loadFn);
    let childrenFn = jest.fn().mockImplementation(getChildrenFn);

    const wrapper = mount(
      <UU5.Common.DataManager pessimistic onLoad={onLoadFn} data={dataProp}>
        {childrenFn}
      </UU5.Common.DataManager>
    );

    let childrenParams = await loadTest("onLoad", wrapper, childrenFn, onLoadFn, dataProp, data);

    // handleLoad
    childrenParams.handleLoad(loadDataParams);

    // onLoad
    await testHandle("load", wrapper, childrenFn, onLoadFn, 2, loadDataParams, data, data);
  });
});

describe(`UU5.Common.DataManager onReload`, () => {
  const dataReload = { name: "AppNameReload" };
  const reloadDataParams = { param: "reload" };
  const reloadFn = () => new Promise((resolve, reject) => resolve(dataReload));

  it("optimistic", async () => {
    let onLoadFn = jest.fn().mockImplementation(loadFn);
    let childrenFn = jest.fn().mockImplementation(getChildrenFn);
    let onReloadFn = jest.fn().mockImplementation(reloadFn);

    const wrapper = mount(
      <UU5.Common.DataManager onLoad={onLoadFn} onReload={onReloadFn} data={dataProp}>
        {childrenFn}
      </UU5.Common.DataManager>
    );

    let childrenParams = await loadTest("onLoad", wrapper, childrenFn, onLoadFn, dataProp, data);

    // handleReload
    childrenParams.handleReload(reloadDataParams);

    // onReload
    await testHandle("reload", wrapper, childrenFn, onReloadFn, 1, reloadDataParams, dataReload);
  });

  it("pessimistic", async () => {
    let onLoadFn = jest.fn().mockImplementation(loadFn);
    let childrenFn = jest.fn().mockImplementation(getChildrenFn);
    let onReloadFn = jest.fn().mockImplementation(reloadFn);

    const wrapper = mount(
      <UU5.Common.DataManager pessimistic onLoad={onLoadFn} onReload={onReloadFn} data={dataProp}>
        {childrenFn}
      </UU5.Common.DataManager>
    );

    let childrenParams = await loadTest("onLoad", wrapper, childrenFn, onLoadFn, dataProp, data);

    // handleReload
    childrenParams.handleReload(reloadDataParams);

    // onReload
    await testHandle("reload", wrapper, childrenFn, onReloadFn, 1, reloadDataParams, data, dataReload);
  });
});

describe(`UU5.Common.DataManager onUpdate`, () => {
  const dataUpdate = { name: "AppNameUpdate" };
  const updateFn = () => new Promise((resolve, reject) => resolve(dataUpdate));

  it("optimistic", async () => {
    let onLoadFn = jest.fn().mockImplementation(loadFn);
    let childrenFn = jest.fn().mockImplementation(getChildrenFn);
    let onUpdateFn = jest.fn().mockImplementation(updateFn);

    const wrapper = mount(
      <UU5.Common.DataManager onLoad={onLoadFn} onUpdate={onUpdateFn}>
        {childrenFn}
      </UU5.Common.DataManager>
    );

    let childrenParams = await loadTest("onLoad", wrapper, childrenFn, onLoadFn, null, data);

    // update
    childrenParams.handleUpdate(dataUpdate);

    // onUpdate
    await testHandle("update", wrapper, childrenFn, onUpdateFn, 1, dataUpdate, dataUpdate);
  });

  it("pessimistic", async () => {
    let onLoadFn = jest.fn().mockImplementation(loadFn);
    let childrenFn = jest.fn().mockImplementation(getChildrenFn);
    let onUpdateFn = jest.fn().mockImplementation(updateFn);

    const wrapper = mount(
      <UU5.Common.DataManager pessimistic onLoad={onLoadFn} onUpdate={onUpdateFn}>
        {childrenFn}
      </UU5.Common.DataManager>
    );

    let childrenParams = await loadTest("onLoad", wrapper, childrenFn, onLoadFn, null, data);

    // update
    childrenParams.handleUpdate(dataUpdate);

    // onUpdate
    await testHandle("update", wrapper, childrenFn, onUpdateFn, 1, dataUpdate, data, dataUpdate);
  });
});
