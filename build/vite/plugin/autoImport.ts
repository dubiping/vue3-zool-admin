/**
 * @name AutoImportDeps
 * @description 按需加载，自动引入依赖
 */
import AutoImport from 'unplugin-auto-import/vite';

export const AutoImportDeps = () =>
  AutoImport({
    include: [
      /\.[tj]sx?$/, // .ts, .tsx, .js, .jsx
      /\.vue$/,
      /\.vue\?vue/, // .vue
      /\.md$/, // .md
    ],
    imports: ['vue', 'vue-router'],
    eslintrc: {
      enabled: false, // Default `false`
      filepath: './.eslintrc-auto-import.json', // Default `./.eslintrc-auto-import.json`
      globalsPropValue: true, // Default `true`, (true | false | 'readonly' | 'readable' | 'writable' | 'writeable')
    },
    dts: 'src/auto-imports.d.ts',
  });
