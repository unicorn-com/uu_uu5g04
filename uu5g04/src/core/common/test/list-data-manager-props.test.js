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

import React from "react";
import UU5 from "uu5g04";
import regeneratorRuntime from "regenerator-runtime";

const { mount, shallow, wait } = UU5.Test.Tools;

const loadTest = async (key, wrapper, childrenFn, onLoadFn, dataProp, dataReturn) => {
  // load render
  expect(childrenFn).toHaveBeenCalledTimes(1);
  let childrenParams1 = childrenFn.mock.calls[0][0];
  expect(childrenParams1).toMatchObject({
    viewState: "load",
    errorState: null,
    errorData: null,
    data: null
  });
  expect(typeof childrenParams1.handleLoad).toBe("function");
  expect(typeof childrenParams1.handleReload).toBe("function");
  expect(typeof childrenParams1.handleCreate).toBe("function");
  expect(typeof childrenParams1.handleUpdate).toBe("function");
  expect(typeof childrenParams1.handleDelete).toBe("function");
  expect(typeof childrenParams1.handleBulkCreate).toBe("function");
  expect(typeof childrenParams1.handleBulkUpdate).toBe("function");
  expect(typeof childrenParams1.handleBulkDelete).toBe("function");

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
    data: dataReturn
  });
  expect(typeof childrenParams2.handleLoad).toBe("function");
  expect(typeof childrenParams2.handleReload).toBe("function");
  expect(typeof childrenParams1.handleCreate).toBe("function");
  expect(typeof childrenParams1.handleUpdate).toBe("function");
  expect(typeof childrenParams1.handleDelete).toBe("function");
  expect(typeof childrenParams1.handleBulkCreate).toBe("function");
  expect(typeof childrenParams1.handleBulkUpdate).toBe("function");
  expect(typeof childrenParams1.handleBulkDelete).toBe("function");

  onLoadFn.mockClear();
  childrenFn.mockClear();
  return childrenParams2;
};

const testHandle = async (
  key,
  wrapper,
  childrenFn,
  fn,
  childrenFnCalledTimes,
  paramsData,
  resultData1,
  resultData2
) => {
  expect(fn).toHaveBeenCalledTimes(1);
  let fnParams1 = fn.mock.calls[0][0];
  let fnParams2 = fn.mock.calls[0][1];
  let fnResult = fn.mock.results[0].value;
  expect(fnResult).toBeInstanceOf(Promise);

  if (key === "load" || key === "reload" || key === "create") {
    expect(fnParams1).toMatchObject(paramsData);
  } else if (key === "update") {
    expect(fnParams1).toBe(paramsData.id);
    expect(fnParams2).toMatchObject(paramsData);
  } else if (key === "delete") {
    expect(fnParams1).toBe(paramsData);
  } else if (key === "bulkCreate") {
    expect(fnParams1).toMatchObject(paramsData);
  } else if (key === "bulkUpdate") {
    expect(fnParams1).toMatchObject(paramsData.map(it => it.id));
    expect(fnParams2).toMatchObject(paramsData);
  } else if (key === "bulkDelete") {
    expect(fnParams1).toMatchObject(paramsData);
  }

  // waiting for fn
  await fnResult;
  wrapper.update();

  // ready || load
  expect(childrenFn).toHaveBeenCalledTimes(childrenFnCalledTimes);

  let childrenParams3 = childrenFn.mock.calls[0][0];

  expect(childrenParams3).toMatchObject({
    viewState: wrapper.props().pessimistic ? key : "ready",
    errorState: null,
    errorData: null,
    data: resultData1
  });
  expect(typeof childrenParams3.handleLoad).toBe("function");
  expect(typeof childrenParams3.handleReload).toBe("function");
  expect(typeof childrenParams3.handleCreate).toBe("function");
  expect(typeof childrenParams3.handleUpdate).toBe("function");
  expect(typeof childrenParams3.handleDelete).toBe("function");
  expect(typeof childrenParams3.handleBulkCreate).toBe("function");
  expect(typeof childrenParams3.handleBulkUpdate).toBe("function");
  expect(typeof childrenParams3.handleBulkDelete).toBe("function");

  if (resultData2) {
    // load -> ready
    let childrenParams4 = childrenFn.mock.calls[1][0];
    expect(childrenParams4).toMatchObject({
      viewState: "ready",
      errorState: null,
      errorData: null,
      data: resultData2
    });
    expect(typeof childrenParams4.handleLoad).toBe("function");
    expect(typeof childrenParams4.handleReload).toBe("function");
    expect(typeof childrenParams4.handleCreate).toBe("function");
    expect(typeof childrenParams4.handleUpdate).toBe("function");
    expect(typeof childrenParams4.handleDelete).toBe("function");
    expect(typeof childrenParams4.handleBulkCreate).toBe("function");
    expect(typeof childrenParams4.handleBulkUpdate).toBe("function");
    expect(typeof childrenParams4.handleBulkDelete).toBe("function");
  }

  childrenFn.mockClear();
  fn.mockClear();
};

