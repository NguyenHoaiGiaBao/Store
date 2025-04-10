<template>
  <header class="header">
    <nav class="nav-container">
      <div class="brand">
        <router-link to="/" class="logo-link">
          <span class="brand-name">TECHZONE</span>
        </router-link>
      </div>
      <div class="nav-links" :class="{ 'active': menuOpen }">
        <router-link to="/" class="nav-item text-link" @click="closeMenu">TRANG CHỦ</router-link>
        <router-link to="/products" class="nav-item text-link" @click="closeMenu">SẢN PHẨM</router-link>
        <div class="nav-right">
          <router-link v-if="isAuthenticated" to="/orders" class="nav-item orders">
  <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" class="bi bi-truck" viewBox="0 0 16 16">
    <path d="M0 3.5A1.5 1.5 0 0 1 1.5 2h9A1.5 1.5 0 0 1 12 3.5V5h1.02a1.5 1.5 0 0 1 1.17.563l1.481 1.85a1.5 1.5 0 0 1 .329.938V10.5a1.5 1.5 0 0 1-1.5 1.5H14a2 2 0 1 1-4 0H5a2 2 0 1 1-3.998-.085A1.5 1.5 0 0 1 0 10.5zm1.294 7.456A2 2 0 0 1 4.732 11h5.536a2 2 0 0 1 .732-.732V3.5a.5.5 0 0 0-.5-.5h-9a.5.5 0 0 0-.5.5v7a.5.5 0 0 0 .294.456M12 10a2 2 0 0 1 1.732 1h.768a.5.5 0 0 0 .5-.5V8.35a.5.5 0 0 0-.11-.312l-1.48-1.85A.5.5 0 0 0 13.02 6H12zm-9 1a1 1 0 1 0 0 2 1 1 0 0 0 0-2m9 0a1 1 0 1 0 0 2 1 1 0 0 0 0-2"/>
  </svg>
</router-link>
          <router-link to="/cart" class="nav-item cart">
            <svg xmlns="http://www.w3.org/2000/svg" width="30" height="" fill="currentColor" class="bi bi-cart4" viewBox="0 0 16 16">
              <path d="M0 2.5A.5.5 0 0 1 .5 2H2a.5.5 0 0 1 .485.379L2.89 4H14.5a.5.5 0 0 1 .485.621l-1.5 6A.5.5 0 0 1 13 11H4a.5.5 0 0 1-.485-.379L1.61 3H.5a.5.5 0 0 1-.5-.5M3.14 5l.5 2H5V5zM6 5v2h2V5zm3 0v2h2V5zm3 0v2h1.36l.5-2zm1.11 3H12v2h.61zM11 8H9v2h2zM8 8H6v2h2zM5 8H3.89l.5 2H5zm0 5a1 1 0 1 0 0 2 1 1 0 0 0 0-2m-2 1a2 2 0 1 1 4 0 2 2 0 0 1-4 0m9-1a1 1 0 1 0 0 2 1 1 0 0 0 0-2m-2 1a2 2 0 1 1 4 0 2 2 0 0 1-4 0"/>
            </svg>
            <span class="cart-count">{{ cartItemCount }}</span>
          </router-link>
          <!-- Hiển thị nút đăng nhập nếu chưa đăng nhập -->
          <router-link v-if="!isAuthenticated" to="/login" class="nav-item sign-in">Đăng nhập</router-link>
          <!-- Hiển thị nút đăng xuất nếu đã đăng nhập -->
          <button v-if="isAuthenticated" class="logout-btn" @click="logout" @click.stop="closeMenu">
            Đăng xuất
          </button>
        </div>
      </div>
      <div class="menu-toggle" @click="toggleMenu">
        <span class="hamburger" :class="{ 'open': menuOpen }"></span>
      </div>
    </nav>
  </header>
