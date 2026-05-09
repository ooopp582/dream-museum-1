<template>
  <div class="gallery-page art-page">
    <header class="intro">
      <p class="label">ART GALLERY</p>
      <h1>画作馆</h1>
      <p>在这里，你可以欣赏到那些充满想象力和创造力的画作，每一幅作品都承载着艺术家对梦境的独特诠释。</p>
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
import { artItems } from '../data/exhibits'
</script>

<style scoped>
.gallery-page {
  padding-top: 92px;
  padding-bottom: 0;
  display: flex;
  flex-direction: column;
  gap: 0;
  min-height: 100vh;
  overflow-x: clip;
  background-image:
    linear-gradient(rgba(6, 8, 15, 0.48), rgba(6, 8, 15, 0.68)),
    url('/src/assets/background.jpg');
  background-size: auto, 100% 100%;
  background-repeat: no-repeat, no-repeat;
  background-position: center center, center bottom;
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
  .gallery-page {
    padding-top: 84px;
  }

  .intro {
    width: calc(100vw - 24px);
  }
}
</style>
