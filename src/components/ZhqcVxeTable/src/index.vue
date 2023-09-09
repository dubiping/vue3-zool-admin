<template>
  <vxe-grid v-bind="getBindValue" ref="xTable" class="zhqc_vxe_table">
    <template #action="{ row, rowIndex }">
      <Actions
        :row="row"
        :row-index="rowIndex"
        :actions="actions"
        :limit="limit"
        :button-mode="buttonMode"
      ></Actions>
    </template>
    <template #[item]="data" v-for="item in Object.keys($slots)">
      <slot :name="item" v-bind="data || {}"></slot>
    </template>
  </vxe-grid>
</template>

<script lang="ts" setup>
  import { VxeTableInstance } from 'vxe-table';
  import Actions from './components/Actions.vue';
  import { useAttrs } from '/@/hooks/core/useAttrs';

  defineProps({
    refObj: {
      type: Object as any,
      default: null,
    },
    actions: {
      type: Array,
      default: () => [],
    },
    limit: {
      type: Number,
      default: 4,
    },
    buttonMode: {
      type: String,
      default: 'icon', // 按钮模式， icon图标显示  label文字显示
    },
  });
  const emit = defineEmits(['update:refObj']);

  const xTable = ref({} as VxeTableInstance);
  onMounted(() => {
    emit('update:refObj', xTable.value);
  });

  const attrs = useAttrs({
    excludeKeys: ['actions', 'limit', 'buttonMode'],
  });
  const getBindValue = computed(() => {
    return Object.assign(
      {
        ize: 'mini',
        showOverflow: true,
        keepSource: true,
        highlightHoverRow: true,
        columnConfig: { resizable: true },
        editConfig: { trigger: 'click', mode: 'cell' },
        stripe: true,
      },
      {
        ...unref(attrs),
      },
    );
  });
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

    .vxe-cell--title {
      font-weight: 400;
      color: #626262;
      font-size: 12px;
    }

    .vxe-resizable.is--line {
      &::before {
        height: 30%;
      }
    }

    .vxe-table--header-border-line {
      display: none;
    }

    .vxe-cell--edit-icon,
    .vxe-cell--sort,
    .vxe-cell--filter {
      font-size: 12px;
    }

    .vxe-table {
      height: 100%;
    }

    .vxe-table--empty-placeholder {
      top: 50% !important;
      transform: translateY(19px);
    }

    .vxe-cell--valid {
      z-index: 10 !important;
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
