<script lang="ts" name="BasicForm" setup>
  import type { FormActionType, FormProps, FormSchema } from './types/form';
  import type { AdvanceState } from './types/hooks';
  import type { Ref } from 'vue';
  import FormItem from './components/FormItem.vue';
  import FormAction from './components/FormAction.vue';

  import { dateItemType } from './helper';
  import { dateUtil } from '/@/utils/dateUtil';
  import { deepMerge } from '/@/utils';
  // import { isEmpty } from '/@/utils/is';

  import { basicProps } from './props';
  import { useDesign } from '/@/hooks/web/useDesign';
  import { useAttrs } from '/@/hooks/core/useAttrs';

  import { useFormValues } from './hooks/useFormValues';
  import useAdvanced from './hooks/useAdvanced';
  import { useFormEvents } from './hooks/useFormEvents';
  import { createFormContext } from './hooks/useFormContext';
  import { useAutoFocus } from './hooks/useAutoFocus';
  import { useModalContext } from '/@/components/Modal';
  // import { useDebounceFn } from '@vueuse/core';

  const props = defineProps(basicProps);
  const emit = defineEmits([
    'update:model',
    'update:formRef',
    'advanced-change',
    'reset',
    'submit',
    'register',
  ]);
  const attrs = useAttrs();

  const { prefixCls } = useDesign('basic-form');
  const modalFn = useModalContext();
  const defaultValueRef = ref<Recordable>({});
  const isInitedDefaultRef = ref(false);
  const propsRef = ref<Partial<FormProps>>({});
  const schemaRef = ref<Nullable<FormSchema[]>>(null);
  const formElRef = ref<Nullable<FormActionType>>(null);
  const innerFormModel: any = ref({});

  const advanceState = reactive<AdvanceState>({
    isAdvanced: true,
    hideAdvanceBtn: false,
    isLoad: false,
    actionSpan: 6,
  });

  // 获取表单的基本配置
  const getProps = computed((): FormProps => {
    return { ...props, ...unref(propsRef) } as FormProps;
  });
  // 外部传入model，使用外部model， 否则内部处理，用于hook获取值
  const formModel: any = computed({
    get() {
      return unref(getProps).model ? unref(getProps).model : innerFormModel.value;
    },
    set(val) {
      !unref(getProps).model ? (innerFormModel.value = val) : emit('update:model', val);
    },
  });
  const getFormClass = computed(() => {
    return [
      prefixCls,
      {
        [`${prefixCls}--compact`]: unref(getProps).compact,
      },
    ];
  });

  // 取统一的行样式和行配置
  const getRow = computed((): Recordable => {
    const { baseRowStyle = {}, rowProps } = unref(getProps);
    return {
      style: baseRowStyle,
      ...rowProps,
    };
  });

  const getBindValue = computed(
    () => ({ ...unref(attrs), ...props, ...unref(getProps) } as Recordable),
  );

  const getSchema = computed((): FormSchema[] => {
    const schemas: FormSchema[] = unref(schemaRef) || (unref(getProps).schemas as any);
    for (const schema of schemas) {
      const { defaultValue, component } = schema;
      // 处理日期类型组件的默认值
      if (defaultValue && dateItemType.includes(component)) {
        if (!Array.isArray(defaultValue)) {
          schema.defaultValue = dateUtil(defaultValue);
        } else {
          schema.defaultValue = defaultValue.map((item) => dateUtil(item));
        }
      }
    }
    if (unref(getProps).showAdvancedButton) {
      return schemas.filter((schema) => schema.component !== 'Divider') as FormSchema[];
    } else {
      return schemas as FormSchema[];
    }
  });

  const getFormActionBindProps = computed(
    (): Recordable => ({ ...getProps.value, ...advanceState }),
  );

  const { handleToggleAdvanced } = useAdvanced({
    advanceState,
    emit,
    getProps,
    getSchema,
    formModel,
    defaultValueRef,
  });

  const { handleFormValues, initDefault } = useFormValues({
    getProps,
    defaultValueRef,
    getSchema,
    formModel,
  });

  useAutoFocus({
    getSchema,
    getProps,
    isInitedDefault: isInitedDefaultRef,
    formElRef: formElRef as Ref<FormActionType>,
  });

  const {
    handleSubmit,
    setFieldsValue,
    clearValidate,
    validate,
    validateFields,
    getFieldsValue,
    updateSchema,
    resetSchema,
    appendSchemaByField,
    removeSchemaByFiled,
    resetFields,
    scrollToField,
  } = useFormEvents({
    emit,
    getProps,
    formModel,
    getSchema,
    defaultValueRef,
    formElRef: formElRef as Ref<FormActionType>,
    schemaRef: schemaRef as Ref<FormSchema[]>,
    handleFormValues,
  });

  createFormContext({
    resetAction: resetFields,
    submitAction: handleSubmit,
  });

  watch(
    () => unref(getProps).schemas,
    (schemas) => {
      resetSchema(schemas ?? []);
    },
  );

  watch(
    () => getSchema.value,
    (schema) => {
      nextTick(() => {
        //  Solve the problem of modal adaptive height calculation when the form is placed in the modal
        modalFn?.redoModalHeight?.();
      });
      if (unref(isInitedDefaultRef)) {
        return;
      }
      if (schema?.length) {
        initDefault();
        isInitedDefaultRef.value = true;
      }
    },
  );

  // watch(
  //   () => unref(formModel),
  //   useDebounceFn(() => {
  //     unref(getProps).submitOnChange && handleSubmit();
  //   }, 300),
  //   { deep: true },
  // );

  async function setProps(formProps: Partial<FormProps>): Promise<void> {
    propsRef.value = deepMerge(unref(propsRef) || {}, formProps);
  }

  function setFormModel(key: string, value: any) {
    const model = unref(formModel);
    model[key] = value;
    formModel.value = { ...model };
    const { validateTrigger } = unref(getBindValue);
    if (!validateTrigger || validateTrigger === 'change') {
      validateFields([key]).catch((_) => {});
    }
  }

  function handleEnterPress(e: KeyboardEvent) {
    const { autoSubmitOnEnter } = unref(getProps);
    if (!autoSubmitOnEnter) return;
    if (e.key === 'Enter' && e.target && e.target instanceof HTMLElement) {
      const target: HTMLElement = e.target as HTMLElement;
      if (target && target.tagName && target.tagName.toUpperCase() == 'INPUT') {
        handleSubmit();
      }
    }
  }

  const formActionType: Partial<FormActionType> = {
    getFieldsValue,
    setFieldsValue,
    resetFields,
    updateSchema,
    resetSchema,
    setProps,
    removeSchemaByFiled,
    appendSchemaByField,
    clearValidate,
    validateFields,
    validate,
    submit: handleSubmit,
    scrollToField: scrollToField,
  };

  onMounted(() => {
    initDefault();
    emit('register', formActionType);

    nextTick(() => {
      emit('update:formRef', formElRef.value);
    });
  });
</script>
<template>
  <a-form
    v-bind="getBindValue"
    :class="getFormClass"
    ref="formElRef"
    :model="formModel"
    @keypress.enter="handleEnterPress"
  >
    <a-row v-bind="getRow">
      <slot name="formHeader"></slot>
      <template v-for="schema in getSchema" :key="schema.field">
        <FormItem
          :tableAction="tableAction"
          :formActionType="formActionType"
          :schema="schema"
          :formProps="getProps"
          :allDefaultValues="defaultValueRef"
          :formModel="formModel"
          :setFormModel="setFormModel"
        >
          <template #[item]="data" v-for="item in Object.keys($slots)">
            <slot :name="item" v-bind="data || {}"></slot>
          </template>
          <slot name="label"></slot>
          <slot name="suffix"></slot>
        </FormItem>
      </template>

      <FormAction v-bind="getFormActionBindProps" @toggle-advanced="handleToggleAdvanced">
        <template
          #[item]="data"
          v-for="item in ['resetBefore', 'submitBefore', 'advanceBefore', 'advanceAfter']"
        >
          <slot :name="item" v-bind="data || {}"></slot>
        </template>
      </FormAction>
      <slot name="formFooter"></slot>
    </a-row>
  </a-form>
</template>
