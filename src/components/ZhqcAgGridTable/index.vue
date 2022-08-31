<!--
  --- Readme ---
  :column-defs -> 每一列的属性定义
  :default-col-def -> 包含所有列都将继承的属性
  :animate-rows -> 设置为true启用行动画
  :row-selection -> 行选择的类型，设置为任一'single'或'multiple'启用选择
  :grid-options -> 该gridOptions对象是整个界面到网格的“一站式商店”，如果使用纯 JavaScript 则通常使用。然而，可以使用网格选项来代替或补充正常的框架绑定。
  :detail-row-auto-height -> 设置为true时，让细节网格动态改变它的高度以适应它的行
  :get-row-style -> 属性的回调版本，分别为每一行设置样式
  :locale-text -> 用于定位网格内文本的键-> 值对映射。【国际化设置】
  :row-height、header-height -> 设置行高度
  :row-data -> 表格数据
 -->
<template>
  <ag-grid-vue
    :class="[
      'ag-grid',
      `ag-theme-alpine${getDarkMode === 'dark' ? '-dark' : ''}`,
      { 'ag-theme-border': border },
    ]"
    style="height: 100%"
    :column-defs="columnDefs"
    :animate-rows="true"
    :row-selection="rowSelection"
    :grid-options="gridOptions"
    :detail-row-auto-height="true"
    :default-col-def="defaultColDef"
    :get-row-style="getRowStyle"
    :locale-text="localeText"
    :row-height="32"
    :header-height="32"
    :row-data="dataSource"
    :enable-filter="true"
    :enable-range-selection="true"
    :pinned-bottom-row-data="pinnedBottomRowData"
    :suppressRowClickSelection="true"
    :loadingOverlayComponent="overlayLoading"
    @grid-ready="onGridReady"
    @row-clicked="onRowClick"
    @cell-clicked="onCellClick"
    @cell-double-clicked="onCellDoubleClicked"
    @selection-changed="onSelectionChanged"
    @cell-value-changed="onCellValueChanged"
    @grid-size-changed="onGridSizeChanged"
  />
  <!-- 勿删 -->
  <!-- :suppress-loading-overlay="true" 设置true为禁用“loanging”覆盖。-->
  <!-- :suppress-drag-leave-hides-columns="false" -->
  <!-- :suppressDragLeaveHidesColumns="true" //防止拖动的时候隐藏表格列 -->
  <!-- row-selection="multiple" // 选择多行 -->
</template>

