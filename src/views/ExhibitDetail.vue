<template>
  <div v-if="isFilmCarousel" class="film-parallax-page" :style="pageBgStyle" @wheel="handleFilmWheel">
    <button class="back-button top-back-button" type="button" @click="$router.back()">返回</button>

    <section class="film-hero-copy">
      <div>
        <p class="eyebrow">{{ activeFilmSlide?.kicker || 'SYNOPSIS' }}</p>
        <h1>{{ activeFilmSlide?.title || item?.title || '' }}</h1>
      </div>
      <p class="hero-text">{{ activeFilmSlide?.description || item?.description || '' }}</p>
    </section>

    <section
      ref="filmCarouselRef"
      class="film-card-track"
      aria-label="Film parallax cards"
      @wheel="handleFilmWheel"
      @pointerdown="startFilmDrag"
      @pointermove="moveFilmDrag"
      @pointerup="endFilmDrag"
      @pointercancel="endFilmDrag"
      @pointerleave="endFilmDrag"
    >
      <article
        v-for="(slide, index) in filmSlides"
        :key="`${item?.id || 'film'}-${index}`"
        class="film-card"
        :class="{ 'is-active': index === activeFilmIndex }"
        :style="getFilmCardStyle(index)"
        @click="openFilmInfo"
      >
        <div class="film-card-bg" :style="{ backgroundImage: `url(${slide.image})` }"></div>
        <div class="film-card-shade"></div>
        <button
          v-if="index === 0 && hasVideo"
          class="film-play"
          type="button"
          aria-label="Play film video"
          @click.stop="openVideo"
        >
          <span>▶</span>
        </button>
        <div class="film-card-copy">
          <p>{{ slide.kicker }}</p>
          <h2>{{ slide.title }}</h2>
          <span>{{ slide.place }}</span>
        </div>
      </article>
    </section>

    <div v-if="showVideo" class="film-video-modal" @click.self="closeVideo">
      <div class="film-video-panel">
        <video
          ref="videoRef"
          :src="item?.video"
          controls
          autoplay
          class="detail-video"
        ></video>
        <button class="close-video-btn" type="button" @click="closeVideo">×</button>
      </div>
    </div>
  </div>

  <div v-else class="detail-page" :style="pageBgStyle">
    <button class="back-button top-back-button" type="button" @click="$router.back()">返回</button>

    <div class="image-section">
      <div
        v-if="!showVideo && hasVideo"
        class="detail-wrapper"
        :style="cardStyle"
        @click="openVideo"
      >
        <div class="play-overlay">
          <span class="play-icon">▶</span>
          <span class="play-text">点击播放视频</span>
        </div>
      </div>

      <div v-if="showVideo" class="video-wrapper">
        <video
          ref="videoRef"
          :src="item?.video"
          controls
          autoplay
          class="detail-video"
        ></video>
        <button class="close-video-btn" type="button" @click="closeVideo">×</button>
      </div>

      <div
        v-if="!showVideo && !hasVideo"
        class="detail-wrapper"
        :style="cardStyle"
      ></div>
    </div>

    <div class="detail-text">
      <h1 class="detail-title">{{ item?.title || '' }}</h1>
      <p class="detail-subtitle">{{ item?.subtitle || '' }}</p>
      <div class="detail-content" v-html="item?.content || item?.description || ''"></div>
    </div>

  </div>
</template>

<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { filmItems, artItems, dreamItems } from '../data/exhibits'

const route = useRoute()
const router = useRouter()
const showVideo = ref(false)
const videoRef = ref(null)
const filmCarouselRef = ref(null)
const activeFilmIndex = ref(0)
const filmDragStartX = ref(0)
const filmDragStartY = ref(0)
const isFilmDragging = ref(false)
const didFilmDrag = ref(false)
let wheelLock = false
let previousBodyOverflow = ''

const item = computed(() => {
  const id = route.params.id

  if (route.path.startsWith('/film/')) {
    return filmItems.find((film) => film.id === id)
  }

  const numericId = Number.parseInt(id, 10)

  if (route.path.startsWith('/art/')) {
    return artItems.find((art) => art.id === numericId)
  }

  if (route.path.startsWith('/dreams/')) {
    return dreamItems.find((dream) => dream.id === numericId)
  }

  return null
})

const isFilmCarousel = computed(() => route.name === 'FilmDetail')
const isFilmPage = computed(() => route.path.startsWith('/film/'))
const hasVideo = computed(() => isFilmPage.value && item.value?.video)

const filmImages = [
  '/src/assets/film4.png',
  '/src/assets/film1.jpg',
  '/src/assets/film2.jpg',
  '/src/assets/film3.jpg'
]

