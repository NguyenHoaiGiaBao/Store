import api from './api';

export default {
  getProducts() {
    return api.get('/products').then(res => res.data);
  },

  getProduct(id) {
    return api.get(`http://localhost:3000/api/products/${id}`);
  },

  searchProducts(params) {
    return api.get('/products/search', { params }).then(res => res.data);
  },

  getRelatedProducts(id) {
    return api.get(`/products/${id}/related`).then(res => res.data);
  }
};
