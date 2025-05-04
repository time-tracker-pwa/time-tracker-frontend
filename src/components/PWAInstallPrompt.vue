<template>
  <div v-if="showInstallPrompt" class="pwa-install-prompt">
    <div class="prompt-content">
      <h3>Установите приложение</h3>
      <p>
        Установите наше приложение на ваше устройство для более удобного доступа
        и работы офлайн.
      </p>
      <div class="prompt-buttons">
        <button @click="installPWA" class="install-button">Установить</button>
        <button @click="dismissPrompt" class="dismiss-button">Позже</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';

const showInstallPrompt = ref(false);
const deferredPrompt = ref<any>(null);

// Слушаем событие beforeinstallprompt
const handleBeforeInstallPrompt = (e: Event) => {
  // Предотвращаем показ стандартного промпта установки
  e.preventDefault();
  // Сохраняем событие для использования позже
  deferredPrompt.value = e;
  // Показываем наш пользовательский промпт
  showInstallPrompt.value = true;
};

// Функция для установки PWA
const installPWA = async () => {
  if (!deferredPrompt.value) return;

  // Показываем стандартный промпт установки
  deferredPrompt.value.prompt();

  // Ждем, пока пользователь сделает выбор
  const choiceResult = await deferredPrompt.value.userChoice;

  // Сбрасываем deferredPrompt
  deferredPrompt.value = null;
  showInstallPrompt.value = false;

  // Отслеживаем выбор пользователя
  if (choiceResult.outcome === 'accepted') {
    console.log('Пользователь установил PWA');
  } else {
    console.log('Пользователь отклонил установку PWA');
  }
};

// Скрыть промпт установки
const dismissPrompt = () => {
  showInstallPrompt.value = false;
  // Сохраняем в localStorage, чтобы не показывать промпт снова в ближайшее время
  localStorage.setItem('pwaInstallPromptDismissed', Date.now().toString());
};

onMounted(() => {
  // Проверяем, было ли уже отклонено предложение установки
  const dismissedTime = localStorage.getItem('pwaInstallPromptDismissed');

  // Если пользователь отклонил промпт менее 3 дней назад, не показываем его снова
  if (
    dismissedTime &&
    Date.now() - parseInt(dismissedTime) < 3 * 24 * 60 * 60 * 1000
  ) {
    showInstallPrompt.value = false;
  } else {
    // Добавляем слушатель события beforeinstallprompt
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
  }
});

onUnmounted(() => {
  // Удаляем слушатель при размонтировании компонента
  window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
});
</script>

<style scoped>
.pwa-install-prompt {
  position: fixed;
  bottom: 20px;
  right: 20px;
  background-color: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  max-width: 350px;
  z-index: 1000;
}

.prompt-content {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

h3 {
  margin: 0;
  font-size: 1.2rem;
}

p {
  margin: 0;
  color: #666;
}

.prompt-buttons {
  display: flex;
  gap: 0.5rem;
  justify-content: flex-end;
}

.install-button {
  background-color: #3498db;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
}

.dismiss-button {
  background-color: transparent;
  color: #666;
  border: 1px solid #ddd;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
}
</style>
