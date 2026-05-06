import { onMounted, onUnmounted, ref } from 'vue'

export function useScrollBackgroundMotion(variableName = '--bg-position-y', easing = 0.045) {
  const style = ref({ [variableName]: '0%' })
  let frameId = null
  let currentProgress = 0

  const animate = () => {
    const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight)
    const targetProgress = Math.min(1, Math.max(0, window.scrollY / maxScroll))

    currentProgress += (targetProgress - currentProgress) * easing
    style.value = { [variableName]: `${(currentProgress * 100).toFixed(2)}%` }
    frameId = requestAnimationFrame(animate)
  }

  onMounted(() => {
    animate()
  })

  onUnmounted(() => {
    if (frameId) cancelAnimationFrame(frameId)
  })

  return style
}
