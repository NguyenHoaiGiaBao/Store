<template>
  <div class="product-list-container">
    <!-- Filter Section -->
    <div class="filter-section">
      <div class="filter-header">
        <h2 class="filter-title">
          <i class="bi bi-sliders"></i>
          BỘ LỌC <span>SẢN PHẨM</span>
        </h2>
        <button @click="resetFilters" class="reset-btn" v-if="isFiltered">
          <i class="bi bi-arrow-counterclockwise"></i>
          Xóa bộ lọc
        </button>
      </div>

      <div class="filters-wrapper">
        <!-- Filter chips for active filters -->
        <div class="active-filters" v-if="isFiltered">
          <div v-if="filters.brand" class="filter-chip">
            <span>Thương hiệu: {{ filters.brand }}</span>
            <button @click="filters.brand = ''" class="chip-close">×</button>
          </div>
          <div v-if="filters.priceRange" class="filter-chip">
            <span>{{ getPriceRangeText(filters.priceRange) }}</span>
            <button @click="filters.priceRange = ''" class="chip-close">×</button>
          </div>
          <div v-if="filters.status" class="filter-chip">
            <span>{{ filters.status === 'inStock' ? 'Còn hàng' : 'Hết hàng' }}</span>
            <button @click="filters.status = ''" class="chip-close">×</button>
          </div>
        </div>

        <div class="filter-groups">
          <div class="filter-group">
            <label for="brand">Thương hiệu:</label>
            <div class="select-wrapper">
              <select id="brand" v-model="filters.brand" @change="applyFilters">
                <option value="">Tất cả thương hiệu</option>
                <option v-for="brand in brands" :key="brand" :value="brand">{{ brand }}</option>
              </select>
              <div class="select-arrow"></div>
            </div>
          </div>

          <div class="filter-group">
            <label for="price">Khoảng giá:</label>
            <div class="select-wrapper">
              <select id="price" v-model="filters.priceRange" @change="applyFilters">
                <option value="">Tất cả giá</option>
                <option value="0-5000000">Dưới 5 triệu</option>
                <option value="5000000-10000000">5 triệu - 10 triệu</option>
                <option value="10000000-20000000">10 triệu - 20 triệu</option>
                <option value="20000000">Trên 20 triệu</option>
              </select>
              <div class="select-arrow"></div>
            </div>
          </div>

          <div class="filter-group">
            <label for="status">Trạng thái:</label>
            <div class="select-wrapper">
              <select id="status" v-model="filters.status" @change="applyFilters">
                <option value="">Tất cả trạng thái</option>
                <option value="inStock">Còn hàng</option>
                <option value="outOfStock">Hết hàng</option>
              </select>
              <div class="select-arrow"></div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Decorative elements -->
    <div class="decoration-item decoration-blob blob-1"></div>
    <div class="decoration-item decoration-blob blob-2"></div>
    <div class="decoration-item decoration-ring ring-1"></div>
    <div class="decoration-item decoration-ring ring-2"></div>
    <div class="decoration-item decoration-dots dots-1"></div>
    <div class="decoration-item decoration-dots dots-2"></div>

    <!-- Product List Section -->
    <div class="product-list-section">
      <div class="product-header">
        <div class="header-left">
          <h3 class="section-title">
            <i class="bi bi-laptop"></i>
            SẢN PHẨM CÔNG NGHỆ
          </h3>
          <span class="found-count">Tìm thấy <strong>{{ filteredProducts.length }}</strong> sản phẩm</span>
        </div>
        
        <div class="sorting-controls">
          <label for="sort">Sắp xếp:</label>
          <div class="select-wrapper sort-select">
            <select id="sort" v-model="sortOption" @change="applySort">
              <option value="default">Mặc định</option>
              <option value="price-asc">Giá: Thấp đến cao</option>
              <option value="price-desc">Giá: Cao đến thấp</option>
              <option value="name-asc">Tên: A-Z</option>
              <option value="name-desc">Tên: Z-A</option>
            </select>
            <div class="select-arrow"></div>
          </div>
          
          <div class="view-toggle">
            <button 
              class="toggle-btn" 
              :class="{ active: viewMode === 'grid' }" 
              @click="viewMode = 'grid'"
            >
              <i class="bi bi-grid-3x3-gap"></i>
            </button>
            <button 
              class="toggle-btn" 
              :class="{ active: viewMode === 'list' }" 
              @click="viewMode = 'list'"
            >
              <i class="bi bi-list-ul"></i>
            </button>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="loading-state">
        <div class="spinner"></div>
        <p>Đang tải danh sách sản phẩm...</p>
      </div>

      <!-- Empty State -->
      <div v-else-if="filteredProducts.length === 0" class="empty-state">
        <i class="bi bi-exclamation-circle empty-icon"></i>
        <h4>Không tìm thấy sản phẩm</h4>
        <p>Thử thay đổi bộ lọc của bạn</p>
        <button class="reset-search-btn" @click="resetFilters">
          <i class="bi bi-arrow-counterclockwise"></i> Xóa tất cả bộ lọc
        </button>
      </div>

      <!-- Product Grid -->
      <transition-group 
        name="product-transition"
        tag="div"
        :class="viewMode === 'grid' ? 'product-grid' : 'product-list'"
      >
        <product-card
          v-for="product in sortedProducts"
          :key="product._id"
          :product="product"
          :class="{'list-view': viewMode === 'list'}"
        />
      </transition-group>

      <!-- Load more button -->
      <div class="load-more-container" v-if="filteredProducts.length > visibleCount && !loading">
        <button class="load-more-btn" @click="loadMore">
          <i class="bi bi-arrow-down-circle"></i>
          Xem thêm sản phẩm
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import ProductCard from './ProductCard.vue';

