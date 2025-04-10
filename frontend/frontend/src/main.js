import Vue from 'vue';
import VueToast from 'vue-toast-notification';
import 'vue-toast-notification/dist/theme-sugar.css';
import App from './App.vue';
import axios from './plugins/axios'; // Đúng đường dẫn
import router from './router';
import store from './store';

Vue.use(VueToast);
Vue.prototype.$axios = axios;

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app');