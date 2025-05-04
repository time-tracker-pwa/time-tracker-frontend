<template>
  <div class="timer-view">
    <h2>Таймер</h2>

    <div class="timer-controls">
      <div class="project-select">
        <label for="project">Проект:</label>
        <select id="project" v-model="selectedProjectId">
          <option
            v-for="project in projects"
            :key="project.id"
            :value="project.id"
          >
            {{ project.name }}
          </option>
        </select>
      </div>

      <div class="description">
        <label for="description">Описание:</label>
        <input
          type="text"
          id="description"
          v-model="description"
          placeholder="Что вы делаете?"
        />
      </div>

      <div class="timer-display">
        <span>{{ formatTime(elapsedTime) }}</span>
      </div>

      <div class="timer-buttons">
        <button
          v-if="!isRunning"
          @click="startTimer"
          :disabled="!selectedProjectId"
        >
          Начать
        </button>
        <button v-else @click="stopTimer" class="stop">Остановить</button>
      </div>
    </div>

    <div class="recent-entries">
      <h3>Последние записи</h3>
      <div v-if="isLoading">Загрузка...</div>
      <div v-else-if="timeEntries.length === 0" class="no-entries">
        Нет записей
      </div>
      <ul v-else>
        <li v-for="entry in recentEntries" :key="entry.id" class="entry-item">
          <div
            class="entry-project"
            :style="{ backgroundColor: getProjectColor(entry.projectId) }"
          >
            {{ getProjectName(entry.projectId) }}
          </div>
          <div class="entry-description">
            {{ entry.description || 'Без описания' }}
          </div>
          <div class="entry-time">
            {{ formatTime(entry.duration) }}
          </div>
          <div class="entry-date">
            {{ formatDate(entry.startTime) }}
          </div>
          <div v-if="!entry.synced" class="sync-pending">⟳</div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useTimeEntriesStore } from '@/stores/timeEntries';
import { useProjectsStore } from '@/stores/projects';
import dayjs from 'dayjs';

const timeEntriesStore = useTimeEntriesStore();
const projectsStore = useProjectsStore();

// Состояние таймера
const isRunning = ref(false);
const elapsedTime = ref(0);
const startTime = ref(0);
const timerInterval = ref<number | null>(null);
const selectedProjectId = ref<number | null>(null);
const description = ref('');

// Вычисляемые свойства
const timeEntries = computed(() => timeEntriesStore.timeEntries);
const isLoading = computed(() => timeEntriesStore.isLoading);
const projects = computed(() => projectsStore.projects);
const recentEntries = computed(() => {
  return [...timeEntries.value]
    .sort((a, b) => b.startTime - a.startTime)
    .slice(0, 10);
});

// Методы
function startTimer() {
  if (!selectedProjectId.value) return;

  isRunning.value = true;
  startTime.value = Date.now();

  // Создаем новую запись в хранилище
  timeEntriesStore.startTimer(selectedProjectId.value, description.value);

  // Запускаем интервал для обновления таймера
  timerInterval.value = window.setInterval(() => {
    elapsedTime.value = (Date.now() - startTime.value) / 1000;
  }, 1000);
}

function stopTimer() {
  if (timerInterval.value) {
    clearInterval(timerInterval.value);
    timerInterval.value = null;
  }

  isRunning.value = false;
  timeEntriesStore.stopTimer();
  elapsedTime.value = 0;
  description.value = '';
}

function formatTime(seconds: number): string {
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
  const project = projects.value.find((p) => p.id === projectId);
  return project ? project.name : 'Неизвестный проект';
}

function getProjectColor(projectId: number): string {
  const project = projects.value.find((p) => p.id === projectId);
  return project ? project.color : '#cccccc';
}

// Жизненный цикл
onMounted(async () => {
  await projectsStore.fetchProjects();
  await timeEntriesStore.fetchTimeEntries();

  // Проверяем, не запущен ли уже таймер
  if (timeEntriesStore.currentEntry) {
    isRunning.value = true;
    selectedProjectId.value = timeEntriesStore.currentEntry.projectId;
    description.value = timeEntriesStore.currentEntry.description;
    startTime.value = timeEntriesStore.currentEntry.startTime;

    timerInterval.value = window.setInterval(() => {
      elapsedTime.value = (Date.now() - startTime.value) / 1000;
    }, 1000);
  }
});

onUnmounted(() => {
  if (timerInterval.value) {
    clearInterval(timerInterval.value);
  }
});
</script>

<style scoped>
.timer-view {
  padding: 2rem .75rem;
  max-width: 800px;
  margin: 0 auto;
}

.timer-controls {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 2rem;
  padding: 1.5rem;
  background-color: #f5f5f5;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.project-select,
.description {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

select,
input {
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
}

.timer-display {
  font-size: 2.5rem;
  font-weight: bold;
  text-align: center;
  margin: 1rem 0;
}

.timer-buttons {
  display: flex;
  justify-content: center;
}

button {
  padding: 0.75rem 2rem;
  font-size: 1rem;
  border: none;
  border-radius: 4px;
  background-color: #3498db;
  color: white;
  cursor: pointer;
  transition: background-color 0.2s;
}

button:hover {
  background-color: #2980b9;
}

button.stop {
  background-color: #e74c3c;
}

button.stop:hover {
  background-color: #c0392b;
}

.recent-entries {
  margin-top: 2rem;
}

.no-entries {
  color: #7f8c8d;
  font-style: italic;
  margin-top: 1rem;
}

.entry-item {
  display: flex;
  align-items: center;
  padding: 0.75rem;
  border-bottom: 1px solid #ecf0f1;
  gap: 1rem;
}

.entry-project {
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  color: white;
  font-size: 0.8rem;
  min-width: 100px;
  text-align: center;
}

.entry-description {
  flex: 1;
}

.entry-time {
  font-weight: bold;
}

.sync-pending {
  color: #e67e22;
  animation: spin 2s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
