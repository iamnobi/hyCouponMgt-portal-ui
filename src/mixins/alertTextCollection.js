/**
 * SweetAlert2 Content Collection
 * 官方文件 https://sweetalert2.github.io/
 * 

 *【命名規則】
 * Alert: 提醒或通知，不一定需要點選確認
 * Confirm: 確認是否執行，可點選取消及確認
 */

// NOTE: Global Mixins - alertUtil.js載入時機比較早，使用this會讀取不到
import i18n from '@/plugins/i18n';
i18n.locale = localStorage.getItem('lang');

// ---------------------------------
// 系統異常相關提示
// ---------------------------------

// 提示無任何頁面權限
export const alertServerError = {
  computed: {
    alertServerError() {
      return {
        title: this.$t('sweet_alert.alertServerError.title'),
        text: this.$t('sweet_alert.alertServerError.text'),
        type: 'error',
        confirmButtonText: this.$t('sweet_alert.button.confirmButtonText'),
        confirmButtonClass: 'v-btn primary v-btn--depressed v-btn--round',
        buttonsStyling: false
      };
    }
  }
};

// ---------------------------------
// 權限相關提示
// ---------------------------------

// 提示無任何頁面權限
export const alertNoAnyPermission = {
  computed: {
    alertNoAnyPermission() {
      return {
        position: 'top',
        html: `<h3 class="red--text mb-2">${i18n.t(
          'sweet_alert.alertNoAnyPermission.html'
        )}</h3>`,
        showConfirmButton: false,
        timer: 2000,
        background: '#ffc3c3',
        backdrop: 'transparent'
      };
    }
  }
};

// 提示沒有操作權限
export const alertNoPermission = {
  computed: {
    alertNoPermission() {
      return {
        position: 'top',
        html: `<h3 class="red--text mb-2">${i18n.t(
          'sweet_alert.alertNoPermission.html'
        )}</h3>`,
        showConfirmButton: false,
        timer: 2000,
        background: '#ffc3c3',
        backdrop: 'transparent'
      };
    }
  }
};

// 提示需要先開啟檢視權限
export const alertNeedQueryPermission = {
  computed: {
    alertNeedQueryPermission() {
      return {
        title: this.$t('sweet_alert.alertNeedQueryPermission.title'),
        text: this.$t('sweet_alert.alertNeedQueryPermission.text'),
        type: 'warning',
        confirmButtonText: this.$t('sweet_alert.button.confirmButtonText'),
        allowOutsideClick: false,
        confirmButtonClass: 'v-btn primary v-btn--depressed v-btn--round',
        buttonsStyling: false
      };
    }
  }
};

// 確認是否延長登入時間
export const confirmLoginExpiring = {
  computed: {
    confirmLoginExpiring() {
      return {
        title: this.$t('sweet_alert.confirmLoginExpiring.title'),
        text: this.$t('sweet_alert.confirmLoginExpiring.text'),
        type: 'warning',
        showCancelButton: true,
        confirmButtonText: this.$t('sweet_alert.button.confirmButtonText'),
        cancelButtonText: this.$t('sweet_alert.button.cancelButtonText'),
        allowOutsideClick: true,
        confirmButtonClass: 'v-btn primary v-btn--depressed v-btn--round',
        cancelButtonClass:
          ' v-btn v-btn--outline v-btn--depressed v-btn--round primary--text',
        buttonsStyling: false
      };
    }
  }
};

// 提示已經登出
export const alertLoggedOut = {
  computed: {
    alertLoggedOut() {
      return {
        position: 'top',
        html: `<h3 class="red--text mb-2">${i18n.t(
          'sweet_alert.alertLoggedOut.html'
        )}</h3>`,
        showConfirmButton: false,
        timer: 2000,
        background: '#ffc3c3',
        backdrop: 'transparent'
      };
    }
  }
};

// 提示重新登入
export const alertLoginAgain = {
  computed: {
    alertLoginAgain() {
      return {
        position: 'top',
        html: `<h3 class="red--text mb-2">${i18n.t(
          'sweet_alert.alertLoginAgain.html'
        )}</h3>`,
        showConfirmButton: false,
        timer: 2000,
        background: '#ffc3c3',
        backdrop: 'transparent'
      };
    }
  }
};

// 提示密碼已變更
export const alertPasswordChanged = {
  computed: {
    alertPasswordChanged() {
      return {
        title: this.$t('sweet_alert.alertPasswordChanged.title'),
        text: this.$t('sweet_alert.alertPasswordChanged.text'),
        type: 'success',
        confirmButtonText: this.$t('sweet_alert.button.confirmButtonText'),
        confirmButtonClass: 'v-btn primary v-btn--depressed v-btn--round',
        buttonsStyling: false
      };
    }
  }
};

// ---------------------------------
// 資料新刪改查，送出提示
// ---------------------------------

