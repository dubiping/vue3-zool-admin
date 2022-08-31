import { reactive, computed, ComputedRef } from 'vue';
import { FormSchema } from '/@/components/Table';
import { useI18n } from '/@/hooks/web/useI18n';
import { useTableCols } from '/@/hooks/web/useTableCols';
import { dynamicFieldsEnum } from '../enum';
const { t } = useI18n();

export function useBasicForm({ selectOptions }) {
  const { filterPermFiledCols } = useTableCols();
  const basicFormSchema: ComputedRef<FormSchema[]> = computed(() => {
    return filterPermFiledCols(
      [
        {
          field: 'tenantId',
          label: t('macAddressBinding.tenantId'),
          component: 'Select',
          colProps: { span: 6 },
          componentProps: {
            options: selectOptions?.tenantList,
            showSearch: true,
            filterOption: (input: string, option: any) => {
              return option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0;
            },
          },
        },
        {
          field: 'macAddr',
          label: t('macAddressBinding.macAddr'),
          component: 'Input',
          colProps: { span: 6 },
        },
        {
          field: 'addrDesc',
          label: t('macAddressBinding.addrDesc'),
          component: 'Input',
          colProps: { span: 6 },
        },
      ],
      dynamicFieldsEnum,
    );
  });

  const getInitialModel = () => {
    const model = {};
    basicFormSchema.value.forEach((schema) => {
      model[schema.field] = null;
    });
    return model;
  };
  const basicFormConfig = reactive<{
    model: any;
    [key: string]: any;
  }>({
    model: getInitialModel(),
    labelWidth: 120,
    submitOnReset: false,
    actionColOptions: {
      span: 24,
    },
    compact: true,
    showAdvancedButton: true,
    alwaysShowLines: 1,
    submitOnChange: true,
  });

  return {
    basicFormConfig,
    basicFormSchema,
  };
}
