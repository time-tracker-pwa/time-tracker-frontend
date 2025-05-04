<template>
  <div class="auth-container">
    <div class="auth-card">
      <h1 class="auth-title">Вход в систему</h1>

      <div v-if="authStore.error" class="alert alert-danger">
        {{ authStore.error }}
      </div>

      <form @submit.prevent="handleLogin" class="auth-form">
        <div class="form-group">
          <label for="email">Email</label>
          <input
            type="email"
            id="email"
            v-model="email"
            required
            autocomplete="email"
            :disabled="authStore.loading"
          />
        </div>

        <div class="form-group">
          <label for="password">Пароль</label>
          <input
            type="password"
            id="password"
            v-model="password"
            required
            autocomplete="current-password"
            :disabled="authStore.loading"
          />
        </div>

        <div class="form-actions">
          <router-link to="/forgot-password" class="forgot-password">
            Забыли пароль?
          </router-link>

          <button
            type="submit"
            class="btn btn-primary btn-block"
            :disabled="authStore.loading"
          >
            <span v-if="authStore.loading">Загрузка...</span>
            <span v-else>Войти</span>
          </button>
        </div>
      </form>

      <div class="auth-footer">
        <p>
          Нет аккаунта?
          <router-link to="/register">Зарегистрироваться</router-link>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useAuthStore } from '@/stores/auth';

const authStore = useAuthStore();

const email = ref('');
const password = ref('');

async function handleLogin() {
  if (!email.value || !password.value) return;

  await authStore.login({
    email: email.value,
    password: password.value,
  });
}
</script>

<style scoped>
.auth-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - var(--header-height) - var(--footer-padding));
  padding: 2rem 1rem;
}

.auth-card {
  width: 100%;
  max-width: 400px;
  background: var(--card-background);
  border-radius: var(--border-radius);
  box-shadow: var(--box-shadow);
  padding: 2rem;
}

.auth-title {
  text-align: center;
  margin-bottom: 2rem;
  color: var(--text-dark);
}

.auth-form {
  margin-bottom: 1.5rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  color: var(--text-color);
}

input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius);
  transition: border-color var(--transition-speed);
}

input:focus {
  outline: none;
  border-color: var(--primary-color);
}

.form-actions {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.forgot-password {
  text-align: right;
  font-size: 0.875rem;
  color: var(--text-light);
  text-decoration: none;
  transition: color var(--transition-speed);
}

.forgot-password:hover {
  color: var(--primary-color);
}

.btn-block {
  width: 100%;
}

.auth-footer {
  text-align: center;
  margin-top: 1.5rem;
  font-size: 0.875rem;
  color: var(--text-light);
}

.auth-footer a {
  color: var(--primary-color);
  text-decoration: none;
  font-weight: 500;
}

.auth-footer a:hover {
  text-decoration: underline;
}
</style>
