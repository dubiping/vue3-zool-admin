<template>
  <a-drawer v-model:visible="dialogVisible" :closable="false" class="clinet-drawer" :width="460">
    <div>
      <div v-for="com in appList" :key="com.tenantId" class="tenant-item">
        <div class="mb-4 tenant-name">{{ com.tenantName }}</div>
        <div v-for="(list, listIndex) in com.otherList" :key="listIndex" class="mb-3">
          <a-row :gutter="30">
            <a-col v-for="(item, index) in list" :key="item.id" :span="6">
              <div
                class="client-item flex flex-col items-center cursor-pointer"
                @click="handleClickClient(item, com)"
              >
                <div class="icon relative" :class="`icon-${index}`">
                  <img class="absolute inset-0 w-full h-full" v-if="item.logo" :src="item.logo" />
                </div>
                <div class="name">{{ item.name }}</div>
                <div class="version">({{ item.version }})</div>
                <div v-if="item.id === currentClient.id" class="arror"></div>
              </div>
            </a-col>
          </a-row>
          <div v-if="getShowWh(list, currentClient.id) && currentClient.otherMap" class="wh-wrap">
            <div v-for="(value, key) in currentClient.otherMap" :key="key">
              <!-- <div class="mb-4 text-gray-400 text-lg">{{ key }}</div> -->
              <a-row :gutter="24">
                <a-col :span="8" v-for="wh in value" :key="wh.id">
                  <div class="item-tag item-hover" @click="handleClickWh(wh)">
                    <div
                      class="icon-checked"
                      v-if="
                        wh.id === currentClientIds[2] && currentClient.id === currentClientIds[1]
                      "
                    ></div>
                    <span>{{ wh.name }}</span>
                  </div>
                </a-col>
              </a-row>
            </div>
          </div>
        </div>
      </div>
    </div>
  </a-drawer>
</template>
<script lang="ts" setup>
  import { useUserStoreWithOut } from '/@/store/modules/user';
  import { chunk } from 'lodash-es';
  import { setObjToUrlParams } from '/@/utils';

  const props = defineProps({
    visible: {
      type: Boolean,
      default: false,
    },
  });
  const emit = defineEmits(['update:visible']);

  const dialogVisible = computed<boolean>({
    get() {
      return props.visible;
    },
    set(val) {
      emit('update:visible', val);
    },
  });

  const userStore = useUserStoreWithOut();
  const tenantList = computed(() => userStore.getSecondLoginInfo?.tenantList);
  const currentClientIds = computed(() => userStore.getCurrentClient.split(','));
  const appList = computed(() => {
    return (
      unref(tenantList)?.map((v) => {
        return {
          ...v,
          otherList: chunk(v.otherList, 4),
        };
      }) || []
    );
  });

  const currentClient = ref<any>({});
  const currentUrl = ref('');
  const currentClientType = ref(''); // client_id: sso项目   change_client: 跳转其他应用
  const currentCom = ref({});

  let currentTenantId = '';
  let currentClientId = '';

  const getShowWh = (list, id) => {
    return list.some((v) => v.id === id);
  };
  // 选择应用
  const handleClickClient = (item, com) => {
    currentClientType.value = item.field;
    currentClient.value = {};
    currentCom.value = {
      [com.field2]: com.tenantCode,
      [com.field]: com.tenantId,
    };
    currentTenantId = com.tenantId;
    currentClientId = item.id;
    if (!item.otherMap) {
      return changeClinet(item);
    }
    const otherMap: any[] = Object.values(item.otherMap);
    const orgWh = otherMap[0] || [];
    // 单个组织和仓库直接登录
    if (otherMap && otherMap.length === 1 && orgWh.length === 1) {
      currentUrl.value = item.url;
      return changeClinet(item);
    }

    currentClient.value = item;
    currentUrl.value = item.url;
  };
  // 选择仓库
  const handleClickWh = (item) => {
    changeClinet(item);
  };

  /**
   * 切换应用
   * 租户、应用、仓库相同，即不切换应用
   * 切换应用，换取code，跳转
   */
  const changeClinet = async (item) => {
    const [tenantId, clientId, whId] = unref(currentClientIds);
    const isSaveToken = currentClientId === clientId;
    if (currentTenantId === tenantId && currentClientId === clientId) {
      if (item.id === whId) {
        dialogVisible.value = false;
        return;
      }
    }
    const res = await userStore.changeClient(
      {
        clientId: currentClientId,
        extendMap: {
          ...unref(currentCom),
          [item.field]: item.id,
          client_version: item.version,
        },
      },
      isSaveToken,
    );
    const idStr = `${currentTenantId},${currentClientId},${item.id}`;
    isSaveToken && userStore.setCurrentClient(idStr);
    const path: any = setObjToUrlParams(
      item.url || unref(currentUrl),
      isSaveToken
        ? {}
        : {
            grantCode: res.grantCode,
            clientIds: idStr,
          },
    );
    dialogVisible.value = false;
    if (isSaveToken) {
      window.location.reload();
      return;
    }
    window.location =
      process.env.NODE_ENV === 'development' && isSaveToken ? 'http://localhost:8230/login' : path;
  };
  // 初始化页面，设置当前选择的应用和仓库
  const initPage = () => {
    const [tenantId, clientId] = unref(currentClientIds);
    const tenantItem = unref(tenantList)?.find((v) => v.tenantId === tenantId);
    if (!tenantItem) return;
    const clientItem = tenantItem.otherList?.find((v) => v.id === clientId);
    if (!clientItem) return;
    currentClient.value = clientItem;
    currentTenantId = tenantId;
    currentClientId = clientId;
    currentUrl.value = clientItem.url;
  };

  onMounted(() => {
    initPage();
  });
