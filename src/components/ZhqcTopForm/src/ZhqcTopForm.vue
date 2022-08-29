<script lang="ts" name="ZhqcTopForm" setup>
  import { CloseOutlined } from '@ant-design/icons-vue';
  import { BasicForm, useForm } from '/@/components/Form/index';
  import { useDesign } from '/@/hooks/web/useDesign';
  import { useAttrs } from '/@/hooks/core/useAttrs';
  import { omit, cloneDeep } from 'lodash-es';

  const { prefixCls } = useDesign('condition-search');
  const attrs: any = useAttrs();

  const [register, { resetFields, submit }] = useForm({});

  // 展开收起
  const isCollapsed = ref(true);
  // 条件列表
  const filterConditionList: any = ref([]);
  // 下拉选择项
  const fieldList = computed(() => {
    const filterList = unref(filterConditionList).map((v: any) => v.field);
    return unref(attrs).schemas.map((item: any) => {
      return reactive({
        ...item,
        disabled: filterList.includes(item.field),
      });
    });
  });
  const getBindValue = computed(() => omit({ ...unref(attrs) }, ['schemas']) as Recordable);

  watchEffect(() => {
    filterConditionList.value = reactive(cloneDeep(unref(attrs).schemas.slice(0, 4)));
  });

  // 条件下拉搜索框内容改变
  const handleUpdateValue = (event: any) => {
    const item = unref(attrs).schemas.find((v) => event === v.field);
    const index = unref(filterConditionList.value).findIndex((v) => event === v.field);
    filterConditionList.value[index] = { ...item };
  };

  // 删除筛选条件
  const handleRemoveCondition = (field) => {
    const index = unref(filterConditionList.value).findIndex((v) => field === v.field);
    filterConditionList.value.splice(index, 1);
  };

  // 新增筛选条件
  const handleAddCondition = () => {
    filterConditionList.value.push({
      label: '',
      field: null,
      component: 'Input',
    });
  };
  // 点击查询
  const handleSearch = () => {
    submit();
  };

  // 点击重置
  const handleReset = () => {
    resetFields();
  };
</script>

<template>
  <div :class="prefixCls">
    <BasicForm
      v-show="isCollapsed"
      v-bind="$attrs"
      :schemas="filterConditionList"
      :baseColProps="{
        xxl: 6,
        xl: 8,
        lg: 12,
        md: 12,
        sm: 24,
        xs: 24,
      }"
      :labelCol="{
        span: 8,
      }"
      :rowProps="{
        gutter: 16,
      }"
      :showActionButtonGroup="false"
      :showFormItem="false"
      @register="register"
    >
      <template #label="{ schema }">
        <a-select
          v-model:value="schema.field"
          class="!mr-1"
          :style="{ width: '35%' }"
          placeholder="请选择"
          @change="handleUpdateValue($event, i)"
        >
          <a-select-option
            v-for="childItem in fieldList"
            :key="childItem.field"
            :disabled="childItem.disabled"
            :label="childItem.label"
            :value="childItem.field"
          >
            {{ childItem.label }}
          </a-select-option>
        </a-select>
      </template>

      <template #suffix="{ field }">
        <CloseOutlined class="icon-close" @click="handleRemoveCondition(field)" />
      </template>
    </BasicForm>
  </div>
</template>
<style lang="less">
  .zhqc-search-form-item {
    &:hover .icon-close {
      display: block;
    }

    .icon-close {
      position: absolute;
      top: 50%;
      right: -10px;
      transform: translateY(-50%);
      cursor: pointer;
      display: none;
      font-size: 12px;
    }
  }
</style>
