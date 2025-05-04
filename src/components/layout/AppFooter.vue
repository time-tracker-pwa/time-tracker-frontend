<template>
  <footer class="app-footer">
    <div class="container">
      <div class="footer-content">
        <div class="footer-brand">
          <h3>TimeTracker</h3>
          <p>Отслеживайте своё время эффективно и продуктивно</p>
        </div>

        <div class="footer-links">
          <div class="links-group">
            <h4>Навигация</h4>
            <ul>
              <li><router-link to="/">Главная</router-link></li>
              <li><router-link to="/timer">Таймер</router-link></li>
              <li><router-link to="/reports">Отчёты</router-link></li>
              <li><router-link to="/projects">Проекты</router-link></li>
            </ul>
          </div>

          <div class="links-group">
            <h4>Информация</h4>
            <ul>
              <li><router-link to="/settings">Настройки</router-link></li>
              <li>
                <a href="#" @click.prevent="openPrivacyModal"
                  >Конфиденциальность</a
                >
              </li>
              <li>
                <a href="#" @click.prevent="openAboutModal">О приложении</a>
              </li>
              <li>
                <a href="#" @click.prevent="syncData">Синхронизировать</a>
              </li>
            </ul>
          </div>
        </div>

        <div class="footer-install" v-if="showInstallInfo">
          <h4>Установите приложение</h4>
          <p>
            Это приложение можно установить на ваше устройство для работы в
            оффлайн режиме.
            <a href="#" @click.prevent="handleInstallClick" class="install-link"
              >Установить</a
            >
          </p>
        </div>
      </div>

      <div class="footer-bottom">
        <p>&copy; {{ currentYear }} TimeTracker. Все права защищены.</p>
        <p>Сделано с ❤️ для улучшения продуктивности</p>
      </div>
    </div>

    <!-- Модальное окно конфиденциальности -->
    <div v-if="showPrivacyModal" class="modal-overlay">
      <div class="modal-content">
        <div class="modal-header">
          <h3>Политика конфиденциальности</h3>
          <button @click="showPrivacyModal = false" class="close-button">
            &times;
          </button>
        </div>
        <div class="modal-body">
          <p>
            Мы не собираем никаких личных данных кроме тех, которые необходимы
            для работы приложения.
          </p>
          <p>
            Ваши данные о времени хранятся на вашем устройстве и
            синхронизируются с нашими серверами только для обеспечения доступа с
            разных устройств.
          </p>
          <p>
            Мы никогда не передаем ваши данные третьим лицам и не используем их
            в маркетинговых целях.
          </p>
        </div>
      </div>
    </div>

    <!-- Модальное окно о приложении -->
    <div v-if="showAboutModal" class="modal-overlay">
      <div class="modal-content">
        <div class="modal-header">
          <h3>О приложении</h3>
          <button @click="showAboutModal = false" class="close-button">
            &times;
          </button>
        </div>
        <div class="modal-body">
          <p>Версия: 1.0.0</p>
          <p>TimeTracker - прогрессивное веб-приложение для учета времени.</p>
          <p>Создано с использованием Vue.js, Pinia, TypeScript и Go.</p>
          <p>
            Может работать офлайн и устанавливаться на ваше устройство как
            обычное приложение.
          </p>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { syncService } from '@/services/syncService';

// Состояние модальных окон
const showPrivacyModal = ref(false);
const showAboutModal = ref(false);

// Текущий год для копирайта
const currentYear = computed(() => new Date().getFullYear());

// Состояние для информации об установке
const showInstallInfo = ref(false);
const deferredPrompt = ref<any>(null);

// Открытие модальных окон
const openPrivacyModal = () => {
  showPrivacyModal.value = true;
};

const openAboutModal = () => {
  showAboutModal.value = true;
};

// Синхронизация данных с сервером
const syncData = async () => {
  try {
    await syncService.syncAll();
    alert('Данные успешно синхронизированы');
  } catch (error) {
    console.error('Ошибка синхронизации:', error);
    alert(
      'Произошла ошибка при синхронизации. Проверьте подключение к интернету.'
    );
  }
};

// Обработка установки PWA
const handleInstallClick = () => {
  if (deferredPrompt.value) {
    deferredPrompt.value.prompt();

    deferredPrompt.value.userChoice.then((choiceResult: any) => {
      if (choiceResult.outcome === 'accepted') {
        console.log('Пользователь установил приложение');
        showInstallInfo.value = false;
      }
      deferredPrompt.value = null;
    });
  }
};

// Слушаем событие для установки
onMounted(() => {
  window.addEventListener('beforeinstallprompt', (e: Event) => {
    e.preventDefault();
    deferredPrompt.value = e;

    // Проверяем, отклонил ли пользователь предложение ранее
    const pwaInstallDismissed = localStorage.getItem(
      'pwaInstallPromptDismissed'
    );
    if (
      !pwaInstallDismissed ||
      Date.now() - parseInt(pwaInstallDismissed) > 7 * 24 * 60 * 60 * 1000
    ) {
      showInstallInfo.value = true;
    }
  });

  // Слушаем событие, когда приложение уже установлено
  window.addEventListener('appinstalled', () => {
    showInstallInfo.value = false;
    console.log('Приложение установлено');
  });
});
</script>

<style scoped>
.app-footer {
  background-color: #2c3e50;
  color: white;
  padding: 2rem 0 1rem;
  margin-top: 2rem;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

.footer-content {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 2rem;
  margin-bottom: 2rem;
}

.footer-brand {
  flex: 1;
  min-width: 200px;
}

.footer-brand h3 {
  margin: 0 0 0.5rem;
  font-size: 1.5rem;
}

.footer-links {
  display: flex;
  gap: 2rem;
  flex: 2;
}

.links-group {
  min-width: 120px;
}

.links-group h4 {
  margin: 0 0 1rem;
  font-size: 1rem;
}

.links-group ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.links-group li {
  margin-bottom: 0.5rem;
}

.links-group a {
  color: #ecf0f1;
  text-decoration: none;
  transition: color 0.2s;
}

.links-group a:hover {
  color: #3498db;
}

.footer-install {
  flex: 1;
  min-width: 200px;
}

.footer-install h4 {
  margin: 0 0 1rem;
  font-size: 1rem;
}

.install-link {
  color: #3498db;
  text-decoration: none;
  font-weight: bold;
  display: inline-block;
  margin-top: 0.5rem;
}

.footer-bottom {
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  padding-top: 1rem;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  font-size: 0.8rem;
  color: #bdc3c7;
}

.footer-bottom p {
  margin: 0.5rem 0;
}

/* Модальные окна */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background-color: white;
  border-radius: 8px;
  width: 90%;
  max-width: 500px;
  max-height: 80vh;
  overflow-y: auto;
  color: #333;
}

.modal-header {
  padding: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #eee;
}

.modal-header h3 {
  margin: 0;
  font-size: 1.2rem;
}

.close-button {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #777;
}

.modal-body {
  padding: 1rem;
}

/* Адаптивная верстка */
@media (max-width: 768px) {
  .footer-content {
    flex-direction: column;
    gap: 1.5rem;
  }

  .footer-links {
    flex-direction: column;
    gap: 1.5rem;
  }

  .footer-bottom {
    flex-direction: column;
    text-align: center;
  }
}
</style>
