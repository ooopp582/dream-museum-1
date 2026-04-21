<template>
  <div ref="pageRef" class="page" :style="pageStyle">
    <header class="intro">
      <p class="label">ART GALLERY</p>
      <h1>画作馆</h1>
      <p>纵向滚动浏览每个画作板块，点击进入该画作的独立介绍页面。</p>
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
import { onMounted, onUnmounted, ref } from 'vue'
import SectionBlock from '../components/SectionBlock.vue'
import { artItems } from '../data/exhibits'

const pageRef = ref(null)
const pageStyle = ref({ '--bg-shift': '0px' })
const WHEEL_STEP_THRESHOLD = 760
const STEP_FACTOR = 0.72
const MAX_WHEEL_DELTA = 120
const virtualIndex = ref(0)
let parallaxFrame = null
let currentBgShift = 0

const getSectionAnchors = () => {
  if (!pageRef.value) return []
  return [...pageRef.value.querySelectorAll('.spiral-section')].map((el) => el.offsetTop)
}

const getCurrentIndex = (anchors) => {
  const currentY = window.scrollY + 110
  let index = 0
  for (let i = 0; i < anchors.length; i += 1) {
    if (currentY >= anchors[i]) index = i
  }
  return index
}

const syncActiveIndexFromScroll = () => {
  const anchors = getSectionAnchors()
  if (!anchors.length) return
  virtualIndex.value = getCurrentIndex(anchors)
}

const easeInOutSine = (t) => -(Math.cos(Math.PI * t) - 1) / 2

const handleWheel = (event) => {
  const anchors = getSectionAnchors()
  if (!anchors.length) return
  const firstAnchorY = anchors[0] - 72
  const lastAnchorY = anchors[anchors.length - 1] - 72
  const currentY = window.scrollY

  if ((currentY <= firstAnchorY + 2 && event.deltaY < 0) || (currentY >= lastAnchorY - 2 && event.deltaY > 0)) {
    syncActiveIndexFromScroll()
    return
  }

  event.preventDefault()

  const safeDeltaY = Math.sign(event.deltaY) * Math.min(MAX_WHEEL_DELTA, Math.abs(event.deltaY))
  const indexDelta = (safeDeltaY / WHEEL_STEP_THRESHOLD) * STEP_FACTOR
  virtualIndex.value = Math.max(0, Math.min(anchors.length - 1, virtualIndex.value + indexDelta))

  const startIndex = Math.floor(virtualIndex.value)
  const endIndex = Math.min(anchors.length - 1, Math.ceil(virtualIndex.value))
  const localT = virtualIndex.value - startIndex
  const progressRatio = easeInOutSine(localT)
  const startY = anchors[startIndex] - 72
  const endY = anchors[endIndex] - 72
  const y = startY + (endY - startY) * progressRatio
  window.scrollTo(0, y)
}

const animateParallax = () => {
  const targetBgShift = window.scrollY * -0.10
  currentBgShift += (targetBgShift - currentBgShift) * 0.028
  pageStyle.value = { '--bg-shift': `${currentBgShift.toFixed(2)}px` }
  parallaxFrame = requestAnimationFrame(animateParallax)
}

onMounted(() => {
  syncActiveIndexFromScroll()
  animateParallax()
  window.addEventListener('wheel', handleWheel, { passive: false })
})

onUnmounted(() => {
  window.removeEventListener('wheel', handleWheel)
  if (parallaxFrame) cancelAnimationFrame(parallaxFrame)
})
</script>

<style scoped>
.page {
  padding-top: 92px;
  padding-bottom: 2vh;
  display: flex;
  flex-direction: column;
  gap: 0;
  background-image: url('/src/assets/background.jpg');
  background-size: cover;
  background-position: center calc(50% + var(--bg-shift, 0px));
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