<template>
  <div class="order-list">
    <h2>Danh sách đơn hàng</h2>
    <div class="filter-section">
      <label>
        <input type="checkbox" v-model="showPaidOrders" />
        Chỉ hiển thị đơn hàng đã thanh toán
      </label>
    </div>
    <button @click="fetchOrders" :disabled="loading">Làm mới</button>
    <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>

    <!-- Loading State -->
    <div v-if="loading" class="loading-state">
      <div class="spinner"></div>
      <p>Đang tải danh sách đơn hàng...</p>
    </div>

    <!-- Order List -->
    <div v-else-if="filteredOrders.length">
      <div v-for="order in filteredOrders" :key="order._id" class="order-item">
        <p><strong>Mã đơn:</strong> {{ order._id }}</p>
        <p><strong>Tổng tiền:</strong> {{ formatPrice(order.totalAmount) }} đ</p>
        <p><strong>Trạng thái:</strong> {{ order.status }}</p>
        <p><strong>Ngày đặt:</strong> {{ formatDate(order.createdAt) }}</p>
        <details>
          <summary>Chi tiết đơn hàng</summary>
          <ul>
            <li v-for="item in order.items" :key="item.product._id">
              {{ item.product.name }} - Số lượng: {{ item.quantity }} - Giá: {{ formatPrice(item.product.price) }} đ
            </li>
          </ul>
        </details>
      </div>
    </div>

    <!-- Empty State -->
    <p v-else>Không có đơn hàng phù hợp</p>
  </div>
</template>
<script>
export default {
  data() {
    return {
      loading: false,
      errorMessage: '',
      showPaidOrders: false,
    };
  },
  computed: {
    orders() {
      return this.$store.state.order.orders || []; // Ensure orders is an array
    },
    filteredOrders() {
      if (this.showPaidOrders) {
        return this.orders.filter(order => order.status === 'paid');
      }
      return this.orders;
    },
  },
  methods: {
    formatPrice(price) {
      return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    },
    formatDate(date) {
      return new Date(date).toLocaleDateString('vi-VN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    },
    async fetchOrders() {
      this.loading = true;
      this.errorMessage = '';
      try {
        console.log('Fetching orders...'); // Debug log
        await this.$store.dispatch('order/fetchOrders'); // Ensure this action is correctly implemented
        console.log('Orders fetched:', this.orders); // Debug log
      } catch (error) {
        this.errorMessage = error.response?.data?.message || 'Không thể tải danh sách đơn hàng.';
        console.error('Error fetching orders:', error); // Debug log
      } finally {
        this.loading = false;
      }
    },
  },
  created() {
    this.fetchOrders(); // Ensure orders are fetched on component load
  },
};
</script>
<style scoped>
.order-list {
  padding: 20px;
  font-family: 'Inter', sans-serif;
}

.order-list h2 {
  font-size: 1.5rem;
  color: #1a1a2e;
  margin-bottom: 1.5rem;
  font-weight: 600;
}

.filter-section {
  margin-bottom: 20px;
}

.filter-section label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.9rem;
  color: #666;
}

.filter-section input[type="checkbox"] {
  accent-color: #6c5ce7;
}

button {
  background-color: #6c5ce7;
  color: #fff;
  padding: 10px 20px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 600;
  transition: background-color 0.3s ease, transform 0.2s ease;
  margin-bottom: 20px;
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

.loading-state {
  text-align: center;
  padding: 20px;
  color: #666;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid rgba(0, 0, 0, 0.1);
  border-top: 4px solid #6c5ce7;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 10px;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.order-item {
  border: 1px solid #ddd;
  padding: 15px;
  margin-bottom: 15px;
  border-radius: 8px;
  background-color: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  transition: transform 0.2s ease;
}

.order-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.order-item p {
  margin: 5px 0;
  color: #1a1a2e;
  font-size: 0.9rem;
}

.order-item strong {
  color: #1a1a2e;
  font-weight: 600;
}

.order-item details {
  margin-top: 10px;
}

.order-item summary {
  cursor: pointer;
  color: #6c5ce7;
  font-weight: 600;
  font-size: 0.9rem;
}

.order-item ul {
  list-style: none;
  padding: 10px 0 0 0;
  margin: 0;
}

.order-item li {
  font-size: 0.9rem;
  color: #666;
  margin-bottom: 5px;
}

.order-list > p {
  text-align: center;
  color: #666;
  font-size: 1rem;
  padding: 20px;
}

@media (max-width: 768px) {
  .order-list {
    padding: 15px;
  }

  .order-list h2 {
    font-size: 1.25rem;
  }

  .order-item {
    padding: 10px;
  }
}
</style>