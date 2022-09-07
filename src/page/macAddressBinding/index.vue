<script lang="ts" name="MacAddrManager" setup>
  import ZhqcSelectTable from './components/ZhqcSelectTable.vue';

  import { useBasicForm, useBasicTable, useBasicDialog } from './hooks';
  import { OpKeyEnum } from './enum';

  import { initPage } from '/@/api/common';

  const moduleName = 'macPool';
  const loading = ref(false);
  const $vm: Recordable = { moduleName, loading };

  // 下拉数据
  const selectOptions = reactive({
    enableTypeList: [],
    macTypeList: [],
    tenantList: [],
  });

  const getInitPage = async () => {
    try {
      const res = await initPage({ module: $vm.moduleName });
      if (res) {
        for (let key in selectOptions) {
          if (res[key] && res[key].length) {
            selectOptions[key] = res[key].map((item) => {
              return {
                label: item.name,
                value: item.code,
              };
            });
          }
        }
        const temp: any = selectOptions?.tenantList?.[0];
        basicFormConfig.model = {
          ...basicFormConfig.model,
          tenantId: temp?.value,
        };
      }
    } catch {}
  };

  /* 主表单 */
  const { basicFormSchema, basicFormConfig } = useBasicForm({ selectOptions });
  /* 主表格 */
  const {
    basicTableRef,
    pagination,
    basicTableColumns,
    dataSource,
    actions,
    getPageInfo,
    handleCreate,
    handleEnable,
    handleDisable,
    handleBatchDelete,
    handleSaveOrUpdate,
    basicCustomCols,
    handleSetting,
  } = useBasicTable({ $vm });

  // 查询
  const handleSubmit = () => {
    pagination.current = 1;
    getPageInfo();
  };

  // 分页
  const handlePageChange = () => {
    getPageInfo();
  };

  /* 弹框 */
  const { basicDialogState, diaFormSchemas } = useBasicDialog({ selectOptions });
  // 弹框显示隐藏
  const handleVisibleChange = (val) => {
    if (!val) {
      (basicDialogState.formRef as any)?.resetFields();
    }
  };
  // 弹框确认
  const handleConfirm = async () => {
    try {
      const data = await (basicDialogState.formRef as any)?.validateFields();
      if (!data) return;
      const res = await handleSaveOrUpdate(basicDialogState.model);
      res && getPageInfo();
      basicDialogState.visible = false;
    } catch {}
  };

  onMounted(async () => {
    await getInitPage();
    // getPageInfo();
  });

  Object.assign($vm, {
    basicDialogState,
    basicFormConfig,
  });
</script>

<template>
  <div>
    <ZhqcLayout v-loading="loading">
      <template #layout-header>
        <span>{{ $t('macAddressBinding.headerTitle') }}</span>
      </template>
      <template #layout-form>
        <ZhqcTopForm
          v-bind="basicFormConfig"
          :schemas="basicFormSchema"
          :moduleName="moduleName"
          @submit="handleSubmit"
        />
      </template>
      <template #left-btn>
        <a-button v-auth="OpKeyEnum.ADD" class="ml-2" type="primary" @click="handleCreate">
          {{ $t('common.add') }}
        </a-button>
      </template>
      <template #right-btn>
        <a-button class="ml-2" @click="handleBatchDelete">
          {{ $t('common.batchDelete') }}
        </a-button>
        <ExportExcel
          :model="{
            ...basicFormConfig.model,
            page: pagination.current,
            limit: pagination.pageSize,
          }"
          templateName="macAddress"
          exportUrl="macAddress/export"
          exportName="mac表格数据"
        />
        <ExportTemplate
          templateName="macAddress"
          exportUrl="macAddress/exportTemplate"
          exportName="mac表格模板"
        />
        <ImportExcel templateName="macAddress" uploadUrl="macAddress/upload" />
        <a-button class="ml-2" @click="handleSetting"> {{ $t('common.setting') }}</a-button>
        <!-- <a-button
          class="ml-2"
          @click="handleExport"
        > {{ t('common.export') }} </a-button> -->
      </template>
      <template #layout-table>
        <ZhqcAgGridTable
          ref="basicTableRef"
          :columns="basicTableColumns"
          :dataSource="dataSource"
          :actions="actions"
        />
      </template>
      <template #layout-footer>
        <ZhqcPagination :pagination="pagination" @change="handlePageChange" />
      </template>
    </ZhqcLayout>

    <zhqc-custom-cols
      v-model:visible="basicCustomCols.visible"
      v-model:fields="basicCustomCols.fieldList"
      :sourceFields="basicCustomCols.sourceFields"
      :tableCode="`${moduleName}_basicTable`"
    />

    <!-- 弹框 -->
    <BasicModal
      v-model:visible="basicDialogState.visible"
      v-bind="$attrs"
      :title="basicDialogState.title"
      :width="basicDialogState.width"
      :showOkBtn="basicDialogState.type !== 'view'"
      :cancelText="
        basicDialogState.type === 'view' ? $t('common.closeText') : $t('common.cancelText')
      "
      @ok="handleConfirm"
      @visible-change="handleVisibleChange"
    >
      <ZhqcForm
        v-model:formRef="basicDialogState.formRef"
        :model="basicDialogState.model"
        :schemas="diaFormSchemas"
        :labelWidth="110"
      >
        <template #detailList>
          <ZhqcSelectTable
            :tenantId="basicFormConfig.model.tenantId"
            :fieldCode="basicDialogState.model.macType"
            v-model:list="basicDialogState.model.detailList"
            :disabled="basicDialogState.type === 'view'"
            :initFieldCode="basicDialogState.initMacType"
            :initList="basicDialogState.initDetailList"
          />
        </template>
      </ZhqcForm>
    </BasicModal>
  </div>
</template>
