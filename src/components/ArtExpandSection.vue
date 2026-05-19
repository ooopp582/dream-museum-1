<template>
  <section ref="sectionRef" class="spiral-section">
    <div ref="pinRef" class="pin-wrap">
      <div
        ref="cardRef"
        class="section"
        :class="{ 'is-expanded': expanded }"
        :role="expanded ? undefined : 'button'"
        :tabindex="expanded ? -1 : 0"
        :aria-expanded="expanded ? 'true' : 'false'"
        @click="onSectionClick"
        @keydown.enter.prevent="onSectionKey"
        @keydown.space.prevent="onSectionKey"
      >
        <div class="global-bg" :style="{ backgroundImage: `url(${globalBackground})` }"></div>
        <div ref="bgRef" class="bg" :style="bgStyle"></div>
        <div class="overlay"></div>

        <div ref="contentRef" class="content" :class="{ 'content--compact': expanded }">
          <p class="tag">{{ item.subtitle }}</p>
          <h2>{{ item.title }}</h2>
          <p class="desc">{{ item.description }}</p>
          <span v-if="!expanded" class="jump hint">单击展开馆藏入口</span>
          <span v-else class="jump hint muted">点击下方板块进入介绍</span>
        </div>

        <Transition name="sub-fade">
          <div v-if="expanded" class="sub-grid" @click.stop>
            <router-link
              v-for="tile in tiles"
              :key="tile.id"
              :to="`/art/${tile.id}`"
              class="sub-tile"
              :class="{ 'is-current': tile.id === item.id }"
            >
              <div class="sub-tile-bg" :style="{ backgroundImage: `url(${tile.background})` }"></div>
              <div class="sub-tile-shade"></div>
              <div class="sub-tile-copy">
                <p class="sub-tag">{{ tile.subtitle }}</p>
                <h3>{{ tile.title }}</h3>
              </div>
            </router-link>
            <button type="button" class="collapse-btn" aria-label="收起" @click.stop="emit('collapse')">
              ×
            </button>
          </div>
        </Transition>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const props = defineProps({
  item: {
    type: Object,
    required: true
  },
  tiles: {
    type: Array,
    required: true
  },
  index: Number,
  expanded: Boolean,
  globalBackground: {
    type: String,
    default: '/src/assets/background.jpg'
  }
})

const emit = defineEmits(['expand', 'collapse'])

const bgStyle = computed(() => {
  const bg = props.item.background
  if (bg && bg.startsWith('/')) {
    return { backgroundImage: `url(${bg})` }
  }
  return { background: bg }
})

const sectionRef = ref(null)
const pinRef = ref(null)
const cardRef = ref(null)
const bgRef = ref(null)
const contentRef = ref(null)
let transformTween = null
let depthTween = null
let introTween = null
let parallaxTween = null
let glowTween = null

const refreshScroll = () => {
  nextTick(() => ScrollTrigger.refresh())
}

watch(
  () => props.expanded,
  () => refreshScroll()
)

const onSectionClick = (event) => {
  if (props.expanded) return
  const target = event.target
  if (target.closest('.sub-grid')) return
  emit('expand', props.item.id)
}

const onSectionKey = () => {
  if (!props.expanded) emit('expand', props.item.id)
}