export default {
  components: { ProductCard },
  data() {
    return {
      filters: {
        brand: '',
        priceRange: '',
        status: '',
      },
      visibleCount: 12,
      sortOption: 'default',
      viewMode: 'grid',
    };
  },
  computed: {
    ...mapState({
      products: state => state.product.products,
      loading: state => state.product.loading,
    }),
    brands() {
      return [...new Set(this.products.map(product => product.brand))].sort();
    },
    filteredProducts() {
      let result = [...this.products];

      if (this.filters.brand) {
        result = result.filter(product => product.brand === this.filters.brand);
      }

      if (this.filters.priceRange) {
        const [min, max] = this.filters.priceRange.split('-').map(Number);
        result = result.filter(product => {
          if (max) {
            return product.price >= min && product.price <= max;
          }
          return product.price >= min;
        });
      }

      if (this.filters.status) {
        result = result.filter(product => product.status === this.filters.status);
      }

      return result;
    },
    sortedProducts() {
      let products = [...this.filteredProducts];
      
      switch (this.sortOption) {
        case 'price-asc':
          products.sort((a, b) => a.price - b.price);
          break;
        case 'price-desc':
          products.sort((a, b) => b.price - a.price);
          break;
        case 'name-asc':
          products.sort((a, b) => a.name.localeCompare(b.name));
          break;
        case 'name-desc':
          products.sort((a, b) => b.name.localeCompare(a.name));
          break;
        default:
          break; // Giữ nguyên thứ tự mặc định
      }
      
      return products.slice(0, this.visibleCount);
    },
    isFiltered() {
      return this.filters.brand || this.filters.priceRange || this.filters.status;
    }
  },
  methods: {
    ...mapActions({
      fetchProducts: 'product/fetchProducts'
    }),
    async loadProducts() {
      try {
        await this.fetchProducts();
      } catch (error) {
        console.error('Error loading products:', error);
      }
    },
    applyFilters() {
      this.visibleCount = 12; // Reset số lượng sản phẩm hiển thị khi lọc
    },
    applySort() {
      this.visibleCount = 12; // Reset số lượng sản phẩm hiển thị khi sắp xếp
    },
    resetFilters() {
      this.filters = {
        brand: '',
        priceRange: '',
        status: '',
      };
      this.sortOption = 'default';
      this.visibleCount = 12;
    },
    loadMore() {
      this.visibleCount += 8;
    },
    getPriceRangeText(range) {
      const options = {
        '0-5000000': 'Dưới 5 triệu',
        '5000000-10000000': '5 triệu - 10 triệu',
        '10000000-20000000': '10 triệu - 20 triệu',
        '20000000': 'Trên 20 triệu'
      };
      return options[range] || '';
    }
  },
  created() {
    this.loadProducts();
  }
};
</script>
<style scoped>
/* Base Styles */
.product-list-container {
  font-family: 'Inter', sans-serif;
  background: #f5f7fa;
  color: #1a1a2e;
  padding: 2rem;
  position: relative;
  border-radius: 12px;
  min-height: 500px;
}

/* Filter Section */
.filter-section {
  background: #fff;
  border-radius: 12px;
  padding: 1.8rem;
  margin-bottom: 2rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  position: relative;
  z-index: 10;
  border: 1px solid #eee;
}

.filter-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.filter-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1a1a2e;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 10px;
}

.filter-title i {
  color: #6c5ce7;
  font-size: 1.2rem;
}

.filter-title span {
  color: #6c5ce7;
}

.reset-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  background: #f5f7fa;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  color: #666;
  cursor: pointer;
  transition: all 0.2s ease;
}

