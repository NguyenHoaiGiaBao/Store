import api from '@/plugins/axios';

export default {
  createOrder(orderData) {
    return api.post('/orders', orderData)
      .then(response => {
        console.log('Order created:', response.data);
        return response.data;
      })
      .catch(error => {
        console.error('Error creating order:', error);
        throw error;
      });
  },

  getOrders() {
    return api.get('/orders').then(response => response.data);
  }
};