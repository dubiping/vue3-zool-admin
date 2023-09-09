import type { RouteLocationNormalized, RouteRecordNormalized } from 'vue-router';
import type { App, Plugin } from 'vue';

import { unref } from 'vue';
import { isArray, isFunction, isObject, isString } from '/@/utils/is';
import { dateUtil } from '/@/utils/dateUtil';
import { cloneDeep } from 'lodash-es';

export const noop = () => {};

/**
 * @description:  Set ui mount node
 */
export function getPopupContainer(node?: HTMLElement): HTMLElement {
  return (node?.parentNode as HTMLElement) ?? document.body;
}

/**
 * Add the object as a parameter to the URL
 * @param baseUrl url
 * @param obj
 * @returns {string}
 * eg:
 *  let obj = {a: '3', b: '4'}
 *  setObjToUrlParams('www.baidu.com', obj)
 *  ==>www.baidu.com?a=3&b=4
 */
export function setObjToUrlParams(baseUrl: string, obj: any): string {
  let parameters = '';
  for (const key in obj) {
    parameters += key + '=' + encodeURIComponent(obj[key]) + '&';
  }
  parameters = parameters.replace(/&$/, '');
  return /\?$/.test(baseUrl) ? baseUrl + parameters : baseUrl.replace(/\/?$/, '?') + parameters;
}

export function deepMerge<T = any>(src: any = {}, target: any = {}): T {
  let key: string;
  for (key in target) {
    src[key] = isObject(src[key]) ? deepMerge(src[key], target[key]) : (src[key] = target[key]);
  }
  return src;
}

export function openWindow(
  url: string,
  opt?: { target?: TargetContext | string; noopener?: boolean; noreferrer?: boolean },
) {
  const { target = '__blank', noopener = true, noreferrer = true } = opt || {};
  const feature: string[] = [];

  noopener && feature.push('noopener=yes');
  noreferrer && feature.push('noreferrer=yes');

  window.open(url, target, feature.join(','));
}

// dynamic use hook props
export function getDynamicProps<T, U>(props: T): Partial<U> {
  const ret: Recordable = {};

  Object.keys(props).map((key) => {
    ret[key] = unref((props as Recordable)[key]);
  });

  return ret as Partial<U>;
}

export function getRawRoute(route: RouteLocationNormalized): RouteLocationNormalized {
  if (!route) return route;
  const { matched, ...opt } = route;
  return {
    ...opt,
    matched: (matched
      ? matched.map((item) => ({
          meta: item.meta,
          name: item.name,
          path: item.path,
        }))
      : undefined) as RouteRecordNormalized[],
  };
}

export const withInstall = <T>(component: T, alias?: string) => {
  const comp = component as any;
  comp.install = (app: App) => {
    app.component(comp.name || comp.displayName, component);
    if (alias) {
      app.config.globalProperties[alias] = component;
    }
  };
  return component as T & Plugin;
};

export const getUrlParams = () => {
  const url = decodeURIComponent(window.location.href);
  const params: any = {};
  const urlSplits = url.split('?');
  const paramStr = urlSplits[1];
  if (paramStr) {
    paramStr.split('&')?.forEach((item) => {
      const key = item.split('=')[0];
      const value = item.split('=')[1];
      params[key] = value;
    });
  }
  return params;
};

type FieldMapToTime = [string, [string, string], string?][];
export const formateFormValues = (values: Recordable, fieldMapToTime?: FieldMapToTime) => {
  if (!isObject(values)) {
    return {};
  }

  const res: Recordable = {};
  for (const item of Object.entries(values)) {
    let [, value] = item;
    const [key] = item;
    if (!key || (isArray(value) && value.length === 0) || isFunction(value)) {
      continue;
    }
    // Remove spaces
    if (isString(value)) {
      value = value.trim() || null;
    }
    res[key] = value;
  }
  return handleRangeTimeValue(res, fieldMapToTime);
};

function handleRangeTimeValue(values: Recordable, fieldMapToTime?: FieldMapToTime) {
  if (!fieldMapToTime || !Array.isArray(fieldMapToTime)) {
    return values;
  }

  for (const [field, [startTimeKey, endTimeKey], format = 'YYYY-MM-DD'] of fieldMapToTime) {
    if (!field || !startTimeKey || !endTimeKey || !values[field]) {
      continue;
    }

    const [startTime, endTime]: string[] = values[field];

    values[startTimeKey] = dateUtil(startTime).format(format);
    values[endTimeKey] = dateUtil(endTime).format(format);
    Reflect.deleteProperty(values, field);
  }

  return values;
}

/**
 * tree translate Array
 * @param {Object} node
 * @returns
 */
export function translateTreeToArr(node, fn?: Function) {
  const cloneNode = cloneDeep(node);
  const queue = Array.isArray(cloneNode) ? [...cloneNode] : [cloneNode];
  const data: any = [];
  while (queue.length !== 0) {
    const item = queue.shift();
    const children = item.children;
    const hasChildren = !!(children && children.length);
    delete item.children;
    data.push({ ...(isFunction(fn) ? fn({ ...item, hasChildren }) : { ...item, hasChildren }) });
    if (children) {
      for (let i = 0; i < children.length; i++) {
        queue.push(children[i]);
      }
    }
  }
  return data;
}

export function translateTreeData(data: any[], fn?: Function) {
  data.forEach((v) => {
    isFunction(fn) && fn(v);
    if (v.children && v.children.length) {
      translateTreeData(v.children, fn);
    }
  });
  return data;
}

export function translateTreeMap(node, id = 'id') {
  const map: any = {};
  const queue = Array.isArray(node) ? [...node] : [node];
  while (queue.length !== 0) {
    const item = queue.shift();
    const children = item.children;
    map[item[id]] = item;
    if (children) {
      for (let i = 0; i < children.length; i++) {
        queue.push(children[i]);
      }
    }
  }
  return map;
}

export function getTreeSuperiorIds(dataMap, curId, containSelf = true) {
  if (!dataMap || !curId) return [];

  const ids: string[] = [];
  let item = dataMap[curId];
  if (!containSelf) {
    item = item ? dataMap[item.parentId] : null;
  }
  while (item) {
    ids.push(item.id);
    item = dataMap[item.parentId];
  }
  return ids;
}
