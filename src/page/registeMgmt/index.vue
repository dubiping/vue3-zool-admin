<script lang="ts" setup>
  import { useBasic } from './hooks/basicHook';
  import { useTimeoutFn } from '@vueuse/core';
  import { formatDate } from '/@/utils/dateUtil';
  const $vm: any = {};

  // const count = ref<number>(0);
  // const { handleClick } = useBasic({ $vm });
  // const { basicDialogState } = useDilog();

  // Object.assign($vm, {
  //   count,
  //   basicDialogState,
  // });

  const dataSource = ref([]);
  const dataSource2 = ref([]);

  const getPageInfo = () => {
    const res = [
      {
        sum: Math.floor(Math.random() * 100),
      },
    ];
    res[0].updateTime = formatDate(Date.now().toString());
    dataSource.value = res;
  };

  const getPageInf2 = () => {
    const res = [
      {
        sum: Math.floor(Math.random() * 100),
      },
    ];
    res[0].updateTime = formatDate(Date.now().toString());
    dataSource2.value = res;
  };

  const { start: inStart, stop: inStop } = useTimeoutFn(() => {
    getPageInfo();
    inStart();
  }, 1000);

  const { start: outStart, stop: outStop } = useTimeoutFn(() => {
    getPageInf2();
    outStart();
  }, 1000);

  onMounted(() => {
    inStart();
    outStart();
  });
  onUnmounted(() => {
    inStop();
    outStop();
  });
</script>

<template>
  <div>
    <a-tabs>
      <a-tab-pane key="1" tab="Tab 1">
        <div v-for="(item, index) in dataSource" :key="index">
          Tab 1时间：{{ item.updateTime }} 数量： {{ item.sum }}
        </div>
      </a-tab-pane>
      <a-tab-pane key="2" tab="Tab 2">
        <div v-for="(item, index) in dataSource2" :key="index">
          Tab 2时间：{{ item.updateTime }} 数量： {{ item.sum }}
        </div>
      </a-tab-pane>
    </a-tabs>
  </div>
</template>
