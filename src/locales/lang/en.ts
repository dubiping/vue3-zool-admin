import { genMessage, genPageMessage } from '../helper';
import antdLocale from 'ant-design-vue/es/locale/en_US';

const modules: any = import.meta.globEager('./en/**/*.ts');

const context: any = import.meta.globEager('/src/page/**/*.en.ts');

export default {
  message: {
    ...genMessage(modules, 'en'),
    ...genPageMessage(context),
    antdLocale,
  },
  dateLocale: null,
  dateLocaleName: 'en',
};
