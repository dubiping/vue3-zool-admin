<template>
  <div
    class="zhqc_vxe_table"
    :class="[toolbar.show ? 'zhqc_vxe_table_show' : 'zhqc_vxe_table_notShow']"
  >
    <!-- toolbar -->
    <vxe-toolbar v-if="toolbar.show">
      <template #buttons>
        <div class="title">
          <slot name="title"></slot>
        </div>
        <template v-for="(btn, idx) in toolbar.buttons" :key="idx">
          <a-select
            v-if="btn.type === 'select'"
            v-model="toolbarData[btn.value]"
            :size="btn.size"
            :disabled="btn.disabled"
            :clearable="btn.clearable === false ? btn.clearable : true"
            :filterable="btn.filterable"
            :multiple="btn.multiple"
            :collapse-tags="btn.collapsetags"
            @change="handleEvent(btn.events?.change, toolbarData[btn.value], btn)"
            @clear="handleEvent(btn.events?.clear, toolbarData[btn.value], btn)"
          >
            <a-select-option
              v-for="(childItem, childIndex) in listTypeInfo[btn.list]"
              :key="childIndex"
              :label="childItem.key"
              :value="childItem.value"
              :disabled="childItem.disabled"
            />
          </a-select>
          <vxe-button v-else-if="btn.type === 'dropdowns'" :content="btn.label">
            <template #dropdowns>
              <vxe-button
                v-for="(e, i) in btn.list"
                :key="i"
                type="text"
                :content="e.label"
                @click="handleClick(e.event)"
              />
            </template>
          </vxe-button>
          <a-button
            v-else
            :type="btn.type"
            :disabled="btn.disabled"
            :loading="btn.loading"
            :size="btn.size"
            @click="handleClick(btn.event)"
          >
            <i :class="btn.icon?.includes('xh-icon') ? `xh-iconfont ${btn.icon}` : btn.icon"></i>
            {{ btn.label }}
          </a-button>
        </template>
      </template>
      <template #tools>
        <template v-for="(btn, idx) in toolbar.tools" :key="idx">
          <a-select
            v-if="btn.type === 'select'"
            v-model="toolbarData[btn.value]"
            :size="btn.size"
            :disabled="btn.disabled"
            :clearable="btn.clearable === false ? btn.clearable : true"
            :filterable="btn.filterable"
            :multiple="btn.multiple"
            :collapse-tags="btn.collapsetags"
            @change="handleEvent(btn.events?.change, toolbarData[btn.value], btn)"
            @clear="handleEvent(btn.events?.clear, toolbarData[btn.value], btn)"
          >
            <a-select-option
              v-for="(childItem, childIndex) in listTypeInfo[btn.list]"
              :key="childIndex"
              :label="childItem.key"
              :value="childItem.value"
              :disabled="childItem.disabled"
            />
          </a-select>
          <vxe-button v-else-if="btn.type === 'dropdowns'" :content="btn.label">
            <template #dropdowns>
              <vxe-button
                v-for="(e, i) in btn.list"
                :key="i"
                type="text"
                :content="e.label"
                @click="handleClick(e.event)"
              />
            </template>
          </vxe-button>
          <a-button
            v-else
            :type="btn.type"
            :disabled="btn.disabled"
            :loading="btn.loading"
            :size="btn.size"
            @click="handleClick(btn.event)"
          >
            <i :class="btn.icon?.includes('xh-icon') ? `xh-iconfont ${btn.icon}` : btn.icon"></i>
            {{ btn.label }}
          </a-button>
        </template>
      </template>
    </vxe-toolbar>

    <!-- table -->
    <vxe-table
      ref="xTable"
      :data="data"
      height="100%"
      style="height: 100%"
      v-bind="gridOptions"
      v-on="gridEvents"
    >
      <template v-for="(item, index) in fieldList" :key="index">
        <!-- 分组列 -->
        <vxe-colgroup
          v-if="item.type === 'group'"
          :field="item.field"
          :title="item.title"
          :fixed="item.fixed"
        >
          <template v-for="(el, idx) in item.fieldList" :key="idx">
            <vxe-column
              :type="el.type"
              :align="el.align || 'left'"
              :field="el.field"
              :title="el.title"
              :fixed="el.fixed"
              :width="el.width"
              :min-width="el.minWidth"
              :sort-by="el.sortBy"
              :sortable="el.sortable"
              :formatter="el.formatter"
              resizable
              :edit-render="formatEditRender(el.editRender)"
              show-overflow-tooltip
            />
          </template>
        </vxe-colgroup>

        <!-- 普通列 -->
        <vxe-column
          :type="item.type"
          :align="item.align || 'left'"
          :field="item.field"
          :title="item.title"
          :fixed="item.fixed"
          :width="item.width"
          :min-width="item.minWidth"
          :sort-by="item.sortBy"
          :sortable="item.sortable"
          :formatter="item.formatter"
          :title-help="item.titleHelp"
          :edit-render="formatEditRender(item.editRender)"
          :tree-node="treeConfig && index === treeIndex"
          :cell-render="item.cellRender"
          show-overflow-tooltip
        >
          <template #header="{ column }" v-if="item.headerSlot">
            <slot :name="'header-' + item.field" :column="column"></slot>
          </template>
          <template #default="{ row }" v-if="item.slot || item.link">
            <slot v-if="item.slot" :name="'col-' + item.field" :row="row"></slot>
            <span
              v-if="item.link"
              class="link"
              @click="handleClick(item.linkEvent, row[item.field], row)"
              >{{ row[item.field] || item.link }}</span
            >
          </template>
          <template #default="{ row }" v-if="item.handle">
            <div
              v-for="(btn, index) in btnList"
              :key="index"
              style="display: inline-block; margin-left: 5px"
            >
              <a-tooltip :title="btn.label">
                <vxe-button
                  v-if="btn.show"
                  :key="index"
                  :size="btn.size"
                  :type="btn.type"
                  :disabled="btn.disabled"
                  :loading="btn.loading"
                  @click="handleClick(btn.event, row[item.field], row)"
                >
                  <icon-font style="font-size: 18px" :type="btn.icon" />
                </vxe-button>
              </a-tooltip>
              <a-popover v-if="btn.btShow" placement="bottom" trigger="hover">
                <template v-for="(vitem, vindex) in btn.moreList">
                  <vxe-button
                    v-if="vitem.show"
                    :key="vindex"
                    :size="vitem.size"
                    :status="vitem.type"
                    :icon="vitem.icon"
                    :disabled="vitem.disabled"
                    :loading="vitem.loading"
                    @click="handleClick(vitem.event, row[item.field], row)"
                  >
                    {{ vitem.label }}
                  </vxe-button>
                </template>
                <template #reference>
                  <a-button
                    :icon="btn.icon"
                    :type="btn.type"
                    :size="btn.size"
                    @click="handleClick(btn.event, row[item.field], row)"
                    >{{ btn.label }}
                  </a-button>
                </template>
              </a-popover>
            </div>
          </template>
        </vxe-column>
      </template>
    </vxe-table>
  </div>
