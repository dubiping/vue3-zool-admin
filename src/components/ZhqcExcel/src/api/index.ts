import { defHttp } from '/@/utils/http/axios';
import { getAppEnvConfig } from '/@/utils/env';

const { VITE_GLOB_MODE_BASE } = getAppEnvConfig();

export function importData({ url, params }) {
  return defHttp.uploadFile<any>(
    {
      url,
      timeout: 500000,
      responseType: 'blob',
    },
    params,
  );
}

/**
 * @description: 导出数据
 */
export function exportData({ url, params }) {
  return defHttp.post<any>(
    {
      url: `${VITE_GLOB_MODE_BASE}/${url}`,
      params,
      responseType: 'blob',
      timeout: 3000000, // 请求超时时间5分钟
      headers: {
        'Content-Type': 'application/json',
      },
    },
    {
      isTransformResponse: false,
    },
  );
}
/**
 * @description: 导出模板
 */
export function exportTemplate({ url, params }) {
  return defHttp.post<any>(
    {
      url: `${VITE_GLOB_MODE_BASE}/${url}`,
      params,
      responseType: 'blob',
      timeout: 50000, // 请求超时时间5分钟
      headers: {
        'Content-Type': 'application/json',
      },
    },
    {
      isTransformResponse: false,
    },
  );
}