const filmSlides = computed(() => {
  const current = item.value
  if (!current) return []

  const images = [
    current.background,
    ...filmImages.filter((image) => image !== current.background)
  ].filter(Boolean)

  const titles = [
    current.subtitle || current.title,
    'Dream Logic',
    'Fractured Memory',
    'Hidden Corridor',
    'Blue Hour',
    'Last Threshold',
    'Afterimage'
  ]

  const places = [
    current.title,
    'Scene Archive',
    'Light Study',
    'Sound Room',
    'Lost Frame',
    'Dream Index',
    'End Note'
  ]

  const descriptions = [
    current.description || '',
    'A study of how the film bends familiar cause and effect into the private rhythm of a dream.',
    'Fragments of memory drift through the frame, turning image, sound, and silence into clues.',
    'The space behind the story opens slowly, like a corridor that keeps moving while you look at it.',
    'Color becomes emotion here: cool light, suspended faces, and the strange calm before waking.',
    'The final threshold gathers fear, beauty, and uncertainty into one unstable cinematic room.',
    'What remains after the scene ends is an afterimage: not the plot, but the feeling it leaves behind.'
  ]

  return Array.from({ length: 7 }, (_, index) => ({
    image: images[index % images.length],
    kicker: index === 0 ? 'FEATURED FILM' : `CHAPTER ${String(index + 1).padStart(2, '0')}`,
    title: titles[index],
    place: places[index],
    description: descriptions[index]
  }))
})

const activeFilmSlide = computed(() => filmSlides.value[activeFilmIndex.value] || filmSlides.value[0])

const pageBgStyle = computed(() => {
  if (!item.value?.background) return {}

  return {
    backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.78), rgba(0, 0, 0, 0.88)), url(${item.value.background})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundAttachment: 'fixed'
  }
})

