<template>
  <div class="transfer_box">
    <div class="box">
      <div class="title">
        <span
          :class="{
            active: leftSelected && leftSelected === state.leftDataAll.length,
          }"
          @click="selectAll(state.leftData)"
          >可选</span
        >
        <span>{{ `${leftSelected}/${state.leftDataAll.length}` }}</span>
      </div>
      <div class="search_wrapper">
        <a-input
          v-model:value="state.inputValLeft"
          allowClear
          placeholder="请输入关键字"
          size="small"
        >
          <template #prefix>
            <SearchOutlined style="color: #999" />
          </template>
        </a-input>
      </div>
      <draggable
        :list="state.leftData"
        class="draggable-list"
        chosenClass="chosen"
        ghostClass="ghost"
        animation="300"
        group="fields"
        itemKey="prop"
        filter=".fixed-item"
        :move="onMove"
        @update="onUpdate($event, 'left')"
        @add="onAdd($event, 'right', 'left')"
      >
        <template #item="{ element }">
          <div
            :class="['draggable-item', { active: element.isSelect, 'fixed-item': element.fixed }]"
            @click="hanldleClick(state.leftData, element)"
          >
            <div class="name">{{ element.name }}</div>
          </div>
        </template>
      </draggable>
    </div>

    <div class="middle">
      <a-button
        :disabled="!rightSelected"
        :type="rightSelected ? 'primary' : 'default'"
        style="width: 44px"
        @click="moveItem('right', 'left')"
      >
        <LeftOutlined />
      </a-button>
      <a-button
        :disabled="!leftSelected"
        :type="leftSelected ? 'primary' : 'default'"
        style="width: 44px"
        @click="moveItem('left', 'right')"
      >
        <RightOutlined />
      </a-button>
    </div>

    <div class="box">
      <div class="title">
        <span
          :class="{
            active: rightSelected && rightSelected === state.rightDataAll.length,
          }"
          @click="selectAll(state.rightData)"
          >已选</span
        >
        <span>{{ `${rightSelected}/${state.rightDataAll.length}` }}</span>
      </div>
      <div class="search_wrapper">
        <a-input
          v-model:value="state.inputValRight"
          allowClear
          placeholder="请输入关键字"
          size="small"
        >
          <template #prefix>
            <SearchOutlined style="color: #999" />
          </template>
        </a-input>
      </div>
      <draggable
        :list="state.rightData"
        class="draggable-list"
        chosenClass="chosen"
        ghostClass="ghost"
        animation="300"
        group="fields"
        itemKey="prop"
        filter=".fixed-item"
        :move="onMove"
        @update="onUpdate($event, 'right')"
        @add="onAdd($event, 'left', 'right')"
      >
        <template #item="{ element }">
          <div
            :class="[
              'draggable-item',
              {
                active: element.isSelect,
                'fixed-item': element.fixed,
              },
            ]"
            @click="hanldleClick(state.rightData, element)"
          >
            <div class="name">{{ element.name }}</div>
            <div class="fixed-cn">
              <span v-if="element.fixed" class="fixed_text">固定</span>

              <EditOutlined class="icon-edit" @click="handleEdit($event, element)" />
              <!-- <span style="width: 14px">

                <i
                  class="ant-design:edit-outlined"
                  @click="handleEdit($event, element)"
                ></i>
              </span> -->
            </div>
          </div>
        </template>
      </draggable>
    </div>

    <div class="right_box">
      <div class="button">
        <a-button
          :disabled="upDisabled"
          :type="!upDisabled ? 'primary' : 'default'"
          style="width: 44px"
          @click="moveup"
        >
          <UpOutlined />
        </a-button>
      </div>
      <div class="button">
        <a-button
          :disabled="downDisabled"
          :type="!downDisabled ? 'primary' : 'default'"
          style="width: 44px"
          @click="movedown"
        >
          <DownOutlined />
        </a-button>
      </div>
      <div class="button">
        <a-button :disabled="btnDisabled" :type="btnType" @click="setTop">
          <span>置顶</span>
        </a-button>
      </div>
      <div class="button">
        <a-button :disabled="btnDisabled" :type="btnType" @click="setFixed('left')">
          <span>固定左侧/取消</span>
        </a-button>
      </div>
      <div class="button">
        <a-button :disabled="btnDisabled" :type="btnType" @click="setFixed('right')">
          <span>固定右侧/取消</span>
        </a-button>
      </div>
      <div class="button">
        <a-button type="primary" @click="handleReset">重置</a-button>
      </div>
    </div>

    <basic-modal
      v-model:visible="dialogInfo.visible"
      :title="dialogInfo.title"
      :btnList="dialogInfo.btnList"
      :width="720"
      @ok="handleConfirm"
    >
      <zhqc-form
        v-model:formRef="colFormInfo.ref"
        :model="colFormInfo.data"
        :rules="colFormInfo.rules"
        :schemas="colFormInfo.fieldList"
        :label-width="colFormInfo.labelWidth"
      />
    </basic-modal>
  </div>
