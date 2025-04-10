<template>
  <div class="register">
    <div class="register-wrapper">
      <div class="register-header">
        <h1>TẠO TÀI KHOẢN</h1>
      </div>
      <register-form @register-success="handleRegisterSuccess" />
    </div>
  </div>
</template>

<script>
import RegisterForm from '@/components/auth/RegisterForm.vue';

export default {
  components: { RegisterForm },
  methods: {
    handleRegisterSuccess() {
      this.$router.push('/login');
    },
  },
};
</script>

<style scoped>
.register {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: #f5f7fa; /* Thay background image bằng màu nền nhẹ */
  font-family: 'Inter', sans-serif;
}

.register-wrapper {
  max-width: 400px;
  width: 100%;
  padding: 40px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.register-header h1 {
  font-size: 1.8rem;
  color: #1a1a2e;
  margin-bottom: 10px;
  font-weight: 700;
}

.register-header p {
  font-size: 0.95rem;
  color: #666;
  margin-bottom: 20px;
}

@media (max-width: 480px) {
  .register-wrapper {
    padding: 20px;
    margin: 20px;
  }

  .register-header h1 {
    font-size: 1.5rem;
  }

  .register-header p {
    font-size: 0.9rem;
  }
}
</style>