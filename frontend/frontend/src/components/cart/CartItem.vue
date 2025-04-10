<template>
  <div class="tech-cart-item" v-if="item?.product">
    <div class="tech-item-left">
      <div class="tech-item-image">
        <img 
          :src="getProductImage" 
          :alt="item.product.name || 'Product image'"
        >
      </div>
      
      <div class="tech-item-controls">
        <button class="tech-btn tech-btn-icon" @click="updateQuantity(item.quantity - 1)" :disabled="item.quantity <= 1">
          <i class="fas fa-minus"></i>
        </button>
        <span class="tech-quantity">{{ item.quantity }}</span>
        <button class="tech-btn tech-btn-icon" @click="updateQuantity(item.quantity + 1)">
          <i class="fas fa-plus"></i>
        </button>
      </div>
    </div>
    
    <div class="tech-item-info">
      <div class="tech-item-header">
        <div class="tech-item-name-section">
          <h3 class="tech-item-name">{{ item.product.name }}</h3>
          <span v-if="item.product.brand" class="tech-item-brand">{{ item.product.brand }}</span>
        </div>
        <div class="tech-item-pricing">
          <span class="tech-price-current">{{ formatPrice(item.product.price) }}₫</span>
          <span v-if="item.product.originalPrice" class="tech-price-original">{{ formatPrice(item.product.originalPrice) }}₫</span>
        </div>
      </div>
      
      <div class="tech-item-details">
        <div class="tech-quick-info">
          <span v-if="item.product.rating" class="tech-rating">
            <i class="fas fa-star"></i>
            <span>{{ item.product.rating }}</span>
          </span>
          <span v-if="item.product.stock" class="tech-stock" :class="getStockClass(item.product.stock)">
            {{ getStockLabel(item.product.stock) }}
          </span>
        </div>
        
        <div class="tech-actions">
          <div class="tech-subtotal">
            <span class="tech-subtotal-label">Tổng:</span>
            <span class="tech-subtotal-value">{{ formatPrice(item.product.price * item.quantity) }}₫</span>
          </div>
          <button class="tech-btn tech-btn-remove" @click="$emit('remove', item.product._id)">
            <i class="fas fa-trash"></i>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    item: Object,
    defaultImage: {
      type: String,
      default: '/images/default-product.png'
    }
  },
  computed: {
    getProductImage() {
      return this.item?.product?.images?.[0] || this.defaultImage;
    }
  },
  methods: {
    formatPrice(price) {
      return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    },
    updateQuantity(quantity) {
      if (quantity < 1 || !this.item?.product?._id) return;
      this.$emit('update', { productId: this.item.product._id, quantity });
    },
    getStockClass(stock) {
      if (stock > 10) return 'tech-in-stock';
      if (stock > 0) return 'tech-low-stock';
      return 'tech-out-stock';
    },
    getStockLabel(stock) {
      if (stock > 10) return 'Còn hàng';
      if (stock > 0) return 'Sắp hết hàng';
      return 'Hết hàng';
    }
  }
};
</script>

<style scoped>
.tech-cart-item {
  display: flex;
  margin-bottom: 16px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  overflow: hidden;
  font-family: 'Inter', sans-serif;
  transition: transform 0.2s ease;
}

.tech-cart-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.tech-item-left {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 140px;
  padding: 16px;
  border-right: 1px solid #eee;
  background: #f5f7fa;
}

.tech-item-image {
  width: 100%;
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
}

.tech-item-image img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}

.tech-item-controls {
  display: flex;
  align-items: center;
  border-radius: 4px;
  overflow: hidden;
  background: #fff;
  border: 1px solid #ddd;
}

.tech-btn {
  border: none;
  background: none;
  cursor: pointer;
  padding: 8px;
  transition: all 0.2s ease;
}

.tech-btn-icon {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  color: #666;
}

.tech-btn-icon:hover:not(:disabled) {
  background: #6c5ce7;
  color: #fff;
}

.tech-btn-icon:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.tech-quantity {
  min-width: 30px;
  text-align: center;
  font-weight: 500;
  color: #1a1a2e;
}

.tech-item-info {
  flex: 1;
  padding: 16px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.tech-item-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 12px;
}

.tech-item-name-section {
  flex: 1;
  padding-right: 16px;
}

.tech-item-name {
  margin: 0 0 4px 0;
  font-family: 'Inter', sans-serif;
  font-size: 16px;
  font-weight: 600;
  color: #1a1a2e;
  line-height: 1.3;
}

.tech-item-brand {
  font-size: 13px;
  color: #666;
  display: block;
  margin-top: 4px;
}

.tech-item-pricing {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.tech-price-current {
  font-family: 'Inter', sans-serif;
  font-size: 16px;
  font-weight: 700;
  color: #6c5ce7;
}

.tech-price-original {
  font-size: 13px;
  color: #999;
  text-decoration: line-through;
  margin-top: 2px;
}

.tech-item-details {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
}

.tech-quick-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.tech-rating {
  display: flex;
  align-items: center;
  gap: 4px;
  color: #666;
  font-size: 13px;
}

.tech-rating i {
  color: #facc15;
}

.tech-stock {
  font-size: 13px;
  font-weight: 500;
  padding: 3px 8px;
  border-radius: 4px;
}

.tech-in-stock {
  background: #e6f7e6;
  color: #2ea52e;
}

.tech-low-stock {
  background: #fff8e1;
  color: #ff8f00;
}

.tech-out-stock {
  background: #ffebee;
  color: #e63946;
}

.tech-actions {
  display: flex;
  align-items: center;
  gap: 16px;
}

.tech-subtotal {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.tech-subtotal-label {
  font-size: 12px;
  color: #666;
}

.tech-subtotal-value {
  font-family: 'Inter', sans-serif;
  font-size: 16px;
  font-weight: 700;
  color: #1a1a2e;
}

.tech-btn-remove {
  width: 36px;
  height: 36px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f5f7fa;
  color: #666;
  font-size: 14px;
  transition: all 0.2s ease;
  border: 1px solid #ddd;
}

.tech-btn-remove:hover {
  background: #e63946;
  color: #fff;
  border-color: #e63946;
}

@media (max-width: 768px) {
  .tech-cart-item {
    flex-direction: column;
  }
  
  .tech-item-left {
    width: 100%;
    flex-direction: row;
    border-right: none;
    border-bottom: 1px solid #eee;
    padding: 12px;
  }
  
  .tech-item-image {
    width: 80px;
    height: 80px;
    margin-bottom: 0;
    margin-right: 16px;
  }
  
  .tech-item-header {
    flex-direction: column;
  }
  
  .tech-item-pricing {
    align-items: flex-start;
    margin-top: 8px;
    flex-direction: row;
    gap: 8px;
  }
  
  .tech-item-details {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
  
  .tech-actions {
    width: 100%;
    justify-content: space-between;
  }
}
</style>