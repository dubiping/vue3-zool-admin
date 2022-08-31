import type { App } from 'vue';

import { createFromIconfontCN } from '@ant-design/icons-vue';
import 'xe-utils';
import VXETable from 'vxe-table';
import 'vxe-table/lib/style.css';

import ZhqcLayout from '/@/components/ZhqcLayout/index.vue';
import ZhqcAgGridTable from '/@/components/ZhqcAgGridTable/index.vue';
import ZhqcPagination from '/@/components/ZhqcPagination/index.vue';
import { ZhqcTopForm } from '/@/components/ZhqcTopForm/index';
// import { ZhqcAddress } from '/@/components/ZhqcAddress/index';
import { ZhqcUpload } from '/@/components/ZhqcUpload/index';
import { ZhqcCustomCols } from '/@/components/ZhqcCustomCols/index';
import { BasicModal } from '/@/components/Modal';
import { BasicForm } from '/@/components/Form/index';
import { ZhqcVxeTable } from '/@/components/ZhqcVxeTable/index';
import { Button } from './Button';

const Fonts = createFromIconfontCN({
  scriptUrl: '/@/assets/iconfont/iconfont.js',
});

VXETable.setup({
  size: 'mini',
});

export function registerGlobComp(app: App) {
  app
    .use(Button)
    .use(VXETable)
    .component('IconFont', Fonts)
    .component('ZhqcLayout', ZhqcLayout)
    .component('ZhqcAgGridTable', ZhqcAgGridTable)
    .component('ZhqcPagination', ZhqcPagination)
    .component('ZhqcTopForm', ZhqcTopForm)
    // .component('ZhqcAddress', ZhqcAddress)
    .component('ZhqcUpload', ZhqcUpload)
    .component('BasicModal', BasicModal)
    .component('ZhqcForm', BasicForm)
    .component('ZhqcCustomCols', ZhqcCustomCols)
    .component('ZhqcVxeTable', ZhqcVxeTable);
}
