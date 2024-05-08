import { createSSRApp } from "vue";
import App from "./App.vue";
import Pinia,{ createPinia  } from "pinia"
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import myRouter from "./router";

const pinia : Pinia.Pinia = createPinia();
pinia.use(piniaPluginPersistedstate);

export function createApp() {
  
  const app = createSSRApp(App);
  //app.config.warnHandler = () => null;
  app.use(myRouter);
  app.use(pinia);
  
  return {
    app,
    pinia
  };
}
