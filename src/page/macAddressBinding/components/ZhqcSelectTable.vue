<template>
  <Select
    :value="getSelectValue"
    :disabled="disabled"
    dropdownClassName="pointer-events-none custom-select-table"
  >
    <SelectOption value="china" label="China">
      <div class="p-4 pointer-events-auto" @click.stop="handleClick">
        <BasicTable
          :dataSource="dataSource"
          :rowSelection="{
            selectedRowKeys: selectedRowKeys,
            onChange: handleTableCheckedChange,
          }"
          @register="registerTable"
        />
      </div>
    </SelectOption>
  </Select>
</template>
<script lang="ts" setup>
  import { ref, unref, watch, computed, ComputedRef, PropType } from 'vue';
  import { Select, SelectOption } from 'ant-design-vue';
  import { BasicTable, BasicColumn, useTable } from '/@/components/Table';
  import { listTenantDp } from '../api';

  import { useI18n } from '/@/hooks/web/useI18n';
  const { t } = useI18n();

  interface RowItem {
    id?: string;
    code: string;
    name?: string;
    [key: string]: any;
  }

  const props = defineProps({
    tenantId: {
      type: String,
      default: '',
    },
    fieldCode: {
      type: String,
      default: '',
    },
    list: {
      type: Array as PropType<RowItem[]>,
      default: () => [],
    },
    initFieldCode: {
      type: String,
      default: '',
    },
    initList: {
      type: Array as PropType<RowItem[]>,
      default: () => [],
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  });

  const emit = defineEmits(['update:list']);

  const tableColumns: BasicColumn[] = [
    {
      title: t('permissionDimen.dpCode'),
      dataIndex: 'name',
    },
  ];
  const dataSource = ref([]);
  const selectedRowKeys = ref<string[] | number[]>([]);
  const getSelectedRows: any = computed({
    get(): RowItem[] {
      return props.list;
    },
    set(val) {
      emit('update:list', val);
    },
  });

  const [registerTable] = useTable({
    columns: tableColumns,
    bordered: true,
    canResize: false,
    inset: true,
    showIndexColumn: false,
    pagination: false,
    clickToRowSelect: true,
    rowKey: 'code',
  });

  watch(
    () => props.fieldCode,
    () => {
      queryDpList();
    },
  );
  const queryDpList = async () => {
    if (!props.fieldCode) {
      dataSource.value = [];
      selectedRowKeys.value = [];
      getSelectedRows.value = [];
      return;
    }
    const res = await listTenantDp({
      module: 'macPool',
      params: {
        tenantId: props.tenantId,
        fieldCode: props.fieldCode,
      },
    });
    const list = (res || []).map((v) => {
      return {
        id: v.id,
        code: v.code,
        name: v.version ? `${v.name}_${v.version}` : v.name,
        version: v.version,
      };
    });
    dataSource.value = list;
    const selectList = props.fieldCode === props.initFieldCode ? props.initList : []; // list.filter((v) => v.isSelected === '1');
    selectedRowKeys.value = selectList.map((v) => v.code);
    getSelectedRows.value = selectList;
  };
  const handleTableCheckedChange = (rowKeys) => {
    selectedRowKeys.value = rowKeys;
    const list = unref(dataSource);
    getSelectedRows.value = rowKeys.map((key) => {
      const item: any = list.find((v: any) => v.code === key) || {};
      return {
        id: item.id,
        code: item.code,
        name: item.name,
        version: item.version,
      };
    });
  };
  const getSelectValue = computed(
    () =>
      unref(getSelectedRows)
        ?.map((v) => v?.name || '')
        .join(',') || '',
  );
  function handleClick() {}
</script>
<style lang="less">
  .custom-select-table {
    padding: 0 !important;

    .ant-select-item {
      padding: 0 !important;
    }
  }
</style>
