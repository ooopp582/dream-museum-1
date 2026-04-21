<template>
  <div class="app-shell">
    <Navbar />
    <main class="page-main">
      <router-view />
    </main>
  </div>
</template>

<script setup>
import Navbar from './components/Navbar.vue'
</script>

<style scoped>
.app-shell {
  min-height: 100vh;
  background: #06080f;
  color: #f2f4f8;
}

.page-main {
  min-height: 100vh;
}
</style>
