<template>
  <footer class="footer">
    <div class="container">
      <div class="footer-content">
        <!-- About Section -->
        <div class="footer-section about">
          <div class="logo">
            <h1 class="brand-name">TECHZONE</h1>
          </div>
          <p>Đồng tiền đi đôi với chất lượng hihi !!</p>
        </div>

        <!-- Links Section -->
        <div class="footer-section links">
          <h3>Liên kết nhanh</h3>
          <ul>
            <li v-for="link in navLinks" :key="link.path">
              <router-link :to="link.path">{{ link.text }}</router-link>
            </li>
          </ul>
        </div>

        <!-- Contact Section -->
        <div class="footer-section contact">
          <h3>Liên hệ</h3>
          <p v-for="item in contactInfo" :key="item.text">
            <span class="contact-icon"><i :class="item.icon"></i></span> {{ item.text }}
          </p>
        </div>

        <!-- Newsletter Section -->
        <div class="footer-section newsletter">
          <h3>Bản tin</h3>
          <p>Nhận ngay thông tin về ưu đãi và sản phẩm mới nhất.</p>
          <form @submit.prevent="subscribeNewsletter" class="newsletter-form">
            <div class="input-wrapper">
              <i class="bi bi-envelope input-icon"></i>
              <input 
                type="email" 
                placeholder="Nhập email của bạn..." 
                v-model="email" 
                required
              >
            </div>
            <button type="submit" class="btn-subscribe" :disabled="loading">
              <i v-if="loading" class="bi bi-arrow-clockwise spinning"></i>
              <span v-else>Đăng ký</span>
            </button>
          </form>
        </div>
      </div>

      <div class="footer-bottom">
        <p>{{ new Date().getFullYear() }} TECHZONE - Sản phẩm này được thực hiện bởi Bảo và Tuấn</p>
      </div>
    </div>
  </footer>
</template>
<script>
export default {
  name: 'EnhancedFooter',
  data() {
    return {
      email: '',
      loading: false,
      socialIcons: [
        { name: 'Facebook', icon: 'bi bi-facebook', class: 'facebook' },
        { name: 'Twitter', icon: 'bi bi-twitter-x', class: 'twitter' },
        { name: 'Instagram', icon: 'bi bi-instagram', class: 'instagram' },
        { name: 'LinkedIn', icon: 'bi bi-linkedin', class: 'linkedin' },
        { name: 'YouTube', icon: 'bi bi-youtube', class: 'youtube' },
        { name: 'GitHub', icon: 'bi bi-github', class: 'github' }
      ],
      navLinks: [
        { path: '/', text: 'Trang chủ', icon: 'bi bi-house-door' },
        { path: '/products', text: 'Sản phẩm', icon: 'bi bi-cart3' },
        { path: '/about', text: 'Về chúng tôi', icon: 'bi bi-people' },
        { path: '/contact', text: 'Liên hệ', icon: 'bi bi-headset' },
        { path: '/policy', text: 'Chính sách', icon: 'bi bi-shield-check' },
        { path: '/blog', text: 'Tin tức', icon: 'bi bi-newspaper' },
        { path: '/faq', text: 'Hỏi đáp', icon: 'bi bi-question-circle' }
      ],
      contactInfo: [
        { icon: 'bi bi-telephone', text: '0877 515 707 ' },
        { icon: 'bi bi-envelope-at', text: 'nguyenhoagiabao.bt@gmail.com' },
        { icon: 'bi bi-geo-alt', text: '222 Trường Chinh, Tân Hưng Thuận, Quận 12, HCM' },
        { icon: 'bi bi-clock', text: 'Thứ 2 - Thứ 7: 8:00 - 18:00' },
        { icon: 'bi bi-chat-dots', text: 'Hỗ trợ trực tuyến 24/7' }
      ],
    };
  },
  methods: {
    async subscribeNewsletter() {
      this.loading = true;
      try {
        await new Promise(resolve => setTimeout(resolve, 1000));
        this.$toast.success(`Đăng ký thành công với email: ${this.email}`);
        this.email = '';
      } catch (error) {
        this.$toast.error('Đã có lỗi, vui lòng thử lại!');
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>
<style scoped>
@import url('https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.css');

.footer {
  background: #fff;
  color: #666;
  padding: 2rem 0;
  border-top: 1px solid #eee;
  font-family: 'Inter', sans-serif;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
}

.footer-content {
  display: flex;
  justify-content: space-between;
  gap: 2rem;
  flex-wrap: wrap;
  margin-bottom: 2rem;
}

.footer-section h3 {
  font-size: 1.2rem;
  font-weight: 600;
  color: #1a1a2e;
  margin-bottom: 1rem;
}

.footer-section p {
  font-size: 1rem;
  color: #666;
}

.brand-name {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1a1a2e;
}

.links ul {
  list-style: none;
  padding: 0;
}

.links li {
  margin-bottom: 0.5rem;
}

.links a {
  color: #666;
  text-decoration: none;
  transition: color 0.3s ease;
}

.links a:hover {
  color: #6c5ce7;
}

.contact p {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}

.contact-icon {
  color: #6c5ce7;
}

.newsletter-form {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.input-wrapper {
  position: relative;
}

.input-icon {
  position: absolute;
  left: 10px;
  top: 50%;
  transform: translateY(-50%);
  color: #666;
}

.newsletter input {
  padding: 0.5rem 0.5rem 0.5rem 2rem;
  border: 1px solid #ddd;
  border-radius: 5px;
  outline: none;
}

.btn-subscribe {
  background: #6c5ce7;
  color: #fff;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 5px;
  transition: background 0.3s ease;
}

.btn-subscribe:hover:not(:disabled) {
  background: #5a4ad1;
}

.footer-bottom {
  text-align: center;
  padding-top: 2rem;
  color: #999;
}

/* Responsive Design */
@media (max-width: 768px) {
  .footer-content {
    gap: 1.5rem;
  }
}
</style>