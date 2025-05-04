<template>
  <div class="projects-view">
    <div class="container">
      <div class="page-header">
        <h1>Проекты</h1>
        <button class="btn btn-primary" @click="openCreateProjectModal">
          <span class="icon-plus"></span> Новый проект
        </button>
      </div>

      <div v-if="isLoading" class="loading-indicator">
        <div class="spinner"></div>
        <p>Загрузка проектов...</p>
      </div>

      <div v-else-if="error" class="alert alert-danger">
        {{ error }}
      </div>

      <div v-else-if="projects.length === 0" class="empty-state">
        <div class="empty-icon">
          <span class="icon-folder-empty"></span>
        </div>
        <h3>У вас пока нет проектов</h3>
        <p>Создайте свой первый проект, чтобы начать отслеживать время</p>
        <button class="btn btn-primary" @click="openCreateProjectModal">
          Создать проект
        </button>
      </div>

      <div v-else class="projects-grid">
        <div
          v-for="project in projects"
          :key="project.id"
          class="project-card"
          :class="{
            active: selectedProject && selectedProject.id === project.id,
          }"
          @click="selectProject(project)"
        >
          <div
            class="project-color"
            :style="{ backgroundColor: project.color }"
          ></div>
          <div class="project-content">
            <div class="project-header">
              <h3 class="project-name">{{ project.name }}</h3>
              <div class="project-actions">
                <button
                  class="action-btn edit-btn"
                  @click.stop="openEditProjectModal(project)"
                  title="Редактировать"
                >
                  <span class="icon-edit"></span>
                </button>
                <button
                  class="action-btn delete-btn"
                  @click.stop="confirmDeleteProject(project)"
                  title="Удалить"
                >
                  <span class="icon-trash"></span>
                </button>
              </div>
            </div>
            <p class="project-description" v-if="project.description">
              {{ project.description }}
            </p>
            <p class="project-description" v-else>
              <span class="text-light">Нет описания</span>
            </p>

            <div class="project-stats">
              <div class="stat">
                <span class="stat-label">Сегодня:</span>
                <span class="stat-value">{{
                  formatDuration(getProjectTodayTime(project.id))
                }}</span>
              </div>
              <div class="stat">
                <span class="stat-label">Всего:</span>
                <span class="stat-value">{{
                  formatDuration(getProjectTotalTime(project.id))
                }}</span>
              </div>
            </div>

            <div class="project-footer">
              <span class="project-entries">
                {{ getProjectEntriesCount(project.id) }} записей
              </span>
              <span
                v-if="!project.synced"
                class="sync-pending"
                title="Ожидает синхронизации"
                >⟳</span
              >
            </div>
          </div>
        </div>
      </div>

      <!-- Детали проекта, если выбран проект -->
      <div v-if="selectedProject" class="project-details">
        <div class="details-header">
          <h2>
            <span
              class="project-color-dot"
              :style="{ backgroundColor: selectedProject.color }"
            ></span>
            {{ selectedProject.name }}
          </h2>
          <button class="btn btn-outline" @click="selectedProject = null">
            Закрыть
          </button>
        </div>

        <div class="details-content">
          <div class="details-section">
            <h3>О проекте</h3>
            <p v-if="selectedProject.description">
              {{ selectedProject.description }}
            </p>
            <p v-else class="text-light">Нет описания</p>
          </div>

          <div class="details-section">
            <h3>Статистика</h3>
            <div class="stats-grid">
              <div class="stat-card">
                <div class="stat-icon">
                  <span class="icon-today"></span>
                </div>
                <div class="stat-content">
                  <h4>Сегодня</h4>
                  <p class="stat-value">
                    {{
                      formatDuration(getProjectTodayTime(selectedProject.id))
                    }}
                  </p>
                </div>
              </div>

              <div class="stat-card">
                <div class="stat-icon">
                  <span class="icon-week"></span>
                </div>
                <div class="stat-content">
                  <h4>Эта неделя</h4>
                  <p class="stat-value">
                    {{ formatDuration(getProjectWeekTime(selectedProject.id)) }}
                  </p>
                </div>
              </div>

              <div class="stat-card">
                <div class="stat-icon">
                  <span class="icon-month"></span>
                </div>
                <div class="stat-content">
                  <h4>Этот месяц</h4>
                  <p class="stat-value">
                    {{
                      formatDuration(getProjectMonthTime(selectedProject.id))
                    }}
                  </p>
                </div>
              </div>

              <div class="stat-card">
                <div class="stat-icon">
                  <span class="icon-total"></span>
                </div>
                <div class="stat-content">
                  <h4>Всего</h4>
                  <p class="stat-value">
                    {{
                      formatDuration(getProjectTotalTime(selectedProject.id))
                    }}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div class="details-section">
            <div class="section-header">
              <h3>Последние записи</h3>
              <router-link
                :to="{
                  name: 'reports',
                  query: { projectId: selectedProject.id },
                }"
                class="btn btn-outline btn-sm"
              >
                Все записи
              </router-link>
            </div>

            <div
              v-if="getProjectEntries(selectedProject.id).length === 0"
              class="empty-entries"
            >
              <p>Нет записей для этого проекта</p>
            </div>

            <div v-else class="recent-entries">
              <div
                v-for="entry in getProjectEntries(selectedProject.id).slice(
                  0,
                  5
                )"
                :key="entry.id"
                class="entry-item"
              >
                <div class="entry-date">
                  {{ formatDate(entry.startTime) }}
                </div>
                <div class="entry-description">
                  {{ entry.description || 'Без описания' }}
                </div>
                <div class="entry-duration">
                  {{ formatDuration(entry.duration) }}
                </div>
              </div>
            </div>
          </div>

          <div class="details-actions">
            <router-link
              :to="{ name: 'timer', query: { projectId: selectedProject.id } }"
              class="btn btn-primary"
            >
              Запустить таймер
            </router-link>
            <button
              class="btn btn-outline"
              @click="openEditProjectModal(selectedProject)"
            >
              Редактировать проект
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Модальное окно для создания/редактирования проекта -->
    <div
      v-if="showProjectModal"
      class="modal-overlay"
      @click="closeProjectModal"
    >
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>{{ isEditMode ? 'Редактировать проект' : 'Новый проект' }}</h3>
          <button class="close-button" @click="closeProjectModal">
            &times;
          </button>
        </div>

        <div class="modal-body">
          <form @submit.prevent="saveProject">
            <div class="form-group">
              <label for="projectName">Название проекта</label>
              <input
                type="text"
                id="projectName"
                v-model="projectForm.name"
                required
                :disabled="isSaving"
              />
            </div>

            <div class="form-group">
              <label for="projectDescription">Описание (необязательно)</label>
              <textarea
                id="projectDescription"
                v-model="projectForm.description"
                rows="4"
                :disabled="isSaving"
              ></textarea>
            </div>

            <div class="form-group">
              <label>Цвет проекта</label>
              <div class="color-picker">
                <div
                  v-for="color in projectColors"
                  :key="color"
                  class="color-option"
                  :class="{ selected: projectForm.color === color }"
                  :style="{ backgroundColor: color }"
                  @click="projectForm.color = color"
                ></div>
              </div>
            </div>

            <div class="form-actions">
              <button
                type="button"
                class="btn btn-outline"
                @click="closeProjectModal"
                :disabled="isSaving"
              >
                Отмена
              </button>
              <button
                type="submit"
                class="btn btn-primary"
                :disabled="isSaving || !projectForm.name"
              >
                <span v-if="isSaving">Сохранение...</span>
                <span v-else>{{ isEditMode ? 'Сохранить' : 'Создать' }}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Модальное окно подтверждения удаления -->
    <div
      v-if="showDeleteConfirm"
      class="modal-overlay"
      @click="showDeleteConfirm = false"
    >
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>Удалить проект</h3>
          <button class="close-button" @click="showDeleteConfirm = false">
            &times;
          </button>
        </div>

        <div class="modal-body">
          <p>
            Вы уверены, что хотите удалить проект "{{ projectToDelete?.name }}"?
          </p>
          <p class="text-danger">
            Это действие нельзя отменить. Все записи времени, связанные с этим
            проектом, также будут удалены.
          </p>

          <div class="form-actions">
            <button
              type="button"
              class="btn btn-outline"
              @click="showDeleteConfirm = false"
              :disabled="isDeleting"
            >
              Отмена
            </button>
            <button
              type="button"
              class="btn btn-danger"
              @click="deleteProject"
              :disabled="isDeleting"
            >
              <span v-if="isDeleting">Удаление...</span>
              <span v-else>Удалить</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useProjectsStore } from '@/stores/projects';
