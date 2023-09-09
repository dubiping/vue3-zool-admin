import { TreeDataItem } from 'ant-design-vue/lib/tree';
import type { PropType } from 'vue';
import { propTypes } from '/@/utils/propTypes';

export const prop = {
  isShowHeader: propTypes.bool.def(true),
  treeData: {
    type: Array as PropType<TreeDataItem[]>,
  },
  fieldNames: {
    type: Object,
    default: () => ({ children: 'children', title: 'orgName', key: 'id' }),
  },
  showType: propTypes.bool.def(false),
  selectId: {
    type: String,
    default: '',
  },
};
