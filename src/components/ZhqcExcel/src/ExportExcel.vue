<script lang="ts" name="ExportExcel" setup>
  import { message } from 'ant-design-vue';

  import { useI18n } from '/@/hooks/web/useI18n';
  import { readData, downloadByData } from '/@/utils/file/download';
  import { exportData } from './api';
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
    model: {
      type: Object as PropType<Recordable>,
      default: () => ({}),
    },
    zipFlag: {
      type: Boolean,
      default: false,
    },
    syncFlag: {
      type: Boolean,
      default: true,
    },
    gridFlag: {
      type: Boolean,
      default: true,
    },
    columns: {
      type: Array as PropType<Recordable[]>,
      default: () => [],
    },
  });

  const { t } = useI18n();
  const loading = ref(false);

  const handleExport = async () => {
    try {
      const list = props.columns.filter((v) => !v.type);
      const extraParams = props.gridFlag
        ? {
            fieldList: list.map((v) => v.dataIndex),
            titles: list.map((v) => v.title),
          }
        : {};
      const res = await exportData({
        url: props.exportUrl,
        params: {
          templateName: props.templateName,
          paramMap: {
            ...props.model,
            zoneId: Intl.DateTimeFormat().resolvedOptions().timeZone,
          },
          zipFlag: props.zipFlag,
          syncFlag: props.syncFlag,
          gridFlag: props.gridFlag,
          ...extraParams,
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
      } else if (res.type === 'application/vnd.ms-zip') {
        downloadByData(res, `${props.exportName}.zip`, 'application/zip;charset=utf-8');
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
  <a-button v-auth="'export'" class="ml-2" :loading="loading" @click="handleExport">{{
    btnText || $t('common.export')
  }}</a-button>
</template>
