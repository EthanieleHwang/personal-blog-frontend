/**
 * 通用的分页查询结果视图对象 (View Object)
 * @template T 列表数据的类型
 */
export interface PageVO<T> {
  list: T[]; // 当前页数据列表
  total: number; // 总记录数
  currentPage: number; // 当前页码
  pageSize: number; // 每页数量
  totalPages: number; // 总页数
}

/**
 * 文章列表项的视图对象 (View Object)
 * 用于在文章列表页展示，不包含完整的文章内容
 */
export interface ArticleItemVO {
  id: number;
  title: string;
  summary: string | null;
  coverImageUrl: string | null;
  viewCount: number;
  likeCount: number;
  publishedAt: string; // 后端返回的是LocalDateTime，前端接收为string
  createdAt: string;

  // 关联对象信息
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

/**
 * 文章详情的视图对象
 */
export interface ArticleDetailVO extends ArticleItemVO {
  contentMd: string; // 包含完整的Markdown内容
  contentHtml: string; // (可选) 如果后端转换了HTML
  allowComment: boolean;
}

/**

     * 后端统一API响应格式
     * @template T 响应数据的类型
     */
export interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
}
