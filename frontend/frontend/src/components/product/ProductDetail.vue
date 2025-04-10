<!-- src/components/product/ProductDetailComponent.vue -->
<template>
  <div class="product-detail">
    <div class="container" v-if="product">
      <!-- Breadcrumb section -->
      <div class="breadcrumb">
        <router-link to="/">Trang chủ</router-link> 
        <span>›</span>
        <router-link to="/products">Sản phẩm</router-link>
        <span>›</span>
        <span>{{ product.name }}</span>
      </div>

      <div class="product-layout">
        <!-- Product Gallery -->
        <div class="product-gallery">
          <div class="main-image">
            <img :src="product.images?.[0] || defaultImage" :alt="product.name" @error="handleImageError">
          </div>
        </div>

        <!-- Product Info -->
        <div class="product-info">
          <h1 class="product-title">{{ product.name }}</h1>
          
          <div class="product-meta">
            <div class="brand">
              <span>Thương hiệu:</span>
              <strong>{{ product.brand }}</strong>
            </div>
            <div class="stock-status">
              <span :class="['status-badge', product.stock > 0 ? 'in-stock' : 'out-of-stock']">
                {{ product.stock > 0 ? `Còn ${product.stock} sản phẩm` : 'Hết hàng' }}
              </span>
            </div>
          </div>

          <div class="product-price">
            <div class="current-price">
              {{ formatPrice(calculateDiscountedPrice(product.price, product.discount)) }}₫
            </div>
            <div v-if="product.discount" class="original-price">
              {{ formatPrice(product.price) }}₫
            </div>
            <div v-if="product.discount" class="discount-badge">
              -{{ product.discount }}%
            </div>
          </div>

          <!-- Add to Cart Section -->
          <div class="product-actions" v-if="product.stock > 0">
            <div class="quantity-selector">
              <button @click="decreaseQuantity" :disabled="quantity <= 1">-</button>
              <input type="number" v-model.number="quantity" min="1" :max="product.stock">
              <button @click="increaseQuantity" :disabled="quantity >= product.stock">+</button>
            </div>
            <div class="action-buttons">
              <button class="add-to-cart" @click="addToCart">
                <i class="fas fa-shopping-cart"></i>
                Thêm vào giỏ
              </button>
            </div>
          </div>

          <!-- Product Specifications -->
          <div class="product-specifications" v-if="product.specifications">
            <h3>Thông số sản phẩm</h3>
            <div class="specs-content">
              {{ product.specifications }}
            </div>
          </div>

          <!-- Product Status -->
          <div class="product-status" v-if="product.status">
            <h3>Trạng thái</h3>
            <div class="status-content">
              {{ product.status }}
            </div>
          </div>

          <!-- Additional Info -->
          <div class="additional-info">
            <div class="info-item">
              <i class="fas fa-shield-alt"></i>
              <span>Bảo hành chính hãng</span>
            </div>
            <div class="info-item">
              <i class="fas fa-truck"></i>
              <span>Giao hàng toàn quốc</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-else-if="loading" class="loading-container">
      <div class="spinner"></div>
      <p>Đang tải thông tin sản phẩm...</p>
    </div>
    <div v-else class="error-container">
      <i class="fas fa-exclamation-circle"></i>
      <p>Không tìm thấy sản phẩm hoặc có lỗi xảy ra!</p>
      <router-link to="/products" class="back-link">Quay lại danh sách sản phẩm</router-link>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';

