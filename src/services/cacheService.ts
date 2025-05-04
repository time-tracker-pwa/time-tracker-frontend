// Ключи для кэша
const CACHE_KEYS = {
  TIME_ENTRIES: 'timeEntries',
  PROJECTS: 'projects',
  USER_SETTINGS: 'userSettings',
};

// Сервис для работы с кэшированием
export const cacheService = {
  /**
   * Сохранить данные в кэш
   */
  saveToCache<T>(key: string, data: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
      console.error('Error saving to cache:', error);
    }
  },

  /**
   * Получить данные из кэша
   */
  getFromCache<T>(key: string): T | null {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Error reading from cache:', error);
      return null;
    }
  },

  /**
   * Удалить данные из кэша
   */
  removeFromCache(key: string): void {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error('Error removing from cache:', error);
    }
  },

  /**
   * Очистить весь кэш
   */
  clearCache(): void {
    try {
      localStorage.clear();
    } catch (error) {
      console.error('Error clearing cache:', error);
    }
  },
};

// Экспортируем ключи для доступа из других модулей
export { CACHE_KEYS };