</template>

<script lang="ts" setup>
  import { VxeTableInstance, VxeGridListeners } from 'vxe-table';
  const props = defineProps({
    refObj: {
      type: Object as any,
      default: null,
    },
    toolbar: {
      // 表头工具栏
      type: Object as any,
      default: () => ({
        show: false,
      }),
    },
    toolbarData: {
      type: Object as any,
      default: () => ({}),
    },
    listTypeInfo: {
      type: Object as any,
      default: () => ({}),
    },
    fieldList: {
      // 表格列配置
      type: Array as any,
      default: () => [],
    },
    data: {
      // 表格数据
      type: Array,
      default: () => [],
    },
    btnList: {
      type: Array as any,
      default: () => [],
    },
    align: {
      // 对齐方式
      type: String,
      default: 'left',
    },
    resizable: {
      // 是否可改变列宽
      type: Boolean,
      default: true,
    },
    spanMethod: {
      // 单元格合并方法
      type: Function,
      default: () => {},
    },
    loading: {
      // loading效果
      type: Boolean,
      default: false,
    },
    border: {
      type: Boolean,
      default: false,
    },
    highlightCurrentRow: {
      type: Boolean,
      default: false,
    },
    height: {
      // 表格高度
      type: [String, Number],
      default: '100%',
    },
    maxHeight: {
      // 表格高度
      type: [String, Number],
      default: '100%',
    },
    radioConfig: {
      // 单选配置
      type: Object,
      default: () => ({
        labelField: '',
        trigger: '',
      }),
    },
    checkboxConfig: {
      // 多选配置
      type: Object,
      default: () => ({
        labelField: '',
        trigger: '',
      }),
    },
    editRules: {
      // 校验规则
      type: Object,
      default: () => ({}),
    },
    editConfig: {
      // 编辑配置
      type: Object,
      default: () => ({
        trigger: 'click',
        mode: 'cell',
        showStatus: true,
      }),
    },
    sortConfig: {
      // 排序配置
      type: Object,
      default: () => ({
        multiple: true,
      }),
    },
    showFooter: {
      // 显示表尾
      type: Boolean,
      default: false,
    },
    showOverflow: {
      type: Boolean,
      default: true,
    },
    footerMethod: {
      // 显示方法
      type: Function,
      default: () => {},
    },
    footerSpanMethod: {
      // 表尾单元格合并方法
      type: Function,
      default: () => {},
    },
    treeConfig: {
      // 树形表格配置
      type: Object,
      default: () => null,
    },
    treeIndex: {
      // 树形表格列索引
      type: Number,
      default: 0,
    },
    rowClassName: {
      // 行类名
      type: Function,
      default: () => {},
    },
    stripe: {
      type: Boolean,
      default: false,
    },
  });

  const emit = defineEmits([
    'update:refObj',
    'handleClick',
    'handleEvent',
    'headerCellClick',
    'radioChange',
    'checkboxChange',
    'checkboxAll',
    'cellClick',
    'footerCellClick',
    'sortChange',
    'scroll',
    'toggleTreeExpand',
    'currentChange',
    'handleClick',
    'handleEvent',
  ]);

  const xTable = ref({} as VxeTableInstance);
  onMounted(() => {
    emit('update:refObj', xTable.value);
  });

  // 表格配置
  const options = {
    size: 'mini',
    align: props.align,
    border: props.border,
    height: props.height,
    loading: props.loading,
    resizable: props.resizable,
    rowClassName: props.rowClassName,
    highlightHoverRow: true,
    showOverflow: props.showOverflow,
    keepSource: true,
    spanMethod: props.spanMethod,
    editRules: props.editRules,
    editConfig: props.editConfig,
    sortConfig: props.sortConfig,
    radioConfig: props.radioConfig,
    checkboxConfig: props.checkboxConfig,
    highlightCurrentRow: props.highlightCurrentRow,
  };
  if (props.maxHeight) {
    options['maxHeight'] = props.maxHeight;
  }
  if (props.treeConfig) {
    options['treeConfig'] = props.treeConfig;
  } else {
    options['stripe'] = props.stripe;
  }
  if (props.showFooter) {
    options['showFooter'] = true;
    options['footerMethod'] = props.footerMethod;
    options['footerSpanMethod'] = props.footerSpanMethod;
  }
  const gridOptions = reactive(options);

  const formatEditRender = (render: any) => {
    if (render && Object.keys(render).length) {
      return render;
    }
    return null;
  };

  const gridEvents: VxeGridListeners = {
    /**
     * @description: 表头单元格单击事件
     */
    headerCellClick(data) {
      if (data.column.type !== 'checkbox') {
        emit('handleClick', data);
      }
    },

    /**
     * @description: 单选框事件
     */
    radioChange(data) {
      data.$event.stopPropagation();
      emit('radioChange', data);
    },

    /**
     * @description: 复选框切换
     */
    checkboxChange(data) {
      data.$event.stopPropagation();
      emit('checkboxChange', data);
    },

    /**
     * @description: 复选框全选切换
     */
    checkboxAll(data) {
      emit('checkboxAll', data);
    },

    /**
     * @description: 单元格单击事件
     */
    cellClick(data) {
      emit('cellClick', data);
    },

    /**
     * @description: 表尾单元格单击事件
     */
    footerCellClick(data) {
      emit('footerCellClick', data);
    },

    /**
     * @description: 排序事件
     */
    sortChange(data) {
      emit('sortChange', data);
    },

    /**
     * @description: 滚动事件
     */
    scroll(data) {
      emit('scroll', data);
    },

    /**
     * @description: 树节点展开事件
     */
    toggleTreeExpand(data) {
      data.$event.stopPropagation();
      emit('toggleTreeExpand', data);
    },

    /**
     * @description: 当前行改变事件
     */
    currentChange(data) {
      emit('currentChange', data);
    },
  };

  /**
   * @description: toolbar 按钮点击事件
   */
  const handleClick = (event: string, data?: any, item?: any) => {
    event && emit('handleClick', event, data, item);
  };

  /**
   * @description: toolbar 按钮点击事件
   */
  const handleEvent = (event: string, data?: any, item?: any) => {
    event && emit('handleEvent', event, data, item);
  };
