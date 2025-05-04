<template>
  <header class="app-header">
    <!-- <div class="logo">
      <h1>TimeTracker</h1>
    </div> -->
    <nav>
      <router-link to="/">Главная</router-link>
      <router-link to="/timer">Таймер</router-link>
      <!-- <router-link to="/reports">Отчеты</router-link> -->
      <router-link to="/projects">Проекты</router-link>
      <!-- <router-link to="/settings">Настройки</router-link> -->
    </nav>
    <div class="sync-status">
      <span v-if="isOnline" class="online">Онлайн</span>
      <span v-else class="offline">Офлайн</span>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';

const isOnline = ref(navigator.onLine);

function updateOnlineStatus() {
  isOnline.value = navigator.onLine;
}

onMounted(() => {
  window.addEventListener('online', updateOnlineStatus);
  window.addEventListener('offline', updateOnlineStatus);
});

onUnmounted(() => {
  window.removeEventListener('online', updateOnlineStatus);
  window.removeEventListener('offline', updateOnlineStatus);
});
</script>

<style scoped>
.app-header {
  display: flex;
  justify-content: center;
  gap: 2rem;
  align-items: center;
  padding: 1rem;
  background-color: #2c3e50;
  color: white;
}

nav {
  display: flex;
  gap: 1rem;
}

nav a {
  color: white;
  text-decoration: none;
}

nav a.router-link-active {
  font-weight: bold;
  border-bottom: 2px solid white;
}

.sync-status {
  font-size: 0.8rem;
}

.online {
  color: #2ecc71;
}

.offline {
  color: #e74c3c;
}
</style>