const data = [{ id: "1", name: "A" }, { id: "2", name: "B" }, { id: "3", name: "C" }];
const dataProp = { dtoIn: "data" };

const loadFn = () => new Promise((resolve, reject) => resolve(data));
const getChildrenFn = () => "test";

describe(`UU5.Common.ListDataManager onLoad`, () => {
  const loadDataParams = { param: "load" };

  it("optimistic", async () => {
    let onLoadFn = jest.fn().mockImplementation(loadFn);
    let childrenFn = jest.fn().mockImplementation(getChildrenFn);

    const wrapper = mount(
      <UU5.Common.ListDataManager onLoad={onLoadFn} data={dataProp}>
        {childrenFn}
      </UU5.Common.ListDataManager>
    );

    let childrenParams = await loadTest("onLoad", wrapper, childrenFn, onLoadFn, dataProp, data);

    // handleLoad
    childrenParams.handleLoad(loadDataParams);

    // onLoad
    await testHandle("load", wrapper, childrenFn, onLoadFn, 1, loadDataParams, data);
  });

  it("pessimistic", async () => {
    let onLoadFn = jest.fn().mockImplementation(loadFn);
    let childrenFn = jest.fn().mockImplementation(getChildrenFn);

    const wrapper = mount(
      <UU5.Common.ListDataManager pessimistic onLoad={onLoadFn} data={dataProp}>
        {childrenFn}
      </UU5.Common.ListDataManager>
    );

    let childrenParams = await loadTest("onLoad", wrapper, childrenFn, onLoadFn, dataProp, data);

    // handleLoad
    childrenParams.handleLoad(loadDataParams);

    // onLoad
    await testHandle("load", wrapper, childrenFn, onLoadFn, 2, loadDataParams, data, data);
  });
});

describe(`UU5.Common.ListDataManager onReload`, () => {
  const dataReload = [{ id: "2", name: "B" }];
  const reloadDataParams = { param: "reload" };
  const reloadFn = () => new Promise((resolve, reject) => resolve(dataReload));

  it("optimistic", async () => {
    let onLoadFn = jest.fn().mockImplementation(loadFn);
    let childrenFn = jest.fn().mockImplementation(getChildrenFn);
    let onReloadFn = jest.fn().mockImplementation(reloadFn);

    const wrapper = mount(
      <UU5.Common.ListDataManager onLoad={onLoadFn} onReload={onReloadFn} data={dataProp}>
        {childrenFn}
      </UU5.Common.ListDataManager>
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
      <UU5.Common.ListDataManager pessimistic onLoad={onLoadFn} onReload={onReloadFn} data={dataProp}>
        {childrenFn}
      </UU5.Common.ListDataManager>
    );

    let childrenParams = await loadTest("onLoad", wrapper, childrenFn, onLoadFn, dataProp, data);

    // handleReload
    childrenParams.handleReload(reloadDataParams);

    // onReload
    await testHandle("reload", wrapper, childrenFn, onReloadFn, 2, reloadDataParams, data, dataReload);
  });
});

