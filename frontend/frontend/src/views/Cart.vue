<template>
  <div class="cart-page">
    <h1>Giỏ hàng</h1>
    <div v-if="cartLoaded">
      <div v-if="cart?.items?.length">
        <cart-item 
          v-for="item in cart.items" 
          :key="item.product?._id" 
          :item="item"
          @update="updateItem"
          @remove="removeItem"
        />
        <cart-summary :cart="cart" />
        <button @click="$router.push('/checkout')" class="checkout-btn">
          Thanh toán
        </button>
      </div>
      <p v-else class="empty-cart">Giỏ hàng trống</p>
    </div>
    <div v-else class="loading">
      <p>Đang tải...</p>
    </div>
  </div>
</template>

<script>
import CartItem from '@/components/cart/CartItem.vue';
import CartSummary from '@/components/cart/CartSummary.vue';

export default {
  components: { CartItem, CartSummary },
  data() {
    return {
      cartLoaded: false
    }
  },
  computed: {
    cart() {
      return this.$store.state.cart.cart;
    },
  },
  methods: {
    updateItem({ productId, quantity }) {
      if (!productId) return;
      this.$store.dispatch('cart/updateCartItem', { productId, quantity });
    },
    removeItem(productId) {
      if (!productId) return;
      this.$store.dispatch('cart/removeFromCart', productId);
    },
    async loadCart() {
      try {
        if (this.$store.getters['auth/isAuthenticated']) {
          await this.$store.dispatch('cart/fetchCart');
        }
      } catch (error) {
        console.error('Error loading cart:', error);
        this.$toast.error('Could not load cart');
      } finally {
        this.cartLoaded = true;
      }
    }
  },
  created() {
    this.loadCart();
  },
};
</script>

<style scoped>
.cart-page {
  padding: 40px 20px;
  background: #f5f7fa;
  font-family: 'Inter', sans-serif;
}

.cart-page h1 {
  font-size: 2rem;
  color: #1a1a2e;
  margin-bottom: 2rem;
  font-weight: 700;
}

.loading, .empty-cart {
  text-align: center;
  padding: 2rem;
  color: #666;
  font-size: 1.1rem;
}

.checkout-btn {
  background-color: #6c5ce7;
  color: #fff;
  padding: 12px 24px;
  border: none;
  border-radius: 4px;
  margin-top: 20px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 600;
  transition: background-color 0.3s ease;
  display: block;
  width: 100%;
  max-width: 300px;
  margin-left: auto;
}

.checkout-btn:hover {
  background-color: #5a4ad1;
}
</style>