</template>

<script setup lang="ts">
  import { reactive, watch, computed } from 'vue';
  import {
    SearchOutlined,
    LeftOutlined,
    RightOutlined,
    UpOutlined,
    DownOutlined,
    EditOutlined,
  } from '@ant-design/icons-vue';
  import Draggable from 'vuedraggable-es';

  interface target {
    id: string;
    y: number | undefined;
  }

  const props = withDefaults(
    defineProps<{
      fields: any[]; // 返回父组件的数据
      sourceFields: any[]; // 父组件传进来的数据
    }>(),
    {
      fields: () => [],
      sourceFields: () => [
        // {
        //   id: 'uuid1',
        //   name: 'uuu1',
        //   extId: 'uuu1',
        //   isSelect: false,
        //   disable: false,
        //   prop: 'prop1',
        //   sortable: true,
        //   filter: true,
        //   fixed: null,
        //   type: null,
        //   slot: null,
        //   width: null,
        //   minWidth: null,
        //   hidden: false
        // },
      ],
    },
  );

  // 接收emit事件
  const emit = defineEmits(['update:fields', 'reset']);

  // 变量
  let target: target = reactive({ y: 0, id: '' });
  const state: any = reactive({
    fields: [], // 返回父组件的数据
    leftData: [],
    leftDataAll: [],
    rightData: [],
    rightDataAll: [],
    inputValLeft: '',
    inputValRight: '',
  });

  // 监听并获取已选/可选数据
  watch(
    () => props.sourceFields,
    (val) => {
      state.fields = JSON.parse(JSON.stringify(val));
      state.leftDataAll = JSON.parse(JSON.stringify(val)).filter((item: any) => item.hidden);
      state.leftData = JSON.parse(JSON.stringify(state.leftDataAll));
      state.rightDataAll = JSON.parse(JSON.stringify(val)).filter((item: any) => !item.hidden);
      state.rightData = JSON.parse(JSON.stringify(state.rightDataAll));
    },
    {
      deep: true,
      immediate: true,
    },
  );

  // 监听并返回最终数据
  watch(
    () => state.fields,
    (val) => {
      emit('update:fields', val);
    },
    {
      deep: true,
      immediate: true,
    },
  );

  // 左侧选中个数
  let leftSelected = computed(() => {
    return state.leftData.filter((item: any) => item && item.isSelect === true)?.length || 0;
  });

  // 左侧搜索
  watch(
    () => state.inputValLeft,
    (val) => {
      if (val) {
        const list: any[] = [];
        for (let i = 0; i < state.leftDataAll.length; i++) {
          if (state.leftDataAll[i].name.indexOf(val.trim()) !== -1) {
            list.push(state.leftDataAll[i]);
          }
        }
        state.leftData = list;
      } else {
        state.leftData = state.leftDataAll;
      }
    },
  );

  // 右侧选中个数
  let rightSelected = computed(() => {
    return (
      state.rightData.filter((item: any) => item && !item.hidden && item?.isSelect)?.length || 0
    );
  });

  // 右侧搜索
  watch(
    () => state.inputValRight,
    (val) => {
      if (val) {
        const list: any[] = [];
        for (let i = 0; i < state.rightDataAll.length; i++) {
          if (state.rightDataAll[i].name.indexOf(val.trim()) !== -1) {
            list.push(state.rightDataAll[i]);
          }
        }
        state.rightData = list;
      } else {
        state.rightData = state.rightDataAll;
      }
    },
  );

  // 获取右侧需要返回给父组件的数据
  const getStateFields = () => {
    state.fields = state.rightDataAll.concat(state.leftDataAll).map((item: any, index: number) => {
      item.zorder = index;
      return item;
    });
  };

  const onMove = (e: any) => {
    if (e.relatedContext?.element?.fixed) return false;
    return true;
  };

  /**
   * @description: 拖拽变换位置时触发的事件 - 处理allData
   */
  const onUpdate = (e: any, type: string) => {
    const moving = state[`${type}Data`][e.newIndex];
    const oldIndex = state[`${type}DataAll`].findIndex((item: any) => item.prop === moving.prop);
    let newIndex = state[`${type}DataAll`].length - 1;
    if (e.newIndex < state[`${type}Data`].length - 1) {
      newIndex = state[`${type}DataAll`].findIndex(
        (item: any) => item.prop === state[`${type}Data`][e.newIndex + 1].prop,
      );
    } else if (e.newIndex === state[`${type}Data`].length - 1) {
      newIndex = state[`${type}DataAll`].findIndex(
        (item: any) => item.prop === state[`${type}Data`][e.newIndex - 1].prop,
      );
    }
    state[`${type}DataAll`].splice(oldIndex, 1);
    state[`${type}DataAll`].splice(newIndex, 0, moving);
    getStateFields();
  };
  /**
   * @description: 左右拖拽后触发 - 处理allData
   */
  const onAdd = (e: any, source: string, target: string) => {
    const spliceItem = state[`${target}Data`][e.newIndex];
    spliceItem.isSelect = false;
    spliceItem.hidden = !spliceItem.hidden;

    let targetIdx = state[`${target}DataAll`].length;
    if (e.newIndex < state[`${target}Data`].length - 1) {
      targetIdx = state[`${target}DataAll`].findIndex(
        (item: any) => item.prop === state[`${target}Data`][e.newIndex + 1].prop,
      );
    } else if (e.newIndex === state[`${target}Data`].length - 1) {
      targetIdx =
        state[`${target}DataAll`].findIndex(
          (item: any) => item.prop === state[`${target}Data`][e.newIndex - 1].prop,
        ) + 1;
    }
    state[`${target}DataAll`].splice(targetIdx, 0, spliceItem);

    let sourceIdx = state[`${source}DataAll`].findIndex(
      (item: any) => item.prop === spliceItem.prop,
    );
    state[`${source}DataAll`].splice(sourceIdx, 1);

    getStateFields();
  };

  // 选中
  const hanldleClick = (data: any[], item: any) => {
    data.forEach((el) => {
      if (!el?.disable && el?.extId === item.extId) {
        el.isSelect = !el.isSelect;
      }
    });
  };

  // 全选状态切换
  const selectAll = (data: any[]) => {
    let isSelectAll = data.every((item) => {
      return item.isSelect == true;
    });
    data.forEach((item) => {
      if (isSelectAll) {
        item.isSelect = false;
      } else {
        if (item.disable) {
          item.isSelect = false;
        } else {
          item.isSelect = true;
        }
      }
    });
  };

  // 编辑
  const handleEdit = (e: Event, item: any) => {
    e.stopPropagation();
    colFormInfo.curRow = item;
    for (let key in colFormInfo.data) {
      colFormInfo.data[key] = item[key];
    }
    dialogInfo.visible = true;
  };

  // 移动选中数据
  const moveItem = (sourceType: string, targetType: string) => {
    const selection = state[`${sourceType}Data`].filter(
      (item: any) => !item.fixed && item.isSelect,
    );
    selection.forEach((item: any) => {
      item.isSelect = false;
      item.hidden = !item.hidden;
      state[`${sourceType}Data`].splice(
        state[`${sourceType}Data`].findIndex((el: any) => el.extId === item.extId),
        1,
      );
      state[`${sourceType}DataAll`].splice(
        state[`${sourceType}DataAll`].findIndex((el: any) => el.extId === item.extId),
        1,
      );
      const idx =
        state[`${targetType}Data`].findIndex((el: any) => el.fixed === 'right') ||
        state[`${targetType}Data`].length - 1;
      const idxAll =
        state[`${targetType}DataAll`].findIndex((el: any) => el.fixed === 'right') ||
        state[`${targetType}DataAll`].length - 1;
      state[`${targetType}Data`].splice(idx, 0, item);
      state[`${targetType}DataAll`].splice(idxAll, 0, item);
    });
    getStateFields();
  };

  // 同时选中固定和非固定数据
  const fixedAndUnfixed = computed(() => {
    const selection = state.rightData.filter((item: any) => item.isSelect);
    if (selection.some((item: any) => item.fixed) && selection.some((item: any) => !item.fixed)) {
      return true;
    }
    return false;
  });

  // 同时选中左固定和右固定数据
  const fixedLeftAndRight = computed(() => {
    const selection = state.rightData.filter((item: any) => item.isSelect);
    return (
      selection.some((item: any) => item.fixed === 'left') &&
      selection.some((item: any) => item.fixed === 'right')
    );
  });

  const btnDisabled = computed(() => {
    return !rightSelected.value || fixedAndUnfixed.value || fixedLeftAndRight.value;
  });

  const btnType = computed(() => {
    return rightSelected.value && !fixedAndUnfixed.value && !fixedLeftAndRight.value
      ? 'primary'
      : 'default';
  });

  /* 右侧上移 */
  const upDisabled = computed(() => {
    let bool = true;
    const selection = state.rightData.filter((item: any) => item.isSelect);
    if (selection.length === 1) {
      const selectedIndex = state.rightData.findIndex(
        (item: any) => item.extId === selection[0].extId,
      );
      const selectedItem = state.rightData[selectedIndex - 1];
      if (
        selectedItem &&
        ((selectedItem.fixed && selection[0].fixed) || (!selectedItem.fixed && !selection[0].fixed))
      ) {
        bool = false;
      }
    }
    return bool;
  });
  const moveupData = (list: any[], selected: any[]) => {
    const index = list.findIndex((item: any) => item.extId === selected[0].extId);
    list.splice(index, 1);
    list.splice(index - 1, 0, selected[0]);
  };
  const moveup = () => {
    if (!upDisabled.value) {
      const selection = state.rightData.filter((item: any) => item.isSelect);
      moveupData(state.rightData, selection);
      moveupData(state.rightDataAll, selection);
      getStateFields();
    }
  };

  /* 右侧下移 */
  const downDisabled = computed(() => {
    let bool = true;
    const selection = state.rightData.filter((item: any) => item.isSelect);
    if (selection.length === 1) {
      const selectedIndex = state.rightData.findIndex(
        (item: any) => item.extId === selection[0].extId,
      );
      const selectedItem = state.rightData[selectedIndex + 1];
      if (
        selectedItem &&
        ((selectedItem.fixed && selection[0].fixed) || (!selectedItem.fixed && !selection[0].fixed))
      ) {
        bool = false;
      }
    }
    return bool;
  });
  const movedownData = (list: any[], selected: any[]) => {
    const index = list.findIndex((item: any) => item.extId === selected[0].extId);
    list.splice(index, 1);
    list.splice(index + 1, 0, selected[0]);
  };
  const movedown = () => {
    if (!downDisabled.value) {
      const selection = state.rightData.filter((item: any) => item.isSelect);
      movedownData(state.rightData, selection);
      movedownData(state.rightDataAll, selection);
      getStateFields();
    }
  };

  // 右侧置顶
  const getTopIndex = (list: any[], selected: any[]) => {
    let index = 0;
    for (let i = 0; i < list.length; i++) {
      if (selected.some((item: any) => item.fixed)) {
        if (list[i].fixed === selected[0].fixed) {
          index = i;
          break;
        }
      } else {
        if (!list[i].fixed) {
          index = i;
          break;
        }
      }
    }
    return index;
  };
  const setTopData = (list: any[], selected: any[], index: number) => {
    selected.forEach((item: any) => {
      const idx = list.findIndex((el: any) => el.extId === item.extId);
      list.splice(idx, 1);
      list.splice(index, 0, item);
      index++;
    });
  };
  const setTop = () => {
    if (!fixedAndUnfixed.value) {
      const selection = state.rightData.filter((item: any) => item.isSelect);
      const index1 = getTopIndex(state.rightData, selection);
      const index2 = getTopIndex(state.rightDataAll, selection);
      setTopData(state.rightData, selection, index1);
      setTopData(state.rightDataAll, selection, index2);
      getStateFields();
    }
  };

  /**
   * @description 获取固定的位置
   * @param {string} direction 方向：left/right
   * @param {array} list 需要改变的数据
   * @param {array} selected 选中的数据
   */
  const getFixedIndex = (direction: string, list: any, selected: any[]) => {
    if (direction === 'left') {
      const idx = list.findLastIndex(
        (item: any) =>
          !selected.some((el: any) => el.extId === item.extId) && item.fixed === direction,
      );
      return idx > -1 ? idx + 1 : 0;
    }
    if (direction === 'right') {
      const idx = list.findIndex(
        (item: any) =>
          !selected.some((el: any) => el.extId === item.extId) && item.fixed === direction,
      );
      return idx > -1 ? idx - 1 : list.length - 1;
    }
  };

  const setFixedData = (direction: string, list: any[], selected: any[], index: number) => {
    if (direction === 'left') {
      for (let i = 0; i < selected.length; i++) {
        const item = selected[i];
        const idx = list.findIndex((el: any) => el.extId === item.extId);
        list.splice(idx, 1);
        list.splice(index, 0, item);
        index++;
      }
    }
    if (direction === 'right') {
      for (let i = selected.length - 1; i >= 0; i--) {
        const item = selected[i];
        const idx = list.findIndex((el: any) => el.extId === item.extId);
        list.splice(idx, 1);
        list.splice(index, 0, item);
        index--;
      }
    }
  };

  const setFixed = (direction: string) => {
    if (!fixedAndUnfixed.value) {
      const selection = state.rightData.filter((item: any) => item.isSelect);
      const index1 = getFixedIndex(direction, state.rightData, selection);
      const index2 = getFixedIndex(direction, state.rightDataAll, selection);
      state.rightData.forEach((item: any) => {
        if (item.isSelect) {
          if (!item.fixed || item.fixed !== direction) {
            item.fixed = direction;
          } else if (item.fixed === direction) {
            item.fixed = '';
          }
          state.rightDataAll.find((el: any) => el.extId === item.extId).fixed = item.fixed;
        }
      });
      // 移动数据位置
      if (selection.some((el: any) => el.fixed)) {
        setFixedData(direction, state.rightData, selection, index1);
        setFixedData(direction, state.rightDataAll, selection, index2);
      }
      getStateFields();
    }
  };

  const handleReset = () => {
    emit('reset');
  };

  // 下拉数据
  const listTypeInfo: any = reactive({
    fixedList: [
      { label: '左侧', value: 'left' },
      { label: '右侧', value: 'right' },
    ],
    typeList: [
      { label: '序号', value: 'index' },
      { label: '单选', value: 'radio' },
      { label: '多选', value: 'selection' },
      { label: '插槽', value: 'slot' },
    ],
  });

  const dialogInfo: any = reactive({
    visible: false,
    type: '',
    title: '编辑',
    btnList: [
      { label: '取消', type: '', icon: '', event: 'close', show: true },
      {
        label: '确定',
        type: 'primary',
        icon: '',
        event: 'confirm',
        show: true,
      },
    ],
  });

  const colFormInfo: any = reactive({
    ref: {},
    span: 8,
    data: {
      prop: null,
      name: null,
      sortable: true,
      filter: true,
      fixed: null,
      type: null,
      slot: null,
      width: null,
      minWidth: null,
    },
    disabled: false,
    fieldList: [],
    curRow: null,
    rules: {
      prop: [{ message: '必填', required: true, trigger: 'blur' }],
      name: [{ required: true, message: '必填', trigger: 'blur' }],
    },
    labelWidth: '80',
  });
  colFormInfo.fieldList = computed(() => {
    let fields = [
      // {
      //   label: '类型',
      //   field: 'type',
      //   component: 'Select',
      //   componentProps: {
      //     options: listTypeInfo.typeList,
      //   },
      //   colProps: { span: 8 },
      // },
      {
        label: '字段',
        field: 'prop',
        component: 'Input',
        componentProps: {
          disabled: true,
        },
        colProps: { span: 8 },
      },
      {
        label: '字段名称',
        field: 'name',
        component: 'Input',
        componentProps: {
          disabled: true,
        },
        colProps: { span: 8 },
      },
      { label: '固定宽度', field: 'width', component: 'Input', colProps: { span: 8 } },
      { label: '最小宽度', field: 'minWidth', component: 'Input', colProps: { span: 8 } },
      {
        label: '固定',
        field: 'fixed',
        component: 'Select',
        componentProps: {
          options: listTypeInfo.fixedList,
        },
        colProps: { span: 8 },
      },
      // { label: '排序', field: 'sortable', component: 'Switch', colProps: { span: 8 } },
      // { label: '过滤', field: 'filter', component: 'Switch', colProps: { span: 8 } },
    ];
    if (colFormInfo.data.type === 'slot') {
      fields.splice(1, 0, {
        label: '插槽名',
        field: 'slot',
        component: 'Input',
        colProps: { span: 8 },
      });
    }
    return fields;
  });

  const getEditedData = (list: any[], curRow: any) => {
    for (let i = 0; i < list.length; i++) {
      if (list[i].extId === curRow.extId) {
        for (let key in colFormInfo.data) {
          list[i][key] = colFormInfo.data[key];
        }
        break;
      }
    }
  };

  const handleConfirm = async () => {
    const valid = await colFormInfo.ref.validate();
    if (!valid) return;
    getEditedData(state.rightData, colFormInfo.curRow);
    getEditedData(state.rightDataAll, colFormInfo.curRow);
    dialogInfo.visible = false;
    getStateFields();
  };
