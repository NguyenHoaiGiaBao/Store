import store from '@/store';
import Vue from 'vue';
import VueRouter from 'vue-router';

Vue.use(VueRouter);

const routes = [
  { path: '/', name: 'Home', component: () => import('../views/HomeView.vue') },
  { path: '/products', name: 'Products', component: () => import('../views/Products.vue') },
  { 
    path: '/product/:id', 
    name: 'ProductDetail', 
    component: () => import('../views/ProductDetail.vue'),
    props: true
  },
  { path: '/cart', name: 'Cart', component: () => import('../views/Cart.vue'), meta: { requiresAuth: true } },
  { path: '/checkout', name: 'Checkout', component: () => import('../views/Checkout.vue'), meta: { requiresAuth: true } },
  { path: '/orders', name: 'Orders', component: () => import('../views/Orders.vue'), meta: { requiresAuth: true } },
  { path: '/login', name: 'Login', component: () => import('../views/Login.vue') },
  { path: '/register', name: 'Register', component: () => import('../views/Register.vue') },
  { path: '/add-product', name: 'AddProduct', component: () => import('../views/AddProduct.vue'), meta: { requiresAuth: true, requiresAdmin: true } }
  
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  const requiresAdmin = to.matched.some(record => record.meta.requiresAdmin);
  const isAuthenticated = store.getters['auth/isAuthenticated'];
  const isAdmin = store.getters['auth/isAdmin'];

  if (requiresAuth && !isAuthenticated) {
    next({
      path: '/login',
      query: { redirect: to.fullPath }
    });
  } else if (requiresAdmin && !isAdmin) {
    next('/');
  } else {

    if (isAuthenticated && (to.path === '/login' || to.path === '/register')) {
      next('/');
    } else {
      next();
    }
  }
});

export default router;