import { useTimeEntriesStore } from '@/stores/timeEntries';
import dayjs from 'dayjs';
import { Project } from '@/types';

// Инициализация хранилищ
const projectsStore = useProjectsStore();
const timeEntriesStore = useTimeEntriesStore();

// Состояние проектов
const isLoading = computed(() => projectsStore.isLoading);
const error = computed(() => projectsStore.error);
const projects = computed(() => projectsStore.projects);

// Состояние для выбранного проекта и модальных окон
const selectedProject = ref<Project | null>(null);
const showProjectModal = ref(false);
const isEditMode = ref(false);
const isSaving = ref(false);
const showDeleteConfirm = ref(false);
const projectToDelete = ref<Project | null>(null);
const isDeleting = ref(false);

// Доступные цвета проектов
const projectColors = [
  '#3498db', // синий
  '#2ecc71', // зеленый
  '#e74c3c', // красный
  '#f39c12', // оранжевый
  '#9b59b6', // фиолетовый
  '#1abc9c', // бирюзовый
  '#34495e', // темно-синий
  '#e67e22', // темно-оранжевый
  '#16a085', // темно-бирюзовый
  '#d35400', // коричневый
  '#27ae60', // темно-зеленый
  '#c0392b', // темно-красный
];

// Форма проекта
const projectForm = ref({
  id: 0,
  name: '',
  description: '',
  color: projectColors[0],
});

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

