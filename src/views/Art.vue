<template>
  <div class="gallery-page art-page">
    <header class="intro">
      <p class="label">ART GALLERY</p>
      <h1>画作馆</h1>
      <p>
        在这里，你可以欣赏到那些充满想象力和创造力的画作，每一幅作品都承载着艺术家对梦境的独特诠释。单击大画卡会展开四个馆藏入口，再选择其一进入详细介绍。
      </p>
    </header>

    <ArtExpandSection
      v-for="(item, index) in artItems"
      :key="item.id"
      :item="item"
      :tiles="artItems"
      :index="index"
      :expanded="expandedId === item.id"
      global-background="/src/assets/background.jpg"
      @expand="expandedId = $event"
      @collapse="expandedId = null"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import ArtExpandSection from '../components/ArtExpandSection.vue'
import { artItems } from '../data/exhibits'

const expandedId = ref(null)
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
    linear-gradient(rgba(6, 8, 15, 0.58), rgba(6, 8, 15, 0.72)),
    url('/src/assets/background.jpg');
  background-size: auto, cover;
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