.reset-btn:hover {
  background: #6c5ce7;
  color: #fff;
}

.reset-btn i {
  font-size: 0.9rem;
}

.filters-wrapper {
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
}

.active-filters {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 1rem;
}

.filter-chip {
  display: flex;
  align-items: center;
  gap: 6px;
  background: #6c5ce7;
  border: 1px solid #5a4ad1;
  border-radius: 20px;
  padding: 0.4rem 0.8rem;
  font-size: 0.875rem;
  color: #fff;
}

.chip-close {
  background: none;
  border: none;
  color: #fff;
  font-size: 1.2rem;
  line-height: 0.8;
  cursor: pointer;
  padding: 0;
  margin-left: 4px;
}

.chip-close:hover {
  color: #ddd;
}

.filter-groups {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1.2rem;
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.filter-group label {
  font-size: 0.875rem;
  font-weight: 600;
  color: #1a1a2e;
}

.select-wrapper {
  position: relative;
}

.select-wrapper select {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  background: #fff;
  appearance: none;
  font-family: inherit;
  font-size: 0.95rem;
  color: #1a1a2e;
  cursor: pointer;
  transition: all 0.3s ease;
}

.select-wrapper select:focus {
  border-color: #6c5ce7;
  box-shadow: 0 0 0 3px rgba(108, 92, 231, 0.1);
  outline: none;
}

.select-arrow {
  position: absolute;
  right: 15px;
  top: 50%;
  transform: translateY(-50%);
  width: 0;
  height: 0;
  border-left: 5px solid transparent;
  border-right: 5px solid transparent;
  border-top: 5px solid #666;
  pointer-events: none;
}

/* Product List Section */
.product-list-section {
  background: #fff;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  position: relative;
  z-index: 5;
  border: 1px solid #eee;
}

.product-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #eee;
}

.header-left {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.section-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1a1a2e;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 10px;
}

.section-title i {
  color: #6c5ce7;
  font-size: 1.2rem;
}

.found-count {
  color: #666;
  font-size: 0.925rem;
}

.found-count strong {
  color: #6c5ce7;
  font-weight: 700;
}

.sorting-controls {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.sorting-controls label {
  font-size: 0.875rem;
  font-weight: 600;
  color: #1a1a2e;
}

.sort-select {
  width: 180px;
}

.view-toggle {
  display: flex;
  border: 1px solid #ddd;
  border-radius: 8px;
  overflow: hidden;
}

.toggle-btn {
  background: #f5f7fa;
  border: none;
  padding: 0.5rem 0.8rem;
  cursor: pointer;
  color: #666;
  transition: all 0.2s ease;
}

.toggle-btn.active {
  background: #6c5ce7;
  color: #fff;
}

.toggle-btn:hover:not(.active) {
  background: #ddd;
  color: #1a1a2e;
}

/* Product Grid */
.product-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-top: 1rem;
}

.product-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 1rem;
}

.list-view {
  width: 100%;
  display: grid;
  grid-template-columns: 200px 1fr auto;
  gap: 1rem;
}

/* Loading State */
.loading-state {
  text-align: center;
  padding: 4rem 0;
}

.spinner {
  width: 50px;
  height: 50px;
  border: 4px solid rgba(108, 92, 231, 0.1);
  border-top: 4px solid #6c5ce7;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 1.5rem;
}

.loading-state p {
  color: #666;
  font-size: 1rem;
  font-weight: 500;
}

/* Empty State */
.empty-state {
  text-align: center;
  padding: 4rem 0;
  color: #666;
}

.empty-state .empty-icon {
  font-size: 3.5rem;
  color: #ddd;
  margin-bottom: 1.5rem;
}

.empty-state h4 {
  font-size: 1.25rem;
  margin-bottom: 0.8rem;
  color: #1a1a2e;
  font-weight: 600;
}

.empty-state p {
  font-size: 1rem;
  color: #666;
  max-width: 350px;
  margin: 0 auto 1.5rem;
  line-height: 1.5;
}

.reset-search-btn {
  background: #6c5ce7;
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 0.75rem 1.5rem;
  font-size: 0.95rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin: 0 auto;
}

.reset-search-btn:hover {
  background: #5a4ad1;
  transform: translateY(-2px);
}

.reset-search-btn i {
  font-size: 1rem;
}

/* Load More Button */
.load-more-container {
  text-align: center;
  margin-top: 2.5rem;
}

.load-more-btn {
  background: transparent;
  color: #6c5ce7;
  border: 2px solid #6c5ce7;
  border-radius: 8px;
  padding: 0.75rem 2rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}