describe(`UU5.Common.ListDataManager onUpdate`, () => {
  const dataUpdate = { id: "1", name: "C" };
  const dataUpdateFromServer = { ...dataUpdate, name: dataUpdate.name + "X" };
  const updateFn = () => new Promise((resolve, reject) => resolve(dataUpdateFromServer));

  it("optimistic", async () => {
    let onLoadFn = jest.fn().mockImplementation(loadFn);
    let childrenFn = jest.fn().mockImplementation(getChildrenFn);
    let onUpdateFn = jest.fn().mockImplementation(updateFn);

    const wrapper = mount(
      <UU5.Common.ListDataManager onLoad={onLoadFn} onUpdate={onUpdateFn}>
        {childrenFn}
      </UU5.Common.ListDataManager>
    );

    let childrenParams = await loadTest("onLoad", wrapper, childrenFn, onLoadFn, null, data);

    // update
    childrenParams.handleUpdate(dataUpdate.id, dataUpdate);

    // onUpdate
    let expectedData = data.map(it => (it.id === dataUpdate.id ? dataUpdate : it));
    let expectedFinalData = data.map(it => (it.id === dataUpdateFromServer.id ? dataUpdateFromServer : it));
    await testHandle("update", wrapper, childrenFn, onUpdateFn, 2, dataUpdate, expectedData, expectedFinalData);
  });

  it("pessimistic", async () => {
    let onLoadFn = jest.fn().mockImplementation(loadFn);
    let childrenFn = jest.fn().mockImplementation(getChildrenFn);
    let onUpdateFn = jest.fn().mockImplementation(updateFn);

    const wrapper = mount(
      <UU5.Common.ListDataManager pessimistic onLoad={onLoadFn} onUpdate={onUpdateFn}>
        {childrenFn}
      </UU5.Common.ListDataManager>
    );

    let childrenParams = await loadTest("onLoad", wrapper, childrenFn, onLoadFn, null, data);

    // update
    childrenParams.handleUpdate(dataUpdate.id, dataUpdate);

    // onUpdate
    let expectedFinalData = data.map(it => (it.id === dataUpdateFromServer.id ? dataUpdateFromServer : it));
    await testHandle("update", wrapper, childrenFn, onUpdateFn, 2, dataUpdate, data, expectedFinalData);
  });
});

describe(`UU5.Common.ListDataManager onCreate`, () => {
  const dataCreate = { id: "4", name: "D" };
  const dataCreateFromServer = { ...dataCreate, name: dataCreate.name + "X" };
  const createFn = () => new Promise((resolve, reject) => resolve(dataCreateFromServer));

  it("optimistic", async () => {
    let onLoadFn = jest.fn().mockImplementation(loadFn);
    let childrenFn = jest.fn().mockImplementation(getChildrenFn);
    let onCreateFn = jest.fn().mockImplementation(createFn);

    const wrapper = mount(
      <UU5.Common.ListDataManager onLoad={onLoadFn} onCreate={onCreateFn}>
        {childrenFn}
      </UU5.Common.ListDataManager>
    );

    let childrenParams = await loadTest("onLoad", wrapper, childrenFn, onLoadFn, null, data);

    // create
    childrenParams.handleCreate(dataCreate);

    // onCreate
    let expectedData = [...data, dataCreate];
    let expectedFinalData = [...data, dataCreateFromServer];
    await testHandle("create", wrapper, childrenFn, onCreateFn, 2, dataCreate, expectedData, expectedFinalData);
  });

  it("pessimistic", async () => {
    let onLoadFn = jest.fn().mockImplementation(loadFn);
    let childrenFn = jest.fn().mockImplementation(getChildrenFn);
    let onCreateFn = jest.fn().mockImplementation(createFn);

    const wrapper = mount(
      <UU5.Common.ListDataManager pessimistic onLoad={onLoadFn} onCreate={onCreateFn}>
        {childrenFn}
      </UU5.Common.ListDataManager>
    );

    let childrenParams = await loadTest("onLoad", wrapper, childrenFn, onLoadFn, null, data);

    // create
    childrenParams.handleCreate(dataCreate);

    // onCreate
    let expectedFinalData = [...data, dataCreateFromServer];
    await testHandle("create", wrapper, childrenFn, onCreateFn, 2, dataCreate, data, expectedFinalData);
  });
});

