<template>
  <div class="home">
    <!-- Image Slider -->
    <div class="image-slider">
      <transition name="fade">
        <img :src="currentImage" :key="currentIndex" class="slider-image" />
      </transition>
      
    <!-- Hero Content Overlay -->
    <div class="hero-content-overlay">
      <h1 class="fade-in">SIÊU CÔNG NGHỆ & PHỤ KIỆN</h1>
      <h2 class="super-sale">Dành Riêng Cho Thiết Bị Của Bạn</h2>
      <p class="hero-text slide-in">
        Khám phá những mẫu điện thoại và phụ kiện đỉnh cao một cách đơn giản.
      </p>
      <router-link to="/products" class="cta-btn">Khám phá sản phẩm của chúng tôi</router-link>
    </div>
    </div>

    <!-- Features Section -->
    <section class="features">
      <div class="feature-item fade-in">
        <div class="feature-image-container">
          <img src="https://cdn.xtmobile.vn/vnt_upload/news/05_2024/cau-hinh-chi-tiet-xiaomi-15-ultra-xtmobile.jpg" alt="Latest phones" class="feature-image">
        </div>
        <h3>Điện thoại mới nhất</h3>
        <p>Luôn cập nhật các mẫu điện thoại mới nhất từ các thương hiệu hàng đầu!</p>
      </div>
      <div class="feature-item fade-in">
        <div class="feature-image-container">
          <img src="https://pinsacdienthoai.net/files/sanpham/3727/1/jpg/sac-anker-prime-250w-6-ports-ganprime-a2345.jpg" alt="Phone accessories" class="feature-image">
        </div>
        <h3>Phụ kiện đa dạng</h3>
        <p>Tai nghe, sạc, ốp lưng, kính cường lực... đầy đủ cho mọi nhu cầu!</p>
      </div>
      <div class="feature-item fade-in">
        <div class="feature-image-container">
          <img src="https://cuktechvietnam.vn/wp-content/uploads/2024/11/webmau16.com-sac-du-phong-cuktech-25000mah-210w-2c1a-pd-3-1-pps5a-qc-mi-turbro-charger-120w-pb250-5.jpg" alt="Warranty service" class="feature-image">
        </div>
        <h3>Bảo hành tận tâm</h3>
        <p>Chính sách bảo hành toàn diện, hỗ trợ kỹ thuật 24/7.</p>
      </div>
    </section>
    </div>
  </div>
</template>

<script>
export default {
  name: 'HomePage', 
  data() {
    return {
      images: [
        'https://congngheviet.com/wp-content/uploads/2024/02/xiaomi-14-ultra_8_result.webp',
        'https://cdn.redmondpie.com/wp-content/uploads/2024/09/anker-250w-charging-station-1.jpg',
        'https://vatvostudio.vn/wp-content/uploads/2024/08/Cuktech-PB100P-1.jpg'
      ],
      currentIndex: 0,
      timer: null
    };
  },
  computed: {
    currentImage() {
      return this.images[this.currentIndex];
    }
  },
  mounted() {
    this.startSlider();
  },
  beforeDestroy() {
    this.stopSlider();
  },
  methods: {
    startSlider() {
      this.timer = setInterval(() => {
        this.currentIndex = (this.currentIndex + 1) % this.images.length;
      }, 3000); // Change image every 3 seconds
    },
    stopSlider() {
      clearInterval(this.timer);
    }
  }
};
</script>

<style scoped>
/* Base Styles */
.home {
  font-family: 'Noto Sans', sans-serif;
  color: #1a1a2e;
  background: #f5f7fa;
  min-height: 100vh;
}

/* Image Slider Styles */
.image-slider {
  position: relative;
  height: 85vh;
  overflow: hidden;
  margin: 0;
}

.slider-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.image-slider:hover .slider-image {
  transform: scale(1.05);
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.8s cubic-bezier(0.4, 0, 0.2, 1);
}

.fade-enter, .fade-leave-to {
  opacity: 0;
}

/* Hero Content Overlay */
.hero-content-overlay {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 10;
  max-width: 700px;
  width: 90%;
  text-align: center;
}

.hero-content-overlay h1,
.hero-content-overlay h2,
.hero-content-overlay p,
.hero-content-overlay .cta-btn {
  font-family: 'Noto Sans', sans-serif;
}

.hero-content-overlay h1 {
  font-size: 3.5rem;
  font-weight: 800;
  color: #1a1a2e;
  margin-bottom: 1rem;
}

.hero-content-overlay .super-sale {
  font-size: 2.5rem;
  font-weight: 700;
  color: #1a1a2e;
  margin-bottom: 1rem;
}

.hero-content-overlay .hero-text {
  font-size: 1.2rem;
  color: #666;
  margin-bottom: 2rem;
}

.hero-content-overlay .cta-btn {
  display: inline-block;
  background: #6c5ce7;
  color: #fff;
  padding: 1rem 2rem;
  border-radius: 5px;
  text-decoration: none;
  font-weight: 600;
  transition: background 0.3s ease;
}

.hero-content-overlay .cta-btn:hover {
  background: #5a4ad1;
}

.hero-content-overlay .why-choose {
  color: #6c5ce7;
  text-decoration: none;
  margin-left: 2rem;
  font-weight: 500;
}

.hero-content-overlay .why-choose:hover {
  text-decoration: underline;
}

/* Features Section */
.features {
  display: flex;
  justify-content: center;
  gap: 2rem;
  padding: 5rem 2rem;
  max-width: 1200px;
  margin: 0 auto;
  flex-wrap: wrap;
}

.feature-item {
  flex: 1;
  min-width: 300px;
  text-align: center;
  background: #fff;
  padding: 2rem;
  border-radius: 10px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
}

.feature-item:hover {
  transform: translateY(-5px);
}

.feature-image-container {
  width: 100%;
  height: 200px;
  overflow: hidden;
  border-radius: 10px;
  margin-bottom: 1rem;
}

.feature-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.feature-item h3 {
  font-size: 1.5rem;
  font-weight: 600;
  color: #1a1a2e;
}

.feature-item p {
  font-size: 1rem;
  color: #666;
}

/* Animations */
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideInDown {
  from { opacity: 0; transform: translateY(-50px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes slideInUp {
  from { opacity: 0; transform: translateY(50px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Responsive Design */
@media (max-width: 768px) {
  .image-slider {
    height: 70vh;
  }

  .hero-content-overlay h1 {
    font-size: 2.2rem;
  }

  .hero-content-overlay .super-sale {
    font-size: 2rem;
  }

  .hero-content-overlay .hero-text {
    font-size: 1.1rem;
  }

  .hero-content-overlay .cta-btn {
    padding: 0.8rem 1.5rem;
  }

  .features {
    gap: 1.5rem;
    padding: 3rem 1rem;
  }
}
</style>