</script>

<style lang="less" scoped>
  .transfer_box {
    display: flex;
    justify-content: center;
    align-items: center;

    .drag-move {
      transition: transform 0.3s;
    }
  }

  .box {
    border: 1px solid rgb(235, 238, 245);

    .title {
      font-size: 14px;
      box-sizing: border-box;
      padding-right: 10px;
      display: flex;
      justify-content: space-between;
      height: 32px;
      line-height: 32px;
      background: #f5f7fa;

      span:first-child {
        display: inline-block;
        background: #f5f7fa;
        background-image: url('../img/check-box-outline-blank.png');
        background-repeat: no-repeat;
        background-position: 10px center;
        background-size: 20px 20px;
        padding-left: 35px;
        cursor: pointer;
      }

      span:first-child.active {
        background-image: url('../img/check_box.png');
      }
    }
  }

  .draggable-list {
    width: 240px;
    height: 250px;
    box-sizing: border-box;
    overflow-y: auto;
    overflow-x: hidden;

    .draggable-item {
      display: flex;
      justify-content: space-between;
      padding: 0 5px 0 35px;
      height: 32px;
      line-height: 32px;
      text-align: left;
      background-image: url('../img/check-box-outline-blank.png');
      background-repeat: no-repeat;
      background-position: 10px center;
      background-size: 20px 20px;
      border: 1px dashed transparent;
      font-size: 12px;
      cursor: pointer;

      .name {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .fixed-cn {
        display: flex;
        justify-content: flex-end;
        align-items: center;
        width: 46px;

        .fixed_text {
          margin-right: 5px;
          color: rgba(0, 0, 0, 0.5);
        }
      }

      .icon-edit {
        display: none;
        font-size: 14px;
        color: rgb(51, 54, 57);

        &:hover {
          color: #0394ff;
        }
      }

      &:hover {
        background-color: #ecf6fd;

        .icon-edit {
          display: block;
        }
      }

      &.active {
        background-image: url('../img/check_box.png');
      }

      &.disable {
        background-image: url('../img/check_box_disable.png');
        color: #ddd;
        cursor: not-allowed;

        &:hover {
          color: #ddd;
        }
      }

      &.ghost {
        border-color: #0394ff;
      }
    }
  }

  .middle {
    display: flex;
    flex-direction: column;
    margin: 0 16px;

    button {
      margin: 0;

      &:not(:first-child) {
        margin-top: 12px;
      }
    }
  }

  .search_wrapper {
    margin: 10px;
  }

  .right_box {
    margin: auto;
    display: flex;
    flex-direction: column;

    .button {
      margin: 0;
      width: auto;

      &:not(:first-child) {
        margin-top: 12px;
      }
    }
  }
</style>
