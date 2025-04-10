<template>
  <div>
    <h1>Add Product</h1>
    <form @submit.prevent="addProduct">
      <div>
        <label for="name">Product Name:</label>
        <input type="text" v-model="product.name" required />
      </div>
      <div>
        <label for="price">Price:</label>
        <input type="number" v-model="product.price" required />
      </div>
      <div>
        <label for="description">Description:</label>
        <textarea v-model="product.description" required></textarea>
      </div>
      <button type="submit">Add Product</button>
    </form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      product: {
        name: '',
        price: '',
        description: ''
      }
    };
  },
  methods: {
    addProduct() {
      // Logic to add the product (e.g., API call)
      console.log('Product added:', this.product);
    }
  }
};
</script>

<style scoped>
/* Add styles here */
</style>
