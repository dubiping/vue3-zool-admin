import { defineStore } from 'pinia';

export type ISortState = {
  resetSort: boolean;
};

export const useSortStore = defineStore({
  id: 'ag',
  state: (): ISortState => ({
    resetSort: false,
  }),
  getters: {},
  actions: {
    setSortState(sortState: boolean) {
      this.resetSort = sortState;
    },
  },
});
