import type { InjectionKey, Ref } from 'vue';
import { computed, unref } from 'vue';
import { createContext, useContext } from '/@/hooks/core/useContext';

export interface AppProviderContextProps {
  prefixCls: Ref<string>;
  isMobile: Ref<boolean>;
}

const key: InjectionKey<AppProviderContextProps> = Symbol();

export function createAppContext(context: AppProviderContextProps) {
  return createContext<AppProviderContextProps>(context, key);
}

export function useAppContext() {
  return useContext<AppProviderContextProps>(key);
}

export function useAppInject() {
  const values = useAppContext();

  return {
    getIsMobile: computed(() => unref(values.isMobile)),
  };
}