</script>
<style lang="less">
  .clinet-drawer {
    .ant-drawer-body {
      background: linear-gradient(180deg, #f3f4fb 0%, #fff 100%);
      box-shadow: 0 0px 16px rgba(157, 186, 255, 0.15);
    }

    .tenant-item {
      .tenant-name {
        font-weight: bold;
        font-size: 20px;
        color: #353535;
      }
    }

    .client-item {
      .name {
        font-weight: bold;
        color: #929292;
      }

      .version {
        color: #929292;
        font-size: 12px;
      }

      .arror {
        border: 16px solid transparent;
        width: 0;
        height: 0;
        border-bottom-color: #fff;
        margin-top: -12px;
        position: relative;
        z-index: 100;
      }

      .icon {
        width: 52px;
        height: 52px;
        background-size: 100% 100%;
        background-repeat: no-repeat;

        &-0 {
          background-image: url('/@/assets/images/auth/icon-wms.png');
        }

        &-1 {
          background-image: url('/@/assets/images/auth/icon-tms.png');
        }

        &-2 {
          background-image: url('/@/assets/images/auth/icon-oms.png');
        }

        &-3 {
          background-image: url('/@/assets/images/auth/icon-bms.png');
        }
      }
    }

    .wh-wrap {
      padding-top: 12px;
      padding-left: 12px;
      background: #fff;
      filter: drop-shadow(0 0px 6px rgba(0, 0, 0, 0.05));
      border-radius: 6px;
    }

    .item-tag {
      width: 100px;
      height: 42px;
      border-radius: 6px;
      background: #fff;
      border: 1px solid #e9e9e9;
      font-weight: bold;
      font-size: 15px;
      color: #353535;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 12px;
      position: relative;
      cursor: pointer;

      &.item-hover:hover {
        border: 2px solid #0470ff;
      }

      &.item-default {
        margin-bottom: 40px;

        .icon-default {
          width: 31px;
          height: 20px;
          border-radius: 5px 0;
          background: #36e2a1;
          position: absolute;
          left: 0;
          top: 0;
          font-size: 12px;
          color: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
        }
      }

      .icon-checked {
        width: 18px;
        height: 18px;
        position: absolute;
        right: 0;
        bottom: 0;
        background-image: url('/@/assets/images/auth/icon-checked.png');
        background-size: 100%;
        background-repeat: no-repeat;
      }
    }
  }
</style>
