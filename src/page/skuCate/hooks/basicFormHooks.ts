import { reactive } from 'vue';

export function useBasicForm() {
  const basicFormConfig = reactive<{
    model: any;
  }>({
    model: {},
  });

  return {
    basicFormConfig,
  };
}
