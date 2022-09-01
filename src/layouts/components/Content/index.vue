<script lang="ts" name="LayoutContent" setup>
  import PageLayout from '../Page/index.vue';
  import { useDesign } from '/@/hooks/web/useDesign';
  import { useRootSetting } from '/@/hooks/setting/useRootSetting';
  import { useTransitionSetting } from '/@/hooks/setting/useTransitionSetting';

  const { prefixCls } = useDesign('layout-content');
  const { getOpenPageLoading } = useTransitionSetting();
  const { getLayoutContentMode, getPageLoading } = useRootSetting();
</script>
<template>
  <div :class="[prefixCls, getLayoutContentMode]" v-loading="getOpenPageLoading && getPageLoading">
    <PageLayout />
  </div>
</template>

<style lang="less">
  @prefix-cls: ~'@{namespace}-layout-content';

  .@{prefix-cls} {
    position: relative;
    flex: 1 1 auto;
    min-height: 0;
    padding: 0.5rem;

    &.fixed {
      width: 1200px;
      margin: 0 auto;
    }

    &-loading {
      position: absolute;
      top: 200px;
      z-index: @page-loading-z-index;
    }

    & > div {
      height: 100%;
    }
  }
</style>
