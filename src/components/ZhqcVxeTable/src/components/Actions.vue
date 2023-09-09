<template>
  <div class="action_btn">
    <div
      v-for="(item, index) in showList"
      :key="index"
      :style="{ display: 'inline-block', marginLeft: isShow(item) ? '5px' : '0px' }"
    >
      <a-tooltip v-if="buttonMode === 'icon' && item.icon" placement="top" :title="item.label">
        <a-button
          :key="index"
          :type="item.type"
          :disabled="disabled(item)"
          :loading="item.loading"
          :style="getStyle(item.color)"
          size="small"
          @click="handleClick(item.event)"
        >
          <template #icon>
            <IconFont :type="item.icon" />
          </template>
        </a-button>
      </a-tooltip>
      <a-button
        v-else
        :key="index"
        :type="item.type"
        :disabled="disabled(item)"
        :loading="item.loading"
        size="small"
        :style="getStyle(item.color)"
        @click="handleClick(item.event)"
      >
        {{ item.label }}
      </a-button>
    </div>

    <!-- 更多按钮 -->
    <a-dropdown v-if="moreList.length">
      <a-button size="small" type="link" @click.prevent>
        <template v-if="buttonMode === 'icon'">
          <EllipsisOutlined />
        </template>
        <template v-else>
          {{ $t('common.more') }}
          <DownOutlined class="!ml-1" />
        </template>
      </a-button>
      <template #overlay>
        <a-menu>
          <template v-for="(item, index) in moreList" :key="index">
            <a-menu-item :disabled="disabled(item)" @click="handleClick(item.event)">
              <div :style="getStyle(item.color)">
                <IconFont :type="item.icon" />
                <span class="ml-1">{{ item.label }}</span>
              </div>
            </a-menu-item>
            <a-menu-divider />
          </template>
        </a-menu>
      </template>
    </a-dropdown>
  </div>
</template>

<script lang="ts" setup>
  import { DownOutlined, EllipsisOutlined } from '@ant-design/icons-vue';
  import { isFunction } from '/@/utils/is';

  /**
           *  按钮参数
              label: t('common.enable'),
              type: 'link',
              show: true,
              icon: 'icon-by-shutdown', 只能使用iconfont里图标
              disabled: true,
              fixed: 'right', // left固定左侧  right 固定右侧
              color: 'red',   // 按钮文字和图标颜色
              event: (record) => {
                handleEnable(record);
              },
           */

  const props = defineProps({
    // params: {
    //   type: Object,
    //   default: () => ({}),
    // },
    row: {
      type: Object,
      default: () => ({}),
    },
    rowIndex: {
      type: [String, Number],
      default: '',
    },
    actions: {
      type: Array as PropType<any[]>,
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

  // const { data, rowIndex, colDef } = props.params;
  // const { actions = [], limit, buttonMode } = colDef?.headerGroupComponentParams || {};

  const isShow = (item) => {
    return isFunction(item.show) ? item.show(props.row) : item.show === false ? false : true;
  };
  const disabled = (item) => {
    return isFunction(item.disabled) ? item.disabled(props.row) : item.disabled;
  };
  const getStyle = (color) => {
    return color ? `color: ${color}` : '';
  };

  // 初始化按钮列表
  const initActions = () => {
    const list = props.actions.filter((v) => isShow(v));

    // 没有设置限制值，或者按钮数量 <= 限制值，直接全部显示，不做更多操作
    if (props.limit < 1 || list.length <= props.limit) return [list, []];

    // 固定左侧按钮
    const leftList = list.filter((v) => v.fixed === 'left');
    // 固定右侧按钮
    const rightList = list.filter((v) => v.fixed === 'right');
    // 动态按钮
    const centerList = list.filter((v) => v.fixed !== 'left' && v.fixed !== 'right');

    const leftCount = leftList.length;
    const rightCount = rightList.length;
    const count = props.limit - 1;

    // 左侧按钮数量 >= 限制数量， 显示左侧按钮数量，其他按钮放入更多里面
    if (leftCount >= count) {
      return [leftList.slice(0, count), [...leftList.slice(count), ...centerList, ...rightList]];
    } else if (leftCount + rightCount >= count) {
      const index = count - leftCount;
      return [
        [...leftList, ...rightList.slice(0, index)],
        [...centerList, ...rightList.slice(index)],
      ];
    } else {
      const index = count - leftCount - rightCount;
      return [[...leftList, ...centerList.slice(0, index), ...rightList], centerList.slice(index)];
    }
  };

  const [showList, moreList] = initActions();

  const handleClick = (event: Function) => {
    if (event && isFunction(event)) {
      event({ rowIndex: props.row, ...props.row });
    }
  };
</script>
