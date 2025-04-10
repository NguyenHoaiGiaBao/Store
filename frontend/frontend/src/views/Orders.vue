<template>
  <div class="orders">
    <h1>Đơn hàng của bạn</h1>
    <order-list />
  </div>
</template>
<script>
import OrderList from '@/components/order/OrderList.vue';

export default {
  components: { OrderList },
};
</script>
<style scoped>
.orders {
  padding: 40px 20px;
  background: #f5f7fa;
  font-family: 'Inter', sans-serif;
}

.orders h1 {
  font-size: 2rem;
  color: #1a1a2e;
  margin-bottom: 2rem;
  font-weight: 700;
  text-align: center;
}

@media (max-width: 768px) {
  .orders {
    padding: 20px;
  }

  .orders h1 {
    font-size: 1.5rem;
  }
}
</style>