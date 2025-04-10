import productService from '@/services/product.service';

const state = {
  products: [],
  currentProduct: null,
  loading: false,
  error: null
};

const getters = {
  allProducts: state => state.products,
  productById: state => id => state.products.find(product => product._id === id),
  currentProduct: state => state.currentProduct,
  loading: state => state.loading,
  error: state => state.error
};

const actions = {
  async fetchProducts({ commit }) {
    commit('SET_LOADING', true);
    try {
      const response = await productService.getProducts();
      commit('setProducts', response);
      return response;
    } catch (error) {
      commit('SET_ERROR', error.response ? error.response.data.message : error.message);
      throw error;
    } finally {
      commit('SET_LOADING', false);
    }
  },
  
  async fetchProduct({ commit }, id) {
    commit('SET_LOADING', true);
    commit('SET_ERROR', null);
    
    try {
      const response = await productService.getProduct(id);
      const productData = response.data;  // Lấy data từ response
      commit('SET_CURRENT_PRODUCT', productData);
      return productData;
    } catch (error) {
      console.error('Error fetching product:', error);
      commit('SET_ERROR', error.message);
      throw error;
    } finally {
      commit('SET_LOADING', false);
    }
  }
};

const mutations = {
  setProducts(state, products) {
    state.products = products;
  },
  SET_CURRENT_PRODUCT(state, product) {
    state.currentProduct = product;
  },
  SET_LOADING(state, loading) {
    state.loading = loading;
  },
  SET_ERROR(state, error) {
    state.error = error;
  }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
