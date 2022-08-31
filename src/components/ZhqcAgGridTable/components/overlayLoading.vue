<template>
  <span class="loading_text">
    <LoadingOutlined />加载中
    <CloseOutlined @click="closeLoading" />
  </span>
</template>

<script setup lang="ts">
  import { LoadingOutlined, CloseOutlined } from '@ant-design/icons-vue';

  interface IProps {
    params: any;
  }
  const props = defineProps<IProps>();
  const api = props.params.api;
  const closeLoading = () => {
    api.hideOverlay();
  };
</script>

<style lang="less">
  .loading_text {
    padding: 10px 15px;
    background-color: #fff;
    color: #409eff;
    position: relative;
    box-shadow: 5px 2px 5px 0 #e6e6e6;
    // i.el-icon-loading {
    //   margin-right: 10px;
    //   font-size: 16px;
    // }
    // i.el-icon-close {
    //   display: none;
    //   position: absolute;
    //   top: -7px;
    //   right: -7px;
    //   cursor: pointer;
    //   background-color: #fff;
    //   border-radius: 50%;
    //   padding: 3px;
    //   text-align: center;
    //   color: #181d1f;
    //   &:hover {
    //     color: #409eff;
    //   }
    // }
    // &:hover i.el-icon-close {
    //   display: block;
    // }
  }
</style>
