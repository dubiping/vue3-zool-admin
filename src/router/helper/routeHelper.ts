import type { AppRouteModule, AppRouteRecordRaw } from '/@/router/types';
import type { Router, RouteRecordNormalized } from 'vue-router';
import type { MenuRecordRaw } from '/@/api/type';

import { getParentLayout, LAYOUT, EXCEPTION_COMPONENT } from '/@/router/constant';
import { cloneDeep, omit } from 'lodash-es';
import { warn } from '/@/utils/log';
import { createRouter, createWebHashHistory } from 'vue-router';
import { treeMap } from '/@/utils/helper/treeHelper';
import { useLocale } from '/@/locales/useLocale';

const { getLocale } = useLocale();

export type LayoutMapKey = 'LAYOUT';
// const IFRAME = () => import('/@/views/sys/iframe/FrameBlank.vue');

const LayoutMap = new Map<string, () => Promise<typeof import('*.vue')>>();

LayoutMap.set('LAYOUT', LAYOUT);
// LayoutMap.set('IFRAME', IFRAME);

let dynamicViewsModules: Record<string, () => Promise<Recordable>>;

// Dynamic introduction
function asyncImportRoute(routes: AppRouteRecordRaw[] | undefined) {
  dynamicViewsModules = dynamicViewsModules || import.meta.glob('../../views/**/*.{vue,tsx}');
  if (!routes) return;
  routes.forEach((item) => {
    if (!item.component && item.meta?.frameSrc) {
      item.component = 'IFRAME';
    }
    const { component, name, children } = item;
    if (component) {
      const layoutFound = LayoutMap.get(component.toUpperCase());
      if (layoutFound) {
        item.component = layoutFound;
      } else {
        item.component = dynamicImport(dynamicViewsModules, component as string);
      }
    } else if (name) {
      item.component = getParentLayout();
    }
    children && asyncImportRoute(children);
  });
}

function asyncImportRouteSingle(item: AppRouteRecordRaw | undefined) {
  dynamicViewsModules = dynamicViewsModules || import.meta.glob('../../page/**/index.{vue,tsx}');
  if (!item) return;
  if (!item.component && item.meta?.frameSrc) {
    item.component = 'IFRAME';
  }
  const { component, name } = item;
  if (component) {
    const layoutFound = LayoutMap.get(component.toUpperCase());
    if (layoutFound) {
      item.component = layoutFound;
    } else {
      item.component = dynamicImport(dynamicViewsModules, component as string);
    }
  } else if (name) {
    item.component = getParentLayout();
  }
}

function dynamicImport(
  dynamicViewsModules: Record<string, () => Promise<Recordable>>,
  component: string,
) {
  const keys = Object.keys(dynamicViewsModules);
  const matchKeys = keys.filter((key) => {
    const k = key.replace('../..', '');
    const startFlag = component.startsWith('/');
    const endFlag = component.endsWith('.vue') || component.endsWith('.tsx');
    const startIndex = startFlag ? 0 : 1;
    const lastIndex = endFlag ? k.length : k.lastIndexOf('.');
    return k.substring(startIndex, lastIndex) === component;
  });
  if (matchKeys?.length === 1) {
    const matchKey = matchKeys[0];
    return dynamicViewsModules[matchKey];
  } else if (matchKeys?.length > 1) {
    warn(
      'Please do not create `.vue` and `.TSX` files with the same file name in the same hierarchical directory under the views folder. This will cause dynamic introduction failure',
    );
    return;
  } else {
    warn('在src/page/下找不到`' + component + '.vue` 或 `' + component + '.tsx`, 请自行创建!');
    return EXCEPTION_COMPONENT;
  }
}
export function transformObjToRoute<T = MenuRecordRaw>(routeList: MenuRecordRaw[]): T[] {
  const routeChildren = treeMap(routeList, {
    conversion(item) {
      const temp = {
        path: item.path || dealPath(item.pageRoute),
        name: dealName(item.menuNameEn),
        meta: {
          title: getLocale.value === 'en' ? item.menuNameEn : item.menuNameZh,
          icon: item.icon || item.menuIcon, // 配置图标
          pageOpKeyList: item.pageOpList,
          fieldList: item.fieldList,
          menuId: item.id,
        },
        ...(item.pageRoute ? { component: item.pageRoute } : {}),
      };
      asyncImportRouteSingle(temp);
      return temp;
    },
  });

  const routes = [
    {
      path: '',
      name: 'pageParent',
      component: LAYOUT,
      children: routeChildren,
    },
  ];
  return routes as unknown as T[];
}

