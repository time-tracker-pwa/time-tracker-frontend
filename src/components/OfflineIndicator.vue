<template>
  <div v-if="!isOnline" class="offline-indicator">
    <div class="offline-content">
      <span class="offline-icon">⚠️</span>
      <span
        >Вы работаете офлайн. Данные будут синхронизированы, когда соединение
        восстановится.</span
      >
    </div>
  </div>
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
.offline-indicator {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background-color: #f39c12;
  color: white;
  padding: 0.5rem;
  text-align: center;
  z-index: 1000;
}

.offline-content {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.offline-icon {
  font-size: 1.2rem;
}
</style>
