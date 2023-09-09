<template>
  <vxe-toolbar v-if="toolbar.show">
    <template #buttons>
      <div class="title">
        <slot name="title"></slot>
      </div>
      <template v-for="(btn, idx) in toolbar.buttons" :key="idx">
        <a-select
          v-if="btn.type === 'select'"
          v-model="model[btn.value]"
          :size="btn.size"
          :disabled="btn.disabled"
          :clearable="btn.clearable === false ? btn.clearable : true"
          :filterable="btn.filterable"
          :multiple="btn.multiple"
          :collapse-tags="btn.collapsetags"
          @change="handleEvent(btn.events?.change, model[btn.value], btn)"
          @clear="handleEvent(btn.events?.clear, model[btn.value], btn)"
        >
          <a-select-option
            v-for="(childItem, childIndex) in btn.options"
            :key="childIndex"
            :label="childItem.key"
            :value="childItem.value"
            :disabled="childItem.disabled"
          />
        </a-select>
        <vxe-button v-else-if="btn.type === 'dropdowns'" :content="btn.label">
          <template #dropdowns>
            <vxe-button
              v-for="(e, i) in btn.list"
              :key="i"
              type="text"
              :content="e.label"
              @click="handleClick(e.event)"
            />
          </template>
        </vxe-button>
        <a-button
          v-else
          :type="btn.type"
          :disabled="btn.disabled"
          :loading="btn.loading"
          :size="btn.size"
          @click="handleClick(btn.event)"
        >
          <i :class="btn.icon?.includes('xh-icon') ? `xh-iconfont ${btn.icon}` : btn.icon"></i>
          {{ btn.label }}
        </a-button>
      </template>
    </template>
    <template #tools>
      <template v-for="(btn, idx) in toolbar.tools" :key="idx">
        <a-select
          v-if="btn.type === 'select'"
          v-model="model[btn.value]"
          :size="btn.size"
          :disabled="btn.disabled"
          :clearable="btn.clearable === false ? btn.clearable : true"
          :filterable="btn.filterable"
          :multiple="btn.multiple"
          :collapse-tags="btn.collapsetags"
          @change="handleEvent(btn.events?.change, model[btn.value], btn)"
          @clear="handleEvent(btn.events?.clear, model[btn.value], btn)"
        >
          <a-select-option
            v-for="(childItem, childIndex) in btn.options"
            :key="childIndex"
            :label="childItem.key"
            :value="childItem.value"
            :disabled="childItem.disabled"
          />
        </a-select>
        <vxe-button v-else-if="btn.type === 'dropdowns'" :content="btn.label">
          <template #dropdowns>
            <vxe-button
              v-for="(e, i) in btn.list"
              :key="i"
              type="text"
              :content="e.label"
              @click="handleClick(e.event)"
            />
          </template>
        </vxe-button>
        <a-button
          v-else
          :type="btn.type"
          :disabled="btn.disabled"
          :loading="btn.loading"
          :size="btn.size"
          @click="handleClick(btn.event)"
        >
          <i :class="btn.icon?.includes('xh-icon') ? `xh-iconfont ${btn.icon}` : btn.icon"></i>
          {{ btn.label }}
        </a-button>
      </template>
    </template>
  </vxe-toolbar>
</template>

<script lang="ts" setup>
  defineProps({
    model: {
      type: Object as any,
      default: () => ({}),
    },
    toolbar: {
      type: Object as any,
      default: () => ({
        show: false,
      }),
    },
  });
  const emit = defineEmits(['handleClick', 'handleEvent']);

  /**
   * @description: toolbar 按钮点击事件
   */
  const handleClick = (event: string, data?: any, item?: any) => {
    event && emit('handleClick', event, data, item);
  };

  /**
   * @description: toolbar 按钮点击事件
   */
  const handleEvent = (event: string, data?: any, item?: any) => {
    event && emit('handleEvent', event, data, item);
  };
</script>
