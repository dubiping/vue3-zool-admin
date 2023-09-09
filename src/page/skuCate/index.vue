<script lang="ts" name="MacAddrManager" setup>
  import { useBasicForm, useBasicTable, useBasicDialog, useBasicSidebar } from './hooks';
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
      }
    } catch {}
  };

  // 侧边栏树结构
  const { basicSidebarState, handleSelectTreeNode, getTreeData } = useBasicSidebar({ $vm });

  /* 主表单 */
  const { basicFormConfig } = useBasicForm();
  /* 主表格 */
  const {
    basicTableRef,
    pagination,
    basicTableState,
    actions,
    getPageInfo,
    getSkuInfo,
    initBasicTable,
    handleCreate,
    handleEnable,
    handleDisable,
    handleSaveOrUpdate,
    basicCustomCols,
    handleSetting,
  } = useBasicTable({ $vm });

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
    initBasicTable(true);
    getInitPage();
    getTreeData();
  });

  Object.assign($vm, {
    basicDialogState,
    basicFormConfig,
    initBasicTable,
  });
</script>

<template>
  <div>
    <ZhqcLayoutMul v-loading="loading">
      <template #layout-header>
        <span>{{ $t('macAddressBinding.headerTitle') }}</span>
      </template>
      <template #layout-form>
        <div class="flex justify-end pt-2 pr-4">
          <a-button
            v-if="!(basicFormConfig.model.isLeave && basicTableState.dataSource.length)"
            v-auth="OpKeyEnum.ADD"
            class="ml-2"
            type="primary"
            @click="handleCreate"
          >
            {{ $t('common.add') }}
          </a-button>
          <a-button v-auth="OpKeyEnum.ENABLE" class="ml-2" @click="handleCreate">
            {{ $t('common.enable') }}
          </a-button>
          <a-button v-auth="OpKeyEnum.DEACTIVATE" class="ml-2" @click="handleCreate">
            {{ $t('common.disable') }}
          </a-button>
        </div>
      </template>
      <template #layout-sider>
        <ZhqcLayoutSider
          :showType="false"
          :treeData="basicSidebarState.treeData"
          :fieldNames="{
            children: 'children',
            title: 'name',
            key: 'id',
          }"
          :selectId="basicFormConfig.model.parentId"
          @select="handleSelectTreeNode"
        />
      </template>
      <template #layout-table>
        <ZhqcAgGridTable
          ref="basicTableRef"
          :columns="basicTableState.basicTableColumns"
          :dataSource="basicTableState.dataSource"
          :actions="actions"
          class="pt-2"
        />
      </template>
      <template #layout-footer>
        <a-button class="ml-2" @click="handleSetting"> {{ $t('common.setting') }}</a-button>
        <ZhqcPagination :pagination="pagination" @change="handlePageChange" />
      </template>
    </ZhqcLayoutMul>

    <zhqc-custom-cols
      v-model:visible="basicCustomCols.visible"
      v-model:fields="basicCustomCols.fieldList"
      :sourceFields="basicCustomCols.sourceFields"
      :tableCode="`${moduleName}_${basicTableState.tableName}`"
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
      />
    </BasicModal>
  </div>
</template>
