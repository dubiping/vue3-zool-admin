import { createApp } from 'vue';
import App from './App.vue';

import { initAppConfigStore } from '/@/logics/initAppConfig';
import { setupRouter } from '/@/router';
import { setupStore } from '/@/store';
import { setupI18n } from '/@/locales/setupI18n';
import { setupGlobDirectives } from '/@/directives';

async function bootstrap() {
  const app = createApp(App);

  // Configure store
  setupStore(app);

  // Initialize internal system configuration
  initAppConfigStore();

  // Multilingual configuration
  // Asynchronous case: language files may be obtained from the server side
  await setupI18n(app);

  // Configure routing
  setupRouter(app);

  // Register global directive
  setupGlobDirectives(app);
  app.mount('#app');
}
bootstrap();
