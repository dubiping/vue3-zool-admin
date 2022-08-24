import { defHttp } from '/@/utils/http/axios';
import axios from 'axios';

export function getLoginInfo(): Promise<any> {
  return axios
    .request({
      url: '/loginInfo2.json',
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
