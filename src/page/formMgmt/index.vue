<script lang="ts" name="FormMgMt" setup>
  import { BasicForm, FormSchema, useForm } from '/@/components/Form/index';
  import { Input } from 'ant-design-vue';
  const schemas: FormSchema[] = [
    {
      field: 'field1',
      component: 'Input',
      label: 'render方式',
      colProps: {
        span: 8,
      },
      rules: [{ required: true }],
      render: ({ model, field }) => {
        return h(Input, {
          placeholder: '请输入',
          value: model[field],
          onChange: (e: ChangeEvent) => {
            model[field] = e.target.value;
          },
        });
      },
    },
    {
      field: 'field2',
      component: 'Input',
      label: 'render组件slot',
      colProps: {
        span: 8,
      },
      rules: [{ required: true }],
      renderComponentContent: () => {
        return {
          suffix: () => 'suffix',
        };
      },
    },
    {
      field: 'field3',
      component: 'Input',
      label: '自定义Slot',
      slot: 'f3',
      colProps: {
        span: 8,
      },
      rules: [{ required: true }],
    },
    {
      field: 'field4',
      component: 'Input',
      label: '自定义Slot',
      colProps: {
        span: 8,
      },
      rules: [{ required: true }],
    },
  ];

  const [register] = useForm({
    labelWidth: 120,
    schemas,
    actionColOptions: {
      span: 24,
    },
  });

  const basicState = reactive<Recordable>({
    model: {},
  });
  const handleSubmit = (values) => {
    console.log(values);
  };

  const handleClick = () => {
    basicState.model.field4 = 'hhhhhhh';
  };
</script>
<template>
  <div>
    <BasicForm v-model:model="basicState.model" @register="register" @submit="handleSubmit">
      <template #f3="{ model, field }">
        <a-input v-model:value="model[field]" placeholder="自定义slot" />
      </template>
    </BasicForm>
    <a-button @click="handleClick">点击</a-button>
  </div>
</template>