function getProjectTotalTime(projectId: number): number {
  return timeEntriesStore.timeEntries
    .filter((entry) => entry.projectId === projectId)
    .reduce((sum, entry) => sum + (entry.duration || 0), 0);
}

function getProjectTodayTime(projectId: number): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return timeEntriesStore.timeEntries
    .filter(
      (entry) =>
        entry.projectId === projectId && new Date(entry.startTime) >= today
    )
    .reduce((sum, entry) => sum + (entry.duration || 0), 0);
}

function getProjectWeekTime(projectId: number): number {
  const startOfWeek = new Date();
  startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
  startOfWeek.setHours(0, 0, 0, 0);

  return timeEntriesStore.timeEntries
    .filter(
      (entry) =>
        entry.projectId === projectId &&
        new Date(entry.startTime) >= startOfWeek
    )
    .reduce((sum, entry) => sum + (entry.duration || 0), 0);
}

function getProjectMonthTime(projectId: number): number {
  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  return timeEntriesStore.timeEntries
    .filter(
      (entry) =>
        entry.projectId === projectId &&
        new Date(entry.startTime) >= startOfMonth
    )
    .reduce((sum, entry) => sum + (entry.duration || 0), 0);
}

function getProjectEntriesCount(projectId: number): number {
  return timeEntriesStore.timeEntries.filter(
    (entry) => entry.projectId === projectId
  ).length;
}

function getProjectEntries(projectId: number) {
  return [...timeEntriesStore.timeEntries]
    .filter((entry) => entry.projectId === projectId)
    .sort((a, b) => b.startTime - a.startTime);
}

function selectProject(project: Project) {
  selectedProject.value = project;
}

function openCreateProjectModal() {
  isEditMode.value = false;
  projectForm.value = {
    id: 0,
    name: '',
    description: '',
    color: projectColors[0],
  };
  showProjectModal.value = true;
}

