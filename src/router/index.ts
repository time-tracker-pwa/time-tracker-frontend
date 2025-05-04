import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import ProjectsView from '../views/ProjectsView.vue';
import TimerView from '../views/TimerView.vue';
// import ReportsView from '../views/ReportsView.vue'
// import ProjectsView from '../views/ProjectsView.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/timer',
      name: 'timer',
      component: () => TimerView,
    },
    // {
    //   path: '/reports',
    //   name: 'reports',
    //   component: () => ReportsView
    // },
    {
      path: '/projects',
      name: 'projects',
      component: () => ProjectsView,
    },
    // {
    //   path: '/settings',
    //   name: 'settings',
    //   component: () => import('@/views/SettingsView.vue')
    // }
  ],
});

export default router;
