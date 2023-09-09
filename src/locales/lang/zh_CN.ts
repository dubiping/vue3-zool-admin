import { genMessage, genPageMessage } from '../helper';
import antdLocale from 'ant-design-vue/es/locale/zh_CN';

const modules: any = import.meta.glob('./zh-CN/**/*.ts', { eager: true });
const context: any = import.meta.glob('/src/page/**/*.zh.ts', { eager: true });

export default {
  message: {
    ...genMessage(modules, 'zh-CN'),
    ...genPageMessage(context),
    antdLocale,
  },
};