export default {
  name: 'ProductDetailComponent',
  data() {
    return {
      quantity: 1,
      currentImage: null,
      defaultImage: require('@/assets/no-image.png'),
      loadingCart: false,
      showImageModal: false,
      error: null
    };
  },
  computed: {
    ...mapState({
      product: state => state.product.currentProduct,
      loading: state => state.product.loading,
      isAuthenticated: state => state.auth.isAuthenticated
    }),
    isOnSale() {
      return this.product?.originalPrice && this.product.originalPrice > this.product.price;
    },
    calculateDiscount() {
      if (!this.isOnSale) return 0;
      const discount = ((this.product.originalPrice - this.product.price) / this.product.originalPrice) * 100;
      return Math.round(discount);
    },
    productId() {
      return this.$route.params.id;
    }
  },
  methods: {
    ...mapActions({
      fetchProduct: 'product/fetchProduct'
    }),
    async loadProduct() {
      if (!this.productId) {
        this.error = 'ID sản phẩm không hợp lệ';
        return;
      }

      try {
        await this.fetchProduct(this.productId);
        if (!this.product) {
          this.error = 'Không tìm thấy sản phẩm';
        }
      } catch (error) {
        this.error = error.message || 'Có lỗi xảy ra khi tải sản phẩm';
      }
    },
    formatPrice(price) {
      return price?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") || "0";
    },
    formatSpecName(name) {
      return name
        .replace(/([A-Z])/g, ' $1')
        .replace(/^./, str => str.toUpperCase())
        .trim();
    },
    increaseQuantity() {
      if (this.quantity < this.product.stock) {
        this.quantity++;
      }
    },
    decreaseQuantity() {
      if (this.quantity > 1) {
        this.quantity--;
      }
    },
    validateQuantity() {
      if (this.quantity < 1) this.quantity = 1;
      if (this.quantity > this.product.stock) this.quantity = this.product.stock;
    },
    async addToCart() {
      if (!this.isAuthenticated) {
        this.$router.push('/login');
        return;
      }

      this.loadingCart = true;
      try {
        await this.$store.dispatch('cart/addToCart', {
          productId: this.product._id,
          quantity: this.quantity
        });
        this.$toast.success('Đã thêm vào giỏ hàng');
      } catch (error) {
        this.$toast.error('Không thể thêm vào giỏ hàng: ' + error.message);
      } finally {
        this.loadingCart = false;
      }
    },
    async buyNow() {
      if (!this.isAuthenticated) {
        this.$router.push('/login');
        return;
      }

      this.loadingCart = true;
      try {
        await this.$store.dispatch('cart/addToCart', {
          productId: this.product._id,
          quantity: this.quantity
        });
        this.$router.push('/checkout');
      } catch (error) {
        this.$toast.error('Không thể thực hiện: ' + error.message);
      } finally {
        this.loadingCart = false;
      }
    },
    handleImageError(event) {
      event.target.src = this.defaultImage;
    },
    openImageModal() {
      this.showImageModal = true;
    },
    closeImageModal() {
      this.showImageModal = false;
    },
    calculateDiscountedPrice(price, discount) {
      if (!discount) return price;
      return price * (1 - discount/100);
    }
  },
  watch: {
    product: {
      immediate: true,
      handler(newProduct) {
        if (newProduct?.images?.[0]) {
          this.currentImage = newProduct.images[0];
        }
      }
    }
  },
  created() {}
};
</script>

<style scoped>
.error-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 50vh;
  gap: 20px;
  color: #666;
}

.error-container i {
  font-size: 3rem;
  color: #e63946;
}

.error-container p {
  font-size: 1.2rem;
}

.back-link {
  color: #6c5ce7;
  text-decoration: none;
  font-weight: 500;
  padding: 10px 20px;
  border: 1px solid #6c5ce7;
  border-radius: 6px;
  transition: all 0.3s ease;
}

.back-link:hover {
  background: #6c5ce7;
  color: #fff;
}
.product-detail {
  padding: 40px 0;
  background: #f5f7fa;
  font-family: 'Inter', sans-serif;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.breadcrumb {
  margin-bottom: 20px;
  color: #666;
  font-size: 0.9rem;
}

.breadcrumb a {
  color: #6c5ce7;
  text-decoration: none;
}

.breadcrumb a:hover {
  text-decoration: underline;
}

.breadcrumb span {
  margin: 0 5px;
}

.product-layout {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;
  background: #fff;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.product-gallery {
  position: relative;
}

.main-image {
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  aspect-ratio: 1/1;
  position: relative;
  background: #f5f7fa;
}

.main-image img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  transition: transform 0.3s ease;
}

.main-image:hover img {
  transform: scale(1.05);
}

.zoom-icon {
  position: absolute;
  bottom: 15px;
  right: 15px;
  background: rgba(108, 92, 231, 0.8);
  color: #fff;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.main-image:hover .zoom-icon {
  opacity: 1;
}

.thumbnail-gallery {
  display: flex;
  gap: 10px;
  overflow-x: auto;
  padding: 10px 0;
}

.thumbnail {
  width: 80px;
  height: 80px;
  border-radius: 4px;
  overflow: hidden;
  cursor: pointer;
  border: 2px solid transparent;
  transition: all 0.3s ease;
}

.thumbnail:hover,
.thumbnail.active {
  border-color: #6c5ce7;
}

.thumbnail img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.product-info {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.product-title {
  font-size: 1.75rem;
  margin: 0;
  color: #1a1a2e;
  font-weight: 700;
  line-height: 1.3;
}

.product-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px;
}

.product-brand {
  margin: 0;
  color: #666;
  font-size: 0.95rem;
}

.product-brand span {
  font-weight: 500;
}

.rating {
  display: flex;
  align-items: center;
  gap: 5px;
}

.stars {
  color: #facc15;
  font-size: 0.9rem;
}

.review-count {
  color: #666;
  font-size: 0.85rem;
}

.product-price {
  display: flex;
  align-items: center;
  gap: 15px;
  flex-wrap: wrap;
}

.current-price {
  font-size: 1.75rem;
  font-weight: 700;
  color: #6c5ce7;
}

.original-price {
  font-size: 1.1rem;
  text-decoration: line-through;
  color: #999;
}

.discount-badge {
  background-color: #6c5ce7;
  color: #fff;
  font-size: 0.875rem;
  padding: 4px 10px;
  border-radius: 4px;
  font-weight: 500;
}

.product-status {
  display: flex;
  align-items: center;
  gap: 10px;
}

.status-label {
  font-weight: 500;
  color: #1a1a2e;
}

.status-value {
  padding: 4px 12px;
  border-radius: 4px;
  font-weight: 500;
  font-size: 0.9rem;
}