onMounted(() => {
  if (!sectionRef.value || !cardRef.value || !contentRef.value || !bgRef.value || !pinRef.value) {
    return
  }

  const direction = props.index % 2 === 0 ? 1 : -1
  const entryX = direction * (190 + props.index * 24)
  const exitX = direction * -(180 + props.index * 30)
  const entryRotateY = direction * -38
  const exitRotateY = direction * 42

  introTween = gsap.fromTo(
    contentRef.value,
    { autoAlpha: 0, y: 46, filter: 'blur(10px)' },
    {
      autoAlpha: 1,
      y: 0,
      filter: 'blur(0px)',
      duration: 0.9,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: sectionRef.value,
        start: 'top 76%'
      }
    }
  )

  depthTween = gsap.fromTo(
    pinRef.value,
    { z: -120 },
    {
      z: 120,
      ease: 'none',
      scrollTrigger: {
        trigger: sectionRef.value,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true
      }
    }
  )

  parallaxTween = gsap.to(bgRef.value, {
    scale: 1.24,
    yPercent: -10,
    ease: 'none',
    scrollTrigger: {
      trigger: sectionRef.value,
      start: 'top bottom',
      end: 'bottom top',
      scrub: true
    }
  })

  transformTween = gsap.fromTo(
    cardRef.value,
    {
      autoAlpha: 0.5,
      scale: 0.64,
      x: entryX,
      y: 260,
      z: -820,
      rotateX: 26,
      rotateY: entryRotateY,
      rotateZ: direction * -18,
      transformOrigin: 'center center'
    },
    {
      autoAlpha: 0.96,
      scale: 1.02,
      x: exitX,
      y: -240,
      z: 160,
      rotateX: -14,
      rotateY: exitRotateY,
      rotateZ: direction * 22,
      ease: 'none',
      scrollTrigger: {
        trigger: sectionRef.value,
        start: 'top bottom',
        end: 'bottom top',
        scrub: 0.65,
        invalidateOnRefresh: true
      }
    }
  )

  glowTween = gsap.fromTo(
    cardRef.value,
    {
      boxShadow:
        'inset 0 1px 2px rgba(255,255,255,0.1), 0 14px 34px rgba(0,0,0,0.34), 0 0 15px rgba(170,140,255,0.08)'
    },
    {
      boxShadow:
        'inset 0 2px 4px rgba(255,255,255,0.15), 0 38px 88px rgba(0,0,0,0.56), 0 0 30px rgba(170,140,255,0.15)',
      ease: 'none',
      scrollTrigger: {
        trigger: sectionRef.value,
        start: 'top 78%',
        end: 'bottom 18%',
        scrub: true
      }
    }
  )
})

onUnmounted(() => {
  for (const tween of [transformTween, depthTween, introTween, parallaxTween, glowTween]) {
    if (tween?.scrollTrigger) tween.scrollTrigger.kill()
    if (tween) tween.kill()
  }
})
</script>

<style scoped>
.spiral-section {
  position: relative;
  height: 148vh;
  margin: 0 0 4vh;
}

.spiral-section:last-child {
  height: 118vh;
  margin-bottom: 0;
}

.pin-wrap {
  position: sticky;
  top: 72px;
  height: calc(100vh - 72px);
  display: grid;
  place-items: center;
  perspective: 1800px;
  transform-style: preserve-3d;
  pointer-events: none;
}

.section {
  display: block;
  width: min(960px, calc(100vw - 132px));
  position: relative;
  aspect-ratio: 16 / 10;
  min-height: auto;
  margin: 0 auto;
  border-radius: 18px;
  overflow: hidden;
  transform-style: preserve-3d;
  will-change: transform, opacity, box-shadow;
  pointer-events: auto;
  cursor: pointer;

  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(18px);
  -webkit-backdrop-filter: blur(18px);
  border: 1px solid rgba(255, 255, 255, 0.15);
  box-shadow:
    inset 0 2px 4px rgba(255, 255, 255, 0.15),
    0 8px 24px rgba(0, 0, 0, 0.4),
    0 20px 40px rgba(0, 0, 0, 0.6),
    0 0 25px rgba(170, 140, 255, 0.1);
}

.section.is-expanded {
  cursor: default;
  aspect-ratio: auto;
  min-height: min(520px, 72vh);
}

.section::after {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: inherit;
  border: 1px solid rgba(255, 255, 255, 0.18);
  pointer-events: none;
  z-index: 4;
}

.global-bg,
.bg {
  position: absolute;
  inset: 0;
  background-size: cover;
  background-position: center;
}

.global-bg {
  opacity: 0.22;
  filter: blur(1px);
}

.overlay {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(circle at 18% 20%, rgba(255, 255, 255, 0.18), transparent 44%),
    linear-gradient(180deg, rgba(6, 8, 15, 0.08), rgba(6, 8, 15, 0.88));
  z-index: 0;
}

.content {
  position: absolute;
  left: 8%;
  right: 8%;
  bottom: 12%;
  z-index: 2;
  color: #ffffff;
  pointer-events: none;
}

.content--compact {
  bottom: auto;
  top: 10%;
  max-width: 90%;
}

