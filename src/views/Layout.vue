    <template>
      <el-container class="main-layout">
        <!-- 头部保持不变 -->
        <el-header class="header">
          <HeaderComponent />
        </el-header>
        
        <!-- 【【【 核心修改：改造ElMain区域 】】】 -->
        <el-main class="main-container">
          <el-row :gutter="20">
            <!-- 主内容区域 -->
            <el-col :span="18">
              <!-- 子路由的出口，文章列表或文章详情会在这里显示 -->
              <router-view />
            </el-col>

            <!-- 侧边栏区域 -->
            <el-col :span="6">
              <div class="sidebar">
                <!-- 分类列表组件 -->
                <CategoryList />
                <!-- 标签云组件 -->
                <TagCloud />
                  </div>
            </el-col>
          </el-row>
        </el-main>

        <!-- 底部保持不变 -->
        <el-footer class="footer">
          <FooterComponent />
        </el-footer>
      </el-container>
    </template>

    <script setup lang="ts">
    import HeaderComponent from '../components/HeaderComponent.vue';
    import FooterComponent from '../components/FooterComponent.vue';
    // 【【【 引入我们新创建的组件 】】】
    import CategoryList from '../components/CategoryList.vue';
    import TagCloud from '../components/TagCloud.vue';
    </script>

    <style scoped>
    .main-layout {
      min-height: 100vh;
      display: flex;
      flex-direction: column;
    }
    .header {
      padding: 0;
      border-bottom: 1px solid #e4e7ed;
      position: sticky; /* 让头部在滚动时固定在顶部 */
      top: 0;
      z-index: 100;
      background-color: #ffffff;
    }
    .main-container {
      flex: 1; /* 让主内容区域占据剩余的所有空间 */
      max-width: 1280px;
      margin: 20px auto; /* 顶部增加一些间距 */
      width: 100%;
      padding: 0 20px; /* 左右增加内边距 */
    }
    .footer {
      padding: 0;
    }
    .sidebar {
      /* (可选) 可以为侧边栏添加一些样式 */
    }
    </style>