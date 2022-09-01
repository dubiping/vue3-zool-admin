<script lang="ts" name="ExportTemplate" setup>
  import { message } from 'ant-design-vue';

  import { useI18n } from '/@/hooks/web/useI18n';
  import { readData, downloadByData } from '/@/utils/file/download';
  import { exportTemplate } from './api';
  const props = defineProps({
    templateName: {
      type: String,
      default: '',
    },
    exportUrl: {
      type: String,
      default: '',
    },
    exportName: {
      type: String,
      default: '',
    },
    btnText: {
      type: String,
      default: '',
    },
  });

  const { t } = useI18n();
  const loading = ref(false);

  const handleExport = async () => {
    try {
      const res = await exportTemplate({
        url: props.exportUrl,
        params: {
          exportName: props.templateName,
        },
      });

      if (res.type === 'application/json') {
        readData(res).then((resp: any) => {
          if (resp.code === 200) {
            message.success(resp.msg);
            loading.value = false;
          } else {
            message.error(resp.msg);
            loading.value = false;
          }
        });
      } else if (res.type === 'application/vnd.ms-excel') {
        downloadByData(
          res,
          `${props.exportName}.xlsx`,
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8',
        );
        message.success(t('common.msg.success'));
        loading.value = false;
      }
    } catch (error) {
      message.error(t('common.msg.exception'));
      loading.value = false;
    }
  };
</script>
<template>
  <a-button v-auth="'download'" class="ml-2" :loading="loading" @click="handleExport">{{
    btnText || $t('common.downloadTem')
  }}</a-button>
</template>
