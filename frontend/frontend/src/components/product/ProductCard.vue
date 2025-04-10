<template>
  <div class="product-card" :class="{ 'out-of-stock': product.status === 'outOfStock' }">
    <div class="product-badges">
      <span v-if="isOnSale" class="badge sale-badge"><i class="fas fa-tag"></i> Giảm giá</span>
      <span v-if="product.isNew" class="badge new-badge"><i class="fas fa-star"></i> Mới</span>
      <span v-if="product.status === 'outOfStock'" class="badge out-of-stock-badge"><i class="fas fa-ban"></i> Hết hàng</span>
    </div>
    
    <router-link :to="`/product/${product._id}`" class="product-link">
      <div class="product-image-container">
        <img :src="product.images[0] || defaultImage" :alt="product.name" class="product-image">
        <div class="hover-overlay">
          <span class="view-details"><i class="fas fa-eye"></i> Xem chi tiết</span>
        </div>
      </div>
      
      <div class="product-info">
        <p class="product-brand"><i class="fas fa-building"></i> {{ product.brand }}</p>
        <h3 class="product-name">{{ product.name }}</h3>
        
        <div class="price-section">
          <div class="price-container">
            <span class="price"><i class="fas fa-coins"></i> {{ formatPrice(product.price) }}₫</span>
            <span v-if="isOnSale" class="original-price">
              {{ formatPrice(product.originalPrice) }}₫
            </span>
          </div>
          <div v-if="isOnSale" class="discount-tag">
            <i class="fas fa-percentage"></i> -{{ calculateDiscount }}%
          </div>
        </div>
        
        <div class="rating" v-if="product.rating">
          <div class="stars">
            <i v-for="n in 5" :key="n" class="fas" :class="n <= Math.round(product.rating) ? 'fa-star' : 'fa-star-o'"></i>
          </div>
          <span class="review-count" v-if="product.reviewCount">({{ product.reviewCount }})</span>
        </div>
      </div>
    </router-link>
    
    <div class="action-buttons">
      <button 
        class="add-to-cart-btn" 
        @click.stop="addToCart"
        :disabled="!isAuthenticated || product.status === 'outOfStock'"
      >
        <i class="fas fa-shopping-cart"></i>
        <span>Thêm vào giỏ</span>
      </button>
    </div>
  </div>
</template>
<script>
export default {
  name: 'ProductCard',
  props: {
    product: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      defaultImage: require('@/assets/no-image.png'),
      isInWishlist: false
    }
  },
  computed: {
    isAuthenticated() {
      return this.$store.getters['auth/isAuthenticated'];
    },
    isOnSale() {
      return this.product.originalPrice && this.product.originalPrice > this.product.price;
    },
    calculateDiscount() {
      if (!this.isOnSale) return 0;
      const discount = ((this.product.originalPrice - this.product.price) / this.product.originalPrice) * 100;
      return Math.round(discount);
    }
  },
  methods: {
    formatPrice(price) {
      return price?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") || "0";
    },
    async addToCart() {
      if (!this.isAuthenticated) {
        this.$router.push('/login');
        return;
      }
      
      const item = {
        productId: this.product._id,
        quantity: 1
      };
      
      try {
        await this.$store.dispatch('cart/addToCart', item);
        this.$toast.success('Đã thêm vào giỏ hàng');
      } catch (error) {
        this.$toast.error('Không thể thêm vào giỏ hàng: ' + error.message);
      }
    },
    toggleWishlist() {
      if (!this.isAuthenticated) {
        this.$router.push('/login');
        return;
      }
      
      this.isInWishlist = !this.isInWishlist;
      this.$toast.success(this.isInWishlist ? 'Đã thêm vào danh sách yêu thích' : 'Đã xóa khỏi danh sách yêu thích');
    }
  }
}
</script>
<style scoped>
.product-card {
  background: #fff;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  position: relative;
  height: 100%;
  font-family: 'Inter', sans-serif;
}

.product-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
}

.product-badges {
  position: absolute;
  top: 10px;
  left: 10px;
  z-index: 2;
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.badge {
  padding: 5px 10px;
  border-radius: 4px;
  font-size: 0.7rem;
  font-weight: 600;
  text-transform: uppercase;
  display: flex;
  align-items: center;
  gap: 4px;
}

.sale-badge {
  background-color: #6c5ce7;
  color: #fff;
}

.new-badge {
  background-color: #00c853;
  color: #fff;
}

.out-of-stock-badge {
  background-color: #e63946;
  color: #fff;
}

.product-image-container {
  aspect-ratio: 1 / 1;


  overflow: hidden;
  position: relative;
  background: #f5f7fa;
}

.product-image {
  width: 100%;
  height: 100%;
  object-fit: contain;
  transition: transform 0.5s ease;
}

.hover-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.view-details {
  background: #6c5ce7;
  color: #fff;
  padding: 8px 16px;
  border-radius: 4px;
  font-weight: 500;
  transform: translateY(20px);
  transition: transform 0.3s ease;
  display: flex;
  align-items: center;
  gap: 6px;
}

.product-card:hover .hover-overlay {
  opacity: 1;
}

.product-card:hover .view-details {
  transform: translateY(0);
}

.product-card:hover .product-image {
  transform: scale(1.05);
}

.product-link {
  text-decoration: none;
  color: inherit;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
}

.product-info {
  padding: 1.2rem;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
}

.product-brand {
  color: #666;
  font-size: 0.8rem;
  font-weight: 500;
  text-transform: uppercase;
  margin: 0 0 0.2rem;
  display: flex;
  align-items: center;
  gap: 4px;
}

.product-name {
  font-size: 1rem;
  margin: 0 0 0.8rem;
  color: #1a1a2e;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  font-weight: 600;
}

.price-section {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.8rem;
}

.price-container {
  display: flex;
  flex-direction: column;
}

.price {
  font-weight: 700;
  color: #6c5ce7;
  font-size: 1.1rem;
  display: flex;
  align-items: center;
  gap: 4px;
}

.original-price {
  color: #999;
  text-decoration: line-through;
  font-size: 0.85rem;
}

.discount-tag {
  background: #f5f7fa;
  color: #6c5ce7;
  padding: 3px 6px;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 4px;
}

.rating {
  display: flex;
  align-items: center;
  margin-top: auto;
}

.stars {
  color: #facc15;
  font-size: 0.9rem;
}

.review-count {
  margin-left: 5px;
  color: #666;
  font-size: 0.8rem;
}

.action-buttons {
  padding: 0.8rem;
  display: flex;
  gap: 10px;
}

.add-to-cart-btn {
  flex: 1;
  padding: 0.75rem 1rem;
  background: #6c5ce7;
  color: #fff;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
  text-transform: uppercase;
  font-size: 0.85rem;
  letter-spacing: 0.5px;
}

.add-to-cart-btn:hover {
  background: #5a4ad1;
  box-shadow: 0 5px 15px rgba(108, 92, 231, 0.3);
}

.add-to-cart-btn:disabled {
  background: #ddd;
  color: #999;
  cursor: not-allowed;
  box-shadow: none;
}

.add-to-cart-btn i {
  font-size: 1rem;
}

.out-of-stock .product-image-container::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.3);
}

@media (max-width: 768px) {
  .product-name {
    font-size: 0.9rem;
  }
  
  .price {
    font-size: 1rem;
  }
  
  .add-to-cart-btn span {
    display: none;
  }
  
  .add-to-cart-btn i {
    margin: 0;
  }
}
</style>