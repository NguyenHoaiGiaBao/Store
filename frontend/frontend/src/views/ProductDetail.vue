<template>
  <div class="container">
    <!-- Breadcrumb -->
    <div class="breadcrumb">
      <router-link to="/">Trang chủ</router-link> 
      <span>›</span>
      <router-link to="/products">Sản phẩm</router-link>
      <span>›</span>
      <span>{{ product?.name || 'Loading...' }}</span>
    </div>

    <!-- Loading state -->
    <div v-if="loading" class="loading-container">
      <div class="spinner"></div>
      <p>Đang tải thông tin sản phẩm...</p>
    </div>

    <!-- Error state -->
    <div v-else-if="error" class="error-container">
      <i class="fas fa-exclamation-circle"></i>
      <h2>{{ error }}</h2>
      <router-link to="/products" class="back-btn">
        Quay lại danh sách sản phẩm
      </router-link>
    </div>

    <!-- Product Detail when loaded -->
    <product-detail-component
      v-else-if="product" 
      :product="product"
      :is-authenticated="isAuthenticated"
      @add-to-cart="handleAddToCart"
      @buy-now="handleBuyNow"
    />
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import ProductDetailComponent from '@/components/product/ProductDetail.vue';

export default {
  name: 'ProductDetailView',
  components: {
    ProductDetailComponent
  },

  data() {
    return {
      error: null
    };
  },

  computed: {
    ...mapState({
      product: state => state.product.currentProduct,
      loading: state => state.product.loading,
      isAuthenticated: state => state.auth.isAuthenticated
    }),
    
    productId() {
      return this.$route.params.id;
    }
  },

  methods: {
    ...mapActions({
      fetchProduct: 'product/fetchProduct'
    }),

    async loadProduct() {
      this.error = null;
      if (!this.productId) {
        this.error = 'ID sản phẩm không hợp lệ';
        return;
      }

      try {
        await this.fetchProduct(this.productId);
      } catch (error) {
        console.error('Error loading product:', error);
        this.error = error.message || 'Có lỗi xảy ra khi tải thông tin sản phẩm';
      }
    },

    async handleAddToCart(item) {
      if (!this.isAuthenticated) {
        this.$router.push('/login');
        return;
      }

      try {
        await this.$store.dispatch('cart/addToCart', {
          productId: this.productId,
          quantity: item.quantity
        });
        this.$toast.success('Đã thêm vào giỏ hàng');
      } catch (error) {
        this.$toast.error(error.message || 'Không thể thêm vào giỏ hàng');
      }
    },

    async handleBuyNow(item) {
      if (!this.isAuthenticated) {
        this.$router.push('/login');
        return;
      }

      try {
        await this.$store.dispatch('cart/addToCart', {
          productId: this.productId,
          quantity: item.quantity
        });
        this.$router.push('/checkout');
      } catch (error) {
        this.$toast.error(error.message || 'Không thể tiến hành mua hàng');
      }
    }
  },

  created() {
    // Chỉ gọi 1 lần khi component được tạo
    if (this.productId) {
      this.loadProduct();
    }
  },

  watch: {
    // Chỉ gọi khi productId thay đổi và khác với giá trị cũ
    productId(newId, oldId) {
      if (newId !== oldId && newId) {
        this.loadProduct();
      }
    }
  }
};
</script>

<style scoped>
.product-detail-view {
  background: #f5f7fa;
  padding: 40px 0;
  min-height: 100vh;
  font-family: 'Inter', sans-serif;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.breadcrumb {
  margin-bottom: 30px;
  color: #666;
}

.breadcrumb a {
  color: #6c5ce7;
  text-decoration: none;
}

.breadcrumb span {
  margin: 0 10px;
}

.product-main {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;
  margin-bottom: 40px;
  background: #fff;
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}

/* Gallery Styles */
.product-gallery {
  position: relative;
}

.main-image {
  aspect-ratio: 1;
  border-radius: 12px;
  overflow: hidden;
  position: relative;
  background: #f5f7fa;
  margin-bottom: 20px;
}

.main-image img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  transition: transform 0.3s ease;
}

