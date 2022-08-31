<script lang="ts" name="ZhqcTopForm" setup>
  import { CloseOutlined, UpOutlined, DownOutlined } from '@ant-design/icons-vue';
  import { BasicForm, useForm } from '/@/components/Form/index';
  import { useDesign } from '/@/hooks/web/useDesign';
  import { useAttrs } from '/@/hooks/core/useAttrs';
  import { usePlan, FieldItem } from './hooks/usePlan';
  import { omit, cloneDeep } from 'lodash-es';

  const props = defineProps({
    moduleName: {
      type: String,
      default: '',
    },
  });
  const { prefixCls } = useDesign('condition-search');
  const attrs: any = useAttrs();

  const [register, { resetFields, submit, getFieldsValue, setFieldsValue }] = useForm({});

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

  /************设置方案************** */
  const initFilterConditionList = (filterList?: FieldItem[]) => {
    let list: any = unref(attrs).schemas;
    if (filterList) {
      list = filterList.reduce((result: any[], t: FieldItem) => {
        const item = list.find((v) => v.field === t.field);
        if (item) {
          result.push(item);
        }
        return result;
      }, []);
      const model = filterList.reduce((result: any, v: FieldItem) => {
        result[v.field as string] = v.isFormat ? JSON.parse(v.value) : v.value;
        return result;
      }, {});
      setFieldsValue(model, true);
    }
    filterConditionList.value = reactive(cloneDeep(unref(list).slice(0, 4)));
  };

  const getFilterConditionValues = () => {
    const formModel = getFieldsValue();
    return unref(filterConditionList).map((v) => {
      const val = formModel[v.field];
      return {
        field: v.field,
        value: typeof val === 'object' ? JSON.stringify(val) : val,
        isFormat: typeof val === 'object',
      };
    });
  };
  const {
    basicPlanForm,
    planList,
    getPlanList,
    handleSelectPlan,
    handleDelPlan,
    handleAddPlan,
    handleCancelPlan,
  } = usePlan({
    moduleName: props.moduleName,
    getFilterConditionValues,
    initFilterConditionList,
  });

  onMounted(() => {
    getPlanList().finally(() => {
      submit();
    });
  });
</script>

<template>
  <div :class="prefixCls">
    <div v-show="isCollapsed" class="p-2 bg-white" :class="`${prefixCls}-main`">
      <BasicForm
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
            :placeholder="$t('common.chooseText')"
            size="small"
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

      <!-- 按钮 -->
      <a-row type="flex" justify="end" :gutter="16">
        <a-col :span="12" class="!flex justify-end">
          <a-space>
            <a-popover
              v-model:visible="basicPlanForm.visible"
              :title="$t('sys.topForm.planTit')"
              placement="bottom"
              trigger="click"
              overlayClassName="plan-popover"
            >
              <a-button type="link">{{ $t('sys.topForm.planTit') }}</a-button>

              <template #content>
                <div class="plan-content">
                  <div
                    v-for="item in planList"
                    :key="item.id"
                    class="plan-item p-2 m-2"
                    @click="handleSelectPlan(item.id)"
                  >
                    <span>{{ item.name }}</span>
                    <div v-if="item.id === basicPlanForm.selected" class="icon-checked"></div>
                    <div class="icon-close" @click="handleDelPlan(item)"></div>
                  </div>

                  <div
                    v-show="!planList.length"
                    class="no-plan flex items-center justify-center w-full"
                  >
                    <span>{{ $t('sys.topForm.noPlan') }}</span>
                  </div>
                </div>
                <div
                  v-show="planList.length < 5"
                  class="plan-footer flex items-center border-t !pt-2"
                >
                  <a-input
                    v-model:value="basicPlanForm.name"
                    size="small"
                    :placeholder="$t('sys.topForm.planName')"
                    clearable
                    style="width: 178px; height: 28px"
                  />
                  <a-button class="ml-2" size="small" type="primary" @click="handleAddPlan">
                    {{ $t('sys.topForm.savePlan') }}
                  </a-button>
                  <a-button size="small" type="link" @click="handleCancelPlan">
                    {{ $t('common.cancelText') }}
                  </a-button>
                </div>
              </template>
            </a-popover>
            <zhqc-button
              @click="handleAddCondition"
              type="primary"
              :preIcon="'ant-design:plus-outlined'"
              ghost
            >
              {{ $t('common.newCondition') }}
            </zhqc-button>
            <zhqc-button
              @click="handleSearch"
              type="primary"
              :preIcon="'ant-design:search-outlined'"
            >
              {{ $t('common.searchText') }}
            </zhqc-button>
            <zhqc-button @click="handleReset" :preIcon="'ant-design:undo-outlined'">
              {{ $t('common.resetText') }}
            </zhqc-button>
          </a-space>
        </a-col>
      </a-row>
    </div>
    <div @click="isCollapsed = !isCollapsed" class="fold_btn">
      <UpOutlined v-if="isCollapsed" />
      <DownOutlined v-else />
    </div>
  </div>
</template>
<style lang="less" scoped>
  @prefix-cls: ~'@{namespace}-condition-search';

  .@{prefix-cls} {
    position: relative;
    border-bottom: 1px solid #ededed;

    .fold_btn {
      width: 50px;
      height: 16px;
      line-height: 16px;
      text-align: center;
      position: absolute;
      bottom: -15.5px;
      left: 50%;
      z-index: 1;
      transform: translateX(-50%);
      background-color: #fff;
      border: 1px solid #ededed;
      border-top: 0 !important;
      cursor: pointer;
      border-radius: 0 0 4px 4px;
      font-size: 12px;
    }

    :deep(.zhqc-search-form-item) {
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
  }

  [data-theme='dark'] {
    .@{prefix-cls} {
      border-color: #303030;

      &-main {
        background: #1f1f1f;
      }

      .fold_btn {
        background: #1f1f1f;
        border-color: #303030;
      }
    }
  }
</style>
<style lang="less">
  .plan-popover {
    :deep(.ant-popover-inner-content) {
      padding: 12px 0;
      width: 350px;
    }

    .plan-content {
      padding: 0 6px 10px;
      display: flex;
      align-items: center;
      flex-wrap: wrap;

      .plan-item {
        border: 1px solid #d0d3d6;
        border-radius: 4px;
        position: relative;
        cursor: pointer;

        &:hover {
          border-color: #3370ff;

          .icon-close {
            display: block;
          }
        }

        .icon-checked {
          width: 10px;
          height: 10px;
          position: absolute;
          right: 0;
          bottom: 0;
          background-image: url('/@/assets/images/auth/icon-checked.png');
          background-size: 100%;
          background-repeat: no-repeat;
        }

        .icon-close {
          width: 14px;
          height: 14px;
          position: absolute;
          right: -7px;
          top: -7px;
          background-image: url('/@/assets/images/auth/icon-close-red.png');
          background-size: 100%;
          background-repeat: no-repeat;
          cursor: pointer;
          display: none;
        }
      }

      .no-plan {
        color: #999;
        height: 40px;
        font-size: 12px;
      }
    }

    .plan-footer {
      padding: 10px 16px 0;
    }
  }
</style>
