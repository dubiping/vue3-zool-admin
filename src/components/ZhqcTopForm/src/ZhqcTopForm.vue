<script lang="ts" name="ZhqcTopForm" setup>
  import { useDesign } from '/@/hooks/web/useDesign';

  const { prefixCls } = useDesign('condition-search');

  // 展开收起
  const isCollapsed = ref(true);
  // 条件列表
  const filterConditionList: any = ref([]);
  const fieldList = computed(() => {
    return [];
  });
</script>

<template>
  <div :class="prefixCls">
    <a-form v-show="isCollapsed">
      <a-row type="flex" justify="start" :wrap="true" :gutter="16">
        <a-col
          :xxl="6"
          :xl="8"
          :lg="12"
          :md="12"
          :sm="24"
          :xs="24"
          v-for="(item, i) in filterConditionList"
          :key="i"
          class="grid_item"
        >
          11
        </a-col>
      </a-row>
    </a-form>
  </div>
</template>
