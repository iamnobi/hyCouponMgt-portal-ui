import '@babel/polyfill';
import Vue from 'vue';
import App from '@/App.vue';
import router from '@/router/router';
import store from '@/store/store';
import { GlobalConfig } from './config';

// global config - inject all config for $config
Object.defineProperty(Vue.prototype, '$config', { value: GlobalConfig });

//-------- plugin  ----------//
import '@/plugins/vuetify';
import i18n from '@/plugins/i18n';

// Velocity
import Velocity from 'velocity-animate/velocity.min';
window.Velocity = window.velocity = Velocity;

// VueSweetalert2  https://www.npmjs.com/package/vue-sweetalert2
import VueSweetalert2 from 'vue-sweetalert2';
Vue.use(VueSweetalert2);

// vee-validate
import '@/plugins/validators/validator';

// global component
import '@/globalComponents';

// global filters
import '@/globalFilters';

Vue.config.productionTip = false;
new Vue({
  router,
  store,
  i18n,
  render: h => h(App)
}).$mount('#app');