function openEditProjectModal(project: Project) {
  isEditMode.value = true;
  projectForm.value = {
    id: project.id,
    name: project.name,
    description: project.description || '',
    color: project.color,
  };
  showProjectModal.value = true;
}

function closeProjectModal() {
  showProjectModal.value = false;
}

async function saveProject() {
  try {
    isSaving.value = true;

    if (isEditMode.value) {
      // Обновление существующего проекта
      await projectsStore.updateProject({
        id: projectForm.value.id,
        name: projectForm.value.name,
        description: projectForm.value.description,
        color: projectForm.value.color,
      });

      // Обновляем выбранный проект, если он редактируется
      if (
        selectedProject.value &&
        selectedProject.value.id === projectForm.value.id
      ) {
        selectedProject.value =
          projects.value.find((p) => p.id === projectForm.value.id) || null;
      }
    } else {
      // Создание нового проекта
      await projectsStore.addProject(
        projectForm.value.name,
        projectForm.value.color,
        projectForm.value.description
      );

      // Выбираем новый проект, предполагая, что новый проект добавлен в конец массива
      selectedProject.value = projects.value[projects.value.length - 1];
    }

    closeProjectModal();
  } catch (error) {
    console.error('Ошибка при сохранении проекта:', error);
  } finally {
    isSaving.value = false;
  }
}

function confirmDeleteProject(project: Project) {
  projectToDelete.value = project;
  showDeleteConfirm.value = true;
}

async function deleteProject() {
  if (!projectToDelete.value) return;

  try {
    isDeleting.value = true;

    await projectsStore.deleteProject(projectToDelete.value.id);

    // Если удаляемый проект выбран, сбрасываем выбор
    if (
      selectedProject.value &&
      selectedProject.value.id === projectToDelete.value.id
    ) {
      selectedProject.value = null;
    }

    showDeleteConfirm.value = false;
  } catch (error) {
    console.error('Ошибка при удалении проекта:', error);
  } finally {
    isDeleting.value = false;
    projectToDelete.value = null;
  }
}

// Жизненный цикл
onMounted(async () => {
  // Загружаем проекты и записи времени
  if (projects.value.length === 0) {
    await projectsStore.fetchProjects();
  }

  if (timeEntriesStore.timeEntries.length === 0) {
    await timeEntriesStore.fetchTimeEntries();
  }
});
</script>

<style scoped>
.projects-view {
  padding: 2rem 0;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.loading-indicator {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem 0;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 3px solid rgba(0, 0, 0, 0.1);
  border-radius: 50%;
  border-top-color: var(--primary-color);
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.empty-state {
  text-align: center;
  padding: 3rem 0;
}

.empty-icon {
  font-size: 4rem;
  color: var(--text-light);
  margin-bottom: 1rem;
}

.projects-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.project-card {
  background-color: var(--card-background);
  border-radius: var(--border-radius);
  box-shadow: var(--box-shadow);
  overflow: hidden;
  transition: transform var(--transition-speed),
    box-shadow var(--transition-speed);
  cursor: pointer;
  position: relative;
}

.project-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
}

.project-card.active {
  box-shadow: 0 0 0 2px var(--primary-color);
}

.project-color {
  height: 8px;
  background-color: var(--primary-color);
}

.project-content {
  padding: 1.5rem;
}

.project-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
}

.project-name {
  margin: 0;
  font-size: 1.25rem;
}

.project-actions {
  display: flex;
  gap: 0.5rem;
}

.action-btn {
  background: none;
  border: none;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  opacity: 0.5;
  transition: background-color var(--transition-speed),
    opacity var(--transition-speed);
}

.action-btn:hover {
  opacity: 1;
  background-color: rgba(0, 0, 0, 0.05);
}

.edit-btn {
  color: var(--primary-color);
}

.delete-btn {
  color: var(--danger-color);
}

.project-description {
  margin-bottom: 1rem;
  color: var(--text-color);
  max-height: 60px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
}

