<template>
  <div class="checkout">
    <h1>Thanh toán</h1>
    <order-form @update-form="updateOrderForm" />
    <cart-summary :cart="cart" />
    <div class="order-actions">
      <button 
        class="confirm-order-btn" 
        @click="confirmOrder"
        :disabled="!canOrder">
        {{ loading ? 'Đang xử lý...' : 'Xác nhận đặt hàng' }}
      </button>
      <p v-if="!formData.shippingAddress" class="warning-text">
        * Vui lòng nhập địa chỉ giao hàng
      </p>
    </div>
  </div>
</template>

<script>
import OrderForm from '@/components/order/OrderForm.vue';
import CartSummary from '@/components/cart/CartSummary.vue';

export default {
  components: { OrderForm, CartSummary },
  data() {
    return {
      loading: false,
      formData: {
        shippingAddress: '',
        paymentMethod: 'COD'
      }
    }
  },
  computed: {
    cart() {
      return this.$store.state.cart.cart;
    },
    canOrder() {
      return !this.loading && 
             this.cart?.items?.length > 0 && 
             this.formData.shippingAddress.trim() !== '';
    }
  },
  methods: {
    updateOrderForm(formData) {
      this.formData = { ...formData };
      console.log('Updated form data:', this.formData); // Debug log
    },
    async confirmOrder() {
      if (!this.canOrder) {
        this.$toast.error('Vui lòng điền đầy đủ thông tin!');
        return;
      }

      this.loading = true;
      try {
        const orderData = {
          items: this.cart.items
            .filter(item => item?.product) // Add null check
            .map(item => ({
              product: item.product._id,
              quantity: item.quantity || 1,
              price: item.product.price
            })),
          shippingAddress: this.formData.shippingAddress,
          paymentMethod: this.formData.paymentMethod
        };
        
        console.log('Sending order data:', orderData); // Debug log
        const response = await this.$store.dispatch('order/createOrder', orderData);
        console.log('Order response:', response); // Debug log
        
        await this.$store.dispatch('cart/fetchCart');
        this.$toast.success('Đặt hàng thành công!');
        this.$router.push('/orders');
      } catch (error) {
        console.error('Order error:', error);
        this.$toast.error(error.response?.data?.message || 'Đặt hàng thất bại!');
      } finally {
        this.loading = false;
      }
    }
  }
};
</script>

<style scoped>
.checkout {
  padding: 20px;
  max-width: 600px;
  margin: 0 auto;
}

.confirm-order-btn {
  background-color: #1a73e8;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  margin-top: 20px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.confirm-order-btn:hover {
  background-color: #1557b0;
}

.confirm-order-btn:disabled {
  background-color: #999;
  cursor: not-allowed;
}

.warning-text {
  color: #ff5252;
  font-size: 0.9rem;
  margin-top: 8px;
}

.order-actions {
  margin-top: 20px;
  text-align: center;
}
</style>