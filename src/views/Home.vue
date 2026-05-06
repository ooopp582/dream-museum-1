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
    linear-gradient(rgba(8, 15, 30, 0.18), rgba(8, 15, 30, 0.34)),
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
    radial-gradient(ellipse at 32% 28%, rgba(244, 114, 182, 0.26), transparent 34%),
    radial-gradient(ellipse at 72% 34%, rgba(125, 211, 252, 0.24), transparent 36%),
    radial-gradient(ellipse at 50% 62%, rgba(250, 204, 21, 0.14), transparent 42%),
    radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.06), rgba(3, 7, 18, 0.18) 76%);
  mix-blend-mode: screen;
}

.home-page::after {
  content: '';
  position: absolute;
  inset: 0;
  z-index: -2;
  background-image:
    radial-gradient(circle at 12% 16%, rgba(255, 255, 255, 0.95) 0 1px, transparent 2px),
    radial-gradient(circle at 84% 12%, rgba(255, 255, 255, 0.8) 0 1px, transparent 2px),
    radial-gradient(circle at 23% 78%, rgba(255, 255, 255, 0.9) 0 1px, transparent 2px),
    radial-gradient(circle at 72% 82%, rgba(255, 255, 255, 0.78) 0 1px, transparent 2px),
    radial-gradient(circle at 94% 48%, rgba(255, 255, 255, 0.72) 0 1px, transparent 2px);
  filter: drop-shadow(0 0 8px rgba(255, 255, 255, 0.9));
  opacity: 0.72;
  pointer-events: none;
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

.moon-stage::before {
  content: '';
  width: min(70vw, 820px);
  aspect-ratio: 1;
  grid-area: 1 / 1;
  border-radius: 50%;
  background:
    conic-gradient(from 306deg at 50% 50%, transparent 0deg, rgba(255, 255, 255, 0.18) 30deg, rgba(147, 197, 253, 0.18) 58deg, transparent 92deg, transparent 360deg),
    radial-gradient(circle at 58% 48%, rgba(244, 114, 182, 0.13), rgba(186, 230, 253, 0.14) 30%, rgba(125, 211, 252, 0.08) 54%, transparent 74%);
  filter: blur(30px);
  opacity: 0.96;
}

.crescent {
  position: relative;
  grid-area: 1 / 1;
  width: min(60vw, 720px);
  aspect-ratio: 1;
  border-radius: 50%;
  background: transparent;
  box-shadow:
    0 0 56px rgba(240, 249, 255, 0.24),
    0 0 150px rgba(125, 211, 252, 0.16);
  opacity: 0.98;
}

.crescent::before {
  content: '';
  position: absolute;
  inset: -1.5%;
  border-radius: 50%;
  background:
    conic-gradient(from 306deg at 50% 50%, transparent 0deg, rgba(255, 255, 255, 0.05) 18deg, rgba(255, 255, 255, 0.92) 42deg, rgba(186, 230, 253, 0.38) 62deg, transparent 94deg, transparent 360deg);
  -webkit-mask: radial-gradient(farthest-side, transparent calc(100% - 21px), #000 calc(100% - 19px));
  mask: radial-gradient(farthest-side, transparent calc(100% - 21px), #000 calc(100% - 19px));
  filter: blur(5px);
  box-shadow:
    0 0 28px rgba(240, 249, 255, 0.72),
    0 0 82px rgba(186, 230, 253, 0.36);
  mix-blend-mode: screen;
}

.crescent::after {
  content: '';
  position: absolute;
  inset: 0.5%;
  border-radius: 50%;
  background:
    radial-gradient(ellipse at 28% 18%, rgba(255, 255, 255, 0.54), transparent 12%),
    radial-gradient(ellipse at 66% 22%, rgba(255, 255, 255, 0.4), transparent 9%),
    conic-gradient(from 312deg at 50% 50%, transparent 0deg, rgba(255, 255, 255, 0.16) 28deg, rgba(255, 255, 255, 0.86) 45deg, rgba(244, 114, 182, 0.16) 58deg, rgba(125, 211, 252, 0.24) 70deg, transparent 96deg, transparent 360deg);
  -webkit-mask: radial-gradient(farthest-side, transparent calc(100% - 8px), #000 calc(100% - 7px), #000 calc(100% - 1px), transparent 100%);
  mask: radial-gradient(farthest-side, transparent calc(100% - 8px), #000 calc(100% - 7px), #000 calc(100% - 1px), transparent 100%);
  filter: blur(1.4px);
  mix-blend-mode: screen;
  transform: rotate(1deg);
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
    width: min(88vw, 520px);
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
