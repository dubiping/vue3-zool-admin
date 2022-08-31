import { defHttp } from '/@/utils/http/axios';
import { getAppEnvConfig } from '/@/utils/env';

const { VITE_GLOB_MODE_BASE } = getAppEnvConfig();

type ApiParam = {
  module?: string;
  params?: any;
  [propName: string]: any;
};

/**
 * @description: 分页列表
 */
export function queryApi({ module, params, apiUrl }: ApiParam) {
  return defHttp.post<any>({
    url: `${VITE_GLOB_MODE_BASE}/${module}${apiUrl}`,
    params,
  });
}

/**
 * @description: 初始化数据
 */
export function initPage({ module }: ApiParam) {
  return defHttp.post<any>({
    url: `${VITE_GLOB_MODE_BASE}/${module}/initPage`,
  });
}

/**
 * @description: 分页列表
 */
export function queryPage({ module, params }: ApiParam) {
  return defHttp.post<any>({
    url: `${VITE_GLOB_MODE_BASE}/${module}/page`,
    params,
  });
}

/**
 * @description: 不分页列表
 */
export function queryList({ module, params }: ApiParam) {
  return defHttp.post<any>({
    url: `${VITE_GLOB_MODE_BASE}/${module}/list`,
    params,
  });
}

/**
 * @description: 获取行数据
 */
export function queryRow({ module, params }: ApiParam) {
  return defHttp.post<any>({
    url: `${VITE_GLOB_MODE_BASE}/${module}/get/${params}`,
  });
}

/**
 * @description: 删除行数据
 */
export function deleteRow({ module, params }: ApiParam) {
  return defHttp.post<any>({
    url: `${VITE_GLOB_MODE_BASE}/${module}/delete/${params}`,
  });
}

/**
 * @description: 新增
 */
export function addData({ module, params }: ApiParam) {
  return defHttp.post<any>({
    url: `${VITE_GLOB_MODE_BASE}/${module}/add`,
    params,
  });
}

/**
 * @description: 修改
 */
export function updateData({ module, params }: ApiParam) {
  return defHttp.post<any>({
    url: `${VITE_GLOB_MODE_BASE}/${module}/update`,
    params,
  });
}

/**
 * @description: 新增修改保存
 */
export function saveOrUpdate({ module, params }: ApiParam) {
  return defHttp.post<any>({
    url: `${VITE_GLOB_MODE_BASE}/${module}/update`,
    params,
  });
}

/**
 * @description: 启用行数据
 */
export function enableRow({ module, params }: ApiParam) {
  return defHttp.post<any>({
    url: `${VITE_GLOB_MODE_BASE}/${module}/enable/${params}`,
  });
}

/**
 * @description: 停用行数据
 */
export function disableRow({ module, params }: ApiParam) {
  return defHttp.post<any>({
    url: `${VITE_GLOB_MODE_BASE}/${module}/disable/${params}`,
  });
}

/**
 * @description: 批量启用
 */
export function enableBatch({ module, params }: ApiParam) {
  return defHttp.post<any>({
    url: `${VITE_GLOB_MODE_BASE}/${module}/enable/batch`,
    params,
  });
}

/**
 * @description: 批量停用
 */
export function disableBatch({ module, params }: ApiParam) {
  return defHttp.post<any>({
    url: `${VITE_GLOB_MODE_BASE}/${module}/disable/batch`,
    params,
  });
}

/**
 * @description: 批量删除
 */
export function deleteBatch({ module, params }: ApiParam) {
  return defHttp.post<any>({
    url: `${VITE_GLOB_MODE_BASE}/${module}/delete/batch`,
    params,
  });
}

/**
 * @description: 获取组织下的员工信息
 */
export function queryStaffList({ module, params }: ApiParam) {
  return defHttp.post<any>({
    url: `${VITE_GLOB_MODE_BASE}/${module}/listOrgPerson`,
    params,
  });
}

/**
 * @description: 获取国家,省市列表
 */
export function areaPage({ module, params }: ApiParam) {
  return defHttp.post<any>({
    url: `${VITE_GLOB_MODE_BASE}/${module}/page`,
    params,
  });
}

/**
 * @description: 获取国家
 */
export function queryCountryList() {
  return defHttp.get<any>({
    url: `${VITE_GLOB_MODE_BASE}/zhqc-frame-component-place/country/queryCountryList`,
  });
}

/**
 * @description: 获取省列表
 */
export function queryProvinceList(params: ApiParam) {
  return defHttp.get<any>({
    url: `${VITE_GLOB_MODE_BASE}/zhqc-frame-component-place/province/queryProvinceList/${params}`,
  });
}

/**
 * @description: 获取市列表
 */
export function queryCityList(params: ApiParam) {
  return defHttp.get<any>({
    url: `${VITE_GLOB_MODE_BASE}/zhqc-frame-component-place/city/queryCityList/${params}`,
  });
}

/**
 * @description: 获取区列表
 */
export function queryAreaList(params: ApiParam) {
  return defHttp.get<any>({
    url: `${VITE_GLOB_MODE_BASE}/zhqc-frame-component-place/area/queryAreaList/${params}`,
  });
}

/**
 * @description: 获取街道列表
 */
export function queryTownList(params: ApiParam) {
  return defHttp.get<any>({
    url: `${VITE_GLOB_MODE_BASE}/zhqc-frame-component-place/town/queryTownList/${params}`,
  });
}
/**
 * @description: 获取地区列表
 */
export function queryDistrictListForSelect(params: ApiParam) {
  return defHttp.get<any>({
    url: `${VITE_GLOB_MODE_BASE}/district/queryDistrictListForSelect/${params}`,
  });
}

/**
 * @description:分配权限
 */
export function queryAssignPermission({ module, params }: ApiParam) {
  return defHttp.post<any>({
    url: `${VITE_GLOB_MODE_BASE}/${module}/assignPermission`,
    params,
  });
}

/**
 * @description:查询动态列
 */
export function queryTableCols(params) {
  return defHttp.post<any>({
    url: `${VITE_GLOB_MODE_BASE}/front/dyTable/findDyTableDtListDtByUnionKey`,
    params,
  });
}

/**
 * @description:保存动态列
 */
export function saveTableCols(params) {
  return defHttp.post<any>({
    url: `${VITE_GLOB_MODE_BASE}/front/dyTable/saveOrUpdate`,
    params,
  });
}