// 通知已完成作業
export const alertSendComplete = {
  computed: {
    alertSendComplete() {
      return {
        title: i18n.t('sweet_alert.alertSendComplete.title'),
        text: i18n.t('sweet_alert.alertSendComplete.text'),
        type: 'success',
        timer: 1500,
        showConfirmButton: false
      };
    }
  }
};

// 提示作業失敗
export const alertExecuteFail = {
  computed: {
    alertExecuteFail() {
      return {
        title: i18n.t('sweet_alert.alertExecuteFail.title'),
        text: i18n.t('sweet_alert.alertExecuteFail.text'),
        type: 'error',
        confirmButtonText: i18n.t('sweet_alert.button.confirmButtonText'),
        confirmButtonClass: 'v-btn primary v-btn--depressed v-btn--round',
        buttonsStyling: false
      };
    }
  }
};

// 確認是否真的要刪除
export const confirmDelete = {
  computed: {
    confirmDelete() {
      return {
        title: this.$t('sweet_alert.confirmDelete.title'),
        text: this.$t('sweet_alert.confirmDelete.text'),
        type: 'warning',
        showCancelButton: true,
        confirmButtonText: this.$t('sweet_alert.button.confirmButtonText'),
        cancelButtonText: this.$t('sweet_alert.button.cancelButtonText'),
        allowOutsideClick: false,
        cancelButtonClass:
          ' v-btn v-btn--outline v-btn--depressed v-btn--round primary--text',
        confirmButtonClass: 'v-btn primary v-btn--depressed v-btn--round',
        buttonsStyling: false
      };
    }
  }
};

// 確認是否真的要從列表中移除
export const confirmRemove = {
  computed: {
    confirmRemove() {
      return {
        title: this.$t('sweet_alert.confirmRemove.title'),
        text: this.$t('sweet_alert.confirmRemove.text'),
        type: 'warning',
        showCancelButton: true,
        confirmButtonText: this.$t('sweet_alert.button.confirmButtonText'),
        cancelButtonText: this.$t('sweet_alert.button.cancelButtonText'),
        allowOutsideClick: false,
        cancelButtonClass:
          ' v-btn v-btn--outline v-btn--depressed v-btn--round primary--text',
        confirmButtonClass: 'v-btn primary v-btn--depressed v-btn--round',
        buttonsStyling: false
      };
    }
  }
};

// 確認是否要離開此頁面
export const confirmLeavePage = {
  computed: {
    confirmLeavePage() {
      return {
        title: this.$t('sweet_alert.confirmLeavePage.title'),
        text: this.$t('sweet_alert.confirmLeavePage.text'),
        type: 'warning',
        showCancelButton: true,
        confirmButtonText: this.$t('sweet_alert.button.confirmButtonText'),
        cancelButtonText: this.$t('sweet_alert.button.cancelButtonText'),
        allowOutsideClick: false,
        confirmButtonClass: 'v-btn primary v-btn--depressed v-btn--round',
        cancelButtonClass:
          ' v-btn v-btn--outline v-btn--depressed v-btn--round primary--text',
        buttonsStyling: false
      };
    }
  }
};

// ---------------------------------
// 資料檢核相關提示
// ---------------------------------

// 提示 欄位資訊有誤
export const alertValidateFailed = {
  computed: {
    alertValidateFailed() {
      return {
        title: this.$t('sweet_alert.alertValidateFailed.title'),
        text: this.$t('sweet_alert.alertValidateFailed.text'),
        type: 'warning',
        confirmButtonText: this.$t('sweet_alert.button.confirmButtonText'),
        confirmButtonClass: 'v-btn primary v-btn--depressed v-btn--round',
        buttonsStyling: false
      };
    }
  }
};

// 提示 欄位資訊有誤(點擊取消回到原設定)
export const alertValidateFailedOrCancel = {
  computed: {
    alertValidateFailedOrCancel() {
      return {
        title: this.$t('sweet_alert.alertValidateFailedOrCancel.title'),
        text: this.$t('sweet_alert.alertValidateFailedOrCancel.text'),
        type: 'warning',
        confirmButtonText: this.$t('sweet_alert.button.confirmButtonText'),
        confirmButtonClass: 'v-btn primary v-btn--depressed v-btn--round',
        buttonsStyling: false
      };
    }
  }
};

// 提示匯出超過1000筆
export const alertExportOverLimit = {
  computed: {
    alertExportOverLimit() {
      return {
        title: this.$t('sweet_alert.alertExportOverLimit.title'),
        html: this.$t('sweet_alert.alertExportOverLimit.html'),
        type: 'warning',
        confirmButtonText: this.$t('sweet_alert.button.confirmButtonText'),
        confirmButtonClass: 'v-btn primary v-btn--depressed v-btn--round',
        buttonsStyling: false
      };
    }
  }
};

