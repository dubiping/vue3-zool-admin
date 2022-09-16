<script lang="ts" name="ImportExcel" setup>
  import { message } from 'ant-design-vue';
  import { ZhqcUploadFile } from '/@/components/ZhqcUploadFile';

  import { readData, downloadByData } from '/@/utils/file/download';
  import { useI18n } from '/@/hooks/web/useI18n';

  import { importData } from './api';

  const props = defineProps({
    templateName: {
      type: String,
      default: '',
    },
    uploadUrl: {
      type: String,
      default: '',
    },
    btnText: {
      type: String,
      default: '',
    },
  });
  const emit = defineEmits(['confirm']);
  const { t } = useI18n();
  const uploadDialogVisible = ref(false);
  const loading = ref(false);
  const handleUpload = async (file) => {
    try {
      const formData = new window.FormData();
      formData.append('uploadFile', file.raw);
      formData.append('uploadFileName', file.fileName);
      formData.append('templateName', props.templateName);
      const res: any = await importData({
        url: `${props.uploadUrl}`,
        params: formData,
      });

      if (res.type === 'application/json') {
        readData(res).then((resp: any) => {
          if (resp.code === 200) {
            message.success(resp.msg);
            loading.value = false;
            uploadDialogVisible.value = false;
            emit('confirm');
          } else {
            message.error(resp.msg);
            loading.value = false;
          }
        });
      } else if (res.type === 'application/vnd.ms-excel') {
        message.error(t('common.msg.importError'));
        downloadByData(
          res,
          `${file.fileName}_error.xlsx`,
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8',
        );
        loading.value = false;
        uploadDialogVisible.value = false;
      }
    } catch (error) {
      loading.value = false;
      message.error(t('common.msg.tryAgain'));
    }
  };
</script>

<template>
  <a-button v-auth="'import'" class="ml-2" @click="uploadDialogVisible = true">{{
    btnText || $t('common.import')
  }}</a-button>
  <ZhqcUploadFile
    v-model:visible="uploadDialogVisible"
    accept="xls,xlsx"
    :title="$t('common.chooseFile')"
    :maxSize="2"
    :confirmLoading="loading"
    @confirm="handleUpload"
  />
</template>