</template>
<script>
export default {
  name: 'ModernHeader',
  data() {
    return {
      menuOpen: false,
      searchQuery: '',
      navLinks: [
        { path: '/', text: 'Trang chủ', auth: false },
        { path: '/products', text: 'Sản phẩm', auth: false },
        { path: '/cart', text: 'Giỏ hàng', auth: false, icon: true },
        { path: '/orders', text: 'Đơn hàng', auth: false },
        { path: '/login', text: 'Đăng nhập', auth: false, hideIfAuth: true, icon: true },
      ],
    };
  },
  computed: {
    isAuthenticated() {
      return this.$store.getters['auth/isAuthenticated'];
    },
    filteredLinks() {
      return this.navLinks.filter(link => 
        (!link.auth || this.isAuthenticated) && 
        (!link.hideIfAuth || !this.isAuthenticated)
      );
    },
    cartItemCount() {
      const cart = this.$store.state.cart.cart;
      return cart ? cart.items.length : 0;
    }
  },
  created() {
    if (this.isAuthenticated) {
      this.$store.dispatch('cart/fetchCart');
    }
  },
  watch: {
    isAuthenticated(newVal) {
      if (newVal) {
        this.$store.dispatch('cart/fetchCart');
      }
    }
  },
  methods: {
    async logout() {
      try {
        await this.$store.dispatch('auth/logout');
        this.$store.commit('cart/setCart', null);
        this.$toast.success('Đã đăng xuất thành công!');
        this.$router.push('/login');
      } catch (error) {
        this.$toast.error('Đăng xuất thất bại, vui lòng thử lại!');
      }
    },
    toggleMenu() {
      this.menuOpen = !this.menuOpen;
    },
    closeMenu() {
      this.menuOpen = false;
    },
    performSearch() {
      if (this.searchQuery.trim()) {
        this.$router.push({ path: '/products', query: { search: this.searchQuery } });
        this.searchQuery = '';
        this.closeMenu();
      }
    },
  },
};
</script>
<style scoped>
.header {
  background: #fff;
  padding: 1rem 2rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  position: sticky;
  top: 0;
  z-index: 1000;
}

.nav-container {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-family: 'Inter', sans-serif;
}

.brand-name {
  font-size: 3rem;
  font-weight: 700;
  color: #1a1a2e;
  text-decoration: none;  
}

.nav-links {
  display: flex;
  align-items: center;
  gap: 2rem;
}

.nav-item {
  color: #1a1a2e;
  text-decoration: none;
  font-weight: 700; /* In đậm chữ */
  transition: color 0.3s ease;
}

.nav-item:hover {
  color: #6c5ce7;
}

.nav-right {
  display: flex;
  align-items: center;
  gap: 2.5rem;
}

.cart {
  position: relative;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.cart-count {
  position: absolute;
  top: -10px;
  right: -10px;
  background: #6c5ce7;
  color: #fff;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 700; /* In đậm số lượng giỏ hàng */
}

.sign-in {
  background: #6c5ce7;
  color: #fff;
  padding: 0.5rem 1rem;
  border-radius: 5px;
  transition: background 0.3s ease;
  font-weight: 700; /* In đậm chữ */
}

.sign-in:hover {
  background: #5a4ad1;
}

.logout-btn {
  background: #e63946;
  color: #fff;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background 0.3s ease;
  font-weight: 700; /* In đậm chữ */
}

.logout-btn:hover {
  background: #c62828;
}

.menu-toggle {
  display: none;
  cursor: pointer;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.05);
  justify-content: center;
  align-items: center;
}

.hamburger {
  width: 24px;
  height: 2px;
  background: #1a1a2e;
  position: relative;
}

.hamburger::before,
.hamburger::after {
  content: '';
  position: absolute;
  width: 24px;
  height: 2px;
  background: #1a1a2e;
}

.hamburger::before {
  top: -8px;
}

.hamburger::after {
  bottom: -8px;
}

.hamburger.open {
  background: transparent;
}

.hamburger.open::before {
  transform: rotate(45deg) translate(5px, 6px);
}

.hamburger.open::after {
  transform: rotate(-45deg) translate(5px, -6px);
}

.orders {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border-radius: 5px;
  transition: all 0.3s ease;
}

.orders:hover {
  background: rgba(108, 92, 231, 0.1);
}

.order-label {
  font-size: 0.9rem;
  font-weight: 600;
}

@media (max-width: 768px) {
  .nav-links {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background: #fff;
    flex-direction: column;
    gap: 1rem;
    padding: 1.5rem;
    transform: translateY(-100%);
    transition: transform 0.4s ease;
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
  }

  .nav-links.active {
    transform: translateY(0);
  }

  .menu-toggle {
    display: flex;
  }

  .nav-right {
    flex-direction: column;
    width: 200%;
  }

  .cart, .sign-in, .logout-btn {
    width: 100%;
    text-align: center;
  }

  .cart {
    justify-content: center;
  }

  .orders {
    justify-content: center;
    width: 100%;
    padding: 10px;
  }
}
</style>