.zoom-overlay {
  position: absolute;
  right: 15px;
  bottom: 15px;
  width: 40px;
  height: 40px;
  background: rgba(108,92,231,0.9);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  cursor: pointer;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.main-image:hover {
  .zoom-overlay {
    opacity: 1;
  }
  img {
    transform: scale(1.05);
  }
}

.thumbnail-list {
  display: flex;
  gap: 10px;
  margin-top: 20px;
}

.thumbnail {
  width: 80px;
  height: 80px;
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  border: 2px solid transparent;
  transition: border-color 0.3s ease;
}

.thumbnail.active {
  border-color: #6c5ce7;
}

.thumbnail img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* Product Info Styles */
.product-title {
  font-size: 2rem;
  color: #1a1a2e;
  margin-bottom: 20px;
}

.product-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.brand span {
  color: #666;
  margin-right: 5px;
}

.rating {
  display: flex;
  align-items: center;
  gap: 10px;
}

.stars {
  color: #facc15;
}

.product-price {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 30px;
}

.current-price {
  font-size: 2rem;
  font-weight: 700;
  color: #6c5ce7;
}

.original-price {
  font-size: 1.2rem;
  color: #999;
  text-decoration: line-through;
}

.discount-badge {
  background: #6c5ce7;
  color: white;
  padding: 5px 10px;
  border-radius: 4px;
  font-weight: 500;
}

.product-actions {
  margin-bottom: 30px;
}

.quantity-picker {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 20px;
}

.qty-btn {
  width: 40px;
  height: 40px;
  border: none;
  background: #f5f7fa;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.qty-btn:hover {
  background: #6c5ce7;
  color: white;
}

input[type="number"] {
  width: 60px;
  height: 40px;
  text-align: center;
  border: 1px solid #ddd;
  border-radius: 8px;
}

.action-buttons {
  display: flex;
  gap: 15px;
}

.add-to-cart,
.buy-now {
  flex: 1;
  padding: 15px;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  transition: all 0.3s ease;
}

.add-to-cart {
  background: white;
  color: #6c5ce7;
  border: 2px solid #6c5ce7;
}

.add-to-cart:hover {
  background: #6c5ce7;
  color: white;
}

.buy-now {
  background: #6c5ce7;
  color: white;
}

.buy-now:hover {
  background: #5a4ad1;
  transform: translateY(-2px);
}

.product-features {
  margin: 30px 0;
  padding: 20px;
  background: #f5f7fa;
  border-radius: 12px;
}

.product-features h3 {
  color: #1a1a2e;
  margin-bottom: 15px;
}

.product-features ul {
  list-style: none;
  padding: 0;
}

.product-features li {
  padding: 8px 0;
  color: #666;
  display: flex;
  align-items: center;
  gap: 10px;
}

.product-features li:before {
  content: "•";
  color: #6c5ce7;
}

.additional-info {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  margin-top: 30px;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 10px;
  color: #666;
}

.info-item i {
  color: #6c5ce7;
  font-size: 1.2rem;
}

/* Description & Specs */
.product-description,
.technical-specs {
  background: white;
  padding: 30px;
  border-radius: 12px;
  margin-bottom: 30px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}

.technical-specs table {
  width: 100%;
  border-collapse: collapse;
}

.technical-specs td {
  padding: 12px;
  border-bottom: 1px solid #eee;
}

.technical-specs td:first-child {
  width: 200px;
  color: #666;
  background: #f5f7fa;
}

/* Responsive Design */
@media (max-width: 992px) {
  .product-main {
    grid-template-columns: 1fr;
  }
  
  .additional-info {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .product-detail-view {
    padding: 20px 0;
  }

  .product-title {
    font-size: 1.5rem;
  }

  .product-price {
    flex-direction: column;
    align-items: flex-start;
  }

  .action-buttons {
    flex-direction: column;
  }

  .technical-specs td {
    display: block;
  }

  .technical-specs td:first-child {
    width: 100%;
  }
}
</style>