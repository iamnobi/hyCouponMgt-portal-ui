import Vue from 'vue';
import router from '@/router/router';
import '@/eventBus/bus';
import { apiLogout } from '../api/apiClient/login';

let s, t, remendTime;
// setting logout time , min 15 * 60 * 1000
let totalTime = 15 * 60 * 1000;

let logout = function() {
  apiLogout();
  localStorage.removeItem('x-csrf-token');
  router.push('/');
};

let resetTimer = function() {
  clearTimeout(t);
  clearInterval(s);
  // default 15m, time is in milliseconds (1000 is 1 second)
  t = setTimeout(function() {
    logout();
  }, totalTime);

  remendTime = totalTime;
  Vue.prototype.$bus.$emit('sentTimer', remendTime);
  showReduceTime();
};

let showReduceTime = function() {
  s = setInterval(function() {
    remendTime = remendTime - 1000;
    Vue.prototype.$bus.$emit('sentTimer', remendTime);
  }, 1 * 1000);
};

export const idleTimer = resetTimer;

export const clearTimer = function() {
  clearTimeout(t);
  clearInterval(s);
};
