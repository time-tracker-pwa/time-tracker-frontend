<template>
  <div class="home-view">
    <section class="hero">
      <div class="container">
        <div class="hero-content">
          <h1>Отслеживайте своё время эффективно</h1>
          <p class="hero-subtitle">
            Простой способ отслеживать время работы, повышать продуктивность и
            анализировать ваш рабочий день
          </p>
          <div class="hero-buttons">
            <router-link to="/timer" class="btn btn-primary btn-lg"
              >Начать отслеживание</router-link
            >
            <router-link to="/projects" class="btn btn-outline btn-lg"
              >Мои проекты</router-link
            >
          </div>
        </div>
        <div class="hero-image">
          <img
            src="@/assets/tracker.svg"
            alt="Time Tracking Illustration"
          />
        </div>
      </div>
    </section>

    <section class="quick-stats" v-if="isAuthenticated">
      <div class="container">
        <h2>Ваша активность</h2>
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-icon">
              <i class="icon-today"></i>
            </div>
            <div class="stat-content">
              <h3>Сегодня</h3>
              <p class="stat-value">{{ formatDuration(todayTotal) }}</p>
              <p class="stat-label">Отслежено времени</p>
            </div>
          </div>

          <div class="stat-card">
            <div class="stat-icon">
              <i class="icon-week"></i>
            </div>
            <div class="stat-content">
              <h3>На этой неделе</h3>
              <p class="stat-value">{{ formatDuration(weekTotal) }}</p>
              <p class="stat-label">Отслежено времени</p>
            </div>
          </div>

          <div class="stat-card">
            <div class="stat-icon">
              <i class="icon-project"></i>
            </div>
            <div class="stat-content">
              <h3>Проекты</h3>
              <p class="stat-value">{{ projectsCount }}</p>
              <p class="stat-label">Активных проектов</p>
            </div>
          </div>

          <div class="stat-card">
            <div class="stat-icon">
              <i class="icon-tasks"></i>
            </div>
            <div class="stat-content">
              <h3>Записи</h3>
              <p class="stat-value">{{ timeEntriesCount }}</p>
              <p class="stat-label">Всего записей</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section
      class="recent-activity"
      v-if="isAuthenticated && recentEntries.length > 0"
    >
      <div class="container">
        <div class="section-header">
          <h2>Недавняя активность</h2>
          <router-link to="/reports" class="btn btn-outline"
            >Смотреть все</router-link
          >
        </div>

        <div class="timeline">
          <div
            v-for="entry in recentEntries"
            :key="entry.id"
            class="timeline-item"
          >
            <div
              class="timeline-dot"
              :style="{ backgroundColor: getProjectColor(entry.projectId) }"
            ></div>
            <div class="timeline-content">
              <div class="timeline-header">
                <h4>{{ getProjectName(entry.projectId) }}</h4>
                <span class="time-duration">{{
                  formatDuration(entry.duration)
                }}</span>
              </div>
              <p class="timeline-description">
                {{ entry.description || 'Без описания' }}
              </p>
              <p class="timeline-time">{{ formatDate(entry.startTime) }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="quick-actions" v-if="isAuthenticated">
      <div class="container">
        <h2>Быстрые действия</h2>
        <div class="actions-grid">
          <router-link to="/timer" class="action-card">
            <div class="action-icon">
              <i class="icon-timer"></i>
            </div>
            <div class="action-content">
              <h3>Запустить таймер</h3>
              <p>Начните отслеживать время прямо сейчас</p>
            </div>
          </router-link>

          <router-link to="/reports" class="action-card">
            <div class="action-icon">
              <i class="icon-reports"></i>
            </div>
            <div class="action-content">
              <h3>Отчеты</h3>
              <p>Просмотр и анализ затраченного времени</p>
            </div>
          </router-link>

          <router-link to="/projects" class="action-card">
            <div class="action-icon">
              <i class="icon-projects"></i>
            </div>
            <div class="action-content">
              <h3>Управление проектами</h3>
              <p>Создавайте и редактируйте ваши проекты</p>
            </div>
          </router-link>

          <router-link to="/settings" class="action-card">
            <div class="action-icon">
              <i class="icon-settings"></i>
            </div>
            <div class="action-content">
              <h3>Настройки</h3>
              <p>Настройте приложение под себя</p>
            </div>
          </router-link>
        </div>
      </div>
    </section>

    <section class="features">
      <div class="container">
        <h2 class="text-center">Функции приложения</h2>
        <div class="features-grid">
          <div class="feature-card">
            <div class="feature-icon">
              <i class="icon-timer"></i>
            </div>
            <h3>Простое отслеживание</h3>
            <p>
              Запускайте и останавливайте таймер одним кликом. Добавляйте
              описание и выбирайте проекты.
            </p>
          </div>

          <div class="feature-card">
            <div class="feature-icon">
              <i class="icon-offline"></i>
            </div>
            <h3>Работа офлайн</h3>
            <p>
              Используйте приложение даже без подключения к интернету. Данные
              синхронизируются автоматически.
            </p>
          </div>

          <div class="feature-card">
            <div class="feature-icon">
              <i class="icon-reports"></i>
            </div>
            <h3>Подробные отчеты</h3>
            <p>
              Анализируйте своё время с помощью наглядных отчетов и графиков.
            </p>
          </div>

          <div class="feature-card">
            <div class="feature-icon">
              <i class="icon-projects"></i>
            </div>
            <h3>Управление проектами</h3>
            <p>
              Организуйте ваше время по проектам для лучшего анализа и
              планирования.
            </p>
          </div>

          <div class="feature-card">
            <div class="feature-icon">
              <i class="icon-mobile"></i>
            </div>
            <h3>PWA приложение</h3>
            <p>
              Установите на домашний экран и используйте как обычное приложение
              на любом устройстве.
            </p>
          </div>

          <div class="feature-card">
            <div class="feature-icon">
              <i class="icon-secure"></i>
            </div>
            <h3>Безопасность данных</h3>
            <p>Ваши данные надежно защищены и доступны только вам.</p>
          </div>
        </div>
      </div>
    </section>

    <section class="cta" v-if="!isAuthenticated">
      <div class="container">
        <div class="cta-content">
          <h2>Начните отслеживать время прямо сейчас</h2>
          <p>
            Повысьте свою продуктивность с помощью нашего удобного трекера
            времени
          </p>
          <div class="cta-buttons">
            <!-- <router-link to="/login" class="btn btn-primary btn-lg"
              >Войти</router-link
            >
            <router-link to="/register" class="btn btn-outline btn-lg"
              >Регистрация</router-link
            > -->
          </div>
        </div>
      </div>
    </section>

    <section class="install-pwa" v-if="showInstallPrompt">
      <div class="container">
        <div class="install-content">
          <div class="install-text">
            <h3>Установите наше приложение</h3>
            <p>
              Используйте все функции без ограничений браузера и работайте
              офлайн
            </p>
          </div>
          <button @click="installPWA" class="btn btn-primary">
            Установить
          </button>
          <button @click="dismissInstallPrompt" class="btn btn-outline">
            Позже
          </button>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useTimeEntriesStore } from '../stores/timeEntries';
