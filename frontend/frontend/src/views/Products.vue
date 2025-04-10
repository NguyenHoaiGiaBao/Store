<template>
  <div class="products">
    <product-list />
  </div>
</template>

<script>
import ProductList from '@/components/product/ProductList.vue';
import { mapActions } from 'vuex';

export default {
  components: { ProductList },
  methods: {
    ...mapActions({
      fetchProducts: 'product/fetchProducts'
      
    })
  },
  async created() {
    try {
      await this.fetchProducts();
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  }
};
</script>

<style scoped>
.products {
  padding: 40px 20px;
  background-color: #f5f7fa;
  font-family: 'Inter', sans-serif;
}

.fade-in {
  animation: fadeIn 1s ease-in;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
</style>