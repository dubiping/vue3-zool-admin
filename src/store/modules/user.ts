import type { UserInfo } from '/#/store';
import { defineStore } from 'pinia';
import { store } from '/@/store';
import { PageEnum } from '/@/enums/pageEnum';
import {
  TOKEN_KEY,
  USER_INFO_KEY,
  SSO_URL_KEY,
  REFRESH_TOKEN_KEY,
  CURRENT_CLIENT_KEY,
} from '/@/enums/cacheEnum';
import { getAuthCache, setAuthCache } from '/@/utils/auth';
import {
  getSsoLoginUrl,
  getLoginInfo,
  secondLoginByToken,
  changeClient,
  loginByGrantCode,
  doLogout,
} from '/@/api/user';
import { useI18n } from '/@/hooks/web/useI18n';
import { useMessage } from '/@/hooks/web/useMessage';
import { router } from '/@/router';
import { usePermissionStore } from '/@/store/modules/permission';
import { RouteRecordRaw } from 'vue-router';
import { PAGE_NOT_FOUND_ROUTE } from '/@/router/routes/basic';
import { h } from 'vue';
import { useLocale } from '/@/locales/useLocale';

interface UserState {
  userInfo: Nullable<UserInfo>;
  token?: string;
  refreshToken?: string;
  ssoUrl?: string;
  secondLoginInfo: any;
  currentClient: string;
}

