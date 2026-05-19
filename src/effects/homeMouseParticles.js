/**
 * 首页鼠标拖尾粒子（逻辑同根目录 mouse_particle.js），挂载到 body，离开首页时卸载。
 */
export function mountHomeMouseParticles() {
  const particleCanvas = document.createElement('canvas')
  particleCanvas.setAttribute('aria-hidden', 'true')
  particleCanvas.className = 'home-mouse-particles-canvas'
  particleCanvas.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    z-index: 9998;
    pointer-events: none;
  `
  document.body.appendChild(particleCanvas)

  const pCtx = particleCanvas.getContext('2d')
  let w = (particleCanvas.width = window.innerWidth)
  let h = (particleCanvas.height = window.innerHeight)

  const onResize = () => {
    w = particleCanvas.width = window.innerWidth
    h = particleCanvas.height = window.innerHeight
  }
  window.addEventListener('resize', onResize)

  const particles = []
  let lastX = 0
  let lastY = 0
  let lastTime = Date.now()
  const EMITTER_RADIUS = 40

  const onMouseMove = (e) => {
    const x = e.clientX
    const y = e.clientY
    const now = Date.now()
    const dt = now - lastTime || 1

    const dx = x - lastX
    const dy = y - lastY
    const dist = Math.sqrt(dx * dx + dy * dy)
    const speed = dist / dt

    const speedFactor = speed * 15
    let count = Math.floor(speedFactor)
    count = Math.max(0, Math.min(count, 6))

    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2
      const d = Math.random() * EMITTER_RADIUS
      const sx = x + Math.cos(angle) * d
      const sy = y + Math.sin(angle) * d

      particles.push({
        x: sx,
        y: sy,
        size: Math.random() * 6 + 1,
        vx: (Math.random() - 0.5) * 1.5,
        vy: (Math.random() - 0.5) * 1.5,
        life: 50 + Math.random() * 30,
        color: `hsla(${200 + Math.random() * 60}, 80%, 60%, 0.6)`,
      })
    }

    lastX = x
    lastY = y
    lastTime = now
  }

  document.addEventListener('mousemove', onMouseMove, { passive: true })

  let rafId = 0
  function animate() {
    rafId = requestAnimationFrame(animate)
    pCtx.clearRect(0, 0, w, h)

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i]
      p.x += p.vx
      p.y += p.vy
      p.life--
      p.size *= 0.97

      if (p.life > 0) {
        pCtx.beginPath()
        pCtx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        pCtx.fillStyle = p.color
        pCtx.fill()
      } else {
        particles.splice(i, 1)
        i--
      }
    }
  }
  animate()

  let destroyed = false
  return () => {
    if (destroyed) return
    destroyed = true
    cancelAnimationFrame(rafId)
    window.removeEventListener('resize', onResize)
    document.removeEventListener('mousemove', onMouseMove)
    particleCanvas.remove()
  }
}
