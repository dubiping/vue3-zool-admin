<template>
  <div class="action_btn">
    <div
      v-for="(item, index) in actions"
      :key="index"
      :style="{ display: 'inline-block', marginLeft: isShow(item) ? '5px' : '0px' }"
    >
      <a-button
        v-if="isShow(item)"
        :key="index"
        :type="item.type"
        :disabled="typeof item.disabled === 'function' ? item.disabled(data) : item.disabled"
        :loading="item.loading"
        size="small"
        @click="handleClick(item.event)"
      >
        {{ item.label }}
      </a-button>
      <a-popover v-if="item.btShow" placement="bottom" trigger="hover">
        <template v-for="(vitem, vindex) in item.moreList">
          <a-button
            v-if="isShow(item)"
            :key="vindex"
            size="small"
            :type="vitem.type"
            :icon="vitem.icon"
            :disabled="typeof vitem.disabled === 'function' ? vitem.disabled(data) : vitem.disabled"
            :loading="vitem.loading"
            @click="handleClick(vitem.event)"
          >
            {{ vitem.label }}
          </a-button>
        </template>
        <template #reference>
          <a-button :type="item.type" size="small" @click="handleClick(item.event)">
            {{ item.label }}
          </a-button>
        </template>
      </a-popover>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { reactive } from 'vue';
  interface IProps {
    params: any;
  }
  const props = defineProps<IProps>();

  const { data, rowIndex } = props.params;

  const isShow = (item) => {
    return typeof item.show === 'function' ? item.show(data) : item.show === false ? false : true;
  };

  const actions: any[] = reactive(props.params.colDef.headerGroupComponentParams?.actions || []);

  const handleClick = (event: Function) => {
    if (event && typeof event === 'function') {
      event({ rowIndex, ...data });
    }
  };
</script>
