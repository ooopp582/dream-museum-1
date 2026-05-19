<template>
  <section ref="sectionRef" class="spiral-section">
    <div ref="pinRef" class="pin-wrap">
      <div ref="pinStageRef" class="pin-stage">
        <Transition name="orbit-fade">
          <div
            v-if="expanded"
            class="orbit-dim"
            role="presentation"
            @click="emit('collapse')"
          ></div>
        </Transition>

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
            <span v-else class="jump hint muted">单击周围浮窗进入画作介绍</span>
          </div>

          <button
            v-if="expanded"
            type="button"
            class="collapse-btn"
            aria-label="收起"
            @click.stop="emit('collapse')"
          >
            ×
          </button>
        </div>

        <Transition name="orbit-fade">
          <div v-if="expanded" class="orbit-front">
            <svg
              v-if="svgBox.w > 0"
              class="orbit-lines"
              :viewBox="`0 0 ${svgBox.w} ${svgBox.h}`"
              width="100%"
              height="100%"
              preserveAspectRatio="none"
            >
              <line
                v-for="(seg, i) in lineSegments"
                :key="i"
                :x1="seg.x1"
                :y1="seg.y1"
                :x2="seg.x2"
                :y2="seg.y2"
                class="orbit-line"
              />
            </svg>

            <div class="orbit-tiles">
              <router-link
                v-for="tile in tiles"
                :key="tile.id"
                :ref="(el) => setTileRef(el, tile.id)"
                :to="`/art/${tile.id}`"
                class="sub-tile-float"
                :class="{ 'is-current': tile.id === item.id }"
                :style="getTileStyle(tile.id)"
              >
                <div class="sub-tile-bg" :style="{ backgroundImage: `url(${tile.background})` }"></div>
                <div class="sub-tile-shade"></div>
                <div class="sub-tile-copy">
                  <p class="sub-tag">{{ tile.subtitle }}</p>
                  <h3>{{ tile.title }}</h3>
                </div>
              </router-link>
            </div>
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
const pinStageRef = ref(null)
const cardRef = ref(null)
const bgRef = ref(null)
const contentRef = ref(null)

const svgBox = ref({ w: 0, h: 0 })
const lineSegments = ref([])
const tileLayout = ref({})

const tileRefMap = {}
const resolveDomEl = (el) => {
  if (!el) return null
  if (el instanceof HTMLElement) return el
  const root = el.$el
  if (root instanceof HTMLElement) return root
  return null
}

const setTileRef = (el, id) => {
  const node = resolveDomEl(el)
  if (node) tileRefMap[id] = node
  else delete tileRefMap[id]
}

/** 环绕起始角（略偏左上），四块均匀分布 */
const ORBIT_START = -Math.PI / 2 - 0.42

const estimateTileSize = (stageWidth) => {
  const w = Math.min(220, stageWidth * 0.19)
  return { w, h: 112 }
}

const getTileStyle = (id) => {
  const pos = tileLayout.value[id]
  if (!pos) {
    return { opacity: 0, pointerEvents: 'none' }
  }
  return {
    left: `${pos.left}px`,
    top: `${pos.top}px`,
    opacity: 1,
    pointerEvents: 'auto',
    '--orbit-tilt': `${pos.tilt}deg`
  }
}

const getCardEdgePoint = (cx, cy, hw, hh, tx, ty) => {
  const dx = tx - cx
  const dy = ty - cy
  const denom = Math.max(Math.abs(dx) / hw, Math.abs(dy) / hh, 0.001)
  const scale = 0.96 / denom
  return { x: cx + dx * scale, y: cy + dy * scale }
}

let transformTween = null
let depthTween = null
let introTween = null
let parallaxTween = null
let glowTween = null
let tickerFn = null

