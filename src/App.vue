<template>
  <div class="app">
    <offline-indicator />
    <pwa-install-prompt />
    <app-header />
    <main>
      <router-view />
    </main>
    <app-footer />
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import AppHeader from '@/components/layout/AppHeader.vue';
import AppFooter from '@/components/layout/AppFooter.vue';
import OfflineIndicator from '@/components/OfflineIndicator.vue';
import PwaInstallPrompt from '@/components/PWAInstallPrompt.vue';
import { useTimeEntriesStore } from '@/stores/timeEntries';
import { useProjectsStore } from '@/stores/projects';

const timeEntriesStore = useTimeEntriesStore();
const projectsStore = useProjectsStore();

onMounted(() => {
  // Инициализируем хранилища
  timeEntriesStore.initialize();
  projectsStore.fetchProjects();
});
</script>

<style>
.app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}
main {
  flex: 1;
}
</style>