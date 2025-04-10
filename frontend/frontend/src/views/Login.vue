<template>
  <div class="login">
    <div class="login-wrapper">
      <div class="login-header">
        <h1>Chào mừng bạn quay trở lại!</h1>
        <p>Hãy đăng nhập để chọn những sản phẩm dành cho bạn.</p>
      </div>
      <login-form @login-success="handleLoginSuccess" />
    </div>
  </div>
</template>

<script>
import LoginForm from '@/components/auth/LoginForm.vue';

export default {
  components: { LoginForm },
  methods: {
    async handleLoginSuccess() {
      const redirect = this.$route.query.redirect || '/';
      try {
        await this.$router.push(redirect);
      } catch (error) {
        console.error('Navigation error:', error);
      }
    },
  },
};
</script>

<style scoped>
.login {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: #f5f7fa; /* Thay background image bằng màu nền nhẹ */
  font-family: 'Inter', sans-serif;
}

.login-wrapper {
  max-width: 400px;
  width: 100%;
  padding: 40px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.login-wrapper input {
  width: 100%;
  max-width: 300px; /* Giữ nguyên giới hạn chiều rộng input */
  margin: 0 auto;
}

.login-header h1 {
  font-size: 1.8rem;
  color: #1a1a2e;
  margin-bottom: 10px;
  font-weight: 700;
}

.login-header p {
  font-size: 0.95rem;
  color: #666;
  margin-bottom: 20px;
}

@media (max-width: 480px) {
  .login-wrapper {
    padding: 20px;
    margin: 20px;
  }

  .login-header h1 {
    font-size: 1.5rem;
  }

  .login-header p {
    font-size: 0.9rem;
  }
}
</style>