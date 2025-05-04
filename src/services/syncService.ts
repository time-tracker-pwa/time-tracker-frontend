import { api } from './api';
import { dbService } from './dbService';

export const syncService = {
  async syncAll() {
    if (!navigator.onLine) {
      console.log('Cannot sync: You are offline');
      return false;
    }

    // Синхронизация проектов
    const unsyncedProjects = await dbService.getUnsyncedProjects();
    for (const project of unsyncedProjects) {
      try {
        const response = await api.post('/projects', project);

        // Обновляем проект в БД, помечая как синхронизированный
        await dbService.updateProject({
          ...project,
          id: response.data.id || project.id, // Используем ID с сервера, если доступен
          synced: true,
        });

        console.log(`Project ${project.id} synced successfully`);
      } catch (error) {
        console.error(`Failed to sync project ${project.id}:`, error);
      }
    }

    // Синхронизация записей о времени
    const unsyncedEntries = await dbService.getUnsyncedTimeEntries();
    for (const entry of unsyncedEntries) {
      try {
        const response = await api.post('/time-entries', entry);

        // Обновляем запись в БД, помечая как синхронизированную
        await dbService.updateTimeEntry({
          ...entry,
          id: response.data.id || entry.id, // Используем ID с сервера, если доступен
          synced: true,
        });

        console.log(`Time entry ${entry.id} synced successfully`);
      } catch (error) {
        console.error(`Failed to sync time entry ${entry.id}:`, error);
      }
    }

    return true;
  },

  // Регистрируем слушатель для автоматической синхронизации при подключении к сети
  registerSyncEvents() {
    window.addEventListener('online', this.syncAll);

    // Также можно использовать Background Sync API, если он поддерживается
    if ('serviceWorker' in navigator && 'SyncManager' in window) {
      navigator.serviceWorker.ready.then((registration) => {
        // Регистрируем синхронизацию в фоне
        registration.sync
          .register('sync-time-entries')
          .then(() => console.log('Background sync registered'))
          .catch((err) =>
            console.error('Background sync registration failed:', err)
          );
      });
    }
  },
};
