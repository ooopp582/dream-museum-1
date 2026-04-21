<template>
  <section ref="sectionRef" class="spiral-section">
    <div ref="pinRef" class="pin-wrap">
      <router-link ref="cardRef" :to="detailTo" class="section">
        <div class="global-bg" :style="{ backgroundImage: `url(${globalBackground})` }"></div>
        <div ref="bgRef" class="bg" :style="{ background: bg }"></div>
        <div class="overlay"></div>

        <div ref="contentRef" class="content">
          <p class="tag">{{ tag }}</p>
          <h2>{{ title }}</h2>
          <p class="desc">{{ desc }}</p>
          <span class="jump">进入展厅</span>
        </div>
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

onMounted(() => {
  if (!sectionRef.value || !cardRef.value || !contentRef.value || !bgRef.value || !pinRef.value) {
    return
  }

  const direction = props.index % 2 === 0 ? 1 : -1
  const xShift = 180 + props.index * 36
  const yShift = -150 - props.index * 32
  const zDepth = -420 - props.index * 70
  const zRotate = 20 + props.index * 4
  const yRotate = 34 + props.index * 5

  introTween = gsap.fromTo(
    contentRef.value,
    { autoAlpha: 0, y: 48, filter: 'blur(10px)' },
    {
      autoAlpha: 1,
      y: 0,
      filter: 'blur(0px)',
      duration: 0.9,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: sectionRef.value,
        start: 'top 72%'
      }
    }
  )

  depthTween = gsap.to(pinRef.value, {
    z: 170,
    ease: 'none',
    scrollTrigger: {
      trigger: sectionRef.value,
      start: 'top bottom',
      end: 'top 35%',
      scrub: true
    }
  })

  parallaxTween = gsap.to(bgRef.value, {
    scale: 1.22,
    yPercent: -8,
    ease: 'none',
    scrollTrigger: {
      trigger: sectionRef.value,
      start: 'top bottom',
      end: 'bottom top',
      scrub: true
    }
  })

  transformTween = gsap.to(cardRef.value, {
    scale: 0.58,
    x: direction * xShift,
    y: yShift,
    z: zDepth,
    rotateZ: direction * zRotate,
    rotateY: direction * yRotate,
    rotateX: -12,
    transformOrigin: 'center center',
    ease: 'none',
    scrollTrigger: {
      trigger: sectionRef.value,
      start: 'top top',
      end: 'bottom top',
      scrub: true,
      invalidateOnRefresh: true
    }
  })

})

onUnmounted(() => {
  for (const tween of [transformTween, depthTween, introTween, parallaxTween]) {
    if (tween?.scrollTrigger) tween.scrollTrigger.kill()
    if (tween) tween.kill()
  }
})
</script>

<style scoped>
.spiral-section {
  position: relative;
  height: 165vh;
  margin: 5vh 0 10vh;
}

.spiral-section:last-child {
  height: 102vh;
  margin-bottom: 0;
}

.pin-wrap {
  position: sticky;
  top: 72px;
  height: calc(100vh - 72px);
  display: grid;
  place-items: center;
  perspective: 2200px;
  transform-style: preserve-3d;
}

.section {
  display: block;
  width: min(780px, calc(100vw - 240px));
  position: relative;
  aspect-ratio: 16 / 10;
  min-height: auto;
  margin: 0 auto;
  border-radius: 22px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.16);
  box-shadow: 0 24px 52px rgba(0, 0, 0, 0.42);
  transform-style: preserve-3d;
  will-change: transform;
}

.global-bg,
.bg {
  position: absolute;
  inset: 0;
  background-size: cover;
  background-position: center;
}

.global-bg {
  opacity: 0.26;
  filter: blur(1px);
}

.overlay {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(circle at 18% 20%, rgba(255, 255, 255, 0.18), transparent 44%),
    linear-gradient(180deg, rgba(6, 8, 15, 0.1), rgba(6, 8, 15, 0.86));
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
    height: 150vh;
    margin: 3vh 0 7vh;
  }

  .spiral-section:last-child {
    height: 96vh;
    margin-bottom: 0;
  }

  .pin-wrap {
    top: 64px;
    height: calc(100vh - 64px);
  }

  .section {
    width: min(80vw, 480px);
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