describe(`UU5.Common.ListDataManager onDelete`, () => {
  const dataDelete = { id: "1", name: "A" };
  const deleteFn = () => new Promise((resolve, reject) => resolve(dataDelete));

  it("optimistic", async () => {
    let onLoadFn = jest.fn().mockImplementation(loadFn);
    let childrenFn = jest.fn().mockImplementation(getChildrenFn);
    let onDeleteFn = jest.fn().mockImplementation(deleteFn);

    const wrapper = mount(
      <UU5.Common.ListDataManager onLoad={onLoadFn} onDelete={onDeleteFn}>
        {childrenFn}
      </UU5.Common.ListDataManager>
    );

    let childrenParams = await loadTest("onLoad", wrapper, childrenFn, onLoadFn, null, data);

    // delete
    childrenParams.handleDelete(dataDelete.id);

    // onDelete
    let expectedData = data.filter(it => it.id !== dataDelete.id);
    await testHandle("delete", wrapper, childrenFn, onDeleteFn, 2, dataDelete.id, expectedData);
  });

  it("pessimistic", async () => {
    let onLoadFn = jest.fn().mockImplementation(loadFn);
    let childrenFn = jest.fn().mockImplementation(getChildrenFn);
    let onDeleteFn = jest.fn().mockImplementation(deleteFn);

    const wrapper = mount(
      <UU5.Common.ListDataManager pessimistic onLoad={onLoadFn} onDelete={onDeleteFn}>
        {childrenFn}
      </UU5.Common.ListDataManager>
    );

    let childrenParams = await loadTest("onLoad", wrapper, childrenFn, onLoadFn, null, data);

    // delete
    childrenParams.handleDelete(dataDelete.id);

    // onDelete
    let expectedData = data.filter(it => it.id !== dataDelete.id);
    await testHandle("delete", wrapper, childrenFn, onDeleteFn, 2, dataDelete.id, data, expectedData);
  });
});

describe(`UU5.Common.ListDataManager onBulkUpdate`, () => {
  const dataUpdate = [{ id: "3", name: "A" }, { id: "1", name: "C" }];
  const dataUpdateFromServer = dataUpdate.map(it => ({ ...it, name: it.name + "X" }));
  const updateFn = () => new Promise((resolve, reject) => resolve(dataUpdateFromServer));

  it("optimistic", async () => {
    let onLoadFn = jest.fn().mockImplementation(loadFn);
    let childrenFn = jest.fn().mockImplementation(getChildrenFn);
    let onBulkUpdateFn = jest.fn().mockImplementation(updateFn);

    const wrapper = mount(
      <UU5.Common.ListDataManager onLoad={onLoadFn} onBulkUpdate={onBulkUpdateFn}>
        {childrenFn}
      </UU5.Common.ListDataManager>
    );

    let childrenParams = await loadTest("onLoad", wrapper, childrenFn, onLoadFn, null, data);

    // bulkUpdate
    childrenParams.handleBulkUpdate(dataUpdate.map(it => it.id), dataUpdate);

    // onBulkUpdate
    let expectedData = data.map(it => dataUpdate.find(upIt => upIt.id === it.id) || it);
    let expectedFinalData = data.map(it => dataUpdateFromServer.find(upIt => upIt.id === it.id) || it);
    await testHandle("bulkUpdate", wrapper, childrenFn, onBulkUpdateFn, 2, dataUpdate, expectedData, expectedFinalData);
  });

  it("pessimistic", async () => {
    let onLoadFn = jest.fn().mockImplementation(loadFn);
    let childrenFn = jest.fn().mockImplementation(getChildrenFn);
    let onBulkUpdateFn = jest.fn().mockImplementation(updateFn);

    const wrapper = mount(
      <UU5.Common.ListDataManager pessimistic onLoad={onLoadFn} onBulkUpdate={onBulkUpdateFn}>
        {childrenFn}
      </UU5.Common.ListDataManager>
    );

    let childrenParams = await loadTest("onLoad", wrapper, childrenFn, onLoadFn, null, data);

    // bulkUpdate
    childrenParams.handleBulkUpdate(dataUpdate.map(it => it.id), dataUpdate);

    // onBulkUpdate
    let expectedFinalData = data.map(it => dataUpdateFromServer.find(upIt => upIt.id === it.id) || it);
    await testHandle("bulkUpdate", wrapper, childrenFn, onBulkUpdateFn, 2, dataUpdate, data, expectedFinalData);
  });
});

