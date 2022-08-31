import { defHttp } from '/@/utils/http/axios';
import axios from 'axios';

export function getLoginInfo(params = {}): Promise<any> {
  // return defHttp.post<any>({ url: `/oauth/loginInfo`, params });
  return axios
    .request({
      url: '/loginInfo.json',
      method: 'GET',
      responseType: 'json',
      params,
    })
    .then((res) => {
      console.log(res);
      return res.data;
    });
}

// 获取登录地址
export function getSsoLoginUrl(params) {
  return defHttp.get<any>({ url: `/sso-client/client/login`, params });
}

//业务系统根据Token获取二级登录信息
export function secondLoginByToken(params) {
  return defHttp.post<any>({
    url: `/oauth/second/token`,
    params,
  });
}

// 业务系统用户切换应用
export function changeClient(params) {
  return defHttp.post<any>({
    url: `/sso-client/client/changeClient`,
    params,
  });
}
// grantCode 换取 token
export function loginByGrantCode(params) {
  return defHttp.post<any>({
    url: `/sso-client/client/grantToken`,
    params,
  });
}

export function doLogout() {
  return defHttp.get({ url: '/oauth/out' });
}

// 修改密码
export function updatePwd(params) {
  return defHttp.post<any>({
    url: `/account/center/updatePwd`,
    params,
  });
}
// 获取密码规则
export function queryPwdRuleById(params) {
  return defHttp.post<any>({
    url: `/account/center/pwdDesc/${params}`,
  });
}

export const queryPublicKey = (data) => {
  return defHttp.get({
    url: '/oauth/publicKey/' + data.userNo,
    method: 'get',
  });
};
