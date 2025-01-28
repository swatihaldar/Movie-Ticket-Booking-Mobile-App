import { createRouter, createWebHistory } from 'vue-router';
import { session } from './data/session';
import { userResource } from '@/data/user';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/pages/HomePage.vue'), 
  },
  {
    path: '/movies',
    name: 'MovieList',
    component: () => import('@/pages/MovieList.vue'),
  },
  {
    name: 'Login',
    path: '/account/login',
    component: () => import('@/pages/Login.vue'),
  },
  {
    name: 'MovieDetails',
    path: '/movies/:movieName',
    component: () => import('@/pages/MovieDetails.vue'),
    props: true,
  }
];

const router = createRouter({
  history: createWebHistory('/frontend'),
  routes,
});

router.beforeEach(async (to, from, next) => {
  let isLoggedIn = session.isLoggedIn;

  try {
    await userResource.promise;
  } catch (error) {
    console.error("Error fetching user session:", error);
    isLoggedIn = false; // Set logged in status to false on error
  }

  if (to.name === 'Login' && isLoggedIn) {
    next({ name: 'Home' });
  } else if (to.name !== 'Login' && !isLoggedIn) {
    next({ name: 'Login', query: { redirectFrom: to.fullPath } }); // Redirect after login
  } else {
    next();
  }
});

export default router;