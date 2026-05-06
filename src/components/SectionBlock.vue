<template>
  <section ref="sectionRef" class="spiral-section">
    <div ref="pinRef" class="pin-wrap">
      <router-link v-slot="{ href, navigate }" :to="detailTo" custom>
        <a ref="cardRef" :href="href" class="section" @click="navigate">
          <div class="global-bg" :style="{ backgroundImage: `url(${globalBackground})` }"></div>
          <div ref="bgRef" class="bg" :style="{ background: bg }"></div>
          <div class="overlay"></div>

          <div ref="contentRef" class="content">
            <p class="tag">{{ tag }}</p>
            <h2>{{ title }}</h2>
            <p class="desc">{{ desc }}</p>
            <span class="jump">进入展厅</span>
          </div>
        </a>
      </router-link>
    </div>
  </section>
</template>

<script setup>
import { onMounted, onUnmounted, ref } from 'vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const props = defineProps({
  title: String,
  desc: String,
  bg: String,
  tag: String,
  detailTo: String,
  index: Number,
  globalBackground: {
    type: String,
    default: '/src/assets/background.jpg'
  }
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
    { boxShadow: '0 14px 34px rgba(0, 0, 0, 0.34)' },
    {
      boxShadow: '0 38px 88px rgba(0, 0, 0, 0.56)',
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
  border: 1px solid rgba(255, 255, 255, 0.16);
  transform-style: preserve-3d;
  will-change: transform, opacity, box-shadow;
  pointer-events: auto;
}

.section::after {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: inherit;
  border: 1px solid rgba(255, 255, 255, 0.18);
  pointer-events: none;
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
}

.content {
  position: absolute;
  left: 8%;
  right: 8%;
  bottom: 12%;
  z-index: 1;
  color: #ffffff;
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

  .content {
    left: 6%;
    right: 6%;
    bottom: 10%;
  }
}
</style>
