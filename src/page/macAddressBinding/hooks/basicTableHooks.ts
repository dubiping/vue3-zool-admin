import { message, Modal } from 'ant-design-vue';
import { BasicColumn } from '/@/components/Table';
import componentSetting from '/@/settings/componentSetting';
const { table } = componentSetting;

import {
  queryPage,
  queryRow,
  saveOrUpdate,
  addData,
  enableRow,
  disableRow,
  deleteRow,
  deleteBatch,
} from '/@/api/common';
import { formatDate } from '/@/utils/dateUtil';
import { formateFormValues } from '/@/utils';
import { useI18n } from '/@/hooks/web/useI18n';
import { usePermission } from '/@/hooks/web/usePermission';
import { useTableCols } from '/@/hooks/web/useTableCols';
import { OpKeyEnum } from '../enum';
// const { t } = useI18n();

export function useBasicTable({ $vm }) {
  const t = inject('t') as Fn;
  const basicTableRef = ref<Nullable<any>>(null);
  const { hasPermission } = usePermission();

  const pagination = reactive({
    current: 1,
    pageSize: table.defaultPageSize,
    total: 0,
  });

  const actions = reactive([
    {
      label: t('common.view'),
      type: 'link',
      show: true,
      icon: 'icon-by-eye',
      event: (record) => {
        handleView(record);
      },
    },
    {
      label: t('common.edit'),
      type: 'link',
      show: true,
      icon: 'icon-by-edit',
      event: (record) => {
        handleEdit(record);
      },
    },
    {
      label: t('common.delete'),
      type: 'link',
      show: true,
      icon: 'icon-by-delete',
      fixed: 'right',
      color: 'red',
      event: (record) => {
        handleDelete(record);
      },
    },
    {
      label: t('common.enable'),
      type: 'link',
      show: true,
      icon: 'icon-by-shutdown',
      event: (record) => {
        handleEnable(record);
      },
    },
    {
      label: t('common.disable'),
      type: 'link',
      show: true,
      disabled: true,
      icon: 'icon-by-lock',
      event: (record) => {
        handleDisable(record);
      },
    },
    {
      label: '绑定手机',
      type: 'link',
      show: true,
      icon: 'icon-by-phone',
      color: 'red',
      event: (record) => {
        handleDisable(record);
      },
    },
  ]);

  const basicCustomCols = reactive<{
    [key: string]: any;
  }>({
    visible: false,
    fieldList: [],
    sourceFields: [],
  });

  const { filterPermFiledCols, transformSettingData, transformTableData } = useTableCols();

  const basicTableRawColumns: BasicColumn[] = filterPermFiledCols([
    {
      type: 'selection',
      fixed: 'left',
      width: 60,
      dataIndex: 'selection',
    },
    {
      title: t('common.index'),
      type: 'index',
      fixed: 'left',
      width: 60,
      dataIndex: 'index',
    },
    // {
    //   title: t('macAddressBinding.code'),
    //   dataIndex: 'code',
    //   minWidth: 100,
    // },
    {
      title: t('macAddressBinding.macAddr'),
      dataIndex: 'macAddr',
      minWidth: 100,
    },
    {
      title: t('macAddressBinding.addrDesc'),
      dataIndex: 'addrDesc',
      minWidth: 100,
    },
    {
      title: t('macAddressBinding.isEnable'),
      dataIndex: 'enableName',
      minWidth: 100,
    },
    {
      title: t('macAddressBinding.realAddr'),
      dataIndex: 'realAddr',
      minWidth: 100,
    },
    {
      title: t('macAddressBinding.remark'),
      dataIndex: 'remark',
      minWidth: 100,
    },
    {
      title: t('macAddressBinding.modifierName'),
      dataIndex: 'modifierName',
      minWidth: 100,
    },
    {
      title: t('macAddressBinding.modifyTime'),
      dataIndex: 'modifyTime',
      minWidth: 100,
      cellRenderer: ({ value }) => formatDate(value),
    },
    {
      title: t('macAddressBinding.creatorName'),
      dataIndex: 'creatorName',
      minWidth: 100,
    },
    {
      title: t('macAddressBinding.createTime'),
      dataIndex: 'createTime',
      minWidth: 100,
      cellRenderer: ({ value }) => formatDate(value),
    },
    {
      title: t('common.action'),
      type: 'slot',
      width: 150,
      fixed: 'right',
      dataIndex: 'action',
    },
  ]);

  basicCustomCols.sourceFields = transformSettingData(basicTableRawColumns);

  const basicTableColumns = transformTableData(basicTableRawColumns, basicCustomCols);

  // 表格数据
  const dataSource = ref([
    {
      id: '214389480130482176',
      tenantId: '200565753433427968',
      orgId: null,
      creator: '200565771833839616',
      creatorName: '系统管理员',
      createTime: '1660544835228',
      modifier: '200565771833839616',
      modifierName: '系统管理员',
      modifyTime: '1660544835228',
      isEnable: '1',
      isDelete: '0',
      optimistic: 0,
      enableName: '启用',
      deleteName: '正常',
      extendMap: null,
      macAddr: '123',
      macType: '1',
      addrDesc: '测试',
      realAddr: null,
      remark: '55',
      detailList: null,
      detailName: null,
    },
    {
      id: '214389480130482177',
      tenantId: '200565753433427968',
      orgId: null,
      creator: '200565771833839616',
      creatorName: '系统管理员',
      createTime: '1660544835228',
      modifier: '200565771833839616',
      modifierName: '系统管理员',
      modifyTime: '1660544835228',
      isEnable: '0',
      isDelete: '0',
      optimistic: 0,
      enableName: '停用',
      deleteName: '正常',
      extendMap: null,
      macAddr: '133',
      macType: '1',
      addrDesc: '测试',
      realAddr: null,
      remark: '55',
      detailList: null,
      detailName: null,
    },
  ]);
  const getPageInfo = async () => {
    $vm.loading = true;
    try {
      const params = {
        ...formateFormValues($vm.basicFormConfig?.model),
        page: pagination.current,
        limit: pagination.pageSize,
      };
      const res = await queryPage({ module: $vm.moduleName, params });
      $vm.loading = false;
      if (res) {
        dataSource.value = res.list;
        pagination.current = +res.pageNum;
        pagination.pageSize = +res.pageSize;
        pagination.total = +res.total;
      }
    } catch {}
    $vm.loading = false;
  };

  // 获取行数据
  const getRowData = async (params: object = {}) => {
    try {
      const res = await queryRow({ module: $vm.moduleName, params });
      if (res) {
        $vm.basicDialogState.model = res;
        $vm.basicDialogState.initMacType = res.macType;
        $vm.basicDialogState.initDetailList = res.detailList;
      }
    } catch {}
  };

  // 新增编辑保存
  const handleSaveOrUpdate = async (params: object = {}) => {
    return $vm.basicDialogState.type === 'add'
      ? await addData({ module: $vm.moduleName, params })
      : await saveOrUpdate({ module: $vm.moduleName, params });
  };

  const setDiaConfig = (type: string) => {
    $vm.basicDialogState.title = t(`common.${type}`);
    $vm.basicDialogState.type = type;
    $vm.basicDialogState.visible = true;
  };

  // 新增
  const handleCreate = () => {
    if (!$vm.basicFormConfig.model.tenantId) {
      return message.error(t('common.msg.tenantId'));
    }

    setDiaConfig('add');
    $vm.basicDialogState.model = {
      isEnable: '1',
      tenantId: $vm.basicFormConfig.model.tenantId,
    };
    $vm.basicDialogState.initMacType = '';
    $vm.basicDialogState.initDetailList = [];
  };

  // 编辑
  const handleEdit = (record) => {
    setDiaConfig('edit');
    getRowData(record.id);
  };

  // 查看
  const handleView = (record) => {
    setDiaConfig('view');
    getRowData(record.id);
  };

  // 删除
  const handleDelete = (record) => {
    Modal.confirm({
      title: t('common.delete'),
      content: t('common.msg.delete'),
      onOk: async () => {
        await deleteRow({
          module: $vm.moduleName,
          params: record.id,
        });
        message.success(t('common.msg.deleteSuccess'));
        getPageInfo();
      },
    });
  };

  // 启用
  const handleEnable = (record) => {
    Modal.confirm({
      title: t('common.enable'),
      content: t('common.msg.enable'),
      onOk: async () => {
        await enableRow({
          module: $vm.moduleName,
          params: record.id,
        });
        message.success(t('common.msg.success'));
        getPageInfo();
      },
    });
  };

  // 停用
  const handleDisable = (record) => {
    Modal.confirm({
      title: t('common.disable'),
      content: t('common.msg.disable'),
      onOk: async () => {
        await disableRow({
          module: $vm.moduleName,
          params: record.id,
        });
        message.success(t('common.msg.success'));
        getPageInfo();
      },
    });
  };

  // 设置
  const handleSetting = () => {
    basicCustomCols.visible = true;
  };

  // 批量删除
  const handleBatchDelete = async () => {
    const selectRows = basicTableRef.value?.getSelectRows();
    if (!selectRows.length) {
      return message.warning(t('common.msg.select'));
    }

    Modal.confirm({
      title: t('common.delete'),
      content: t('common.msg.delete'),
      onOk: async () => {
        await deleteBatch({
          module: $vm.moduleName,
          params: selectRows.map((item) => item.id),
        });
        basicTableRef.value.clearSelectedRows();
        getPageInfo();
        message.success(t('common.msg.success'));
      },
    });
  };

  return {
    basicTableRef,
    basicTableColumns,
    dataSource,
    actions,
    pagination,
    getPageInfo,
    handleSaveOrUpdate,
    handleCreate,
    handleEnable,
    handleDisable,
    handleBatchDelete,
    basicCustomCols,
    handleSetting,
  };
}
