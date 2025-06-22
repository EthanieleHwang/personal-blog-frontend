import { createApp } from "vue";
import { createPinia } from "pinia";

// 引入 Element Plus
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
import * as ElementPlusIconsVue from "@element-plus/icons-vue";

import App from "./App.vue";
import router from "./router"; // 引入我们配置的路由

// 创建Vue应用实例
const app = createApp(App);

// 注册 Element Plus 图标组件
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component);
}

// 使用 Pinia
app.use(createPinia());
// 使用 Vue Router
app.use(router);
// 使用 Element Plus
app.use(ElementPlus);

// 挂载应用
app.mount("#app");
