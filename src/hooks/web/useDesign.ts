import { useAppContext } from '/@/hooks/web/useAppContext';
export function useDesign(scope: string) {
  const values = useAppContext();
  return {
    prefixCls: `${values.prefixCls}-${scope}`,
    prefixVar: values.prefixCls,
  };
}
