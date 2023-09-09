<template>
  <div class="flex flex-col sider-tree absolute inset-0 overflow-auto">
    <div class="flex items-center p-2 sider-tree-header" v-if="isShowHeader">
      <Select
        v-if="showType"
        v-model:value="typeValue"
        :options="typeOptions"
        :placeholder="t('common.chooseText')"
        style="width: 100px"
        class="!mr-1"
      />
      <Select
        v-model:value="searchValue"
        class="flex-1"
        show-search
        :placeholder="t('common.inputText')"
        :default-active-first-option="false"
        :show-arrow="false"
        :filter-option="false"
        :not-found-content="null"
        :options="searchOptions"
        :allowClear="true"
        @search="handleSearch"
        @change="handleChange"
      />
      <Button size="small" class="ml-1" type="primary" @click="handleClickPos">{{
        t('common.location')
      }}</Button>
    </div>
    <div class="flex p-2 overflow-y-auto sider-tree-main">
      <Tree
        :tree-data="treeData"
        :fieldNames="fieldNames"
        v-model:expandedKeys="expandedKeys"
        :autoExpandParent="autoExpandParent"
        v-model:selectedKeys="selectedKeys"
        @select="handleTreeSelect"
        @expand="handleTreeExpand"
      />
    </div>
  </div>
</template>
<script lang="ts" setup>
  import { ref, computed, unref, watch, nextTick } from 'vue';
  import { Select, Button, Tree } from 'ant-design-vue';
  import { prop } from './props';
  import { translateTreeToArr } from '/@/utils';
  import { useI18n } from '/@/hooks/web/useI18n';

  const props = defineProps(prop);
  const emit = defineEmits(['select']);

  const { t } = useI18n();

  const searchOptions = ref<any[]>([]);
  const searchValue = ref<string>('');

  const typeOptions = ref<any[]>([]);
  const typeValue = ref();

  const selectedKeys = ref<string[]>([]);
  const expandedKeys = ref<string[]>([]);
  const autoExpandParent = ref(true);

  const orgList = computed(() =>
    translateTreeToArr(props.treeData, (item: any) => ({
      ...item,
      value: item.id,
      label: item[props.fieldNames?.title || 'orgName'],
      hasChildren: item.hasChildren,
      children: null,
    })),
  );
  watch(
    () => props.treeData,
    (data) => {
      if (!data || !data.length) return;
      nextTick(() => {
        const val = props.selectId || data[0]?.id || '';
        selectedKeys.value = [val];
        expandedKeys.value = [val];
        autoExpandParent.value = true;
        emit(
          'select',
          unref(orgList).find((v) => v.id === val),
        );
      });
    },
    {
      immediate: true,
    },
  );
  watch(
    () => props.selectId,
    (val) => {
      if (val !== unref(selectedKeys)[0]) {
        selectedKeys.value = [val];
        expandedKeys.value = [val];
        autoExpandParent.value = true;
      }
    },
  );
  function handleSearch(val: string) {
    if (!val) {
      return;
    }
    searchOptions.value = unref(orgList).filter((item) => item.label.indexOf(val) !== -1);
  }
  function handleChange(val: string) {
    searchValue.value = val;
    searchOptions.value = unref(orgList).filter((item) => item.value === val);
  }
  // 定位
  function handleClickPos() {
    const val: string = unref(searchValue);
    if (!val) return;
    selectedKeys.value = [val];
    expandedKeys.value = [val];
    autoExpandParent.value = true;
    emit(
      'select',
      unref(orgList).find((v) => v.id === val),
    );
  }

  function handleTreeSelect(val, e) {
    const id = val[0] || e.node.id;
    if (!val.length) {
      selectedKeys.value = [e.node.id];
    }
    emit(
      'select',
      unref(orgList).find((v) => v.id === id),
    );
  }

  function handleTreeExpand() {
    autoExpandParent.value = false;
  }
</script>
<style lang="less" scoped>
  .sider-tree {
    &-header {
      border-bottom: 1px solid rgba(215, 215, 215, 1);
    }

    :deep(.ant-select-selector) {
      height: 28px !important;
    }
  }
</style>