import { useProjectsStore } from '../stores/projects';
import { useAuthStore } from '../stores/auth';
import dayjs from 'dayjs';

// Инициализация хранилищ
const timeEntriesStore = useTimeEntriesStore();
const projectsStore = useProjectsStore();
const authStore = useAuthStore();

// Состояние для PWA установки
const showInstallPrompt = ref(false);
const deferredPrompt = ref<any>(null);

// Вычисляемые свойства
const isAuthenticated = computed(() => authStore.isAuthenticated);

const recentEntries = computed(() => {
  return [...timeEntriesStore.timeEntries]
    .sort((a, b) => b.startTime - a.startTime)
    .slice(0, 5);
});

const todayTotal = computed(() => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return timeEntriesStore.timeEntries
    .filter((entry) => new Date(entry.startTime) >= today)
    .reduce((sum, entry) => sum + (entry.duration || 0), 0);
});

const weekTotal = computed(() => {
  const startOfWeek = new Date();
  startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
  startOfWeek.setHours(0, 0, 0, 0);

  return timeEntriesStore.timeEntries
    .filter((entry) => new Date(entry.startTime) >= startOfWeek)
    .reduce((sum, entry) => sum + (entry.duration || 0), 0);
});

const projectsCount = computed(() => projectsStore.projects.length);

const timeEntriesCount = computed(() => timeEntriesStore.timeEntries.length);

