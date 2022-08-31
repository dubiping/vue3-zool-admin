<template>
  <div class="zhqc_upload">
    <div class="upload-image">
      <component
        ref="uploadRef"
        v-bind="uploadConfig"
        :disabled="disabled"
        :headers="getHeaders"
        v-model:file-list="uploadedFileList"
        :is="uploadComponent"
        :class="{ max_count: uploadedFileList.length >= maxCount }"
        :showUploadList="{
          showPreviewIcon: true,
          showRemoveIcon: true,
          showDownloadIcon: true,
        }"
        @change="handleChange"
        @download="handleDownload"
        @drop="handleDrop"
        @preview="handlePreview"
        @reject="handleReject"
        @remove="handleRemove"
      >
        <Icon v-if="type === 'plus'" icon="ant-design:plus-outlined" />
        <div v-if="type === 'btn'">
          <a-button v-bind="btnConfig" preIcon="ant-design:cloud-upload-outlined">
            {{ btnText }}
          </a-button>
        </div>
        <div v-if="type === 'drag'">
          <Icon icon="ant-design:cloud-upload-outlined" />
          <div class="ant-upload-hint">
            将文件托到此处，或 <em>点击上传</em>
            <p>最多10附件，大小限制100M</p>
          </div>
        </div>
      </component>
    </div>
    <div v-if="showTips && uploadTips" class="upload-tips">
      {{ uploadTips }}
    </div>

    <BasicModal
      v-model:visible="basicDialogState.visible"
      v-bind="$attrs"
      :title="basicDialogState.title"
      :width="basicDialogState.width"
      :showOkBtn="true"
      :showCancelBtn="false"
      :ok-text="t('common.download')"
      @ok="handleDownloadEvent"
    >
      <img alt="example" style="width: 100%" :src="basicDialogState.previewImage" />
    </BasicModal>
  </div>
</template>

<script lang="ts">
  import { defineComponent, ref, reactive, computed, watch, onBeforeMount, onMounted } from 'vue';
  import { Upload } from 'ant-design-vue';
  import { Icon } from '/@/components/Icon';
  import { BasicModal } from '/@/components/Modal';
  import { basicProps } from './props';

  import { useUserStoreWithOut } from '/@/store/modules/user';
  import { getUrlParams } from '/@/utils/index';
  import { downloadByOnlineUrl } from '/@/utils/file/download';
  import { getToken } from '/@/utils/auth';
  import { getAppEnvConfig } from '/@/utils/env';

  import { useI18n } from '/@/hooks/web/useI18n';
  const { t } = useI18n();
  const { VITE_GLOB_API_URL } = getAppEnvConfig();

  export default defineComponent({
    name: 'ZhqcUpload',
    components: {
      Upload,
      UploadDragger: Upload.Dragger,
      Icon,
      BasicModal,
    },
    props: basicProps,
    emits: [
      'update:files',
      'onChange',
      'onDownload',
      'onDrop',
      'onPreview',
      'onReject',
      'onRemove',
    ],
    setup(props, { emit }) {
      const uploadRef: any = ref(null);

      const uploadedFileList = ref<any[]>([]);

      const basicDialogState = reactive({
        visible: false,
        width: 520,
        previewImage: '',
        title: '',
      });
      watch(
        () => props.files,
        (val) => {
          uploadedFileList.value = val.map((url, i) => {
            const data: any = typeof url === 'string' ? { url } : url || {};
            return {
              ...data,
              fileUrl: data.fileUrl || data.url,
              url: data.url || data.fileUrl,
              uid: data.uid || i,
              status: 'done',
            };
          });
        },
        { deep: true },
      );

      const uploadComponent = computed(() => {
        return props.type === 'drag' ? 'UploadDragger' : 'Upload';
      });

      const btnConfig = computed(() => {
        let config: any = {
          disabled: props.disabled,
        };
        return config;
      });

      const userStore = useUserStoreWithOut();
      const getHeaders = computed(() => {
        const token =
          getUrlParams()?.token ||
          userStore.getToken ||
          getToken() ||
          userStore.getLocalToken ||
          ''; //${'Bearer'}
        return {
          Authorization: token.startsWith('Bearer') ? token : `${'Bearer'} ${token}`,
        };
      });

      onBeforeMount(() => {
        initUploadConfig();
      });

      onMounted(() => {
        emit('update:files', []);
      });

      /* 初始化配置 */
      const uploadTips = ref('');
      const uploadConfig: any = reactive({
        ...props,
      });
      const initUploadConfig = () => {
        uploadConfig.action = `${VITE_GLOB_API_URL}${props.action || '/fileManager/upload'}`;
        // uploadConfig.headers = { Authorization: token }; // : localStorage.getItem('token')
        if (Object.prototype.toString.call(props.accept) === '[object String]') {
          uploadConfig.accept = props.accept;
        }

        if (props.listType) {
          uploadConfig.listType = props.listType;
        } else {
          const listType = {
            plus: 'picture-card',
            drag: 'text',
            btn: 'text',
          };
          uploadConfig.listType = listType[props.type];
        }

        uploadConfig.showUploadList = props.showUploadList || props.type !== 'plus';
        uploadTips.value = `最多上传${props.maxCount}个文件`;
      };

      /* 文件上传前校验 */
      // const validate = (file?: any) => {
      //   if (fileOp.list.length >= props.limit) {
      //     instance.$message.error(uploadTips.value);
      //     return false;
      //   } else {
      //     return true;
      //   }
      // };

      const handleChange = ({ file, fileList }) => {
        if (file.status === 'done') {
          const list = fileList.map((v) => {
            if (!v.response) return v;
            const { fileId, fileUrl } = v.response?.data || {};
            return {
              status: v.status,
              uid: v.uid,
              name: v.name,
              url: fileUrl,
              fileId,
              fileUrl,
            };
          });
          uploadedFileList.value = list;
          emit('update:files', list);
        }
        emit('onChange', { file, fileList });
      };

      const handleDownload = (e) => {
        const url = e.filePath || e.fileUrl || '';
        const title = url.substring(url.lastIndexOf('/') + 1, url.length);
        downloadByOnlineUrl(url, title);
        emit('onDownload');
      };

      const handleDrop = () => {
        emit('onDrop');
      };

      const handlePreview = (e) => {
        basicDialogState.visible = true;
        const url = e.filePath || e.fileUrl || '';
        basicDialogState.title = url.substring(url.lastIndexOf('/') + 1, url.length);
        basicDialogState.previewImage = url;
        emit('onPreview');
      };

      const handleReject = () => {
        emit('onReject');
      };

      const handleRemove = (file: any) => {
        uploadedFileList.value = uploadedFileList.value.filter((f: any) => f.uid !== file.uid);
        emit('update:files', uploadedFileList.value);
        emit('onRemove');
      };

      const handleDownloadEvent = () => {
        downloadByOnlineUrl(basicDialogState.previewImage, basicDialogState.title);
      };

      return {
        t,
        basicDialogState,
        uploadRef,
        uploadedFileList,
        uploadComponent,
        uploadConfig,
        getHeaders,
        btnConfig,
        uploadTips,
        handleChange,
        handleDownload,
        handleDrop,
        handlePreview,
        handleReject,
        handleRemove,
        handleDownloadEvent,
      };
    },
  });
</script>

<style lang="less">
  @import url(./index.less);
</style>
