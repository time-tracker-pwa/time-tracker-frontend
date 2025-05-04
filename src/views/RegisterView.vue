<template>
  <div class="auth-container">
    <div class="auth-card">
      <h1 class="auth-title">Регистрация</h1>

      <div v-if="authStore.error" class="alert alert-danger">
        {{ authStore.error }}
      </div>

      <form @submit.prevent="handleRegister" class="auth-form">
        <div class="form-group">
          <label for="name">Имя</label>
          <input
            type="text"
            id="name"
            v-model="name"
            required
            autocomplete="name"
            :disabled="authStore.loading"
          />
        </div>

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
            autocomplete="new-password"
            :disabled="authStore.loading"
          />
          <p class="input-help">Минимум 8 символов</p>
        </div>

        <div class="form-group">
          <label for="passwordConfirm">Подтверждение пароля</label>
          <input
            type="password"
            id="passwordConfirm"
            v-model="passwordConfirm"
            required
            autocomplete="new-password"
            :disabled="authStore.loading"
          />
          <p v-if="passwordError" class="input-error">{{ passwordError }}</p>
        </div>

        <button
          type="submit"
          class="btn btn-primary btn-block"
          :disabled="authStore.loading || !!passwordError"
        >
          <span v-if="authStore.loading">Загрузка...</span>
          <span v-else>Зарегистрироваться</span>
        </button>
      </form>

      <div class="auth-footer">
        <p>Уже есть аккаунт? <router-link to="/login">Войти</router-link></p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { useAuthStore } from '@/stores/auth';

const authStore = useAuthStore();

const name = ref('');
const email = ref('');
const password = ref('');
const passwordConfirm = ref('');

const passwordError = computed(() => {
  if (!password.value || !passwordConfirm.value) return '';

  if (password.value.length < 8) {
    return 'Пароль должен содержать не менее 8 символов';
  }

  if (password.value !== passwordConfirm.value) {
    return 'Пароли не совпадают';
  }

  return '';
});

// Сбрасываем ошибку при изменении полей
watch([name, email, password, passwordConfirm], () => {
  if (authStore.error) {
    authStore.error = null;
  }
});

async function handleRegister() {
  if (!name.value || !email.value || !password.value || passwordError.value) {
    return;
  }

  await authStore.register({
    name: name.value,
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

.input-help {
  margin-top: 0.25rem;
  font-size: 0.75rem;
  color: var(--text-light);
}

.input-error {
  margin-top: 0.25rem;
  font-size: 0.75rem;
  color: var(--danger-color);
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
