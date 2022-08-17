<script lang="ts" setup>
import LayoutContent from './components/Content/index.vue';

import { useHeaderSetting } from '/@/hooks/setting/useHeaderSetting';
import { useMenuSetting } from '/@/hooks/setting/useMenuSetting';
import { useDesign } from '/@/hooks/web/useDesign';
import { useLockPage } from '/@/hooks/web/useLockPage';

const { prefixCls } = useDesign('default-layout');
const { getIsMobile } = useAppInject();
const { getShowFullHeaderRef } = useHeaderSetting();
const { getShowSidebar, getIsMixSidebar, getShowMenu } = useMenuSetting();
import { useAppInject } from '/@/hooks/web/useAppContext';

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
    <a-layout-header>1122</a-layout-header>
    <a-layout :class="[layoutClass]">
      <a-layout-sider>2</a-layout-sider>
      <a-layout :class="`${prefixCls}-main`">
        <a-layout-header>33</a-layout-header>
        <LayoutContent />
        <a-layout-footer>Footer</a-layout-footer>
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