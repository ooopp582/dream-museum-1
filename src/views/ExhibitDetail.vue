<template>
  <div class="detail-page">
    <div class="hero" :style="{ background: item.background }"></div>

    <section class="detail-content">
      <p class="type">{{ isFilm ? 'FILM DETAIL' : 'ART DETAIL' }}</p>
      <h1>{{ item.title }}</h1>
      <p class="subtitle">{{ item.subtitle }}</p>
      <p class="text">{{ item.content }}</p>
      <router-link :to="isFilm ? '/film' : '/art'" class="back-link">
        返回{{ isFilm ? '电影馆' : '画作馆' }}
      </router-link>
    </section>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { artItems, filmItems } from '../data/exhibits'

const route = useRoute()

const isFilm = computed(() => route.path.startsWith('/film/'))

const item = computed(() => {
  const source = isFilm.value ? filmItems : artItems
  return (
    source.find((entry) => entry.id === route.params.id) ?? {
      title: '未找到展品',
      subtitle: 'NOT FOUND',
      content: '该展品不存在或已被移除。',
      background: 'linear-gradient(135deg, #0f172a, #334155)'
    }
  )
})
</script>

<style scoped>
.detail-page {
  min-height: 100vh;
  padding-top: 72px;
}

.hero {
  height: 42vh;
  width: 100%;
}

.detail-content {
  width: min(980px, calc(100vw - 48px));
  margin: 0 auto;
  padding: 34px 0 70px;
}

.type {
  margin: 0;
  font-size: 12px;
  letter-spacing: 2px;
  color: rgba(255, 255, 255, 0.72);
}

h1 {
  margin: 12px 0 8px;
  font-size: clamp(32px, 6vw, 62px);
}

.subtitle {
  margin: 0 0 14px;
  font-size: 18px;
  color: #93c5fd;
}

.text {
  margin: 0;
  line-height: 1.9;
  color: rgba(255, 255, 255, 0.86);
}

.back-link {
  display: inline-block;
  margin-top: 24px;
  padding: 8px 14px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.16);
}

@media (max-width: 768px) {
  .detail-page {
    padding-top: 64px;
  }

  .hero {
    height: 34vh;
  }

  .detail-content {
    width: calc(100vw - 24px);
    padding-top: 24px;
  }
}
</style>
