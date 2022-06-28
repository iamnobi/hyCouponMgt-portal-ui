import Vue from 'vue';

import BasePageTitle from '@/components/uiComponent/BasePageTitle.vue';
import BaseOperationPrompt from '@/components/uiComponent/BaseOperationPrompt.vue';
import BaseButtonGroup from '@/components/uiComponent/BaseButtonGroup.vue';
import BaseDialogForm from '@/components/uiComponent/BaseDialogForm.vue';
import BaseDialogInfo from '@/components/uiComponent/BaseDialogInfo.vue';
import BaseDeleteAlert from '@/components/uiComponent/BaseDeleteAlert.vue';
import BasePageLoading from '@/components/uiComponent/BasePageLoading.vue';
import BaseSumSelectAmount from '@/components/uiComponent/BaseSumSelectAmount.vue';
import BaseTableExport from '@/components/uiComponent/BaseTableExport.vue';
import BaseBanksList from '@/components/uiComponent/BaseBanksList.vue';
import BaseHelpTip from '@/components/uiComponent/BaseHelpTip.vue';

// plugin -- vue-ctk-date-time-picker version 2.0.6  https://github.com/chronotruck/vue-ctk-date-time-picker
// this plugin need to use moment.js
import VueCtkDateTimePicker from 'vue-ctk-date-time-picker';
import 'vue-ctk-date-time-picker/dist/vue-ctk-date-time-picker.css';

// all components in uiComponent are use as global component
Vue.component('BaseVueCtkDateTimePicker', VueCtkDateTimePicker);
Vue.component('BasePageTitle', BasePageTitle);
Vue.component('BaseOperationPrompt', BaseOperationPrompt);
Vue.component('BaseButtonGroup', BaseButtonGroup);
Vue.component('BaseDialogForm', BaseDialogForm);
Vue.component('BaseDialogInfo', BaseDialogInfo);
Vue.component('BaseDeleteAlert', BaseDeleteAlert);
Vue.component('BasePageLoading', BasePageLoading);
Vue.component('BaseSumSelectAmount', BaseSumSelectAmount);
Vue.component('BaseTableExport', BaseTableExport);
Vue.component('BaseBanksList', BaseBanksList);
Vue.component('BaseHelpTip', BaseHelpTip);