const cardStyle = computed(() => {
  if (!item.value?.background) return {}
  return {
    backgroundImage: `url(${item.value.background})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center'
  }
})

const normalizeFilmOffset = (index) => {
  const total = filmSlides.value.length || 1
  let offset = index - activeFilmIndex.value

  if (offset > total / 2) offset -= total
  if (offset < -total / 2) offset += total

  return offset
}

const getFilmCardStyle = (index) => {
  const offset = normalizeFilmOffset(index)
  const distance = Math.abs(offset)

  return {
    '--ring-offset': offset,
    '--card-shift': `${offset * -46}px`,
    '--card-scale': Math.max(0.58, 1 - distance * 0.18),
    '--card-opacity': Math.max(0.18, 1 - distance * 0.22),
    '--card-z': 20 - distance,
    '--card-y': `${distance * 32}px`
  }
}

const moveFilmCarousel = (direction) => {
  const total = filmSlides.value.length
  if (!total) return

  activeFilmIndex.value = (activeFilmIndex.value + direction + total) % total
}

const handleFilmWheel = (event) => {
  event.preventDefault()
  event.stopPropagation()

  if (wheelLock) return

  const delta = Math.abs(event.deltaX) > Math.abs(event.deltaY) ? event.deltaX : event.deltaY
  if (Math.abs(delta) < 8) return

  moveFilmCarousel(delta > 0 ? 1 : -1)
  wheelLock = true
  window.setTimeout(() => {
    wheelLock = false
  }, 260)
}

const startFilmDrag = (event) => {
  if (event.button !== 0) return

  isFilmDragging.value = false
  didFilmDrag.value = false
  filmDragStartX.value = event.clientX
  filmDragStartY.value = event.clientY
}

const moveFilmDrag = (event) => {
  if (!filmDragStartX.value) return

  const delta = event.clientX - filmDragStartX.value
  const verticalDelta = event.clientY - filmDragStartY.value

  if (!isFilmDragging.value && Math.hypot(delta, verticalDelta) > 12) {
    isFilmDragging.value = true
    filmCarouselRef.value?.setPointerCapture?.(event.pointerId)
  }

  if (!isFilmDragging.value || Math.abs(delta) < 70) return

  didFilmDrag.value = true
  moveFilmCarousel(delta < 0 ? 1 : -1)
  filmDragStartX.value = event.clientX
}

const endFilmDrag = (event) => {
  filmDragStartX.value = 0
  filmDragStartY.value = 0

  if (isFilmDragging.value) {
    isFilmDragging.value = false
    filmCarouselRef.value?.releasePointerCapture?.(event.pointerId)
  }
}

const openFilmInfo = () => {
  if (didFilmDrag.value) {
    didFilmDrag.value = false
    return
  }

  router.push({
    name: 'FilmInfo',
    params: {
      id: route.params.id
    }
  })
}

const openVideo = () => {
  showVideo.value = true
}

const closeVideo = () => {
  if (videoRef.value) {
    videoRef.value.pause()
    videoRef.value.currentTime = 0
  }

  showVideo.value = false
}

watch(
  () => route.fullPath,
  () => {
    activeFilmIndex.value = 0
    showVideo.value = false
    document.body.style.overflow = isFilmCarousel.value ? 'hidden' : previousBodyOverflow
  }
)

onMounted(() => {
  previousBodyOverflow = document.body.style.overflow
  if (isFilmCarousel.value) {
    document.body.style.overflow = 'hidden'
  }

  nextTick(() => {
    activeFilmIndex.value = 0
  })
})

onBeforeUnmount(() => {
  document.body.style.overflow = previousBodyOverflow
})

</script>

<style scoped>
.film-parallax-page {
  height: 100vh;
  min-height: 680px;
  padding: clamp(82px, 10vh, 116px) 0 0;
  color: #fff;
  background-color: #020303;
  background-repeat: no-repeat;
  overflow: hidden;
  touch-action: none;
}

.film-hero-copy {
  width: min(1120px, calc(100vw - 48px));
  height: clamp(220px, 30vh, 310px);
  margin: 0 auto;
  display: grid;
  grid-template-columns: minmax(280px, 0.95fr) minmax(260px, 0.9fr);
  gap: clamp(32px, 7vw, 110px);
  align-items: start;
}

.eyebrow {
  margin: 0 0 10px;
  font-size: 12px;
  letter-spacing: 1.8px;
  color: rgba(255, 255, 255, 0.78);
}

.film-hero-copy h1 {
  margin: 0;
  max-width: 620px;
  font-size: clamp(40px, 6vw, 76px);
  line-height: 0.92;
  letter-spacing: 0;
  text-transform: uppercase;
}

.hero-text {
  margin: 12px 0 0;
  color: rgba(255, 255, 255, 0.78);
  font-size: clamp(14px, 1.4vw, 17px);
  line-height: 1.75;
  min-height: 6.8em;
}

.film-card-track {
  position: relative;
  width: 100%;
  height: min(46vh, 430px);
  min-height: 320px;
  margin-top: clamp(10px, 2vh, 24px);
  overflow: hidden;
  cursor: default;
  user-select: none;
  touch-action: none;
}

.film-card {
  --card-shift: 0px;
  --ring-offset: 0;
  --card-scale: 1;
  --card-opacity: 1;
  --card-z: 1;
  --card-y: 0px;
  position: relative;
  position: absolute;
  left: 50%;
  top: 0;
  width: clamp(560px, 45vw, 920px);
  aspect-ratio: 16 / 9;
  max-height: 100%;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 8px;
  background: #050505;
  opacity: var(--card-opacity);
  z-index: var(--card-z);
  box-shadow: 0 34px 70px rgba(0, 0, 0, 0.46);
  transform:
    translateX(calc(-50% + var(--ring-offset) * min(31vw, 520px)))
    translateY(var(--card-y))
    scale(var(--card-scale));
  transform-origin: center center;
  transition:
    transform 0.46s cubic-bezier(0.22, 1, 0.36, 1),
    opacity 0.32s ease,
    border-color 0.32s ease,
    box-shadow 0.32s ease;
  will-change: transform, opacity;
  cursor: pointer;
}

.film-card-track:active .film-card {
  cursor: grabbing;
}

.film-card.is-active {
  border-color: rgba(255, 255, 255, 0.34);
  box-shadow: 0 42px 86px rgba(0, 0, 0, 0.58);
  opacity: 1;
}

.film-card-bg {
  position: absolute;
  inset: -8%;
  background-size: cover;
  background-position: center;
  transform: translateX(var(--card-shift)) scale(1.13);
  transition: transform 0.46s cubic-bezier(0.22, 1, 0.36, 1);
}

.film-card-shade {
  position: absolute;
  inset: 0;
  background:
    linear-gradient(90deg, rgba(0, 0, 0, 0.76), rgba(0, 0, 0, 0.08) 52%, rgba(0, 0, 0, 0.22)),
    linear-gradient(180deg, rgba(0, 0, 0, 0.02), rgba(0, 0, 0, 0.58));
}

.film-play {
  position: absolute;
  top: 24px;
  right: 24px;
  width: 42px;
  height: 42px;
  display: grid;
  place-items: center;
  border-radius: 50%;
  border: 1px solid rgba(255, 255, 255, 0.72);
  background: rgba(0, 0, 0, 0.35);
  color: #fff;
  cursor: pointer;
  backdrop-filter: blur(8px);
}

.film-play span {
  display: block;
  margin-left: 3px;
  font-size: 15px;
  line-height: 1;
}

.film-card-copy {
  position: absolute;
  left: clamp(18px, 3vw, 34px);
  right: clamp(18px, 3vw, 34px);
  bottom: clamp(18px, 3vw, 34px);
  z-index: 1;
}

.film-card-copy p,
.film-card-copy span {
  margin: 0;
  color: rgba(255, 255, 255, 0.82);
  font-size: 13px;
  letter-spacing: 0;
}

.film-card-copy h2 {
  margin: 6px 0;
  font-size: clamp(26px, 3.8vw, 44px);
  line-height: 1;
  letter-spacing: 0;
  text-transform: uppercase;
}

.film-video-modal {
  position: fixed;
  inset: 0;
  z-index: 1200;
  display: grid;
  place-items: center;
  padding: 24px;
  background: rgba(0, 0, 0, 0.76);
  backdrop-filter: blur(12px);
}

.film-video-panel {
  position: relative;
  width: min(1000px, 92vw);
  aspect-ratio: 16 / 9;
  background: #000;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 36px 90px rgba(0, 0, 0, 0.56);
}

.detail-video {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.detail-page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  padding: 40px 20px 100px;
  position: relative;
  overflow-y: auto;
}

.image-section {
  flex: 3;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 40px;
  padding-top: 80px;
}

.detail-wrapper {
  width: 60vw;
  aspect-ratio: 16 / 9;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 180, 220, 0.1);
  border-radius: 20px;
  box-shadow: 0 0 30px rgba(170, 140, 255, 0.15);
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.detail-wrapper:hover {
  transform: scale(1.02);
  box-shadow: 0 0 40px rgba(170, 140, 255, 0.25);
}

.play-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(4px);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.detail-wrapper:hover .play-overlay {
  opacity: 1;
}

.play-icon {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  color: #6366f1;
  margin-bottom: 12px;
  transition: transform 0.3s ease;
}

.detail-wrapper:hover .play-icon {
  transform: scale(1.1);
}

.play-text {
  color: rgba(255, 255, 255, 0.9);
  font-size: 16px;
  letter-spacing: 1px;
}

.video-wrapper {
  width: 60vw;
  aspect-ratio: 16 / 9;
  position: relative;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 0 30px rgba(170, 140, 255, 0.15);
}

.detail-text {
  flex: 1;
  max-width: 600px;
  margin: 0 auto;
  text-align: center;
}

.back-button {
  border: 1px solid rgba(255, 255, 255, 0.28);
  background: rgba(0, 0, 0, 0.32);
  color: #fff;
  cursor: pointer;
  backdrop-filter: blur(10px);
  transition: background 0.2s ease, transform 0.2s ease;
}

.back-button:hover {
  background: rgba(255, 255, 255, 0.16);
  transform: translateY(-1px);
}

.top-back-button {
  position: fixed;
  top: 112px;
  left: 24px;
  z-index: 1100;
  padding: 10px 18px;
  border-radius: 999px;
  font-size: 14px;
  letter-spacing: 0;
}

.close-video-btn {
  position: absolute;
  top: 12px;
  right: 12px;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: none;
  background: rgba(0, 0, 0, 0.55);
  color: white;
  font-size: 24px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.detail-title {
  font-size: clamp(28px, 5vw, 42px);
  color: #fff;
  margin: 0 0 12px;
  text-shadow: 0 0 15px rgba(255, 170, 220, 0.4);
}

.detail-subtitle {
  font-size: clamp(16px, 2vw, 20px);
  color: rgba(255, 200, 230, 0.9);
  margin: 0 0 30px;
}

.detail-content {
  font-size: clamp(14px, 1.5vw, 16px);
  color: rgba(255, 255, 255, 0.85);
  line-height: 1.8;
  margin: 0;
}

.detail-content strong {
  color: rgba(255, 180, 220, 0.95);
  font-weight: 600;
}

@media (max-width: 768px) {
  .film-parallax-page {
    height: 100vh;
    min-height: 620px;
    padding-top: 54px;
  }

  .film-hero-copy {
    width: calc(100vw - 32px);
    height: 270px;
    grid-template-columns: 1fr;
    gap: 16px;
  }

  .film-card-track {
    height: 310px;
    min-height: 310px;
    margin-top: 8px;
  }

  .film-card {
    width: 86vw;
    transform:
      translateX(calc(-50% + var(--ring-offset) * 68vw))
      translateY(var(--card-y))
      scale(var(--card-scale));
  }

  .detail-page {
    padding: 20px 16px 80px;
  }

  .image-section {
    margin-bottom: 30px;
  }

  .detail-wrapper {
    width: 90vw;
  }

  .video-wrapper {
    width: 90vw;
  }

  .play-icon {
    width: 48px;
    height: 48px;
    font-size: 20px;
  }
}
</style>
