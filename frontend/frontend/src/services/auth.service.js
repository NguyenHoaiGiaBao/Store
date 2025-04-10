import api from './api';

export default {
  login(credentials) {
    return api.post('/users/login', credentials)
      .then(response => {
        console.log('Auth service login response:', response);
        return response;
      })
      .catch(error => {
        console.error('Auth service login error:', error);
        throw error;
      });
  },
  register(userData) {
    return api.post('/users/register', userData);
  },
  getCurrentUser() {
    return api.get('/users/current');
  },
};