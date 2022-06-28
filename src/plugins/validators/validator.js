import Vue from 'vue';
import i18n from '@/plugins/i18n.js';

import VeeValidate, { Validator } from 'vee-validate';

// Dictionaries -> Can find Original Message and Field-specific Custom Messages
import zh_TW_dict from '@/plugins/validators/dictionaries/zh_TW';
import en_dict from '@/plugins/validators/dictionaries/en';

Vue.use(VeeValidate, {
  i18nRootKey: 'validations',
  i18n,
  dictionary: {
    en: en_dict,
    'zh-TW': zh_TW_dict
  }
});

import {
  demoCustomRule,
  checkIsMoreThanFourDecimal,
  checkIsMoreThanTwoDecimal,
  checkoutIpv4,
  checkoutIpv6,
  checkIsAscii,
  checkOtpVerifyMsg
} from '@/plugins/validators/rules/custom';

Validator.extend('demoCustomRule', {
  validate: demoCustomRule
});

Validator.extend('checkIsMoreThanTwoDecimal', {
  validate: checkIsMoreThanTwoDecimal
});
Validator.extend('checkIsMoreThanFourDecimal', {
  validate: checkIsMoreThanFourDecimal
});

Validator.extend('checkoutIpv4', {
  validate: checkoutIpv4
});

Validator.extend('checkoutIpv6', {
  validate: checkoutIpv6
});

Validator.extend('checkIsAscii', {
  validate: checkIsAscii
});

Validator.extend('checkOtpVerifyMsg', {
  validate: checkOtpVerifyMsg
});
