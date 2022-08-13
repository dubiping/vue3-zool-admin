<script lang="ts" setup>
  import { useBasic } from './hooks/basicHook';
  const $vm: any = {};

  const count = ref<number>(0);
  const { handleClick } = useBasic({ $vm });
  Object.assign($vm, {
    count,
  });
</script>

<template>
  <div>
    <div>{{ count }}</div>
    <a-button @click="handleClick">点击!!</a-button>
  </div>
</template>
