import { defineStore } from "pinia";
import { ref, computed } from "vue";
// import { useRouter } from 'vue-router' // 暂时不在这里用router

export const useAuthStore = defineStore("auth", () => {
  // --- State ---
  const token = ref<string | null>(localStorage.getItem("token"));
  const user = ref<any>(null); // 用于存储用户信息

  // --- Getters (计算属性) ---
  // 【【【 这就是我们需要添加的关键部分 】】】
  const isLoggedIn = computed(() => !!token.value);

  // --- Actions (方法) ---
  function setToken(newToken: string) {
    token.value = newToken;
    localStorage.setItem("token", newToken);
  }

 // src/stores/auth.ts
function logout() {
  token.value = null; // 1. 清除Pinia内存中的token
  user.value = null; // 2. 清除用户信息
  localStorage.removeItem('token'); // 3. 【核心】清除localStorage中的token
}

  return {
    // State
    token,
    user,
    // Getters
    isLoggedIn,
    // Actions
    setToken,
    logout,
  };
});
