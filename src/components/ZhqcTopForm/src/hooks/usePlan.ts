import { ref, unref, reactive } from 'vue';
import { message } from 'ant-design-vue';
import { useRoute } from 'vue-router';

import { queryPlanList, queryPlanOptions, addPlan, deletePlan } from '../api';
import { useI18n } from '/@/hooks/web/useI18n';

interface PlanItem {
  show: Boolean;
  name: String;
  id: String;
  [key: string]: any;
}

export declare interface FieldItem {
  field: String;
  value: any;
  isFormat?: Boolean;
}

export function usePlan({ moduleName, getFilterConditionValues, initFilterConditionList }) {
  const route = useRoute();
  const { t } = useI18n();
  const basicPlanForm = reactive({
    selected: '',
    name: '',
    visible: false,
  });

  const planList = ref<PlanItem[]>([]);

  const getPlanList = async (isReq = true) => {
    const menuId = route.meta?.menuId;
    if (!moduleName || !menuId) {
      initFilterConditionList();
      return;
    }
    try {
      const res: any = await queryPlanList({
        params: { menuId, topFormCode: moduleName },
      });
      let selectId = '';
      const list = res.map((v) => {
        if (v.active === '1') {
          selectId = v.key;
        }
        return {
          name: v.name,
          id: v.key,
          show: false,
        };
      });
      if (!selectId) {
        selectId = list[0]?.id;
      }
      basicPlanForm.selected = selectId;
      planList.value = list;
      if (!isReq) return;
      if (!list.length) {
        initFilterConditionList();
        return;
      }
      await getPlanOptions(basicPlanForm.selected);
    } catch (error) {
      initFilterConditionList();
    }
  };
  const getPlanOptions = async (planId) => {
    const res: any = await queryPlanOptions({
      params: {
        id: planId,
      },
    });
    initFilterConditionList(res?.dtList || []);
  };

  const handleSelectPlan = (id) => {
    const isSome = basicPlanForm.selected === id;
    basicPlanForm.selected = id;
    basicPlanForm.visible = false;
    if (isSome) return;
    getPlanOptions(id);
  };
  const handleAddPlan = async () => {
    if (!basicPlanForm.name) {
      return message.error(t('sys.topForm.planNameNull'));
    } else if (unref(planList).some((v) => v.name === basicPlanForm.name)) {
      return message.error(t('sys.topForm.planRepeat'));
    }

    const menuId = route.meta?.menuId;
    await addPlan({
      params: {
        menuId,
        topFormCode: moduleName,
        name: basicPlanForm.name,
        dtList: getFilterConditionValues(),
      },
    });
    message.success(t('common.msg.success'));
    getPlanList(false);
    basicPlanForm.name = '';
    basicPlanForm.visible = false;
  };
  const handleDelPlan = async (record) => {
    await deletePlan({
      params: {
        id: record.id,
      },
    });
    getPlanList();
  };

  const handleCancelPlan = () => {
    basicPlanForm.name = '';
    basicPlanForm.visible = false;
  };

  return {
    basicPlanForm,
    planList,
    getPlanList,
    handleSelectPlan,
    handleDelPlan,
    handleAddPlan,
    handleCancelPlan,
  };
}
