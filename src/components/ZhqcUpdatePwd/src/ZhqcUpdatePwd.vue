<template>
  <BasicModal
    :footer="null"
    :title="t('profile.updatePwd')"
    v-bind="$attrs"
    v-model:visible="dialogVisible"
  >
    <div>
      <ZhqcForm
        v-model:formRef="basicFormState.formRef"
        :model="basicFormState.model"
        size="default"
        :showActionButtonGroup="false"
        :labelWidth="90"
        :schemas="basicFormSchemas"
      >
        <template #oldPwd>
          <a-input-password
            visibilityToggle
            v-model:value="basicFormState.model.oldPwd"
            :placeholder="t('profile.msg.oldPwd')"
          />
        </template>
        <template #newPwd>
          <a-input-password
            visibilityToggle
            v-model:value="basicFormState.model.newPwd"
            :placeholder="t('profile.msg.newPwd')"
          />
        </template>
        <template #confirmPwd>
          <a-input-password
            visibilityToggle
            v-model:value="basicFormState.model.confirmPwd"
            :placeholder="t('profile.msg.confirmPwd')"
          />
        </template>
      </ZhqcForm>
      <div class="pl-2 pb-2">
        <div v-for="desc in basicFormState.pwdRule.pwdDescList" :key="desc" class="text-gray-400">
          <InfoCircleOutlined />
          <span class="ml-2">{{ desc }}</span>
        </div>
      </div>

      <div class="text-center">
        <a-button type="primary" block class="mt-2" size="default" @click="handleConfirmSubmit">
          {{ t('common.confirm') }}
        </a-button>
      </div>
    </div>
  </BasicModal>
</template>
<script lang="ts">
  import { defineComponent, reactive, computed, ComputedRef, watch, unref } from 'vue';
  import { message } from 'ant-design-vue';
  import { InfoCircleOutlined } from '@ant-design/icons-vue';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { FormSchema } from '/@/components/Form/index';
  import { useUserStore } from '/@/store/modules/user';
  import { updatePwd, queryPwdRuleById } from '/@/api/user';
  import { getPwdValidator } from '/@/utils/validator';

  export default defineComponent({
    name: 'UpdatePwd',
    components: { InfoCircleOutlined },
    props: {
      visible: {
        type: Boolean,
        default: false,
      },
    },
    emits: ['update:visible'],
    setup(props, { emit }) {
      const { t } = useI18n();
      const userStore = useUserStore();

      const dialogVisible = computed<boolean>({
        get() {
          return props.visible;
        },
        set(val) {
          emit('update:visible', val);
        },
      });

      const basicFormState = reactive<{
        model: any;
        [key: string]: any;
      }>({
        formRef: {},
        model: {},
        pwdRule: {},
      });
      const basicFormSchemas: ComputedRef<FormSchema[]> = computed(() => {
        return [
          {
            field: 'oldPwd',
            label: '',
            component: 'Input',
            slot: 'oldPwd',
            componentProps: {
              placeholder: t('profile.msg.oldPwd'),
            },
            colProps: {
              span: 24,
            },
            rules: [{ required: true, message: t('profile.msg.oldPwd'), trigger: 'blur' }],
          },
          {
            field: 'newPwd',
            label: '',
            component: 'Input',
            slot: 'newPwd',
            componentProps: {
              placeholder: t('profile.msg.newPwd'),
            },
            colProps: {
              span: 24,
            },
            rules: [
              {
                required: true,
                validator: getPwdValidator(basicFormState.pwdRule, t('profile.msg.newPwd')),
                trigger: 'blur',
              },
            ],
          },
          {
            field: 'confirmPwd',
            label: '',
            component: 'Input',
            slot: 'confirmPwd',
            componentProps: {
              placeholder: t('profile.msg.confirmPwd'),
            },
            colProps: {
              span: 24,
            },
            rules: [
              {
                required: true,
                validator: (_rule, value) => {
                  if (!value || !value.length) {
                    return Promise.reject(t('profile.msg.confirmPwd'));
                  } else if (value !== basicFormState.model.newPwd) {
                    return Promise.reject(t('profile.msg.diffPwd'));
                  } else {
                    return Promise.resolve();
                  }
                },
                trigger: 'blur',
              },
            ],
          },
        ];
      });

      const tenantId = computed(() => userStore.getUserInfo.tenantId);
      // watch(
      //   () => unref(tenantId),
      //   (val) => {
      //     if (!val) return;

      //     getPwdRule();
      //   },
      // );

      watch(
        () => props.visible,
        (val) => {
          if (val) {
            getPwdRule();
          }
        },
      );

      async function handleConfirmSubmit() {
        const valid = (await (basicFormState.formRef as any)?.validateFields()) as any;
        if (!valid) return;
        await updatePwd({
          ...basicFormState.model,
        });
        message.success(t('profile.msg.updateSuccess'));
        dialogVisible.value = false;
        (basicFormState.formRef as any)?.resetFields();

        // userStore.logout(true);
      }
      const getPwdRule = async () => {
        const res = await queryPwdRuleById(unref(tenantId));
        basicFormState.pwdRule = res || {};
      };
      return {
        t,
        basicFormState,
        basicFormSchemas,
        handleConfirmSubmit,
        dialogVisible,
      };
    },
  });
</script>
