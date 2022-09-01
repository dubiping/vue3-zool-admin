<script lang="ts" setup>
  import LayoutContent from './components/Content/index.vue';
  import LayoutHeader from './components/Header/index.vue';
  import LayoutMultipleHeader from './components/Header/MultipleHeader.vue';
  import LayoutSideBar from './components/Sider/index.vue';
  import LayoutFooter from './components/Footer/index.vue';
  import LayoutFeatures from './components/Feature/index.vue';

  import { useHeaderSetting } from '/@/hooks/setting/useHeaderSetting';
  import { useMenuSetting } from '/@/hooks/setting/useMenuSetting';
  import { useDesign } from '/@/hooks/web/useDesign';
  import { useLockPage } from '/@/hooks/web/useLockPage';
  import { useAppInject } from '/@/hooks/web/useAppContext';
  import { createAsyncComponent } from '/@/utils/factory/createAsyncComponent';

  // const LayoutFeatures = createAsyncComponent(() => import('./components/Feature/index.vue'));

  const { prefixCls } = useDesign('default-layout');
  const { getIsMobile } = useAppInject();
  const { getShowFullHeaderRef } = useHeaderSetting();
  const { getShowSidebar, getIsMixSidebar, getShowMenu } = useMenuSetting();

  // Create a lock screen monitor
  const lockEvents = useLockPage();

  const layoutClass = computed(() => {
    let cls: string[] = ['ant-layout'];
    if (unref(getIsMixSidebar) || unref(getShowMenu)) {
      cls.push('ant-layout-has-sider');
    }
    return cls;
  });
</script>

<template>
  <a-layout :class="prefixCls" v-bind="lockEvents">
    <LayoutFeatures />
    <LayoutHeader fixed v-if="getShowFullHeaderRef" />
    <a-layout :class="[layoutClass]">
      <LayoutSideBar v-if="getShowSidebar || getIsMobile" />
      <a-layout :class="`${prefixCls}-main`">
        <LayoutMultipleHeader />
        <LayoutContent />
        <LayoutFooter />
      </a-layout>
    </a-layout>
  </a-layout>
</template>
<style lang="less">
  @prefix-cls: ~'@{namespace}-default-layout';

  .@{prefix-cls} {
    display: flex;
    width: 100%;
    min-height: 100%;
    background-color: @content-bg;
    flex-direction: column;

    > .ant-layout {
      min-height: 100%;
    }

    &-main {
      width: 100%;
      margin-left: 1px;
    }
  }
</style>