</script>

<style lang="less">
  .zhqc_vxe_table_notShow {
    height: calc(100% - 5px) !important;
  }

  .zhqc_vxe_table_show {
    height: calc(100% - 45px) !important;
  }

  .zhqc_vxe_table {
    width: 100%;
    height: 100%;

    .link {
      color: #0394ff;
      cursor: pointer;

      &:hover {
        text-decoration: underline;
      }
    }

    .vxe-toolbar {
      margin-bottom: 10px;
      flex-wrap: wrap;
      height: auto;

      .vxe-buttons--wrapper {
        display: flex;
        align-items: center;

        .title {
          margin-right: 10px;
          font-weight: 700;
          font-size: 12px;
          color: #000;
        }
      }
    }

    .vxe-toolbar.size--mini {
      height: 30px;
    }

    .border--default {
      .vxe-table--border-line {
        width: 0 !important;
        height: 0 !important;
      }
    }

    .vxe-table--header {
      background-color: #f5f5f5;

      .vxe-header--column.col--left {
        font-weight: 400 !important;
      }

      .vxe-header--column.col--seq .vxe-cell {
        &:after {
          width: 1px;
          height: 50%;
          background-color: #d9dddf;
        }
      }
    }

    .vxe-table--header-wrapper {
      .vxe-table--header-border-line {
        border-bottom: 1px solid #cfcfcf;
      }
    }

    .vxe-body--row {
      transition: background 0.2s;

      &.row--stripe {
        background-color: #f5f7fa;
      }

      &.row--hover,
      &.row--hover.row--stripe {
        background-color: #eef8ff;
      }

      &.row--current-disabled {
        background-color: #edeff2 !important;
      }
    }

    .vxe-table--render-default .vxe-body--row.row--current {
      background-color: rgba(64, 158, 255, 0.3) !important;
    }
  }
</style>
