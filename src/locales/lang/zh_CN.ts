import { genMessage, genPageMessage } from '../helper';
import antdLocale from 'ant-design-vue/es/locale/zh_CN';

const modules: any = import.meta.globEager('./zh-CN/**/*.ts');
const context: any = import.meta.globEager('/src/page/**/*.zh.ts');

export default {
  message: {
    ...genMessage(modules, 'zh-CN'),
    ...genPageMessage(context),
    antdLocale,
  },
};
