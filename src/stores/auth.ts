import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { api } from '@/services/api';
import router from '@/router';

interface User {
  id: number;
  email: string;
  name: string;
}

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
}

export const useAuthStore = defineStore('auth', () => {
  const token = ref<string | null>(localStorage.getItem('auth_token'));
  const user = ref<User | null>(null);
  const loading = ref(false);
  const error = ref<string | null>(null);

  // Вычисляемые свойства
  const isAuthenticated = computed(() => !!token.value);

  // Загрузка профиля пользователя
  async function fetchUserProfile() {
    if (!token.value) return;

    try {
      loading.value = true;
      const response = await api.get('/auth/me');
      user.value = response.data;
    } catch (err: any) {
      console.error('Ошибка при загрузке профиля:', err);
      // Если ошибка 401, то токен неверный или истек
      if (err.response && err.response.status === 401) {
        logout();
      }
    } finally {
      loading.value = false;
    }
  }

  // Вход пользователя
  async function login(credentials: LoginCredentials) {
    try {
      loading.value = true;
      error.value = null;

      const response = await api.post('/auth/login', credentials);
      token.value = response.data.token;

      // Сохраняем токен в localStorage
      localStorage.setItem('auth_token', token.value);

      // Загружаем профиль пользователя
      await fetchUserProfile();

      // Перенаправление на главную страницу
      router.push('/');

      return true;
    } catch (err: any) {
      console.error('Ошибка входа:', err);

      if (err.response && err.response.data && err.response.data.message) {
        error.value = err.response.data.message;
      } else {
        error.value =
          'Произошла ошибка при входе. Пожалуйста, попробуйте снова.';
      }

      return false;
    } finally {
      loading.value = false;
    }
  }

  // Регистрация пользователя
  async function register(data: RegisterData) {
    try {
      loading.value = true;
      error.value = null;

      await api.post('/auth/register', data);

      // После успешной регистрации входим с новыми учетными данными
      return await login({
        email: data.email,
        password: data.password,
      });
    } catch (err: any) {
      console.error('Ошибка регистрации:', err);

      if (err.response && err.response.data && err.response.data.message) {
        error.value = err.response.data.message;
      } else {
        error.value =
          'Произошла ошибка при регистрации. Пожалуйста, попробуйте снова.';
      }

      return false;
    } finally {
      loading.value = false;
    }
  }

  // Выход пользователя
  function logout() {
    // Удаляем токен из localStorage
    localStorage.removeItem('auth_token');
    token.value = null;
    user.value = null;

    // Перенаправление на страницу входа
    router.push('/login');
  }

  // Обновление профиля пользователя
  async function updateProfile(data: Partial<User>) {
    try {
      loading.value = true;
      error.value = null;

      const response = await api.put('/users/profile', data);
      user.value = response.data;

      return true;
    } catch (err: any) {
      console.error('Ошибка обновления профиля:', err);

      if (err.response && err.response.data && err.response.data.message) {
        error.value = err.response.data.message;
      } else {
        error.value =
          'Произошла ошибка при обновлении профиля. Пожалуйста, попробуйте снова.';
      }

      return false;
    } finally {
      loading.value = false;
    }
  }

  // Изменение пароля
  async function changePassword(oldPassword: string, newPassword: string) {
    try {
      loading.value = true;
      error.value = null;

      await api.put('/users/password', {
        oldPassword,
        newPassword,
      });

      return true;
    } catch (err: any) {
      console.error('Ошибка изменения пароля:', err);

      if (err.response && err.response.data && err.response.data.message) {
        error.value = err.response.data.message;
      } else {
        error.value =
          'Произошла ошибка при изменении пароля. Пожалуйста, попробуйте снова.';
      }

      return false;
    } finally {
      loading.value = false;
    }
  }

  // Сброс пароля
  async function resetPassword(email: string) {
    try {
      loading.value = true;
      error.value = null;

      await api.post('/auth/reset-password', { email });

      return true;
    } catch (err: any) {
      console.error('Ошибка сброса пароля:', err);

      if (err.response && err.response.data && err.response.data.message) {
        error.value = err.response.data.message;
      } else {
        error.value =
          'Произошла ошибка при сбросе пароля. Пожалуйста, попробуйте снова.';
      }

      return false;
    } finally {
      loading.value = false;
    }
  }

  // Проверка авторизации при инициализации хранилища
  function initialize() {
    if (token.value) {
      fetchUserProfile();
    }
  }

  return {
    token,
    user,
    loading,
    error,
    isAuthenticated,
    login,
    register,
    logout,
    fetchUserProfile,
    updateProfile,
    changePassword,
    resetPassword,
    initialize,
  };
});
