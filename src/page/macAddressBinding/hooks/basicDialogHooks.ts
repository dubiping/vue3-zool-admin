import { reactive, computed, ComputedRef } from 'vue';
import { FormSchema } from '/@/components/Form/index';
import { useI18n } from '/@/hooks/web/useI18n';
import { useTableCols } from '/@/hooks/web/useTableCols';
import { dynamicFieldsEnum } from '../enum';
const { t } = useI18n();

export function useBasicDialog({ selectOptions }) {
  const { filterPermFiledCols } = useTableCols();
  const basicDialogState = reactive<{
    model: any;
    [key: string]: any;
  }>({
    formRef: {},
    title: '',
    type: 'add',
    visible: false,
    width: 1200,
    model: {},
    initMacType: '',
    initDetailList: [],
  });

  const diaFormSchemas: ComputedRef<FormSchema[]> = computed(() => {
    return filterPermFiledCols(
      [
        // {
        //   field: 'code',
        //   label: t('macAddressBinding.code'),
        //   component: 'Input',
        //   componentProps: {
        //     disabled: basicDialogState.type === 'view',
        //   },
        //   colProps: {
        //     span: 6,
        //   },
        //   rules: [{ required: true, message: t('macAddressBinding.msg.code') }],
        // },
        {
          field: 'macAddr',
          label: t('macAddressBinding.macAddr'),
          component: 'Input',
          componentProps: {
            disabled: basicDialogState.type === 'view',
          },
          colProps: {
            span: 6,
          },
          rules: [{ required: true, message: t('macAddressBinding.msg.macAddr') }],
        },
        {
          field: 'addrDesc',
          label: t('macAddressBinding.addrDesc'),
          component: 'Input',
          componentProps: {
            disabled: basicDialogState.type === 'view',
          },
          colProps: {
            span: 6,
          },
          rules: [{ required: true, message: t('macAddressBinding.msg.addrDesc') }],
        },
        {
          field: 'realAddr',
          label: t('macAddressBinding.realAddr'),
          component: 'Input',
          componentProps: {
            disabled: basicDialogState.type === 'view',
          },
          colProps: {
            span: 6,
          },
        },
        {
          field: 'macType',
          label: t('macAddressBinding.macType'),
          component: 'Select',
          componentProps: {
            disabled: basicDialogState.type === 'view',
            options: selectOptions?.macTypeList,
          },
          colProps: {
            span: 6,
          },
          rules: [{ required: true, message: t('macAddressBinding.msg.macType') }],
        },
        {
          field: 'detailList',
          label: t('macAddressBinding.detailList'),
          component: 'Input',
          slot: 'detailList',
          componentProps: {
            disabled: basicDialogState.type === 'view',
          },
          colProps: {
            span: 12,
          },
          rules: [
            {
              required: basicDialogState.model.macType !== '0',
              validator: (_rule, value, _callback) => {
                // 租户不校验
                const macType = basicDialogState.model.macType;
                if ((!value || !value.length) && macType !== '0') {
                  return Promise.reject(t('macAddressBinding.msg.detailList'));
                }
                return Promise.resolve();
              },
              trigger: 'blur',
            },
          ],
        },

        {
          field: 'isEnable',
          label: t('macAddressBinding.isEnable'),
          component: 'Select',
          componentProps: {
            disabled: true,
            options: selectOptions?.enableTypeList,
          },
          colProps: {
            span: 6,
          },
        },
        {
          field: 'remark',
          label: t('macAddressBinding.remark'),
          component: 'InputTextArea',
          componentProps: {
            disabled: basicDialogState.type === 'view',
          },
          colProps: {
            span: 24,
          },
        },
      ],
      dynamicFieldsEnum,
    );
  });

  return {
    basicDialogState,
    diaFormSchemas,
  };
}
