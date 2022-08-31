<template>
  <div class="ag_custom_header">
    <a-input
      v-if="showFilter"
      ref="inputRef"
      v-model="filterName"
      size="small"
      type="text"
      placeholder="请输入"
      clearable
      @blur="showFilter = !showFilter"
      @clear="filterHandleEvent"
      @keyup.enter="filterHandleEvent($event)"
    />
    <div v-else class="ag_custom_header_title">
      <span
        :class="{ sortable_label: sortable }"
        @click="sortEvent(sortType === '' ? 'asc' : sortType === 'asc' ? 'desc' : '')"
      >
        {{ displayName }}
        <span v-if="sortable" class="cursor-pointer">
          <VerticalAlignMiddleOutlined v-if="sortType === ''" style="color: #b9b9b9" />
          <CaretUpOutlined v-else-if="sortType === 'asc'" style="color: #b9b9b9" />
          <CaretDownOutlined v-else style="color: #b9b9b9" />
        </span>
      </span>
      <span v-if="filterable" class="search_btn" @click="showFilterHandle">
        <SearchOutlined class="cursor-pointer" />
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, watch } from 'vue';
  import {
    VerticalAlignMiddleOutlined,
    CaretUpOutlined,
    CaretDownOutlined,
    SearchOutlined,
  } from '@ant-design/icons-vue';
  import { useSortStore } from '../tableStore';

  interface IProps {
    params: any;
  }

  const inputRef = ref(null);
  const filterName = ref('');
  const sortType = ref('');
  const showFilter = ref(false);
  const props = defineProps<IProps>();
  const displayName = props.params.displayName;
  const field = props.params.column.colId;
  const filterable = props.params.column.colDef.headerGroupComponentParams?.filterable || false;
  const sortable = props.params.column.colDef.headerGroupComponentParams?.sort || false;
  const api = props.params.api;
  const sortStore = useSortStore();

  watch(
    () => sortStore.resetSort,
    (val) => {
      if (val) {
        sortType.value = '';
      }
    },
  );

  const showFilterHandle = () => {
    showFilter.value = !showFilter.value;
    filterName.value = '';
    setTimeout((_) => {
      if (inputRef.value) {
        (inputRef.value as any).focus();
      }
    }, 0);
  };

  const filterHandleEvent = (e?: any) => {
    if (!filterName.value && e) return;
    let params = {
      field: !e ? 'id' : field,
      value: filterName.value,
    };
    api.$agDelivery('filterEvent', params);
  };

  const sortEvent = (sort: string) => {
    if (!sortable) return;
    sortType.value = sort;
    let params = {
      field: field,
      sort: sort,
    };
    api.$agDelivery('sortEvent', params);
  };
</script>

<style lang="less">
  .ag_custom_header {
    display: block;
    width: 100%;
    color: #626262;
    font-weight: normal;

    &_title {
      display: flex;
      justify-content: space-between;
      align-items: center;

      .sortable_label {
        cursor: pointer;
        color: #626262;
      }

      .search_btn {
        .anticon {
          transition: 1s;
          display: none !important;
          color: #626262;
        }
      }
    }

    &:hover {
      .search_btn .anticon {
        display: block !important;
      }
    }
  }
</style>