const updateOrbitLayout = () => {
  if (!props.expanded || !pinStageRef.value || !cardRef.value) return

  try {
    const stage = pinStageRef.value.getBoundingClientRect()
    const card = cardRef.value.getBoundingClientRect()
    const count = props.tiles.length
    if (!count || stage.width < 1 || stage.height < 1 || card.width < 1) return

    svgBox.value = { w: stage.width, h: stage.height }

    const cx = card.left + card.width / 2 - stage.left
    const cy = card.top + card.height / 2 - stage.top
    const hw = card.width / 2
    const hh = card.height / 2

    const sampleEl = resolveDomEl(tileRefMap[props.tiles[0]?.id])
    const sampleRect = sampleEl?.getBoundingClientRect()
    const fallback = estimateTileSize(stage.width)
    const tileW = sampleRect?.width > 0 ? sampleRect.width : fallback.w
    const tileH = sampleRect?.height > 0 ? sampleRect.height : fallback.h
    const gap = Math.max(18, Math.min(stage.width, stage.height) * 0.028)
    const radiusX = hw + tileW / 2 + gap
    const radiusY = hh + tileH / 2 + gap
    const pad = 10

    const layouts = {}
    const lines = []

    props.tiles.forEach((tile, index) => {
      const angle = ORBIT_START + (index * 2 * Math.PI) / count
      let left = cx + Math.cos(angle) * radiusX - tileW / 2
      let top = cy + Math.sin(angle) * radiusY - tileH / 2

      const maxLeft = Math.max(pad, stage.width - tileW - pad)
      const maxTop = Math.max(pad, stage.height - tileH - pad)
      left = Math.min(maxLeft, Math.max(pad, left))
      top = Math.min(maxTop, Math.max(pad, top))

      const tileEl = resolveDomEl(tileRefMap[tile.id])
      const tileRect = tileEl?.getBoundingClientRect()
      const tx = tileRect?.width
        ? tileRect.left + tileRect.width / 2 - stage.left
        : left + tileW / 2
      const ty = tileRect?.height
        ? tileRect.top + tileRect.height / 2 - stage.top
        : top + tileH / 2
      const edge = getCardEdgePoint(cx, cy, hw, hh, tx, ty)
      const tilt = (angle * 180) / Math.PI + 90

      layouts[tile.id] = { left, top, tilt }
      lines.push({ x1: edge.x, y1: edge.y, x2: tx, y2: ty })
    })

    tileLayout.value = layouts
    lineSegments.value = lines
  } catch {
    /* 避免 ticker 因单次测量失败而中断 */
  }
}

const scheduleLayout = () => {
  nextTick(() => {
    updateOrbitLayout()
    requestAnimationFrame(() => {
      updateOrbitLayout()
      ScrollTrigger.refresh()
    })
  })
}

const startLineLoop = () => {
  stopLineLoop()
  tickerFn = () => {
    updateOrbitLayout()
  }
  gsap.ticker.add(tickerFn)
  scheduleLayout()
}

const stopLineLoop = () => {
  if (tickerFn) {
    gsap.ticker.remove(tickerFn)
    tickerFn = null
  }
  lineSegments.value = []
  tileLayout.value = {}
  svgBox.value = { w: 0, h: 0 }
}

const onResize = () => {
  if (props.expanded) updateOrbitLayout()
}

watch(
  () => props.expanded,
  (open) => {
    if (open) {
      startLineLoop()
      window.addEventListener('resize', onResize)
    } else {
      window.removeEventListener('resize', onResize)
      stopLineLoop()
      ScrollTrigger.refresh()
    }
  },
  { flush: 'post' }
)

const onSectionClick = (event) => {
  if (props.expanded) return
  if (event.target.closest('.orbit-tiles')) return
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

  if (props.expanded) {
    startLineLoop()
    window.addEventListener('resize', onResize)
  }
})

