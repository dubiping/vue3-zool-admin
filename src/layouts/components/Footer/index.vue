<script lang="ts" name="LayoutFooter" setup>
  import { useRootSetting } from '/@/hooks/setting/useRootSetting';
  import { useDesign } from '/@/hooks/web/useDesign';
  import { useLayoutHeight } from '../Content/hooks/useContentViewHeight';
  import { useRouter } from 'vue-router';

  const { getShowFooter } = useRootSetting();
  const { currentRoute } = useRouter();
  const { prefixCls } = useDesign('layout-footer');

  const footerRef = ref<ComponentRef>(null);
  const { setFooterHeight } = useLayoutHeight();
  const getShowLayoutFooter = computed(() => {
    if (unref(getShowFooter)) {
      const footerEl = unref(footerRef)?.$el;
      setFooterHeight(footerEl?.offsetHeight || 0);
    } else {
      setFooterHeight(0);
    }
    return unref(getShowFooter) && !unref(currentRoute).meta?.hiddenFooter;
  });
</script>
<template>
  <a-layout-footer :class="prefixCls" v-if="getShowLayoutFooter" ref="footerRef">
    <div>Copyright &copy;2020 zhqc</div>
  </a-layout-footer>
</template>
