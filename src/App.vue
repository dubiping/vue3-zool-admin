<script lang="ts" setup>
  import 'dayjs/locale/zh-cn';
  import { AppProvider } from '/@/components/Application';

  import { useTitle } from '/@/hooks/web/useTitle';
  import { useLocale } from '/@/locales/useLocale';
  import { useRouter } from 'vue-router';
  import { usePermissionStore } from '/@/store/modules/permission';

  const { getAntdLocale } = useLocale();
  useTitle();

  const permissionStore = usePermissionStore();
  const router = useRouter();

  watch(
    () => router.currentRoute.value,
    (val) => {
      permissionStore.setPermCodeList((val as any).meta.pageOpKeyList || []);
      permissionStore.setPermFieldList((val as any).meta.fieldList || []);
    },
    {
      immediate: true,
    },
  );
</script>
<template>
  <a-config-provider :locale="getAntdLocale" componentSize="small">
    <AppProvider>
      <router-view />
    </AppProvider>
  </a-config-provider>
</template>