.project-stats {
  display: flex;
  justify-content: space-between;
  margin-bottom: 1rem;
  border-top: 1px solid var(--border-color);
  padding-top: 1rem;
}

.stat {
  display: flex;
  flex-direction: column;
}

.stat-label {
  font-size: 0.75rem;
  color: var(--text-light);
}

.stat-value {
  font-weight: bold;
  font-size: 1rem;
}

.project-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.875rem;
  color: var(--text-light);
}

.sync-pending {
  color: var(--warning-color);
  animation: spin 2s linear infinite;
}

/* Детали проекта */
.project-details {
  background-color: var(--card-background);
  border-radius: var(--border-radius);
  box-shadow: var(--box-shadow);
  margin-top: 2rem;
  margin-bottom: 2rem;
  overflow: hidden;
}

.details-header {
  padding: 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid var(--border-color);
}

.details-header h2 {
  margin: 0;
  display: flex;
  align-items: center;
}

.project-color-dot {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  margin-right: 0.75rem;
}

.details-content {
  padding: 1.5rem;
}

.details-section {
  margin-bottom: 2rem;
}

.details-section:last-child {
  margin-bottom: 0;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.section-header h3 {
  margin: 0;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.stat-card {
  background-color: var(--background-color);
  padding: 1.25rem;
  border-radius: var(--border-radius);
  display: flex;
  align-items: center;
  gap: 1rem;
}

.stat-icon {
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  background-color: rgba(52, 152, 219, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--primary-color);
  font-size: 1.25rem;
}

.stat-content {
  flex: 1;
}

.stat-content h4 {
  margin: 0 0 0.25rem;
  font-size: 0.875rem;
}

.stat-content .stat-value {
  font-size: 1.25rem;
  margin: 0;
}

.empty-entries {
  padding: 2rem;
  text-align: center;
  color: var(--text-light);
  background-color: var(--background-color);
  border-radius: var(--border-radius);
}

.recent-entries {
  background-color: var(--background-color);
  border-radius: var(--border-radius);
  overflow: hidden;
}

.entry-item {
  display: flex;
  padding: 1rem;
  border-bottom: 1px solid var(--border-color);
}

.entry-item:last-child {
  border-bottom: none;
}

.entry-date {
  width: 120px;
  flex-shrink: 0;
  font-size: 0.875rem;
  color: var(--text-light);
}

.entry-description {
  flex: 1;
  margin: 0 1rem;
}

.entry-duration {
  font-weight: bold;
  text-align: right;
  width: 80px;
  flex-shrink: 0;
}

.details-actions {
  display: flex;
  justify-content: flex-start;
  gap: 1rem;
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 1px solid var(--border-color);
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
  background-color: var(--card-background);
  border-radius: var(--border-radius);
  width: 90%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-header {
  padding: 1.25rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid var(--border-color);
}

.modal-header h3 {
  margin: 0;
}

.close-button {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: var(--text-light);
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: background-color var(--transition-speed);
}

.close-button:hover {
  background-color: rgba(0, 0, 0, 0.05);
}

.modal-body {
  padding: 1.25rem;
}

.color-picker {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-top: 0.5rem;
}

.color-option {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  cursor: pointer;
  transition: transform var(--transition-speed);
  border: 2px solid transparent;
}

.color-option:hover {
  transform: scale(1.15);
}

.color-option.selected {
  border-color: var(--text-dark);
  transform: scale(1.15);
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1.5rem;
}

.text-danger {
  color: var(--danger-color);
}

/* Иконки */
.icon-folder-empty::before {
  content: '📁';
}
.icon-plus::before {
  content: '+';
}
.icon-edit::before {
  content: '✏️';
}
.icon-trash::before {
  content: '🗑️';
}
.icon-today::before {
  content: '📅';
}
.icon-week::before {
  content: '📆';
}
.icon-month::before {
  content: '📅';
}
.icon-total::before {
  content: '🕒';
}

/* Адаптивная верстка */
</style>
