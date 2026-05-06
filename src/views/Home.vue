<template>
  <section class="home-page">
    <div class="top-actions">
      <router-link to="/profile" class="icon-link" aria-label="个人中心">◎</router-link>
      <router-link to="/film" class="icon-link" aria-label="进入展厅">→</router-link>
    </div>

    <div class="moon-stage" aria-hidden="true">
      <div class="crescent"></div>
    </div>

    <div class="home-content">
      <h1>梦境博物馆</h1>
      <p>电影馆、画作馆、大众梦境、个人中心</p>

      <nav class="module-grid" aria-label="模块入口">
        <router-link v-for="item in modules" :key="item.to" :to="item.to" class="module-link">
          <span class="module-title">{{ item.title }}</span>
          <span class="module-desc">{{ item.desc }}</span>
        </router-link>
      </nav>
    </div>
  </section>
</template>

<script setup>
const modules = [
  {
    title: '电影馆',
    desc: '进入梦境叙事展厅',
    to: '/film'
  },
  {
    title: '画作馆',
    desc: '浏览视觉记忆切片',
    to: '/art'
  },
  {
    title: '大众梦境',
    desc: '查看共享梦境留言',
    to: '/dreams'
  },
  {
    title: '个人中心',
    desc: '管理收藏与记录',
    to: '/profile'
  }
]
</script>

<style scoped>
.home-page {
  position: relative;
  min-height: 100vh;
  display: grid;
  place-items: center;
  overflow: hidden;
  isolation: isolate;
  color: #ffffff;
  background-image:
    linear-gradient(rgba(3, 7, 18, 0.48), rgba(3, 7, 18, 0.72)),
    url('/src/assets/background.jpg');
  background-size: auto, cover;
  background-repeat: no-repeat, no-repeat;
  background-position: center center, center center;
}

.home-page::before {
  content: '';
  position: absolute;
  inset: 0;
  z-index: -2;
  background:
    radial-gradient(circle at 50% 44%, rgba(255, 255, 255, 0.18), transparent 32%),
    radial-gradient(circle at 50% 50%, rgba(3, 7, 18, 0), rgba(3, 7, 18, 0.52) 72%);
}

.top-actions {
  position: absolute;
  top: 18px;
  left: 24px;
  right: 24px;
  display: flex;
  justify-content: space-between;
  z-index: 3;
}

.icon-link {
  width: 34px;
  height: 34px;
  display: grid;
  place-items: center;
  border-radius: 999px;
  color: rgba(255, 255, 255, 0.76);
  border: 1px solid rgba(255, 255, 255, 0.2);
  background: rgba(3, 7, 18, 0.26);
  backdrop-filter: blur(10px);
}

.moon-stage {
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
  z-index: -1;
}

.crescent {
  position: relative;
  width: min(44vw, 520px);
  aspect-ratio: 1;
  border-radius: 50%;
  background:
    radial-gradient(circle at 72% 45%, rgba(255, 255, 255, 0.9), rgba(180, 218, 231, 0.36) 2%, transparent 4%),
    radial-gradient(circle at 64% 48%, rgba(255, 255, 255, 0.42), rgba(173, 216, 230, 0.18) 8%, transparent 12%),
    rgba(255, 255, 255, 0.04);
  box-shadow:
    inset -16px 0 18px rgba(255, 255, 255, 0.52),
    inset -28px 0 34px rgba(125, 211, 252, 0.22),
    0 0 42px rgba(226, 246, 255, 0.34);
  opacity: 0.92;
}

.crescent::before {
  content: '';
  position: absolute;
  inset: -1px 18px -1px -38px;
  border-radius: 50%;
  background:
    radial-gradient(circle at 52% 44%, rgba(3, 7, 18, 0.42), rgba(3, 7, 18, 0.8) 62%),
    url('/src/assets/background.jpg') center / cover no-repeat;
  filter: brightness(0.42) saturate(0.85);
}

.crescent::after {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: 50%;
  border-right: 2px solid rgba(255, 255, 255, 0.86);
  border-top: 1px solid rgba(255, 255, 255, 0.36);
  transform: rotate(9deg);
}

.home-content {
  width: min(860px, calc(100vw - 40px));
  text-align: center;
  padding: 52px 0 32px;
}

h1 {
  margin: 0 0 12px;
  font-size: clamp(46px, 8vw, 86px);
  line-height: 1.08;
  font-weight: 500;
  text-shadow: 0 6px 26px rgba(0, 0, 0, 0.72);
}

.home-content > p {
  margin: 0 auto 36px;
  color: rgba(255, 255, 255, 0.86);
  font-size: clamp(16px, 2.2vw, 22px);
  text-shadow: 0 4px 18px rgba(0, 0, 0, 0.72);
}

.module-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 12px;
}

.module-link {
  min-height: 92px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 8px;
  padding: 16px 14px;
  border-radius: 18px;
  color: #ffffff;
  background: rgba(8, 13, 24, 0.34);
  border: 1px solid rgba(255, 255, 255, 0.18);
  backdrop-filter: blur(14px);
  transition: transform 0.2s ease, background-color 0.2s ease, border-color 0.2s ease;
}

.module-link:hover {
  transform: translateY(-4px);
  background: rgba(255, 255, 255, 0.14);
  border-color: rgba(255, 255, 255, 0.36);
}

.module-title {
  font-size: 18px;
}

.module-desc {
  color: rgba(255, 255, 255, 0.68);
  font-size: 13px;
  line-height: 1.35;
}

@media (max-width: 820px) {
  .home-page {
    align-items: center;
    padding: 76px 0 28px;
  }

  .crescent {
    width: min(76vw, 420px);
    transform: translateY(-18px);
  }

  .home-content {
    padding-top: 34px;
  }

  .module-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 480px) {
  .module-grid {
    grid-template-columns: 1fr;
  }
}
</style>
