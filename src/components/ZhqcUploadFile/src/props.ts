export const basicProps = {
  visible: {
    type: Boolean,
    default: false,
  },
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
    type: String,
    default: '',
  },
  maxSize: {
    type: Number,
    default: 5, // 单位M
  },
  title: {
    type: String,
    default: '',
  },
  width: {
    type: Number,
    default: 600,
  },
  maxLength: {
    type: Number,
    default: 40,
  },
};