export const useUserStore = defineStore({
  id: 'app-user',
  state: (): UserState => ({
    // user info
    userInfo: null,
    // token
    token: 'undefined',
    refreshToken: undefined,
    // sso跳转地址
    ssoUrl: undefined,
    // 切换应用信息
    secondLoginInfo: null,
    // 用于切换应用显示当前默认应用
    currentClient: '',
  }),
  getters: {
    getUserInfo(): UserInfo {
      return this.userInfo || getAuthCache<UserInfo>(USER_INFO_KEY) || {};
    },
    getToken(): string {
      return this.token || getAuthCache<string>(TOKEN_KEY);
    },

    getRefreshToken(): string {
      return this.refreshToken || getAuthCache<string>(REFRESH_TOKEN_KEY);
    },
    getSSoUrl(): string {
      return this.ssoUrl || getAuthCache<string>(SSO_URL_KEY);
    },
    getSecondLoginInfo(): any {
      return this.secondLoginInfo;
    },
    getCurrentClient(): string {
      return this.currentClient || getAuthCache(CURRENT_CLIENT_KEY) || '';
    },
  },
  actions: {
    setToken(info: string | undefined) {
      this.token = info ? info : ''; // for null or undefined value
      setAuthCache(TOKEN_KEY, info);
    },
    setUserInfo(info: UserInfo | null) {
      this.userInfo = info;
      setAuthCache(USER_INFO_KEY, info);
    },
    setSsoUrl(info: string | undefined) {
      this.ssoUrl = info ? info : ''; // for null or undefined value
      setAuthCache(SSO_URL_KEY, info);
    },
    setRefreshToken(info: string | undefined, isSave = true) {
      this.refreshToken = info ? info : ''; // for null or undefined value
      isSave && setAuthCache(REFRESH_TOKEN_KEY, info);
    },
    setSecondLoginInfo(info: any) {
      this.secondLoginInfo = info;
    },
    setCurrentClient(info: string) {
      this.currentClient = info;
      setAuthCache(CURRENT_CLIENT_KEY, info);
    },

    resetState() {
      this.userInfo = null;
      this.token = '';
    },
    // 判断是否是单应用单仓库
    isSingleApp(tenantList) {
      if (!tenantList) return true;
      if (tenantList && tenantList.length === 1) {
        const item = tenantList[0];
        if (item.otherList && item.otherList.length === 1) {
          const temp = item.otherList[0];
          if (!temp.otherMap) {
            return true;
          } else {
            const otherMap: any[] = Object.values(temp.otherMap);
            const orgWh = otherMap[0] || [];
            // 单个组织和仓库直接登录
            if (otherMap && otherMap.length === 1 && orgWh.length === 1) {
              return true;
            }
          }
        }
      }
      return false;
    },
    // 获取sso跳转页面
    async jumpSsoLogin() {
      const extra = {};
      const res = await getSsoLoginUrl({
        ...extra,
      });
      this.setSsoUrl(res);
      window.location = res;
    },
    // 获取二级登录信息，用于切换应用
    async secondLoginByToken() {
      if (this.secondLoginInfo) return;
      const res = await secondLoginByToken({});
      this.setSecondLoginInfo(res);

      const { changeLocale } = useLocale();
      let lang = res.userLanguage || '';
      if (lang.includes('zh')) {
        lang = 'zh_CN';
      } else if (lang.includes('en')) {
        lang = 'en';
      }
      changeLocale(lang || 'zh_CN');
    },
    async changeClient(data: any = {}, isSaveToken = false) {
      const params = {
        ...data,
        refreshToken: this.getRefreshToken,
        extendMap: {
          ...data.extendMap,
          ip_addr: (window as any).returnCitySN?.cip || '',
        },
      };
      const res = await changeClient(params);
      if (isSaveToken) {
        const { access_token, refresh_token } = res;
        this.setRefreshToken(refresh_token);
        this.setToken(access_token);
      }

      return res;
    },
    async changeLanguage(lang) {
      if (lang.includes('zh')) {
        lang = 'zh-CN';
      } else if (lang.includes('en')) {
        lang = 'en-US';
      }
      const Ids = this.getCurrentClient.split(',') || [];
      const res = await changeClient({
        clientId: Ids[1],
        refreshToken: this.getRefreshToken,
        extendMap: {
          user_language: lang,
        },
      });
      const { access_token, refresh_token } = res;
      this.setRefreshToken(refresh_token);
      this.setToken(access_token);
    },

    async loginByGrantCode(data: any = {}) {
      const res = await loginByGrantCode(data);
      const { access_token, refresh_token } = res;
      this.setRefreshToken(refresh_token);
      this.setToken(access_token);
      return res;
    },
    async afterLoginAction(goHome?: boolean) {
      if (!this.getToken) return null;
      // get user info
      const { menus } = await this.getUserInfoAction();

      const permissionStore = usePermissionStore();
      if (!permissionStore.isDynamicAddedRoute) {
        const routes = await permissionStore.buildRoutesAction(menus?.children || []);
        routes.forEach((route) => {
          router.addRoute(route as unknown as RouteRecordRaw);
        });
        router.addRoute(PAGE_NOT_FOUND_ROUTE as unknown as RouteRecordRaw);
        permissionStore.setDynamicAddedRoute(true);
      }
      goHome && (await router.replace(PageEnum.BASE_HOME));
    },
    async getUserInfoAction() {
      if (!this.getToken) return null;
      const res = await getLoginInfo();

      const { user = {} } = res;
      this.setUserInfo({
        ...user,
        userId: user.userNo,
        username: user.userName,
        realName: user.userName,
      });
      return res;
    },
    /**
     * @description: logout
     */
    async logout(goLogin = false) {
      if (this.getToken) {
        try {
          await doLogout();
        } catch {
          console.log('注销Token失败');
        }
      }
      this.setToken(undefined);
      this.setUserInfo(null);
      goLogin && router.push(PageEnum.BASE_LOGIN);
    },

    /**
     * @description: Confirm before logging out
     */
    confirmLoginOut() {
      const { createConfirm } = useMessage();
      const { t } = useI18n();
      createConfirm({
        iconType: 'warning',
        title: () => h('span', t('sys.app.logoutTip')),
        content: () => h('span', t('sys.app.logoutMessage')),
        onOk: async () => {
          await this.logout(true);
        },
      });
    },
  },
});

// Need to be used outside the setup
export function useUserStoreWithOut() {
  return useUserStore(store);
}
