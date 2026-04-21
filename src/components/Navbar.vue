<template>
  <nav class="navbar">
    <div class="logo">梦境博物馆</div>
    <div class="links">
      <router-link to="/film" class="link">电影馆</router-link>
      <router-link to="/art" class="link">画作馆</router-link>
      <router-link to="/profile" class="link">个人中心</router-link>
    </div>
  </nav>
</template>

<script setup>
</script>

<style scoped>
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 1000;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 36px;
  background: rgba(5, 7, 12, 0.78);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.14);
}

.logo {
  color: #f8fafc;
  font-size: 20px;
  font-weight: 700;
  letter-spacing: 1.5px;
}

.links {
  display: flex;
  gap: 28px;
}

.link {
  color: rgba(248, 250, 252, 0.78);
  font-size: 15px;
  letter-spacing: 0.8px;
  padding: 6px 8px;
  border-radius: 999px;
  transition: color 0.2s ease, background-color 0.2s ease;
}

.link:hover,
.link.router-link-active {
  color: #ffffff;
  background: rgba(255, 255, 255, 0.14);
}

@media (max-width: 768px) {
  .navbar {
    padding: 14px 16px;
    gap: 12px;
  }

  .logo {
    font-size: 16px;
  }

  .links {
    gap: 10px;
  }

  .link {
    font-size: 13px;
  }
}
</style>