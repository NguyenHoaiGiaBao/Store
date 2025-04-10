<template>
  <div class="home-view">
    <div class="background-image"></div>
    <Home />
  </div>
</template>

<script>
import Home from './Home.vue';

export default {
  name: 'HomeView',
  components: {
    Home
  }
}
</script>

<style scoped>
.home-view {
  position: relative;
  min-height: 100vh;
  width: 100%;
}

.background-image {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  background-image: url('https://studiovietnam.com/wp-content/uploads/2020/10/chup-anh-cac-san-pham-cong-nghe-1.jpg');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  filter: brightness(0.8) saturate(1.3);
  z-index: -1;
}
</style>