<template>
  <nav class="navbar">
    <!-- 左侧Logo -->
    <router-link to="/" class="logo">梦境博物馆</router-link>

    <!-- 中间导航链接（左移到logo旁） -->
    <div class="links">
      <router-link to="/film" class="link">电影馆</router-link>
      <router-link to="/art" class="link">画作馆</router-link>
      <router-link to="/dreams" class="link">大众梦境</router-link>
      <router-link to="/profile" class="link">个人中心</router-link>
    </div>

    <!-- 右侧搜索框（放大镜已缩小嵌入） -->
    <div class="search-container">
      <div class="search-box">
        <!-- 筛选下拉按钮 -->
        <button class="filter-btn" @click="showFilter = !showFilter">
          {{ searchType }}
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="6 9 12 15 18 9"></polyline>
          </svg>
        </button>

        <!-- 搜索输入框 -->
        <input 
          v-model="keyword"
          type="text"
          placeholder="搜索内容..."
          @keyup.enter="handleSearch"
        />

        <!-- 🔥 修改1：放大镜图标缩小为10x10，线条调细 -->
        <button class="search-btn" @click="handleSearch">
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
        </button>
      </div>

      <!-- 筛选下拉菜单 -->
      <div class="filter-menu" v-if="showFilter" @click.stop>
        <div class="filter-item" @click="chooseType('全部', 'all')">全部</div>
        <div class="filter-item" @click="chooseType('电影', 'film')">电影</div>
        <div class="filter-item" @click="chooseType('画作', 'art')">画作</div>
        <div class="filter-item" @click="chooseType('梦境帖子', 'dream')">梦境帖子</div>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// 搜索数据
const keyword = ref('')
const searchType = ref('全部')
const showFilter = ref(false)

// 选择筛选类型
const chooseType = (label, value) => {
  searchType.value = label
  showFilter.value = false
}

// 搜索逻辑
const handleSearch = () => {
  if (!keyword.value.trim()) return
  router.push(`/search?keyword=${keyword.value}&type=${searchType.value}`)
}

// 点击外部关闭下拉
const closeMenu = (e) => {
  if (!e.target.closest('.search-container')) {
    showFilter.value = false
  }
}

onMounted(() => document.addEventListener('click', closeMenu))
onUnmounted(() => document.removeEventListener('click', closeMenu))
</script>

<style scoped>
/* ====================== ✅ 核心修复：不遮挡 + 自适应 ====================== */
.navbar {
  /* 关键1：Fixed 改为 Sticky 粘性定位，不脱离文档流，永远不遮挡内容 */
  position: sticky;
  top: 0;
  /* 关键2：完整宽度 + 自动适配，不溢出屏幕 */
  width: 100%;
  box-sizing: border-box;
  z-index: 1000;

  display: flex;
  align-items: center;
  gap: 24px;
  padding: 16px 36px;
  /* 关键3：小屏幕自动换行，不会挤变形 */
  flex-wrap: wrap;

  background: linear-gradient(
    to right, 
    rgba(30, 31, 70, 0.598),
    rgba(25, 6, 80, 0.555)
  );
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 
    0 0 10px rgba(255, 180, 220, 0.1),
    0 0 15px rgba(68, 7, 236, 0.1);
}

/* 搜索框自动靠右 */
.search-container {
  margin-left: auto;
  position: relative;
}

/* ====================== 原有样式保留 ====================== */
.logo {
  color: #f8fafc;
  font-size: 20px;
  font-weight: 700;
  letter-spacing: 1.5px;
  white-space: nowrap;
}

.links {
  display: flex;
  gap: 20px;
  align-items: center;
  flex-wrap: wrap;
}

.link {
  color: rgba(248, 250, 252, 0.78);
  font-size: 15px;
  letter-spacing: 0.8px;
  padding: 6px 8px;
  border-radius: 999px;
  transition: color 0.2s ease, background-color 0.2s ease;
  white-space: nowrap;
}

.link:hover,
.link.router-link-active {
  color: #ffffff;
  background: rgba(255, 255, 255, 0.14);
}

/* ====================== 搜索框样式 ====================== */
.search-box {
  display: flex;
  align-items: center;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 180, 220, 0.2);
  border-radius: 999px;
  padding: 0 10px;
  height: 36px;
  backdrop-filter: blur(8px);
  transition: all 0.3s ease;
}

.search-box:focus-within {
  border-color: rgba(255, 180, 220, 0.4);
  box-shadow: 0 0 10px rgba(255, 180, 220, 0.15);
}

.filter-btn {
  background: transparent;
  border: none;
  color: rgba(255, 255, 255, 0.8);
  font-size: 13px;
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 0 6px 0 0;
  border-right: 1px solid rgba(255, 255, 255, 0.1);
  cursor: pointer;
  height: 20px;
}

.search-box input {
  background: transparent;
  border: none;
  outline: none;
  color: #fff;
  font-size: 14px;
  padding: 0 8px;
  width: 140px;
}

.search-box input::placeholder {
  color: rgba(255, 255, 255, 0.4);
}

.search-btn {
  background: transparent;
  border: none;
  color: rgba(255, 255, 255, 0.7);
  cursor: pointer;
  display: flex;
  align-items: center;
  padding: 0;
  border-radius: 0;
  transition: color 0.2s ease;
}

.search-btn:hover {
  color: #fff;
}

.filter-menu {
  position: absolute;
  top: 44px;
  right: 0;
  min-width: 140px;
  background: linear-gradient(to right, rgba(30, 31, 70, 0.95), rgba(25, 6, 80, 0.95));
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 180, 220, 0.2);
  border-radius: 12px;
  overflow: hidden;
  z-index: 1001;
}

.filter-item {
  padding: 10px 16px;
  color: rgba(255, 255, 255, 0.8);
  font-size: 14px;
  cursor: pointer;
  transition: 0.2s;
}

.filter-item:hover {
  background: rgba(255, 180, 220, 0.15);
  color: #fff;
}

/* ====================== ✅ 完美响应式适配 ====================== */
@media (max-width: 768px) {
  .navbar {
    padding: 12px 16px;
    gap: 10px;
  }

  .logo {
    font-size: 16px;
  }

  .links {
    gap: 6px;
  }

  .link {
    font-size: 12px;
    padding: 4px 6px;
  }

  /* 小屏幕搜索框缩小，不隐藏 */
  .search-box input {
    width: 80px;
  }
}
</style>