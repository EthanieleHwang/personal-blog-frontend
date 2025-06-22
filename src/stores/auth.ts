import { defineStore } from "pinia";
import { ref } from "vue";

export const useAuthStore = defineStore("auth", () => {
  // 状态：Token
  const token = ref(localStorage.getItem("token") || null);

  // 动作：设置Token
  function setToken(newToken: string) {
    token.value = newToken;
    localStorage.setItem("token", newToken);
  }

  // 动作：移除Token (登出时使用)
  function removeToken() {
    token.value = null;
    localStorage.removeItem("token");
  }

  return { token, setToken, removeToken };
});
