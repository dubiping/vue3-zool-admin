import { genMessage, genPageMessage } from '../helper';
import antdLocale from 'ant-design-vue/es/locale/en_US';

const modules: any = import.meta.glob('./en/**/*.ts', { eager: true });

const context: any = import.meta.glob('/src/page/**/*.en.ts', { eager: true });

export default {
  message: {
    ...genMessage(modules, 'en'),
    ...genPageMessage(context),
    antdLocale,
  },
  dateLocale: null,
  dateLocaleName: 'en',
};
