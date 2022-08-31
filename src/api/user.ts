import { defHttp } from '/@/utils/http/axios';
import axios from 'axios';

export function getLoginInfo(): Promise<any> {
  return axios
    .request({
      url: '/loginInfo.json',
      method: 'GET',
      responseType: 'json',
    })
    .then((res) => {
      console.log(res);
      return res.data;
    });
}

export function doLogout() {
  return defHttp.get({ url: '/logout' });
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
