<template>
  <div class="page" :style="pageStyle">
    <header class="intro">
      <p class="label">ART GALLERY</p>
      <h1>画作馆</h1>
      <p>纵向滚动浏览每一个画作板块，点击进入该画作的独立介绍页面。</p>
    </header>

    <SectionBlock
      v-for="(item, index) in artItems"
      :key="item.id"
      :title="item.title"
      :tag="item.subtitle"
      :desc="item.description"
      :bg="item.background"
      :detail-to="`/art/${item.id}`"
      :index="index"
      global-background="/src/assets/background.jpg"
    />
  </div>
</template>

<script setup>
import SectionBlock from '../components/SectionBlock.vue'
import { useScrollBackgroundMotion } from '../composables/useScrollBackgroundMotion'
import { artItems } from '../data/exhibits'

const pageStyle = useScrollBackgroundMotion()
</script>

<style scoped>
.page {
  padding-top: 92px;
  padding-bottom: 2vh;
  display: flex;
  flex-direction: column;
  gap: 0;
  background-image:
    linear-gradient(rgba(6, 8, 15, 0.48), rgba(6, 8, 15, 0.68)),
    url('/src/assets/background.jpg');
  background-size: auto, cover;
  background-repeat: no-repeat, no-repeat;
  background-position: center center, center var(--bg-position-y);
  min-height: 100vh;
  overflow-x: clip;
}

.intro {
  width: min(1200px, calc(100vw - 48px));
  margin: 0 auto;
  padding-top: 22px;
}

.label {
  margin: 0;
  letter-spacing: 2px;
  font-size: 12px;
  color: #86efac;
}

h1 {
  margin: 10px 0 8px;
  font-size: clamp(34px, 5vw, 52px);
}

.intro p {
  margin: 0;
  color: rgba(255, 255, 255, 0.8);
}

@media (max-width: 768px) {
  .page {
    padding-top: 84px;
    padding-bottom: 1vh;
  }

  .intro {
    width: calc(100vw - 24px);
  }
}
</style>
