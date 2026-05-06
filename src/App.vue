<template>
  <div class="app-shell" :style="appStyle">
    <Navbar />
    <main class="page-main">
      <router-view />
    </main>
  </div>
</template>

<script setup>
import Navbar from './components/Navbar.vue'
import { useScrollBackgroundMotion } from './composables/useScrollBackgroundMotion'

const appStyle = useScrollBackgroundMotion()
</script>

<style scoped>
.app-shell {
  min-height: 100vh;
  background-image:
    linear-gradient(rgba(6, 8, 15, 0.58), rgba(6, 8, 15, 0.72)),
    url('./assets/background.jpg');
  background-size: auto, cover;
  background-repeat: no-repeat, no-repeat;
  background-position: center center, center var(--bg-position-y);
  color: #f2f4f8;
}

.page-main {
  min-height: 100vh;
}
</style>