.status-value.inStock {
  background-color: #e6f7e6;
  color: #2ea52e;
}

.status-value.outOfStock {
  background-color: #ffe6e6;
  color: #e63946;
}

.product-actions {
  display: flex;
  gap: 15px;
  align-items: center;
  flex-wrap: wrap;
}

.quantity-selector {
  display: flex;
  align-items: center;
  border: 1px solid #ddd;
  border-radius: 6px;
  overflow: hidden;
}

.quantity-selector button {
  width: 40px;
  height: 40px;
  background-color: #f5f7fa;
  border: none;
  cursor: pointer;
  font-size: 1.25rem;
  color: #666;
  transition: background-color 0.3s ease;
}

.quantity-selector button:hover:not(:disabled) {
  background-color: #ddd;
}

.quantity-selector button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.quantity-selector input {
  width: 60px;
  height: 40px;
  text-align: center;
  border: none;
  border-left: 1px solid #ddd;
  border-right: 1px solid #ddd;
  color: #1a1a2e;
  font-size: 1rem;
}

.quantity-selector input::-webkit-outer-spin-button,
.quantity-selector input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

.add-to-cart-btn, .buy-now-btn {
  padding: 10px 25px;
  height: 40px;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-size: 0.95rem;
}

.add-to-cart-btn {
  background-color: #fff;
  color: #6c5ce7;
  border: 1px solid #6c5ce7;
}

.add-to-cart-btn:hover:not(:disabled) {
  background-color: #6c5ce7;
  color: #fff;
}

.buy-now-btn {
  background-color: #6c5ce7;
  color: #fff;
  border: 1px solid #6c5ce7;
}

.buy-now-btn:hover:not(:disabled) {
  background-color: #5a4ad1;
}

.add-to-cart-btn:disabled, .buy-now-btn:disabled {
  background-color: #f5f5f5;
  color: #999;
  border-color: #ddd;
  cursor: not-allowed;
}

.out-of-stock-message {
  padding: 15px;
  background: #ffe6e6;
  border-radius: 6px;
  color: #e63946;
  font-weight: 500;
}

.product-features, .product-description, .product-specifications {
  margin-top: 30px;
}

.product-features h3,
.product-description h3,
.product-specifications h3 {
  font-size: 1.25rem;
  margin-bottom: 15px;
  color: #1a1a2e;
  font-weight: 600;
}

.product-features ul {
  list-style: none;
  padding: 0;
  color: #666;
}

.product-features li {
  padding: 8px 0;
  border-bottom: 1px solid #eee;
  display: flex;
  align-items: center;
  gap: 10px;
}

.product-features li:before {
  content: "✓";
  color: #6c5ce7;
  font-weight: bold;
}

.description-content {
  line-height: 1.6;
  color: #666;
}

.product-specifications table {
  width: 100%;
  border-collapse: collapse;
}

.spec-name {
  width: 30%;
  padding: 12px;
  background-color: #f5f7fa;
  border-bottom: 1px solid #eee;
  font-weight: 500;
  color: #1a1a2e;
}

.spec-value {
  padding: 12px;
  border-bottom: 1px solid #eee;
  color: #666;
}

.image-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  position: relative;
  max-width: 90%;
  max-height: 90vh;
}

.modal-content img {
  width: 100%;
  height: auto;
  border-radius: 8px;
}

.close-modal {
  position: absolute;
  top: -15px;
  right: -15px;
  width: 30px;
  height: 30px;
  background: #fff;
  border: none;
  border-radius: 50%;
  font-size: 1.5rem;
  cursor: pointer;
  color: #666;
  display: flex;
  align-items: center;
  justify-content: center;
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 50vh;
  gap: 20px;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #6c5ce7;
  border-radius: 50%;
  animation: spin  '@/components/product/ProductDetailComponent.vue'1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.loading-container p {
  color: #666;
  font-size: 1.1rem;
}

/* Responsive design */
@media (max-width: 992px) {
  .product-layout {
    grid-template-columns: 1fr;
    gap: 30px;
  }
}

@media (max-width: 768px) {
  .product-title {
    font-size: 1.5rem;
  }

  .current-price {
    font-size: 1.5rem;
  }

  .product-actions {
    flex-direction: column;
    gap: 10px;
  }

  .add-to-cart-btn, .buy-now-btn {
    width: 100%;
  }

  .thumbnail {
    width: 60px;
    height: 60px;
  }
}

@media (max-width: 480px) {
  .product-title {
    font-size: 1.25rem;
  }

  .current-price {
    font-size: 1.25rem;
  }

  .thumbnail {
    width: 50px;
    height: 50px;
  }

  .product-meta {
    flex-direction: column;
    align-items: flex-start;
  }
}

/* Thêm style cho status badge */
.status-badge {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.9rem;
  font-weight: 500;
}

.in-stock {
  background-color: #e6f7e6;
  color: #2ea52e;
}

.out-of-stock {
  background-color: #ffe6e6;
  color: #e63946;
}
</style>