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