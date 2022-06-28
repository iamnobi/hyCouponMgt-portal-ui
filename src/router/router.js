import Vue from 'vue';
import Router from 'vue-router';
import store from '@/store/store';
import alertUtil from '@/utils/alertUtil.js';
import { getDecryptLocalStorage } from '@/utils/processLocalStorage';

Vue.use(Router);

// lazy loading routes for VueJS and Webpack
function loadView(folder, view) {
  if (folder)
    return () =>
      import(
        /* webpackChunkName: "view-[request]" */ `@/views/${folder}/${view}.vue`
      );
  else
    return () =>
      import(/* webpackChunkName: "view-[request]" */ `@/views/${view}.vue`);
}

function checkPermission(to, from, next) {
  const canView = store.getters['pagePermissionStore/getPagePermission'](
    to.name
  );
  if (canView) {
    next();
  } else {
    next({ name: 'noPermission' });
  }
}

const router = new Router({
  routes: [
    {
      path: '/',
      name: 'login',
      component: loadView('login', 'OriginalLogin')
    },
    {
      path: '/settingPassword/:issuerBankId/:token',
      name: 'loginSetPassword',
      component: loadView('login', 'OriginalLogin')
    },
    {
      path: '/',
      name: 'main',
      component: loadView('', 'Main'),
      children: [
        {
          // 報表查詢
          path: 'dashboard/statisticReport',
          name: 'reportQuery',
          component: loadView('dashboard', 'StatisticReport'),
          beforeEnter: checkPermission
        },
        {
          // 交易紀錄查詢
          path: 'transaction/records',
          name: 'txQuery',
          component: loadView('transaction', 'Records'),
          beforeEnter: checkPermission
        },
        {
          // 交易紀錄查詢 - 子內頁
          path: 'transaction/recordDetail',
          name: 'transactionRecordDetail',
          component: loadView('transaction', 'RecordDetail'),
          beforeEnter: checkPermission
        },
        {
          // PReq 紀錄查詢
          path: 'transaction/preqRecords',
          name: 'preqRecords',
          component: loadView('transaction', 'PreqRecords'),
          beforeEnter: checkPermission
        },
        {
          // 收單行管理
          path: 'acquirer/acquirerManage',
          name: 'acquirerManage',
          component: loadView('acquirer', 'Acquirer'),
          beforeEnter: checkPermission
        },
        {
          // 3DS SDK 設定
          path: 'acquirer/threedsSdk',
          name: 'threedsSdk',
          component: loadView('acquirer', 'ThreedsSdk'),
          beforeEnter: checkPermission
        },
        {
          // 發卡行管理
          path: 'issuer/issuerManage',
          name: 'issuerManage',
          component: loadView('issuer', 'Issuer'),
          beforeEnter: checkPermission
        },
        {
          // 群組權限設定
          path: 'accountManagement/roleGroup',
          name: 'roleGroupQuery',
          component: loadView('accountManagement', 'RoleGroup'),
          beforeEnter: checkPermission
        },
        {
          // 使用者管理
          path: 'accountManagement/userManage',
          name: 'userGroupQuery',
          component: loadView('accountManagement', 'UserManage'),
          beforeEnter: checkPermission
        },
        {
          // 使用者解鎖
          path: 'accountManagement/userUnlock',
          name: 'unlockQuery',
          component: loadView('accountManagement', 'UserUnLock'),
          beforeEnter: checkPermission
        },
        {
          // 密碼原則管理
          path: 'accountManagement/passwordPrinciple',
          name: 'mimaPolicyQuery',
          component: loadView('accountManagement', 'PasswordPrinciple'),
          beforeEnter: checkPermission
        },
        {
          // 操作記錄
          path: 'accountManagement/auditLog',
          name: 'auditLogQuery',
          component: loadView('accountManagement', 'AuditLog'),
          beforeEnter: checkPermission
        },
        {
          // 基本設定
          path: 'systemSetting/general',
          name: 'generalSettings',
          component: loadView('systemSetting', 'GeneralSettings'),
          beforeEnter: checkPermission
        },
        {
          // MCC List
          path: '/systemSetting/mcc',
          name: 'mcc',
          component: loadView('systemSetting', 'MccList'),
          beforeEnter: checkPermission
        },
        {
          // BinRange 管理
          path: 'systemSetting/binRange',
          name: 'sysBinRangeQuery',
          component: loadView('systemSetting', 'BinRange'),
          beforeEnter: checkPermission
        },
        {
          // CA憑證
          path: 'certificate/CA',
          name: 'certQuery',
          component: loadView('certificate', 'CertificateCA'),
          beforeEnter: checkPermission
        },
        {
          // Device Info 憑證
          path: 'certificate/DeviceInfo',
          name: 'systemSettingCertificateSign',
          component: loadView('certificate', 'CertificateDeviceInfo'),
          beforeEnter: checkPermission
        },
        {
          // SSL憑證
          path: 'certificate/SSL',
          name: 'systemSettingCertificateSSL',
          component: loadView('certificate', 'CertificateSSL'),
          beforeEnter: checkPermission
        },
        {
          path: 'noPermission',
          name: 'noPermission',
          component: loadView('errorPages', 'noPermission')
        },
        {
          path: '/*',
          redirect: '/'
        }
      ]
    }
  ]
});

router.beforeEach((to, from, next) => {
  // 當重整頁面不需要清除儲存的搜尋條件
  if (store.state.previousPageName !== to.name) {
    store.commit('setNullStorageCriteria');
  }

  // Note:登入狀態下會有token
  if (localStorage.getItem('x-csrf-token')) {
    // 登入頁 -> 轉到 第一個可檢視頁面
    if (to.name.includes('login') & store.state.mfaPass) {
      let firstPageQueryName = null;
      let permission = getDecryptLocalStorage('permission');
      for (let key in permission) {
        if (key.includes('Query') && permission[key]) {
          firstPageQueryName = key;
          break;
        }
      }
      if (firstPageQueryName) {
        next({ name: firstPageQueryName });
      } else {
        alertUtil.noAnyPermission();
      }
    } else {
      // 非登入頁 -> 進入頁面
      next();
    }
  } else {
    if (to.name.includes('login')) {
      // 進入登入頁
      next();
    } else {
      // 非登入頁 -> 轉到登入頁
      router.push('/');
    }
  }
});

router.afterEach(to => {
  // 儲存進入前的頁面名稱
  store.commit('setPreviousPageName', to.name);
});

export default router;
