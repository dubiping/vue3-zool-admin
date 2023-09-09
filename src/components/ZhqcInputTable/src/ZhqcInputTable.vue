<template>
  <BasicModal
    v-model:visible="dialogVisible"
    v-bind="$attrs"
    :title="`${disabled ? t('common.view') : t('common.edit')}${title}`"
    :width="width"
    :showOkBtn="!disabled"
    :cancelText="disabled ? t('common.closeText') : t('common.cancelText')"
    @ok="handleConfirm"
  >
    <BasicTable
      :dataSource="basicDialogState.dataSource"
      :columns="basicTableColumns"
      class="custom-input-table"
      @register="registerTable"
    >
      <template v-if="!disabled" #tableTitle>
        <a-button type="primary" @click="handleAdd">
          {{ t('common.add') }}
        </a-button>
      </template>
      <template #bodyCell="{ column, record, index }">
        <template v-if="column.dataIndex === 'operation'">
          <a-button type="link" danger @click="() => handleDel(index)">{{
            t('common.delete')
          }}</a-button>
        </template>
        <template v-else-if="column.dataIndex === 'index'">
          <div>{{ index + 1 }}</div>
        </template>
        <template v-else-if="basicDialogState.editableData[index]?.[column.dataIndex]">
          <a-input
            v-if="column.editComponent === 'Input'"
            :ref="(input) => input?.focus()"
            v-model:value="record[column.dataIndex]"
            @change="
              basicDialogState.dataSource[index][column.dataIndex] = record[column.dataIndex]
            "
            @blur="basicDialogState.editableData[index][column.dataIndex] = false"
          />
        </template>
        <template v-else-if="column.dataIndex">
          <div
            class="absolute inset-0 flex items-center justify-center cursor-pointer"
            @click="!disabled && (basicDialogState.editableData[index][column.dataIndex] = true)"
          >
            {{ record[column.dataIndex] }}
          </div>
        </template>
      </template>
    </BasicTable>
  </BasicModal>
</template>
<script lang="ts" setup>
  import { reactive, computed, watch, unref, onMounted } from 'vue';
  import { BasicModal } from '/@/components/Modal';
  import { BasicTable, BasicColumn, useTable } from '/@/components/Table/index';
  import { useBasicSortable } from './hooks/basicSortableHooks';

  import { useI18n } from '/@/hooks/web/useI18n';
  const { t } = useI18n();

  const props = defineProps({
    visible: {
      type: Boolean,
      default: false,
    },
    value: {
      type: String,
      default: '',
    },
    width: {
      type: Number,
      default: 520,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
      default: '',
    },
  });

  const emit = defineEmits(['update:visible', 'confirm']);

  const { initSortable, setDisabled } = useBasicSortable();

  const basicDialogState = reactive<{
    dataSource: any[];
    editableData: any[];
    [key: string]: any;
  }>({
    visible: false,
    width: 520,
    previewImage: '',
    dataSource: [],
    editableData: [],
  });

  const dialogVisible = computed<boolean>({
    get() {
      return props.visible;
    },
    set(val) {
      emit('update:visible', val);
    },
  });

  watch(
    () => unref(dialogVisible),
    (visible) => {
      if (!visible) return;
      if (!props.value) {
        basicDialogState.dataSource = [];
        basicDialogState.editableData = [];
        return;
      }
      basicDialogState.dataSource = props.value.split(',').map((v) => {
        return {
          content: v,
        };
      });
      basicDialogState.editableData = basicDialogState.dataSource.map((v) => {
        return {
          content: false,
        };
      });
      initSortable({ basicDialogState });
      setDisabled(props.disabled);
    },
    {
      immediate: true,
    },
  );

  const basicTableColumns = computed<BasicColumn[]>(() => {
    return [
      {
        title: t('common.index'),
        dataIndex: 'index',
        width: 60,
      },
      {
        title: t('common.content'),
        dataIndex: 'content',
        minWidth: 100,
        editComponent: 'Input',
      },
      {
        title: t('common.action'),
        dataIndex: 'operation',
        width: 100,
        fixed: 'right',
      },
    ].slice(0, props.disabled ? 2 : 3);
  });

  const [registerTable] = useTable({
    canResize: true,
    inset: true,
    showIndexColumn: false,
    pagination: false,
    clickToRowSelect: false,
    resizeHeightOffset: 100,
  });

  const handleAdd = () => {
    basicDialogState.dataSource = [
      ...basicDialogState.dataSource,
      {
        content: '',
      },
    ];
    basicDialogState.editableData = [
      ...basicDialogState.editableData,
      {
        content: false,
      },
    ];
  };
  const handleDel = (index) => {
    basicDialogState.dataSource.splice(index, 1);
    basicDialogState.dataSource = [...basicDialogState.dataSource];
    basicDialogState.editableData.splice(index, 1);
    basicDialogState.editableData = [...basicDialogState.editableData];
  };

  const handleConfirm = () => {
    const list = basicDialogState.dataSource.filter((v) => v.content.trim());
    emit('confirm', list.map((v) => v.content.trim()).join(','));
    dialogVisible.value = false;
  };
</script>
