<script lang="ts" name="LayoutHeader" setup>
  import { AppLogo } from '/@/components/Application';
  import { AppSearch } from '/@/components/Application';
  import { AppLocalePicker } from '/@/components/Application';

  import LayoutMenu from '../Menu/index.vue';
  import LayoutTrigger from '../Trigger/index.vue';
  import { UserDropDown, LayoutBreadcrumb, FullScreen, Notify, ErrorAction } from './components';

  import { useHeaderSetting } from '/@/hooks/setting/useHeaderSetting';
  import { useMenuSetting } from '/@/hooks/setting/useMenuSetting';
  import { useRootSetting } from '/@/hooks/setting/useRootSetting';
  import { useAppInject } from '/@/hooks/web/useAppContext';
  import { useDesign } from '/@/hooks/web/useDesign';

  import { createAsyncComponent } from '/@/utils/factory/createAsyncComponent';
  import { useLocale } from '/@/locales/useLocale';

  import { MenuModeEnum, MenuSplitTyeEnum } from '/@/enums/menuEnum';
  import { SettingButtonPositionEnum } from '/@/enums/appEnum';

  const props = defineProps({
    fixed: {
      type: Boolean,
      default: false,
    },
  });

  const SettingDrawer = createAsyncComponent(
    () => import('/@/layouts/components/Setting/index.vue'),
    {
      loading: true,
    },
  );

  const { prefixCls } = useDesign('layout-header');
  const {
    getShowTopMenu,
    getShowHeaderTrigger,
    getSplit,
    getIsMixMode,
    getMenuWidth,
    getIsMixSidebar,
  } = useMenuSetting();
  const { getUseErrorHandle, getShowSettingButton, getSettingButtonPosition } = useRootSetting();

  const {
    getHeaderTheme,
    getShowFullScreen,
    getShowNotice,
    getShowContent,
    getShowBread,
    getShowHeaderLogo,
    getShowHeader,
    getShowSearch,
  } = useHeaderSetting();

  const { getShowLocalePicker } = useLocale();

  const { getIsMobile } = useAppInject();

  const getHeaderClass = computed(() => {
    const theme = unref(getHeaderTheme);
    return [
      prefixCls,
      {
        [`${prefixCls}--fixed`]: props.fixed,
        [`${prefixCls}--mobile`]: unref(getIsMobile),
        [`${prefixCls}--${theme}`]: theme,
      },
    ];
  });

  const getShowSetting = computed(() => {
    if (!unref(getShowSettingButton)) {
      return false;
    }
    const settingButtonPosition = unref(getSettingButtonPosition);

    if (settingButtonPosition === SettingButtonPositionEnum.AUTO) {
      return unref(getShowHeader);
    }
    return settingButtonPosition === SettingButtonPositionEnum.HEADER;
  });

  const getLogoWidth = computed(() => {
    if (!unref(getIsMixMode) || unref(getIsMobile)) {
      return {};
    }
    const width = unref(getMenuWidth) < 180 ? 180 : unref(getMenuWidth);
    return { width: `${width}px` };
  });

  const getSplitType = computed(() => {
    return unref(getSplit) ? MenuSplitTyeEnum.TOP : MenuSplitTyeEnum.NONE;
  });

  const getMenuMode = computed(() => {
    return unref(getSplit) ? MenuModeEnum.HORIZONTAL : null;
  });
</script>
<template>
  <a-layout-header :class="getHeaderClass">
    <div :class="`${prefixCls}-left`">
      <!-- logo -->
      <AppLogo
        v-if="getShowHeaderLogo || getIsMobile"
        :class="`${prefixCls}-logo`"
        :theme="getHeaderTheme"
        :style="getLogoWidth"
      />
      <LayoutTrigger
        v-if="
          (getShowContent && getShowHeaderTrigger && !getSplit && !getIsMixSidebar) || getIsMobile
        "
        :theme="getHeaderTheme"
        :sider="false"
      />
      <LayoutBreadcrumb v-if="getShowContent && getShowBread" :theme="getHeaderTheme" />
    </div>
    <!-- menu start -->
    <div :class="`${prefixCls}-menu`" v-if="getShowTopMenu && !getIsMobile"> 11 </div>
    <!-- action  -->
    <div :class="`${prefixCls}-action`">
      <AppSearch :class="`${prefixCls}-action__item `" v-if="getShowSearch" />

      <ErrorAction v-if="getUseErrorHandle" :class="`${prefixCls}-action__item error-action`" />

      <Notify v-if="getShowNotice" :class="`${prefixCls}-action__item notify-item`" />

      <FullScreen v-if="getShowFullScreen" :class="`${prefixCls}-action__item fullscreen-item`" />

      <AppLocalePicker
        v-if="getShowLocalePicker"
        :reload="true"
        :showText="false"
        :class="`${prefixCls}-action__item`"
      />

      <UserDropDown :theme="getHeaderTheme" />

      <SettingDrawer v-if="getShowSetting" :class="`${prefixCls}-action__item`" />
    </div>
  </a-layout-header>
</template>
<style lang="less">
  @import './index.less';
</style>