describe(`UU5.Common.ListDataManager onBulkCreate`, () => {
  const dataCreate = [{ id: "4", name: "D" }, { id: "5", name: "E" }];
  const dataCreateFromServer = dataCreate.map(it => ({ ...it, name: it.name + "X" }));
  const createFn = () => new Promise((resolve, reject) => resolve(dataCreateFromServer));

  it("optimistic", async () => {
    let onLoadFn = jest.fn().mockImplementation(loadFn);
    let childrenFn = jest.fn().mockImplementation(getChildrenFn);
    let onBulkCreateFn = jest.fn().mockImplementation(createFn);

    const wrapper = mount(
      <UU5.Common.ListDataManager onLoad={onLoadFn} onBulkCreate={onBulkCreateFn}>
        {childrenFn}
      </UU5.Common.ListDataManager>
    );

    let childrenParams = await loadTest("onLoad", wrapper, childrenFn, onLoadFn, null, data);

    // bulkCreate
    childrenParams.handleBulkCreate(dataCreate);

    // onBulkCreate
    let expectedData = [...data, ...dataCreate];
    let expectedFinalData = [...data, ...dataCreateFromServer];
    await testHandle("bulkCreate", wrapper, childrenFn, onBulkCreateFn, 2, dataCreate, expectedData, expectedFinalData);
  });

  it("pessimistic", async () => {
    let onLoadFn = jest.fn().mockImplementation(loadFn);
    let childrenFn = jest.fn().mockImplementation(getChildrenFn);
    let onBulkCreateFn = jest.fn().mockImplementation(createFn);

    const wrapper = mount(
      <UU5.Common.ListDataManager pessimistic onLoad={onLoadFn} onBulkCreate={onBulkCreateFn}>
        {childrenFn}
      </UU5.Common.ListDataManager>
    );

    let childrenParams = await loadTest("onLoad", wrapper, childrenFn, onLoadFn, null, data);

    // bulkCreate
    childrenParams.handleBulkCreate(dataCreate);

    // onBulkCreate
    let expectedFinalData = [...data, ...dataCreateFromServer];
    await testHandle("bulkCreate", wrapper, childrenFn, onBulkCreateFn, 2, dataCreate, data, expectedFinalData);
  });
});

describe(`UU5.Common.ListDataManager onBulkDelete`, () => {
  const dataDelete = [{ id: "3", name: "C" }, { id: "1", name: "A" }];
  const deleteFn = () => new Promise((resolve, reject) => resolve(dataDelete));

  it("optimistic", async () => {
    let onLoadFn = jest.fn().mockImplementation(loadFn);
    let childrenFn = jest.fn().mockImplementation(getChildrenFn);
    let onBulkDeleteFn = jest.fn().mockImplementation(deleteFn);

    const wrapper = mount(
      <UU5.Common.ListDataManager onLoad={onLoadFn} onBulkDelete={onBulkDeleteFn}>
        {childrenFn}
      </UU5.Common.ListDataManager>
    );

    let childrenParams = await loadTest("onLoad", wrapper, childrenFn, onLoadFn, null, data);

    // bulkDelete
    let ids = dataDelete.map(it => it.id);
    childrenParams.handleBulkDelete(ids);

    // onBulkDelete
    let expectedData = data.filter(it => !dataDelete.some(upIt => upIt.id === it.id));
    await testHandle("bulkDelete", wrapper, childrenFn, onBulkDeleteFn, 2, ids, expectedData);
  });

  it("pessimistic", async () => {
    let onLoadFn = jest.fn().mockImplementation(loadFn);
    let childrenFn = jest.fn().mockImplementation(getChildrenFn);
    let onBulkDeleteFn = jest.fn().mockImplementation(deleteFn);

    const wrapper = mount(
      <UU5.Common.ListDataManager pessimistic onLoad={onLoadFn} onBulkDelete={onBulkDeleteFn}>
        {childrenFn}
      </UU5.Common.ListDataManager>
    );

    let childrenParams = await loadTest("onLoad", wrapper, childrenFn, onLoadFn, null, data);

    // bulkDelete
    let ids = dataDelete.map(it => it.id);
    childrenParams.handleBulkDelete(ids);

    // onBulkDelete
    let expectedData = data.filter(it => !dataDelete.some(upIt => upIt.id === it.id));
    await testHandle("bulkDelete", wrapper, childrenFn, onBulkDeleteFn, 2, ids, data, expectedData);
  });
});