// ---------------------------------
// 確認是否執行相關（確認/取消）- 客製化
// ---------------------------------
// 確認是否 部分使用者不隸屬任何群組，也要執行刪除
export const confirmMemberWillNoGroup = {
  methods: {
    confirmMemberWillNoGroup(userAccounts) {
      return {
        title: this.$t('sweet_alert.confirmMemberWillNoGroup.title'),
        html: i18n.t('sweet_alert.confirmMemberWillNoGroup.html', {
          userAccounts: userAccounts
        }),
        type: 'warning',
        showCancelButton: true,
        confirmButtonText: this.$t('sweet_alert.button.confirmButtonText'),
        cancelButtonText: this.$t('sweet_alert.button.cancelButtonText'),
        allowOutsideClick: false,
        confirmButtonClass: 'v-btn primary v-btn--depressed v-btn--round',
        cancelButtonClass:
          ' v-btn v-btn--outline v-btn--depressed v-btn--round primary--text',
        buttonsStyling: false
      };
    }
  }
};

// 確認是否關閉3DS驗證
export const confirmClose3DSecure = {
  computed: {
    confirmClose3DSecure() {
      return {
        title: this.$t('sweet_alert.confirmClose3DSecure.title'),
        text: this.$t('sweet_alert.confirmClose3DSecure.text'),
        type: 'warning',
        showCancelButton: true,
        confirmButtonText: this.$t('sweet_alert.button.confirmButtonText'),
        cancelButtonText: this.$t('sweet_alert.button.cancelButtonText'),
        allowOutsideClick: false,
        confirmButtonClass: 'v-btn primary v-btn--depressed v-btn--round',
        cancelButtonClass:
          ' v-btn v-btn--outline v-btn--depressed v-btn--round primary--text',
        buttonsStyling: false
      };
    }
  }
};

// 確認是否開啟3DS驗證
export const confirmOpen3DSecure = {
  computed: {
    confirmOpen3DSecure() {
      return {
        title: this.$t('sweet_alert.confirmOpen3DSecure.title'),
        text: this.$t('sweet_alert.confirmOpen3DSecure.text'),
        type: 'warning',
        showCancelButton: true,
        confirmButtonText: this.$t('sweet_alert.button.confirmButtonText'),
        cancelButtonText: this.$t('sweet_alert.button.cancelButtonText'),
        allowOutsideClick: false,
        confirmButtonClass: 'v-btn primary v-btn--depressed v-btn--round',
        cancelButtonClass:
          ' v-btn v-btn--outline v-btn--depressed v-btn--round primary--text',
        buttonsStyling: false
      };
    }
  }
};

// 確認該銀行是否全部OTP發送方式都要關閉
export const confirmCloseAllOtpSending = {
  computed: {
    confirmCloseAllOtpSending() {
      return {
        title: this.$t('sweet_alert.confirmCloseAllOtpSending.title'),
        text: this.$t('sweet_alert.confirmCloseAllOtpSending.text'),
        type: 'warning',
        showCancelButton: true,
        confirmButtonText: this.$t('sweet_alert.button.confirmButtonText'),
        cancelButtonText: this.$t('sweet_alert.button.cancelButtonText'),
        allowOutsideClick: false,
        confirmButtonClass: 'v-btn primary v-btn--depressed v-btn--round',
        cancelButtonClass:
          ' v-btn v-btn--outline v-btn--depressed v-btn--round primary--text',
        buttonsStyling: false
      };
    }
  }
};

// 確認是否仍要送出無裝置ID的資訊
export const confirmNoDeviceId = {
  computed: {
    confirmNoDeviceId() {
      return {
        title: this.$t('sweet_alert.confirmNoDeviceId.title'),
        text: this.$t('sweet_alert.confirmNoDeviceId.text'),
        type: 'warning',
        showCancelButton: true,
        confirmButtonText: this.$t('sweet_alert.button.confirmButtonText'),
        cancelButtonText: this.$t('sweet_alert.button.cancelButtonText'),
        allowOutsideClick: false,
        confirmButtonClass: 'v-btn primary v-btn--depressed v-btn--round',
        cancelButtonClass:
          ' v-btn v-btn--outline v-btn--depressed v-btn--round primary--text',
        buttonsStyling: false
      };
    }
  }
};

// 確認是否要解鎖此使用者帳號
export const confirmAccountUnlock = {
  computed: {
    confirmAccountUnlock() {
      return {
        title: this.$t('sweet_alert.confirmAccountUnlock.title'),
        text: this.$t('sweet_alert.confirmAccountUnlock.text'),
        type: 'warning',
        showCancelButton: true,
        confirmButtonText: this.$t('sweet_alert.button.confirmButtonText'),
        cancelButtonText: this.$t('sweet_alert.button.cancelButtonText'),
        allowOutsideClick: false,
        confirmButtonClass: 'v-btn primary v-btn--depressed v-btn--round',
        cancelButtonClass:
          ' v-btn v-btn--outline v-btn--depressed v-btn--round primary--text',
        buttonsStyling: false
      };
    }
  }
};
