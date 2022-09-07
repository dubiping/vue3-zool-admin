import { computed } from 'vue';
import { usePermissionStore } from '/@/store/modules/permission';

export function useTableCols() {
  const permissionStore = usePermissionStore();

  /**
   * 过滤需要隐藏的列
   * @param colums 表格列
   * @param dynamicFields 需要动态控制的字段
   * @returns
   */
  function filterPermFiledCols(colums: any[], dynamicFields?: string[]) {
    const hideFiledList = permissionStore.getPermFieldList;
    if (!hideFiledList || !hideFiledList.length) return colums;
    return colums.filter((v) => {
      if (!dynamicFields) {
        return !hideFiledList.includes(v.dataIndex || v.field);
      } else if (
        dynamicFields.includes(v.dataIndex || v.field) &&
        hideFiledList.includes(v.dataIndex || v.field)
      ) {
        return false;
      }
      return true;
    });
  }

  function transformSettingData(colums: any[]) {
    return colums.map((v) => {
      return {
        id: v.dataIndex,
        name: v.title,
        extId: v.dataIndex,
        isSelect: false,
        disable: false,
        prop: v.dataIndex,
        sortable: v.sortable,
        filter: v.filter,
        fixed: v.fixed,
        type: v.type,
        width: v.width,
        minWidth: v.minWidth,
        hidden: false,
      };
    });
  }

  function transformTableData(rawColums: any[], basicCustomCols) {
    return computed(() => {
      const result = toRaw(basicCustomCols.fieldList).reduce((list, item) => {
        const temp = rawColums.find((v) => item.prop === v.dataIndex);
        if (temp) {
          list.push({
            ...temp,
            sortable: item.sortable,
            filter: item.filter,
            fixed: item.fixed || null,
            type: item.type || null,
            width: item.width || temp.width || '',
            minWidth: item.minWidth || temp.minWidth || '',
          });
        }
        return list;
      }, []);
      return result;
    });
  }

  return {
    filterPermFiledCols,
    transformSettingData,
    transformTableData,
  };
}
