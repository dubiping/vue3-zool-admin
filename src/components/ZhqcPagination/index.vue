<template>
  <div class="zhqc-page">
    <div class="zhqc-page-btn-group">
      <div v-if="btnList.length">
        <template v-for="(btn, index) in btnList">
          <a-button
            v-if="btn.show !== false"
            v-bind="getBtnConfig(btn)"
            :key="index"
            @click="onClick(btn.event)"
          >
            {{ btn.label }}
          </a-button>
        </template>
      </div>
    </div>
    <a-pagination
      v-model:current="pagination.current"
      v-model:page-size="pagination.pageSize"
      show-quick-jumper
      show-size-changer
      size="small"
      :total="pagination.total"
      :defaultPageSize="table.defaultPageSize"
      :pageSizeOptions="table.pageSizeOptions"
      :show-total="(total) => $t('common.pagination.total', { total })"
      @change="onChange"
    />
  </div>
</template>

<script lang="ts" setup>
  import { withDefaults } from 'vue';
  // @ts-ignore
  import componentSetting from '/@/settings/componentSetting';
  const { table } = componentSetting;

  interface Props {
    pagination?: { pageSize?: number; current?: number; total?: number };
    btnList?: Array<{ show?: boolean; event: Function; icon?: string; label: string }>;
  }

  withDefaults(defineProps<Props>(), {
    pagination: () => ({ pageSize: 1, current: 1, total: 0 }),
    btnList: () => [],
  });

  const emit = defineEmits(['change']);

  const types = [
    'type',
    'size',
    'loading',
    'block',
    'danger',
    'disabled',
    'ghost',
    'htmlType',
    'shape',
    'href',
    'target',
  ];
  const getBtnConfig = (btn) => {
    const config = {};
    for (let key in btn) {
      if (types.includes(key)) {
        config[key] = btn[key];
      }
    }
  };

  const onClick = (event: Function) => {
    event && event();
  };

  const onChange = (current) => {
    emit('change', current);
  };
</script>

<style lang="less" scoped>
  .zhqc-page {
    position: relative;
    z-index: 9;
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    height: 30px;

    .zhqc-page-btn-group {
      float: left;
    }
  }
</style>
