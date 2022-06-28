import Vue from 'vue';
import amountAddCommas from '@/filters/amountAddCommas';
import { convertTimeToSecond, convertTimeToDay } from '@/filters/convertToTime';
import panAddBlanks from '@/filters/panAddBlanks';

//filters
Vue.filter('amountAddCommas', amountAddCommas);
Vue.filter('convertTimeToSecond', convertTimeToSecond);
Vue.filter('convertTimeToDay', convertTimeToDay);
Vue.filter('panAddBlanks', panAddBlanks);
