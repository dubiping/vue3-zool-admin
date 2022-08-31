<template>
  <a-dropdown placement="bottomLeft" :overlayClassName="`${prefixCls}-dropdown-overlay`">
    <span :class="[prefixCls, `${prefixCls}--${theme}`]" class="flex">
      <img :class="`${prefixCls}__header`" :src="getUserInfo.avatar" />
      <span :class="`${prefixCls}__info hidden md:block`">
        <span :class="`${prefixCls}__name  `" class="truncate">
          {{ getUserInfo.realName }}
        </span>
      </span>
    </span>

    <template #overlay>
      <a-menu @click="handleMenuClick">
        <!-- <a-menu-divider v-if="getShowDoc" /> -->
        <MenuItem
          key="updatePwd"
          :text="t('layout.header.updatePwd')"
          icon="ant-design:edit-outline"
        />
        <MenuItem
          v-if="showChangeClient && showClient"
          key="client"
          :text="t('layout.header.changeClient')"
          icon="ant-design:swap-outline"
        />
        <MenuItem
          v-if="getUseLockPage"
          key="lock"
          :text="t('layout.header.tooltipLock')"
          icon="ion:lock-closed-outline"
        />
        <MenuItem
          key="logout"
          :text="t('layout.header.dropdownItemLoginOut')"
          icon="ion:power-outline"
        />
      </a-menu>
    </template>
  </a-dropdown>
  <LockAction @register="register" />
  <ZhqcChangeClinet v-model:visible="changeClientVisible" />
  <ZhqcUpdatePwd v-model:visible="updatePwdVisible" />
</template>
<script lang="ts" name="UserDropdown" setup>
  import { ZhqcChangeClinet } from '/@/components/ZhqcChangeClinet';
  import { ZhqcUpdatePwd } from '/@/components/ZhqcUpdatePwd';

  import { useUserStore } from '/@/store/modules/user';
  import { useHeaderSetting } from '/@/hooks/setting/useHeaderSetting';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useDesign } from '/@/hooks/web/useDesign';
  import { useModal } from '/@/components/Modal';

  import headerImg from '/@/assets/images/header.jpg';
  // import { propTypes } from '/@/utils/propTypes';

  import { createAsyncComponent } from '/@/utils/factory/createAsyncComponent';

  type MenuEvent = 'logout' | 'doc' | 'lock' | 'updatePwd' | 'client';

  const MenuItem = createAsyncComponent(() => import('./DropMenuItem.vue'));
  const LockAction = createAsyncComponent(() => import('../lock/LockModal.vue'));

  defineProps({
    theme: {
      type: String,
      default: 'light',
    },
    showClient: {
      type: Boolean,
      default: true,
    },
  });

  const { prefixCls } = useDesign('header-user-dropdown');
  const { t } = useI18n();
  const { getShowDoc, getUseLockPage } = useHeaderSetting();
  const userStore = useUserStore();

  const getUserInfo = computed(() => {
    const { realName = '', avatar, desc } = userStore.getUserInfo || {};
    return { realName, avatar: avatar || headerImg, desc };
  });

  const [register, { openModal }] = useModal();

  const updatePwdVisible = ref(false);
  const changeClientVisible = ref(false);
  const showChangeClient = computed(
    () => !userStore.isSingleApp(userStore.getSecondLoginInfo?.tenantList),
  );

  function handleLock() {
    openModal(true);
  }

  //  login out
  function handleLoginOut() {
    userStore.confirmLoginOut();
  }

  function handleMenuClick(e: { key: MenuEvent }) {
    switch (e.key) {
      case 'logout':
        handleLoginOut();
        break;
      case 'lock':
        handleLock();
        break;

      case 'updatePwd':
        updatePwdVisible.value = true;
        break;
      case 'client':
        changeClientVisible.value = true;
        break;
    }
  }

  // export default defineComponent({
  //   name: 'UserDropdown',
  //   components: {

  //   },
  //   props: {
  //     theme: propTypes.oneOf(['dark', 'light']),
  //   },
  //   setup() {

  //     return {
  //       prefixCls,
  //       t,
  //       getUserInfo,
  //       handleMenuClick,
  //       getShowDoc,
  //       register,
  //       getUseLockPage,
  //     };
  //   },
  // });
</script>
<style lang="less">
  @prefix-cls: ~'@{namespace}-header-user-dropdown';

  .@{prefix-cls} {
    height: @header-height;
    padding: 0 0 0 10px;
    padding-right: 10px;
    overflow: hidden;
    font-size: 12px;
    cursor: pointer;
    align-items: center;

    img {
      width: 24px;
      height: 24px;
      margin-right: 12px;
    }

    &__header {
      border-radius: 50%;
    }

    &__name {
      font-size: 14px;
    }

    &--dark {
      &:hover {
        background-color: @header-dark-bg-hover-color;
      }
    }

    &--light {
      &:hover {
        background-color: @header-light-bg-hover-color;
      }

      .@{prefix-cls}__name {
        color: @text-color-base;
      }

      .@{prefix-cls}__desc {
        color: @header-light-desc-color;
      }
    }

    &-dropdown-overlay {
      .ant-dropdown-menu-item {
        min-width: 160px;
      }
    }
  }
</style>
