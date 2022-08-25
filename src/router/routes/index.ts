import type { AppRouteRecordRaw, AppRouteModule } from '/@/router/types';

import { PAGE_NOT_FOUND_ROUTE, REDIRECT_ROUTE } from '/@/router/routes/basic';

// import { mainOutRoutes } from './mainOut';
import { PageEnum } from '/@/enums/pageEnum';
import { LAYOUT } from '/@/router/constant';
import { t } from '/@/hooks/web/useI18n';

const modules = import.meta.glob('./modules/**/*.ts');

const routeModuleList: AppRouteModule[] = [];

Object.keys(modules).forEach((key) => {
  modules[key]().then((res: any) => {
    const mod = res.default || {};
    const modList = Array.isArray(mod) ? [...mod] : [mod];
    routeModuleList.push(...modList);
  });
});

export const asyncRoutes = [PAGE_NOT_FOUND_ROUTE, ...routeModuleList];

export const RootRoute: AppRouteRecordRaw = {
  path: '/',
  name: 'Root',
  component: LAYOUT,
  redirect: PageEnum.BASE_HOME,
  meta: {
    title: 'Root',
  },
  children: [
    {
      path: 'dashboard',
      name: 'Dashboard',
      component: () => import('/@/views/dashboard/index.vue'),
      meta: { title: t('routes.dashboard') },
    },
  ],
};

export const LoginRoute: AppRouteRecordRaw = {
  path: '/login',
  component: () => import('/@/views/login/index.vue'),
  name: 'Login',
  meta: { title: t('routes.login') },
};

// Basic routing without permission
export const basicRoutes = [
  LoginRoute,
  RootRoute,
  // ...mainOutRoutes,
  REDIRECT_ROUTE,
  PAGE_NOT_FOUND_ROUTE,
];