.load-more-btn:hover {
  background: #6c5ce7;
  color: #fff;
  transform: translateY(-2px);
}

.load-more-btn i {
  font-size: 1rem;
}

/* Decorative Elements */
.decoration-item {
  position: absolute;
  z-index: 1;
  opacity: 0.3;
  pointer-events: none;
}

.decoration-blob {
  width: 300px;
  height: 300px;
  border-radius: 30% 70% 70% 30% / 30% 30% 70% 70%;
  filter: blur(40px);
}

.blob-1 {
  background: rgba(108, 92, 231, 0.2);
  top: -150px;
  right: -100px;
  transform: rotate(-45deg);
  animation: morphBlob 15s ease-in-out infinite alternate;
}

.blob-2 {
  background: rgba(108, 92, 231, 0.3);
  bottom: -150px;
  left: -100px;
  transform: rotate(45deg);
  animation: morphBlob 18s ease-in-out infinite alternate-reverse;
}

.decoration-ring {
  border-radius: 50%;
  border-style: solid;
  border-width: 20px;
  transform: rotate(-20deg);
}

.ring-1 {
  width: 150px;
  height: 150px;
  border-color: rgba(108, 92, 231, 0.1);
  top: 15%;
  left: -50px;
  animation: float 18s ease-in-out infinite;
}

.ring-2 {
  width: 100px;
  height: 100px;
  border-color: rgba(108, 92, 231, 0.2);
  bottom: 20%;
  right: -30px;
  animation: float 15s ease-in-out infinite reverse;
}

.decoration-dots {
  background-image: radial-gradient(rgba(108, 92, 231, 0.3) 2px, transparent 2px);
  background-size: 25px 25px;
  border-radius: 30px;
}

.dots-1 {
  width: 150px;
  height: 150px;
  top: 40%;
  right: 5%;
  animation: float 20s ease-in-out infinite;
}

.dots-2 {
  width: 150px;
  height: 150px;
  top: 70%;
  left: 5%;
  animation: float 25s ease-in-out infinite reverse;
}

/* Animations */
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

@keyframes float {
  0%, 100% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(-20px) rotate(5deg); }
}

@keyframes morphBlob {
  0% { border-radius: 30% 70% 70% 30% / 30% 30% 70% 70%; }
  25% { border-radius: 58% 42% 75% 25% / 76% 46% 54% 24%; }
  50% { border-radius: 50% 50% 33% 67% / 55% 27% 73% 45%; }
  75% { border-radius: 33% 67% 58% 42% / 63% 68% 32% 37%; }
  100% { border-radius: 30% 70% 70% 30% / 30% 30% 70% 70%; }
}

/* Product Transition Animation */
.product-transition-move {
  transition: all 0.6s ease;
}

.product-transition-enter-active {
  transition: all 0.6s ease-out;
}

.product-transition-leave-active {
  transition: all 0.6s ease-in;
  position: absolute;
  z-index: 0;
}

.product-transition-enter-from,
.product-transition-leave-to {
  opacity: 0;
  transform: translateY(30px);
}

/* Responsive Design */
@media (max-width: 992px) {
  .product-list-container {
    padding: 1.5rem;
  }
  
  .filter-groups {
    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
    gap: 1rem;
  }
  
  .product-grid {
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  }
}

@media (max-width: 768px) {
  .product-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
  
  .sorting-controls {
    width: 100%;
    justify-content: space-between;
  }
  
  .filter-groups {
    grid-template-columns: 1fr;
  }
  
  .filter-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
  
  .reset-btn {
    align-self: flex-start;
  }
  
  .decoration-item {
    opacity: 0.2;
  }
}

@media (max-width: 576px) {
  .product-list-container {
    padding: 1rem;
  }
  
  .product-list-section, 
  .filter-section {
    padding: 1.2rem;
  }
  
  .product-grid {
    grid-template-columns: 1fr;
  }
  
  .section-title, 
  .filter-title {
    font-size: 1.25rem;
  }
  
  .sorting-controls {
    flex-wrap: wrap;
    gap: 0.75rem;
  }
  
  .sort-select {
    width: 100%;
  }
  
  .view-toggle {
    margin-left: auto;
  }
  
  .list-view {
    grid-template-columns: 1fr;
  }
  
  .decoration-item {
    display: none;
  }

  .found-count {
    font-size: 0.875rem;
  }

  .empty-state {
    padding: 2rem 0;
  }

  .empty-state .empty-icon {
    font-size: 2.5rem;
  }

  .empty-state h4 {
    font-size: 1.1rem;
  }

  .empty-state p {
    font-size: 0.9rem;
  }

  .load-more-btn {
    width: 100%;
    justify-content: center;
  }
}
</style>