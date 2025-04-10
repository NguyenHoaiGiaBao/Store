<template>
  <div id="app">
    <header-component />
    <router-view />
    <footer-component />
  </div>
</template>

<script>
import Header from '@/components/common/Header.vue';
import Footer from '@/components/common/Footer.vue';

export default {
  components: {
    'header-component': Header,
    'footer-component': Footer,
  },
};
</script>

<style>
#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}
</style>