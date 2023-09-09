import { nextTick } from 'vue';
import Sortablejs from 'sortablejs';
import { isNullAndUnDef } from '/@/utils/is';

export function useBasicSortable() {
  let isInit = false;
  let sortable: any = null;
  function initSortable({ basicDialogState }) {
    if (isInit) return;
    isInit = true;
    nextTick(async () => {
      const el: HTMLElement | null = document.querySelector('.custom-input-table .ant-table-tbody');
      if (!el) return;
      sortable = Sortablejs.create(el, {
        animation: 500,
        delay: 400,
        delayOnTouchOnly: true,
        handle: '.ant-table-row',
        disabled: false,
        onEnd: (evt) => {
          let { oldIndex, newIndex } = evt;
          if (isNullAndUnDef(oldIndex) || isNullAndUnDef(newIndex) || oldIndex === newIndex) {
            return;
          }
          oldIndex--;
          newIndex--;
          const columns = [...basicDialogState.dataSource];
          if (oldIndex > newIndex) {
            columns.splice(newIndex, 0, columns[oldIndex]);
            columns.splice(oldIndex + 1, 1);
          } else {
            columns.splice(newIndex + 1, 0, columns[oldIndex]);
            columns.splice(oldIndex, 1);
          }
          basicDialogState.dataSource = columns;
        },
      });
    });
  }
  function setDisabled(disabled) {
    sortable?.option('disabled', disabled);
  }
  return { initSortable, setDisabled };
}