// Методы
function formatDuration(seconds: number): string {
  if (!seconds) return '00:00:00';

  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  return `${hours.toString().padStart(2, '0')}:${minutes
    .toString()
    .padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

function formatDate(timestamp: number): string {
  return dayjs(timestamp).format('DD.MM.YYYY HH:mm');
}

function getProjectName(projectId: number): string {
  const project = projectsStore.projects.find((p) => p.id === projectId);
  return project ? project.name : 'Без проекта';
}

function getProjectColor(projectId: number): string {
  const project = projectsStore.projects.find((p) => p.id === projectId);
  return project ? project.color : '#cccccc';
}

function installPWA() {
  if (!deferredPrompt.value) return;

  deferredPrompt.value.prompt();

  deferredPrompt.value.userChoice.then((choiceResult: any) => {
    if (choiceResult.outcome === 'accepted') {
      console.log('Пользователь установил PWA');
      showInstallPrompt.value = false;
    }
    deferredPrompt.value = null;
  });
}

function dismissInstallPrompt() {
  showInstallPrompt.value = false;
  localStorage.setItem('pwaInstallPromptDismissed', Date.now().toString());
}

// Жизненный цикл
onMounted(async () => {
  // Загружаем данные, если пользователь авторизован
  if (isAuthenticated.value) {
    await timeEntriesStore.fetchTimeEntries();
    await projectsStore.fetchProjects();
  }

  // Проверяем, можно ли установить PWA
  window.addEventListener('beforeinstallprompt', (e: Event) => {
    e.preventDefault();
    deferredPrompt.value = e;

    // Проверяем, отклонял ли пользователь предложение ранее
    const dismissed = localStorage.getItem('pwaInstallPromptDismissed');
    if (
      !dismissed ||
      Date.now() - parseInt(dismissed) > 3 * 24 * 60 * 60 * 1000
    ) {
      showInstallPrompt.value = true;
    }
  });
});
</script>

<style scoped>
.home-view {
  padding: 0 0 2rem;
}

/* Секция Hero */
.hero {
  padding: 3rem 0;
  background-color: var(--background-color);
  position: relative;
  overflow: hidden;
}

.hero .container {
  display: flex;
  align-items: center;
  gap: 2rem;
}

.hero-content {
  flex: 1;
}

.hero h1 {
  font-size: 2.5rem;
  margin-bottom: 1rem;
  color: var(--text-dark);
}

.hero-subtitle {
  font-size: 1.2rem;
  color: var(--text-light);
  margin-bottom: 2rem;
}

.hero-buttons {
  display: flex;
  gap: 1rem;
  @media(max-width: 450px) {
    flex-direction: column;
  }
}

.hero-image {
  flex: 1;
  text-align: center;
}

.hero-image img {
  max-width: 100%;
  height: auto;
}

/* Секция быстрой статистики */
.quick-stats {
  padding: 3rem 0;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 1.5rem;
  margin-top: 1.5rem;
}

.stat-card {
  background-color: var(--card-background);
  border-radius: var(--border-radius);
  padding: 1.5rem;
  box-shadow: var(--box-shadow);
  display: flex;
  align-items: center;
  gap: 1rem;
}

.stat-icon {
  width: 3rem;
  height: 3rem;
  border-radius: 50%;
  background-color: rgba(52, 152, 219, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--primary-color);
  font-size: 1.5rem;
}

.stat-content {
  flex: 1;
}

.stat-content h3 {
  font-size: 1rem;
  margin-bottom: 0.5rem;
}

.stat-value {
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 0.25rem;
}

.stat-label {
  font-size: 0.875rem;
  color: var(--text-light);
  margin: 0;
}

/* Секция недавней активности */
.recent-activity {
  padding: 3rem 0;
  background-color: rgba(0, 0, 0, 0.02);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.timeline {
  position: relative;
  margin-top: 2rem;
}

.timeline::before {
  content: '';
  position: absolute;
  top: 0;
  bottom: 0;
  left: 1rem;
  width: 2px;
  background-color: var(--border-color);
}

.timeline-item {
  position: relative;
  margin-bottom: 1.5rem;
  padding-left: 3rem;
}

.timeline-dot {
  position: absolute;
  left: 0.5rem;
  top: 0.5rem;
  width: 1rem;
  height: 1rem;
  border-radius: 50%;
  background-color: var(--primary-color);
  border: 2px solid white;
  z-index: 1;
}

.timeline-content {
  background-color: var(--card-background);
  border-radius: var(--border-radius);
  padding: 1rem;
  box-shadow: var(--box-shadow);
}

.timeline-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.timeline-header h4 {
  margin: 0;
  font-size: 1rem;
}

.time-duration {
  font-weight: bold;
  color: var(--primary-color);
}

.timeline-description {
  margin-bottom: 0.5rem;
}

.timeline-time {
  font-size: 0.8rem;
  color: var(--text-light);
  margin: 0;
}

/* Секция быстрых действий */
.quick-actions {
  padding: 3rem 0;
}

.actions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
  margin-top: 1.5rem;
}

.action-card {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  background-color: var(--card-background);
  border-radius: var(--border-radius);
  padding: 1.5rem;
  box-shadow: var(--box-shadow);
  transition: transform var(--transition-speed),
    box-shadow var(--transition-speed);
  color: var(--text-color);
  text-decoration: none;
}

.action-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
}

.action-icon {
  width: 3.5rem;
  height: 3.5rem;
  border-radius: 50%;
  background-color: rgba(52, 152, 219, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--primary-color);
  font-size: 1.5rem;
}

.action-content {
  flex: 1;
}

.action-content h3 {
  font-size: 1.1rem;
  margin-bottom: 0.5rem;
}

.action-content p {
  font-size: 0.9rem;
  color: var(--text-light);
  margin: 0;
}

/* Секция функций */
.features {
  padding: 3rem 0;
  background-color: rgba(0, 0, 0, 0.02);
}

.features h2 {
  margin-bottom: 2rem;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
}

.feature-card {
  text-align: center;
  padding: 2rem;
  background-color: var(--card-background);
  border-radius: var(--border-radius);
  box-shadow: var(--box-shadow);
  transition: transform var(--transition-speed);
}

.feature-card:hover {
  transform: translateY(-5px);
}

.feature-icon {
  width: 4rem;
  height: 4rem;
  border-radius: 50%;
  background-color: rgba(52, 152, 219, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1.5rem;
  color: var(--primary-color);
  font-size: 2rem;
}

.feature-card h3 {
  font-size: 1.25rem;
  margin-bottom: 1rem;
}

.feature-card p {
  color: var(--text-light);
  margin: 0;
}

/* Секция CTA */
.cta {
  padding: 4rem 0;
  background-color: var(--primary-color);
  color: white;
  text-align: center;
}

.cta h2 {
  color: white;
  margin-bottom: 1rem;
}

.cta p {
  font-size: 1.2rem;
  margin-bottom: 2rem;
  opacity: 0.9;
}

.cta-buttons {
  display: flex;
  gap: 1rem;
  justify-content: center;
}

.cta .btn-outline {
  border-color: white;
  color: white;
}

.cta .btn-outline:hover {
  background-color: white;
  color: var(--primary-color);
}

/* Секция установки PWA */
.install-pwa {
  padding: 1.5rem 0;
  background-color: rgba(52, 152, 219, 0.1);
}

.install-content {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
}

.install-text {
  flex: 1;
  min-width: 200px;
}

.install-text h3 {
  margin-bottom: 0.5rem;
}

.install-text p {
  margin: 0;
  color: var(--text-light);
}

/* Адаптивная верстка */
@media (max-width: 768px) {
  .hero .container {
    flex-direction: column;
    text-align: center;
  }

  .hero h1 {
    font-size: 2rem;
  }

  .hero-buttons {
    justify-content: center;
  }

  .timeline::before {
    left: 0.5rem;
  }

  .timeline-item {
    padding-left: 2rem;
  }

  .timeline-dot {
    left: 0;
  }

  .install-content {
    justify-content: center;
    text-align: center;
  }
}

/* Иконки */
.icon-today::before {
  content: '📅';
}
.icon-week::before {
  content: '📆';
}
.icon-project::before {
  content: '📁';
}
.icon-tasks::before {
  content: '✓';
}
.icon-timer::before {
  content: '⏱️';
}
.icon-reports::before {
  content: '📊';
}
.icon-projects::before {
  content: '📋';
}
.icon-settings::before {
  content: '⚙️';
}
.icon-offline::before {
  content: '📶';
}
.icon-mobile::before {
  content: '📱';
}
.icon-secure::before {
  content: '🔒';
}
</style>
