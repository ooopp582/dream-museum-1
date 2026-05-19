<template>
  <div class="app-shell">
    <Transition name="nav-fade">
      <Navbar v-if="!route.meta.hideNavbar" />
    </Transition>
    <main class="page-main">
      <router-view v-slot="{ Component }">
        <Transition name="page-cross" mode="out-in">
          <component :is="Component" :key="route.fullPath" />
        </Transition>
      </router-view>
    </main>
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router'
import Navbar from './components/Navbar.vue'

const route = useRoute()
</script>

<style >
.app-shell {
  min-height: 100vh;
  background-image: linear-gradient(rgba(6, 8, 15, 0.58), rgba(6, 8, 15, 0.72)),
  url('./assets/background.jpg');
  background-size: auto, cover;
  background-repeat: no-repeat, no-repeat;
  background-position: center center, center bottom;
  color: #f2f4f8;
}

.page-main {
  min-height: 100vh;
  position: relative;
  overflow-x: clip;
  isolation: isolate;
  /*
   * 与 .app-shell 使用同一套底图与 cover 定位。
   * out-in 切换时，旧页/新页在 opacity≈0 的阶段会透出这里；
   * 若只有 shell 有图而子页用 100% 拉伸，中间帧会像「换了一张错位的图」。
   */
  background-color: #050912;
  background-image: linear-gradient(rgba(6, 8, 15, 0.58), rgba(6, 8, 15, 0.72)),
    url('./assets/background.jpg');
  background-size: auto, cover;
  background-repeat: no-repeat, no-repeat;
  background-position: center center, center bottom;
}

/* 全站路由切换：先淡出再淡入（中间帧由 .page-main 承接，避免露底错位） */
.page-cross-enter-active {
  transition: opacity 0.38s ease-out 0.04s;
}
.page-cross-leave-active {
  transition: opacity 0.34s ease-in;
}
.page-cross-enter-from,
.page-cross-leave-to {
  opacity: 0;
}

/* 离开/进入带导航的页面时，顶栏不要瞬间弹出 */
.nav-fade-enter-active,
.nav-fade-leave-active {
  transition: opacity 0.28s ease-out;
}
.nav-fade-enter-from,
.nav-fade-leave-to {
  opacity: 0;
}

/* 全局按钮通用样式：白色半透明 + 粉紫渐变光晕 */
.module-button, .btn, .link {
  background: rgba(255, 255, 255, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: #ffffff;
  border-radius: 12px;
  padding: 12px 28px;
  backdrop-filter: blur(8px);
  /* 粉紫渐变外发光 */
  box-shadow: 
    0 0 15px rgba(255, 175, 220, 0.25),
    0 0 30px rgba(160, 120, 255, 0.15);
  transition: all 0.3s ease;
}

/* 鼠标悬浮效果：更亮+上浮 */
.module-button:hover, .btn:hover, .link:hover {
  background: rgba(255, 255, 255, 0.25);
  transform: translateY(-3px);
  box-shadow: 
    0 0 20px rgba(255, 175, 220, 0.35),
    0 0 40px rgba(160, 120, 255, 0.25);
}
</style>
