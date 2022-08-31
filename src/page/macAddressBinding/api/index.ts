import { defHttp } from '/@/utils/http/axios';
import { getAppEnvConfig } from '/@/utils/env';

const { VITE_GLOB_MODE_BASE } = getAppEnvConfig();

/**
 * @description: 根据数据控制项获取数据控制范围
 */
export function listTenantDp({ module, params }) {
  return defHttp.post({
    url: `${VITE_GLOB_MODE_BASE}/${module}/listDetail/${params.tenantId}/${params.fieldCode}`,
  });
}

export function testApp(params) {
  return defHttp.post({
    url: `${VITE_GLOB_MODE_BASE}/client/appLogin`,
    params,
  });
}
