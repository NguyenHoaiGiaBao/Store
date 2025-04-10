import Vue from 'vue';
import Vuex from 'vuex';
import auth from './modules/auth';
import cart from './modules/cart';
import category from './modules/category';
import order from './modules/order';
import product from './modules/product';

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    product,
    cart,
    order,
    category,
    auth,
  },
});