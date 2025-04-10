import cartService from '@/services/cart.service';

export default {
  namespaced: true,
  state: {
    cart: null,
  },
  mutations: {
    setCart(state, cart) {
      state.cart = cart;
    },
  },
  actions: {
    async fetchCart({ commit, rootGetters }) {
      if (!rootGetters['auth/isAuthenticated']) {
        return;
      }
      try {
        const cart = await cartService.getCart();
        commit('setCart', cart);
        return cart;
      } catch (error) {
        console.error('Error fetching cart:', error);
        if (error.response?.status !== 401) {
          throw error;
        }
      }
    },
    async addToCart({ dispatch }, item) {
      await cartService.addToCart(item);
      return dispatch('fetchCart');
    },
    async updateCartItem({ dispatch }, { productId, quantity }) {
      await cartService.updateCartItem(productId, quantity);
      return dispatch('fetchCart');
    },
    async removeFromCart({ dispatch }, productId) {
      await cartService.removeFromCart(productId);
      return dispatch('fetchCart');
    },
  },
};