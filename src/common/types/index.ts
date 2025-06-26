/**
 * 后端统一API响应格式
 */
export interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
}

/**
 * 通用的分页查询结果视图对象 (View Object)
 */
export interface PageVO<T> {
  list: T[];
  total: number;
  currentPage: number;
  pageSize: number;
  totalPages: number;
}

/**
 * 文章列表项的视图对象
 */
export interface ArticleItemVO {
  id: number;
  title: string;
  summary: string | null;
  coverImageUrl: string | null;
  viewCount: number;
  likeCount: number;
  publishedAt: string;
  createdAt: string;
  author: UserInfoVO;
  category: CategoryInfoVO;
  tags: TagInfoVO[];
}

/**
 * 简化的用户信息视图对象
 */
export interface UserInfoVO {
  id: number;
  nickname: string;
  avatarUrl: string | null;
}

/**
 * 简化的分类信息视图对象
 */
export interface CategoryInfoVO {
  id: number;
  name: string;
}

/**
 * 简化的标签信息视图对象
 */
export interface TagInfoVO {
  id: number;
  name: string;
}