// 将路由中的 / 替换成 -
function dealPath(pageRoute: string) {
  pageRoute = pageRoute.startsWith('/') ? pageRoute.substring(1) : pageRoute;
  pageRoute = pageRoute.replace(/\//g, '_');
  return `/${pageRoute}`;
}

function dealName(name: string) {
  const list = name.split(' ').filter((val) => val);
  return list.reduce((str, val) => {
    return (str += val[0].toUpperCase() + val.substring(1).toLowerCase());
  }, '');
}

// Turn background objects into routing objects
// export function transformObjToRoute<T = AppRouteModule>(routeList: AppRouteModule[]): T[] {
//   routeList.forEach((route) => {
//     const component = route.component as string;
//     if (component) {
//       if (component.toUpperCase() === 'LAYOUT') {
//         route.component = LayoutMap.get(component.toUpperCase());
//       } else {
//         route.children = [cloneDeep(route)];
//         route.component = LAYOUT;
//         route.name = `${route.name}Parent`;
//         route.path = '';
//         const meta = route.meta || {};
//         meta.single = true;
//         meta.affix = false;
//         route.meta = meta;
//       }
//     } else {
//       warn('请正确配置路由：' + route?.name + '的component属性');
//     }
//     route.children && asyncImportRoute(route.children);
//   });
//   return routeList as unknown as T[];
// }

/**
 * Convert multi-level routing to level 2 routing
 */
export function flatMultiLevelRoutes(routeModules: AppRouteModule[]) {
  const modules: AppRouteModule[] = cloneDeep(routeModules);
  for (let index = 0; index < modules.length; index++) {
    const routeModule = modules[index];
    if (!isMultipleRoute(routeModule)) {
      continue;
    }
    promoteRouteLevel(routeModule);
  }
  return modules;
}

// Routing level upgrade
function promoteRouteLevel(routeModule: AppRouteModule) {
  // Use vue-router to splice menus
  let router: Router | null = createRouter({
    routes: [routeModule as unknown as RouteRecordNormalized],
    history: createWebHashHistory(),
  });

  const routes = router.getRoutes();
  addToChildren(routes, routeModule.children || [], routeModule);
  router = null;

  routeModule.children = routeModule.children?.map((item) => omit(item, 'children'));
}

// Add all sub-routes to the secondary route
function addToChildren(
  routes: RouteRecordNormalized[],
  children: AppRouteRecordRaw[],
  routeModule: AppRouteModule,
) {
  for (let index = 0; index < children.length; index++) {
    const child = children[index];
    const route = routes.find((item) => item.name === child.name);
    if (!route) {
      continue;
    }
    routeModule.children = routeModule.children || [];
    if (!routeModule.children.find((item) => item.name === route.name)) {
      routeModule.children?.push(route as unknown as AppRouteModule);
    }
    if (child.children?.length) {
      addToChildren(routes, child.children, routeModule);
    }
  }
}

// Determine whether the level exceeds 2 levels
function isMultipleRoute(routeModule: AppRouteModule) {
  if (!routeModule || !Reflect.has(routeModule, 'children') || !routeModule.children?.length) {
    return false;
  }

  const children = routeModule.children;

  let flag = false;
  for (let index = 0; index < children.length; index++) {
    const child = children[index];
    if (child.children?.length) {
      flag = true;
      break;
    }
  }
  return flag;
}
