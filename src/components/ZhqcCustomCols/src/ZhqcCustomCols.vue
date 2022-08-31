<template>
  <BasicModal
    v-bind="$attrs"
    v-model:visible="dialogVisible"
    :title="t('common.setting')"
    :width="width"
    :minHeight="minHeight"
    :showOkBtn="true"
    :isWrapperSlot="true"
    @ok="handleConfirm"
    @visible-change="handleVisibleChange"
  >
    <Transfer
      v-loading="loading"
      v-model:fields="basicState.fields"
      :source-fields="getSourceFields"
      @reset="handleReset"
    />
  </BasicModal>
</template>
<script lang="ts" setup>
  import { computed, ref, PropType, reactive, onBeforeMount, watch } from 'vue';
  import { useRoute } from 'vue-router';
  import { message } from 'ant-design-vue';
  import Transfer from './components/Transfer.vue';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { queryTableCols, saveTableCols } from '/@/api/common';

  const { t } = useI18n();

  const props = defineProps({
    visible: {
      type: Boolean,
      default: false,
    },
    width: {
      type: Number,
      default: 720,
    },
    minHeight: {
      type: Number,
      default: 200,
    },
    tableCode: {
      type: String,
      default: '',
    },
    sourceFields: {
      type: Array as PropType<any[]>,
      default: () => [],
    },
    fields: {
      type: Array as PropType<any[]>,
      default: () => [],
    },
  });

  const emit = defineEmits(['update:visible', 'update:fields']);

  const loading = ref(false);
  const dialogVisible = computed<boolean>({
    get() {
      return props.visible;
    },
    set(val) {
      emit('update:visible', val);
    },
  });

  const basicState = reactive<{
    [key: string]: any;
  }>({
    fields: [],
    sourceFields: [],
  });

  const route = useRoute();
  const menuId = route.meta?.menuId;

  const getTableCols = async () => {
    if (!menuId) return initFields();
    try {
      const res = await queryTableCols({
        menuId,
        tableCode: props.tableCode,
      });

      basicState.sourceFields = res || [];

      emit(
        'update:fields',
        (res || props.sourceFields).filter((v) => !v.hidden),
      );
    } catch (error) {
      initFields();
    }
  };

  const initFields = () => {
    basicState.sourceFields = [];
    emit(
      'update:fields',
      props.sourceFields.filter((v) => !v.hidden),
    );
  };

  onBeforeMount(() => {
    getTableCols();
  });

  watch(
    () => props.visible,
    (val) => {
      val && getTableCols();
    },
  );

  watch(
    () => props.sourceFields,
    () => {
      getTableCols();
    },
  );

  const getSourceFields = computed(() => {
    return props.sourceFields
      .map((v) => {
        const item = basicState.sourceFields.find((k) => k.prop === v.prop);
        const hidden = item ? item.hidden : !item && !!basicState.sourceFields.length;
        return {
          ...v,
          ...(item || {}),
          hidden,
          isSelect: false,
        };
      })
      .sort((a, b) => (a.zorder || 0) - (b.zorder || 0));
  });

  const handleConfirm = () => {
    if (!basicState.fields.length) {
      return message.error(t('common.msg.select'));
    }
    if (!menuId) return;
    loading.value = true;
    saveTableCols({
      menuId,
      tableCode: props.tableCode,
      dtList: basicState.fields,
    })
      .then((_) => {
        emit(
          'update:fields',
          basicState.fields.filter((v) => !v.hidden),
        );
        dialogVisible.value = false;
      })
      .finally(() => {
        loading.value = false;
      });
  };

  const handleVisibleChange = () => {};

  const handleReset = () => {
    if (!menuId) return;
    loading.value = true;
    saveTableCols({
      menuId,
      tableCode: props.tableCode,
      dtList: props.sourceFields,
    })
      .then(() => {
        basicState.sourceFields = [];
      })
      .finally(() => {
        loading.value = false;
      });
  };
</script>
