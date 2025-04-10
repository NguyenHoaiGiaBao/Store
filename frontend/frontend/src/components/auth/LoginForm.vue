<template>
  <div class="login-container">
    <h2 class="form-title">ĐĂNG NHẬP</h2>
    <form @submit.prevent="submitLogin" class="login-form" :class="{ 'shake': loginError }">
      <div class="form-group">
        <input
          v-model="form.email"
          type="email"
          required
          placeholder="E-mail"
          @focus="focusInput('email')"
          @blur="blurInput('email')"
        >
        <span class="input-icon email-icon">
          <i class="fas fa-envelope"></i>
        </span>
      </div>

      <div class="form-group">
        <input
          v-model="form.password"
          :type="showPassword ? 'text' : 'password'"
          required
          placeholder="Password"
          @focus="focusInput('password')"
          @blur="blurInput('password')"
        >
        <span class="input-icon password-icon" @click="showPassword = !showPassword">
          <i :class="showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
        </span>
      </div>


      <button type="submit" class="submit-btn" :disabled="loading">
        <span v-if="loading" class="loader"></span>
        <span v-else>Đăng nhập</span>
      </button>

      <div class="extra-links">
        <router-link to="/register">Bạn chưa có tài khoản? Tạo tại đây</router-link>
      </div>
    </form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      form: {
        email: '',
        password: '',
      },
      loading: false,
      loginError: false,
      showPassword: false,
    };
  },
  methods: {
    async submitLogin() {
      this.loading = true;
      this.loginError = false;
      try {
        const response = await this.$store.dispatch('auth/login', this.form);
        console.log('Login successful:', response);
        this.$toast.success('Login successful!');
        this.$emit('login-success');
      } catch (error) {
        this.loginError = true;
        setTimeout(() => (this.loginError = false), 400);
        console.error('Login failed:', error);
        this.$toast.error(error.response?.data?.message || 'Login error');
      } finally {
        this.loading = false;
      }
    },
    focusInput(field) {
      this.form[field] = this.form[field].trim();
    },
    blurInput(field) {
      if (!this.form[field]) this.form[field] = '';
    },
  },
};
</script>

<style scoped>
.login-container {
  max-width: 400px;
  margin: 40px auto;
  padding: 30px;
  background-color: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  font-family: 'Inter', sans-serif;
}

.form-title {
  text-align: center;
  color: #1a1a2e;
  margin-bottom: 30px;
  font-weight: 600;
  letter-spacing: 1px;
  font-size: 1.5rem;
}

.login-form {
  transition: transform 0.2s ease;
}

.login-form.shake {
  animation: shake 0.3s ease;
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-4px); }
  50% { transform: translateX(4px); }
  75% { transform: translateX(-4px); }
}

.form-group {
  margin-bottom: 1.5rem;
  position: relative;
}

input {
  width: 100%;
  padding: 12px 0px 12px 16px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
  outline: none;
  background-color: #f5f7fa;
  color: #1a1a2e;
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
}

input:focus {
  border-color: #6c5ce7;
  box-shadow: 0 0 0 3px rgba(108, 92, 231, 0.1);
}

input::placeholder {
  color: #999;
}

.input-icon {
  position: absolute;
  right: 15px;
  top: 50%;
  transform: translateY(-50%);
  color: #666;
  cursor: pointer;
}

.forgot-password {
  text-align: right;
  margin-bottom: 20px;
}

.forgot-password a {
  color: #6c5ce7;
  text-decoration: none;
  font-size: 0.9rem;
}

.forgot-password a:hover {
  text-decoration: underline;
}

.submit-btn {
  width: 100%;
  padding: 12px;
  background: #6c5ce7;
  color: #fff;
  font-size: 1rem;
  font-weight: 600;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.3s ease, transform 0.2s ease;
}

.submit-btn:hover:not(:disabled) {
  background: #5a4ad1;
  transform: translateY(-2px);
}

.submit-btn:disabled {
  background: #ddd;
  cursor: not-allowed;
}

.loader {
  width: 20px;
  height: 20px;
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.extra-links {
  text-align: center;
  margin-top: 1.5rem;
  font-size: 0.9rem;
}

.extra-links a {
  color: #6c5ce7;
  text-decoration: none;
  transition: color 0.3s ease;
}

.extra-links a:hover {
  text-decoration: underline;
}

@media (max-width: 480px) {
  .login-container {
    padding: 20px;
    margin: 20px;
  }

  .form-title {
    font-size: 1.25rem;
  }

  input {
    font-size: 0.9rem;
  }

  .submit-btn {
    font-size: 0.9rem;
  }
}
</style>