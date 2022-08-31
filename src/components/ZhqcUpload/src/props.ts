export const basicProps = {
  files: {
    // 外部用来接收的文件数据
    type: Array,
    default: () => [],
  },
  // valueKey: {
  //   // files对应的值，返回单个字段值
  //   type: String,
  //   default: '',
  // },
  // valuesKey: {
  //   // files对应的值，返回单个字段值数组
  //   type: String,
  //   default: '',
  // },
  // externalFiles: {
  //   type: Array,
  //   default: () => [],
  // },
  // size: {
  //   // 单个文件大小
  //   type: Number,
  //   default: 2,
  // },

  type: {
    // 上传组件类型：plus、btn、drag
    type: String,
    default: 'plus',
  },
  btnText: {
    type: String,
    default: '点击上传',
  },
  showTips: {
    // 是否显示提示文本
    type: Boolean,
    default: false,
  },

  accept: {
    // 接受上传的 文件类型
    type: [String, Array, Object],
  },
  action: {
    // 上传的地址
    type: String,
    default: '',
  },
  data: {
    // 上传所需参数或返回上传参数的方法
    type: [Object, Function],
    default: {
      bucket: 'sso-client',
    },
  },
  directory: {
    // 支持上传文件夹
    type: Boolean,
    default: false,
  },
  disabled: {
    // 是否禁用
    type: Boolean,
    default: false,
  },
  headers: {
    // 上传的文件字段名
    type: Object,
    default: () => {},
  },
  listType: {
    // 上传列表的内建样式，支持三种基本样式 text, picture 和 picture-card
    type: String,
    default: '',
  },
  maxCount: {
    // 限制上传数量。当为 1 时，始终用最新上传的文件代替当前文件
    type: Number,
    default: 5,
  },
  method: {
    type: String,
    default: 'post',
  },
  multiple: {
    // 是否支持多选文件
    type: Boolean,
    default: true,
  },
  name: {
    // 上传的文件字段名
    type: String,
    default: 'uploadFile',
  },
  showUploadList: {
    // 是否显示已上传文件列表
    type: Boolean,
    default: true,
  },
  // beforeUpload
  // customRequest
  // downloadIcon
  // iconRender
  // isImageUrl
  // itemRender
  // openFileDialogOnClick
  // openFileDialogOnClic
  // previewFile
  // previewIcon
  // progress
  // removeIcon
  // supportServerRender
  // withCredentials
};
