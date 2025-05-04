import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from './router/index';
import './main.css';
import { registerSW } from 'virtual:pwa-register';

// Функция для обновления PWA при появлении новой версии
const { updateSW } = registerSW({
  onNeedRefresh() {
    // Показать уведомление о необходимости обновления
    if (confirm('Доступна новая версия приложения. Обновить?')) {
      updateSW();
    }
  },
  onOfflineReady() {
    console.log('Приложение готово к работе офлайн');
  },
});

const app = createApp(App);

app.use(createPinia());
app.use(router);

app.mount('#app');
