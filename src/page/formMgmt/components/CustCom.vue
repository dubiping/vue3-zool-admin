<script lang="ts" name="CustCom" setup>
  const props = defineProps({
    model: {
      type: Object as PropType<Recordable>,
      default: () => {},
    },
  });

  const basicForm = props.model;
  const handleClick = () => {
    console.log('basicForm', basicForm);
  };
</script>

<template>
  <div>
    <a-input v-model:value="model.field1" />
    <a-button @click="handleClick">子按钮</a-button>
  </div>
</template>
