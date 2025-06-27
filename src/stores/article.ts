import { defineStore } from "pinia";
import { ref } from "vue";
import request from "../common/utils/request"; // 确认路径正确
import type { PageVO, ArticleItemVO } from "../common/types/index"; // 确认路径正确

export const useArticleStore = defineStore("article", () => {
  // State
  const articles = ref<ArticleItemVO[]>([]);
  const total = ref(0);
  const loading = ref(false);

  // Action
  async function fetchArticles(params: {
    pageNum?: number;
    pageSize?: number;
    categoryId?: number;
    tagId?: number;
    keyword?: string;
  }) {
    loading.value = true;
    try {
      // 因为响应拦截器已经处理了外层包装，这里直接接收 PageVO<ArticleItemVO>
      const pageData = await request.get<PageVO<ArticleItemVO>>(
        "/api/articles",
        { params }
      );

      // 直接使用返回的核心数据
      // Destructure for cleaner access and add null/undefined checks for robustness
      if (pageData) {
        const { list, total: pageTotal } = pageData;
        articles.value = list || []; // Ensure list is an array, default to empty if null/undefined
        total.value = pageTotal || 0; // Ensure total is a number, default to 0 if null/undefined
      } else {
        // Handle cases where pageData or pageData.data is null/undefined
        console.warn(
          "Received unexpected API response structure for articles."
        );
        articles.value = [];
        total.value = 0;
      }
    } catch (error) {
      console.error("Failed to fetch articles:", error);
      // 清空数据，避免显示旧的错误数据
      articles.value = [];
      total.value = 0;
    } finally {
      loading.value = false;
    }
  }

  return {
    articles,
    total,
    loading,
    fetchArticles,
  };
});
