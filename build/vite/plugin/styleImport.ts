import { createStyleImportPlugin, AndDesignVueResolve } from 'vite-plugin-style-import';

export function configStyleImportPlugin() {
  const styleImportPlugin = createStyleImportPlugin({
    resolves: [AndDesignVueResolve()],
  });
  return styleImportPlugin;
}
