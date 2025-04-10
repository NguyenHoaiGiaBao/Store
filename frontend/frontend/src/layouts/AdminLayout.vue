<template>
  <div class="admin-layout">
    <Sidebar />
    <div class="admin-content">
      <Header />
      <router-view />
    </div>
  </div>
</template>

<script>
import Sidebar from '@/components/admin/Sidebar.vue';
import Header from '@/components/admin/Header.vue';

export default {
  components: { Sidebar, Header },
};
</script>

<style scoped>
.admin-layout {
  display: flex;
}
.admin-content {
  flex: 1;
  display: flex;
  flex-direction: column;
}
</style>
