<template>
  <div class="order-form">
    <h2>Thông tin đặt hàng</h2>
    <div class="form-group">
      <label>Địa chỉ giao hàng</label>
      <input 
        v-model="form.shippingAddress" 
        type="text" 
        required
        @input="updateForm"
      >
    </div>
    <div class="form-group">
      <label>Phương thức thanh toán</label>
      <select 
        v-model="form.paymentMethod" 
        required
        @change="updateForm"
      >
        <option value="COD">Thanh toán khi nhận hàng</option>
        <option value="Banking">Chuyển khoản ngân hàng</option>
      </select>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      form: {
        shippingAddress: '',
        paymentMethod: 'COD',
      }
    };
  },
  methods: {
    updateForm() {
      this.$emit('update-form', this.form);
    }
  }
};
</script>
<style scoped>
.order-form {
  padding: 20px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  font-family: 'Inter', sans-serif;
}

.order-form h2 {
  font-size: 1.5rem;
  color: #1a1a2e;
  margin-bottom: 1.5rem;
  font-weight: 600;
}

.form-group {
  margin-bottom: 1.5rem;
}

label {
  display: block;
  margin-bottom: 8px;
  font-size: 0.9rem;
  color: #666;
  font-weight: 500;
}

input, select {
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
  outline: none;
  background-color: #f5f7fa;
  color: #1a1a2e;
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
}

input:focus, select:focus {
  border-color: #6c5ce7;
  box-shadow: 0 0 0 3px rgba(108, 92, 231, 0.1);
}

button {
  background-color: #6c5ce7;
  color: #fff;
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 600;
  transition: background-color 0.3s ease, transform 0.2s ease;
}

button:hover:not(:disabled) {
  background-color: #5a4ad1;
  transform: translateY(-2px);
}

button:disabled {
  background-color: #ddd;
  cursor: not-allowed;
}

.error-message {
  color: #e63946;
  font-size: 0.9rem;
  margin-top: 10px;
}

@media (max-width: 768px) {
  .order-form {
    padding: 15px;
  }

  .order-form h2 {
    font-size: 1.25rem;
  }
}
</style>