onUnmounted(() => {
  window.removeEventListener('resize', onResize)
  stopLineLoop()
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

.pin-stage {
  position: relative;
  width: 100%;
  height: 100%;
  display: grid;
  place-items: center;
  pointer-events: none;
  overflow: visible;
}

.orbit-dim {
  position: absolute;
  inset: 0;
  z-index: 1;
  background: radial-gradient(ellipse at 50% 45%, rgba(6, 8, 15, 0.2), rgba(6, 8, 15, 0.55));
  pointer-events: auto;
  cursor: default;
}

.orbit-front {
  position: absolute;
  inset: 0;
  z-index: 3;
  pointer-events: none;
  overflow: visible;
}

.orbit-lines {
  position: absolute;
  inset: 0;
  overflow: visible;
  pointer-events: none;
}

.orbit-line {
  stroke: rgba(255, 255, 255, 0.42);
  stroke-width: 1.25;
  stroke-dasharray: 7 6;
  vector-effect: non-scaling-stroke;
  filter: drop-shadow(0 0 4px rgba(170, 140, 255, 0.35));
}

.orbit-tiles {
  position: absolute;
  inset: 0;
  pointer-events: none;
  overflow: visible;
}

.section {
  position: relative;
  z-index: 2;
  display: block;
  width: min(960px, calc(100vw - 132px));
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

.sub-tile-float {
  position: absolute;
  width: min(220px, 19vw);
  min-height: 112px;
  border-radius: 14px;
  overflow: hidden;
  text-decoration: none;
  color: #fff;
  border: 1px dashed rgba(255, 255, 255, 0.38);
  background: rgba(8, 10, 18, 0.45);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  box-shadow:
    0 16px 40px rgba(0, 0, 0, 0.45),
    0 0 1px rgba(255, 255, 255, 0.12) inset;
  pointer-events: auto;
  cursor: pointer;
  transform: rotate(var(--orbit-tilt, 0deg));
  transition:
    border-color 0.28s ease,
    box-shadow 0.28s ease,
    filter 0.28s ease;
  will-change: left, top;
}

.sub-tile-float:hover {
  border-color: rgba(255, 255, 255, 0.55);
  filter: brightness(1.06);
  box-shadow:
    0 22px 50px rgba(0, 0, 0, 0.5),
    0 0 26px rgba(170, 140, 255, 0.22);
}

.sub-tile-float.is-current {
  border-color: rgba(134, 239, 172, 0.55);
  box-shadow:
    0 16px 44px rgba(0, 0, 0, 0.48),
    0 0 22px rgba(134, 239, 172, 0.25);
}

.sub-tile-bg {
  position: absolute;
  inset: -6%;
  background-size: cover;
  background-position: center;
  transform: scale(1.05);
  transition: transform 0.4s ease;
}

.sub-tile-float:hover .sub-tile-bg {
  transform: scale(1.1);
}

.sub-tile-shade {
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, rgba(6, 8, 15, 0.12), rgba(6, 8, 15, 0.78));
}

.sub-tile-copy {
  position: absolute;
  left: 10px;
  right: 10px;
  bottom: 10px;
  z-index: 1;
}

.sub-tag {
  margin: 0;
  font-size: 10px;
  letter-spacing: 1.4px;
  color: rgba(255, 255, 255, 0.72);
}

.sub-tile-copy h3 {
  margin: 3px 0 0;
  font-size: clamp(12px, 1.65vw, 15px);
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
  border: 1px dashed rgba(255, 255, 255, 0.45);
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

.orbit-fade-enter-active,
.orbit-fade-leave-active {
  transition: opacity 0.38s ease;
}

.orbit-fade-enter-active .sub-tile-float,
.orbit-fade-leave-active .sub-tile-float {
  transition: transform 0.38s ease, opacity 0.38s ease;
}

.orbit-fade-enter-from,
.orbit-fade-leave-to {
  opacity: 0;
}

.orbit-fade-enter-active .sub-tile-float,
.orbit-fade-leave-active .sub-tile-float {
  transition: opacity 0.38s ease, filter 0.38s ease;
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
    border-radius: 16px;
  }

  .content {
    left: 6%;
    right: 6%;
    bottom: 10%;
  }

  .sub-tile-float {
    width: min(148px, 34vw);
    min-height: 88px;
    border-radius: 12px;
  }
}
</style>