<script lang="ts" setup>
  import {
    reactive,
    computed,
    onBeforeMount,
    onUpdated,
    nextTick,
    withDefaults,
    watch,
    useSlots,
    h,
  } from 'vue';
  import { AgGridVue } from 'ag-grid-vue3';
  import 'ag-grid-community/dist/styles/ag-grid.css';
  import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
  import 'ag-grid-community/dist/styles/ag-theme-alpine-dark.css';

  import actionComponent from './components/action.vue';
  import customHeader from './components/customHeader.vue';
  import overlayLoading from './components/overlayLoading.vue';

  import { useSortStore } from './tableStore';
  import zh_CN from './lang/zh_CN';
  import en from './lang/en';

  import { useLocaleStoreWithOut } from '/@/store/modules/locale';
  import { useRootSetting } from '/@/hooks/setting/useRootSetting';
  const { getDarkMode } = useRootSetting();

  const props = withDefaults(
    defineProps<{
      getRowStyle?: any;
      pinnedBottomRowData?: any[];
      actions?: any[];
      columns: any[];
      dataSource: any[];
      isRowSelectable?: boolean;
      border?: boolean;
      loading?: boolean;
      resetSort?: boolean;
      rowSelection?: 'single' | 'multiple';
      defaultColDef?: object;
      limit?: number;
      buttonMode?: 'icon' | 'label';
    }>(),
    {
      border: false,
      loading: false,
      resetSort: false,
      rowSelection: 'multiple',
      columns: () => [],
      dataSource: () => [],
      actions: () => [],
      defaultColDef: () => ({
        resizable: true,
      }),
      limit: 4, // 按钮显示的数量
      buttonMode: 'icon', // 按钮模式， icon图标显示  label文字显示
    },
  );

  const emit = defineEmits([
    'selectionChanged',
    'rowchange',
    'rowClicked',
    'cellClicked',
    'cellDoubleClicked',
    'handleEvent',
  ]);

  const localeStore = useLocaleStoreWithOut();
  const locale = localeStore.getLocale;
  const localeText = locale === 'zh_CN' ? zh_CN : en;
  let gridOptions: any = reactive({});
  let gridApi: any = reactive({});
  // let columnApi: any = reactive({});

  const slots = useSlots();

  const columnDefs = computed(() => {
    if (!props.columns) return [];
    return props.columns.map((v) => {
      let item: any = {};
      if (v.dataIndex) {
        item = {
          pinned: v.fixed,
          field: v.dataIndex,
          headerName: v.title || '',
          minWidth: v.minWidth,
          width: v.width,
          editable: v.editable,
          cellEditor: v.cellEditor,
          cellEditorParams: v.cellEditorParams,
          valueFormatter: v.valueFormatter,
          cellRenderer: v.cellRenderer || null,
          headerGroupComponentParams: {
            filterable: v.filter,
            sort: v.sortable,
          },
          headerComponent: v.filter || v.sortable ? customHeader : null,
        };
      }
      if (v.type && (v.type === 'selection' || v.type === 'radio')) {
        item = {
          headerCheckboxSelectionFilteredOnly: true, // 选中过滤后的行
          headerCheckboxSelection: props.rowSelection === 'multiple' && v.type === 'selection', // 表头复选框
          checkboxSelection: true, // 是否可勾选
          lockPosition: true,
          lockPinned: true,
          resizable: false, // 是否可调整列宽
          rowDrag: false,
          filter: false, // 是否可过滤
          editable: false, // 是否可编辑
          pinned: v.fixed,
          minWidth: v.minWidth,
          width: v.width || 60,
        };
      }
      if (v.title) {
        if (v.type === 'index') {
          item = {
            headerName: v.title,
            valueGetter: (params) => {
              return params.data.notTools ? ' ' : params.node.rowIndex + 1;
            },
            lockPosition: true,
            lockPinned: true,
            resizable: false,
            rowDrag: false,
            filter: false,
            editable: false,
            pinned: v.fixed,
            minWidth: v.minWidth,
            width: v.width || 65,
          };
        }
        if (v.type === 'slot') {
          item = {
            headerName: v.title,
            rowDrag: false,
            lockPosition: true,
            lockPinned: true,
            pinned: v.fixed,
            width: v.width,
            minWidth: v.minWidth,
          };
          if (props.actions.length) {
            item.headerGroupComponentParams = {
              actions: props.actions,
              limit: props.limit,
              buttonMode: props.buttonMode,
            };
          }
          if (v.cellRenderer) {
            item.cellRenderer = v.cellRenderer;
          } else if (slots[v.dataIndex]) {
            item.cellRenderer = {
              props: ['params'],
              render() {
                // console.log(this.params, 'mmmmmm');
                return h(
                  'div',
                  {},
                  slots[v.dataIndex]?.({
                    row: this.params.data,
                    rowIndex: this.params.rowIndex,
                  }),
                );
              },
            };
          } else {
            item.cellRenderer = actionComponent;
          }
        }
      }
      if (v.children) {
        item.children = v.children;
      }
      return item;
    });
  });

  watch(
    () => props.resetSort,
    (val) => {
      useSortStore().setSortState(val);
    },
  );

  watch(
    () => props.loading,
    (val) => {
      if (val) {
        Reflect.has(gridApi, 'showLoadingOverlay') && gridApi.showLoadingOverlay();
      } else {
        Reflect.has(gridApi, 'hideOverlay') && gridApi.hideOverlay();
        if (!props.dataSource.length) {
          Reflect.has(gridApi, 'showNoRowsOverlay') && gridApi.showNoRowsOverlay();
        }
      }
    },
  );

  watch(
    () => props.dataSource,
    (val) => {
      if (!val.length) {
        Reflect.has(gridApi, 'showNoRowsOverlay') && gridApi.showNoRowsOverlay();
      } else {
        Reflect.has(gridApi, 'hideOverlay') && gridApi.hideOverlay();
      }
    },
  );

  /**
   * @description: ag-grid 事件分发
   * @param {*}
   * @return {*}
   */
  const agDelivery = (e, data) => {
    emit('handleEvent', e, data);
  };

  onBeforeMount(() => {
    gridOptions.isRowSelectable = props.isRowSelectable;
  });

  /**
   * @description: 表格已初始化方法
   */
  const onGridReady = (params) => {
    gridApi = params.api; // 获取gridApi
    gridApi.$agDelivery = agDelivery;
    // columnApi = params .columnApi;
    // 这时就可以通过gridApi调用ag-grid的传统方法了
    // gridApi.sizeColumnsToFit();
  };

  onUpdated(() => {
    nextTick(() => {
      const params = gridOptions.columnApi.columnModel;
      const bodyWidth = params.bodyWidth;
      if (bodyWidth > 0) {
        const flexViewportWidth = params.flexViewportWidth;
        if (flexViewportWidth > bodyWidth) {
          gridApi.sizeColumnsToFit();
        }
      }
    });
  });

  /**
   * @description: 表格大小发生改变的回调方法
   */
  const onGridSizeChanged = (e) => {
    const width = e.clientWidth;
    const bodyWidth = e.columnApi.columnModel.bodyWidth;
    const arr = e.columnApi.columnModel.displayedColumns;
    const obj = arr[arr.length - 1];
    let w = 0;
    obj && obj.pinned && (w = obj.actualWidth);
    if (width > bodyWidth + w) {
      gridApi.sizeColumnsToFit();
    }
  };

  /**
   * @description: 表格勾选框事件
   */
  let selectRows = [];
  const onSelectionChanged = (e) => {
    selectRows = e.api?.getSelectedNodes()?.map((item) => item.data);
    emit('selectionChanged', e);
  };
  const getSelectRows = () => {
    return selectRows;
  };
  const clearSelectedRows = () => {
    return (selectRows = []);
  };

  /**
   * @description: 表格行点击事件
   */
  const onRowClick = (e) => {
    emit('rowClicked', e);
  };

  /**
   * @description: 表格单元格点击事件
   */
  const onCellClick = (e) => {
    emit('cellClicked', e);
  };

  /**
   * @description: 表格单元格双击事件
   */
  const onCellDoubleClicked = (e) => {
    const selection: any = document.getSelection();
    selection.removeAllRanges();
    const range = document.createRange();
    range.selectNode(e.event.target);
    selection.addRange(range);
    emit('cellDoubleClicked', e);
  };

  /**
   * @description: 表格编辑事件
   */
  const onCellValueChanged = (e) => {
    emit(
      'rowchange',
      {
        data: e.data,
        colId: e.column.colId,
      },
      e,
    );
  };

  defineExpose({
    getSelectRows,
    clearSelectedRows,
  });
</script>

<style lang="less">
  @import url('./index.less');
</style>
