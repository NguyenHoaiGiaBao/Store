import authService from '@/services/auth.service';

export default {
  namespaced: true,
  state: {
    user: null,
    token: localStorage.getItem('token') || null,
  },
  getters: {
    isAuthenticated: state => !!state.token,
    currentUser: state => state.user, // Ensure this returns the full user object, including the role
  },
  mutations: {
    setUser(state, user) {
      state.user = user;
    },
    setToken(state, token) {
      state.token = token;
      if (token) {
        localStorage.setItem('token', token);
      } else {
        localStorage.removeItem('token');
      }
    },
    logout(state) {
      state.user = null;
      state.token = null;
      localStorage.removeItem('token');
    },
  },
  actions: {
    async login({ commit }, credentials) {
      try {
        const response = await authService.login(credentials);
        if (response.data && response.data.token) {
          commit('setToken', response.data.token);
          commit('setUser', {
            id: response.data._id,
            username: response.data.username,
            email: response.data.email,
            role: response.data.role, // Include the user's role
          });
          // Set token in axios headers
          this._vm.$axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
          return response.data;
        }
        throw new Error('Invalid response from server');
      } catch (error) {
        console.error('Login error:', error);
        throw error;
      }
    },
    async register({ commit }, userData) {
      const response = await authService.register(userData);
      commit('setToken', response.token);
      commit('setUser', { id: response._id, username: response.username, email: response.email });
      return response;
    },
    async getCurrentUser({ commit }) {
      const user = await authService.getCurrentUser();
      commit('setUser', user);
      return user;
    },
    logout({ commit }) {
      commit('logout');
    },
  },
};