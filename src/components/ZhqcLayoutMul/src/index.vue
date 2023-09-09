<template>
  <div class="zhqc_layout" :class="{ zhqc_layout_screen: layoutScreen }">
    <div class="zhqc_layout_header" v-if="slots['layout-header']">
      <div class="zhqc_layout_header_left">
        <slot name="layout-header"></slot>
      </div>
      <div class="cursor-pointer fullscreen" @click="layoutScreen = !layoutScreen">
        <fullscreen-exit-outlined v-if="layoutScreen" />
        <fullscreen-outlined v-else />
      </div>
    </div>
    <div class="zhqc_layout_form">
      <slot name="layout-form"></slot>
    </div>
    <div class="zhqc_layout_title">
      <slot name="table-title"></slot>
    </div>
    <div class="flex flex-1 zhqc_layout_main">
      <div class="mt-2 mb-4 ml-2 zhqc_layout_sider relative">
        <slot name="layout-sider"></slot>
      </div>
      <div class="zhqc_layout_table">
        <div v-if="slots['table-header']" class="p-2 mt-2 zhqc_layout_table_header relative">
          <div v-show="drawCollapsed">
            <slot name="table-header"></slot>
          </div>

          <div @click="drawCollapsed = !drawCollapsed" class="fold_btn">
            <UpOutlined v-if="drawCollapsed" />
            <DownOutlined v-else />
          </div>
        </div>
        <div
          class="table_top_btn"
          v-if="slots['left-btn'] || slots['center'] || slots['right-btn']"
        >
          <div class="table_top_btn_left">
            <slot name="left-btn"></slot>
          </div>
          <div class="table_top_center">
            <slot name="center"></slot>
          </div>
          <div class="table_top_btn_right">
            <slot name="right-btn"></slot>
          </div>
        </div>
        <div class="table_content">
          <slot name="layout-table"></slot>
        </div>
        <div class="table_footer">
          <slot name="layout-footer"></slot>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { ref, useSlots } from 'vue';
  import {
    FullscreenOutlined,
    FullscreenExitOutlined,
    UpOutlined,
    DownOutlined,
  } from '@ant-design/icons-vue';

  const layoutScreen = ref(false);

  const slots = useSlots();

  const drawCollapsed = ref(true);
</script>

<style lang="less" scoped>
  .zhqc_layout {
    display: flex;
    justify-content: stretch;
    flex-direction: column;
    width: 100%;
    height: 100%;
    background-color: #fff;
    box-shadow: 0px 0px 6px rgba(178, 187, 197, 0.16);
    border-radius: 2px;

    &_screen {
      position: fixed;
      top: 0;
      left: 0;
      z-index: 600;
    }

    &_header {
      width: 100%;
      height: 38px;
      line-height: 38px;
      border-bottom: 1px solid #ededed;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 12px;
      box-sizing: border-box;
      font-size: 14px;
      color: #999999;
    }

    &_header .fullscreen {
      &:hover span {
        color: #262626;
      }
    }

    &_form {
      height: auto;
    }

    &_title {
      display: flex;
      justify-content: center;
      // margin-top:30px;
    }

    &_sider {
      width: 30%;
      border: 1px solid rgba(215, 215, 215, 1);
      border-radius: 8px;
    }

    &_table {
      flex: 1;
      display: flex;
      justify-content: stretch;
      flex-direction: column;
      padding: 0 12px;

      &_header {
        border: 1px solid rgba(215, 215, 215, 1);
        border-radius: 8px;
      }
    }

    &_table .table_footer,
    &_table .table_top_btn {
      height: auto;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 10px 0;

      &_left {
        display: flex;
        justify-content: flex-start;
        align-items: center;
      }

      &_right {
        display: flex;
        justify-content: flex-end;
        align-items: center;
      }
    }

    &_table .table_footer {
      padding: 8px 0;
    }

    &_table .table_content {
      flex: 1;
    }
  }

  .fold_btn {
    width: 50px;
    height: 16px;
    line-height: 16px;
    text-align: center;
    position: absolute;
    bottom: -15.5px;
    left: 50%;
    z-index: 1;
    transform: translateX(-50%);
    background-color: #fff;
    border: 1px solid #ededed;
    border-top: none;
    cursor: pointer;
    border-radius: 0 0 4px 4px;
    font-size: 12px;
  }

  [data-theme='dark'] .zhqc_layout {
    background: #151515;

    &_header {
      border-bottom-color: #303030;
    }

    .fold_btn {
      background: #1f1f1f;
      border-color: #303030;
    }
  }
</style>
