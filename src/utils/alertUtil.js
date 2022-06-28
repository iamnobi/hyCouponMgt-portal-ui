import Vue from 'vue';
import router from '@/router/router';

import {
  alertSendComplete,
  alertNoAnyPermission,
  alertNoPermission,
  alertLoggedOut,
  alertLoginAgain,
  alertExecuteFail
} from '@/mixins/alertTextCollection';

// TODO 不知道有沒有不需要宣告Vue實體的方式
export default new Vue({
  mixins: [
    alertSendComplete,
    alertNoAnyPermission,
    alertNoPermission,
    alertLoggedOut,
    alertLoginAgain,
    alertExecuteFail
  ],

  methods: {
    sendCompleteAlert() {
      this.$swal(this.alertSendComplete);
    },

    noAnyPermission() {
      this.$swal(this.alertNoAnyPermission).then(() => {
        localStorage.removeItem('x-csrf-token');
        router.go(0);
      });
    },

    noPermission() {
      this.$swal(this.alertNoPermission);
    },

    loggedOut() {
      this.$swal(this.alertLoggedOut).then(() => {
        localStorage.removeItem('x-csrf-token');
        router.go(0);
      });
    },

    loginAgain() {
      this.$swal(this.alertLoginAgain).then(() => {
        localStorage.removeItem('x-csrf-token');
        router.go(0);
      });
    },

    executeFail() {
      this.$swal(this.alertExecuteFail);
    }
  }
});
