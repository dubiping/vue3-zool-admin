import { defHttp } from '/@/utils/http/axios';
import { getAppEnvConfig } from '/@/utils/env';

// import { useUserStore } from '/@/store/modules/user';
import { USER_INFO_KEY } from '/@/enums/cacheEnum';
import { getAuthCache } from '/@/utils/auth';

const { VITE_GLOB_MODE_BASE } = getAppEnvConfig();

const SEARCH_PLAN_KEY = 'SEARCH_PLAN_KEY';
// const userStore = useUserStore();

/**
 * @description: 获取方案
 */
export function queryPlanList({ module }) {
  return new Promise((resolve) => {
    const cache = getStore();
    const list = (cache[module] || []).map((v) => {
      return {
        name: v.name,
        active: v.active,
        id: v.id,
      };
    });
    resolve(list);
  });
}

/**
 * @description: 获取方案下的搜索条件
 */
export function queryPlanOptions({ module, params }) {
  return new Promise((resolve) => {
    const cache = getStore();
    const item = (cache[module] || []).find((v) => v.id === params.id) || {};
    cache[module]?.forEach((v) => (v.active = false));
    item.active = true;
    setStore(cache);
    resolve(item?.prop || []);
  });
}

/**
 * @description: 新增方案
 */
export function addPlan({ module, params }) {
  return new Promise((resolve) => {
    const cache = getStore();
    if (!cache[module]) {
      cache[module] = [];
    }
    cache[module].forEach((v) => (v.active = false));
    cache[module].push({
      ...params,
      id: '' + Date.now(),
      active: true,
    });
    setStore(cache);
    resolve('');
  });
}

/**
 * @description: 修改方案
 */
export function updatePlan({ module, params }) {
  return new Promise((resolve) => {
    const cache = getStore();
    const index = cache[module].findIndex((v) => v.id === params.id);
    if (params.active) {
      cache[module].forEach((v) => (v.active = false));
    }
    if (index !== -1) {
      cache[module][index] = params;
    }
    setStore(cache);
    resolve('');
  });
}

/**
 * @description: 删除
 */
export function deletePlan({ module, params }) {
  return new Promise((resolve) => {
    const cache = getStore();
    const index = cache[module].findIndex((v) => v.id === params.id);
    if (index !== -1) {
      cache[module].splice(index, 1);
    }
    setStore(cache);
    resolve('');
  });
}

function getStore() {
  const { userId } = getAuthCache(USER_INFO_KEY) || {}; // userStore.getUserInfo;
  const key = `${SEARCH_PLAN_KEY}_${userId}`;
  return JSON.parse(localStorage.getItem(key) || '{}') || {};
}

function setStore(data) {
  const { userId } = getAuthCache(USER_INFO_KEY) || {};
  const key = `${SEARCH_PLAN_KEY}_${userId}`;
  localStorage.setItem(key, JSON.stringify(data));
}

export function test({ module, params }) {
  return defHttp.post({
    url: `${VITE_GLOB_MODE_BASE}/foundation/sysUserQueryPlan/getQueryPlanList/${module}`,
    params,
  });
}
