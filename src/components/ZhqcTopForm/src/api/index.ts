import { defHttp } from '/@/utils/http/axios';
import { getAppEnvConfig } from '/@/utils/env';

const { VITE_GLOB_MODE_BASE } = getAppEnvConfig();

/**
 * @description: 获取方案
 */
export function queryPlanList({ params }) {
  return defHttp.post({
    url: `${VITE_GLOB_MODE_BASE}/front/dyTable/findQuery`,
    params,
  });
}

/**
 * @description: 获取方案下的搜索条件
 */
export function queryPlanOptions({ params }) {
  return defHttp.post({
    url: `${VITE_GLOB_MODE_BASE}/front/dyTable/activeQuery/${params.id}`,
  });
}

/**
 * @description: 新增方案
 */
export function addPlan({ params }) {
  return defHttp.post({
    url: `${VITE_GLOB_MODE_BASE}/front/dyTable/query/saveOrUpdate`,
    params,
  });
}

/**
 * @description: 删除
 */
export function deletePlan({ params }) {
  return defHttp.post({
    url: `${VITE_GLOB_MODE_BASE}//front/dyTable/deleteQuery/${params.id}`,
    params,
  });
}

// const queueList: any = [
//   {
//     key: '11',
//     name: '测试1',
//     dtList: [
//       {
//         field: 'tenantId',
//         value: '133',
//       },
//       {
//         field: 'macAddr',
//         value: '666',
//       },
//     ],
//   },
//   {
//     key: '22',
//     name: '测试2',
//     dtList: [
//       {
//         field: 'tenantId',
//         value: '',
//       },
//       {
//         field: 'macAddr',
//         value: '',
//       },
//       {
//         field: 'addrDesc2',
//         value: '',
//       },
//     ],
//   },
// ];

// export function queryPlanList({ params }) {
//   return Promise.resolve(queueList);
// }

// export function queryPlanOptions({ params }) {
//   const item = queueList.find((v) => params.id === v.key) || {};
//   return Promise.resolve(item);
// }

// export function addPlan({ params }) {
//   queueList.push({
//     ...params,
//     key: '' + Date.now(),
//   });
//   return Promise.resolve({});
// }

// /**
//  * @description: 删除
//  */
// export function deletePlan({ params }) {
//   const index = queueList.findIndex((v) => params.id === v.key);
//   if (index !== -1) {
//     queueList.splice(index, 1);
//   }
//   return Promise.resolve({});
// }
