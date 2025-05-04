import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { TimeEntry } from '@/types';
import { api } from '@/services/api';
import { dbService } from '@/services/dbService';
import { syncService } from '@/services/syncService';

export const useTimeEntriesStore = defineStore('timeEntries', () => {
  const timeEntries = ref<TimeEntry[]>([]);
  const currentEntry = ref<TimeEntry | null>(null);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  // Загрузка записей
  async function fetchTimeEntries() {
    isLoading.value = true;
    error.value = null;

    try {
      // Сначала получаем данные из IndexedDB
      const localEntries = await dbService.getAllTimeEntries();
      timeEntries.value = localEntries;

      // Если онлайн, пытаемся получить свежие данные с сервера
      if (navigator.onLine) {
        try {
          const response = await api.get('/time-entries');

          // Обновляем локальную базу данных
          for (const entry of response.data) {
            await dbService.updateTimeEntry({
              ...entry,
              synced: true,
            });
          }

          // Обновляем состояние
          timeEntries.value = response.data;
        } catch (err) {
          console.error('Failed to fetch from API, using local data:', err);
        }
      }
    } catch (err) {
      error.value = 'Не удалось загрузить записи о времени';
      console.error('Error loading time entries:', err);
    } finally {
      isLoading.value = false;
    }
  }

  function sanitizeTimeEntry(entry) {
    // Создаем новый объект с только нужными свойствами
    return {
      id: entry.id,
      projectId: entry.projectId,
      description: entry.description,
      startTime: entry.startTime,
      endTime: entry.endTime,
      duration: entry.duration,
      synced: entry.synced,
    };
  }

  // Запуск таймера для новой записи
  function startTimer(projectId: number, description: string = '') {
    if (currentEntry.value) {
      stopTimer();
    }

    currentEntry.value = {
      id: Date.now(),
      projectId,
      description,
      startTime: Date.now(),
      endTime: null,
      duration: 0,
      synced: false,
    };

    // Сохраняем в IndexedDB
    // dbService.addTimeEntry(JSON.parse(JSON.stringify(currentEntry.value)));
    dbService.addTimeEntry(sanitizeTimeEntry(currentEntry.value));
  }

  // Остановка таймера и сохранение записи
  async function stopTimer() {
    if (!currentEntry.value) return;

    currentEntry.value.endTime = Date.now();
    currentEntry.value.duration =
      (currentEntry.value.endTime - currentEntry.value.startTime) / 1000;

    // Сохраняем в IndexedDB
    await dbService.updateTimeEntry(
      sanitizeTimeEntry(currentEntry.value)
    );

    // Добавляем в локальное состояние
    timeEntries.value.push({ ...currentEntry.value });

    // Пытаемся синхронизировать с сервером, если онлайн
    if (navigator.onLine) {
      try {
        await api.post('/time-entries', currentEntry.value);

        // Помечаем как синхронизированную
        const index = timeEntries.value.findIndex(
          (e) => e.id === currentEntry.value?.id
        );
        if (index !== -1) {
          timeEntries.value[index].synced = true;
          await dbService.updateTimeEntry({
            ...currentEntry.value,
            synced: true,
          });
        }
      } catch (err) {
        console.error('Failed to sync time entry:', err);
      }
    } else {
      // Если офлайн, регистрируем задачу для будущей синхронизации
      if ('serviceWorker' in navigator && 'SyncManager' in window) {
        navigator.serviceWorker.ready.then((registration) => {
          registration.sync
            .register('sync-time-entries')
            .then(() => console.log('Time entries sync registered'))
            .catch((err) =>
              console.error('Time entries sync registration failed:', err)
            );
        });
      }
    }

    currentEntry.value = null;
  }

  // Расчет общего времени за день
  const todayTotal = computed(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return timeEntries.value
      .filter((entry) => new Date(entry.startTime) >= today)
      .reduce((sum, entry) => sum + (entry.duration || 0), 0);
  });

  // Инициализация
  async function initialize() {
    // Загружаем записи
    await fetchTimeEntries();

    // Проверяем наличие незавершенной записи
    const entries = await dbService.getAllTimeEntries();
    const unfinishedEntry = entries.find((entry) => entry.endTime === null);

    if (unfinishedEntry) {
      currentEntry.value = unfinishedEntry;
    }

    // Регистрируем событие для синхронизации
    syncService.registerSyncEvents();
  }

  return {
    timeEntries,
    currentEntry,
    isLoading,
    error,
    todayTotal,
    fetchTimeEntries,
    startTimer,
    stopTimer,
    initialize,
  };
});
