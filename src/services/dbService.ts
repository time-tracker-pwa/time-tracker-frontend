import { openDB, DBSchema } from 'idb';

// Определяем типы для нашей БД
interface TimeTrackerDB extends DBSchema {
  timeEntries: {
    key: number;
    value: {
      id: number;
      projectId: number;
      description: string;
      startTime: number;
      endTime: number | null;
      duration: number;
      synced: boolean;
    };
    indexes: { 'by-projectId': number };
  };
  projects: {
    key: number;
    value: {
      id: number;
      name: string;
      color: string;
      synced: boolean;
    };
  };
}

// Создаем и открываем БД
const dbPromise = openDB<TimeTrackerDB>('time-tracker-db', 1, {
  upgrade(db) {
    // Создаем хранилище для записей времени
    const timeEntriesStore = db.createObjectStore('timeEntries', {
      keyPath: 'id',
    });
    // Создаем индекс для быстрого поиска по projectId
    timeEntriesStore.createIndex('by-projectId', 'projectId');

    // Создаем хранилище для проектов
    db.createObjectStore('projects', { keyPath: 'id' });
  },
});

// Сервис для работы с IndexedDB
export const dbService = {
  // Методы для работы с записями времени
  async getAllTimeEntries() {
    return (await dbPromise).getAll('timeEntries');
  },

  async getTimeEntry(id: number) {
    return (await dbPromise).get('timeEntries', id);
  },

  async getTimeEntriesByProject(projectId: number) {
    return (await dbPromise).getAllFromIndex(
      'timeEntries',
      'by-projectId',
      projectId
    );
  },

  async addTimeEntry(entry: TimeTrackerDB['timeEntries']['value']) {
    return (await dbPromise).put('timeEntries', entry);
  },

  async updateTimeEntry(entry: TimeTrackerDB['timeEntries']['value']) {
    return (await dbPromise).put('timeEntries', entry);
  },

  async deleteTimeEntry(id: number) {
    return (await dbPromise).delete('timeEntries', id);
  },

  // Методы для работы с проектами
  async getAllProjects() {
    return (await dbPromise).getAll('projects');
  },

  async getProject(id: number) {
    return (await dbPromise).get('projects', id);
  },

  async addProject(project: TimeTrackerDB['projects']['value']) {
    return (await dbPromise).put('projects', project);
  },

  async updateProject(project: TimeTrackerDB['projects']['value']) {
    return (await dbPromise).put('projects', project);
  },

  async deleteProject(id: number) {
    return (await dbPromise).delete('projects', id);
  },

  // Метод для получения несинхронизированных записей
  async getUnsyncedTimeEntries() {
    const allEntries = await this.getAllTimeEntries();
    return allEntries.filter((entry) => !entry.synced);
  },

  async getUnsyncedProjects() {
    const allProjects = await this.getAllProjects();
    return allProjects.filter((project) => !project.synced);
  },
};