.content--compact .desc {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.content--compact h2 {
  font-size: clamp(22px, 3.5vw, 40px);
}

.tag {
  margin: 0;
  font-size: 13px;
  letter-spacing: 2px;
  color: rgba(255, 255, 255, 0.74);
}

h2 {
  margin: 8px 0 10px;
  font-size: clamp(30px, 4.5vw, 56px);
  letter-spacing: 1px;
}

.desc {
  margin: 0;
  max-width: 680px;
  font-size: clamp(15px, 1.5vw, 20px);
  line-height: 1.6;
}

.jump {
  margin-top: 20px;
  display: inline-block;
  padding: 8px 14px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.18);
  font-size: 14px;
}

.jump.muted {
  background: rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.75);
}

.sub-grid {
  position: relative;
  z-index: 3;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  padding: 32% 6% 8%;
  min-height: 260px;
  box-sizing: border-box;
}

.sub-tile {
  position: relative;
  display: block;
  border-radius: 14px;
  overflow: hidden;
  min-height: 120px;
  text-decoration: none;
  color: #fff;
  border: 1px solid rgba(255, 255, 255, 0.14);
  background: rgba(0, 0, 0, 0.35);
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.35);
  transition:
    transform 0.25s ease,
    border-color 0.25s ease,
    box-shadow 0.25s ease;
  cursor: pointer;
}

.sub-tile:hover {
  transform: translateY(-2px) scale(1.01);
  border-color: rgba(255, 255, 255, 0.32);
  box-shadow: 0 18px 44px rgba(0, 0, 0, 0.45), 0 0 22px rgba(170, 140, 255, 0.18);
}

.sub-tile.is-current {
  border-color: rgba(134, 239, 172, 0.45);
  box-shadow: 0 12px 36px rgba(0, 0, 0, 0.4), 0 0 20px rgba(134, 239, 172, 0.2);
}

.sub-tile-bg {
  position: absolute;
  inset: -6%;
  background-size: cover;
  background-position: center;
  transform: scale(1.05);
  transition: transform 0.4s ease;
}

.sub-tile:hover .sub-tile-bg {
  transform: scale(1.1);
}

.sub-tile-shade {
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, rgba(6, 8, 15, 0.15), rgba(6, 8, 15, 0.82));
}

.sub-tile-copy {
  position: absolute;
  left: 12px;
  right: 12px;
  bottom: 12px;
  z-index: 1;
}

.sub-tag {
  margin: 0;
  font-size: 11px;
  letter-spacing: 1.5px;
  color: rgba(255, 255, 255, 0.72);
}

.sub-tile-copy h3 {
  margin: 4px 0 0;
  font-size: clamp(14px, 2vw, 17px);
  line-height: 1.25;
  font-weight: 600;
}

.collapse-btn {
  position: absolute;
  top: 14px;
  right: 14px;
  z-index: 6;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 1px solid rgba(255, 255, 255, 0.35);
  background: rgba(0, 0, 0, 0.45);
  color: #fff;
  font-size: 22px;
  line-height: 1;
  cursor: pointer;
  display: grid;
  place-items: center;
  backdrop-filter: blur(10px);
  transition: background 0.2s ease, transform 0.2s ease;
}

.collapse-btn:hover {
  background: rgba(255, 255, 255, 0.14);
  transform: scale(1.05);
}

.sub-fade-enter-active,
.sub-fade-leave-active {
  transition: opacity 0.35s ease, transform 0.35s ease;
}

.sub-fade-enter-from,
.sub-fade-leave-to {
  opacity: 0;
  transform: translateY(12px);
}

@media (max-width: 768px) {
  .spiral-section {
    height: 138vh;
    margin: 0 0 3vh;
  }

  .spiral-section:last-child {
    height: 105vh;
    margin-bottom: 0;
  }

  .pin-wrap {
    top: 64px;
    height: calc(100vh - 64px);
    perspective: 1400px;
  }

  .section {
    width: min(90vw, 560px);
    aspect-ratio: 16 / 10;
    min-height: auto;
    border-radius: 16px;
  }

  .section.is-expanded {
    min-height: 0;
  }

  .content {
    left: 6%;
    right: 6%;
    bottom: 10%;
  }

  .sub-grid {
    padding: 38% 5% 10%;
    gap: 8px;
    min-height: 220px;
  }

  .sub-tile {
    min-height: 100px;
    border-radius: 12px;
  }
}
</style>
