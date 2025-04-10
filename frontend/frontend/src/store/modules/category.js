import categoryService from '@/services/category.service';

export default {
  namespaced: true,
  state: {
    categories: [],
  },
  mutations: {
    setCategories(state, categories) {
      state.categories = categories;
    },
  },
  actions: {
    async fetchCategories({ commit }) {
      const categories = await categoryService.getCategories();
      commit('setCategories', categories);
      return categories;
    },
  },
};