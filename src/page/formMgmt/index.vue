<script lang="ts" name="FormMgMt" setup>
  import { FormSchema, useForm } from '/@/components/Form/index';
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
      suffix: true,
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
    basicState.model = {
      field4: 'jjjj',
    };
  };

  const basicFormSchema = [
    {
      field: 'tenantId',
      label: '租户',
      component: 'Select',
      componentProps: {
        options: [
          {
            label: '租户1',
            value: '122',
          },
          {
            label: '租户2',
            value: '133',
          },
        ],
      },
    },
    {
      field: 'macAddr',
      label: 'mac地址',
      component: 'Input',
    },
    {
      field: 'addrDesc',
      label: '描述',
      component: 'Input',
    },
    {
      field: 'addrDesc2',
      label: '描述2',
      component: 'Input',
    },
    {
      field: 'addrDesc3',
      label: '描述3',
      component: 'Input',
    },
    {
      field: 'addrDesc4',
      label: '描述4',
      component: 'Input',
    },
  ];
</script>
<template>
  <div>
    <ZhqcForm v-model:model="basicState.model" @register="register" @submit="handleSubmit">
      <template #f3="{ model, field }">
        <a-input v-model:value="model[field]" placeholder="自定义slot" />
      </template>
      <template #label>哈哈哈</template>
      <template #suffix>6</template>
    </ZhqcForm>
    <a-button @click="handleClick">点击</a-button>

    <ZhqcTopForm :schemas="basicFormSchema" @submit="handleSubmit" />
  </div>
</template>
