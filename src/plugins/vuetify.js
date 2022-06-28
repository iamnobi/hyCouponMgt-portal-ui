import Vue from 'vue';
import Vuetify from 'vuetify/lib';
import 'vuetify/src/stylus/app.styl';

Vue.use(Vuetify, {
  iconfont: 'md',
  theme: {
    primary: '#1976D2',
    secondary: '#dfba5f', //#e8aa45
    accent: '#8aa7d6',
    error: '#FF5252',
    info: '#2196F3',
    success: '#4CAF50',
    warning: '#e8a500'
  }
});
