<template>
  <div class="app-shell">
    <Navbar v-if="!route.meta.hideNavbar" />
    <main class="page-main">
      <router-view />
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
