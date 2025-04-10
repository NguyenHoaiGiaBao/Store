import orderService from '@/services/order.service';

export default {
  namespaced: true,
  
  state: {
    orders: [],
    shippingAddress: '',
    paymentMethod: 'COD',
    loading: false,
    error: null
  },

  mutations: {
    setOrders(state, orders) {
      state.orders = orders;
    },
    setShippingAddress(state, address) {
      state.shippingAddress = address;
    },
    setPaymentMethod(state, method) {
      state.paymentMethod = method;
    },
    setLoading(state, status) {
      state.loading = status;
    },
    setError(state, error) {
      state.error = error;
    }
  },

  actions: {
    async createOrder({ commit, state }, orderData) {
      commit('setLoading', true);
      try {
        const response = await orderService.createOrder(orderData);
        // Sử dụng state thay vì this.state
        commit('setOrders', [...state.orders, response]);
        return response;
      } catch (error) {
        commit('setError', error.message);
        throw error;
      } finally {
        commit('setLoading', false);
      }
    },
    
    // Thêm action để fetch orders
    async fetchOrders({ commit }) {
      commit('setLoading', true);
      try {
        const orders = await orderService.getOrders();
        commit('setOrders', orders);
        return orders;
      } catch (error) {
        commit('setError', error.message);
        throw error;
      } finally {
        commit('setLoading', false);
      }
    }
  }
};
