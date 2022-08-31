<template>
  <div class="app-loading">
    <div class="app-loading-wrap">
      <img src="/resource/img/setup.gif" class="app-loading-logo" alt="Logo" />
    </div>
  </div>
</template>
<script lang="ts" setup>
  import { onMounted } from 'vue';
  import { router } from '/@/router';
  import { PageEnum } from '/@/enums/pageEnum';
  import { useUserStoreWithOut } from '/@/store/modules/user';
  import { getUrlParams } from '/@/utils/index';

  const userStore = useUserStoreWithOut();

  onMounted(async () => {
    const { grantCode, clientIds } = getUrlParams();

    if (grantCode) {
      userStore.setCurrentClient(clientIds);
      await userStore.loginByGrantCode({ code: grantCode });
      await router.replace(PageEnum.BASE_HOME);
    } else if (!userStore.getToken) {
      await userStore.jumpSsoLogin();
    }
  });
</script>
