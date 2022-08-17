<script lang="ts" setup>
import { AppProvider } from '/@/components/Application';
</script>
<template>
  <a-config-provider>
    <AppProvider>
      <router-view></router-view>
    </AppProvider>
  </a-config-provider>
</template>
