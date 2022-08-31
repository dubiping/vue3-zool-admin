<template>
  <BasicModal
    v-model:visible="dialogVisible"
    v-bind="$attrs"
    :title="title"
    :width="width"
    :showOkBtn="true"
    @ok="handleConfirm"
    @visible-change="handleVisibleChange"
  >
    <div class="zhqc-upload flex justify-center items-center" style="height: 200px">
      <div v-show="!fileData.fileName" class="flex flex-col justify-center items-center">
        <component
          :is="uploadComponent"
          v-model:file-list="uploadedFileList"
          :listType="getListType"
          :accept="getFileAccept"
          :action="null"
          :maxCount="1"
          :beforeUpload="handleBeforeUpload"
          style="width: inherit"
        >
          <Icon v-if="type === 'plus'" icon="ant-design:plus-outlined" />
          <div v-if="type === 'btn'">
            <a-button preIcon="ant-design:cloud-upload-outlined">
              {{ btnText }}
            </a-button>
          </div>
          <div v-if="type === 'drag'">
            <Icon icon="ant-design:cloud-upload-outlined" />
            <div class="ant-upload-hint"> 将文件托到此处，或 <em>点击上传</em> </div>
          </div>
        </component>

        <div class="text-gray-400 mt-4">
          只支持{{ getAcceptTip }}格式、文件大小不能大于{{ maxSize }}M
        </div>
      </div>
      <div v-show="fileData.fileName">
        <div class="file-box px-2 flex items-center justify-between border rounded relative">
          <div class="file-icon">
            <img :src="getImage(fileData.fileType)" />
          </div>
          <div class="ml-2 flex-1">
            <div class="text-lg ellipse-2">{{ fileData.fileName }}</div>
            <div class="text-sm text-gray-400">{{ dealFileSize(fileData.fileSize) }}</div>
          </div>
          <div
            class="close-btn absolute cursor-pointer text-gray-400 text-lg"
            @click="handleClickDel"
          >
            <CloseCircleOutlined />
          </div>
        </div>
      </div>
    </div>
  </BasicModal>
</template>
<script lang="ts">
  import { defineComponent, computed, ref, unref } from 'vue';
  import { BasicModal } from '/@/components/Modal';
  import { Upload, message } from 'ant-design-vue';
  import { CloseCircleOutlined } from '@ant-design/icons-vue';
  import { Icon } from '/@/components/Icon';

  import { basicProps } from './props';
  import { useI18n } from '/@/hooks/web/useI18n';
  const { t } = useI18n();

  const modules = import.meta.glob('./image/*.jpg');
  const imageMap = {};
  Object.keys(modules).forEach((key) => {
    modules[key]().then((res: any) => {
      const k = key.replace(/^.+?\/([^\/]+?)(.[^.\/]*?)?$/gi, '$1');
      imageMap[k] = res.default || {};
    });
  });

  const mineTypeMap = {
    mp3: 'audio/mpeg',
    txt: 'text/plain',
    doc: 'application/msword',
    docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    xls: 'application/vnd.ms-excel',
    xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    ppt: 'application/vnd.ms-powerpoint',
    pptx: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    pdf: 'application/pdf',
    rar: 'application/x-rar-compressed',
    zip: 'application/x-zip-compressed',
    json: 'application/json',
  };

  export default defineComponent({
    name: 'ZhqcUploadFile',
    components: {
      BasicModal,
      Upload,
      UploadDragger: Upload.Dragger,
      Icon,
      CloseCircleOutlined,
    },
    props: basicProps,
    emits: ['update:visible', 'confirm'],
    setup(props, { emit }) {
      const uploadedFileList = ref<any[]>([]);
      const fileData = ref({
        fileName: '',
        raw: null,
        fileSize: 0,
        fileType: '',
      });

      const dialogVisible = computed<boolean>({
        get() {
          return props.visible;
        },
        set(val) {
          emit('update:visible', val);
        },
      });

      const uploadComponent = computed(() => {
        return props.type === 'drag' ? 'UploadDragger' : 'Upload';
      });
      const getListType = computed(() => {
        const listType = {
          plus: 'picture-card',
          drag: 'text',
          btn: 'text',
        };
        return listType[props.type];
      });

      const getAcceptTip = computed(() => {
        return props.accept.split(',').join('、');
      });
      const getFileAccept = computed<string>(() => {
        return props.accept
          .split(',')
          .map((v) => {
            return mineTypeMap[v];
          })
          .join(',');
      });

      function handleConfirm() {
        const data = unref(fileData);
        if (!data.raw) {
          return message.error('请选择文件');
        }
        emit('confirm', data);
      }
      function handleVisibleChange(val) {
        !val && handleClickDel();
      }

      const handleBeforeUpload = (file) => {
        if (!file.type || !unref(getFileAccept).includes(file.type)) {
          message.error(`只能上传后缀是${unref(getAcceptTip)}的文件`);
          return false;
        }
        const size = file.size / 1024 / 1024;
        if (size > props.maxSize) {
          message.error(`上传文件大小不超过${props.maxSize}M！`);
          return false;
        }

        const len = file.name.length;
        const start = len > props.maxLength ? len - props.maxLength : 0;
        const fileName = file.name.substring(start);

        fileData.value = {
          fileName: fileName,
          raw: file,
          fileSize: file.size,
          fileType: getFileType(fileName),
        };
        return false;
      };

      function handleClickDel() {
        fileData.value = {
          fileName: '',
          raw: null,
          fileSize: 0,
          fileType: '',
        };
        uploadedFileList.value = [];
      }

      function getImage(type) {
        return imageMap[type] || imageMap.txt;
      }

      function getFileType(fileName) {
        return fileName.substring(fileName.lastIndexOf('.') + 1);
      }

      function toFixed(num, decimals, isZero) {
        const str = num.toFixed(decimals);
        const regexp = /(?:\.0*|(\.\d+?)0+)$/;
        return isZero ? str.replace(regexp, '$1') : str;
      }
      function dealFileSize(fileSize) {
        const size = fileSize || 0;
        const left = size / 1024 / 1024;
        return left > 1
          ? ''.concat(toFixed(left, 2, true), 'M')
          : ''.concat(toFixed(size / 1024, 2, true), 'K');
      }
      return {
        dialogVisible,
        uploadComponent,
        getListType,
        uploadedFileList,
        getAcceptTip,
        getFileAccept,
        fileData,

        handleConfirm,
        handleVisibleChange,
        handleBeforeUpload,
        handleClickDel,
        dealFileSize,
        getImage,
      };
    },
  });
</script>
<style lang="less" scoped>
  .zhqc-upload {
    ::v-deep(.ant-upload-picture-card-wrapper) {
      width: inherit;
    }
  }

  .file-box {
    width: 220px;
    height: 90px;

    .file-icon {
      width: 48px;
      height: 48px;
    }

    .close-btn {
      right: 0;
      top: 0;
      transform: translate(50%, -50%);
    }
  }
</style>
